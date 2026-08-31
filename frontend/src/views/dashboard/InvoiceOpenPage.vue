<template>
<div class="po-page">
  <div class="po-titlebar">🧾 {{ dash.t[dash.lang].openInvoiceTitle }}</div>
  <div class="po-head">
    <div class="po-head-col">
      <div class="po-field"><label>{{ dash.t[dash.lang].dateLabel }}</label><input type="date" v-model="form.inv_date" /></div>
      <div class="po-field"><label>{{ dash.t[dash.lang].invoiceNoLabel }}</label><input :value="form.inv_no" readonly class="po-ro" /></div>
    </div>
    <div class="po-head-col">
      <div class="po-field"><label>{{ dash.t[dash.lang].customerWord }}</label><input list="io-cust" v-model="form.customer" :placeholder="dash.t[dash.lang].customerPlaceholder" /><datalist id="io-cust"><option v-for="c in customers" :key="c" :value="c" /></datalist></div>
      <div class="po-field"><label>{{ dash.t[dash.lang].orderRefLabel }}</label><input v-model="form.order_ref" :placeholder="dash.t[dash.lang].orderRefLabel" /></div>
    </div>
    <div class="po-head-col">
      <div class="po-field"><label>{{ dash.t[dash.lang].accountTermsLabel }}</label><select v-model="form.account_term"><option>Cash</option><option value="เครดิต 30 วัน">{{ dash.t[dash.lang].credit30Word }}</option><option value="เครดิต 60 วัน">{{ dash.t[dash.lang].credit60Word }}</option></select></div>
      <div class="po-field"><label>{{ dash.t[dash.lang].salespersonLabel }}</label><input v-model="form.salesperson" :placeholder="dash.t[dash.lang].salespersonLabel" /></div>
    </div>
    <div class="po-head-col">
      <div class="po-field"><label>{{ dash.t[dash.lang].billAddressLabel }}</label><select v-model="form.bill_address"><option value="">{{ dash.t[dash.lang].selectGenericOpt }}</option><option value="สำนักงานใหญ่">{{ dash.t[dash.lang].headOfficeWord }}</option><option value="สาขา">{{ dash.t[dash.lang].branchWord }}</option></select></div>
      <div class="po-field"><label>{{ dash.t[dash.lang].shipAddressLabel }}</label><select v-model="form.ship_address"><option value="">{{ dash.t[dash.lang].selectGenericOpt }}</option><option value="สำนักงานใหญ่">{{ dash.t[dash.lang].headOfficeWord }}</option><option value="สาขา">{{ dash.t[dash.lang].branchWord }}</option></select></div>
      <div class="po-field"><label>{{ dash.t[dash.lang].shipperLabel }}</label><select v-model="form.shipper"><option value="">{{ dash.t[dash.lang].selectGenericOpt }}</option><option v-for="s in shippers" :key="s" :value="s">{{ s }}</option></select></div>
    </div>
    <div class="po-head-col po-head-col-wide">
      <div class="po-field"><label>{{ dash.t[dash.lang].remarkLabel }}</label><textarea v-model="form.remark" rows="3"></textarea></div>
    </div>
  </div>
  <div class="po-body"></div>
  <div class="po-footer">
    <span v-if="savedMsg" class="po-saved-msg">{{ savedMsg }}</span>
    <div class="po-footer-btns">
      <button v-if="!saved" class="po-btn po-btn-save" @click="save">💾 {{ dash.t[dash.lang].save }}</button>
      <button v-else class="po-btn po-btn-new" @click="resetForm">🔄 {{ dash.t[dash.lang].openNewBtn }}</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'InvoiceOpenPage',
  inject: ['dash'],
  data() {
    return {
      form: { inv_no: '', inv_date: new Date().toISOString().slice(0, 10), customer: '', order_ref: '', account_term: 'Cash', salesperson: '', bill_address: '', ship_address: '', shipper: '', remark: '' },
      customers: [], shippers: ['พนักงาน A', 'พนักงาน B'], saved: false, savedMsg: '',
    };
  },
  async mounted() { await this.loadNextNo(); this.loadCustomers(); },
  methods: {
    async loadNextNo() { try { const r = await fetch('/api/sale-invoices/next-no', { headers: { Authorization: 'Bearer ' + this.dash.token } }); const d = await r.json(); if (d.ok) this.form.inv_no = d.inv_no; } catch (e) {} },
    async loadCustomers() { try { const r = await fetch('/api/customers', { headers: { Authorization: 'Bearer ' + this.dash.token } }); const d = await r.json(); this.customers = (d.items || d.customers || []).map(c => c.company_name || c.name).filter(Boolean).slice(0, 300); } catch (e) {} },
    resetForm() { this.form = { inv_no: '', inv_date: new Date().toISOString().slice(0, 10), customer: '', order_ref: '', account_term: 'Cash', salesperson: '', bill_address: '', ship_address: '', shipper: '', remark: '' }; this.saved = false; this.savedMsg = ''; this.loadNextNo(); },
    async save() {
      if (!this.form.customer) { this.dash.fbFail(this.dash.t[this.dash.lang].requireCustomerMsg); return; }
      this.dash.fbLoading('กำลังบันทึก...');
      try {
        const res = await fetch('/api/sale-invoices', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.dash.token }, body: JSON.stringify({ ...this.form, items: [] }) });
        if (res.status === 401) { this.dash.fbHide(); this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) { this.form.inv_no = d.inv_no; this.saved = true; this.savedMsg = this.dash.t[this.dash.lang].invoiceOpenedMsg; this.dash.fbDone('บันทึกแล้ว'); }
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
.po-field > label { min-width: 120px; text-align: right; padding-top: 6px; color: var(--muted); font-size: 12px; font-weight: 600; }
.po-field input, .po-field select { height: 36px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12px; font-family: inherit; background: var(--field); color: var(--text); min-width: 150px; }
.po-field textarea { width: 100%; resize: vertical; padding: 8px 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12px; font-family: inherit; background: var(--field); color: var(--text); }
.po-field input:focus, .po-field select:focus, .po-field textarea:focus { outline: none; border-color: #2F65F6; background: var(--surface); box-shadow: 0 0 0 3px rgba(47,101,246,.12); }
.po-ro { background: var(--field) !important; font-weight: 700; }
.po-body { min-height: 120px; }
.po-footer { display: flex; align-items: center; justify-content: space-between; padding: 9px 14px; border-top: 1px solid var(--field-border); background: var(--field); border-radius: 0 0 14px 14px; }
.po-saved-msg { color: #1a9c54; font-size: 12px; font-weight: 600; }
.po-footer-btns { display: flex; gap: 10px; margin-left: auto; }
.po-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border: 1px solid var(--field-border); border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 12px; background: #e7eaf1; color: var(--text); }
.po-btn-save, .po-btn-new { background: #1a9c54; color: #fff; border-color: #1a9c54; }
.po-btn-save:hover, .po-btn-new:hover { background: #158045; }
</style>
