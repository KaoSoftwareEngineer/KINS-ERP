<template>
<div class="rp-page">
  <div class="rp-titlebar">
    <span>🧾 {{ dash.t[dash.lang].vatInvoiceReportTitle }}</span>
    <button class="rp-export-excel" @click="exportExcel">
      <span class="rp-xls-badge"><svg class="xls-ico" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#217346"/><path d="M14 2v6h6" fill="#185c37"/><path d="M9.5 12.5l5 5M14.5 12.5l-5 5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg></span>{{ dash.t[dash.lang].exportExcelPlain }}
    </button>
  </div>
  <div class="rp-filter">
    <div class="rp-f"><label>{{ dash.t[dash.lang].dateLabel }}</label><input type="date" v-model="filter.date" @change="applyFilter" /></div>
    <div class="rp-f"><label>{{ dash.t[dash.lang].customerWord }}</label><input v-model="filter.customer" :placeholder="dash.t[dash.lang].customerWord" @keyup.enter="applyFilter" /></div>
    <div class="rp-f"><label>{{ dash.t[dash.lang].saleTypeLabel }}</label>
      <select v-model="filter.saleType" @change="applyFilter"><option value="">{{ dash.t[dash.lang].allWord }}</option><option value="Wholesale">Wholesale</option><option value="Retail">Retail</option></select>
    </div>
    <div class="rp-f"><label>{{ dash.t[dash.lang].vatCutLabel }}</label>
      <select v-model="filter.vatCut" @change="applyFilter"><option value="">{{ dash.t[dash.lang].allWord }}</option><option value="yes">Yes</option><option value="no">No</option></select>
    </div>
    <div class="rp-f"><label>{{ dash.t[dash.lang].searchInput }}</label><input v-model="filter.q" :placeholder="dash.t[dash.lang].searchInvoiceCustomerPlaceholder" @keyup.enter="applyFilter" /></div>
    <div class="rp-f-actions"><button class="rp-btn-search" @click="applyFilter">🔍 {{ dash.t[dash.lang].searchWord }}</button><button class="rp-btn-reset" @click="reset">↺ {{ dash.t[dash.lang].resetWord }}</button></div>
  </div>
  <div class="rp-found">{{ dash.t[dash.lang].foundItems }} {{ filtered.length.toLocaleString() }} {{ dash.t[dash.lang].itemsUnit }}</div>

  <div class="rp-table-wrap rp-groups">
    <table class="rp-table" style="min-width:1150px">
      <thead>
        <tr>
          <th style="width:40px;">{{ dash.lang === 'th' ? 'ที่' : 'No.' }}</th>
          <th class="rp-sortable" @click="toggleSort('vt_no')">{{ dash.t[dash.lang].invoiceNoLabel }} <span class="rp-sort" :class="{ on: sort.key==='vt_no' }">{{ sortIcon('vt_no') }}</span></th>
          <th class="rp-sortable" @click="toggleSort('invoice_date')">{{ dash.t[dash.lang].dateLabel }} <span class="rp-sort" :class="{ on: sort.key==='invoice_date' }">{{ sortIcon('invoice_date') }}</span></th>
          <th>{{ dash.t[dash.lang].invoiceRefNoLabel }}</th><th>{{ dash.t[dash.lang].saleTypeLabel }}</th><th>{{ dash.t[dash.lang].customerWord }}</th><th>{{ dash.t[dash.lang].accountTermsLabel }}</th><th>{{ dash.t[dash.lang].salespersonLabel }}</th>
          <th class="rp-r">{{ dash.t[dash.lang].totalAmountLabel }}</th><th class="rp-r">{{ dash.t[dash.lang].vatCutTotalLabel }}</th><th>{{ dash.t[dash.lang].vatCutLabel }}</th><th style="width:60px;"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!filtered.length"><td colspan="12" class="rp-empty">{{ dash.t[dash.lang].noInvoiceDataMsg }}</td></tr>
        <tr v-for="(row, idx) in filtered" :key="row.id" :class="{ 'is-sel': selRow === row }" @click="selRow = row">
          <td class="rp-c">{{ idx + 1 }}</td>
          <td class="rp-mono">{{ row.vt_no }}</td>
          <td class="rp-c">{{ fmtDate(row.invoice_date) }}</td>
          <td class="rp-mono">{{ row.inv_ref || '-' }}</td>
          <td>{{ row.sale_type || '-' }}</td>
          <td>{{ row.customer || '-' }}</td>
          <td>{{ row.account_term || '-' }}</td>
          <td>{{ row.salesperson || '-' }}</td>
          <td class="rp-r">{{ fmt(row.net_total) }}</td>
          <td class="rp-r rp-muted">-</td>
          <td class="rp-c"><span class="rp-badge" :class="row.vat_cut ? 'ok' : 'pending'">{{ row.vat_cut ? 'Yes' : 'No' }}</span></td>
          <td><button class="rp-ic" :title="dash.t[dash.lang].viewDetails" @click.stop="selRow = row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01" stroke-linecap="round"/></svg></button></td>
        </tr>
      </tbody>
      <tfoot v-if="filtered.length"><tr><td colspan="8" class="rp-r">{{ dash.t[dash.lang].totalWord }}</td><td class="rp-r">{{ fmt(sumTotal) }}</td><td class="rp-r rp-muted">-</td><td colspan="2"></td></tr></tfoot>
    </table>
  </div>

  <div class="rp-table-wrap rp-rolls">
    <table class="rp-table" style="min-width:1000px">
      <thead>
        <tr>
          <th style="width:40px;">{{ dash.lang === 'th' ? 'ที่' : 'No.' }}</th>
          <th>{{ dash.t[dash.lang].productDetailLabel }}</th><th>{{ dash.t[dash.lang].groupNameLabel }}</th><th class="rp-r">{{ dash.t[dash.lang].qtyLabel }}</th><th>{{ dash.t[dash.lang].unitLabel }}</th>
          <th class="rp-r">{{ dash.t[dash.lang].salePriceLabel }}</th><th class="rp-r">{{ dash.t[dash.lang].priceLabel }}</th><th class="rp-r">{{ dash.t[dash.lang].qtyCutLabel }}</th><th class="rp-r">{{ dash.t[dash.lang].priceReceivedLabel }}</th><th class="rp-r">{{ dash.t[dash.lang].totalWord }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!selItems.length"><td colspan="10" class="rp-empty">{{ dash.t[dash.lang].selectInvoiceAboveMsg }}</td></tr>
        <tr v-for="(it, i) in selItems" :key="i">
          <td class="rp-c">{{ i + 1 }}</td>
          <td>{{ itemName(it) }}</td>
          <td>{{ it.group || dash.t[dash.lang].fabricWord }}</td>
          <td class="rp-r">{{ fmt(itQty(it)) }}</td>
          <td class="rp-c">{{ it.unit || dash.t[dash.lang].yardsUnit }}</td>
          <td class="rp-r">{{ it.unit_price != null ? fmt(it.unit_price) : '-' }}</td>
          <td class="rp-r">{{ it.amount != null ? fmt(it.amount) : '-' }}</td>
          <td class="rp-r rp-muted">-</td><td class="rp-r rp-muted">-</td><td class="rp-r rp-muted">-</td>
        </tr>
      </tbody>
      <tfoot v-if="selItems.length">
        <tr><td colspan="3" class="rp-r">{{ dash.t[dash.lang].totalWord }}</td><td class="rp-r">{{ fmt(selQty) }}</td><td></td><td></td><td class="rp-r">{{ fmt(selSub) }}</td><td colspan="3"></td></tr>
        <tr><td colspan="6" class="rp-r">VAT 7%</td><td class="rp-r">{{ fmt(selVat) }}</td><td colspan="3" style="text-align:left;color:var(--muted)">VAT Exclusive</td></tr>
        <tr><td colspan="6" class="rp-r">{{ dash.t[dash.lang].netTotalLabel }}</td><td class="rp-r rp-bold">{{ fmt(selNet) }}</td><td colspan="3"></td></tr>
      </tfoot>
    </table>
  </div>
</div>
</template>

<script>
export default {
  name: 'VatInvoiceReportPage',
  inject: ['dash'],
  data() { return { rows: [], selRow: null, filter: { date: '', customer: '', saleType: '', vatCut: '', q: '' }, sort: { key: 'vt_no', dir: 'desc' } }; },
  computed: {
    filtered() {
      let list = this.rows.slice(); const f = this.filter;
      if (f.date) list = list.filter(r => this.fmtDate(r.invoice_date) === this.fmtDate(f.date));
      if (f.customer) list = list.filter(r => (r.customer || '').toLowerCase().includes(f.customer.trim().toLowerCase()));
      if (f.saleType) list = list.filter(r => r.sale_type === f.saleType);
      if (f.vatCut) list = list.filter(r => f.vatCut === 'yes' ? r.vat_cut : !r.vat_cut);
      if (f.q) { const q = f.q.trim().toLowerCase(); list = list.filter(r => (r.vt_no || '').toLowerCase().includes(q) || (r.inv_ref || '').toLowerCase().includes(q) || (r.customer || '').toLowerCase().includes(q)); }
      const k = this.sort.key, dir = this.sort.dir === 'asc' ? 1 : -1;
      return list.sort((a, b) => { const av = (a[k] || '').toString().toLowerCase(), bv = (b[k] || '').toString().toLowerCase(); return av < bv ? -dir : av > bv ? dir : 0; });
    },
    selItems() { return this.selRow ? this.itemsOf(this.selRow) : []; },
    selQty() { return this.selItems.reduce((s, it) => s + this.itQty(it), 0); },
    selSub() { return this.selItems.reduce((s, it) => s + (Number(it.amount) || 0), 0); },
    selVat() { return this.selRow ? (Number(this.selRow.vat) || +(this.selSub * 0.07).toFixed(2)) : 0; },
    selNet() { return this.selRow && Number(this.selRow.net_total) ? Number(this.selRow.net_total) : this.selSub + this.selVat; },
    sumTotal() { return this.filtered.reduce((s, r) => s + (Number(r.net_total) || 0), 0); },
  },
  mounted() { this.load(); },
  methods: {
    async load() {
      try {
        const res = await fetch('/api/vat-invoices', { headers: { Authorization: 'Bearer ' + this.dash.token } });
        if (res.status === 401) { this.dash.sessionExpired && this.dash.sessionExpired(); return; }
        const d = await res.json();
        this.rows = d.invoices || d.rows || d.vat_invoices || []; this.selRow = null;
      } catch (e) { this.rows = []; }
    },
    itemsOf(r) { if (r._items) return r._items; let a = []; try { a = typeof r.items_json === 'string' ? JSON.parse(r.items_json || '[]') : (r.items_json || []); } catch (e) {} r._items = Array.isArray(a) ? a : []; return r._items; },
    itemName(it) { return [it.sku || it.name, it.color || it.color_code].filter(Boolean).join(' - ') || '-'; },
    itQty(it) { return Number(it.qty != null ? it.qty : it.ordered_qty) || 0; },
    applyFilter() { this.selRow = null; },
    fmt(v) { return (Number(v) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
    fmtDate(d) { if (!d) return ''; const s = String(d); const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${m[3]}/${m[2]}/${m[1]}` : s.slice(0, 10); },
    toggleSort(k) { if (this.sort.key === k) this.sort.dir = this.sort.dir === 'asc' ? 'desc' : 'asc'; else { this.sort.key = k; this.sort.dir = 'asc'; } },
    sortIcon(k) { return this.sort.key === k ? (this.sort.dir === 'asc' ? '▲' : '▼') : '↕'; },
    reset() { this.filter = { date: '', customer: '', saleType: '', vatCut: '', q: '' }; this.selRow = null; },
    exportExcel() {
      const head = ['เลขที่ใบกำกับภาษี', 'วันที่', 'เลขที่อินวอยส์', 'ประเภทการขาย', 'ลูกค้า', 'เงื่อนไขบัญชี', 'พนักงานขาย', 'ยอดรวม', 'ตัดสต็อก VAT'];
      const lines = [head.join('\t')];
      this.filtered.forEach(r => lines.push([r.vt_no, this.fmtDate(r.invoice_date), r.inv_ref, r.sale_type, r.customer, r.account_term, r.salesperson, r.net_total, r.vat_cut ? 'Yes' : 'No'].join('\t')));
      const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'รายงานใบกำกับภาษี.csv'; a.click();
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
.rp-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.rp-table thead th { position: sticky; top: 0; z-index: 3; background: #3c4453; color: #fff; font-size: 11px; font-weight: 600; letter-spacing: .3px; padding: 7px 12px; text-align: left; white-space: nowrap; border-right: 1px solid rgba(255,255,255,.18); }
.rp-table thead th:last-child { border-right: none; }
.rp-table th.rp-r { text-align: right; }
.rp-table tbody td { padding: 3px 12px; font-size: 12px; line-height: 1.6; border-bottom: 1px solid var(--table-line); border-right: 1px solid var(--table-line); white-space: nowrap; }
.rp-table tbody td:last-child { border-right: none; }
.rp-table tbody tr { cursor: pointer; }
.rp-table tbody tr:hover { background: var(--field); }
.rp-table tbody tr.is-sel { background: #fff8d6; }
.rp-r { text-align: right; } .rp-c { text-align: center; color: var(--muted); } .rp-bold { font-weight: 700; }
.rp-muted { color: var(--muted); } .rp-mono { font-family: 'Courier New', monospace; }
.rp-empty { text-align: center; color: var(--muted); padding: 26px; }
.rp-table tfoot td { position: sticky; bottom: 0; z-index: 2; padding: 9px 10px; border-top: 2px solid var(--table-line); background: var(--field); font-weight: 700; }
.rp-sortable { cursor: pointer; user-select: none; } .rp-sortable:hover { background: #4a5262; }
.rp-sort { opacity: .45; font-size: 10px; margin-left: 3px; } .rp-sort.on { opacity: 1; }
.rp-ic { width: 26px; height: 26px; border-radius: 6px; border: 1px solid var(--field-border); background: var(--field); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; padding: 0; vertical-align: middle; }
.rp-ic svg { width: 14px; height: 14px; }
.rp-badge { display: inline-block; padding: 2px 9px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.rp-badge.ok { background: #dcf1e8; color: #158045; } .rp-badge.pending { background: #fde7cf; color: #b8791a; }
</style>
