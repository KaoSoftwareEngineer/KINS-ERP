<template>
<div class="rp-page">
  <div class="rp-titlebar">
    <span>🎨 {{ dash.t[dash.lang].dyeOrderReportTitle }}</span>
    <button class="rp-export-excel" @click="exportExcel">
      <span class="rp-xls-badge"><svg class="xls-ico" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#217346"/><path d="M14 2v6h6" fill="#185c37"/><path d="M9.5 12.5l5 5M14.5 12.5l-5 5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg></span>{{ dash.t[dash.lang].exportExcelPlain }}
    </button>
  </div>

  <div class="rp-filter">
    <div class="rp-f"><label>{{ dash.t[dash.lang].dateLabel }}</label><input type="date" v-model="filter.date" @change="applyFilter" /></div>
    <div class="rp-f"><label>{{ dash.t[dash.lang].factoryLabel }}</label><input v-model="filter.factory" :placeholder="dash.t[dash.lang].factoryLabel" @keyup.enter="applyFilter" /></div>
    <div class="rp-f"><label>{{ dash.t[dash.lang].status }}</label>
      <select v-model="filter.status" @change="applyFilter"><option value="">{{ dash.t[dash.lang].allWord }}</option><option>Pending</option><option>Received Complete</option><option>Partial</option></select>
    </div>
    <div class="rp-f"><label>{{ dash.t[dash.lang].searchInput }}</label><input v-model="filter.q" :placeholder="dash.t[dash.lang].searchBillFactoryRefPlaceholder" @keyup.enter="applyFilter" /></div>
    <div class="rp-f"><label>{{ dash.t[dash.lang].skuLabel }}</label><input v-model="filter.sku" @keyup.enter="applyFilter" /></div>
    <div class="rp-f"><label>{{ dash.t[dash.lang].colorCodeLabel }}</label><input v-model="filter.color" @keyup.enter="applyFilter" /></div>
    <div class="rp-f-actions">
      <button class="rp-btn-search" @click="applyFilter">🔍 {{ dash.t[dash.lang].searchWord }}</button>
      <button class="rp-btn-reset" @click="reset">↺ {{ dash.t[dash.lang].resetWord }}</button>
    </div>
  </div>

  <div class="rp-found">{{ dash.t[dash.lang].foundItems }} {{ filtered.length.toLocaleString() }} {{ dash.t[dash.lang].itemsUnit }}</div>

  <!-- ตารางใบสั่งย้อม -->
  <div class="rp-table-wrap rp-groups">
    <table class="rp-table" style="min-width:1050px">
      <thead>
        <tr>
          <th style="width:40px;">{{ dash.lang === 'th' ? 'ที่' : 'No.' }}</th>
          <th class="rp-sortable" @click="toggleSort('dye_no')">{{ dash.t[dash.lang].billNoLabel }} <span class="rp-sort" :class="{ on: sort.key==='dye_no' }">{{ sortIcon('dye_no') }}</span></th>
          <th class="rp-sortable" @click="toggleSort('dye_date')">{{ dash.t[dash.lang].dateLabel }} <span class="rp-sort" :class="{ on: sort.key==='dye_date' }">{{ sortIcon('dye_date') }}</span></th>
          <th>{{ dash.t[dash.lang].factoryLabel }}</th><th>{{ dash.t[dash.lang].refNoLabel }}</th><th>{{ dash.t[dash.lang].shipDateLabel }}</th>
          <th class="rp-r">{{ dash.t[dash.lang].sentQtyLabel }}</th><th class="rp-r">{{ dash.t[dash.lang].receivedQtyLabel }}</th><th class="rp-r">{{ dash.t[dash.lang].lossQtyLabel }}</th><th class="rp-r">{{ dash.t[dash.lang].lossPercentLabel }}</th>
          <th>{{ dash.t[dash.lang].status }}</th><th style="width:60px;"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!filtered.length"><td colspan="12" class="rp-empty">{{ dash.t[dash.lang].noDyeOrderDataMsg }}</td></tr>
        <tr v-for="(row, idx) in filtered" :key="row.id" :class="{ 'is-sel': selRow === row }" @click="selRow = row">
          <td class="rp-c">{{ idx + 1 }}</td>
          <td class="rp-mono">{{ row.dye_no }}</td>
          <td class="rp-c">{{ fmtDate(row.dye_date) }}</td>
          <td>{{ row.factory || '-' }}</td>
          <td>{{ row.ref_no || '-' }}</td>
          <td class="rp-c">{{ fmtDate(row.ship_date) || '-' }}</td>
          <td class="rp-r">{{ fmt(row._sent) }}</td>
          <td class="rp-r">{{ row._received ? fmt(row._received) : '-' }}</td>
          <td class="rp-r">{{ row._received ? fmt(row._loss) : '-' }}</td>
          <td class="rp-r">{{ row._received ? row._lossPct.toFixed(2) : '-' }}</td>
          <td><span class="rp-badge" :class="statusClass(row._status)">{{ row._status }}</span></td>
          <td><button class="rp-ic" :title="dash.t[dash.lang].viewDetails" @click.stop="selRow = row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01" stroke-linecap="round"/></svg></button></td>
        </tr>
      </tbody>
      <tfoot v-if="filtered.length">
        <tr><td colspan="6" class="rp-r">{{ dash.t[dash.lang].totalWord }}</td><td class="rp-r">{{ fmt(sumSent) }}</td><td class="rp-r">{{ fmt(sumReceived) }}</td><td class="rp-r">{{ fmt(sumLoss) }}</td><td colspan="3"></td></tr>
      </tfoot>
    </table>
  </div>

  <!-- รายการสินค้า (product + items) -->
  <div class="rp-table-wrap rp-rolls">
    <table class="rp-table" style="min-width:1100px">
      <thead>
        <tr>
          <th style="width:40px;">{{ dash.lang === 'th' ? 'ที่' : 'No.' }}</th>
          <th>{{ dash.t[dash.lang].skuLabel }}</th><th>{{ dash.t[dash.lang].colorCodeLabel }}</th><th>{{ dash.t[dash.lang].nameLabel }}</th><th>{{ dash.t[dash.lang].widthLabel }}</th><th>{{ dash.t[dash.lang].unitLabel }}</th>
          <th class="rp-r">{{ dash.t[dash.lang].qtyLabel }}</th><th class="rp-r">{{ dash.t[dash.lang].pricePerUnitLabel }}</th><th class="rp-r">{{ dash.t[dash.lang].priceLabel }}</th>
          <th class="rp-r">{{ dash.t[dash.lang].receivedQtyLabel }}</th><th class="rp-r">{{ dash.t[dash.lang].pendingQtyLabel }}</th><th>{{ dash.t[dash.lang].closedByLabel }}</th><th>{{ dash.t[dash.lang].recordDateLabel }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!selItems.length"><td colspan="13" class="rp-empty">{{ dash.t[dash.lang].selectDyeOrderAboveMsg }}</td></tr>
        <tr v-for="(it, i) in selItems" :key="i">
          <td class="rp-c">{{ i + 1 }}</td>
          <td class="rp-mono">{{ selProduct.sku || '-' }}</td>
          <td>{{ it.shade || it.color_code || '-' }}</td>
          <td>{{ selProduct.name || '-' }}</td>
          <td class="rp-c">{{ selProduct.width || '-' }}</td>
          <td class="rp-c">{{ dash.t[dash.lang].yardsUnit }}</td>
          <td class="rp-r">{{ fmt(it.qty) }}</td>
          <td class="rp-r">{{ it.unit_price != null ? fmt(it.unit_price) : '-' }}</td>
          <td class="rp-r">{{ it.total != null ? fmt(it.total) : '-' }}</td>
          <td class="rp-r rp-muted">-</td>
          <td class="rp-r rp-muted">-</td>
          <td class="rp-muted">-</td>
          <td class="rp-c rp-muted">{{ fmtDate(selRow && selRow.dye_date) || '-' }}</td>
        </tr>
      </tbody>
      <tfoot v-if="selItems.length">
        <tr><td colspan="6" class="rp-r">{{ dash.t[dash.lang].totalWord }}</td><td class="rp-r">{{ fmt(selItemsQty) }}</td><td></td><td class="rp-r">{{ fmt(selItemsAmount) }}</td><td colspan="4"></td></tr>
      </tfoot>
    </table>
  </div>

  <!-- ข้อมูลผ้าดิบ -->
  <div class="rp-subtitle">{{ dash.t[dash.lang].rawFabricInfoSection }}</div>
  <div class="rp-table-wrap">
    <table class="rp-table" style="min-width:1050px">
      <thead>
        <tr>
          <th style="width:40px;">{{ dash.lang === 'th' ? 'ที่' : 'No.' }}</th>
          <th>{{ dash.t[dash.lang].skuLabel }}</th><th>{{ dash.t[dash.lang].nameLabel }}</th><th>{{ dash.t[dash.lang].widthLabel }}</th><th>{{ dash.t[dash.lang].sourceLabel }}</th><th class="rp-r">Shrinkage (%)</th><th class="rp-r">Allowance (%)</th>
          <th>{{ dash.t[dash.lang].lotNoLabel }}</th><th class="rp-r">{{ dash.t[dash.lang].qtyLabel }}</th><th class="rp-r">{{ dash.t[dash.lang].pricePerUnitLabel }}</th><th class="rp-r">{{ dash.t[dash.lang].priceLabel }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!selRaw.code"><td colspan="11" class="rp-empty">{{ dash.t[dash.lang].noRawFabricInfoMsg }}</td></tr>
        <tr v-else>
          <td class="rp-c">1</td>
          <td class="rp-mono">{{ selRaw.code }}</td>
          <td>{{ selRaw.name || '-' }}</td>
          <td class="rp-c">{{ selRaw.width || '-' }}</td>
          <td>{{ selRaw.source || '-' }}</td>
          <td class="rp-r">{{ selRaw.shrinkage != null ? selRaw.shrinkage : '-' }}</td>
          <td class="rp-r">{{ selRaw.allowance != null ? selRaw.allowance : '-' }}</td>
          <td>{{ selRaw.lot || '-' }}</td>
          <td class="rp-r">{{ selRaw.needed != null ? fmt(selRaw.needed) : '-' }}</td>
          <td class="rp-r rp-muted">-</td>
          <td class="rp-r rp-muted">-</td>
        </tr>
      </tbody>
      <tfoot v-if="selRaw.code">
        <tr><td colspan="8" class="rp-r">{{ dash.t[dash.lang].totalWord }}</td><td class="rp-r">{{ selRaw.needed != null ? fmt(selRaw.needed) : '0.00' }}</td><td colspan="2"></td></tr>
        <tr><td colspan="10" class="rp-r">{{ dash.t[dash.lang].avgCostLabel }}</td><td class="rp-r rp-muted">-</td></tr>
      </tfoot>
    </table>
  </div>
</div>
</template>

<script>
export default {
  name: 'DyeOrderReportPage',
  inject: ['dash'],
  data() {
    return {
      rows: [], selRow: null,
      filter: { date: '', factory: '', status: '', q: '', sku: '', color: '' },
      sort: { key: 'dye_no', dir: 'desc' },
    };
  },
  computed: {
    filtered() {
      let list = this.rows.slice();
      const f = this.filter;
      if (f.date) list = list.filter(r => this.fmtDate(r.dye_date) === this.fmtDate(f.date));
      if (f.factory) list = list.filter(r => (r.factory || '').toLowerCase().includes(f.factory.trim().toLowerCase()));
      if (f.status) list = list.filter(r => r._status === f.status);
      if (f.sku) { const q = f.sku.trim().toLowerCase(); list = list.filter(r => (this.productOf(r).sku || '').toLowerCase().includes(q)); }
      if (f.color) { const q = f.color.trim().toLowerCase(); list = list.filter(r => this.itemsOf(r).some(it => ((it.shade || it.color_code) || '').toLowerCase().includes(q))); }
      if (f.q) { const q = f.q.trim().toLowerCase(); list = list.filter(r => (r.dye_no || '').toLowerCase().includes(q) || (r.factory || '').toLowerCase().includes(q) || (r.ref_no || '').toLowerCase().includes(q)); }
      const k = this.sort.key, dir = this.sort.dir === 'asc' ? 1 : -1;
      return list.sort((a, b) => { const av = (a[k] || '').toString().toLowerCase(), bv = (b[k] || '').toString().toLowerCase(); if (av < bv) return -1 * dir; if (av > bv) return 1 * dir; return 0; });
    },
    selItems() { return this.selRow ? this.itemsOf(this.selRow) : []; },
    selProduct() { return this.selRow ? this.productOf(this.selRow) : {}; },
    selRaw() { return this.selRow ? this.rawOf(this.selRow) : {}; },
    selItemsQty() { return this.selItems.reduce((s, it) => s + (Number(it.qty) || 0), 0); },
    selItemsAmount() { return this.selItems.reduce((s, it) => s + (Number(it.total) || 0), 0); },
    sumSent() { return this.filtered.reduce((s, r) => s + (r._sent || 0), 0); },
    sumReceived() { return this.filtered.reduce((s, r) => s + (r._received || 0), 0); },
    sumLoss() { return this.filtered.reduce((s, r) => s + (r._received ? r._loss : 0), 0); },
  },
  mounted() { this.load(); },
  methods: {
    async load() {
      try {
        const [rd, rr] = await Promise.all([
          fetch('/api/dye-orders', { headers: { Authorization: 'Bearer ' + this.dash.token } }),
          fetch('/api/dyed-receipts', { headers: { Authorization: 'Bearer ' + this.dash.token } }),
        ]);
        if (rd.status === 401) { this.dash.sessionExpired && this.dash.sessionExpired(); return; }
        const dd = await rd.json();
        const dr = await rr.json();
        // ยอดรับกลับต่อใบสั่งย้อม (order_ref = dye_no)
        const recvByDye = {};
        (dr.receipts || []).forEach(rc => {
          let items = []; try { items = JSON.parse(rc.items_json || '[]'); } catch (e) {}
          const y = items.reduce((s, it) => s + this.itemYards(it), 0);
          recvByDye[rc.order_ref] = (recvByDye[rc.order_ref] || 0) + y;
        });
        this.rows = (dd.dye_orders || dd.orders || []).map(r => {
          const items = this.itemsOf(r);
          const sent = items.reduce((s, it) => s + (Number(it.qty) || 0), 0);
          const received = recvByDye[r.dye_no] || 0;
          const loss = Math.max(0, sent - received);
          return { ...r, _sent: sent, _received: received, _loss: loss, _lossPct: sent > 0 ? (loss / sent * 100) : 0, _status: this.calcStatus(r, sent, received) };
        });
        this.selRow = null;
      } catch (e) { this.rows = []; }
    },
    calcStatus(r, sent, received) {
      if (r.status) return r.status;   // ถ้าตั้งสถานะไว้ตรงๆ (เช่น Canceled) ใช้เลย
      if (received > 0 && received >= sent && sent > 0) return 'Received Complete';
      if (received > 0) return 'Partial';
      return r.approved ? 'In Progress' : 'Pending';
    },
    itemYards(it) {
      if (it.qty != null) return Number(it.qty) || 0;
      if (Array.isArray(it.rolls)) return it.rolls.reduce((s, rr) => s + (Number(rr.yards || rr.current_yards) || 0), 0);
      return Number(it.yards || it.current_yards) || 0;
    },
    itemsOf(r) { if (r._items) return r._items; let a = []; try { a = typeof r.items_json === 'string' ? JSON.parse(r.items_json || '[]') : (r.items_json || []); } catch (e) {} r._items = Array.isArray(a) ? a : []; return r._items; },
    productOf(r) { if (r._product) return r._product; let o = {}; try { o = typeof r.product_json === 'string' ? JSON.parse(r.product_json || '{}') : (r.product_json || {}); } catch (e) {} r._product = o || {}; return r._product; },
    rawOf(r) { if (r._raw) return r._raw; let o = {}; try { o = typeof r.raw_json === 'string' ? JSON.parse(r.raw_json || '{}') : (r.raw_json || {}); } catch (e) {} r._raw = o || {}; return r._raw; },
    applyFilter() { this.selRow = null; },
    statusClass(s) { if (s === 'Received Complete') return 'ok'; if (s === 'Partial' || s === 'In Progress') return 'info'; if (s === 'Canceled') return 'cancel'; return 'pending'; },
    fmt(v) { return (Number(v) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
    fmtDate(d) { if (!d) return ''; const s = String(d); const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${m[3]}/${m[2]}/${m[1]}` : s.slice(0, 10); },
    toggleSort(k) { if (this.sort.key === k) this.sort.dir = this.sort.dir === 'asc' ? 'desc' : 'asc'; else { this.sort.key = k; this.sort.dir = 'asc'; } },
    sortIcon(k) { return this.sort.key === k ? (this.sort.dir === 'asc' ? '▲' : '▼') : '↕'; },
    reset() { this.filter = { date: '', factory: '', status: '', q: '', sku: '', color: '' }; this.selRow = null; },
    exportExcel() {
      const head = ['เลขที่บิล', 'วันที่', 'โรงงาน', 'เลขที่อ้างอิง', 'วันที่จัดส่ง', 'จำนวนที่ส่ง', 'จำนวนที่ได้', 'จำนวนสูญเสีย', 'สูญเสีย%', 'สถานะ'];
      const lines = [head.join('\t')];
      this.filtered.forEach(r => lines.push([r.dye_no, this.fmtDate(r.dye_date), r.factory, r.ref_no, this.fmtDate(r.ship_date), r._sent, r._received, r._loss, r._lossPct.toFixed(2), r._status].join('\t')));
      const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'รายงานใบสั่งย้อม.csv'; a.click();
    },
  },
};
</script>

<style scoped>
.rp-page { font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif; color: var(--text); font-size: 12px; }
.rp-titlebar { display: flex; align-items: center; justify-content: space-between; font-weight: 700; font-size: 14px; margin-bottom: 12px; }
.rp-subtitle { font-weight: 700; font-size: 13px; margin: 2px 0 8px; }
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
.rp-groups { max-height: 420px; overflow-y: auto; }
.rp-rolls { max-height: 280px; overflow-y: auto; }
.rp-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.rp-table thead th { position: sticky; top: 0; z-index: 3; background: #3c4453; color: #fff; font-size: 11px; font-weight: 600; letter-spacing: .3px; padding: 7px 12px; text-align: left; white-space: nowrap; border-right: 1px solid rgba(255,255,255,.18); }
.rp-table thead th:last-child { border-right: none; }
.rp-table th.rp-r { text-align: right; }
.rp-table tbody td { padding: 3px 12px; font-size: 12px; line-height: 1.6; border-bottom: 1px solid var(--table-line); border-right: 1px solid var(--table-line); white-space: nowrap; }
.rp-table tbody td:last-child { border-right: none; }
.rp-table tbody tr { cursor: pointer; }
.rp-table tbody tr:hover { background: var(--field); }
.rp-table tbody tr.is-sel { background: #fff8d6; }
.rp-r { text-align: right; } .rp-c { text-align: center; color: var(--muted); }
.rp-muted { color: var(--muted); } .rp-mono { font-family: 'Courier New', monospace; }
.rp-empty { text-align: center; color: var(--muted); padding: 26px; }
.rp-table tfoot td { position: sticky; bottom: 0; z-index: 2; padding: 9px 10px; border-top: 2px solid var(--table-line); background: var(--field); font-weight: 700; }
.rp-sortable { cursor: pointer; user-select: none; }
.rp-sortable:hover { background: #4a5262; }
.rp-sort { opacity: .45; font-size: 10px; margin-left: 3px; }
.rp-sort.on { opacity: 1; }
.rp-ic { width: 26px; height: 26px; border-radius: 6px; border: 1px solid var(--field-border); background: var(--field); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; padding: 0; vertical-align: middle; }
.rp-ic svg { width: 14px; height: 14px; }
.rp-badge { display: inline-block; padding: 2px 9px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.rp-badge.ok { background: #dcf1e8; color: #158045; }
.rp-badge.pending { background: #fde7cf; color: #b8791a; }
.rp-badge.info { background: #dbe8ff; color: #1e4fd6; }
.rp-badge.cancel { background: #fdeaea; color: #c0392b; }
</style>
