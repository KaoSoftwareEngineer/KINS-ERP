// seed-fabric-regatta2.cjs — เพิ่ม Regatta 44092-44191 (ต่อจาก regatta.cjs). idempotent (แทนที่เฉพาะโค้ดชุดนี้)
require('dotenv').config();
const mysql = require('mysql2/promise');
const DATA = [
  ['44092','L Blue',1930],['44093','Two Tone Blue',1469],['44094','White',1325],['44095','L Blue',1817],['44096','Two Tone Blue',1434],
  ['44097','White',2582],['44098','L Blue',1402],['44099','Two Tone Blue',1744],['44100','White',1791],['44101','L Blue',1737],
  ['44102','Two Tone Blue',1694],['44103','White',1538],['44104','L Blue',1757],['44105','Two Tone Blue',1591],['44106','White',2166],
  ['44107','L Blue',1166],['44108','D Blue',1340],['44109','White',1535],['44110','L Blue',1474],['44111','D Blue',1784],
  ['44112','White',1941],['44113','L Blue',1354],['44114','D Blue',1698],['44115','White',2032],['44116','L Blue',1726],
  ['44117','D Blue',1663],['44118','White',1703],['44119','L Blue',1422],['44120','D Blue',747],['44121','White',1723],
  ['44122','L Blue',1946],['44123','D Blue',1687],['44124','White',1942],['44125','L Blue',2248],['44126','D Blue',1831],
  ['44127','White',2070],['44128','L Blue',1692],['44129','D Blue',1720],['44130','White',1564],['44131','L Blue',1878],
  ['44132','D Blue',1578],['44133','White',1752],['44134','L Blue',1202],['44135','D Blue',2252],['44136','White',2287],
  ['44137','L Blue',1298],['44138','D Blue',1453],['44139','White',3416],['44140','L Blue',1210],['44141','D Blue',1634],
  ['44142','White',2063],['44143','L Blue',1920],['44144','D Blue',1618],['44145','White',1893],['44146','L Blue',1528],
  ['44147','D Blue',1734],['44148','White',1559],['44149','L Blue',1286],['44150','D Blue',1698],['44151','White',2019],
  ['44152','L Blue',1414],['44153','D Blue',1667],['44154','White',1442],['44155','L Blue',1681],['44156','D Blue',1900],
  ['44157','White',1958],['44158','L Blue',1420],['44159','D Blue',1637],['44160','White',1516],['44161','L Blue',1677],
  ['44162','D Blue',1913],['44163','White',1653],['44164','L Blue',1665],['44165','D Blue',1889],['44166','White',1190],
  ['44167','L Blue',2065],['44168','D Blue',2047],['44169','White',1435],['44170','L Blue',1727],['44171','D Blue',1898],
  ['44172','White',1566],['44173','L Blue',1938],['44174','D Blue',1815],['44175','White',3442],['44176','L Blue',1894],
  ['44177','D Blue',1776],['44178','White',1160],['44179','L Blue',1467],['44180','D Blue',1694],['44181','White',2064],
  ['44182','L Blue',1415],['44183','D Blue',1720],['44184','White',2698],['44185','L Blue',1546],['44186','D Blue',1105],
  ['44187','White',2046],['44188','L Blue',1376],['44189','D Blue',1774],['44190','White',3527],['44191','L Blue',1462],
];
(async () => {
  const pool = mysql.createPool({ host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT) || 3306, user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '', database: process.env.DB_NAME || 'plum_erp', charset: 'utf8mb4' });
  const q = (s, p) => pool.query(s, p);
  const [f] = await q("SELECT id FROM fabrics WHERE sku = 'Regatta' LIMIT 1");
  if (!f[0]) { console.error('❌ ยังไม่มีผ้า Regatta — รัน seed-fabric-regatta.cjs ก่อน'); process.exit(1); }
  const fabricId = f[0].id;
  let n = 0;
  for (const [code, desc, stock] of DATA) {
    await q("DELETE FROM fabric_rolls WHERE roll_qr_code = ?", ['SEED-REG2-' + code]);
    await q("DELETE FROM fabric_shades WHERE fabric_id = ? AND color_code = ?", [fabricId, code]);
    const [si] = await q('INSERT INTO fabric_shades (fabric_id, name, color_code) VALUES (?, ?, ?)', [fabricId, code + ' : ' + desc, code]);
    await q("INSERT INTO fabric_rolls (roll_qr_code, product_id, color_id, initial_yards, current_yards, status, received_at) VALUES (?,?,?,?,?, 'available', NOW())",
      ['SEED-REG2-' + code, fabricId, si.insertId, stock, stock]);
    n++;
  }
  console.log('✓ Regatta เพิ่ม:', n, 'เฉดสี (44092-44191)');
  process.exit(0);
})().catch(e => { console.error('❌', e.message); process.exit(1); });
