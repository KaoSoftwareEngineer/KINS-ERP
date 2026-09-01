// ============================================================================
//  reset-admin-password.cjs — สุ่มรหัสผ่านใหม่ให้บัญชีผู้ดูแลระบบสำรอง (login: "admin")
//
//  ใช้เมื่อ: บัญชี admin ยังใช้รหัสเดิมที่เดาง่าย หรือลืมรหัสผ่าน
//  วิธีรัน (ในโฟลเดอร์ files/):   node reset-admin-password.cjs
//  รหัสใหม่จะถูกพิมพ์ออกหน้าจอครั้งเดียว — คัดลอกเก็บไว้ แล้วล็อกอินไปเปลี่ยนเองในหน้าตั้งค่าได้
//  (แฮชใช้รูปแบบเดียวกับ server.js คือ scrypt แบบ salt:hash)
// ============================================================================
require('dotenv').config();
const crypto = require('crypto');
const mysql = require('mysql2/promise');

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

(async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'plum_erp',
  });
  try {
    const newPassword = crypto.randomBytes(12).toString('base64url'); // สุ่มจริง ~16 ตัวอักษร
    const [info] = await pool.query('UPDATE users SET password = ? WHERE email = ?', [hashPassword(newPassword), 'admin']);
    if (info.affectedRows === 0) {
      console.log('⚠️  ไม่พบบัญชี login "admin" ในฐานข้อมูล — ไม่มีอะไรถูกเปลี่ยน');
    } else {
      console.log('\n  ✅ เปลี่ยนรหัสผ่านบัญชี "admin" เรียบร้อย');
      console.log(`  🔑 รหัสผ่านใหม่ (โชว์ครั้งนี้ครั้งเดียว): ${newPassword}`);
      console.log('  ⚠️  คัดลอกเก็บไว้ แล้วล็อกอินไปตั้งรหัสที่จำง่ายกว่าเองได้ในหน้าตั้งค่า\n');
    }
  } catch (err) {
    console.error('❌ เปลี่ยนรหัสผ่านไม่สำเร็จ:', err.message);
  } finally {
    await pool.end();
  }
})();
