<template>
<div class="rp-page">
  <div class="rp-titlebar">
    <span>📊 {{ title }}</span>
    <button class="rp-export-excel" @click="exportExcel">
      <span class="rp-xls-badge"><svg class="xls-ico" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#217346"/><path d="M14 2v6h6" fill="#185c37"/><path d="M9.5 12.5l5 5M14.5 12.5l-5 5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg></span>ส่งออก Excel
    </button>
  </div>
  <div class="rp-filter">
    <div class="rp-f"><label>วันที่</label><input type="date" v-model="filter.date" @change="applyFilter" /></div>
    <div class="rp-f"><label>ลูกค้า</label><input v-model="filter.customer" placeholder="ลูกค้า" @keyup.enter="applyFilter" /></div>
    <div class="rp-f"><label>พนักงานขาย</label>
      <select v-model="filter.salesperson" @change="applyFilter"><option value="">ทั้งหมด</option><option v-for="s in salespersonOptions" :key="s" :value="s">{{ s }}</option></select>
    </div>
    <div class="rp-f"><label>คำค้นหา</label><input v-model="filter.q" placeholder="เลขที่อินวอยส์/ออร์เดอร์/ลูกค้า" @keyup.enter="applyFilter" /></div>
    <div class="rp-f"><label>รหัสสินค้า</label><input v-model="filter.sku" @keyup.enter="applyFilter" /></div>
    <div class="rp-f-actions"><button class="rp-btn-search" @click="applyFilter">🔍 ค้นหา</button><button class="rp-btn-reset" @click="reset">↺ รีเซ็ต</button></div>
  </div>
  <div class="rp-found">พบ {{ filtered.length.toLocaleString() }} รายการ</div>

  <div class="rp-table-wrap rp-groups">
    <table class="rp-table" style="min-width:1200px">
      <thead>
        <tr>
          <th style="width:40px;">ที่</th>
          <th>เลขที่อินวอยส์</th><th>วันที่</th><th>เลขที่ออร์เดอร์</th><th>ลูกค้า</th><th>เงื่อนไขบัญชี</th><th>วันที่ครบกำหนด</th><th>พนักงานขาย</th><th>สถานะชำระเงิน</th>
          <th class="rp-r">ราคารวม</th><th class="rp-r">ต้นทุนรวม</th><th class="rp-r">กำไร/ขาดทุน</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!filtered.length"><td colspan="12" class="rp-empty">— ไม่มีข้อมูล —</td></tr>
        <tr v-for="(row, idx) in filtered" :key="row.id" :class="{ 'is-sel': selRow === row }" @click="selRow = row">
          <td class="rp-c">{{ idx + 1 }}</td>
          <td class="rp-mono">{{ row.inv_no }}</td>
          <td class="rp-c">{{ fmtDate(row.inv_date) }}</td>
          <td class="rp-mono">{{ row.order_ref || '-' }}</td>
          <td>{{ row.customer || '-' }}</td>
          <td>{{ row.account_term || '-' }}</td>
          <td class="rp-c">{{ fmtDate(row.due_date) || '-' }}</td>
          <td>{{ row.salesperson || '-' }}</td>
          <td>{{ row.pay_status || 'ยังไม่ชำระ' }}</td>
          <td class="rp-r rp-price">{{ fmt(row._price) }}</td>
          <td class="rp-r">{{ row._cost ? fmt(row._cost) : '-' }}</td>
          <td class="rp-r" :class="row._profit < 0 ? 'rp-loss' : 'rp-profit'">{{ fmt(row._profit) }}</td>
        </tr>
      </tbody>
      <tfoot v-if="filtered.length">
        <tr><td colspan="9" class="rp-r">รวม</td><td class="rp-r rp-price">{{ fmt(sumPrice) }}</td><td class="rp-r rp-loss">{{ fmt(sumCost) }}</td><td class="rp-r" :class="sumProfit < 0 ? 'rp-loss' : 'rp-profit'">{{ fmt(sumProfit) }}</td></tr>
      </tfoot>
    </table>
  </div>

  <div class="rp-table-wrap rp-rolls">
    <table class="rp-table" style="min-width:1250px">
      <thead>
        <tr>
          <th style="width:40px;">ที่</th>
          <th>รหัสสินค้า</th><th>รหัสสี</th><th>หน้ากว้าง</th><th class="rp-r">จำนวนที่เบิก</th><th class="rp-r">จำนวนที่ขาย</th><th>หน่วย</th>
          <th class="rp-r">ราคา/หน่วย</th><th class="rp-r">ราคา</th><th class="rp-r">ต้นทุนรวม</th><th class="rp-r">กำไร/ขาดทุน</th><th>บาร์โค้ด</th><th class="rp-r">จำนวนที่ตัด</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!selItems.length"><td colspan="13" class="rp-empty">— เลือกอินวอยส์ด้านบนเพื่อดูรายการ —</td></tr>
        <tr v-for="(it, i) in selItems" :key="i">
          <td class="rp-c">{{ i + 1 }}</td>
          <td class="rp-mono">{{ it.sku || '-' }}</td>
          <td>{{ it.color || it.color_code || '-' }}</td>
          <td class="rp-c">{{ it.width || '-' }}</td>
          <td class="rp-r">{{ fmt(itQty(it)) }}</td>
          <td class="rp-r">{{ fmt(itQty(it)) }}</td>
          <td class="rp-c">{{ it.unit || 'หลา' }}</td>
          <td class="rp-r">{{ it.unit_price != null ? fmt(it.unit_price) : '-' }}</td>
          <td class="rp-r">{{ it.amount != null ? fmt(it.amount) : '-' }}</td>
          <td class="rp-r">{{ it.cost != null ? fmt(it.cost) : '-' }}</td>
          <td class="rp-r" :class="itProfit(it) < 0 ? 'rp-loss' : 'rp-profit'">{{ fmt(itProfit(it)) }}</td>
          <td class="rp-mono rp-muted">{{ it.barcode || '-' }}</td>
          <td class="rp-r">{{ fmt(itQty(it)) }}</td>
        </tr>
      </tbody>
      <tfoot v-if="selItems.length">
        <tr><td colspan="4" class="rp-r">รวม</td><td class="rp-r">{{ fmt(selQty) }}</td><td class="rp-r">{{ fmt(selQty) }}</td><td colspan="2"></td><td class="rp-r rp-price">{{ fmt(selPrice) }}</td><td class="rp-r">{{ selCost ? fmt(selCost) : '-' }}</td><td class="rp-r" :class="(selPrice-selCost) < 0 ? 'rp-loss' : 'rp-profit'">{{ fmt(selPrice - selCost) }}</td><td colspan="2"></td></tr>
      </tfoot>
    </table>
  </div>
</div>
</template>

<script>
export default {
  name: 'ProfitLossReportPage',
  inject: ['dash'],
  props: { mode: { type: String, default: 'wholesale' } },
  data() { return { rows: [], selRow: null, filter: { date: '', customer: '', salesperson: '', q: '', sku: '' }, sort: { key: 'inv_no', dir: 'desc' } }; },
  computed: {
    title() { return this.mode === 'retail' ? 'รายงานกำไร & ขาดทุนขายปลีก' : 'รายงานกำไร & ขาดทุนขายส่ง'; },
    salespersonOptions() { return [...new Set(this.rows.map(r => r.salesperson).filter(Boolean))]; },
    filtered() {
      let list = this.rows.slice();
      if (this.mode === 'wholesale') list = list.filter(r => !/^p/i.test(r.inv_no || ''));
      else if (this.mode === 'retail') list = list.filter(r => /^p/i.test(r.inv_no || ''));
      const f = this.filter;
      if (f.date) list = list.filter(r => this.fmtDate(r.inv_date) === this.fmtDate(f.date));
      if (f.customer) list = list.filter(r => (r.customer || '').toLowerCase().includes(f.customer.trim().toLowerCase()));
      if (f.salesperson) list = list.filter(r => r.salesperson === f.salesperson);
      if (f.sku) { const q = f.sku.trim().toLowerCase(); list = list.filter(r => this.itemsOf(r).some(it => (it.sku || '').toLowerCase().includes(q))); }
      if (f.q) { const q = f.q.trim().toLowerCase(); list = list.filter(r => (r.inv_no || '').toLowerCase().includes(q) || (r.order_ref || '').toLowerCase().includes(q) || (r.customer || '').toLowerCase().includes(q)); }
      const k = this.sort.key, dir = this.sort.dir === 'asc' ? 1 : -1;
      return list.sort((a, b) => { const av = (a[k] || '').toString().toLowerCase(), bv = (b[k] || '').toString().toLowerCase(); return av < bv ? -dir : av > bv ? dir : 0; });
    },
    selItems() { return this.selRow ? this.itemsOf(this.selRow) : []; },
    selQty() { return this.selItems.reduce((s, it) => s + this.itQty(it), 0); },
    selPrice() { return this.selItems.reduce((s, it) => s + (Number(it.amount) || 0), 0); },
    selCost() { return this.selItems.reduce((s, it) => s + (Number(it.cost) || 0), 0) || (this.selRow ? Number(this.selRow.total_cost) || 0 : 0); },
    sumPrice() { return this.filtered.reduce((s, r) => s + (r._price || 0), 0); },
    sumCost() { return this.filtered.reduce((s, r) => s + (r._cost || 0), 0); },
    sumProfit() { return this.filtered.reduce((s, r) => s + (r._profit || 0), 0); },
  },
  watch: { mode() { this.selRow = null; } },
  mounted() { this.load(); },
  methods: {
    async load() {
      try {
        const res = await fetch('/api/sale-invoices', { headers: { Authorization: 'Bearer ' + this.dash.token } });
        if (res.status === 401) { this.dash.sessionExpired && this.dash.sessionExpired(); return; }
        const d = await res.json();
        this.rows = (d.invoices || d.rows || []).map(r => {
          const items = this.itemsOf(r);
          const price = items.reduce((s, it) => s + (Number(it.amount) || 0), 0);
          const cost = items.reduce((s, it) => s + (Number(it.cost) || 0), 0) || Number(r.total_cost) || 0;
          return { ...r, _price: price, _cost: cost, _profit: price - cost };
        });
        this.selRow = null;
      } catch (e) { this.rows = []; }
    },
    itemsOf(r) { if (r._items) return r._items; let a = []; try { a = typeof r.items_json === 'string' ? JSON.parse(r.items_json || '[]') : (r.items_json || []); } catch (e) {} r._items = Array.isArray(a) ? a : []; return r._items; },
    itQty(it) { return Number(it.qty != null ? it.qty : (it.withdrawn_qty != null ? it.withdrawn_qty : it.ordered_qty)) || 0; },
    itProfit(it) { return (Number(it.amount) || 0) - (Number(it.cost) || 0); },
    applyFilter() { this.selRow = null; },
    fmt(v) { return (Number(v) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
    fmtDate(d) { if (!d) return ''; const s = String(d); const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${m[3]}/${m[2]}/${m[1]}` : s.slice(0, 10); },
    reset() { this.filter = { date: '', customer: '', salesperson: '', q: '', sku: '' }; this.selRow = null; },
    exportExcel() {
      const head = ['เลขที่อินวอยส์', 'วันที่', 'เลขที่ออร์เดอร์', 'ลูกค้า', 'ราคารวม', 'ต้นทุนรวม', 'กำไร/ขาดทุน'];
      const lines = [head.join('\t')];
      this.filtered.forEach(r => lines.push([r.inv_no, this.fmtDate(r.inv_date), r.order_ref, r.customer, r._price, r._cost, r._profit].join('\t')));
      const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = this.title + '.csv'; a.click();
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
.rp-r { text-align: right; } .rp-c { text-align: center; color: var(--muted); }
.rp-muted { color: var(--muted); } .rp-mono { font-family: 'Courier New', monospace; }
.rp-price { color: #158045; } .rp-profit { color: #1e4fd6; font-weight: 600; } .rp-loss { color: #c0392b; font-weight: 600; }
.rp-empty { text-align: center; color: var(--muted); padding: 26px; }
.rp-table tfoot td { position: sticky; bottom: 0; z-index: 2; padding: 9px 10px; border-top: 2px solid var(--table-line); background: var(--field); font-weight: 700; }
.rp-sortable { cursor: pointer; user-select: none; } .rp-sortable:hover { background: #4a5262; }
.rp-sort { opacity: .45; font-size: 10px; margin-left: 3px; } .rp-sort.on { opacity: 1; }
.rp-ic { width: 26px; height: 26px; border-radius: 6px; border: 1px solid var(--field-border); background: var(--field); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; padding: 0; vertical-align: middle; }
.rp-ic svg { width: 14px; height: 14px; }
</style>
