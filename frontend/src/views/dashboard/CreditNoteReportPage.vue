<template>
<div class="rp-page">
  <div class="rp-titlebar">
    <span>📉 {{ title }}</span>
    <button class="rp-export-excel" @click="exportExcel">
      <span class="rp-xls-badge"><svg class="xls-ico" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#217346"/><path d="M14 2v6h6" fill="#185c37"/><path d="M9.5 12.5l5 5M14.5 12.5l-5 5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg></span>ส่งออก Excel
    </button>
  </div>
  <div class="rp-filter">
    <div class="rp-f"><label>วันที่</label><input type="date" v-model="filter.date" @change="applyFilter" /></div>
    <div class="rp-f"><label>{{ partyLabel }}</label><input v-model="filter.party" :placeholder="partyLabel" @keyup.enter="applyFilter" /></div>
    <div class="rp-f"><label>{{ mode === 'partner' ? 'ประเภทเครดิต' : 'ประเภท' }}</label>
      <select v-model="filter.type" @change="applyFilter"><option value="">ทั้งหมด</option><option v-for="t in typeOptions" :key="t" :value="t">{{ t }}</option></select>
    </div>
    <div class="rp-f"><label>คำค้นหา</label><input v-model="filter.q" placeholder="เลขที่ใบลดหนี้/อินวอยส์" @keyup.enter="applyFilter" /></div>
    <div class="rp-f-actions"><button class="rp-btn-search" @click="applyFilter">🔍 ค้นหา</button><button class="rp-btn-reset" @click="reset">↺ รีเซ็ต</button></div>
  </div>
  <div class="rp-found">พบ {{ filtered.length.toLocaleString() }} รายการ</div>

  <div class="rp-table-wrap rp-groups">
    <table class="rp-table" style="min-width:950px">
      <thead>
        <tr>
          <th style="width:40px;">ที่</th>
          <th class="rp-sortable" @click="toggleSort('doc_no')">เลขที่ใบลดหนี้ <span class="rp-sort" :class="{ on: sort.key==='doc_no' }">{{ sortIcon('doc_no') }}</span></th>
          <th>เลขที่อินวอยส์</th><th>วันที่</th><th>{{ mode === 'partner' ? 'ประเภทเครดิต' : 'ประเภท' }}</th><th>{{ partyLabel }}</th>
          <th class="rp-r">ยอดรวม</th><th>สถานะ</th><th>สถานะบัญชี</th><th style="width:60px;"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!filtered.length"><td colspan="10" class="rp-empty">— ไม่มีข้อมูลใบลดหนี้ —</td></tr>
        <tr v-for="(row, idx) in filtered" :key="row.id" :class="{ 'is-sel': selRow === row }" @click="selRow = row">
          <td class="rp-c">{{ idx + 1 }}</td>
          <td class="rp-mono">{{ row.doc_no }}</td>
          <td class="rp-mono">{{ row.invoice_ref || '' }}</td>
          <td class="rp-c">{{ fmtDate(row.doc_date) }}</td>
          <td>{{ row.return_type || 'No Return' }}</td>
          <td>{{ row.party || '-' }}</td>
          <td class="rp-r">{{ fmt(row.net_total) }}</td>
          <td><span class="rp-badge ok">ปกติ</span></td>
          <td><span class="rp-badge" :class="row.invoice_ref ? 'ok' : 'pending'">{{ acctLabel(row) }}</span></td>
          <td><button class="rp-ic" title="ดูรายละเอียด" @click.stop="selRow = row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01" stroke-linecap="round"/></svg></button></td>
        </tr>
      </tbody>
      <tfoot v-if="filtered.length"><tr><td colspan="6" class="rp-r">รวม</td><td class="rp-r">{{ fmt(sumTotal) }}</td><td colspan="3"></td></tr></tfoot>
    </table>
  </div>

  <!-- รายการ (คำอธิบาย/ราคา) -->
  <div class="rp-table-wrap rp-rolls">
    <table class="rp-table" style="min-width:600px">
      <thead><tr><th style="width:40px;">ที่</th><th>คำอธิบาย</th><th class="rp-r">ราคา</th></tr></thead>
      <tbody>
        <tr v-if="!selItems.length"><td colspan="3" class="rp-empty">— เลือกใบลดหนี้ด้านบนเพื่อดูรายการ —</td></tr>
        <tr v-for="(it, i) in selItems" :key="i">
          <td class="rp-c">{{ i + 1 }}</td>
          <td>{{ it.description || it.desc || it.name || '-' }}</td>
          <td class="rp-r">{{ fmt(itAmount(it)) }}</td>
        </tr>
      </tbody>
      <tfoot v-if="selItems.length">
        <tr><td colspan="2" class="rp-r">รวม</td><td class="rp-r rp-bold">{{ fmt(selSub) }}</td></tr>
        <tr v-if="mode === 'customer'"><td colspan="2" class="rp-r">VAT 7%</td><td class="rp-r">{{ fmt(selVat) }}</td></tr>
        <tr v-if="mode === 'customer'"><td colspan="2" class="rp-r">ยอดสุทธิ</td><td class="rp-r rp-bold">{{ fmt(selNet) }}</td></tr>
      </tfoot>
    </table>
  </div>

  <!-- รายการตัดบัญชีการชำระเงิน (เฉพาะลูกค้า) -->
  <template v-if="mode === 'customer' && selRow">
    <div class="rp-subtitle">รายการตัดบัญชีการชำระเงิน</div>
    <div class="rp-table-wrap">
      <table class="rp-table" style="min-width:700px">
        <thead><tr><th style="width:40px;">ที่</th><th>วันที่</th><th>ประเภท</th><th>เลขที่บิล</th><th class="rp-r">ยอดบิล</th><th class="rp-r">หักไปแล้ว</th><th class="rp-r">คงเหลือ</th></tr></thead>
        <tbody>
          <tr v-if="!selRow.invoice_ref"><td colspan="7" class="rp-empty">— ไม่มีรายการตัดบัญชี —</td></tr>
          <tr v-else>
            <td class="rp-c">1</td>
            <td class="rp-c">{{ fmtDate(selRow.doc_date) }}</td>
            <td>{{ /^p/i.test(selRow.invoice_ref) ? 'ขายปลีก' : 'ขายส่ง' }}</td>
            <td class="rp-mono">{{ selRow.invoice_ref }}</td>
            <td class="rp-r">{{ billTotal(selRow.invoice_ref) != null ? fmt(billTotal(selRow.invoice_ref)) : '-' }}</td>
            <td class="rp-r">{{ fmt(selRow.net_total) }}</td>
            <td class="rp-r rp-muted">-</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
</div>
</template>

<script>
export default {
  name: 'CreditNoteReportPage',
  inject: ['dash'],
  props: { mode: { type: String, default: 'customer' } }, // customer | partner
  data() { return { rows: [], invMap: {}, selRow: null, filter: { date: '', party: '', type: '', q: '' }, sort: { key: 'doc_no', dir: 'desc' } }; },
  computed: {
    title() { return this.mode === 'partner' ? 'รายงานใบลดหนี้คู่ค้า' : 'รายงานใบลดหนี้ลูกค้า'; },
    partyLabel() { return this.mode === 'partner' ? 'คู่ค้า' : 'ลูกค้า'; },
    typeOptions() { return [...new Set(this.rows.map(r => r.return_type).filter(Boolean))]; },
    filtered() {
      let list = this.rows.slice(); const f = this.filter;
      if (f.date) list = list.filter(r => this.fmtDate(r.doc_date) === this.fmtDate(f.date));
      if (f.party) list = list.filter(r => (r.party || '').toLowerCase().includes(f.party.trim().toLowerCase()));
      if (f.type) list = list.filter(r => r.return_type === f.type);
      if (f.q) { const q = f.q.trim().toLowerCase(); list = list.filter(r => (r.doc_no || '').toLowerCase().includes(q) || (r.invoice_ref || '').toLowerCase().includes(q)); }
      const k = this.sort.key, dir = this.sort.dir === 'asc' ? 1 : -1;
      return list.sort((a, b) => { const av = (a[k] || '').toString().toLowerCase(), bv = (b[k] || '').toString().toLowerCase(); return av < bv ? -dir : av > bv ? dir : 0; });
    },
    selItems() { return this.selRow ? this.itemsOf(this.selRow) : []; },
    selSub() { return this.selItems.reduce((s, it) => s + this.itAmount(it), 0); },
    selVat() { return this.selRow ? (Number(this.selRow.vat) || +(this.selSub * 0.07).toFixed(2)) : 0; },
    selNet() { return this.selRow && Number(this.selRow.net_total) ? Number(this.selRow.net_total) : this.selSub + this.selVat; },
    sumTotal() { return this.filtered.reduce((s, r) => s + (Number(r.net_total) || 0), 0); },
  },
  watch: { mode() { this.load(); } },
  mounted() { this.load(); if (this.mode === 'customer') this.loadInvoices(); },
  methods: {
    async load() {
      try {
        const res = await fetch('/api/credit-notes?type=' + this.mode, { headers: { Authorization: 'Bearer ' + this.dash.token } });
        if (res.status === 401) { this.dash.sessionExpired && this.dash.sessionExpired(); return; }
        const d = await res.json();
        this.rows = d.notes || d.rows || []; this.selRow = null;
      } catch (e) { this.rows = []; }
    },
    async loadInvoices() {
      try {
        const res = await fetch('/api/sale-invoices', { headers: { Authorization: 'Bearer ' + this.dash.token } });
        const d = await res.json();
        const map = {}; (d.invoices || []).forEach(v => { map[v.inv_no] = Number(v.total_amount) || 0; });
        this.invMap = map;
      } catch (e) {}
    },
    billTotal(ref) { return this.invMap[ref] != null ? this.invMap[ref] : null; },
    itemsOf(r) { if (r._items) return r._items; let a = []; try { a = typeof r.items_json === 'string' ? JSON.parse(r.items_json || '[]') : (r.items_json || []); } catch (e) {} r._items = Array.isArray(a) ? a : []; return r._items; },
    itAmount(it) { return Number(it.amount != null ? it.amount : (it.price != null ? it.price : it.total)) || 0; },
    acctLabel(r) { if (this.mode === 'partner') return r.invoice_ref ? 'หักแล้ว' : 'รอหัก'; return r.invoice_ref ? 'หักยอดแล้ว' : 'รอหัก'; },
    applyFilter() { this.selRow = null; },
    fmt(v) { return (Number(v) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
    fmtDate(d) { if (!d) return ''; const s = String(d); const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${m[3]}/${m[2]}/${m[1]}` : s.slice(0, 10); },
    toggleSort(k) { if (this.sort.key === k) this.sort.dir = this.sort.dir === 'asc' ? 'desc' : 'asc'; else { this.sort.key = k; this.sort.dir = 'asc'; } },
    sortIcon(k) { return this.sort.key === k ? (this.sort.dir === 'asc' ? '▲' : '▼') : '↕'; },
    reset() { this.filter = { date: '', party: '', type: '', q: '' }; this.selRow = null; },
    exportExcel() {
      const head = ['เลขที่ใบลดหนี้', 'เลขที่อินวอยส์', 'วันที่', 'ประเภท', this.partyLabel, 'ยอดรวม'];
      const lines = [head.join('\t')];
      this.filtered.forEach(r => lines.push([r.doc_no, r.invoice_ref, this.fmtDate(r.doc_date), r.return_type, r.party, r.net_total].join('\t')));
      const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = this.title + '.csv'; a.click();
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
.rp-groups { max-height: 400px; overflow-y: auto; }
.rp-rolls { max-height: 260px; overflow-y: auto; }
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
