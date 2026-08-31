<template>
<div class="rp-page">
  <div class="rp-titlebar">
    <span>🧾 {{ dash.t[dash.lang].vatStockReportTitle }}</span>
    <button class="rp-export-excel" @click="exportExcel">
      <span class="rp-xls-badge"><svg class="xls-ico" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#217346"/><path d="M14 2v6h6" fill="#185c37"/><path d="M9.5 12.5l5 5M14.5 12.5l-5 5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg></span>{{ dash.t[dash.lang].exportExcelPlain }}
    </button>
  </div>

  <!-- ตัวกรอง -->
  <div class="rp-filter">
    <div class="rp-f rp-f-range">
      <label>{{ dash.t[dash.lang].priceReceivedLabel }}</label>
      <div class="rp-range">
        <input type="number" v-model="filter.priceFrom" :placeholder="dash.t[dash.lang].fromShortWord" @keyup.enter="load" />
        <span>–</span>
        <input type="number" v-model="filter.priceTo" :placeholder="dash.t[dash.lang].toShortWord" @keyup.enter="load" />
      </div>
    </div>
    <div class="rp-f"><label>{{ dash.t[dash.lang].unitLabel }}</label>
      <select v-model="filter.unit" @change="load"><option value="">{{ dash.t[dash.lang].allWord }}</option><option v-for="u in unitOptions" :key="u" :value="u">{{ u }}</option></select>
    </div>
    <div class="rp-f-actions">
      <button class="rp-btn-search" @click="load">🔍 {{ dash.t[dash.lang].searchWord }}</button>
      <button class="rp-btn-reset" @click="reset">↺ {{ dash.t[dash.lang].resetWord }}</button>
    </div>
  </div>

  <div class="rp-found">{{ dash.t[dash.lang].foundItems }} {{ items.length.toLocaleString() }} {{ dash.t[dash.lang].itemsUnit }}</div>

  <!-- ตาราง -->
  <div class="rp-table-wrap rp-groups">
    <table class="rp-table">
      <thead>
        <tr>
          <th style="width:40px;">{{ dash.lang === 'th' ? 'ที่' : 'No.' }}</th>
          <th class="rp-r rp-sortable" @click="toggleSort('price')">{{ dash.t[dash.lang].priceReceivedLabel }} <span class="rp-sort" :class="{ on: sort.key === 'price' }">{{ sortIcon('price') }}</span></th>
          <th class="rp-r rp-sortable" @click="toggleSort('qty')">{{ dash.t[dash.lang].qtyLabel }} <span class="rp-sort" :class="{ on: sort.key === 'qty' }">{{ sortIcon('qty') }}</span></th>
          <th>{{ dash.t[dash.lang].unitLabel }}</th>
          <th class="rp-r rp-sortable" @click="toggleSort('value')">{{ dash.t[dash.lang].totalValueLabel }} <span class="rp-sort" :class="{ on: sort.key === 'value' }">{{ sortIcon('value') }}</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in sortedItems" :key="idx">
          <td class="rp-c">{{ idx + 1 }}</td>
          <td class="rp-r">{{ row.price != null ? fmt(row.price) : '-' }}</td>
          <td class="rp-r rp-bold">{{ fmt(row.qty) }}</td>
          <td>{{ row.unit || dash.t[dash.lang].yardsUnit }}</td>
          <td class="rp-r">{{ row.value != null ? fmt(row.value) : '-' }}</td>
        </tr>
        <tr v-if="items.length === 0"><td colspan="5" class="rp-empty">{{ dash.t[dash.lang].noVatReceiptDataMsg }}</td></tr>
      </tbody>
      <tfoot v-if="items.length">
        <tr>
          <td colspan="2" class="rp-r rp-bold">{{ dash.t[dash.lang].totalWord }}</td>
          <td class="rp-r rp-bold">{{ fmt(summary.qty) }}</td>
          <td></td>
          <td class="rp-r rp-bold">{{ Number(summary.value) ? fmt(summary.value) : '-' }}</td>
        </tr>
      </tfoot>
    </table>
  </div>
</div>
</template>

<script>
export default {
  name: 'VatStockReportPage',
  inject: ['dash'],
  data() {
    return {
      filter: { priceFrom: '', priceTo: '', unit: '' },
      items: [], summary: { qty: 0, value: 0 },
      sort: { key: '', dir: 'asc' },
    };
  },
  computed: {
    unitOptions() { return [...new Set(this.items.map(i => i.unit).filter(Boolean))].sort(); },
    sortedItems() {
      if (!this.sort.key) return this.items;
      const k = this.sort.key, dir = this.sort.dir === 'asc' ? 1 : -1;
      return [...this.items].sort((a, b) => { const av = Number(a[k]) || 0, bv = Number(b[k]) || 0; return (av - bv) * dir; });
    },
  },
  mounted() { this.load(); },
  methods: {
    authHeaders() { return { Authorization: 'Bearer ' + this.dash.token }; },
    fmt(v) { return (Number(v) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
    async load() {
      const qs = new URLSearchParams(Object.entries(this.filter).filter(([, v]) => v !== '' && v != null)).toString();
      try {
        const res = await fetch('/api/reports/vat-stock' + (qs ? '?' + qs : ''), { headers: this.authHeaders() });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) { this.items = d.items || []; this.summary = { qty: 0, value: 0, ...(d.summary || {}) }; }
      } catch (e) { this.dash.fbFail('โหลดรายงานไม่สำเร็จ'); }
    },
    reset() { this.filter = { priceFrom: '', priceTo: '', unit: '' }; this.load(); },
    toggleSort(key) {
      if (this.sort.key === key) this.sort.dir = this.sort.dir === 'asc' ? 'desc' : 'asc';
      else { this.sort.key = key; this.sort.dir = 'asc'; }
    },
    sortIcon(key) { if (this.sort.key !== key) return '↕'; return this.sort.dir === 'asc' ? '▲' : '▼'; },
    async exportExcel() {
      const head = ['ราคารับ', 'จำนวน', 'หน่วย', 'มูลค่ารวม'];
      const body = this.sortedItems.map(r => [r.price != null ? r.price : '-', Number(r.qty) || 0, r.unit || 'หลา', r.value != null ? r.value : '-']);
      const XLSX = await import('xlsx');
      const sheet = XLSX.utils.aoa_to_sheet([head, ...body]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, sheet, 'VAT คงคลัง');
      XLSX.writeFile(wb, `รายงานสินค้า-VAT-คงคลัง-${new Date().toISOString().slice(0, 10)}.xlsx`);
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
.rp-filter { display: flex; flex-wrap: wrap; gap: 10px 18px; align-items: flex-end; background: var(--surface); border: 1px solid var(--field-border); border-radius: 12px; padding: 9px 12px; margin-bottom: 12px; }
.rp-f { display: flex; flex-direction: column; gap: 4px; min-width: 150px; }
.rp-f-range { min-width: 220px; }
.rp-f > label { font-size: 11.5px; color: var(--muted); font-weight: 600; }
.rp-range { display: flex; align-items: center; gap: 6px; }
.rp-range input { flex: 1; min-width: 0; }
.rp-f input, .rp-f select { height: 34px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12px; font-family: inherit; background: var(--field); color: var(--text); }
.rp-f input:focus, .rp-f select:focus { outline: none; border-color: #2F65F6; background: var(--surface); }
.rp-f-actions { display: flex; gap: 8px; }
.rp-btn-search { padding: 8px 16px; border: 1px solid #1e3a8a; background: #1e3a8a; color: #fff; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; }
.rp-btn-search:hover { background: #172b6b; }
.rp-btn-reset { padding: 8px 16px; border: 1px solid #a82a3a; background: #a82a3a; color: #fff; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; }
.rp-btn-reset:hover { background: #8a1c2b; }
.rp-found { font-size: 12px; color: #2F65F6; font-weight: 600; margin-bottom: 6px; }
.rp-table-wrap { overflow-x: auto; border: 1px solid var(--table-line); border-radius: 10px; margin-bottom: 16px; background: var(--surface); }
.rp-groups { max-height: 560px; overflow-y: auto; }
.rp-table { width: 100%; border-collapse: collapse; font-size: 12px; min-width: 700px; }
.rp-table thead th { position: sticky; top: 0; z-index: 3; background: #3c4453; color: #fff; font-size: 11px; font-weight: 600; letter-spacing: .3px; padding: 7px 12px; text-align: left; white-space: nowrap; border-right: 1px solid rgba(255,255,255,.18); }
.rp-table thead th:last-child { border-right: none; }
.rp-table th.rp-r { text-align: right; }
.rp-table tbody td { padding: 3px 12px; font-size: 12px; line-height: 1.6; border-bottom: 1px solid var(--table-line); border-right: 1px solid var(--table-line); white-space: nowrap; }
.rp-table tbody td:last-child { border-right: none; }
.rp-table tbody tr:hover { background: var(--field); }
.rp-r { text-align: right; } .rp-c { text-align: center; color: var(--muted); }
.rp-bold { font-weight: 700; }
.rp-empty { text-align: center; color: var(--muted); padding: 26px; }
.rp-table tfoot td { position: sticky; bottom: 0; z-index: 2; padding: 9px 10px; border-top: 2px solid var(--table-line); background: var(--field); font-weight: 700; }
.rp-sortable { cursor: pointer; user-select: none; }
.rp-sortable:hover { background: #4a5262; }
.rp-sort { opacity: .45; font-size: 10px; margin-left: 3px; }
.rp-sort.on { opacity: 1; }
</style>
