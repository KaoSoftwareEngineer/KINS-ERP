<template>
<div class="rp-page">
  <div class="rp-titlebar">
    <span>📦 {{ dash.t[dash.lang].reorderPointReportTitle }}</span>
    <button class="rp-export-excel" @click="exportExcel">
      <span class="rp-xls-badge"><svg class="xls-ico" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#217346"/><path d="M14 2v6h6" fill="#185c37"/><path d="M9.5 12.5l5 5M14.5 12.5l-5 5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg></span>{{ dash.t[dash.lang].exportExcelPlain }}
    </button>
  </div>
  <div class="rp-filter">
    <div class="rp-f"><label>{{ dash.t[dash.lang].skuLabel }}</label><input v-model="filter.sku" :placeholder="dash.t[dash.lang].skuLabel" @keyup.enter="applyFilter" /></div>
    <div class="rp-f"><label>{{ dash.t[dash.lang].colorCodeLabel }}</label><input v-model="filter.color" :placeholder="dash.t[dash.lang].colorCodeLabel" @keyup.enter="applyFilter" /></div>
    <div class="rp-f" style="max-width:150px"><label>{{ dash.t[dash.lang].periodLabel }}</label>
      <select v-model="filter.period"><option>180 Days</option><option>90 Days</option><option>30 Days</option></select>
    </div>
    <div class="rp-f rp-f-checks">
      <label class="rp-check"><input type="checkbox" v-model="filter.noAlert" @change="applyFilter" /> {{ dash.t[dash.lang].noAlertLabel }}</label>
      <label class="rp-check"><input type="checkbox" v-model="filter.belowReorder" @change="applyFilter" /> {{ dash.t[dash.lang].belowReorderPointLabel }}</label>
    </div>
    <div class="rp-f-actions"><button class="rp-btn-search" @click="applyFilter">🔍 {{ dash.t[dash.lang].searchWord }}</button><button class="rp-btn-reset" @click="reset">↺ {{ dash.t[dash.lang].resetWord }}</button></div>
  </div>
  <div class="rp-found">{{ dash.t[dash.lang].foundItems }} {{ filtered.length.toLocaleString() }} {{ dash.t[dash.lang].itemsUnit }}</div>

  <div class="rp-table-wrap rp-tall">
    <table class="rp-table" style="min-width:900px">
      <thead>
        <tr>
          <th style="width:50px;">{{ dash.lang === 'th' ? 'ที่' : 'No.' }}</th>
          <th>{{ dash.t[dash.lang].skuLabel }}</th><th>{{ dash.t[dash.lang].nameLabel }}</th><th>{{ dash.t[dash.lang].colorCodeLabel }}</th>
          <th class="rp-r">{{ dash.t[dash.lang].stockQtyLabel }}</th><th class="rp-r">Re-order</th><th>{{ dash.t[dash.lang].unitLabel }}</th><th>{{ dash.t[dash.lang].noAlertLabel }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!filtered.length"><td colspan="8" class="rp-empty">{{ dash.t[dash.lang].noDataGenericMsg }}</td></tr>
        <tr v-for="(r, idx) in paged" :key="idx" :class="{ 'is-low': r.stock < r.reorder }">
          <td class="rp-c">{{ (page - 1) * pageSize + idx + 1 }}</td>
          <td>{{ r.sku }}</td>
          <td>{{ r.name || '' }}</td>
          <td class="rp-color">{{ r.shade || r.color_code || '-' }}</td>
          <td class="rp-r">{{ fmt(r.stock) }}</td>
          <td class="rp-r">{{ fmt(r.reorder) }}</td>
          <td class="rp-c">{{ r.unit || dash.t[dash.lang].yardsUnit }}</td>
          <td class="rp-c"><input type="checkbox" v-model="r.noAlert" /></td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="rp-pager" v-if="filtered.length > pageSize">
    <button class="rp-pg" :disabled="page === 1" @click="page--">{{ dash.t[dash.lang].prevPage }}</button>
    <span>{{ dash.t[dash.lang].pageWord }} {{ page }} / {{ totalPages }}</span>
    <button class="rp-pg" :disabled="page === totalPages" @click="page++">{{ dash.t[dash.lang].nextPage }}</button>
  </div>
</div>
</template>

<script>
export default {
  name: 'ReorderPointReportPage',
  inject: ['dash'],
  data() { return { rows: [], filter: { sku: '', color: '', period: '180 Days', noAlert: false, belowReorder: false }, page: 1, pageSize: 100 }; },
  computed: {
    filtered() {
      let list = this.rows.slice(); const f = this.filter;
      if (f.sku) list = list.filter(r => (r.sku || '').toLowerCase().includes(f.sku.trim().toLowerCase()));
      if (f.color) { const q = f.color.trim().toLowerCase(); list = list.filter(r => ((r.shade || '') + (r.color_code || '')).toLowerCase().includes(q)); }
      if (f.belowReorder) list = list.filter(r => r.stock < r.reorder);
      if (f.noAlert) list = list.filter(r => r.noAlert);
      return list;
    },
    totalPages() { return Math.max(1, Math.ceil(this.filtered.length / this.pageSize)); },
    paged() { const st = (this.page - 1) * this.pageSize; return this.filtered.slice(st, st + this.pageSize); },
  },
  watch: { filtered() { if (this.page > this.totalPages) this.page = 1; } },
  mounted() { this.load(); },
  methods: {
    async load() {
      try {
        const res = await fetch('/api/reports/reorder-point', { headers: { Authorization: 'Bearer ' + this.dash.token } });
        if (res.status === 401) { this.dash.sessionExpired && this.dash.sessionExpired(); return; }
        const d = await res.json();
        this.rows = (d.items || []).map(x => ({ ...x, noAlert: false }));
      } catch (e) { this.rows = []; }
    },
    applyFilter() { this.page = 1; },
    fmt(v) { return (Number(v) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
    reset() { this.filter = { sku: '', color: '', period: '180 Days', noAlert: false, belowReorder: false }; this.page = 1; },
    exportExcel() {
      const head = ['รหัสสินค้า', 'ชื่อ', 'รหัสสี', 'จำนวนสต็อก', 'Re-order', 'หน่วย'];
      const lines = [head.join('\t')];
      this.filtered.forEach(r => lines.push([r.sku, r.name, r.shade || r.color_code, r.stock, r.reorder, r.unit].join('\t')));
      const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'รายงานจุดสั่งซื้อสินค้า.csv'; a.click();
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
.rp-f { display: flex; flex-direction: column; gap: 4px; min-width: 150px; }
.rp-f-checks { flex-direction: column; gap: 6px; justify-content: center; min-width: auto; }
.rp-check { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; }
.rp-f > label { font-size: 11.5px; color: var(--muted); font-weight: 600; }
.rp-f input:not([type=checkbox]), .rp-f select { height: 34px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12px; font-family: inherit; background: var(--field); color: var(--text); }
.rp-f input:focus, .rp-f select:focus { outline: none; border-color: #2F65F6; background: var(--surface); }
.rp-f-actions { display: flex; gap: 8px; align-items: flex-end; }
.rp-btn-search { padding: 8px 16px; border: 1px solid #1e3a8a; background: #1e3a8a; color: #fff; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; }
.rp-btn-search:hover { background: #172b6b; }
.rp-btn-reset { padding: 8px 16px; border: 1px solid #a82a3a; background: #a82a3a; color: #fff; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; }
.rp-btn-reset:hover { background: #8a1c2b; }
.rp-found { font-size: 12px; color: #2F65F6; font-weight: 600; margin-bottom: 6px; }
.rp-table-wrap { overflow-x: auto; border: 1px solid var(--table-line); border-radius: 10px; margin-bottom: 8px; background: var(--surface); }
.rp-tall { max-height: 560px; overflow-y: auto; }
.rp-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.rp-table thead th { position: sticky; top: 0; z-index: 3; background: #3c4453; color: #fff; font-size: 11px; font-weight: 600; padding: 7px 12px; text-align: left; white-space: nowrap; border-right: 1px solid rgba(255,255,255,.18); }
.rp-table thead th:last-child { border-right: none; }
.rp-table th.rp-r { text-align: right; }
.rp-table tbody td { padding: 4px 12px; font-size: 12px; line-height: 1.6; border-bottom: 1px solid var(--table-line); border-right: 1px solid var(--table-line); white-space: nowrap; }
.rp-table tbody td:last-child { border-right: none; }
.rp-table tbody tr:hover { background: var(--field); }
.rp-table tbody tr.is-low { background: #fdeaea; }
.rp-r { text-align: right; } .rp-c { text-align: center; color: var(--muted); }
.rp-color { color: #1e4fd6; }
.rp-empty { text-align: center; color: var(--muted); padding: 26px; }
.rp-pager { display: flex; align-items: center; justify-content: flex-end; gap: 12px; font-size: 12px; }
.rp-pg { padding: 6px 14px; border: 1px solid var(--field-border); border-radius: 8px; background: var(--field); cursor: pointer; font-family: inherit; }
.rp-pg:disabled { opacity: .5; cursor: default; }
</style>
