<template>
<div class="rp-page">
  <div class="rp-titlebar">
    <span>🗄️ รายงานสินค้าคงคลังตามชั้น</span>
    <button class="rp-export-excel" @click="exportExcel">
      <span class="rp-xls-badge"><svg class="xls-ico" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#217346"/><path d="M14 2v6h6" fill="#185c37"/><path d="M9.5 12.5l5 5M14.5 12.5l-5 5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg></span>ส่งออก Excel
    </button>
  </div>

  <!-- ตัวกรอง -->
  <div class="rp-filter">
    <div class="rp-f"><label>คำค้นหา</label><input v-model="filter.q" placeholder="ชื่อ/รหัส/สี/บาร์โค้ด" @keyup.enter="load" /></div>
    <div class="rp-f"><label>รหัสสินค้า</label><input v-model="filter.sku" @keyup.enter="load" /></div>
    <div class="rp-f"><label>รหัสสี / เฉดสี</label><input v-model="filter.color" @keyup.enter="load" /></div>
    <div class="rp-f"><label>บาร์โค้ด</label><input v-model="filter.barcode" @keyup.enter="load" /></div>
    <div class="rp-f"><label>กลุ่มผ้า</label>
      <select v-model="filter.group" @change="load">
        <option value="">ทั้งหมด</option>
        <option v-for="g in groupOptions" :key="g.id" :value="g.id">{{ g.name }}</option>
      </select>
    </div>
    <div class="rp-f"><label>หน้ากว้าง</label><input v-model="filter.width" @keyup.enter="load" /></div>
    <div class="rp-f"><label>คลัง</label><input v-model="filter.warehouse" @keyup.enter="load" /></div>
    <div class="rp-f"><label>แร็คซ์</label><input v-model="filter.rack" @keyup.enter="load" /></div>
    <div class="rp-f-actions">
      <button class="rp-btn-search" @click="load">🔍 ค้นหา</button>
      <button class="rp-btn-reset" @click="reset">↺ รีเซ็ต</button>
    </div>
  </div>

  <div class="rp-found">พบ {{ items.length.toLocaleString() }} รายการ</div>

  <!-- ตาราง (เลื่อนได้ + คลิกหัวคอลัมน์เพื่อเรียงลำดับ) -->
  <div class="rp-table-wrap rp-groups">
    <table class="rp-table">
      <thead>
        <tr>
          <th style="width:40px;">ที่</th>
          <th class="rp-sortable" @click="toggleSort('roll_qr_code')">บาร์โค้ด <span class="rp-sort" :class="{ on: sort.key === 'roll_qr_code' }">{{ sortIcon('roll_qr_code') }}</span></th>
          <th class="rp-sortable" @click="toggleSort('sku')">รหัสสินค้า <span class="rp-sort" :class="{ on: sort.key === 'sku' }">{{ sortIcon('sku') }}</span></th>
          <th class="rp-sortable" @click="toggleSort('color')">รหัสสี <span class="rp-sort" :class="{ on: sort.key === 'color' }">{{ sortIcon('color') }}</span></th>
          <th class="rp-sortable" @click="toggleSort('shade')">เฉดสี <span class="rp-sort" :class="{ on: sort.key === 'shade' }">{{ sortIcon('shade') }}</span></th>
          <th class="rp-sortable" @click="toggleSort('type')">ประเภท <span class="rp-sort" :class="{ on: sort.key === 'type' }">{{ sortIcon('type') }}</span></th>
          <th class="rp-sortable" @click="toggleSort('width')">หน้ากว้าง <span class="rp-sort" :class="{ on: sort.key === 'width' }">{{ sortIcon('width') }}</span></th>
          <th class="rp-r rp-sortable" @click="toggleSort('current_yards')">จำนวน (หลา) <span class="rp-sort" :class="{ on: sort.key === 'current_yards' }">{{ sortIcon('current_yards') }}</span></th>
          <th class="rp-sortable" @click="toggleSort('location_code')">คลัง <span class="rp-sort" :class="{ on: sort.key === 'location_code' }">{{ sortIcon('location_code') }}</span></th>
          <th class="rp-sortable" @click="toggleSort('rack')">แร็คซ์ <span class="rp-sort" :class="{ on: sort.key === 'rack' }">{{ sortIcon('rack') }}</span></th>
          <th class="rp-sortable" @click="toggleSort('lot_no')">เลขที่ล็อต <span class="rp-sort" :class="{ on: sort.key === 'lot_no' }">{{ sortIcon('lot_no') }}</span></th>
          <th>หมายเหตุ</th>
          <th style="width:90px;">
            <span class="rp-th-manage">จัดการ
              <button class="rp-ic rp-print rp-th-print" :title="selectedRolls.length ? 'พิมพ์ที่เลือก (' + selectedRolls.length + ')' : 'พิมพ์ทั้งหมด'" @click="printSelected">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              </button>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in sortedItems" :key="row.roll_id">
          <td class="rp-c">{{ idx + 1 }}</td>
          <td class="rp-mono">
            <span class="rp-bc">{{ row.roll_qr_code }}</span>
            <button class="rp-ic rp-copy" title="คัดลอกบาร์โค้ด" @click="copyBarcode(row.roll_qr_code)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
          </td>
          <td>{{ row.sku || '-' }}</td>
          <td>{{ row.color_code || shadeCode(row.shade) || '-' }}</td>
          <td class="rp-c">{{ shadeName(row.shade) || row.shade || '-' }}</td>
          <td>{{ row.type || '-' }}</td>
          <td>{{ row.width || '-' }}</td>
          <td class="rp-r rp-bold">{{ fmt(row.current_yards) }}</td>
          <td>{{ row.location_code || '-' }}</td>
          <td class="rp-c">{{ row.rack || '-' }}</td>
          <td>{{ row.lot_no || '-' }}</td>
          <td>{{ row.note || '-' }}</td>
          <td class="rp-c rp-actions-cell">
            <button class="fr-img-btn" title="ดูรูปสินค้า" @click.stop>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
            </button>
            <input type="checkbox" class="rp-chk" title="เลือกม้วนนี้" :checked="selectedRolls.includes(row.roll_id)" @change="toggleRoll(row.roll_id)" />
            <button class="rp-ic rp-print" title="พิมพ์ QR ม้วน" @click="printRoll(row)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            </button>
          </td>
        </tr>
        <tr v-if="items.length === 0"><td colspan="13" class="rp-empty">ไม่พบข้อมูล</td></tr>
      </tbody>
      <tfoot v-if="items.length">
        <tr>
          <td colspan="7" class="rp-r rp-bold">รวม</td>
          <td class="rp-r rp-bold">{{ fmt(summary.yards) }}</td>
          <td colspan="5"></td>
        </tr>
      </tfoot>
    </table>
  </div>
</div>
</template>

<script>
import QRCode from 'qrcode';
export default {
  name: 'ShelfStockReportPage',
  inject: ['dash'],
  data() {
    return {
      filter: { q: '', sku: '', color: '', barcode: '', group: '', width: '', warehouse: '', rack: '' },
      groupOptions: [],
      items: [], summary: { yards: 0, rolls: 0 },
      sort: { key: '', dir: 'asc' },
      selectedRolls: [],
    };
  },
  computed: {
    sortedItems() {
      if (!this.sort.key) return this.items;
      const k = this.sort.key, dir = this.sort.dir === 'asc' ? 1 : -1;
      const val = (r) => {
        switch (k) {
          case 'color': return (r.color_code || this.shadeCode(r.shade) || '').toString().toLowerCase();
          case 'shade': return (this.shadeName(r.shade) || r.shade || '').toString().toLowerCase();
          case 'current_yards': return Number(r.current_yards) || 0;
          default: return (r[k] || '').toString().toLowerCase();
        }
      };
      return [...this.items].sort((a, b) => { const av = val(a), bv = val(b); if (av < bv) return -1 * dir; if (av > bv) return 1 * dir; return 0; });
    },
  },
  mounted() { this.loadGroups(); this.load(); },
  methods: {
    authHeaders() { return { Authorization: 'Bearer ' + this.dash.token }; },
    fmt(v) { return (Number(v) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
    shadeCode(s) { if (!s) return ''; const p = String(s).split(/\s*-\s*/); return p[0] || ''; },
    shadeName(s) { if (!s) return ''; const p = String(s).split(/\s*-\s*/); return p.length > 1 ? p.slice(1).join(' - ') : ''; },
    async loadGroups() {
      try {
        const res = await fetch('/api/fabric-regular-group', { headers: this.authHeaders() });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) this.groupOptions = d.items || [];
      } catch (e) { /* ปล่อยว่าง */ }
    },
    async load() {
      const qs = new URLSearchParams(Object.entries(this.filter).filter(([, v]) => v)).toString();
      try {
        const res = await fetch('/api/reports/stock-by-shelf' + (qs ? '?' + qs : ''), { headers: this.authHeaders() });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) {
          this.items = d.items || [];
          this.summary = { yards: 0, rolls: 0, ...(d.summary || {}) };
          this.selectedRolls = [];
        }
      } catch (e) { this.dash.fbFail('โหลดรายงานไม่สำเร็จ'); }
    },
    reset() { this.filter = { q: '', sku: '', color: '', barcode: '', group: '', width: '', warehouse: '', rack: '' }; this.load(); },
    toggleSort(key) {
      if (this.sort.key === key) this.sort.dir = this.sort.dir === 'asc' ? 'desc' : 'asc';
      else { this.sort.key = key; this.sort.dir = 'asc'; }
    },
    sortIcon(key) { if (this.sort.key !== key) return '↕'; return this.sort.dir === 'asc' ? '▲' : '▼'; },
    toggleRoll(id) { const i = this.selectedRolls.indexOf(id); if (i === -1) this.selectedRolls.push(id); else this.selectedRolls.splice(i, 1); },
    async copyBarcode(code) {
      try { await navigator.clipboard.writeText(code); this.dash.ui.toast('คัดลอกบาร์โค้ดแล้ว: ' + code, 'success', { title: 'คัดลอก' }); }
      catch (e) { this.dash.ui.toast('คัดลอกไม่สำเร็จ', 'error', { title: 'การแจ้งเตือน' }); }
    },
    labelHtml(row, qrImg, esc) {
      return `<div class="lbl">
        <div class="nm">${esc(row.sku || '')}</div>
        <div class="sub">${esc(this.shadeName(row.shade) || row.type || '')}${row.width ? ' · ' + esc(row.width) : ''}</div>
        ${qrImg ? `<img src="${qrImg}"/>` : ''}
        <div class="bc">${esc(row.roll_qr_code)}</div>
        <div class="yd">คงเหลือ ${this.fmt(row.current_yards)} หลา${row.rack ? ' · แร็ค ' + esc(row.rack) : ''}${row.lot_no ? ' · ล็อต ' + esc(row.lot_no) : ''}</div>
      </div>`;
    },
    async openPrintWindow(cards, titleText) {
      const win = window.open('', '_blank', 'width=820,height=640');
      if (!win) { this.dash.ui.toast('เบราว์เซอร์บล็อก popup — กรุณาอนุญาต', 'error', { title: 'การแจ้งเตือน' }); return; }
      win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${titleText}</title>
        <style>*{box-sizing:border-box}body{font-family:'Segoe UI',Tahoma,'Noto Sans Thai',sans-serif;margin:0;padding:16px;color:#111}
        .sheet{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;justify-items:center}
        .lbl{border:1px solid #111;border-radius:8px;padding:12px;text-align:center;page-break-inside:avoid;max-width:280px}
        .nm{font-size:14px;font-weight:700}.sub{font-size:11px;color:#333;margin-bottom:6px}
        img{width:150px;height:150px}.bc{font-family:'Courier New',monospace;font-size:12px;font-weight:700;margin-top:4px}
        .yd{font-size:11px;margin-top:3px}@media print{.no-print{display:none}}</style></head><body>
        <div class="no-print" style="text-align:center;margin-bottom:12px"><button onclick="window.print()" style="padding:8px 20px;font-size:12px;cursor:pointer">🖨️ ${titleText}</button></div>
        <div class="sheet">${cards.join('')}</div>
        </body></html>`);
      win.document.close();
    },
    async printRoll(row) {
      const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
      let qrImg = '';
      try { qrImg = await QRCode.toDataURL(row.roll_qr_code || '', { width: 200, margin: 1 }); } catch (e) {}
      await this.openPrintWindow([this.labelHtml(row, qrImg, esc)], 'พิมพ์ QR ' + esc(row.roll_qr_code));
    },
    async printSelected() {
      const list = this.selectedRolls.length ? this.items.filter(r => this.selectedRolls.includes(r.roll_id)) : this.sortedItems;
      if (!list.length) { this.dash.ui.toast('ไม่มีม้วนให้พิมพ์', 'error', { title: 'การแจ้งเตือน' }); return; }
      if (list.length > 200 && !confirm(`จะพิมพ์ ${list.length} ป้าย ต้องการดำเนินการต่อหรือไม่?`)) return;
      const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
      const cards = [];
      for (const r of list) {
        let qrImg = '';
        try { qrImg = await QRCode.toDataURL(r.roll_qr_code || '', { width: 160, margin: 1 }); } catch (e) {}
        cards.push(this.labelHtml(r, qrImg, esc));
      }
      await this.openPrintWindow(cards, `พิมพ์ QR (${list.length} ป้าย)`);
    },
    async exportExcel() {
      const head = ['บาร์โค้ด', 'รหัสสินค้า', 'รหัสสี', 'เฉดสี', 'ประเภท', 'หน้ากว้าง', 'จำนวน(หลา)', 'คลัง', 'แร็คซ์', 'เลขที่ล็อต', 'หมายเหตุ'];
      const body = this.sortedItems.map(r => [r.roll_qr_code, r.sku, r.color_code || this.shadeCode(r.shade), this.shadeName(r.shade) || r.shade, r.type, r.width, Number(r.current_yards) || 0, r.location_code, r.rack, r.lot_no, r.note]);
      const XLSX = await import('xlsx');
      const sheet = XLSX.utils.aoa_to_sheet([head, ...body]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, sheet, 'คงคลังตามชั้น');
      XLSX.writeFile(wb, `รายงานสินค้าคงคลังตามชั้น-${new Date().toISOString().slice(0, 10)}.xlsx`);
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
.rp-groups { max-height: 560px; overflow-y: auto; }
.rp-table { width: 100%; border-collapse: collapse; font-size: 12px; min-width: 1100px; }
.rp-table thead th { position: sticky; top: 0; z-index: 3; background: #3c4453; color: #fff; font-size: 11px; font-weight: 600; letter-spacing: .3px; padding: 7px 12px; text-align: left; white-space: nowrap; border-right: 1px solid rgba(255,255,255,.18); }
.rp-table thead th:last-child { border-right: none; }
.rp-table th.rp-r { text-align: right; }
.rp-table tbody td { padding: 3px 12px; font-size: 12px; line-height: 1.6; border-bottom: 1px solid var(--table-line); border-right: 1px solid var(--table-line); white-space: nowrap; }
.rp-table tbody td:last-child { border-right: none; }
.rp-table tbody tr:hover { background: var(--field); }
.rp-r { text-align: right; } .rp-c { text-align: center; color: var(--muted); }
.rp-bold { font-weight: 700; } .rp-mono { font-family: 'Courier New', monospace; }
.rp-empty { text-align: center; color: var(--muted); padding: 26px; }
.rp-table tfoot td { position: sticky; bottom: 0; z-index: 2; padding: 9px 10px; border-top: 2px solid var(--table-line); background: var(--field); font-weight: 700; }
.rp-bc { vertical-align: middle; }
.rp-sortable { cursor: pointer; user-select: none; }
.rp-sortable:hover { background: #4a5262; }
.rp-sort { opacity: .45; font-size: 10px; margin-left: 3px; }
.rp-sort.on { opacity: 1; }
.rp-ic { width: 26px; height: 26px; border-radius: 6px; border: 1px solid var(--field-border); background: var(--field); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; padding: 0; vertical-align: middle; transition: background .15s, border-color .15s; }
.rp-ic svg { width: 14px; height: 14px; }
.rp-copy { color: var(--muted); margin-left: 6px; }
.rp-copy:hover { background: var(--field); border-color: var(--muted); color: var(--text); }
.rp-print { color: #111; }
.rp-print:hover { background: var(--field); border-color: #111; }
.rp-actions-cell { display: flex; align-items: center; justify-content: center; gap: 6px; white-space: nowrap; }
.rp-chk { width: 15px; height: 15px; cursor: pointer; accent-color: #2F65F6; vertical-align: middle; }
.rp-th-manage { display: inline-flex; align-items: center; gap: 7px; }
.rp-th-print { width: 24px; height: 24px; background: transparent; border-color: rgba(255,255,255,.4); color: #fff; }
.rp-th-print:hover { background: rgba(255,255,255,.15); border-color: #fff; }
.rp-th-manage .rp-chk { accent-color: #fff; }
</style>
