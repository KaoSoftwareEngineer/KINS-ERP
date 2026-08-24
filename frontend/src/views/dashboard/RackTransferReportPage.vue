<template>
<div class="rp-page">
  <div class="rp-titlebar">
    <span>🗄️ รายงานการย้ายชั้นสินค้า</span>
    <button class="rp-export-excel" @click="exportExcel">
      <span class="rp-xls-badge"><svg class="xls-ico" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#217346"/><path d="M14 2v6h6" fill="#185c37"/><path d="M9.5 12.5l5 5M14.5 12.5l-5 5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg></span>ส่งออก Excel
    </button>
  </div>

  <!-- ตัวกรอง -->
  <div class="rp-filter">
    <div class="rp-f"><label>คำค้นหา</label><input v-model="filter.q" placeholder="เลขที่ย้ายสินค้า" @keyup.enter="load" /></div>
    <div class="rp-f"><label>ไปยังคลัง</label>
      <select v-model="filter.toWh" @change="load"><option value="">ทั้งหมด</option><option v-for="o in toOptions" :key="o" :value="o">{{ o }}</option></select>
    </div>
    <div class="rp-f"><label>แร็คซ์</label>
      <select v-model="filter.rack" @change="load"><option value="">ทั้งหมด</option><option v-for="o in rackOptions" :key="o" :value="o">{{ o }}</option></select>
    </div>
    <div class="rp-f"><label>รหัสสินค้า</label><input v-model="filter.sku" @keyup.enter="load" /></div>
    <div class="rp-f"><label>รหัสสี</label><input v-model="filter.color" @keyup.enter="load" /></div>
    <div class="rp-f-actions">
      <button class="rp-btn-search" @click="load">🔍 ค้นหา</button>
      <button class="rp-btn-reset" @click="reset">↺ รีเซ็ต</button>
    </div>
  </div>

  <div class="rp-found">พบ {{ items.length.toLocaleString() }} รายการ</div>

  <!-- ตารางใบย้าย -->
  <div class="rp-table-wrap rp-groups">
    <table class="rp-table">
      <thead>
        <tr>
          <th style="width:40px;">ที่</th>
          <th class="rp-sortable" @click="toggleSort('tk_no')">เลขที่ย้ายสินค้า <span class="rp-sort" :class="{ on: sort.key === 'tk_no' }">{{ sortIcon('tk_no') }}</span></th>
          <th class="rp-sortable" @click="toggleSort('transfer_date')">วันที่ <span class="rp-sort" :class="{ on: sort.key === 'transfer_date' }">{{ sortIcon('transfer_date') }}</span></th>
          <th class="rp-sortable" @click="toggleSort('to_wh')">ไปยังคลัง <span class="rp-sort" :class="{ on: sort.key === 'to_wh' }">{{ sortIcon('to_wh') }}</span></th>
          <th class="rp-sortable" @click="toggleSort('rack')">แร็คซ์ <span class="rp-sort" :class="{ on: sort.key === 'rack' }">{{ sortIcon('rack') }}</span></th>
          <th class="rp-r rp-sortable" @click="toggleSort('folds')">พับรวม <span class="rp-sort" :class="{ on: sort.key === 'folds' }">{{ sortIcon('folds') }}</span></th>
          <th class="rp-r rp-sortable" @click="toggleSort('qty')">จำนวนรวม <span class="rp-sort" :class="{ on: sort.key === 'qty' }">{{ sortIcon('qty') }}</span></th>
          <th style="width:44px;"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in sortedItems" :key="row.id" :class="{ 'is-sel': selRow === row }" @click="selectRow(row)">
          <td class="rp-c">{{ idx + 1 }}</td>
          <td class="rp-mono">{{ row.tk_no }}</td>
          <td class="rp-c">{{ fmtDate(row.transfer_date) }}</td>
          <td>{{ row.to_wh || '-' }}</td>
          <td class="rp-c">{{ row.rack || '-' }}</td>
          <td class="rp-r">{{ Number(row.folds).toLocaleString() }}</td>
          <td class="rp-r rp-bold">{{ fmt(row.qty) }}</td>
          <td class="rp-c">
            <button class="rp-ic rp-print" title="พิมพ์ใบย้ายชั้น" @click.stop="printTransfer(row)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            </button>
          </td>
        </tr>
        <tr v-if="items.length === 0"><td colspan="8" class="rp-empty">ไม่พบข้อมูล</td></tr>
      </tbody>
      <tfoot v-if="items.length">
        <tr>
          <td colspan="5" class="rp-r rp-bold">รวม</td>
          <td class="rp-r rp-bold">{{ summary.folds.toLocaleString() }}</td>
          <td class="rp-r rp-bold">{{ fmt(summary.qty) }}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  </div>

  <!-- ตารางม้วนที่ย้าย (เลือกแถว) -->
  <div class="rp-table-wrap rp-rolls">
    <table class="rp-table">
      <thead>
        <tr>
          <th style="width:40px;">ที่</th>
          <th>รหัสสินค้า</th><th>รหัสสี</th><th>ประเภท</th><th>ชื่อ</th><th>หน้ากว้าง</th>
          <th class="rp-r">จำนวน</th><th>หน่วย</th><th>บาร์โค้ด</th><th style="width:44px;"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(it, i) in selItems" :key="i">
          <td class="rp-c">{{ i + 1 }}</td>
          <td>{{ it.sku || '-' }}</td>
          <td>{{ it.color || '-' }}</td>
          <td>{{ it.type || '-' }}</td>
          <td>{{ it.name || '-' }}</td>
          <td>{{ it.width || '-' }}</td>
          <td class="rp-r rp-bold">{{ fmt(it.qty) }}</td>
          <td>{{ it.unit || 'หลา' }}</td>
          <td class="rp-mono">{{ it.barcode || '-' }}</td>
          <td class="rp-c">
            <button class="fr-img-btn" title="ดูรูปสินค้า" @click.stop>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
            </button>
          </td>
        </tr>
        <tr v-if="selItems.length === 0"><td colspan="10" class="rp-empty">{{ selRow === null ? 'คลิกแถวด้านบนเพื่อดูม้วนที่ย้ายเข้าแร็ค' : 'ไม่มีรายการในใบย้ายนี้' }}</td></tr>
      </tbody>
      <tfoot v-if="selItems.length">
        <tr><td colspan="6" class="rp-r rp-bold">รวม</td><td class="rp-r rp-bold">{{ fmt(selQty) }}</td><td colspan="3"></td></tr>
      </tfoot>
    </table>
  </div>
</div>
</template>

<script>
import { buildDocPdf } from '../../utils/pdfLabels.js';
export default {
  name: 'RackTransferReportPage',
  inject: ['dash'],
  data() {
    return {
      filter: { q: '', toWh: '', rack: '', sku: '', color: '' },
      items: [], summary: { folds: 0, qty: 0 },
      selRow: null, selItems: [],
      sort: { key: '', dir: 'asc' },
    };
  },
  computed: {
    toOptions() { return [...new Set(this.items.map(i => i.to_wh).filter(Boolean))].sort(); },
    rackOptions() { return [...new Set(this.items.map(i => i.rack).filter(Boolean))].sort(); },
    selQty() { return this.selItems.reduce((s, r) => s + (Number(r.qty) || 0), 0); },
    sortedItems() {
      if (!this.sort.key) return this.items;
      const k = this.sort.key, dir = this.sort.dir === 'asc' ? 1 : -1;
      const num = ['folds', 'qty'].includes(k);
      const val = (r) => num ? (Number(r[k]) || 0) : (r[k] || '').toString().toLowerCase();
      return [...this.items].sort((a, b) => { const av = val(a), bv = val(b); if (av < bv) return -1 * dir; if (av > bv) return 1 * dir; return 0; });
    },
  },
  mounted() { this.load(); },
  methods: {
    authHeaders() { return { Authorization: 'Bearer ' + this.dash.token }; },
    fmt(v) { return (Number(v) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
    fmtDate(d) { if (!d) return '-'; try { const dt = new Date(d); if (isNaN(dt)) return String(d); return `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`; } catch (e) { return '-'; } },
    async load() {
      const qs = new URLSearchParams(Object.entries(this.filter).filter(([, v]) => v)).toString();
      try {
        const res = await fetch('/api/reports/rack-transfers' + (qs ? '?' + qs : ''), { headers: this.authHeaders() });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) {
          this.items = d.items || [];
          this.summary = { folds: 0, qty: 0, ...(d.summary || {}) };
          this.selRow = null; this.selItems = [];
        }
      } catch (e) { this.dash.fbFail('โหลดรายงานไม่สำเร็จ'); }
    },
    reset() { this.filter = { q: '', toWh: '', rack: '', sku: '', color: '' }; this.load(); },
    toggleSort(key) {
      if (this.sort.key === key) this.sort.dir = this.sort.dir === 'asc' ? 'desc' : 'asc';
      else { this.sort.key = key; this.sort.dir = 'asc'; }
    },
    sortIcon(key) { if (this.sort.key !== key) return '↕'; return this.sort.dir === 'asc' ? '▲' : '▼'; },
    selectRow(row) { this.selRow = row; this.selItems = row.items || []; },
    async printTransfer(row) {
      const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
      const rowsHtml = (row.items || []).map((it, i) => `<tr><td>${i + 1}</td><td>${esc(it.sku)}</td><td>${esc(it.color)}</td><td>${esc(it.width)}</td><td>${esc(it.barcode)}</td><td style="text-align:right">${this.fmt(it.qty)}</td><td>${esc(it.unit)}</td></tr>`).join('');
      const html = `
        <style>
          h2{margin:0 0 4px;font-size:18px}.meta{color:#444;margin-bottom:12px;font-size:12px;line-height:1.7}
          table{width:100%;border-collapse:collapse;margin-top:8px;font-size:13px}th,td{border:1px solid #999;padding:6px 8px;text-align:left}th{background:#eee}
        </style>
        <h2>ใบย้ายชั้นสินค้า ${esc(row.tk_no)}</h2>
        <div class="meta">วันที่: ${esc(this.fmtDate(row.transfer_date))} · ไปยังคลัง: ${esc(row.to_wh)} · แร็คซ์: ${esc(row.rack)}</div>
        <table><thead><tr><th>ที่</th><th>รหัสสินค้า</th><th>รหัสสี</th><th>หน้ากว้าง</th><th>บาร์โค้ด</th><th>จำนวน</th><th>หน่วย</th></tr></thead>
        <tbody>${rowsHtml || '<tr><td colspan="7" style="text-align:center">ไม่มีรายการ</td></tr>'}</tbody>
        <tfoot><tr><th colspan="5" style="text-align:right">รวม</th><th style="text-align:right">${this.fmt(row.qty)}</th><th></th></tr></tfoot></table>`;
      try { await buildDocPdf(html, { filename: 'ใบย้ายชั้น-' + row.tk_no + '.pdf', format: 'a4' }); }
      catch (e) { this.dash.fbFail('สร้าง PDF ไม่สำเร็จ'); }
    },
    async exportExcel() {
      const head = ['เลขที่ย้ายสินค้า', 'วันที่', 'ไปยังคลัง', 'แร็คซ์', 'พับรวม', 'จำนวนรวม'];
      const body = this.sortedItems.map(r => [r.tk_no, this.fmtDate(r.transfer_date), r.to_wh, r.rack, Number(r.folds) || 0, Number(r.qty) || 0]);
      const XLSX = await import('xlsx');
      const sheet = XLSX.utils.aoa_to_sheet([head, ...body]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, sheet, 'ย้ายชั้นสินค้า');
      XLSX.writeFile(wb, `รายงานการย้ายชั้นสินค้า-${new Date().toISOString().slice(0, 10)}.xlsx`);
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
.rp-f { display: flex; flex-direction: column; gap: 4px; min-width: 140px; flex: 1 1 140px; max-width: 200px; }
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
.rp-table { width: 100%; border-collapse: collapse; font-size: 12px; min-width: 900px; }
.rp-table thead th { position: sticky; top: 0; z-index: 3; background: #3c4453; color: #fff; font-size: 11px; font-weight: 600; letter-spacing: .3px; padding: 7px 12px; text-align: left; white-space: nowrap; border-right: 1px solid rgba(255,255,255,.18); }
.rp-table thead th:last-child { border-right: none; }
.rp-table th.rp-r { text-align: right; }
.rp-table tbody td { padding: 3px 12px; font-size: 12px; line-height: 1.6; border-bottom: 1px solid var(--table-line); border-right: 1px solid var(--table-line); white-space: nowrap; }
.rp-table tbody td:last-child { border-right: none; }
.rp-table tbody tr { cursor: pointer; }
.rp-table tbody tr:hover { background: var(--field); }
.rp-table tbody tr.is-sel { background: #fff8d6; }
.rp-r { text-align: right; } .rp-c { text-align: center; color: var(--muted); }
.rp-bold { font-weight: 700; } .rp-mono { font-family: 'Courier New', monospace; }
.rp-empty { text-align: center; color: var(--muted); padding: 26px; }
.rp-table tfoot td { position: sticky; bottom: 0; z-index: 2; padding: 9px 10px; border-top: 2px solid var(--table-line); background: var(--field); font-weight: 700; }
.rp-sortable { cursor: pointer; user-select: none; }
.rp-sortable:hover { background: #4a5262; }
.rp-sort { opacity: .45; font-size: 10px; margin-left: 3px; }
.rp-sort.on { opacity: 1; }
.rp-ic { width: 26px; height: 26px; border-radius: 6px; border: 1px solid var(--field-border); background: var(--field); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; padding: 0; vertical-align: middle; transition: background .15s, border-color .15s; }
.rp-ic svg { width: 14px; height: 14px; }
.rp-print { color: #111; }
.rp-print:hover { background: var(--field); border-color: #111; }
</style>
