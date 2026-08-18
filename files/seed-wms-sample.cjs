// ============================================================
//  seed-wms-sample.cjs — ใส่ข้อมูลตัวอย่างระบบคลังผ้า (WMS) สำหรับทดลองใช้
//  รัน:  node seed-wms-sample.cjs
//  ล้างตัวอย่าง:  node seed-wms-sample.cjs --clear
//  (ใช้ผ้าจริงในระบบ + ช่องที่ seed ไว้ ผ่าน API จริง -> ได้ rolls/txns ครบ)
// ============================================================
const mysql = require('mysql2/promise');
const crypto = require('crypto');
const http = require('http');

function req(method, path, token, body) {
  return new Promise((resolve, reject) => {
    const data = body ? Buffer.from(JSON.stringify(body), 'utf8') : null;
    const r = http.request({ host: 'localhost', port: 3000, path, method, headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json; charset=utf-8', ...(data ? { 'Content-Length': data.length } : {}) } },
      (res) => { let d = ''; res.on('data', c => d += c); res.on('end', () => { try { resolve({ status: res.statusCode, body: JSON.parse(d || '{}') }); } catch (e) { resolve({ status: res.statusCode, body: {} }); } }); });
    r.on('error', reject); if (data) r.write(data); r.end();
  });
}

(async () => {
  const pool = mysql.createPool({ host: 'localhost', port: 3306, user: 'root', password: '', database: 'kins_erp', charset: 'utf8mb4' });

  if (process.argv.includes('--clear')) {
    await pool.query('DELETE FROM stock_transactions');
    await pool.query('DELETE FROM fabric_rolls');
    await pool.query('DELETE FROM goods_receipt_items');
    await pool.query('DELETE FROM goods_receipts');
    await pool.query('ALTER TABLE fabric_rolls AUTO_INCREMENT=1');
    await pool.query('ALTER TABLE goods_receipts AUTO_INCREMENT=1');
    console.log('✅ ล้างข้อมูลตัวอย่าง WMS แล้ว (rolls/receipts/transactions) — ผ้า/สี/ช่อง คงไว้');
    await pool.end();
    return;
  }

  const token = crypto.randomBytes(24).toString('hex');
  await pool.query('INSERT INTO sessions (token, user_id) VALUES (?, ?)', [token, 1]);

  // เลือกผ้าจริง 4 รายการ + ใส่เฉดสีให้แต่ละผ้า
  const [fabrics] = await pool.query('SELECT id, sku, name FROM fabrics ORDER BY id ASC LIMIT 4');
  if (fabrics.length < 2) { console.error('ต้องมีผ้าในตาราง fabrics อย่างน้อย 2 รายการ'); await pool.end(); return; }
  const shadeSets = [['ดำ', 'ขาว', 'กรมท่า'], ['แดง', 'เทา'], ['น้ำเงิน', 'เขียว', 'เบจ'], ['ครีม', 'น้ำตาล']];
  const colorMap = {};
  for (let i = 0; i < fabrics.length; i++) {
    const f = fabrics[i];
    await req('PUT', `/api/fabrics/${f.id}/shades`, token, { shades: shadeSets[i % shadeSets.length].map(n => ({ name: n })) });
    const sh = await req('GET', `/api/fabrics/${f.id}/shades`, token);
    colorMap[f.id] = sh.body.shades;
  }

  // ช่องจัดเก็บที่มีอยู่ (seed 24 ช่อง)
  const locs = (await req('GET', '/api/warehouse-locations', token)).body.locations;
  const L = (code) => locs.find(l => l.location_code === code) || locs[0];

  const f0 = fabrics[0], f1 = fabrics[1], f2 = fabrics[2] || fabrics[0], f3 = fabrics[3] || fabrics[1];
  const c = (f, idx) => (colorMap[f.id][idx] ? colorMap[f.id][idx].id : null);

  // เอกสารรับที่ 1
  const g1 = await req('POST', '/api/goods-receipts', token, {
    receipt_date: '2026-08-12', receipt_type: 'ซื้อ', po_no: 'PO-2608-001', bill_no: 'INV-9001', warehouse: 'คลังหลัก', supplier_name: 'โรงทอไทยเท็กซ์',
    items: [
      { product_id: f0.id, color_id: c(f0, 0), lot_no: 'L2608A', roll_count: 4, yards_per_roll: 250, location_id: L('A-01-01').location_id },
      { product_id: f0.id, color_id: c(f0, 1), lot_no: 'L2608A', roll_count: 3, yards_per_roll: 180, location_id: L('A-01-01').location_id },
      { product_id: f1.id, color_id: c(f1, 0), lot_no: 'L2608B', roll_count: 5, yards_per_roll: 120, location_id: L('A-01-02').location_id },
    ],
  });
  // เอกสารรับที่ 2
  const g2 = await req('POST', '/api/goods-receipts', token, {
    receipt_date: '2026-08-14', receipt_type: 'ผลิตเสร็จ', po_no: 'PO-2608-004', bill_no: 'INV-9014', warehouse: 'คลังหลัก', supplier_name: 'โรงย้อมรุ่งเรือง',
    items: [
      { product_id: f2.id, color_id: c(f2, 0), lot_no: 'L2608C', roll_count: 3, yards_per_roll: 90, location_id: L('B-01-01').location_id },
      { product_id: f3.id, color_id: c(f3, 0), lot_no: 'L2608D', roll_count: 2, yards_per_roll: 35, location_id: L('B-01-02').location_id }, // ใกล้หมด
    ],
  });

  const allRolls = [...(g1.body.rolls || []), ...(g2.body.rolls || [])];
  console.log('สร้างม้วนผ้าตัวอย่าง:', allRolls.length, 'ม้วน จาก 2 เอกสารรับ');

  // ตัดหลาบางม้วนให้มีประวัติ + ทำให้บางม้วนใกล้หมด
  const cutPlan = [
    { qr: g1.body.rolls[0].roll_qr_code, yards: 210 }, // 250 -> 40 (ใกล้หมด)
    { qr: g1.body.rolls[4].roll_qr_code, yards: 80 },  // 120 -> 40 (ใกล้หมด)
    { qr: g2.body.rolls[0].roll_qr_code, yards: 30 },  // 90 -> 60
  ];
  for (const p of cutPlan) {
    if (p.qr) await req('POST', '/api/fabric-rolls/cut', token, { roll_qr: p.qr, yards: p.yards, ref_no: 'OR2608-001' });
  }

  const low = await req('GET', '/api/low-stock?threshold=50', token);
  const hist = await req('GET', '/api/stock-transactions', token);
  console.log('ผ้าใกล้หมด (<50 หลา):', low.body.total, 'ม้วน');
  console.log('รายการเคลื่อนไหวทั้งหมด:', hist.body.total, 'รายการ');

  await pool.query('DELETE FROM sessions WHERE token = ?', [token]);
  await pool.end();
  console.log('\n✅ ใส่ข้อมูลตัวอย่างเสร็จ — เปิดหน้า "โซน & แร็ค", "ประวัติเคลื่อนไหว" และแดชบอร์ดเพื่อดูผล');
  console.log('   (ล้างข้อมูลตัวอย่าง: node seed-wms-sample.cjs --clear)');
})().catch(e => { console.error('ERR', e); process.exit(1); });
