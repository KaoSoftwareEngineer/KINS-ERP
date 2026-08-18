// ============================================================
//  migrate-to-mysql.cjs — ย้ายข้อมูลทั้งหมดจาก SQLite (data.db) -> MySQL (kins_erp)
//  รันครั้งเดียว:  node migrate-to-mysql.cjs
//  - สร้างตารางใน MySQL (ผ่าน initTables)
//  - ล้าง seed แล้วคัดลอกข้อมูลจริงจาก SQLite โดยคงค่า id (รักษา foreign key)
// ============================================================
const path = require('path');
const Database = require('better-sqlite3');
const { pool, initTables } = require('./db-mysql');

// ตารางที่ย้าย (เรียงตามลำดับ dependency: ตารางแม่ก่อนตารางลูก)
const TABLES = [
  'fabrics',
  'fabric_shades',
  'fabric_irregular',
  'fabric_irregular_shades',
  'fabric_master',
  'customer_master',
  'orders',
  'order_items',
];

(async () => {
  const sqlite = new Database(path.join(__dirname, 'data.db'), { readonly: true });

  console.log('▶ สร้างตารางใน MySQL ...');
  await initTables();

  const conn = await pool.getConnection();
  try {
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');

    // ล้าง seed/ข้อมูลเดิมในตารางปลายทางก่อน (ลูกก่อนแม่)
    for (const t of [...TABLES].reverse()) {
      await conn.query(`DELETE FROM \`${t}\``);
      await conn.query(`ALTER TABLE \`${t}\` AUTO_INCREMENT = 1`);
    }

    let grandTotal = 0;
    for (const t of TABLES) {
      // ตารางนี้มีจริงใน SQLite ไหม
      const exists = sqlite
        .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ?")
        .get(t);
      if (!exists) {
        console.log(`  - ${t}: ไม่มีใน SQLite ข้าม`);
        continue;
      }

      const rows = sqlite.prepare(`SELECT * FROM \`${t}\``).all();
      if (rows.length === 0) {
        console.log(`  - ${t}: 0 แถว`);
        continue;
      }

      // เอาเฉพาะคอลัมน์ที่มีจริงใน MySQL (กัน schema ต่างกันเล็กน้อย)
      const [mysqlCols] = await conn.query(
        'SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?',
        [t]
      );
      const allowed = new Set(mysqlCols.map((c) => c.COLUMN_NAME));
      const cols = Object.keys(rows[0]).filter((c) => allowed.has(c));

      const placeholders = '(' + cols.map(() => '?').join(', ') + ')';
      const colList = cols.map((c) => `\`${c}\``).join(', ');
      const sql = `INSERT INTO \`${t}\` (${colList}) VALUES ${placeholders}`;

      for (const r of rows) {
        const vals = cols.map((c) => (r[c] === undefined ? null : r[c]));
        await conn.query(sql, vals);
      }
      console.log(`  ✓ ${t}: ย้าย ${rows.length} แถว`);
      grandTotal += rows.length;
    }

    await conn.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log(`\n✅ เสร็จสิ้น — ย้ายทั้งหมด ${grandTotal} แถว เข้า MySQL (kins_erp)`);
  } finally {
    conn.release();
    sqlite.close();
    await pool.end();
  }
})().catch((err) => {
  console.error('❌ ย้ายข้อมูลไม่สำเร็จ:', err);
  process.exit(1);
});
