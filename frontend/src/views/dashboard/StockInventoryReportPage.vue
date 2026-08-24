<template>
<div class="rp-page">
  <div class="rp-titlebar">
    <span>📦 รายงานสินค้าคงคลัง</span>
    <div class="rp-export-wrap">
      <div class="rp-export-catch" v-if="exportMenuOpen" @click="exportMenuOpen = false"></div>
      <button class="rp-export" @click="exportMenuOpen = !exportMenuOpen">⬇ ส่งออก <span class="rp-caret">▾</span></button>
      <div class="rp-export-menu" v-if="exportMenuOpen">
        <button @click="exportExcel"><svg class="xls-ico" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#217346"/><path d="M14 2v6h6" fill="#185c37"/><path d="M9.5 12.5l5 5M14.5 12.5l-5 5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>Excel (.xlsx)</button>
        <button @click="exportCsv">📄 CSV (.csv)</button>
      </div>
    </div>
  </div>

  <!-- ตัวกรอง (แถวเดียว) -->
  <div class="rp-filter">
    <div class="rp-f"><label>คำค้นหา</label><input v-model="filter.q" placeholder="ชื่อ/รหัส/สี" @keyup.enter="load" /></div>
    <div class="rp-f"><label>รหัสสินค้า</label><input v-model="filter.sku" @keyup.enter="load" /></div>
    <div class="rp-f"><label>รหัสสี / เฉดสี</label><input v-model="filter.color" @keyup.enter="load" /></div>
    <div class="rp-f"><label>กลุ่มผ้า</label>
      <select v-model="filter.group" @change="load">
        <option value="">ทั้งหมด</option>
        <option v-for="g in groupOptions" :key="g.id" :value="g.id">{{ g.name }}</option>
      </select>
    </div>
    <div class="rp-f"><label>หน้ากว้าง</label><input v-model="filter.width" @keyup.enter="load" /></div>
    <div class="rp-f"><label>คลัง</label><input v-model="filter.warehouse" @keyup.enter="load" /></div>
    <div class="rp-f-actions">
      <button class="rp-btn-search" @click="load">🔍 ค้นหา</button>
      <button class="rp-btn-reset" @click="reset">↺ รีเซ็ต</button>
    </div>
  </div>

  <div class="rp-found">พบ {{ items.length.toLocaleString() }} รายการ</div>

  <!-- ตารางกลุ่ม (เลื่อนได้ + คลิกหัวคอลัมน์เพื่อเรียงลำดับ) -->
  <div class="rp-table-wrap rp-groups">
    <table class="rp-table">
      <thead>
        <tr>
          <th style="width:40px;">ที่</th>
          <th class="rp-sortable" @click="toggleSort('sku')">รหัสสินค้า <span class="rp-sort" :class="{ on: sort.key === 'sku' }">{{ sortIcon('sku') }}</span></th>
          <th class="rp-sortable" @click="toggleSort('color')">รหัสสี <span class="rp-sort" :class="{ on: sort.key === 'color' }">{{ sortIcon('color') }}</span></th>
          <th class="rp-sortable" @click="toggleSort('shade')">เฉดสี <span class="rp-sort" :class="{ on: sort.key === 'shade' }">{{ sortIcon('shade') }}</span></th>
          <th class="rp-sortable" @click="toggleSort('type')">ประเภท <span class="rp-sort" :class="{ on: sort.key === 'type' }">{{ sortIcon('type') }}</span></th>
          <th class="rp-sortable" @click="toggleSort('width')">หน้ากว้าง <span class="rp-sort" :class="{ on: sort.key === 'width' }">{{ sortIcon('width') }}</span></th>
          <th class="rp-r rp-sortable" @click="toggleSort('folds')">พับรวม <span class="rp-sort" :class="{ on: sort.key === 'folds' }">{{ sortIcon('folds') }}</span></th>
          <th class="rp-r rp-sortable" @click="toggleSort('total_yards')">จำนวนรวม (หลา) <span class="rp-sort" :class="{ on: sort.key === 'total_yards' }">{{ sortIcon('total_yards') }}</span></th>
          <th class="rp-r rp-sortable" @click="toggleSort('wip_production')">ระหว่างผลิต <span class="rp-sort" :class="{ on: sort.key === 'wip_production' }">{{ sortIcon('wip_production') }}</span></th>
          <th class="rp-r rp-sortable" @click="toggleSort('wip_factory')">ที่โรงงาน <span class="rp-sort" :class="{ on: sort.key === 'wip_factory' }">{{ sortIcon('wip_factory') }}</span></th>
          <th class="rp-r rp-sortable" @click="toggleSort('wip_weaving')">ระหว่างทอ <span class="rp-sort" :class="{ on: sort.key === 'wip_weaving' }">{{ sortIcon('wip_weaving') }}</span></th>
          <th style="width:44px;"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in sortedItems" :key="idx" :class="{ 'is-sel': selRow === row }" @click="selectRow(idx, row)">
          <td class="rp-c">{{ idx + 1 }}</td>
          <td>{{ row.sku || '-' }}</td>
          <td>{{ row.color_code || shadeCode(row.shade) || '-' }}</td>
          <td class="rp-c">{{ shadeName(row.shade) || row.shade || '-' }}</td>
          <td>{{ row.type || '-' }}</td>
          <td>{{ row.width || '-' }}</td>
          <td class="rp-r">{{ Number(row.folds).toLocaleString() }}</td>
          <td class="rp-r rp-bold">{{ fmt(row.total_yards) }}</td>
          <td class="rp-r" :class="{ 'rp-muted': !Number(row.wip_production) }">{{ Number(row.wip_production) ? fmt(row.wip_production) : '-' }}</td>
          <td class="rp-r" :class="{ 'rp-muted': !Number(row.wip_factory) }">{{ Number(row.wip_factory) ? fmt(row.wip_factory) : '-' }}</td>
          <td class="rp-r" :class="{ 'rp-muted': !Number(row.wip_weaving) }">{{ Number(row.wip_weaving) ? fmt(row.wip_weaving) : '-' }}</td>
          <td class="rp-c">
            <button class="fr-img-btn" title="ดูรูปสินค้า" @click.stop>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
            </button>
          </td>
        </tr>
        <tr v-if="items.length === 0"><td colspan="12" class="rp-empty">ไม่พบข้อมูล</td></tr>
      </tbody>
      <tfoot v-if="items.length">
        <tr>
          <td colspan="6" class="rp-r rp-bold">รวม</td>
          <td class="rp-r rp-bold">{{ summary.folds.toLocaleString() }}</td>
          <td class="rp-r rp-bold">{{ fmt(summary.yards) }}</td>
          <td class="rp-r">{{ fmt(summary.production) }}</td>
          <td class="rp-r">{{ fmt(summary.factory) }}</td>
          <td class="rp-r">{{ fmt(summary.weaving) }}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  </div>

  <!-- ตารางม้วน (เมื่อเลือกแถว) -->
  <div class="rp-table-wrap rp-rolls">
    <table class="rp-table">
      <thead>
        <tr>
          <th style="width:40px;">ที่</th><th>บาร์โค้ด</th><th>เลขที่รับสินค้า</th><th>วันที่รับ</th>
          <th class="rp-r">จำนวนรับ (หลา)</th><th class="rp-r">จำนวนสต็อก (หลา)</th>
          <th>คลัง</th><th>แร็คซ์</th><th>เลขที่ล็อต</th><th>หมายเหตุ</th>
          <th style="width:190px;">
            <span class="rp-th-manage">จัดการ
              <input type="checkbox" class="rp-chk" title="เลือกทั้งหมด" :checked="allRollsChecked" @change="toggleAllRolls" :disabled="rolls.length === 0" />
              <select class="rp-copies rp-th-copies" title="จำนวนสำเนาที่จะพิมพ์ (ทุกม้วน)" v-model.number="globalCopies" @change="applyGlobalCopies">
                <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
              </select>
              <button class="rp-ic rp-print rp-th-print" :title="selectedRolls.length ? 'พิมพ์ที่เลือก (' + selectedRolls.length + ')' : 'พิมพ์ทั้งหมด'" @click="printAllRolls">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              </button>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r, i) in rolls" :key="r.roll_id">
          <td class="rp-c">{{ i + 1 }}</td>
          <td class="rp-mono">
            <span class="rp-bc">{{ r.roll_qr_code }}</span>
            <button class="rp-ic rp-copy" title="คัดลอกบาร์โค้ด" @click="copyBarcode(r.roll_qr_code)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
          </td>
          <td>{{ r.receipt_no || '-' }}</td>
          <td class="rp-c">{{ fmtDate(r.received_at) }}</td>
          <td class="rp-r">{{ fmt(r.initial_yards) }}</td>
          <td class="rp-r rp-bold">{{ fmt(r.current_yards) }}</td>
          <td>{{ r.location_code || '-' }}</td>
          <td class="rp-c">{{ r.rack || '-' }}</td>
          <td>{{ r.lot_no || '-' }}</td>
          <td>{{ r.note || '-' }}</td>
          <td class="rp-c rp-actions-cell">
            <button class="fr-action-btn edit" title="ปรับปรุงสต็อก" @click="openAdjust(r)"></button>
            <input type="checkbox" class="rp-chk" title="เลือกม้วนนี้" :checked="selectedRolls.includes(r.roll_id)" @change="toggleRoll(r.roll_id)" />
            <select class="rp-copies" title="จำนวนสำเนา" :value="copiesOf(r.roll_id)" @change="setCopies(r.roll_id, $event.target.value)">
              <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
            </select>
            <button class="rp-ic rp-print" :title="'พิมพ์ QR ม้วน' + (copiesOf(r.roll_id) > 1 ? ' (' + copiesOf(r.roll_id) + ' สำเนา)' : '')" @click="printRoll(r)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            </button>
          </td>
        </tr>
        <tr v-if="rolls.length === 0"><td colspan="11" class="rp-empty">{{ sel === null ? 'คลิกแถวด้านบนเพื่อดูม้วนผ้า' : 'ไม่มีม้วนผ้า' }}</td></tr>
      </tbody>
      <tfoot v-if="rolls.length">
        <tr><td colspan="4" class="rp-r rp-bold">รวม</td><td class="rp-r rp-bold">{{ fmt(rollsTotal) }}</td><td colspan="6"></td></tr>
      </tfoot>
    </table>
  </div>

  <!-- Drawer ปรับปรุงสต็อก -->
  <transition name="rp-slide">
    <div v-if="adjustOpen" class="rp-drawer-wrap">
      <div class="rp-backdrop" @click="adjustOpen = false"></div>
      <div class="rp-drawer">
        <div class="rp-drawer-head"><span>ปรับปรุงสต็อก</span><button class="rp-x" @click="adjustOpen = false">✕</button></div>
        <div class="rp-drawer-body" v-if="adjustRoll">
          <div class="rp-fld"><label>บาร์โค้ด</label><input :value="adjustRoll.roll_qr_code" readonly /></div>
          <div class="rp-fld"><label>คลัง</label><input :value="adjustRoll.location_code || '-'" readonly /></div>
          <div class="rp-fld"><label>เลขที่ล็อต</label><input v-model="adjustForm.lot_no" placeholder="เลขที่ล็อต" /></div>
          <div class="rp-fld"><label>จำนวนเดิม</label><input :value="fmt(adjustRoll.current_yards)" readonly /></div>
          <div class="rp-fld"><label>จำนวนใหม่</label><input type="number" step="0.01" v-model.number="adjustForm.new_yards" placeholder="0.00" /></div>
          <div class="rp-fld"><label>หมายเหตุ</label><input v-model="adjustForm.note" placeholder="เหตุผลการปรับปรุง" /></div>
        </div>
        <div class="rp-drawer-foot">
          <button class="rp-btn-reset" @click="adjustOpen = false">ยกเลิก</button>
          <button class="rp-btn-save" @click="saveAdjust">💾 บันทึก</button>
        </div>
      </div>
    </div>
  </transition>
</div>
</template>

<script>
import QRCode from 'qrcode';
export default {
  name: 'StockInventoryReportPage',
  inject: ['dash'],
  data() {
    return {
      filter: { q: '', sku: '', color: '', group: '', width: '', warehouse: '' },
      groupOptions: [],
      items: [], summary: { folds: 0, yards: 0, production: 0, factory: 0, weaving: 0 }, rolls: [], sel: null, selRow: null,
      adjustOpen: false, adjustRoll: null, adjustForm: { new_yards: null, lot_no: '', note: '' },
      sort: { key: '', dir: 'asc' },        // เรียงลำดับตารางบน (คลิกหัวคอลัมน์)
      selectedRolls: [], copies: {}, globalCopies: 1,   // เลือกม้วน + จำนวนสำเนาที่จะพิมพ์
      exportMenuOpen: false,
    };
  },
  computed: {
    rollsTotal() { return this.rolls.reduce((s, r) => s + (Number(r.current_yards) || 0), 0); },
    sortedItems() {
      if (!this.sort.key) return this.items;
      const k = this.sort.key, dir = this.sort.dir === 'asc' ? 1 : -1;
      const val = (r) => {
        switch (k) {
          case 'color': return (r.color_code || this.shadeCode(r.shade) || '').toString().toLowerCase();
          case 'shade': return (this.shadeName(r.shade) || r.shade || '').toString().toLowerCase();
          case 'folds': case 'total_yards': case 'wip_production': case 'wip_factory': case 'wip_weaving':
            return Number(r[k]) || 0;
          default: return (r[k] || '').toString().toLowerCase();
        }
      };
      return [...this.items].sort((a, b) => { const av = val(a), bv = val(b); if (av < bv) return -1 * dir; if (av > bv) return 1 * dir; return 0; });
    },
    allRollsChecked() { return this.rolls.length > 0 && this.rolls.every(r => this.selectedRolls.includes(r.roll_id)); },
  },
  mounted() { this.loadGroups(); this.load(); },
  methods: {
    async loadGroups() {
      try {
        const res = await fetch('/api/fabric-regular-group', { headers: this.authHeaders() });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) this.groupOptions = d.items || [];
      } catch (e) { /* ปล่อยว่าง — ยังกรองด้วยช่องอื่นได้ */ }
    },
    fmt(v) { return (Number(v) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
    fmtDate(d) { if (!d) return '-'; try { return new Date(d).toLocaleDateString('th-TH'); } catch (e) { return '-'; } },
    shadeCode(s) { if (!s) return ''; const p = String(s).split(/\s*-\s*/); return p[0] || ''; },
    shadeName(s) { if (!s) return ''; const p = String(s).split(/\s*-\s*/); return p.length > 1 ? p.slice(1).join(' - ') : ''; },
    authHeaders() { return { Authorization: 'Bearer ' + this.dash.token }; },
    async load() {
      const qs = new URLSearchParams(Object.entries(this.filter).filter(([, v]) => v)).toString();
      try {
        const res = await fetch('/api/reports/stock-inventory' + (qs ? '?' + qs : ''), { headers: this.authHeaders() });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) {
          this.items = d.items || [];
          this.summary = { folds: 0, yards: 0, production: 0, factory: 0, weaving: 0, ...(d.summary || {}) };
          this.sel = null; this.rolls = [];
        }
      } catch (e) { this.dash.fbFail('โหลดรายงานไม่สำเร็จ'); }
    },
    reset() { this.filter = { q: '', sku: '', color: '', group: '', width: '', warehouse: '' }; this.load(); },
    toggleSort(key) {
      if (this.sort.key === key) this.sort.dir = this.sort.dir === 'asc' ? 'desc' : 'asc';
      else { this.sort.key = key; this.sort.dir = 'asc'; }
    },
    sortIcon(key) { if (this.sort.key !== key) return '↕'; return this.sort.dir === 'asc' ? '▲' : '▼'; },
    toggleRoll(id) { const i = this.selectedRolls.indexOf(id); if (i === -1) this.selectedRolls.push(id); else this.selectedRolls.splice(i, 1); },
    toggleAllRolls() { this.selectedRolls = this.allRollsChecked ? [] : this.rolls.map(r => r.roll_id); },
    copiesOf(id) { return Number(this.copies[id]) || Number(this.globalCopies) || 1; },
    setCopies(id, n) { this.copies[id] = Number(n) || 1; },
    applyGlobalCopies() { const n = Number(this.globalCopies) || 1; this.copies = {}; this.rolls.forEach(r => { this.copies[r.roll_id] = n; }); },
    async selectRow(idx, row) {
      this.sel = idx; this.selRow = row; this.rolls = []; this.selectedRolls = []; this.copies = {};
      const qs = new URLSearchParams({ product_id: row.product_id, ...(row.color_id != null ? { color_id: row.color_id } : {}) }).toString();
      try {
        const res = await fetch('/api/reports/stock-inventory/rolls?' + qs, { headers: this.authHeaders() });
        const d = await res.json();
        if (d.ok) this.rolls = d.rolls || [];
      } catch (e) {}
    },
    openAdjust(r) {
      this.adjustRoll = r;
      this.adjustForm = { new_yards: Number(r.current_yards) || 0, lot_no: r.lot_no || '', note: r.note || '' };
      this.adjustOpen = true;
    },
    async copyBarcode(code) {
      try { await navigator.clipboard.writeText(code); this.dash.ui.toast('คัดลอกบาร์โค้ดแล้ว: ' + code, 'success', { title: 'คัดลอก' }); }
      catch (e) { this.dash.ui.toast('คัดลอกไม่สำเร็จ', 'error', { title: 'การแจ้งเตือน' }); }
    },
    async printRoll(r) {
      const row = this.selRow || {};
      const copies = this.copiesOf(r.roll_id);
      let qrImg = '';
      try { qrImg = await QRCode.toDataURL(r.roll_qr_code || '', { width: 220, margin: 1 }); } catch (e) {}
      const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
      const label = `<div class="lbl">
          <div class="nm">${esc(row.sku || '')}</div>
          <div class="sub">${esc(this.shadeName(row.shade) || row.type || '')}${row.width ? ' · ' + esc(row.width) : ''}</div>
          ${qrImg ? `<img src="${qrImg}"/>` : ''}
          <div class="bc">${esc(r.roll_qr_code)}</div>
          <div class="yd">คงเหลือ ${this.fmt(r.current_yards)} หลา${r.lot_no ? ' · ล็อต ' + esc(r.lot_no) : ''}</div>
        </div>`;
      const win = window.open('', '_blank', copies > 1 ? 'width=820,height=640' : 'width=360,height=520');
      if (!win) { this.dash.ui.toast('เบราว์เซอร์บล็อก popup — กรุณาอนุญาต', 'error', { title: 'การแจ้งเตือน' }); return; }
      win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>QR ${esc(r.roll_qr_code)}${copies > 1 ? ' ×' + copies : ''}</title>
        <style>*{box-sizing:border-box}body{font-family:'Segoe UI',Tahoma,'Noto Sans Thai',sans-serif;margin:0;padding:16px;color:#111}
        .sheet{display:grid;grid-template-columns:repeat(${copies > 1 ? 3 : 1},1fr);gap:12px;justify-items:center}
        .lbl{border:1px solid #111;border-radius:8px;padding:14px;max-width:280px;text-align:center;page-break-inside:avoid}
        .nm{font-size:14px;font-weight:700;margin-bottom:2px}.sub{font-size:12px;color:#333;margin-bottom:8px}
        img{width:180px;height:180px}.bc{font-family:'Courier New',monospace;font-size: 12px;font-weight:700;margin-top:6px}
        .yd{font-size:12px;margin-top:4px}@media print{.no-print{display:none}}</style></head><body>
        <div class="no-print" style="text-align:center;margin-bottom:10px"><button onclick="window.print()" style="padding:8px 18px;font-size: 12px;cursor:pointer">🖨️ พิมพ์${copies > 1 ? ' (' + copies + ' สำเนา)' : ''}</button></div>
        <div class="sheet">${Array(copies).fill(label).join('')}</div>
        </body></html>`);
      win.document.close();
    },
    // พิมพ์ QR ม้วน (ที่เลือกไว้ หรือทั้งหมดถ้าไม่ได้เลือก) — ทำสำเนาตาม dropdown ต่อม้วน
    async printAllRolls() {
      if (!this.rolls.length) { this.dash.ui.toast('ยังไม่มีม้วนให้พิมพ์ — คลิกเลือกผ้าด้านบนก่อน', 'error', { title: 'การแจ้งเตือน' }); return; }
      const list = this.selectedRolls.length ? this.rolls.filter(r => this.selectedRolls.includes(r.roll_id)) : this.rolls;
      const row = this.selRow || {};
      const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
      const cards = [];
      let totalLabels = 0;
      for (const r of list) {
        let qrImg = '';
        try { qrImg = await QRCode.toDataURL(r.roll_qr_code || '', { width: 180, margin: 1 }); } catch (e) {}
        const label = `<div class="lbl">
          <div class="nm">${esc(row.sku || '')}</div>
          <div class="sub">${esc(this.shadeName(row.shade) || row.type || '')}${row.width ? ' · ' + esc(row.width) : ''}</div>
          ${qrImg ? `<img src="${qrImg}"/>` : ''}
          <div class="bc">${esc(r.roll_qr_code)}</div>
          <div class="yd">คงเหลือ ${this.fmt(r.current_yards)} หลา${r.lot_no ? ' · ล็อต ' + esc(r.lot_no) : ''}</div>
        </div>`;
        const c = this.copiesOf(r.roll_id);
        totalLabels += c;
        for (let n = 0; n < c; n++) cards.push(label);
      }
      const win = window.open('', '_blank', 'width=820,height=640');
      if (!win) { this.dash.ui.toast('เบราว์เซอร์บล็อก popup — กรุณาอนุญาต', 'error', { title: 'การแจ้งเตือน' }); return; }
      win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>พิมพ์ QR ${esc(row.sku || '')} (${totalLabels} ป้าย)</title>
        <style>*{box-sizing:border-box}body{font-family:'Segoe UI',Tahoma,'Noto Sans Thai',sans-serif;margin:0;padding:16px;color:#111}
        .sheet{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        .lbl{border:1px solid #111;border-radius:8px;padding:12px;text-align:center;page-break-inside:avoid}
        .nm{font-size:14px;font-weight:700}.sub{font-size:11px;color:#333;margin-bottom:6px}
        img{width:140px;height:140px}.bc{font-family:'Courier New',monospace;font-size:12px;font-weight:700;margin-top:4px}
        .yd{font-size:11px;margin-top:3px}@media print{.no-print{display:none}}</style></head><body>
        <div class="no-print" style="text-align:center;margin-bottom:12px"><button onclick="window.print()" style="padding:8px 20px;font-size: 12px;cursor:pointer">🖨️ พิมพ์ทั้งหมด (${totalLabels} ป้าย จาก ${list.length} ม้วน)</button></div>
        <div class="sheet">${cards.join('')}</div>
        </body></html>`);
      win.document.close();
    },
    async saveAdjust() {
      if (!(Number(this.adjustForm.new_yards) >= 0)) { this.dash.fbFail('กรุณากรอกจำนวนใหม่'); return; }
      this.dash.fbLoading('กำลังบันทึก...');
      try {
        const res = await fetch('/api/fabric-rolls/adjust', {
          method: 'POST', headers: { 'Content-Type': 'application/json', ...this.authHeaders() },
          body: JSON.stringify({ roll_qr: this.adjustRoll.roll_qr_code, new_yards: this.adjustForm.new_yards, lot_no: this.adjustForm.lot_no, note: this.adjustForm.note }),
        });
        const d = await res.json();
        if (d.ok) { this.dash.fbDone('ปรับปรุงแล้ว'); this.adjustOpen = false; await this.load(); if (this.selRow) this.selectRow(this.sel, this.selRow); }
        else { this.dash.fbFail(d.message || 'บันทึกไม่สำเร็จ'); }
      } catch (e) { this.dash.fbFail('บันทึกไม่สำเร็จ'); }
    },
    exportRows() {
      const head = ['รหัสสินค้า', 'รหัสสี', 'เฉดสี', 'ประเภท', 'หน้ากว้าง', 'พับรวม', 'จำนวนรวม(หลา)', 'ระหว่างผลิต', 'ที่โรงงาน', 'ระหว่างทอ'];
      const body = this.sortedItems.map(r => [r.sku, r.color_code || this.shadeCode(r.shade), this.shadeName(r.shade) || r.shade, r.type, r.width, r.folds, Number(r.total_yards).toFixed(2), Number(r.wip_production) || 0, Number(r.wip_factory) || 0, Number(r.wip_weaving) || 0]);
      return { head, body };
    },
    exportCsv() {
      this.exportMenuOpen = false;
      const { head, body } = this.exportRows();
      const lines = [head.join(',')].concat(body.map(r => r.map(x => '"' + (x == null ? '' : String(x).replace(/"/g, '""')) + '"').join(',')));
      const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob); const a = document.createElement('a');
      a.href = url; a.download = 'stock-inventory.csv'; a.click(); URL.revokeObjectURL(url);
    },
    async exportExcel() {
      this.exportMenuOpen = false;
      const { head, body } = this.exportRows();
      const XLSX = await import('xlsx');
      const sheet = XLSX.utils.aoa_to_sheet([head, ...body]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, sheet, 'สินค้าคงคลัง');
      XLSX.writeFile(wb, `รายงานสินค้าคงคลัง-${new Date().toISOString().slice(0, 10)}.xlsx`);
    },
  },
};
</script>

<style scoped>
.rp-page { font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif; color: var(--text); font-size: 12px; }
.rp-titlebar { display: flex; align-items: center; justify-content: space-between; font-weight: 700; font-size: 14px; margin-bottom: 12px; }
.rp-export { padding: 7px 14px; border: 1px solid #1a9c54; background: #1a9c54; color: #fff; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 12px; }
.rp-export:hover { background: #158045; }
.rp-filter { display: flex; flex-wrap: wrap; gap: 10px 16px; align-items: flex-end; background: var(--surface); border: 1px solid var(--field-border); border-radius: 12px; padding: 9px 12px; margin-bottom: 12px; }
.rp-f { display: flex; flex-direction: column; gap: 4px; min-width: 150px; flex: 1 1 150px; max-width: 220px; }
.rp-f > label { font-size: 11.5px; color: var(--muted); font-weight: 600; }
.rp-f input, .rp-f select { height: 34px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12px; font-family: inherit; background: var(--field); color: var(--text); }
.rp-f input:focus, .rp-f select:focus { outline: none; border-color: #2F65F6; background: var(--surface); }
.rp-f-actions { display: flex; gap: 8px; }
/* เมนูส่งออก (dropdown) */
.rp-export-wrap { position: relative; }
.rp-caret { font-size: 10px; }
.rp-export-catch { position: fixed; inset: 0; z-index: 20; }
.rp-export-menu { position: absolute; right: 0; top: calc(100% + 6px); z-index: 21; background: var(--surface); border: 1px solid var(--field-border); border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,.16); padding: 6px; min-width: 168px; display: flex; flex-direction: column; gap: 2px; }
.rp-export-menu button { display: flex; align-items: center; gap: 8px; width: 100%; text-align: left; padding: 8px 10px; border: none; background: transparent; color: var(--text); font-family: inherit; font-size: 12px; border-radius: 7px; cursor: pointer; }
.rp-export-menu button:hover { background: var(--field); }
.rp-export-menu .xls-ico { width: 16px; height: 16px; }
.rp-btn-search { padding: 8px 16px; border: 1px solid #1e3a8a; background: #1e3a8a; color: #fff; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; }
.rp-btn-search:hover { background: #172b6b; }
.rp-btn-reset { padding: 8px 16px; border: 1px solid #a82a3a; background: #a82a3a; color: #fff; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; }
.rp-btn-reset:hover { background: #8a1c2b; }
.rp-found { font-size: 12px; color: #2F65F6; font-weight: 600; margin-bottom: 6px; }
.rp-table-wrap { overflow-x: auto; border: 1px solid var(--table-line); border-radius: 10px; margin-bottom: 16px; background: var(--surface); }
.rp-rolls { max-height: 340px; overflow-y: auto; }
.rp-table { width: 100%; border-collapse: collapse; font-size: 12px; min-width: 900px; }
.rp-table thead th { position: sticky; top: 0; background: #3c4453; color: #fff; font-size: 11px; font-weight: 600; letter-spacing: .3px; padding: 7px 12px; text-align: left; white-space: nowrap; border-right: 1px solid rgba(255,255,255,.18); }
.rp-table thead th:last-child { border-right: none; }
.rp-table th.rp-r { text-align: right; }
.rp-table tbody td { padding: 3px 12px; font-size: 12px; line-height: 1.6; border-bottom: 1px solid var(--table-line); border-right: 1px solid var(--table-line); white-space: nowrap; }
.rp-table tbody td:last-child { border-right: none; }
.rp-table tbody tr { cursor: pointer; }
.rp-table tbody tr:hover { background: var(--field); }
.rp-table tbody tr.is-sel { background: #fff8d6; }
.rp-r { text-align: right; } .rp-c { text-align: center; color: var(--muted); }
.rp-bold { font-weight: 700; } .rp-muted { color: var(--muted); }
.rp-mono { font-family: 'Courier New', monospace; }
.rp-empty { text-align: center; color: var(--muted); padding: 26px; }
.rp-table tfoot td { padding: 9px 10px; border-top: 2px solid var(--table-line); background: var(--field); font-weight: 700; }
.rp-bc { vertical-align: middle; }
.rp-ic { width: 26px; height: 26px; border-radius: 6px; border: 1px solid var(--field-border); background: var(--field); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; padding: 0; vertical-align: middle; transition: background .15s, border-color .15s; }
.rp-ic svg { width: 14px; height: 14px; }
.rp-copy { color: var(--muted); margin-left: 6px; }
.rp-copy:hover { background: var(--field); border-color: var(--muted); color: var(--text); }
/* ปุ่มปริ้นรายแถว = ดำล้วน */
.rp-print { color: #111; }
.rp-print:hover { background: var(--field); border-color: #111; }
/* คอลัมน์จัดการ: แก้ไข(emoji มาตรฐาน) + ปริ้น */
.rp-actions-cell { display: flex; align-items: center; justify-content: center; gap: 6px; white-space: nowrap; }
.rp-actions-cell .fr-action-btn { vertical-align: middle; }
/* หัวคอลัมน์จัดการ + ปุ่มปริ้นทั้งหมด (บนพื้นหัวเข้ม = ไอคอนขาว) */
.rp-th-manage { display: inline-flex; align-items: center; gap: 7px; }
.rp-th-print { width: 24px; height: 24px; background: transparent; border-color: rgba(255,255,255,.35); color: #fff; }
.rp-th-print:hover { background: rgba(255,255,255,.15); border-color: #fff; }
/* ตารางบนเลื่อนได้ */
.rp-groups { max-height: 440px; overflow-y: auto; }
/* หัวคอลัมน์เรียงลำดับได้ */
.rp-sortable { cursor: pointer; user-select: none; }
.rp-sortable:hover { background: #4a5262; }
.rp-sort { opacity: .45; font-size: 10px; margin-left: 3px; }
.rp-sort.on { opacity: 1; }
/* ปุ่มดูม้วน (คอลัมน์ท้ายตารางบน) */
.rp-view { color: var(--muted); }
.rp-view:hover { background: var(--field); border-color: var(--muted); color: var(--text); }
/* เช็กบ็อกซ์ + ตัวเลือกจำนวนสำเนา */
.rp-chk { width: 15px; height: 15px; cursor: pointer; accent-color: #2F65F6; vertical-align: middle; }
.rp-copies { height: 26px; padding: 0 4px; border: 1px solid var(--field-border); border-radius: 6px; background: var(--field); color: var(--text); font-size: 12px; font-family: inherit; cursor: pointer; vertical-align: middle; }
.rp-th-copies { height: 24px; background: rgba(255,255,255,.12); border-color: rgba(255,255,255,.4); color: #fff; }
.rp-th-copies option { color: #111; }
.rp-th-manage .rp-chk { accent-color: #fff; }

.rp-drawer-wrap { position: fixed; inset: 0; z-index: 3300; }
.rp-backdrop { position: absolute; inset: 0; background: rgba(15,23,42,0.4); }
.rp-drawer { position: absolute; top: 0; right: 0; height: 100%; width: 420px; max-width: 94vw; background: var(--surface); box-shadow: -8px 0 30px rgba(0,0,0,0.2); display: flex; flex-direction: column; }
.rp-drawer-head { background: #3c4453; color: #fff; padding: 15px 20px; font-weight: 700; display: flex; justify-content: space-between; align-items: center; }
.rp-x { background: none; border: none; color: #fff; font-size: 14px; cursor: pointer; }
.rp-drawer-body { flex: 1; overflow-y: auto; padding: 18px 20px; display: flex; flex-direction: column; gap: 12px; }
.rp-fld { display: flex; flex-direction: column; gap: 4px; }
.rp-fld > label { font-size: 12px; color: var(--muted); font-weight: 600; }
.rp-fld input { height: 36px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12px; font-family: inherit; background: var(--field); color: var(--text); }
.rp-fld input:focus { outline: none; border-color: #2F65F6; background: var(--surface); }
.rp-fld input[readonly] { background: var(--field); color: var(--muted); }
.rp-drawer-foot { padding: 9px 14px; border-top: 1px solid var(--field-border); display: flex; justify-content: flex-end; gap: 10px; background: var(--field); }
.rp-btn-save { padding: 8px 18px; border: 1px solid #1a9c54; background: #1a9c54; color: #fff; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; }
.rp-btn-save:hover { background: #158045; }
.rp-slide-enter-active, .rp-slide-leave-active { transition: opacity 0.2s; }
.rp-slide-enter-from, .rp-slide-leave-to { opacity: 0; }
</style>
