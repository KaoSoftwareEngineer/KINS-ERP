<template>
<div class="rp-page">
  <div class="rp-titlebar">
    <span>🛒 รายงานใบสั่งซื้อ</span>
    <button class="rp-export-excel" @click="exportExcel">
      <span class="rp-xls-badge"><svg class="xls-ico" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#217346"/><path d="M14 2v6h6" fill="#185c37"/><path d="M9.5 12.5l5 5M14.5 12.5l-5 5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg></span>ส่งออก Excel
    </button>
  </div>

  <!-- ตัวกรอง -->
  <div class="rp-filter">
    <div class="rp-f"><label>วันที่</label><input type="date" v-model="filter.date" @change="load" /></div>
    <div class="rp-f"><label>คู่ค้า</label><input v-model="filter.vendor" placeholder="คู่ค้า/โรงงาน" @keyup.enter="load" /></div>
    <div class="rp-f"><label>ประเภทสินค้า</label>
      <select v-model="filter.type" @change="load"><option value="">ทั้งหมด</option><option value="finished">ผ้าสำเร็จ</option><option value="raw">ผ้าดิบ</option><option value="dye">สั่งย้อม</option></select>
    </div>
    <div class="rp-f"><label>สถานที่จัดส่ง</label><input v-model="filter.shipTo" @keyup.enter="load" /></div>
    <div class="rp-f"><label>คำค้นหา</label><input v-model="filter.q" placeholder="เลขที่ PO/คู่ค้า/อ้างอิง" @keyup.enter="load" /></div>
    <div class="rp-f"><label>รหัสสินค้า</label><input v-model="filter.sku" @keyup.enter="load" /></div>
    <div class="rp-f"><label>สถานะ</label>
      <select v-model="filter.status" @change="load"><option value="">ทั้งหมด</option><option value="Pending">Pending</option><option value="Approved">Approved</option></select>
    </div>
    <div class="rp-f-actions">
      <button class="rp-btn-search" @click="load">🔍 ค้นหา</button>
      <button class="rp-btn-reset" @click="reset">↺ รีเซ็ต</button>
    </div>
  </div>

  <div class="rp-found">พบ {{ filtered.length.toLocaleString() }} รายการ</div>

  <!-- ตารางใบสั่งซื้อ -->
  <div class="rp-table-wrap rp-groups">
    <table class="rp-table">
      <thead>
        <tr>
          <th style="width:40px;">ที่</th>
          <th class="rp-sortable" @click="toggleSort('po_no')">เลขที่สั่งซื้อ <span class="rp-sort" :class="{ on: sort.key==='po_no' }">{{ sortIcon('po_no') }}</span></th>
          <th class="rp-sortable" @click="toggleSort('po_date')">วันที่ <span class="rp-sort" :class="{ on: sort.key==='po_date' }">{{ sortIcon('po_date') }}</span></th>
          <th>ประเภท</th>
          <th class="rp-sortable" @click="toggleSort('vendor')">คู่ค้า <span class="rp-sort" :class="{ on: sort.key==='vendor' }">{{ sortIcon('vendor') }}</span></th>
          <th>เลขที่อ้างอิง</th>
          <th>วันที่จัดส่ง</th>
          <th class="rp-r">จำนวนรวม</th>
          <th class="rp-r">ยอดรวม</th>
          <th>สถานที่จัดส่ง</th>
          <th>สถานะ</th>
          <th style="width:96px;"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!filtered.length"><td colspan="12" class="rp-empty">— ไม่มีข้อมูลใบสั่งซื้อ —</td></tr>
        <tr v-for="(row, idx) in filtered" :key="row.id" :class="{ 'is-sel': selRow === row }" @click="selRow = row">
          <td class="rp-c">{{ idx + 1 }}</td>
          <td class="rp-mono">{{ row.po_no }}</td>
          <td class="rp-c">{{ fmtDate(row.po_date) }}</td>
          <td>{{ typeLabel(row.po_type) }}</td>
          <td>{{ row.vendor || '-' }}</td>
          <td>{{ row.ref_no || '-' }}</td>
          <td class="rp-c">{{ fmtDate(row.ship_date) || '-' }}</td>
          <td class="rp-r">{{ fmt(rowQty(row)) }}</td>
          <td class="rp-r">{{ fmt(row.net_total) }}</td>
          <td>{{ row.ship_to || '-' }}</td>
          <td><span class="rp-badge" :class="statusClass(row)">{{ statusLabel(row) }}</span></td>
          <td>
            <button class="rp-ic" title="ดูรายละเอียด" @click.stop="selRow = row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01" stroke-linecap="round"/></svg></button>
            <button class="rp-ic rp-print" title="พิมพ์ PDF" @click.stop="printPo(row)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z"/></svg></button>
          </td>
        </tr>
      </tbody>
      <tfoot v-if="filtered.length">
        <tr>
          <td colspan="7" class="rp-r">รวม</td>
          <td class="rp-r">{{ fmt(sumQty) }}</td>
          <td class="rp-r">{{ fmt(sumAmount) }}</td>
          <td colspan="3"></td>
        </tr>
      </tfoot>
    </table>
  </div>

  <!-- ตารางรายการสินค้าใน PO ที่เลือก -->
  <div class="rp-table-wrap rp-rolls">
    <table class="rp-table" style="min-width:1100px">
      <thead>
        <tr>
          <th style="width:40px;">ที่</th>
          <th>รหัสสินค้า</th><th>รหัสสี</th><th>ชื่อ</th><th>หน้ากว้าง</th><th>หน่วย</th>
          <th class="rp-r">จำนวน</th><th class="rp-r">ราคา/หน่วย</th><th class="rp-r">ราคา</th>
          <th class="rp-r">จำนวนรับ</th><th class="rp-r">จำนวนค้างรับ</th><th>ปิดโดย</th><th>วันที่บันทึก</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!selItems.length"><td colspan="13" class="rp-empty">— เลือกใบสั่งซื้อด้านบนเพื่อดูรายการ —</td></tr>
        <tr v-for="(it, i) in selItems" :key="i">
          <td class="rp-c">{{ i + 1 }}</td>
          <td class="rp-mono">{{ it.sku || '-' }}</td>
          <td>{{ it.color || '-' }}</td>
          <td>{{ it.name || '-' }}</td>
          <td class="rp-c">{{ it.width || '-' }}</td>
          <td class="rp-c">{{ it.unit || 'หลา' }}</td>
          <td class="rp-r">{{ fmt(it.qty) }}</td>
          <td class="rp-r">{{ it.unit_price != null ? fmt(it.unit_price) : '-' }}</td>
          <td class="rp-r">{{ it.amount != null ? fmt(it.amount) : '-' }}</td>
          <td class="rp-r rp-muted">-</td>
          <td class="rp-r rp-muted">-</td>
          <td class="rp-muted">-</td>
          <td class="rp-c rp-muted">{{ fmtDate(selRow && selRow.po_date) || '-' }}</td>
        </tr>
      </tbody>
      <tfoot v-if="selItems.length">
        <tr><td colspan="6" class="rp-r">รวม</td><td class="rp-r">{{ fmt(selItemsQty) }}</td><td></td><td class="rp-r">{{ fmt(selItemsAmount) }}</td><td colspan="4"></td></tr>
      </tfoot>
    </table>
  </div>
</div>
</template>

<script>
import { buildDocPdf, docBrandHeader, COMPANY_NAME_EN } from '../../utils/pdfLabels.js';
export default {
  name: 'PoReportPage',
  inject: ['dash'],
  data() {
    return {
      rows: [], selRow: null,
      filter: { date: '', vendor: '', type: '', shipTo: '', q: '', sku: '', status: '' },
      sort: { key: 'po_no', dir: 'desc' },
    };
  },
  computed: {
    filtered() {
      let list = this.rows.slice();
      const f = this.filter;
      if (f.date) list = list.filter(r => (r.po_date || '').slice(0, 10) === f.date);
      if (f.vendor) list = list.filter(r => (r.vendor || '').toLowerCase().includes(f.vendor.trim().toLowerCase()));
      if (f.type) list = list.filter(r => (r.po_type || '') === f.type);
      if (f.shipTo) list = list.filter(r => (r.ship_to || '').toLowerCase().includes(f.shipTo.trim().toLowerCase()));
      if (f.status) list = list.filter(r => this.statusLabel(r) === f.status);
      if (f.sku) { const q = f.sku.trim().toLowerCase(); list = list.filter(r => this.itemsOf(r).some(it => (it.sku || '').toLowerCase().includes(q))); }
      if (f.q) { const q = f.q.trim().toLowerCase(); list = list.filter(r => (r.po_no || '').toLowerCase().includes(q) || (r.vendor || '').toLowerCase().includes(q) || (r.ref_no || '').toLowerCase().includes(q)); }
      const k = this.sort.key, dir = this.sort.dir === 'asc' ? 1 : -1;
      return list.sort((a, b) => { const av = (a[k] || '').toString().toLowerCase(), bv = (b[k] || '').toString().toLowerCase(); if (av < bv) return -1 * dir; if (av > bv) return 1 * dir; return 0; });
    },
    selItems() { return this.selRow ? this.itemsOf(this.selRow) : []; },
    selItemsQty() { return this.selItems.reduce((s, it) => s + (Number(it.qty) || 0), 0); },
    selItemsAmount() { return this.selItems.reduce((s, it) => s + (Number(it.amount) || 0), 0); },
    sumQty() { return this.filtered.reduce((s, r) => s + this.rowQty(r), 0); },
    sumAmount() { return this.filtered.reduce((s, r) => s + (Number(r.net_total) || 0), 0); },
  },
  mounted() { this.load(); },
  methods: {
    async load() {
      try {
        const res = await fetch('/api/purchase-orders', { headers: { Authorization: 'Bearer ' + this.dash.token } });
        if (res.status === 401) { this.dash.sessionExpired && this.dash.sessionExpired(); return; }
        const d = await res.json();
        this.rows = d.purchase_orders || d.rows || d || [];
        if (Array.isArray(d)) this.rows = d;
        this.selRow = null;
      } catch (e) { this.rows = []; }
    },
    itemsOf(r) {
      if (r._items) return r._items;
      let arr = [];
      try { arr = typeof r.items_json === 'string' ? JSON.parse(r.items_json || '[]') : (r.items_json || []); } catch (e) { arr = []; }
      r._items = Array.isArray(arr) ? arr : [];
      return r._items;
    },
    rowQty(r) { return this.itemsOf(r).reduce((s, it) => s + (Number(it.qty) || 0), 0); },
    typeLabel(t) { return ({ finished: 'ผ้าสำเร็จ', raw: 'ผ้าดิบ', dye: 'สั่งย้อม' })[t] || (t || '-'); },
    statusLabel(r) { return r.approved ? 'Approved' : 'Pending'; },
    statusClass(r) { return r.approved ? 'ok' : 'pending'; },
    fmt(v) { return (Number(v) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
    fmtDate(d) { if (!d) return ''; return String(d).slice(0, 10); },
    toggleSort(k) { if (this.sort.key === k) this.sort.dir = this.sort.dir === 'asc' ? 'desc' : 'asc'; else { this.sort.key = k; this.sort.dir = 'asc'; } },
    sortIcon(k) { return this.sort.key === k ? (this.sort.dir === 'asc' ? '▲' : '▼') : '↕'; },
    reset() { this.filter = { date: '', vendor: '', type: '', shipTo: '', q: '', sku: '', status: '' }; this.load(); },
    async printPo(r) {
      const esc = (s) => (s == null ? '' : String(s)).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
      const items = this.itemsOf(r);
      const rows = items.map((it, i) => `<tr><td>${i + 1}</td><td>${esc(it.name || it.sku || '')}</td><td>${esc(it.color || '')}</td><td>${it.qty || ''}</td><td>${esc(it.width || '')}</td><td>${esc(it.unit || 'หลา')}</td></tr>`).join('')
        + Array.from({ length: Math.max(0, 10 - items.length) }).map(() => '<tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td></tr>').join('');
      const html = `
        <style>
          .doc{font-family:'Times New Roman','Noto Sans Thai',serif;color:#000}
          .center{text-align:center}.h1{font-size:20px;font-weight:bold}.h2{font-size:14px;font-weight:bold}.addr{font-size:12px;margin-top:2px}
          .meta{display:flex;justify-content:space-between;font-size:12px;margin:14px 0}.meta b{font-weight:bold}
          .doc table{width:100%;border-collapse:collapse;margin-top:6px}
          .doc th,.doc td{border:1px solid #000;padding:5px 6px;font-size:12px;text-align:center;height:22px}
          .doc th{font-weight:bold}
          .note{border:1px solid #000;border-top:none;padding:6px;font-size:12px;min-height:40px}
          .foot{display:flex;justify-content:space-between;align-items:flex-end;margin-top:40px;font-size:12px}
        </style>
        <div class="doc">
        ${docBrandHeader('Purchase Order — ' + this.typeLabel(r.po_type))}
        <div class="meta">
          <div><b>Attention :</b> ${esc(r.vendor || '')}<br><b>From :</b> ${COMPANY_NAME_EN}<br><b>Place of delivery :</b> ${esc(r.ship_to || '')}</div>
          <div><b>Order Date :</b> ${esc(this.fmtDate(r.po_date))}<br><b>Order No :</b> ${esc(r.po_no || '')}${r.ref_no ? '<br><b>Ref No :</b> ' + esc(r.ref_no) : ''}</div>
        </div>
        <table>
          <thead><tr><th style="width:36px">No.</th><th>Design / Name</th><th>Color</th><th>Quantity</th><th>Width</th><th>Unit</th></tr></thead>
          <tbody>${rows}
            <tr><td colspan="3"><b>Total</b></td><td>${this.fmt(this.rowQty(r))}</td><td colspan="2"><b>Yards</b></td></tr>
          </tbody>
        </table>
        <div class="note"><b>Important Note :</b> ${esc(r.remark || '')}</div>
        <div class="foot"><div><b>Approve By :</b></div><div><b>${COMPANY_NAME_EN}</b></div></div>
        </div>`;
      try { await buildDocPdf(html, { filename: 'PO-' + (r.po_no || '') + '.pdf' }); }
      catch (e) { this.dash.fbFail ? this.dash.fbFail('สร้าง PDF ไม่สำเร็จ') : alert('สร้าง PDF ไม่สำเร็จ'); }
    },
    exportExcel() {
      const head = ['เลขที่สั่งซื้อ', 'วันที่', 'ประเภท', 'คู่ค้า', 'เลขที่อ้างอิง', 'วันที่จัดส่ง', 'จำนวนรวม', 'ยอดรวม', 'สถานที่จัดส่ง', 'สถานะ'];
      const lines = [head.join('\t')];
      this.filtered.forEach(r => lines.push([r.po_no, this.fmtDate(r.po_date), this.typeLabel(r.po_type), r.vendor, r.ref_no, this.fmtDate(r.ship_date), this.rowQty(r), r.net_total, r.ship_to, this.statusLabel(r)].join('\t')));
      const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'รายงานใบสั่งซื้อ.csv'; a.click();
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
.rp-table { width: 100%; border-collapse: collapse; font-size: 12px; min-width: 1200px; }
.rp-table thead th { position: sticky; top: 0; z-index: 3; background: #3c4453; color: #fff; font-size: 11px; font-weight: 600; letter-spacing: .3px; padding: 7px 12px; text-align: left; white-space: nowrap; border-right: 1px solid rgba(255,255,255,.18); }
.rp-table thead th:last-child { border-right: none; }
.rp-table th.rp-r { text-align: right; }
.rp-table tbody td { padding: 3px 12px; font-size: 12px; line-height: 1.6; border-bottom: 1px solid var(--table-line); border-right: 1px solid var(--table-line); white-space: nowrap; }
.rp-table tbody td:last-child { border-right: none; }
.rp-table tbody tr { cursor: pointer; }
.rp-table tbody tr:hover { background: var(--field); }
.rp-table tbody tr.is-sel { background: #fff8d6; }
.rp-r { text-align: right; } .rp-c { text-align: center; color: var(--muted); }
.rp-bold { font-weight: 700; } .rp-muted { color: var(--muted); } .rp-mono { font-family: 'Courier New', monospace; }
.rp-empty { text-align: center; color: var(--muted); padding: 26px; }
.rp-table tfoot td { position: sticky; bottom: 0; z-index: 2; padding: 9px 10px; border-top: 2px solid var(--table-line); background: var(--field); font-weight: 700; }
.rp-sortable { cursor: pointer; user-select: none; }
.rp-sortable:hover { background: #4a5262; }
.rp-sort { opacity: .45; font-size: 10px; margin-left: 3px; }
.rp-sort.on { opacity: 1; }
.rp-ic { width: 26px; height: 26px; border-radius: 6px; border: 1px solid var(--field-border); background: var(--field); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; padding: 0; vertical-align: middle; margin-right: 3px; transition: background .15s, border-color .15s; }
.rp-ic svg { width: 14px; height: 14px; }
.rp-print { color: #111; }
.rp-print:hover { background: var(--field); border-color: #111; }
.rp-badge { display: inline-block; padding: 2px 9px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.rp-badge.ok { background: #dcf1e8; color: #158045; }
.rp-badge.pending { background: #fde7cf; color: #b8791a; }
</style>
