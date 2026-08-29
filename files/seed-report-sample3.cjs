// seed-report-sample3.cjs — รับเงินลูกค้า/จ่ายเงินคู่ค้า + ใบลดหนี้ลูกค้า/คู่ค้า (idempotent)
require('dotenv').config();
const mysql = require('mysql2/promise');
(async () => {
  const pool = mysql.createPool({ host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT) || 3306, user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '', database: process.env.DB_NAME || 'plum_erp', charset: 'utf8mb4' });
  const q = (s, p) => pool.query(s, p); const J = (o) => JSON.stringify(o);

  // ---------- รับเงินลูกค้า (payments doc_type=receive) ----------
  await q("DELETE FROM payments WHERE doc_no = 'RC2608-101'");
  await q("INSERT INTO payments (doc_no,doc_type,doc_date,remark,total_amount,items_json) VALUES ('RC2608-101','receive','2026-08-27','',12570,?)",
    [J([
      { party: 'BKK', type: 'เงินสด', pay_date: '2026-08-27', amount: 3000, account: '', invoiceRef: '26080003', slipUrl: '' },
      { party: 'คิงห์ แฟชั่น', type: 'เงินสด', pay_date: '2026-08-10', amount: 6720, account: '', invoiceRef: '26080002', slipUrl: '' },
      { party: 'คิงห์ แฟชั่น', type: 'เงินสด', pay_date: '2026-08-10', amount: 2850, account: '', invoiceRef: '26080001', slipUrl: '' },
    ])]);

  // ---------- จ่ายเงินคู่ค้า (payments doc_type=pay) ----------
  await q("DELETE FROM payments WHERE doc_no = 'PP2608-101'");
  await q("INSERT INTO payments (doc_no,doc_type,doc_date,remark,total_amount,items_json) VALUES ('PP2608-101','pay','2026-08-24','',30000,?)",
    [J([{ party: 'ตั้งหวังเจ๋ง จำกัด มหาชน', type: 'เงินสด', pay_date: '2026-08-24', amount: 30000, account: '', invoiceRef: '' }])]);
  console.log('✓ รับเงินลูกค้า 3 รายการ + จ่ายเงินคู่ค้า 1 รายการ');

  // ---------- ใบลดหนี้ลูกค้า (credit_notes doc_type=customer) ----------
  await q("DELETE FROM credit_notes WHERE doc_no = 'CR2608-001'");
  await q(
    `INSERT INTO credit_notes (doc_no,doc_type,doc_date,party,return_type,invoice_ref,remark,subtotal,vat,net_total,items_json)
     VALUES ('CR2608-001','customer','2026-08-22','BKK','No Return','26080003','',2000,140,2140,?)`,
    [J([{ description: 'ลดให้ลูกค้า', amount: 2000 }])]);

  // ---------- ใบลดหนี้คู่ค้า (credit_notes doc_type=partner) ----------
  await q("DELETE FROM credit_notes WHERE doc_no = 'CP2608-001'");
  await q(
    `INSERT INTO credit_notes (doc_no,doc_type,doc_date,party,return_type,invoice_ref,remark,subtotal,vat,net_total,items_json)
     VALUES ('CP2608-001','partner','2026-08-21','ตั้งหวังเจ๋ง จำกัด มหาชน','No Return','','',2000,0,2000,?)`,
    [J([{ description: 'test', amount: 2000 }])]);
  console.log('✓ ใบลดหนี้ลูกค้า 1 + ใบลดหนี้คู่ค้า 1');

  console.log('\n🎉 seed ชุด 3 เสร็จ');
  process.exit(0);
})().catch(e => { console.error('❌', e.message); process.exit(1); });
