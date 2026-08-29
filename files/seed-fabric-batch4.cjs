// seed-fabric-batch4.cjs — เพิ่มเฉดสีหลายตระกูลตามภาพ (วิธีปลอดภัย: ไม่ลบผ้า แค่เพิ่มเฉดที่ยังไม่มี). idempotent.
require('dotenv').config();
const mysql = require('mysql2/promise');

// [sku, width, [[colorCode, ชื่อเฉด, สต็อก]]]
const FAMILIES = [
  ['SEERSUCKER','', [['1','SEERSUCKER# 1',1049],['2','SEERSUCKER# 2',956],['3','SEERSUCKER# 3',533],['4','SEERSUCKER# 4',463],['5','SEERSUCKER# 5',987],['6','SEERSUCKER# 6',627],['8','SEERSUCKER# 8',1430],['9','SEERSUCKER# 9',988],['10','SEERSUCKER# 10',482],['12','SEERSUCKER# 12',380],['14','SEERSUCKER# 14',335],['16','SEERSUCKER# 16',532],['17','SEERSUCKER# 17',800],['20','SEERSUCKER# 20',613],['24','SEERSUCKER# 24',463],['25','SEERSUCKER# 25',416],['27','SEERSUCKER# 27',520],['28','SEERSUCKER# 28',354]]],
  ['SF104 (60")','60"',[['1','1 - Pink',1478],['2','2 - L-Blue',2108],['3','3 - Purple',1716],['4','4 - D Blue',1559],['5','5 - Red',1599],['6','6 - Black',1859]]],
  ['SF105 (60")','60"',[['1','1 - Pink',1683],['2','2 - L Blue',2036],['3','3 - Purple',1644],['4','4 - D Blue',1998],['5','5 - Red',1414],['6','6 - Black',1610]]],
  ['SF107','',[['5','5 - D-Pink',0],['7','7 - Black',983]]],
  ['SF107 (60")','60"',[['1','1 - L Blue',2081],['2','2 - L Pink',1570],['3','3 - Purple',1160],['4','4 - D Blue',1448],['6','6 - Navy',1424]]],
  ['SF108 (60")','60"',[['1','1 - Blue-Pink',2133],['2','2 - Pink',807],['3','3 - L Blue',1701],['4','4 - Purple',1620]]],
  ['SHINO','',[['88001','88001 - Pure White',155],['88002','88002 - Foggy Gray',153],['88003','88003 - Sand Beige',303],['88004','88004 - Cloud White',147.60],['88005','88005 - Dusty Blue',155],['88006','88006 - Platinum Gray',154.10],['88007','88007 - Taupe Gray',155],['88008','88008 - Ivory beige',1011.10],['88009','88009 - Malt',304],['88010','88010 - Light Khaki',304],['88011','88011 - Milk Chocolate',299.50],['88012','88012 - Copper Brown',98.40],['88013','88013 - Ranger Green',764.30],['88014','88014 - Cherry Red',295.30],['88015','88015 - Burgundyish',147.60],['88016','88016 - Plum',153],['88017','88017 - Pageant Blue',305],['88018','88018 - Peacoat',1058],['88019','88019 - Midnight blue',319.20],['88020','88020 - Pure Black',1381.50]]],
  ['Solemnity','',[['11001','11001 - Pale Lavender',5948.40],['11002','11002 - Dusty Pink',474.10],['11003','11003 - Sage Green',364.50],['11004','11004 - Slate Blue',351],['11005','11005 - Sky Blue',513.20],['11006','11006 - Light Gray',1203.10],['11007','11007 - Beige',473],['11008','11008 - Mustard Yellow',367.70],['11009','11009 - Periwinkle Blue',1506.20],['11010','11010 - Cornflower Blue',469.80],['11011','11011 - Mauve',575.20],['11012','11012 - Muted Purple',551.60],['11013','11013 - Muted Lavender',473.60],['11014','11014 - Steel Blue',599.50],['11015','11015 - Indigo',237.30],['11016','11016 - Dark Plum',236.50],['11017','11017 - Lemon Yellow',229.40],['11018','11018 - Crimson Red',217.40],['11019','11019 - Terracotta',346.50],['11020','11020 - Maroon',338.50],['11021','11021 - Wine Red',223.40],['11022','11022 - Olive Green',355.70],['11023','11023 - Taupe',703.30],['11024','11024 - Khaki',853.70],['11025','11025 - Dark Charcoal',445.60],['11026','11026 - Rose Gold / Salmon',207],['11027','11027 - Olive Green',249.70],['11028','11028 - Dark Forest Green',1255.90],['11029','11029 - Espresso Brown',679.70],['11030','11030 - Ochre / Dark Mustard',364.80],['11031','11031 - Burgundy',112.40],['11032','11032 - Deep Maroon',235.90],['11033','11033 - Turquoise',564],['11034','11034 - Teal',120.50],['11035','11035 - Ocean Blue',238.80],['11036','11036 - Navy Blue',213.10],['11037','11037 - Cerulean Blue',221],['11038','11038 - Sky Blue',227.80],['11039','11039 - Cadet Blue',352.20],['11040','11040 - Steel Blue',334.40],['11041','11041 - Royal Blue',440.80],['11042','11042 - Cobalt Blue',226.10],['11043','11043 - Midnight Blue',454],['11044','11044 - Off-White / Pearl Gray',463.60],['11045','11045 - Heather Gray',229.80],['11046','11046 - Charcoal Gray',359],['11047','11047 - Dark Taupe',734.40],['11048','11048 - Dark Graphite',487.70],['11049','11049 - Dark Slate Gray',582],['11050','11050 - Dark Pine Green',0],['11051','11051 - Deep Navy Blue',234.50],['11052','11052 - Midnight Blue',1407.90],['11053','11053 - Dark Indigo',1046.30],['11054','11054 - Jet Black',1775.90],['11055','11055 - Charcoal Black',725.10]]],
  ['SS','',[['1','1 - Light Blue Stripe',995],['2','2 - D.Blue Stripes',1000],['3','3 - Black Stripes',1000],['4','4 - Purple Stripes',1000],['5','5 - Tan Stripes',1000],['6','6 - Orange Stripes',1000],['8','8 - Royal Blue Stripes',1000],['9','9 - White',1000],['10','10 - Light Blue Checks',1000],['11','11 - D.Blue Checks (DC)',1000],['12','12 - Black Checks',1000],['13','13 - Purple Checks (DC)',1000],['14','14 - Tan Checks',1000],['15','15 - Orange Checks (DC)',1000],['16','16 - Pink Checks',1000],['17','17 - Royal Blue Checks',1000],['20','20 - Red Black Stripes',1000],['21','21 - Pink Black Stripes (DC)',1000],['22','22 - Blue Black Stripes (DC)',1000],['23','23 - Yellow Black Checks',1000],['24','24 - Green Black Checks',1000],['25','25 - Red Black Checks',1000],['27','27 - Blue Black Checks (DC)',1000],['28','28 - Daks',1000]]],
  ['Test K','',[['1','1-White',0],['2','2- Blue',0],['3','3-TEST',0]]],
];

// Twill - 44" : รหัสสี 1-90 (default 1000 + ค่าที่อ่านจากภาพ)
const TWILL_OVERRIDE = { 1:10846, 2:1488, 3:1540, 4:1540, 5:1150, 7:2912, 13:1120, 47:3493, 48:7484 };
const TWILL = [];
for (let i = 1; i <= 90; i++) TWILL.push([String(i), String(i), TWILL_OVERRIDE[i] != null ? TWILL_OVERRIDE[i] : 1000]);
FAMILIES.push(['Twill - 44"', '44"', TWILL]);

const REGATTA_MORE = [
  ['44192','D Blue',1821],['44193','White',2563],['44194','L Blue',1836],['44195','D Blue',1796],['44196','White',1708],['44197','L Blue',1419],['44198','D Blue',1724],['44199','White',2026],['44200','L Blue',1529],['44201','D Blue',1819],['44202','White',2552],['44203','L Blue',1852],['44204','D Blue',9432],
  ['44205','French Twill - White',2243],['44206','French Twill - L Blue',1892],['44207','French Twill - M blue',1543],['44208','French Twill - D Blue',1219],['44209','French Twill - Two Tone D Blue',1183],['44210','French Twill - Navy',1571],['44211','French Twill - Black',1964],['44212','French Twill - Two tone Black',1828],['44213','French Twill - Grey',1412],['44214','French Twill - Pink',1325],['44215','French Twill - Cream',1495],['44216','French Twill - Purple',1466],['44217','French Twill - Mustard',1851],['44218','French Twill - Mint',1747],['44219','French Twill - Carolina Blue',1175],['44220','French Twill - Violet',1833],
  ['DC1','DC1',1000],['DC2','DC2',1000],['DC3','DC3',1000],['DC4','DC4',1000],['DC5','DC5',1000],['DC6','DC6',1000],['DC7','DC7',1000],['DC8','DC8',1000],
];

(async () => {
  const pool = mysql.createPool({ host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT) || 3306, user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '', database: process.env.DB_NAME || 'plum_erp', charset: 'utf8mb4' });
  const q = (s, p) => pool.query(s, p);

  // เพิ่มเฉด "ถ้ายังไม่มี" ให้ผ้า (ไม่ลบผ้า → ไม่ชน FK goods_receipt_items)
  async function addShades(fid, prefix, shades) {
    let n = 0;
    for (const [code, name, stock] of shades) {
      const [has] = await q('SELECT id FROM fabric_shades WHERE fabric_id = ? AND color_code = ? LIMIT 1', [fid, code]);
      if (has[0]) continue;
      const [si] = await q('INSERT INTO fabric_shades (fabric_id, name, color_code) VALUES (?, ?, ?)', [fid, name, code]);
      await q("INSERT INTO fabric_rolls (roll_qr_code, product_id, color_id, initial_yards, current_yards, status, received_at) VALUES (?,?,?,?,?, 'available', NOW())",
        [prefix + '-' + code, fid, si.insertId, stock, stock]).catch(() => {});
      n++;
    }
    return n;
  }

  for (const [sku, width, shades] of FAMILIES) {
    let [f] = await q('SELECT id FROM fabrics WHERE sku = ? LIMIT 1', [sku]);
    let fid;
    if (f[0]) fid = f[0].id;
    else { const [info] = await q("INSERT INTO fabrics (sku, type, name, width, unit, active) VALUES (?, 'Finished', ?, ?, 'หลา', 1)", [sku, sku, width]); fid = info.insertId; }
    const n = await addShades(fid, 'SEED-' + sku.replace(/[^A-Za-z0-9]/g, ''), shades);
    console.log('✓', sku + ':', '+' + n, 'เฉด (จาก', shades.length + ')');
  }

  const [rf] = await q("SELECT id FROM fabrics WHERE sku = 'Regatta' LIMIT 1");
  if (rf[0]) {
    const n = await addShades(rf[0].id, 'SEED-REG3', REGATTA_MORE.map(([c, d, s]) => [c, /^DC/.test(c) ? c : c + ' : ' + d, s]));
    console.log('✓ Regatta เพิ่ม:', '+' + n, 'เฉด');
  }
  console.log('\n🎉 batch4 เสร็จ');
  process.exit(0);
})().catch(e => { console.error('❌', e.message); process.exit(1); });
