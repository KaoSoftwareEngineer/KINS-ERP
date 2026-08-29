// ============================================================
//  seed-report-sample.cjs — ใส่ข้อมูลตัวอย่างตามภาพหน้ารายงาน 7 หน้า
//  รันด้วย: node seed-report-sample.cjs   (idempotent: ลบตาม key แล้วใส่ใหม่)
// ============================================================
require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'plum_erp', charset: 'utf8mb4',
  });
  const q = (sql, p) => pool.query(sql, p);
  const J = (o) => JSON.stringify(o);

  // ---------- 1) ออร์เดอร์ ----------
  const invItem = (qty, wd) => ([{ sku: 'Regatta', color_code: '44006 : Silky - Misty Blue', width: '44"', available_qty: '1998', ordered_qty: qty, withdrawn_qty: wd, unit: 'หลา', pack: 'ตัดเป็นไม้แบน', cust_code: '', substitute: 0, substitute_text: '' }]);
  const orders = [
    ['OR2608-012', '2026-08-27', 'บารอน', '120 Days', 'ปั๊ม', 60, 'Completed'],
    ['OR2608-011', '2026-08-27', 'บารอน', '120 Days', 'ปั๊ม', 60, 'Waiting to prepare'],
    ['OR2608-010', '2026-08-27', 'บารอน', '120 Days', 'ปั๊ม', 60, 'Completed'],
    ['OR2608-009', '2026-08-27', 'BKK', 'Cash', 'ปั๊ม', 40, 'Waiting to invoice'],
    ['OR2608-008', '2026-08-20', 'BKK', 'Cash', 'ปั๊ม', 120, 'Completed'],
    ['OR2608-007', '2026-08-20', 'BTC', '120 Days', '', 60, 'Waiting to prepare'],
    ['OR2608-006', '2026-08-15', 'คุณ ทันประภา รังษี', 'Cash', 'ปั๊ม', 30, 'Completed'],
    ['OR2608-005', '2026-08-14', 'Alex fashion', 'Cash', 'ปั๊ม', 50, 'Completed'],
    ['OR2608-004', '2026-08-10', 'คิงห์ แฟชั่น', '30 Days', 'ปั๊ม', 112, 'Completed'],
    ['OR2608-003', '2026-08-10', 'คิงห์ แฟชั่น', '30 Days', 'ปั๊ม', 30, 'Completed'],
  ];
  for (const [no, date, cust, term, sp, qty, status] of orders) {
    await q('DELETE FROM orders WHERE order_no = ?', [no]); // cascade ลบ order_items เอง
    const wd = status === 'Completed' ? qty : 0;
    const [r] = await q(
      "INSERT INTO orders (order_no,`date`,customer,salesperson,payment_term,note,urgent,ordered_qty,withdrawn_qty,status,invoiced,vat_done) VALUES (?,?,?,?,?,'',0,?,?,?,?,0)",
      [no, date, cust, sp, term, qty, wd, status, status === 'Waiting to invoice' || status === 'Completed' ? 1 : 0]
    );
    const it = invItem(qty, wd)[0];
    await q('INSERT INTO order_items (order_id,sku,color_code,width,available_qty,ordered_qty,withdrawn_qty,unit,pack,cust_code,substitute,substitute_text) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
      [r.insertId, it.sku, it.color_code, it.width, it.available_qty, it.ordered_qty, it.withdrawn_qty, it.unit, it.pack, it.cust_code, it.substitute, it.substitute_text]);
  }
  console.log('✓ ออร์เดอร์', orders.length, 'รายการ');

  // ---------- 2) ใบสั่งย้อม + รับผ้าย้อมกลับ ----------
  const dyes = [
    ['TM2603-003', '2026-03-21', 'โรงย้อม', '', '', 'Canceled', {}, [{ shade: '', qty: 200, unit_price: 0, total: 0 }], {}],
    ['TM2603-002', '2026-03-20', 'ตั้งหวังเจ๋ง จำกัด มหาชน', '', '', 'Pending', {}, [], {}],
    ['TM2603-001', '2026-03-16', 'โรงย้อม', '122312', '2026-03-31', '',
      { sku: 'Regatta', name: 'Regatta', width: '44"' },
      [{ shade: '44033 : Fish Bone - Pink', qty: 1200, unit_price: 0, total: 0 }],
      { code: '', name: '', width: '', source: '', shrinkage: null, allowance: null, lot: '', needed: null }],
  ];
  for (const [no, date, factory, ref, ship, status, product, items, raw] of dyes) {
    await q('DELETE FROM dye_orders WHERE dye_no = ?', [no]);
    await q(
      `INSERT INTO dye_orders (dye_no,dye_date,factory,ref_no,ship_date,approved,status,raw_json,product_json,items_json,sample_json,packing_json,stamping_json,remark,subtotal,discount,vat,net_total)
       VALUES (?,?,?,?,?,?,?,?,?,?,'{}','{}','{}','',0,0,0,0)`,
      [no, date, factory, ref, ship, status ? 0 : 1, status, J(raw), J(product), J(items)]
    );
  }
  // รับผ้าย้อมกลับของ TM2603-001 = 1080 หลา (สูญเสีย 120 = 10%)
  await q("DELETE FROM dyed_receipts WHERE order_ref = 'TM2603-001'");
  await q(
    `INSERT INTO dyed_receipts (in_no,receipt_date,order_ref,factory,warehouse,supplier,bill_no,remark,subtotal,discount,vat,net_total,items_json)
     VALUES ('IN2603-001','2026-03-31','TM2603-001','โรงย้อม','Warehouse','','','',0,0,0,0,?)`,
    [J([{ sku: 'Regatta', color: '44033 : Fish Bone - Pink', qty: 1080 }])]
  );
  console.log('✓ ใบสั่งย้อม', dyes.length, 'รายการ + รับผ้าย้อมกลับ 1');

  // ---------- 3) ใบสัญญาขาย ----------
  const contracts = [
    ['SC2608-001', '2026-08-15', 'GMC - MBK', '120 Days', null, 0, 1950000, [{ sku: '', color_code: '', description: '', qty: 30000, unit_price: 65, amount: 1950000, width: '', length: '', note: '' }]],
    ['SC2603-003', '2026-03-21', 'ลุงหนวด', 'Cash', null, 0, 102000, [{ sku: '', color_code: '', description: '', qty: 1000, unit_price: 102, amount: 102000, width: '', length: '', note: '' }]],
    ['SC2603-002', '2026-03-21', 'ลุงหนวด', 'Cash', '2026-03-22', 0, 10200, [{ sku: 'Avante', color_code: '18004 : Cotton Twill - Lemon', description: '- 18004 :Cotton Twill - Lemon', qty: 100, unit_price: 102, amount: 10200, width: '58', length: '', note: '' }]],
    ['SC2603-001', '2026-03-16', '2 Greatest', 'Cash', null, 0, 50000, [{ sku: '', color_code: '', description: '', qty: 1000, unit_price: 50, amount: 50000, width: '', length: '', note: '' }]],
  ];
  for (const [no, date, cust, term, ship, deposit, net, items] of contracts) {
    const [ex] = await q('SELECT sc_id FROM sales_contracts WHERE sc_no = ?', [no]);
    if (ex[0]) { await q('DELETE FROM sales_contract_items WHERE sc_id = ?', [ex[0].sc_id]); await q('DELETE FROM sales_contracts WHERE sc_id = ?', [ex[0].sc_id]); }
    const [r] = await q(
      `INSERT INTO sales_contracts (sc_no,contract_date,shipment_date,customer,address,payment_term,deposit,currency,structure,unit,note,subtotal,discount_type,discount_value,discount_amount,vat_type,vat_amount,net_total)
       VALUES (?,?,?,?,'',?,?, 'THB','','หลา','',?, 'None',0,0,'None',0,?)`,
      [no, date, ship, cust, term, deposit, net, net]
    );
    for (const it of items) {
      await q('INSERT INTO sales_contract_items (sc_id,sku,color_code,description,qty,unit_price,amount,width,length,note) VALUES (?,?,?,?,?,?,?,?,?,?)',
        [r.insertId, it.sku, it.color_code, it.description, it.qty, it.unit_price, it.amount, it.width, it.length, it.note]);
    }
  }
  console.log('✓ ใบสัญญาขาย', contracts.length, 'รายการ');

  // ---------- 4) อินวอยส์ขาย (ขายส่ง = ไม่ขึ้นต้น P / ขายปลีก = ขึ้นต้น P) ----------
  const itR = (qty, up, amt) => ([{ sku: 'Regatta', color: '44006 : Silky - Misty Blue', width: '44"', qty, unit_price: up, amount: amt, cust_code: '', barcode: '2608013127' }]);
  const itOV = ([{ sku: 'OV', color: '2 - LIGHT BLUE', width: '58', qty: 30, unit_price: 95, amount: 2850, cust_code: '', barcode: '2608012660' }]);
  const invoices = [
    ['26080005', '2026-08-27', 'บารอน', 'OR2608-012', '120 Days', 'ปั๊ม', '', '2026-12-25', 0, 0, 'ยกเลิก', []],
    ['26080004', '2026-08-27', 'บารอน', 'OR2608-010', '120 Days', 'ปั๊ม', '', '2026-12-25', 7704, 0, 'ยังไม่ชำระ', itR(60, 120, 7200)],
    ['26080003', '2026-08-22', 'BKK', 'OR2608-008', 'Cash', 'ปั๊ม', 'นาย Test', '2026-08-22', 6600, 5140, 'ชำระบางส่วน', itR(60, 110, 6600)],
    ['26080002', '2026-08-10', 'คิงห์ แฟชั่น', 'OR2608-004', '30 Days', 'ปั๊ม', 'Test', '2026-09-09', 6720, 6720, 'ชำระแล้ว', itR(60, 112, 6720)],
    ['26080001', '2026-08-10', 'คิงห์ แฟชั่น', 'OR2608-003', '30 Days', 'ปั๊ม', 'A', '2026-09-09', 2850, 2850, 'ชำระแล้ว', itOV],
    ['P26080001', '2026-08-05', 'ALA .Brand', 'OR2608-002', 'Cash', 'ปั๊ม', '', '2026-08-05', 1600, 0, 'ยังไม่ชำระ', []],
    ['P26070002', '2026-07-24', 'BTC', 'OR2606-005', '120 Days', '', '', '2026-11-21', 99999999.99, 0, 'ยังไม่ชำระ', [{ sku: 'Digital Print', color: '123037', width: '58', qty: 99999999.99, unit_price: 260, amount: 99999999.99, barcode: '2606007050' }]],
    ['P26070001', '2026-07-11', 'คิง เทเลอร์', 'OR2607-006', '120 Days', '', 'Boy', '2026-11-08', 1950.40, 0, 'ยังไม่ชำระ', []],
    ['26070002', '2026-07-10', 'AY CHANNANG', 'OR2607-005', 'Cash', '', '', '2026-07-10', 4725, 0, 'ยังไม่ชำระ', []],
    ['26070001', '2026-07-10', 'Deep', 'OR2607-004', '30 Days', '', '', '2026-08-09', 1425, 0, 'ยังไม่ชำระ', []],
  ];
  for (const [no, date, cust, oref, term, sp, shipper, due, total, paid, status, items] of invoices) {
    await q('DELETE FROM sale_invoices WHERE inv_no = ?', [no]);
    await q(
      `INSERT INTO sale_invoices (inv_no,inv_date,customer,order_ref,account_term,salesperson,bill_address,ship_address,shipper,remark,items_json,due_date,total_amount,paid_amount,pay_status)
       VALUES (?,?,?,?,?,?,'','',?,'',?,?,?,?,?)`,
      [no, date, cust, oref, term, sp, shipper, J(items), due, total, paid, status]
    );
  }
  console.log('✓ อินวอยส์ขาย', invoices.length, 'รายการ');

  // ---------- 5) รับคืนอินวอยส์ ----------
  const returns = [
    ['IVR2608-003', '2026-08-10', 'Test', 'Cash', [{ inv_no: '26080002', amount: 6720, received: 6720 }]],
    ['IVR2608-002', '2026-08-10', 'Test', 'Pay Later', []],
    ['IVR2608-001', '2026-08-10', 'A', 'Cash', [{ inv_no: '', amount: 2850, received: 2850 }]],
    ['IVR2607-001', '2026-07-11', 'Boy', 'Cash', []],
  ];
  for (const [no, date, shipper, pay, items] of returns) {
    await q('DELETE FROM invoice_returns WHERE ivr_no = ?', [no]);
    await q("INSERT INTO invoice_returns (ivr_no,ret_date,shipper,payment_type,remark,items_json) VALUES (?,?,?,?,'',?)",
      [no, date, shipper, pay, J(items)]);
  }
  console.log('✓ รับคืนอินวอยส์', returns.length, 'รายการ');

  console.log('\n🎉 ใส่ข้อมูลตัวอย่างครบทุกหน้ารายงานแล้ว');
  process.exit(0);
})().catch(e => { console.error('❌', e.message); process.exit(1); });
