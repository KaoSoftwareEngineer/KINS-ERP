<script>
import DashboardHome from './dashboard/DashboardHome.vue';
import UsersPage from './dashboard/UsersPage.vue';
import AnalyticsPage from './dashboard/AnalyticsPage.vue';
import SettingsPage from './dashboard/SettingsPage.vue';
import FabricRegularPage from './dashboard/FabricRegularPage.vue';
import FabricIrregularPage from './dashboard/FabricIrregularPage.vue';
import BasicDataGenericPage from './dashboard/BasicDataGenericPage.vue';
import PoGenericPage from './dashboard/PoGenericPage.vue';
import StockGenericPage from './dashboard/StockGenericPage.vue';
import VatGenericPage from './dashboard/VatGenericPage.vue';
import OrderReceivePage from './dashboard/OrderReceivePage.vue';
import OrderGenericPage from './dashboard/OrderGenericPage.vue';
import CustAccGenericPage from './dashboard/CustAccGenericPage.vue';
import PartnerAccGenericPage from './dashboard/PartnerAccGenericPage.vue';
import ReportGenericPage from './dashboard/ReportGenericPage.vue';
import UserPermissionsPage from './dashboard/UserPermissionsPage.vue';
import SalesContractPage from './dashboard/SalesContractPage.vue';
import OrderSlipModal from './dashboard/OrderSlipModal.vue';
import CustomerEditModal from './dashboard/CustomerEditModal.vue';
import ShadeModal from './dashboard/ShadeModal.vue';

const API = '';

export default {
  name: 'DashboardView',
  components: {
    DashboardHome,
    UsersPage,
    AnalyticsPage,
    SettingsPage,
    FabricRegularPage,
    FabricIrregularPage,
    BasicDataGenericPage,
    PoGenericPage,
    StockGenericPage,
    VatGenericPage,
    OrderReceivePage,
    OrderGenericPage,
    CustAccGenericPage,
    PartnerAccGenericPage,
    ReportGenericPage,
    UserPermissionsPage,
    SalesContractPage,
    OrderSlipModal,
    CustomerEditModal,
    ShadeModal,
  },
  provide() {
    return { dash: this };
  },
data() {
      return {
        theme: localStorage.getItem('theme') || 'light',
        lang: localStorage.getItem('lang') || 'th',
        langDropdownOpen: false,
        mobileMenuOpen: false,
        currentPage: 'dashboard',
        openGroups: { basic: false, po: false, stock: false, vat: false, order: false, custAcc: false, partnerAcc: false, report: false, usersGrp: false },
        nestedMenuOpen: {},
        usersMenu: [
          { key: 'users', label: { th: 'บัญชีผู้ใช้งาน', en: 'User Accounts' } },
          { key: 'user-permissions', label: { th: 'สิทธิ์การเข้าใช้งาน', en: 'Permissions' } },
        ],
        userRoles: {
          columns: ['บทบาท (Role)', 'คำอธิบาย', 'สิทธิ์การเข้าถึงเมนู', 'จำนวนผู้ใช้งาน', 'สถานะ'],
          rows: [
            ['ผู้ดูแลระบบ (Admin)', 'เข้าถึงได้ทุกเมนู แก้ไข/ลบข้อมูลได้ทั้งหมด', 'ทุกเมนู (Full Access)', '2', 'ใช้งาน'],
            ['พนักงานคลังสินค้า', 'จัดการสต็อก รับ-ย้ายสินค้า บาร์โค้ด', 'จัดการสินค้า, ข้อมูลพื้นฐาน', '5', 'ใช้งาน'],
            ['ฝ่ายบัญชี', 'จัดการ VAT ใบกำกับภาษี บัญชีลูกค้า/คู่ค้า', 'จัดการ VAT, บัญชีลูกค้า, บัญชีคู่ค้า, รายงาน', '3', 'ใช้งาน'],
            ['ฝ่ายขาย', 'รับออร์เดอร์ เปิดอินวอยส์ สัญญาขาย', 'จัดการออร์เดอร์, สัญญาขาย', '4', 'ใช้งาน'],
          ],
        },
        reportMenu: [
          { key: 'report-stock', label: { th: 'คลังสินค้า', en: 'Inventory' } },
          { key: 'report-vat-stock', label: { th: 'คลัง VAT', en: 'VAT Inventory' } },
          { key: 'report-po', label: { th: 'รายงานใบสั่งซื้อ', en: 'Purchase Order Report' } },
          { key: 'report-dye-order', label: { th: 'รายงานใบสั่งย้อม', en: 'Dyeing Order Report' } },
          { key: 'report-sales-contract', label: { th: 'รายงานใบสัญญาขาย', en: 'Sales Contract Report' } },
          { key: 'report-order', label: { th: 'รายงานออร์เดอร์', en: 'Order Report' } },
          { key: 'report-sales', label: { th: 'การขาย', en: 'Sales' } },
          { key: 'report-tax-invoice', label: { th: 'รายงานใบกำกับภาษี', en: 'Tax Invoice Report' } },
          { key: 'report-profit-loss', label: { th: 'กำไร & ขาดทุน', en: 'Profit & Loss' } },
          { key: 'report-customer-account', label: { th: 'บัญชีลูกค้า', en: 'Customer Accounts' } },
          { key: 'report-partner-account', label: { th: 'บัญชีคู่ค้า', en: 'Vendor Accounts' } },
          { key: 'report-annual-summary', label: { th: 'รายงานสรุปประจำปี', en: 'Annual Summary' } },
          { key: 'report-reorder-point', label: { th: 'รายงานจุดสั่งซื้อสินค้า', en: 'Reorder Point Report' } },
          { key: 'report-others', label: { th: 'อื่นๆ', en: 'Others' } },
        ],
        reportPages: {
          'report-stock': {
            title: 'รายงานคลังสินค้า', icon: '📦',
            columns: ['รหัสสินค้า', 'ชื่อสินค้า', 'หมวดหมู่', 'คงเหลือ', 'หน่วย', 'มูลค่าคงเหลือ', 'สถานะ'],
            rows: [
              ['FR-001', 'ผ้าคอตตอน 100%', 'ผ้าประจำ', '1,050', 'หลา', '฿89,250', 'ปกติ'],
              ['GR-01', 'ผ้าดิบคอตตอน 40s', 'ผ้าดิบ', '3,050', 'หลา', '฿259,250', 'ปกติ'],
            ],
          },
          'report-vat-stock': {
            title: 'รายงานคลัง VAT', icon: '🧾',
            columns: ['รหัสสินค้า', 'ชื่อสินค้า', 'กลุ่ม VAT', 'คงเหลือ', 'มูลค่าก่อน VAT', 'VAT 7%', 'มูลค่ารวม'],
            rows: [
              ['FR-001', 'ผ้าคอตตอน 100%', 'ผ้าสำเร็จ (VAT)', '1,050 หลา', '฿89,250', '฿6,247', '฿95,497'],
              ['GR-01', 'ผ้าดิบคอตตอน 40s', 'ผ้าดิบ (VAT)', '3,050 หลา', '฿259,250', '฿18,147', '฿277,397'],
            ],
          },
          'report-po': {
            title: 'รายงานใบสั่งซื้อ', icon: '🛒',
            columns: ['เลขที่ PO', 'วันที่สั่งซื้อ', 'ผู้ขาย/ซัพพลายเออร์', 'มูลค่ารวม', 'สถานะ'],
            rows: [
              ['PO-F-2026001', '05/08/2026', 'บจก. สยามเทรดดิ้ง', '฿95,000', 'อนุมัติแล้ว'],
              ['PO-R-2026002', '11/08/2026', 'หจก. เอเชียยาร์น', '฿39,200', 'รออนุมัติ'],
            ],
          },
          'report-dye-order': {
            title: 'รายงานใบสั่งย้อม', icon: '🎨',
            columns: ['เลขที่ใบสั่งย้อม', 'วันที่สั่ง', 'โรงย้อม', 'จำนวน (หลา)', 'กำหนดส่งมอบ', 'สถานะ'],
            rows: [
              ['DYE-2026001', '06/08/2026', 'โรงย้อมรุ่งเรือง', '450', '20/08/2026', 'กำลังย้อม'],
              ['DYE-2026002', '12/08/2026', 'โรงย้อมไทยคัลเลอร์', '280', '26/08/2026', 'รอส่งโรงย้อม'],
            ],
          },
          'report-sales-contract': {
            title: 'รายงานใบสัญญาขาย', icon: '📜',
            columns: ['เลขที่สัญญา', 'ลูกค้า', 'มูลค่าสัญญา', 'วันที่สิ้นสุดสัญญา', 'สถานะ'],
            rows: [
              ['CT-2026001', 'บจก. สยามเทรดดิ้ง', '฿1,200,000', '31/07/2027', 'มีผลบังคับใช้'],
              ['CT-2026002', 'ร้านแฟชั่นเฮ้าส์', '฿350,000', '14/08/2027', 'รอลูกค้าเซ็น'],
            ],
          },
          'report-order': {
            title: 'รายงานออร์เดอร์', icon: '🛍️',
            columns: ['เลขที่ออร์เดอร์', 'ลูกค้า', 'จำนวนรวม', 'วันที่ต้องการรับสินค้า', 'สถานะ'],
            rows: [
              ['ORD-2026001', 'บจก. สยามเทรดดิ้ง', '600 หลา', '20/08/2026', 'จัดครบแล้ว'],
              ['ORD-2026002', 'ร้านแฟชั่นเฮ้าส์', '150 หลา', '25/08/2026', 'กำลังจัด'],
            ],
          },
          'report-sales': {
            title: 'รายงานการขาย', icon: '📈',
            columns: ['ช่วงเวลา', 'ยอดขายรวม', 'จำนวนออร์เดอร์', 'ลูกค้าที่ซื้อ'],
            rows: [
              ['สัปดาห์นี้', '฿80,250', '2', '2 ราย'],
              ['เดือนนี้', '฿312,500', '9', '5 ราย'],
            ],
          },
          'report-tax-invoice': {
            title: 'รายงานใบกำกับภาษี', icon: '🧾',
            columns: ['เลขที่ใบกำกับภาษี', 'ลูกค้า', 'มูลค่าก่อน VAT', 'VAT 7%', 'มูลค่ารวม', 'สถานะ'],
            rows: [
              ['INV-2026001', 'บจก. สยามเทรดดิ้ง', '฿125,000', '฿8,750', '฿133,750', 'ออกแล้ว'],
              ['INV-2026002', 'ร้านแฟชั่นเฮ้าส์', '฿48,000', '฿3,360', '฿51,360', 'รอชำระ'],
            ],
          },
          'report-profit-loss': {
            title: 'รายงานกำไร & ขาดทุน', icon: '📊',
            columns: ['หมวด', 'รายได้', 'ต้นทุน/ค่าใช้จ่าย', 'กำไร (ขาดทุน)'],
            rows: [
              ['ขายผ้าสำเร็จ', '฿312,500', '฿198,000', '฿114,500'],
              ['ค่าย้อมผ้า/บริการ', '฿0', '฿42,000', '-฿42,000'],
            ],
          },
          'report-customer-account': {
            title: 'รายงานบัญชีลูกค้า', icon: '💳',
            columns: ['ลูกค้า', 'ยอดขายรวม', 'ยอดชำระแล้ว', 'ยอดค้างชำระ', 'สถานะ'],
            rows: [
              ['บจก. สยามเทรดดิ้ง', '฿189,200', '฿64,200', '฿125,000', 'ค้างชำระ'],
              ['ร้านแฟชั่นเฮ้าส์', '฿51,360', '฿51,360', '฿0', 'ชำระครบ'],
            ],
          },
          'report-partner-account': {
            title: 'รายงานบัญชีคู่ค้า', icon: '💸',
            columns: ['คู่ค้า', 'ยอดสั่งซื้อรวม', 'ยอดจ่ายแล้ว', 'ยอดค้างจ่าย', 'สถานะ'],
            rows: [
              ['บจก. ไทยเท็กซ์ไทล์', '฿67,500', '฿67,500', '฿0', 'จ่ายครบ'],
              ['หจก. เอเชียยาร์น', '฿39,200', '฿0', '฿39,200', 'ค้างจ่าย'],
            ],
          },
          'report-annual-summary': {
            title: 'รายงานสรุปประจำปี', icon: '📅',
            columns: ['เดือน', 'ยอดขาย', 'ยอดซื้อ', 'กำไรสุทธิ'],
            rows: [
              ['กรกฎาคม 2026', '฿285,000', '฿180,400', '฿104,600'],
              ['สิงหาคม 2026', '฿312,500', '฿201,900', '฿110,600'],
            ],
          },
          'report-reorder-point': {
            title: 'รายงานจุดสั่งซื้อสินค้า', icon: '⚠️',
            columns: ['รหัสสินค้า', 'ชื่อสินค้า', 'คงเหลือ', 'จุดสั่งซื้อขั้นต่ำ', 'สถานะ'],
            rows: [
              ['FR-003', 'ผ้ายีนส์เดนิม', '85 หลา', '100 หลา', 'ต่ำกว่าจุดสั่งซื้อ'],
              ['FR-005', 'สีทาภายนอก 5 แกลลอน', '12 ถัง', '15 ถัง', 'ต่ำกว่าจุดสั่งซื้อ'],
            ],
          },
          'report-others': {
            title: 'รายงานอื่นๆ', icon: '📄',
            columns: ['รายการ', 'รายละเอียด', 'วันที่', 'สถานะ'],
            rows: [
              ['รายงานการเข้า-ออกพนักงานคลัง', 'สรุปเวลาทำงานประจำเดือน', '31/08/2026', 'พร้อมดู'],
              ['รายงานของเสีย/สินค้าตำหนิ', 'สรุปสินค้าที่ถูกตัดออกจากสต็อก', '31/08/2026', 'พร้อมดู'],
            ],
          },
        },
        partnerAccMenu: [
          { key: 'pay-partner', label: { th: 'จ่ายเงินคู่ค้า', en: 'Vendor Payment' } },
          { key: 'deduct-partner-account', label: { th: 'หักบัญชีคู่ค้า', en: 'Vendor Deduction' } },
          { key: 'credit-note-partner', label: { th: 'ใบลดหนี้คู่ค้า', en: 'Vendor Credit Note' } },
        ],
        partnerAccPages: {
          'pay-partner': {
            title: 'จ่ายเงินคู่ค้า', icon: '💸',
            columns: ['เลขที่ใบจ่ายเงิน', 'วันที่จ่ายเงิน', 'คู่ค้า', 'อ้างอิงใบรับสินค้า/PO', 'จำนวนเงินที่จ่าย', 'ช่องทางชำระ', 'สถานะ'],
            rows: [
              ['PAY-2026001', '18/08/2026', 'บจก. ไทยเท็กซ์ไทล์', 'PO-R-2026001', '฿67,500', 'โอนเงิน', 'จ่ายแล้ว'],
              ['PAY-2026002', '23/08/2026', 'หจก. เอเชียยาร์น', 'PO-R-2026002', '฿39,200', 'เช็ค', 'รอวันที่เช็ค'],
            ],
          },
          'deduct-partner-account': {
            title: 'หักบัญชีคู่ค้า', icon: '➖',
            columns: ['เลขที่ใบหักบัญชี', 'วันที่หักบัญชี', 'คู่ค้า', 'สาเหตุ', 'จำนวนเงินที่หัก', 'ยอดคงเหลือหลังหัก', 'สถานะ'],
            rows: [
              ['PDD-2026001', '19/08/2026', 'บจก. ไทยเท็กซ์ไทล์', 'สินค้าไม่ตรงสเปก', '฿3,000', '฿64,500', 'บันทึกแล้ว'],
              ['PDD-2026002', '24/08/2026', 'หจก. เอเชียยาร์น', 'ส่งของล่าช้า', '฿1,200', '฿38,000', 'รออนุมัติ'],
            ],
          },
          'credit-note-partner': {
            title: 'ใบลดหนี้คู่ค้า', icon: '📉',
            columns: ['เลขที่ใบลดหนี้', 'วันที่ออก', 'คู่ค้า', 'อ้างอิง PO/ใบรับสินค้า', 'สาเหตุ', 'มูลค่าที่ลดหนี้', 'สถานะ'],
            rows: [
              ['PCN-2026001', '20/08/2026', 'บจก. ไทยเท็กซ์ไทล์', 'RCV-R-2026001', 'ส่งคืนสินค้าชำรุด', '฿4,500', 'ได้รับแล้ว'],
              ['PCN-2026002', '26/08/2026', 'หจก. เอเชียยาร์น', 'RCV-R-2026002', 'น้ำหนักขาด', '฿1,960', 'รอตรวจสอบ'],
            ],
          },
        },
        custAccMenu: [
          { key: 'billing-customer', label: { th: 'วางบิลลูกค้า', en: 'Customer Billing' } },
          { key: 'receive-payment-customer', label: { th: 'รับเงินลูกค้า', en: 'Customer Payment' } },
          { key: 'deduct-customer-account', label: { th: 'หักบัญชีลูกค้า', en: 'Customer Deduction' } },
          { key: 'credit-note-customer', label: { th: 'ใบลดหนี้ลูกค้า', en: 'Customer Credit Note' } },
        ],
        custAccPages: {
          'billing-customer': {
            title: 'วางบิลลูกค้า', icon: '📃',
            columns: ['เลขที่ใบวางบิล', 'วันที่วางบิล', 'ลูกค้า', 'อ้างอิงอินวอยส์', 'มูลค่ารวม', 'กำหนดชำระ', 'สถานะ'],
            rows: [
              ['BILL-2026001', '12/08/2026', 'บจก. สยามเทรดดิ้ง', 'IV-2026001', '฿64,200', '10/09/2026', 'วางบิลแล้ว'],
              ['BILL-2026002', '17/08/2026', 'ร้านแฟชั่นเฮ้าส์', 'IV-2026002', '฿16,050', '15/09/2026', 'รอวางบิล'],
            ],
          },
          'receive-payment-customer': {
            title: 'รับเงินลูกค้า', icon: '💵',
            columns: ['เลขที่ใบรับเงิน', 'วันที่รับเงิน', 'ลูกค้า', 'อ้างอิงใบวางบิล', 'จำนวนเงินที่รับ', 'ช่องทางชำระ', 'สถานะ'],
            rows: [
              ['RCP-2026001', '20/08/2026', 'บจก. สยามเทรดดิ้ง', 'BILL-2026001', '฿64,200', 'โอนเงิน', 'รับชำระแล้ว'],
              ['RCP-2026002', '22/08/2026', 'ร้านแฟชั่นเฮ้าส์', 'BILL-2026002', '฿8,000', 'เงินสด', 'ชำระบางส่วน'],
            ],
          },
          'deduct-customer-account': {
            title: 'หักบัญชีลูกค้า', icon: '➖',
            columns: ['เลขที่ใบหักบัญชี', 'วันที่หักบัญชี', 'ลูกค้า', 'สาเหตุ', 'จำนวนเงินที่หัก', 'ยอดคงเหลือหลังหัก', 'สถานะ'],
            rows: [
              ['DED-2026001', '21/08/2026', 'ร้านแฟชั่นเฮ้าส์', 'ส่วนลดสินค้าตำหนิ', '฿1,500', '฿6,550', 'บันทึกแล้ว'],
              ['DED-2026002', '25/08/2026', 'บจก. สยามเทรดดิ้ง', 'ค่าปรับส่งล่าช้า', '฿2,000', '฿0', 'รออนุมัติ'],
            ],
          },
          'credit-note-customer': {
            title: 'ใบลดหนี้ลูกค้า', icon: '📉',
            columns: ['เลขที่ใบลดหนี้', 'วันที่ออก', 'ลูกค้า', 'อ้างอิงอินวอยส์', 'สาเหตุ', 'มูลค่าที่ลดหนี้', 'สถานะ'],
            rows: [
              ['CN-2026001', '19/08/2026', 'บจก. สยามเทรดดิ้ง', 'IV-2026001', 'รับคืนสินค้า', '฿5,350', 'ออกแล้ว'],
              ['CN-2026002', '23/08/2026', 'ร้านแฟชั่นเฮ้าส์', 'IV-2026002', 'สินค้าชำรุด', '฿1,070', 'รออนุมัติ'],
            ],
          },
        },
        orderMenu: [
          { key: 'order-receive', label: { th: 'รับออร์เดอร์', en: 'Receive Order' } },
          { key: 'order-fulfill', label: { th: 'จัดออร์เดอร์', en: 'Fulfill Order' } },
          { key: 'invoice-open', label: { th: 'เปิดอินวอยส์', en: 'Create Invoice' } },
          { key: 'invoice-return', label: { th: 'รับคืนอินวอยส์', en: 'Invoice Return' } },
        ],
        orderPages: {
          'order-fulfill': {
            title: 'จัดออร์เดอร์', icon: '📦',
            columns: ['เลขที่ออร์เดอร์', 'วันที่จัด', 'ลูกค้า', 'ผู้จัดออร์เดอร์', 'จำนวนที่จัดแล้ว', 'จำนวนทั้งหมด', 'สถานะ'],
            rows: [
              ['ORD-2026001', '10/08/2026', 'บจก. สยามเทรดดิ้ง', 'นายกิตติ มั่นคง', '600 หลา', '600 หลา', 'จัดครบแล้ว'],
              ['ORD-2026002', '14/08/2026', 'ร้านแฟชั่นเฮ้าส์', 'นายกิตติ มั่นคง', '80 หลา', '150 หลา', 'กำลังจัด'],
            ],
          },
          'invoice-open': {
            title: 'เปิดอินวอยส์', icon: '🧾',
            columns: ['เลขที่อินวอยส์', 'วันที่ออก', 'อ้างอิงออร์เดอร์', 'ลูกค้า', 'มูลค่ารวม', 'กำหนดชำระ', 'สถานะ'],
            rows: [
              ['IV-2026001', '11/08/2026', 'ORD-2026001', 'บจก. สยามเทรดดิ้ง', '฿64,200', '10/09/2026', 'ออกแล้ว'],
              ['IV-2026002', '16/08/2026', 'ORD-2026002', 'ร้านแฟชั่นเฮ้าส์', '฿16,050', '15/09/2026', 'รอชำระ'],
            ],
          },
          'invoice-return': {
            title: 'รับคืนอินวอยส์', icon: '↩️',
            columns: ['เลขที่ใบคืน', 'วันที่รับคืน', 'อ้างอิงอินวอยส์', 'ลูกค้า', 'สินค้าที่คืน', 'จำนวนที่คืน', 'มูลค่าที่คืน', 'สถานะ'],
            rows: [
              ['RTV-2026001', '18/08/2026', 'IV-2026001', 'บจก. สยามเทรดดิ้ง', 'ผ้าคอตตอน 100%', '50 หลา', '฿5,350', 'รับคืนแล้ว'],
              ['RTV-2026002', '20/08/2026', 'IV-2026002', 'ร้านแฟชั่นเฮ้าส์', 'ผ้าไหมอิตาลี', '10 หลา', '฿1,070', 'รอตรวจสอบ'],
            ],
          },
        },
        oeForm: {
          date: new Date().toISOString().slice(0, 10),
          customer: '',
          salesperson: '',
          note: '',
          urgent: false,
          orderNo: 'OR2608-005',
          paymentTerm: 'Cash',
        },
        oeSalespersonOptions: ['นายกิตติ มั่นคง', 'นางสาวปิยะดา สุขใจ'],
        oePaymentTermOptions: ['Cash', 'เครดิต 15 วัน', 'เครดิต 30 วัน', 'เครดิต 60 วัน'],
        oeColorCodeOptions: ['C-01', 'C-02', 'C-03', 'C-04', 'C-05'],
        oePackOptions: ['ม้วน', 'แพ็ค', 'กล่อง', 'มัด'],
        oeRowKeySeq: 1,
        oeSaved: false,
        oeShowSlip: false,
        xlShowPanel: false,
        xlFile: null,
        xlImporting: false,
        xlImportMessage: '',
        xlRows: [],
        xlLoading: false,
        xlPage: 1,
        xlPageSize: 10,
        cmShowPanel: false,
        cmFile: null,
        cmImporting: false,
        cmImportMessage: '',
        cmRows: [],
        cmLoading: false,
        cmPage: 1,
        cmPageSize: 10,
        cmShowEditModal: false,
        cmEditingId: null,
        cmEditItem: { customer_code: '', customer_name: '', address: '' },
        oeItems: [
          { _key: 1, no: 1, sku: '', colorCode: '', width: '', availableQty: '', orderedQty: '', unit: 'หลา', pack: '', custCode: '', substitute: false, substituteText: '' },
        ],
        vatMenu: [
          { key: 'vat-product-group', label: { th: 'กลุ่มสินค้า VAT', en: 'VAT Product Group' } },
          { key: 'vat-receive', label: { th: 'รับสินค้า VAT', en: 'Receive VAT Goods' } },
          { key: 'vat-stock-cut', label: { th: 'ตัดสต็อก VAT', en: 'VAT Stock Deduction' } },
          { key: 'vat-invoice', label: { th: 'ใบกำกับภาษี', en: 'Tax Invoice' } },
          { key: 'vat-stock-cut-from-invoice', label: { th: 'ตัดสต็อก VAT จากใบกำกับภาษี', en: 'VAT Deduction from Invoice' } },
        ],
        salesContracts: {
          columns: ['เลขที่สัญญา', 'วันที่ทำสัญญา', 'ลูกค้า', 'มูลค่าสัญญา', 'วันที่เริ่มสัญญา', 'วันที่สิ้นสุดสัญญา', 'สถานะ'],
          rows: [
            ['CT-2026001', '01/08/2026', 'บจก. สยามเทรดดิ้ง', '฿1,200,000', '01/08/2026', '31/07/2027', 'มีผลบังคับใช้'],
            ['CT-2026002', '10/08/2026', 'ร้านแฟชั่นเฮ้าส์', '฿350,000', '15/08/2026', '14/08/2027', 'รอลูกค้าเซ็น'],
          ],
        },
        vatPages: {
          'vat-product-group': {
            title: 'กลุ่มสินค้า VAT', icon: '🏷️',
            columns: ['รหัสกลุ่ม', 'ชื่อกลุ่มสินค้า VAT', 'อัตราภาษี (%)', 'จำนวนสินค้าในกลุ่ม', 'สถานะ'],
            rows: [
              ['VG-01', 'ผ้าสำเร็จ (VAT)', '7', '128', 'ใช้งาน'],
              ['VG-02', 'ผ้าดิบ (VAT)', '7', '64', 'ใช้งาน'],
            ],
          },
          'vat-receive': {
            title: 'รับสินค้า VAT', icon: '📥',
            columns: ['เลขที่ใบรับ VAT', 'วันที่รับ', 'อ้างอิง PO', 'ผู้ขาย', 'มูลค่าก่อน VAT', 'VAT 7%', 'มูลค่ารวม VAT', 'สถานะ'],
            rows: [
              ['VR-2026001', '07/08/2026', 'PO-F-2026001', 'บจก. สยามเทรดดิ้ง', '฿95,000', '฿6,650', '฿101,650', 'รับเข้าแล้ว'],
              ['VR-2026002', '13/08/2026', 'PO-R-2026002', 'หจก. เอเชียยาร์น', '฿39,200', '฿2,744', '฿41,944', 'รอตรวจสอบ'],
            ],
          },
          'vat-stock-cut': {
            title: 'ตัดสต็อก VAT', icon: '✂️',
            columns: ['เลขที่ใบตัดสต็อก', 'วันที่ตัด', 'ชื่อสินค้า', 'จำนวนที่ตัด', 'คงเหลือหลังตัด', 'ผู้ทำรายการ', 'สถานะ'],
            rows: [
              ['VC-2026001', '09/08/2026', 'ผ้าคอตตอน 100%', '200 หลา', '1,050 หลา', 'นายกิตติ มั่นคง', 'เสร็จสิ้น'],
              ['VC-2026002', '14/08/2026', 'ผ้าดิบคอตตอน 40s', '150 กก.', '3,050 หลา', 'นายกิตติ มั่นคง', 'เสร็จสิ้น'],
            ],
          },
          'vat-invoice': {
            title: 'ใบกำกับภาษี', icon: '🧾',
            columns: ['เลขที่ใบกำกับภาษี', 'วันที่ออก', 'ลูกค้า/ผู้ขาย', 'มูลค่าก่อน VAT', 'VAT 7%', 'มูลค่ารวม', 'สถานะ'],
            rows: [
              ['INV-2026001', '10/08/2026', 'บจก. สยามเทรดดิ้ง', '฿125,000', '฿8,750', '฿133,750', 'ออกแล้ว'],
              ['INV-2026002', '15/08/2026', 'ร้านแฟชั่นเฮ้าส์', '฿48,000', '฿3,360', '฿51,360', 'รอชำระ'],
            ],
          },
          'vat-stock-cut-from-invoice': {
            title: 'ตัดสต็อก VAT จากใบกำกับภาษี', icon: '📑',
            columns: ['เลขที่ใบกำกับภาษีอ้างอิง', 'วันที่ตัดสต็อก', 'ชื่อสินค้า', 'จำนวนที่ตัด', 'คลัง/โซนที่ตัด', 'ผู้ทำรายการ', 'สถานะ'],
            rows: [
              ['INV-2026001', '10/08/2026', 'ผ้าคอตตอน 100%', '300 หลา', 'A-01 / แร็ค 1', 'นายกิตติ มั่นคง', 'ตัดสต็อกแล้ว'],
              ['INV-2026002', '15/08/2026', 'ผ้าไหมอิตาลี', '50 หลา', 'A-03 / แร็ค 2', 'นายกิตติ มั่นคง', 'รอตัดสต็อก'],
            ],
          },
        },
        stockMenu: [
          { key: 'receive-fabric-finished', label: { th: 'รับผ้าสำเร็จ', en: 'Receive Finished Fabric' } },
          { key: 'receive-fabric-raw', label: { th: 'รับผ้าดิบ', en: 'Receive Raw Fabric' } },
          { key: 'receive-fabric-dyed', label: { th: 'รับผ้าย้อม', en: 'Receive Dyed Fabric' } },
          { key: 'move-stock', label: { th: 'ย้ายสินค้า', en: 'Transfer Stock' } },
          { key: 'move-fabric-raw', label: { th: 'ย้ายผ้าดิบ', en: 'Transfer Raw Fabric' } },
          { key: 'move-shelf', label: { th: 'ย้ายชั้นสินค้า', en: 'Transfer Shelf' } },
          { key: 'barcode', label: { th: 'บาร์โค้ด', en: 'Barcode' } },
        ],
        stockPages: {
          'receive-fabric-finished': {
            title: 'รับผ้าสำเร็จ', icon: '📥',
            columns: ['เลขที่ใบรับ', 'วันที่รับ', 'อ้างอิง PO', 'ชื่อผ้า', 'จำนวนที่รับ (หลา)', 'โซน/แร็คที่จัดเก็บ', 'ผู้รับสินค้า', 'สถานะ'],
            rows: [
              ['RCV-F-2026001', '07/08/2026', 'PO-F-2026001', 'ผ้าคอตตอน 100%', '1,000', 'A-01 / แร็ค 1', 'นายกิตติ มั่นคง', 'รับเข้าแล้ว'],
              ['RCV-F-2026002', '12/08/2026', 'PO-F-2026002', 'ผ้ายีนส์เดนิม', '500', 'A-02 / แร็ค 2', 'นายกิตติ มั่นคง', 'รอตรวจนับ'],
            ],
          },
          'receive-fabric-raw': {
            title: 'รับผ้าดิบ', icon: '📥',
            columns: ['เลขที่ใบรับ', 'วันที่รับ', 'อ้างอิง PO', 'ชื่อผ้าดิบ', 'น้ำหนักที่รับ (กก.)', 'โซน/แร็คที่จัดเก็บ', 'ผู้รับสินค้า', 'สถานะ'],
            rows: [
              ['RCV-R-2026001', '05/08/2026', 'PO-R-2026001', 'ผ้าดิบคอตตอน 40s', '450', 'B-01 / แร็ค 1', 'นายกิตติ มั่นคง', 'รับเข้าแล้ว'],
              ['RCV-R-2026002', '13/08/2026', 'PO-R-2026002', 'ผ้าดิบโพลี 75D', '280', 'B-02 / แร็ค 3', 'นายกิตติ มั่นคง', 'รอตรวจนับ'],
            ],
          },
          'receive-fabric-dyed': {
            title: 'รับผ้าย้อม', icon: '🎨',
            columns: ['เลขที่ใบรับ', 'วันที่รับ', 'อ้างอิงใบสั่งย้อม', 'ผ้าที่ย้อมกลับมา', 'สี/เฉดสี', 'จำนวนที่รับ (หลา)', 'โซน/แร็คที่จัดเก็บ', 'สถานะ'],
            rows: [
              ['RCV-D-2026001', '21/08/2026', 'DYE-2026001', 'ผ้าดิบคอตตอน 40s', 'กรมท่า', '440', 'A-01 / แร็ค 1', 'รับเข้าแล้ว'],
              ['RCV-D-2026002', '27/08/2026', 'DYE-2026002', 'ผ้าดิบโพลี 75D', 'ดำ', '275', 'A-02 / แร็ค 2', 'รอตรวจสอบสี'],
            ],
          },
          'move-stock': {
            title: 'ย้ายสินค้า', icon: '🔄',
            columns: ['เลขที่ใบย้าย', 'วันที่ย้าย', 'ชื่อสินค้า', 'จำนวน', 'จากโซน/แร็ค', 'ไปโซน/แร็ค', 'ผู้ทำรายการ', 'สถานะ'],
            rows: [
              ['MOV-2026001', '08/08/2026', 'ผ้าคอตตอน 100%', '200 หลา', 'A-01 / แร็ค 1', 'A-03 / แร็ค 2', 'นายกิตติ มั่นคง', 'เสร็จสิ้น'],
              ['MOV-2026002', '13/08/2026', 'ผ้ายีนส์เดนิม', '100 หลา', 'A-02 / แร็ค 2', 'A-04 / แร็ค 1', 'นายกิตติ มั่นคง', 'กำลังย้าย'],
            ],
          },
          'move-fabric-raw': {
            title: 'ย้ายผ้าดิบ', icon: '🔄',
            columns: ['เลขที่ใบย้าย', 'วันที่ย้าย', 'ชื่อผ้าดิบ', 'น้ำหนัก (กก.)', 'จากโซน/แร็ค', 'ไปโซน/แร็ค', 'ผู้ทำรายการ', 'สถานะ'],
            rows: [
              ['MOV-R-2026001', '09/08/2026', 'ผ้าดิบคอตตอน 40s', '150', 'B-01 / แร็ค 1', 'B-03 / แร็ค 1', 'นายกิตติ มั่นคง', 'เสร็จสิ้น'],
              ['MOV-R-2026002', '14/08/2026', 'ผ้าดิบโพลี 75D', '80', 'B-02 / แร็ค 3', 'B-04 / แร็ค 2', 'นายกิตติ มั่นคง', 'กำลังย้าย'],
            ],
          },
          'move-shelf': {
            title: 'ย้ายชั้นสินค้า', icon: '🗄️',
            columns: ['เลขที่ใบย้าย', 'วันที่ย้าย', 'ชื่อสินค้า', 'จากแร็ค/ชั้น', 'ไปแร็ค/ชั้น', 'จำนวน', 'ผู้ทำรายการ', 'สถานะ'],
            rows: [
              ['SHF-2026001', '10/08/2026', 'ผ้าคอตตอน 100%', 'แร็ค 1 ชั้น 2', 'แร็ค 1 ชั้น 1', '300 หลา', 'นายกิตติ มั่นคง', 'เสร็จสิ้น'],
              ['SHF-2026002', '15/08/2026', 'ผ้าดิบโพลี 75D', 'แร็ค 2 ชั้น 3', 'แร็ค 2 ชั้น 1', '150 กก.', 'นายกิตติ มั่นคง', 'เสร็จสิ้น'],
            ],
          },
          barcode: {
            title: 'บาร์โค้ด', icon: '🏷️',
            columns: ['รหัสบาร์โค้ด', 'ชื่อสินค้า', 'ประเภท', 'จำนวนที่พิมพ์', 'วันที่สร้าง', 'สถานะ'],
            rows: [
              ['BC-FR-001', 'ผ้าคอตตอน 100%', 'ผ้าประจำ', '50', '07/08/2026', 'พิมพ์แล้ว'],
              ['BC-GR-01', 'ผ้าดิบคอตตอน 40s', 'ผ้าดิบ', '30', '05/08/2026', 'พิมพ์แล้ว'],
              ['BC-FI-101', 'ผ้าซาตินพิมพ์ลาย', 'ผ้าไม่ประจำ', '10', '11/08/2026', 'รอพิมพ์'],
            ],
          },
        },
        poMenu: [
          { key: 'po-fabric-finished', label: { th: 'ผ้าสำเร็จ', en: 'Finished Fabric' } },
          { key: 'po-fabric-raw', label: { th: 'ผ้าดิบ', en: 'Raw Fabric' } },
          { key: 'po-dye-order', label: { th: 'สั่งย้อม', en: 'Dyeing Order' } },
        ],
        poPages: {
          'po-fabric-finished': {
            title: 'เปิดใบสั่งซื้อ - ผ้าสำเร็จ', icon: '🧵',
            columns: ['เลขที่ใบสั่งซื้อ', 'วันที่สั่งซื้อ', 'ผู้ขาย/โรงงาน', 'ชื่อผ้า', 'จำนวน (หลา)', 'ราคา/หลา', 'ยอดรวม', 'สถานะ'],
            rows: [
              ['PO-F-2026001', '05/08/2026', 'บจก. สยามเทรดดิ้ง', 'ผ้าคอตตอน 100%', '1,000', '฿95', '฿95,000', 'รออนุมัติ'],
              ['PO-F-2026002', '10/08/2026', 'บจก. ไทยเท็กซ์ไทล์', 'ผ้ายีนส์เดนิม', '500', '฿210', '฿105,000', 'อนุมัติแล้ว'],
            ],
          },
          'po-fabric-raw': {
            title: 'เปิดใบสั่งซื้อ - ผ้าดิบ', icon: '🧻',
            columns: ['เลขที่ใบสั่งซื้อ', 'วันที่สั่งซื้อ', 'ซัพพลายเออร์', 'ชื่อผ้าดิบ', 'ประเภทเส้นด้าย', 'น้ำหนัก (กก.)', 'ยอดรวม', 'สถานะ'],
            rows: [
              ['PO-R-2026001', '03/08/2026', 'บจก. ไทยเท็กซ์ไทล์', 'ผ้าดิบคอตตอน 40s', 'คอตตอน 100%', '450', '฿67,500', 'อนุมัติแล้ว'],
              ['PO-R-2026002', '11/08/2026', 'หจก. เอเชียยาร์น', 'ผ้าดิบโพลี 75D', 'โพลีเอสเตอร์', '280', '฿39,200', 'รออนุมัติ'],
            ],
          },
          'po-dye-order': {
            title: 'เปิดใบสั่งซื้อ - สั่งย้อม', icon: '🎨',
            columns: ['เลขที่ใบสั่งย้อม', 'วันที่สั่ง', 'โรงย้อม', 'ผ้าที่ส่งย้อม', 'สี/เฉดสีที่ต้องการ', 'จำนวน (หลา)', 'กำหนดส่งมอบ', 'สถานะ'],
            rows: [
              ['DYE-2026001', '06/08/2026', 'โรงย้อมรุ่งเรือง', 'ผ้าดิบคอตตอน 40s', 'กรมท่า', '450', '20/08/2026', 'กำลังย้อม'],
              ['DYE-2026002', '12/08/2026', 'โรงย้อมไทยคัลเลอร์', 'ผ้าดิบโพลี 75D', 'ดำ', '280', '26/08/2026', 'รอส่งโรงย้อม'],
            ],
          },
        },
        basicDataMenu: [
          { key: 'fabric-regular', label: { th: 'ผ้าประจำ', en: 'Regular Fabric' }, children: [
              { key: 'fabric-regular', label: { th: 'ผ้าประจำ', en: 'Regular Fabric' } },
              { key: 'fabric-regular-group', label: { th: 'กลุ่มผ้าประจำ', en: 'Fabric Group' } },
            ] },
          { key: 'fabric-irregular', label: { th: 'ผ้าไม่ประจำ', en: 'Irregular Fabric' }, children: [
              { key: 'fabric-irregular', label: { th: 'ผ้าไม่ประจำ', en: 'Irregular Fabric' } },
              { key: 'fabric-irregular-group', label: { th: 'กลุ่มผ้าไม่ประจำ', en: 'Irregular Fabric Group' } },
            ] },
          { key: 'fabric-raw', label: { th: 'ผ้าดิบ', en: 'Raw Fabric' } },
          { key: 'customers', label: { th: 'ลูกค้า', en: 'Customers' } },
          { key: 'partners', label: { th: 'คู่ค้า', en: 'Vendors' } },
          { key: 'fabric-info', label: { th: 'ข้อมูลผ้า', en: 'Fabric Info' } },
          { key: 'employee-info', label: { th: 'ข้อมูลพนักงาน', en: 'Employee Info' } },
          { key: 'note-info', label: { th: 'ข้อมูลหมายเหตุ', en: 'Remarks' } },
          { key: 'zone-rack', label: { th: 'โซน & แร็ค', en: 'Zone & Rack' } },
        ],
        basicDataPages: {
          'fabric-regular-group': {
            title: 'กลุ่มผ้าประจำ', icon: '🏷️',
            columns: ['รหัสกลุ่ม', 'ชื่อกลุ่ม', 'จำนวนผ้าในกลุ่ม', 'สถานะ'],
            rows: [
              ['FG-01', 'ผ้าคอตตอน', '12', 'ใช้งาน'],
              ['FG-02', 'ผ้าไหม', '5', 'ใช้งาน'],
              ['FG-03', 'ผ้ายีนส์', '8', 'ใช้งาน'],
            ],
          },
          'fabric-irregular-group': {
            title: 'กลุ่มผ้าไม่ประจำ', icon: '🏷️',
            columns: ['รหัสกลุ่ม', 'ชื่อกลุ่ม', 'จำนวนผ้าในกลุ่ม', 'สถานะ'],
            rows: [
              ['FIG-01', 'ผ้าซาตินพิมพ์ลาย', '4', 'ใช้งาน'],
              ['FIG-02', 'ผ้าลูกไม้', '3', 'ใช้งาน'],
            ],
          },
          'fabric-raw': {
            title: 'ผ้าดิบ', icon: '🧻',
            columns: ['รหัสผ้าดิบ', 'ชื่อผ้าดิบ', 'ประเภทเส้นด้าย', 'ซัพพลายเออร์', 'น้ำหนัก (กก.)', 'คงเหลือ (หลา)', 'สถานะ'],
            rows: [
              ['GR-01', 'ผ้าดิบคอตตอน 40s', 'คอตตอน 100%', 'บจก. ไทยเท็กซ์ไทล์', '450', '3,200', 'ปกติ'],
              ['GR-02', 'ผ้าดิบโพลี 75D', 'โพลีเอสเตอร์', 'หจก. เอเชียยาร์น', '280', '950', 'ปกติ'],
            ],
          },
          customers: {
            title: 'ลูกค้า', icon: '🧑‍🤝‍🧑',
            columns: ['รหัสลูกค้า', 'ชื่อลูกค้า/บริษัท', 'ผู้ติดต่อ', 'เบอร์โทร', 'เครดิต (วัน)', 'ยอดค้างชำระ'],
            rows: [
              ['CUS-001', 'บจก. สยามเทรดดิ้ง', 'คุณสมชาย ใจดี', '081-234-5678', '30', '฿125,000'],
              ['CUS-002', 'ร้านแฟชั่นเฮ้าส์', 'คุณสมหญิง รักงาม', '089-876-5432', '15', '฿0'],
            ],
          },
          partners: {
            title: 'คู่ค้า', icon: '🤝',
            columns: ['รหัสคู่ค้า', 'ชื่อคู่ค้า', 'ประเภท', 'ผู้ติดต่อ', 'เบอร์โทร'],
            rows: [
              ['PTN-001', 'บจก. ไทยเท็กซ์ไทล์', 'ซัพพลายเออร์ผ้าดิบ', 'คุณวิชัย', '02-123-4567'],
              ['PTN-002', 'บจก. ขนส่งเร็วทันใจ', 'ขนส่ง', 'คุณประสิทธิ์', '086-555-1234'],
            ],
          },
          'fabric-info': {
            title: 'ข้อมูลผ้า', icon: '📋',
            columns: ['รหัสผ้า', 'ชื่อผ้า', 'ประเภทผ้า', 'องค์ประกอบ (Composition)', 'หน้ากว้าง (นิ้ว)', 'น้ำหนัก (GSM)'],
            rows: [
              ['FB-001', 'ผ้าคอตตอน 100%', 'ผ้าทอ', 'Cotton 100%', '58', '180'],
              ['FB-002', 'ผ้ายีนส์เดนิม', 'ผ้าทอ', 'Cotton 98% / Spandex 2%', '56', '320'],
              ['FB-003', 'ผ้าไหมอิตาลี', 'ผ้าถัก', 'Silk 100%', '54', '90'],
            ],
          },
          'employee-info': {
            title: 'ข้อมูลพนักงาน', icon: '👤',
            columns: ['รหัสพนักงาน', 'ชื่อ-สกุล', 'แผนก', 'ตำแหน่ง', 'เบอร์โทร', 'สถานะ'],
            rows: [
              ['EMP-001', 'นายกิตติ มั่นคง', 'คลังสินค้า', 'หัวหน้าคลัง', '081-111-2222', 'ทำงาน'],
              ['EMP-002', 'นางสาวปิยะดา สุขใจ', 'จัดซื้อ', 'เจ้าหน้าที่จัดซื้อ', '082-333-4444', 'ทำงาน'],
            ],
          },
          'note-info': {
            title: 'ข้อมูลหมายเหตุ', icon: '📝',
            columns: ['รหัสหมายเหตุ', 'ข้อความหมายเหตุ', 'ใช้กับหน้า', 'สถานะ'],
            rows: [
              ['NT-01', 'สินค้าตำหนิ ลด 10%', 'ผ้าประจำ / ผ้าไม่ประจำ', 'ใช้งาน'],
              ['NT-02', 'รอตรวจสอบคุณภาพ', 'ผ้าดิบ', 'ใช้งาน'],
            ],
          },
          'zone-rack': {
            title: 'โซน & แร็ค', icon: '🗄️',
            columns: ['รหัสโซน', 'ชื่อโซน', 'แร็ค / ชั้น', 'ความจุ (หลา)', 'ใช้งานแล้ว (หลา)', 'สถานะ'],
            rows: [
              ['A-01', 'โซน A - ผ้าประจำ', 'แร็ค 1 ชั้น 1-3', '5,000', '3,800', 'ปกติ'],
              ['B-02', 'โซน B - ผ้าดิบ', 'แร็ค 2 ชั้น 1-4', '8,000', '7,650', 'ใกล้เต็ม'],
            ],
          },
        },
        frFilters: {
          search: '', type: '', weight: '', active: '',
          skuFrom: '', skuTo: '', composition: '', width: '', substitute: false,
        },
        frShowAddModal: false,
        frModalMode: 'add', // 'add' | 'edit' | 'view'
        frEditingId: null,
        frLoading: false,
        frNewItem: {
          type: '', sku: '', name: '', structure: '', composition: '', width: '',
          finishing: '', weight: '', unit: 'หลา', description: '', productionDays: '',
          imageName: '', substitute: 'no', active: true,
        },
        frItems: [],
        frShowShadeModal: false,
        frShadeContext: 'fabric', // 'fabric' | 'irregular'
        frShadeFabric: null,
        frShadeRows: [],
        frShadeSearch: '',
        frShadeLoading: false,
        frShadeKeySeq: 1,
        fiFilters: {
          search: '', type: '', weight: '', active: '',
          skuFrom: '', skuTo: '', composition: '', width: '', substitute: false,
        },
        fiItems: [],
        fiLoading: false,
        fiShowModal: false,
        fiModalMode: 'add',
        fiEditingId: null,
        fiNewItem: {
          type: '', sku: '', name: '', structure: '', composition: '', width: '',
          finishing: '', weight: '', unit: 'หลา', description: '', productionDays: '',
          imageName: '', substitute: 'no', active: true,
        },
        token: localStorage.getItem('token') || null,
        currentUser: JSON.parse(localStorage.getItem('currentUser')) || {},
        members: [],
        // Dashboard stats
        totalRevenue: '3,468.96',
        monthlySales: 82,
        totalOrders: 12,
        totalSalesAmount: '52,567.53',
        newUsersThisMonth: 12,
        engagementRate: 78,
        averageSessionTime: '23.5',
        // แนวโน้มยอดขาย (Sales Trend) — ข้อมูลตัวอย่าง รอเชื่อมข้อมูลจริง
        dashTrendViewMode: 'month', // 'month' | 'year'
        dashTrendYear: 2026,
        dashSalesByYear: {
          2024: [
            { label: 'ม.ค.', value: 140000 }, { label: 'ก.พ.', value: 150000 }, { label: 'มี.ค.', value: 145000 },
            { label: 'เม.ย.', value: 160000 }, { label: 'พ.ค.', value: 175000 }, { label: 'มิ.ย.', value: 168000 },
            { label: 'ก.ค.', value: 182000 }, { label: 'ส.ค.', value: 190000 }, { label: 'ก.ย.', value: 178000 },
            { label: 'ต.ค.', value: 195000 }, { label: 'พ.ย.', value: 205000 }, { label: 'ธ.ค.', value: 230000 },
          ],
          2025: [
            { label: 'ม.ค.', value: 165000 }, { label: 'ก.พ.', value: 180000 }, { label: 'มี.ค.', value: 172000 },
            { label: 'เม.ย.', value: 200000 }, { label: 'พ.ค.', value: 215000 }, { label: 'มิ.ย.', value: 198000 },
            { label: 'ก.ค.', value: 225000 }, { label: 'ส.ค.', value: 240000 }, { label: 'ก.ย.', value: 220000 },
            { label: 'ต.ค.', value: 250000 }, { label: 'พ.ย.', value: 265000 }, { label: 'ธ.ค.', value: 290000 },
          ],
          2026: [
            { label: 'ม.ค.', value: 180000 }, { label: 'ก.พ.', value: 210000 }, { label: 'มี.ค.', value: 195000 },
            { label: 'เม.ย.', value: 240000 }, { label: 'พ.ค.', value: 260000 }, { label: 'มิ.ย.', value: 230000 },
            { label: 'ก.ค.', value: 285000 }, { label: 'ส.ค.', value: 312500 },
          ],
        },
        dashTrendHoverIdx: null,
        // ปริมาณการขาย (Sales Volume) — ข้อมูลตัวอย่าง รอเชื่อมข้อมูลจริง
        dashVolumeData: [
          { label: 'ผ้าประจำ', value: 58 },
          { label: 'ผ้าไม่ประจำ', value: 24 },
          { label: 'ผ้าดิบ', value: 18 },
        ],
        dashVolumeHoverIdx: null,
        // Analytics
        totalViews: '8,542',
        conversions: 756,
        conversionRate: 8.9,
        bounceRate: 32,
        // Recent activities
        recentActivities: [
          { icon: '✅', thTitle: 'มีการอัพเดท Task', enTitle: 'Task Updated', time: 'เมื่อ 2 ชั่วโมงที่แล้ว / 2 hours ago' },
          { icon: '💼', thTitle: 'เพิ่มข้อเสนอ', enTitle: 'Proposal Added', time: 'เมื่อ 4 ชั่วโมงที่แล้ว / 4 hours ago' },
          { icon: '📰', thTitle: 'บทความใหม่ถูกเผยแพร่', enTitle: 'Article Published', time: 'เมื่อ 1 วันที่แล้ว / 1 day ago' },
          { icon: '🔄', thTitle: 'อัพเดทเอกสาร', enTitle: 'Document Updated', time: 'เมื่อ 3 วันที่แล้ว / 3 days ago' },
          { icon: '💬', thTitle: 'ความเห็นใหม่', enTitle: 'New Comment', time: 'เมื่อ 5 วันที่แล้ว / 5 days ago' },
        ],
        // Translations
        t: {
          th: {
            home: 'หน้าแรก',
            dashboard: 'แดชบอร์ด',
            welcome: 'ยินดีต้อนรับกลับมา! 👋',
            widgets: 'Widgets',
            users: 'สมาชิก',
            logout: 'ออกจากระบบ',
            revenue: 'รายได้เดือนนี้',
            sales: 'ยอดขายเดือนนี้',
            orders: 'คำสั่งซื้อ',
            processing: 'ที่กำลังประมวลผล',
            totalSales: 'ยอดขาย',
            bestSelling: 'สินค้าขายดี',
            increasedBy: 'เพิ่มขึ้น 12%',
            rank: 'ลำดับที่ 2 จากท้อป',
            trendTitle: '📈 แนวโน้มยอดขาย',
            volumeTitle: '🎯 ปริมาณการขาย',
            month: 'เดือน',
            year: 'ปี',
            dailyDaily: '📅 รายวัน',
            weekly: '📆 รายสัปดาห์',
            export: '📥 ส่งออก',
            recentActivities: '🕐 กิจกรรมล่าสุด',
            orderStatus: '📋 สถานะคำสั่งซื้อ',
            allOrders: 'คำสั่งซื้อทั้งหมด',
            membersList: '👥 รายชื่อสมาชิก',
            totalMembers: 'ทั้งหมด',
            search: '🔍 ค้นหา',
            addMember: '➕ เพิ่มสมาชิก',
            filter: 'ฟิลเตอร์',
            analytics: '📈 วิเคราะห์ข้อมูล',
            completeName: 'ชื่อ',
            email: 'อีเมล',
            status: 'สถานะ',
            registeredDate: 'สมัครเมื่อ',
            normal: 'ปกติ',
            success: 'สำเร็จ',
            pending: 'รออนุมัติ',
            addItem: '➕ เพิ่มรายการ',
            edit: 'แก้ไข',
            delete: 'ลบ',
            viewDetails: 'ดูรายละเอียด',
            viewShades: 'ดูเฉดสี',
            reset: '🔄 รีเซ็ต',
            save: 'บันทึก',
            close: 'ปิด',
            add: 'เพิ่ม',
            selectPeriod: '📅 เลือกช่วงเวลา',
            exportExcel: '📥 ส่งออก Excel',
            totalItems: 'รายการทั้งหมด',
            itemsUnit: 'รายการ',
            foundItems: 'พบ',
            requiredInfo: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน',
            connectionError: 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้',
            confirmDelete: 'ต้องการลบรายการนี้ใช่หรือไม่?',
            addRole: '➕ เพิ่มบทบาท',
            rolesUnit: 'บทบาท',
            createContract: '➕ สร้างสัญญาใหม่',
            searchInput: 'คำค้นหา',
            salesContractTitle: 'สัญญาขาย',
            salesContractDesc: 'รายการสัญญาซื้อขายกับลูกค้าทั้งหมด',
            settingsTitle: 'ตั้งค่า',
            accountInfo: 'ข้อมูลบัญชี',
            nameLabel: 'ชื่อ',
            emailLabel: 'อีเมล',
            editProfile: 'แก้ไขโปรไฟล์',
            security: 'ความปลอดภัย',
            accountNormal: 'บัญชีของคุณปกติ',
            changePassword: 'เปลี่ยนรหัสผ่าน',
            notifications: 'การแจ้งเตือน',
            emailNotifications: 'การแจ้งเตือนทางอีเมล',
            emailNotificationsDesc: 'รับการแจ้งเตือนผ่านอีเมล',
            addData: '➕ เพิ่มข้อมูล',
            newPO: '➕ เปิดใบสั่งซื้อใหม่',
            groupBasicData: 'ข้อมูลพื้นฐาน',
            groupPO: 'เปิดใบสั่งซื้อ',
            groupStock: 'จัดการสินค้า',
            groupVat: 'จัดการ VAT',
            groupOrder: 'จัดการออร์เดอร์',
            groupCustAcc: 'บัญชีลูกค้า',
            groupPartnerAcc: 'บัญชีคู่ค้า',
            groupReport: 'รายงาน',
            groupUsers: 'ผู้ใช้งาน',
            searchFilter: 'ค้นหา / ตัวกรอง',
            searchWord: 'ค้นหา',
            resetWord: 'รีเซ็ต',
            shadesTitle: 'เฉดสี',
          },
          en: {
            home: 'Home',
            dashboard: 'Dashboard',
            welcome: 'Welcome Back! 👋',
            widgets: 'Widgets',
            users: 'Members',
            logout: 'Logout',
            revenue: 'Monthly Revenue',
            sales: 'Monthly Sales',
            orders: 'Orders',
            processing: 'In Processing',
            totalSales: 'Sales',
            bestSelling: 'Best Selling',
            increasedBy: 'Increased 12%',
            rank: 'Rank 2 from Top',
            trendTitle: '📈 Sales Trend',
            volumeTitle: '🎯 Sales Volume',
            month: 'Month',
            year: 'Year',
            dailyDaily: '📅 Daily',
            weekly: '📆 Weekly',
            export: '📥 Export',
            recentActivities: '🕐 Recent Activities',
            orderStatus: '📋 Order Status',
            allOrders: 'All Orders',
            membersList: '👥 Members List',
            totalMembers: 'Total',
            search: '🔍 Search',
            addMember: '➕ Add Member',
            filter: 'Filter',
            analytics: '📈 Analytics',
            completeName: 'Name',
            email: 'Email',
            status: 'Status',
            registeredDate: 'Registered',
            normal: 'Normal',
            success: 'Success',
            pending: 'Pending',
            addItem: '➕ Add Item',
            edit: 'Edit',
            delete: 'Delete',
            viewDetails: 'View Details',
            viewShades: 'View Shades',
            reset: '🔄 Reset',
            save: 'Save',
            close: 'Close',
            add: 'Add',
            selectPeriod: '📅 Select Period',
            exportExcel: '📥 Export Excel',
            totalItems: 'Total',
            itemsUnit: 'items',
            foundItems: 'Found',
            requiredInfo: 'Please fill in all required fields',
            connectionError: 'Cannot connect to server',
            confirmDelete: 'Are you sure you want to delete this item?',
            addRole: '➕ Add Role',
            rolesUnit: 'roles',
            createContract: '➕ Create New Contract',
            searchInput: 'Search keyword',
            salesContractTitle: 'Sales Contract',
            salesContractDesc: 'All sales contracts with customers',
            settingsTitle: 'Settings',
            accountInfo: 'Account Info',
            nameLabel: 'Name',
            emailLabel: 'Email',
            editProfile: 'Edit Profile',
            security: 'Security',
            accountNormal: 'Your account is in good standing',
            changePassword: 'Change Password',
            notifications: 'Notifications',
            emailNotifications: 'Email Notifications',
            emailNotificationsDesc: 'Receive notifications via email',
            addData: '➕ Add Data',
            newPO: '➕ New Purchase Order',
            groupBasicData: 'Basic Data',
            groupPO: 'Purchase Orders',
            groupStock: 'Inventory',
            groupVat: 'VAT Management',
            groupOrder: 'Order Management',
            groupCustAcc: 'Customer Accounts',
            groupPartnerAcc: 'Vendor Accounts',
            groupReport: 'Reports',
            groupUsers: 'Users',
            searchFilter: 'Search / Filter',
            searchWord: 'Search',
            resetWord: 'Reset',
            shadesTitle: 'Shades',
          }
        }
      };
    },
    watch: {
      currentPage(val) {
        this.mobileMenuOpen = false;
        if (val === 'fabric-regular') {
          this.frLoadItems();
        } else if (val === 'fabric-irregular') {
          this.fiLoadItems();
        }
      },
    },
    computed: {
      frTypeOptions() {
        return [...new Set(this.frItems.map(i => i.type))].sort();
      },
      frCompositionOptions() {
        return [...new Set(this.frItems.map(i => i.composition))].sort();
      },
      frWidthOptions() {
        return [...new Set(this.frItems.map(i => i.width))].sort();
      },
      frStructureOptions() {
        return [...new Set(this.frItems.map(i => i.structure))].sort();
      },
      frFinishingOptions() {
        return [...new Set(this.frItems.map(i => i.finishing))].sort();
      },
      frWeightOptions() {
        return [...new Set(this.frItems.map(i => i.weight))].sort((a, b) => Number(a) - Number(b));
      },
      frUnitOptions() {
        return ['หลา', 'เมตร', 'กิโลกรัม', 'ม้วน'];
      },
      frFilteredItems() {
        const f = this.frFilters;
        const q = f.search.trim().toLowerCase();
        return this.frItems.filter(item => {
          if (q && !(item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q))) return false;
          if (f.type && item.type !== f.type) return false;
          if (f.weight && this.frWeightBucket(item.weight) !== f.weight) return false;
          if (f.active === 'active' && !item.active) return false;
          if (f.active === 'inactive' && item.active) return false;
          if (f.composition && item.composition !== f.composition) return false;
          if (f.width && item.width !== f.width) return false;
          if (f.substitute && !item.substitute) return false;
          if (f.skuFrom && item.sku < f.skuFrom) return false;
          if (f.skuTo && item.sku > f.skuTo) return false;
          return true;
        });
      },
      fiTypeOptions() {
        return [...new Set(this.fiItems.map(i => i.type))].sort();
      },
      fiCompositionOptions() {
        return [...new Set(this.fiItems.map(i => i.composition))].sort();
      },
      fiWidthOptions() {
        return [...new Set(this.fiItems.map(i => i.width))].sort();
      },
      fiStructureOptions() {
        return [...new Set(this.fiItems.map(i => i.structure))].sort();
      },
      fiFinishingOptions() {
        return [...new Set(this.fiItems.map(i => i.finishing))].sort();
      },
      fiWeightOptions() {
        return [...new Set(this.fiItems.map(i => i.weight))].sort((a, b) => Number(a) - Number(b));
      },
      fiFilteredItems() {
        const f = this.fiFilters;
        const q = f.search.trim().toLowerCase();
        return this.fiItems.filter(item => {
          if (q && !(item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q))) return false;
          if (f.type && item.type !== f.type) return false;
          if (f.weight && this.frWeightBucket(item.weight) !== f.weight) return false;
          if (f.active === 'active' && !item.active) return false;
          if (f.active === 'inactive' && item.active) return false;
          if (f.composition && item.composition !== f.composition) return false;
          if (f.width && item.width !== f.width) return false;
          if (f.substitute && !item.substitute) return false;
          if (f.skuFrom && item.sku < f.skuFrom) return false;
          if (f.skuTo && item.sku > f.skuTo) return false;
          return true;
        });
      },
      frVisibleShadeRows() {
        const q = this.frShadeSearch.trim().toLowerCase();
        if (!q) return this.frShadeRows;
        return this.frShadeRows.filter(row => row.name.toLowerCase().includes(q));
      },
      oeSlipItems() {
        return this.oeItems.filter(row => row.sku.trim());
      },
      oeFormattedDate() {
        if (!this.oeForm.date) return '';
        const [y, m, d] = this.oeForm.date.split('-');
        return `${d}/${m}/${y}`;
      },
      oeQrUrl() {
        const data = encodeURIComponent(`Order:${this.oeForm.orderNo} Customer:${this.oeForm.customer}`);
        return `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${data}`;
      },
      xlTotalPages() {
        return Math.max(1, Math.ceil(this.xlRows.length / this.xlPageSize));
      },
      xlPagedRows() {
        const start = (this.xlPage - 1) * this.xlPageSize;
        return this.xlRows.slice(start, start + this.xlPageSize);
      },
      cmTotalPages() {
        return Math.max(1, Math.ceil(this.cmRows.length / this.cmPageSize));
      },
      cmPagedRows() {
        const start = (this.cmPage - 1) * this.cmPageSize;
        return this.cmRows.slice(start, start + this.cmPageSize);
      },
      dashAvailableYears() {
        return Object.keys(this.dashSalesByYear).map(Number).sort((a, b) => a - b);
      },
      dashYearlyTotals() {
        return this.dashAvailableYears.map(y => ({
          label: String(y),
          value: (this.dashSalesByYear[y] || []).reduce((s, m) => s + m.value, 0),
        }));
      },
      dashTrendChartData() {
        if (this.dashTrendViewMode === 'year') return this.dashYearlyTotals;
        return this.dashSalesByYear[this.dashTrendYear] || [];
      },
      dashTrendScale() {
        const values = this.dashTrendChartData.map(d => d.value);
        const rawMax = Math.max(...values);
        const rawMin = Math.min(...values);
        const rawRange = rawMax - rawMin || 1;
        const targetSteps = 4;
        const roughStep = rawRange / targetSteps;
        const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
        const normalized = roughStep / magnitude;
        let niceStep;
        if (normalized <= 1) niceStep = 1 * magnitude;
        else if (normalized <= 2) niceStep = 2 * magnitude;
        else if (normalized <= 5) niceStep = 5 * magnitude;
        else niceStep = 10 * magnitude;
        const niceMin = Math.floor(rawMin / niceStep) * niceStep;
        const niceMax = Math.ceil(rawMax / niceStep) * niceStep;
        const ticks = [];
        for (let v = niceMin; v <= niceMax + 1e-6; v += niceStep) ticks.push(Math.round(v));
        return { min: niceMin, max: niceMax, ticks };
      },
      dashTrendPoints() {
        const data = this.dashTrendChartData;
        const { min, max } = this.dashTrendScale;
        const range = (max - min) || 1;
        const w = 560, h = 200, padLeft = 52, padRight = 16, padY = 20;
        const stepX = data.length > 1 ? (w - padLeft - padRight) / (data.length - 1) : 0;
        return data.map((d, i) => {
          const x = padLeft + stepX * i;
          const y = padY + (h - padY * 2) * (1 - (d.value - min) / range);
          return { x, y, xPct: x / w * 100, yPct: y / h * 100, label: d.label, value: d.value };
        });
      },
      dashTrendGridLines() {
        const { min, max, ticks } = this.dashTrendScale;
        const range = (max - min) || 1;
        const h = 200, padY = 20;
        return ticks.map(v => {
          const y = padY + (h - padY * 2) * (1 - (v - min) / range);
          return { value: v, y, yPct: y / h * 100, label: v >= 1000 ? Math.round(v / 1000) + 'k' : String(v) };
        });
      },
      dashTrendLinePath() {
        const pts = this.dashTrendPoints;
        return pts.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ');
      },
      dashTrendAreaPath() {
        const pts = this.dashTrendPoints;
        if (!pts.length) return '';
        const h = 200, padY = 20;
        const line = this.dashTrendLinePath;
        const last = pts[pts.length - 1];
        const first = pts[0];
        return `${line} L${last.x},${h - padY} L${first.x},${h - padY} Z`;
      },
      dashVolumeSegments() {
        const data = this.dashVolumeData;
        const total = data.reduce((s, d) => s + d.value, 0) || 1;
        const colors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'];
        const r = 60;
        const circumference = 2 * Math.PI * r;
        const gap = 3;
        let offsetAccum = 0;
        return data.map((d, i) => {
          const fraction = d.value / total;
          const rawDash = fraction * circumference;
          const dash = Math.max(0, rawDash - gap);
          const seg = {
            label: d.label,
            value: d.value,
            pct: Math.round(fraction * 100),
            color: colors[i % colors.length],
            dasharray: `${dash} ${circumference - dash}`,
            dashoffset: -offsetAccum,
          };
          offsetAccum += rawDash;
          return seg;
        });
      },
      breadcrumb() {
        const home = this.t[this.lang].home;
        const cp = this.currentPage;
        const g = this.t[this.lang];
        if (cp === 'dashboard') return [home];
        if (cp === 'users') return [home, g.groupUsers, g.membersList];
        if (cp === 'user-permissions') return [home, g.groupUsers, this.pageTitle(cp)];
        if (cp === 'analytics') return [home, g.analytics];
        if (cp === 'settings') return [home, g.settingsTitle];
        if (cp === 'sales-contract') return [home, g.salesContractTitle];
        if (this.basicDataPages[cp] || cp === 'fabric-regular' || cp === 'fabric-irregular') {
          return [home, g.groupBasicData, this.pageTitle(cp)];
        }
        if (this.poPages[cp]) return [home, g.groupPO, this.pageTitle(cp)];
        if (this.stockPages[cp]) return [home, g.groupStock, this.pageTitle(cp)];
        if (this.vatPages[cp]) return [home, g.groupVat, this.pageTitle(cp)];
        if (this.orderPages[cp] || cp === 'order-receive') return [home, g.groupOrder, this.pageTitle(cp)];
        if (this.custAccPages[cp]) return [home, g.groupCustAcc, this.pageTitle(cp)];
        if (this.partnerAccPages[cp]) return [home, g.groupPartnerAcc, this.pageTitle(cp)];
        if (this.reportPages[cp]) return [home, g.groupReport, this.pageTitle(cp)];
        return [home];
      },
    },
    mounted() {
      document.documentElement.setAttribute('data-theme', this.theme);
      // เช็ค token - ถ้าไม่มีให้ redirect ไปที่ login
      if (!this.token) {
        setTimeout(() => {
          this.$router.push('/login');
        }, 500);
        return;
      }
      this.loadMembers();
      // ตัวอย่างการอัพเดทสถิติ
      this.newUsersThisMonth = Math.floor(this.members.length * 0.3);
    },
    methods: {
      toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
      },
      toggleLangDropdown() {
        this.langDropdownOpen = !this.langDropdownOpen;
      },
      toggleGroup(key) {
        this.openGroups[key] = !this.openGroups[key];
      },
      frSearch() {
        // v-model ผูกกับ frFilters อยู่แล้ว ปุ่มนี้ไว้สำหรับกรณีเชื่อมต่อ API จริงในอนาคต
      },
      frResetFilters() {
        this.frFilters = {
          search: '', type: '', weight: '', active: '',
          skuFrom: '', skuTo: '', composition: '', width: '', substitute: false,
        };
      },
      sessionExpired() {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        alert('เซสชันหมดอายุ (เซิร์ฟเวอร์อาจรีสตาร์ทไป) กรุณาเข้าสู่ระบบใหม่');
        this.$router.push('/login');
      },
      async frLoadItems() {
        this.frLoading = true;
        try {
          const res = await fetch(API + '/api/fabrics', {
            headers: { Authorization: 'Bearer ' + this.token },
          });
          if (res.status === 401) { this.sessionExpired(); return; }
          const data = await res.json();
          this.frItems = (data.fabrics || []).map(row => ({
            id: row.id,
            type: row.type || '',
            sku: row.sku,
            colors: row.colors || 1,
            name: row.name || '',
            structure: row.structure || '',
            composition: row.composition || '',
            width: row.width || '',
            finishing: row.finishing || '',
            weight: row.weight || '',
            unit: row.unit || 'หลา',
            description: row.description || '',
            productionDays: row.production_days,
            imageName: row.image_name || '',
            active: !!row.active,
            substitute: !!row.substitute,
          }));
        } catch (e) {
          this.frItems = [];
        } finally {
          this.frLoading = false;
        }
      },
      frOpenAdd() {
        this.frModalMode = 'add';
        this.frEditingId = null;
        this.frNewItem = {
          type: '', sku: '', name: '', structure: '', composition: '', width: '',
          finishing: '', weight: '', unit: 'หลา', description: '', productionDays: '',
          imageName: '', substitute: 'no', active: true,
        };
        this.frShowAddModal = true;
      },
      frEditItem(item) {
        this.frModalMode = 'edit';
        this.frEditingId = item.id;
        this.frNewItem = {
          type: item.type, sku: item.sku, name: item.name, structure: item.structure,
          composition: item.composition, width: item.width, finishing: item.finishing,
          weight: item.weight, unit: item.unit || 'หลา', description: item.description || '',
          productionDays: item.productionDays || '', imageName: item.imageName || '',
          substitute: item.substitute ? 'yes' : 'no', active: item.active,
        };
        this.frShowAddModal = true;
      },
      frViewItem(item) {
        this.frEditItem(item);
        this.frModalMode = 'view';
      },
      async frDeleteItem(item) {
        if (!confirm(`ต้องการลบ "${item.name || item.sku}" ใช่หรือไม่?`)) return;
        try {
          const res = await fetch(API + `/api/fabrics/${item.id}`, {
            method: 'DELETE',
            headers: { Authorization: 'Bearer ' + this.token },
          });
          if (res.status === 401) { this.sessionExpired(); return; }
          const data = await res.json();
          if (data.ok) {
            this.frItems = this.frItems.filter(i => i.id !== item.id);
          } else {
            alert('⚠️ ' + data.message);
          }
        } catch (e) {
          alert('ลบข้อมูลไม่สำเร็จ — ตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์');
        }
      },
      frCloseAddModal() {
        this.frShowAddModal = false;
      },
      frNewShadeRow(base) {
        this.frShadeKeySeq += 1;
        return {
          _key: this.frShadeKeySeq,
          name: base ? base.name : '',
          fabric_cost: base ? base.fabric_cost : '',
          dye_cost: base ? base.dye_cost : '',
        };
      },
      frOpenShades(item) {
        this.frOpenShadeModal({ id: item.id, sku: item.sku, name: item.name, apiPath: `/api/fabrics/${item.id}/shades` }, 'fabric');
      },
      fiOpenShades(item) {
        this.frOpenShadeModal({ id: item.id, sku: '', name: item.name, apiPath: `/api/fabric-irregular/${item.id}/shades` }, 'irregular');
      },
      async fiLoadItems() {
        this.fiLoading = true;
        try {
          const res = await fetch(API + '/api/fabric-irregular', {
            headers: { Authorization: 'Bearer ' + this.token },
          });
          if (res.status === 401) { this.sessionExpired(); return; }
          const data = await res.json();
          this.fiItems = (data.items || []).map(row => ({
            id: row.id,
            type: row.type || '',
            sku: row.sku,
            colors: row.colors || 1,
            name: row.name || '',
            structure: row.structure || '',
            composition: row.composition || '',
            width: row.width || '',
            finishing: row.finishing || '',
            weight: row.weight || '',
            unit: row.unit || 'หลา',
            description: row.description || '',
            productionDays: row.production_days,
            imageName: row.image_name || '',
            active: !!row.active,
            substitute: !!row.substitute,
          }));
        } catch (e) {
          this.fiItems = [];
        } finally {
          this.fiLoading = false;
        }
      },
      fiSearch() {
        // v-model ผูกกับ fiFilters อยู่แล้ว ปุ่มนี้ไว้สำหรับกรณีเชื่อมต่อ API จริงในอนาคต
      },
      fiResetFilters() {
        this.fiFilters = {
          search: '', type: '', weight: '', active: '',
          skuFrom: '', skuTo: '', composition: '', width: '', substitute: false,
        };
      },
      fiHandleFileChange(e) {
        this.fiNewItem.imageName = e.target.files[0] ? e.target.files[0].name : '';
      },
      fiOpenAdd() {
        this.fiModalMode = 'add';
        this.fiEditingId = null;
        this.fiNewItem = {
          type: '', sku: '', name: '', structure: '', composition: '', width: '',
          finishing: '', weight: '', unit: 'หลา', description: '', productionDays: '',
          imageName: '', substitute: 'no', active: true,
        };
        this.fiShowModal = true;
      },
      fiEditItem(item) {
        this.fiModalMode = 'edit';
        this.fiEditingId = item.id;
        this.fiNewItem = {
          type: item.type, sku: item.sku, name: item.name, structure: item.structure,
          composition: item.composition, width: item.width, finishing: item.finishing,
          weight: item.weight, unit: item.unit || 'หลา', description: item.description || '',
          productionDays: item.productionDays || '', imageName: item.imageName || '',
          substitute: item.substitute ? 'yes' : 'no', active: item.active,
        };
        this.fiShowModal = true;
      },
      fiViewItem(item) {
        this.fiEditItem(item);
        this.fiModalMode = 'view';
      },
      fiCloseModal() {
        this.fiShowModal = false;
      },
      async fiDeleteItem(item) {
        if (!confirm(`ต้องการลบ "${item.name || item.sku}" ใช่หรือไม่?`)) return;
        try {
          const res = await fetch(API + `/api/fabric-irregular/${item.id}`, {
            method: 'DELETE',
            headers: { Authorization: 'Bearer ' + this.token },
          });
          if (res.status === 401) { this.sessionExpired(); return; }
          const data = await res.json();
          if (data.ok) {
            this.fiItems = this.fiItems.filter(i => i.id !== item.id);
          } else {
            alert('⚠️ ' + data.message);
          }
        } catch (e) {
          alert('ลบข้อมูลไม่สำเร็จ — ตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์');
        }
      },
      async fiSaveItem() {
        if (!this.fiNewItem.type || !this.fiNewItem.sku || !this.fiNewItem.width) {
          alert('กรุณากรอกข้อมูลที่จำเป็น (ประเภท, รหัสสินค้า, หน้ากว้าง) ให้ครบถ้วน');
          return;
        }
        const payload = {
          type: this.fiNewItem.type,
          sku: this.fiNewItem.sku,
          name: this.fiNewItem.name,
          structure: this.fiNewItem.structure,
          composition: this.fiNewItem.composition,
          width: this.fiNewItem.width,
          finishing: this.fiNewItem.finishing,
          weight: this.fiNewItem.weight,
          unit: this.fiNewItem.unit,
          description: this.fiNewItem.description,
          production_days: this.fiNewItem.productionDays || null,
          image_name: this.fiNewItem.imageName,
          substitute: this.fiNewItem.substitute === 'yes',
          active: this.fiNewItem.active,
        };
        try {
          const url = this.fiEditingId ? API + `/api/fabric-irregular/${this.fiEditingId}` : API + '/api/fabric-irregular';
          const method = this.fiEditingId ? 'PUT' : 'POST';
          const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.token },
            body: JSON.stringify(payload),
          });
          if (res.status === 401) { this.sessionExpired(); return; }
          const data = await res.json();
          if (data.ok) {
            await this.fiLoadItems();
            this.fiCloseModal();
          } else {
            alert('⚠️ ' + data.message);
          }
        } catch (e) {
          alert('บันทึกข้อมูลไม่สำเร็จ — ตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์');
        }
      },
      oeNewRow() {
        this.oeRowKeySeq += 1;
        return {
          _key: this.oeRowKeySeq, no: 0, sku: '', colorCode: '', width: '',
          availableQty: '', orderedQty: '', unit: 'หลา', pack: '', custCode: '',
          substitute: false, substituteText: '',
        };
      },
      oeRenumberRows() {
        this.oeItems.forEach((row, i) => { row.no = i + 1; });
      },
      oeAddRow(afterIdx) {
        this.oeItems.splice(afterIdx + 1, 0, this.oeNewRow());
        this.oeRenumberRows();
      },
      oeRemoveRow(idx) {
        if (this.oeItems.length === 1) return;
        this.oeItems.splice(idx, 1);
        this.oeRenumberRows();
      },
      oeReport() {
        alert('ตัวอย่างรายงานออร์เดอร์ (ยังไม่เชื่อมต่อระบบพิมพ์รายงานจริง)');
      },
      oeSave() {
        if (!this.oeForm.customer.trim()) {
          alert('กรุณากรอกชื่อลูกค้า');
          return;
        }
        const hasItem = this.oeItems.some(row => row.sku.trim() && Number(row.orderedQty) > 0);
        if (!hasItem) {
          alert('กรุณากรอกรายการสินค้าอย่างน้อย 1 รายการ (รหัสสินค้าและจำนวนที่สั่ง)');
          return;
        }
        this.oeSaved = true;
      },
      oePrintSlipNow() {
        window.print();
      },
      xlTogglePanel() {
        this.xlShowPanel = !this.xlShowPanel;
        if (this.xlShowPanel && this.xlRows.length === 0) {
          this.xlLoadRows();
        }
      },
      xlHandleFile(e) {
        this.xlFile = e.target.files[0] || null;
        this.xlImportMessage = '';
      },
      async xlLoadRows() {
        this.xlLoading = true;
        try {
          const res = await fetch(API + '/api/fabric-master', {
            headers: { Authorization: 'Bearer ' + this.token },
          });
          if (res.status === 401) { this.sessionExpired(); return; }
          const data = await res.json();
          this.xlRows = data.items || [];
        } catch (e) {
          this.xlRows = [];
        } finally {
          this.xlLoading = false;
        }
      },
      async xlImportFile() {
        if (!this.xlFile) {
          alert('กรุณาเลือกไฟล์ Excel (.xlsx) หรือ CSV');
          return;
        }
        this.xlImporting = true;
        this.xlImportMessage = '';
        try {
          const XLSX = await import('xlsx');
          const buffer = await this.xlFile.arrayBuffer();
          const workbook = XLSX.read(buffer, { type: 'array' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: '' });
          // แถวแรกเป็น Header คอลัมน์ A-J ตามสเปก — ข้ามไปเริ่มอ่านที่แถวข้อมูลจริง
          const dataRows = rows.slice(1).filter(r => r.some(cell => String(cell).trim() !== ''));
          const items = dataRows.map(r => {
            const price = parseFloat(r[8]) || 0;
            const rawVat = r[9];
            const priceVat = rawVat !== undefined && String(rawVat).trim() !== ''
              ? parseFloat(rawVat)
              : Math.round(price * 1.07 * 100) / 100;
            return {
              item_code: String(r[0] || '').trim(),
              fabric_type: String(r[1] || '').trim(),
              fabric_name: String(r[2] || '').trim(),
              description: String(r[3] || '').trim(),
              contract_no: String(r[4] || '').trim(),
              weaving: String(r[5] || '').trim(),
              structure: String(r[6] || '').trim(),
              yc_shade: String(r[7] || '').trim(),
              price,
              price_vat: isNaN(priceVat) ? Math.round(price * 1.07 * 100) / 100 : priceVat,
            };
          }).filter(item => item.item_code);

          if (items.length === 0) {
            this.xlImportMessage = '⚠️ ไม่พบข้อมูลที่นำเข้าได้ในไฟล์นี้ (ตรวจสอบว่าคอลัมน์ A คือ item_code)';
            return;
          }

          const res = await fetch(API + '/api/fabric-master/import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.token },
            body: JSON.stringify({ items }),
          });
          if (res.status === 401) { this.sessionExpired(); return; }
          const data = await res.json();
          if (data.ok) {
            this.xlImportMessage = `✅ นำเข้าข้อมูลสำเร็จ ${data.imported} รายการ`;
            this.xlFile = null;
            if (this.$refs.xlFileInput) this.$refs.xlFileInput.value = '';
            await this.xlLoadRows();
          } else {
            this.xlImportMessage = '⚠️ ' + data.message;
          }
        } catch (e) {
          this.xlImportMessage = '⚠️ อ่านไฟล์ไม่สำเร็จ — ตรวจสอบว่าเป็นไฟล์ .xlsx หรือ .csv ที่ถูกต้อง';
        } finally {
          this.xlImporting = false;
        }
      },
      xlFormatMoney(n) {
        return Number(n || 0).toFixed(2);
      },
      xlPrevPage() {
        if (this.xlPage > 1) this.xlPage -= 1;
      },
      xlNextPage() {
        if (this.xlPage < this.xlTotalPages) this.xlPage += 1;
      },
      cmTogglePanel() {
        this.cmShowPanel = !this.cmShowPanel;
        if (this.cmShowPanel && this.cmRows.length === 0) {
          this.cmLoadRows();
        }
      },
      cmHandleFile(e) {
        this.cmFile = e.target.files[0] || null;
        this.cmImportMessage = '';
      },
      async cmLoadRows() {
        this.cmLoading = true;
        try {
          const res = await fetch(API + '/api/customer-master', {
            headers: { Authorization: 'Bearer ' + this.token },
          });
          if (res.status === 401) { this.sessionExpired(); return; }
          const data = await res.json();
          this.cmRows = data.items || [];
        } catch (e) {
          this.cmRows = [];
        } finally {
          this.cmLoading = false;
        }
      },
      cmParseColumnA(raw) {
        const text = String(raw || '').trim();
        const m = text.match(/^(\d{4})[\s\-.:]*(.*)$/);
        if (m) {
          return { customer_code: m[1], customer_name: m[2].trim() };
        }
        return { customer_code: '', customer_name: text };
      },
      async cmImportFile() {
        if (!this.cmFile) {
          alert('กรุณาเลือกไฟล์ Excel (.xlsx) หรือ CSV');
          return;
        }
        this.cmImporting = true;
        this.cmImportMessage = '';
        try {
          const XLSX = await import('xlsx');
          const buffer = await this.cmFile.arrayBuffer();
          const workbook = XLSX.read(buffer, { type: 'array' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: '' });
          const dataRows = rows.slice(1).filter(r => r.some(cell => String(cell).trim() !== ''));

          const seen = new Set();
          const fileDuplicates = [];
          const items = [];
          dataRows.forEach(r => {
            const parsed = this.cmParseColumnA(r[0]);
            if (!parsed.customer_code) return;
            if (seen.has(parsed.customer_code)) {
              fileDuplicates.push(parsed.customer_code);
              return;
            }
            seen.add(parsed.customer_code);
            items.push({
              customer_code: parsed.customer_code,
              customer_name: parsed.customer_name,
              address: String(r[1] || '').trim(),
            });
          });

          if (items.length === 0) {
            this.cmImportMessage = '⚠️ ไม่พบข้อมูลที่นำเข้าได้ในไฟล์นี้ (ตรวจสอบว่าคอลัมน์ A ขึ้นต้นด้วยรหัสลูกค้า 4 หลัก)';
            return;
          }

          const res = await fetch(API + '/api/customer-master/import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.token },
            body: JSON.stringify({ items }),
          });
          if (res.status === 401) { this.sessionExpired(); return; }
          const data = await res.json();
          if (data.ok) {
            const dupCodes = [...fileDuplicates, ...(data.duplicates || [])];
            let msg = `✅ นำเข้าข้อมูลสำเร็จ ${data.imported} รายการ`;
            if (dupCodes.length > 0) {
              msg += ` — ⚠️ พบรหัสลูกค้าซ้ำ ${dupCodes.length} รายการ (ข้ามการนำเข้า): ${dupCodes.slice(0, 10).join(', ')}${dupCodes.length > 10 ? ' ...' : ''}`;
            }
            this.cmImportMessage = msg;
            this.cmFile = null;
            if (this.$refs.cmFileInput) this.$refs.cmFileInput.value = '';
            await this.cmLoadRows();
          } else {
            this.cmImportMessage = '⚠️ ' + data.message;
          }
        } catch (e) {
          this.cmImportMessage = '⚠️ อ่านไฟล์ไม่สำเร็จ — ตรวจสอบว่าเป็นไฟล์ .xlsx หรือ .csv ที่ถูกต้อง';
        } finally {
          this.cmImporting = false;
        }
      },
      cmOpenEdit(row) {
        this.cmEditingId = row.id;
        this.cmEditItem = { customer_code: row.customer_code, customer_name: row.customer_name, address: row.address };
        this.cmShowEditModal = true;
      },
      cmCloseEdit() {
        this.cmShowEditModal = false;
      },
      async cmSaveEdit() {
        if (!this.cmEditItem.customer_code.trim()) {
          alert('กรุณากรอกรหัสลูกค้า');
          return;
        }
        try {
          const res = await fetch(API + `/api/customer-master/${this.cmEditingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.token },
            body: JSON.stringify(this.cmEditItem),
          });
          if (res.status === 401) { this.sessionExpired(); return; }
          const data = await res.json();
          if (data.ok) {
            await this.cmLoadRows();
            this.cmCloseEdit();
          } else {
            alert('⚠️ ' + data.message);
          }
        } catch (e) {
          alert('บันทึกข้อมูลไม่สำเร็จ — ตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์');
        }
      },
      async cmDeleteRow(row) {
        if (!confirm(`ต้องการลบ "${row.customer_name || row.customer_code}" ใช่หรือไม่?`)) return;
        try {
          const res = await fetch(API + `/api/customer-master/${row.id}`, {
            method: 'DELETE',
            headers: { Authorization: 'Bearer ' + this.token },
          });
          if (res.status === 401) { this.sessionExpired(); return; }
          const data = await res.json();
          if (data.ok) {
            this.cmRows = this.cmRows.filter(r => r.id !== row.id);
          } else {
            alert('⚠️ ' + data.message);
          }
        } catch (e) {
          alert('ลบข้อมูลไม่สำเร็จ — ตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์');
        }
      },
      cmPrevPage() {
        if (this.cmPage > 1) this.cmPage -= 1;
      },
      cmNextPage() {
        if (this.cmPage < this.cmTotalPages) this.cmPage += 1;
      },
      async frOpenShadeModal(entity, context) {
        this.frShadeContext = context;
        this.frShadeFabric = entity;
        this.frShadeSearch = '';
        this.frShowShadeModal = true;
        this.frShadeLoading = true;
        try {
          const res = await fetch(API + entity.apiPath, {
            headers: { Authorization: 'Bearer ' + this.token },
          });
          if (res.status === 401) { this.sessionExpired(); return; }
          const data = await res.json();
          const rows = (data.shades || []).map(s => this.frNewShadeRow({
            name: s.name, fabric_cost: s.fabric_cost, dye_cost: s.dye_cost,
          }));
          this.frShadeRows = rows.length ? rows : [this.frNewShadeRow()];
        } catch (e) {
          this.frShadeRows = [this.frNewShadeRow()];
        } finally {
          this.frShadeLoading = false;
        }
      },
      frCloseShadeModal() {
        this.frShowShadeModal = false;
        this.frShadeFabric = null;
        this.frShadeRows = [];
      },
      frShadeSearchAction() {
        // frVisibleShadeRows กรองตาม frShadeSearch ให้อยู่แล้วแบบ real-time
      },
      frShadeResetSearch() {
        this.frShadeSearch = '';
      },
      frShadeAddRowAfter(row) {
        const idx = this.frShadeRows.indexOf(row);
        const newRow = this.frNewShadeRow(row);
        this.frShadeRows.splice(idx + 1, 0, newRow);
      },
      frShadeRemoveRow(row) {
        this.frShadeRows = this.frShadeRows.filter(r => r !== row);
      },
      frShadeAppendRow() {
        this.frShadeRows.push(this.frNewShadeRow());
      },
      async frSaveShades() {
        if (!this.frShadeFabric) return;
        const shades = this.frShadeRows
          .filter(r => (r.name || '').trim())
          .map(r => ({ name: r.name.trim(), fabric_cost: Number(r.fabric_cost) || 0, dye_cost: Number(r.dye_cost) || 0 }));
        try {
          const res = await fetch(API + this.frShadeFabric.apiPath, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.token },
            body: JSON.stringify({ shades }),
          });
          if (res.status === 401) { this.sessionExpired(); return; }
          const data = await res.json();
          if (data.ok) {
            if (this.frShadeContext === 'irregular') {
              await this.fiLoadItems();
            } else {
              await this.frLoadItems();
            }
            this.frCloseShadeModal();
          } else {
            alert('⚠️ ' + data.message);
          }
        } catch (e) {
          alert('บันทึกเฉดสีไม่สำเร็จ — ตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์');
        }
      },
      frHandleFileChange(e) {
        this.frNewItem.imageName = e.target.files[0] ? e.target.files[0].name : '';
      },
      frWeightBucket(weight) {
        const n = Number(weight);
        if (!weight || isNaN(n)) return 'mid';
        if (n < 150) return 'light';
        if (n <= 250) return 'mid';
        return 'heavy';
      },
      async frSaveAdd() {
        if (!this.frNewItem.type || !this.frNewItem.sku || !this.frNewItem.width) {
          alert('กรุณากรอกข้อมูลที่จำเป็น (ประเภท, รหัสสินค้า, หน้ากว้าง) ให้ครบถ้วน');
          return;
        }
        const payload = {
          type: this.frNewItem.type,
          sku: this.frNewItem.sku,
          name: this.frNewItem.name,
          structure: this.frNewItem.structure,
          composition: this.frNewItem.composition,
          width: this.frNewItem.width,
          finishing: this.frNewItem.finishing,
          weight: this.frNewItem.weight,
          unit: this.frNewItem.unit,
          description: this.frNewItem.description,
          production_days: this.frNewItem.productionDays || null,
          image_name: this.frNewItem.imageName,
          substitute: this.frNewItem.substitute === 'yes',
          active: this.frNewItem.active,
        };
        try {
          const url = this.frEditingId ? API + `/api/fabrics/${this.frEditingId}` : API + '/api/fabrics';
          const method = this.frEditingId ? 'PUT' : 'POST';
          const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.token },
            body: JSON.stringify(payload),
          });
          if (res.status === 401) { this.sessionExpired(); return; }
          const data = await res.json();
          if (data.ok) {
            await this.frLoadItems();
            this.frCloseAddModal();
          } else {
            alert('⚠️ ' + data.message);
          }
        } catch (e) {
          alert('บันทึกข้อมูลไม่สำเร็จ — ตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์');
        }
      },
      goToMenu(child) {
        if (child.link) {
          window.location.href = child.link;
        } else {
          this.currentPage = child.key;
        }
      },
      pageTitle(key) {
        const flatten = arr => arr.flatMap(m => (m.children ? m.children : [m]));
        const allMenus = [
          ...flatten(this.basicDataMenu), ...this.poMenu, ...this.stockMenu, ...this.vatMenu,
          ...this.orderMenu, ...this.custAccMenu, ...this.partnerAccMenu, ...this.reportMenu, ...this.usersMenu,
        ];
        const found = allMenus.find(m => m.key === key);
        if (!found) return '';
        return this.lang === 'th' ? found.label.th : found.label.en;
      },
      setLanguage(newLang) {
        this.lang = newLang;
        this.langDropdownOpen = false;
        localStorage.setItem('lang', newLang);
      },
      async loadMembers() {
        try {
          const res = await fetch(API + '/api/users', {
            headers: { Authorization: 'Bearer ' + this.token }
          });
          if (res.status === 401) { this.sessionExpired(); return; }
          const data = await res.json();
          this.members = data.users || [];
        } catch (e) {
          console.log('ไม่สามารถโหลดข้อมูลสมาชิก');
        }
      },
      dashExportPeriodRows(granularity) {
        const year = this.dashTrendYear;
        const months = this.dashSalesByYear[year] || [];
        const rows = [];
        months.forEach((m, idx) => {
          const monthNum = idx + 1;
          const daysInMonth = new Date(year, monthNum, 0).getDate();
          const perDay = m.value / daysInMonth;
          if (granularity === 'month') {
            rows.push({ period: `${m.label} ${year}`, sales: Math.round(m.value) });
            return;
          }
          if (granularity === 'day') {
            for (let d = 1; d <= daysInMonth; d++) {
              rows.push({
                period: `${String(d).padStart(2, '0')}/${String(monthNum).padStart(2, '0')}/${year}`,
                sales: Math.round(perDay),
              });
            }
            return;
          }
          // week
          let day = 1;
          let weekNo = 1;
          while (day <= daysInMonth) {
            const start = day;
            const end = Math.min(day + 6, daysInMonth);
            const daysInWeek = end - start + 1;
            rows.push({
              period: `${m.label} สัปดาห์ที่ ${weekNo} (${String(start).padStart(2, '0')}-${String(end).padStart(2, '0')}/${String(monthNum).padStart(2, '0')})`,
              sales: Math.round(perDay * daysInWeek),
            });
            day = end + 1;
            weekNo += 1;
          }
        });
        return rows;
      },
      async dashExportExcel(granularity) {
        const XLSX = await import('xlsx');
        const wb = XLSX.utils.book_new();

        // ---- ชีท 1: สรุปภาพรวม ----
        const overviewAoa = [
          ['รายการ', 'ค่า'],
          [this.t[this.lang].revenue, '฿' + this.totalRevenue],
          [this.t[this.lang].sales, this.monthlySales],
          [this.t[this.lang].orders, this.totalOrders],
          [this.t[this.lang].totalSales, '฿' + this.totalSalesAmount],
          ['ผู้ใช้งานใหม่เดือนนี้', this.newUsersThisMonth],
          ['อัตรามีส่วนร่วม (%)', this.engagementRate],
          ['เวลาเฉลี่ยต่อเซสชัน (นาที)', this.averageSessionTime],
        ];
        const overviewSheet = XLSX.utils.aoa_to_sheet(overviewAoa);
        overviewSheet['!cols'] = [{ wch: 28 }, { wch: 18 }];
        XLSX.utils.book_append_sheet(wb, overviewSheet, 'สรุปภาพรวม');

        // ---- ชีท 2: แนวโน้มยอดขาย ตามช่วงเวลาที่เลือก ----
        const periodLabel = granularity === 'day' ? 'วันที่' : granularity === 'week' ? 'สัปดาห์' : 'เดือน';
        const periodRows = this.dashExportPeriodRows(granularity);
        const trendAoa = [[periodLabel, 'ยอดขาย (บาท)'], ...periodRows.map(r => [r.period, r.sales])];
        const trendSheet = XLSX.utils.aoa_to_sheet(trendAoa);
        trendSheet['!cols'] = [{ wch: 30 }, { wch: 16 }];
        const sheetName = granularity === 'day' ? 'ยอดขายรายวัน' : granularity === 'week' ? 'ยอดขายรายสัปดาห์' : 'ยอดขายรายเดือน';
        XLSX.utils.book_append_sheet(wb, trendSheet, sheetName);

        // ---- ชีท 3: ปริมาณการขาย ----
        const volumeAoa = [['ประเภทผ้า', 'สัดส่วน (%)'], ...this.dashVolumeData.map(d => [d.label, d.value])];
        const volumeSheet = XLSX.utils.aoa_to_sheet(volumeAoa);
        volumeSheet['!cols'] = [{ wch: 22 }, { wch: 16 }];
        XLSX.utils.book_append_sheet(wb, volumeSheet, 'ปริมาณการขาย');

        // ---- ชีท 4: กิจกรรมล่าสุด ----
        const activityAoa = [
          ['กิจกรรม', 'เวลา'],
          ...this.recentActivities.map(a => [this.lang === 'th' ? a.thTitle : a.enTitle, a.time]),
        ];
        const activitySheet = XLSX.utils.aoa_to_sheet(activityAoa);
        activitySheet['!cols'] = [{ wch: 28 }, { wch: 28 }];
        XLSX.utils.book_append_sheet(wb, activitySheet, 'กิจกรรมล่าสุด');

        const suffix = granularity === 'day' ? 'รายวัน' : granularity === 'week' ? 'รายสัปดาห์' : 'รายเดือน';
        const today = new Date().toISOString().slice(0, 10);
        XLSX.writeFile(wb, `Dashboard-${suffix}-${this.dashTrendYear}-${today}.xlsx`);
      },
      async logout() {
        try { 
          await fetch(API + '/api/logout', { 
            method: 'POST', 
            headers: { Authorization: 'Bearer ' + this.token } 
          }); 
        } catch (e) {}
        // ลบข้อมูลออกจาก localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        // redirect ไปที่ login
        setTimeout(() => {
          this.$router.push('/login');
        }, 300);
      },
    },
}
</script>

<template>
  <div class="dashboard-page">
<!-- ============ MOBILE TOP BAR ============ -->
  <div class="mobile-topbar">
    <button class="mobile-menu-btn" @click="mobileMenuOpen = true" title="เมนู" aria-label="เปิดเมนู">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>
    <div class="brand-text">D'Finest</div>
  </div>

  <div class="sidebar-backdrop" v-if="mobileMenuOpen" @click="mobileMenuOpen = false"></div>

  <div class="app-wrapper">
    <!-- ============ SIDEBAR ============ -->
    <aside class="sidebar" :class="{ 'mobile-open': mobileMenuOpen }">
      <div class="sidebar-logo">
        <div class="icon" style="background: linear-gradient(150deg, #4c6bff 0%, #2537c9 100%); display: grid; place-items: center; font-weight: 700; color: #fff; font-size: 15px;">DF</div>
        <div class="text">D'Finest</div>
      </div>

      <!-- Utilities (Theme & Language) -->
      <div class="sidebar-utils">
        <!-- Language Dropdown -->
        <div class="lang-dropdown-container">
          <button class="lang-dropdown-btn" @click="toggleLangDropdown" title="เลือกภาษา">
            <span>🌐 {{ lang === 'th' ? 'TH (ไทย)' : 'EN (ENG)' }}</span>
            <span style="font-size: 10px; opacity: 0.6;">▼</span>
          </button>
          <div class="lang-dropdown-menu" :class="{ active: langDropdownOpen }">
            <div class="lang-dropdown-item" :class="{ selected: lang === 'th' }" @click="setLanguage('th')">
              <span>ไทย (Thai)</span>
            </div>
            <div class="lang-dropdown-item" :class="{ selected: lang === 'en' }" @click="setLanguage('en')">
              <span>English (ENG)</span>
            </div>
          </div>
        </div>

        <!-- Theme Toggle -->
        <button class="theme-toggle" @click="toggleTheme" :title="theme === 'dark' ? 'โหมดกลางวัน' : 'โหมดกลางคืน'" aria-label="สลับโหมดกลางวัน/กลางคืน">
          <svg v-if="theme !== 'dark'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
        </button>
      </div>

      <nav class="sidebar-menu">
        <div class="menu-item" :class="{ active: currentPage === 'dashboard' }" @click="currentPage = 'dashboard'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          <span>{{ t[lang].dashboard }}</span>
        </div>

        <!-- ====== ข้อมูลพื้นฐาน (เมนูหลัก + เมนูย่อย) ====== -->
        <div class="menu-group">
          <div class="menu-item menu-group-header"
               :class="{ active: openGroups.basic, 'has-open-child': basicDataMenu.some(c => c.children ? c.children.some(cc => cc.key === currentPage) : c.key === currentPage) }"
               @click="toggleGroup('basic')">
            <span class="menu-icon">🗂️</span>
            <span class="menu-label">{{ t[lang].groupBasicData }}</span>
            <span class="menu-chevron" :class="{ open: openGroups.basic }">▾</span>
          </div>
          <transition name="dropdown">
            <div class="submenu" v-if="openGroups.basic">
              <template v-for="child in basicDataMenu" :key="child.key">
                <template v-if="child.children">
                  <div class="submenu-item submenu-group-header"
                       :class="{ active: nestedMenuOpen[child.key], 'has-open-child': child.children.some(cc => cc.key === currentPage) }"
                       @click="nestedMenuOpen[child.key] = !nestedMenuOpen[child.key]">
                    <span>{{ lang === 'th' ? child.label.th : child.label.en }}</span>
                    <span class="menu-chevron" :class="{ open: nestedMenuOpen[child.key] }">▾</span>
                  </div>
                  <transition name="dropdown">
                    <div class="submenu submenu-nested" v-if="nestedMenuOpen[child.key]">
                      <div class="submenu-item" v-for="gchild in child.children" :key="gchild.key"
                           :class="{ active: currentPage === gchild.key }" @click="goToMenu(gchild)">
                        <span>{{ lang === 'th' ? gchild.label.th : gchild.label.en }}</span>
                      </div>
                    </div>
                  </transition>
                </template>
                <template v-else>
                  <div class="submenu-item" :class="{ active: currentPage === child.key }" @click="goToMenu(child)">
                    <span>{{ lang === 'th' ? child.label.th : child.label.en }}</span>
                  </div>
                </template>
              </template>
            </div>
          </transition>
        </div>

        <!-- ====== เปิดใบสั่งซื้อ (เมนูหลัก + เมนูย่อย) ====== -->
        <div class="menu-group">
          <div class="menu-item menu-group-header"
               :class="{ active: openGroups.po, 'has-open-child': poMenu.some(c => c.key === currentPage) }"
               @click="toggleGroup('po')">
            <span class="menu-icon">🛒</span>
            <span class="menu-label">{{ t[lang].groupPO }}</span>
            <span class="menu-chevron" :class="{ open: openGroups.po }">▾</span>
          </div>
          <transition name="dropdown">
            <div class="submenu" v-if="openGroups.po">
              <div class="submenu-item" v-for="child in poMenu" :key="child.key"
                   :class="{ active: currentPage === child.key }" @click="currentPage = child.key">
                <span>{{ lang === 'th' ? child.label.th : child.label.en }}</span>
              </div>
            </div>
          </transition>
        </div>

        <!-- ====== จัดการสินค้า (เมนูหลัก + เมนูย่อย) ====== -->
        <div class="menu-group">
          <div class="menu-item menu-group-header"
               :class="{ active: openGroups.stock, 'has-open-child': stockMenu.some(c => c.key === currentPage) }"
               @click="toggleGroup('stock')">
            <span class="menu-icon">📦</span>
            <span class="menu-label">{{ t[lang].groupStock }}</span>
            <span class="menu-chevron" :class="{ open: openGroups.stock }">▾</span>
          </div>
          <transition name="dropdown">
            <div class="submenu" v-if="openGroups.stock">
              <div class="submenu-item" v-for="child in stockMenu" :key="child.key"
                   :class="{ active: currentPage === child.key }" @click="currentPage = child.key">
                <span>{{ lang === 'th' ? child.label.th : child.label.en }}</span>
              </div>
            </div>
          </transition>
        </div>

        <!-- ====== จัดการ VAT (เมนูหลัก + เมนูย่อย) ====== -->
        <div class="menu-group">
          <div class="menu-item menu-group-header"
               :class="{ active: openGroups.vat, 'has-open-child': vatMenu.some(c => c.key === currentPage) }"
               @click="toggleGroup('vat')">
            <span class="menu-icon">🧾</span>
            <span class="menu-label">{{ t[lang].groupVat }}</span>
            <span class="menu-chevron" :class="{ open: openGroups.vat }">▾</span>
          </div>
          <transition name="dropdown">
            <div class="submenu" v-if="openGroups.vat">
              <div class="submenu-item" v-for="child in vatMenu" :key="child.key"
                   :class="{ active: currentPage === child.key }" @click="currentPage = child.key">
                <span>{{ lang === 'th' ? child.label.th : child.label.en }}</span>
              </div>
            </div>
          </transition>
        </div>

        <!-- ====== จัดการออร์เดอร์ (เมนูหลัก + เมนูย่อย) ====== -->
        <div class="menu-group">
          <div class="menu-item menu-group-header"
               :class="{ active: openGroups.order, 'has-open-child': orderMenu.some(c => c.key === currentPage) }"
               @click="toggleGroup('order')">
            <span class="menu-icon">🛍️</span>
            <span class="menu-label">{{ t[lang].groupOrder }}</span>
            <span class="menu-chevron" :class="{ open: openGroups.order }">▾</span>
          </div>
          <transition name="dropdown">
            <div class="submenu" v-if="openGroups.order">
              <div class="submenu-item" v-for="child in orderMenu" :key="child.key"
                   :class="{ active: currentPage === child.key }" @click="currentPage = child.key">
                <span>{{ lang === 'th' ? child.label.th : child.label.en }}</span>
              </div>
            </div>
          </transition>
        </div>

        <!-- ====== บัญชีลูกค้า (เมนูหลัก + เมนูย่อย) ====== -->
        <div class="menu-group">
          <div class="menu-item menu-group-header"
               :class="{ active: openGroups.custAcc, 'has-open-child': custAccMenu.some(c => c.key === currentPage) }"
               @click="toggleGroup('custAcc')">
            <span class="menu-icon">💳</span>
            <span class="menu-label">{{ t[lang].groupCustAcc }}</span>
            <span class="menu-chevron" :class="{ open: openGroups.custAcc }">▾</span>
          </div>
          <transition name="dropdown">
            <div class="submenu" v-if="openGroups.custAcc">
              <div class="submenu-item" v-for="child in custAccMenu" :key="child.key"
                   :class="{ active: currentPage === child.key }" @click="currentPage = child.key">
                <span>{{ lang === 'th' ? child.label.th : child.label.en }}</span>
              </div>
            </div>
          </transition>
        </div>

        <!-- ====== บัญชีคู่ค้า (เมนูหลัก + เมนูย่อย) ====== -->
        <div class="menu-group">
          <div class="menu-item menu-group-header"
               :class="{ active: openGroups.partnerAcc, 'has-open-child': partnerAccMenu.some(c => c.key === currentPage) }"
               @click="toggleGroup('partnerAcc')">
            <span class="menu-icon">💸</span>
            <span class="menu-label">{{ t[lang].groupPartnerAcc }}</span>
            <span class="menu-chevron" :class="{ open: openGroups.partnerAcc }">▾</span>
          </div>
          <transition name="dropdown">
            <div class="submenu" v-if="openGroups.partnerAcc">
              <div class="submenu-item" v-for="child in partnerAccMenu" :key="child.key"
                   :class="{ active: currentPage === child.key }" @click="currentPage = child.key">
                <span>{{ lang === 'th' ? child.label.th : child.label.en }}</span>
              </div>
            </div>
          </transition>
        </div>

        <!-- ====== รายงาน (เมนูหลัก + เมนูย่อย) ====== -->
        <div class="menu-group">
          <div class="menu-item menu-group-header"
               :class="{ active: openGroups.report, 'has-open-child': reportMenu.some(c => c.key === currentPage) }"
               @click="toggleGroup('report')">
            <span class="menu-icon">📊</span>
            <span class="menu-label">{{ t[lang].groupReport }}</span>
            <span class="menu-chevron" :class="{ open: openGroups.report }">▾</span>
          </div>
          <transition name="dropdown">
            <div class="submenu" v-if="openGroups.report">
              <div class="submenu-item" v-for="child in reportMenu" :key="child.key"
                   :class="{ active: currentPage === child.key }" @click="currentPage = child.key">
                <span>{{ lang === 'th' ? child.label.th : child.label.en }}</span>
              </div>
            </div>
          </transition>
        </div>

        <div class="menu-item" :class="{ active: currentPage === 'sales-contract' }" @click="currentPage = 'sales-contract'">
          <span class="menu-icon">📜</span>
          <span>{{ t[lang].salesContractTitle }}</span>
        </div>

        <!-- ====== ผู้ใช้งาน (เมนูหลัก + เมนูย่อย) ====== -->
        <div class="menu-group">
          <div class="menu-item menu-group-header"
               :class="{ active: openGroups.usersGrp, 'has-open-child': usersMenu.some(c => c.key === currentPage) }"
               @click="toggleGroup('usersGrp')">
            <span class="menu-icon">👤</span>
            <span class="menu-label">{{ t[lang].groupUsers }}</span>
            <span class="menu-chevron" :class="{ open: openGroups.usersGrp }">▾</span>
          </div>
          <transition name="dropdown">
            <div class="submenu" v-if="openGroups.usersGrp">
              <div class="submenu-item" v-for="child in usersMenu" :key="child.key"
                   :class="{ active: currentPage === child.key }" @click="currentPage = child.key">
                <span>{{ lang === 'th' ? child.label.th : child.label.en }}</span>
              </div>
            </div>
          </transition>
        </div>

        <div class="menu-item" :class="{ active: currentPage === 'settings' }" @click="currentPage = 'settings'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          <span>{{ t[lang].settingsTitle }}</span>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="user-mini">
          <div class="name">{{ currentUser.name || (lang === 'th' ? 'ผู้ใช้งาน' : 'User') }}</div>
          <div class="email">{{ currentUser.email }}</div>
        </div>
        <button class="logout-btn" @click="logout">{{ t[lang].logout }}</button>
      </div>
    </aside>

    <!-- ============ MAIN CONTENT ============ -->
    <main class="main" :class="{ 'main-fit': currentPage === 'dashboard', 'fr-tight': currentPage === 'fabric-regular' || currentPage === 'fabric-irregular' || currentPage === 'order-receive' }">
      <nav class="breadcrumb-bar" aria-label="breadcrumb">
        <template v-for="(crumb, idx) in breadcrumb" :key="idx">
          <span class="breadcrumb-crumb" :class="{ 'is-current': idx === breadcrumb.length - 1 }">{{ crumb }}</span>
          <span v-if="idx < breadcrumb.length - 1" class="breadcrumb-sep">/</span>
        </template>
      </nav>
      <!-- ============ DASHBOARD PAGE ============ -->
      <DashboardHome v-if="currentPage === 'dashboard'" />

      <!-- ============ USERS PAGE ============ -->
      <UsersPage v-else-if="currentPage === 'users'" />

      <!-- ============ ANALYTICS PAGE ============ -->
      <AnalyticsPage v-else-if="currentPage === 'analytics'" />

      <!-- ============ SETTINGS PAGE ============ -->
      <SettingsPage v-else-if="currentPage === 'settings'" />

      <!-- ============ ผ้าประจำ (ฝังตรงในหน้าแดชบอร์ด ไม่แยกแอป) ============ -->
      <FabricRegularPage v-else-if="currentPage === 'fabric-regular'" />

      <!-- ============ ผ้าไม่ประจำ ============ -->
      <FabricIrregularPage v-else-if="currentPage === 'fabric-irregular'" />

      <!-- ============ ข้อมูลพื้นฐาน (เมนูย่อยทั้ง 9 หน้า) ============ -->
      <BasicDataGenericPage v-else-if="basicDataPages[currentPage]" />

      <!-- ============ เปิดใบสั่งซื้อ (เมนูย่อยทั้ง 3 หน้า) ============ -->
      <PoGenericPage v-else-if="poPages[currentPage]" />

      <!-- ============ จัดการสินค้า (เมนูย่อยทั้ง 7 หน้า) ============ -->
      <StockGenericPage v-else-if="stockPages[currentPage]" />

      <!-- ============ จัดการ VAT (เมนูย่อยทั้ง 5 หน้า) ============ -->
      <VatGenericPage v-else-if="vatPages[currentPage]" />

      <!-- ============ รับออร์เดอร์ (Order Entry Form) ============ -->
      <OrderReceivePage v-else-if="currentPage === 'order-receive'" />

      <!-- ============ จัดการออร์เดอร์ (เมนูย่อยทั้ง 4 หน้า) ============ -->
      <OrderGenericPage v-else-if="orderPages[currentPage]" />

      <!-- ============ บัญชีลูกค้า (เมนูย่อยทั้ง 4 หน้า) ============ -->
      <CustAccGenericPage v-else-if="custAccPages[currentPage]" />

      <!-- ============ บัญชีคู่ค้า (เมนูย่อยทั้ง 3 หน้า) ============ -->
      <PartnerAccGenericPage v-else-if="partnerAccPages[currentPage]" />
      <!-- ============ รายงาน (เมนูย่อยทั้ง 14 หน้า) ============ -->
      <ReportGenericPage v-else-if="reportPages[currentPage]" />

      <!-- ============ สิทธิ์การเข้าใช้งาน ============ -->
      <UserPermissionsPage v-else-if="currentPage === 'user-permissions'" />

      <!-- ============ สัญญาขาย ============ -->
      <SalesContractPage v-else-if="currentPage === 'sales-contract'" />
    </main>
  </div>

  <!-- ============ ใบออร์เดอร์ (Order Slip / Print Preview) ============ -->
  <OrderSlipModal v-if="oeShowSlip" />

  <!-- ============ Modal: แก้ไขข้อมูลลูกค้า ============ -->
  <CustomerEditModal v-if="cmShowEditModal" />

  <!-- ============ Modal: เฉดสี (ใช้ร่วมกันทั้งผ้าประจำและผ้าไม่ประจำ) ============ -->
  <ShadeModal v-if="frShowShadeModal" />
  </div>
</template>

<style>
  /* ============ SIDEBAR UTILS ============ */
  .sidebar-utils {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 4px 0 16px 0;
    border-bottom: 1px solid var(--field-border);
  }

  .lang-dropdown-container {
    position: relative;
    flex: 1;
  }

  .lang-dropdown-btn {
    width: 100%;
    height: 40px;
    border-radius: 8px;
    border: 1px solid var(--field-border);
    background: var(--surface);
    color: var(--text);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    font-size: 13px;
    font-weight: 600;
    transition: all .2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .lang-dropdown-btn:hover {
    background: var(--field);
    border-color: var(--primary);
  }

  .lang-dropdown-menu {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    background: var(--surface);
    border: 1px solid var(--field-border);
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    min-width: 150px;
    overflow: hidden;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all .2s ease;
    z-index: 1002;
  }

  .lang-dropdown-menu.active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .lang-dropdown-item {
    padding: 10px 14px;
    cursor: pointer;
    font-size: 13px;
    color: var(--text);
    border-bottom: 1px solid var(--field-border);
    transition: background .2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .lang-dropdown-item:last-child {
    border-bottom: none;
  }

  .lang-dropdown-item:hover {
    background: var(--field);
  }

  .lang-dropdown-item.selected {
    background: var(--brand-soft);
    color: var(--primary);
    font-weight: 600;
  }

  .lang-dropdown-item.selected::before {
    content: '✓';
    font-weight: 700;
  }

  .theme-toggle {
    position: relative;
    width: 40px; height: 40px; border-radius: 8px;
    border: 1px solid var(--field-border);
    background: var(--surface); color: var(--muted);
    cursor: pointer;
    display: grid; place-items: center;
    transition: background .2s ease, color .2s ease, border-color .2s ease; 
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    flex-shrink: 0;
  }
  .theme-toggle:hover { background: var(--field); color: var(--text); border-color: var(--muted); }
  .theme-toggle svg { width: 19px; height: 19px; display: block; }

  /* ============ MOBILE TOP BAR (hidden on desktop) ============ */
  .mobile-topbar {
    display: none;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: var(--surface);
    border-bottom: 1px solid var(--field-border);
    position: sticky;
    top: 0;
    z-index: 1400;
  }
  .mobile-menu-btn {
    width: 38px; height: 38px; flex-shrink: 0;
    display: grid; place-items: center;
    border: 1px solid var(--field-border);
    background: var(--surface);
    border-radius: 8px;
    color: var(--text);
    cursor: pointer;
  }
  .mobile-menu-btn:hover { background: var(--field); }
  .mobile-menu-btn svg { width: 20px; height: 20px; }
  .mobile-topbar .brand-text { font-weight: 700; font-size: 15px; color: var(--text); }

  .sidebar-backdrop {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(10, 14, 30, .45);
    z-index: 1550;
  }

  .app-wrapper {
    display: grid;
    grid-template-columns: 280px 1fr;
    min-height: 100vh;
    gap: 0;
    position: relative;
  }

  /* ============ SIDEBAR ============ */
  .sidebar {
    background: var(--surface);
    border-right: 1px solid var(--field-border);
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    position: sticky;
    top: 0;
    max-height: 100vh;
    overflow-y: auto;
  }

  .sidebar-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--field-border);
  }
  .sidebar-logo .icon { width: 32px; height: 32px; background: var(--brand); border-radius: 8px; }
  .sidebar-logo .text { font-weight: 700; font-size: 16px; color: var(--text); }

  .sidebar-menu { display: flex; flex-direction: column; gap: 8px; }
  .menu-item {
    padding: 12px 14px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: var(--text);
    transition: background .2s, color .2s;
    display: flex;
    align-items: center;
    gap: 12px;
    border: 1px solid transparent;
  }
  .menu-item:hover { background: var(--field); color: var(--text); }
  .menu-item.active { background: var(--brand-soft); color: var(--brand); border-color: var(--brand); }
  .menu-item svg { width: 18px; height: 18px; }

  .sidebar-divider { height: 1px; background: var(--field-border); }

  /* ============ SIDEBAR SUBMENU (ERP, dropdown) ============ */
  .menu-group-header { justify-content: space-between; }
  .menu-icon { width: 18px; text-align: center; flex-shrink: 0; }
  .menu-label { flex: 1; }
  .menu-chevron { font-size: 15px; line-height: 1; color: var(--text); opacity: .7; transition: transform .2s ease; }
  .menu-chevron.open { transform: rotate(180deg); }
  .menu-group-header.has-open-child:not(.active) { color: var(--brand); font-weight: 600; }

  .submenu {
    display: flex;
    flex-direction: column;
    margin: 6px 0 8px 10px;
    padding: 6px;
    background: var(--surface);
    border-radius: 12px;
    border: 1px solid var(--field-border);
    box-shadow: 0 8px 20px rgba(20, 30, 70, .10), 0 1px 3px rgba(20, 30, 70, .06);
  }
  .submenu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 13.5px;
    font-weight: 500;
    color: var(--text);
    cursor: pointer;
    transition: background .15s, color .15s;
    border-bottom: 1px solid var(--field-border);
  }
  .submenu-item:last-child { border-bottom: none; }
  .submenu-item:hover { background: var(--field); }
  .submenu-item.active { background: var(--brand-soft); color: var(--brand); font-weight: 600; }

  .submenu-item.submenu-group-header { justify-content: space-between; }
  .submenu-item.submenu-group-header.has-open-child:not(.active) { color: var(--brand); font-weight: 600; }
  .submenu-nested { margin: 4px 0 4px 14px; box-shadow: none; }
  .submenu-nested .submenu-item { font-size: 13px; }

  /* Dropdown open/close animation */
  .dropdown-enter-active, .dropdown-leave-active {
    transition: max-height .25s ease, opacity .2s ease;
    overflow: hidden;
  }
  .dropdown-enter-from, .dropdown-leave-to { max-height: 0; opacity: 0; }
  .dropdown-enter-to, .dropdown-leave-from { max-height: 480px; opacity: 1; }

  .sidebar-footer {
    border-top: 1px solid var(--field-border);
    padding-top: 16px;
    margin-top: auto;
  }
  .user-mini {
    padding: 12px;
    background: var(--field);
    border-radius: 10px;
    font-size: 13px;
    margin-bottom: 10px;
  }
  .user-mini .name { font-weight: 600; color: var(--text); margin-bottom: 2px; }
  .user-mini .email { color: var(--muted); font-size: 12px; }

  .logout-btn {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid var(--field-border);
    background: transparent;
    color: var(--muted);
    border-radius: 10px;
    font-size: 13px;
    cursor: pointer;
    transition: background .2s, color .2s, border-color .2s;
  }
  .logout-btn:hover { background: var(--danger); color: #fff; border-color: var(--danger); }

  /* ============ MAIN CONTENT ============ */
  .main {
    display: flex;
    flex-direction: column;
    padding: 32px;
    gap: 24px;
  }

  .breadcrumb-bar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    font-size: 12.5px;
    color: var(--muted);
    flex-shrink: 0;
  }
  .breadcrumb-crumb.is-current { color: var(--text); font-weight: 600; }
  .breadcrumb-sep { opacity: .6; }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }
  .header h1 { font-size: 28px; font-weight: 700; color: var(--text); }
  .header-actions { display: flex; gap: 12px; }
  .btn-small {
    padding: 10px 18px;
    border: 1px solid var(--field-border);
    background: var(--surface);
    color: var(--text);
    border-radius: 10px;
    font-size: 13px;
    cursor: pointer;
    transition: background .2s, border-color .2s;
  }
  .btn-small:hover { background: var(--field); border-color: var(--brand); }
  .btn-primary {
    background: var(--brand);
    color: #fff;
    border-color: var(--brand);
  }
  .btn-primary:hover { background: var(--brand-2); border-color: var(--brand-2); }

  /* ============ STATS GRID ============ */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }
  .dash-charts-row { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-top: 24px; }
  .dash-cards-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 24px; }
  .dash-activity-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 24px; }
  @media (max-width: 900px) {
    .dash-charts-row { grid-template-columns: 1fr; }
    .dash-cards-grid { grid-template-columns: repeat(2, 1fr); }
    .dash-activity-row { grid-template-columns: 1fr; }
  }
  @media (max-width: 480px) {
    .dash-cards-grid { grid-template-columns: 1fr; }
  }

  /* ============ DASHBOARD: fit in one viewport, no page scroll ============ */
  .main.main-fit {
    height: 100vh;
    overflow: hidden;
  }
  .main.fr-tight { padding-top: 14px; }
  .fr-page-compact .header h1 { font-size: 18px; }
  .fr-page-compact .section-header h2 { font-size: 14.5px; }
  .dash-fit {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    min-height: 0;
  }
  .dash-fit .header {
    flex-shrink: 0;
    align-items: flex-start;
  }
  .dash-fit .header h1 { font-size: 18px; }
  .dash-fit .header p { display: none; }
  .dash-fit .header-actions .btn-small { padding: 6px 12px; font-size: 12px; }
  .dash-fit .stats-grid { flex-shrink: 0; gap: 10px; }
  .dash-fit .stats-grid .stat-card { padding: 8px 14px; }
  .dash-fit .stats-grid .label { font-size: 10.5px; }
  .dash-fit .stats-grid .value { font-size: 18px; margin: 2px 0; }
  .dash-fit .stats-grid .detail { font-size: 10.5px; }
  .dash-fit .dash-flex-row { flex: 1; min-height: 0; margin-top: 0; }
  .dash-fit .dash-cards-grid-compact { flex-shrink: 0; margin-top: 0; gap: 10px; }
  .dash-chart-section {
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
    padding: 14px 18px;
  }
  .dash-chart-section .section-header,
  .dash-list-section .section-header {
    margin-bottom: 8px;
    padding-bottom: 8px;
  }
  .dash-chart-section .section-header h2,
  .dash-list-section .section-header h2 { font-size: 14px; }
  .dash-chart-box {
    flex: 1;
    min-height: 0;
    display: grid;
    place-items: center;
    background: var(--field);
    border-radius: 12px;
    font-size: 13px;
    color: var(--muted);
    text-align: center;
    padding: 8px;
  }

  /* ============ Dashboard: กราฟแนวโน้มยอดขาย / ปริมาณการขาย ============ */
  .dash-linechart-box,
  .dash-donut-box { padding: 12px; display: flex; }
  .dash-linechart { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; gap: 4px; }
  .dash-linechart-plot { position: relative; flex: 1; min-height: 0; }
  .dash-line-svg { position: absolute; inset: 0; width: 100%; height: 100%; }
  .dash-grid-line { stroke: var(--field-border); stroke-width: 1; }
  .dash-area-fill { fill: var(--chart-1); opacity: .12; }
  .dash-line-stroke { fill: none; stroke: var(--chart-1); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .dash-line-dot { fill: var(--surface); stroke: var(--chart-1); stroke-width: 2; cursor: pointer; transition: r .15s; }
  .dash-line-dot.is-active { r: 6; fill: var(--chart-1); }
  .dash-axis-y { position: absolute; inset: 0; pointer-events: none; }
  .dash-axis-y span {
    position: absolute;
    left: 0;
    transform: translateY(-50%);
    font-size: 10px;
    color: var(--muted);
    white-space: nowrap;
  }
  .dash-chart-xaxis { position: absolute; left: 0; right: 0; bottom: 2px; height: 14px; }
  .dash-chart-xaxis span {
    position: absolute;
    bottom: 0;
    transform: translateX(-50%);
    font-size: 10.5px;
    color: var(--muted);
    white-space: nowrap;
  }
  .dash-chart-xaxis span.is-active { color: var(--chart-1); font-weight: 600; }
  .dash-chart-tooltip {
    position: absolute;
    top: 4px;
    transform: translateX(-50%);
    background: var(--surface);
    border: 1px solid var(--field-border);
    border-radius: 8px;
    padding: 6px 10px;
    font-size: 11.5px;
    color: var(--text);
    white-space: nowrap;
    box-shadow: 0 8px 20px rgba(20, 30, 70, .15);
    pointer-events: none;
    z-index: 2;
  }
  .dash-chart-tooltip strong { display: block; font-size: 10px; color: var(--muted); font-weight: 600; }
  .dash-chart-note {
    flex-shrink: 0;
    font-size: 10.5px;
    color: var(--muted);
    text-align: center;
    padding-top: 2px;
  }
  .dash-year-select {
    height: 30px;
    border: 1px solid var(--field-border);
    border-radius: 8px;
    background: var(--surface);
    color: var(--text);
    font-size: 12.5px;
    padding: 0 8px;
    cursor: pointer;
  }

  .dash-donut-box { flex-direction: column; gap: 8px; }
  .dash-donut-row { display: flex; align-items: center; gap: 16px; flex: 1; min-height: 0; }
  .dash-donut-svg { width: 120px; height: 120px; flex-shrink: 0; }
  .dash-donut-track { fill: none; stroke: var(--field-border); stroke-width: 18; }
  .dash-donut-seg { cursor: pointer; transition: stroke-width .15s; }
  .dash-donut-seg.is-active { stroke-width: 21; }
  .dash-donut-center-value { fill: var(--text); font-size: 18px; font-weight: 700; }
  .dash-donut-center-label { fill: var(--muted); font-size: 8.5px; }
  .dash-donut-legend { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
  .dash-donut-legend-item { display: flex; align-items: center; gap: 6px; font-size: 11.5px; cursor: pointer; border-radius: 6px; padding: 2px 4px; transition: background .15s; }
  .dash-donut-legend-item.is-active { background: var(--field); }
  .dash-donut-swatch { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
  .dash-donut-legend-label { color: var(--text); flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .dash-donut-legend-pct { color: var(--muted); font-weight: 600; flex-shrink: 0; }

  @media (max-width: 900px) {
    .dash-donut-box { flex-direction: column; }
  }

  .dash-list-section {
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
    padding: 14px 18px;
  }
  .dash-scroll-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }

  @media (max-width: 900px) {
    .main.main-fit { height: auto; overflow: visible; }
    .dash-fit { height: auto; }
    .dash-fit .dash-flex-row { flex: none; }
    .dash-chart-box { height: 220px; }
    .dash-scroll-body { max-height: 320px; }
  }
  .stat-card {
    background: linear-gradient(135deg, var(--pink) 0%, var(--pink) 100%);
    border-radius: 16px;
    padding: 24px;
    border: none;
    transition: box-shadow .2s, transform .2s;
    color: #fff;
    position: relative;
    overflow: hidden;
  }
  .stat-card::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
  .stat-card:nth-child(2) { background: linear-gradient(135deg, var(--purple) 0%, var(--purple) 100%); }
  .stat-card:nth-child(3) { background: linear-gradient(135deg, var(--blue) 0%, var(--blue) 100%); }
  .stat-card:nth-child(4) { background: linear-gradient(135deg, var(--orange) 0%, var(--orange) 100%); }
  .stat-card:hover { box-shadow: 0 12px 30px rgba(0, 0, 0, .2); transform: translateY(-4px); }
  .stat-card .label { font-size: 12px; color: rgba(255,255,255, 0.8); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
  .stat-card .value { font-size: 36px; font-weight: 700; color: #fff; margin: 10px 0; }
  .stat-card .detail { font-size: 13px; color: rgba(255,255,255, 0.85); position: relative; z-index: 1; }

  /* ============ ผ้าประจำ (fr-) ============ */
  .fr-filter-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px 18px; }
  .fr-field-group { display: flex; flex-direction: column; gap: 6px; }
  .fr-field-group label { font-size: 12px; font-weight: 600; color: var(--muted); }
  .fr-field-group input[type="text"],
  .fr-field-group select {
    height: 36px; border: 1px solid var(--field-border); border-radius: 8px;
    padding: 0 10px; font-size: 13px; color: var(--text); background: var(--surface);
    transition: border-color .2s, box-shadow .2s;
  }
  .fr-field-group input[type="text"]:focus,
  .fr-field-group select:focus {
    outline: none; border-color: #2F65F6; box-shadow: 0 0 0 3px rgba(47,101,246,.12);
  }
  .fr-sku-range { display: flex; align-items: center; gap: 6px; }
  .fr-sku-range input { flex: 1; min-width: 0; }
  .fr-sku-range span { color: var(--muted); font-size: 12px; }
  .fr-checkbox-group { flex-direction: row; align-items: center; gap: 8px; padding-top: 20px; }
  .fr-checkbox-group input[type="checkbox"] { width: 16px; height: 16px; accent-color: #2F65F6; cursor: pointer; }
  .fr-checkbox-group label { font-size: 13px; font-weight: 500; color: var(--text); cursor: pointer; }
  .fr-filter-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px; }
  .fr-btn-util {
    display: inline-flex; align-items: center; gap: 6px;
    background: #e7eaf1; color: var(--text); border: 1px solid var(--field-border);
    padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;
    transition: background .2s, border-color .2s;
  }
  .fr-btn-util:hover { background: #dde1ea; border-color: #c7cede; }
  .fr-btn-util svg { width: 14px; height: 14px; }

  .fr-summary { padding: 14px 28px 0; font-size: 13px; font-weight: 600; color: #2F65F6; }

  .fr-table-wrap { margin-top: 12px; }
  .fr-table-scroll { overflow-x: auto; }
  .fr-table { width: 100%; border-collapse: collapse; min-width: 1180px; }
  .fr-table thead th {
    background: #3c4453; color: #fff; font-size: 12px; font-weight: 600;
    text-transform: uppercase; letter-spacing: .4px; padding: 12px 14px; text-align: left; white-space: nowrap;
  }
  .fr-table tbody td {
    padding: 11px 14px; font-size: 13px; color: var(--text);
    border-bottom: 1px solid var(--field-border); white-space: nowrap;
  }
  .fr-table tbody tr:nth-child(even) { background: var(--field); }
  .fr-table tbody tr:hover { background: var(--brand-soft); }
  .fr-table tbody tr:last-child td { border-bottom: none; }

  .fr-img-btn {
    width: 30px; height: 30px; display: grid; place-items: center;
    background: var(--field); border: 1px solid var(--field-border); border-radius: 8px;
    color: var(--muted); cursor: pointer;
  }
  .fr-img-btn svg { width: 15px; height: 15px; }
  .fr-action-group { display: flex; gap: 6px; }
  .fr-action-btn {
    width: 28px; height: 28px; display: grid; place-items: center;
    border-radius: 7px; border: 1px solid var(--field-border); background: var(--surface);
    cursor: pointer; color: var(--muted);
    transition: background .2s, color .2s, border-color .2s;
  }
  .fr-action-btn svg { width: 14px; height: 14px; }
  .fr-action-btn.edit:hover { background: rgba(47,101,246,.1); color: #2F65F6; border-color: #2F65F6; }
  .fr-action-btn.delete:hover { background: rgba(229,72,77,.1); color: var(--danger); border-color: var(--danger); }
  .fr-action-btn.view:hover { background: rgba(23,160,106,.1); color: var(--ok); border-color: var(--ok); }
  .fr-empty-row td { text-align: center; padding: 36px; color: var(--muted); }

  /* ============ ผ้าไม่ประจำ (fi-) ============ */
  .fi-search-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .fi-search-row input[type="text"] {
    flex: 1;
    height: 38px;
    border: 1px solid var(--field-border);
    border-radius: 8px;
    padding: 0 12px;
    font-size: 13.5px;
    color: var(--text);
    background: var(--surface);
  }
  .fi-search-row input[type="text"]:focus {
    outline: none;
    border-color: #2F65F6;
    box-shadow: 0 0 0 3px rgba(47,101,246,.12);
  }
  .fi-table { width: 100%; border-collapse: collapse; min-width: 900px; }
  .fi-table thead th {
    background: #555555; color: #fff; font-size: 12px; font-weight: 600;
    text-transform: uppercase; letter-spacing: .4px; padding: 12px 14px; text-align: left; white-space: nowrap;
  }
  .fi-table tbody td {
    padding: 11px 14px; font-size: 13px; color: var(--text);
    border-bottom: 1px solid var(--field-border); white-space: nowrap;
  }
  .fi-table tbody tr:nth-child(even) { background: var(--field); }
  .fi-table tbody tr:hover { background: var(--brand-soft); }
  .fi-table tbody tr:last-child td { border-bottom: none; }

  @media (max-width: 900px) {
    .fr-filter-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 560px) {
    .fi-search-row { flex-wrap: wrap; }
    .fi-search-row input[type="text"] { flex-basis: 100%; }
  }
  @media (max-width: 560px) {
    .fr-filter-grid { grid-template-columns: 1fr; }
    .fr-filter-actions { justify-content: stretch; }
    .fr-btn-util { flex: 1; justify-content: center; }
  }

  /* ============ Modal: เพิ่ม ผ้าประจำ ============ */
  .fr-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 20, 40, .5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    z-index: 2000;
  }
  .fr-modal {
    width: 100%;
    max-width: 560px;
    max-height: 90vh;
    background: var(--surface);
    border-radius: 14px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 24px 60px rgba(0, 0, 0, .3);
  }
  .fr-modal-header {
    background: #2F65F6;
    padding: 16px 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }
  .fr-modal-header h3 { color: #fff; font-size: 17px; font-weight: 700; }
  .fr-modal-close {
    width: 30px; height: 30px;
    display: grid; place-items: center;
    border: none; background: rgba(255,255,255,.15);
    border-radius: 8px; color: #fff; cursor: pointer;
    transition: background .2s;
  }
  .fr-modal-close:hover { background: rgba(255,255,255,.28); }
  .fr-modal-close svg { width: 16px; height: 16px; }

  .fr-modal-body {
    border: none;
    margin: 0;
    min-width: 0;
    padding: 22px 24px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .fr-modal-body:disabled { opacity: .75; }
  .fr-form-row {
    display: grid;
    grid-template-columns: 150px 1fr;
    align-items: center;
    gap: 16px;
  }
  .fr-form-row label { font-size: 13.5px; font-weight: 600; color: var(--text); }
  .fr-required { color: var(--danger); font-weight: 700; }
  .fr-form-row input[type="text"],
  .fr-form-row input[type="number"],
  .fr-form-row select {
    height: 38px;
    border: 1px solid var(--field-border);
    border-radius: 8px;
    padding: 0 12px;
    font-size: 13.5px;
    color: var(--text);
    background: var(--surface);
    width: 100%;
    transition: border-color .2s, box-shadow .2s;
  }
  .fr-form-row input:focus,
  .fr-form-row select:focus {
    outline: none;
    border-color: #2F65F6;
    box-shadow: 0 0 0 3px rgba(47,101,246,.12);
  }
  .fr-active-checkbox { width: 18px; height: 18px; accent-color: #2F65F6; cursor: pointer; justify-self: start; }

  .fr-file-input {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 38px;
    border: 1px solid var(--field-border);
    border-radius: 8px;
    padding: 0 6px 0 12px;
    background: var(--surface);
  }
  .fr-file-name {
    flex: 1;
    font-size: 13px;
    color: var(--muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .fr-file-btn {
    width: 28px; height: 28px;
    display: grid; place-items: center;
    border: none; background: var(--field);
    border-radius: 6px; color: var(--muted); cursor: pointer;
    flex-shrink: 0;
    transition: background .2s, color .2s;
  }
  .fr-file-btn:hover { background: var(--brand-soft); color: #2F65F6; }
  .fr-file-btn svg { width: 15px; height: 15px; }
  .fr-file-hidden { display: none; }

  .fr-modal-footer {
    padding: 18px 24px;
    border-top: 1px solid var(--field-border);
    display: flex;
    justify-content: center;
    flex-shrink: 0;
  }
  .fr-btn-save {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #e7eaf1;
    color: var(--text);
    border: 1px solid var(--field-border);
    padding: 10px 36px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background .2s, border-color .2s;
  }
  .fr-btn-save:hover { background: #dde1ea; border-color: #c7cede; }
  .fr-btn-save svg { width: 16px; height: 16px; }
  .fr-modal-footer { gap: 12px; }

  .fr-color-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    border: 1px solid var(--field-border);
    background: var(--field);
    color: var(--text);
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    transition: background .2s, border-color .2s;
  }
  .fr-color-badge:hover { background: var(--brand-soft); border-color: #2F65F6; color: #2F65F6; }

  /* ============ รับออร์เดอร์ (Order Entry) ============ */
  .oe-header-form {
    background: var(--field);
    border: 1px solid var(--field-border);
    border-radius: 14px;
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .oe-row1 { display: grid; grid-template-columns: 150px 1.3fr 1.1fr 1.6fr 90px; gap: 14px 18px; }
  .oe-row2 { display: grid; grid-template-columns: 200px 220px; gap: 14px 18px; }
  .oe-header-form textarea {
    resize: vertical;
    min-height: 38px;
    border: 1px solid var(--field-border);
    border-radius: 10px;
    padding: 8px 10px;
    font-size: 13px;
    color: var(--text);
    background: var(--surface);
    font-family: inherit;
  }
  .oe-header-form textarea:focus { outline: none; border-color: #2F65F6; }
  .oe-readonly { background: var(--field) !important; color: var(--muted); cursor: not-allowed; }

  .oe-table th, .oe-table td { white-space: nowrap; }
  .oe-table input[type="text"],
  .oe-table input[type="number"],
  .oe-table select {
    width: 100%;
    min-width: 90px;
    height: 32px;
    border: 1px solid var(--field-border);
    border-radius: 7px;
    padding: 0 8px;
    font-size: 12.5px;
    color: var(--text);
    background: var(--surface);
  }
  .oe-table input:focus, .oe-table select:focus { outline: none; border-color: #2F65F6; }
  .oe-substitute-cell { display: flex; align-items: center; gap: 6px; }
  .oe-substitute-cell input[type="checkbox"] { width: 15px; height: 15px; accent-color: #2F65F6; flex-shrink: 0; }
  .oe-substitute-cell input[type="text"] { min-width: 110px; }

  .oe-row-btn {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: grid;
    place-items: center;
    font-size: 15px;
    font-weight: 700;
    color: #fff;
    line-height: 1;
    flex-shrink: 0;
    transition: filter .15s;
  }
  .oe-row-btn:hover { filter: brightness(1.1); }
  .oe-row-btn-add { background: var(--ok); }
  .oe-row-btn-remove { background: var(--danger); }
  .oe-row-btn-blue { background: #2F65F6; font-size: 12px; }

  .oe-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 18px; }
  .oe-save-success { color: var(--ok); font-weight: 600; font-size: 13.5px; }
  .oe-footer-actions { display: flex; gap: 12px; }

  @media (max-width: 900px) {
    .oe-row1, .oe-row2 { grid-template-columns: 1fr; }
  }

  /* ============ ใบออร์เดอร์ (Order Slip / Print Preview) ============ */
  .oe-slip-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 20, 40, .55);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 40px 16px;
    overflow-y: auto;
    z-index: 2000;
  }
  .oe-slip-wrap { display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .oe-slip-toolbar { display: flex; gap: 10px; }
  .oe-slip {
    width: 302px;
    background: #fff;
    color: #000;
    padding: 16px;
    border: 1px solid #000;
    box-shadow: 0 24px 60px rgba(0, 0, 0, .35);
  }
  .oe-slip-customer {
    font-weight: 700;
    font-size: 16px;
    text-align: center;
    border-bottom: 2px solid #000;
    padding-bottom: 8px;
    margin-bottom: 8px;
  }
  .oe-slip-meta { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 10px; }
  .oe-slip-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .oe-slip-table th, .oe-slip-table td { border: 1px solid #000; padding: 4px 6px; text-align: left; }
  .oe-slip-pack { text-align: center; }
  .oe-slip-pack svg { width: 16px; height: 16px; }
  .oe-slip-total { border: 1px solid #000; border-top: none; text-align: center; font-weight: 700; padding: 6px; font-size: 12.5px; }
  .oe-slip-remark { border: 1px solid #000; border-top: none; display: flex; font-size: 12px; }
  .oe-slip-remark span:first-child { padding: 6px; border-right: 1px solid #000; font-weight: 600; width: 70px; flex-shrink: 0; }
  .oe-slip-remark span:last-child { padding: 6px; flex: 1; word-break: break-word; }
  .oe-slip-qr { display: flex; justify-content: center; margin-top: 14px; }
  .oe-slip-qr img { width: 120px; height: 120px; }

  @media print {
    body * { visibility: hidden; }
    .oe-slip, .oe-slip * { visibility: visible; }
    .oe-slip {
      position: fixed;
      top: 0;
      left: 0;
      width: 80mm;
      box-shadow: none;
      border: none;
      padding: 6mm;
    }
  }

  /* ============ เพิ่มข้อมูล Database (Excel) — หน้าตั้งค่า ============ */
  .xl-import-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .xl-import-message { margin-top: 10px; font-size: 13px; font-weight: 600; color: var(--ok); }
  .xl-import-message.is-error { color: var(--danger); }
  .xl-pagination { display: flex; align-items: center; justify-content: center; gap: 14px; margin-top: 14px; font-size: 13px; color: var(--muted); }
  .xl-pagination button:disabled { opacity: .5; cursor: not-allowed; }

  /* ============ Modal: เฉดสี ============ */
  .fr-shade-modal { max-width: 640px; }

  .fr-shade-search {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 4px;
  }
  .fr-shade-search input[type="text"] {
    flex: 1;
    height: 38px;
    border: 1px solid var(--field-border);
    border-radius: 8px;
    padding: 0 12px;
    font-size: 13.5px;
    color: var(--text);
    background: var(--surface);
  }
  .fr-shade-search input[type="text"]:focus {
    outline: none;
    border-color: #2F65F6;
    box-shadow: 0 0 0 3px rgba(47,101,246,.12);
  }

  .fr-shade-table {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .fr-shade-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr auto;
    align-items: center;
    gap: 10px;
  }
  .fr-shade-row-head span {
    font-size: 12px;
    font-weight: 600;
    color: var(--muted);
  }
  .fr-shade-row input {
    height: 38px;
    border: 1px solid var(--field-border);
    border-radius: 8px;
    padding: 0 12px;
    font-size: 13.5px;
    color: var(--text);
    background: var(--surface);
    width: 100%;
  }
  .fr-shade-row input:focus {
    outline: none;
    border-color: #2F65F6;
    box-shadow: 0 0 0 3px rgba(47,101,246,.12);
  }
  .fr-shade-row-actions {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
  }
  .fr-circle-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    background: #1c2333;
    color: #fff;
    font-size: 13px;
    line-height: 1;
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: background .2s, transform .1s;
    flex-shrink: 0;
  }
  .fr-circle-btn:hover { background: #000; }
  .fr-circle-btn:active { transform: scale(.92); }
  .fr-shade-empty {
    text-align: center;
    padding: 24px;
    color: var(--muted);
    font-size: 13.5px;
  }

  @media (max-width: 560px) {
    .fr-form-row { grid-template-columns: 1fr; gap: 6px; }
    .fr-shade-row { grid-template-columns: 1fr; gap: 6px; }
    .fr-shade-row-head { display: none; }
    .fr-shade-row-actions { justify-content: flex-end; }
  }

  /* ============ SECTION ============ */
  .section {
    background: var(--surface);
    border-radius: 14px;
    padding: 24px;
    border: 1px solid var(--field-border);
    overflow-x: auto;
  }
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--field-border);
  }
  .section-header h2 { font-size: 18px; font-weight: 700; color: var(--text); }

  /* ============ TABLE ============ */
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th, td { text-align: left; padding: 12px 14px; border-bottom: 1px solid var(--field-border); }
  th { color: var(--muted); font-weight: 600; font-size: 12.5px; text-transform: uppercase; letter-spacing: .5px; background: var(--field); }
  tr:hover { background: var(--field); }
  tr:last-child td { border-bottom: none; }

  .badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
  }
  .badge.success { background: rgba(23, 160, 106, 0.1); color: var(--ok); }
  .badge.warning { background: rgba(232, 160, 29, 0.1); color: var(--warn); }
  .badge.danger { background: rgba(229, 72, 77, 0.1); color: var(--danger); }

  /* ============ ACTIVITY ============ */
  .activity-item {
    padding: 12px 0;
    display: flex;
    gap: 12px;
    border-bottom: 1px solid var(--field-border);
  }
  .activity-item:last-child { border-bottom: none; }
  .activity-icon { width: 36px; height: 36px; background: var(--field); border-radius: 8px; display: grid; place-items: center; color: var(--brand); flex-shrink: 0; }
  .activity-content { flex: 1; }
  .activity-title { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 2px; }
  .activity-time { font-size: 12px; color: var(--muted); }

  /* ============ RESPONSIVE ============ */
  @media (max-width: 768px) {
    .mobile-topbar { display: flex; }
    .sidebar-backdrop { display: block; }

    .app-wrapper {
      grid-template-columns: 1fr;
    }
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: 280px;
      max-width: 85vw;
      transform: translateX(-100%);
      transition: transform .25s ease;
      z-index: 1600;
      box-shadow: 0 0 40px rgba(0, 0, 0, .2);
    }
    .sidebar.mobile-open {
      transform: translateX(0);
    }
    .main {
      padding: 16px;
      gap: 16px;
    }
    .header h1 { font-size: 22px; }
  }

  @media (max-width: 480px) {
    .header-actions { width: 100%; }
    .header-actions .btn-small { flex: 1; }
  }
</style>
