<template>
<div class="rp-page">
  <div class="rp-titlebar">
    <span>🧵 {{ dash.t[dash.lang].rawStockReportTitle }}</span>
    <button class="rp-export-excel" @click="exportExcel">
      <span class="rp-xls-badge"><svg class="xls-ico" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#217346"/><path d="M14 2v6h6" fill="#185c37"/><path d="M9.5 12.5l5 5M14.5 12.5l-5 5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg></span>{{ dash.t[dash.lang].exportExcelPlain }}
    </button>
  </div>

  <div class="rp-filter">
    <div class="rp-f"><label>{{ dash.t[dash.lang].searchInput }}</label><input v-model="filter.q" :placeholder="dash.t[dash.lang].nameSkuComponentPlaceholder" @keyup.enter="load" /></div>
    <div class="rp-f"><label>{{ dash.t[dash.lang].skuLabel }}</label><input v-model="filter.sku" @keyup.enter="load" /></div>
    <div class="rp-f"><label>{{ dash.t[dash.lang].widthLabel }}</label><input v-model="filter.width" @keyup.enter="load" /></div>
    <div class="rp-f"><label>{{ dash.t[dash.lang].warehouseLabel }}</label><input v-model="filter.warehouse" :placeholder="dash.t[dash.lang].factoryWarehousePlaceholder" @keyup.enter="load" /></div>
    <div class="rp-f-actions">
      <button class="rp-btn-search" @click="load">🔍 {{ dash.t[dash.lang].searchWord }}</button>
      <button class="rp-btn-reset" @click="reset">↺ {{ dash.t[dash.lang].resetWord }}</button>
    </div>
  </div>

  <div class="rp-found">{{ dash.t[dash.lang].foundItems }} {{ items.length.toLocaleString() }} {{ dash.t[dash.lang].itemsUnit }}</div>

  <div class="rp-table-wrap rp-groups">
    <table class="rp-table">
      <thead>
        <tr>
          <th style="width:40px;">{{ dash.lang === 'th' ? 'ที่' : 'No.' }}</th>
          <th class="rp-sortable" @click="toggleSort('sku')">{{ dash.t[dash.lang].skuLabel }} <span class="rp-sort" :class="{ on: sort.key === 'sku' }">{{ sortIcon('sku') }}</span></th>
          <th class="rp-sortable" @click="toggleSort('name')">{{ dash.t[dash.lang].nameLabel }} <span class="rp-sort" :class="{ on: sort.key === 'name' }">{{ sortIcon('name') }}</span></th>
          <th class="rp-sortable" @click="toggleSort('type')">{{ dash.t[dash.lang].typeLabel }} <span class="rp-sort" :class="{ on: sort.key === 'type' }">{{ sortIcon('type') }}</span></th>
          <th class="rp-sortable" @click="toggleSort('width')">{{ dash.t[dash.lang].widthLabel }} <span class="rp-sort" :class="{ on: sort.key === 'width' }">{{ sortIcon('width') }}</span></th>
          <th>{{ dash.t[dash.lang].compositionLabel }}</th>
          <th class="rp-r">Shrinkage (%)</th>
          <th class="rp-r">Allowance (%)</th>
          <th class="rp-r rp-sortable" @click="toggleSort('total_yards')">{{ dash.t[dash.lang].totalYardsLabel }} <span class="rp-sort" :class="{ on: sort.key === 'total_yards' }">{{ sortIcon('total_yards') }}</span></th>
          <th class="rp-r rp-sortable" @click="toggleSort('wip_production')">{{ dash.t[dash.lang].wipProductionLabel }} <span class="rp-sort" :class="{ on: sort.key === 'wip_production' }">{{ sortIcon('wip_production') }}</span></th>
          <th class="rp-r rp-sortable" @click="toggleSort('wip_factory')">{{ dash.t[dash.lang].wipFactoryLabel }} <span class="rp-sort" :class="{ on: sort.key === 'wip_factory' }">{{ sortIcon('wip_factory') }}</span></th>
          <th style="width:44px;"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in sortedItems" :key="row.id" :class="{ 'is-sel': selRow === row }" @click="selectRow(row)">
          <td class="rp-c">{{ idx + 1 }}</td>
          <td>{{ row.sku || '-' }}</td>
          <td>{{ row.name || '-' }}</td>
          <td>{{ row.type || '-' }}</td>
          <td>{{ row.width || '-' }}</td>
          <td>{{ row.composition || '-' }}</td>
          <td class="rp-r">{{ Number(row.shrinkage) || 0 }}</td>
          <td class="rp-r">{{ Number(row.allowance) || 0 }}</td>
          <td class="rp-r rp-bold">{{ Number(row.total_yards) ? fmt(row.total_yards) : '-' }}</td>
          <td class="rp-r" :class="{ 'rp-muted': !Number(row.wip_production) }">{{ Number(row.wip_production) ? fmt(row.wip_production) : '-' }}</td>
          <td class="rp-r" :class="{ 'rp-muted': !Number(row.wip_factory) }">{{ Number(row.wip_factory) ? fmt(row.wip_factory) : '-' }}</td>
          <td class="rp-c">
            <button class="fr-img-btn" :title="dash.t[dash.lang].viewProductImageTitle" @click.stop>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
            </button>
          </td>
        </tr>
        <tr v-if="items.length === 0"><td colspan="12" class="rp-empty">{{ dash.t[dash.lang].noDataFoundMsg }}</td></tr>
      </tbody>
      <tfoot v-if="items.length">
        <tr>
          <td colspan="8" class="rp-r rp-bold">{{ dash.t[dash.lang].totalWord }}</td>
          <td class="rp-r rp-bold">{{ fmt(summary.yards) }}</td>
          <td class="rp-r rp-bold">{{ fmt(summary.production) }}</td>
          <td class="rp-r rp-bold">{{ fmt(summary.factory) }}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  </div>

  <div class="rp-table-wrap rp-rolls">
    <table class="rp-table">
      <thead>
        <tr>
          <th style="width:40px;">{{ dash.lang === 'th' ? 'ที่' : 'No.' }}</th>
          <th>{{ dash.t[dash.lang].receiptNoLabel }}</th><th>{{ dash.t[dash.lang].receivedDateLabel }}</th><th>{{ dash.t[dash.lang].lotNoLabel }}</th>
          <th class="rp-r">{{ dash.t[dash.lang].receivedQtyYardsLabel }}</th><th class="rp-r">{{ dash.t[dash.lang].stockQtyYardsLabel }}</th><th>{{ dash.t[dash.lang].warehouseLabel }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r, i) in receipts" :key="i">
          <td class="rp-c">{{ i + 1 }}</td>
          <td>{{ r.in_no || '-' }}</td>
          <td class="rp-c">{{ r.receipt_date || '-' }}</td>
          <td>{{ r.lot_no || '-' }}</td>
          <td class="rp-r">{{ fmt(r.received_yards) }}</td>
          <td class="rp-r rp-bold">{{ fmt(r.stock_yards) }}</td>
          <td>{{ r.warehouse || '-' }}</td>
        </tr>
        <tr v-if="receipts.length === 0"><td colspan="7" class="rp-empty">{{ selRow === null ? dash.t[dash.lang].clickRowToViewReceiptsMsg : dash.t[dash.lang].noReceiptsForThisMsg }}</td></tr>
      </tbody>
      <tfoot v-if="receipts.length">
        <tr><td colspan="4" class="rp-r rp-bold">{{ dash.t[dash.lang].totalWord }}</td><td class="rp-r rp-bold">{{ fmt(receiptsTotal) }}</td><td colspan="2"></td></tr>
      </tfoot>
    </table>
  </div>
</div>
</template>

<script>
export default {
  name: 'RawStockReportPage',
  inject: ['dash'],
  data() {
    return {
      filter: { q: '', sku: '', width: '', warehouse: '' },
      items: [], summary: { yards: 0, production: 0, factory: 0 },
      receipts: [], selRow: null,
      sort: { key: '', dir: 'asc' },
    };
  },
  computed: {
    receiptsTotal() { return this.receipts.reduce((s, r) => s + (Number(r.stock_yards) || 0), 0); },
    sortedItems() {
      if (!this.sort.key) return this.items;
      const k = this.sort.key, dir = this.sort.dir === 'asc' ? 1 : -1;
      const num = ['total_yards', 'wip_production', 'wip_factory'].includes(k);
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
        const res = await fetch('/api/reports/raw-stock' + (qs ? '?' + qs : ''), { headers: this.authHeaders() });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) {
          this.items = d.items || [];
          this.summary = { yards: 0, production: 0, factory: 0, ...(d.summary || {}) };
          this.selRow = null; this.receipts = [];
        }
      } catch (e) { this.dash.fbFail('โหลดรายงานไม่สำเร็จ'); }
    },
    reset() { this.filter = { q: '', sku: '', width: '', warehouse: '' }; this.load(); },
    toggleSort(key) {
      if (this.sort.key === key) this.sort.dir = this.sort.dir === 'asc' ? 'desc' : 'asc';
      else { this.sort.key = key; this.sort.dir = 'asc'; }
    },
    sortIcon(key) { if (this.sort.key !== key) return '↕'; return this.sort.dir === 'asc' ? '▲' : '▼'; },
    async selectRow(row) {
      this.selRow = row; this.receipts = [];
      try {
        const res = await fetch('/api/reports/raw-stock/receipts?sku=' + encodeURIComponent(row.sku), { headers: this.authHeaders() });
        const d = await res.json();
        if (d.ok) this.receipts = d.rows || [];
      } catch (e) {}
    },
    async exportExcel() {
      const head = ['รหัสสินค้า', 'ชื่อ', 'ประเภท', 'หน้ากว้าง', 'ส่วนประกอบ', 'Shrinkage(%)', 'Allowance(%)', 'จำนวนรวม(หลา)', 'ระหว่างผลิต', 'ที่โรงงาน'];
      const body = this.sortedItems.map(r => [r.sku, r.name, r.type, r.width, r.composition, Number(r.shrinkage) || 0, Number(r.allowance) || 0, Number(r.total_yards) || 0, Number(r.wip_production) || 0, Number(r.wip_factory) || 0]);
      const XLSX = await import('xlsx');
      const sheet = XLSX.utils.aoa_to_sheet([head, ...body]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, sheet, 'ผ้าดิบคงคลัง');
      XLSX.writeFile(wb, `รายงานผ้าดิบคงคลัง-${new Date().toISOString().slice(0, 10)}.xlsx`);
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
.rp-f { display: flex; flex-direction: column; gap: 4px; min-width: 150px; flex: 1 1 150px; max-width: 240px; }
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
.rp-rolls { max-height: 340px; overflow-y: auto; }
.rp-table { width: 100%; border-collapse: collapse; font-size: 12px; min-width: 1000px; }
.rp-table thead th { position: sticky; top: 0; z-index: 3; background: #3c4453; color: #fff; font-size: 11px; font-weight: 600; letter-spacing: .3px; padding: 7px 12px; text-align: left; white-space: nowrap; border-right: 1px solid rgba(255,255,255,.18); }
.rp-table thead th:last-child { border-right: none; }
.rp-table th.rp-r { text-align: right; }
.rp-table tbody td { padding: 3px 12px; font-size: 12px; line-height: 1.6; border-bottom: 1px solid var(--table-line); border-right: 1px solid var(--table-line); white-space: nowrap; }
.rp-table tbody td:last-child { border-right: none; }
.rp-table tbody tr { cursor: pointer; }
.rp-table tbody tr:hover { background: var(--field); }
.rp-table tbody tr.is-sel { background: #fff8d6; }
.rp-r { text-align: right; } .rp-c { text-align: center; color: var(--muted); }
.rp-bold { font-weight: 700; } .rp-muted { color: var(--muted); }
.rp-empty { text-align: center; color: var(--muted); padding: 26px; }
.rp-table tfoot td { position: sticky; bottom: 0; z-index: 2; padding: 9px 10px; border-top: 2px solid var(--table-line); background: var(--field); font-weight: 700; }
.rp-sortable { cursor: pointer; user-select: none; }
.rp-sortable:hover { background: #4a5262; }
.rp-sort { opacity: .45; font-size: 10px; margin-left: 3px; }
.rp-sort.on { opacity: 1; }
</style>
