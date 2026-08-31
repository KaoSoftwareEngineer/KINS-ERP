<script>
import TopNavbar from './dashboard/TopNavbar.vue';
import BrandLogo from '../components/BrandLogo.vue';
import DashboardHome from './dashboard/DashboardHome.vue';
import UsersPage from './dashboard/UsersPage.vue';
import AnalyticsPage from './dashboard/AnalyticsPage.vue';
import SettingsPage from './dashboard/SettingsPage.vue';
import FabricRegularPage from './dashboard/FabricRegularPage.vue';
import FabricRegularGroupPage from './dashboard/FabricRegularGroupPage.vue';
import FabricIrregularPage from './dashboard/FabricIrregularPage.vue';
import FabricRawPage from './dashboard/FabricRawPage.vue';
import PartnersPage from './dashboard/PartnersPage.vue';
import EmployeePage from './dashboard/EmployeePage.vue';
import MasterDataPage from './dashboard/MasterDataPage.vue';
import NoteInfoPage from './dashboard/NoteInfoPage.vue';
import CustomersPage from './dashboard/CustomersPage.vue';
import GoodsReceivePage from './dashboard/GoodsReceivePage.vue';
import GoodsFinishedReceivePage from './dashboard/GoodsFinishedReceivePage.vue';
import GoodsRawReceivePage from './dashboard/GoodsRawReceivePage.vue';
import GoodsDyedReceivePage from './dashboard/GoodsDyedReceivePage.vue';
import GoodsTransferPage from './dashboard/GoodsTransferPage.vue';
import RawTransferPage from './dashboard/RawTransferPage.vue';
import RackTransferPage from './dashboard/RackTransferPage.vue';
import BarcodePage from './dashboard/BarcodePage.vue';
import VatProductGroupPage from './dashboard/VatProductGroupPage.vue';
import VatReceivePage from './dashboard/VatReceivePage.vue';
import VatStockCutPage from './dashboard/VatStockCutPage.vue';
import VatInvoicePage from './dashboard/VatInvoicePage.vue';
import VatInvoiceCutPage from './dashboard/VatInvoiceCutPage.vue';
import StockInventoryReportPage from './dashboard/StockInventoryReportPage.vue';
import CreditNotePage from './dashboard/CreditNotePage.vue';
import PaymentPage from './dashboard/PaymentPage.vue';
import AccountDeductPage from './dashboard/AccountDeductPage.vue';
import InvoiceOpenPage from './dashboard/InvoiceOpenPage.vue';
import InvoiceReturnPage from './dashboard/InvoiceReturnPage.vue';
import CustomerBillingPage from './dashboard/CustomerBillingPage.vue';
import ZoneRackPage from './dashboard/ZoneRackPage.vue';
import StockHistoryPage from './dashboard/StockHistoryPage.vue';
import BasicDataGenericPage from './dashboard/BasicDataGenericPage.vue';
import PoGenericPage from './dashboard/PoGenericPage.vue';
import PoFabricFinishedPage from './dashboard/PoFabricFinishedPage.vue';
import PoFabricRawPage from './dashboard/PoFabricRawPage.vue';
import PoDyeOrderPage from './dashboard/PoDyeOrderPage.vue';
import StockGenericPage from './dashboard/StockGenericPage.vue';
import VatGenericPage from './dashboard/VatGenericPage.vue';
import OrderReceivePage from './dashboard/OrderReceivePage.vue';
import OrderFulfillPage from './dashboard/OrderFulfillPage.vue';
import OrderFulfillDetailPage from './dashboard/OrderFulfillDetailPage.vue';
import OrderGenericPage from './dashboard/OrderGenericPage.vue';
import CustAccGenericPage from './dashboard/CustAccGenericPage.vue';
import PartnerAccGenericPage from './dashboard/PartnerAccGenericPage.vue';
import ReportGenericPage from './dashboard/ReportGenericPage.vue';
import ReportViewPage from './dashboard/ReportViewPage.vue';
import ShelfStockReportPage from './dashboard/ShelfStockReportPage.vue';
import RawStockReportPage from './dashboard/RawStockReportPage.vue';
import GoodsReceiptReportPage from './dashboard/GoodsReceiptReportPage.vue';
import PoReportPage from './dashboard/PoReportPage.vue';
import OrderReportPage from './dashboard/OrderReportPage.vue';
import DyeOrderReportPage from './dashboard/DyeOrderReportPage.vue';
import SalesContractReportPage from './dashboard/SalesContractReportPage.vue';
import SalesReportPage from './dashboard/SalesReportPage.vue';
import InvoiceReturnReportPage from './dashboard/InvoiceReturnReportPage.vue';
import VatInvoiceReportPage from './dashboard/VatInvoiceReportPage.vue';
import ProfitLossReportPage from './dashboard/ProfitLossReportPage.vue';
import ProfitLossYearlyPage from './dashboard/ProfitLossYearlyPage.vue';
import BillingReportPage from './dashboard/BillingReportPage.vue';
import CustomerPaymentReportPage from './dashboard/CustomerPaymentReportPage.vue';
import CreditNoteReportPage from './dashboard/CreditNoteReportPage.vue';
import ReorderPointReportPage from './dashboard/ReorderPointReportPage.vue';
import AnnualSummaryPage from './dashboard/AnnualSummaryPage.vue';
import OtherReportPage from './dashboard/OtherReportPage.vue';
import GoodsIssueReportPage from './dashboard/GoodsIssueReportPage.vue';
import GoodsTransferReportPage from './dashboard/GoodsTransferReportPage.vue';
import RawTransferReportPage from './dashboard/RawTransferReportPage.vue';
import RackTransferReportPage from './dashboard/RackTransferReportPage.vue';
import VatStockReportPage from './dashboard/VatStockReportPage.vue';
import VatReceiveReportPage from './dashboard/VatReceiveReportPage.vue';
import VatIssueReportPage from './dashboard/VatIssueReportPage.vue';
import UserPermissionsPage from './dashboard/UserPermissionsPage.vue';
import SalesContractPage from './dashboard/SalesContractPage.vue';
import OrderSlipModal from './dashboard/OrderSlipModal.vue';
import CustomerEditModal from './dashboard/CustomerEditModal.vue';
import ShadeModal from './dashboard/ShadeModal.vue';
import FeedbackModal from './dashboard/FeedbackModal.vue';
import ToastHost from './dashboard/ToastHost.vue';
import PermissionModal from './dashboard/PermissionModal.vue';
import { useAuthStore } from '../stores/auth.js';
import { useUiStore } from '../stores/ui.js';
import { useCustomerStore } from '../stores/customer.js';
import { useOrderStore } from '../stores/order.js';
import { useFabricStore } from '../stores/fabric.js';

const API = '';

export default {
  name: 'DashboardView',
  components: {
    TopNavbar,
    BrandLogo,
    DashboardHome,
    UsersPage,
    AnalyticsPage,
    SettingsPage,
    FabricRegularPage,
    FabricRegularGroupPage,
    FabricIrregularPage,
    FabricRawPage,
    PartnersPage,
    EmployeePage,
    MasterDataPage,
    NoteInfoPage,
    CustomersPage,
    GoodsReceivePage,
    GoodsFinishedReceivePage,
    GoodsRawReceivePage,
    GoodsDyedReceivePage,
    GoodsTransferPage,
    RawTransferPage,
    RackTransferPage,
    BarcodePage,
    VatProductGroupPage,
    VatReceivePage,
    VatStockCutPage,
    VatInvoicePage,
    VatInvoiceCutPage,
    StockInventoryReportPage,
    CreditNotePage,
    PaymentPage,
    AccountDeductPage,
    InvoiceOpenPage,
    InvoiceReturnPage,
    CustomerBillingPage,
    ZoneRackPage,
    StockHistoryPage,
    BasicDataGenericPage,
    PoGenericPage,
    PoFabricFinishedPage,
    PoFabricRawPage,
    PoDyeOrderPage,
    StockGenericPage,
    VatGenericPage,
    OrderReceivePage,
    OrderFulfillPage,
    OrderFulfillDetailPage,
    OrderGenericPage,
    CustAccGenericPage,
    PartnerAccGenericPage,
    ReportGenericPage,
    PoReportPage,
    OrderReportPage,
    DyeOrderReportPage,
    SalesContractReportPage,
    SalesReportPage,
    InvoiceReturnReportPage,
    VatInvoiceReportPage,
    ProfitLossReportPage,
    ProfitLossYearlyPage,
    BillingReportPage,
    CustomerPaymentReportPage,
    CreditNoteReportPage,
    ReorderPointReportPage,
    AnnualSummaryPage,
    OtherReportPage,
    ReportViewPage,
    ShelfStockReportPage,
    RawStockReportPage,
    GoodsReceiptReportPage,
    GoodsIssueReportPage,
    GoodsTransferReportPage,
    RawTransferReportPage,
    RackTransferReportPage,
    VatStockReportPage,
    VatReceiveReportPage,
    VatIssueReportPage,
    UserPermissionsPage,
    SalesContractPage,
    OrderSlipModal,
    CustomerEditModal,
    ShadeModal,
    FeedbackModal,
    ToastHost,
    PermissionModal,
  },
  provide() {
    return { dash: this };
  },
  setup() {
    // แยก store: auth (user/token/สิทธิ์) + ui (กล่องแจ้งผล feedback) + customer (ลูกค้า/customer_master)
    return { auth: useAuthStore(), ui: useUiStore(), customer: useCustomerStore(), order: useOrderStore(), fabric: useFabricStore() };
  },
data() {
      return {
        // fb / fbAskState ย้ายไปที่ ui store (เป็น computed proxy ด้านล่าง)
        // ===== โมดัลสิทธิ์การเข้าใช้งาน =====
        pmShow: false,
        pmEditing: false,
        pmInitialName: '',
        pmInitialKeys: [],
        pmEditingRowIdx: -1,
        // rolePerms ย้ายไปที่ auth store (this.rolePerms = computed proxy)
        // ตำแหน่งเมนูภาษา (ลอยหน้าสุด)
        langFlyoutPos: { top: 0, left: 0 },
        // เมนูย่อยซ้อน (cascading) ลอยออกข้าง
        nestedFlyoutKey: null,
        nestedFlyoutPos: { top: 0, left: 0 },
        // ===== แก้ไขบัญชีผู้ใช้ =====
        usModalShow: false,
        usCanManage: false,  // ตัวเราจัดการบัญชีคนอื่นได้ไหม (ตามตำแหน่ง)
        usEditItem: { id: null, name: '', email: '', phone: '', role: '', gender: '', age: '', password: '' },
        // ข้อมูลผ้า (master data) สำหรับ dropdown ในฟอร์มผ้าประจำ/ไม่ประจำ
        md: { structure: [], composition: [], width: [], finishing: [], weight: [] },
        // กลุ่มผ้าประจำ (frg*) ย้ายไปที่ stores/fabric.js แล้ว
        theme: localStorage.getItem('theme') || 'light',
        lang: localStorage.getItem('lang') || 'th',
        langDropdownOpen: false,
        mobileMenuOpen: false,
        currentPage: localStorage.getItem('currentPage') || 'dashboard',
        openGroups: { basic: false, po: false, stock: false, vat: false, order: false, custAcc: false, partnerAcc: false, report: false, usersGrp: false },
        nestedMenuOpen: {},
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
        reportChildParent: {
          'report-stock-shelf': 'report-stock', 'report-stock-raw': 'report-stock', 'report-stock-receive': 'report-stock', 'report-stock-issue': 'report-stock', 'report-stock-move': 'report-stock', 'report-stock-move-raw': 'report-stock', 'report-stock-move-shelf': 'report-stock',
          'report-vat-receive': 'report-vat-stock', 'report-vat-issue': 'report-vat-stock',
          'report-sales-ws': 'report-sales', 'report-sales-rt': 'report-sales', 'report-sales-return': 'report-sales',
          'report-pl-ws': 'report-profit-loss', 'report-pl-rt': 'report-profit-loss', 'report-pl-year': 'report-profit-loss',
          'report-cust-billing': 'report-customer-account', 'report-cust-receive': 'report-customer-account', 'report-cust-credit': 'report-customer-account',
          'report-partner-pay': 'report-partner-account', 'report-partner-credit': 'report-partner-account',
          'report-other-price': 'report-others', 'report-other-adjust': 'report-others', 'report-other-fold': 'report-others', 'report-other-barcode': 'report-others',
        },
        reportMenu: [
          { key: 'report-stock', label: { th: 'คลังสินค้า', en: 'Inventory' }, children: [
              { key: 'report-stock', label: { th: 'รายงานสินค้าคงคลัง', en: 'Stock Inventory' } },
              { key: 'report-stock-shelf', label: { th: 'รายงานสินค้าคงคลังตามชั้น', en: 'Stock by Shelf' } },
              { key: 'report-stock-raw', label: { th: 'รายงานผ้าดิบคงคลัง', en: 'Raw Fabric Stock' } },
              { key: 'report-stock-receive', label: { th: 'รายงานการรับสินค้า', en: 'Goods Receiving' } },
              { key: 'report-stock-issue', label: { th: 'รายงานการเบิกสินค้า', en: 'Goods Issue' } },
              { key: 'report-stock-move', label: { th: 'รายงานการย้ายสินค้า', en: 'Stock Transfer' } },
              { key: 'report-stock-move-raw', label: { th: 'รายงานการย้ายผ้าดิบ', en: 'Raw Transfer' } },
              { key: 'report-stock-move-shelf', label: { th: 'รายงานการย้ายชั้นสินค้า', en: 'Shelf Transfer' } },
          ] },
          { key: 'report-vat-stock', label: { th: 'คลัง VAT', en: 'VAT Inventory' }, children: [
              { key: 'report-vat-stock', label: { th: 'รายงานสินค้า VAT คงคลัง', en: 'VAT Stock' } },
              { key: 'report-vat-receive', label: { th: 'รายงานรับสินค้า VAT', en: 'VAT Receiving' } },
              { key: 'report-vat-issue', label: { th: 'รายงานเบิกสินค้า VAT', en: 'VAT Issue' } },
          ] },
          { key: 'report-po', label: { th: 'รายงานใบสั่งซื้อ', en: 'Purchase Order Report' } },
          { key: 'report-dye-order', label: { th: 'รายงานใบสั่งย้อม', en: 'Dyeing Order Report' } },
          { key: 'report-sales-contract', label: { th: 'รายงานใบสัญญาขาย', en: 'Sales Contract Report' } },
          { key: 'report-order', label: { th: 'รายงานออร์เดอร์', en: 'Order Report' } },
          { key: 'report-sales', label: { th: 'การขาย', en: 'Sales' }, children: [
              { key: 'report-sales-ws', label: { th: 'รายงานการขายส่ง', en: 'Wholesale Sales' } },
              { key: 'report-sales-rt', label: { th: 'รายงานการขายปลีก', en: 'Retail Sales' } },
              { key: 'report-sales', label: { th: 'รายงานการขาย', en: 'Sales Summary' } },
              { key: 'report-sales-return', label: { th: 'รายงานรับคืนอินวอยส์', en: 'Invoice Return' } },
          ] },
          { key: 'report-tax-invoice', label: { th: 'รายงานใบกำกับภาษี', en: 'Tax Invoice Report' } },
          { key: 'report-profit-loss', label: { th: 'กำไร & ขาดทุน', en: 'Profit & Loss' }, children: [
              { key: 'report-pl-ws', label: { th: 'รายงานกำไร & ขาดทุนขายส่ง', en: 'P&L Wholesale' } },
              { key: 'report-pl-rt', label: { th: 'รายงานกำไร & ขาดทุนขายปลีก', en: 'P&L Retail' } },
              { key: 'report-pl-year', label: { th: 'รายงานกำไร & ขาดทุนรายปี', en: 'P&L Yearly' } },
          ] },
          { key: 'report-customer-account', label: { th: 'บัญชีลูกค้า', en: 'Customer Accounts' }, children: [
              { key: 'report-cust-billing', label: { th: 'รายงานวางบิลลูกค้า', en: 'Customer Billing' } },
              { key: 'report-cust-receive', label: { th: 'รายงานรับเงินลูกค้า', en: 'Customer Payment' } },
              { key: 'report-cust-credit', label: { th: 'รายงานใบลดหนี้ลูกค้า', en: 'Customer Credit Note' } },
          ] },
          { key: 'report-partner-account', label: { th: 'บัญชีคู่ค้า', en: 'Vendor Accounts' }, children: [
              { key: 'report-partner-pay', label: { th: 'รายงานจ่ายเงินคู่ค้า', en: 'Vendor Payment' } },
              { key: 'report-partner-credit', label: { th: 'รายงานใบลดหนี้คู่ค้า', en: 'Vendor Credit Note' } },
          ] },
          { key: 'report-annual-summary', label: { th: 'รายงานสรุปประจำปี', en: 'Annual Summary' } },
          { key: 'report-reorder-point', label: { th: 'รายงานจุดสั่งซื้อสินค้า', en: 'Reorder Point Report' } },
          { key: 'report-others', label: { th: 'อื่นๆ', en: 'Others' }, children: [
              { key: 'report-other-price', label: { th: 'รายงานการแก้ไขราคาขาย', en: 'Price Edit' } },
              { key: 'report-other-adjust', label: { th: 'รายงานการปรับสต็อกสินค้า', en: 'Stock Adjust' } },
              { key: 'report-other-fold', label: { th: 'รายงานการแบ่งพับสินค้า', en: 'Fold Split' } },
              { key: 'report-other-barcode', label: { th: 'รายงานประวัติบาร์โค้ด', en: 'Barcode History' } },
          ] },
        ],
        reportPages: {
          // ---- รายงานย่อยที่ ReportViewPage เรนเดอร์ (ดึง /api/reports/summary/:type) ----
          'report-sales-ws': { title: 'รายงานการขายส่ง', icon: '📈' },
          'report-sales-rt': { title: 'รายงานการขายปลีก', icon: '📈' },
          'report-sales-return': { title: 'รายงานรับคืนอินวอยส์', icon: '↩️' },
          'report-pl-ws': { title: 'รายงานกำไร & ขาดทุนขายส่ง', icon: '📊' },
          'report-pl-rt': { title: 'รายงานกำไร & ขาดทุนขายปลีก', icon: '📊' },
          'report-pl-year': { title: 'รายงานกำไร & ขาดทุนรายปี', icon: '📊' },
          'report-cust-billing': { title: 'รายงานวางบิลลูกค้า', icon: '🧾' },
          'report-cust-receive': { title: 'รายงานรับเงินลูกค้า', icon: '💳' },
          'report-cust-credit': { title: 'รายงานใบลดหนี้ลูกค้า', icon: '📄' },
          'report-partner-pay': { title: 'รายงานจ่ายเงินคู่ค้า', icon: '💸' },
          'report-partner-credit': { title: 'รายงานใบลดหนี้คู่ค้า', icon: '📄' },
          'report-other-price': { title: 'รายงานการแก้ไขราคาขาย', icon: '🏷️' },
          'report-other-adjust': { title: 'รายงานการปรับสต็อกสินค้า', icon: '📦' },
          'report-other-fold': { title: 'รายงานการแบ่งพับสินค้า', icon: '🧵' },
          'report-other-barcode': { title: 'รายงานประวัติบาร์โค้ด', icon: '🔖' },
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
        xlShowPanel: false,
        xlFile: null,
        xlFileInputKey: 0,
        xlImporting: false,
        xlImportMessage: '',
        xlRows: [],
        xlLoading: false,
        xlPage: 1,
        xlPageSize: 10,
        xlShowPanel: false,
        xlFile: null,
        xlImporting: false,
        xlImportMessage: '',
        xlRows: [],
        xlLoading: false,
        xlPage: 1,
        xlPageSize: 10,
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
          { key: 'stock-history', label: { th: 'ประวัติเคลื่อนไหว', en: 'Stock History' } },
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
              { key: 'fabric-irregular', label: { th: 'ผ้าไม่ประจำ', en: 'Irregular Fabric' }, children: [
              { key: 'fabric-irregular', label: { th: 'ผ้าไม่ประจำ', en: 'Irregular Fabric' } },
              { key: 'fabric-irregular-group', label: { th: 'กลุ่มผ้าไม่ประจำ', en: 'Irregular Fabric Group' } },
            ] },
              { key: 'fabric-irregular-group', label: { th: 'กลุ่มผ้าไม่ประจำ', en: 'Irregular Fabric Group' } },
            ] },
          { key: 'fabric-raw', label: { th: 'ผ้าดิบ', en: 'Raw Fabric' } },
          { key: 'customers', label: { th: 'ลูกค้า', en: 'Customers' } },
          { key: 'partners', label: { th: 'คู่ค้า', en: 'Vendors' } },
          { key: 'fabric-info', label: { th: 'ข้อมูลผ้า', en: 'Fabric Info' }, children: [
              { key: 'fabric-info-structure', label: { th: 'โครงสร้างผ้า', en: 'Structure' } },
              { key: 'fabric-info-composition', label: { th: 'ส่วนประกอบ', en: 'Composition' } },
              { key: 'fabric-info-width', label: { th: 'หน้ากว้าง', en: 'Width' } },
              { key: 'fabric-info-finishing', label: { th: 'Finishing', en: 'Finishing' } },
              { key: 'fabric-info-weight', label: { th: 'น้ำหนัก', en: 'Weight' } },
          ] },
          { key: 'employee-info', label: { th: 'ข้อมูลพนักงาน', en: 'Employee Info' } },
          { key: 'note-info', label: { th: 'ข้อมูลหมายเหตุ', en: 'Remarks' } },
          { key: 'zone-rack', label: { th: 'โซน & แร็ค', en: 'Zone & Rack' } },
        ],
        basicDataPages: {
          'fabric-info-structure': {
            title: 'โครงสร้างผ้า', icon: '🧵',
            columns: ['รหัส', 'โครงสร้างผ้า', 'สถานะ'],
            rows: [['ST-01', 'Twill', 'ใช้งาน'], ['ST-02', 'Plain', 'ใช้งาน'], ['ST-03', 'Satin', 'ใช้งาน'], ['ST-04', 'Dobby', 'ใช้งาน']],
          },
          'fabric-info-composition': {
            title: 'ส่วนประกอบ', icon: '🧬',
            columns: ['รหัส', 'ส่วนประกอบ', 'สถานะ'],
            rows: [['CP-01', 'Cotton 100%', 'ใช้งาน'], ['CP-02', 'Polyester 100%', 'ใช้งาน'], ['CP-03', 'TC (65/35)', 'ใช้งาน'], ['CP-04', 'CVC (60/40)', 'ใช้งาน']],
          },
          'fabric-info-width': {
            title: 'หน้ากว้าง', icon: '📏',
            columns: ['รหัส', 'หน้ากว้าง', 'สถานะ'],
            rows: [['W-01', '36"', 'ใช้งาน'], ['W-02', '44"', 'ใช้งาน'], ['W-03', '58"', 'ใช้งาน'], ['W-04', '60"', 'ใช้งาน'], ['W-05', '72"', 'ใช้งาน']],
          },
          'fabric-info-finishing': {
            title: 'Finishing', icon: '✨',
            columns: ['รหัส', 'Finishing', 'สถานะ'],
            rows: [['FN-01', 'Seersucker', 'ใช้งาน'], ['FN-02', 'SS Finish', 'ใช้งาน'], ['FN-03', 'Peach', 'ใช้งาน'], ['FN-04', 'Mercerized', 'ใช้งาน']],
          },
          'fabric-info-weight': {
            title: 'น้ำหนัก', icon: '⚖️',
            columns: ['รหัส', 'น้ำหนัก (GSM)', 'สถานะ'],
            rows: [['WT-01', 'บาง (< 150)', 'ใช้งาน'], ['WT-02', 'ปานกลาง (150-250)', 'ใช้งาน'], ['WT-03', 'หนา (> 250)', 'ใช้งาน']],
          },
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
        // ผ้าประจำ (fr*) ย้ายไปที่ stores/fabric.js แล้ว
        genPage: 1,
        genPageSize: 20,
        genSelected: [],
        genSortCol: -1,
        genSortDir: 'asc',
        frShowShadeModal: false,
        frShadeContext: 'fabric', // 'fabric' | 'irregular'
        frShadeFabric: null,
        frShadeRows: [],
        frShadeSearch: '',
        frShadeLoading: false,
        frShadeKeySeq: 1,
        frShadeGroups: [],
        frShadeGroupSel: '',
        // ผ้าไม่ประจำ (fi*) ย้ายไปที่ stores/fabric.js แล้ว
        // token / currentUser ย้ายไปที่ auth store (เป็น computed proxy ด้านล่าง)
        settingsEditOpen: false,
        settingsEditForm: { name: '', phone: '', avatar: '' },
        settingsEditSaving: false,
        settingsEditMsg: { type: '', text: '' },
        members: [],
        // Dashboard stats
        dashStats: null,   // สถิติจริงจาก /api/dashboard/stats
        totalRevenue: '3,468.96',
        monthlySales: 82,
        totalOrders: 12,
        totalSalesAmount: '52,567.53',
        newUsersThisMonth: 12,
        engagementRate: 78,
        averageSessionTime: '23.5',
        // แนวโน้มยอดขาย (Sales Trend) — ข้อมูลตัวอย่าง รอเชื่อมข้อมูลจริง
        dashTrendRange: 'currentYear', // 'currentYear' | '1y' | '6m' | '3m'
        dashTrendViewMode: 'month', // 'month' | 'year'
        dashTrendYear: 2026,
        dashTrendDemoYears: {}, // { [ปี]: true } = ปีนั้นยังใช้ข้อมูลตัวอย่าง (จริงไม่ถึง 3 เดือน)
        dashHasRealTrend: false, // มีข้อมูลจริงพอ (≥3 เดือน) อย่างน้อย 1 ปีไหม
        // ข้อมูลตัวอย่าง 2 คลื่นซ้อน (โหมด demo) — ให้กราฟลงสีเต็มโทนเป็นลูกคลื่นแบบภาพตัวอย่าง
        dashDemoWaveA: [60, 82, 58, 88, 55, 80, 62, 90, 60, 85, 70, 96],
        dashDemoWaveB: [46, 62, 84, 54, 86, 60, 92, 56, 84, 66, 90, 74],
        // ข้อมูลตัวอย่างรายวัน 7 วันล่าสุด (โหมดเดือน = รายวัน)
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
        dashTrendHoverIdx2: null,
        topnavProfileOpen: false,
        topnavNotifOpen: false,
        topnavNotifCount: 2,
        lowStockRolls: [],
        // ลายเซ็นการแจ้งเตือนที่ "เปิดอ่านแล้ว" — ถ้าตรงกับของปัจจุบัน = ไม่มีอะไรใหม่ (ซ่อนตัวเลข)
        notifSeenKey: localStorage.getItem('notifSeenKey') || '',
        lowStockThreshold: 50,
        // ปริมาณการขาย (Sales Volume) — ข้อมูลตัวอย่าง รอเชื่อมข้อมูลจริง
        dashVolumeData: [
          { label: 'ผ้าประจำ', value: 58 },
          { label: 'ผ้าไม่ประจำ', value: 24 },
          { label: 'ผ้าดิบ', value: 18 },
        ],
        dashVolumeHoverIdx: null,
        // แนวโน้มยอดขาย (Sales Trend) — ข้อมูลตัวอย่าง รอเชื่อมข้อมูลจริง
        dashTrendViewMode: 'month', // 'month' | 'year'
        dashTrendYear: 2026,
        dashTrendDemoYears: {}, // { [ปี]: true } = ปีนั้นยังใช้ข้อมูลตัวอย่าง (จริงไม่ถึง 3 เดือน)
        dashHasRealTrend: false, // มีข้อมูลจริงพอ (≥3 เดือน) อย่างน้อย 1 ปีไหม
        // ข้อมูลตัวอย่าง 2 คลื่นซ้อน (โหมด demo) — ให้กราฟลงสีเต็มโทนเป็นลูกคลื่นแบบภาพตัวอย่าง
        dashDemoWaveA: [60, 82, 58, 88, 55, 80, 62, 90, 60, 85, 70, 96],
        dashDemoWaveB: [46, 62, 84, 54, 86, 60, 92, 56, 84, 66, 90, 74],
        // ข้อมูลตัวอย่างรายวัน 7 วันล่าสุด (โหมดเดือน = รายวัน)
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
            // ---- ป้าย/ปุ่ม/หัวตารางที่ใช้ร่วมกันหลายหน้า (fr*/po*/rp* ฯลฯ) ----
            typeLabel: 'ประเภท',
            weightLabel: 'น้ำหนัก',
            allWord: 'ทั้งหมด',
            skuLabel: 'รหัสสินค้า',
            fromWord: 'เริ่มต้น',
            toWord: 'สิ้นสุด',
            compositionLabel: 'ส่วนประกอบ',
            widthLabel: 'หน้ากว้าง',
            structureLabel: 'โครงสร้างผ้า',
            substituteLabel: 'สินค้าทดแทน',
            unitLabel: 'หน่วย',
            imageLabel: 'รูป',
            manageWord: 'จัดการ',
            manageShades: 'จัดการเฉดสี',
            viewImage: 'ดูรูปสินค้า',
            loadingWord: 'กำลังโหลดข้อมูล...',
            noResultsFound: 'ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา',
            perPageWord: '/ หน้า',
            prevPage: '‹ ก่อนหน้า',
            nextPage: 'ถัดไป ›',
            pageWord: 'หน้า',
            showingWord: 'แสดง',
            ofTotalWord: 'จากทั้งหมด',
            fabricDataSection: 'ข้อมูลผ้า',
            moreDetailsSection: 'รายละเอียดเพิ่มเติม',
            descriptionLabel: 'คำอธิบาย',
            moreDescPlaceholder: 'คำอธิบายเพิ่มเติม',
            productionDaysLabel: 'จำนวนวันที่ใช้ผลิต',
            noWord: 'ไม่มี',
            yesWord: 'มี',
            noFileSelected: 'ยังไม่ได้เลือกไฟล์',
            attachImageTitle: 'แนบไฟล์รูปภาพ',
            cancelWord: 'ยกเลิก',
            selectTypeOpt: 'เลือกประเภท',
            selectCompositionOpt: 'เลือกส่วนประกอบ',
            selectWidthOpt: 'เลือกหน้ากว้าง',
            selectStructureOpt: 'เลือกโครงสร้างผ้า',
            selectWeightOpt: 'เลือกน้ำหนัก',
            fabricNamePlaceholder: 'ชื่อผ้า',
            searchFabricPlaceholder: 'ค้นหาชื่อผ้า / รหัสสินค้า',
            clickToSort: 'คลิกเพื่อเรียงลำดับ',
            selectedCountWord: 'เลือกไว้',
            deleteSelected: 'ลบรายการที่เลือก',
            printBarcode: '🏷️ พิมพ์บาร์โค้ด',
            clearSelection: '✕ ยกเลิกการเลือก',
            fabricGroupLabel: 'กลุ่มผ้า',
            noGroupOpt: '— ไม่ระบุกลุ่ม —',
            // ---- ลูกค้า/คู่ค้า (customers/partners) ----
            customerGroupLabel: 'กลุ่มลูกค้า',
            provinceLabel: 'จังหวัด',
            zoneLabel: 'โซน',
            accountTermsLabel: 'เงื่อนไขบัญชี',
            cashTermsLabel: 'เงื่อนไขเงินสด',
            salespersonLabel: 'พนักงานขาย',
            companyNameLabel: 'ชื่อบริษัท',
            contactLabel: 'ผู้ติดต่อ',
            phoneLabel: 'เบอร์โทร',
            addressLabel: 'ที่อยู่',
            currencyLabel: 'สกุลเงิน',
            creditLimitLabel: 'วงเงิน',
            customerCodeLabel: 'รหัสลูกค้า',
            taxIdLabel: 'เลขผู้เสียภาษี',
            customerInfoSection: 'ข้อมูลลูกค้า',
            tradeFinanceSection: 'เงื่อนไขการค้า / การเงิน',
            detailsWord: 'รายละเอียด',
            customerWord: 'ลูกค้า',
            codeOptionalPlaceholder: 'รหัส (เว้นว่างได้)',
            companyNamePlaceholder: 'ชื่อบริษัท / ร้าน',
            contactNamePlaceholder: 'ชื่อผู้ติดต่อ',
            phoneNumberPlaceholder: 'เบอร์โทรศัพท์',
            taxIdPlaceholder: 'เลขประจำตัวผู้เสียภาษี',
            searchCustomerPlaceholder: 'ค้นหาชื่อบริษัท / ผู้ติดต่อ / เบอร์โทร / ที่อยู่',
            // ---- คู่ค้า (partners) เฉพาะ ----
            partnerWord: 'คู่ค้า',
            partnerGroupLabel: 'กลุ่มคู่ค้า',
            checkNameLabel: 'ชื่อที่ออกเช็ค',
            coordinatorLabel: 'ผู้ประสานงาน',
            countryLabel: 'ประเทศ',
            companyInfoSection: 'ข้อมูลบริษัท',
            contactInfoSection: 'ข้อมูลติดต่อ',
            addPartnerTitle: 'เพิ่มคู่ค้าใหม่',
            editPartnerTitle: 'แก้ไขข้อมูลคู่ค้า',
            selectGroupOpt: '— เลือกกลุ่ม —',
            selectTermOpt: '— เลือกเงื่อนไข —',
            selectCountryOpt: '— เลือกประเทศ —',
            commonCountriesLabel: 'พบบ่อย',
            allCountriesLabel: 'ทั้งหมด (A–Z)',
            checkNamePlaceholder: 'ชื่อสำหรับออกเช็ค',
            addressCompanyPlaceholder: 'ที่อยู่บริษัท / คู่ค้า',
            searchPartnerPlaceholder: 'ค้นหาชื่อบริษัท / ผู้ประสานงาน',
            noPartnersFound: 'ไม่พบข้อมูลคู่ค้า',
            // ---- กลุ่มผ้า (fabric group) เฉพาะ ----
            fabricGroupRegularTitle: 'กลุ่มผ้าประจำ',
            fabricGroupIrregularTitle: 'กลุ่มผ้าไม่ประจำ',
            searchGroupPlaceholder: 'ค้นหาชื่อกลุ่มผ้า',
            retailPriceLabel: 'ราคาขายปลีก',
            shadeCountLabel: 'จำนวนเฉดสี',
            fabricGroupInfoSection: 'ข้อมูลกลุ่มผ้า',
            fabricGroupNamePlaceholder: 'ชื่อกลุ่มผ้า',
            selectGenericOpt: '— เลือก —',
            // ---- พนักงาน (employee) เฉพาะ ----
            employeeDataTitle: 'ข้อมูลพนักงาน',
            employeeNoteText: '* พนักงานสมัครผ่านหน้าเว็บไซต์ แล้วกำหนดตำแหน่งที่หน้า "บัญชีผู้ใช้งาน"',
            notAssignedWord: 'ยังไม่กำหนด',
            searchNameEmailPhonePlaceholder: 'ค้นหาชื่อ / อีเมล / เบอร์',
            roleLabel: 'ตำแหน่ง / บทบาท',
            genderLabel: 'เพศ',
            maleWord: 'ชาย',
            femaleWord: 'หญิง',
            peopleUnit: 'คน',
            fullNameLabel: 'ชื่อ - นามสกุล',
            mobilePhoneLabel: 'เบอร์มือถือ',
            ageLabel: 'อายุ',
            noEmployeesFound: 'ไม่พบข้อมูลพนักงาน',
            // ---- หมายเหตุ (note info) เฉพาะ ----
            noteDataTitle: 'ข้อมูลหมายเหตุ',
            searchNotePlaceholder: 'ค้นหาหมายเหตุ',
            noteLabel: 'หมายเหตุ',
            notePlaceholder: 'ข้อความหมายเหตุ',
            noNotesFound: 'ไม่พบข้อมูลหมายเหตุ',
            // ---- master data (โครงสร้าง/ส่วนประกอบ/หน้ากว้าง/finishing/น้ำหนัก) ----
            minYardsLabel: 'หลาส่งขั้นต่ำ',
            searchNamePlaceholder: 'ค้นหาชื่อ',
            genericDataWord: 'ข้อมูล',
            // ---- ผ้าดิบ (fabric raw) เฉพาะ ----
            rawFabricWord: 'ผ้าดิบ',
            noImageWord: 'ไม่มีรูป',
            editRawFabricTitle: 'แก้ไขผ้าดิบ',
            addRawFabricTitle: 'เพิ่มผ้าดิบใหม่',
            rawFabricInfoSection: 'ข้อมูลผ้าดิบ',
            allowanceSection: 'ค่าเผื่อ / สถานะ',
            rawFabricNamePlaceholder: 'ชื่อผ้าดิบ',
            egWord: 'เช่น',
            searchNameSkuPlaceholder: 'ค้นหาชื่อ / รหัสสินค้า',
            noRawFabricFound: 'ไม่พบข้อมูลผ้าดิบ',
            // ---- PO (ใบสั่งซื้อ) เฉพาะ — reuse ได้ทั้งผ้าสำเร็จ/ผ้าดิบ/สั่งย้อม ----
            openPoTitle: 'เปิดใบสั่งซื้อ',
            dateLabel: 'วันที่',
            poNoLabel: 'เลขที่สั่งซื้อ',
            vendorPlaceholder: 'เลือก/พิมพ์คู่ค้า',
            cashOptionWord: 'เงินสด',
            credit30Word: 'เครดิต 30 วัน',
            credit60Word: 'เครดิต 60 วัน',
            shipToLabel: 'สถานที่จัดส่ง',
            remarkLabel: 'หมายเหตุ',
            refNoLabel: 'เลขที่อ้างอิง',
            shipDateLabel: 'วันที่จัดส่ง',
            approveWord: 'อนุมัติ',
            qtyLabel: 'จำนวน',
            pricePerUnitLabel: 'ราคา/หน่วย',
            priceLabel: 'ราคา',
            forFabricSkuLabel: 'สำหรับผ้ารหัส',
            fabricCodePlaceholder: 'ผ้ารหัส',
            colorCodeLabel: 'รหัสสี',
            addRowTitle: 'เพิ่มแถว',
            removeRowTitle: 'ลบแถว',
            selectColorOpt: '— เลือกสี —',
            totalWord: 'รวม',
            discountLabel: 'ส่วนลด',
            bahtWord: 'บาท',
            netTotalLabel: 'ยอดสุทธิ',
            reportBtnWord: 'รายงาน',
            savedMsgText: 'ระบบได้ทำการเพิ่มข้อมูลเรียบร้อยแล้ว',
            skuPlaceholderShort: 'รหัส',
            finishedFabricWord: 'ผ้าสำเร็จ',
            refShortLabel: 'อ้างอิง',
            purchaseOrderPdfBtn: 'ใบสั่งซื้อ',
            // ---- PO สั่งย้อม (dye order) เฉพาะ ----
            dyeOrderWord: 'สั่งย้อม',
            transferNoLabel: 'เลขที่ย้ายสินค้า',
            factoryLabel: 'โรงงาน',
            pickRawFabricBtn: 'เลือกผ้าดิบ',
            rawFabricCodeLabel: 'รหัสผ้าดิบ',
            sourceLabel: 'ต้นทาง',
            lotNoLabel: 'เลขที่ล็อต',
            stockQtyLabel: 'จำนวนสต็อก',
            neededQtyLabel: 'จำนวนที่ต้องการ',
            productDyeResultSection: 'ข้อมูลสินค้า / ผลย้อม',
            shadeLabel: 'เฉดสี',
            selectWord: 'เลือก',
            urgentWord: 'ด่วน',
            sampleFirstWord: 'ตัวอย่างก่อน',
            perCustomerSpecWord: 'ตามสเปกลูกค้า',
            // ---- รับสินค้า (goods receive) เฉพาะ — reuse ได้ทั้งผ้าสำเร็จ/ดิบ/ย้อม ----
            receiveRawFabricTitle: 'รับผ้าดิบ',
            receiptNoLabel: 'เลขที่รับสินค้า',
            receiptTypeLabel: 'ประเภทการรับ',
            factoryPlaceholder: 'เลือก/พิมพ์โรงงาน',
            poRefLabel: 'เลขที่อ้างอิง PO',
            poRefPlaceholder: 'เลือก/พิมพ์เลขที่ PO',
            billNoLabel: 'เลขที่บิล',
            copyRowTitle: 'คัดลอกแถว',
            receiveNewBtn: 'รับใหม่',
            receiptPdfBtn: 'ใบรับสินค้า',
            receiveFinishedFabricTitle: 'รับผ้าสำเร็จ',
            warehouseLabel: 'คลัง',
            foldLabel: 'พับ',
            foldDetailTitle: 'รายละเอียดพับ',
            foldHint: 'ระบุจำนวนหลาต่อพับ และจำนวนพับ — ระบบจะรวมเป็นจำนวนหลาทั้งหมดให้อัตโนมัติ',
            perFoldLabel: 'จำนวน/พับ (หลา)',
            foldCountLabel: 'จำนวนพับ',
            sumYardsLabel: 'รวม (หลา)',
            removeFoldTitle: 'ลบพับนี้',
            addFoldBtn: 'เพิ่มพับ',
            totalFoldCountLabel: 'จำนวนพับรวม',
            totalYardsLabel: 'จำนวนหลารวม',
            barcodeBtnWord: 'บาร์โค้ด',
            receiveDyedFabricTitle: 'รับผ้าย้อม',
            orderNoLabel: 'เลขที่ออร์เดอร์',
            selectDyeOrderOpt: '— เลือกใบสั่งย้อม —',
            // ---- ย้ายสินค้า (goods/raw/rack transfer) เฉพาะ ----
            moveGoodsTitle: 'ย้ายสินค้า',
            fromWarehouseLabel: 'จากคลัง',
            toWarehouseLabel: 'ไปยังคลัง',
            pickPieceBtn: 'เลือกผืน',
            noTransferItemsMsg: 'ยังไม่มีรายการ — กด "เลือกผืน" เพื่อเพิ่มสินค้าที่จะย้าย',
            transferPdfBtn: 'ใบย้ายสินค้า',
            transferNewBtn: 'ย้ายใหม่',
            noProductsFound: 'ไม่พบสินค้า',
            moveRawFabricTitle: 'ย้ายผ้าดิบ',
            noRawTransferItemsMsg: 'ยังไม่มีรายการ — กด "เลือกผ้าดิบ" เพื่อเพิ่มผ้าที่จะย้าย',
            transferRawPdfBtn: 'ใบย้ายผ้าดิบ',
            // ---- ย้ายชั้นสินค้า (rack transfer / putaway) เฉพาะ ----
            moveRackTitle: 'ย้ายชั้นสินค้า — เก็บเข้าแร็ค',
            destRackLabel: 'แร็คปลายทาง',
            scanRackPlaceholder: 'สแกน / พิมพ์รหัสแร็ค (เช่น ZONE-A-RACK-01)',
            barcodeScanLabel: 'บาร์โค้ด (สแกนม้วนผ้า)',
            scanBarcodeEnterPlaceholder: 'สแกน QR ม้วนผ้า แล้วกด Enter',
            remarkOptionalPlaceholder: 'หมายเหตุ (ถ้ามี)',
            fromLocLabel: 'จากช่อง',
            notStoredYetWord: 'ยังไม่เคยเก็บ',
            removeWord: 'เอาออก',
            noRollsScannedMsg: 'ยังไม่มีม้วนผ้า — เลือกแร็คปลายทาง แล้วสแกน QR ม้วนผ้า',
            rollUnit: 'ม้วน',
            yardsUnit: 'หลา',
            putawaySaveBtn: 'บันทึกเก็บเข้าแร็ค',
            zoneWord: 'โซน',
            rackWord: 'แร็ค',
            rackNotFoundStatus: 'ไม่พบแร็คนี้ในระบบ — สร้างที่หน้าโซน & แร็คก่อน',
            rackCheckFailStatus: 'ตรวจสอบแร็คไม่สำเร็จ',
            // ---- รับผ้าสำเร็จเข้าคลัง (GoodsReceivePage QR ระบบเดิม) เฉพาะ ----
            receiveFinishedToWarehouseTitle: 'รับผ้าสำเร็จเข้าคลัง',
            receiveHintText: 'สร้างเอกสารรับผ้า → ระบบจะออกม้วนผ้าแยกรายไม้ พร้อม QR Code สำหรับติดสติ๊กเกอร์',
            clearFormBtn: 'ล้างฟอร์ม',
            savingWord: 'กำลังบันทึก...',
            saveReceiveBtn: 'บันทึกรับเข้า',
            documentInfoSection: 'ข้อมูลเอกสาร',
            receiveDateLabel: 'วันที่รับ',
            poNoShortLabel: 'เลขที่ PO',
            poNoPlaceholder: 'เลขที่ใบสั่งซื้อ',
            selectWarehouseLabel: 'เลือกคลัง',
            warehouseExamplePlaceholder: 'เช่น คลังหลัก',
            partnerSenderLabel: 'คู่ค้า / ผู้ส่ง',
            partnerNamePlaceholder: 'ชื่อคู่ค้า / ซัพพลายเออร์',
            billLotPlaceholder: 'เลขที่บิล / ใบส่งของ',
            additionalRemarkPlaceholder: 'หมายเหตุเพิ่มเติม',
            receivedItemsSection: 'รายการผ้าที่รับ',
            addItemBtn: 'เพิ่มรายการ',
            masterFabricLabel: 'ผ้า (Master)',
            selectFabricOpt: '— เลือกผ้า —',
            notSpecifiedOpt: '— ไม่ระบุ —',
            rollCountLabel: 'จำนวนม้วน',
            yardsPerRollLabel: 'หลา/ม้วน',
            totalYardsShortLabel: 'รวมหลา',
            storageLocLabel: 'ช่องจัดเก็บ',
            noItemsAddPrompt: 'ยังไม่มีรายการ — กด "เพิ่มรายการ"',
            rollsIssuedPrefix: 'ออกม้วนผ้าแล้ว',
            rollsIssuedUnit: 'ไม้',
            documentWord: 'เอกสาร',
            printStickerHint: 'พิมพ์สติ๊กเกอร์ QR ติดที่ไม้ผ้าแต่ละม้วน',
            printQrStickerBtn: 'พิมพ์สติ๊กเกอร์ QR',
            validationOneItemMsg: '⚠️ กรุณากรอกอย่างน้อย 1 รายการ (เลือกผ้า, จำนวนม้วน, หลาต่อม้วน)',
            // ---- โซน & แร็ค (zone & rack / warehouse map) เฉพาะ ----
            zoneRackTitle: 'โซน & แร็ค (ผังคลังผ้า)',
            zoneRackHint: 'ผังช่องจัดเก็บ — 1 ช่องเก็บได้หลายม้วน/หลายสี · สแกนจัดเก็บและตัดหลาได้',
            scanPutawayBtn: 'สแกนจัดเก็บ',
            scanCutBtn: 'สแกนตัดหลา',
            addLocationQrBtn: 'เพิ่ม QR Code ช่องสินค้า',
            searchLocationPlaceholder: 'ค้นหารหัสผ้า / สี — ไฮไลต์ช่องที่มีผ้านั้น',
            allLocationsLabel: 'ช่องทั้งหมด',
            rollsInStockLabel: 'ม้วนในคลัง',
            unassignedLabel: 'ยังไม่จัดเก็บ',
            loadingMapMsg: 'กำลังโหลดผังคลัง...',
            printLocQrTitle: 'พิมพ์ QR ช่อง',
            editLocTitle: 'แก้ไขช่อง',
            deleteLocTitle: 'ลบช่อง',
            emptyWord: 'ว่าง',
            lowStockBadge: 'ใกล้หมด',
            editLocationTitleModal: 'แก้ไขช่องสินค้า',
            addLocationTitleModal: 'เพิ่มช่องสินค้า (QR Location)',
            binLabel: 'บิน',
            locationCodeLabel: 'รหัสช่อง',
            locationCodePlaceholder: 'เช่น ZONE-A-RACK-01',
            printThisQrBtn: 'พิมพ์ QR ช่องนี้',
            saveLocationBtn: 'บันทึกช่อง',
            putawayModalTitle: '📦 สแกนจัดเก็บ (Putaway)',
            cutModalTitle: '✂️ สแกนตัดหลา (Deduction)',
            scanLocStep1Label: '1) สแกน QR ช่องสินค้า',
            scanLocPlaceholder: 'สแกน/พิมพ์ QR ช่อง แล้ว Enter',
            locWord: 'ช่อง',
            scanRollStep2Label: '2) สแกน QR ไม้ผ้า',
            scanRollStep1Label: '1) สแกน QR ไม้ผ้า',
            scanRollPlaceholder: 'สแกน/พิมพ์ QR ไม้ผ้า แล้ว Enter',
            currentRemainingLabel: 'คงเหลือปัจจุบัน',
            yardsCutStep2Label: '2) จำนวนหลาที่ตัดออก',
            putawayBtn: 'จัดเก็บ',
            cutBtn: 'ตัดหลา',
            printWord: 'พิมพ์',
            saveFailedWord: 'บันทึกไม่สำเร็จ',
            requiredLocationCodeMsg: '⚠️ กรุณากรอกรหัสช่อง',
            requiredBothQrMsg: '⚠️ ต้องสแกนทั้ง QR ช่อง และ QR ไม้ผ้า',
            requiredCutYardsMsg: '⚠️ กรอกจำนวนหลาที่ตัด (> 0)',
            exportSelectedBtn: 'ส่งออกที่เลือก',
            // ---- กลุ่มสินค้า VAT เฉพาะ ----
            vatProductGroupTitle: 'กลุ่มสินค้า VAT — ตามช่วงราคาขาย',
            vatProductGroupHint: 'กำหนดกลุ่มสินค้า VAT ตามช่วงราคาขาย (บาท) — ระบบจะจัดสินค้าเข้ากลุ่มอัตโนมัติตามราคา',
            priceFromLabel: 'ราคาขาย (ตั้งแต่)',
            toShortWord: 'ถึง',
            vatProductGroupLabel: 'กลุ่มสินค้า VAT',
            groupNamePlaceholder: 'ชื่อกลุ่ม เช่น A / B / ผ้า',
            noGroupsYetMsg: 'ยังไม่มีกลุ่ม — กด "เพิ่มกลุ่ม" เพื่อเริ่มกำหนด',
            addGroupBtn: 'เพิ่มกลุ่ม',
            savedSuccessMsg: 'บันทึกเรียบร้อยแล้ว',
            // ---- รับสินค้า VAT เฉพาะ ----
            vatReceiveTitle: 'รับสินค้า VAT',
            priceReceivedLabel: 'ราคารับ',
            meterWord: 'เมตร',
            kgWord: 'กก.',
            pieceWord: 'ชิ้น',
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
            typeLabel: 'Type',
            weightLabel: 'Weight',
            allWord: 'All',
            skuLabel: 'Product Code',
            fromWord: 'From',
            toWord: 'To',
            compositionLabel: 'Composition',
            widthLabel: 'Width',
            structureLabel: 'Fabric Structure',
            substituteLabel: 'Substitute Item',
            unitLabel: 'Unit',
            imageLabel: 'Image',
            manageWord: 'Actions',
            manageShades: 'Manage Shades',
            viewImage: 'View Image',
            loadingWord: 'Loading...',
            noResultsFound: 'No matching results found',
            perPageWord: '/ page',
            prevPage: '‹ Previous',
            nextPage: 'Next ›',
            pageWord: 'Page',
            showingWord: 'Showing',
            ofTotalWord: 'of',
            fabricDataSection: 'Fabric Information',
            moreDetailsSection: 'Additional Details',
            descriptionLabel: 'Description',
            moreDescPlaceholder: 'Additional description',
            productionDaysLabel: 'Production Days',
            noWord: 'None',
            yesWord: 'Yes',
            noFileSelected: 'No file selected',
            attachImageTitle: 'Attach Image',
            cancelWord: 'Cancel',
            selectTypeOpt: 'Select Type',
            selectCompositionOpt: 'Select Composition',
            selectWidthOpt: 'Select Width',
            selectStructureOpt: 'Select Structure',
            selectWeightOpt: 'Select Weight',
            fabricNamePlaceholder: 'Fabric name',
            searchFabricPlaceholder: 'Search fabric name / product code',
            clickToSort: 'Click to sort',
            selectedCountWord: 'Selected',
            deleteSelected: 'Delete Selected',
            printBarcode: '🏷️ Print Barcode',
            clearSelection: '✕ Clear Selection',
            fabricGroupLabel: 'Fabric Group',
            noGroupOpt: '— No Group —',
            customerGroupLabel: 'Customer Group',
            provinceLabel: 'Province',
            zoneLabel: 'Zone',
            accountTermsLabel: 'Account Terms',
            cashTermsLabel: 'Cash Terms',
            salespersonLabel: 'Salesperson',
            companyNameLabel: 'Company Name',
            contactLabel: 'Contact',
            phoneLabel: 'Phone',
            addressLabel: 'Address',
            currencyLabel: 'Currency',
            creditLimitLabel: 'Credit Limit',
            customerCodeLabel: 'Customer Code',
            taxIdLabel: 'Tax ID',
            customerInfoSection: 'Customer Information',
            tradeFinanceSection: 'Trade / Financial Terms',
            detailsWord: 'Details',
            customerWord: 'Customer',
            codeOptionalPlaceholder: 'Code (optional)',
            companyNamePlaceholder: 'Company / Shop name',
            contactNamePlaceholder: 'Contact name',
            phoneNumberPlaceholder: 'Phone number',
            taxIdPlaceholder: 'Tax ID number',
            searchCustomerPlaceholder: 'Search company name / contact / phone / address',
            partnerWord: 'Vendor',
            partnerGroupLabel: 'Vendor Group',
            checkNameLabel: 'Check Name',
            coordinatorLabel: 'Coordinator',
            countryLabel: 'Country',
            companyInfoSection: 'Company Information',
            contactInfoSection: 'Contact Information',
            addPartnerTitle: 'Add New Vendor',
            editPartnerTitle: 'Edit Vendor Information',
            selectGroupOpt: '— Select Group —',
            selectTermOpt: '— Select Terms —',
            selectCountryOpt: '— Select Country —',
            commonCountriesLabel: 'Common',
            allCountriesLabel: 'All (A–Z)',
            checkNamePlaceholder: 'Name for check issuance',
            addressCompanyPlaceholder: 'Company / Vendor address',
            searchPartnerPlaceholder: 'Search company name / coordinator',
            noPartnersFound: 'No vendor data found',
            fabricGroupRegularTitle: 'Regular Fabric Group',
            fabricGroupIrregularTitle: 'Non-Regular Fabric Group',
            searchGroupPlaceholder: 'Search fabric group name',
            retailPriceLabel: 'Retail Price',
            shadeCountLabel: 'Shade Count',
            fabricGroupInfoSection: 'Fabric Group Information',
            fabricGroupNamePlaceholder: 'Fabric group name',
            selectGenericOpt: '— Select —',
            employeeDataTitle: 'Employee Information',
            employeeNoteText: '* Employees register via the website, then get their role assigned on the "User Accounts" page',
            notAssignedWord: 'Not Assigned',
            searchNameEmailPhonePlaceholder: 'Search name / email / phone',
            roleLabel: 'Position / Role',
            genderLabel: 'Gender',
            maleWord: 'Male',
            femaleWord: 'Female',
            peopleUnit: 'people',
            fullNameLabel: 'Full Name',
            mobilePhoneLabel: 'Mobile Phone',
            ageLabel: 'Age',
            noEmployeesFound: 'No employee data found',
            noteDataTitle: 'Note Information',
            searchNotePlaceholder: 'Search notes',
            noteLabel: 'Note',
            notePlaceholder: 'Note text',
            noNotesFound: 'No note data found',
            minYardsLabel: 'Min. Shipping Yards',
            searchNamePlaceholder: 'Search name',
            genericDataWord: 'Data',
            rawFabricWord: 'Raw Fabric',
            noImageWord: 'No Image',
            editRawFabricTitle: 'Edit Raw Fabric',
            addRawFabricTitle: 'Add New Raw Fabric',
            rawFabricInfoSection: 'Raw Fabric Information',
            allowanceSection: 'Allowance / Status',
            rawFabricNamePlaceholder: 'Raw fabric name',
            egWord: 'e.g.',
            searchNameSkuPlaceholder: 'Search name / product code',
            noRawFabricFound: 'No raw fabric data found',
            openPoTitle: 'Create Purchase Order',
            dateLabel: 'Date',
            poNoLabel: 'PO Number',
            vendorPlaceholder: 'Select/type vendor',
            cashOptionWord: 'Cash',
            credit30Word: 'Credit 30 Days',
            credit60Word: 'Credit 60 Days',
            shipToLabel: 'Ship To',
            remarkLabel: 'Remark',
            refNoLabel: 'Reference No.',
            shipDateLabel: 'Ship Date',
            approveWord: 'Approve',
            qtyLabel: 'Quantity',
            pricePerUnitLabel: 'Price/Unit',
            priceLabel: 'Price',
            forFabricSkuLabel: 'For Fabric SKU',
            fabricCodePlaceholder: 'Fabric code',
            colorCodeLabel: 'Color Code',
            addRowTitle: 'Add Row',
            removeRowTitle: 'Remove Row',
            selectColorOpt: '— Select Color —',
            totalWord: 'Subtotal',
            discountLabel: 'Discount',
            bahtWord: 'Baht',
            netTotalLabel: 'Net Total',
            reportBtnWord: 'Report',
            savedMsgText: 'The record has been added successfully',
            skuPlaceholderShort: 'Code',
            finishedFabricWord: 'Finished Fabric',
            refShortLabel: 'Ref.',
            purchaseOrderPdfBtn: 'Purchase Order',
            dyeOrderWord: 'Dye Order',
            transferNoLabel: 'Transfer No.',
            factoryLabel: 'Factory',
            pickRawFabricBtn: 'Select Raw Fabric',
            rawFabricCodeLabel: 'Raw Fabric Code',
            sourceLabel: 'Source',
            lotNoLabel: 'Lot No.',
            stockQtyLabel: 'Stock Qty',
            neededQtyLabel: 'Needed Qty',
            productDyeResultSection: 'Product / Dye Result Information',
            shadeLabel: 'Shade',
            selectWord: 'Select',
            urgentWord: 'Urgent',
            sampleFirstWord: 'Sample First',
            perCustomerSpecWord: 'Per Customer Spec',
            receiveRawFabricTitle: 'Receive Raw Fabric',
            receiptNoLabel: 'Receipt No.',
            receiptTypeLabel: 'Receipt Type',
            factoryPlaceholder: 'Select/type factory',
            poRefLabel: 'PO Reference No.',
            poRefPlaceholder: 'Select/type PO number',
            billNoLabel: 'Bill No.',
            copyRowTitle: 'Copy Row',
            receiveNewBtn: 'New Receipt',
            receiptPdfBtn: 'Goods Receipt',
            receiveFinishedFabricTitle: 'Receive Finished Fabric',
            warehouseLabel: 'Warehouse',
            foldLabel: 'Fold',
            foldDetailTitle: 'Fold Details',
            foldHint: 'Enter yards per fold and fold count — total yards will be calculated automatically',
            perFoldLabel: 'Qty/Fold (yards)',
            foldCountLabel: 'Fold Count',
            sumYardsLabel: 'Total (yards)',
            removeFoldTitle: 'Remove this fold',
            addFoldBtn: 'Add Fold',
            totalFoldCountLabel: 'Total Fold Count',
            totalYardsLabel: 'Total Yards',
            barcodeBtnWord: 'Barcode',
            receiveDyedFabricTitle: 'Receive Dyed Fabric',
            orderNoLabel: 'Order No.',
            selectDyeOrderOpt: '— Select Dye Order —',
            moveGoodsTitle: 'Transfer Goods',
            fromWarehouseLabel: 'From Warehouse',
            toWarehouseLabel: 'To Warehouse',
            pickPieceBtn: 'Select Pieces',
            noTransferItemsMsg: 'No items yet — click "Select Pieces" to add products to transfer',
            transferPdfBtn: 'Transfer Slip',
            transferNewBtn: 'New Transfer',
            noProductsFound: 'No products found',
            moveRawFabricTitle: 'Transfer Raw Fabric',
            noRawTransferItemsMsg: 'No items yet — click "Select Raw Fabric" to add fabric to transfer',
            transferRawPdfBtn: 'Raw Fabric Transfer Slip',
            moveRackTitle: 'Rack Transfer — Putaway',
            destRackLabel: 'Destination Rack',
            scanRackPlaceholder: 'Scan / type rack code (e.g. ZONE-A-RACK-01)',
            barcodeScanLabel: 'Barcode (Scan Roll)',
            scanBarcodeEnterPlaceholder: 'Scan roll QR then press Enter',
            remarkOptionalPlaceholder: 'Remark (optional)',
            fromLocLabel: 'From Location',
            notStoredYetWord: 'Not stored yet',
            removeWord: 'Remove',
            noRollsScannedMsg: 'No rolls yet — select destination rack then scan roll QR',
            rollUnit: 'rolls',
            yardsUnit: 'yards',
            putawaySaveBtn: 'Save Putaway',
            zoneWord: 'Zone',
            rackWord: 'Rack',
            rackNotFoundStatus: 'Rack not found in system — create it on the Zone & Rack page first',
            rackCheckFailStatus: 'Failed to verify rack',
            receiveFinishedToWarehouseTitle: 'Receive Finished Fabric to Warehouse',
            receiveHintText: 'Create a receipt document → the system will issue individual rolls with QR codes for stickers',
            clearFormBtn: 'Clear Form',
            savingWord: 'Saving...',
            saveReceiveBtn: 'Save Receipt',
            documentInfoSection: 'Document Information',
            receiveDateLabel: 'Receive Date',
            poNoShortLabel: 'PO No.',
            poNoPlaceholder: 'Purchase order number',
            selectWarehouseLabel: 'Select Warehouse',
            warehouseExamplePlaceholder: 'e.g. Main Warehouse',
            partnerSenderLabel: 'Vendor / Sender',
            partnerNamePlaceholder: 'Vendor / supplier name',
            billLotPlaceholder: 'Bill / delivery note number',
            additionalRemarkPlaceholder: 'Additional remarks',
            receivedItemsSection: 'Received Fabric Items',
            addItemBtn: 'Add Item',
            masterFabricLabel: 'Fabric (Master)',
            selectFabricOpt: '— Select Fabric —',
            notSpecifiedOpt: '— Not Specified —',
            rollCountLabel: 'Roll Count',
            yardsPerRollLabel: 'Yards/Roll',
            totalYardsShortLabel: 'Total Yards',
            storageLocLabel: 'Storage Location',
            noItemsAddPrompt: 'No items yet — click "Add Item"',
            rollsIssuedPrefix: 'Issued',
            rollsIssuedUnit: 'rolls',
            documentWord: 'Document',
            printStickerHint: 'Print QR stickers to attach to each roll',
            printQrStickerBtn: 'Print QR Stickers',
            validationOneItemMsg: '⚠️ Please fill in at least 1 item (fabric, roll count, yards per roll)',
            zoneRackTitle: 'Zone & Rack (Warehouse Map)',
            zoneRackHint: 'Storage location map — one location can hold multiple rolls/colors · scan to store and cut yardage',
            scanPutawayBtn: 'Scan Putaway',
            scanCutBtn: 'Scan Cut',
            addLocationQrBtn: 'Add QR Code Location',
            searchLocationPlaceholder: 'Search fabric code / color — highlights matching locations',
            allLocationsLabel: 'Total Locations',
            rollsInStockLabel: 'Rolls in Stock',
            unassignedLabel: 'Unassigned',
            loadingMapMsg: 'Loading warehouse map...',
            printLocQrTitle: 'Print Location QR',
            editLocTitle: 'Edit Location',
            deleteLocTitle: 'Delete Location',
            emptyWord: 'Empty',
            lowStockBadge: 'Low Stock',
            editLocationTitleModal: 'Edit Location',
            addLocationTitleModal: 'Add Location (QR Location)',
            binLabel: 'Bin',
            locationCodeLabel: 'Location Code',
            locationCodePlaceholder: 'e.g. ZONE-A-RACK-01',
            printThisQrBtn: 'Print This QR',
            saveLocationBtn: 'Save Location',
            putawayModalTitle: '📦 Scan Putaway',
            cutModalTitle: '✂️ Scan Cut (Deduction)',
            scanLocStep1Label: '1) Scan Location QR',
            scanLocPlaceholder: 'Scan/type location QR then Enter',
            locWord: 'Location',
            scanRollStep2Label: '2) Scan Fabric Roll QR',
            scanRollStep1Label: '1) Scan Fabric Roll QR',
            scanRollPlaceholder: 'Scan/type roll QR then Enter',
            currentRemainingLabel: 'Current Remaining',
            yardsCutStep2Label: '2) Yards to Cut',
            putawayBtn: 'Store',
            cutBtn: 'Cut Yardage',
            printWord: 'Print',
            saveFailedWord: 'Save failed',
            requiredLocationCodeMsg: '⚠️ Please enter a location code',
            requiredBothQrMsg: '⚠️ Must scan both location QR and roll QR',
            requiredCutYardsMsg: '⚠️ Enter yards to cut (> 0)',
            exportSelectedBtn: 'Export Selected',
            vatProductGroupTitle: 'VAT Product Group — by Sale Price Range',
            vatProductGroupHint: 'Define VAT product groups by sale price range (THB) — the system will auto-assign products by price',
            priceFromLabel: 'Sale Price (From)',
            toShortWord: 'To',
            vatProductGroupLabel: 'VAT Product Group',
            groupNamePlaceholder: 'Group name e.g. A / B / Fabric',
            noGroupsYetMsg: 'No groups yet — click "Add Group" to start',
            addGroupBtn: 'Add Group',
            savedSuccessMsg: 'Saved successfully',
            vatReceiveTitle: 'VAT Goods Receipt',
            priceReceivedLabel: 'Received Price',
            meterWord: 'Meter',
            kgWord: 'kg.',
            pieceWord: 'pcs.',
          }
        }
      };
    },
    watch: {
      currentPage(val) {
        this.mobileMenuOpen = false;
        // บังคับสิทธิ์: ถ้าไม่มีสิทธิ์เข้าหน้านี้ → เด้งกลับแดชบอร์ด
        if (!this.canAccess(val)) {
          this.fbFail('คุณไม่มีสิทธิ์เข้าถึงเมนูนี้');
          this.$nextTick(() => { this.currentPage = 'dashboard'; });
          return;
        }
        if (val === 'fabric-regular') {
          this.fabric.frLoadItems(); this.loadMasterData();
        } else if (val === 'fabric-irregular') {
          this.fabric.fiLoadItems(); this.loadMasterData();
        } else if (val === 'fabric-regular-group' || val === 'fabric-irregular-group') {
          this.fabric.frgKind = val === 'fabric-irregular-group' ? 'irregular' : 'regular';
          this.fabric.frgSelected = []; this.fabric.frgPage = 1;
          this.fabric.frgLoadItems();
        } else if (val === 'customers') {
          this.customer.cuLoadItems();
        } else if (val === 'order-receive') {
          this.order.oeLoadFabrics();
        }
        try { localStorage.setItem('currentPage', val); } catch (e) {}
        this.genPage = 1;
        this.genSelected = [];
        this.genSortCol = -1;
        this.genSortDir = 'asc';
      },
    },
    computed: {
      // ---- proxy ไปที่ ui store (กล่องแจ้งผล) ----
      fb() { return this.ui.fb; },
      fbAskState() { return this.ui.fbAskState; },
      // ---- proxy ไปที่ auth store (แหล่งความจริงเดียว) ----
      token: {
        get() { return this.auth.token; },
        set(v) { this.auth.setToken(v); },
      },
      currentUser: {
        get() { return this.auth.currentUser; },
        set(v) { this.auth.setCurrentUser(v); },
      },
      rolePerms: {
        get() { return this.auth.rolePerms; },
        set(v) { this.auth.rolePerms = v; },
      },
      // ---- สิทธิ์เมนูของผู้ใช้ที่ล็อกอินอยู่ (null = ไม่จำกัด/เห็นทุกเมนู) ----
      myAllowedKeys() {
        return this.auth.myAllowedKeys;
      },
      // รายการลูกของเมนูย่อยซ้อนที่กำลังเปิด (กรองตามสิทธิ์)
      nestedFlyoutChildren() {
        if (!this.nestedFlyoutKey) return [];
        const parent = [...this.basicDataMenu, ...this.reportMenu].find(c => c.key === this.nestedFlyoutKey && c.children);
        if (!parent || !parent.children) return [];
        return parent.children.filter(g => this.canAccess(g.key));
      },
      // ---- กลุ่มผ้าประจำ / กลุ่มผ้าไม่ประจำ (ใช้ร่วมกัน สลับตามหน้า) ----
      // frg* getters (กลุ่มผ้าประจำ) ย้ายไปที่ stores/fabric.js แล้ว
      // ตัวเลือก dropdown ของผ้าประจำ — อิง md/mdMerge (master data) ของ Dashboard + frItems จาก fabric store
      frTypeOptions() {
        return [...new Set(this.fabric.frItems.map(i => i.type))].sort();
      },
      frCompositionOptions() {
        return this.mdMerge('composition', this.fabric.frItems.map(i => i.composition));
      },
      frWidthOptions() {
        return this.mdMerge('width', this.fabric.frItems.map(i => i.width));
      },
      frStructureOptions() {
        return this.mdMerge('structure', this.fabric.frItems.map(i => i.structure));
      },
      frFinishingOptions() {
        return this.mdMerge('finishing', this.fabric.frItems.map(i => i.finishing));
      },
      frWeightOptions() {
        return this.mdMerge('weight', this.fabric.frItems.map(i => i.weight)).sort((a, b) => (Number(a) || 0) - (Number(b) || 0));
      },
      frUnitOptions() {
        return ['หลา', 'เมตร', 'กิโลกรัม', 'ม้วน'];
      },
      // fr* list/pagination getters ย้ายไปที่ stores/fabric.js แล้ว
      // ลายเซ็นของการแจ้งเตือนชุดปัจจุบัน (เปลี่ยนเมื่อมีอะไรอัปเดตใหม่)
      notifKey() {
        const acts = (this.recentActivities || []).slice(0, 4).map(a => a.thTitle + '|' + a.time).join('~');
        const low = (this.lowStockRolls || []).map(r => r.roll_qr_code || r.roll_id).join(',');
        return `${this.topnavNotifCount || 0}#${low}#${acts}`;
      },
      notifCount() {
        // เปิดอ่านแล้วและยังไม่มีอะไรใหม่ → ไม่ต้องโชว์ตัวเลข
        if (this.notifSeenKey && this.notifSeenKey === this.notifKey) return 0;
        return (this.topnavNotifCount || 0) + this.lowStockRolls.length;
      },
      genCurrentTable() {
        const cp = this.currentPage;
        if (this.basicDataPages[cp]) return this.basicDataPages[cp];
        if (this.poPages[cp]) return this.poPages[cp];
        if (this.stockPages[cp]) return this.stockPages[cp];
        if (this.vatPages[cp]) return this.vatPages[cp];
        if (this.orderPages[cp]) return this.orderPages[cp];
        if (this.custAccPages[cp]) return this.custAccPages[cp];
        if (this.partnerAccPages[cp]) return this.partnerAccPages[cp];
        if (this.reportPages[cp]) return this.reportPages[cp];
        if (cp === 'user-permissions') return this.userRoles;
        if (cp === 'sales-contract') return this.salesContracts;
        return { columns: [], rows: [] };
      },
      genSortedRows() {
        const t = this.genCurrentTable;
        if (this.genSortCol < 0) return t.rows;
        const dir = this.genSortDir === 'asc' ? 1 : -1;
        return [...t.rows].sort((a, b) => {
          const av = String(a[this.genSortCol] ?? '').toLowerCase();
          const bv = String(b[this.genSortCol] ?? '').toLowerCase();
          if (av < bv) return -1 * dir;
          if (av > bv) return 1 * dir;
          return 0;
        });
      },
      genTotalPages() {
        return Math.max(1, Math.ceil(this.genSortedRows.length / this.genPageSize));
      },
      genPagedRows() {
        const start = (this.genPage - 1) * this.genPageSize;
        return this.genSortedRows.slice(start, start + this.genPageSize);
      },
      genAllSelectedOnPage() {
        return this.genPagedRows.length > 0 && this.genPagedRows.every(r => this.genSelected.includes(r));
      },
      // ตัวเลือก dropdown ของผ้าไม่ประจำ — อิง md/mdMerge (master data) ของ Dashboard + fiItems จาก fabric store
      fiTypeOptions() {
        return [...new Set(this.fabric.fiItems.map(i => i.type))].sort();
      },
      fiCompositionOptions() {
        return this.mdMerge('composition', this.fabric.fiItems.map(i => i.composition));
      },
      fiWidthOptions() {
        return this.mdMerge('width', this.fabric.fiItems.map(i => i.width));
      },
      fiStructureOptions() {
        return this.mdMerge('structure', this.fabric.fiItems.map(i => i.structure));
      },
      fiFinishingOptions() {
        return this.mdMerge('finishing', this.fabric.fiItems.map(i => i.finishing));
      },
      fiWeightOptions() {
        return this.mdMerge('weight', this.fabric.fiItems.map(i => i.weight)).sort((a, b) => (Number(a) || 0) - (Number(b) || 0));
      },
      // fi* list/pagination getters ย้ายไปที่ stores/fabric.js แล้ว
      frVisibleShadeRows() {
        const q = this.frShadeSearch.trim().toLowerCase();
        if (!q) return this.frShadeRows;
        return this.frShadeRows.filter(row =>
          (row.name || '').toLowerCase().includes(q) ||
          (row.color_code || '').toLowerCase().includes(q)
        );
      },
      xlTotalPages() {
        return Math.max(1, Math.ceil(this.xlRows.length / this.xlPageSize));
      },
      xlPagedRows() {
        const start = (this.xlPage - 1) * this.xlPageSize;
        return this.xlRows.slice(start, start + this.xlPageSize);
      },
      dashAvailableYears() {
        return Object.keys(this.dashSalesByYear).map(Number).sort((a, b) => a - b);
      },
      dashTrendTimeline() {
        const timeline = [];
        this.dashAvailableYears.forEach((y) => {
          (this.dashSalesByYear[y] || []).forEach((m, monthIdx) => {
            timeline.push({ year: y, monthIdx, label: m.label, value: m.value });
          });
        });
        return timeline;
      },
      dashTrendBars() {
        const timeline = this.dashTrendTimeline;
        if (!timeline.length) return [];
        let current;
        if (this.dashTrendRange === 'currentYear') {
          current = timeline.filter((t) => t.year === this.dashTrendYear);
        } else {
          const n = this.dashTrendRange === '1y' ? 12 : this.dashTrendRange === '6m' ? 6 : 3;
          current = timeline.slice(-n);
        }
        return current.map((t) => {
          const prevEntry = timeline.find((p) => p.year === t.year - 1 && p.monthIdx === t.monthIdx);
          return {
            label: t.label,
            year: t.year,
            prevYear: t.year - 1,
            current: t.value,
            previous: prevEntry ? prevEntry.value : null,
          };
        });
      },
      dashTrendBarScale() {
        const values = [];
        this.dashTrendBars.forEach((b) => {
          values.push(b.current);
          if (b.previous != null) values.push(b.previous);
        });
        const rawMax = Math.max(1, ...values);
        const targetSteps = 4;
        const roughStep = rawMax / targetSteps;
        const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep || 1)));
        const normalized = roughStep / magnitude;
        let niceStep;
        if (normalized <= 1) niceStep = 1 * magnitude;
        else if (normalized <= 2) niceStep = 2 * magnitude;
        else if (normalized <= 5) niceStep = 5 * magnitude;
        else niceStep = 10 * magnitude;
        const niceMax = Math.ceil(rawMax / niceStep) * niceStep;
        const ticks = [];
        for (let v = 0; v <= niceMax + 1e-6; v += niceStep) ticks.push(Math.round(v));
        return { max: niceMax || 1, ticks };
      },
      dashYearlyTotals() {
        return this.dashAvailableYears.map(y => ({
          label: String(y),
          value: (this.dashSalesByYear[y] || []).reduce((s, m) => s + m.value, 0),
        }));
      },
      dashTrendChartData() {
        if (this.dashTrendViewMode === 'year') return this.dashYearlyTotals;
        // โหมดวัน: ยอดตัดจ่ายจริงรายวัน 7 วันล่าสุด (จาก /api/dashboard/stats → daily)
        return this.dashDaySeries(this.dashRealDayValues(0));
      },
      dashTrendChartData2() {
        if (this.dashTrendViewMode === 'year') return [];
        // สัปดาห์ก่อนหน้า (7 วันก่อนช่วงล่าสุด) ไว้เทียบสัปดาห์ต่อสัปดาห์ — ข้อมูลจริงเช่นกัน
        return this.dashDaySeries(this.dashRealDayValues(7));
      },
      dashTrendDemo() {
        // กราฟกำลังแสดงข้อมูลตัวอย่าง (ไม่ใช่ข้อมูลจริงจากระบบ) หรือไม่ — ใช้เฉพาะโหมดปี (รายวันใช้ข้อมูลจริงเสมอ)
        if (this.dashTrendViewMode === 'year') return !this.dashHasRealTrend;
        return false;
      },
      dashTrendScale() {
        const values = [...this.dashTrendChartData, ...this.dashTrendChartData2].map(d => d.value);
        if (!values.length) values.push(0);
        const rawMax = Math.max(...values);
        const targetSteps = 4;
        // อิงจาก 0→rawMax เสมอ (ไม่ใช่ rawMax-rawMin) กัน tick แน่นเกินไปตอนข้อมูลลอยสูงจากศูนย์
        const roughStep = (rawMax || 1) / targetSteps;
        const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
        const normalized = roughStep / magnitude;
        let niceStep;
        if (normalized <= 1) niceStep = 1 * magnitude;
        else if (normalized <= 2) niceStep = 2 * magnitude;
        else if (normalized <= 5) niceStep = 5 * magnitude;
        else niceStep = 10 * magnitude;
        const niceMin = 0; // เริ่มแกน y ที่ 0 เสมอ (พื้นที่ใต้เส้นเต็มจากล่าง เหมือนกราฟแท่งซ้าย)
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
        // เส้นโค้งนุ่ม (Catmull-Rom → cubic bezier) — ผ่านจุดข้อมูลจริงทุกจุดเป๊ะ แค่ปัดโค้งระหว่างจุด
        return this.dashSmoothPath(this.dashTrendPoints);
      },
      dashTrendPoints2() {
        const data = this.dashTrendChartData2;
        if (!data.length) return [];
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
      dashTrendLinePath2() {
        return this.dashSmoothPath(this.dashTrendPoints2);
      },
      dashRegularPct() {
        // % ผ้าประจำ (ตัวเลขหลักในเกจ)
        const segs = this.dashVolumeSegments || [];
        const seg = segs.find(s => s.label && s.label.indexOf('ประจำ') !== -1 && s.label.indexOf('ไม่') === -1);
        return seg ? seg.pct : 0;
      },
      dashGaugeArc() {
        // เกจครึ่งวง 270° (เปิดด้านล่าง) — ราง + ค่า (% ผ้าประจำ) ไล่เฉดเนียน
        const r = 62, C = 2 * Math.PI * r, arc = C * 270 / 360;
        const pct = Math.max(0, Math.min(100, this.dashRegularPct));
        return { track: `${arc.toFixed(1)} ${(C - arc).toFixed(1)}`, value: `${(arc * pct / 100).toFixed(1)} ${C.toFixed(1)}` };
      },
      dashOtherPct() {
        return Math.max(0, 100 - this.dashRegularPct);
      },
      dashGaugeSegs() {
        // แบ่งเกจ 270° เป็นช่วงสีตามสัดส่วน 3 ประเภทผ้า (สีตาม dashVolumeSegments)
        const r = 62, C = 2 * Math.PI * r, arc = C * 270 / 360, gap = 2;
        const segs = this.dashVolumeSegments || [];
        const total = segs.reduce((s, x) => s + x.pct, 0) || 100;
        let acc = 0;
        return segs.map((s) => {
          const raw = (s.pct / total) * arc;
          const dash = Math.max(0, raw - gap);
          const out = {
            color: s.color, label: s.label, pct: s.pct,
            dasharray: `${dash.toFixed(1)} ${(C - dash).toFixed(1)}`,
            dashoffset: (-acc).toFixed(1),
          };
          acc += raw;
          return out;
        });
      },
      dashLast3Months() {
        // มินิบาร์ 3 เดือนล่าสุด (ใช้ชุดข้อมูลรายเดือนเดียวกับกราฟแนวโน้ม)
        const data = this.dashTrendChartData || [];
        const last3 = data.slice(-3);
        const max = Math.max(1, ...last3.map(d => Number(d.value) || 0));
        return last3.map(d => ({ label: d.label, value: Number(d.value) || 0, h: Math.round((Number(d.value) || 0) / max * 100) }));
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
            color: { 'ผ้าประจำ': '#22d3ee', 'ผ้าไม่ประจำ': '#4f7cf7', 'ผ้าดิบ': '#6366f1' }[d.label] || colors[i % colors.length],
            dasharray: `${dash} ${circumference - dash}`,
            dashoffset: -offsetAccum,
          };
          offsetAccum += rawDash;
          return seg;
        });
      },
      xlTotalPages() {
        return Math.max(1, Math.ceil(this.xlRows.length / this.xlPageSize));
      },
      xlPagedRows() {
        const start = (this.xlPage - 1) * this.xlPageSize;
        return this.xlRows.slice(start, start + this.xlPageSize);
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
        // โหมดวัน: ยอดตัดจ่ายจริงรายวัน 7 วันล่าสุด (จาก /api/dashboard/stats → daily)
        return this.dashDaySeries(this.dashRealDayValues(0));
      },
      dashTrendChartData2() {
        if (this.dashTrendViewMode === 'year') return [];
        // สัปดาห์ก่อนหน้า (7 วันก่อนช่วงล่าสุด) ไว้เทียบสัปดาห์ต่อสัปดาห์ — ข้อมูลจริงเช่นกัน
        return this.dashDaySeries(this.dashRealDayValues(7));
      },
      dashTrendDemo() {
        // กราฟกำลังแสดงข้อมูลตัวอย่าง (ไม่ใช่ข้อมูลจริงจากระบบ) หรือไม่ — ใช้เฉพาะโหมดปี (รายวันใช้ข้อมูลจริงเสมอ)
        if (this.dashTrendViewMode === 'year') return !this.dashHasRealTrend;
        return false;
      },
      dashTrendScale() {
        const values = [...this.dashTrendChartData, ...this.dashTrendChartData2].map(d => d.value);
        if (!values.length) values.push(0);
        const rawMax = Math.max(...values);
        const targetSteps = 4;
        // อิงจาก 0→rawMax เสมอ (ไม่ใช่ rawMax-rawMin) กัน tick แน่นเกินไปตอนข้อมูลลอยสูงจากศูนย์
        const roughStep = (rawMax || 1) / targetSteps;
        const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
        const normalized = roughStep / magnitude;
        let niceStep;
        if (normalized <= 1) niceStep = 1 * magnitude;
        else if (normalized <= 2) niceStep = 2 * magnitude;
        else if (normalized <= 5) niceStep = 5 * magnitude;
        else niceStep = 10 * magnitude;
        const niceMin = 0; // เริ่มแกน y ที่ 0 เสมอ (พื้นที่ใต้เส้นเต็มจากล่าง เหมือนกราฟแท่งซ้าย)
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
        // เส้นโค้งนุ่ม (Catmull-Rom → cubic bezier) — ผ่านจุดข้อมูลจริงทุกจุดเป๊ะ แค่ปัดโค้งระหว่างจุด
        return this.dashSmoothPath(this.dashTrendPoints);
      },
      dashTrendPoints2() {
        const data = this.dashTrendChartData2;
        if (!data.length) return [];
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
      dashTrendLinePath2() {
        return this.dashSmoothPath(this.dashTrendPoints2);
      },
      dashRegularPct() {
        // % ผ้าประจำ (ตัวเลขหลักในเกจ)
        const segs = this.dashVolumeSegments || [];
        const seg = segs.find(s => s.label && s.label.indexOf('ประจำ') !== -1 && s.label.indexOf('ไม่') === -1);
        return seg ? seg.pct : 0;
      },
      dashGaugeArc() {
        // เกจครึ่งวง 270° (เปิดด้านล่าง) — ราง + ค่า (% ผ้าประจำ) ไล่เฉดเนียน
        const r = 62, C = 2 * Math.PI * r, arc = C * 270 / 360;
        const pct = Math.max(0, Math.min(100, this.dashRegularPct));
        return { track: `${arc.toFixed(1)} ${(C - arc).toFixed(1)}`, value: `${(arc * pct / 100).toFixed(1)} ${C.toFixed(1)}` };
      },
      dashOtherPct() {
        return Math.max(0, 100 - this.dashRegularPct);
      },
      dashGaugeSegs() {
        // แบ่งเกจ 270° เป็นช่วงสีตามสัดส่วน 3 ประเภทผ้า (สีตาม dashVolumeSegments)
        const r = 62, C = 2 * Math.PI * r, arc = C * 270 / 360, gap = 2;
        const segs = this.dashVolumeSegments || [];
        const total = segs.reduce((s, x) => s + x.pct, 0) || 100;
        let acc = 0;
        return segs.map((s) => {
          const raw = (s.pct / total) * arc;
          const dash = Math.max(0, raw - gap);
          const out = {
            color: s.color, label: s.label, pct: s.pct,
            dasharray: `${dash.toFixed(1)} ${(C - dash).toFixed(1)}`,
            dashoffset: (-acc).toFixed(1),
          };
          acc += raw;
          return out;
        });
      },
      dashLast3Months() {
        // มินิบาร์ 3 เดือนล่าสุด (ใช้ชุดข้อมูลรายเดือนเดียวกับกราฟแนวโน้ม)
        const data = this.dashTrendChartData || [];
        const last3 = data.slice(-3);
        const max = Math.max(1, ...last3.map(d => Number(d.value) || 0));
        return last3.map(d => ({ label: d.label, value: Number(d.value) || 0, h: Math.round((Number(d.value) || 0) / max * 100) }));
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
            color: { 'ผ้าประจำ': '#22d3ee', 'ผ้าไม่ประจำ': '#4f7cf7', 'ผ้าดิบ': '#6366f1' }[d.label] || colors[i % colors.length],
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
        if (this.basicDataPages[cp] || cp === 'fabric-regular' || cp === 'fabric-irregular' || cp === 'customers') {
          return [home, g.groupBasicData, this.pageTitle(cp)];
        }
        if (this.poPages[cp]) return [home, g.groupPO, this.pageTitle(cp)];
        if (this.stockPages[cp] || this.stockMenu.some(m => m.key === cp)) return [home, g.groupStock, this.pageTitle(cp)];
        if (this.vatPages[cp]) return [home, g.groupVat, this.pageTitle(cp)];
        if (this.orderPages[cp] || cp === 'order-receive' || cp === 'order-fulfill') return [home, g.groupOrder, this.pageTitle(cp)];
        if (this.custAccPages[cp]) return [home, g.groupCustAcc, this.pageTitle(cp)];
        if (this.partnerAccPages[cp]) return [home, g.groupPartnerAcc, this.pageTitle(cp)];
        if (this.reportPages[cp]) return [home, g.groupReport, this.pageTitle(cp)];
        return [home];
      },
    },
    mounted() {
      // สร้างหน้ารายงานย่อย (mock) จากเมนู nested ที่ยังไม่มีใน reportPages
      this.reportMenu.forEach(g => {
        if (g.children) g.children.forEach(c => {
          if (!this.reportPages[c.key]) this.reportPages[c.key] = { title: c.label.th, columns: ['รายการ', 'รายละเอียด', 'จำนวน', 'มูลค่า', 'สถานะ'], rows: [] };
        });
      });
      // โหลด token/user/สิทธิ์ ล่าสุดจาก localStorage เข้า store (กันค้างหลัง re-login)
      this.auth.hydrate();
      document.documentElement.setAttribute('data-theme', this.theme);
      // เช็ค token - ถ้าไม่มีให้ redirect ไปที่ login
      if (!this.token) {
        setTimeout(() => {
          this.$router.push('/login');
        }, 500);
        return;
      }
      // เด้ง toast ต้อนรับถ้าเพิ่งเข้าสู่ระบบสำเร็จ (ตั้งค่าจากหน้า Login)
      try {
        const wt = sessionStorage.getItem('welcomeToast');
        if (wt) {
          sessionStorage.removeItem('welcomeToast');
          this.$nextTick(() => this.ui.toast('ยินดีต้อนรับ, ' + wt, 'success', { title: 'เข้าสู่ระบบสำเร็จ' }));
        }
      } catch (e) {}
      this.loadMembers();
      this.order.loadOrders();
      this.loadLowStock();
      this.loadDashboardStats();   // สถิติจริงของแดชบอร์ด
      this.loadMe();      // โหลด role ตัวเองล่าสุด (โปรไฟล์/สิทธิ์)
      this.loadRoles();   // โหลดบทบาท+สิทธิ์จาก MySQL (คงไว้ที่ mount — คุมสิทธิ์เมนู canAccess)
      // loadMasterData ย้ายไป lazy — โหลดตอนเข้าหน้าผ้าจริง (บรรทัด ~1177/1179) เพื่อให้เข้าระบบไวขึ้น
      // ถ้าหน้าที่ค้างไว้เกินสิทธิ์ → กลับแดชบอร์ด
      this.$nextTick(() => { if (!this.canAccess(this.currentPage)) this.currentPage = 'dashboard'; });
      // ตัวอย่างการอัพเดทสถิติ
      this.newUsersThisMonth = Math.floor(this.members.length * 0.3);
      // โหลดข้อมูลของหน้าที่ค้างไว้ (กรณีรีเฟรชแล้วอยู่หน้าเดิม — watcher ไม่ทำงานกับค่าเริ่มต้น)
      if (this.currentPage === 'fabric-regular') this.fabric.frLoadItems();
      else if (this.currentPage === 'fabric-regular-group' || this.currentPage === 'fabric-irregular-group') {
        this.fabric.frgKind = this.currentPage === 'fabric-irregular-group' ? 'irregular' : 'regular';
        this.fabric.frgLoadItems();
      }
      else if (this.currentPage === 'fabric-irregular') this.fabric.fiLoadItems();
      else if (this.currentPage === 'customers') this.customer.cuLoadItems();
      else if (this.currentPage === 'order-receive') this.order.oeLoadFabrics();
    },
    methods: {
      // ===================================================================
      //  กล่องแจ้งผลกลาง — ใช้แทน alert() / confirm() ทุกหน้า
      //  fbLoading(text)  : เปิดสปินเนอร์ "กำลัง..."
      //  fbDone(text)     : ติ๊กถูกเขียว + ปิดเองใน 1.3 วิ
      //  fbFail(text)     : กากบาทแดง + ปิดเองใน 2 วิ
      //  fbAsk(...)       : กล่องยืนยัน คืนค่า Promise<boolean>
      // ===================================================================
      // กล่องแจ้งผล — delegate ไป ui store
      fbLoading(text) { return this.ui.fbLoading(text); },
      fbDone(text) { return this.ui.fbDone(text); },
      fbFail(text) { return this.ui.fbFail(text); },
      fbHide() { return this.ui.fbHide(); },
      fbAsk(opt) { return this.ui.fbAsk(opt); },
      fbAskDelete(message) { return this.ui.fbAskDelete(message); },
      fbAnswer(v) { return this.ui.fbAnswer(v); },
      // ===================================================================
      //  โมดัลสิทธิ์การเข้าใช้งาน (เพิ่ม/แก้ไขบทบาท + ต้นไม้สิทธิ์)
      // ===================================================================
      // ตรวจสิทธิ์เข้าถึงหน้า/เมนู — delegate ไป auth store
      canAccess(key) { return this.auth.canAccess(this.reportChildParent[key] || key); },
      canAccessAny(keys) { return this.auth.canAccessAny((keys || []).map(k => this.reportChildParent[k] || k)); },
      menuGroupVisible(menuArray) { return this.auth.menuGroupVisible(menuArray); },
      pmOpen() {
        this.pmEditing = false;
        this.pmEditingRowIdx = -1;
        this.pmInitialName = '';
        this.pmInitialKeys = [];
        this.pmShow = true;
      },
      pmEditRole(row) {
        // row = แถวในตาราง userRoles; คอลัมน์แรก = ชื่อบทบาท
        const name = Array.isArray(row) ? row[0] : row;
        this.pmEditing = true;
        this.pmEditingRowIdx = this.userRoles.rows.indexOf(row);
        this.pmInitialName = name;
        this.pmInitialKeys = this.rolePerms[name] ? [...this.rolePerms[name]] : [];
        this.pmShow = true;
      },
      pmClose() {
        this.pmShow = false;
      },
      async loadRoles() {
        try {
          const res = await fetch(API + '/api/roles', { headers: { Authorization: 'Bearer ' + this.token } });
          if (res.status === 401) return;
          const data = await res.json();
          if (data.ok) {
            this.rolePerms = data.roles || {};
            localStorage.setItem('rolePerms', JSON.stringify(this.rolePerms));
            // sync ตารางบทบาทให้ตรงกับ DB
            this.userRoles.rows = Object.keys(this.rolePerms).map(name => {
              const existing = this.userRoles.rows.find(r => r[0] === name);
              return [name, existing ? existing[1] : '', `${this.rolePerms[name].length} สิทธิ์`,
                existing ? existing[3] : '0', 'ใช้งาน'];
            });
          }
        } catch (e) { /* ใช้ค่าจาก localStorage ต่อไป */ }
      },
      async pmSave(name, keys) {
        if (!name) { this.fbFail('กรุณากรอกชื่อบทบาท'); return; }
        this.fbLoading('กำลังบันทึก...');
        // ถ้าเปลี่ยนชื่อบทบาท ลบชื่อเดิมออกจาก DB
        const oldName = this.pmEditing ? this.pmInitialName : null;
        try {
          if (oldName && oldName !== name) {
            await fetch(API + `/api/roles/${encodeURIComponent(oldName)}`, {
              method: 'DELETE', headers: { Authorization: 'Bearer ' + this.token },
            });
            delete this.rolePerms[oldName];
          }
          const res = await fetch(API + `/api/roles/${encodeURIComponent(name)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.token },
            body: JSON.stringify({ permissions: keys }),
          });
          if (res.status === 401) { this.fbHide(); this.sessionExpired(); return; }
          const data = await res.json();
          if (!data.ok) { this.fbFail(data.message || 'บันทึกไม่สำเร็จ'); return; }
        } catch (e) {
          this.fbFail('บันทึกบทบาทไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้');
          return;
        }
        // อัปเดตในหน่วยความจำ + localStorage
        this.rolePerms[name] = keys;
        localStorage.setItem('rolePerms', JSON.stringify(this.rolePerms));
        const summary = `${keys.length} สิทธิ์`;
        if (this.pmEditing && this.pmEditingRowIdx >= 0) {
          const r = this.userRoles.rows[this.pmEditingRowIdx];
          r[0] = name; r[2] = summary;
        } else {
          this.userRoles.rows.push([name, '', summary, '0', 'ใช้งาน']);
        }
        this.pmShow = false;
        this.fbDone('บันทึกแล้ว');
      },
      toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
      },
      toggleLangDropdown(e) {
        this.langDropdownOpen = !this.langDropdownOpen;
        if (this.langDropdownOpen && e && e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          // วางเมนูออกด้านขวาของปุ่ม แบบลอยหน้าสุด (ไม่โดน sidebar ตัด)
          this.langFlyoutPos = { top: Math.round(r.top), left: Math.round(r.right + 8) };
        }
      },
      // เปิด/ปิดเมนูย่อยซ้อน แบบบานพับออกข้าง (คำนวณตำแหน่งจากปุ่ม)
      openNestedFlyout(child, e) {
        if (this.nestedFlyoutKey === child.key) { this.nestedFlyoutKey = null; return; }
        this.nestedFlyoutKey = child.key;
        if (e && e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          this.nestedFlyoutPos = { top: Math.round(r.top), left: Math.round(r.right + 6) };
        }
      },
      toggleGroup(key) {
        this.openGroups[key] = !this.openGroups[key];
      },
      // fr* list/CRUD/print/export methods ย้ายไปที่ stores/fabric.js แล้ว
      // ============ แจ้งเตือนผ้าใกล้หมด (แสดงในกระดิ่ง) ============
      // โหลดสถิติจริงของแดชบอร์ด แล้วเติมค่าเข้าช่องต่างๆ (KPI/กราฟ/สัดส่วน/ออร์เดอร์/กิจกรรม)
      dashDemoSeries(arr) {
        const M = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
        return M.map((label, i) => ({ label, value: arr[i] || 0 }));
      },
      dashDaySeries(arr) {
        // 7 วันล่าสุด — label = "วันที่ ชื่อวัน" (เช่น "21 ศ") แบบภาพตัวอย่าง
        const WD = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
        const today = new Date();
        const out = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          out.push({ label: d.getDate() + ' ' + WD[d.getDay()], value: arr[6 - i] || 0 });
        }
        return out;
      },
      // เส้นโค้งนุ่ม (Catmull-Rom → cubic bezier) ให้กราฟเส้นแนวโน้มทุกเส้น — ผ่านจุดข้อมูลจริงทุกจุดเป๊ะ
      dashSmoothPath(pts) {
        if (!pts || pts.length < 2) return pts && pts.length ? `M${pts[0].x},${pts[0].y}` : '';
        const t = 0.18; // ความนุ่มของเส้นโค้ง (มาก = โค้งเยอะ)
        let d = `M${pts[0].x},${pts[0].y}`;
        for (let i = 0; i < pts.length - 1; i++) {
          const p0 = pts[i - 1] || pts[i];
          const p1 = pts[i];
          const p2 = pts[i + 1];
          const p3 = pts[i + 2] || p2;
          const c1x = p1.x + (p2.x - p0.x) * t, c1y = p1.y + (p2.y - p0.y) * t;
          const c2x = p2.x - (p3.x - p1.x) * t, c2y = p2.y - (p3.y - p1.y) * t;
          d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
        }
        return d;
      },
      // ดึงยอดตัดจ่ายจริงรายวัน 7 ค่า (arr[0]=เก่าสุด...arr[6]=ล่าสุดของช่วง) จาก dashStats.daily
      // offsetDays=0 → 7 วันล่าสุด, offsetDays=7 → 7 วันก่อนหน้านั้น (ไม่ทับช่วงกัน)
      dashRealDayValues(offsetDays) {
        const daily = (this.dashStats && this.dashStats.daily) || [];
        const map = new Map(daily.map(d => [d.date, Number(d.value) || 0]));
        const today = new Date();
        const out = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - offsetDays - i);
          out.push(map.get(d.toISOString().slice(0, 10)) || 0);
        }
        return out;
      },
      async loadDashboardStats() {
        try {
          const res = await fetch(API + '/api/dashboard/stats?year=' + (this.dashTrendYear || new Date().getFullYear()), {
            headers: { Authorization: 'Bearer ' + this.token },
          });
          if (res.status === 401) { this.sessionExpired(); return; }
          const d = await res.json();
          if (!d.ok) return;
          this.dashStats = d;
          const k = d.kpi || {};
          const nf = (n) => Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

          // KPI 4 ช่องบน — ใช้ข้อมูลจริง
          this.totalRevenue = nf(k.invoiceAmount);          // รายได้เดือนนี้ (จากอินวอยซ์)
          this.monthlySales = Math.round(k.revenueYards);   // ยอดขายเดือนนี้ (หลาที่ตัดจ่ายจริง)
          this.totalOrders = k.ordersWaiting || 0;          // คำสั่งซื้อที่กำลังประมวลผล
          this.totalSalesAmount = nf(k.stockYards);         // สินค้าคงคลัง (หลา)
          this.newUsersThisMonth = k.users || 0;

          // กราฟแนวโน้ม — เติมข้อมูลจริงรายเดือน (ปีที่เลือก + ปีก่อนหน้า)
          // ทับข้อมูลตัวอย่าง (demo) ด้วยข้อมูลจริงเฉพาะเมื่อมีข้อมูลจริง "ตั้งแต่ 3 เดือนขึ้นไป"
          // ถ้ายังน้อยกว่านั้น คงกราฟตัวอย่างเต็ม 12 เดือนไว้ (กันกราฟเป็นเนินเดียว) + โชว์ป้าย Demo
          const t = d.trend || {};
          const MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
          const toSeries = (arr) => MONTHS.map((label, i) => ({ label, value: Number((arr || [])[i]) || 0 }));
          const countReal = (arr) => (arr || []).filter(v => Number(v) > 0).length;
          const curReal = countReal(t.current), prevReal = countReal(t.previous);
          const merged = { ...this.dashSalesByYear };
          if (curReal >= 3) merged[t.year] = toSeries(t.current);
          if (prevReal >= 3) merged[t.year - 1] = toSeries(t.previous);
          this.dashSalesByYear = merged;
          this.dashTrendDemoYears = { ...this.dashTrendDemoYears, [t.year]: curReal < 3, [t.year - 1]: prevReal < 3 };
          this.dashHasRealTrend = curReal >= 3 || prevReal >= 3;

          // สัดส่วนปริมาณการขาย — จากสต็อกจริงแยกตามชนิดผ้า
          const vol = d.volume || [];
          const volTotal = vol.reduce((s, v) => s + Number(v.value || 0), 0);
          if (vol.length) {
            // แสดงครบ 3 ประเภท (ผ้าประจำ/ผ้าไม่ประจำ/ผ้าดิบ) — ที่ยังไม่มีสต็อกให้เป็น 0%
            this.dashVolumeData = vol.map(v => ({
              label: v.label,
              value: volTotal > 0 ? Math.round((Number(v.value) / volTotal) * 100) : 0,
              yards: Number(v.value) || 0,
            }));
          }

          // กิจกรรมล่าสุด — จากการเคลื่อนไหวสต็อกจริง
          const typeText = { issue: 'ตัดจ่ายสินค้า', cut: 'ตัดหลา', move: 'ย้ายสินค้า', adjust: 'ปรับปรุงสต็อก', receive: 'รับสินค้าเข้า' };
          const icons = { issue: '📤', cut: '✂️', move: '🚚', adjust: '⚖️', receive: '📥' };
          const acts = (d.activities || []).map(a => {
            const t = typeText[a.txn_type] || a.txn_type;
            const sku = a.product_sku ? ' — ' + a.product_sku : '';
            const yd = a.yards_change ? ` (${Number(a.yards_change).toFixed(2)} หลา)` : '';
            return {
              icon: icons[a.txn_type] || '📝',
              thTitle: t + sku + yd,
              enTitle: t + sku + yd,
              time: this.dashTimeAgo(a.created_at) + (a.user_name ? ' · ' + a.user_name : ''),
            };
          });
          if (acts.length) this.recentActivities = acts;
        } catch (e) { /* โหลดไม่ได้ → คงค่าเดิมไว้ */ }
      },
      // แปลงเวลาเป็น "เมื่อ x ที่แล้ว"
      dashTimeAgo(ts) {
        if (!ts) return '-';
        const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
        if (diff < 60) return 'เมื่อสักครู่';
        if (diff < 3600) return `เมื่อ ${Math.floor(diff / 60)} นาทีที่แล้ว`;
        if (diff < 86400) return `เมื่อ ${Math.floor(diff / 3600)} ชั่วโมงที่แล้ว`;
        return `เมื่อ ${Math.floor(diff / 86400)} วันที่แล้ว`;
      },
      async loadLowStock() {
        try {
          const res = await fetch(API + '/api/low-stock?threshold=' + this.lowStockThreshold, {
            headers: { Authorization: 'Bearer ' + this.token },
          });
          if (!res.ok) return;
          const data = await res.json();
          this.lowStockRolls = data.rolls || [];
        } catch (e) { this.lowStockRolls = []; }
      },
      genSort(colIdx) {
        if (this.genSortCol === colIdx) {
          this.genSortDir = this.genSortDir === 'asc' ? 'desc' : 'asc';
        } else {
          this.genSortCol = colIdx;
          this.genSortDir = 'asc';
        }
      },
      genPrevPage() {
        if (this.genPage > 1) this.genPage -= 1;
      },
      genNextPage() {
        if (this.genPage < this.genTotalPages) this.genPage += 1;
      },
      genToggleSelectAll() {
        if (this.genAllSelectedOnPage) {
          this.genSelected = this.genSelected.filter(r => !this.genPagedRows.includes(r));
        } else {
          const newOnes = this.genPagedRows.filter(r => !this.genSelected.includes(r));
          this.genSelected = [...this.genSelected, ...newOnes];
        }
      },
      genToggleSelectRow(row) {
        const idx = this.genSelected.indexOf(row);
        if (idx === -1) this.genSelected.push(row);
        else this.genSelected.splice(idx, 1);
      },
      async genBulkDeleteRows() {
        if (this.genSelected.length === 0) return;
        if (!(await this.fbAskDelete(`ต้องการลบ ${this.genSelected.length} รายการที่เลือกใช่หรือไม่?`))) return;
        const t = this.genCurrentTable;
        t.rows = t.rows.filter(r => !this.genSelected.includes(r));
        this.genSelected = [];
        this.fbDone('ลบข้อมูลแล้ว');
      },
      async genExportExcel(selectedOnly) {
        const t = this.genCurrentTable;
        const rows = selectedOnly ? this.genSelected : this.genSortedRows;
        if (rows.length === 0) {
          this.fbFail('ไม่มีข้อมูลให้ส่งออก');
          return;
        }
        const XLSX = await import('xlsx');
        const aoa = [t.columns, ...rows];
        const sheet = XLSX.utils.aoa_to_sheet(aoa);
        const wb = XLSX.utils.book_new();
        const title = (t.title || 'ข้อมูล').replace(/[\\/*?:[\]]/g, '').slice(0, 28) || 'ข้อมูล';
        XLSX.utils.book_append_sheet(wb, sheet, title);
        XLSX.writeFile(wb, `${title}-${new Date().toISOString().slice(0, 10)}.xlsx`);
      },
      sessionExpired() {
        this.auth.sessionExpired();
      },
      // fr* โหลด/เพิ่ม/แก้/ลบ (frLoadItems/frLoadGroups/frOpenAdd/frEditItem/frViewItem/frDeleteItem/frCloseAddModal)
      // ย้ายไปที่ stores/fabric.js แล้ว
      frNewShadeRow(base) {
        this.frShadeKeySeq += 1;
        return {
          _key: this.frShadeKeySeq,
          color_code: base ? (base.color_code || '') : '',
          name: base ? base.name : '',
          rack: base ? (base.rack || '') : '',
          image_name: base ? (base.image_name || '') : '',
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
      // fi* CRUD/list/pagination methods ย้ายไปที่ stores/fabric.js แล้ว
      // เปิด/ปิดกล่องแจ้งเตือน — เปิดแล้วถือว่าอ่านแล้ว (ตัวเลขหาย จนกว่าจะมีอัปเดตใหม่)
      toggleNotif() {
        this.topnavNotifOpen = !this.topnavNotifOpen;
        if (this.topnavNotifOpen) {
          this.notifSeenKey = this.notifKey;
          try { localStorage.setItem('notifSeenKey', this.notifSeenKey); } catch (e) {}
        }
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
          const res = await fetch(API + '/api/fabrics', {
            headers: { Authorization: 'Bearer ' + this.token },
          });
          if (res.status === 401) { this.sessionExpired(); return; }
          const data = await res.json();
          this.xlRows = data.fabrics || [];
        } catch (e) {
          this.xlRows = [];
        } finally {
          this.xlLoading = false;
        }
      },
      async xlImportFile() {
        if (!this.xlFile) {
          this.fbFail('กรุณาเลือกไฟล์ Excel (.xlsx) หรือ CSV');
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
          // แถวแรกเป็น Header — คอลัมน์: ที่, ประเภท, รหัสสินค้า, จำนวนสี, ชื่อ, โครงสร้างผ้า, ส่วนประกอบ, หน้ากว้าง, Finishing, น้ำหนัก, หน่วย, รูป
          const dataRows = rows.slice(1).filter(r => r.some(cell => String(cell).trim() !== ''));
          const items = dataRows.map(r => ({
            type: String(r[1] || '').trim(),
            sku: String(r[2] || '').trim(),
            colors: String(r[3] || '').trim(),
            name: String(r[4] || '').trim(),
            structure: String(r[5] || '').trim(),
            composition: String(r[6] || '').trim(),
            width: String(r[7] || '').trim(),
            finishing: String(r[8] || '').trim(),
            weight: String(r[9] || '').trim(),
            unit: String(r[10] || '').trim() || 'หลา',
            image_name: String(r[11] || '').trim(),
          })).filter(item => item.sku && item.sku !== '-');

          if (items.length === 0) {
            this.xlImportMessage = '⚠️ ไม่พบข้อมูลที่นำเข้าได้ในไฟล์นี้ (ตรวจสอบว่าคอลัมน์ C คือ รหัสสินค้า)';
            return;
          }

          const res = await fetch(API + '/api/fabrics/import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.token },
            body: JSON.stringify({ items }),
          });
          if (res.status === 401) { this.sessionExpired(); return; }
          const data = await res.json();
          if (data.ok) {
            this.xlImportMessage = `✅ นำเข้าข้อมูลสำเร็จ ${data.imported} รายการ`;
            this.xlFile = null;
            this.xlFileInputKey += 1;
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
      xlPrevPage() {
        if (this.xlPage > 1) this.xlPage -= 1;
      },
      xlNextPage() {
        if (this.xlPage < this.xlTotalPages) this.xlPage += 1;
      },
      async frOpenShadeModal(entity, context) {
        this.frShadeContext = context;
        this.frShadeFabric = entity;
        this.frShadeGroupSel = '';
        // โหลดกลุ่มผ้าสำหรับปุ่ม "ดึงเฉดสีจากกลุ่ม" (เฉพาะเมื่อเปิดจากผ้า ไม่ใช่จากกลุ่มเอง)
        if (context !== 'regular-group') this.frLoadShadeGroups();
        else this.frShadeGroups = [];
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
            color_code: s.color_code, name: s.name, rack: s.rack, image_name: s.image_name,
            fabric_cost: s.fabric_cost, dye_cost: s.dye_cost,
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
          .filter(r => (r.name || '').trim() || (r.color_code || '').trim())
          .map(r => ({
            color_code: (r.color_code || '').trim(),
            name: (r.name || '').trim(),
            rack: (r.rack || '').trim(),
            image_name: (r.image_name || '').trim(),
            fabric_cost: Number(r.fabric_cost) || 0,
            dye_cost: Number(r.dye_cost) || 0,
          }));
        this.fbLoading('กำลังบันทึกเฉดสี...');
        try {
          const res = await fetch(API + this.frShadeFabric.apiPath, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.token },
            body: JSON.stringify({ shades }),
          });
          if (res.status === 401) { this.fbHide(); this.sessionExpired(); return; }
          const data = await res.json();
          if (data.ok) {
            if (this.frShadeContext === 'irregular') {
              await this.fabric.fiLoadItems();
            } else if (this.frShadeContext === 'regular-group') {
              await this.fabric.frgLoadItems();
            } else {
              await this.fabric.frLoadItems();
            }
            this.frCloseShadeModal();
            this.fbDone('บันทึกแล้ว');
          } else {
            this.fbFail(data.message || 'บันทึกไม่สำเร็จ');
          }
        } catch (e) {
          this.fbFail('บันทึกเฉดสีไม่สำเร็จ — ตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์');
        }
      },
      frNewShadeRow(base) {
        this.frShadeKeySeq += 1;
        return {
          _key: this.frShadeKeySeq,
          color_code: base ? (base.color_code || '') : '',
          name: base ? base.name : '',
          rack: base ? (base.rack || '') : '',
          image_name: base ? (base.image_name || '') : '',
          fabric_cost: base ? base.fabric_cost : '',
          dye_cost: base ? base.dye_cost : '',
        };
      },
      // กดปุ่มกรรไกร → เปิดหน้าจัดออร์เดอร์/ตัดผ้า พร้อมดึงข้อมูลออร์เดอร์มาเติม (ยังอยู่ Dashboard.vue เพราะต้องสลับ currentPage)
      async ofFulfillOrder(order) {
        if (order.status === 'Prepared') {
          this.fbFail('ออร์เดอร์นี้จัดครบแล้ว');
          return;
        }
        // สร้างแถวรายการตัดจากรายการในออร์เดอร์ (เฉพาะที่ยังค้างเบิก)
        const rows = (order.items || [])
          .map((it, i) => {
            const pending = Math.max(0, (Number(it.pendingQty) || 0) - (Number(it.withdrawQty) || 0));
            return {
              _key: i + 1,
              sku: it.sku || '',
              colorCode: it.colorCode || '',
              colorId: it.colorId || null,
              width: it.width || '',
              pendingQty: pending,          // จำนวนค้างเบิก
              withdrawnQty: Number(it.withdrawQty) || 0, // จำนวนที่เบิกไปแล้ว
              unit: it.unit || 'หลา',
              pack: it.pack || '',
              finalOrder: false,            // จบออร์เดอร์
              rollQr: '',                   // QR ม้วนที่สแกน (บาร์โค้ด)
              cutQty: null,                 // จำนวนที่ตัด
              clearStock: false,            // เคลียร์สต็อก
            };
          })
          .filter((r) => r.sku);
        if (rows.length === 0) { this.fbFail('ออร์เดอร์นี้ไม่มีรายการสินค้าให้จัด'); return; }

        this.order.ofDetail.order = order;
        this.order.ofDetail.rows = rows;
        this.order.ofDetail.issueDate = new Date().toISOString().slice(0, 10);
        this.order.ofDetail.issueType = 'ขาย';
        this.order.ofDetail.remark = '';
        this.order.ofDetail.scanInput = '';
        this.order.ofDetail.scanY = '';
        this.order.ofDetail.scanM = '';
        this.order.ofDetail.savedMsg = '';
        // เลขที่เบิกสินค้าล้อกับเลขออร์เดอร์: OR2608-008 → OUT2608-008
        const on = (order.orderNo || '').trim();
        if (/^OR\d/.test(on)) {
          this.order.ofDetail.issueNo = on.replace(/^OR/, 'OUT');
        } else {
          this.order.ofDetail.issueNo = '';
          // ออร์เดอร์ที่ไม่ได้ขึ้นต้น OR → ดึงเลขใบเบิกถัดไปมาแทน
          try {
            const res = await fetch(API + '/api/order-issue/next-no', { headers: { Authorization: 'Bearer ' + this.token } });
            if (res.status === 401) { this.sessionExpired(); return; }
            const d = await res.json();
            if (d.ok) this.order.ofDetail.issueNo = d.gi_no;
          } catch (e) { /* ได้เลขจริงตอนบันทึก */ }
        }
        this.currentPage = 'order-fulfill-detail';
      },
      ofHandleBarcodeEnter() {
        const code = this.order.ofBarcodeInput.trim();
        if (!code) return;
        this.order.ofBarcodeInput = '';
        // สแกน QR เลขออร์เดอร์จากใบสั่งตัด → เปิดหน้าตัดของออร์เดอร์นั้นเลย
        const order = this.order.ofOrders.find((o) => o.orderNo === code);
        if (order) {
          if (order.status === 'Prepared') { this.fbFail(`ออร์เดอร์ ${code} จัดครบแล้ว`); return; }
          this.ofFulfillOrder(order);
          return;
        }
        // ไม่ตรงเลขออร์เดอร์ → ใช้เป็นคำค้นหาปกติ
        this.order.ofFilters.search = code;
      },
      ofDetailBack() {
        this.currentPage = 'order-fulfill';
      },
      // บันทึกการตัดจ่าย → POST /api/order-issue (หักสต็อกจริง + อัปเดตออร์เดอร์) — ยังอยู่ Dashboard.vue เพราะต้องสลับ currentPage
      async ofDetailSave() {
        const d = this.order.ofDetail;
        if (!d.order) return;
        const lines = d.rows
          .filter((r) => r.sku && Number(r.cutQty) > 0)
          .map((r) => ({
            sku: r.sku,
            color_code: r.colorCode,
            color_id: r.colorId || null,
            color_name: r.colorCode || '',
            width: r.width,
            unit: r.unit,
            pack: r.pack,
            roll_qr: r.rollQr || '',
            yards: Number(r.cutQty),
            clear_stock: !!r.clearStock,
          }));
        if (lines.length === 0) { this.fbFail('กรุณาระบุจำนวนที่ตัดอย่างน้อย 1 รายการ'); return; }
        const finishOrder = d.rows.some((r) => r.finalOrder);
        d.saving = true;
        this.fbLoading('กำลังตัดจ่ายสินค้า...');
        try {
          const res = await fetch(API + '/api/order-issue', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.token },
            body: JSON.stringify({
              order_id: d.order.id,
              order_no: d.order.orderNo,
              gi_no: d.issueNo,               // เลขใบเบิกล้อกับเลขออร์เดอร์ (OR→OUT)
              issue_date: d.issueDate,
              issue_type: d.issueType,
              customer: d.order.customer,
              payment_term: d.order.paymentTerm,
              salesperson: d.order.salesperson,
              note: d.remark,
              finish_order: finishOrder,
              lines,
            }),
          });
          if (res.status === 401) { this.fbHide(); this.sessionExpired(); return; }
          const out = await res.json();
          if (!out.ok) { this.fbFail(out.message || 'ตัดจ่ายไม่สำเร็จ'); return; }
          d.issueNo = out.gi_no || d.issueNo;
          d.savedMsg = out.message || 'ตัดจ่ายเรียบร้อยแล้ว';
          this.fbDone('บันทึกแล้ว');
          await this.order.loadOrders();               // รีเฟรชสถานะ/ยอดเบิก
          setTimeout(() => { this.currentPage = 'order-fulfill'; }, 800);
        } catch (e) {
          this.fbFail('ตัดจ่ายไม่สำเร็จ — ตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์');
        } finally {
          d.saving = false;
        }
      },
      pipelineBadgeCount(key) {
        const o = this.order.ofOrders;
        if (key === 'order-receive') return o.filter(x => !x.vatDone).length;
        if (key === 'order-fulfill') return o.filter(x => x.status !== 'Prepared').length;
        if (key === 'invoice-open') return o.filter(x => x.status === 'Prepared' && !x.invoiced).length;
        if (key === 'vat-invoice') return o.filter(x => x.invoiced && !x.vatDone).length;
        return 0;
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
          this.fbFail('กรุณาเลือกไฟล์ Excel (.xlsx) หรือ CSV');
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
      async frOpenShadeModal(entity, context) {
        this.frShadeContext = context;
        this.frShadeFabric = entity;
        this.frShadeGroupSel = '';
        // โหลดกลุ่มผ้าสำหรับปุ่ม "ดึงเฉดสีจากกลุ่ม" (เฉพาะเมื่อเปิดจากผ้า ไม่ใช่จากกลุ่มเอง)
        if (context !== 'regular-group') this.frLoadShadeGroups();
        else this.frShadeGroups = [];
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
            color_code: s.color_code, name: s.name, rack: s.rack, image_name: s.image_name,
            fabric_cost: s.fabric_cost, dye_cost: s.dye_cost,
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
          .filter(r => (r.name || '').trim() || (r.color_code || '').trim())
          .map(r => ({
            color_code: (r.color_code || '').trim(),
            name: (r.name || '').trim(),
            rack: (r.rack || '').trim(),
            image_name: (r.image_name || '').trim(),
            fabric_cost: Number(r.fabric_cost) || 0,
            dye_cost: Number(r.dye_cost) || 0,
          }));
        this.fbLoading('กำลังบันทึกเฉดสี...');
        try {
          const res = await fetch(API + this.frShadeFabric.apiPath, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.token },
            body: JSON.stringify({ shades }),
          });
          if (res.status === 401) { this.fbHide(); this.sessionExpired(); return; }
          const data = await res.json();
          if (data.ok) {
            if (this.frShadeContext === 'irregular') {
              await this.fabric.fiLoadItems();
            } else if (this.frShadeContext === 'regular-group') {
              await this.fabric.frgLoadItems();
            } else {
              await this.fabric.frLoadItems();
            }
            this.frCloseShadeModal();
            this.fbDone('บันทึกแล้ว');
          } else {
            this.fbFail(data.message || 'บันทึกไม่สำเร็จ');
          }
        } catch (e) {
          this.fbFail('บันทึกเฉดสีไม่สำเร็จ — ตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์');
        }
      },
      // frHandleFileChange / frSaveAdd (ผ้าประจำ) ย้ายไปที่ stores/fabric.js แล้ว
      // frWeightBucket ยังอยู่ที่นี่เพราะใช้ร่วมกับตัวกรองผ้าไม่ประจำ (fi*)
      frWeightBucket(weight) {
        const n = Number(weight);
        if (!weight || isNaN(n)) return 'mid';
        if (n < 150) return 'light';
        if (n <= 250) return 'mid';
        return 'heavy';
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
          ...this.orderMenu, ...this.custAccMenu, ...this.partnerAccMenu, ...flatten(this.reportMenu), ...this.usersMenu,
        ];
        const found = allMenus.find(m => m.key === key);
        if (!found) return '';
        return this.lang === 'th' ? found.label.th : found.label.en;
      },
      pageTitle(key) {
        const flatten = arr => arr.flatMap(m => (m.children ? m.children : [m]));
        const allMenus = [
          ...flatten(this.basicDataMenu), ...this.poMenu, ...this.stockMenu, ...this.vatMenu,
          ...this.orderMenu, ...this.custAccMenu, ...this.partnerAccMenu, ...flatten(this.reportMenu), ...this.usersMenu,
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
          this.usCanManage = !!data.canManage;
        } catch (e) {
          console.log('ไม่สามารถโหลดข้อมูลสมาชิก');
        }
      },
      // โหลดข้อมูลผู้ใช้ปัจจุบัน (รวม role) ให้สดเสมอ — โปรไฟล์/สิทธิ์อัปเดตตามตำแหน่งล่าสุด
      async loadMe() {
        try {
          const res = await fetch(API + '/api/me', { headers: { Authorization: 'Bearer ' + this.token } });
          if (res.status === 401) return;
          const data = await res.json();
          if (data.ok && data.user) this.currentUser = { ...this.currentUser, ...data.user };
        } catch (e) { /* ใช้ค่าจาก localStorage ต่อไป */ }
      },
      // โหลด "ข้อมูลผ้า" (master data) ทั้ง 5 หมวด สำหรับ dropdown ในฟอร์มผ้า
      async loadMasterData() {
        const cats = ['structure', 'composition', 'width', 'finishing', 'weight'];
        try {
          for (const cat of cats) {
            const res = await fetch(API + `/api/master-data/${cat}`, { headers: { Authorization: 'Bearer ' + this.token } });
            if (res.status === 401) return;
            const data = await res.json();
            if (data.ok) this.md[cat] = (data.items || []).map(x => x.name);
          }
        } catch (e) { /* ใช้ค่า distinct จากตารางผ้าแทน */ }
      },
      // รวมตัวเลือกจาก master_data + ค่าที่มีอยู่จริงในตารางผ้า (กันค่าเก่าหาย) เรียงไม่ซ้ำ
      mdMerge(cat, values) {
        const set = new Set([...(this.md[cat] || []), ...values.filter(v => v != null && v !== '')]);
        return [...set].sort((a, b) => String(a).localeCompare(String(b), 'th'));
      },
      // รายชื่อบทบาทที่เลือกได้ (พรีเซ็ต + บทบาทที่สร้างในหน้าสิทธิ์)
      roleOptions() {
        const presets = ['CEO / ผู้บริหาร', 'พนักงานคลังสินค้า', 'พนักงานส่งของ', 'ฝ่ายบัญชี', 'ฝ่ายรับออเดอร์', 'ฝ่ายตัด/หาผ้าออเดอร์'];
        const custom = Object.keys(this.rolePerms || {});
        return [...new Set([...presets, ...custom])];
      },
      // ================= กลุ่มผ้าประจำ (fabric-regular-group) =================
      // frg* โหลด/เพิ่ม/แก้/ลบ/เลือก/เรียง ย้ายไปที่ stores/fabric.js แล้ว
      // frgOpenShades ยังอยู่ที่นี่เพราะเรียกระบบเฉดสีที่ใช้ร่วมกัน (frOpenShadeModal)
      frgOpenShades(item) {
        this.frOpenShadeModal({ id: item.id, sku: '', name: item.name, apiPath: `${this.fabric.frgApiBase}/${item.id}/shades` }, 'regular-group');
      },
      // โหลดรายการกลุ่มผ้า (พร้อมเฉดสี) สำหรับปุ่ม "ดึงเฉดสีจากกลุ่ม"
      async frLoadShadeGroups() {
        const base = this.frShadeContext === 'irregular' ? '/api/fabric-irregular-group' : '/api/fabric-regular-group';
        try {
          const res = await fetch(API + base, { headers: { Authorization: 'Bearer ' + this.token } });
          if (res.status === 401) return;
          const data = await res.json();
          this.frShadeGroups = data.ok ? (data.items || []) : [];
        } catch (e) { this.frShadeGroups = []; }
      },
      // ดึงเฉดสีของกลุ่มที่เลือก มาต่อท้ายรายการเฉดสีของผ้า (ไม่ซ้ำชื่อเดิม)
      frPullShadesFromGroup() {
        const g = this.frShadeGroups.find(x => String(x.id) === String(this.frShadeGroupSel));
        if (!g) { this.fbFail('กรุณาเลือกกลุ่มผ้าก่อน'); return; }
        // กันซ้ำด้วย "รหัสสี" ก่อน (ถ้ามี) ไม่งั้นใช้ชื่อเฉดสี
        const keyOf = (o) => ((o.color_code || '').trim() || (o.name || '').trim());
        const existing = new Set(this.frShadeRows.map(keyOf).filter(Boolean));
        let added = 0;
        (g.shades || []).forEach(s => {
          const k = keyOf(s);
          if (!k || existing.has(k)) return;
          const row = this.frNewShadeRow();
          row.color_code = (s.color_code || '').trim();
          row.name = (s.name || '').trim();
          row.rack = (s.rack || '').trim();
          row.image_name = (s.image_name || '').trim();
          row.fabric_cost = s.fabric_cost || 0; row.dye_cost = s.dye_cost || 0;
          this.frShadeRows.push(row);
          existing.add(k); added += 1;
        });
        if (added > 0) this.fbDone(`ดึงเฉดสีมา ${added} รายการ`);
        else this.fbFail('ไม่มีเฉดสีใหม่ให้ดึง (อาจมีอยู่แล้ว)');
      },
      // ---- แก้ไข/ลบบัญชีผู้ใช้ ----
      usOpenEdit(user) {
        this.usEditItem = { id: user.id, name: user.name || '', email: user.email || '', phone: user.phone || '', role: user.role || '', gender: user.gender || '', age: user.age || '', password: '' };
        this.usModalShow = true;
      },
      usCloseModal() { this.usModalShow = false; },
      async usSaveUser() {
        const u = this.usEditItem;
        if (!u.name.trim() || !u.email.trim()) { this.fbFail('กรุณากรอกชื่อและอีเมล'); return; }
        this.fbLoading('กำลังบันทึก...');
        try {
          const res = await fetch(API + `/api/users/${u.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.token },
            body: JSON.stringify({ name: u.name.trim(), email: u.email.trim(), phone: u.phone.trim(), role: u.role, gender: u.gender, age: u.age || null, password: u.password || '' }),
          });
          if (res.status === 401) { this.fbHide(); this.sessionExpired(); return; }
          const data = await res.json();
          if (data.ok) {
            // ถ้าแก้ข้อมูลของ "ตัวเอง" → อัปเดตโปรไฟล์ (ชื่อ/เบอร์/ตำแหน่ง/เพศ/อายุ) ทันที
            if (this.currentUser && String(u.id) === String(this.currentUser.id)) {
              this.currentUser = { ...this.currentUser, name: u.name.trim(), email: u.email.trim(), phone: u.phone.trim(), role: u.role, gender: u.gender, age: u.age };
            }
            this.usModalShow = false;
            await this.loadMembers();
            this.fbDone('บันทึกแล้ว');
          } else {
            this.fbFail(data.message || 'บันทึกไม่สำเร็จ');
          }
        } catch (e) {
          this.fbFail('บันทึกไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้');
        }
      },
      async usDeleteUser(user) {
        if (!(await this.fbAskDelete(`ต้องการลบบัญชี "${user.name || user.email}" ใช่หรือไม่?`))) return;
        this.fbLoading('กำลังลบ...');
        try {
          const res = await fetch(API + `/api/users/${user.id}`, {
            method: 'DELETE',
            headers: { Authorization: 'Bearer ' + this.token },
          });
          if (res.status === 401) { this.fbHide(); this.sessionExpired(); return; }
          const data = await res.json();
          if (data.ok) {
            this.members = this.members.filter(m => m.id !== user.id);
            this.fbDone('ลบข้อมูลแล้ว');
          } else {
            this.fbFail(data.message || 'ลบไม่สำเร็จ');
          }
        } catch (e) {
          this.fbFail('ลบไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้');
        }
      },
      // กำหนดบทบาท/ตำแหน่งให้ผู้ใช้ → บันทึกลง DB
      async setUserRole(user, role) {
        this.fbLoading('กำลังบันทึกบทบาท...');
        try {
          const res = await fetch(API + `/api/users/${user.id}/role`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.token },
            body: JSON.stringify({ role }),
          });
          if (res.status === 401) { this.fbHide(); this.sessionExpired(); return; }
          const data = await res.json();
          if (data.ok) {
            user.role = role;
            // ถ้าเปลี่ยนตำแหน่งของ "ตัวเอง" → อัปเดตโปรไฟล์ + สิทธิ์ทันที
            if (this.currentUser && String(user.id) === String(this.currentUser.id)) {
              this.currentUser = { ...this.currentUser, role };
            }
            this.fbDone('บันทึกแล้ว');
          } else {
            this.fbFail(data.message || 'บันทึกบทบาทไม่สำเร็จ');
          }
        } catch (e) {
          this.fbFail('บันทึกบทบาทไม่สำเร็จ — ตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์');
        }
      },
      dashExportPeriodRows(granularity) {
        // ถ้ามียอดขายรายวันจริงจาก DB → ใช้ของจริง (รายวัน/รายสัปดาห์)
        const real = (this.dashStats && this.dashStats.daily) || [];
        if (real.length && (granularity === 'day' || granularity === 'week')) {
          if (granularity === 'day') {
            return real.map(r => {
              const [y, m, dd] = r.date.split('-');
              return { period: `${dd}/${m}/${y}`, sales: Math.round(r.value) };
            });
          }
          // รวมเป็นรายสัปดาห์ (จันทร์–อาทิตย์)
          const buckets = new Map();
          real.forEach(r => {
            const dt = new Date(r.date + 'T00:00:00');
            const monday = new Date(dt);
            monday.setDate(dt.getDate() - ((dt.getDay() + 6) % 7));
            const key = monday.toISOString().slice(0, 10);
            const end = new Date(monday); end.setDate(monday.getDate() + 6);
            const fmt = (x) => `${String(x.getDate()).padStart(2, '0')}/${String(x.getMonth() + 1).padStart(2, '0')}/${x.getFullYear()}`;
            const cur = buckets.get(key) || { period: `${fmt(monday)} - ${fmt(end)}`, sales: 0 };
            cur.sales += Number(r.value) || 0;
            buckets.set(key, cur);
          });
          return [...buckets.values()].map(b => ({ ...b, sales: Math.round(b.sales) }));
        }
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

        // ---- ชีท 5: ออร์เดอร์ล่าสุด (ข้อมูลจริง) ----
        const ords = (this.dashStats && this.dashStats.recentOrders) || [];
        if (ords.length) {
          const ordAoa = [['เลขที่ออร์เดอร์', 'ลูกค้า', 'พนักงานขาย', 'จำนวนที่สั่ง', 'จำนวนที่เบิก', 'สถานะ'],
            ...ords.map(o => [o.order_no, o.customer, o.salesperson, Number(o.ordered_qty) || 0, Number(o.withdrawn_qty) || 0, o.status])];
          const ordSheet = XLSX.utils.aoa_to_sheet(ordAoa);
          ordSheet['!cols'] = [{ wch: 16 }, { wch: 24 }, { wch: 20 }, { wch: 14 }, { wch: 14 }, { wch: 18 }];
          XLSX.utils.book_append_sheet(wb, ordSheet, 'ออร์เดอร์ล่าสุด');
        }

        const suffix = granularity === 'day' ? 'รายวัน' : granularity === 'week' ? 'รายสัปดาห์' : 'รายเดือน';
        const today = new Date().toISOString().slice(0, 10);
        XLSX.writeFile(wb, `Dashboard-${suffix}-${this.dashTrendYear}-${today}.xlsx`);
      },
      dashExportPeriodRows(granularity) {
        // ถ้ามียอดขายรายวันจริงจาก DB → ใช้ของจริง (รายวัน/รายสัปดาห์)
        const real = (this.dashStats && this.dashStats.daily) || [];
        if (real.length && (granularity === 'day' || granularity === 'week')) {
          if (granularity === 'day') {
            return real.map(r => {
              const [y, m, dd] = r.date.split('-');
              return { period: `${dd}/${m}/${y}`, sales: Math.round(r.value) };
            });
          }
          // รวมเป็นรายสัปดาห์ (จันทร์–อาทิตย์)
          const buckets = new Map();
          real.forEach(r => {
            const dt = new Date(r.date + 'T00:00:00');
            const monday = new Date(dt);
            monday.setDate(dt.getDate() - ((dt.getDay() + 6) % 7));
            const key = monday.toISOString().slice(0, 10);
            const end = new Date(monday); end.setDate(monday.getDate() + 6);
            const fmt = (x) => `${String(x.getDate()).padStart(2, '0')}/${String(x.getMonth() + 1).padStart(2, '0')}/${x.getFullYear()}`;
            const cur = buckets.get(key) || { period: `${fmt(monday)} - ${fmt(end)}`, sales: 0 };
            cur.sales += Number(r.value) || 0;
            buckets.set(key, cur);
          });
          return [...buckets.values()].map(b => ({ ...b, sales: Math.round(b.sales) }));
        }
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

        // ---- ชีท 5: ออร์เดอร์ล่าสุด (ข้อมูลจริง) ----
        const ords = (this.dashStats && this.dashStats.recentOrders) || [];
        if (ords.length) {
          const ordAoa = [['เลขที่ออร์เดอร์', 'ลูกค้า', 'พนักงานขาย', 'จำนวนที่สั่ง', 'จำนวนที่เบิก', 'สถานะ'],
            ...ords.map(o => [o.order_no, o.customer, o.salesperson, Number(o.ordered_qty) || 0, Number(o.withdrawn_qty) || 0, o.status])];
          const ordSheet = XLSX.utils.aoa_to_sheet(ordAoa);
          ordSheet['!cols'] = [{ wch: 16 }, { wch: 24 }, { wch: 20 }, { wch: 14 }, { wch: 14 }, { wch: 18 }];
          XLSX.utils.book_append_sheet(wb, ordSheet, 'ออร์เดอร์ล่าสุด');
        }

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
        this.auth.setToken(null);
        this.auth.setCurrentUser({});
        // redirect ไปที่ login
        setTimeout(() => {
          this.$router.push('/login');
        }, 300);
      },
      resizeImageToDataUrl(file, maxSize = 220, quality = 0.85) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onerror = () => reject(new Error('อ่านไฟล์รูปไม่สำเร็จ'));
          reader.onload = () => {
            const img = new Image();
            img.onerror = () => reject(new Error('ไฟล์รูปไม่ถูกต้อง'));
            img.onload = () => {
              const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
              const w = Math.round(img.width * scale);
              const h = Math.round(img.height * scale);
              const canvas = document.createElement('canvas');
              canvas.width = w;
              canvas.height = h;
              canvas.getContext('2d').drawImage(img, 0, 0, w, h);
              resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.src = reader.result;
          };
          reader.readAsDataURL(file);
        });
      },
      settingsOpenEdit() {
        this.settingsEditForm = {
          name: this.currentUser.name || '',
          phone: this.currentUser.phone || '',
          avatar: this.currentUser.avatar || '',
        };
        this.settingsEditMsg = { type: '', text: '' };
        this.settingsEditOpen = true;
      },
      settingsCloseEdit() {
        this.settingsEditOpen = false;
      },
      async settingsHandleAvatarFile(e) {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
          this.settingsEditMsg = { type: 'error', text: '⚠️ กรุณาเลือกไฟล์รูปภาพ' };
          return;
        }
        try {
          this.settingsEditForm.avatar = await this.resizeImageToDataUrl(file);
        } catch (err) {
          this.settingsEditMsg = { type: 'error', text: '⚠️ ' + err.message };
        }
      },
      async settingsSaveProfile() {
        if (!this.settingsEditForm.name.trim()) {
          this.settingsEditMsg = { type: 'error', text: '⚠️ กรุณากรอกชื่อ' };
          return;
        }
        if (!/^0[0-9]{8,9}$/.test(this.settingsEditForm.phone.trim())) {
          this.settingsEditMsg = { type: 'error', text: '⚠️ รูปแบบเบอร์โทรไม่ถูกต้อง (เช่น 0812345678)' };
          return;
        }
        this.settingsEditSaving = true;
        this.settingsEditMsg = { type: '', text: '' };
        try {
          const res = await fetch(API + '/api/me', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.token },
            body: JSON.stringify(this.settingsEditForm),
          });
          if (res.status === 401) { this.sessionExpired(); return; }
          const data = await res.json();
          if (data.ok) {
            this.currentUser = { ...this.currentUser, ...data.user };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.settingsEditOpen = false;
          } else {
            this.settingsEditMsg = { type: 'error', text: '⚠️ ' + data.message };
          }
        } catch (err) {
          this.settingsEditMsg = { type: 'error', text: '⚠️ บันทึกไม่สำเร็จ — ตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์' };
        } finally {
          this.settingsEditSaving = false;
        }
      },
    },
}
</script>

<template>
  <div class="dashboard-page">
  <!-- ============ กล่องแจ้งผลกลาง (spinner/ติ๊กถูก/ยืนยัน) ============ -->
  <FeedbackModal />
  <!-- ============ Toast แจ้งเตือนมุมจอ ============ -->
  <ToastHost />
  <!-- ============ โมดัลสิทธิ์การเข้าใช้งาน ============ -->
  <PermissionModal />
<!-- ============ MOBILE TOP BAR ============ -->
  <div class="mobile-topbar">
    <button class="mobile-menu-btn" @click="mobileMenuOpen = true" title="เมนู" aria-label="เปิดเมนู">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>
    <BrandLogo compact :size="26" :text-size="17" />
  </div>

  <div class="sidebar-backdrop" v-if="mobileMenuOpen" @click="mobileMenuOpen = false"></div>

  <div class="app-wrapper">
    <!-- ============ SIDEBAR ============ -->
    <aside class="sidebar" :class="{ 'mobile-open': mobileMenuOpen }">
      <div class="sidebar-logo">
        <BrandLogo compact :size="32" :text-size="20" />
      </div>

      <!-- Utilities (Theme & Language) -->
      <div class="sidebar-utils">

        <div class="sidebar-lang-row">
          <!-- Language — บานพับออกด้านข้าง -->
          <div class="lang-flyout-container" :class="{ open: langDropdownOpen }">
            <button class="lang-flyout-btn" @click="toggleLangDropdown" title="Language">
              <span class="lang-flyout-label">🌐 Language <b class="lang-flyout-code">{{ (lang || 'th').toUpperCase() }}</b></span>
              <span class="lang-flyout-caret">▶</span>
            </button>
            <!-- เมนูลอยหน้าสุด (teleport ไป body เพื่อไม่โดน sidebar ตัดขอบ) -->
            <teleport to="body">
              <div v-if="langDropdownOpen" class="lang-flyout-backdrop" @click="langDropdownOpen = false"></div>
              <div v-if="langDropdownOpen" class="lang-flyout-menu-fixed"
                   :style="{ top: langFlyoutPos.top + 'px', left: langFlyoutPos.left + 'px' }">
                <div class="lang-flyout-item" :class="{ selected: lang === 'th' }" @click="setLanguage('th')">
                  <span>🇹🇭 ไทย (Thai)</span>
                  <span v-if="lang === 'th'" class="lang-flyout-check">✓</span>
                </div>
                <div class="lang-flyout-item" :class="{ selected: lang === 'en' }" @click="setLanguage('en')">
                  <span>🇬🇧 English (ENG)</span>
                  <span v-if="lang === 'en'" class="lang-flyout-check">✓</span>
                </div>
              </div>
            </teleport>
          </div>

          <!-- Theme Toggle -->
          <button class="theme-toggle" @click="toggleTheme" :title="theme === 'dark' ? 'โหมดกลางวัน' : 'โหมดกลางคืน'" aria-label="สลับโหมดกลางวัน/กลางคืน">
            <svg v-if="theme !== 'dark'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
          </button>
        </div>
      </div>

      <nav class="sidebar-menu">
        <div class="menu-item" :class="{ active: currentPage === 'dashboard' }" @click="currentPage = 'dashboard'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          <span>{{ t[lang].dashboard }}</span>
        </div>

        <!-- ====== ข้อมูลพื้นฐาน (เมนูหลัก + เมนูย่อย) ====== -->
        <div class="menu-group" v-if="menuGroupVisible(basicDataMenu)">
          <div class="menu-item menu-group-header"
               :class="{ active: openGroups.basic, 'has-open-child': basicDataMenu.some(c => c.children ? c.children.some(cc => cc.key === currentPage) : c.key === currentPage) }"
               @click="toggleGroup('basic')">
            <span class="menu-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg></span>
            <span class="menu-label">{{ t[lang].groupBasicData }}</span>
            <span class="menu-chevron" :class="{ open: openGroups.basic }">▾</span>
          </div>
          <transition name="dropdown">
            <div class="submenu" v-if="openGroups.basic">
              <template v-for="child in basicDataMenu.filter(c => c.children ? canAccessAny(c.children.map(x => x.key)) : canAccess(c.key))" :key="child.key">
                <template v-if="child.children">
                  <div class="submenu-item submenu-group-header"
                       :class="{ active: nestedFlyoutKey === child.key, 'has-open-child': child.children.some(cc => cc.key === currentPage) }"
                       @click="openNestedFlyout(child, $event)">
                    <span>{{ lang === 'th' ? child.label.th : child.label.en }}</span>
                    <span class="menu-chevron-right">›</span>
                  </div>
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
        <div class="menu-group" v-if="menuGroupVisible(poMenu)">
          <div class="menu-item menu-group-header"
               :class="{ active: openGroups.po, 'has-open-child': poMenu.some(c => c.key === currentPage) }"
               @click="toggleGroup('po')">
            <span class="menu-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></span>
            <span class="menu-label">{{ t[lang].groupPO }}</span>
            <span class="menu-chevron" :class="{ open: openGroups.po }">▾</span>
          </div>
          <transition name="dropdown">
            <div class="submenu" v-if="openGroups.po">
              <div class="submenu-item" v-for="child in poMenu.filter(c => canAccess(c.key))" :key="child.key"
                   :class="{ active: currentPage === child.key }" @click="currentPage = child.key">
                <span>{{ lang === 'th' ? child.label.th : child.label.en }}</span>
              </div>
            </div>
          </transition>
        </div>

        <!-- ====== จัดการสินค้า (เมนูหลัก + เมนูย่อย) ====== -->
        <div class="menu-group" v-if="menuGroupVisible(stockMenu)">
          <div class="menu-item menu-group-header"
               :class="{ active: openGroups.stock, 'has-open-child': stockMenu.some(c => c.key === currentPage) }"
               @click="toggleGroup('stock')">
            <span class="menu-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8v8a2 2 0 0 1-1 1.73l-6 3.46a2 2 0 0 1-2 0l-6-3.46A2 2 0 0 1 5 16V8"/><path d="m3.27 6.96 8.73 5.05 8.73-5.05"/><line x1="12" y1="22" x2="12" y2="12"/><path d="M8.5 4.27 16 8.5"/></svg></span>
            <span class="menu-label">{{ t[lang].groupStock }}</span>
            <span class="menu-chevron" :class="{ open: openGroups.stock }">▾</span>
          </div>
          <transition name="dropdown">
            <div class="submenu" v-if="openGroups.stock">
              <div class="submenu-item" v-for="child in stockMenu.filter(c => canAccess(c.key))" :key="child.key"
                   :class="{ active: currentPage === child.key }" @click="currentPage = child.key">
                <span>{{ lang === 'th' ? child.label.th : child.label.en }}</span>
              </div>
            </div>
          </transition>
        </div>

        <!-- ====== จัดการ VAT (เมนูหลัก + เมนูย่อย) ====== -->
        <div class="menu-group" v-if="menuGroupVisible(vatMenu)">
          <div class="menu-item menu-group-header"
               :class="{ active: openGroups.vat, 'has-open-child': vatMenu.some(c => c.key === currentPage) }"
               @click="toggleGroup('vat')">
            <span class="menu-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h9l3 3v17H6z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg></span>
            <span class="menu-label">{{ t[lang].groupVat }}</span>
            <span class="menu-chevron" :class="{ open: openGroups.vat }">▾</span>
          </div>
          <transition name="dropdown">
            <div class="submenu" v-if="openGroups.vat">
              <div class="submenu-item" v-for="child in vatMenu.filter(c => canAccess(c.key))" :key="child.key"
                   :class="{ active: currentPage === child.key }" @click="currentPage = child.key">
                <span>{{ lang === 'th' ? child.label.th : child.label.en }}</span>
              </div>
            </div>
          </transition>
        </div>

        <!-- ====== จัดการออร์เดอร์ (เมนูหลัก + เมนูย่อย) ====== -->
        <div class="menu-group" v-if="menuGroupVisible(orderMenu)">
          <div class="menu-item menu-group-header"
               :class="{ active: openGroups.order, 'has-open-child': orderMenu.some(c => c.key === currentPage) }"
               @click="toggleGroup('order')">
            <span class="menu-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 7v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-3-5Z"/><path d="M3 7h18"/><path d="M16 11a4 4 0 0 1-8 0"/></svg></span>
            <span class="menu-label">{{ t[lang].groupOrder }}</span>
            <span class="menu-chevron" :class="{ open: openGroups.order }">▾</span>
          </div>
          <transition name="dropdown">
            <div class="submenu" v-if="openGroups.order">
              <div class="submenu-item" v-for="child in orderMenu.filter(c => canAccess(c.key))" :key="child.key"
                   :class="{ active: currentPage === child.key }" @click="currentPage = child.key">
                <span>{{ lang === 'th' ? child.label.th : child.label.en }}</span>
              </div>
            </div>
          </transition>
        </div>

        <!-- ====== บัญชีลูกค้า (เมนูหลัก + เมนูย่อย) ====== -->
        <div class="menu-group" v-if="menuGroupVisible(custAccMenu)">
          <div class="menu-item menu-group-header"
               :class="{ active: openGroups.custAcc, 'has-open-child': custAccMenu.some(c => c.key === currentPage) }"
               @click="toggleGroup('custAcc')">
            <span class="menu-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></span>
            <span class="menu-label">{{ t[lang].groupCustAcc }}</span>
            <span class="menu-chevron" :class="{ open: openGroups.custAcc }">▾</span>
          </div>
          <transition name="dropdown">
            <div class="submenu" v-if="openGroups.custAcc">
              <div class="submenu-item" v-for="child in custAccMenu.filter(c => canAccess(c.key))" :key="child.key"
                   :class="{ active: currentPage === child.key }" @click="currentPage = child.key">
                <span>{{ lang === 'th' ? child.label.th : child.label.en }}</span>
              </div>
            </div>
          </transition>
        </div>

        <!-- ====== บัญชีคู่ค้า (เมนูหลัก + เมนูย่อย) ====== -->
        <div class="menu-group" v-if="menuGroupVisible(partnerAccMenu)">
          <div class="menu-item menu-group-header"
               :class="{ active: openGroups.partnerAcc, 'has-open-child': partnerAccMenu.some(c => c.key === currentPage) }"
               @click="toggleGroup('partnerAcc')">
            <span class="menu-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg></span>
            <span class="menu-label">{{ t[lang].groupPartnerAcc }}</span>
            <span class="menu-chevron" :class="{ open: openGroups.partnerAcc }">▾</span>
          </div>
          <transition name="dropdown">
            <div class="submenu" v-if="openGroups.partnerAcc">
              <div class="submenu-item" v-for="child in partnerAccMenu.filter(c => canAccess(c.key))" :key="child.key"
                   :class="{ active: currentPage === child.key }" @click="currentPage = child.key">
                <span>{{ lang === 'th' ? child.label.th : child.label.en }}</span>
              </div>
            </div>
          </transition>
        </div>

        <!-- ====== รายงาน (เมนูหลัก + เมนูย่อย) ====== -->
        <div class="menu-group" v-if="menuGroupVisible(reportMenu)">
          <div class="menu-item menu-group-header"
               :class="{ active: openGroups.report, 'has-open-child': reportMenu.some(c => c.children ? c.children.some(cc => cc.key === currentPage) : c.key === currentPage) }"
               @click="toggleGroup('report')">
            <span class="menu-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></span>
            <span class="menu-label">{{ t[lang].groupReport }}</span>
            <span class="menu-chevron" :class="{ open: openGroups.report }">▾</span>
          </div>
          <transition name="dropdown">
            <div class="submenu" v-if="openGroups.report">
              <template v-for="child in reportMenu.filter(c => c.children ? canAccessAny(c.children.map(x => x.key)) : canAccess(c.key))" :key="child.key">
                <template v-if="child.children">
                  <div class="submenu-item submenu-group-header"
                       :class="{ active: nestedFlyoutKey === child.key, 'has-open-child': child.children.some(cc => cc.key === currentPage) }"
                       @click="openNestedFlyout(child, $event)">
                    <span>{{ lang === 'th' ? child.label.th : child.label.en }}</span>
                    <span class="menu-chevron-right">›</span>
                  </div>
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

        <div class="menu-item" v-if="canAccess('sales-contract')" :class="{ active: currentPage === 'sales-contract' }" @click="currentPage = 'sales-contract'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/></svg>
          <span>{{ t[lang].salesContractTitle }}</span>
        </div>

        <!-- ====== ผู้ใช้งาน (เมนูหลัก + เมนูย่อย) ====== -->
        <div class="menu-group" v-if="menuGroupVisible(usersMenu)">
          <div class="menu-item menu-group-header"
               :class="{ active: openGroups.usersGrp, 'has-open-child': usersMenu.some(c => c.key === currentPage) }"
               @click="toggleGroup('usersGrp')">
            <span class="menu-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
            <span class="menu-label">{{ t[lang].groupUsers }}</span>
            <span class="menu-chevron" :class="{ open: openGroups.usersGrp }">▾</span>
          </div>
          <transition name="dropdown">
            <div class="submenu" v-if="openGroups.usersGrp">
              <div class="submenu-item" v-for="child in usersMenu.filter(c => canAccess(c.key))" :key="child.key"
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

      <!-- เมนูย่อยซ้อน (cascading) — ลอยออกด้านข้าง ไม่โดน sidebar ตัดขอบ -->
      <teleport to="body">
        <div v-if="nestedFlyoutKey" class="nested-flyout-backdrop" @click="nestedFlyoutKey = null"></div>
        <div v-if="nestedFlyoutKey" class="nested-flyout"
             :style="{ top: nestedFlyoutPos.top + 'px', left: nestedFlyoutPos.left + 'px' }">
          <div class="nested-flyout-item" v-for="gchild in nestedFlyoutChildren" :key="gchild.key"
               :class="{ active: currentPage === gchild.key }"
               @click="goToMenu(gchild); nestedFlyoutKey = null">
            <span>{{ lang === 'th' ? gchild.label.th : gchild.label.en }}</span>
          </div>
        </div>
      </teleport>

      <div class="sidebar-footer">
        <!-- ชื่อ/อีเมลผู้ใช้ แสดงที่โปรไฟล์มุมขวาบนแล้ว ไม่ต้องซ้ำตรงนี้ -->
        <button class="logout-btn" @click="logout">{{ t[lang].logout }}</button>
      </div>
    </aside>

    <!-- ============ MAIN CONTENT ============ -->
    <main class="main main-fit">
      <TopNavbar />
      <div class="main-content" :class="{ 'fr-tight': ['fabric-regular','fabric-irregular','fabric-regular-group','fabric-irregular-group','fabric-raw','customers','partners','employee-info','fabric-info-structure','fabric-info-composition','fabric-info-width','fabric-info-finishing','fabric-info-weight','note-info','order-receive','order-fulfill','zone-rack'].includes(currentPage) }">
      <!-- breadcrumb ย้ายขึ้นไปอยู่ใน TopNavbar (ระนาบเดียวกับแถบขวา) -->
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

      <!-- ============ กลุ่มผ้าประจำ / กลุ่มผ้าไม่ประจำ (ใช้ component เดียวกัน) ============ -->
      <FabricRegularGroupPage v-else-if="currentPage === 'fabric-regular-group' || currentPage === 'fabric-irregular-group'" />

      <!-- ============ ผ้าไม่ประจำ ============ -->
      <FabricIrregularPage v-else-if="currentPage === 'fabric-irregular'" />

      <!-- ============ ผ้าดิบ ============ -->
      <FabricRawPage v-else-if="currentPage === 'fabric-raw'" />

      <!-- ============ คู่ค้า ============ -->
      <PartnersPage v-else-if="currentPage === 'partners'" />

      <!-- ============ ข้อมูลพนักงาน (ดึงจากบัญชีผู้ใช้ แยกตามตำแหน่ง) ============ -->
      <EmployeePage v-else-if="currentPage === 'employee-info'" />

      <!-- ============ ข้อมูลผ้า: โครงสร้าง/ส่วนประกอบ/หน้ากว้าง/Finishing/น้ำหนัก (component เดียว) ============ -->
      <MasterDataPage v-else-if="['fabric-info-structure','fabric-info-composition','fabric-info-width','fabric-info-finishing','fabric-info-weight'].includes(currentPage)" />

      <!-- ============ ข้อมูลหมายเหตุ ============ -->
      <NoteInfoPage v-else-if="currentPage === 'note-info'" />

      <!-- ============ ลูกค้า (ข้อมูลร้านค้า) ============ -->
      <CustomersPage v-else-if="currentPage === 'customers'" />

      <!-- ============ WMS: โซน & แร็ค (ผังคลัง) ============ -->
      <ZoneRackPage v-else-if="currentPage === 'zone-rack'" />

      <!-- ============ ข้อมูลพื้นฐาน (เมนูย่อยทั้ง 9 หน้า) ============ -->
      <BasicDataGenericPage v-else-if="basicDataPages[currentPage]" />

      <!-- ============ เปิดใบสั่งซื้อ: ผ้าสำเร็จ (ฟอร์มจริง + PDF) ============ -->
      <PoFabricFinishedPage v-else-if="currentPage === 'po-fabric-finished'" />

      <!-- ============ เปิดใบสั่งซื้อ: ผ้าดิบ ============ -->
      <PoFabricRawPage v-else-if="currentPage === 'po-fabric-raw'" />

      <!-- ============ เปิดใบสั่งซื้อ: สั่งย้อม ============ -->
      <PoDyeOrderPage v-else-if="currentPage === 'po-dye-order'" />

      <!-- ============ เปิดใบสั่งซื้อ (เมนูย่อยที่เหลือ) ============ -->
      <PoGenericPage v-else-if="poPages[currentPage]" />

      <!-- ============ จัดการสินค้า (เมนูย่อยทั้ง 7 หน้า) ============ -->
      <!-- ============ รับผ้าสำเร็จ (เอกสารรับ + autofill จากผ้า) ============ -->
      <GoodsFinishedReceivePage v-else-if="currentPage === 'receive-fabric-finished'" />

      <!-- ============ รับผ้าดิบ (เอกสารรับ + autofill จากผ้าดิบ, เลข IN รันร่วม) ============ -->
      <GoodsRawReceivePage v-else-if="currentPage === 'receive-fabric-raw'" />

      <!-- ============ รับผ้าย้อม (อ้างอิงใบสั่งย้อม + QR รายม้วน, เลข IN รันร่วม) ============ -->
      <GoodsDyedReceivePage v-else-if="currentPage === 'receive-fabric-dyed'" />

      <!-- ============ WMS: ประวัติเคลื่อนไหวสต็อก ============ -->
      <StockHistoryPage v-else-if="currentPage === 'stock-history'" />

      <!-- ============ ย้ายสินค้า (TR) / ย้ายผ้าดิบ (TG) ============ -->
      <GoodsTransferPage v-else-if="currentPage === 'move-stock'" />
      <RawTransferPage v-else-if="currentPage === 'move-fabric-raw'" />
      <RackTransferPage v-else-if="currentPage === 'move-shelf'" />
      <BarcodePage v-else-if="currentPage === 'barcode'" />

      <StockGenericPage v-else-if="stockPages[currentPage]" />

      <!-- ============ จัดการ VAT (เมนูย่อยทั้ง 5 หน้า) ============ -->
      <VatProductGroupPage v-else-if="currentPage === 'vat-product-group'" />
      <VatReceivePage v-else-if="currentPage === 'vat-receive'" />
      <VatStockCutPage v-else-if="currentPage === 'vat-stock-cut'" />
      <VatInvoicePage v-else-if="currentPage === 'vat-invoice'" />
      <VatInvoiceCutPage v-else-if="currentPage === 'vat-stock-cut-from-invoice'" />
      <VatGenericPage v-else-if="vatPages[currentPage]" />

      <!-- ============ รับออร์เดอร์ (Order Entry Form) ============ -->
      <OrderReceivePage v-else-if="currentPage === 'order-receive'" />

      <!-- ============ จัดออร์เดอร์ (Order Fulfillment) ============ -->
      <OrderFulfillPage v-else-if="currentPage === 'order-fulfill'" />
      <OrderFulfillDetailPage v-else-if="currentPage === 'order-fulfill-detail'" />

      <!-- ============ จัดการออร์เดอร์ (เมนูย่อยทั้ง 4 หน้า) ============ -->
      <InvoiceOpenPage v-else-if="currentPage === 'invoice-open'" />
      <InvoiceReturnPage v-else-if="currentPage === 'invoice-return'" />
      <OrderGenericPage v-else-if="orderPages[currentPage]" />

      <!-- ============ บัญชีลูกค้า (เมนูย่อยทั้ง 4 หน้า) ============ -->
      <PaymentPage v-else-if="currentPage === 'receive-payment-customer'" mode="receive" />
      <CreditNotePage v-else-if="currentPage === 'credit-note-customer'" party-type="customer" />
      <AccountDeductPage v-else-if="currentPage === 'deduct-customer-account'" party-type="customer" />
      <CustomerBillingPage v-else-if="currentPage === 'billing-customer'" />
      <CustAccGenericPage v-else-if="custAccPages[currentPage]" />

      <!-- ============ บัญชีคู่ค้า (เมนูย่อยทั้ง 3 หน้า) ============ -->
      <PaymentPage v-else-if="currentPage === 'pay-partner'" mode="pay" />
      <CreditNotePage v-else-if="currentPage === 'credit-note-partner'" party-type="partner" />
      <AccountDeductPage v-else-if="currentPage === 'deduct-partner-account'" party-type="partner" />
      <PartnerAccGenericPage v-else-if="partnerAccPages[currentPage]" />
      <!-- ============ รายงาน (เมนูย่อยทั้ง 14 หน้า) — ดึงข้อมูลจริงจาก DB ============ -->
      <StockInventoryReportPage v-else-if="currentPage === 'report-stock'" />
      <VatStockReportPage v-else-if="currentPage === 'report-vat-stock'" />
      <VatReceiveReportPage v-else-if="currentPage === 'report-vat-receive'" />
      <VatIssueReportPage v-else-if="currentPage === 'report-vat-issue'" />
      <ShelfStockReportPage v-else-if="currentPage === 'report-stock-shelf'" />
      <RawStockReportPage v-else-if="currentPage === 'report-stock-raw'" />
      <GoodsReceiptReportPage v-else-if="currentPage === 'report-stock-receive'" />
      <GoodsIssueReportPage v-else-if="currentPage === 'report-stock-issue'" />
      <GoodsTransferReportPage v-else-if="currentPage === 'report-stock-move'" />
      <RawTransferReportPage v-else-if="currentPage === 'report-stock-move-raw'" />
      <RackTransferReportPage v-else-if="currentPage === 'report-stock-move-shelf'" />
      <PoReportPage v-else-if="currentPage === 'report-po'" />
      <OrderReportPage v-else-if="currentPage === 'report-order'" />
      <DyeOrderReportPage v-else-if="currentPage === 'report-dye-order'" />
      <SalesContractReportPage v-else-if="currentPage === 'report-sales-contract'" />
      <SalesReportPage v-else-if="currentPage === 'report-sales-ws'" mode="wholesale" />
      <SalesReportPage v-else-if="currentPage === 'report-sales-rt'" mode="retail" />
      <SalesReportPage v-else-if="currentPage === 'report-sales'" mode="all" />
      <InvoiceReturnReportPage v-else-if="currentPage === 'report-sales-return'" />
      <VatInvoiceReportPage v-else-if="currentPage === 'report-tax-invoice'" />
      <ProfitLossReportPage v-else-if="currentPage === 'report-pl-ws'" mode="wholesale" />
      <ProfitLossReportPage v-else-if="currentPage === 'report-pl-rt'" mode="retail" />
      <ProfitLossYearlyPage v-else-if="currentPage === 'report-pl-year'" />
      <BillingReportPage v-else-if="currentPage === 'report-cust-billing'" />
      <CustomerPaymentReportPage v-else-if="currentPage === 'report-cust-receive'" mode="receive" />
      <CustomerPaymentReportPage v-else-if="currentPage === 'report-partner-pay'" mode="pay" />
      <CreditNoteReportPage v-else-if="currentPage === 'report-cust-credit'" mode="customer" />
      <CreditNoteReportPage v-else-if="currentPage === 'report-partner-credit'" mode="partner" />
      <ReorderPointReportPage v-else-if="currentPage === 'report-reorder-point'" />
      <AnnualSummaryPage v-else-if="currentPage === 'report-annual-summary'" />
      <OtherReportPage v-else-if="currentPage === 'report-other-price'" report-type="price" />
      <OtherReportPage v-else-if="currentPage === 'report-other-adjust'" report-type="adjust" />
      <OtherReportPage v-else-if="currentPage === 'report-other-fold'" report-type="fold" />
      <OtherReportPage v-else-if="currentPage === 'report-other-barcode'" report-type="barcode" />
      <ReportViewPage v-else-if="reportPages[currentPage]" />

      <!-- ============ สิทธิ์การเข้าใช้งาน ============ -->
      <UserPermissionsPage v-else-if="currentPage === 'user-permissions'" />

      <!-- ============ สัญญาขาย ============ -->
      <SalesContractPage v-else-if="currentPage === 'sales-contract'" />
      </div>
    </main>
  </div>

  <!-- ============ ใบออร์เดอร์ (Order Slip / Print Preview) ============ -->
  <OrderSlipModal v-if="order.oeShowSlip" />

  <!-- ============ Modal: แก้ไขข้อมูลลูกค้า ============ -->
  <CustomerEditModal v-if="customer.cmShowEditModal" />

  <!-- ============ Modal: เฉดสี (ใช้ร่วมกันทั้งผ้าประจำและผ้าไม่ประจำ) ============ -->
  <ShadeModal v-if="frShowShadeModal" />
  </div>
</template>

<style>
  /* ============ SIDEBAR UTILS ============ */
  .sidebar-utils {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0 0 16px 0;
    border-bottom: 1px solid var(--field-border);
  }
  .sidebar-lang-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  /* ---- Language แบบบานพับออกข้าง ---- */
  .lang-flyout-container { position: relative; }
  .lang-flyout-btn {
    display: flex; align-items: center; justify-content: space-between; gap: 6px;
    width: 100%; min-width: 0; padding: 5px 8px; border-radius: 7px;
    border: 1px solid var(--field-border); background: var(--surface);
    color: var(--text); font-size: 11px; font-weight: 600; cursor: pointer;
    white-space: nowrap;              /* อยู่แถวเดียว ไม่ตกบรรทัด */
    transition: background .2s, border-color .2s;
  }
  .lang-flyout-label { display: inline-flex; align-items: center; gap: 4px; white-space: nowrap; overflow: hidden; }
  .lang-flyout-btn:hover { background: var(--field); border-color: var(--brand); }
  .lang-flyout-code { color: var(--brand); font-weight: 700; margin-left: 2px; }
  .lang-flyout-caret { font-size: 9px; opacity: .6; transition: transform .2s; }
  .lang-flyout-container.open .lang-flyout-caret { transform: rotate(90deg); }
  /* เมนูภาษาแบบลอยหน้าสุด (teleport ไป body) */
  .lang-flyout-backdrop { position: fixed; inset: 0; z-index: 2999; }
  .lang-flyout-menu-fixed {
    position: fixed; min-width: 180px;
    background: var(--surface); border: 1px solid var(--field-border);
    border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,.2);
    padding: 6px; z-index: 3000;
    font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif;
    animation: langFlyIn .16s ease;
  }
  @keyframes langFlyIn { from { opacity: 0; transform: translateX(-6px); } to { opacity: 1; transform: translateX(0); } }

  /* ลูกศร › สำหรับเมนูย่อยซ้อน */
  .menu-chevron-right { margin-left: auto; font-size: 14px; opacity: 1; font-weight: 800; color: var(--brand); }
  .submenu-item.submenu-group-header { font-weight: 600; }
  /* เมนูย่อยซ้อน (cascading) ลอยออกข้าง */
  .nested-flyout-backdrop { position: fixed; inset: 0; z-index: 2999; }
  .nested-flyout {
    position: fixed; min-width: 190px;
    background: var(--surface); border: 1px solid var(--field-border);
    border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,.2);
    padding: 6px; z-index: 3000;
    font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif;
    animation: langFlyIn .16s ease;
  }
  .nested-flyout-item {
    padding: 6px 10px; border-radius: 7px; font-size: 12px; color: var(--text);
    cursor: pointer; transition: background .15s;
  }
  .nested-flyout-item:hover { background: var(--field); }
  .nested-flyout-item.active { background: var(--brand-soft); color: var(--brand-2); font-weight: 600; }
  .lang-flyout-item {
    display: flex; align-items: center; justify-content: space-between; gap: 10px;
    padding: 6px 10px; border-radius: 7px; font-size: 12px; color: var(--text);
    cursor: pointer; transition: background .15s;
  }
  .lang-flyout-item:hover { background: var(--field); }
  .lang-flyout-item.selected { background: var(--brand-soft); color: var(--brand-2); font-weight: 600; }
  .lang-flyout-check { color: var(--brand); font-weight: 700; }
  .sidebar-notif-row {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .sidebar-notif-item {
    position: relative;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: 1px solid var(--field-border);
    cursor: pointer;
    display: grid;
    place-items: center;
    transition: transform .15s ease, background .15s ease, border-color .15s ease;
    flex-shrink: 0;
  }
  .sidebar-notif-item svg { width: 14px; height: 14px; display: block; }
  .sidebar-notif-item:hover { transform: translateY(-2px); border-color: currentColor; }
  .sidebar-notif-item:active { transform: translateY(0); }
  .sidebar-notif-item.notif-fulfill,
  .sidebar-notif-item.notif-invoice,
  .sidebar-notif-item.notif-vat { background: var(--field); color: var(--text); }
  .sidebar-notif-item.notif-fulfill:hover,
  .sidebar-notif-item.notif-invoice:hover,
  .sidebar-notif-item.notif-vat:hover { background: var(--brand-soft); color: var(--brand); border-color: var(--brand); }
  .sidebar-notif-count {
    position: absolute;
    top: -4px;
    right: -4px;
    min-width: 14px;
    height: 14px;
    padding: 0 4px;
    border-radius: 20px;
    background: var(--danger);
    color: #fff;
    font-size: 9px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    box-shadow: 0 0 0 2px var(--surface);
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
    width: 28px; height: 28px; border-radius: 7px;
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
  .mobile-topbar .brand-text { font-weight: 700; font-size: 13px; color: var(--text); }

  .sidebar-backdrop {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(10, 14, 30, .45);
    z-index: 1550;
  }

  .app-wrapper {
    display: grid;
    grid-template-columns: 196px 1fr;
    min-height: 100vh;
    gap: 0;
    position: relative;
  }

  /* ============ SIDEBAR ============ */
  .sidebar {
    background: var(--surface);
    border-right: 1px solid var(--field-border);
    padding: 12px 9px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: sticky;
    top: 0;
    max-height: 100vh;
    overflow-y: auto;
  }

  .sidebar-logo {
    display: flex;
    align-items: center;
    gap: 9px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--field-border);
  }
  .sidebar-logo .icon { width: 26px; height: 26px; background: var(--brand); border-radius: 7px; }
  .sidebar-logo .text { font-weight: 700; font-size: 14px; color: var(--text); }

  .sidebar-menu { display: flex; flex-direction: column; gap: 2px; }
  .menu-item {
    padding: 6px 9px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    color: var(--text);
    transition: background .2s, color .2s;
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid transparent;
  }
  .menu-item:hover { background: var(--field); color: var(--text); }
  .menu-item.active { background: var(--brand-soft); color: var(--brand); border-color: var(--brand); }
  .menu-item svg { width: 15px; height: 15px; }

  .sidebar-divider { height: 1px; background: var(--field-border); }

  /* ============ SIDEBAR SUBMENU (ERP, dropdown) ============ */
  .menu-group-header { justify-content: space-between; }
  .menu-icon { width: 18px; height: 18px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .menu-label { flex: 1; }
  .menu-chevron { font-size: 15px; line-height: 1; color: var(--text); opacity: .7; transition: transform .2s ease; }
  .menu-chevron.open { transform: rotate(180deg); }
  .menu-group-header.has-open-child:not(.active) { color: var(--brand); font-weight: 600; }

  .submenu {
    display: flex;
    flex-direction: column;
    margin: 4px 0 6px 8px;
    padding: 4px;
    background: var(--surface);
    border-radius: 10px;
    border: 1px solid var(--field-border);
    box-shadow: 0 8px 20px rgba(20, 30, 70, .10), 0 1px 3px rgba(20, 30, 70, .06);
  }
  /* เมนูย่อยทุกชั้น = ขนาดเดียวกับเมนูหลัก (12px) */
  .submenu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 9px;
    font-size: 12px;
    border-radius: 8px;
    font-weight: 500;
    color: var(--text);
    cursor: pointer;
    transition: background .15s, color .15s;
    border-bottom: 1px solid var(--field-border);
  }
  .submenu-item svg { width: 15px; height: 15px; }
  .submenu-item:last-child { border-bottom: none; }
  .submenu-item:hover { background: var(--field); }
  .submenu-item.active { background: var(--brand-soft); color: var(--brand); font-weight: 600; }
  .menu-badge { margin-left: auto; background: #e03131; color: #fff; font-size: 10.5px; font-weight: 700; line-height: 1; padding: 3px 6px; border-radius: 999px; }

  .submenu-item.submenu-group-header { justify-content: space-between; }
  .submenu-item.submenu-group-header.has-open-child:not(.active) { color: var(--brand); font-weight: 600; }
  .submenu-nested { margin: 3px 0 3px 10px; box-shadow: none; }
  .submenu-nested .submenu-item { font-size: 12px; }


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
    padding-top: 10px;
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
    padding: 7px 12px;
    border: 1px solid var(--field-border);
    background: transparent;
    color: var(--muted);
    border-radius: 8px;
    font-size: 12px;
    cursor: pointer;
    transition: background .2s, color .2s, border-color .2s;
  }
  .logout-btn:hover { background: var(--danger); color: #fff; border-color: var(--danger); }

  /* ============ MAIN CONTENT ============ */
  .main {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .main-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    padding: 14px 32px 32px;
    gap: 8px;
    overflow-y: auto;
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
  .header-actions { display: flex; gap: 14px; flex-wrap: wrap; row-gap: 8px; align-items: center; }
  .dash-fit .header { margin-top: 2px; }
  .dash-fit .header-actions { gap: 10px; }
  .dash-fit .header-actions .btn-small { padding: 8px 14px; }
  .btn-small {
    padding: 6px 13px;
    border: 1px solid var(--field-border);
    background: var(--surface);
    color: var(--text);
    border-radius: 8px;
    font-size: 12px;
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
  /* ปุ่มส่งออก Excel — สีเขียว */
  .btn-green { background: #1a9c54 !important; color: #fff !important; border-color: #1a9c54 !important; }
  .btn-green:hover { background: #158045 !important; border-color: #158045 !important; }
  .xls-ico { width: 15px; height: 15px; display: inline-block; vertical-align: -3px; margin-right: 4px; flex-shrink: 0; }

  /* ============ STATS GRID ============ */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
  }
  .dash-charts-row { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-top: 24px; }
  .dash-cards-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; margin-top: 24px; width: 100%; box-sizing: border-box; }
  .mini-stat-card {
    min-width: 0;
    background: var(--surface);
    border: 1px solid var(--field-border);
    border-left: 3px solid var(--muted);
    border-radius: 10px;
    padding: 8px 12px;
    box-sizing: border-box;
    overflow: hidden;
  }
  .mini-stat-pink { border-left-color: var(--pink); }
  .mini-stat-purple { border-left-color: var(--purple); }
  .mini-stat-blue { border-left-color: var(--blue); }
  .mini-stat-orange { border-left-color: var(--orange); }
  .mini-stat-label { font-size: 10.5px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .mini-stat-value { font-size: 18px; font-weight: 700; color: var(--text); margin: 2px 0; }
  .mini-stat-detail { font-size: 10px; color: var(--muted); }
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
  .main-content.fr-tight { padding-top: 10px; gap: 2px; }
  .main-content.fr-tight .breadcrumb-bar { margin-bottom: 0; }
  .main-content.fr-tight .fr-page-compact .header { margin: 0; }
  .main-content.fr-tight .fr-page-compact .header h1 { line-height: 1.1; }
  .main-content.fr-tight .fr-page-compact > .section:first-of-type { margin-top: 6px !important; }
  .fr-page-compact .header h1 { font-size: 18px; }
  .fr-page-compact .section-header h2 { font-size: 13px; }
  .fr-page-compact .section:not(.fr-table-section) {
    padding: 12px 16px;
  }
  .fr-page-compact .section:not(.fr-table-section) .section-header {
    margin-bottom: 8px;
    padding-bottom: 6px;
  }
  .fr-page-compact .fr-field-group { gap: 3px; }
  .fr-page-compact .fr-summary { margin: 4px 0; }
  .fr-page-compact {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    padding-bottom: 44px;
  }
  .fr-page-compact > * { flex-shrink: 0; }
  .fr-table-section {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
  /* กรอบการ์ดตาราง — ใช้ compound selector ให้ชนะ .section (เห็นเส้นบน/ล่าง/ข้างชัดทั้งสองธีม) */
  .section.fr-table-section { border-color: var(--table-line); }
  .fr-table-section .fr-table-scroll {
    flex: 1;
    min-height: 0;
    max-height: none;
  }
  /* ให้ตารางแสดง ~15 แถวพอดีจอ — บีบตัวหนังสือ/แถว และจัดพื้นที่ด้านบนให้กระชับ
     (ไม่ตั้ง min-height เพื่อไม่ให้ดันแถบเปลี่ยนหน้าตกขอบ — ใช้ flex เติมพื้นที่ที่เหลือแทน) */
  .main-content.fr-tight .fr-table thead th { padding: 7px 12px; font-size: 11px; }
  .main-content.fr-tight .fr-table tbody td { padding: 3px 12px; font-size: 12px; }
  .main-content.fr-tight .fr-td-wrap { -webkit-line-clamp: 1; }
  /* ตัวกรองด้านบนกระชับลง */
  .main-content.fr-tight .fr-page-compact .section:not(.fr-table-section) { padding: 8px 14px; }
  .main-content.fr-tight .fr-page-compact .section:not(.fr-table-section) .section-header { margin-bottom: 6px; padding-bottom: 4px; }
  .main-content.fr-tight .fr-page-compact .section:not(.fr-table-section) .section-header h2 { font-size: 13px; }
  .main-content.fr-tight .fr-filter-grid { gap: 6px 14px !important; }
  .main-content.fr-tight .fr-field-group label { font-size: 11px; }
  .main-content.fr-tight .fr-field-group input,
  .main-content.fr-tight .fr-field-group select { padding: 5px 9px; font-size: 12.5px; }
  .main-content.fr-tight .fr-filter-actions { margin-top: 8px; }
  .main-content.fr-tight .fr-summary-row { margin: 4px 0; }
  /* ปุ่มเล็กลงบนหน้าที่ล็อกจอ */
  .main-content.fr-tight .fr-btn-util { padding: 6px 12px; font-size: 12px; }
  .main-content.fr-tight .btn-small { padding: 6px 12px; font-size: 12px; border-radius: 8px; }
  .main-content.fr-tight .fr-bulk-btn { height: 28px; padding: 0 10px; font-size: 12px; }
  .main-content.fr-tight .fr-action-btn { width: 24px; height: 24px; }
  .main-content.fr-tight .xl-pagination { margin-top: 8px; font-size: 12px; }
  .dash-fit {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    min-height: 0;
    overflow: hidden;          /* ฟิกให้พอดี 1 หน้าจอ — เนื้อหาที่เกินเลื่อนในกล่องของมันเอง */
  }

  .dash-fit .header {
    flex-shrink: 0;
    align-items: flex-start;
  }
  .dash-fit .header h1 { font-size: 18px; }
  .dash-fit .header p { display: none; }
  .dash-fit .header-actions .btn-small { padding: 6px 12px; font-size: 12px; }
  .dash-fit .stats-grid { flex-shrink: 0; gap: 10px; }
  .dash-fit .stats-grid .stat-card { padding: 14px 18px; min-height: 92px; }
  .dash-fit .stats-grid .stat-icon { width: 34px; height: 34px; border-radius: 10px; top: 12px; right: 14px; margin-bottom: 0; }
  .dash-fit .stats-grid .stat-icon svg { width: 16px; height: 16px; }
  .dash-fit .stats-grid .label { font-size: 11.5px; }
  .dash-fit .stats-grid .value { font-size: 27px; margin: 4px 0; }
  .dash-fit .stats-grid .detail { font-size: 11.5px; }
  /* หน้าแรกพอดีจอเดียว — แถวกราฟ/กิจกรรมยืดเต็มพื้นที่ที่เหลือ (การ์ดสถิติเตี้ยลงเพื่อเผื่อที่ให้กราฟ) */
  .dash-fit .dash-flex-row { flex: 1 1 0; min-height: 0; margin-top: 0; }
  .dash-fit .dash-charts-row { min-height: 236px; }   /* กราฟมีความสูงพอเสมอ ไม่ถูกบีบจนอัด/legend หาย */
  /* กล่องในแถวที่ยืดหด: เนื้อหาเกินให้เลื่อนในกล่อง ไม่ดันทั้งหน้า */
  .dash-fit .dash-flex-row > .section { min-height: 0; display: flex; flex-direction: column; }
  .dash-fit .dash-scroll-body { flex: 1; min-height: 0; overflow-y: auto; }
  .dash-fit .dash-activity-row .section { overflow: hidden; }   /* แบ่งพื้นที่ที่เหลือให้พอดีจอ */
  .dash-fit .dash-cards-grid-compact { flex-shrink: 0; margin-top: 0; gap: 10px; }
  .dash-fit .stats-grid .stat-card { min-height: 84px; padding: 12px 16px; }
  .dash-fit .stats-grid .value { font-size: 24px; }
  .dash-chart-section {
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;   /* กันกราฟหลุดออกนอกกรอบการ์ดตอนปรับแต่ง/ย่อขยาย */
    padding: 8px 18px 12px;
  }
  .dash-chart-section .section-header,
  .dash-list-section .section-header {
    margin-bottom: 3px;
    padding-bottom: 4px;
  }
  .dash-chart-section .section-header h2,
  .dash-list-section .section-header h2 { font-size: 13px; }
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
  .dash-linechart-box { flex-direction: column; }
  .dash-linechart { position: relative; width: 100%; flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 4px; }
  .dash-linechart-plot { position: relative; flex: 1; min-height: 0; overflow: hidden; }
  .dash-line-svg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block; }
  .dash-grid-line { stroke: var(--field-border); stroke-width: 1; }
  .dash-line-stroke { fill: none; stroke: #c9a227; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
  .dash-line-stroke-2 { fill: none; stroke: #3b6ef5; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; opacity: .8; }
  .dash-line-dots { position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; }
  .dash-hit { position: absolute; width: 18px; height: 18px; transform: translate(-50%, -50%); cursor: pointer; pointer-events: auto; }
  .dash-axis-y { position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; }
  .dash-axis-y span {
    position: absolute;
    left: 0;
    transform: translateY(-50%);
    font-size: 10px;
    color: var(--muted);
    white-space: nowrap;
  }
  .dash-chart-xaxis { position: relative; left: 0; right: 0; height: 15px; margin-top: 3px; flex-shrink: 0; }
  .dash-chart-xaxis span {
    position: absolute;
    bottom: 0;
    transform: translateX(-50%);
    font-size: 9.5px;
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
    padding-top: 8px;
    margin-top: 4px;
  }
  /* ============ Dashboard: แนวโน้มยอดขาย — แบ่งเลเยอร์ แท่ง(ซ้าย) + เส้น(ขวา) ============ */
  .dash-trend-split { flex: 1; min-height: 0; display: flex; gap: 18px; }
  .dash-trend-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
  .dash-trend-col-right { padding-left: 18px; border-left: 1px solid var(--field-border); }
  .dash-trend-col-header { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
  .dash-trend-col-title { font-size: 12px; font-weight: 600; color: var(--muted); }
  .dash-trend-legend { display: flex; gap: 16px; margin: 4px 0 2px; font-size: 11px; color: var(--muted); }
  .dash-trend-legend .dtl { display: inline-flex; align-items: center; gap: 6px; }
  .dash-trend-legend .dtl-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
  .dtl-a { background: #c9a227; }
  .dtl-b { background: #3b6ef5; }
  .dash-trend-col-controls { display: flex; gap: 5px; align-items: center; flex-wrap: wrap; }
  /* ปุ่มช่วงเวลาในกราฟ — เล็กกระชับ ไม่เบียดพื้นที่กราฟ */
  .dash-trend-col-controls .btn-small,
  .dash-trend-col-header select {
    padding: 4px 10px;
    font-size: 11.5px;
    border-radius: 7px;
    line-height: 1.5;
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
  @media (max-width: 1100px) {
    .dash-trend-split { flex-direction: column; }
    .dash-trend-col-right { padding-left: 0; border-left: none; padding-top: 12px; border-top: 1px solid var(--field-border); }
  }

  /* ============ Dashboard: กราฟแท่งแนวโน้มยอดขาย เทียบปีต่อปี ============ */
  /* กราฟแท่ง: กันพื้นที่ให้แท่ง + ป้ายเดือน + legend แยกชั้นกันชัด ไม่ทับกัน */
  .dash-barchart-box { padding: 10px; display: flex; flex-direction: column; min-height: 0; }
  .dash-barchart { position: relative; width: 100%; flex: 1; min-height: 90px; display: flex; flex-direction: row; align-items: stretch; gap: 4px; }
  .dash-bar-axis-y { position: static; display: flex; flex-direction: column; justify-content: space-between; width: 34px; flex-shrink: 0; padding-bottom: 22px; }
  .dash-bar-axis-y span { position: static; left: auto; transform: none; display: block; font-size: 10px; color: var(--muted); white-space: nowrap; text-align: right; padding-right: 6px; }
  .dash-barchart-plot {
    flex: 1;
    min-width: 0;
    overflow: hidden;          /* กันแท่งล้นออกนอกคอลัมน์ (เช่นตอนเลือก 1 ปี = 12 เดือน) */
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: clamp(1px, 0.4vw, 8px);
    border-left: 1px solid var(--field-border);
    border-bottom: 1px solid var(--field-border);
    padding: 4px 6px 0;
  }
  .dash-bar-group {
    position: relative;
    flex: 1 1 0;               /* แบ่งความกว้างเท่ากันตามจำนวนเดือน ย่อได้ไม่ล้น */
    max-width: 58px;
    min-width: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    cursor: pointer;
  }
  .dash-bar-pair {
    position: relative;
    width: 100%;
    height: calc(100% - 20px);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 2px;
  }
  .dash-bar {
    width: 46%;
    border-radius: 4px 4px 0 0;
    min-height: 2px;
    transition: opacity .15s;
  }
  .dash-bar-curr { background: #3b82f6; }
  .dash-bar-prev { background: #bfdbfe; }
  .dash-bar-group:hover .dash-bar { opacity: .8; }
  .dash-bar-label {
    margin-top: 4px;
    height: 14px;              /* กันแถวป้ายเดือนไว้ ไม่ให้ถูกทับ/เบียด */
    line-height: 14px;
    flex-shrink: 0;
    font-size: 10px;
    color: var(--muted);
    white-space: nowrap;
    max-width: 100%;           /* ป้ายไม่ดันความกว้างแท่ง (กันล้นตอน 12 เดือน) */
    overflow: hidden;
    text-overflow: clip;
    text-align: center;
  }
  .dash-bar-label.is-active { color: var(--text); font-weight: 600; }
  .dash-bar-tooltip {
    top: auto;
    bottom: calc(100% + 8px);
    left: 50%;
  }
  .dash-bar-legend {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
    min-height: 20px;          /* legend มีแถวของตัวเอง ไม่ไปทับป้ายเดือน */
    margin-top: 6px;
    padding-top: 6px;
    border-top: 1px solid var(--field-border);
    font-size: 10.5px;
    color: var(--muted);
  }
  .dash-legend-item { display: inline-flex; align-items: center; gap: 6px; }
  .dash-legend-dot { width: 9px; height: 9px; border-radius: 50%; display: inline-block; }
  .dash-legend-curr { background: #3b82f6; }
  .dash-legend-prev { background: #bfdbfe; }

  /* ============ จัดออร์เดอร์ (Order Fulfillment) ============ */
  .of-page { display: flex; flex-direction: column; gap: 16px; }

  .of-barcode-wrap { display: flex; justify-content: center; }
  .of-barcode-box {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    max-width: 480px;
    background: var(--surface);
    border: 1px solid var(--field-border);
    border-radius: 9px;
    padding: 0 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,.06);
  }
  .of-barcode-box:focus-within { border-color: #2F65F6; box-shadow: 0 0 0 3px rgba(47,101,246,.12); }
  .of-barcode-icon { width: 18px; height: 18px; color: var(--muted); flex-shrink: 0; }
  .of-barcode-input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    height: 40px;
    font-size: 12px;
    color: var(--text);
  }
  .of-barcode-input::placeholder { color: var(--muted); font-size: 13px; }

  .of-filter-panel {
    background: var(--field);
    border: 1px solid var(--field-border);
    border-radius: 14px;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .of-filter-row1 { gap: 14px 18px; }
  .of-filter-row2 { gap: 14px 18px; align-items: end; }
  .of-filter-actions { display: flex; gap: 10px; }

  .of-summary { font-size: 13px; font-weight: 600; color: #2F65F6; }

  .of-table { width: 100%; border-collapse: collapse; min-width: 1100px; }
  .of-table thead th {
    background: #3c4453;
    color: #fff;
    padding: 7px 12px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .3px;
    text-align: left;
    white-space: nowrap;
  }
  .of-table tbody td {
    padding: 3px 12px;
    font-size: 12px;
    color: var(--text);
    border-bottom: 1px solid var(--field-border);
    white-space: nowrap;
  }
  .of-table tbody tr:nth-child(even) { background: var(--field); }
  .of-table tbody tr:hover { background: var(--brand-soft); }

  .of-urgent-tag {
    display: inline-block;
    margin-left: 6px;
    padding: 1px 7px;
    border-radius: 20px;
    background: rgba(229, 72, 77, .12);
    color: var(--danger);
    font-size: 10.5px;
    font-weight: 700;
  }

  .of-status-cell { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .of-status-badge {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11.5px;
    font-weight: 600;
    white-space: nowrap;
  }
  .of-status-waiting { background: var(--field); color: var(--muted); border: 1px solid var(--field-border); }
  .of-status-preparing { background: rgba(232, 160, 29, .12); color: var(--warn); }
  .of-status-prepared { background: rgba(23, 160, 106, .12); color: var(--ok); }
  .of-status-cancelled { background: rgba(229, 72, 77, .12); color: var(--danger); }

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
  /* เกจวัด % ผ้าประจำ (แทนโดนัท) */
  .dash-gauge-row { display: flex; align-items: center; gap: 18px; flex: 1; min-height: 0; }
  .dash-gauge { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
  .dash-gauge-svg { width: 132px; height: 132px; }
  .dash-gauge-track { fill: none; stroke: var(--field-border); stroke-width: 14; stroke-linecap: round; }
  .dash-gauge-seg { cursor: pointer; transition: stroke-width .15s; }
  .dash-gauge-seg.is-active { stroke-width: 17; }
  .dash-gauge-num { fill: var(--text); font-size: 30px; font-weight: 800; }
  .dash-gauge-cap { fill: var(--muted); font-size: 11px; font-weight: 600; }
  .dash-gauge-ends { display: flex; justify-content: space-between; width: 112px; margin-top: 2px; font-size: 10px; color: var(--muted); }
  .dash-gauge-side { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 12px; justify-content: center; }
  .dash-gauge-legend { display: flex; flex-direction: column; gap: 6px; }
  .dash-gauge-legend-item { display: flex; align-items: center; gap: 7px; font-size: 11.5px; }
  .dash-gauge-legend-label { color: var(--text); flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .dash-gauge-legend-pct { color: var(--text); font-weight: 700; flex-shrink: 0; }
  .dash-mini3 { border-top: 1px solid var(--field-border); padding-top: 10px; }
  .dash-mini3-title { font-size: 11px; color: var(--muted); font-weight: 600; margin-bottom: 8px; }
  .dash-mini3-bars { display: flex; align-items: flex-end; gap: 12px; height: 56px; }
  .dash-mini3-col { display: flex; flex-direction: column; align-items: center; gap: 5px; flex: 1; height: 100%; }
  .dash-mini3-track { flex: 1; width: 100%; max-width: 34px; display: flex; align-items: flex-end; }
  .dash-mini3-bar { width: 100%; border-radius: 5px 5px 3px 3px; background: linear-gradient(180deg, #5b8def, #22d3ee); min-height: 4px; transition: height .4s ease; }
  .dash-mini3-lbl { font-size: 10px; color: var(--muted); }

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
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
  }
  .dash-scroll-body:hover { scrollbar-color: var(--field-border) transparent; }
  .dash-scroll-body::-webkit-scrollbar { width: 6px; }
  .dash-scroll-body::-webkit-scrollbar-track { background: transparent; }
  .dash-scroll-body::-webkit-scrollbar-thumb { background: transparent; border-radius: 10px; }
  .dash-scroll-body:hover::-webkit-scrollbar-thumb { background: var(--field-border); }
  .dash-scroll-body::-webkit-scrollbar-thumb:hover { background: var(--muted); }

  @media (max-width: 900px) {
    .main.main-fit { height: auto; overflow: visible; }
    .dash-fit { height: auto; }
    .dash-fit .dash-flex-row { flex: none; }
    .dash-chart-box { height: 220px; }
    .dash-scroll-body { max-height: 320px; }
  }

  /* ============ DASHBOARD: fit in one viewport, no page scroll ============ */
  .main.main-fit {
    height: 100vh;
    overflow: hidden;
  }
  .main.fr-tight { padding-top: 14px; }
  .fr-page-compact .header h1 { font-size: 18px; }
  .fr-page-compact .section-header h2 { font-size: 13px; }
  .dash-fit {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    min-height: 0;
    overflow: hidden;          /* ฟิกให้พอดี 1 หน้าจอ — เนื้อหาที่เกินเลื่อนในกล่องของมันเอง */
  }
  .dash-fit > .header, .dash-fit > .stats-grid, .dash-fit > .dash-mini-row { flex-shrink: 0; }
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
  .dash-fit .dash-flex-row { flex: 1 1 0; min-height: 0; margin-top: 0; }
  .dash-fit .dash-charts-row { min-height: 236px; }   /* กราฟมีความสูงพอเสมอ ไม่ถูกบีบจนอัด/legend หาย */   /* แบ่งพื้นที่ที่เหลือให้พอดีจอ */
  .dash-fit .dash-cards-grid-compact { flex-shrink: 0; margin-top: 0; gap: 10px; }
  .dash-chart-section {
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;   /* กันกราฟหลุดออกนอกกรอบการ์ดตอนปรับแต่ง/ย่อขยาย */
    padding: 8px 18px 12px;
  }
  .dash-chart-section .section-header,
  .dash-list-section .section-header {
    margin-bottom: 3px;
    padding-bottom: 4px;
  }
  .dash-chart-section .section-header h2,
  .dash-list-section .section-header h2 { font-size: 13px; }
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
  .dash-linechart-box { flex-direction: column; }
  .dash-linechart { position: relative; width: 100%; flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 4px; }
  .dash-linechart-plot { position: relative; flex: 1; min-height: 0; overflow: hidden; }
  .dash-line-svg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block; }
  .dash-grid-line { stroke: var(--field-border); stroke-width: 1; }
  .dash-line-stroke { fill: none; stroke: #c9a227; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
  .dash-line-stroke-2 { fill: none; stroke: #3b6ef5; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; opacity: .8; }
  .dash-line-dots { position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; }
  .dash-hit { position: absolute; width: 18px; height: 18px; transform: translate(-50%, -50%); cursor: pointer; pointer-events: auto; }
  .dash-axis-y { position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; }
  .dash-axis-y span {
    position: absolute;
    left: 0;
    transform: translateY(-50%);
    font-size: 10px;
    color: var(--muted);
    white-space: nowrap;
  }
  .dash-chart-xaxis { position: relative; left: 0; right: 0; height: 15px; margin-top: 3px; flex-shrink: 0; }
  .dash-chart-xaxis span {
    position: absolute;
    bottom: 0;
    transform: translateX(-50%);
    font-size: 9.5px;
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
    padding-top: 8px;
    margin-top: 4px;
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

  /* ============ จัดออร์เดอร์ (Order Fulfillment) ============ */
  .of-page { display: flex; flex-direction: column; gap: 16px; }

  .of-barcode-wrap { display: flex; justify-content: center; }
  .of-barcode-box {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    max-width: 480px;
    background: var(--surface);
    border: 1px solid var(--field-border);
    border-radius: 9px;
    padding: 0 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,.06);
  }
  .of-barcode-box:focus-within { border-color: #2F65F6; box-shadow: 0 0 0 3px rgba(47,101,246,.12); }
  .of-barcode-icon { width: 18px; height: 18px; color: var(--muted); flex-shrink: 0; }
  .of-barcode-input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    height: 40px;
    font-size: 12px;
    color: var(--text);
  }
  .of-barcode-input::placeholder { color: var(--muted); font-size: 13px; }

  .of-filter-panel {
    background: var(--field);
    border: 1px solid var(--field-border);
    border-radius: 14px;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .of-filter-row1 { gap: 14px 18px; }
  .of-filter-row2 { gap: 14px 18px; align-items: end; }
  .of-filter-actions { display: flex; gap: 10px; }

  .of-summary { font-size: 13px; font-weight: 600; color: #2F65F6; }

  .of-table { width: 100%; border-collapse: collapse; min-width: 1100px; }
  .of-table thead th {
    background: #3c4453;
    color: #fff;
    padding: 7px 12px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .3px;
    text-align: left;
    white-space: nowrap;
  }
  .of-table tbody td {
    padding: 3px 12px;
    font-size: 12px;
    color: var(--text);
    border-bottom: 1px solid var(--field-border);
    white-space: nowrap;
  }
  .of-table tbody tr:nth-child(even) { background: var(--field); }
  .of-table tbody tr:hover { background: var(--brand-soft); }

  .of-urgent-tag {
    display: inline-block;
    margin-left: 6px;
    padding: 1px 7px;
    border-radius: 20px;
    background: rgba(229, 72, 77, .12);
    color: var(--danger);
    font-size: 10.5px;
    font-weight: 700;
  }

  .of-status-cell { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .of-status-badge {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11.5px;
    font-weight: 600;
    white-space: nowrap;
  }
  .of-status-waiting { background: var(--field); color: var(--muted); border: 1px solid var(--field-border); }
  .of-status-preparing { background: rgba(232, 160, 29, .12); color: var(--warn); }
  .of-status-prepared { background: rgba(23, 160, 106, .12); color: var(--ok); }
  .of-status-cancelled { background: rgba(229, 72, 77, .12); color: var(--danger); }

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
  /* เกจวัด % ผ้าประจำ (แทนโดนัท) */
  .dash-gauge-row { display: flex; align-items: center; gap: 18px; flex: 1; min-height: 0; }
  .dash-gauge { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
  .dash-gauge-svg { width: 132px; height: 132px; }
  .dash-gauge-track { fill: none; stroke: var(--field-border); stroke-width: 14; stroke-linecap: round; }
  .dash-gauge-seg { cursor: pointer; transition: stroke-width .15s; }
  .dash-gauge-seg.is-active { stroke-width: 17; }
  .dash-gauge-num { fill: var(--text); font-size: 30px; font-weight: 800; }
  .dash-gauge-cap { fill: var(--muted); font-size: 11px; font-weight: 600; }
  .dash-gauge-ends { display: flex; justify-content: space-between; width: 112px; margin-top: 2px; font-size: 10px; color: var(--muted); }
  .dash-gauge-side { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 12px; justify-content: center; }
  .dash-gauge-legend { display: flex; flex-direction: column; gap: 6px; }
  .dash-gauge-legend-item { display: flex; align-items: center; gap: 7px; font-size: 11.5px; }
  .dash-gauge-legend-label { color: var(--text); flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .dash-gauge-legend-pct { color: var(--text); font-weight: 700; flex-shrink: 0; }
  .dash-mini3 { border-top: 1px solid var(--field-border); padding-top: 10px; }
  .dash-mini3-title { font-size: 11px; color: var(--muted); font-weight: 600; margin-bottom: 8px; }
  .dash-mini3-bars { display: flex; align-items: flex-end; gap: 12px; height: 56px; }
  .dash-mini3-col { display: flex; flex-direction: column; align-items: center; gap: 5px; flex: 1; height: 100%; }
  .dash-mini3-track { flex: 1; width: 100%; max-width: 34px; display: flex; align-items: flex-end; }
  .dash-mini3-bar { width: 100%; border-radius: 5px 5px 3px 3px; background: linear-gradient(180deg, #5b8def, #22d3ee); min-height: 4px; transition: height .4s ease; }
  .dash-mini3-lbl { font-size: 10px; color: var(--muted); }

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
    background: var(--surface);
    border: 1px solid var(--field-border);
    border-radius: 18px;
    padding: 18px 22px;
    min-height: 104px;
    transition: box-shadow .2s, transform .2s, border-color .2s;
    color: var(--text);
    position: relative;
  }
  .stat-card:hover { box-shadow: 0 10px 24px rgba(20, 30, 70, .08); border-color: var(--muted); transform: translateY(-2px); }
  /* ไอคอนลอยมุมขวาบน — ข้อความใช้ความกว้างเต็ม การ์ดเตี้ยลง ไม่มีที่ว่าง */
  .stat-icon {
    width: 50px; height: 50px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    position: absolute; top: 18px; right: 18px;
    margin-bottom: 0;
  }
  .stat-icon svg { width: 22px; height: 22px; }
  /* เว้นที่ให้ไอคอนมุมขวา — ข้อความไม่ชน */
  .stat-card .label, .stat-card .value, .stat-card .detail { padding-right: 58px; }
  .dash-fit .stats-grid .stat-card .label,
  .dash-fit .stats-grid .stat-card .value,
  .dash-fit .stats-grid .stat-card .detail { padding-right: 44px; }
  .stat-card-revenue .stat-icon { background: var(--pink-soft); color: var(--pink); }
  .stat-card-sales .stat-icon { background: var(--purple-soft); color: var(--purple); }
  .stat-card-orders .stat-icon { background: var(--blue-soft); color: var(--blue); }
  .stat-card-total .stat-icon { background: var(--orange-soft); color: var(--orange); }
  .stat-card .label { font-size: 13px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
  .stat-card .value { font-size: 38px; font-weight: 700; color: var(--text); margin: 10px 0 6px; }
  .stat-card .detail { font-size: 11.5px; color: var(--muted); }

  /* ============ ผ้าประจำ (fr-) ============ */
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

  /* ปุ่มค้นหา (น้ำเงินกรม) / รีเซ็ต (แดงเลือดหมู) / เพิ่มข้อมูล (เขียว) — ใช้ทุกหน้า */
  .fr-btn-search { background: #1e3a8a; color: #fff; border-color: #1e3a8a; }
  .fr-btn-search:hover { background: #172b6b; border-color: #172b6b; }
  .fr-btn-reset { background: #a82a3a; color: #fff; border-color: #a82a3a; }
  .fr-btn-reset:hover { background: #8a1c2b; border-color: #8a1c2b; }
  .fr-btn-add { background: #1a9c54; color: #fff; border-color: #1a9c54; }
  .fr-btn-add:hover { background: #158045; border-color: #158045; }

  .fr-summary { padding: 14px 28px 0; font-size: 13px; font-weight: 600; color: #2F65F6; }
  .fr-summary-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
  .fr-summary-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .fr-th-check { width: 36px; text-align: center; }
  .fr-th-sort { cursor: pointer; user-select: none; white-space: nowrap; }
  .fr-th-sort:hover { color: #fff; background: #4a5364; }
  .fr-sort-icon { font-size: 10px; display: inline-block; min-width: 10px; margin-left: 2px; opacity: .4; transition: opacity .15s; }
  .fr-th-sort:hover .fr-sort-icon { opacity: .75; }
  .fr-sort-icon.active { opacity: 1; color: #8ab4ff; }

  /* ============ แถบ Action ด่วน (Bulk) ============ */
  .fr-bulk-bar {
    display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
    margin: 8px 0 0; padding: 9px 14px; border-radius: 10px;
    background: var(--brand-soft); border: 1px solid var(--brand);
  }
  .fr-bulk-count { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--brand); font-weight: 600; }
  .fr-bulk-count svg { width: 16px; height: 16px; }
  .fr-bulk-count strong { font-size: 14px; }
  .fr-bulk-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .fr-bulk-btn {
    display: inline-flex; align-items: center; gap: 4px; height: 32px; padding: 0 12px;
    border: 1px solid var(--field-border); border-radius: 8px; background: var(--surface);
    color: var(--text); font-size: 12.5px; cursor: pointer; transition: all .15s; white-space: nowrap;
  }
  .fr-bulk-btn:hover { background: var(--field); }
  .fr-bulk-btn.danger { color: var(--danger); border-color: var(--danger); }
  .fr-bulk-btn.danger:hover { background: var(--danger); color: #fff; }
  .fr-bulk-btn.ghost { border-color: transparent; color: var(--muted); }
  .fr-bulk-btn.ghost:hover { color: var(--text); background: var(--field); }
  .fr-bulk-fade-enter-active, .fr-bulk-fade-leave-active { transition: opacity .18s, transform .18s; }
  .fr-bulk-fade-enter-from, .fr-bulk-fade-leave-to { opacity: 0; transform: translateY(-6px); }
  .fr-page-size-select {
    height: 32px; border: 1px solid var(--field-border); border-radius: 8px;
    background: var(--surface); color: var(--text); font-size: 12.5px; padding: 0 8px; cursor: pointer;
  }

  .fr-table-wrap { margin-top: 12px; }
  .fr-table-scroll {
    overflow-x: auto;
    overflow-y: auto;
    max-height: calc(100vh - 320px);
    min-height: 200px;
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
  }
  .fr-table-scroll:hover { scrollbar-color: var(--field-border) transparent; }
  .fr-table-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
  .fr-table-scroll::-webkit-scrollbar-track { background: transparent; }
  .fr-table-scroll::-webkit-scrollbar-thumb { background: transparent; border-radius: 10px; }
  .fr-table-scroll:hover::-webkit-scrollbar-thumb { background: var(--field-border); }
  .fr-table-scroll::-webkit-scrollbar-thumb:hover { background: var(--muted); }
  .fr-table-scroll .fr-table thead th { position: sticky; top: 0; z-index: 1; }
  .main-content > div {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
  .main-content > div > .section:has(.table-scroll-y) {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: 14px 18px;
    margin-top: 12px !important;
  }
  .main-content > div > .section:has(.table-scroll-y) .section-header {
    margin-bottom: 8px;
    padding-bottom: 6px;
  }
  .table-scroll-y {
    overflow-y: auto;
    flex: 1;
    min-height: 200px;
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
  }
  .table-scroll-y:hover { scrollbar-color: var(--field-border) transparent; }
  .table-scroll-y::-webkit-scrollbar { width: 6px; height: 6px; }
  .table-scroll-y::-webkit-scrollbar-track { background: transparent; }
  .table-scroll-y::-webkit-scrollbar-thumb { background: transparent; border-radius: 10px; }
  .table-scroll-y:hover::-webkit-scrollbar-thumb { background: var(--field-border); }
  .table-scroll-y::-webkit-scrollbar-thumb:hover { background: var(--muted); }
  .table-scroll-y table thead th { position: sticky; top: 0; z-index: 1; }
  .fr-table { width: 100%; border-collapse: collapse; table-layout: auto; }
  .fr-table thead th {
    background: #3c4453; color: #fff; font-size: 11px; font-weight: 600;
    text-transform: uppercase; letter-spacing: .3px; padding: 7px 12px; text-align: left; white-space: nowrap;
    border-bottom: 1px solid var(--table-line);   /* เส้นคั่นหัวตาราง–เนื้อตาราง ให้เห็นชัด */
  }
  .fr-table tbody td {
    padding: 3px 12px; font-size: 12px; color: var(--text);
    border-bottom: 1px solid var(--table-line); white-space: nowrap;
    line-height: 1.6;
  }
  /* ปุ่ม/ป้ายในเซลล์ ไม่ให้ดันแถวสูง (แถวกระชับเท่ากันทุกตาราง) */
  .fr-table tbody td .fr-action-group,
  .fr-table tbody td .fr-img-btn,
  .fr-table tbody td .fr-color-badge { vertical-align: middle; }
  .fr-table tbody td .fr-action-btn,
  .fr-table tbody td .fr-img-btn { width: 24px; height: 24px; }
  /* ===== ปรับตารางแบบฟอร์ม (po-item-table) ให้ขนาด/ฟอนต์หัว+เนื้อ เท่าตารางมาตรฐาน .fr-table ทุกหน้า =====
     (override สไตล์ scoped ของแต่ละหน้าด้วย !important จากจุดเดียว) */
  .po-item-table thead th {
    font-size: 11px !important;
    font-weight: 600 !important;
    padding: 7px 10px !important;
    letter-spacing: .3px !important;
    text-transform: uppercase;
    white-space: nowrap !important;   /* หัวตารางบรรทัดเดียว ไม่ตัดขึ้นบรรทัดใหม่ */
  }
  .po-item-table tbody td { padding: 3px 8px !important; }
  .po-item-table tbody td,
  .po-item-table tbody input:not([type="checkbox"]),
  .po-item-table tbody select {
    font-size: 12px !important;
  }
  .po-item-table tbody input:not([type="checkbox"]),
  .po-item-table tbody select {
    height: 28px !important;
  }
  /* ===== รวมหัวตารางทุกคลาสให้เป็นมาตรฐานเดียวกับ .fr-table (สี #3c4453 + ฟอนต์ 11.5px) ทุกหน้า ===== */
  .rp-table thead th,
  .bl-doc-table thead th,
  .sc-table thead th,
  .grp-table thead th,
  .fr-shade-table thead th {
    background: #3c4453 !important;
    color: #fff !important;
    font-size: 11px !important;
    font-weight: 600 !important;
    padding: 7px 12px !important;
    letter-spacing: .3px !important;
    text-transform: uppercase;
  }
  .rp-table tbody td,
  .bl-doc-table tbody td,
  .sc-table tbody td,
  .grp-table tbody td {
    font-size: 12px !important;
  }
  /* ===== เส้นแบ่งแนวตั้งระหว่างคอลัมน์ (ทุกตาราง) ===== */
  .fr-table th, .fr-table td,
  .fi-table th, .fi-table td,
  .of-table th, .of-table td,
  .table-scroll-y table th, .table-scroll-y table td {
    border-right: 1px solid var(--table-line);
  }
  .fr-table th:last-child, .fr-table td:last-child,
  .fi-table th:last-child, .fi-table td:last-child,
  .of-table th:last-child, .of-table td:last-child,
  .table-scroll-y table th:last-child, .table-scroll-y table td:last-child {
    border-right: none;
  }
  /* หัวตารางสีเข้ม ใช้เส้นแบ่งจางสีขาว */
  .fr-table thead th, .fi-table thead th, .of-table thead th {
    border-right-color: rgba(255, 255, 255, .18);
  }
  .fr-td-wrap {
    white-space: normal !important;
    max-width: 220px;
    word-break: break-word;
  }
  .fr-td-wrap .fr-clamp {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .fr-table tbody tr:nth-child(even) { background: var(--field); }
  .fr-table tbody tr:hover { background: var(--brand-soft); }
  .fr-table tbody tr:last-child td { border-bottom: none; }

  .fr-img-btn {
    width: 24px; height: 24px; display: grid; place-items: center;
    background: var(--field); border: 1px solid var(--field-border); border-radius: 8px;
    color: var(--muted); cursor: pointer;
  }
  .fr-img-btn svg { width: 13px; height: 13px; }
  .fr-action-group { display: flex; gap: 6px; }
  .fr-action-btn {
    width: 24px; height: 24px; display: grid; place-items: center;
    border-radius: 7px; border: 1px solid var(--field-border); background: var(--surface);
    cursor: pointer; color: var(--muted); font-size: 13px; line-height: 1; padding: 0;
    transition: background .18s, border-color .18s, box-shadow .18s;
  }
  /* แสดงเป็น emoji ในกล่องมน (ซ่อน svg เดิม) — ใช้ทุกหน้าเหมือนกัน */
  .fr-action-btn svg { display: none; }
  .fr-action-btn.edit::before { content: "\270F\FE0F"; }
  .fr-action-btn.delete::before { content: "\1F5D1\FE0F"; }
  .fr-action-btn.view::before { content: "\2630"; font-size: 14px; color: var(--muted); }
  .fr-action-btn:hover { border-color: #cbd5e1; box-shadow: 0 1px 4px rgba(0,0,0,.08); }
  .fr-action-btn.edit:hover { background: #fff7ed; border-color: #fdba74; }
  .fr-action-btn.delete:hover { background: #fef2f2; border-color: #fecaca; }
  .fr-action-btn.view:hover { background: #eef2ff; border-color: #c7d2fe; }
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
    font-size: 12px;
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

  @media (max-width: 560px) {
    .fi-search-row { flex-wrap: wrap; }
    .fi-search-row input[type="text"] { flex-basis: 100%; }
  }
  @media (max-width: 560px) {
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
  .fr-modal-header h3 { color: #fff; font-size: 13px; font-weight: 700; }
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
  .fr-form-row label { font-size: 11px; font-weight: 600; color: var(--text); }
  .fr-required { color: var(--danger); font-weight: 700; }
  .fr-form-row input[type="text"],
  .fr-form-row input[type="number"],
  .fr-form-row select {
    height: 38px;
    border: 1px solid var(--field-border);
    border-radius: 8px;
    padding: 0 12px;
    font-size: 12px;
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

  /* ============================================================
     ERP Modal — มาตรฐานกลางสำหรับ modal เพิ่ม/แก้ไข ทุกหน้า
     ใช้: .erp-overlay > .erp-modal > (erp-modal-head / erp-modal-body / erp-modal-foot)
          ในเนื้อหาใช้ .erp-sec-title + .erp-grid > .erp-field (.erp-col-2 = เต็มแถว)
     ============================================================ */
  .erp-overlay {
    position: fixed; inset: 0; z-index: 3400; display: flex; align-items: center; justify-content: center;
    background: rgba(15,23,42,0.5); padding: 20px;
    font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif;
  }
  .erp-modal { background: var(--surface); border-radius: 14px; width: 860px; max-width: 100%; max-height: 92vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 24px 60px rgba(0,0,0,0.3); }
  .erp-modal-head { background: #3c4453; color: #fff; padding: 10px 16px; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
  .erp-head-ic { margin-right: 6px; }
  .erp-x { background: rgba(255,255,255,.18); border: none; color: #fff; width: 24px; height: 24px; border-radius: 7px; font-size: 12px; cursor: pointer; }
  .erp-x:hover { background: rgba(255,255,255,.3); }
  .erp-modal-body { padding: 14px 18px; overflow-y: auto; flex: 1 1 auto; min-height: 0; }
  .erp-sec-title { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; color: var(--brand-2); margin: 4px 0 12px; }
  .erp-sec-title:not(:first-child) { margin-top: 22px; }
  .erp-sec-bar { width: 4px; height: 16px; border-radius: 2px; background: #3c4453; display: inline-block; }
  .erp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 22px; }
  .erp-col-2 { grid-column: span 2; }
  .erp-field { display: flex; flex-direction: column; gap: 5px; }
  .erp-field > label { font-size: 11px; font-weight: 600; color: var(--muted); }
  .erp-req { color: #a82a3a; }
  .erp-field input, .erp-field select, .erp-field textarea {
    height: 38px; padding: 0 12px; border: 1px solid var(--field-border); border-radius: 9px;
    font-size: 12px; font-family: inherit; background: var(--surface); color: var(--text);
    transition: border-color .2s, box-shadow .2s;
  }
  .erp-field textarea { height: auto; padding: 9px 12px; resize: vertical; }
  .erp-field input:focus, .erp-field select:focus, .erp-field textarea:focus { outline: none; border-color: #2F65F6; box-shadow: 0 0 0 3px rgba(47,101,246,.12); }
  .erp-field input.erp-err { border-color: #a82a3a; box-shadow: 0 0 0 3px rgba(168,42,58,.12); }
  .erp-modal-foot { display: flex; justify-content: flex-end; gap: 10px; padding: 10px 16px; border-top: 1px solid var(--field-border); background: var(--field); flex-shrink: 0; }
  .erp-btn { padding: 6px 16px; border: none; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; }
  .erp-btn-cancel { background: #e2e8f0; color: #334155; }
  .erp-btn-cancel:hover { background: #cbd5e1; }
  .erp-btn-save { background: #1a9c54; color: #fff; }
  .erp-btn-save:hover { background: #158045; }
  @media (max-width: 560px) { .erp-grid { grid-template-columns: 1fr; } .erp-col-2 { grid-column: span 1; } }

  .fr-color-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    border: 1px solid var(--field-border);
    background: var(--field);
    color: var(--text);
    padding: 2px 8px;
    border-radius: 20px;
    font-size: 11.5px;
    font-weight: 600;
    line-height: 1.5;
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
  .oe-row1 { gap: 14px 18px; }
  .oe-row2 { gap: 14px 18px; }
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

  /* ปุ่มจัดการแถว (รับออร์เดอร์) — ชุดไอคอนสไตล์ ERP องค์กร: line icon โทนกลาง, hover ไล่สี accent */
  .oe-act-group { display: flex; gap: 6px; align-items: center; }
  .oe-act-btn {
    width: 30px; height: 30px; flex-shrink: 0;
    display: grid; place-items: center;
    background: var(--field);
    border: 1px solid var(--field-border);
    border-radius: 8px;
    color: var(--muted);
    cursor: pointer;
    transition: background .15s, border-color .15s, color .15s;
  }
  .oe-act-btn svg { width: 16px; height: 16px; }
  /* สีประจำตัวตั้งแต่แรก เพื่อให้มองปราดเดียวรู้ว่าปุ่มไหนทำอะไร */
  .oe-act-img    { color: var(--muted); }
  .oe-act-add    { color: #1a9c54; }
  .oe-act-remove { color: #dc2626; }
  .oe-act-search { color: #2563eb; }
  .oe-act-cut    { color: #dc2626; }
  .oe-act-dark   { color: var(--text); }
  .oe-act-img:hover    { border-color: var(--muted); background: var(--surface); }
  .oe-act-add:hover    { border-color: #1a9c54; background: rgba(26,156,84,.12); }
  .oe-act-remove:hover { border-color: #dc2626; background: rgba(220,38,38,.12); }
  .oe-act-search:hover { border-color: #2563eb; background: rgba(37,99,235,.12); }
  .oe-act-cut:hover    { border-color: #dc2626; background: rgba(220,38,38,.12); }
  .oe-act-dark:hover   { border-color: var(--text); background: var(--surface); }
  .oe-act-btn:active { transform: translateY(1px); }

  .oe-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 18px; }
  .oe-save-success { color: var(--ok); font-weight: 600; font-size: 13.5px; }
  .oe-footer-actions { display: flex; gap: 12px; }

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
  .xl-pagination { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 10px; padding: 4px 0; font-size: 12.5px; color: var(--muted); }
  .xl-pagination button:disabled { opacity: .5; cursor: not-allowed; }
  .xl-pagination .fr-btn-util { padding: 5px 12px; font-size: 12.5px; }
  .xl-pagination .fr-page-size-select { height: 30px; }

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
    font-size: 12px;
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
    grid-template-columns: 0.9fr 1.1fr 0.7fr 0.9fr 0.8fr 0.8fr auto;
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
    font-size: 12px;
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
    font-size: 12px;
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
    padding: 2px 8px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
  }
  .badge.success { background: rgba(23, 160, 106, 0.1); color: var(--ok); }
  .badge.warning { background: rgba(232, 160, 29, 0.1); color: var(--warn); }
  .badge.danger { background: rgba(229, 72, 77, 0.1); color: var(--danger); }

  /* ============ ACTIVITY ============ */
  .activity-item {
    padding: 8px 0;
    display: flex;
    gap: 10px;
    align-items: center;
    border-bottom: 1px solid var(--field-border);
  }
  .activity-item:last-child { border-bottom: none; }
  .activity-icon { width: 28px; height: 28px; background: var(--field); border-radius: 7px; display: grid; place-items: center; color: var(--brand); flex-shrink: 0; font-size: 13px; }
  .activity-content { flex: 1; }
  .activity-title { font-size: 12px; font-weight: 600; color: var(--text); margin-bottom: 1px; }
  .activity-time { font-size: 11px; color: var(--muted); }

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
    .main-content {
      padding: 4px 16px 16px;
      gap: 16px;
    }
    .header h1 { font-size: 22px; }
  }

  @media (max-width: 480px) {
    .header-actions { width: 100%; }
    .header-actions .btn-small { flex: 1; }
  }
</style>
