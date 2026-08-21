<template>
<div class="rp-page">
  <div class="rp-titlebar">
    <span>📦 รายงานสินค้าคงคลัง</span>
    <button class="rp-export" @click="exportCsv">⬇ ส่งออก CSV</button>
  </div>

  <!-- ตัวกรอง -->
  <div class="rp-filter">
    <div class="rp-f"><label>คำค้นหา</label><input v-model="filter.q" placeholder="ชื่อ/รหัส/สี" @keyup.enter="load" /></div>
    <div class="rp-f"><label>รหัสสินค้า</label><input v-model="filter.sku" @keyup.enter="load" /></div>
    <div class="rp-f"><label>รหัสสี / เฉดสี</label><input v-model="filter.color" @keyup.enter="load" /></div>
    <div class="rp-f"><label>กลุ่มผ้า</label><input v-model="filter.group" @keyup.enter="load" /></div>
    <div class="rp-f"><label>หน้ากว้าง</label><input v-model="filter.width" @keyup.enter="load" /></div>
    <div class="rp-f"><label>คลัง</label><input v-model="filter.warehouse" @keyup.enter="load" /></div>
    <div class="rp-f-actions">
      <button class="rp-btn-search" @click="load">🔍 ค้นหา</button>
      <button class="rp-btn-reset" @click="reset">↺ รีเซ็ต</button>
    </div>
  </div>

  <div class="rp-found">พบ {{ items.length.toLocaleString() }} รายการ</div>

  <!-- ตารางกลุ่ม -->
  <div class="rp-table-wrap">
    <table class="rp-table">
      <thead>
        <tr>
          <th style="width:40px;">ที่</th>
          <th>รหัสสินค้า</th><th>รหัสสี</th><th>เฉดสี</th><th>ประเภท</th><th>หน้ากว้าง</th>
          <th class="rp-r">พับรวม</th><th class="rp-r">จำนวนรวม (หลา)</th>
          <th class="rp-r">ระหว่างผลิต</th><th class="rp-r">ที่โรงงาน</th><th class="rp-r">ระหว่างทอ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in items" :key="idx" :class="{ 'is-sel': sel === idx }" @click="selectRow(idx, row)">
          <td class="rp-c">{{ idx + 1 }}</td>
          <td>{{ row.sku || '-' }}</td>
          <td>{{ shadeCode(row.shade) || '-' }}</td>
          <td class="rp-c">{{ shadeName(row.shade) || '-' }}</td>
          <td>{{ row.type || '-' }}</td>
          <td>{{ row.width || '-' }}</td>
          <td class="rp-r">{{ Number(row.folds).toLocaleString() }}</td>
          <td class="rp-r rp-bold">{{ fmt(row.total_yards) }}</td>
          <td class="rp-r rp-muted">-</td><td class="rp-r rp-muted">-</td><td class="rp-r rp-muted">-</td>
        </tr>
        <tr v-if="items.length === 0"><td colspan="11" class="rp-empty">ไม่พบข้อมูล</td></tr>
      </tbody>
      <tfoot v-if="items.length">
        <tr>
          <td colspan="6" class="rp-r rp-bold">รวม</td>
          <td class="rp-r rp-bold">{{ summary.folds.toLocaleString() }}</td>
          <td class="rp-r rp-bold">{{ fmt(summary.yards) }}</td>
          <td class="rp-r">0.00</td><td class="rp-r">0.00</td><td class="rp-r">0.00</td>
        </tr>
      </tfoot>
    </table>
  </div>

  <!-- ตารางม้วน (เมื่อเลือกแถว) -->
  <div class="rp-table-wrap rp-rolls">
    <table class="rp-table">
      <thead>
        <tr>
          <th style="width:40px;">ที่</th><th>บาร์โค้ด</th><th>วันที่รับ</th>
          <th class="rp-r">จำนวนรับ (หลา)</th><th class="rp-r">จำนวนสต็อก (หลา)</th>
          <th>คลัง</th><th>แร็คซ์</th><th>เลขที่ล็อต</th><th style="width:70px;">ปรับปรุง</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r, i) in rolls" :key="r.roll_id">
          <td class="rp-c">{{ i + 1 }}</td>
          <td class="rp-mono">{{ r.roll_qr_code }}</td>
          <td class="rp-c">{{ fmtDate(r.received_at) }}</td>
          <td class="rp-r">{{ fmt(r.initial_yards) }}</td>
          <td class="rp-r rp-bold">{{ fmt(r.current_yards) }}</td>
          <td>{{ r.location_code || '-' }}</td>
          <td class="rp-c">{{ r.rack || '-' }}</td>
          <td>{{ r.lot_no || '-' }}</td>
          <td class="rp-c"><button class="rp-edit" title="ปรับปรุงสต็อก" @click="openAdjust(r)">✎</button></td>
        </tr>
        <tr v-if="rolls.length === 0"><td colspan="9" class="rp-empty">{{ sel === null ? 'คลิกแถวด้านบนเพื่อดูม้วนผ้า' : 'ไม่มีม้วนผ้า' }}</td></tr>
      </tbody>
      <tfoot v-if="rolls.length">
        <tr><td colspan="4" class="rp-r rp-bold">รวม</td><td class="rp-r rp-bold">{{ fmt(rollsTotal) }}</td><td colspan="4"></td></tr>
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
export default {
  name: 'StockInventoryReportPage',
  inject: ['dash'],
  data() {
    return {
      filter: { q: '', sku: '', color: '', group: '', width: '', warehouse: '' },
      items: [], summary: { folds: 0, yards: 0 }, rolls: [], sel: null, selRow: null,
      adjustOpen: false, adjustRoll: null, adjustForm: { new_yards: null, lot_no: '', note: '' },
    };
  },
  computed: {
    rollsTotal() { return this.rolls.reduce((s, r) => s + (Number(r.current_yards) || 0), 0); },
  },
  mounted() { this.load(); },
  methods: {
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
        if (d.ok) { this.items = d.items || []; this.summary = d.summary || { folds: 0, yards: 0 }; this.sel = null; this.rolls = []; }
      } catch (e) { this.dash.fbFail('โหลดรายงานไม่สำเร็จ'); }
    },
    reset() { this.filter = { q: '', sku: '', color: '', group: '', width: '', warehouse: '' }; this.load(); },
    async selectRow(idx, row) {
      this.sel = idx; this.selRow = row; this.rolls = [];
      const qs = new URLSearchParams({ product_id: row.product_id, ...(row.color_id != null ? { color_id: row.color_id } : {}) }).toString();
      try {
        const res = await fetch('/api/reports/stock-inventory/rolls?' + qs, { headers: this.authHeaders() });
        const d = await res.json();
        if (d.ok) this.rolls = d.rolls || [];
      } catch (e) {}
    },
    openAdjust(r) {
      this.adjustRoll = r;
      this.adjustForm = { new_yards: Number(r.current_yards) || 0, lot_no: r.lot_no || '', note: '' };
      this.adjustOpen = true;
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
    exportCsv() {
      const head = ['รหัสสินค้า', 'รหัสสี', 'เฉดสี', 'ประเภท', 'หน้ากว้าง', 'พับรวม', 'จำนวนรวม(หลา)'];
      const lines = [head.join(',')].concat(this.items.map(r => [r.sku, this.shadeCode(r.shade), this.shadeName(r.shade), r.type, r.width, r.folds, Number(r.total_yards).toFixed(2)].map(x => '"' + (x == null ? '' : String(x).replace(/"/g, '""')) + '"').join(',')));
      const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob); const a = document.createElement('a');
      a.href = url; a.download = 'stock-inventory.csv'; a.click(); URL.revokeObjectURL(url);
    },
  },
};
</script>

<style scoped>
.rp-page { font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif; color: var(--text); font-size: 13px; }
.rp-titlebar { display: flex; align-items: center; justify-content: space-between; font-weight: 700; font-size: 17px; margin-bottom: 12px; }
.rp-export { padding: 7px 14px; border: 1px solid #1a9c54; background: #1a9c54; color: #fff; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 13px; }
.rp-export:hover { background: #158045; }
.rp-filter { display: flex; flex-wrap: wrap; gap: 10px 16px; align-items: flex-end; background: var(--surface); border: 1px solid var(--field-border); border-radius: 12px; padding: 14px 16px; margin-bottom: 12px; }
.rp-f { display: flex; flex-direction: column; gap: 4px; min-width: 150px; flex: 1 1 150px; max-width: 220px; }
.rp-f > label { font-size: 11.5px; color: var(--muted); font-weight: 600; }
.rp-f input { height: 34px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 13px; font-family: inherit; background: var(--field); color: var(--text); }
.rp-f input:focus { outline: none; border-color: #2F65F6; background: var(--surface); }
.rp-f-actions { display: flex; gap: 8px; }
.rp-btn-search { padding: 8px 16px; border: 1px solid #1e3a8a; background: #1e3a8a; color: #fff; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; }
.rp-btn-search:hover { background: #172b6b; }
.rp-btn-reset { padding: 8px 16px; border: 1px solid #a82a3a; background: #a82a3a; color: #fff; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; }
.rp-btn-reset:hover { background: #8a1c2b; }
.rp-found { font-size: 13px; color: #2F65F6; font-weight: 600; margin-bottom: 6px; }
.rp-table-wrap { overflow-x: auto; border: 1px solid var(--field-border); border-radius: 10px; margin-bottom: 16px; background: var(--surface); }
.rp-rolls { max-height: 340px; overflow-y: auto; }
.rp-table { width: 100%; border-collapse: collapse; font-size: 12.5px; min-width: 900px; }
.rp-table thead th { position: sticky; top: 0; background: #3c4453; color: #fff; font-weight: 600; padding: 9px 10px; text-align: left; white-space: nowrap; border-right: 1px solid rgba(255,255,255,.14); }
.rp-table th.rp-r { text-align: right; }
.rp-table tbody td { padding: 7px 10px; border-bottom: 1px solid var(--field-border); white-space: nowrap; }
.rp-table tbody tr { cursor: pointer; }
.rp-table tbody tr:hover { background: var(--field); }
.rp-table tbody tr.is-sel { background: #fff8d6; }
.rp-r { text-align: right; } .rp-c { text-align: center; color: var(--muted); }
.rp-bold { font-weight: 700; } .rp-muted { color: var(--muted); }
.rp-mono { font-family: 'Courier New', monospace; }
.rp-empty { text-align: center; color: var(--muted); padding: 26px; }
.rp-table tfoot td { padding: 9px 10px; border-top: 2px solid var(--field-border); background: var(--field); font-weight: 700; }
.rp-edit { width: 26px; height: 26px; border-radius: 6px; border: 1px solid var(--field-border); background: var(--field); color: #2F65F6; cursor: pointer; }
.rp-edit:hover { background: #e9f0fe; border-color: #2F65F6; }

.rp-drawer-wrap { position: fixed; inset: 0; z-index: 3300; }
.rp-backdrop { position: absolute; inset: 0; background: rgba(15,23,42,0.4); }
.rp-drawer { position: absolute; top: 0; right: 0; height: 100%; width: 420px; max-width: 94vw; background: var(--surface); box-shadow: -8px 0 30px rgba(0,0,0,0.2); display: flex; flex-direction: column; }
.rp-drawer-head { background: #3c4453; color: #fff; padding: 15px 20px; font-weight: 700; display: flex; justify-content: space-between; align-items: center; }
.rp-x { background: none; border: none; color: #fff; font-size: 17px; cursor: pointer; }
.rp-drawer-body { flex: 1; overflow-y: auto; padding: 18px 20px; display: flex; flex-direction: column; gap: 12px; }
.rp-fld { display: flex; flex-direction: column; gap: 4px; }
.rp-fld > label { font-size: 12px; color: var(--muted); font-weight: 600; }
.rp-fld input { height: 36px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 13px; font-family: inherit; background: var(--field); color: var(--text); }
.rp-fld input:focus { outline: none; border-color: #2F65F6; background: var(--surface); }
.rp-fld input[readonly] { background: var(--field); color: var(--muted); }
.rp-drawer-foot { padding: 14px 20px; border-top: 1px solid var(--field-border); display: flex; justify-content: flex-end; gap: 10px; background: var(--field); }
.rp-btn-save { padding: 8px 18px; border: 1px solid #1a9c54; background: #1a9c54; color: #fff; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; }
.rp-btn-save:hover { background: #158045; }
.rp-slide-enter-active, .rp-slide-leave-active { transition: opacity 0.2s; }
.rp-slide-enter-from, .rp-slide-leave-to { opacity: 0; }
</style>
