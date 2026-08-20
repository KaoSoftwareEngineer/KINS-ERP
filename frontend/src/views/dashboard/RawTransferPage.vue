<template>
<div class="po-page">
  <div class="po-titlebar">🔄 ย้ายผ้าดิบ</div>

  <!-- ส่วนหัว -->
  <div class="po-head">
    <div class="po-head-col">
      <div class="po-field"><label>วันที่</label><input type="date" v-model="form.transfer_date" /></div>
      <div class="po-field"><label>เลขที่ย้ายสินค้า</label><input :value="form.tg_no" readonly class="po-ro" /></div>
    </div>
    <div class="po-head-col">
      <div class="po-field"><label>ไปยังคลัง</label>
        <select v-model="form.to_wh"><option value="">— เลือก —</option><option v-for="w in warehouseOptions" :key="w" :value="w">{{ w }}</option></select>
      </div>
    </div>
    <div class="po-head-col po-head-col-wide">
      <div class="po-field"><label>หมายเหตุ</label><textarea v-model="form.remark" rows="3"></textarea></div>
    </div>
    <div class="po-head-col">
      <button class="dy-pick-btn" @click="openDrawer">☰ เลือกผ้าดิบ</button>
    </div>
  </div>

  <!-- ตารางรายการ -->
  <div class="po-items">
    <table class="po-item-table">
      <thead>
        <tr>
          <th style="width:40px;">ที่</th>
          <th>รหัสสินค้า</th><th>ชื่อ</th><th>ส่วนประกอบ</th><th>โครงสร้างผ้า</th><th>หน้ากว้าง</th>
          <th>เลขที่ล็อต</th><th>จำนวนสต็อก</th><th style="width:90px;">จำนวน</th><th style="width:80px;">หน่วย</th><th>คลัง</th>
          <th style="width:54px;"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in items" :key="row._key">
          <td class="po-no">{{ idx + 1 }}</td>
          <td><input v-model="row.sku" class="po-ro-cell" placeholder="รหัส" /></td>
          <td><input v-model="row.name" class="po-ro-cell" placeholder="ชื่อ" /></td>
          <td><input v-model="row.composition" class="po-ro-cell" placeholder="ส่วนประกอบ" /></td>
          <td><input v-model="row.structure" class="po-ro-cell" placeholder="โครงสร้าง" /></td>
          <td><input v-model="row.width" class="po-ro-cell" placeholder="หน้ากว้าง" /></td>
          <td><input v-model="row.lot" placeholder="ล็อต" /></td>
          <td><input v-model="row.stock" class="po-ro-cell po-num" placeholder="0" /></td>
          <td><input type="number" v-model.number="row.qty" class="po-num" /></td>
          <td><input v-model="row.unit" /></td>
          <td><input v-model="row.warehouse" class="po-ro-cell" placeholder="คลัง" /></td>
          <td class="po-row-actions">
            <button class="po-ic po-del" title="ลบแถว" @click="removeRow(idx)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6"/></svg>
            </button>
          </td>
        </tr>
        <tr v-if="items.length === 0"><td colspan="12" class="po-empty">ยังไม่มีรายการ — กด "เลือกผ้าดิบ" เพื่อเพิ่มผ้าที่จะย้าย</td></tr>
      </tbody>
    </table>
  </div>

  <!-- แถบล่าง -->
  <div class="po-footer">
    <span v-if="savedMsg" class="po-saved-msg">{{ savedMsg }}</span>
    <div class="po-footer-btns">
      <button class="po-btn po-btn-report" @click="dash.fbFail('ตัวอย่างรายงาน (ยังไม่เชื่อมระบบพิมพ์รายงานจริง)')">👁 รายงาน</button>
      <template v-if="!saved">
        <button class="po-btn po-btn-save" @click="save">💾 บันทึก</button>
      </template>
      <template v-else>
        <button class="po-btn po-btn-receipt" @click="openPdf">🧾 ใบย้ายผ้าดิบ</button>
        <button class="po-btn po-btn-new" @click="resetForm">🔄 ย้ายใหม่</button>
      </template>
    </div>
  </div>

  <!-- Drawer เลือกผ้าดิบ -->
  <transition name="dy-slide">
    <div v-if="drawerOpen" class="dy-drawer-wrap">
      <div class="dy-drawer-backdrop" @click="drawerOpen = false"></div>
      <div class="dy-drawer">
        <div class="dy-drawer-head"><span>เลือกผ้าดิบ</span><button class="dy-x" @click="drawerOpen = false">✕</button></div>
        <div class="dy-drawer-search">
          <input v-model="drawerSearch" placeholder="ค้นหารหัส/ชื่อผ้าดิบ" />
        </div>
        <div class="dy-drawer-list">
          <table>
            <thead><tr><th>รหัส</th><th>ชื่อ</th><th>หน้ากว้าง</th><th></th></tr></thead>
            <tbody>
              <tr v-for="f in drawerFiltered" :key="f.id">
                <td>{{ f.sku }}</td><td>{{ f.name }}</td><td>{{ f.width }}</td>
                <td><button class="dy-select-btn" @click="selectRaw(f)">เลือก</button></td>
              </tr>
              <tr v-if="drawerFiltered.length === 0"><td colspan="4" class="dy-empty">ไม่พบผ้าดิบ</td></tr>
            </tbody>
          </table>
        </div>
        <div class="dy-drawer-foot"><button class="po-btn" @click="drawerOpen = false">✕ ปิด</button></div>
      </div>
    </div>
  </transition>
</div>
</template>

<script>
export default {
  name: 'RawTransferPage',
  inject: ['dash'],
  data() {
    return {
      form: { tg_no: '', transfer_date: new Date().toISOString().slice(0, 10), to_wh: '', remark: '' },
      items: [],
      warehouseOptions: ['Warehouse', 'Cut Piece', 'Factory'],
      fabricRaw: [], saved: false, savedMsg: '', _seq: 1,
      drawerOpen: false, drawerSearch: '',
    };
  },
  computed: {
    drawerFiltered() {
      const q = (this.drawerSearch || '').trim().toLowerCase();
      let list = this.fabricRaw;
      if (q) list = list.filter(f => (f.sku || '').toLowerCase().includes(q) || (f.name || '').toLowerCase().includes(q));
      return list.slice(0, 60);
    },
  },
  async mounted() {
    await this.loadNextNo();
    this.loadFabricRaw();
  },
  methods: {
    async loadNextNo() {
      try {
        const res = await fetch('/api/raw-transfers/next-no', { headers: { Authorization: 'Bearer ' + this.dash.token } });
        const d = await res.json();
        if (d.ok) this.form.tg_no = d.tg_no;
      } catch (e) {}
    },
    async loadFabricRaw() {
      try {
        const res = await fetch('/api/fabric-raw', { headers: { Authorization: 'Bearer ' + this.dash.token } });
        const d = await res.json();
        this.fabricRaw = d.items || [];
      } catch (e) {}
    },
    openDrawer() { this.drawerOpen = true; },
    selectRaw(f) {
      this.items.push({
        _key: (this._seq = (this._seq || 0) + 1),
        sku: f.sku || '', name: f.name || '', composition: f.composition || '', structure: f.structure || '',
        width: f.width || '', lot: '', stock: '', qty: null, unit: f.unit || 'หลา', warehouse: '',
      });
      this.drawerOpen = false;
    },
    removeRow(idx) { this.items.splice(idx, 1); },
    resetForm() {
      this.form = { tg_no: '', transfer_date: new Date().toISOString().slice(0, 10), to_wh: '', remark: '' };
      this.items = []; this.saved = false; this.savedMsg = '';
      this.loadNextNo();
    },
    async save() {
      if (this.items.length === 0) { this.dash.fbFail('กรุณาเลือกผ้าดิบที่จะย้ายอย่างน้อย 1 รายการ'); return; }
      if (!this.form.to_wh) { this.dash.fbFail('กรุณาเลือกคลังปลายทาง'); return; }
      this.dash.fbLoading('กำลังบันทึก...');
      const payload = {
        ...this.form,
        items: this.items.map(r => ({ sku: r.sku, name: r.name, composition: r.composition, structure: r.structure, width: r.width, lot: r.lot, stock: r.stock, qty: r.qty, unit: r.unit, warehouse: r.warehouse })),
      };
      try {
        const res = await fetch('/api/raw-transfers', {
          method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.dash.token }, body: JSON.stringify(payload),
        });
        if (res.status === 401) { this.dash.fbHide(); this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) { this.form.tg_no = d.tg_no; this.saved = true; this.savedMsg = 'ระบบได้ทำการย้ายผ้าดิบเรียบร้อยแล้ว'; this.dash.fbDone('บันทึกแล้ว'); }
        else { this.dash.fbFail(d.message || 'บันทึกไม่สำเร็จ'); }
      } catch (e) { this.dash.fbFail('บันทึกไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
    },
    openPdf() {
      const f = this.form;
      const esc = (s) => (s == null ? '' : String(s)).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
      const body = this.items.map((r, i) => `<tr><td>${i + 1}</td><td style="text-align:left">${esc(r.sku)}</td><td style="text-align:left">${esc(r.name)}</td><td>${esc(r.structure)}</td><td>${esc(r.width)}</td><td>${esc(r.lot)}</td><td>${r.qty || ''}</td><td>${esc(r.unit)}</td><td>${esc(r.warehouse)}</td></tr>`).join('');
      const win = window.open('', '_blank', 'width=800,height=1000');
      if (!win) { this.dash.fbFail('เบราว์เซอร์บล็อกหน้าต่างพิมพ์ — กรุณาอนุญาต popup'); return; }
      win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${esc(f.tg_no)}</title>
        <style>body{font-family:'Noto Sans Thai','Times New Roman',serif;margin:26px;color:#000}.center{text-align:center}.h1{font-size:20px;font-weight:bold}.h2{font-size:14px;font-weight:bold}.meta{display:flex;justify-content:space-between;font-size:12px;margin:14px 0}table{width:100%;border-collapse:collapse;margin-top:6px}th,td{border:1px solid #000;padding:5px 6px;font-size:12px;text-align:center;height:22px}th{font-weight:bold;background:#f0f0f0}.foot{display:flex;justify-content:space-between;margin-top:44px;font-size:12px}@media print{.no-print{display:none}}</style></head><body>
        <div class="no-print" style="text-align:center;margin-bottom:12px"><button onclick="window.print()" style="padding:8px 22px;font-size:14px;cursor:pointer">🖨️ พิมพ์ / บันทึก PDF</button></div>
        <div class="center h1">D'finest Fabric Co., Ltd.</div>
        <div class="center h2">ใบย้ายผ้าดิบ</div>
        <div class="meta"><div><b>ไปยังคลัง :</b> ${esc(f.to_wh)}</div><div><b>เลขที่ย้าย :</b> ${esc(f.tg_no)}<br><b>วันที่ :</b> ${esc(f.transfer_date)}</div></div>
        <table><thead><tr><th style="width:32px">ที่</th><th>รหัสสินค้า</th><th>ชื่อ</th><th>โครงสร้าง</th><th>หน้ากว้าง</th><th>ล็อต</th><th>จำนวน</th><th>หน่วย</th><th>คลัง</th></tr></thead><tbody>${body}</tbody></table>
        <div class="foot"><div><b>ผู้ส่ง :</b> ____________</div><div><b>ผู้รับ :</b> ____________</div></div>
        </body></html>`);
      win.document.close();
    },
  },
};
</script>

<style scoped>
.po-page { font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif; color: var(--text); font-size: 13px; position: relative; margin-top: 12px; background: var(--surface); border: 1px solid var(--field-border); border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
.po-titlebar { background: transparent; color: var(--text); font-weight: 700; padding: 18px 20px 2px; font-size: 18px; }
.po-head { display: flex; flex-wrap: wrap; gap: 22px; padding: 20px; border-bottom: 1px solid var(--field-border); }
.po-head-col { display: flex; flex-direction: column; gap: 8px; }
.po-head-col-wide { flex: 1; min-width: 220px; }
.po-field { display: flex; align-items: flex-start; gap: 8px; }
.po-field > label { min-width: 96px; text-align: right; padding-top: 6px; color: var(--muted); font-size: 12px; font-weight: 600; }
.po-field input, .po-field select { height: 36px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 13px; font-family: inherit; background: var(--surface); color: var(--text); min-width: 150px; transition: border-color .2s, box-shadow .2s; }
.po-field textarea { width: 100%; resize: vertical; padding: 8px 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 13px; font-family: inherit; background: var(--surface); color: var(--text); }
.po-field input:focus, .po-field select:focus, .po-field textarea:focus { outline: none; border-color: #2F65F6; box-shadow: 0 0 0 3px rgba(47,101,246,.12); }
.po-ro { background: var(--field) !important; font-weight: 700; }
.dy-pick-btn { padding: 7px 14px; border: 1px solid var(--field-border); border-radius: 7px; background: var(--surface); color: var(--text); cursor: pointer; font-weight: 600; font-family: inherit; }
.dy-pick-btn:hover { background: var(--field); }

.po-items { padding: 12px 16px; min-height: 120px; overflow-x: auto; }
.po-item-table { width: 100%; border-collapse: collapse; min-width: 1100px; }
.po-item-table th { text-align: center; font-size: 12px; color: #fff; background: #3c4453; padding: 10px 8px; font-weight: 600; letter-spacing: .3px; border-right: 1px solid rgba(255,255,255,.18); white-space: nowrap; }
.po-item-table th:last-child { border-right: none; }
.po-item-table td { padding: 5px 6px; border-bottom: 1px solid var(--field-border); }
.po-item-table input { width: 100%; height: 32px; padding: 0 9px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12.5px; font-family: inherit; background: var(--surface); color: var(--text); transition: border-color .2s, box-shadow .2s; }
.po-item-table input:focus { outline: none; border-color: #2F65F6; box-shadow: 0 0 0 3px rgba(47,101,246,.12); }
.po-num { text-align: right; }
.po-ro-cell { background: var(--field); }
.po-no { text-align: center; color: var(--muted); }
.po-empty { text-align: center; color: var(--muted); padding: 26px; }
.po-row-actions { display: flex; justify-content: center; }
.po-ic { width: 28px; height: 28px; border-radius: 7px; border: 1px solid var(--field-border); background: var(--field); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; padding: 0; transition: background .15s, border-color .15s; }
.po-ic svg { width: 15px; height: 15px; }
.po-del { color: #e03131; } .po-del:hover { background: #fdeaea; border-color: #e03131; }

.po-footer { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-top: 1px solid var(--field-border); background: var(--field); border-radius: 0 0 14px 14px; }
.po-saved-msg { color: #1a9c54; font-size: 13px; font-weight: 600; }
.po-footer-btns { display: flex; gap: 10px; margin-left: auto; }
.po-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; border: 1px solid var(--field-border); border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 13px; background: #e7eaf1; color: var(--text); transition: background .2s, border-color .2s; }
.po-btn:hover { background: #dde1ea; border-color: #c7cede; }
.po-btn-save { background: #1a9c54; color: #fff; border-color: #1a9c54; }
.po-btn-save:hover { background: #158045; border-color: #158045; }
.po-btn-receipt { background: #3c4453; color: #fff; border-color: #3c4453; }
.po-btn-receipt:hover { background: #2d333f; }
.po-btn-new { background: #1a9c54; color: #fff; border-color: #1a9c54; }
.po-btn-new:hover { background: #158045; }
.po-page input:not([type="checkbox"]), .po-page select, .po-page textarea { background: var(--field); }
.po-page input:focus, .po-page select:focus, .po-page textarea:focus { background: var(--surface); }

/* Drawer เลือกผ้าดิบ */
.dy-drawer-wrap { position: fixed; inset: 0; z-index: 3300; }
.dy-drawer-backdrop { position: absolute; inset: 0; background: rgba(15,23,42,0.4); }
.dy-drawer { position: absolute; top: 0; right: 0; height: 100%; width: 520px; max-width: 92vw; background: var(--surface); box-shadow: -8px 0 30px rgba(0,0,0,0.2); display: flex; flex-direction: column; }
.dy-drawer-head { background: #3c4453; color: #fff; padding: 14px 18px; font-weight: 700; display: flex; justify-content: space-between; align-items: center; }
.dy-x { background: none; border: none; color: #fff; font-size: 17px; cursor: pointer; }
.dy-drawer-search { display: flex; gap: 8px; padding: 12px 16px; border-bottom: 1px solid var(--field-border); }
.dy-drawer-search input { flex: 1; padding: 8px 10px; border: 1px solid var(--field-border); border-radius: 6px; background: var(--field); color: var(--text); font-family: inherit; }
.dy-drawer-list { flex: 1; overflow-y: auto; padding: 8px 16px; }
.dy-drawer-list table { width: 100%; border-collapse: collapse; }
.dy-drawer-list th { text-align: left; font-size: 12px; color: var(--muted); border-bottom: 1px solid var(--field-border); padding: 6px; }
.dy-drawer-list td { padding: 6px; border-bottom: 1px solid var(--field-border); font-size: 12.5px; }
.dy-select-btn { padding: 4px 12px; border: 1px solid #1a9c54; background: #1a9c54; color: #fff; border-radius: 5px; cursor: pointer; font-family: inherit; }
.dy-empty { text-align: center; color: var(--muted); padding: 20px; }
.dy-drawer-foot { padding: 12px 16px; border-top: 1px solid var(--field-border); text-align: right; }
.dy-slide-enter-active, .dy-slide-leave-active { transition: opacity 0.2s; }
.dy-slide-enter-from, .dy-slide-leave-to { opacity: 0; }
</style>
