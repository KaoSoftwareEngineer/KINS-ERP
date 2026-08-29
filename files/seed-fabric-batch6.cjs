// seed-fabric-batch6.cjs — ตระกูลที่เหลือทั้งหมด (ถอดจากภาพผ้าประจำ). ปลอดภัย+idempotent.
require('dotenv').config();
const mysql = require('mysql2/promise');
const C = (code, name, stock = 1000) => [String(code), name, stock];

const FAMILIES = [
  ['BH (60")','60"',[C(1,'1 - White',2262),C(2,'2 - Pink',1936),C(3,'3 - Purple',839),C(4,'4 - L Blue',2033),C(5,'5 - D.Blue',276),C(6,'6 - R.Blue',1588),C(7,'7 - Grey',2008),C(8,'8 - Navy',1357),C(9,'9 - Black',1603)]],
  ['Canvas - 44"','44"',[C(17,'17 - Plum',950),C(22,'22 - Burgendy',1000),C(3,'3 - Pink',0),C(4,'4 - L Blue',0)]],
  ['Canvas 60"','60"',[C(1,'1 - White',3966),C(10,'10 - Chick Blue',1857),C(13,'13 - Violet',515),C(14,'14 - DK Blue Pink',603),C(15,'15 - Pink Dark Blue',1662),C(16,'16 - M Blue',1867),C(17,'17 - Plum',366),C(18,'18 - L Grey',1902),C(19,'19 - Green',1520),C(2,'2 - Purple',1891),C(20,'20 - Royal Blue',1810),C(21,'21 - Orange',1575),C(22,'22 - Burgendy',524),C(3,'3 - Pink',1909),C(4,'4 - Lt Blue',2424),C(5,'5 - D.Blue',1938),C(6,'6 - Red',1721),C(7,'7 - Black',1381),C(8,'8 - Chic Grey',1792),C(9,'9 - Chic Pink',1618)]],
  ['COP - 44"','44"',[C('B-1','B - 1 BLUE',122),C('B-11','B - 11 BLUE',120),C('B-12','B - 12 BLUE',166),C('B-13','B - 13 BLUE',120),C('B-16','B - 16 BLUE',399),C('B-17','B - 17 BLUE',458),C('B-18','B - 18 BLUE',282),C('B-19','B - 19 BLUE',246),C('B-3','B - 3 BLUE',819),C('B-5','B - 5 BLUE',350),C('B-6','B - 6 BLUE',297),C('BIRDEYE-1','BIRD EYE - 1',4502),C('BIRDEYE-10','BIRD EYE - 10',360),C('BIRDEYE-11','BIRD EYE - 11',626),C('BIRDEYE-2','BIRD EYE - 2',1667),C('BIRDEYE-3','BIRD EYE - 3',1120),C('BIRDEYE-4','BIRD EYE - 4',906),C('BIRDEYE-5','BIRD EYE - 5',1156),C('BIRDEYE-6','BIRD EYE - 6',645),C('BIRDEYE-8','BIRD EYE - 8',1200),C('BIRDEYE-9','BIRD EYE - 9',1085),C('CANVAS-2','CANVAS - 2',699),C('CANVAS-3','CANVAS - 3',360),C('CANVAS-4','CANVAS - 4',360),C('CANVAS-5','CANVAS - 5',733),C('HB-1','HERRING BONE - 1',1208),C('HB-10','HERRING BONE - 10',746),C('HB-2','HERRING BONE - 2',732),C('HB-3','HERRING BONE - 3',1005),C('HB-4','HERRING BONE - 4',60),C('HB-5','HERRING BONE - 5',285),C('HB-6','HERRING BONE - 6',220),C('HB-7','HERRING BONE - 7',117),C('HB-8','HERRING BONE - 8',164),C('HB-9','HERRING BONE - 9',180),C('W-1','W - 1 WHITE',302),C('W-11','W - 11 WHITE',578),C('W-12','W - 12 WHITE',989),C('W-13','W - 13 WHITE',744),C('W-16','W - 16 WHITE',319),C('W-17','W - 17 WHITE',862),C('W-18','W - 18 WHITE',808),C('W-19','W - 19 WHITE',41),C('W-3','W - 3 WHITE',806),C('W-5','W - 5 WHITE',279),C('W-6','W - 6 WHITE',220)]],
  ['Custom Order - La Silky','',[C('WC','WC Blue',0)]],
  ['Custom Order - Lacoste 44"','44"',[C(1,'1 - White'),C(10,'10 - DK Purple'),C(2,'2 - M Blue'),C(3,'3 - D Blue'),C(4,'4 - Lt Grey'),C(5,'5 - Black'),C(6,'6 - L Blue'),C(7,'7 - Pink'),C(8,'8 - Navy'),C(9,'9 - Cream')]],
  ['Custom Order - OV','',[C('ATP','ATP Blue',0)]],
  ['Custom Order - TR','',[C('BK','Black')]],
  ['DBC - 44"','44"',[C('15DC','15 - DC'),C('18B','18B - Soft Pink'),C('18D','18D - LBlue'),C('18E','18E - D.Blue'),C('19','19 -'),C('26B','26B - Soft Pink'),C('26E','26E - D.Blue (DC)',2818),C('26F','26F - Navy (DC)'),C('28C','28C - Purple'),C('28E','28E - D.Blue'),C('3F','3F - Navy'),C('5E','5E - D.Blue'),C('6B','6B - Soft Pink',1917),C('6E','6E - D.Blue'),C('6F','6F - Navy'),C('8C','8C - Purple')]],
  ['DBC 60"','60"',[C(11,'11 - White',1826),C(12,'12 - White',816),C(16,'16 - White',1508),C(18,'18 - White',1831),C('18B','18B - Pink',1225),C('18C','18C - Purple',1329),C('18D','18D - LBlue',1235),C('18E','18E - D Blue',391),C('18F','18F - Navy',1809),C('18G','18G - Black',1801),C(19,'19 - White',1612),C(20,'20 - White',2383),C(21,'21 - White',1473),C(22,'22 - White',1381),C(23,'23 - White',1177),C(26,'26 - White',4068),C(27,'27 - White',2550),C(28,'28 - White',2079),C('28D','28D - L Blue',1939),C('28E','28E - D Blue',606),C('28F','28F - Navy',1811),C('28G','28G - Black',1510),C(3,'3 - White',3090),C(30,'30 - White',2363),C('30B','30B - Pink',1398),C('30C','30C - Purple',1660),C('30D','30D - LBlue',2008),C('30E','30E - D Blue',2425),C('30F','30F - Navy',1534),C('30G','30G - Black',1778),C('3B','3B - Pink',1846),C('3C','3C - Purple',1524),C('3D','3D - L Blue',2000),C('3E','3E - D.Blue',1354),C('3F','3F - Navy',1553),C('3G','3G - Black',1869),C(4,'4 - White',2851),C(5,'5 - White',1775),C('5B','5B - Pink',1789),C('5C','5C - Purple',1733),C('5D','5D - LBlue',2460),C('5E','5E - D Blue',1734),C('5F','5F - Navy',1185),C('5G','5G - Black',1804),C(6,'6 - White',4328),C('6C','6C - Purple',1662),C('6D','6D - LBlue',1797),C(7,'7 - White',1683),C(8,'8 - White',2498),C('8B','8B - Pink',1603),C('8C','8C - Purple',2245),C('8D','8D - LBlue',1964),C('8E','8E - D Blue',1952),C('8F','8F - Navy',1421),C('8G','8G - Black',1771),C(9,'9 - White',1661)]],
  ['DK','',[C(602,'602 - White'),C(605,'605 - Purple'),C(607,'607 - R Blue'),C(610,'610 - Pink'),C(616,'616 - Pink'),C(618,'618 - Purple'),C(619,'619 - Blue'),C(620,'620 - D Blue'),C(621,'621 - Red/Black'),C(622,'622 - Purple/Black'),C(623,'623 - Green/Navy'),C(624,'624 - Brown/Navy')]],
  ['DK200 (44")','44"',[C(11,'11 - Maroon'),C(12,'12 - D-Purple'),C(13,'13 - Navy Blue'),C(14,'14 - Brown',1681),C(3,'3 - Pink',1878),C(7,'7 - R-Blue')]],
  ['DK200 (60")','60"',[C(1,'1 - White',1611)]],
  ['DK201 (44")','44"',[C(6,'6 - Purple (DC)')]],
  ['DK201 (60")','60"',[C(1,'1 - L Blue',1686),C(2,'2 - D Blue',1993),C(3,'3 - Black',1643),C(4,'4 - Pink',1983),C(5,'5 - Grey',1353),C(8,'8 - Green',1695)]],
  ['DK202 (44")','44"',[C(3,'3 - Black'),C(7,'7 - Red')]],
  ['DK202 (60")','60"',[C(1,'1 - L-Blue',1431),C(2,'2 - D Blue',1592),C(3,'3 - Black',1742),C(4,'4 - Pink',1392),C(5,'5 - Grey',1429),C(7,'7 - Red',224),C(8,'8 - Green',1299)]],
  ['DK203 (44")','44"',[C(1,'1 - L-Blue',686),C(2,'2 - Pink',1750),C(3,'3 - Purple',1111),C(5,'5 - Navy Blue'),C(6,'6 - Red'),C(7,'7 - Black',1048)]],
  ['DK204 (44")','44"',[C(1,'1 - L-Blue',1295),C(2,'2 - Pink'),C(4,'4 - D-Blue'),C(5,'5 - Navy Blue')]],
  ['DK205','',[C(2,'2 - Red',0),C(4,'4 - Purple')]],
  ['DK206','',[C(1,'1 - Blue'),C(2,'2 - Red',100)]],
  ['DK207','',[C(1,'1 - Red'),C(2,'2 - Green')]],
  ['DK209','',[C(1,'1 - Pink'),C(2,'2 - L-Blue',0),C(3,'3 - Turq',0),C(5,'5 - Purple')]],
  ['DK210','',[C(1,'1 - Pink',1180),C(3,'3 - Turq'),C(4,'4 - Yellow')]],
  ['DK211','',[C(2,'2 - Blue-Brown'),C(3,'3 - Yellow-Purple'),C(4,'4 - Green')]],
  ['DK212','',[C(1,'1 - Pink-Black')]],
  ['DK213','',[C(1,'1 - Pink-Black'),C(4,'4 - Turq-Purple'),C(5,'5 - Red-Grey'),C(6,'6 - Green-R Blue'),C(7,'7 - Brown-Navy')]],
  ['DK214 (60")','60"',[C(2,'2 - Blue-Brown',1782),C(3,'3 - Yellow-R Blue',1286),C(4,'4 - Turq-Purple',1377),C(6,'6 - Green-R Blue',1239),C(7,'7 - Brown-Navy',1332)]],
  ['DK215','',[C(2,'2 - Yellow')]],
  ['DK217 (60")','60"',[C(1,'1 - L Blue',2990),C(2,'2 - D.Blue',3109),C(3,'3 - Navy',2332),C(4,'4 - Pink',1918),C(5,'5 - Red',1489),C(6,'6 - Black',1572)]],
  ['DK218 (60")','60"',[C(1,'1 - L Blue',1986),C(2,'2 - D.Blue',1920),C(3,'3 - Navy',1774),C(4,'4 - Pink',1410),C(5,'5 - Red',1495),C(6,'6 - Black',1590)]],
  ['DK221','',[C(1,'1 - Grey'),C(3,'3 - Yellow'),C(4,'4 - Orange')]],
  ['DK222','',[C(1,'1 - Grey'),C(2,'2 - Purple')]],
  ['DK223','',[C(2,'2 - Purple'),C(3,'3 - Green'),C(5,'5 - Navy')]],
  ['DK224','',[C(2,'2 - Purple'),C(3,'3 - Green')]],
  ['DOX (44")','44"',[C(11,'11 - Navy',185)]],
  ['DOX (60")','60"',[C(1,'1 - White',2206),C(14,'14 - Black',1663),C(2,'2 - Pink',1419),C(5,'5 - L Blue',1248),C(6,'6 - M.Blue',1700),C(7,'7 - D Blue',1365),C(8,'8 - Blue Jean',1747),C(9,'9 - Black Jeans',1615)]],
  ['DP4500','',[C(1,'1 - White',9558),C(10,'10 - Super Black',2175),C(11,'11 - Vilolet Indigo',1232),C(12,'12 - French Pink',1233),C(13,'13 - Brown',1060),C(14,'14 - Navy Blue',2193),C(15,'15 - Red',1415),C(16,'16 - Tangerine',1585),C(17,'17 - Dark Grey',2286),C(18,'18 - Bumble Bee',1409),C(19,'19 - Maroon',1060),C(2,'2 - Pink',2181),C(20,'20 - Cobalt Blue',1852),C(21,'21 - Light Yellow',1000),C(22,'22 - Lavender',1540),C(24,'24 - Dodger Blue',2367),C(25,'25 - Turquoise',1260),C(26,'26 - Cerulean',1933),C(27,'27 - Teal',1211),C(28,'28 - Green',1707),C(29,'29 - Pure White',2664),C(3,'3 - Cream',1521),C(30,'30 - Lemon Chiffon',1936),C(31,'31 - Melon',1000),C(32,'32 - Amethyst',1000),C(33,'33 - Wine',1747),C(4,'4 - Purple',1388),C(5,'5 - Grey',2379),C(6,'6 - Tan',2314),C(7,'7 - Light Blue',2952),C(8,'8 - M Blue',2900),C(9,'9 - Corn Flower Blue',1418)]],
  ['FS-LA Custom White','',[C('CW','Custom White',839)]],
  ['HerringBones (60")','60"',[C(1,'1 - White',2756),C(2,'2 - Pink',1673.50),C(3,'3 - Purple',667),C(5,'5 - L Blue',524),C(6,'6 - D.Blue',602),C(7,'7 - Royal Blue',1324),C(9,'9 - Grey',1453)]],
  ['La Silky (44")','44"',[C(1,'1 - White',7272)]],
  ['La Silky (60")','60"',[C(1,'1 - White',11132),C(10,'10 - Black',2033),C(11,'11 - Navy',5048),C(12,'12 - Plain Blue',1347),C(13,'13 - Red',1417.50),C(14,'14 - Plain Royal',420),C(15,'15 - Turquoise',642),C(16,'16 - Silver',1365),C(17,'17 - Oxford Blue',1833),C(18,'18 - Dark Grey',1439),C(19,'19 - Plum',1453),C(2,'2 - Pink',1882),C(20,'20 - Brown',2178),C(3,'3 - Purple',2054),C(4,'4 - Cream',1846),C(5,'5 - Green',1471),C(6,'6 - L Blue',2647),C(7,'7 - D Blue',3168),C(8,'8 - R Blue',1765),C(9,'9 - Grey',1474)]],
  ['N White','',[C(10,'10 - White'),C(12,'12 - White'),C(16,'16 - White'),C(19,'19 - White'),C(20,'20 - White'),C(22,'22 - White'),C(25,'25 - White'),C(29,'29 - White'),C(3,'3 - White'),C(30,'30 - White'),C(31,'31 - White'),C(34,'34 - White'),C(5,'5 - White')]],
  ['N6000','',[C(10,'10 - Dark Pink'),C(11,'11 - Blue Jeans'),C(2,'2 - Pink'),C(3,'3 - Mint'),C(4,'4 - Yellow'),C(5,'5 - Orange'),C(6,'6 - L.Blue'),C(7,'7 - Purple'),C(8,'8 - E.blue'),C(9,'9 - Oxford blue')]],
  ['N6001','',[C(1,'1 - Solid Blue'),C(2,'2 - Solid Pink'),C(3,'3 - Solid Green'),C(4,'4 - Mustard'),C(5,'5 - D.Purple'),C(6,'6 - Brown',0),C(9,'9 - Plum')]],
  ['N6002','',[C(11,'11 - D.Purple'),C(12,'12 - D.Red'),C(13,'13 - Plum'),C(15,'15 - ASH Grey'),C(2,'2 - Beige'),C(7,'7 - Grey'),C(8,'8 - Gold'),C(9,'9 - Brick')]],
  ['N6003','',[C(1,'1 - Gold(L)'),C(12,'12 - Purple'),C(13,'13 - Black'),C(15,'15 - Plum'),C(4,'4 - Orange'),C(6,'6 - Geddish Grey'),C(7,'7 - Royal Blue')]],
  ['N6004','',[C(2,'2 - Plum'),C(3,'3 - Royal Blue')]],
  ['N6005','',[C(1,'1 - Shocking Pink'),C(4,'4 - Grey')]],
  ['N6006','',[C(2,'2 - Beige'),C(3,'3 - Grey'),C(6,'6 - D.Blue'),C(7,'7 - Black')]],
  ['N6007','',[C(1,'1 - White'),C(11,'11 - D.Grey'),C(12,'12 - Navy Red'),C(13,'13 - Turquoise'),C(14,'14 - Maroon'),C(2,'2 - Pink'),C(3,'3 - Yellow'),C(7,'7 - D.Blue'),C(9,'9 - Lacoste Blue')]],
  ['N6008','',[C(1,'1 - Turquoise'),C(2,'2 - Pink'),C(3,'3 - Yellow')]],
  ['N6009','',[C(2,'2 - Pink')]],
  ['N6010','',[C(10,'10 - Black'),C(3,'3 - Green'),C(7,'7 - D.blue'),C(8,'8 - Red')]],
  ['N6011','',[C(3,'3 - Pink')]],
  ['N6012','',[C(1,'1 - White'),C(5,'5 - D.blue')]],
  ['N6013','',[C(3,'3 - Purple'),C(4,'4 - Grey')]],
  ['N6014','',[C(1,'1 - Blue'),C(2,'2 - Maroon'),C(3,'3 - Silver'),C(4,'4 - ASH')]],
  ['N6015','',[C(2,'2 - Grey'),C(6,'6 - ASH')]],
  ['N6016','',[C(2,'2 - Pink'),C(3,'3 - M.blue')]],
  ['Nano Wrinkle Free','',[C(1,'1 - White'),C(10,'10 - Royal Blue'),C(11,'11 - Navy Blue'),C(3,'3 - Dk.Blue'),C(4,'4 - M Blue'),C(6,'6 - Light Blue'),C(7,'7 - Pink'),C(8,'8 - purple')]],
];

// Fabrizio ต่อ (14164-14165, 15001-15015, DPL) — เพิ่มเข้าตระกูล Fabrizio เดิม
const FABRIZIO_MORE = [
  C('14164','14164 - Dk.Navy',1382.40),C('14165','14165 - Dk.Brown',1175.80),
  C('15001','15001 - White Base',3050),C('15002','15002 - Two-Tone Blue',4939),C('15003','15003 - Light Blue',1432),C('15004','15004 - Powder Blue',1649),C('15005','15005 - Medium Blue',1541),C('15006','15006 - Dark Blue',1000),C('15007','15007 - Pink',1532),C('15008','15008 - Lavender',1000),C('15009','15009 - Lime',1580),C('15010','15010 - Silver',1000),C('15011','15011 - Dk Grey',1000),C('15012','15012 - Oxford Blue',1000),C('15013','15013 - Royal Blue',1415),C('15014','15014 - Navy Blue',1000),C('15015','15015 - Black',1814),
  C('DPL11','DPL 11 - Orange',304),C('DPL4','DPL 4 - Plum',1473),C('DPL8','DPL 8 - Royal Blue',0),
];

(async () => {
  const pool = mysql.createPool({ host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT) || 3306, user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '', database: process.env.DB_NAME || 'plum_erp', charset: 'utf8mb4' });
  const q = (s, p) => pool.query(s, p);
  async function addTo(fid, pref, shades) {
    let n = 0;
    for (const [code, name, stock] of shades) {
      const [has] = await q('SELECT id FROM fabric_shades WHERE fabric_id = ? AND color_code = ? LIMIT 1', [fid, code]);
      if (has[0]) continue;
      const [si] = await q('INSERT INTO fabric_shades (fabric_id, name, color_code) VALUES (?, ?, ?)', [fid, name, code]);
      await q("INSERT INTO fabric_rolls (roll_qr_code, product_id, color_id, initial_yards, current_yards, status, received_at) VALUES (?,?,?,?,?, 'available', NOW())",
        [pref + '-' + code, fid, si.insertId, stock, stock]).catch(() => {});
      n++;
    }
    return n;
  }
  let total = 0;
  for (const [sku, width, shades] of FAMILIES) {
    let [f] = await q('SELECT id FROM fabrics WHERE sku = ? LIMIT 1', [sku]);
    let fid;
    if (f[0]) fid = f[0].id; else { const [info] = await q("INSERT INTO fabrics (sku, type, name, width, unit, active) VALUES (?, 'Finished', ?, ?, 'หลา', 1)", [sku, sku, width]); fid = info.insertId; }
    const n = await addTo(fid, 'SEED-' + sku.replace(/[^A-Za-z0-9]/g, ''), shades);
    total += n;
    if (n) console.log('✓', sku, '+' + n);
  }
  const [rf] = await q("SELECT id FROM fabrics WHERE sku = 'Fabrizio' LIMIT 1");
  if (rf[0]) { const n = await addTo(rf[0].id, 'SEED-FAB2', FABRIZIO_MORE); total += n; console.log('✓ Fabrizio เพิ่ม +' + n); }
  console.log('\n🎉 batch6 เพิ่มรวม', total, 'เฉด');
  process.exit(0);
})().catch(e => { console.error('❌', e.message); process.exit(1); });
