// seed-fabric-fabrizio.cjs — ผ้า "Fabrizio" 14001-14163 (163 เฉดสี) ตามภาพหน้ารายงานจุดสั่งซื้อ
// ถอดจาก screenshot ผู้ใช้ — ควร spot-check ความถูกต้องอีกที. idempotent.
require('dotenv').config();
const mysql = require('mysql2/promise');

// [รหัสสี(เลข), ชื่อสี, จำนวนสต็อก]
const DATA = [
  ['14001','White',1757],['14002','Blue',4877],['14003','M.Blue',1242],['14004','Purple',1241],['14005','Grey',1108],
  ['14006','White',1873],['14007','M.Blue',1239],['14008','Blue',1361],['14009','Pink',1788],['14010','Purple',1643],
  ['14011','Red/Lt.Blue',1249],['14012','Blue/Lt.Blue',1533],['14013','Black/Lt.Blue',1139],['14014','Black/Grey',1634],['14015','Jet Black',2283],
  ['14016','Lt.Blue',2318],['14017','Lilac Blue',2672],['14018','Blue',1768],['14019','M.Blue',2633.40],['14020','Lake Blue',2418],
  ['14021','Pink',2666],['14022','Purple',1164.60],['14023','Orange Red',1048.30],['14024','Navy',1596],['14025','Dk.Coal Grey',1842.10],
  ['14026','Black',1830.10],['14027','White',1880],['14028','Blue',1814],['14029','M.Blue',1452],['14030','Pink',1335],
  ['14031','Grey',1691.40],['14032','Black',1826],['14033','M.Blue/Blue',1467],['14034','Pink/Blue',1945],['14035','Red/Blue',1736],
  ['14036','Black/Grey',1240],['14037','White',1394],['14038','Blue',1228],['14039','Lt.Blue',1403],['14040','Grey',1703],
  ['14041','Navy',1357],['14042','Black',1482],['14043','Blue',1180],['14044','Pink',1377],['14045','M.Blue/Blue',1360],
  ['14046','Blue/Red',1060],['14047','M.Blue',1240],['14048','Purple',1325],['14049','Blue',1481],['14050','Blue/Brown',1354],
  ['14051','Bue/Red',1593],['14052','Blue/Green',1193],['14053','Blue/Lt.Blue',1962],['14054','Blue/Red',1728],['14055','Blue/Purple',1427],
  ['14056','Navy Base',1673],['14057','Black Base',1819.50],['14058','White Base',1908],['14059','Blue Base',1525.30],['14060','Black Base',1174.20],
  ['14061','Navy',1904.40],['14062','Lt.Blue',1419],['14063','Purple',1724],['14064','Lt.Blue/Pink',1712],['14065','Lt.Blue/Green',1792],
  ['14066','Navy/M.Blue',1842],['14067','Blue/White',1196.80],['14068','Blue',1246],['14069','Purple',1478],['14070','Blue/Navy',1897],
  ['14071','M.Blue/Brown',1578],['14072','M.Blue/Purple',1473],['14073','Navy/White',1161.70],['14074','Blue/White',1585],['14075','Purple/White',2275.80],
  ['14076','Red/White',1307.20],['14077','Black/White',1093.70],['14078','Navy/Black',1231.20],['14079','M.Blue/White',1714],['14080','Pink/White',1109.10],
  ['14081','Purple/White',1441],['14082','Black/White',1826],['14083','Blue/Beige',1828],['14084','Blue/M.Blue',1632],['14085','Blue/Red',1349],
  ['14086','Blue/Brown',1308],['14087','Blue Base',1000],['14088','Navy Base',1170.60],['14089','Black Base',1212.40],['14090','Blue',1987],
  ['14091','Yellow',1585],['14092','Pink',1557],['14093','Green',1769],['14094','Blue/Brown',1414],['14095','Blue/Red',1448],
  ['14096','Red/Pink',1373.90],['14097','Blue/Blue',2666],['14098','Blue/Orange',1171],['14099','M.Blue',1348],['14100','Blue',1404],
  ['14101','Purple',1750],['14102','Purple',1604],['14103','Blue',1563],['14104','Pink',1868],['14105','Pink/M.Blue',1539],
  ['14106','Blue/Grey',1246],['14107','Pink/Blue',1415],['14108','Red/Blue',1352],['14109','M.Blue/Blue',1000],['14110','M.Blue',1485.40],
  ['14111','Blue',1000],['14112','Purple',1696],['14113','Grey',2004.60],['14114','M.Blue/Pink',1732],['14115','Lt.Blue/Pink',1686],
  ['14116','Dk.Navy/Pink',1633],['14117','M.Blue/Pink',1820],['14118','Lt.Blue/Pink',1940],['14119','Dk.Navy/Pink',1806],['14120','Pink',1136.60],
  ['14121','Bule',1657],['14122','Purple',1894.80],['14123','M.Blue',1233.80],['14124','Pink',1261.70],['14125','Brown',1964.60],
  ['14126','Blue',1312],['14127','Yellow',1658.20],['14128','Pink',1135],['14129','Green',1691],['14130','Blue/Red',1160.10],
  ['14131','Blue/Lt.Green',1086.40],['14132','Blue Base',1213.90],['14133','Navy Base',1282],['14134','Blue',1152],['14135','Red',1488],
  ['14136','Brown',1615],['14137','Green',1519],['14138','D Blue',1744],['14139','L Blue',1886.20],['14140','Red',1822.40],
  ['14141','Brown',1405],['14142','Navy',2014.80],['14143','Red',1585.80],['14144','Blue',1849.50],['14145','Navy Dobby',1000],
  ['14146','Purple Dobby',1306.20],['14147','Blue Dobby',1078.20],['14148','Blue Base',1238.90],['14149','Pink Base',1186.50],['14150','Blue',1173.10],
  ['14151','Red',1193.30],['14152','Brown',1202.70],['14153','Green',1771],['14154','Navy/Beige',1584],['14155','Green/Grey',1317.10],
  ['14156','Red',1167.90],['14157','M.Blue',1097.80],['14158','M.Blue',1338.10],['14159','Red',1652],['14160','Brown',1631],
  ['14161','Navy',1629],['14162','Blue',1828],['14163','M.Blue',1174],
];

(async () => {
  const pool = mysql.createPool({ host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT) || 3306, user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '', database: process.env.DB_NAME || 'plum_erp', charset: 'utf8mb4' });
  const q = (s, p) => pool.query(s, p);
  const SKU = 'Fabrizio';

  const [ex] = await q('SELECT id FROM fabrics WHERE sku = ? LIMIT 1', [SKU]);
  if (ex[0]) { await q('DELETE FROM fabric_rolls WHERE product_id = ?', [ex[0].id]); await q('DELETE FROM fabrics WHERE id = ?', [ex[0].id]); }

  const [info] = await q("INSERT INTO fabrics (sku, type, name, width, unit, active) VALUES (?, 'Finished', ?, '58\"', 'หลา', 1)", [SKU, SKU]);
  const fabricId = info.insertId;

  let n = 0;
  for (const [code, color, stock] of DATA) {
    const shadeName = code + ' - ' + color;
    const [si] = await q('INSERT INTO fabric_shades (fabric_id, name, color_code) VALUES (?, ?, ?)', [fabricId, shadeName, code]);
    const qr = 'SEED-FAB-' + code;
    await q("INSERT INTO fabric_rolls (roll_qr_code, product_id, color_id, initial_yards, current_yards, status, received_at) VALUES (?,?,?,?,?, 'available', NOW())",
      [qr, fabricId, si.insertId, stock, stock]);
    n++;
  }
  console.log('✓ Fabrizio:', n, 'เฉดสี (14001-14163) + สต็อก');
  process.exit(0);
})().catch(e => { console.error('❌', e.message); process.exit(1); });
