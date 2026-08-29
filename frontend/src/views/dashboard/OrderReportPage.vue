<template>
<div class="rp-page">
  <div class="rp-titlebar">
    <span>🛍️ รายงานออร์เดอร์</span>
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
    <div class="rp-f"><label>คำค้นหา</label><input v-model="filter.q" placeholder="เลขที่ออร์เดอร์/ลูกค้า" @keyup.enter="applyFilter" /></div>
    <div class="rp-f"><label>รหัสสินค้า</label><input v-model="filter.sku" @keyup.enter="applyFilter" /></div>
    <div class="rp-f"><label>รหัสสี</label><input v-model="filter.color" @keyup.enter="applyFilter" /></div>
    <div class="rp-f"><label>สถานะ</label>
      <select v-model="filter.status" @change="applyFilter"><option value="">ทั้งหมด</option><option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option></select>
    </div>
    <div class="rp-f rp-f-check"><label class="rp-check"><input type="checkbox" v-model="filter.urgent" @change="applyFilter" /> ด่วน</label></div>
    <div class="rp-f-actions">
      <button class="rp-btn-search" @click="applyFilter">🔍 ค้นหา</button>
      <button class="rp-btn-reset" @click="reset">↺ รีเซ็ต</button>
    </div>
  </div>

  <div class="rp-found">พบ {{ filtered.length.toLocaleString() }} รายการ</div>

  <!-- ตารางออร์เดอร์ -->
  <div class="rp-table-wrap rp-groups">
    <table class="rp-table" style="min-width:900px">
      <thead>
        <tr>
          <th style="width:40px;">ที่</th>
          <th class="rp-sortable" @click="toggleSort('order_no')">เลขที่ออร์เดอร์ <span class="rp-sort" :class="{ on: sort.key==='order_no' }">{{ sortIcon('order_no') }}</span></th>
          <th class="rp-sortable" @click="toggleSort('date')">วันที่ <span class="rp-sort" :class="{ on: sort.key==='date' }">{{ sortIcon('date') }}</span></th>
          <th>ลูกค้า</th>
          <th>เงื่อนไขบัญชี</th>
          <th>พนักงานขาย</th>
          <th class="rp-r">จำนวนที่สั่ง</th>
          <th>สถานะ</th>
          <th style="width:70px;"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!filtered.length"><td colspan="9" class="rp-empty">— ไม่มีข้อมูลออร์เดอร์ —</td></tr>
        <tr v-for="(row, idx) in filtered" :key="row.id" :class="{ 'is-sel': selRow === row, 'is-urgent': row.urgent }" @click="selRow = row">
          <td class="rp-c">{{ idx + 1 }}</td>
          <td class="rp-mono">{{ row.order_no }}</td>
          <td class="rp-c">{{ fmtDate(row.date) }}</td>
          <td>{{ row.customer || '-' }}</td>
          <td>{{ row.payment_term || '-' }}</td>
          <td>{{ row.salesperson || '-' }}</td>
          <td class="rp-r">{{ fmt(row.ordered_qty) }}</td>
          <td><span class="rp-badge" :class="statusClass(row.status)">{{ row.status }}</span></td>
          <td>
            <button class="rp-ic" title="ดูรายละเอียด" @click.stop="selRow = row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01" stroke-linecap="round"/></svg></button>
          </td>
        </tr>
      </tbody>
      <tfoot v-if="filtered.length">
        <tr><td colspan="6" class="rp-r">รวม</td><td class="rp-r">{{ fmt(sumQty) }}</td><td colspan="2"></td></tr>
      </tfoot>
    </table>
  </div>

  <!-- ตารางรายการในออร์เดอร์ที่เลือก -->
  <div class="rp-table-wrap rp-rolls">
    <table class="rp-table" style="min-width:1200px">
      <thead>
        <tr>
          <th style="width:40px;">ที่</th>
          <th>รหัสสินค้า</th><th>รหัสสี</th><th>หน้ากว้าง</th>
          <th class="rp-r">จำนวนที่ใช้ได้</th><th class="rp-r">จำนวนที่สั่ง</th><th class="rp-r">จำนวนที่เบิก</th><th class="rp-r">จำนวนที่ขาย</th>
          <th>หน่วย</th><th>แพ็ค</th><th>Cust Code</th><th>สินค้าทดแทน</th><th>บาร์โค้ด</th><th class="rp-r">จำนวนที่ตัด</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!selItems.length"><td colspan="14" class="rp-empty">— เลือกออร์เดอร์ด้านบนเพื่อดูรายการ —</td></tr>
        <tr v-for="(it, i) in selItems" :key="i">
          <td class="rp-c">{{ i + 1 }}</td>
          <td class="rp-mono">{{ it.sku || '-' }}</td>
          <td>{{ it.color_code || '-' }}</td>
          <td class="rp-c">{{ it.width || '-' }}</td>
          <td class="rp-r">{{ it.available_qty ? fmt(it.available_qty) : '-' }}</td>
          <td class="rp-r">{{ fmt(it.ordered_qty) }}</td>
          <td class="rp-r">{{ fmt(it.withdrawn_qty) }}</td>
          <td class="rp-r">{{ fmt(it.withdrawn_qty) }}</td>
          <td class="rp-c">{{ it.unit || 'หลา' }}</td>
          <td>{{ it.pack || '-' }}</td>
          <td>{{ it.cust_code || '-' }}</td>
          <td>{{ it.substitute ? (it.substitute_text || 'ใช่') : '-' }}</td>
          <td class="rp-mono rp-muted">-</td>
          <td class="rp-r rp-muted">-</td>
        </tr>
      </tbody>
      <tfoot v-if="selItems.length">
        <tr><td colspan="4" class="rp-r">รวม</td><td class="rp-r">-</td><td class="rp-r">{{ fmt(selSumOrdered) }}</td><td class="rp-r">{{ fmt(selSumWithdrawn) }}</td><td class="rp-r">{{ fmt(selSumWithdrawn) }}</td><td colspan="6"></td></tr>
      </tfoot>
    </table>
  </div>
</div>
</template>

<script>
export default {
  name: 'OrderReportPage',
  inject: ['dash'],
  data() {
    return {
      rows: [], selRow: null,
      filter: { date: '', customer: '', salesperson: '', q: '', sku: '', color: '', status: '', urgent: false },
      sort: { key: 'order_no', dir: 'desc' },
    };
  },
  computed: {
    salespersonOptions() { return [...new Set(this.rows.map(r => r.salesperson).filter(Boolean))]; },
    statusOptions() { return [...new Set(this.rows.map(r => r.status).filter(Boolean))]; },
    filtered() {
      let list = this.rows.slice();
      const f = this.filter;
      if (f.date) list = list.filter(r => this.fmtDate(r.date) === this.fmtDate(f.date));
      if (f.customer) list = list.filter(r => (r.customer || '').toLowerCase().includes(f.customer.trim().toLowerCase()));
      if (f.salesperson) list = list.filter(r => r.salesperson === f.salesperson);
      if (f.status) list = list.filter(r => r.status === f.status);
      if (f.urgent) list = list.filter(r => r.urgent);
      if (f.sku) { const q = f.sku.trim().toLowerCase(); list = list.filter(r => (r.items || []).some(it => (it.sku || '').toLowerCase().includes(q))); }
      if (f.color) { const q = f.color.trim().toLowerCase(); list = list.filter(r => (r.items || []).some(it => (it.color_code || '').toLowerCase().includes(q))); }
      if (f.q) { const q = f.q.trim().toLowerCase(); list = list.filter(r => (r.order_no || '').toLowerCase().includes(q) || (r.customer || '').toLowerCase().includes(q)); }
      const k = this.sort.key, dir = this.sort.dir === 'asc' ? 1 : -1;
      return list.sort((a, b) => { const av = (a[k] || '').toString().toLowerCase(), bv = (b[k] || '').toString().toLowerCase(); if (av < bv) return -1 * dir; if (av > bv) return 1 * dir; return 0; });
    },
    selItems() { return this.selRow ? (this.selRow.items || []) : []; },
    selSumOrdered() { return this.selItems.reduce((s, it) => s + (Number(it.ordered_qty) || 0), 0); },
    selSumWithdrawn() { return this.selItems.reduce((s, it) => s + (Number(it.withdrawn_qty) || 0), 0); },
    sumQty() { return this.filtered.reduce((s, r) => s + (Number(r.ordered_qty) || 0), 0); },
  },
  mounted() { this.load(); },
  methods: {
    async load() {
      try {
        const res = await fetch('/api/orders', { headers: { Authorization: 'Bearer ' + this.dash.token } });
        if (res.status === 401) { this.dash.sessionExpired && this.dash.sessionExpired(); return; }
        const d = await res.json();
        this.rows = (d.orders || []).map(o => ({ ...o, urgent: !!o.urgent }));
        this.selRow = null;
      } catch (e) { this.rows = []; }
    },
    applyFilter() { this.selRow = null; },
    statusClass(s) {
      const t = (s || '').toLowerCase();
      if (t.includes('complete')) return 'ok';
      if (t.includes('cancel')) return 'cancel';
      if (t.includes('invoice')) return 'info';
      return 'pending';
    },
    fmt(v) { return (Number(v) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
    fmtDate(d) { if (!d) return ''; const s = String(d); const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${m[3]}/${m[2]}/${m[1]}` : s.slice(0, 10); },
    toggleSort(k) { if (this.sort.key === k) this.sort.dir = this.sort.dir === 'asc' ? 'desc' : 'asc'; else { this.sort.key = k; this.sort.dir = 'asc'; } },
    sortIcon(k) { return this.sort.key === k ? (this.sort.dir === 'asc' ? '▲' : '▼') : '↕'; },
    reset() { this.filter = { date: '', customer: '', salesperson: '', q: '', sku: '', color: '', status: '', urgent: false }; this.selRow = null; },
    exportExcel() {
      const head = ['เลขที่ออร์เดอร์', 'วันที่', 'ลูกค้า', 'เงื่อนไขบัญชี', 'พนักงานขาย', 'จำนวนที่สั่ง', 'สถานะ'];
      const lines = [head.join('\t')];
      this.filtered.forEach(r => lines.push([r.order_no, this.fmtDate(r.date), r.customer, r.payment_term, r.salesperson, r.ordered_qty, r.status].join('\t')));
      const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'รายงานออร์เดอร์.csv'; a.click();
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
.rp-f-check { flex: 0 0 auto; min-width: auto; justify-content: flex-end; }
.rp-check { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text); font-weight: 600; height: 34px; }
.rp-f > label { font-size: 11.5px; color: var(--muted); font-weight: 600; }
.rp-f input:not([type=checkbox]), .rp-f select { height: 34px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12px; font-family: inherit; background: var(--field); color: var(--text); }
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
.rp-table tbody tr.is-urgent .rp-mono { color: #c0392b; font-weight: 700; }
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
