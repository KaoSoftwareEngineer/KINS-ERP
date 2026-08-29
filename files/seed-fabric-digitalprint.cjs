// seed-fabric-digitalprint.cjs — สร้างผ้า "Digital Print" + เฉดสี 123001-123060 + สต็อก
// พิสูจน์กลไก import fabric master (ที่เหลือ 1,689 เฉดใช้ .sql export). idempotent.
require('dotenv').config();
const mysql = require('mysql2/promise');
(async () => {
  const pool = mysql.createPool({ host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT) || 3306, user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '', database: process.env.DB_NAME || 'plum_erp', charset: 'utf8mb4' });
  const q = (s, p) => pool.query(s, p);
  const SKU = 'Digital Print';

  // ลบของเดิม (rolls ต้องลบก่อน เพราะ FK product = RESTRICT) แล้วค่อยลบ fabric (cascade shades)
  const [ex] = await q('SELECT id FROM fabrics WHERE sku = ? LIMIT 1', [SKU]);
  if (ex[0]) {
    await q('DELETE FROM fabric_rolls WHERE product_id = ?', [ex[0].id]);
    await q('DELETE FROM fabrics WHERE id = ?', [ex[0].id]);
  }

  // สร้างผ้า
  const [info] = await q("INSERT INTO fabrics (sku, type, name, width, unit, active) VALUES (?, 'Finished', ?, '60\"', 'หลา', 1)", [SKU, SKU]);
  const fabricId = info.insertId;

  // สต็อกที่เห็นในภาพบางแถว (นอกนั้น = 1000)
  const stockMap = { '123005': 1086.20, '123006': 1219.70, '123007': 1240.60, '123009': 1108.20, '123012': 1109.30, '123018': 1142.10, '123019': 1142.10, '123023': 1082.00, '123026': 1270.00, '123027': 1166.00, '123035': 1130.10, '123042': 1109.30, '123043': 1148.70, '123044': 1207.70, '123046': 1102.00, '123052': 1062.00, '123053': 1127.00, '123055': 1142.10, '123056': 1202.20, '123057': 1112.00 };

  let n = 0;
  for (let i = 1; i <= 60; i++) {
    const code = '123' + String(i).padStart(3, '0');
    const [si] = await q('INSERT INTO fabric_shades (fabric_id, name, color_code) VALUES (?, ?, ?)', [fabricId, code, code]);
    const yards = stockMap[code] != null ? stockMap[code] : 1000;
    const qr = 'SEED-DP-' + code;
    await q(
      "INSERT INTO fabric_rolls (roll_qr_code, product_id, color_id, initial_yards, current_yards, status, received_at) VALUES (?,?,?,?,?, 'available', NOW())",
      [qr, fabricId, si.insertId, yards, yards]
    );
    n++;
  }
  console.log('✓ Digital Print:', n, 'เฉดสี (123001-123060) + สต็อก');
  console.log('  reorder จะโชว์เพิ่มอีก', n, 'แถว');
  process.exit(0);
})().catch(e => { console.error('❌', e.message); process.exit(1); });
