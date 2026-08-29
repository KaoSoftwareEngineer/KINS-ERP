<template>
<div class="rp-page">
  <div class="rp-titlebar">
    <span>↩️ รายงานรับคืนอินวอยส์</span>
    <button class="rp-export-excel" @click="exportExcel">
      <span class="rp-xls-badge"><svg class="xls-ico" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#217346"/><path d="M14 2v6h6" fill="#185c37"/><path d="M9.5 12.5l5 5M14.5 12.5l-5 5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg></span>ส่งออก Excel
    </button>
  </div>

  <div class="rp-filter">
    <div class="rp-f"><label>วันที่</label><input type="date" v-model="filter.date" @change="applyFilter" /></div>
    <div class="rp-f"><label>พนักงานส่งของ</label>
      <select v-model="filter.shipper" @change="applyFilter"><option value="">ทั้งหมด</option><option v-for="s in shipperOptions" :key="s" :value="s">{{ s }}</option></select>
    </div>
    <div class="rp-f"><label>คำค้นหา</label><input v-model="filter.q" placeholder="เลขที่บิล/พนักงาน" @keyup.enter="applyFilter" /></div>
    <div class="rp-f"><label>ประเภทการชำระเงิน</label>
      <select v-model="filter.pay" @change="applyFilter"><option value="">ทั้งหมด</option><option v-for="p in payOptions" :key="p" :value="p">{{ p }}</option></select>
    </div>
    <div class="rp-f-actions">
      <button class="rp-btn-search" @click="applyFilter">🔍 ค้นหา</button>
      <button class="rp-btn-reset" @click="reset">↺ รีเซ็ต</button>
    </div>
  </div>

  <div class="rp-found">พบ {{ filtered.length.toLocaleString() }} รายการ</div>

  <!-- ตารางใบรับคืน -->
  <div class="rp-table-wrap rp-groups">
    <table class="rp-table" style="min-width:900px">
      <thead>
        <tr>
          <th style="width:40px;">ที่</th>
          <th class="rp-sortable" @click="toggleSort('ivr_no')">เลขที่บิล <span class="rp-sort" :class="{ on: sort.key==='ivr_no' }">{{ sortIcon('ivr_no') }}</span></th>
          <th class="rp-sortable" @click="toggleSort('ret_date')">วันที่ <span class="rp-sort" :class="{ on: sort.key==='ret_date' }">{{ sortIcon('ret_date') }}</span></th>
          <th>พนักงานส่งของ</th><th>ประเภทการชำระเงิน</th>
          <th class="rp-r">จำนวนเงิน</th><th class="rp-r">ยอดรวมรวมได้</th><th class="rp-r">ส่วนลดพิเศษ</th><th style="width:60px;"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!filtered.length"><td colspan="9" class="rp-empty">— ไม่มีข้อมูลรับคืนอินวอยส์ —</td></tr>
        <tr v-for="(row, idx) in filtered" :key="row.id" :class="{ 'is-sel': selRow === row }" @click="selRow = row">
          <td class="rp-c">{{ idx + 1 }}</td>
          <td class="rp-mono">{{ row.ivr_no }}</td>
          <td class="rp-c">{{ fmtDate(row.ret_date) }}</td>
          <td>{{ row.shipper || '-' }}</td>
          <td>{{ row.payment_type || '-' }}</td>
          <td class="rp-r">{{ row._amount ? fmt(row._amount) : '-' }}</td>
          <td class="rp-r">{{ row._received ? fmt(row._received) : '-' }}</td>
          <td class="rp-r">{{ row._discount ? fmt(row._discount) : '-' }}</td>
          <td><button class="rp-ic" title="ดูรายละเอียด" @click.stop="selRow = row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01" stroke-linecap="round"/></svg></button></td>
        </tr>
      </tbody>
      <tfoot v-if="filtered.length">
        <tr><td colspan="5" class="rp-r">รวม</td><td class="rp-r">{{ fmt(sumAmount) }}</td><td class="rp-r">{{ fmt(sumReceived) }}</td><td class="rp-r">{{ fmt(sumDiscount) }}</td><td></td></tr>
      </tfoot>
    </table>
  </div>

  <!-- รายการอินวอยส์ในใบรับคืน -->
  <div class="rp-table-wrap rp-rolls">
    <table class="rp-table" style="min-width:800px">
      <thead>
        <tr>
          <th style="width:40px;">ที่</th>
          <th>เลขที่อินวอยส์</th><th class="rp-r">จำนวนเงิน</th><th class="rp-r">ยอดรวมรวมได้</th><th class="rp-r">ส่วนลดพิเศษ</th><th class="rp-r">ยอดคงเหลือ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!selItems.length"><td colspan="6" class="rp-empty">— เลือกใบรับคืนด้านบนเพื่อดูรายการ —</td></tr>
        <tr v-for="(it, i) in selItems" :key="i">
          <td class="rp-c">{{ i + 1 }}</td>
          <td class="rp-mono">{{ it.inv_no || it.invoice || it.invoiceNo || '-' }}</td>
          <td class="rp-r">{{ fmt(itAmount(it)) }}</td>
          <td class="rp-r">{{ fmt(itReceived(it)) }}</td>
          <td class="rp-r">{{ it.discount != null ? fmt(it.discount) : '-' }}</td>
          <td class="rp-r">{{ it.remaining != null ? fmt(it.remaining) : '-' }}</td>
        </tr>
      </tbody>
      <tfoot v-if="selItems.length">
        <tr><td colspan="2" class="rp-r">รวม</td><td class="rp-r">{{ fmt(selItemsAmount) }}</td><td class="rp-r">{{ fmt(selItemsReceived) }}</td><td colspan="2"></td></tr>
      </tfoot>
    </table>
  </div>
</div>
</template>

<script>
export default {
  name: 'InvoiceReturnReportPage',
  inject: ['dash'],
  data() {
    return {
      rows: [], selRow: null,
      filter: { date: '', shipper: '', q: '', pay: '' },
      sort: { key: 'ivr_no', dir: 'desc' },
    };
  },
  computed: {
    shipperOptions() { return [...new Set(this.rows.map(r => r.shipper).filter(Boolean))]; },
    payOptions() { return [...new Set(this.rows.map(r => r.payment_type).filter(Boolean))]; },
    filtered() {
      let list = this.rows.slice();
      const f = this.filter;
      if (f.date) list = list.filter(r => this.fmtDate(r.ret_date) === this.fmtDate(f.date));
      if (f.shipper) list = list.filter(r => r.shipper === f.shipper);
      if (f.pay) list = list.filter(r => r.payment_type === f.pay);
      if (f.q) { const q = f.q.trim().toLowerCase(); list = list.filter(r => (r.ivr_no || '').toLowerCase().includes(q) || (r.shipper || '').toLowerCase().includes(q)); }
      const k = this.sort.key, dir = this.sort.dir === 'asc' ? 1 : -1;
      return list.sort((a, b) => { const av = (a[k] || '').toString().toLowerCase(), bv = (b[k] || '').toString().toLowerCase(); if (av < bv) return -1 * dir; if (av > bv) return 1 * dir; return 0; });
    },
    selItems() { return this.selRow ? this.itemsOf(this.selRow) : []; },
    selItemsAmount() { return this.selItems.reduce((s, it) => s + this.itAmount(it), 0); },
    selItemsReceived() { return this.selItems.reduce((s, it) => s + this.itReceived(it), 0); },
    sumAmount() { return this.filtered.reduce((s, r) => s + (r._amount || 0), 0); },
    sumReceived() { return this.filtered.reduce((s, r) => s + (r._received || 0), 0); },
    sumDiscount() { return this.filtered.reduce((s, r) => s + (r._discount || 0), 0); },
  },
  mounted() { this.load(); },
  methods: {
    async load() {
      try {
        const res = await fetch('/api/invoice-returns', { headers: { Authorization: 'Bearer ' + this.dash.token } });
        if (res.status === 401) { this.dash.sessionExpired && this.dash.sessionExpired(); return; }
        const d = await res.json();
        this.rows = (d.returns || d.rows || []).map(r => {
          const items = this.itemsOf(r);
          return {
            ...r,
            _amount: items.reduce((s, it) => s + this.itAmount(it), 0),
            _received: items.reduce((s, it) => s + this.itReceived(it), 0),
            _discount: items.reduce((s, it) => s + (Number(it.discount) || 0), 0),
          };
        });
        this.selRow = null;
      } catch (e) { this.rows = []; }
    },
    itemsOf(r) { if (r._items) return r._items; let a = []; try { a = typeof r.items_json === 'string' ? JSON.parse(r.items_json || '[]') : (r.items_json || []); } catch (e) {} r._items = Array.isArray(a) ? a : []; return r._items; },
    itAmount(it) { return Number(it.amount != null ? it.amount : it.total) || 0; },
    itReceived(it) { return Number(it.received != null ? it.received : (it.net != null ? it.net : this.itAmount(it))) || 0; },
    applyFilter() { this.selRow = null; },
    fmt(v) { return (Number(v) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
    fmtDate(d) { if (!d) return ''; const s = String(d); const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${m[3]}/${m[2]}/${m[1]}` : s.slice(0, 10); },
    toggleSort(k) { if (this.sort.key === k) this.sort.dir = this.sort.dir === 'asc' ? 'desc' : 'asc'; else { this.sort.key = k; this.sort.dir = 'asc'; } },
    sortIcon(k) { return this.sort.key === k ? (this.sort.dir === 'asc' ? '▲' : '▼') : '↕'; },
    reset() { this.filter = { date: '', shipper: '', q: '', pay: '' }; this.selRow = null; },
    exportExcel() {
      const head = ['เลขที่บิล', 'วันที่', 'พนักงานส่งของ', 'ประเภทการชำระเงิน', 'จำนวนเงิน', 'ยอดรวมรวมได้', 'ส่วนลดพิเศษ'];
      const lines = [head.join('\t')];
      this.filtered.forEach(r => lines.push([r.ivr_no, this.fmtDate(r.ret_date), r.shipper, r.payment_type, r._amount, r._received, r._discount].join('\t')));
      const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'รายงานรับคืนอินวอยส์.csv'; a.click();
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
.rp-empty { text-align: center; color: var(--muted); padding: 26px; }
.rp-table tfoot td { position: sticky; bottom: 0; z-index: 2; padding: 9px 10px; border-top: 2px solid var(--table-line); background: var(--field); font-weight: 700; }
.rp-sortable { cursor: pointer; user-select: none; }
.rp-sortable:hover { background: #4a5262; }
.rp-sort { opacity: .45; font-size: 10px; margin-left: 3px; }
.rp-sort.on { opacity: 1; }
.rp-ic { width: 26px; height: 26px; border-radius: 6px; border: 1px solid var(--field-border); background: var(--field); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; padding: 0; vertical-align: middle; }
.rp-ic svg { width: 14px; height: 14px; }
</style>
