<template>
<div class="rp-page">
  <div class="rp-titlebar">
    <span>📥 {{ dash.t[dash.lang].goodsReceiptReportTitle }}</span>
    <button class="rp-export-excel" @click="exportExcel">
      <span class="rp-xls-badge"><svg class="xls-ico" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#217346"/><path d="M14 2v6h6" fill="#185c37"/><path d="M9.5 12.5l5 5M14.5 12.5l-5 5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg></span>{{ dash.t[dash.lang].exportExcelPlain }}
    </button>
  </div>

  <!-- ตัวกรอง -->
  <div class="rp-filter">
    <div class="rp-f"><label>{{ dash.t[dash.lang].searchInput }}</label><input v-model="filter.q" :placeholder="dash.t[dash.lang].searchReceiveVendorSkuPlaceholder" @keyup.enter="load" /></div>
    <div class="rp-f"><label>{{ dash.t[dash.lang].skuLabel }}</label><input v-model="filter.sku" @keyup.enter="load" /></div>
    <div class="rp-f"><label>{{ dash.t[dash.lang].receiptTypeLabel }}</label>
      <select v-model="filter.receiptType" @change="load"><option value="">{{ dash.t[dash.lang].allWord }}</option><option value="Purchase">Purchase</option><option value="Dye">Dye</option></select>
    </div>
    <div class="rp-f"><label>{{ dash.t[dash.lang].productTypeLabel }}</label>
      <select v-model="filter.productType" @change="load"><option value="">{{ dash.t[dash.lang].allWord }}</option><option value="ผ้าสำเร็จ">{{ dash.t[dash.lang].finishedFabricWord }}</option><option value="ผ้าดิบ">{{ dash.t[dash.lang].rawFabricWord }}</option><option value="ผ้าย้อม">{{ dash.t[dash.lang].dyedFabricWord }}</option></select>
    </div>
    <div class="rp-f"><label>{{ dash.t[dash.lang].vendorFactoryLabel }}</label><input v-model="filter.party" @keyup.enter="load" /></div>
    <div class="rp-f"><label>{{ dash.t[dash.lang].warehouseLabel }}</label><input v-model="filter.warehouse" @keyup.enter="load" /></div>
    <div class="rp-f-actions">
      <button class="rp-btn-search" @click="load">🔍 {{ dash.t[dash.lang].searchWord }}</button>
      <button class="rp-btn-reset" @click="reset">↺ {{ dash.t[dash.lang].resetWord }}</button>
    </div>
  </div>

  <div class="rp-found">{{ dash.t[dash.lang].foundItems }} {{ items.length.toLocaleString() }} {{ dash.t[dash.lang].itemsUnit }}</div>

  <!-- ตารางใบรับ -->
  <div class="rp-table-wrap rp-groups">
    <table class="rp-table">
      <thead>
        <tr>
          <th style="width:40px;">{{ dash.lang === 'th' ? 'ที่' : 'No.' }}</th>
          <th class="rp-sortable" @click="toggleSort('in_no')">{{ dash.t[dash.lang].receiptNoLabel }} <span class="rp-sort" :class="{ on: sort.key === 'in_no' }">{{ sortIcon('in_no') }}</span></th>
          <th class="rp-sortable" @click="toggleSort('receipt_date')">{{ dash.t[dash.lang].dateLabel }} <span class="rp-sort" :class="{ on: sort.key === 'receipt_date' }">{{ sortIcon('receipt_date') }}</span></th>
          <th>{{ dash.t[dash.lang].receiptTypeLabel }}</th>
          <th class="rp-sortable" @click="toggleSort('product_type')">{{ dash.t[dash.lang].productTypeLabel }} <span class="rp-sort" :class="{ on: sort.key === 'product_type' }">{{ sortIcon('product_type') }}</span></th>
          <th>{{ dash.t[dash.lang].refNoLabel }}</th>
          <th class="rp-sortable" @click="toggleSort('party')">{{ dash.t[dash.lang].partnerWord }} <span class="rp-sort" :class="{ on: sort.key === 'party' }">{{ sortIcon('party') }}</span></th>
          <th class="rp-r rp-sortable" @click="toggleSort('folds')">{{ dash.t[dash.lang].totalFoldLabel }} <span class="rp-sort" :class="{ on: sort.key === 'folds' }">{{ sortIcon('folds') }}</span></th>
          <th class="rp-r rp-sortable" @click="toggleSort('qty')">{{ dash.t[dash.lang].totalQtyLabel }} <span class="rp-sort" :class="{ on: sort.key === 'qty' }">{{ sortIcon('qty') }}</span></th>
          <th class="rp-r rp-sortable" @click="toggleSort('amount')">{{ dash.t[dash.lang].totalAmountLabel }} <span class="rp-sort" :class="{ on: sort.key === 'amount' }">{{ sortIcon('amount') }}</span></th>
          <th>{{ dash.t[dash.lang].payStatusLabel }}</th>
          <th>{{ dash.t[dash.lang].status }}</th>
          <th>{{ dash.t[dash.lang].deliveryLocLabel }}</th>
          <th style="width:44px;"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in sortedItems" :key="row.key" :class="{ 'is-sel': selRow === row }" @click="selectRow(row)">
          <td class="rp-c">{{ idx + 1 }}</td>
          <td class="rp-mono">{{ row.in_no }}</td>
          <td class="rp-c">{{ row.receipt_date || '-' }}</td>
          <td>{{ row.receipt_type || '-' }}</td>
          <td>{{ row.product_type }}</td>
          <td>{{ row.ref_no || '-' }}</td>
          <td>{{ row.party || '-' }}</td>
          <td class="rp-r">{{ Number(row.folds).toLocaleString() }}</td>
          <td class="rp-r rp-bold">{{ fmt(row.qty) }}</td>
          <td class="rp-r" :class="{ 'rp-muted': !Number(row.amount) }">{{ Number(row.amount) ? fmt(row.amount) : '-' }}</td>
          <td class="rp-c">{{ row.pay_status }}</td>
          <td class="rp-c">{{ row.status }}</td>
          <td>{{ row.warehouse || '-' }}</td>
          <td class="rp-c">
            <button class="rp-ic rp-print" :title="dash.t[dash.lang].printReceiptTitle" @click.stop="printReceipt(row)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            </button>
          </td>
        </tr>
        <tr v-if="items.length === 0"><td colspan="14" class="rp-empty">{{ dash.t[dash.lang].noDataFoundMsg }}</td></tr>
      </tbody>
      <tfoot v-if="items.length">
        <tr>
          <td colspan="7" class="rp-r rp-bold">{{ dash.t[dash.lang].totalWord }}</td>
          <td class="rp-r rp-bold">{{ summary.folds.toLocaleString() }}</td>
          <td class="rp-r rp-bold">{{ fmt(summary.qty) }}</td>
          <td class="rp-r rp-bold">{{ Number(summary.amount) ? fmt(summary.amount) : '-' }}</td>
          <td colspan="4"></td>
        </tr>
      </tfoot>
    </table>
  </div>

  <!-- ตารางรายการสินค้าในใบรับ (เลือกแถว) -->
  <div class="rp-table-wrap rp-rolls">
    <table class="rp-table">
      <thead>
        <tr>
          <th style="width:40px;">{{ dash.lang === 'th' ? 'ที่' : 'No.' }}</th>
          <th>{{ dash.t[dash.lang].skuLabel }}</th><th>{{ dash.t[dash.lang].colorCodeLabel }}</th><th>{{ dash.t[dash.lang].typeLabel }}</th><th>{{ dash.t[dash.lang].nameLabel }}</th><th>{{ dash.t[dash.lang].widthLabel }}</th>
          <th class="rp-r">{{ dash.t[dash.lang].foldLabel }}</th><th class="rp-r">{{ dash.t[dash.lang].qtyLabel }}</th><th>{{ dash.t[dash.lang].unitLabel }}</th>
          <th class="rp-r">{{ dash.t[dash.lang].pricePerUnitLabel }}</th><th class="rp-r">{{ dash.t[dash.lang].priceLabel }}</th><th class="rp-r">{{ dash.t[dash.lang].costPerUnitLabel }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(it, i) in selItems" :key="i">
          <td class="rp-c">{{ i + 1 }}</td>
          <td>{{ it.sku || '-' }}</td>
          <td>{{ it.color || '-' }}</td>
          <td>{{ it.type || '-' }}</td>
          <td>{{ it.name || '-' }}</td>
          <td>{{ it.width || '-' }}</td>
          <td class="rp-r">{{ Number(it.fold) || 0 }}</td>
          <td class="rp-r rp-bold">{{ fmt(it.qty) }}</td>
          <td>{{ it.unit || dash.t[dash.lang].yardsUnit }}</td>
          <td class="rp-r">{{ it.unit_price !== '' ? fmt(it.unit_price) : '-' }}</td>
          <td class="rp-r">{{ it.amount !== '' ? fmt(it.amount) : '-' }}</td>
          <td class="rp-r">{{ it.cost !== '' ? fmt(it.cost) : '-' }}</td>
        </tr>
        <tr v-if="selItems.length === 0"><td colspan="12" class="rp-empty">{{ selRow === null ? dash.t[dash.lang].clickRowToViewProductMsg : dash.t[dash.lang].noItemsInReceiptGoodsMsg }}</td></tr>
      </tbody>
      <tfoot v-if="selItems.length">
        <tr><td colspan="6" class="rp-r rp-bold">{{ dash.t[dash.lang].totalWord }}</td><td class="rp-r rp-bold">{{ selFolds.toLocaleString() }}</td><td class="rp-r rp-bold">{{ fmt(selQty) }}</td><td colspan="4"></td></tr>
      </tfoot>
    </table>
  </div>
</div>
</template>

<script>
import { buildDocPdf } from '../../utils/pdfLabels.js';
export default {
  name: 'GoodsReceiptReportPage',
  inject: ['dash'],
  data() {
    return {
      filter: { q: '', sku: '', receiptType: '', productType: '', party: '', warehouse: '' },
      items: [], summary: { folds: 0, qty: 0, amount: 0 },
      selRow: null, selItems: [],
      sort: { key: '', dir: 'asc' },
    };
  },
  computed: {
    selFolds() { return this.selItems.reduce((s, r) => s + (Number(r.fold) || 0), 0); },
    selQty() { return this.selItems.reduce((s, r) => s + (Number(r.qty) || 0), 0); },
    sortedItems() {
      if (!this.sort.key) return this.items;
      const k = this.sort.key, dir = this.sort.dir === 'asc' ? 1 : -1;
      const num = ['folds', 'qty', 'amount'].includes(k);
      const val = (r) => num ? (Number(r[k]) || 0) : (r[k] || '').toString().toLowerCase();
      return [...this.items].sort((a, b) => { const av = val(a), bv = val(b); if (av < bv) return -1 * dir; if (av > bv) return 1 * dir; return 0; });
    },
  },
  mounted() { this.load(); },
  methods: {
    authHeaders() { return { Authorization: 'Bearer ' + this.dash.token }; },
    fmt(v) { return (Number(v) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
    async load() {
      const qs = new URLSearchParams(Object.entries(this.filter).filter(([, v]) => v)).toString();
      try {
        const res = await fetch('/api/reports/goods-receipts' + (qs ? '?' + qs : ''), { headers: this.authHeaders() });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) {
          this.items = d.items || [];
          this.summary = { folds: 0, qty: 0, amount: 0, ...(d.summary || {}) };
          this.selRow = null; this.selItems = [];
        }
      } catch (e) { this.dash.fbFail('โหลดรายงานไม่สำเร็จ'); }
    },
    reset() { this.filter = { q: '', sku: '', receiptType: '', productType: '', party: '', warehouse: '' }; this.load(); },
    toggleSort(key) {
      if (this.sort.key === key) this.sort.dir = this.sort.dir === 'asc' ? 'desc' : 'asc';
      else { this.sort.key = key; this.sort.dir = 'asc'; }
    },
    sortIcon(key) { if (this.sort.key !== key) return '↕'; return this.sort.dir === 'asc' ? '▲' : '▼'; },
    selectRow(row) { this.selRow = row; this.selItems = row.items || []; },
    async printReceipt(row) {
      const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
      const rowsHtml = (row.items || []).map((it, i) => `<tr><td>${i + 1}</td><td>${esc(it.sku)}</td><td>${esc(it.color)}</td><td>${esc(it.name)}</td><td>${esc(it.width)}</td><td style="text-align:right">${Number(it.fold) || 0}</td><td style="text-align:right">${this.fmt(it.qty)}</td></tr>`).join('');
      const html = `
        <style>
          h2{margin:0 0 4px;font-size:18px}.meta{color:#444;margin-bottom:12px;font-size:12px;line-height:1.7}
          table{width:100%;border-collapse:collapse;margin-top:8px;font-size:13px}th,td{border:1px solid #999;padding:6px 8px;text-align:left}th{background:#eee}
        </style>
        <h2>ใบรับสินค้า ${esc(row.in_no)}</h2>
        <div class="meta">วันที่: ${esc(row.receipt_date)} · ประเภทการรับ: ${esc(row.receipt_type)} · ประเภทสินค้า: ${esc(row.product_type)}<br>
        คู่ค้า: ${esc(row.party)} · เลขที่อ้างอิง: ${esc(row.ref_no || '-')} · สถานที่จัดส่ง: ${esc(row.warehouse)}</div>
        <table><thead><tr><th>ที่</th><th>รหัสสินค้า</th><th>รหัสสี</th><th>ชื่อ</th><th>หน้ากว้าง</th><th>พับ</th><th>จำนวน (หลา)</th></tr></thead>
        <tbody>${rowsHtml || '<tr><td colspan="7" style="text-align:center">ไม่มีรายการ</td></tr>'}</tbody>
        <tfoot><tr><th colspan="5" style="text-align:right">รวม</th><th style="text-align:right">${row.folds}</th><th style="text-align:right">${this.fmt(row.qty)}</th></tr></tfoot></table>`;
      try { await buildDocPdf(html, { filename: 'ใบรับสินค้า-' + row.in_no + '.pdf', format: 'a4' }); }
      catch (e) { this.dash.ui.toast('สร้าง PDF ไม่สำเร็จ', 'error', { title: 'การแจ้งเตือน' }); }
    },
    async exportExcel() {
      const head = ['เลขที่รับสินค้า', 'วันที่', 'ประเภทการรับ', 'ประเภทสินค้า', 'เลขที่อ้างอิง', 'คู่ค้า', 'พับรวม', 'จำนวนรวม', 'ยอดรวม', 'สถานะชำระเงิน', 'สถานะ', 'สถานที่จัดส่ง'];
      const body = this.sortedItems.map(r => [r.in_no, r.receipt_date, r.receipt_type, r.product_type, r.ref_no, r.party, Number(r.folds) || 0, Number(r.qty) || 0, Number(r.amount) || 0, r.pay_status, r.status, r.warehouse]);
      const XLSX = await import('xlsx');
      const sheet = XLSX.utils.aoa_to_sheet([head, ...body]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, sheet, 'รับสินค้า');
      XLSX.writeFile(wb, `รายงานการรับสินค้า-${new Date().toISOString().slice(0, 10)}.xlsx`);
    },
  },
};
</script>

<style scoped>
.rp-page { font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif; color: var(--text); font-size: 12px; }
.rp-titlebar { display: flex; align-items: center; justify-content: space-between; font-weight: 700; font-size: 14px; margin-bottom: 12px; }
.rp-export-excel { display: inline-flex; align-items: center; gap: 7px; padding: 7px 15px; border: 1px solid #1a9c54; background: #1a9c54; color: #fff; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 12px; }
.rp-export-excel:hover { background: #158045; }
.rp-xls-badge { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; background: #fff; border-radius: 5px; }
.rp-export-excel .xls-ico { width: 14px; height: 14px; }
.rp-filter { display: flex; flex-wrap: wrap; gap: 10px 16px; align-items: flex-end; background: var(--surface); border: 1px solid var(--field-border); border-radius: 12px; padding: 9px 12px; margin-bottom: 12px; }
.rp-f { display: flex; flex-direction: column; gap: 4px; min-width: 150px; flex: 1 1 150px; max-width: 220px; }
.rp-f > label { font-size: 11.5px; color: var(--muted); font-weight: 600; }
.rp-f input, .rp-f select { height: 34px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12px; font-family: inherit; background: var(--field); color: var(--text); }
.rp-f input:focus, .rp-f select:focus { outline: none; border-color: #2F65F6; background: var(--surface); }
.rp-f-actions { display: flex; gap: 8px; }
.rp-btn-search { padding: 8px 16px; border: 1px solid #1e3a8a; background: #1e3a8a; color: #fff; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; }
.rp-btn-search:hover { background: #172b6b; }
.rp-btn-reset { padding: 8px 16px; border: 1px solid #a82a3a; background: #a82a3a; color: #fff; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; }
.rp-btn-reset:hover { background: #8a1c2b; }
.rp-found { font-size: 12px; color: #2F65F6; font-weight: 600; margin-bottom: 6px; }
.rp-table-wrap { overflow-x: auto; border: 1px solid var(--table-line); border-radius: 10px; margin-bottom: 16px; background: var(--surface); }
.rp-groups { max-height: 460px; overflow-y: auto; }
.rp-rolls { max-height: 320px; overflow-y: auto; }
.rp-table { width: 100%; border-collapse: collapse; font-size: 12px; min-width: 1200px; }
.rp-table thead th { position: sticky; top: 0; z-index: 3; background: #3c4453; color: #fff; font-size: 11px; font-weight: 600; letter-spacing: .3px; padding: 7px 12px; text-align: left; white-space: nowrap; border-right: 1px solid rgba(255,255,255,.18); }
.rp-table thead th:last-child { border-right: none; }
.rp-table th.rp-r { text-align: right; }
.rp-table tbody td { padding: 3px 12px; font-size: 12px; line-height: 1.6; border-bottom: 1px solid var(--table-line); border-right: 1px solid var(--table-line); white-space: nowrap; }
.rp-table tbody td:last-child { border-right: none; }
.rp-table tbody tr { cursor: pointer; }
.rp-table tbody tr:hover { background: var(--field); }
.rp-table tbody tr.is-sel { background: #fff8d6; }
.rp-r { text-align: right; } .rp-c { text-align: center; color: var(--muted); }
.rp-bold { font-weight: 700; } .rp-muted { color: var(--muted); } .rp-mono { font-family: 'Courier New', monospace; }
.rp-empty { text-align: center; color: var(--muted); padding: 26px; }
.rp-table tfoot td { position: sticky; bottom: 0; z-index: 2; padding: 9px 10px; border-top: 2px solid var(--table-line); background: var(--field); font-weight: 700; }
.rp-sortable { cursor: pointer; user-select: none; }
.rp-sortable:hover { background: #4a5262; }
.rp-sort { opacity: .45; font-size: 10px; margin-left: 3px; }
.rp-sort.on { opacity: 1; }
.rp-ic { width: 26px; height: 26px; border-radius: 6px; border: 1px solid var(--field-border); background: var(--field); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; padding: 0; vertical-align: middle; transition: background .15s, border-color .15s; }
.rp-ic svg { width: 14px; height: 14px; }
.rp-print { color: #111; }
.rp-print:hover { background: var(--field); border-color: #111; }
</style>
