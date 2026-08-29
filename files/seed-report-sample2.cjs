// seed-report-sample2.cjs — PO 28 + ใบกำกับภาษี 2 + ต้นทุน P&L + วางบิลลูกค้า 11 (idempotent)
require('dotenv').config();
const mysql = require('mysql2/promise');
(async () => {
  const pool = mysql.createPool({ host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT) || 3306, user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '', database: process.env.DB_NAME || 'plum_erp', charset: 'utf8mb4' });
  const q = (s, p) => pool.query(s, p); const J = (o) => JSON.stringify(o);

  // ---------- 1) ใบสั่งซื้อ (PO) 28 รายการ ----------
  const F = 'finished', R = 'raw', W = 'Warehouse', D = 'โรงย้อม', TW = 'ตั้งหวังเจ๋ง จำกัด มหาชน';
  const pos = [
    ['PO2608-002', '2026-08-27', F, 'D Finest', '', '', W, 'Pending', 10000],
    ['PO2608-001', '2026-08-18', F, 'D Finest', '', '', W, 'Pending', 0],
    ['PO2603-025', '2026-03-23', R, TW, '', '', D, 'Pending', 50000],
    ['PO2603-024', '2026-03-23', R, TW, '', '', D, 'Canceled', 70],
    ['PO2603-023', '2026-03-23', R, TW, '', '2026-03-23', D, 'Pending', 50],
    ['PO2603-022', '2026-03-21', F, TW, '', '', W, 'Pending', 3000],
    ['PO2603-021', '2026-03-21', F, TW, '', '', W, 'Pending', 1000],
    ['PO2603-020', '2026-03-21', R, TW, '', '', D, 'Pending', 1000],
    ['PO2603-019', '2026-03-21', R, TW, '', '2026-03-22', D, 'Pending', 500],
    ['PO2603-018', '2026-03-20', R, TW, '1234567890', '', D, 'Pending', 100],
    ['PO2603-017', '2026-03-20', F, TW, '', '', W, 'Pending', 10000],
    ['PO2603-016', '2026-03-20', F, TW, '', '', W, 'Pending', 10],
    ['PO2603-015', '2026-03-20', F, 'Test', '', '', W, 'Pending', 500],
    ['PO2603-014', '2026-03-20', F, TW, '', '', W, 'Pending', 30],
    ['PO2603-013', '2026-03-20', R, 'ลุงหนวด', '', '', D, 'Pending', 20],
    ['PO2603-012', '2026-03-19', F, 'Test', '', '', W, 'Pending', 10],
    ['PO2603-011', '2026-03-18', F, 'Test', '', '2026-03-19', W, 'Canceled', 10],
    ['PO2603-010', '2026-03-18', F, 'Test', '', '2026-03-19', W, 'Pending', 10],
    ['PO2603-009', '2026-03-17', F, 'Test', '123456', '2026-03-18', W, 'Pending', 44],
    ['PO2603-008', '2026-03-16', F, 'Test', '', '', W, 'Pending', 1000],
    ['PO2603-007', '2026-03-16', R, 'Test', 'fsdds', '', D, 'Pending', 0],
    ['PO2603-006', '2026-03-16', F, 'Test', 'fdsfsdfsd', '', W, 'Pending', 0],
    ['PO2603-005', '2026-03-16', R, 'Test โรงทอ', '12313', '2026-03-31', D, 'Completed', 1000],
    ['PO2603-004', '2026-03-16', F, 'Test', '1232154', '2026-04-01', W, 'Completed', 2000],
    ['PO2603-003', '2026-03-13', F, 'Test', '0001', '', W, 'Pending', 50],
    ['PO2603-002', '2026-03-09', F, 'Test', '', '2026-03-18', W, 'Pending', 0],
    ['PO2603-001', '2026-03-07', F, 'Test', '', '2026-03-07', W, 'Pending', 11],
    ['PO2507-001', '2025-07-19', F, 'Test', '', '', W, 'Pending', 8000],
  ];
  for (const [no, date, type, vendor, ref, ship, shipTo, status, qty] of pos) {
    await q('DELETE FROM purchase_orders WHERE po_no = ?', [no]);
    const items = qty > 0 ? [{ sku: type === R ? 'ผ้าดิบ' : 'Regatta', color: '', qty, unit: 'หลา', unit_price: 0, amount: 0 }] : [];
    await q(
      `INSERT INTO purchase_orders (po_no,po_type,po_date,vendor,account_term,ship_to,remark,ref_no,ship_date,approved,status,subtotal,discount,vat,net_total,items_json)
       VALUES (?,?,?,?,'',?,'',?,?,?,?,0,0,0,0,?)`,
      [no, type, date, vendor, shipTo, ref, ship, status === 'Completed' ? 1 : 0, status, J(items)]
    );
  }
  console.log('✓ ใบสั่งซื้อ (PO)', pos.length, 'รายการ');

  // ---------- 2) ใบกำกับภาษี (vat_invoices) 2 รายการ ----------
  const vats = [
    ['VT26080001', '2026-08-27', '26080004', 'Wholesale', 'บารอน', '120 Days', '', 7200, 504, 7704, 0,
      [{ sku: 'Regatta', color: '44006 : Silky - Misty Blue', width: '44"', qty: 60, unit: 'หลา', unit_price: 120, amount: 7200, group: 'ผ้า' }]],
    ['VT26070001', '2026-07-11', 'P26070001', 'Retail', 'คิง เทเลอร์', '120 Days', '', 1831.78, 128.22, 1960, 1,
      [{ sku: 'Fabrizio', color: '14006 - White', width: '58', qty: 10, unit: 'หลา', unit_price: 183.18, amount: 1831.78, group: 'ผ้า' }]],
  ];
  for (const [no, date, ref, stype, cust, term, sp, sub, vat, net, cut, items] of vats) {
    await q('DELETE FROM vat_invoices WHERE vt_no = ?', [no]);
    await q(
      `INSERT INTO vat_invoices (vt_no,invoice_date,customer,salesperson,account_term,bill_address,remark,subtotal,discount,vat,net_total,items_json,inv_ref,sale_type,vat_cut)
       VALUES (?,?,?,?,?,'','',?,0,?,?,?,?,?,?)`,
      [no, date, cust, sp, term, sub, vat, net, J(items), ref, stype, cut]
    );
  }
  console.log('✓ ใบกำกับภาษี', vats.length, 'รายการ');

  // ---------- 3) ต้นทุน P&L + เติม items ให้ครบ (อินวอยส์ที่ยังว่าง) ----------
  const itC = (color, qty, up, amt, cost, bc) => J([{ sku: 'Regatta', color, width: '44"', qty, unit: 'หลา', unit_price: up, amount: amt, cost, barcode: bc }]);
  const costUpdates = [
    ['26080004', 4200, null], ['26080003', 8400, null], ['26080002', 7840, null], ['26080001', 1950, null],
    ['26070002', 2430, itC('44105 : Two Tone Blue', 45, 105, 4725, 2430, '2607005001')],
    ['26070001', 1230, itC('44105 : Two Tone Blue', 25, 60, 1500, 1230, '2607004001')],
    ['P26080001', 780, J([{ sku: 'Fabrizio', color: '14006 - White', width: '58', qty: 10, unit: 'หลา', unit_price: 160, amount: 1600, cost: 780, barcode: '2608012538' }])],
    ['P26070001', 1232, J([{ sku: 'Fabrizio', color: '14006 - White', width: '58', qty: 10, unit: 'หลา', unit_price: 196, amount: 1960, cost: 1232, barcode: '2607006001' }])],
    ['P26070002', 41999999995.80, null],
  ];
  for (const [no, cost, items] of costUpdates) {
    if (items) await q('UPDATE sale_invoices SET total_cost = ?, items_json = ? WHERE inv_no = ?', [cost, items, no]);
    else await q('UPDATE sale_invoices SET total_cost = ? WHERE inv_no = ?', [cost, no]);
  }
  console.log('✓ ต้นทุน P&L', costUpdates.length, 'อินวอยส์');

  // ---------- 4) วางบิลลูกค้า (customer_billings) 11 รายการ ----------
  const bills = [
    ['BR2608-011', '2026-08-27', '', 'BKK', -2140, []],
    ['BR2608-010', '2026-08-27', '', 'BTC', 99999999.99, []],
    ['BR2608-009', '2026-08-27', '', 'คิง เทเลอร์', 1950.40, [{ doc_date: '2026-07-11', inv_no: 'P26070001', typeLabel: 'ขายปลีก', due_date: '2026-11-08', total: 1950.40, remaining: 1950.40 }]],
    ['BR2608-008', '2026-08-27', '', 'AY CHANNANG', 4725, []],
    ['BR2608-007', '2026-08-27', '', 'Deep', 1425, []],
    ['BR2608-006', '2026-08-27', '', 'BKK', 4460, []],
    ['BR2608-005', '2026-08-27', '', 'BKK', 4460, []],
    ['BR2608-004', '2026-08-24', '', 'BKK', 4460, []],
    ['BR2608-003', '2026-08-22', '', 'BKK', 6600, []],
    ['BR2608-002', '2026-08-22', '2026-08-22', 'BKK', 6600, []],
    ['BR2608-001', '2026-08-20', '', 'BKK', 6600, []],
  ];
  for (const [no, bdate, due, cust, total, items] of bills) {
    await q('DELETE FROM customer_billings WHERE br_no = ?', [no]);
    await q("INSERT INTO customer_billings (br_no,bill_date,due_date,customer,remark,total_amount,items_json) VALUES (?,?,?,?,'',?,?)",
      [no, bdate, due, cust, total, J(items)]);
  }
  console.log('✓ วางบิลลูกค้า', bills.length, 'รายการ');

  console.log('\n🎉 seed ชุด 2 เสร็จ');
  process.exit(0);
})().catch(e => { console.error('❌', e.message); process.exit(1); });
