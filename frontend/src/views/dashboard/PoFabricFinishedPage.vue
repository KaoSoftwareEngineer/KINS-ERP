<template>
<div class="po-page">
  <div class="po-titlebar">🧾 {{ dash.t[dash.lang].openPoTitle }} — {{ dash.t[dash.lang].finishedFabricWord }}</div>

  <!-- ส่วนหัว -->
  <div class="po-head">
    <div class="po-head-col">
      <div class="po-field"><label>{{ dash.t[dash.lang].dateLabel }}</label><input type="date" v-model="form.po_date" /></div>
      <div class="po-field"><label>{{ dash.t[dash.lang].poNoLabel }}</label><input :value="form.po_no" readonly class="po-ro" /></div>
    </div>
    <div class="po-head-col">
      <div class="po-field"><label>{{ dash.t[dash.lang].partnerWord }}</label>
        <input list="po-vendors" v-model="form.vendor" :placeholder="dash.t[dash.lang].vendorPlaceholder" />
        <datalist id="po-vendors"><option v-for="v in vendorOptions" :key="v" :value="v" /></datalist>
      </div>
      <div class="po-field"><label>{{ dash.t[dash.lang].accountTermsLabel }}</label>
        <select v-model="form.account_term">
          <option value="">{{ dash.t[dash.lang].selectGenericOpt }}</option><option value="เงินสด">{{ dash.t[dash.lang].cashOptionWord }}</option><option value="เครดิต 30 วัน">{{ dash.t[dash.lang].credit30Word }}</option><option value="เครดิต 60 วัน">{{ dash.t[dash.lang].credit60Word }}</option>
        </select>
      </div>
      <div class="po-field"><label>{{ dash.t[dash.lang].shipToLabel }}</label>
        <select v-model="form.ship_to"><option>Warehouse</option><option>Factory</option></select>
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
          <th style="width:40px;">{{ dash.lang === 'th' ? 'ที่' : 'No.' }}</th>
          <th>{{ dash.t[dash.lang].skuLabel }}</th><th>{{ dash.t[dash.lang].colorCodeLabel }}</th><th>{{ dash.t[dash.lang].nameLabel }}</th><th>{{ dash.t[dash.lang].widthLabel }}</th>
          <th>{{ dash.t[dash.lang].qtyLabel }}</th><th>{{ dash.t[dash.lang].pricePerUnitLabel }}</th><th>{{ dash.t[dash.lang].priceLabel }}</th><th>{{ dash.t[dash.lang].refShortLabel }}</th>
          <th style="width:96px;"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in items" :key="row._key">
          <td class="po-no">{{ idx + 1 }}</td>
          <td><input v-model="row.sku" @blur="lookupSku(row)" :placeholder="dash.t[dash.lang].skuPlaceholderShort" /></td>
          <td>
            <select v-if="row.shadeOptions && row.shadeOptions.length" v-model="row.color">
              <option value="">{{ dash.t[dash.lang].selectColorOpt }}</option>
              <option v-for="s in row.shadeOptions" :key="s" :value="s">{{ s }}</option>
            </select>
            <input v-else v-model="row.color" :placeholder="dash.t[dash.lang].colorCodeLabel" />
          </td>
          <td><input v-model="row.name" class="po-ro-cell" :placeholder="dash.t[dash.lang].nameLabel" /></td>
          <td><input v-model="row.width" class="po-ro-cell" :placeholder="dash.t[dash.lang].widthLabel" /></td>
          <td><input type="number" v-model.number="row.qty" @input="calc" class="po-num" /></td>
          <td><input type="number" v-model.number="row.unit_price" @input="calc" class="po-num" /></td>
          <td><input :value="lineTotal(row).toFixed(2)" readonly class="po-num po-ro-cell" /></td>
          <td><input v-model="row.ref" :placeholder="dash.t[dash.lang].refShortLabel" /></td>
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
        <select v-model="discountMode" @change="calc">
          <option value="none">None</option><option value="percent">%</option><option value="amount">{{ dash.t[dash.lang].bahtWord }}</option>
        </select>
        <input type="number" v-model.number="discountValue" @input="calc" :disabled="discountMode==='none'" class="po-num" />
        <input :value="discountAmount.toFixed(2)" readonly class="po-num po-ro-cell" />
      </div>
      <div class="po-sum-row">
        <label>VAT</label>
        <select v-model="vatMode" @change="calc">
          <option value="none">None</option><option value="7">7%</option>
        </select>
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
      <button v-if="!saved" class="po-btn po-btn-save" @click="save">💾 {{ dash.t[dash.lang].save }}</button>
      <button v-else class="po-btn po-btn-po" @click="openPdf">🖨️ {{ dash.t[dash.lang].purchaseOrderPdfBtn }}</button>
    </div>
  </div>
</div>
</template>

<script>
import { buildDocPdf, docBrandHeader, COMPANY_NAME_EN } from '../../utils/pdfLabels.js';
export default {
  name: 'PoFabricFinishedPage',
  inject: ['dash'],
  data() {
    return {
      form: { po_no: '', po_date: new Date().toISOString().slice(0, 10), vendor: '', account_term: '', ship_to: 'Warehouse', remark: '', ref_no: '', ship_date: '', approved: false },
      items: [this.newRow()],
      discountMode: 'none', discountValue: 0,
      vatMode: 'none',
      fabrics: [],
      vendorOptions: [],
      saved: false, savedMsg: '', savedData: null,
      _seq: 1,
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
    this.loadFabrics();
  },
  methods: {
    newRow() { return { _key: (this._seq = (this._seq || 0) + 1), sku: '', color: '', name: '', width: '', qty: null, unit_price: null, ref: '', shadeOptions: [] }; },
    lineTotal(r) { return (Number(r.qty) || 0) * (Number(r.unit_price) || 0); },
    calc() { /* คำนวณผ่าน computed */ },
    addRow(idx) { this.items.splice(idx + 1, 0, this.newRow()); },
    removeRow(idx) { if (this.items.length > 1) this.items.splice(idx, 1); },
    async loadNextNo() {
      try {
        const res = await fetch('/api/purchase-orders/next-no', { headers: { Authorization: 'Bearer ' + this.dash.token } });
        const data = await res.json();
        if (data.ok) this.form.po_no = data.po_no;
      } catch (e) {}
    },
    async loadFabrics() {
      try {
        const res = await fetch('/api/fabrics', { headers: { Authorization: 'Bearer ' + this.dash.token } });
        const data = await res.json();
        this.fabrics = data.fabrics || [];
      } catch (e) {}
      try {
        const r2 = await fetch('/api/partners', { headers: { Authorization: 'Bearer ' + this.dash.token } });
        const d2 = await r2.json();
        if (d2.ok && d2.items.length) this.vendorOptions = d2.items.map(p => p.name);
      } catch (e) {}
    },
    async lookupSku(row) {
      if (!row.sku) return;
      const f = this.fabrics.find(x => (x.sku || '').toLowerCase() === row.sku.trim().toLowerCase());
      if (!f) return;
      row.name = f.name || ''; row.width = f.width || '';
      // โหลดเฉดสีของผ้านี้มาเป็นตัวเลือกรหัสสี
      try {
        const res = await fetch(`/api/fabrics/${f.id}/shades`, { headers: { Authorization: 'Bearer ' + this.dash.token } });
        const d = await res.json();
        row.shadeOptions = (d.shades || []).map(s => s.name);
      } catch (e) { row.shadeOptions = []; }
    },
    openReport() {
      // ไปหน้ารายงานใบสั่งซื้อ กรองเฉพาะผ้าสำเร็จอัตโนมัติ
      try { sessionStorage.setItem('poReportTypeHint', 'finished'); } catch (e) { /* ข้ามได้ */ }
      this.dash.currentPage = 'report-po';
    },
    async save() {
      const hasItem = this.items.some(r => (r.sku || '').trim());
      if (!hasItem) { this.dash.fbFail('กรุณากรอกรายการสินค้าอย่างน้อย 1 รายการ'); return; }
      this.dash.fbLoading('กำลังบันทึก...');
      const payload = {
        ...this.form, po_type: 'finished',
        subtotal: this.subtotal, discount: this.discountAmount, vat: this.vatAmount, net_total: this.netTotal,
        items: this.items.map(r => ({ sku: r.sku, color: r.color, name: r.name, width: r.width, qty: r.qty, unit_price: r.unit_price, total: this.lineTotal(r), ref: r.ref })),
      };
      try {
        const res = await fetch('/api/purchase-orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.dash.token },
          body: JSON.stringify(payload),
        });
        if (res.status === 401) { this.dash.fbHide(); this.dash.sessionExpired(); return; }
        const data = await res.json();
        if (data.ok) {
          this.form.po_no = data.po_no;
          this.saved = true;
          this.savedData = JSON.parse(JSON.stringify(payload));
          this.savedMsg = this.dash.t[this.dash.lang].savedMsgText;
          this.dash.fbDone('บันทึกแล้ว');
        } else { this.dash.fbFail(data.message || 'บันทึกไม่สำเร็จ'); }
      } catch (e) { this.dash.fbFail('บันทึกไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
    },
    async openPdf() {
      const f = this.form;
      const rows = this.items.filter(r => (r.sku || '').trim() || (r.color || '').trim());
      const totalQty = rows.reduce((s, r) => s + (Number(r.qty) || 0), 0);
      const blank = Math.max(0, 12 - rows.length);
      const esc = (s) => (s == null ? '' : String(s)).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
      const bodyRows = rows.map((r, i) => `<tr><td>${i + 1}</td><td>${esc(r.name)}</td><td>${esc(r.color)}</td><td>${r.qty || ''}</td><td>${esc(r.width)}</td><td>${esc(r.ref)}</td></tr>`).join('')
        + Array.from({ length: blank }).map(() => '<tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td></tr>').join('');
      const html = `
        <style>
          .doc{font-family:'Times New Roman',serif;color:#000}
          .center{text-align:center}.h1{font-size:20px;font-weight:bold}.h2{font-size:14px;font-weight:bold}
          .addr{font-size:12px;margin-top:4px}
          .meta{display:flex;justify-content:space-between;font-size:12px;margin:14px 0}
          .meta b{font-weight:bold}
          .doc table{width:100%;border-collapse:collapse;margin-top:6px}
          .doc th,.doc td{border:1px solid #000;padding:5px 6px;font-size:12px;text-align:center;height:22px}
          .doc th{font-weight:bold}
          .note{border:1px solid #000;border-top:none;padding:6px;font-size:12px;min-height:44px}
          .foot{display:flex;justify-content:space-between;align-items:flex-end;margin-top:40px;font-size:12px}
        </style>
        <div class="doc">
        ${docBrandHeader('Instruction for finished fabric')}
        <div class="meta">
          <div><b>Attention :</b> ${esc(f.vendor) || ''}<br><b>From :</b> ${COMPANY_NAME_EN}<br><b>Place of delivery :</b> ${esc(f.ship_to)}</div>
          <div><b>Order Date :</b> ${esc(f.po_date)}<br><b>Order No :</b> ${esc(f.po_no)}</div>
        </div>
        <table>
          <thead><tr><th style="width:36px">No.</th><th>Design Name</th><th>Color</th><th>Quantity</th><th>Construction</th><th>As per</th></tr></thead>
          <tbody>${bodyRows}
            <tr><td colspan="3"><b>Total</b></td><td>${totalQty || ''}</td><td colspan="2"><b>Yards</b></td></tr>
          </tbody>
        </table>
        <div class="note"><b>Important Note: :</b> ${esc(f.remark)}</div>
        <div class="foot"><div><b>Approve By :</b></div><div><b>${COMPANY_NAME_EN}</b></div></div>
        </div>`;
      try { await buildDocPdf(html, { filename: 'PO-' + (f.po_no || '') + '.pdf' }); }
      catch (e) { this.dash.fbFail('สร้าง PDF ไม่สำเร็จ'); }
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
.po-field input, .po-field select {
  height: 36px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12px;
  font-family: inherit; background: var(--surface); color: var(--text); min-width: 150px;
  transition: border-color .2s, box-shadow .2s;
}
.po-field textarea {
  width: 100%; resize: vertical; padding: 8px 10px; border: 1px solid var(--field-border); border-radius: 8px;
  font-size: 12px; font-family: inherit; background: var(--surface); color: var(--text);
}
.po-field input:focus, .po-field select:focus, .po-field textarea:focus {
  outline: none; border-color: #2F65F6; box-shadow: 0 0 0 3px rgba(47,101,246,.12);
}
.po-field > label { color: var(--muted); font-size: 12px; font-weight: 600; }
.po-ro { background: var(--field) !important; font-weight: 700; }
.po-approve { display: flex; align-items: center; gap: 6px; font-size: 12px; cursor: pointer; }

.po-items { padding: 8px 12px; }
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
.po-btn-po { background: #3c4453; color: #fff; border-color: #3c4453; }
.po-btn-po:hover { background: #2d333f; }

/* ช่องกรอกที่ยังว่าง — ใส่พื้นเทาอ่อนให้มองเห็นชัด (ไม่ใช่ขาวกลืนพื้น) */
.po-page input:not([type="checkbox"]), .po-page select, .po-page textarea { background: var(--field); }
.po-page input:focus, .po-page select:focus, .po-page textarea:focus { background: var(--surface); }
</style>
