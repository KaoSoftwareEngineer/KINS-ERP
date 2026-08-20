// ============================================================
//  db-mysql.js — เชื่อมต่อ MySQL (kins_erp) — เก็บ "ทุกข้อมูล" ของระบบ
//  ผู้ใช้งาน/ล็อกอิน + ผ้าประจำ/ผ้าไม่ประจำ/เฉดสี/ข้อมูลผ้า/ลูกค้า/ออร์เดอร์
//  ทั้งหมดอยู่ใน MySQL ตัวเดียว (เปิดดูได้ใน phpMyAdmin)
// ============================================================
require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kins_erp',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
  namedPlaceholders: true,
});

// ------------------------------------------------------------
//  เพิ่มคอลัมน์ให้ตารางเดิมแบบปลอดภัย (ถ้ายังไม่มี)
// ------------------------------------------------------------
async function ensureColumn(table, column, definition) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS c FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column]
  );
  if (rows[0].c === 0) {
    await pool.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
    console.log(`  ➕ เพิ่มคอลัมน์ ${table}.${column}`);
  }
}

// ------------------------------------------------------------
//  สร้างตารางทั้งหมด (ถ้ายังไม่มี)
// ------------------------------------------------------------
async function initTables() {
  // ---- ผู้ใช้งาน ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      name       VARCHAR(255),
      email      VARCHAR(255) NOT NULL UNIQUE,
      phone      VARCHAR(20),
      avatar     MEDIUMTEXT,
      password   VARCHAR(255) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  // บทบาท/ตำแหน่งของผู้ใช้ (CEO/พนักงานคลัง/ส่งของ/บัญชี/รับออเดอร์/ตัดผ้า ฯลฯ)
  await ensureColumn('users', 'role', "VARCHAR(64) NOT NULL DEFAULT ''");
  // เพศ (male/female/'')
  await ensureColumn('users', 'gender', "VARCHAR(10) NOT NULL DEFAULT ''");
  // อายุ
  await ensureColumn('users', 'age', "INT NULL");

  // ---- บทบาท + สิทธิ์การเข้าถึง (permissions = JSON array ของ key เมนู) ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS roles (
      name        VARCHAR(64) PRIMARY KEY,
      permissions MEDIUMTEXT,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  // seed สิทธิ์เต็มให้บทบาท "CEO / ผู้บริหาร" (ถ้ายังไม่มี) — กันผู้บริหารโดนล็อกเมนูตัวเอง
  // หลังจากเปลี่ยนนโยบายเป็น "เฉพาะ Admin เต็มสิทธิ์ตายตัว" (ลด/แก้สิทธิ์ได้ผ่านหน้าสิทธิ์)
  {
    const FULL_PERMS = [
      'user-permissions','users','report-stock','report-vat-stock','report-po','report-dye-order',
      'report-sales-contract','report-order','report-sales','report-tax-invoice','report-profit-loss',
      'report-customer-account','report-partner-account','report-annual-summary','report-reorder-point','report-others',
      'pay-partner','deduct-partner-account','credit-note-partner','billing-customer','receive-payment-customer',
      'deduct-customer-account','credit-note-customer','order-receive','order-fulfill','invoice-open','invoice-return',
      'sales-contract','receive-fabric-finished','receive-fabric-raw','receive-fabric-dyed','move-stock','move-fabric-raw',
      'move-shelf','barcode','stock-history','vat-product-group','vat-receive','vat-stock-cut','vat-invoice',
      'vat-stock-cut-from-invoice','po-fabric-finished','po-fabric-raw','po-dye-order','fabric-regular','fabric-regular-group',
      'fabric-irregular','fabric-irregular-group','fabric-raw','customers','partners','fabric-info','employee-info',
      'note-info','zone-rack','act.add','act.edit','act.delete','act.approve','act.cancel','act.export',
      'act.viewBuyPrice','act.viewSellPrice','act.viewTotal',
    ];
    const [allRoles] = await pool.query('SELECT name, permissions FROM roles');
    if (!allRoles.some(r => r.name === 'CEO / ผู้บริหาร')) {
      const adminRole = allRoles.find(r => /Admin|ผู้ดูแล/i.test(r.name));
      const perms = adminRole && adminRole.permissions ? adminRole.permissions : JSON.stringify(FULL_PERMS);
      await pool.query('INSERT INTO roles (name, permissions) VALUES (?, ?)', ['CEO / ผู้บริหาร', perms]);
      console.log('  ➕ seed สิทธิ์เต็มให้บทบาท "CEO / ผู้บริหาร"');
    }
  }

  // ---- ข้อมูลผ้า (master data): โครงสร้าง/ส่วนประกอบ/หน้ากว้าง/Finishing/น้ำหนัก ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS master_data (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      category   VARCHAR(32) NOT NULL,
      name       VARCHAR(255) NOT NULL,
      active     TINYINT DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_md_cat (category)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  // ฟิลด์พิเศษ: หลาส่งขั้นต่ำ (ใช้เฉพาะ category=width)
  await ensureColumn('master_data', 'min_yards', 'DOUBLE NULL');
  // seed จากค่า distinct ที่มีจริงในตารางผ้า (ครั้งแรกเท่านั้น ต่อ category)
  const mdMap = { structure: 'structure', composition: 'composition', width: 'width', finishing: 'finishing', weight: 'weight' };
  for (const [cat, col] of Object.entries(mdMap)) {
    const [[{ c }]] = await pool.query('SELECT COUNT(*) AS c FROM master_data WHERE category = ?', [cat]);
    if (c === 0) {
      await pool.query(
        `INSERT INTO master_data (category, name)
         SELECT DISTINCT ?, TRIM(v) FROM (
           SELECT \`${col}\` AS v FROM fabrics WHERE \`${col}\` IS NOT NULL AND TRIM(\`${col}\`) <> ''
           UNION
           SELECT \`${col}\` AS v FROM fabric_irregular WHERE \`${col}\` IS NOT NULL AND TRIM(\`${col}\`) <> ''
         ) t ORDER BY v ASC`,
        [cat]
      );
    }
  }

  // ---- ข้อมูลหมายเหตุ (note_info) ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS note_info (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      note_type   VARCHAR(64) DEFAULT '',
      description TEXT,
      active      TINYINT DEFAULT 1,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  const [[{ nic }]] = await pool.query('SELECT COUNT(*) AS nic FROM note_info');
  if (nic === 0) {
    await pool.query(`INSERT INTO note_info (note_type, description) VALUES ('สั่งผ้าสำเร็จ', 'Description')`);
  }

  // ---- ผ้าดิบ (fabric_raw / greige) ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS fabric_raw (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      type        VARCHAR(64) DEFAULT 'Greige',
      sku         VARCHAR(64) NOT NULL,
      name        VARCHAR(255) DEFAULT '',
      structure   VARCHAR(255) DEFAULT '',
      composition VARCHAR(255) DEFAULT '',
      width       VARCHAR(64) DEFAULT '',
      unit        VARCHAR(32) DEFAULT 'หลา',
      shrinkage   DOUBLE DEFAULT 0,
      allowance   DOUBLE DEFAULT 0,
      image_name  VARCHAR(255) DEFAULT '',
      active      TINYINT DEFAULT 1,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  const [[{ frawc }]] = await pool.query('SELECT COUNT(*) AS frawc FROM fabric_raw');
  if (frawc === 0) {
    await pool.query(`INSERT INTO fabric_raw (type, sku, name, structure, composition, width, unit, shrinkage, allowance) VALUES
      ('Greige', 'G001', 'anything', 'Cotton 100%', '', '', 'หลา', 3, 5),
      ('Greige', 'G002', 'anything', 'Cotton 100%', '', '', 'หลา', 3, 5),
      ('Greige', 'G003', 'anything', 'Cotton 100%', '', '', 'หลา', 3, 5)`);
    console.log('  ➕ ใส่ข้อมูลผ้าดิบตัวอย่าง 3 รายการ');
  }

  // ---- คู่ค้า / ผู้ขาย (partners) ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS partners (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      code        VARCHAR(32) DEFAULT '',
      name        VARCHAR(255) NOT NULL,
      phone       VARCHAR(32) DEFAULT '',
      email       VARCHAR(255) DEFAULT '',
      address     TEXT,
      tax_id      VARCHAR(20) DEFAULT '',
      contact     VARCHAR(255) DEFAULT '',
      note        TEXT,
      active      TINYINT DEFAULT 1,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  // ใส่ข้อมูลตัวอย่างถ้ายังว่าง
  const [[{ pc }]] = await pool.query('SELECT COUNT(*) AS pc FROM partners');
  if (pc === 0) {
    await pool.query(`INSERT INTO partners (code, name, phone, email, tax_id, contact) VALUES
      ('V-001', 'D Finest Fabric', '02-391-5737', 'info@dfinest.co.th', '0105551234567', 'คุณเก่า'),
      ('V-002', 'บจก. สยามเทรดดิ้ง', '02-222-3333', 'sale@siamtrading.co.th', '0105549876543', 'คุณสมชาย'),
      ('V-003', 'หจก. เอเชียยาร์น', '02-444-5555', 'contact@asiayarn.com', '0105547654321', 'คุณสมหญิง'),
      ('V-004', 'บจก. ไทยเท็กซ์ไทล์', '02-666-7777', 'info@thaitextile.co.th', '0105543216549', 'คุณวิชัย'),
      ('V-005', 'โรงย้อมรุ่งเรือง', '02-888-9999', 'rungrueng.dye@gmail.com', '0105541122334', 'คุณมานะ')`);
    console.log('  ➕ ใส่ข้อมูลคู่ค้าตัวอย่าง 5 ราย');
  }
  // คอลัมน์เพิ่มเติมของคู่ค้า (ตามหน้าจัดการคู่ค้า)
  await ensureColumn('partners', 'check_name', "VARCHAR(255) DEFAULT ''");   // ชื่อที่ออกเช็ค
  await ensureColumn('partners', 'country', "VARCHAR(64) DEFAULT ''");        // ประเทศ
  await ensureColumn('partners', 'pgroup', "VARCHAR(64) DEFAULT ''");         // กลุ่มคู่ค้า
  await ensureColumn('partners', 'account_term', "VARCHAR(64) DEFAULT ''");   // เงื่อนไขบัญชี

  // ---- โรงงาน / โรงย้อม (factories) ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS factories (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      code        VARCHAR(32) DEFAULT '',
      name        VARCHAR(255) NOT NULL,
      type        VARCHAR(64) DEFAULT '',
      phone       VARCHAR(32) DEFAULT '',
      address     TEXT,
      contact     VARCHAR(255) DEFAULT '',
      note        TEXT,
      active      TINYINT DEFAULT 1,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  const [[{ fc }]] = await pool.query('SELECT COUNT(*) AS fc FROM factories');
  if (fc === 0) {
    await pool.query(`INSERT INTO factories (code, name, type, phone, contact) VALUES
      ('F-001', 'D Finest', 'โรงย้อม', '02-391-5737', 'คุณเก่า'),
      ('F-002', 'โรงย้อมรุ่งเรือง', 'โรงย้อม', '02-888-9999', 'คุณมานะ'),
      ('F-003', 'โรงย้อมสยามคัลเลอร์', 'โรงย้อม', '02-111-2222', 'คุณศักดิ์'),
      ('F-004', 'โรงทอไทยเท็กซ์ไทล์', 'โรงทอ', '02-666-7777', 'คุณวิชัย')`);
    console.log('  ➕ ใส่ข้อมูลโรงงานตัวอย่าง 4 ราย');
  }

  // ---- ใบสั่งซื้อ (purchase_orders) — ผ้าสำเร็จ/ผ้าดิบ/สั่งย้อม ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS purchase_orders (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      po_no        VARCHAR(32) NOT NULL,
      po_type      VARCHAR(24) NOT NULL DEFAULT 'finished',
      po_date      VARCHAR(20) DEFAULT '',
      vendor       VARCHAR(255) DEFAULT '',
      account_term VARCHAR(64) DEFAULT '',
      ship_to      VARCHAR(64) DEFAULT '',
      remark       TEXT,
      ref_no       VARCHAR(64) DEFAULT '',
      ship_date    VARCHAR(20) DEFAULT '',
      approved     TINYINT DEFAULT 0,
      subtotal     DOUBLE DEFAULT 0,
      discount     DOUBLE DEFAULT 0,
      vat          DOUBLE DEFAULT 0,
      net_total    DOUBLE DEFAULT 0,
      items_json   MEDIUMTEXT,
      created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // ---- ใบสั่งย้อม (dye_orders) ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS dye_orders (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      dye_no       VARCHAR(32) NOT NULL,
      dye_date     VARCHAR(20) DEFAULT '',
      factory      VARCHAR(255) DEFAULT '',
      ref_no       VARCHAR(64) DEFAULT '',
      ship_date    VARCHAR(20) DEFAULT '',
      approved     TINYINT DEFAULT 0,
      raw_json     MEDIUMTEXT,
      product_json MEDIUMTEXT,
      items_json   MEDIUMTEXT,
      sample_json  MEDIUMTEXT,
      packing_json MEDIUMTEXT,
      stamping_json MEDIUMTEXT,
      remark       TEXT,
      subtotal     DOUBLE DEFAULT 0,
      discount     DOUBLE DEFAULT 0,
      vat          DOUBLE DEFAULT 0,
      net_total    DOUBLE DEFAULT 0,
      created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // ---- เอกสารรับผ้าสำเร็จ (finished_receipts) ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS finished_receipts (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      in_no         VARCHAR(32) NOT NULL,
      receipt_date  VARCHAR(20) DEFAULT '',
      receipt_type  VARCHAR(32) DEFAULT 'Purchase',
      warehouse     VARCHAR(64) DEFAULT 'Warehouse',
      po_ref        VARCHAR(64) DEFAULT '',
      supplier      VARCHAR(255) DEFAULT '',
      bill_no       VARCHAR(64) DEFAULT '',
      remark        TEXT,
      subtotal      DOUBLE DEFAULT 0,
      discount      DOUBLE DEFAULT 0,
      vat           DOUBLE DEFAULT 0,
      net_total     DOUBLE DEFAULT 0,
      items_json    MEDIUMTEXT,
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // ---- เอกสารรับผ้าดิบ (raw_receipts) — เลข IN รันร่วมกับผ้าสำเร็จ ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS raw_receipts (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      in_no         VARCHAR(32) NOT NULL,
      receipt_date  VARCHAR(20) DEFAULT '',
      receipt_type  VARCHAR(32) DEFAULT 'Purchase',
      factory       VARCHAR(255) DEFAULT '',
      po_ref        VARCHAR(64) DEFAULT '',
      supplier      VARCHAR(255) DEFAULT '',
      bill_no       VARCHAR(64) DEFAULT '',
      remark        TEXT,
      subtotal      DOUBLE DEFAULT 0,
      discount      DOUBLE DEFAULT 0,
      vat           DOUBLE DEFAULT 0,
      net_total     DOUBLE DEFAULT 0,
      items_json    MEDIUMTEXT,
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // ---- เอกสารรับผ้าย้อม (dyed_receipts) — เลข IN รันร่วมกับผ้าสำเร็จ/ดิบ ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS dyed_receipts (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      in_no         VARCHAR(32) NOT NULL,
      receipt_date  VARCHAR(20) DEFAULT '',
      order_ref     VARCHAR(64) DEFAULT '',
      factory       VARCHAR(255) DEFAULT '',
      warehouse     VARCHAR(64) DEFAULT 'Warehouse',
      supplier      VARCHAR(255) DEFAULT '',
      bill_no       VARCHAR(64) DEFAULT '',
      remark        TEXT,
      subtotal      DOUBLE DEFAULT 0,
      discount      DOUBLE DEFAULT 0,
      vat           DOUBLE DEFAULT 0,
      net_total     DOUBLE DEFAULT 0,
      items_json    MEDIUMTEXT,
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // ---- เอกสารย้ายสินค้าระหว่างคลัง (stock_transfers) — เลข TR ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS stock_transfers (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      tr_no         VARCHAR(32) NOT NULL,
      transfer_date VARCHAR(20) DEFAULT '',
      from_wh       VARCHAR(64) DEFAULT '',
      to_wh         VARCHAR(64) DEFAULT '',
      remark        TEXT,
      items_json    MEDIUMTEXT,
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // ---- เอกสารย้ายผ้าดิบ (raw_transfers) — เลข TG ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS raw_transfers (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      tg_no         VARCHAR(32) NOT NULL,
      transfer_date VARCHAR(20) DEFAULT '',
      to_wh         VARCHAR(64) DEFAULT '',
      remark        TEXT,
      items_json    MEDIUMTEXT,
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // ---- เอกสารย้ายชั้นสินค้า/เก็บเข้าแร็ค (rack_transfers) — เลข TK ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS rack_transfers (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      tk_no         VARCHAR(32) NOT NULL,
      transfer_date VARCHAR(20) DEFAULT '',
      location_code VARCHAR(64) DEFAULT '',
      remark        TEXT,
      items_json    MEDIUMTEXT,
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // ---- กลุ่มสินค้า VAT ตามช่วงราคาขาย (vat_product_groups) ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vat_product_groups (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      price_from  DOUBLE DEFAULT 0,
      price_to    DOUBLE DEFAULT 0,
      group_name  VARCHAR(255) DEFAULT '',
      sort_order  INT DEFAULT 0,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // ---- กลุ่มผ้าประจำ (fabric_regular_group) + เฉดสีของกลุ่ม ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS fabric_regular_group (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      name         VARCHAR(255) NOT NULL,
      width        VARCHAR(64) DEFAULT '',
      weight       VARCHAR(64) DEFAULT '',
      retail_price DOUBLE DEFAULT 0,
      created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS fabric_regular_group_shades (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      group_id    INT NOT NULL,
      name        VARCHAR(255) NOT NULL,
      fabric_cost DOUBLE DEFAULT 0,
      dye_cost    DOUBLE DEFAULT 0,
      INDEX idx_frg_shade_group (group_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  const [[{ rgc }]] = await pool.query('SELECT COUNT(*) AS rgc FROM fabric_regular_group');
  if (rgc === 0) {
    await pool.query(`INSERT INTO fabric_regular_group (name, width, weight, retail_price) VALUES
      ('ผ้าคอตตอน 100%', '58', 'ปานกลาง', 130),
      ('ผ้า TC (คอตตอนผสม)', '44"', 'บาง', 120),
      ('ผ้าแคนวาส', '60"', 'หนา', 180),
      ('ผ้าเดนิม (ยีนส์)', '58', 'หนา', 220)`);
    console.log('  ➕ ใส่ข้อมูลกลุ่มผ้าประจำตัวอย่าง 4 กลุ่ม');
  }

  // ---- กลุ่มผ้าไม่ประจำ (fabric_irregular_group) + เฉดสีของกลุ่ม ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS fabric_irregular_group (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      name         VARCHAR(255) NOT NULL,
      width        VARCHAR(64) DEFAULT '',
      weight       VARCHAR(64) DEFAULT '',
      retail_price DOUBLE DEFAULT 0,
      created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS fabric_irregular_group_shades (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      group_id    INT NOT NULL,
      name        VARCHAR(255) NOT NULL,
      fabric_cost DOUBLE DEFAULT 0,
      dye_cost    DOUBLE DEFAULT 0,
      INDEX idx_fig_shade_group (group_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  const [[{ igc }]] = await pool.query('SELECT COUNT(*) AS igc FROM fabric_irregular_group');
  if (igc === 0) {
    await pool.query(`INSERT INTO fabric_irregular_group (name, width, weight, retail_price) VALUES
      ('ผ้าซาตินพิมพ์ลาย', '44"', 'บาง', 160),
      ('ผ้าลูกไม้', '36"', 'บาง', 240),
      ('ผ้าชีฟองพิมพ์ลาย', '58', 'บาง', 140)`);
    console.log('  ➕ ใส่ข้อมูลกลุ่มผ้าไม่ประจำตัวอย่าง 3 กลุ่ม');
  }

  // ---- เซสชันล็อกอิน ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      token      VARCHAR(64) PRIMARY KEY,
      user_id    INT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // ---- ผ้าประจำ ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS fabrics (
      id               INT AUTO_INCREMENT PRIMARY KEY,
      sku              VARCHAR(191) NOT NULL UNIQUE,
      type             VARCHAR(255),
      name             VARCHAR(255),
      structure        VARCHAR(255),
      composition      VARCHAR(255),
      width            VARCHAR(50),
      finishing        VARCHAR(255),
      weight           VARCHAR(50),
      unit             VARCHAR(50) DEFAULT 'หลา',
      description      TEXT,
      production_days  INT NULL,
      image_name       VARCHAR(255),
      colors           INT DEFAULT 1,
      substitute       TINYINT DEFAULT 0,
      active           TINYINT DEFAULT 1,
      created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // ---- เฉดสีของผ้าประจำ ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS fabric_shades (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      fabric_id   INT NOT NULL,
      name        VARCHAR(255) NOT NULL,
      fabric_cost DOUBLE DEFAULT 0,
      dye_cost    DOUBLE DEFAULT 0,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (fabric_id) REFERENCES fabrics(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // ---- ผ้าไม่ประจำ (โครงสร้างเดียวกับผ้าประจำ) ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS fabric_irregular (
      id               INT AUTO_INCREMENT PRIMARY KEY,
      sku              VARCHAR(191) NOT NULL UNIQUE,
      type             VARCHAR(255),
      name             VARCHAR(255),
      structure        VARCHAR(255),
      composition      VARCHAR(255),
      width            VARCHAR(50),
      finishing        VARCHAR(255),
      weight           VARCHAR(50),
      unit             VARCHAR(50) DEFAULT 'หลา',
      description      TEXT,
      production_days  INT NULL,
      image_name       VARCHAR(255),
      colors           INT DEFAULT 1,
      substitute       TINYINT DEFAULT 0,
      active           TINYINT DEFAULT 1,
      created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // ---- เฉดสีของผ้าไม่ประจำ ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS fabric_irregular_shades (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      item_id     INT NOT NULL,
      name        VARCHAR(255) NOT NULL,
      fabric_cost DOUBLE DEFAULT 0,
      dye_cost    DOUBLE DEFAULT 0,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (item_id) REFERENCES fabric_irregular(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // ---- ข้อมูลผ้า (นำเข้าจาก Excel) ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS fabric_master (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      item_code    VARCHAR(191) NOT NULL UNIQUE,
      fabric_type  VARCHAR(255),
      fabric_name  VARCHAR(255),
      description  TEXT,
      contract_no  VARCHAR(255),
      weaving      VARCHAR(255),
      structure    VARCHAR(255),
      yc_shade     VARCHAR(255),
      price        DOUBLE DEFAULT 0,
      price_vat    DOUBLE DEFAULT 0,
      created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // ---- ข้อมูลลูกค้า (นำเข้าจาก Excel) ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS customer_master (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      customer_code  VARCHAR(191) NOT NULL UNIQUE,
      customer_name  VARCHAR(255),
      address        TEXT,
      created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // ---- ลูกค้า (ข้อมูลร้านค้า) ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS customers (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      code           VARCHAR(50) UNIQUE,
      company_name   VARCHAR(255),
      contact        VARCHAR(255),
      phone          VARCHAR(100),
      address        TEXT,
      province       VARCHAR(100),
      customer_group VARCHAR(100),
      zone           VARCHAR(100),
      account_terms  VARCHAR(100),
      cash_terms     VARCHAR(100),
      currency       VARCHAR(20) DEFAULT 'THB',
      credit_limit   VARCHAR(50),
      salesperson    VARCHAR(255),
      tax_id         VARCHAR(50),
      created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // ---- ออร์เดอร์ ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      order_no      VARCHAR(191) NOT NULL UNIQUE,
      \`date\`        VARCHAR(50),
      customer      VARCHAR(255),
      salesperson   VARCHAR(255),
      payment_term  VARCHAR(100),
      note          TEXT,
      urgent        TINYINT DEFAULT 0,
      ordered_qty   DOUBLE DEFAULT 0,
      withdrawn_qty DOUBLE DEFAULT 0,
      status        VARCHAR(100) DEFAULT 'Waiting to prepare',
      invoiced      TINYINT DEFAULT 0,
      vat_done      TINYINT DEFAULT 0,
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // ---- รายการสินค้าในออร์เดอร์ ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id              INT AUTO_INCREMENT PRIMARY KEY,
      order_id        INT NOT NULL,
      sku             VARCHAR(191),
      color_code      VARCHAR(255),
      width           VARCHAR(50),
      available_qty   VARCHAR(50),
      ordered_qty     DOUBLE DEFAULT 0,
      withdrawn_qty   DOUBLE DEFAULT 0,
      unit            VARCHAR(50) DEFAULT 'หลา',
      pack            VARCHAR(100),
      cust_code       VARCHAR(100),
      substitute      TINYINT DEFAULT 0,
      substitute_text VARCHAR(255),
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // ============================================================
  //  ระบบคลังผ้า (WMS)
  // ============================================================
  // ตำแหน่งจัดเก็บ (ช่อง/แร็ค/บิน)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS warehouse_locations (
      location_id    INT AUTO_INCREMENT PRIMARY KEY,
      location_code  VARCHAR(50) NOT NULL,
      zone           VARCHAR(50),
      rack           VARCHAR(50),
      bin            VARCHAR(50),
      location_qr    VARCHAR(191),
      capacity_rolls INT DEFAULT NULL,
      is_active      TINYINT NOT NULL DEFAULT 1,
      created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_location_code (location_code),
      UNIQUE KEY uq_location_qr (location_qr),
      KEY idx_loc_zone (zone),
      KEY idx_loc_rack (rack),
      KEY idx_loc_active (is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // เอกสารรับผ้าเข้าคลัง (Header)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS goods_receipts (
      gr_id         INT AUTO_INCREMENT PRIMARY KEY,
      gr_no         VARCHAR(50) NOT NULL,
      receipt_date  DATE,
      receipt_type  VARCHAR(50),
      supplier_name VARCHAR(255),
      po_no         VARCHAR(50),
      bill_no       VARCHAR(50),
      warehouse     VARCHAR(100),
      note          TEXT,
      status        ENUM('draft','posted','cancelled') NOT NULL DEFAULT 'posted',
      received_by   INT,
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_gr_no (gr_no),
      KEY idx_gr_date (receipt_date),
      KEY idx_gr_status (status),
      KEY idx_gr_received_by (received_by),
      CONSTRAINT fk_gr_user FOREIGN KEY (received_by)
        REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // รายการผ้าในเอกสารรับ (Detail)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS goods_receipt_items (
      gri_id       INT AUTO_INCREMENT PRIMARY KEY,
      gr_id        INT NOT NULL,
      product_id   INT NOT NULL,
      color_id     INT,
      roll_count   INT NOT NULL DEFAULT 0,
      total_yards  DOUBLE NOT NULL DEFAULT 0,
      note         VARCHAR(255),
      created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
      KEY idx_gri_gr (gr_id),
      KEY idx_gri_product (product_id),
      KEY idx_gri_color (color_id),
      CONSTRAINT fk_gri_gr FOREIGN KEY (gr_id)
        REFERENCES goods_receipts(gr_id) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_gri_product FOREIGN KEY (product_id)
        REFERENCES fabrics(id) ON DELETE RESTRICT ON UPDATE CASCADE,
      CONSTRAINT fk_gri_color FOREIGN KEY (color_id)
        REFERENCES fabric_shades(id) ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // ม้วนผ้าแต่ละไม้ (1 ม้วน = 1 record = 1 QR)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS fabric_rolls (
      roll_id       INT AUTO_INCREMENT PRIMARY KEY,
      roll_qr_code  VARCHAR(191) NOT NULL,
      gri_id        INT,
      product_id    INT NOT NULL,
      color_id      INT,
      lot_no        VARCHAR(50),
      initial_yards DOUBLE NOT NULL DEFAULT 0,
      current_yards DOUBLE NOT NULL DEFAULT 0,
      location_id   INT,
      status        ENUM('available','reserved','in_use','depleted','hold') NOT NULL DEFAULT 'available',
      received_at   DATETIME,
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_roll_qr (roll_qr_code),
      KEY idx_roll_product (product_id),
      KEY idx_roll_color (color_id),
      KEY idx_roll_location (location_id),
      KEY idx_roll_status (status),
      KEY idx_roll_gri (gri_id),
      CONSTRAINT fk_roll_gri FOREIGN KEY (gri_id)
        REFERENCES goods_receipt_items(gri_id) ON DELETE SET NULL ON UPDATE CASCADE,
      CONSTRAINT fk_roll_product FOREIGN KEY (product_id)
        REFERENCES fabrics(id) ON DELETE RESTRICT ON UPDATE CASCADE,
      CONSTRAINT fk_roll_color FOREIGN KEY (color_id)
        REFERENCES fabric_shades(id) ON DELETE SET NULL ON UPDATE CASCADE,
      CONSTRAINT fk_roll_location FOREIGN KEY (location_id)
        REFERENCES warehouse_locations(location_id) ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // ประวัติเคลื่อนไหวสต็อก (ย้ายช่อง / ตัดหลา)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS stock_transactions (
      txn_id           INT AUTO_INCREMENT PRIMARY KEY,
      roll_id          INT NOT NULL,
      txn_type         ENUM('receive','move','issue','cut','adjust','return') NOT NULL,
      yards_change     DOUBLE NOT NULL DEFAULT 0,
      yards_before     DOUBLE,
      yards_after      DOUBLE,
      from_location_id INT,
      to_location_id   INT,
      ref_type         VARCHAR(30),
      ref_no           VARCHAR(50),
      note             VARCHAR(255),
      created_by       INT,
      created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
      KEY idx_txn_roll (roll_id),
      KEY idx_txn_type (txn_type),
      KEY idx_txn_created (created_at),
      KEY idx_txn_from (from_location_id),
      KEY idx_txn_to (to_location_id),
      KEY idx_txn_ref (ref_type, ref_no),
      CONSTRAINT fk_txn_roll FOREIGN KEY (roll_id)
        REFERENCES fabric_rolls(roll_id) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_txn_from FOREIGN KEY (from_location_id)
        REFERENCES warehouse_locations(location_id) ON DELETE SET NULL ON UPDATE CASCADE,
      CONSTRAINT fk_txn_to FOREIGN KEY (to_location_id)
        REFERENCES warehouse_locations(location_id) ON DELETE SET NULL ON UPDATE CASCADE,
      CONSTRAINT fk_txn_user FOREIGN KEY (created_by)
        REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // ---- ใบเบิกสินค้า (Goods Issue) — ตัดจ่ายออเดอร์ ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS goods_issues (
      gi_id        INT AUTO_INCREMENT PRIMARY KEY,
      gi_no        VARCHAR(50) NOT NULL,
      issue_date   DATE,
      issue_type   VARCHAR(50),
      order_id     INT,
      order_no     VARCHAR(50),
      customer     VARCHAR(255),
      payment_term VARCHAR(100),
      salesperson  VARCHAR(255),
      note         TEXT,
      created_by   INT,
      created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_gi_no (gi_no),
      KEY idx_gi_order (order_id),
      KEY idx_gi_date (issue_date),
      CONSTRAINT fk_gi_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL ON UPDATE CASCADE,
      CONSTRAINT fk_gi_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // ---- รายการในใบเบิก (ไม่ผูก FK product เพื่อรองรับทั้งผ้าประจำ/ไม่ประจำ) ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS goods_issue_items (
      gii_id      INT AUTO_INCREMENT PRIMARY KEY,
      gi_id       INT NOT NULL,
      product_id  INT,
      color_id    INT,
      sku         VARCHAR(191),
      color_name  VARCHAR(255),
      width       VARCHAR(50),
      yards_cut   DOUBLE NOT NULL DEFAULT 0,
      meters_cut  DOUBLE NOT NULL DEFAULT 0,
      unit        VARCHAR(50) DEFAULT 'หลา',
      note        VARCHAR(255),
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      KEY idx_gii_gi (gi_id),
      KEY idx_gii_sku (sku),
      CONSTRAINT fk_gii_gi FOREIGN KEY (gi_id) REFERENCES goods_issues(gi_id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // ---- สัญญาขาย (Sales Contract) ----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sales_contracts (
      sc_id          INT AUTO_INCREMENT PRIMARY KEY,
      sc_no          VARCHAR(50) NOT NULL,
      contract_date  DATE,
      shipment_date  DATE NULL,
      customer       VARCHAR(255),
      address        TEXT,
      payment_term   VARCHAR(100),
      deposit        DOUBLE DEFAULT 0,
      currency       VARCHAR(20) DEFAULT 'THB',
      structure      VARCHAR(255),
      unit           VARCHAR(50) DEFAULT 'หลา',
      note           TEXT,
      subtotal       DOUBLE DEFAULT 0,
      discount_type  VARCHAR(30) DEFAULT 'None',
      discount_value DOUBLE DEFAULT 0,
      discount_amount DOUBLE DEFAULT 0,
      vat_type       VARCHAR(30) DEFAULT 'None',
      vat_amount     DOUBLE DEFAULT 0,
      net_total      DOUBLE DEFAULT 0,
      created_by     INT,
      created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_sc_no (sc_no),
      KEY idx_sc_date (contract_date),
      CONSTRAINT fk_sc_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sales_contract_items (
      sci_id      INT AUTO_INCREMENT PRIMARY KEY,
      sc_id       INT NOT NULL,
      sku         VARCHAR(191),
      color_code  VARCHAR(255),
      description VARCHAR(255),
      qty         DOUBLE DEFAULT 0,
      unit_price  DOUBLE DEFAULT 0,
      amount      DOUBLE DEFAULT 0,
      width       VARCHAR(50),
      length      VARCHAR(50),
      note        VARCHAR(255),
      KEY idx_sci_sc (sc_id),
      CONSTRAINT fk_sci_sc FOREIGN KEY (sc_id) REFERENCES sales_contracts(sc_id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await seedIfEmpty();
}

// ------------------------------------------------------------
//  ใส่ข้อมูลตัวอย่างเฉพาะตอนตารางว่างเปล่า (ติดตั้งใหม่)
// ------------------------------------------------------------
async function seedIfEmpty() {
  // ตำแหน่งคลัง (WMS) — ใส่ตัวอย่างถ้ายังว่าง
  const [[{ n: locN }]] = await pool.query('SELECT COUNT(*) AS n FROM warehouse_locations');
  if (locN === 0) {
    const locs = [];
    for (const zone of ['A', 'B']) {
      for (let rack = 1; rack <= 3; rack++) {
        for (let bin = 1; bin <= 4; bin++) {
          const code = `${zone}-${String(rack).padStart(2, '0')}-${String(bin).padStart(2, '0')}`;
          locs.push([code, zone, String(rack), String(bin), `LOC-${code}`, 20]);
        }
      }
    }
    await pool.query(
      'INSERT INTO warehouse_locations (location_code, zone, rack, bin, location_qr, capacity_rolls) VALUES ?',
      [locs]
    );
  }

  // ผ้าประจำ
  const [[{ n: fabN }]] = await pool.query('SELECT COUNT(*) AS n FROM fabrics');
  if (fabN === 0) {
    const rows = [
      ['100S01', '100S-44"', 'ผ้าคอตตอน 100S คอมแพค', 'Plain (ผ้าทอลาย)', 'Cotton 100%', '44"', 'Peach Finish', '120', 'หลา', 12, 0, 1],
      ['100S02', '100S-60"', 'ผ้าคอตตอน 100S ผิวนุ่ม', 'Plain (ผ้าทอลาย)', 'Cotton 100%', '60"', 'Enzyme Wash', '135', 'หลา', 18, 1, 1],
      ['80S01', '80S-44"', 'ผ้าคอตตอน 80S คลาสสิก', 'Twill (ผ้าทอสอง)', 'Cotton 100%', '44"', 'Soft Finish', '160', 'หลา', 10, 0, 1],
      ['80S02', '80S-58"', 'ผ้าคอตตอน 80S หนานุ่ม', 'Twill (ผ้าทอสอง)', 'Cotton 100%', '58', 'Brushed', '210', 'หลา', 8, 0, 0],
      ['CVC01', 'CVC-44"', 'ผ้า CVC ผสมโพลี', 'Plain (ผ้าทอลาย)', 'CVC 60/40', '44"', 'Peach Finish', '145', 'หลา', 15, 1, 1],
      ['CVC02', 'CVC-58"', 'ผ้า CVC เนื้อเรียบ', 'Satin (ผ้าซาติน)', 'CVC 60/40', '58', 'Silk Touch', '175', 'หลา', 20, 0, 1],
      ['TC01', 'TC-44"', 'ผ้า TC โพลีคอตตอน', 'Plain (ผ้าทอลาย)', 'TC 65/35', '44"', 'Standard', '130', 'หลา', 9, 0, 1],
      ['TC02', 'TC-60"', 'ผ้า TC ทนทานพิเศษ', 'Twill (ผ้าทอสอง)', 'TC 65/35', '60"', 'Water Repellent', '260', 'หลา', 11, 0, 1],
      ['120S01', '120S-44"', 'ผ้าคอตตอน 120S พรีเมียม', 'Poplin (ผ้าป็อปลิน)', 'Cotton 100%', '44"', 'Mercerized', '110', 'หลา', 14, 1, 1],
      ['120S02', '120S-58"', 'ผ้าคอตตอน 120S เนื้อละเอียด', 'Poplin (ผ้าป็อปลิน)', 'Cotton 100%', '58', 'Mercerized', '115', 'หลา', 16, 0, 0],
      ['DNM01', 'Denim-58"', 'ผ้ายีนส์เดนิมหนา', 'Twill (ผ้าทอสอง)', 'Cotton 98% / Spandex 2%', '58', 'Stone Wash', '320', 'หลา', 5, 0, 1],
      ['LIN01', 'Linen-44"', 'ผ้าลินินธรรมชาติ', 'Plain (ผ้าทอลาย)', 'Linen 100%', '44"', 'Natural', '190', 'หลา', 7, 0, 1],
      ['PLY01', 'Poly-60"', 'ผ้าโพลีเอสเตอร์เรียบ', 'Plain (ผ้าทอลาย)', 'Polyester 100%', '60"', 'Standard', '150', 'หลา', 22, 1, 1],
      ['SLK01', 'Silk-44"', 'ผ้าไหมอิตาลีเงา', 'Satin (ผ้าซาติน)', 'Silk 100%', '44"', 'High Gloss', '90', 'หลา', 6, 0, 1],
      ['OXF01', 'Oxford-58"', 'ผ้าอ๊อกซ์ฟอร์ดลายตาราง', 'Oxford Weave', 'Cotton 80% / Poly 20%', '58', 'Standard', '200', 'หลา', 8, 0, 0],
    ];
    await pool.query(
      'INSERT INTO fabrics (sku, type, name, structure, composition, width, finishing, weight, unit, colors, substitute, active) VALUES ?',
      [rows]
    );
  }

  // ผ้าไม่ประจำ
  const [[{ n: irrN }]] = await pool.query('SELECT COUNT(*) AS n FROM fabric_irregular');
  if (irrN === 0) {
    const rows = [
      ['FI-SAT01', 'Satin-44"', 'ผ้าซาตินพิมพ์ลาย', 'Satin (ผ้าซาติน)', 'Polyester 100%', '44"', 'High Gloss', '90', 'หลา', 5, 0, 1],
      ['FI-LAC01', 'Lace-58"', 'ผ้าลูกไม้ปักลาย', 'Lace (ผ้าลูกไม้)', 'Nylon 100%', '58"', 'Standard', '70', 'หลา', 3, 0, 1],
      ['FI-EMB01', 'Embroidery-44"', 'ผ้าปักลายดอกไม้', 'Plain (ผ้าทอลาย)', 'Cotton 80% / Poly 20%', '44"', 'Standard', '150', 'หลา', 4, 1, 1],
      ['FI-CHF01', 'Chiffon-58"', 'ผ้าชีฟองบาง', 'Plain (ผ้าทอลาย)', 'Polyester 100%', '58"', 'Soft Finish', '60', 'หลา', 8, 0, 0],
    ];
    await pool.query(
      'INSERT INTO fabric_irregular (sku, type, name, structure, composition, width, finishing, weight, unit, colors, substitute, active) VALUES ?',
      [rows]
    );
  }

  // ออร์เดอร์
  const [[{ n: ordN }]] = await pool.query('SELECT COUNT(*) AS n FROM orders');
  if (ordN === 0) {
    const seedOrders = [
      { order: ['OR2608-005', '14/08/2026', 'Alex fashion', 'ปั๊ม', 'Cash', '', 1, 50, 0, 'Waiting to prepare', 0, 0],
        items: [['FR-001', '14002 - Blue', '44"', '1050', 50, 0, 'หลา', 'ม้วน', '', 0, '']] },
      { order: ['OR2608-001', '14/08/2026', 'บจก. สยามเทรดดิ้ง', 'นายกิตติ มั่นคง', 'Cash', 'เร่งด่วนพิเศษ', 0, 150, 80, 'Preparing', 0, 0],
        items: [['FR-001', '18055 - Black', '44"', '1050', 150, 80, 'หลา', 'ม้วน', '', 0, '']] },
      { order: ['OR2608-003', '12/08/2026', 'ร้านแฟชั่นเฮ้าส์', 'ปั๊ม', 'Cash', '', 0, 90, 90, 'Prepared', 1, 0],
        items: [['FR-003', 'C-02', '58', '950', 90, 90, 'หลา', 'ม้วน', '', 0, '']] },
      { order: ['OR2608-004', '13/08/2026', 'บจก. ไทยเท็กซ์ไทล์', 'นายกิตติ มั่นคง', 'Cash', '', 0, 60, 60, 'Prepared', 0, 0],
        items: [['GR-01', 'C-04', '44"', '3200', 60, 60, 'หลา', 'ม้วน', '', 0, '']] },
    ];
    for (const { order, items } of seedOrders) {
      const [info] = await pool.query(
        'INSERT INTO orders (order_no, `date`, customer, salesperson, payment_term, note, urgent, ordered_qty, withdrawn_qty, status, invoiced, vat_done) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
        order
      );
      const oid = info.insertId;
      const itemRows = items.map((it) => [oid, ...it]);
      await pool.query(
        'INSERT INTO order_items (order_id, sku, color_code, width, available_qty, ordered_qty, withdrawn_qty, unit, pack, cust_code, substitute, substitute_text) VALUES ?',
        [itemRows]
      );
    }
  }
}

module.exports = { pool, initTables, initUserTables: initTables };
