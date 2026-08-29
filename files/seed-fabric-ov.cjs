// seed-fabric-ov.cjs — ผ้า "OV" สี 1-56 ตามภาพหน้ารายงานจุดสั่งซื้อ (ถอดจาก screenshot). idempotent.
require('dotenv').config();
const mysql = require('mysql2/promise');
const DATA = [
  ['1','WHITE',4210],['2','LIGHT BLUE',2758],['3','CREAM',1952],['4','MINT',1928],['5','YELLOW',1000],
  ['6','CORAL',2559],['7','WISTERIA',1946],['8','FLAMINGO',1773],['9','TURQUOISE',1232],['10','BURNT RED',1369],
  ['11','AQUA',1480],['12','ORCHID',1237],['13','TAN',1000],['14','CADET GREY',1528],['15','PURE WHITE',1120],
  ['16','SOLID BLUE',3220],['17','SAGE',1723],['18','PURPLE',1254],['19','PINK',1677],['20','TWO TONE BLUE',3402],
  ['21','BLUE JEANS',1785],['22','STONE BLUE',1300],['23','ULTRAMARINE',2221],['24','KHAKI',2019],['25','SAPPHIRE',1000],
  ['26','RED JEANS',1253],['27','STEEL',1541],['28','STEEL BLUE',1475],['29','RED',1449],['30','GRASS GREEN',1921],
  ['31','ROYAL BLUE',2003],['32','FRENCH PINK',1285],['33','ORANGE',2291],['34','CORNFLOWER',1791],['35','MIDNIGHT BLUE',1585],
  ['36','AMBER',1840],['37','DARK TEAL',1402],['38','MUSTARD',1000],['39','BURNT BROWN',1383],['40','WINE',1600],
  ['41','PRUSSIAN BLUE',1347],['42','SUPER BLACK',3115],['43','DESERT SAND',1521],['44','BEAVER',1565],['45','PALACE GREEN',1654],
  ['46','FOREST',1815],['47','THISTLE',1000],['48','PLUM',2155],['49','ROSE',1896],['50','BURGENDY',1974],
  ['51','DUN BROWN',1888],['52','BROWN',1187],['53','SILVER',2398],['54','ASH GREY',1480],['55','CHARCOAL',1168],['56','NAVY',3012],
];
(async () => {
  const pool = mysql.createPool({ host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT) || 3306, user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '', database: process.env.DB_NAME || 'plum_erp', charset: 'utf8mb4' });
  const q = (s, p) => pool.query(s, p);
  const SKU = 'OV';
  const [ex] = await q('SELECT id FROM fabrics WHERE sku = ? LIMIT 1', [SKU]);
  if (ex[0]) { await q('DELETE FROM fabric_rolls WHERE product_id = ?', [ex[0].id]); await q('DELETE FROM fabrics WHERE id = ?', [ex[0].id]); }
  const [info] = await q("INSERT INTO fabrics (sku, type, name, width, unit, active) VALUES (?, 'Finished', ?, '58\"', 'หลา', 1)", [SKU, SKU]);
  const fabricId = info.insertId;
  let n = 0;
  for (const [code, color, stock] of DATA) {
    const shadeName = code + ' - ' + color;
    const [si] = await q('INSERT INTO fabric_shades (fabric_id, name, color_code) VALUES (?, ?, ?)', [fabricId, shadeName, code]);
    await q("INSERT INTO fabric_rolls (roll_qr_code, product_id, color_id, initial_yards, current_yards, status, received_at) VALUES (?,?,?,?,?, 'available', NOW())",
      ['SEED-OV-' + code, fabricId, si.insertId, stock, stock]);
    n++;
  }
  console.log('✓ OV:', n, 'เฉดสี (1-56) + สต็อก');
  process.exit(0);
})().catch(e => { console.error('❌', e.message); process.exit(1); });
