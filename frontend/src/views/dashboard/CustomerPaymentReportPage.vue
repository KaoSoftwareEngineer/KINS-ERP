<template>
<div class="rp-page">
  <div class="rp-titlebar">
    <span>💵 {{ title }}</span>
    <button class="rp-export-excel" @click="exportExcel">
      <span class="rp-xls-badge"><svg class="xls-ico" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#217346"/><path d="M14 2v6h6" fill="#185c37"/><path d="M9.5 12.5l5 5M14.5 12.5l-5 5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg></span>ส่งออก Excel
    </button>
  </div>
  <div class="rp-filter">
    <div class="rp-f"><label>วันที่ชำระเงิน</label><input type="date" v-model="filter.payDate" @change="applyFilter" /></div>
    <div class="rp-f"><label>วันที่เช็ค</label><input type="date" v-model="filter.chequeDate" @change="applyFilter" /></div>
    <div class="rp-f"><label>{{ partyLabel }}</label><input v-model="filter.customer" :placeholder="partyLabel" @keyup.enter="applyFilter" /></div>
    <div class="rp-f"><label>คำค้นหา</label><input v-model="filter.q" placeholder="ลูกค้า/เลขที่เช็ค" @keyup.enter="applyFilter" /></div>
    <div class="rp-f"><label>ประเภท</label>
      <select v-model="filter.type" @change="applyFilter"><option value="">ทั้งหมด</option><option>เงินสด</option><option>เช็ค</option><option>โอน</option></select>
    </div>
    <div class="rp-f"><label>บัญชี</label>
      <select v-model="filter.account" @change="applyFilter"><option value="">ทั้งหมด</option><option v-for="a in accountOptions" :key="a" :value="a">{{ a }}</option></select>
    </div>
    <div class="rp-f-actions"><button class="rp-btn-search" @click="applyFilter">🔍 ค้นหา</button><button class="rp-btn-reset" @click="reset">↺ รีเซ็ต</button></div>
  </div>
  <div class="rp-found">พบ {{ filtered.length.toLocaleString() }} รายการ</div>

  <div class="rp-table-wrap rp-tall">
    <table class="rp-table" style="min-width:1150px">
      <thead>
        <tr>
          <th style="width:40px;">ที่</th>
          <th class="rp-sortable" @click="toggleSort('pay_date')">วันที่ชำระเงิน <span class="rp-sort" :class="{ on: sort.key==='pay_date' }">{{ sortIcon('pay_date') }}</span></th>
          <th>ประเภท</th><th>{{ partyLabel }}</th><th>วันที่เช็ค</th><th>เลขที่เช็ค</th><th>บัญชี</th>
          <th class="rp-r">จำนวนเงิน</th><th>สถานะ</th><th>สถานะบัญชี</th><th>รูป</th><th>อนุมัติ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!filtered.length"><td colspan="12" class="rp-empty">— ไม่มีข้อมูลรับเงินลูกค้า —</td></tr>
        <tr v-for="(r, idx) in filtered" :key="idx">
          <td class="rp-c">{{ idx + 1 }}</td>
          <td class="rp-c">{{ fmtDate(r.pay_date) }}</td>
          <td>{{ r.type || '-' }}</td>
          <td>{{ r.party || '-' }}</td>
          <td class="rp-c">{{ fmtDate(r.cheque_date) || '' }}</td>
          <td>{{ r.cheque_no || '' }}</td>
          <td>{{ r.account || '' }}</td>
          <td class="rp-r">{{ fmt(r.amount) }}</td>
          <td><span class="rp-badge ok">สำเร็จ</span></td>
          <td><span class="rp-badge" :class="acctClass(r)">{{ acctLabel(r) }}</span></td>
          <td class="rp-c"><a v-if="r.slipUrl" :href="r.slipUrl" target="_blank" title="ดูสลิป">📎</a><span v-else class="rp-muted">-</span></td>
          <td class="rp-c"><span class="rp-approve">✔</span></td>
        </tr>
      </tbody>
      <tfoot v-if="filtered.length">
        <tr><td colspan="7" class="rp-r">รวม</td><td class="rp-r">{{ fmt(sumAmount) }}</td><td colspan="4"></td></tr>
      </tfoot>
    </table>
  </div>
</div>
</template>

<script>
export default {
  name: 'CustomerPaymentReportPage',
  inject: ['dash'],
  props: { mode: { type: String, default: 'receive' } }, // receive = รับเงินลูกค้า, pay = จ่ายเงินคู่ค้า
  data() { return { rows: [], filter: { payDate: '', chequeDate: '', customer: '', q: '', type: '', account: '' }, sort: { key: 'pay_date', dir: 'desc' } }; },
  computed: {
    title() { return this.mode === 'pay' ? 'รายงานจ่ายเงินคู่ค้า' : 'รายงานรับเงินลูกค้า'; },
    partyLabel() { return this.mode === 'pay' ? 'คู่ค้า' : 'ลูกค้า'; },
    accountOptions() { return [...new Set(this.rows.map(r => r.account).filter(Boolean))]; },
    filtered() {
      let list = this.rows.slice(); const f = this.filter;
      if (f.payDate) list = list.filter(r => this.fmtDate(r.pay_date) === this.fmtDate(f.payDate));
      if (f.chequeDate) list = list.filter(r => this.fmtDate(r.cheque_date) === this.fmtDate(f.chequeDate));
      if (f.customer) list = list.filter(r => (r.party || '').toLowerCase().includes(f.customer.trim().toLowerCase()));
      if (f.type) list = list.filter(r => r.type === f.type);
      if (f.account) list = list.filter(r => r.account === f.account);
      if (f.q) { const q = f.q.trim().toLowerCase(); list = list.filter(r => (r.party || '').toLowerCase().includes(q) || (r.cheque_no || '').toLowerCase().includes(q)); }
      const k = this.sort.key, dir = this.sort.dir === 'asc' ? 1 : -1;
      return list.sort((a, b) => { const av = (a[k] || '').toString().toLowerCase(), bv = (b[k] || '').toString().toLowerCase(); return av < bv ? -dir : av > bv ? dir : 0; });
    },
    sumAmount() { return this.filtered.reduce((s, r) => s + (Number(r.amount) || 0), 0); },
  },
  watch: { mode() { this.load(); } },
  mounted() { this.load(); },
  methods: {
    acctLabel(r) { if (this.mode === 'pay') return r.invoiceRef ? 'หักแล้ว' : 'รอหัก'; return r.invoiceRef ? 'หักยอดแล้ว' : 'ยังไม่หัก'; },
    acctClass(r) { return r.invoiceRef ? 'ok' : 'pending'; },
    async load() {
      try {
        const res = await fetch('/api/payments?type=' + this.mode, { headers: { Authorization: 'Bearer ' + this.dash.token } });
        if (res.status === 401) { this.dash.sessionExpired && this.dash.sessionExpired(); return; }
        const d = await res.json();
        const out = [];
        (d.payments || []).forEach(doc => {
          let items = []; try { items = JSON.parse(doc.items_json || '[]'); } catch (e) {}
          items.forEach(it => { if ((Number(it.amount) || 0) !== 0) out.push({ ...it, doc_no: doc.doc_no }); });
        });
        this.rows = out;
      } catch (e) { this.rows = []; }
    },
    applyFilter() {},
    fmt(v) { return (Number(v) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
    fmtDate(d) { if (!d) return ''; const s = String(d); const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${m[3]}/${m[2]}/${m[1]}` : s.slice(0, 10); },
    toggleSort(k) { if (this.sort.key === k) this.sort.dir = this.sort.dir === 'asc' ? 'desc' : 'asc'; else { this.sort.key = k; this.sort.dir = 'asc'; } },
    sortIcon(k) { return this.sort.key === k ? (this.sort.dir === 'asc' ? '▲' : '▼') : '↕'; },
    reset() { this.filter = { payDate: '', chequeDate: '', customer: '', q: '', type: '', account: '' }; },
    exportExcel() {
      const head = ['วันที่ชำระเงิน', 'ประเภท', 'ลูกค้า', 'วันที่เช็ค', 'เลขที่เช็ค', 'บัญชี', 'จำนวนเงิน', 'สถานะ'];
      const lines = [head.join('\t')];
      this.filtered.forEach(r => lines.push([this.fmtDate(r.pay_date), r.type, r.party, this.fmtDate(r.cheque_date), r.cheque_no, r.account, r.amount, 'สำเร็จ'].join('\t')));
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
.rp-tall { max-height: 640px; overflow-y: auto; }
.rp-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.rp-table thead th { position: sticky; top: 0; z-index: 3; background: #3c4453; color: #fff; font-size: 11px; font-weight: 600; letter-spacing: .3px; padding: 7px 12px; text-align: left; white-space: nowrap; border-right: 1px solid rgba(255,255,255,.18); }
.rp-table thead th:last-child { border-right: none; }
.rp-table th.rp-r { text-align: right; }
.rp-table tbody td { padding: 4px 12px; font-size: 12px; line-height: 1.6; border-bottom: 1px solid var(--table-line); border-right: 1px solid var(--table-line); white-space: nowrap; }
.rp-table tbody td:last-child { border-right: none; }
.rp-table tbody tr:hover { background: var(--field); }
.rp-table tbody tr:first-child { background: #fff8d6; }
.rp-r { text-align: right; } .rp-c { text-align: center; color: var(--muted); }
.rp-muted { color: var(--muted); }
.rp-empty { text-align: center; color: var(--muted); padding: 26px; }
.rp-table tfoot td { position: sticky; bottom: 0; z-index: 2; padding: 9px 10px; border-top: 2px solid var(--table-line); background: var(--field); font-weight: 700; }
.rp-sortable { cursor: pointer; user-select: none; } .rp-sortable:hover { background: #4a5262; }
.rp-sort { opacity: .45; font-size: 10px; margin-left: 3px; } .rp-sort.on { opacity: 1; }
.rp-badge { display: inline-block; padding: 2px 9px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.rp-badge.ok { background: #dcf1e8; color: #158045; } .rp-badge.pending { background: #fde7cf; color: #b8791a; }
.rp-approve { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 50%; background: #1a9c54; color: #fff; font-size: 11px; }
</style>
