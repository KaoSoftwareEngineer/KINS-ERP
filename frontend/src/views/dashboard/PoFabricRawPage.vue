<template>
<div class="po-page">
  <div class="po-titlebar">🧵 {{ dash.t[dash.lang].openPoTitle }} — {{ dash.t[dash.lang].rawFabricWord }}</div>

  <!-- ส่วนหัว -->
  <div class="po-head">
    <div class="po-head-col">
      <div class="po-field"><label>{{ dash.t[dash.lang].dateLabel }}</label><input type="date" v-model="form.po_date" /></div>
      <div class="po-field"><label>{{ dash.t[dash.lang].poNoLabel }}</label><input :value="form.po_no" readonly class="po-ro" /></div>
    </div>
    <div class="po-head-col">
      <div class="po-field"><label>{{ dash.t[dash.lang].partnerWord }}</label>
        <input list="por-vendors" v-model="form.vendor" :placeholder="dash.t[dash.lang].vendorPlaceholder" />
        <datalist id="por-vendors"><option v-for="v in vendorOptions" :key="v" :value="v" /></datalist>
      </div>
      <div class="po-field"><label>{{ dash.t[dash.lang].accountTermsLabel }}</label>
        <select v-model="form.account_term">
          <option value="">{{ dash.t[dash.lang].selectGenericOpt }}</option><option value="เงินสด">{{ dash.t[dash.lang].cashOptionWord }}</option><option value="เครดิต 30 วัน">{{ dash.t[dash.lang].credit30Word }}</option><option value="เครดิต 60 วัน">{{ dash.t[dash.lang].credit60Word }}</option>
        </select>
      </div>
      <div class="po-field"><label>{{ dash.t[dash.lang].shipToLabel }}</label>
        <select v-model="form.ship_to"><option value="">{{ dash.t[dash.lang].selectGenericOpt }}</option><option>Warehouse</option><option>Factory</option></select>
      </div>
    </div>
    <div class="po-head-col po-head-col-wide">
      <div class="po-field"><label>{{ dash.t[dash.lang].remarkLabel }}</label><textarea v-model="form.remark" rows="3"></textarea></div>
    </div>
    <div class="po-head-col">
      <div class="po-field"><label>{{ dash.t[dash.lang].refNoLabel }}</label><input v-model="form.ref_no" /></div>
      <div class="po-field"><label>{{ dash.t[dash.lang].shipDateLabel }}</label><input type="date" v-model="form.ship_date" /></div>
      <label class="po-approve"><input type="checkbox" v-model="form.approved" /> {{ dash.t[dash.lang].approveWord }}</label>
    </div>
  </div>

  <!-- ตารางรายการ -->
  <div class="po-items">
    <table class="po-item-table">
      <thead>
        <tr>
          <th style="width:36px;">{{ dash.lang === 'th' ? 'ที่' : 'No.' }}</th>
          <th>{{ dash.t[dash.lang].skuLabel }}</th><th>{{ dash.t[dash.lang].nameLabel }}</th><th>{{ dash.t[dash.lang].structureLabel }}</th><th>{{ dash.t[dash.lang].compositionLabel }}</th><th>{{ dash.t[dash.lang].widthLabel }}</th>
          <th>{{ dash.t[dash.lang].qtyLabel }}</th><th>{{ dash.t[dash.lang].pricePerUnitLabel }}</th><th>{{ dash.t[dash.lang].priceLabel }}</th><th>{{ dash.t[dash.lang].forFabricSkuLabel }}</th><th>{{ dash.t[dash.lang].colorCodeLabel }}</th>
          <th style="width:70px;"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in items" :key="row._key">
          <td class="po-no">{{ idx + 1 }}</td>
          <td><input v-model="row.sku" @blur="lookupSku(row)" :placeholder="dash.t[dash.lang].skuPlaceholderShort" /></td>
          <td><input v-model="row.name" class="po-ro-cell" :placeholder="dash.t[dash.lang].nameLabel" /></td>
          <td><input v-model="row.structure" class="po-ro-cell" :placeholder="dash.t[dash.lang].structureLabel" /></td>
          <td><input v-model="row.composition" class="po-ro-cell" :placeholder="dash.t[dash.lang].compositionLabel" /></td>
          <td><input v-model="row.width" class="po-ro-cell" :placeholder="dash.t[dash.lang].widthLabel" /></td>
          <td><input type="number" v-model.number="row.qty" class="po-num" /></td>
          <td><input type="number" v-model.number="row.unit_price" class="po-num" /></td>
          <td><input :value="lineTotal(row).toFixed(2)" readonly class="po-num po-ro-cell" /></td>
          <td><input v-model="row.for_sku" :placeholder="dash.t[dash.lang].fabricCodePlaceholder" /></td>
          <td>
            <select v-if="row.shadeOptions && row.shadeOptions.length" v-model="row.color">
              <option value="">{{ dash.t[dash.lang].selectColorOpt }}</option>
              <option v-for="s in row.shadeOptions" :key="s" :value="s">{{ s }}</option>
            </select>
            <input v-else v-model="row.color" :placeholder="dash.t[dash.lang].colorCodeLabel" />
          </td>
          <td class="po-row-actions">
            <button class="po-ic po-add" :title="dash.t[dash.lang].addRowTitle" @click="addRow(idx)">＋</button>
            <button class="po-ic po-del" :title="dash.t[dash.lang].removeRowTitle" @click="removeRow(idx)">－</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- สรุปยอด -->
    <div class="po-summary">
      <div class="po-sum-row"><label>{{ dash.t[dash.lang].totalWord }}</label><input :value="subtotal.toFixed(2)" readonly class="po-num po-ro-cell" /></div>
      <div class="po-sum-row">
        <label>{{ dash.t[dash.lang].discountLabel }}</label>
        <select v-model="discountMode"><option value="none">None</option><option value="percent">%</option><option value="amount">{{ dash.t[dash.lang].bahtWord }}</option></select>
        <input type="number" v-model.number="discountValue" :disabled="discountMode==='none'" class="po-num" />
        <input :value="discountAmount.toFixed(2)" readonly class="po-num po-ro-cell" />
      </div>
      <div class="po-sum-row">
        <label>VAT</label>
        <select v-model="vatMode"><option value="none">None</option><option value="7">7%</option></select>
        <input :value="vatAmount.toFixed(2)" readonly class="po-num po-ro-cell" />
      </div>
      <div class="po-sum-row po-sum-net"><label>{{ dash.t[dash.lang].netTotalLabel }}</label><input :value="netTotal.toFixed(2)" readonly class="po-num po-ro-cell" /></div>
    </div>
  </div>

  <!-- แถบล่าง -->
  <div class="po-footer">
    <span v-if="savedMsg" class="po-saved-msg">{{ savedMsg }}</span>
    <div class="po-footer-btns">
      <button class="po-btn po-btn-report" @click="openReport()">👁 {{ dash.t[dash.lang].reportBtnWord }}</button>
      <button class="po-btn po-btn-save" @click="save">💾 {{ dash.t[dash.lang].save }}</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'PoFabricRawPage',
  inject: ['dash'],
  data() {
    return {
      form: { po_no: '', po_date: new Date().toISOString().slice(0, 10), vendor: '', account_term: '', ship_to: '', remark: '', ref_no: '', ship_date: '', approved: false },
      items: [this.newRow()],
      discountMode: 'none', discountValue: 0, vatMode: 'none',
      fabrics: [], vendorOptions: [], savedMsg: '', _seq: 1,
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
  async mounted() { await this.loadNextNo(); this.loadFabrics(); },
  methods: {
    openReport() {
      // ไปหน้ารายงานใบสั่งซื้อ กรองเฉพาะผ้าดิบอัตโนมัติ
      try { sessionStorage.setItem('poReportTypeHint', 'raw'); } catch (e) { /* ข้ามได้ */ }
      this.dash.currentPage = 'report-po';
    },
    newRow() { return { _key: (this._seq = (this._seq || 0) + 1), sku: '', name: '', structure: '', composition: '', width: '', qty: null, unit_price: null, for_sku: '', color: '', shadeOptions: [] }; },
    lineTotal(r) { return (Number(r.qty) || 0) * (Number(r.unit_price) || 0); },
    addRow(idx) { this.items.splice(idx + 1, 0, this.newRow()); },
    removeRow(idx) { if (this.items.length > 1) this.items.splice(idx, 1); },
    async loadNextNo() {
      try { const res = await fetch('/api/purchase-orders/next-no', { headers: { Authorization: 'Bearer ' + this.dash.token } }); const d = await res.json(); if (d.ok) this.form.po_no = d.po_no; } catch (e) {}
    },
    async loadFabrics() {
      // หน้า PO ซื้อผ้าดิบ → ดึงจากตารางผ้าดิบ (/api/fabric-raw) ไม่ใช่ผ้าสำเร็จ
      try { const res = await fetch('/api/fabric-raw', { headers: { Authorization: 'Bearer ' + this.dash.token } }); const d = await res.json(); this.fabrics = d.items || []; } catch (e) {}
      try { const r2 = await fetch('/api/partners', { headers: { Authorization: 'Bearer ' + this.dash.token } }); const d2 = await r2.json(); if (d2.ok && d2.items.length) this.vendorOptions = d2.items.map(p => p.name); } catch (e) {}
    },
    async lookupSku(row) {
      if (!row.sku) return;
      const f = this.fabrics.find(x => (x.sku || '').toLowerCase() === row.sku.trim().toLowerCase());
      if (!f) return;
      row.name = f.name || ''; row.structure = f.structure || ''; row.composition = f.composition || ''; row.width = f.width || '';
      // ผ้าดิบไม่มีเฉดสี → กรอกรหัสสีเองในช่อง (ไม่มี dropdown)
      row.shadeOptions = [];
    },
    async save() {
      if (!this.items.some(r => (r.sku || '').trim())) { this.dash.fbFail('กรุณากรอกรายการสินค้าอย่างน้อย 1 รายการ'); return; }
      this.dash.fbLoading('กำลังบันทึก...');
      const payload = {
        ...this.form, po_type: 'raw',
        subtotal: this.subtotal, discount: this.discountAmount, vat: this.vatAmount, net_total: this.netTotal,
        items: this.items.map(r => ({ sku: r.sku, name: r.name, structure: r.structure, composition: r.composition, width: r.width, qty: r.qty, unit_price: r.unit_price, total: this.lineTotal(r), for_sku: r.for_sku, color: r.color })),
      };
      try {
        const res = await fetch('/api/purchase-orders', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.dash.token }, body: JSON.stringify(payload) });
        if (res.status === 401) { this.dash.fbHide(); this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) { this.form.po_no = d.po_no; this.savedMsg = this.dash.t[this.dash.lang].savedMsgText; this.dash.fbDone('บันทึกแล้ว'); }
        else { this.dash.fbFail(d.message || 'บันทึกไม่สำเร็จ'); }
      } catch (e) { this.dash.fbFail('บันทึกไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
    },
  },
};
</script>

<style scoped>
.po-page { font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif; color: var(--text); font-size: 12px; margin-top: 12px; background: var(--surface); border: 1px solid var(--field-border); border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
.po-titlebar { background: transparent; color: var(--text); font-weight: 700; padding: 18px 20px 2px; font-size: 18px; }
.po-head { display: flex; flex-wrap: wrap; gap: 22px; padding: 20px; background: transparent; border: none; border-bottom: 1px solid var(--field-border); }
.po-head-col { display: flex; flex-direction: column; gap: 8px; }
.po-head-col-wide { flex: 1; min-width: 220px; }
.po-field { display: flex; align-items: flex-start; gap: 8px; }
.po-field > label { min-width: 78px; text-align: right; padding-top: 6px; color: var(--muted); font-size: 12.5px; }
.po-field input, .po-field select { height: 36px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12px; font-family: inherit; background: var(--surface); color: var(--text); min-width: 150px; transition: border-color .2s, box-shadow .2s; }
.po-field textarea { width: 100%; resize: vertical; padding: 8px 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12px; font-family: inherit; background: var(--surface); color: var(--text); }
.po-field input:focus, .po-field select:focus, .po-field textarea:focus { outline: none; border-color: #2F65F6; box-shadow: 0 0 0 3px rgba(47,101,246,.12); }
.po-field > label { color: var(--muted); font-size: 12px; font-weight: 600; }
.po-ro { background: var(--field) !important; font-weight: 700; }
.po-approve { display: flex; align-items: center; gap: 6px; font-size: 12px; cursor: pointer; }
.po-items { padding: 8px 12px; overflow-x: auto; }
.po-item-table { width: 100%; border-collapse: collapse; min-width: 1000px; }
.po-item-table th { text-align: center; font-size: 12px; color: #fff; background: #3c4453; padding: 10px 8px; font-weight: 600; letter-spacing: .3px; border-right: 1px solid rgba(255,255,255,.18); }
.po-item-table th:last-child { border-right: none; }
.po-item-table td { padding: 5px 6px; border-bottom: 1px solid var(--field-border); }
.po-item-table input, .po-item-table select { width: 100%; height: 32px; padding: 0 9px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12.5px; font-family: inherit; background: var(--surface); color: var(--text); transition: border-color .2s, box-shadow .2s; }
.po-item-table input:focus, .po-item-table select:focus { outline: none; border-color: #2F65F6; box-shadow: 0 0 0 3px rgba(47,101,246,.12); }
.po-num { text-align: right; }
.po-ro-cell { background: var(--field); }
.po-no { text-align: center; color: var(--muted); }
.po-row-actions { display: flex; gap: 4px; justify-content: center; }
.po-ic { width: 24px; height: 24px; border-radius: 50%; border: none; color: #fff; cursor: pointer; font-size: 12px; line-height: 1; }
.po-add { background: #1a9c54; } .po-del { background: #e03131; }
.po-summary { margin-top: 12px; max-width: 560px; margin-left: auto; display: flex; flex-direction: column; gap: 6px; }
.po-sum-row { display: flex; align-items: center; gap: 8px; justify-content: flex-end; }
.po-sum-row > label { min-width: 70px; text-align: right; color: var(--muted); }
.po-sum-row input, .po-sum-row select { padding: 5px 8px; border: 1px solid var(--field-border); border-radius: 5px; font-size: 12.5px; background: var(--surface); color: var(--text); }
.po-sum-row input.po-num { width: 150px; }
.po-sum-net input { font-weight: 700; }
.po-footer { display: flex; align-items: center; justify-content: space-between; padding: 9px 14px; border-top: 1px solid var(--field-border); background: var(--field); border-radius: 0 0 14px 14px; }
.po-saved-msg { color: #1a9c54; font-size: 12px; font-weight: 600; }
.po-footer-btns { display: flex; gap: 10px; margin-left: auto; }
.po-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; border: 1px solid var(--field-border); border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 12px; background: #e7eaf1; color: var(--text); transition: background .2s, border-color .2s; }
.po-btn:hover { background: #dde1ea; border-color: #c7cede; }
.po-btn-save { background: #1a9c54; color: #fff; border-color: #1a9c54; }
.po-btn-save:hover { background: #158045; border-color: #158045; }
/* ช่องกรอกที่ยังว่าง — ใส่พื้นเทาอ่อนให้มองเห็นชัด (ไม่ใช่ขาวกลืนพื้น) */
.po-page input:not([type="checkbox"]), .po-page select, .po-page textarea { background: var(--field); }
.po-page input:focus, .po-page select:focus, .po-page textarea:focus { background: var(--surface); }
</style>
