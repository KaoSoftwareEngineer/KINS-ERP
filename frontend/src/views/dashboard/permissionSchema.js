// ============================================================================
//  permissionSchema.js — โครงสร้างสิทธิ์การเข้าใช้งานทั้งหมด (ตามแบบฟอร์ม)
//  ใช้ร่วมกันระหว่าง PermissionModal (แก้ไขสิทธิ์) และการบังคับสิทธิ์ฝั่งเมนู
//  แต่ละ item มี key ที่ไม่ซ้ำ — เก็บลง DB เป็นลิสต์ของ key ที่ได้รับสิทธิ์
// ============================================================================

// ---- สิทธิ์การกระทำ (แสดงเป็น 3 คอลัมน์ด้านบน) ----
export const PERM_ACTIONS = [
  {
    title: 'สิทธิ์ในข้อมูลพื้นฐาน',
    items: [
      { key: 'act.basic.add', label: 'เพิ่มรายการในข้อมูลพื้นฐาน' },
      { key: 'act.basic.edit', label: 'แก้ไขรายการในข้อมูลพื้นฐาน' },
      { key: 'act.basic.delete', label: 'ลบรายการในข้อมูลพื้นฐาน' },
    ],
  },
  {
    title: 'สิทธิ์พิเศษ',
    items: [
      { key: 'act.special.approve', label: 'อนุมัติรายการ' },
      { key: 'act.special.cancel', label: 'ยกเลิกรายการ' },
      { key: 'act.special.export', label: 'ส่งออกข้อมูล' },
    ],
  },
  {
    title: 'สิทธิ์การแสดงผล',
    items: [
      { key: 'act.view.buyPrice', label: 'แสดงราคาซื้อ' },
      { key: 'act.view.sellPrice', label: 'แสดงราคาขาย' },
      { key: 'act.view.total', label: 'แสดงผลรวม' },
    ],
  },
];

// ---- สิทธิ์การเข้าถึง (ต้นไม้ parent → children) ----
//  โครงสร้าง node: { key, label, children? }
//  node ที่มี children = หัวข้อกลุ่ม (ติ๊กเพื่อเลือก/ยกเลิกลูกทั้งหมด)
export const PERM_ACCESS = [
  {
    key: 'acc.basic', label: 'ข้อมูลพื้นฐาน',
    children: [
      { key: 'acc.basic.fabricReg', label: 'ผ้าประจำ', children: [
        { key: 'acc.basic.fabricReg.item', label: 'ผ้าประจำ' },
        { key: 'acc.basic.fabricReg.group', label: 'กลุ่มผ้าประจำ' },
      ]},
      { key: 'acc.basic.fabricIrr', label: 'ผ้าไม่ประจำ', children: [
        { key: 'acc.basic.fabricIrr.item', label: 'ผ้าไม่ประจำ' },
        { key: 'acc.basic.fabricIrr.group', label: 'กลุ่มผ้าไม่ประจำ' },
      ]},
      { key: 'acc.basic.greige', label: 'ผ้าดิบ' },
      { key: 'acc.basic.customer', label: 'ลูกค้า', children: [
        { key: 'acc.basic.customer.item', label: 'ลูกค้า' },
        { key: 'acc.basic.customer.group', label: 'กลุ่มลูกค้า' },
        { key: 'acc.basic.customer.zone', label: 'โซนลูกค้า' },
      ]},
      { key: 'acc.basic.partner', label: 'คู่ค้า' },
      { key: 'acc.basic.fabricInfo', label: 'ข้อมูลผ้า', children: [
        { key: 'acc.basic.fabricInfo.structure', label: 'โครงสร้างผ้า' },
        { key: 'acc.basic.fabricInfo.composition', label: 'ส่วนประกอบ' },
        { key: 'acc.basic.fabricInfo.width', label: 'หน้ากว้าง' },
        { key: 'acc.basic.fabricInfo.finishing', label: 'Finishing' },
        { key: 'acc.basic.fabricInfo.weight', label: 'น้ำหนัก' },
      ]},
      { key: 'acc.basic.staff', label: 'ข้อมูลพนักงาน', children: [
        { key: 'acc.basic.staff.sales', label: 'พนักงานขาย' },
        { key: 'acc.basic.staff.delivery', label: 'พนักงานส่งของ' },
      ]},
      { key: 'acc.basic.note', label: 'ข้อมูลหมายเหตุ' },
      { key: 'acc.basic.zoneRack', label: 'โซน & แร็ค' },
    ],
  },
  {
    key: 'acc.po', label: 'เปิดใบสั่งซื้อ',
    children: [
      { key: 'acc.po.finished', label: 'ผ้าสำเร็จ' },
      { key: 'acc.po.greige', label: 'ผ้าดิบ' },
      { key: 'acc.po.dye', label: 'สั่งย้อม' },
    ],
  },
  {
    key: 'acc.stock', label: 'จัดการสินค้า',
    children: [
      { key: 'acc.stock.recvFinished', label: 'รับผ้าสำเร็จ' },
      { key: 'acc.stock.recvGreige', label: 'รับผ้าดิบ' },
      { key: 'acc.stock.recvDye', label: 'รับผ้าย้อม' },
      { key: 'acc.stock.move', label: 'ย้ายสินค้า' },
      { key: 'acc.stock.moveGreige', label: 'ย้ายผ้าดิบ' },
      { key: 'acc.stock.moveShelf', label: 'ย้ายชั้นสินค้า' },
      { key: 'acc.stock.barcode', label: 'บาร์โค้ด' },
    ],
  },
  {
    key: 'acc.vat', label: 'จัดการ VAT',
    children: [
      { key: 'acc.vat.group', label: 'กลุ่มสินค้า VAT' },
      { key: 'acc.vat.recv', label: 'รับสินค้า VAT' },
      { key: 'acc.vat.issue', label: 'ตัดสต็อก VAT' },
      { key: 'acc.vat.taxInvoice', label: 'ใบกำกับภาษี' },
      { key: 'acc.vat.issueFromTax', label: 'ตัดสต็อก VAT จากใบกำกับภาษี' },
    ],
  },
  { key: 'acc.salesContract', label: 'สัญญาขาย' },
  {
    key: 'acc.order', label: 'จัดการออร์เดอร์',
    children: [
      { key: 'acc.order.receive', label: 'รับออร์เดอร์' },
      { key: 'acc.order.fulfill', label: 'จัดออร์เดอร์' },
      { key: 'acc.order.invoice', label: 'เปิดอินวอยส์' },
      { key: 'acc.order.returnInvoice', label: 'รับคืนอินวอยส์' },
    ],
  },
  {
    key: 'acc.custAcc', label: 'บัญชีลูกค้า',
    children: [
      { key: 'acc.custAcc.bill', label: 'วางบิลลูกค้า' },
      { key: 'acc.custAcc.receive', label: 'รับเงินลูกค้า' },
      { key: 'acc.custAcc.deduct', label: 'หักบัญชีลูกค้า' },
      { key: 'acc.custAcc.creditNote', label: 'ใบลดหนี้ลูกค้า' },
    ],
  },
  {
    key: 'acc.partnerAcc', label: 'บัญชีคู่ค้า',
    children: [
      { key: 'acc.partnerAcc.pay', label: 'จ่ายเงินคู่ค้า' },
      { key: 'acc.partnerAcc.deduct', label: 'หักบัญชีคู่ค้า' },
      { key: 'acc.partnerAcc.creditNote', label: 'ใบลดหนี้คู่ค้า' },
    ],
  },
  {
    key: 'acc.report', label: 'รายงาน',
    children: [
      { key: 'acc.report.stock', label: 'คลังสินค้า', children: [
        { key: 'acc.report.stock.onhand', label: 'รายงานสินค้าคงคลัง' },
        { key: 'acc.report.stock.onhandShelf', label: 'รายงานสินค้าคงคลังตามชั้น' },
        { key: 'acc.report.stock.greige', label: 'รายงานผ้าดิบคงคลัง' },
        { key: 'acc.report.stock.recv', label: 'รายงานการรับสินค้า' },
        { key: 'acc.report.stock.issue', label: 'รายงานการเบิกสินค้า' },
        { key: 'acc.report.stock.move', label: 'รายงานการย้ายสินค้า' },
        { key: 'acc.report.stock.moveGreige', label: 'รายงานการย้ายผ้าดิบ' },
        { key: 'acc.report.stock.moveShelf', label: 'รายงานการย้ายชั้นสินค้า' },
      ]},
      { key: 'acc.report.vat', label: 'คลัง VAT', children: [
        { key: 'acc.report.vat.onhand', label: 'รายงานสินค้า VAT คงคลัง' },
        { key: 'acc.report.vat.recv', label: 'รายงานรับสินค้า VAT' },
        { key: 'acc.report.vat.issue', label: 'รายงานเบิกสินค้า VAT' },
      ]},
      { key: 'acc.report.po', label: 'รายงานใบสั่งซื้อ' },
      { key: 'acc.report.dyeOrder', label: 'รายงานใบสั่งย้อม' },
      { key: 'acc.report.salesContract', label: 'รายงานใบสัญญาขาย' },
      { key: 'acc.report.order', label: 'รายงานออร์เดอร์' },
      { key: 'acc.report.sales', label: 'การขาย', children: [
        { key: 'acc.report.sales.wholesale', label: 'รายงานการขายส่ง' },
        { key: 'acc.report.sales.retail', label: 'รายงานการขายปลีก' },
        { key: 'acc.report.sales.all', label: 'รายงานการขาย' },
        { key: 'acc.report.sales.returnInvoice', label: 'รายงานรับคืนอินวอยส์' },
      ]},
      { key: 'acc.report.taxInvoice', label: 'รายงานใบกำกับภาษี' },
      { key: 'acc.report.pl', label: 'กำไร & ขาดทุน', children: [
        { key: 'acc.report.pl.wholesale', label: 'รายงานกำไร & ขาดทุนขายส่ง' },
        { key: 'acc.report.pl.retail', label: 'รายงานกำไร & ขาดทุนขายปลีก' },
        { key: 'acc.report.pl.annual', label: 'รายงานกำไร & ขาดทุนรายปี' },
      ]},
      { key: 'acc.report.custAcc', label: 'บัญชีลูกค้า', children: [
        { key: 'acc.report.custAcc.bill', label: 'รายงานวางบิลลูกค้า' },
        { key: 'acc.report.custAcc.receive', label: 'รายงานรับเงินลูกค้า' },
        { key: 'acc.report.custAcc.creditNote', label: 'รายงานใบลดหนี้ลูกค้า' },
      ]},
      { key: 'acc.report.partnerAcc', label: 'บัญชีคู่ค้า', children: [
        { key: 'acc.report.partnerAcc.pay', label: 'รายงานจ่ายเงินคู่ค้า' },
        { key: 'acc.report.partnerAcc.creditNote', label: 'รายงานใบลดหนี้คู่ค้า' },
      ]},
      { key: 'acc.report.annual', label: 'รายงานสรุปประจำปี' },
      { key: 'acc.report.reorder', label: 'รายงานจุดสั่งซื้อสินค้า' },
      { key: 'acc.report.others', label: 'อื่นๆ', children: [
        { key: 'acc.report.others.priceEdit', label: 'รายงานการแก้ไขราคาขาย' },
        { key: 'acc.report.others.stockAdjust', label: 'รายงานการปรับสต็อกสินค้า' },
        { key: 'acc.report.others.split', label: 'รายงานการแบ่งพับสินค้า' },
        { key: 'acc.report.others.barcodeHistory', label: 'รายงานประวัติบาร์โค้ด' },
      ]},
    ],
  },
  {
    key: 'acc.users', label: 'ผู้ใช้งาน',
    children: [
      { key: 'acc.users.accounts', label: 'บัญชีผู้ใช้งาน' },
      { key: 'acc.users.permissions', label: 'สิทธิ์การเข้าใช้งาน' },
    ],
  },
];

// ---- รวบรวม key ทั้งหมด (ใบ) ของ node หนึ่ง (ใช้ตอนติ๊กหัวข้อ) ----
export function leafKeysOf(node) {
  if (!node.children || node.children.length === 0) return [node.key];
  return node.children.flatMap(leafKeysOf);
}

// ---- ตำแหน่ง/ฝ่าย เริ่มต้น + สิทธิ์ที่แนะนำ (ใช้เป็นเทมเพลตเลือกเร็ว) ----
export const ROLE_PRESETS = [
  { key: 'ceo', label: 'CEO / ผู้บริหาร', desc: 'เข้าถึงได้ทุกเมนู แก้ไข/ลบ/อนุมัติได้ทั้งหมด' },
  { key: 'warehouse', label: 'พนักงานคลังสินค้า', desc: 'จัดการสต็อก รับ-ย้ายสินค้า บาร์โค้ด' },
  { key: 'delivery', label: 'พนักงานส่งของ', desc: 'ดูออร์เดอร์/จัดออร์เดอร์ที่ต้องส่ง' },
  { key: 'accounting', label: 'ฝ่ายบัญชี', desc: 'VAT ใบกำกับภาษี บัญชีลูกค้า/คู่ค้า รายงาน' },
  { key: 'order', label: 'ฝ่ายรับออเดอร์', desc: 'รับออร์เดอร์ เปิดอินวอยส์ สัญญาขาย' },
  { key: 'fabricPicker', label: 'ฝ่ายตัด/หาผ้าออเดอร์', desc: 'ดูผ้า/สต็อก จัดผ้าตามออร์เดอร์' },
];
