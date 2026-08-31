<template>
<div class="bl-page">
  <div class="bl-titlebar">
    <span>📃 {{ dash.t[dash.lang].customerBillingTitle }}</span>
    <button v-if="!bulkMode" class="bl-bulk-btn" @click="bulkMode = true">📑 {{ dash.t[dash.lang].bulkBillingLabel }}</button>
    <button v-else class="bl-bulk-btn" @click="bulkMode = false">‹ {{ dash.t[dash.lang].backWord }}</button>
  </div>

  <!-- ===== โหมดปกติ ===== -->
  <template v-if="!bulkMode">
    <div class="bl-head">
      <div class="bl-hcol">
        <div class="bl-field"><label>{{ dash.t[dash.lang].dateLabel }}</label><input type="date" v-model="form.bill_date" /></div>
        <div class="bl-field"><label>{{ dash.t[dash.lang].billingNoLabel }}</label><input :value="form.br_no" readonly class="bl-ro" /></div>
      </div>
      <div class="bl-hcol">
        <div class="bl-field"><label>{{ dash.t[dash.lang].dueDateLabel }}</label><input type="date" v-model="form.due_date" /></div>
        <div class="bl-field"><label>{{ dash.t[dash.lang].customerWord }}</label><input :value="form.customer" readonly class="bl-ro" :placeholder="dash.t[dash.lang].selectFromListPlaceholder" /></div>
      </div>
    </div>

    <div class="bl-body">
      <!-- ซ้าย: รายชื่อลูกค้า -->
      <div class="bl-left">
        <div class="bl-panel-title">{{ dash.t[dash.lang].customerListTitle }}</div>
        <div class="bl-cust-list">
          <div v-for="(c, i) in customers" :key="i" class="bl-cust" :class="{ 'is-sel': form.customer === c }" @click="selectCustomer(c)">
            <span class="bl-cust-no">{{ i + 1 }}</span>{{ c }}
          </div>
          <div v-if="customers.length === 0" class="bl-empty">{{ dash.t[dash.lang].noCustomerListMsg }}</div>
        </div>
      </div>

      <!-- กลาง: 3 ตาราง -->
      <div class="bl-mid">
        <div class="bl-doc-block" v-for="blk in blocks" :key="blk.key">
          <div class="bl-doc-head">
            <span class="bl-doc-title">{{ blk.title }}</span>
            <span class="bl-doc-hint">{{ docs[blk.key].length }} {{ dash.t[dash.lang].itemsCountClickHint }}</span>
          </div>
          <table class="bl-doc-table">
            <thead><tr><th>{{ dash.lang === 'th' ? 'ที่' : 'No.' }}</th><th>{{ dash.t[dash.lang].dateLabel }}</th><th>{{ dash.t[dash.lang].invoiceRefNoLabel }}</th><th class="bl-r">{{ dash.t[dash.lang].totalAmountLabel }}</th></tr></thead>
            <tbody>
              <tr v-for="(d, i) in docs[blk.key]" :key="i" :class="{ 'is-picked': isPicked(blk.key, d) }" @click="pickDoc(blk.key, d)">
                <td class="bl-c">{{ i + 1 }}</td><td>{{ d.doc_date || '-' }}</td><td>{{ d.inv_no }}</td>
                <td class="bl-r" :class="{ 'bl-neg': blk.key === 'credit' }">{{ blk.key === 'credit' ? '-' : '' }}{{ fmt(d.total) }}</td>
              </tr>
              <tr v-if="docs[blk.key].length === 0"><td colspan="4" class="bl-doc-empty">{{ form.customer ? dash.t[dash.lang].noItemsWord : dash.t[dash.lang].selectCustomerFirstMsg }}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ขวา: รายการที่เลือกวางบิล -->
      <div class="bl-right">
        <div class="bl-panel-title">{{ dash.t[dash.lang].billItemsCountTitle }} ({{ selected.length }})</div>
        <table class="bl-doc-table">
          <thead><tr><th>{{ dash.lang === 'th' ? 'ที่' : 'No.' }}</th><th>{{ dash.t[dash.lang].typeLabel }}</th><th>{{ dash.t[dash.lang].invoiceRefNoLabel }}</th><th class="bl-r">{{ dash.t[dash.lang].amountLabel }}</th><th></th></tr></thead>
          <tbody>
            <tr v-for="(s, i) in selected" :key="i">
              <td class="bl-c">{{ i + 1 }}</td><td>{{ s.typeLabel }}</td><td>{{ s.inv_no }}</td>
              <td class="bl-r" :class="{ 'bl-neg': s.type === 'credit' }">{{ s.type === 'credit' ? '-' : '' }}{{ fmt(s.total) }}</td>
              <td class="bl-c"><button class="bl-x" @click="unpick(i)">✕</button></td>
            </tr>
            <tr v-if="selected.length === 0"><td colspan="5" class="bl-doc-empty">{{ dash.t[dash.lang].clickInvoiceToAddMsg }}</td></tr>
          </tbody>
          <tfoot v-if="selected.length"><tr><td colspan="3" class="bl-r bl-bold">{{ dash.t[dash.lang].netBillTotalLabel }}</td><td class="bl-r bl-bold">{{ fmt(netTotal) }}</td><td></td></tr></tfoot>
        </table>
      </div>
    </div>

    <div class="bl-footer">
      <span v-if="savedMsg" class="bl-saved">{{ savedMsg }}</span>
      <div class="bl-fbtns">
        <button class="bl-btn" @click="dash.fbFail('ตัวอย่างรายงาน (ยังไม่เชื่อมระบบพิมพ์รายงานจริง)')">👁 {{ dash.t[dash.lang].reportBtnWord }}</button>
        <button class="bl-btn bl-btn-save" @click="save">💾 {{ dash.t[dash.lang].save }}</button>
      </div>
    </div>
  </template>

  <!-- ===== โหมด Bulk ===== -->
  <template v-else>
    <div class="bl-bulk-filter">
      <label class="bl-radio"><input type="radio" value="invoice" v-model="bulk.dateType" /> {{ dash.t[dash.lang].invoiceDateTypeWord }}</label>
      <label class="bl-radio"><input type="radio" value="due" v-model="bulk.dateType" /> {{ dash.t[dash.lang].dueDateLabel }}</label>
      <label class="bl-radio"><input type="radio" value="month" v-model="bulk.dateType" /> {{ dash.t[dash.lang].monthWord }}</label>
      <select v-if="bulk.dateType === 'month'" v-model="bulk.month" class="bl-sel"><option v-for="m in months" :key="m" :value="m">{{ m }}</option></select>
      <template v-else><input type="date" v-model="bulk.from" class="bl-date" /><span>–</span><input type="date" v-model="bulk.to" class="bl-date" /></template>
      <select v-model="bulk.type" class="bl-sel"><option value="all">{{ dash.t[dash.lang].wholesaleRetailWord }}</option><option value="wholesale">{{ dash.t[dash.lang].wholesaleWord }}</option><option value="retail">{{ dash.t[dash.lang].retailSaleWord }}</option></select>
      <button class="bl-search">🔍 {{ dash.t[dash.lang].searchWord }}</button>
    </div>
    <div class="bl-bulk-body">
      <div class="bl-bulk-left">
        <div class="bl-bulk-tools"><a @click="bulkAll(true)">Select All</a> | <a @click="bulkAll(false)">Remove All</a></div>
        <div class="bl-bulk-list">
          <label v-for="(c, i) in customers" :key="i" class="bl-bulk-item">
            <input type="checkbox" :value="c" v-model="bulk.selected" /> {{ c }}
          </label>
        </div>
      </div>
      <div class="bl-bulk-right">
        <div class="bl-bulk-count">{{ bulk.selected.length }}/{{ customers.length }} Values accepted</div>
        <div class="bl-bulk-accepted">
          <div v-for="(c, i) in bulk.selected" :key="i" class="bl-bulk-acc">{{ c }}</div>
          <div v-if="bulk.selected.length === 0" class="bl-empty">{{ dash.t[dash.lang].noCustomerSelectedMsg }}</div>
        </div>
      </div>
    </div>
    <div class="bl-footer">
      <span v-if="savedMsg" class="bl-saved">{{ savedMsg }}</span>
      <div class="bl-fbtns">
        <button class="bl-btn" @click="dash.fbFail('ตัวอย่างรายงาน (ยังไม่เชื่อมระบบพิมพ์รายงานจริง)')">👁 {{ dash.t[dash.lang].reportBtnWord }}</button>
        <button class="bl-btn bl-btn-save" @click="saveBulk">💾 {{ dash.t[dash.lang].save }} ({{ bulk.selected.length }} {{ dash.t[dash.lang].peopleCountUnit }})</button>
      </div>
    </div>
  </template>
</div>
</template>

<script>
export default {
  name: 'CustomerBillingPage',
  inject: ['dash'],
  data() {
    return {
      bulkMode: false,
      form: { br_no: '', bill_date: new Date().toISOString().slice(0, 10), due_date: '', customer: '' },
      customers: [], docs: { wholesale: [], retail: [], credit: [] }, selected: [], savedMsg: '',
      bulk: { dateType: 'month', month: '', from: '', to: '', type: 'all', selected: [] },
      months: [],
    };
  },
  computed: {
    netTotal() { return this.selected.reduce((s, x) => s + (x.type === 'credit' ? -1 : 1) * (Number(x.total) || 0), 0); },
    blocks() {
      const t = this.dash.t[this.dash.lang];
      return [{ key: 'wholesale', title: t.wholesaleWord }, { key: 'retail', title: t.retailSaleWord }, { key: 'credit', title: t.creditNoteWord }];
    },
  },
  async mounted() {
    await this.loadNextNo(); this.loadCustomers();
    const now = new Date();
    for (let i = 0; i < 6; i++) { const d = new Date(now.getFullYear(), now.getMonth() - i, 1); this.months.push(d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })); }
    this.bulk.month = this.months[0];
  },
  methods: {
    fmt(v) { return (Number(v) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
    async loadNextNo() { try { const r = await fetch('/api/customer-billings/next-no', { headers: { Authorization: 'Bearer ' + this.dash.token } }); const d = await r.json(); if (d.ok) this.form.br_no = d.br_no; } catch (e) {} },
    async loadCustomers() { try { const r = await fetch('/api/customers', { headers: { Authorization: 'Bearer ' + this.dash.token } }); const d = await r.json(); this.customers = (d.items || d.customers || []).map(c => c.company_name || c.name).filter(Boolean).slice(0, 300); } catch (e) {} },
    async selectCustomer(c) {
      this.form.customer = c; this.selected = [];
      try { const r = await fetch('/api/customer-billings/documents?customer=' + encodeURIComponent(c), { headers: { Authorization: 'Bearer ' + this.dash.token } }); const d = await r.json(); if (d.ok) this.docs = { wholesale: d.wholesale || [], retail: d.retail || [], credit: d.credit || [] }; } catch (e) {}
    },
    isPicked(type, d) { return this.selected.some(s => s.type === type && s.inv_no === d.inv_no); },
    pickDoc(type, d) {
      if (this.isPicked(type, d)) return;
      const t = this.dash.t[this.dash.lang];
      const label = { wholesale: t.wholesaleWord, retail: t.retailSaleWord, credit: t.creditNoteWord }[type];
      this.selected.push({ type, typeLabel: label, inv_no: d.inv_no, doc_date: d.doc_date, total: d.total });
    },
    unpick(i) { this.selected.splice(i, 1); },
    async save() {
      if (!this.form.customer) { this.dash.fbFail(this.dash.t[this.dash.lang].requireSelectCustomerMsg); return; }
      if (this.selected.length === 0) { this.dash.fbFail(this.dash.t[this.dash.lang].requireSelectInvoiceMsg); return; }
      this.dash.fbLoading('กำลังบันทึก...');
      try {
        const res = await fetch('/api/customer-billings', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.dash.token }, body: JSON.stringify({ ...this.form, total_amount: this.netTotal, items: this.selected }) });
        const d = await res.json();
        if (d.ok) { this.form.br_no = d.br_no; this.savedMsg = this.dash.t[this.dash.lang].billedSuccessPrefix + ' (' + d.br_no + ')'; this.dash.fbDone('บันทึกแล้ว'); this.selected = []; this.form.customer = ''; this.docs = { wholesale: [], retail: [], credit: [] }; this.loadNextNo(); }
        else { this.dash.fbFail(d.message || 'บันทึกไม่สำเร็จ'); }
      } catch (e) { this.dash.fbFail('บันทึกไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
    },
    bulkAll(v) { this.bulk.selected = v ? [...this.customers] : []; },
    async saveBulk() {
      if (this.bulk.selected.length === 0) { this.dash.fbFail(this.dash.t[this.dash.lang].requireSelectCustomerBulkMsg); return; }
      const t = this.dash.t[this.dash.lang];
      this.dash.fbLoading(t.billingInProgressPrefix + ' ' + this.bulk.selected.length + ' ' + t.peopleCountUnit + '...');
      let ok = 0;
      for (const c of this.bulk.selected) {
        try {
          const res = await fetch('/api/customer-billings', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.dash.token }, body: JSON.stringify({ bill_date: this.form.bill_date, due_date: this.form.due_date, customer: c, total_amount: 0, items: [], remark: 'Bulk ' + this.bulk.type }) });
          const d = await res.json(); if (d.ok) ok++;
        } catch (e) {}
      }
      this.dash.fbDone(t.billedDonePrefix + ' ' + ok + ' ' + t.peopleCountUnit); this.savedMsg = t.bulkBilledPrefix + ' ' + ok + ' ' + t.peopleCountUnit; this.bulk.selected = []; this.loadNextNo();
    },
  },
};
</script>

<style scoped>
.bl-page { font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif; color: var(--text); font-size: 12px; margin-top: 12px; background: var(--surface); border: 1px solid var(--field-border); border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.06); display: flex; flex-direction: column; }
.bl-titlebar { display: flex; align-items: center; gap: 16px; font-weight: 700; padding: 18px 20px 2px; font-size: 18px; }
.bl-bulk-btn { padding: 6px 14px; border: 1px solid var(--field-border); border-radius: 8px; background: var(--field); color: var(--text); font-weight: 600; cursor: pointer; font-family: inherit; font-size: 12.5px; }
.bl-bulk-btn:hover { background: #e7eaf1; }
.bl-head { display: flex; flex-wrap: wrap; gap: 22px; padding: 16px 20px; border-bottom: 1px solid var(--field-border); }
.bl-hcol { display: flex; flex-direction: column; gap: 8px; }
.bl-field { display: flex; align-items: center; gap: 8px; }
.bl-field > label { min-width: 100px; text-align: right; color: var(--muted); font-size: 12px; font-weight: 600; }
.bl-field input { height: 34px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12px; font-family: inherit; background: var(--field); color: var(--text); min-width: 160px; }
.bl-field input:focus { outline: none; border-color: #2F65F6; background: var(--surface); }
.bl-ro { background: var(--field) !important; font-weight: 700; }
.bl-body { display: flex; gap: 14px; padding: 16px 20px; align-items: flex-start; }
.bl-left { width: 260px; flex-shrink: 0; }
.bl-mid { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 14px; }
.bl-right { width: 340px; flex-shrink: 0; }
.bl-panel-title { font-weight: 700; font-size: 12px; margin-bottom: 8px; }
.bl-cust-list { border: 1px solid var(--field-border); border-radius: 10px; overflow: hidden; max-height: 480px; overflow-y: auto; }
.bl-cust { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-bottom: 1px solid var(--field-border); cursor: pointer; background: #eafaf1; font-size: 12.5px; }
.bl-cust:hover { background: #d7f2e3; } .bl-cust.is-sel { background: #1a9c54; color: #fff; }
.bl-cust-no { width: 20px; color: var(--muted); font-size: 11px; } .bl-cust.is-sel .bl-cust-no { color: rgba(255,255,255,.8); }
.bl-empty { padding: 18px; text-align: center; color: var(--muted); }
.bl-doc-block { border: 1px solid var(--field-border); border-radius: 10px; overflow: hidden; }
.bl-doc-head { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--field); border-bottom: 1px solid var(--field-border); }
.bl-doc-title { font-weight: 700; font-size: 12.5px; }
.bl-doc-hint { font-size: 11px; color: var(--muted); }
.bl-doc-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.bl-doc-table thead th { background: #3c4453; color: #fff; padding: 7px 10px; text-align: left; font-weight: 600; }
.bl-doc-table th.bl-r { text-align: right; }
.bl-doc-table tbody td { padding: 6px 10px; border-bottom: 1px solid var(--field-border); }
.bl-doc-table tbody tr { cursor: pointer; } .bl-doc-table tbody tr:hover { background: var(--field); }
.bl-doc-table tbody tr.is-picked { background: #e7f6ee; }
.bl-r { text-align: right; } .bl-c { text-align: center; color: var(--muted); }
.bl-neg { color: #e03131; } .bl-bold { font-weight: 700; }
.bl-doc-empty { text-align: center; color: var(--muted); padding: 16px; }
.bl-doc-table tfoot td { padding: 8px 10px; border-top: 2px solid var(--field-border); background: var(--field); }
.bl-x { width: 22px; height: 22px; border-radius: 5px; border: 1px solid var(--field-border); background: var(--surface); color: #e03131; cursor: pointer; }
.bl-x:hover { background: #fdeaea; }
.bl-footer { display: flex; align-items: center; justify-content: space-between; padding: 9px 14px; border-top: 1px solid var(--field-border); background: var(--field); border-radius: 0 0 14px 14px; margin-top: auto; }
.bl-saved { color: #1a9c54; font-size: 12px; font-weight: 600; }
.bl-fbtns { display: flex; gap: 10px; margin-left: auto; }
.bl-btn { padding: 6px 14px; border: 1px solid var(--field-border); border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 12px; background: #e7eaf1; color: var(--text); }
.bl-btn-save { background: #1a9c54; color: #fff; border-color: #1a9c54; } .bl-btn-save:hover { background: #158045; }
/* Bulk */
.bl-bulk-filter { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; padding: 16px 20px; border-bottom: 1px solid var(--field-border); }
.bl-radio { display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px; cursor: pointer; }
.bl-sel, .bl-date { height: 34px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; background: var(--field); color: var(--text); font-family: inherit; }
.bl-search { height: 34px; padding: 0 16px; border: 1px solid #1e3a8a; background: #1e3a8a; color: #fff; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; }
.bl-bulk-body { display: flex; gap: 18px; padding: 18px 20px; }
.bl-bulk-left, .bl-bulk-right { flex: 1; }
.bl-bulk-tools { margin-bottom: 8px; font-size: 12.5px; }
.bl-bulk-tools a { color: #2F65F6; cursor: pointer; font-weight: 600; } .bl-bulk-tools a:hover { text-decoration: underline; }
.bl-bulk-list { border: 1px solid var(--field-border); border-radius: 10px; max-height: 460px; overflow-y: auto; }
.bl-bulk-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-bottom: 1px solid var(--field-border); font-size: 12.5px; cursor: pointer; }
.bl-bulk-item:hover { background: var(--field); }
.bl-bulk-count { font-weight: 700; color: #2F65F6; margin-bottom: 8px; font-size: 12px; }
.bl-bulk-accepted { border: 1px solid var(--field-border); border-radius: 10px; min-height: 460px; max-height: 460px; overflow-y: auto; padding: 8px; }
.bl-bulk-acc { padding: 7px 10px; border-bottom: 1px solid var(--field-border); font-size: 12.5px; }
</style>
