// ============================================================================
//  permissionSchema.js — โครงสร้างสิทธิ์การเข้าใช้งาน
//  * ออกแบบใหม่ให้ leaf ทุกตัว = "key เมนูจริง" ในระบบ (currentPage)
//    → ติ๊กสิทธิ์ = อนุญาตให้เห็น/เข้าหน้านั้นได้ (ไม่มีรายการซ้ำ)
//  * node ที่มี children = หัวข้อกลุ่ม (key ขึ้นต้น 'grp.' ไม่ใช่หน้าเพจ)
//  เก็บลง DB/บทบาท เป็นลิสต์ของ key ที่ได้รับสิทธิ์
// ============================================================================

// ---- สิทธิ์การกระทำ (แสดงเป็น 3 คอลัมน์ด้านบน) ----
export const PERM_ACTIONS = [
  {
    title: 'สิทธิ์ในข้อมูลพื้นฐาน',
    items: [
      { key: 'act.add', label: 'เพิ่มรายการ' },
      { key: 'act.edit', label: 'แก้ไขรายการ' },
      { key: 'act.delete', label: 'ลบรายการ' },
    ],
  },
  {
    title: 'สิทธิ์พิเศษ',
    items: [
      { key: 'act.approve', label: 'อนุมัติรายการ' },
      { key: 'act.cancel', label: 'ยกเลิกรายการ' },
      { key: 'act.export', label: 'ส่งออกข้อมูล' },
    ],
  },
  {
    title: 'สิทธิ์การแสดงผล',
    items: [
      { key: 'act.viewBuyPrice', label: 'แสดงราคาซื้อ' },
      { key: 'act.viewSellPrice', label: 'แสดงราคาขาย' },
      { key: 'act.viewTotal', label: 'แสดงผลรวม' },
    ],
  },
];

// ---- สิทธิ์การเข้าถึง (ต้นไม้เมนูจริง) ----
//  leaf.key = currentPage key จริง ; group.key = 'grp.*'
export const PERM_ACCESS = [
  {
    key: 'grp.basic', label: 'ข้อมูลพื้นฐาน',
    children: [
      { key: 'fabric-regular', label: 'ผ้าประจำ' },
      { key: 'fabric-regular-group', label: 'กลุ่มผ้าประจำ' },
      { key: 'fabric-irregular', label: 'ผ้าไม่ประจำ' },
      { key: 'fabric-irregular-group', label: 'กลุ่มผ้าไม่ประจำ' },
      { key: 'fabric-raw', label: 'ผ้าดิบ' },
      { key: 'customers', label: 'ลูกค้า' },
      { key: 'partners', label: 'คู่ค้า' },
      { key: 'fabric-info', label: 'ข้อมูลผ้า' },
      { key: 'employee-info', label: 'ข้อมูลพนักงาน' },
      { key: 'note-info', label: 'ข้อมูลหมายเหตุ' },
      { key: 'zone-rack', label: 'โซน & แร็ค' },
    ],
  },
  {
    key: 'grp.po', label: 'เปิดใบสั่งซื้อ',
    children: [
      { key: 'po-fabric-finished', label: 'ผ้าสำเร็จ' },
      { key: 'po-fabric-raw', label: 'ผ้าดิบ' },
      { key: 'po-dye-order', label: 'สั่งย้อม' },
    ],
  },
  {
    key: 'grp.stock', label: 'จัดการสินค้า',
    children: [
      { key: 'receive-fabric-finished', label: 'รับผ้าสำเร็จ' },
      { key: 'receive-fabric-raw', label: 'รับผ้าดิบ' },
      { key: 'receive-fabric-dyed', label: 'รับผ้าย้อม' },
      { key: 'move-stock', label: 'ย้ายสินค้า' },
      { key: 'move-fabric-raw', label: 'ย้ายผ้าดิบ' },
      { key: 'move-shelf', label: 'ย้ายชั้นสินค้า' },
      { key: 'barcode', label: 'บาร์โค้ด' },
      { key: 'stock-history', label: 'ประวัติเคลื่อนไหว' },
    ],
  },
  {
    key: 'grp.vat', label: 'จัดการ VAT',
    children: [
      { key: 'vat-product-group', label: 'กลุ่มสินค้า VAT' },
      { key: 'vat-receive', label: 'รับสินค้า VAT' },
      { key: 'vat-stock-cut', label: 'ตัดสต็อก VAT' },
      { key: 'vat-invoice', label: 'ใบกำกับภาษี' },
      { key: 'vat-stock-cut-from-invoice', label: 'ตัดสต็อก VAT จากใบกำกับภาษี' },
    ],
  },
  { key: 'sales-contract', label: 'สัญญาขาย' },
  {
    key: 'grp.order', label: 'จัดการออร์เดอร์',
    children: [
      { key: 'order-leads', label: 'รับออเดอร์เข้า (รวมช่องทาง)' },
      { key: 'order-receive', label: 'รับออร์เดอร์' },
      { key: 'order-fulfill', label: 'จัดออร์เดอร์' },
      { key: 'invoice-open', label: 'เปิดอินวอยส์' },
      { key: 'invoice-return', label: 'รับคืนอินวอยส์' },
    ],
  },
  {
    key: 'grp.custAcc', label: 'บัญชีลูกค้า',
    children: [
      { key: 'billing-customer', label: 'วางบิลลูกค้า' },
      { key: 'receive-payment-customer', label: 'รับเงินลูกค้า' },
      { key: 'deduct-customer-account', label: 'หักบัญชีลูกค้า' },
      { key: 'credit-note-customer', label: 'ใบลดหนี้ลูกค้า' },
    ],
  },
  {
    key: 'grp.partnerAcc', label: 'บัญชีคู่ค้า',
    children: [
      { key: 'pay-partner', label: 'จ่ายเงินคู่ค้า' },
      { key: 'deduct-partner-account', label: 'หักบัญชีคู่ค้า' },
      { key: 'credit-note-partner', label: 'ใบลดหนี้คู่ค้า' },
    ],
  },
  {
    key: 'grp.report', label: 'รายงาน',
    children: [
      { key: 'report-stock', label: 'คลังสินค้า' },
      { key: 'report-vat-stock', label: 'คลัง VAT' },
      { key: 'report-po', label: 'รายงานใบสั่งซื้อ' },
      { key: 'report-dye-order', label: 'รายงานใบสั่งย้อม' },
      { key: 'report-sales-contract', label: 'รายงานใบสัญญาขาย' },
      { key: 'report-order', label: 'รายงานออร์เดอร์' },
      { key: 'report-sales', label: 'การขาย' },
      { key: 'report-tax-invoice', label: 'รายงานใบกำกับภาษี' },
      { key: 'report-profit-loss', label: 'กำไร & ขาดทุน' },
      { key: 'report-customer-account', label: 'บัญชีลูกค้า' },
      { key: 'report-partner-account', label: 'บัญชีคู่ค้า' },
      { key: 'report-annual-summary', label: 'รายงานสรุปประจำปี' },
      { key: 'report-reorder-point', label: 'รายงานจุดสั่งซื้อสินค้า' },
      { key: 'report-others', label: 'อื่นๆ' },
    ],
  },
  {
    key: 'grp.users', label: 'ผู้ใช้งาน',
    children: [
      { key: 'users', label: 'บัญชีผู้ใช้งาน' },
      { key: 'user-permissions', label: 'สิทธิ์การเข้าใช้งาน' },
    ],
  },
];

// ---- รวบรวม key ใบทั้งหมดของ node หนึ่ง (ใช้ตอนติ๊กหัวข้อ) ----
export function leafKeysOf(node) {
  if (!node.children || node.children.length === 0) return [node.key];
  return node.children.flatMap(leafKeysOf);
}

// ---- key เพจจริงทั้งหมด (ใช้ตรวจ/บังคับสิทธิ์เมนู) ----
export function allPageKeys() {
  return PERM_ACCESS.flatMap(leafKeysOf);
}

// ---- ตำแหน่ง/ฝ่าย เริ่มต้น + สิทธิ์แนะนำ (พรีเซ็ตเลือกเร็ว) ----
//  presetKeys = รายการ key เมนูที่บทบาทนั้นควรเข้าถึงได้
export const ROLE_PRESETS = [
  {
    key: 'ceo', label: 'CEO / ผู้บริหาร', desc: 'เข้าถึงได้ทุกเมนู',
    presetKeys: null, // null = ทุกสิทธิ์
  },
  {
    key: 'warehouse', label: 'พนักงานคลังสินค้า', desc: 'จัดการสต็อก รับ-ย้ายสินค้า บาร์โค้ด',
    presetKeys: ['fabric-regular', 'fabric-irregular', 'fabric-raw', 'zone-rack',
      'receive-fabric-finished', 'receive-fabric-raw', 'receive-fabric-dyed',
      'move-stock', 'move-fabric-raw', 'move-shelf', 'barcode', 'stock-history',
      'report-stock'],
  },
  {
    key: 'delivery', label: 'พนักงานส่งของ', desc: 'ดูออร์เดอร์ที่ต้องจัด/ส่ง',
    presetKeys: ['order-fulfill', 'order-receive', 'customers'],
  },
  {
    key: 'accounting', label: 'ฝ่ายบัญชี', desc: 'VAT ใบกำกับภาษี บัญชีลูกค้า/คู่ค้า รายงาน',
    presetKeys: ['vat-product-group', 'vat-receive', 'vat-stock-cut', 'vat-invoice', 'vat-stock-cut-from-invoice',
      'billing-customer', 'receive-payment-customer', 'deduct-customer-account', 'credit-note-customer',
      'pay-partner', 'deduct-partner-account', 'credit-note-partner',
      'report-vat-stock', 'report-tax-invoice', 'report-profit-loss', 'report-customer-account',
      'report-partner-account', 'report-annual-summary'],
  },
  {
    key: 'order', label: 'ฝ่ายรับออเดอร์', desc: 'รับออร์เดอร์ เปิดอินวอยส์ สัญญาขาย',
    presetKeys: ['order-leads', 'order-receive', 'order-fulfill', 'invoice-open', 'invoice-return',
      'sales-contract', 'customers', 'fabric-regular', 'fabric-irregular',
      'report-order', 'report-sales', 'report-sales-contract'],
  },
  {
    key: 'fabricPicker', label: 'ฝ่ายตัด/หาผ้าออเดอร์', desc: 'ดูผ้า/สต็อก จัดผ้าตามออร์เดอร์',
    presetKeys: ['fabric-regular', 'fabric-irregular', 'fabric-raw', 'fabric-info', 'zone-rack',
      'order-fulfill', 'stock-history', 'report-stock', 'report-reorder-point'],
  },
];
