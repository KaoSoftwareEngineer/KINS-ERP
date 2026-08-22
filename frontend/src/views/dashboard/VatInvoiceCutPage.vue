<template>
<div class="po-page">
  <div class="po-titlebar">✂️ ตัดสต็อก VAT จากใบกำกับภาษี</div>

  <div class="po-head">
    <div class="po-head-col">
      <div class="po-field"><label>วันที่</label><input type="date" v-model="form.cut_date" /></div>
      <div class="po-field"><label>เลขที่เบิกสินค้า</label><input :value="form.vo_no" readonly class="po-ro" /></div>
    </div>
    <div class="po-head-col">
      <div class="po-field"><label>เลขที่ใบกำกับภาษี</label>
        <select v-model="form.invoice_ref" @change="selectInvoice">
          <option value="">— เลือกใบกำกับภาษี —</option>
          <option v-for="iv in invoices" :key="iv.id" :value="iv.vt_no">{{ iv.vt_no }}</option>
        </select>
      </div>
      <div class="po-field"><label>ลูกค้า</label><input :value="form.customer" readonly class="po-ro" placeholder="—" /></div>
    </div>
    <div class="po-head-col">
      <div class="po-field"><label>เลขที่อินวอยส์</label><input :value="form.invoice_ref" readonly class="po-ro" placeholder="—" /></div>
      <div class="po-field"><label>ประเภทการขาย</label>
        <select v-model="form.sale_type"><option value="">— เลือก —</option><option>ขายในประเทศ</option><option>ส่งออก</option><option>ขายปลีก</option></select>
      </div>
    </div>
    <div class="po-head-col po-head-col-wide">
      <div class="po-field"><label>หมายเหตุ</label><textarea v-model="form.remark" rows="3"></textarea></div>
    </div>
  </div>

  <div class="po-items">
    <table class="po-item-table" v-if="items.length">
      <thead>
        <tr>
          <th style="width:40px;">ที่</th>
          <th style="text-align:left;">รายละเอียด</th><th style="width:130px;">ราคาขาย</th><th style="width:120px;">จำนวนที่ตัด</th>
          <th style="width:150px;">รวม</th><th style="width:130px;">กลุ่มสินค้า VAT</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in items" :key="idx">
          <td class="po-no">{{ idx + 1 }}</td>
          <td>{{ row.detail || '-' }}</td>
          <td class="po-num">{{ (Number(row.sale_price) || 0).toFixed(2) }}</td>
          <td><input type="number" v-model.number="row.qty_cut" class="po-num" /></td>
          <td class="po-num">{{ lineTotal(row).toFixed(2) }}</td>
          <td style="text-align:center">{{ row.group || '-' }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="po-foot-row">
          <td colspan="3" class="po-foot-label">รวม</td>
          <td class="po-num">{{ totalQty }}</td>
          <td class="po-num">{{ totalAmount.toFixed(2) }}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>
    <div v-else class="po-empty">เลือกเลขที่ใบกำกับภาษีด้านบน เพื่อดึงรายการมาตัดสต็อก</div>
  </div>

  <div class="po-footer">
    <span v-if="savedMsg" class="po-saved-msg">{{ savedMsg }}</span>
    <div class="po-footer-btns">
      <button class="po-btn po-btn-report" @click="dash.fbFail('ตัวอย่างรายงาน (ยังไม่เชื่อมระบบพิมพ์รายงานจริง)')">👁 รายงาน</button>
      <button v-if="!saved" class="po-btn po-btn-save" @click="save">💾 บันทึก</button>
      <button v-else class="po-btn po-btn-new" @click="resetForm">🔄 ตัดใหม่</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'VatInvoiceCutPage',
  inject: ['dash'],
  data() {
    return {
      form: { vo_no: '', cut_date: new Date().toISOString().slice(0, 10), invoice_ref: '', customer: '', sale_type: '', remark: '' },
      items: [], invoices: [], saved: false, savedMsg: '',
    };
  },
  computed: {
    totalQty() { return this.items.reduce((s, r) => s + (Number(r.qty_cut) || 0), 0); },
    totalAmount() { return this.items.reduce((s, r) => s + this.lineTotal(r), 0); },
  },
  async mounted() { await this.loadNextNo(); this.loadInvoices(); },
  methods: {
    lineTotal(r) { return (Number(r.sale_price) || 0) * (Number(r.qty_cut) || 0); },
    async loadNextNo() {
      try { const res = await fetch('/api/vat-stock-cuts/next-no', { headers: { Authorization: 'Bearer ' + this.dash.token } }); const d = await res.json(); if (d.ok) this.form.vo_no = d.vo_no; } catch (e) {}
    },
    async loadInvoices() {
      try { const res = await fetch('/api/vat-invoices', { headers: { Authorization: 'Bearer ' + this.dash.token } }); const d = await res.json(); this.invoices = d.invoices || []; } catch (e) {}
    },
    selectInvoice() {
      const iv = this.invoices.find(x => x.vt_no === this.form.invoice_ref);
      if (!iv) { this.items = []; this.form.customer = ''; return; }
      this.form.customer = iv.customer || '';
      let list = [];
      try { list = JSON.parse(iv.items_json || '[]'); } catch (e) {}
      this.items = list.map(it => ({ detail: it.detail || '', sale_price: it.sale_price || 0, qty_cut: it.qty_cut || 0, group: it.group || '' }));
    },
    resetForm() {
      this.form = { vo_no: '', cut_date: new Date().toISOString().slice(0, 10), invoice_ref: '', customer: '', sale_type: '', remark: '' };
      this.items = []; this.saved = false; this.savedMsg = ''; this.loadNextNo();
    },
    async save() {
      if (!this.form.invoice_ref) { this.dash.fbFail('กรุณาเลือกเลขที่ใบกำกับภาษี'); return; }
      if (this.items.length === 0) { this.dash.fbFail('ใบกำกับนี้ไม่มีรายการ'); return; }
      this.dash.fbLoading('กำลังบันทึก...');
      const payload = {
        cut_date: this.form.cut_date, source: 'invoice', invoice_ref: this.form.invoice_ref, customer: this.form.customer, sale_type: this.form.sale_type, remark: this.form.remark,
        total_qty: this.totalQty, total_amount: this.totalAmount,
        items: this.items.map(r => ({ detail: r.detail, sale_price: r.sale_price, qty_cut: r.qty_cut, total: this.lineTotal(r), group: r.group })),
      };
      try {
        const res = await fetch('/api/vat-stock-cuts', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.dash.token }, body: JSON.stringify(payload) });
        if (res.status === 401) { this.dash.fbHide(); this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) { this.form.vo_no = d.vo_no; this.saved = true; this.savedMsg = 'ตัดสต็อกจากใบกำกับเรียบร้อยแล้ว'; this.dash.fbDone('บันทึกแล้ว'); }
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
.po-items { padding: 8px 12px; min-height: 120px; overflow-x: auto; }
.po-item-table { width: 100%; border-collapse: collapse; min-width: 820px; }
.po-item-table th { text-align: center; font-size: 12px; color: #fff; background: #3c4453; padding: 10px 8px; font-weight: 600; border-right: 1px solid rgba(255,255,255,.18); }
.po-item-table th:last-child { border-right: none; }
.po-item-table td { padding: 7px 8px; border-bottom: 1px solid var(--field-border); }
.po-item-table input { width: 100%; height: 32px; padding: 0 9px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12.5px; font-family: inherit; background: var(--field); color: var(--text); }
.po-item-table input:focus { outline: none; border-color: #2F65F6; background: var(--surface); box-shadow: 0 0 0 3px rgba(47,101,246,.12); }
.po-num { text-align: right; }
.po-no { text-align: center; color: var(--muted); }
.po-empty { text-align: center; color: var(--muted); padding: 30px; }
.po-foot-row td { padding: 9px 8px; border-top: 2px solid var(--field-border); font-weight: 700; font-size: 12.5px; }
.po-foot-label { text-align: right; color: var(--muted); }
.po-footer { display: flex; align-items: center; justify-content: space-between; padding: 9px 14px; border-top: 1px solid var(--field-border); background: var(--field); border-radius: 0 0 14px 14px; }
.po-saved-msg { color: #1a9c54; font-size: 12px; font-weight: 600; }
.po-footer-btns { display: flex; gap: 10px; margin-left: auto; }
.po-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; border: 1px solid var(--field-border); border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 12px; background: #e7eaf1; color: var(--text); }
.po-btn-save, .po-btn-new { background: #1a9c54; color: #fff; border-color: #1a9c54; }
.po-btn-save:hover, .po-btn-new:hover { background: #158045; }
.po-page input:not([type="checkbox"]), .po-page select, .po-page textarea { background: var(--field); }
.po-page input:focus, .po-page select:focus, .po-page textarea:focus { background: var(--surface); }
</style>
