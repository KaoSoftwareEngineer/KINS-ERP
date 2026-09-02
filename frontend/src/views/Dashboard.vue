<script>
import { defineAsyncComponent, h } from 'vue';
// สไตล์ส่วนกลางของแดชบอร์ด — เดิมเป็นบล็อก <style> ท้ายไฟล์นี้ (2,049 บรรทัด) ย้ายออกมาให้ไฟล์สั้นลง
// ยังเป็น CSS global เหมือนเดิม (หน้าลูกใน views/dashboard/ ใช้คลาสเหล่านี้ร่วมกัน) และลำดับ cascade เท่าเดิม
import '../assets/dashboard.css';
// โครงเมนู + ตารางชื่อ/ไอคอนของหน้าย่อย — เดิมเป็นข้อมูลนิ่ง ~570 บรรทัดใน data() ปนกับ state จริง
import { createMenuConfig } from './dashboard/menuConfig.js';
// ============================================================================
//  หน้าย่อยของแดชบอร์ดโหลดแบบ lazy — แต่ละหน้าถูกแยกเป็นไฟล์ย่อยของตัวเอง
//  ดาวน์โหลดตอนเปิดหน้านั้นจริงๆ เท่านั้น → ก้อนโค้ดที่โหลดตอนเข้าระบบเล็กลงมาก
//  (เดิมรวมทุกหน้าไว้ก้อนเดียว = เปิดแค่หน้าแดชบอร์ดก็ต้องโหลดโค้ดครบทั้ง 85 หน้า)
// ============================================================================
const lazyBox = (text, color) => ({
  render: () => h('div', { style: `padding:32px;text-align:center;color:${color};font-size:14px;` }, text),
});
const PageLoading = lazyBox('กำลังโหลดหน้า…', 'var(--text-muted, #94a3b8)');
const PageLoadError = lazyBox('⚠️ โหลดหน้านี้ไม่สำเร็จ — ตรวจสอบการเชื่อมต่อแล้วรีเฟรชหน้าเว็บอีกครั้ง', '#ef4444');
//  delay 200ms = ถ้าโหลดเสร็จไวกว่านั้นจะไม่ทันเห็นข้อความ (กันจอกะพริบ)
const lazyPage = (loader) => defineAsyncComponent({
  loader, delay: 200, timeout: 20000,
  loadingComponent: PageLoading, errorComponent: PageLoadError,
});
import TopNavbar from './dashboard/TopNavbar.vue';
import BrandLogo from '../components/BrandLogo.vue';
import DashboardHome from './dashboard/DashboardHome.vue';
const UsersPage = lazyPage(() => import('./dashboard/UsersPage.vue'));
const AnalyticsPage = lazyPage(() => import('./dashboard/AnalyticsPage.vue'));
const SettingsPage = lazyPage(() => import('./dashboard/SettingsPage.vue'));
const FabricRegularPage = lazyPage(() => import('./dashboard/FabricRegularPage.vue'));
const FabricRegularGroupPage = lazyPage(() => import('./dashboard/FabricRegularGroupPage.vue'));
const FabricIrregularPage = lazyPage(() => import('./dashboard/FabricIrregularPage.vue'));
const FabricRawPage = lazyPage(() => import('./dashboard/FabricRawPage.vue'));
const PartnersPage = lazyPage(() => import('./dashboard/PartnersPage.vue'));
const EmployeePage = lazyPage(() => import('./dashboard/EmployeePage.vue'));
const MasterDataPage = lazyPage(() => import('./dashboard/MasterDataPage.vue'));
const NoteInfoPage = lazyPage(() => import('./dashboard/NoteInfoPage.vue'));
const CustomersPage = lazyPage(() => import('./dashboard/CustomersPage.vue'));
const GoodsReceivePage = lazyPage(() => import('./dashboard/GoodsReceivePage.vue'));
const GoodsFinishedReceivePage = lazyPage(() => import('./dashboard/GoodsFinishedReceivePage.vue'));
const GoodsRawReceivePage = lazyPage(() => import('./dashboard/GoodsRawReceivePage.vue'));
const GoodsDyedReceivePage = lazyPage(() => import('./dashboard/GoodsDyedReceivePage.vue'));
const GoodsTransferPage = lazyPage(() => import('./dashboard/GoodsTransferPage.vue'));
const RawTransferPage = lazyPage(() => import('./dashboard/RawTransferPage.vue'));
const RackTransferPage = lazyPage(() => import('./dashboard/RackTransferPage.vue'));
const BarcodePage = lazyPage(() => import('./dashboard/BarcodePage.vue'));
const VatProductGroupPage = lazyPage(() => import('./dashboard/VatProductGroupPage.vue'));
const VatReceivePage = lazyPage(() => import('./dashboard/VatReceivePage.vue'));
const VatStockCutPage = lazyPage(() => import('./dashboard/VatStockCutPage.vue'));
const VatInvoicePage = lazyPage(() => import('./dashboard/VatInvoicePage.vue'));
const VatInvoiceCutPage = lazyPage(() => import('./dashboard/VatInvoiceCutPage.vue'));
const StockInventoryReportPage = lazyPage(() => import('./dashboard/StockInventoryReportPage.vue'));
const CreditNotePage = lazyPage(() => import('./dashboard/CreditNotePage.vue'));
const PaymentPage = lazyPage(() => import('./dashboard/PaymentPage.vue'));
const AccountDeductPage = lazyPage(() => import('./dashboard/AccountDeductPage.vue'));
const InvoiceOpenPage = lazyPage(() => import('./dashboard/InvoiceOpenPage.vue'));
const InvoiceReturnPage = lazyPage(() => import('./dashboard/InvoiceReturnPage.vue'));
const CustomerBillingPage = lazyPage(() => import('./dashboard/CustomerBillingPage.vue'));
const ZoneRackPage = lazyPage(() => import('./dashboard/ZoneRackPage.vue'));
const StockHistoryPage = lazyPage(() => import('./dashboard/StockHistoryPage.vue'));
const BasicDataGenericPage = lazyPage(() => import('./dashboard/BasicDataGenericPage.vue'));
const PoGenericPage = lazyPage(() => import('./dashboard/PoGenericPage.vue'));
const PoFabricFinishedPage = lazyPage(() => import('./dashboard/PoFabricFinishedPage.vue'));
const PoFabricRawPage = lazyPage(() => import('./dashboard/PoFabricRawPage.vue'));
const PoDyeOrderPage = lazyPage(() => import('./dashboard/PoDyeOrderPage.vue'));
const StockGenericPage = lazyPage(() => import('./dashboard/StockGenericPage.vue'));
const VatGenericPage = lazyPage(() => import('./dashboard/VatGenericPage.vue'));
const OrderReceivePage = lazyPage(() => import('./dashboard/OrderReceivePage.vue'));
const OrderFulfillPage = lazyPage(() => import('./dashboard/OrderFulfillPage.vue'));
const OrderFulfillDetailPage = lazyPage(() => import('./dashboard/OrderFulfillDetailPage.vue'));
const OrderGenericPage = lazyPage(() => import('./dashboard/OrderGenericPage.vue'));
const CustAccGenericPage = lazyPage(() => import('./dashboard/CustAccGenericPage.vue'));
const PartnerAccGenericPage = lazyPage(() => import('./dashboard/PartnerAccGenericPage.vue'));
const ReportGenericPage = lazyPage(() => import('./dashboard/ReportGenericPage.vue'));
const ReportViewPage = lazyPage(() => import('./dashboard/ReportViewPage.vue'));
const ShelfStockReportPage = lazyPage(() => import('./dashboard/ShelfStockReportPage.vue'));
const RawStockReportPage = lazyPage(() => import('./dashboard/RawStockReportPage.vue'));
const GoodsReceiptReportPage = lazyPage(() => import('./dashboard/GoodsReceiptReportPage.vue'));
const PoReportPage = lazyPage(() => import('./dashboard/PoReportPage.vue'));
const OrderReportPage = lazyPage(() => import('./dashboard/OrderReportPage.vue'));
const DyeOrderReportPage = lazyPage(() => import('./dashboard/DyeOrderReportPage.vue'));
const SalesContractReportPage = lazyPage(() => import('./dashboard/SalesContractReportPage.vue'));
const SalesReportPage = lazyPage(() => import('./dashboard/SalesReportPage.vue'));
const InvoiceReturnReportPage = lazyPage(() => import('./dashboard/InvoiceReturnReportPage.vue'));
const VatInvoiceReportPage = lazyPage(() => import('./dashboard/VatInvoiceReportPage.vue'));
const ProfitLossReportPage = lazyPage(() => import('./dashboard/ProfitLossReportPage.vue'));
const ProfitLossYearlyPage = lazyPage(() => import('./dashboard/ProfitLossYearlyPage.vue'));
const BillingReportPage = lazyPage(() => import('./dashboard/BillingReportPage.vue'));
const CustomerPaymentReportPage = lazyPage(() => import('./dashboard/CustomerPaymentReportPage.vue'));
const CreditNoteReportPage = lazyPage(() => import('./dashboard/CreditNoteReportPage.vue'));
const ReorderPointReportPage = lazyPage(() => import('./dashboard/ReorderPointReportPage.vue'));
const AnnualSummaryPage = lazyPage(() => import('./dashboard/AnnualSummaryPage.vue'));
const OtherReportPage = lazyPage(() => import('./dashboard/OtherReportPage.vue'));
const GoodsIssueReportPage = lazyPage(() => import('./dashboard/GoodsIssueReportPage.vue'));
const GoodsTransferReportPage = lazyPage(() => import('./dashboard/GoodsTransferReportPage.vue'));
const RawTransferReportPage = lazyPage(() => import('./dashboard/RawTransferReportPage.vue'));
const RackTransferReportPage = lazyPage(() => import('./dashboard/RackTransferReportPage.vue'));
const VatStockReportPage = lazyPage(() => import('./dashboard/VatStockReportPage.vue'));
const VatReceiveReportPage = lazyPage(() => import('./dashboard/VatReceiveReportPage.vue'));
const VatIssueReportPage = lazyPage(() => import('./dashboard/VatIssueReportPage.vue'));
const UserPermissionsPage = lazyPage(() => import('./dashboard/UserPermissionsPage.vue'));
const SalesContractPage = lazyPage(() => import('./dashboard/SalesContractPage.vue'));
const OrderSlipModal = lazyPage(() => import('./dashboard/OrderSlipModal.vue'));
const CustomerEditModal = lazyPage(() => import('./dashboard/CustomerEditModal.vue'));
const ShadeModal = lazyPage(() => import('./dashboard/ShadeModal.vue'));
const FeedbackModal = lazyPage(() => import('./dashboard/FeedbackModal.vue'));
import ToastHost from './dashboard/ToastHost.vue';
const PermissionModal = lazyPage(() => import('./dashboard/PermissionModal.vue'));
import { messages } from '../i18n/dashboardMessages.js';
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
        ...createMenuConfig(),   // โครงเมนู + ตารางชื่อหน้า (ย้ายไป views/dashboard/menuConfig.js)
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
        t: messages,   // คำแปลทั้งหมดอยู่ใน src/i18n/dashboardMessages.js
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
    async mounted() {
      // สร้างหน้ารายงานย่อย (mock) จากเมนู nested ที่ยังไม่มีใน reportPages
      this.reportMenu.forEach(g => {
        if (g.children) g.children.forEach(c => {
          if (!this.reportPages[c.key]) this.reportPages[c.key] = { title: c.label.th, columns: ['รายการ', 'รายละเอียด', 'จำนวน', 'มูลค่า', 'สถานะ'], rows: [] };
        });
      });
      // โหลด user/สิทธิ์ ล่าสุดจาก localStorage เข้า store (กันค้างหลัง re-login)
      this.auth.hydrate();
      document.documentElement.setAttribute('data-theme', this.theme);
      // ตรวจเซสชัน: token อยู่ในหน่วยความจำเท่านั้น (หายเมื่อรีเฟรช) — เซสชันจริงคือ httpOnly cookie
      // ถ้าไม่มี token ในหน่วยความจำ ให้ถามเซิร์ฟเวอร์ว่า cookie ยังใช้ได้ไหมก่อนตัดสินใจเด้งออก
      if (!this.token) {
        const alive = await this.auth.restoreSession();
        if (!alive) {
          setTimeout(() => {
            this.$router.push('/login');
          }, 500);
          return;
        }
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
          d.savedMsg = out.message || this.t[this.lang].cutIssueSavedMsg;
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
      // เปิดฟอร์มเปล่าเพื่อ "สร้างบัญชีใหม่" (ใช้โมดัลเดียวกับแก้ไข — id = null คือโหมดสร้าง)
      // ระบบปิดการสมัครเองสาธารณะแล้ว บัญชีใหม่ต้องให้ผู้ดูแลเปิดให้ทางนี้เท่านั้น
      usOpenCreate() {
        this.usEditItem = { id: null, name: '', email: '', phone: '', role: '', gender: '', age: '', password: '' };
        this.usModalShow = true;
      },
      usCloseModal() { this.usModalShow = false; },
      async usSaveUser() {
        const u = this.usEditItem;
        if (!u.name.trim() || !u.email.trim()) { this.fbFail('กรุณากรอกชื่อและอีเมล'); return; }
        const creating = !u.id;
        if (creating && (u.password || '').length < 6) { this.fbFail('ตั้งรหัสผ่านเริ่มต้นอย่างน้อย 6 ตัวอักษร'); return; }
        this.fbLoading(creating ? 'กำลังสร้างบัญชี...' : 'กำลังบันทึก...');
        try {
          const res = await fetch(API + (creating ? '/api/users' : `/api/users/${u.id}`), {
            method: creating ? 'POST' : 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.token },
            body: JSON.stringify({ name: u.name.trim(), email: u.email.trim(), phone: u.phone.trim(), role: u.role, gender: u.gender, age: u.age || null, password: u.password || '' }),
          });
          if (res.status === 401) { this.fbHide(); this.sessionExpired(); return; }
          const data = await res.json();
          if (data.ok) {
            // ถ้าแก้ข้อมูลของ "ตัวเอง" → อัปเดตโปรไฟล์ (ชื่อ/เบอร์/ตำแหน่ง/เพศ/อายุ) ทันที
            if (!creating && this.currentUser && String(u.id) === String(this.currentUser.id)) {
              this.currentUser = { ...this.currentUser, name: u.name.trim(), email: u.email.trim(), phone: u.phone.trim(), role: u.role, gender: u.gender, age: u.age };
            }
            this.usModalShow = false;
            await this.loadMembers();
            this.fbDone(creating ? 'สร้างบัญชีผู้ใช้แล้ว' : 'บันทึกแล้ว');
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

