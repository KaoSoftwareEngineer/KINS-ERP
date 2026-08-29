// seed-fabric-regatta.cjs — ผ้า "Regatta" 44001-44091 ตามภาพ (ถอดจาก screenshot). idempotent.
require('dotenv').config();
const mysql = require('mysql2/promise');
// [รหัสสี, คำอธิบาย, สต็อก]
const DATA = [
  ['44001','Silky - White',62],['44002','Silky - Baby Blue',2117],['44003','Silky - Two Tone M Blue',995],['44004','Silky - Two Tone L Blue',170],
  ['44005','Silky - Vista Blue',1747],['44006','Silky - Misty Blue',2058],['44007','Silky - Two-Tone R Blue',1232],['44008','Silky - Denim Blue',1225],
  ['44009','Silky - Air Force Blue',1575],['44010','Silky - Beige',1436],['44011','Silky - Mirage Grey',1826],['44012','Silky - Chocolate',1872],
  ['44013','Silky - Burgendy',1747],['44014','Silky - Bistro Green',1750],['44015','Silky - Bronze Brown',1566],['44016','Silky - Navy',1309],
  ['44017','Silky - Black',1857],['44018','Silky - Two Tone Grey',1289],['44019','Silky - Peach',1662],['44020','Silky - Purple',1603],
  ['44021','Silky - Baby pink',1692],['44022','Silky - Mint',1804],['44023','Silky - Cream',2276],['44024','Silky - Two Tone Sky Blue',1955],
  ['44025','Silky - Two Tone Green',1908],['44026','Silky - Two Tone Purple',1785],['44027','Silky - Two Tone Red',2133],['44028','Fish Bone - White',2529],
  ['44029','Fish Bone - Two tone Black',2011],['44030','Fish Bone - Grey',1901],['44031','Fish Bone - Purple',1762],['44032','Fish Bone - Cream',1396],
  ['44033','Fish Bone - Pink',1299],['44034','Fish Bone - Light Blue',1924],['44035','Fish Bone - M Blue',1354],['44036','Fish Bone - Dark Blue',2219],
  ['44037','Fish Bone - Two Tone Navy',1306],['44038','Fish Bone - Navy',2334],['44039','Fish Bone - Black',1420],['44040','Honey Comb - White',3116],
  ['44041','Honey Comb - Puple',1858],['44042','Honey Comb - Pink',1570],['44043','Honey Comb - Grey',1661],['44044','Honey Comb - Light Blue',2006],
  ['44045','Honey Comb - Royal Blue',1739],['44046','Honey Comb - Two tone Blue',1914],['44047','Honey Comb - Navy',1863],['44048','Small Checker - White',1524],
  ['44049','Small Checker - Mint',1902],['44050','Small Checker - Pink',1727],['44051','Small Checker - L Blue',1714],['44052','Small Checker - M Blue',2061],
  ['44053','Small Checker - Purple',1818],['44054','Small Checker - Siver',1702],['44055','Small Checker - D Blue',1702],['44056','Small Checker - Two Tone Navy',1612],
  ['44057','Small Checker - Black',1416],['44058','White',1940],['44059','L Blue',1227],['44061','White',2451],['44062','L Blue',1594],
  ['44064','White',2086],['44065','L Blue',1755],['44067','White',1502],['44068','L Blue',1386],['44070','White',1239],['44071','L Blue',1768],
  ['44073','White',1439],['44074','L Blue',1514],['44076','White',1374],['44077','L Blue',1796],['44079','White',1180],['44080','L Blue',1278],
  ['44082','White',2017],['44083','L Blue',1304],['44084','Two Tone Blue',1738],['44085','White',1779],['44086','L Blue',2074],['44087','Two Tone Blue',1264],
  ['44088','White',1754],['44089','L Blue',1914],['44090','Two Tone Blue',1823],['44091','White',1698],
];
(async () => {
  const pool = mysql.createPool({ host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT) || 3306, user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '', database: process.env.DB_NAME || 'plum_erp', charset: 'utf8mb4' });
  const q = (s, p) => pool.query(s, p);
  const SKU = 'Regatta';
  const [ex] = await q('SELECT id FROM fabrics WHERE sku = ? LIMIT 1', [SKU]);
  if (ex[0]) { await q('DELETE FROM fabric_rolls WHERE product_id = ?', [ex[0].id]); await q('DELETE FROM fabrics WHERE id = ?', [ex[0].id]); }
  const [info] = await q("INSERT INTO fabrics (sku, type, name, width, unit, active) VALUES (?, 'Finished', ?, '44\"', 'หลา', 1)", [SKU, SKU]);
  const fabricId = info.insertId;
  let n = 0;
  for (const [code, desc, stock] of DATA) {
    const shadeName = code + ' : ' + desc;
    const [si] = await q('INSERT INTO fabric_shades (fabric_id, name, color_code) VALUES (?, ?, ?)', [fabricId, shadeName, code]);
    await q("INSERT INTO fabric_rolls (roll_qr_code, product_id, color_id, initial_yards, current_yards, status, received_at) VALUES (?,?,?,?,?, 'available', NOW())",
      ['SEED-REG-' + code, fabricId, si.insertId, stock, stock]);
    n++;
  }
  console.log('✓ Regatta:', n, 'เฉดสี (44001-44091) + สต็อก');
  process.exit(0);
})().catch(e => { console.error('❌', e.message); process.exit(1); });
