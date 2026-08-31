<template>
<div class="po-page">
  <div class="po-titlebar">🧾 {{ dash.t[dash.lang].vatInvoiceTitle }}</div>

  <div class="po-head">
    <div class="po-head-col">
      <div class="po-field"><label>{{ dash.t[dash.lang].dateLabel }}</label><input type="date" v-model="form.invoice_date" /></div>
      <div class="po-field"><label>{{ dash.t[dash.lang].invoiceNoLabel }}</label><input :value="form.vt_no" readonly class="po-ro" /></div>
    </div>
    <div class="po-head-col">
      <div class="po-field"><label>{{ dash.t[dash.lang].customerWord }}</label>
        <input list="vt-customers" v-model="form.customer" :placeholder="dash.t[dash.lang].customerPlaceholder" />
        <datalist id="vt-customers"><option v-for="c in customerOptions" :key="c" :value="c" /></datalist>
      </div>
      <div class="po-field"><label>{{ dash.t[dash.lang].salespersonLabel }}</label>
        <input list="vt-sales" v-model="form.salesperson" :placeholder="dash.t[dash.lang].salespersonLabel" />
        <datalist id="vt-sales"><option v-for="s in salesOptions" :key="s" :value="s" /></datalist>
      </div>
    </div>
    <div class="po-head-col">
      <div class="po-field"><label>{{ dash.t[dash.lang].accountTermsLabel }}</label>
        <select v-model="form.account_term"><option value="">{{ dash.t[dash.lang].selectGenericOpt }}</option><option value="เงินสด">{{ dash.t[dash.lang].cashOptionWord }}</option><option value="เครดิต 30 วัน">{{ dash.t[dash.lang].credit30Word }}</option><option value="เครดิต 60 วัน">{{ dash.t[dash.lang].credit60Word }}</option></select>
      </div>
      <div class="po-field"><label>{{ dash.t[dash.lang].billAddressLabel }}</label>
        <select v-model="form.bill_address"><option value="">{{ dash.t[dash.lang].selectGenericOpt }}</option><option value="สำนักงานใหญ่">{{ dash.t[dash.lang].headOfficeWord }}</option><option value="สาขา">{{ dash.t[dash.lang].branchWord }}</option></select>
      </div>
    </div>
    <div class="po-head-col po-head-col-wide">
      <div class="po-field"><label>{{ dash.t[dash.lang].remarkLabel }}</label><textarea v-model="form.remark" rows="3"></textarea></div>
    </div>
  </div>

  <div class="po-items">
    <table class="po-item-table">
      <thead>
        <tr>
          <th style="width:40px;">{{ dash.lang === 'th' ? 'ที่' : 'No.' }}</th>
          <th style="text-align:left;">{{ dash.t[dash.lang].detailLabel }}</th><th style="width:130px;">{{ dash.t[dash.lang].priceReceivedLabel }}</th><th style="width:120px;">{{ dash.t[dash.lang].qtyCutLabel }}</th>
          <th style="width:130px;">{{ dash.t[dash.lang].salePriceLabel }}</th><th style="width:150px;">{{ dash.t[dash.lang].totalWord }}</th><th style="width:130px;">{{ dash.t[dash.lang].vatProductGroupLabel }}</th>
          <th style="width:96px;"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in items" :key="row._key">
          <td class="po-no">{{ idx + 1 }}</td>
          <td><input v-model="row.detail" :placeholder="dash.t[dash.lang].detailLabel" /></td>
          <td><input type="number" list="vt-prices" v-model.number="row.price" class="po-num" placeholder="0.00" /></td>
          <td><input type="number" v-model.number="row.qty_cut" class="po-num" placeholder="0" /></td>
          <td><input type="number" v-model.number="row.sale_price" class="po-num" placeholder="0.00" /></td>
          <td><input :value="lineTotal(row).toFixed(2)" readonly class="po-num po-ro-cell" /></td>
          <td><input :value="groupFor(row.sale_price)" readonly class="po-ro-cell" style="text-align:center" /></td>
          <td class="po-row-actions">
            <button class="po-ic po-add" :title="dash.t[dash.lang].addRowTitle" @click="addRow(idx)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button>
            <button class="po-ic po-del" :title="dash.t[dash.lang].removeRowTitle" @click="removeRow(idx)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 12h14"/></svg></button>
          </td>
        </tr>
      </tbody>
    </table>
    <datalist id="vt-prices"><option v-for="p in priceOptions" :key="p" :value="p" /></datalist>

    <div class="po-summary">
      <div class="po-sum-row"><label>{{ dash.t[dash.lang].totalWord }}</label><input :value="subtotal.toFixed(2)" readonly class="po-num po-ro-cell" /></div>
      <div class="po-sum-row">
        <label>{{ dash.t[dash.lang].discountLabel }}</label>
        <select v-model="discountMode"><option value="none">None</option><option value="percent">%</option><option value="amount">{{ dash.t[dash.lang].bahtWord }}</option></select>
        <input type="number" v-model.number="discountValue" :disabled="discountMode==='none'" class="po-num" />
        <input :value="discountAmount.toFixed(2)" readonly class="po-num po-ro-cell" />
      </div>
      <div class="po-sum-row">
        <label>VAT</label><select v-model="vatMode"><option value="none">None</option><option value="7">7%</option></select>
        <input :value="vatAmount.toFixed(2)" readonly class="po-num po-ro-cell" />
      </div>
      <div class="po-sum-row po-sum-net"><label>{{ dash.t[dash.lang].netTotalLabel }}</label><input :value="netTotal.toFixed(2)" readonly class="po-num po-ro-cell" /></div>
    </div>
  </div>

  <div class="po-footer">
    <span v-if="savedMsg" class="po-saved-msg">{{ savedMsg }}</span>
    <div class="po-footer-btns">
      <button class="po-btn po-btn-report" @click="dash.fbFail('ตัวอย่างรายงาน (ยังไม่เชื่อมระบบพิมพ์รายงานจริง)')">👁 {{ dash.t[dash.lang].reportBtnWord }}</button>
      <button v-if="!saved" class="po-btn po-btn-save" @click="save">💾 {{ dash.t[dash.lang].save }}</button>
      <button v-else class="po-btn po-btn-new" @click="resetForm">🔄 {{ dash.t[dash.lang].newInvoiceBtn }}</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'VatInvoicePage',
  inject: ['dash'],
  data() {
    return {
      form: { vt_no: '', invoice_date: new Date().toISOString().slice(0, 10), customer: '', salesperson: '', account_term: '', bill_address: '', remark: '' },
      items: [this.newRow()],
      discountMode: 'none', discountValue: 0, vatMode: 'none',
      customerOptions: [], salesOptions: ['ปั๊ม', 'นายกิตติ มั่นคง'], priceOptions: [], vatGroups: [],
      saved: false, savedMsg: '', _seq: 1,
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
  async mounted() { await this.loadNextNo(); this.loadRefs(); },
  methods: {
    newRow() { return { _key: (this._seq = (this._seq || 0) + 1), detail: '', price: null, qty_cut: null, sale_price: null }; },
    lineTotal(r) { return (Number(r.sale_price) || 0) * (Number(r.qty_cut) || 0); },
    groupFor(salePrice) {
      const p = Number(salePrice) || 0;
      if (!p) return '';
      const g = this.vatGroups.find(x => p >= Number(x.price_from) && p <= Number(x.price_to));
      return g ? g.group_name : '-';
    },
    addRow(idx) { this.items.splice(idx + 1, 0, this.newRow()); },
    removeRow(idx) { if (this.items.length > 1) this.items.splice(idx, 1); },
    async loadNextNo() {
      try { const res = await fetch('/api/vat-invoices/next-no', { headers: { Authorization: 'Bearer ' + this.dash.token } }); const d = await res.json(); if (d.ok) this.form.vt_no = d.vt_no; } catch (e) {}
    },
    async loadRefs() {
      try { const r = await fetch('/api/customers', { headers: { Authorization: 'Bearer ' + this.dash.token } }); const d = await r.json(); this.customerOptions = (d.items || d.customers || []).map(c => c.company_name || c.name).filter(Boolean).slice(0, 300); } catch (e) {}
      try { const r2 = await fetch('/api/vat-product-groups', { headers: { Authorization: 'Bearer ' + this.dash.token } }); const d2 = await r2.json(); this.vatGroups = d2.items || []; } catch (e) {}
      try {
        const r3 = await fetch('/api/vat-receipts', { headers: { Authorization: 'Bearer ' + this.dash.token } });
        const d3 = await r3.json();
        const set = new Set();
        (d3.receipts || []).forEach(rc => { try { (JSON.parse(rc.items_json || '[]')).forEach(it => { if (it.price) set.add(Number(it.price)); }); } catch (e) {} });
        this.priceOptions = [...set].sort((a, b) => a - b);
      } catch (e) {}
    },
    resetForm() {
      this.form = { vt_no: '', invoice_date: new Date().toISOString().slice(0, 10), customer: '', salesperson: '', account_term: '', bill_address: '', remark: '' };
      this.items = [this.newRow()]; this.discountMode = 'none'; this.discountValue = 0; this.vatMode = 'none';
      this.saved = false; this.savedMsg = ''; this.loadNextNo();
    },
    async save() {
      if (!this.items.some(r => (Number(r.qty_cut) || 0) > 0)) { this.dash.fbFail('กรุณากรอกรายการอย่างน้อย 1 รายการ'); return; }
      this.dash.fbLoading('กำลังบันทึก...');
      const payload = {
        ...this.form, subtotal: this.subtotal, discount: this.discountAmount, vat: this.vatAmount, net_total: this.netTotal,
        items: this.items.map(r => ({ detail: r.detail, price: r.price, qty_cut: r.qty_cut, sale_price: r.sale_price, total: this.lineTotal(r), group: this.groupFor(r.sale_price) })),
      };
      try {
        const res = await fetch('/api/vat-invoices', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.dash.token }, body: JSON.stringify(payload) });
        if (res.status === 401) { this.dash.fbHide(); this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) { this.form.vt_no = d.vt_no; this.saved = true; this.savedMsg = this.dash.t[this.dash.lang].invoiceIssuedMsg; this.dash.fbDone('บันทึกแล้ว'); }
        else { this.dash.fbFail(d.message || 'บันทึกไม่สำเร็จ'); }
      } catch (e) { this.dash.fbFail('บันทึกไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
    },
  },
};
</script>

<style scoped>
.po-page { font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif; color: var(--text); font-size: 12px; margin-top: 12px; background: var(--surface); border: 1px solid var(--field-border); border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
.po-titlebar { font-weight: 700; padding: 18px 20px 2px; font-size: 18px; }
.po-head { display: flex; flex-wrap: wrap; gap: 22px; padding: 20px; border-bottom: 1px solid var(--field-border); }
.po-head-col { display: flex; flex-direction: column; gap: 8px; }
.po-head-col-wide { flex: 1; min-width: 220px; }
.po-field { display: flex; align-items: flex-start; gap: 8px; }
.po-field > label { min-width: 110px; text-align: right; padding-top: 6px; color: var(--muted); font-size: 12px; font-weight: 600; }
.po-field input, .po-field select { height: 36px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12px; font-family: inherit; background: var(--surface); color: var(--text); min-width: 150px; }
.po-field textarea { width: 100%; resize: vertical; padding: 8px 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12px; font-family: inherit; background: var(--surface); color: var(--text); }
.po-field input:focus, .po-field select:focus, .po-field textarea:focus { outline: none; border-color: #2F65F6; box-shadow: 0 0 0 3px rgba(47,101,246,.12); }
.po-ro { background: var(--field) !important; font-weight: 700; }
.po-items { padding: 8px 12px; overflow-x: auto; }
.po-item-table { width: 100%; border-collapse: collapse; min-width: 980px; }
.po-item-table th { text-align: center; font-size: 12px; color: #fff; background: #3c4453; padding: 10px 8px; font-weight: 600; border-right: 1px solid rgba(255,255,255,.18); white-space: nowrap; }
.po-item-table th:last-child { border-right: none; }
.po-item-table td { padding: 5px 6px; border-bottom: 1px solid var(--field-border); }
.po-item-table input { width: 100%; height: 32px; padding: 0 9px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12.5px; font-family: inherit; background: var(--surface); color: var(--text); }
.po-item-table input:focus { outline: none; border-color: #2F65F6; box-shadow: 0 0 0 3px rgba(47,101,246,.12); }
.po-num { text-align: right; }
.po-ro-cell { background: var(--field); }
.po-no { text-align: center; color: var(--muted); }
.po-row-actions { display: flex; gap: 5px; justify-content: center; }
.po-ic { width: 28px; height: 28px; border-radius: 7px; border: 1px solid var(--field-border); background: var(--field); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; padding: 0; transition: background .15s, border-color .15s; }
.po-ic svg { width: 15px; height: 15px; }
.po-add { color: #1a9c54; } .po-add:hover { background: #e7f6ee; border-color: #1a9c54; }
.po-del { color: #e03131; } .po-del:hover { background: #fdeaea; border-color: #e03131; }
.po-summary { margin-top: 12px; max-width: 560px; margin-left: auto; display: flex; flex-direction: column; gap: 6px; }
.po-sum-row { display: flex; align-items: center; gap: 8px; justify-content: flex-end; }
.po-sum-row > label { min-width: 70px; text-align: right; color: var(--muted); }
.po-sum-row input, .po-sum-row select { padding: 5px 8px; border: 1px solid var(--field-border); border-radius: 5px; font-size: 12.5px; background: var(--surface); color: var(--text); }
.po-sum-row input.po-num { width: 150px; }
.po-sum-net input { font-weight: 700; }
.po-footer { display: flex; align-items: center; justify-content: space-between; padding: 9px 14px; border-top: 1px solid var(--field-border); background: var(--field); border-radius: 0 0 14px 14px; }
.po-saved-msg { color: #1a9c54; font-size: 12px; font-weight: 600; }
.po-footer-btns { display: flex; gap: 10px; margin-left: auto; }
.po-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; border: 1px solid var(--field-border); border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 12px; background: #e7eaf1; color: var(--text); }
.po-btn-save, .po-btn-new { background: #1a9c54; color: #fff; border-color: #1a9c54; }
.po-btn-save:hover, .po-btn-new:hover { background: #158045; }
.po-page input:not([type="checkbox"]), .po-page select, .po-page textarea { background: var(--field); }
.po-page input:focus, .po-page select:focus, .po-page textarea:focus { background: var(--surface); }
</style>
