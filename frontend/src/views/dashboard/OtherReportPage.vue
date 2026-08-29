<template>
<div class="rp-page">
  <div class="rp-titlebar">
    <span>{{ cfg.icon }} {{ cfg.title }}</span>
    <button class="rp-export-excel" @click="exportExcel">
      <span class="rp-xls-badge"><svg class="xls-ico" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#217346"/><path d="M14 2v6h6" fill="#185c37"/><path d="M9.5 12.5l5 5M14.5 12.5l-5 5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg></span>ส่งออก Excel
    </button>
  </div>

  <div class="rp-filter">
    <div v-if="cfg.filters.includes('date')" class="rp-f"><label>วันที่</label><input type="date" v-model="filter.date" @change="load" /></div>
    <div v-if="cfg.filters.includes('customer')" class="rp-f"><label>ลูกค้า</label><input v-model="filter.customer" placeholder="ลูกค้า" @keyup.enter="load" /></div>
    <div v-if="cfg.filters.includes('width')" class="rp-f"><label>หน้ากว้าง</label><input v-model="filter.width" placeholder="หน้ากว้าง" @keyup.enter="load" /></div>
    <div v-if="cfg.filters.includes('q')" class="rp-f"><label>คำค้นหา</label><input v-model="filter.q" placeholder="คำค้นหา" @keyup.enter="load" /></div>
    <div v-if="cfg.filters.includes('sku')" class="rp-f"><label>รหัสสินค้า</label><input v-model="filter.sku" placeholder="รหัสสินค้า" @keyup.enter="load" /></div>
    <div v-if="cfg.filters.includes('barcode')" class="rp-f"><label>บาร์โค้ด</label><input v-model="filter.barcode" placeholder="บาร์โค้ด" @keyup.enter="load" /></div>
    <div v-if="cfg.filters.includes('color')" class="rp-f"><label>รหัสสี</label><input v-model="filter.color" placeholder="รหัสสี" @keyup.enter="load" /></div>
    <div class="rp-f-actions">
      <button class="rp-btn-search" @click="load">🔍 ค้นหา</button>
      <button class="rp-btn-reset" @click="reset">↺ รีเซ็ต</button>
    </div>
  </div>

  <div class="rp-found">พบ {{ rows.length.toLocaleString() }} รายการ</div>

  <div class="rp-table-wrap rp-groups">
    <table class="rp-table" :style="{ minWidth: Math.max(700, columns.length * 110) + 'px' }">
      <thead>
        <tr>
          <th style="width:42px;">ที่</th>
          <th v-for="(c, i) in columns" :key="i" :class="{ 'rp-r': isNumCol(c) }">{{ c }}</th>
          <th style="width:56px;"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading"><td :colspan="columns.length + 2" class="rp-empty">กำลังโหลด…</td></tr>
        <tr v-else-if="!rows.length"><td :colspan="columns.length + 2" class="rp-empty">{{ emptyMsg }}</td></tr>
        <tr v-for="(row, idx) in rows" :key="idx" :class="{ 'is-sel': selIdx === idx }" @click="selIdx = idx">
          <td class="rp-c">{{ idx + 1 }}</td>
          <td v-for="(cell, ci) in row" :key="ci" :class="{ 'rp-r': isNumCol(columns[ci]), 'rp-mono': isCodeCol(columns[ci]) }">{{ cell === '' || cell == null ? '-' : cell }}</td>
          <td>
            <button class="rp-ic" title="ดูรายละเอียด" @click.stop="openDetail(row)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01" stroke-linecap="round"/></svg></button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- โมดัลรายละเอียดแถว -->
  <div v-if="detail" class="rp-modal-mask" @click.self="detail = null">
    <div class="rp-modal">
      <div class="rp-modal-head"><span>{{ cfg.icon }} รายละเอียด</span><button class="rp-modal-x" @click="detail = null">✕</button></div>
      <div class="rp-modal-body">
        <div v-for="(c, i) in columns" :key="i" class="rp-modal-row"><span class="rp-modal-k">{{ c }}</span><span class="rp-modal-v">{{ detail[i] === '' || detail[i] == null ? '-' : detail[i] }}</span></div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
const CONFIGS = {
  price:   { title: 'รายงานการแก้ไขราคาขาย',   icon: '🏷️', filters: ['date', 'customer', 'width', 'q', 'sku', 'color'], empty: '— ยังไม่มีประวัติการแก้ไขราคาขาย —' },
  adjust:  { title: 'รายงานการปรับสต๊อกสินค้า', icon: '📦', filters: ['date', 'barcode', 'sku', 'color'], empty: '— ยังไม่มีรายการปรับสต๊อกสินค้า —' },
  fold:    { title: 'รายงานการแบ่งพับสินค้า',   icon: '✂️', filters: ['date', 'barcode', 'sku', 'color'], empty: '— ยังไม่มีรายการแบ่งพับสินค้า —' },
  barcode: { title: 'รายงานประวัติบาร์โค้ด',    icon: '🔖', filters: ['barcode'], empty: '— ไม่มีประวัติบาร์โค้ด (พิมพ์บาร์โค้ดเพื่อค้นหา) —' },
};

export default {
  name: 'OtherReportPage',
  inject: ['dash'],
  props: { reportType: { type: String, required: true } },
  data() {
    return { columns: [], rows: [], loading: false, selIdx: -1, detail: null,
      filter: { date: '', customer: '', width: '', q: '', sku: '', barcode: '', color: '' } };
  },
  computed: {
    cfg() { return CONFIGS[this.reportType] || { title: 'รายงาน', icon: '📄', filters: [], empty: '— ไม่มีข้อมูล —' }; },
    emptyMsg() { return this.cfg.empty; },
  },
  watch: { reportType() { this.reset(); } },
  mounted() { this.load(); },
  methods: {
    async load() {
      this.loading = true; this.selIdx = -1;
      try {
        const p = new URLSearchParams();
        this.cfg.filters.forEach(k => { if (this.filter[k]) p.set(k, this.filter[k]); });
        const res = await fetch('/api/reports/other/' + this.reportType + '?' + p.toString(), { headers: { Authorization: 'Bearer ' + this.dash.token } });
        if (res.status === 401) { this.dash.sessionExpired && this.dash.sessionExpired(); return; }
        const d = await res.json();
        this.columns = d.columns || []; this.rows = d.rows || [];
      } catch (e) { this.columns = []; this.rows = []; }
      finally { this.loading = false; }
    },
    reset() { this.filter = { date: '', customer: '', width: '', q: '', sku: '', barcode: '', color: '' }; this.detail = null; this.load(); },
    isNumCol(c) { return /จำนวน|ราคา|คงเหลือ|มูลค่า|ยอด/.test(c || ''); },
    isCodeCol(c) { return /บาร์โค้ด|เลขที่|รหัสสินค้า/.test(c || ''); },
    openDetail(row) { this.detail = row; },
    exportExcel() {
      const lines = [this.columns.join('\t')];
      this.rows.forEach(r => lines.push(r.map(c => (c == null ? '' : String(c))).join('\t')));
      const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = this.cfg.title + '.csv'; a.click();
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
.rp-f input { height: 34px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12px; font-family: inherit; background: var(--field); color: var(--text); }
.rp-f input:focus { outline: none; border-color: #2F65F6; background: var(--surface); }
.rp-f-actions { display: flex; gap: 8px; }
.rp-btn-search { padding: 8px 16px; border: 1px solid #1e3a8a; background: #1e3a8a; color: #fff; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; }
.rp-btn-search:hover { background: #172b6b; }
.rp-btn-reset { padding: 8px 16px; border: 1px solid #a82a3a; background: #a82a3a; color: #fff; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; }
.rp-btn-reset:hover { background: #8a1c2b; }
.rp-found { font-size: 12px; color: #2F65F6; font-weight: 600; margin-bottom: 6px; }
.rp-table-wrap { overflow-x: auto; border: 1px solid var(--table-line); border-radius: 10px; margin-bottom: 16px; background: var(--surface); }
.rp-groups { max-height: 560px; overflow-y: auto; }
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
.rp-mono { font-family: 'Courier New', monospace; }
.rp-empty { text-align: center; color: var(--muted); padding: 26px; }
.rp-ic { width: 26px; height: 26px; border-radius: 6px; border: 1px solid var(--field-border); background: var(--field); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; padding: 0; vertical-align: middle; }
.rp-ic svg { width: 14px; height: 14px; }
.rp-modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.rp-modal { background: var(--surface); border-radius: 14px; width: 420px; max-width: 92vw; max-height: 80vh; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 12px 40px rgba(0,0,0,.28); }
.rp-modal-head { display: flex; align-items: center; justify-content: space-between; padding: 13px 16px; background: #3c4453; color: #fff; font-weight: 700; font-size: 13px; }
.rp-modal-x { background: transparent; border: none; color: #fff; font-size: 15px; cursor: pointer; }
.rp-modal-body { padding: 8px 16px 16px; overflow-y: auto; }
.rp-modal-row { display: flex; justify-content: space-between; gap: 12px; padding: 8px 0; border-bottom: 1px solid var(--table-line); }
.rp-modal-row:last-child { border-bottom: none; }
.rp-modal-k { color: var(--muted); font-weight: 600; }
.rp-modal-v { color: var(--text); text-align: right; }
</style>
