<template>
<div class="po-page">
  <div class="po-titlebar">📥 รับผ้าสำเร็จ</div>

  <!-- ส่วนหัว -->
  <div class="po-head">
    <div class="po-head-col">
      <div class="po-field"><label>วันที่</label><input type="date" v-model="form.receipt_date" /></div>
      <div class="po-field"><label>เลขที่รับสินค้า</label><input :value="form.in_no" readonly class="po-ro" /></div>
    </div>
    <div class="po-head-col">
      <div class="po-field"><label>ประเภทการรับ</label>
        <select v-model="form.receipt_type"><option v-for="t in receiptTypes" :key="t" :value="t">{{ t }}</option></select>
      </div>
      <div class="po-field"><label>คลัง</label>
        <select v-model="form.warehouse"><option v-for="w in warehouseOptions" :key="w" :value="w">{{ w }}</option></select>
      </div>
    </div>
    <div class="po-head-col">
      <div class="po-field"><label>เลขที่อ้างอิง PO</label>
        <input list="gr-po-list" v-model="form.po_ref" placeholder="เลือก/พิมพ์เลขที่ PO" />
        <datalist id="gr-po-list"><option v-for="p in poOptions" :key="p" :value="p" /></datalist>
      </div>
      <div class="po-field"><label>คู่ค้า</label>
        <input list="gr-vendors" v-model="form.supplier" placeholder="เลือก/พิมพ์คู่ค้า" />
        <datalist id="gr-vendors"><option v-for="v in vendorOptions" :key="v" :value="v" /></datalist>
      </div>
    </div>
    <div class="po-head-col">
      <div class="po-field"><label>เลขที่บิล</label><input v-model="form.bill_no" placeholder="เลขที่บิล" /></div>
    </div>
    <div class="po-head-col po-head-col-wide">
      <div class="po-field"><label>หมายเหตุ</label><textarea v-model="form.remark" rows="3"></textarea></div>
    </div>
  </div>

  <!-- ตารางรายการ -->
  <div class="po-items">
    <table class="po-item-table">
      <thead>
        <tr>
          <th style="width:40px;">ที่</th>
          <th>รหัสสินค้า</th><th>รหัสสี</th><th>ชื่อ</th><th>หน้ากว้าง</th><th>พับ</th>
          <th>จำนวน</th><th>ราคา/หน่วย</th><th>ราคา</th>
          <th style="width:96px;"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in items" :key="row._key">
          <td class="po-no">{{ idx + 1 }}</td>
          <td><input v-model="row.sku" @blur="lookupSku(row)" placeholder="รหัส" /></td>
          <td>
            <select v-if="row.shadeOptions && row.shadeOptions.length" v-model="row.color">
              <option value="">— เลือกสี —</option>
              <option v-for="s in row.shadeOptions" :key="s" :value="s">{{ s }}</option>
            </select>
            <input v-else v-model="row.color" placeholder="รหัสสี" />
          </td>
          <td><input v-model="row.name" class="po-ro-cell" placeholder="ชื่อ" /></td>
          <td><input v-model="row.width" class="po-ro-cell" placeholder="หน้ากว้าง" /></td>
          <td><input v-model="row.fold" placeholder="พับ" /></td>
          <td><input type="number" v-model.number="row.qty" class="po-num" /></td>
          <td><input type="number" v-model.number="row.unit_price" class="po-num" /></td>
          <td><input :value="lineTotal(row).toFixed(2)" readonly class="po-num po-ro-cell" /></td>
          <td class="po-row-actions">
            <button class="po-ic po-add" title="เพิ่มแถว" @click="addRow(idx)">＋</button>
            <button class="po-ic po-del" title="ลบแถว" @click="removeRow(idx)">－</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- สรุปยอด -->
    <div class="po-summary">
      <div class="po-sum-row"><label>รวม</label><input :value="subtotal.toFixed(2)" readonly class="po-num po-ro-cell" /></div>
      <div class="po-sum-row">
        <label>ส่วนลด</label>
        <select v-model="discountMode"><option value="none">None</option><option value="percent">%</option><option value="amount">บาท</option></select>
        <input type="number" v-model.number="discountValue" :disabled="discountMode==='none'" class="po-num" />
        <input :value="discountAmount.toFixed(2)" readonly class="po-num po-ro-cell" />
      </div>
      <div class="po-sum-row">
        <label>VAT</label>
        <select v-model="vatMode"><option value="none">None</option><option value="7">7%</option></select>
        <input :value="vatAmount.toFixed(2)" readonly class="po-num po-ro-cell" />
      </div>
      <div class="po-sum-row po-sum-net"><label>ยอดสุทธิ</label><input :value="netTotal.toFixed(2)" readonly class="po-num po-ro-cell" /></div>
    </div>
  </div>

  <!-- แถบล่าง -->
  <div class="po-footer">
    <span v-if="savedMsg" class="po-saved-msg">{{ savedMsg }}</span>
    <div class="po-footer-btns">
      <button class="po-btn po-btn-report" @click="dash.fbFail('ตัวอย่างรายงาน (ยังไม่เชื่อมระบบพิมพ์รายงานจริง)')">👁 รายงาน</button>
      <button class="po-btn po-btn-save" @click="save">💾 บันทึก</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'GoodsFinishedReceivePage',
  inject: ['dash'],
  data() {
    return {
      form: { in_no: '', receipt_date: new Date().toISOString().slice(0, 10), receipt_type: 'Purchase', warehouse: 'Warehouse', po_ref: '', supplier: '', bill_no: '', remark: '' },
      items: [this.newRow()],
      receiptTypes: ['Purchase', 'Production', 'Return', 'Transfer'],
      warehouseOptions: ['Warehouse', 'Factory'],
      discountMode: 'none', discountValue: 0, vatMode: 'none',
      fabrics: [], vendorOptions: ['D Finest'], poOptions: [],
      savedMsg: '', _seq: 1,
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
  },
  async mounted() {
    await this.loadNextNo();
    this.loadRefs();
  },
  methods: {
    newRow() { return { _key: (this._seq = (this._seq || 0) + 1), sku: '', color: '', name: '', width: '', fold: '', qty: null, unit_price: null, shadeOptions: [] }; },
    lineTotal(r) { return (Number(r.qty) || 0) * (Number(r.unit_price) || 0); },
    addRow(idx) { this.items.splice(idx + 1, 0, this.newRow()); },
    removeRow(idx) { if (this.items.length > 1) this.items.splice(idx, 1); },
    async loadNextNo() {
      try {
        const res = await fetch('/api/finished-receipts/next-no', { headers: { Authorization: 'Bearer ' + this.dash.token } });
        const d = await res.json();
        if (d.ok) this.form.in_no = d.in_no;
      } catch (e) {}
    },
    async loadRefs() {
      try {
        const res = await fetch('/api/fabrics', { headers: { Authorization: 'Bearer ' + this.dash.token } });
        const d = await res.json();
        this.fabrics = d.fabrics || [];
      } catch (e) {}
      try {
        const r2 = await fetch('/api/partners', { headers: { Authorization: 'Bearer ' + this.dash.token } });
        const d2 = await r2.json();
        if (d2.ok && d2.items && d2.items.length) this.vendorOptions = d2.items.map(p => p.name);
      } catch (e) {}
      try {
        const r3 = await fetch('/api/purchase-orders', { headers: { Authorization: 'Bearer ' + this.dash.token } });
        const d3 = await r3.json();
        if (d3.ok) this.poOptions = (d3.orders || []).map(o => o.po_no).filter(Boolean);
      } catch (e) {}
    },
    async lookupSku(row) {
      if (!row.sku) return;
      const f = this.fabrics.find(x => (x.sku || '').toLowerCase() === row.sku.trim().toLowerCase());
      if (!f) return;
      row.name = f.name || ''; row.width = f.width || '';
      try {
        const res = await fetch(`/api/fabrics/${f.id}/shades`, { headers: { Authorization: 'Bearer ' + this.dash.token } });
        const d = await res.json();
        row.shadeOptions = (d.shades || []).map(s => s.name);
      } catch (e) { row.shadeOptions = []; }
    },
    async save() {
      const hasItem = this.items.some(r => (r.sku || '').trim());
      if (!hasItem) { this.dash.fbFail('กรุณากรอกรายการสินค้าอย่างน้อย 1 รายการ'); return; }
      this.dash.fbLoading('กำลังบันทึก...');
      const payload = {
        ...this.form,
        subtotal: this.subtotal, discount: this.discountAmount, vat: this.vatAmount, net_total: this.netTotal,
        items: this.items.map(r => ({ sku: r.sku, color: r.color, name: r.name, width: r.width, fold: r.fold, qty: r.qty, unit_price: r.unit_price, total: this.lineTotal(r) })),
      };
      try {
        const res = await fetch('/api/finished-receipts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.dash.token },
          body: JSON.stringify(payload),
        });
        if (res.status === 401) { this.dash.fbHide(); this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) {
          this.form.in_no = d.in_no;
          this.savedMsg = 'ระบบได้ทำการเพิ่มข้อมูลเรียบร้อยแล้ว';
          this.dash.fbDone('บันทึกแล้ว');
        } else { this.dash.fbFail(d.message || 'บันทึกไม่สำเร็จ'); }
      } catch (e) { this.dash.fbFail('บันทึกไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
    },
  },
};
</script>

<style scoped>
.po-page { font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif; color: var(--text); font-size: 13px; margin-top: 12px; background: var(--surface); border: 1px solid var(--field-border); border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
.po-titlebar { background: transparent; color: var(--text); font-weight: 700; padding: 18px 20px 2px; font-size: 18px; }
.po-head { display: flex; flex-wrap: wrap; gap: 22px; padding: 20px; background: transparent; border: none; border-bottom: 1px solid var(--field-border); }
.po-head-col { display: flex; flex-direction: column; gap: 8px; }
.po-head-col-wide { flex: 1; min-width: 220px; }
.po-field { display: flex; align-items: flex-start; gap: 8px; }
.po-field > label { min-width: 96px; text-align: right; padding-top: 6px; color: var(--muted); font-size: 12px; font-weight: 600; }
.po-field input, .po-field select {
  height: 36px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 13px;
  font-family: inherit; background: var(--surface); color: var(--text); min-width: 150px;
  transition: border-color .2s, box-shadow .2s;
}
.po-field textarea {
  width: 100%; resize: vertical; padding: 8px 10px; border: 1px solid var(--field-border); border-radius: 8px;
  font-size: 13px; font-family: inherit; background: var(--surface); color: var(--text);
}
.po-field input:focus, .po-field select:focus, .po-field textarea:focus {
  outline: none; border-color: #2F65F6; box-shadow: 0 0 0 3px rgba(47,101,246,.12);
}
.po-ro { background: var(--field) !important; font-weight: 700; }

.po-items { padding: 12px 16px; }
.po-item-table { width: 100%; border-collapse: collapse; }
.po-item-table th { text-align: center; font-size: 12px; color: #fff; background: #3c4453; padding: 10px 8px; font-weight: 600; letter-spacing: .3px; border-right: 1px solid rgba(255,255,255,.18); }
.po-item-table th:last-child { border-right: none; }
.po-item-table td { padding: 5px 6px; border-bottom: 1px solid var(--field-border); }
.po-item-table input, .po-item-table select { width: 100%; height: 32px; padding: 0 9px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12.5px; font-family: inherit; background: var(--surface); color: var(--text); transition: border-color .2s, box-shadow .2s; }
.po-item-table input:focus, .po-item-table select:focus { outline: none; border-color: #2F65F6; box-shadow: 0 0 0 3px rgba(47,101,246,.12); }
.po-num { text-align: right; }
.po-ro-cell { background: var(--field); }
.po-no { text-align: center; color: var(--muted); }
.po-row-actions { display: flex; gap: 4px; justify-content: center; }
.po-ic { width: 24px; height: 24px; border-radius: 50%; border: none; color: #fff; cursor: pointer; font-size: 14px; line-height: 1; }
.po-add { background: #1a9c54; } .po-del { background: #e03131; }

.po-summary { margin-top: 12px; max-width: 560px; margin-left: auto; display: flex; flex-direction: column; gap: 6px; }
.po-sum-row { display: flex; align-items: center; gap: 8px; justify-content: flex-end; }
.po-sum-row > label { min-width: 70px; text-align: right; color: var(--muted); }
.po-sum-row input, .po-sum-row select { padding: 5px 8px; border: 1px solid var(--field-border); border-radius: 5px; font-size: 12.5px; background: var(--surface); color: var(--text); }
.po-sum-row input.po-num { width: 150px; }
.po-sum-net input { font-weight: 700; }

.po-footer { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-top: 1px solid var(--field-border); background: var(--field); border-radius: 0 0 14px 14px; }
.po-saved-msg { color: #1a9c54; font-size: 13px; font-weight: 600; }
.po-footer-btns { display: flex; gap: 10px; margin-left: auto; }
.po-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; border: 1px solid var(--field-border); border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 13px; background: #e7eaf1; color: var(--text); transition: background .2s, border-color .2s; }
.po-btn:hover { background: #dde1ea; border-color: #c7cede; }
.po-btn-save { background: #1a9c54; color: #fff; border-color: #1a9c54; }
.po-btn-save:hover { background: #158045; border-color: #158045; }

/* ช่องกรอกที่ยังว่าง — ใส่พื้นเทาอ่อนให้มองเห็นชัด */
.po-page input:not([type="checkbox"]), .po-page select, .po-page textarea { background: var(--field); }
.po-page input:focus, .po-page select:focus, .po-page textarea:focus { background: var(--surface); }
</style>
