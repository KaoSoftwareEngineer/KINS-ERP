<template>
<div class="dy-page">
  <div class="po-titlebar">สั่งย้อม</div>

  <!-- ส่วนหัว -->
  <div class="po-head">
    <div class="po-head-col">
      <div class="po-field"><label>วันที่</label><input type="date" v-model="form.dye_date" /></div>
      <div class="po-field"><label>เลขที่ย้ายสินค้า</label><input :value="form.dye_no" readonly class="po-ro" /></div>
    </div>
    <div class="po-head-col">
      <div class="po-field"><label>โรงงาน</label>
        <select v-model="form.factory"><option value="">— เลือก —</option><option>D Finest</option><option v-for="f in factoryOptions" :key="f" :value="f">{{ f }}</option></select>
      </div>
    </div>
    <div class="po-head-col">
      <div class="po-field"><label>เลขที่อ้างอิง</label><input v-model="form.ref_no" /></div>
      <div class="po-field"><label>วันที่จัดส่ง</label><input type="date" v-model="form.ship_date" /></div>
    </div>
    <div class="po-head-col">
      <label class="po-approve"><input type="checkbox" v-model="form.approved" /> อนุมัติ</label>
      <button class="dy-pick-btn" @click="openDrawer">☰ เลือกผ้าดิบ</button>
    </div>
  </div>

  <!-- แถวข้อมูลผ้าดิบที่เลือก -->
  <div class="dy-block">
    <div class="dy-grid dy-grid-raw">
      <div class="dy-h">รหัสผ้าดิบ</div><div class="dy-h">ชื่อ</div><div class="dy-h">หน้ากว้าง</div><div class="dy-h">ต้นทาง</div>
      <div class="dy-h">Shrinkage (%)</div><div class="dy-h">Allowance (%)</div><div class="dy-h">เลขที่ล็อต</div>
      <div class="dy-h">จำนวนสต็อก</div><div class="dy-h">จำนวนที่ต้องการ</div><div class="dy-h">หน่วย</div>
      <div>{{ raw.code || '-' }}</div><div>{{ raw.name || '' }}</div><div>{{ raw.width || '' }}</div><div>{{ raw.source || '' }}</div>
      <div><input v-model.number="raw.shrinkage" class="dy-mini" /></div>
      <div><input v-model.number="raw.allowance" class="dy-mini" /></div>
      <div><input v-model="raw.lot" class="dy-mini" /></div>
      <div>{{ raw.stock || '' }}</div>
      <div><input v-model.number="raw.needed" class="dy-mini" /></div>
      <div>{{ raw.unit || 'หลา' }}</div>
    </div>
  </div>

  <!-- แถวข้อมูลสินค้า (ผลลัพธ์ย้อม) -->
  <div class="dy-block">
    <div class="dy-grid dy-grid-prod">
      <div class="dy-h">รหัสสินค้า</div><div class="dy-h">ชื่อ</div><div class="dy-h">หน้ากว้าง</div><div class="dy-h">ส่วนประกอบ</div>
      <div class="dy-h">โครงสร้างผ้า</div><div class="dy-h">Finishing</div><div class="dy-h">คำอธิบาย</div>
      <div><input v-model="product.sku" @blur="lookupProduct" class="dy-cell" placeholder="รหัส" /></div>
      <div><input v-model="product.name" class="dy-cell po-ro-cell" /></div>
      <div><input v-model="product.width" class="dy-cell po-ro-cell" /></div>
      <div><input v-model="product.composition" class="dy-cell po-ro-cell" /></div>
      <div><input v-model="product.structure" class="dy-cell po-ro-cell" /></div>
      <div><input v-model="product.finishing" class="dy-cell po-ro-cell" /></div>
      <div><input v-model="product.description" class="dy-cell po-ro-cell" /></div>
    </div>
  </div>

  <!-- ตารางเฉดสี -->
  <div class="po-items">
    <table class="po-item-table">
      <thead><tr>
        <th style="width:36px;">ที่</th><th>รหัสสี</th><th>เฉดสี</th><th>จำนวน</th><th>ราคา/หน่วย</th><th>ราคา</th><th>หมายเหตุ</th><th style="width:70px;"></th>
      </tr></thead>
      <tbody>
        <tr v-for="(row, idx) in items" :key="row._key">
          <td class="po-no">{{ idx + 1 }}</td>
          <td><input v-model="row.color_code" placeholder="รหัสสี" /></td>
          <td><input v-model="row.shade" placeholder="เฉดสี" /></td>
          <td><input type="number" v-model.number="row.qty" class="po-num" /></td>
          <td><input type="number" v-model.number="row.unit_price" class="po-num" /></td>
          <td><input :value="lineTotal(row).toFixed(2)" readonly class="po-num po-ro-cell" /></td>
          <td><input v-model="row.note" placeholder="หมายเหตุ" /></td>
          <td class="po-row-actions">
            <button class="po-ic po-add" @click="addRow(idx)">＋</button>
            <button class="po-ic po-del" @click="removeRow(idx)">－</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="po-summary">
      <div class="po-sum-row"><label>รวม</label><input :value="subtotal.toFixed(2)" readonly class="po-num po-ro-cell" /></div>
      <div class="po-sum-row">
        <label>ส่วนลด</label>
        <select v-model="discountMode"><option value="none">None</option><option value="percent">%</option><option value="amount">บาท</option></select>
        <input type="number" v-model.number="discountValue" :disabled="discountMode==='none'" class="po-num" />
        <input :value="discountAmount.toFixed(2)" readonly class="po-num po-ro-cell" />
      </div>
      <div class="po-sum-row"><label>VAT</label><select v-model="vatMode"><option value="none">None</option><option value="7">7%</option></select><input :value="vatAmount.toFixed(2)" readonly class="po-num po-ro-cell" /></div>
      <div class="po-sum-row po-sum-net"><label>ยอดสุทธิ</label><input :value="netTotal.toFixed(2)" readonly class="po-num po-ro-cell" /></div>
    </div>
  </div>

  <!-- Sample / Packing / Stamping / หมายเหตุ -->
  <div class="dy-extra">
    <div class="dy-ex-col">
      <div class="dy-ex-title">Sample</div>
      <label class="dy-chk"><input type="checkbox" v-model="sample.book" /> Book</label><input class="dy-set" v-model="sample.bookSet" :disabled="!sample.book" /> <span class="dy-unit">Set(s)</span>
      <label class="dy-chk"><input type="checkbox" v-model="sample.hanger" /> Hanger</label><input class="dy-set" v-model="sample.hangerSet" :disabled="!sample.hanger" /> <span class="dy-unit">Set(s)</span>
      <label class="dy-chk"><input type="checkbox" v-model="sample.yards" /> Yards</label><input class="dy-set" v-model="sample.yardsSet" :disabled="!sample.yards" /> <span class="dy-unit">Set(s)</span>
    </div>
    <div class="dy-ex-col">
      <div class="dy-ex-title">Packing</div>
      <div class="dy-ex-field"><label>Make up</label><input v-model="packing.makeup" /></div>
      <div class="dy-ex-field"><label>Wrapping</label><input v-model="packing.wrapping" /></div>
      <div class="dy-ex-field"><label>Method</label><input v-model="packing.method" /></div>
    </div>
    <div class="dy-ex-col">
      <div class="dy-ex-title">Stamping on Piece</div>
      <div class="dy-ex-field"><label>Stamping</label><input v-model="stamping.stamping" /></div>
      <div class="dy-ex-field"><label>Hang Tag</label><select v-model="stamping.hangTag"><option>No</option><option>Yes</option></select></div>
      <div class="dy-ex-field"><label>Dyeing Mill Label</label><select v-model="stamping.millLabel"><option>No</option><option>Yes</option></select></div>
      <div class="dy-ex-field"><label>Dyeing Method</label><input v-model="stamping.dyeingMethod" /></div>
    </div>
    <div class="dy-ex-col dy-ex-col-wide">
      <div class="dy-ex-title">หมายเหตุ</div>
      <select v-model="remarkPreset" @change="applyRemarkPreset"><option value="">เลือก</option><option>ด่วน</option><option>ตัวอย่างก่อน</option><option>ตามสเปกลูกค้า</option></select>
      <textarea v-model="form.remark" rows="4"></textarea>
    </div>
  </div>

  <!-- แถบล่าง -->
  <div class="po-footer">
    <span v-if="savedMsg" class="po-saved-msg">{{ savedMsg }}</span>
    <div class="po-footer-btns">
      <button class="po-btn" @click="dash.fbFail('ตัวอย่างรายงาน (ยังไม่เชื่อมระบบพิมพ์รายงานจริง)')">👁 รายงาน</button>
      <button class="po-btn po-btn-save" @click="save">💾 บันทึก</button>
    </div>
  </div>

  <!-- Drawer เลือกผ้าดิบ -->
  <transition name="dy-slide">
    <div v-if="drawerOpen" class="dy-drawer-wrap">
      <div class="dy-drawer-backdrop" @click="drawerOpen = false"></div>
      <div class="dy-drawer">
        <div class="dy-drawer-head"><span>เลือกผ้าดิบ</span><button class="dy-x" @click="drawerOpen = false">✕</button></div>
        <div class="dy-drawer-search">
          <input v-model="drawerSearch" placeholder="รหัสสินค้า" />
          <select v-model="drawerFactory"><option>D Finest</option></select>
          <button class="dy-btn-search" @click="() => {}">🔍 ค้นหา</button>
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
  name: 'PoDyeOrderPage',
  inject: ['dash'],
  data() {
    return {
      form: { dye_no: '', dye_date: new Date().toISOString().slice(0, 10), factory: '', ref_no: '', ship_date: '', approved: false, remark: '' },
      raw: { code: '', name: '', width: '', source: '', shrinkage: null, allowance: null, lot: '', stock: '', needed: null, unit: 'หลา' },
      product: { sku: '', name: '', width: '', composition: '', structure: '', finishing: '', description: '' },
      items: [this.newRow()],
      discountMode: 'none', discountValue: 0, vatMode: 'none',
      sample: { book: false, bookSet: '', hanger: false, hangerSet: '', yards: false, yardsSet: '' },
      packing: { makeup: '', wrapping: '', method: '' },
      stamping: { stamping: '', hangTag: 'No', millLabel: 'No', dyeingMethod: '' },
      remarkPreset: '',
      fabrics: [], factoryOptions: [], savedMsg: '', _seq: 1,
      drawerOpen: false, drawerSearch: '', drawerFactory: 'D Finest',
    };
  },
  computed: {
    subtotal() { return this.items.reduce((s, r) => s + this.lineTotal(r), 0); },
    discountAmount() {
      if (this.discountMode === 'percent') return this.subtotal * (Number(this.discountValue) || 0) / 100;
      if (this.discountMode === 'amount') return Number(this.discountValue) || 0;
      return 0;
    },
    afterDiscount() { return Math.max(0, this.subtotal - this.discountAmount); },
    vatAmount() { return this.vatMode === '7' ? this.afterDiscount * 0.07 : 0; },
    netTotal() { return this.afterDiscount + this.vatAmount; },
    drawerFiltered() {
      const q = (this.drawerSearch || '').trim().toLowerCase();
      let list = this.fabrics;
      if (q) list = list.filter(f => (f.sku || '').toLowerCase().includes(q) || (f.name || '').toLowerCase().includes(q));
      return list.slice(0, 50);
    },
  },
  async mounted() { await this.loadNextNo(); this.loadFabrics(); },
  methods: {
    newRow() { return { _key: (this._seq = (this._seq || 0) + 1), color_code: '', shade: '', qty: null, unit_price: null, note: '' }; },
    lineTotal(r) { return (Number(r.qty) || 0) * (Number(r.unit_price) || 0); },
    addRow(idx) { this.items.splice(idx + 1, 0, this.newRow()); },
    removeRow(idx) { if (this.items.length > 1) this.items.splice(idx, 1); },
    applyRemarkPreset() { if (this.remarkPreset) this.form.remark = (this.form.remark ? this.form.remark + '\n' : '') + this.remarkPreset; },
    async loadNextNo() {
      try { const res = await fetch('/api/dye-orders/next-no', { headers: { Authorization: 'Bearer ' + this.dash.token } }); const d = await res.json(); if (d.ok) this.form.dye_no = d.dye_no; } catch (e) {}
    },
    async loadFabrics() {
      try { const res = await fetch('/api/fabrics', { headers: { Authorization: 'Bearer ' + this.dash.token } }); const d = await res.json(); this.fabrics = d.fabrics || []; } catch (e) {}
    },
    openDrawer() { this.drawerOpen = true; },
    selectRaw(f) {
      this.raw.code = f.sku || ''; this.raw.name = f.name || ''; this.raw.width = f.width || '';
      this.raw.source = f.structure || ''; this.raw.unit = f.unit || 'หลา';
      // เติมข้อมูลสินค้า (ผลย้อม) จากผ้าดิบเดียวกันเป็นค่าเริ่มต้น
      this.product.sku = f.sku || ''; this.product.name = f.name || ''; this.product.width = f.width || '';
      this.product.composition = f.composition || ''; this.product.structure = f.structure || ''; this.product.finishing = f.finishing || '';
      this.drawerOpen = false;
    },
    lookupProduct() {
      const f = this.fabrics.find(x => (x.sku || '').toLowerCase() === (this.product.sku || '').trim().toLowerCase());
      if (f) { this.product.name = f.name || ''; this.product.width = f.width || ''; this.product.composition = f.composition || ''; this.product.structure = f.structure || ''; this.product.finishing = f.finishing || ''; }
    },
    async save() {
      if (!this.items.some(r => (r.color_code || '').trim() || (r.shade || '').trim())) { this.dash.fbFail('กรุณากรอกรายการเฉดสีอย่างน้อย 1 รายการ'); return; }
      this.dash.fbLoading('กำลังบันทึก...');
      const payload = {
        ...this.form, raw: this.raw, product: this.product,
        items: this.items.map(r => ({ color_code: r.color_code, shade: r.shade, qty: r.qty, unit_price: r.unit_price, total: this.lineTotal(r), note: r.note })),
        sample: this.sample, packing: this.packing, stamping: this.stamping,
        subtotal: this.subtotal, discount: this.discountAmount, vat: this.vatAmount, net_total: this.netTotal,
      };
      try {
        const res = await fetch('/api/dye-orders', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.dash.token }, body: JSON.stringify(payload) });
        if (res.status === 401) { this.dash.fbHide(); this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) { this.form.dye_no = d.dye_no; this.savedMsg = 'ระบบได้ทำการเพิ่มข้อมูลเรียบร้อยแล้ว'; this.dash.fbDone('บันทึกแล้ว'); }
        else { this.dash.fbFail(d.message || 'บันทึกไม่สำเร็จ'); }
      } catch (e) { this.dash.fbFail('บันทึกไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
    },
  },
};
</script>

<style scoped>
.dy-page { font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif; color: var(--text); font-size: 13px; position: relative; }
.po-titlebar { background: #1e3a8a; color: #fff; font-weight: 700; padding: 8px 16px; border-radius: 6px 6px 0 0; }
.po-head { display: flex; flex-wrap: wrap; gap: 22px; padding: 16px; background: var(--field); border: 1px solid var(--field-border); }
.po-head-col { display: flex; flex-direction: column; gap: 8px; }
.po-field { display: flex; align-items: center; gap: 8px; }
.po-field > label { min-width: 96px; text-align: right; color: var(--muted); font-size: 12.5px; }
.po-field input, .po-field select { padding: 6px 9px; border: 1px solid var(--field-border); border-radius: 6px; font-size: 13px; font-family: inherit; background: var(--surface); color: var(--text); min-width: 140px; }
.po-ro { background: var(--field) !important; font-weight: 700; }
.po-approve { display: flex; align-items: center; gap: 6px; font-size: 13px; cursor: pointer; }
.dy-pick-btn { padding: 7px 14px; border: 1px solid var(--field-border); border-radius: 7px; background: var(--surface); color: var(--text); cursor: pointer; font-weight: 600; font-family: inherit; }
.dy-pick-btn:hover { background: var(--field); }

.dy-block { padding: 8px 16px; overflow-x: auto; }
.dy-grid { display: grid; gap: 1px; background: var(--field-border); border: 1px solid var(--field-border); min-width: 900px; }
.dy-grid > div { background: var(--surface); padding: 6px 8px; font-size: 12px; }
.dy-grid-raw { grid-template-columns: repeat(10, 1fr); }
.dy-grid-prod { grid-template-columns: repeat(7, 1fr); }
.dy-h { background: var(--field) !important; font-weight: 600; color: var(--muted); text-align: center; }
.dy-mini, .dy-cell { width: 100%; padding: 3px 5px; border: 1px solid var(--field-border); border-radius: 4px; font-size: 12px; font-family: inherit; background: var(--surface); color: var(--text); }
.po-ro-cell { background: var(--field); }

.po-items { padding: 12px 16px; }
.po-item-table { width: 100%; border-collapse: collapse; }
.po-item-table th { text-align: center; font-size: 12px; color: var(--muted); border-bottom: 2px solid var(--field-border); padding: 6px 4px; font-weight: 600; }
.po-item-table td { padding: 4px; border-bottom: 1px solid var(--field-border); }
.po-item-table input { width: 100%; padding: 5px 7px; border: 1px solid var(--field-border); border-radius: 5px; font-size: 12.5px; font-family: inherit; background: var(--surface); color: var(--text); }
.po-num { text-align: right; } .po-no { text-align: center; color: var(--muted); }
.po-row-actions { display: flex; gap: 4px; justify-content: center; }
.po-ic { width: 24px; height: 24px; border-radius: 50%; border: none; color: #fff; cursor: pointer; font-size: 14px; }
.po-add { background: #1a9c54; } .po-del { background: #e03131; }
.po-summary { margin-top: 12px; max-width: 560px; margin-left: auto; display: flex; flex-direction: column; gap: 6px; }
.po-sum-row { display: flex; align-items: center; gap: 8px; justify-content: flex-end; }
.po-sum-row > label { min-width: 70px; text-align: right; color: var(--muted); }
.po-sum-row input, .po-sum-row select { padding: 5px 8px; border: 1px solid var(--field-border); border-radius: 5px; font-size: 12.5px; background: var(--surface); color: var(--text); }
.po-sum-row input.po-num { width: 150px; }
.po-sum-net input { font-weight: 700; }

.dy-extra { display: flex; flex-wrap: wrap; gap: 26px; padding: 16px; border-top: 1px solid var(--field-border); }
.dy-ex-col { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.dy-ex-col-wide { flex: 1; min-width: 240px; }
.dy-ex-title { font-weight: 700; font-size: 13px; margin-bottom: 2px; }
.dy-chk { display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px; }
.dy-set { width: 70px; padding: 4px 6px; border: 1px solid var(--field-border); border-radius: 5px; background: var(--surface); color: var(--text); }
.dy-unit { font-size: 12px; color: var(--muted); }
.dy-ex-field { display: flex; align-items: center; gap: 8px; }
.dy-ex-field > label { min-width: 130px; text-align: right; font-size: 12px; color: var(--muted); }
.dy-ex-field input, .dy-ex-field select { padding: 5px 8px; border: 1px solid var(--field-border); border-radius: 5px; font-size: 12.5px; background: var(--surface); color: var(--text); }
.dy-ex-col-wide select { padding: 5px 8px; border: 1px solid var(--field-border); border-radius: 5px; background: var(--surface); color: var(--text); }
.dy-ex-col-wide textarea { width: 100%; padding: 6px 8px; border: 1px solid var(--field-border); border-radius: 6px; font-family: inherit; font-size: 12.5px; background: var(--surface); color: var(--text); resize: vertical; }

.po-footer { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-top: 1px solid var(--field-border); }
.po-saved-msg { color: #1a9c54; font-size: 13px; font-weight: 600; }
.po-footer-btns { display: flex; gap: 10px; margin-left: auto; }
.po-btn { padding: 8px 18px; border: 1px solid var(--field-border); border-radius: 7px; font-weight: 700; cursor: pointer; font-family: inherit; font-size: 13px; background: var(--surface); color: var(--text); }
.po-btn-save { background: #1a9c54; color: #fff; border-color: #1a9c54; }

/* Drawer */
.dy-drawer-wrap { position: fixed; inset: 0; z-index: 3300; }
.dy-drawer-backdrop { position: absolute; inset: 0; background: rgba(15,23,42,0.4); }
.dy-drawer { position: absolute; top: 0; right: 0; height: 100%; width: 560px; max-width: 92vw; background: var(--surface); box-shadow: -8px 0 30px rgba(0,0,0,0.2); display: flex; flex-direction: column; }
.dy-drawer-head { background: #1e3a8a; color: #fff; padding: 13px 18px; font-weight: 700; display: flex; justify-content: space-between; align-items: center; }
.dy-x { background: none; border: none; color: #fff; font-size: 17px; cursor: pointer; }
.dy-drawer-search { display: flex; gap: 8px; padding: 12px 16px; border-bottom: 1px solid var(--field-border); }
.dy-drawer-search input, .dy-drawer-search select { padding: 7px 10px; border: 1px solid var(--field-border); border-radius: 6px; background: var(--surface); color: var(--text); }
.dy-btn-search { padding: 7px 14px; border: 1px solid #1e3a8a; background: #1e3a8a; color: #fff; border-radius: 6px; cursor: pointer; font-family: inherit; }
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
