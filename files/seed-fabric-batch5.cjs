// seed-fabric-batch5.cjs — ตระกูล 100S / 180B / 250B / 500-512 (ถอดจากภาพช่วงต้น). ปลอดภัย+idempotent.
require('dotenv').config();
const mysql = require('mysql2/promise');

// helper สร้างเฉดแบบ [colorCode, ชื่อ, stock]
const C = (code, name, stock = 1000) => [String(code), name, stock];

const FAMILIES = [
  ['100S01','',[C(1,'1 - L BLUE',0),C(10,'10 - GREY'),C(2,'2 - PINK'),C(3,'3 - MINT'),C(4,'4 - CREAM'),C(5,'5 - PURPLE'),C(6,'6 - D BLUE'),C(7,'7 - RED'),C(8,'8 - TAN'),C(9,'9 - VIOLET')]],
  ['100S01(60")','60"',[C(1,'1 - White',1720),C(2,'2 - Black',1451)]],
  ['100S02','',[C(1,'1 - L BLUE'),C(2,'2 - RED'),C(3,'3 - PURPLE'),C(4,'4 - GREY'),C(5,'5 - R BLUE'),C(6,'6 - BLACK')]],
  ['100S03','',[C(1,'1 - L BLUE',985),C(2,'2 - RED'),C(3,'3 - D BLUE'),C(4,'4 - BLACK')]],
  ['100S04','',[C(1,'1 - L BLUE'),C(2,'2 - RED'),C(3,'3 - D BLUE'),C(4,'4 - BLACK')]],
  ['100S05','',[C(1,'1 - WHITE'),C(2,'2 - BLUE'),C(3,'3 - PINK',10),C(4,'4 - YELLOW')]],
  ['100S06','',[C(1,'1 - WHITE'),C(2,'2 - BLUE'),C(3,'3 - PINK'),C(4,'4 - YELLOW')]],
  ['100S07','',[C(1,'1 - BLUE'),C(2,'2 - PINK'),C(3,'3 - GOLD'),C(4,'4 - GREEN'),C(5,'5 - PURPLE'),C(6,'6 - GREY')]],
  ['100S08','',[C(1,'1 - BLUE'),C(2,'2 - PINK'),C(3,'3 - GOLD'),C(4,'4 - GREEN'),C(5,'5 - PURPLE'),C(6,'6 - GREY')]],
  ['100S09','',[C(1,'1 - L BLUE'),C(2,'2 - RED'),C(3,'3 - BEIGE'),C(4,'4 - GREEN'),C(5,'5 - PURPLE'),C(6,'6 - GREY'),C(7,'7 - D BLUE'),C(8,'8 - BLACK')]],
  ['100S10','',[C(1,'1 - L BLUE'),C(2,'2 - RED'),C(3,'3 - BEIGE'),C(4,'4 - GREEN'),C(5,'5 - PURPLE'),C(6,'6 - GREY'),C(7,'7 - D BLUE'),C(8,'8 - BLACK')]],
  ['100S11','',[C(1,'1 - L BLUE'),C(2,'2 - RED'),C(3,'3 - PURPLE'),C(4,'4 - GREY'),C(5,'5 - D BLUE'),C(6,'6 - BLACK')]],
  ['100S12','',[C(1,'1 - L BLUE'),C(2,'2 - RED'),C(3,'3 - PURPLE'),C(4,'4 - GREY'),C(5,'5 - D BLUE'),C(6,'6 - BLACK')]],
  ['100S13','',[C(1,'1 - L BLUE'),C(2,'2 - PINK'),C(3,'3 - TAN'),C(4,'4 - OLIVE'),C(5,'5 - GREY',0),C(6,'6 - RED'),C(7,'7 - D BLUE'),C(8,'8 - BLACK')]],
  ['100S14','',[C(1,'1 - L BLUE'),C(2,'2 - PINK'),C(3,'3 - TAN'),C(4,'4 - MINT'),C(5,'5 - GREY'),C(6,'6 - RED'),C(7,'7 - D BLUE'),C(8,'8 - BLACK')]],
  ['100S15','',[C(1,'1 - L BLUE'),C(2,'2 - PINK'),C(3,'3 - TAN'),C(4,'4 - MINT'),C(5,'5 - PURPLE'),C(6,'6 - GREY')]],
  ['100S16','',[C(1,'1 - BLUE'),C(2,'2 - PINK'),C(3,'3 - TAN'),C(4,'4 - MINT'),C(5,'5 - PURPLE'),C(6,'6 - GREY')]],
  ['100S17','',[C(1,'1 - D BLUE'),C(2,'2 - PINK'),C(3,'3 - PURPLE'),C(4,'4 - RED'),C(5,'5 - R BLUE'),C(6,'6 - BLACK')]],
  ['100S18','',[C(1,'1 - D BLUE'),C(2,'2 - PINK'),C(3,'3 - PURPLE'),C(4,'4 - RED'),C(5,'5 - R BLUE'),C(6,'6 - BLACK')]],
  ['100S18 (60")','60"',[C(1,'1 - D Blue')]],
  ['180B01','',[C(12,'12 - Navy'),C(13,'13 - Black'),C(2,'2 - Purple'),C(6,'6 - Oxford blue'),C(8,'8 - Tan')]],
  ['180B02','',[C(10,'10 - Maroon'),C(11,'11 - Navy'),C(12,'12 - Black'),C(3,'3 - Purple'),C(8,'8 - D.blue'),C(9,'9 - Grey')]],
  ['180B03','',[C(3,'3 - Pink'),C(5,'5 - Black')]],
  ['180B04','',[C(1,'1 - D.blue'),C(4,'4 - Purple')]],
  ['180B05','',[C(5,'5 - Black'),C(10,'10 - Black'),C(3,'3 - M.blue'),C(4,'4 - Lblue'),C(9,'9 - Grey')]],
  ['180B06','',[C(1,'1 - D.blue'),C(2,'2 - M.blue'),C(4,'4 - Peach'),C(9,'9 - Black')]],
  ['180B07','',[C(4,'4 - Purple')]],
  ['180B09','',[C(1,'1 - D.blue'),C(3,'3 - Purple')]],
  ['180B14','',[C(3,'3 - D.blue'),C(4,'4 - R.blue')]],
  ['180B15','',[C(2,'2 - D.blue'),C(4,'4 - Pink')]],
  ['180B16','',[C(3,'3 - Purple'),C(4,'4 - Pink')]],
  ['180B17','',[C(1,'1 - Navy')]],
  ['180B19','',[C(2,'2 - D.blue')]],
  ['250B10','',[C(2,'2 - Purple'),C(3,'3 - Pink'),C(4,'4 - Lblue'),C(5,'5 - D.blue'),C(6,'6 - Black')]],
  ['250B11','',[C(1,'1 - White'),C(2,'2 - D.blue'),C(4,'4 - Pink'),C(5,'5 - Purple')]],
  ['250B12','',[C(1,'1 - White'),C(10,'10 - Lime'),C(2,'2 - D.blue'),C(3,'3 - L.blue'),C(5,'5 - Purple'),C(6,'6 - Grey'),C(7,'7 - Black'),C(8,'8 - Navy')]],
  ['250B13','',[C(1,'1 - White'),C(4,'4 - Pink'),C(5,'5 - Purple')]],
  ['500','',[C(5,'5 - Black Stripes',1545)]],
  ['500 (60")','60"',[C(1,'1 - Red',1723),C(2,'2 - L Blue Stripes',1899),C(3,'3 - D.Blue Stripes',2036),C(4,'4 - Navy Stripes',592),C(6,'6 - Orange Stripes',1553),C(7,'7 - Grey Stripes',1406),C(8,'8 - Pink Stripes',1846)]],
  ['501','',[C(4,'4 - Navy Checks'),C(5,'5 - Black Ckecks',1620)]],
  ['501 (60")','60"',[C(1,'1 - Red Checks',1573),C(2,'2 - L Blue Checks',1960),C(3,'3 - D Blue Checks',1699),C(4,'4 - Navy',1180),C(6,'6 - Orange checks',1654),C(7,'7 - Grey',1759),C(8,'8 - Pink Checks',1552)]],
  ['502','',[C(3,'3 - Red - Blue'),C(4,'4 - Black - Blue')]],
  ['502 (60")','60"',[C(1,'1 - Pink/Blue',1120),C(2,'2 - Yellow/Blue',1180),C(3,'3 - Red - Blue',1587)]],
  ['503','',[C(1,'1 - Navy - Blue')]],
  ['503 (60")','60"',[C(1,'1 - Navy - Blue',1424),C(3,'3 - Pink-Blue',1354)]],
  ['504','',[C(3,'3 - D.Blue Stripes (DC)'),C(4,'4 - Black Stripes (DC)')]],
  ['505','',[C(2,'2 - Red Checks (DC)')]],
  ['506 (60")','60"',[C(1,'1 - Navy',1541),C(2,'2 - Orange',1501),C(4,'4 - Silver',1703)]],
  ['507','',[C(5,'5 - Red Stripes'),C(7,'7 - Black Stripes',1741),C(8,'8 - Plum Stripes (DC)')]],
  ['507 (60")','60"',[C(1,'1 - D.Blue Stripes',1463),C(2,'2 - LBlue Stripes',2049),C(3,'3 - Pink Stripes',1053),C(4,'4 - Navy Stripe',1420),C(5,'5 - Red Stripes',391),C(6,'6 - Silver Stripes',1414)]],
  ['508','',[C(5,'5 - Red Checks',1279),C(6,'6 - Silver Checks',1424),C(7,'7 - Black Checks',1104)]],
  ['508 (60")','60"',[C(1,'1 - D Blue Checks',1570),C(2,'2 - L Blue Checks',1732),C(3,'3 - Pink Checks',1225),C(4,'4 - Navy Checks',1699)]],
  ['509','',[C(1,'1 - Blue'),C(2,'2 - Yellow'),C(3,'3 - Red',1379),C(4,'4 - Pink',1180)]],
  ['509 (60")','60"',[C(1,'1 - L Blue',1440)]],
  ['510 (60")','60"',[C(2,'2 - LBlue',1726),C(3,'3 - Grey',1407),C(4,'4 - Pink-Blue',1557),C(5,'5 - D Blue',1816),C(6,'6 - Purple',1291),C(7,'7 - Black',1596)]],
  ['511 (60")','60"',[C(1,'1 - Red',1124),C(2,'2 - L Blue',1703),C(3,'3 - Grey',1153),C(4,'4 - Pink',1292),C(5,'5 - D Blue',1689),C(6,'6 - Purple',1865),C(7,'7 - Black',614)]],
  ['512 (60")','60"',[C(1,'1 - L Blue',1851),C(2,'2 - Pink',1707),C(3,'3 - D Blue',1806),C(4,'4 - Purple',301),C(5,'5 - Grey',1414)]],
];

(async () => {
  const pool = mysql.createPool({ host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT) || 3306, user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '', database: process.env.DB_NAME || 'plum_erp', charset: 'utf8mb4' });
  const q = (s, p) => pool.query(s, p);
  let total = 0;
  for (const [sku, width, shades] of FAMILIES) {
    let [f] = await q('SELECT id FROM fabrics WHERE sku = ? LIMIT 1', [sku]);
    let fid;
    if (f[0]) fid = f[0].id; else { const [info] = await q("INSERT INTO fabrics (sku, type, name, width, unit, active) VALUES (?, 'Finished', ?, ?, 'หลา', 1)", [sku, sku, width]); fid = info.insertId; }
    const pref = 'SEED-' + sku.replace(/[^A-Za-z0-9]/g, '');
    let n = 0;
    for (const [code, name, stock] of shades) {
      const [has] = await q('SELECT id FROM fabric_shades WHERE fabric_id = ? AND color_code = ? LIMIT 1', [fid, code]);
      if (has[0]) continue;
      const [si] = await q('INSERT INTO fabric_shades (fabric_id, name, color_code) VALUES (?, ?, ?)', [fid, name, code]);
      await q("INSERT INTO fabric_rolls (roll_qr_code, product_id, color_id, initial_yards, current_yards, status, received_at) VALUES (?,?,?,?,?, 'available', NOW())",
        [pref + '-' + code, fid, si.insertId, stock, stock]).catch(() => {});
      n++; total++;
    }
    if (n) console.log('✓', sku, '+' + n);
  }
  console.log('\n🎉 batch5 เพิ่มรวม', total, 'เฉด');
  process.exit(0);
})().catch(e => { console.error('❌', e.message); process.exit(1); });
