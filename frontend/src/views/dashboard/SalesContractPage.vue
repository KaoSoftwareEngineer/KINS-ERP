<template>
<div class="sc-wrap text-[var(--text)]">
  <div class="flex items-center justify-between flex-wrap gap-3 mb-4">
    <div>
      <h1 class="text-xl font-bold flex items-center gap-2">📝 สัญญาขาย (Sales Contract)</h1>
      <p class="text-xs text-[var(--muted)] mt-0.5">สร้างสัญญาขาย → บันทึกแล้วพิมพ์เอกสารสัญญาส่งลูกค้าได้</p>
    </div>
    <div class="flex items-center gap-2">
      <button class="sc-btn-ghost" @click="resetForm">ล้างฟอร์ม</button>
      <button class="sc-btn-primary" :disabled="saving" @click="save">{{ saving ? 'กำลังบันทึก...' : '💾 บันทึก' }}</button>
      <button v-if="saved" class="sc-btn-print" @click="printContract">🖨️ รายงาน / พิมพ์สัญญา</button>
    </div>
  </div>

  <!-- หัวเอกสาร -->
  <div class="sc-card mb-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-3">
      <div class="sc-field"><label>วันที่</label><input type="date" v-model="form.contract_date" /></div>
      <div class="sc-field"><label>เลขที่สัญญา</label><input type="text" v-model="form.sc_no" placeholder="อัตโนมัติ" /></div>
      <div class="sc-field"><label>วันที่จัดส่ง</label><input type="date" v-model="form.shipment_date" /></div>
      <div class="sc-field"><label>ลูกค้า <span class="text-[var(--danger)]">*</span></label><input type="text" v-model="form.customer" list="sc-customers" placeholder="ชื่อลูกค้า" /></div>
      <div class="sc-field sm:col-span-2"><label>ที่อยู่ (สำหรับสัญญา)</label><input type="text" v-model="form.address" placeholder="ที่อยู่ลูกค้า" /></div>
      <div class="sc-field"><label>เงื่อนไขบัญชี</label><input type="text" v-model="form.payment_term" placeholder="เช่น 120 Days" /></div>
      <div class="sc-field"><label>มัดจำ</label><input type="number" min="0" v-model.number="form.deposit" placeholder="0" /></div>
      <div class="sc-field"><label>สกุลเงิน</label><input type="text" v-model="form.currency" placeholder="THB" /></div>
      <div class="sc-field"><label>โครงสร้างผ้า</label><input type="text" v-model="form.structure" placeholder="Construction" /></div>
      <div class="sc-field"><label>หน่วย</label><input type="text" v-model="form.unit" placeholder="หลา" /></div>
      <div class="sc-field sm:col-span-2 lg:col-span-4"><label>หมายเหตุ</label><input type="text" v-model="form.note" placeholder="Remark" /></div>
      <datalist id="sc-customers"><option v-for="c in customerOptions" :key="c" :value="c" /></datalist>
    </div>
  </div>

  <!-- ตารางรายการ -->
  <div class="sc-card mb-4">
    <div class="flex items-center justify-between mb-3">
      <div class="font-bold text-sm">รายการสินค้า</div>
      <button class="sc-btn-add" @click="addRow">+ เพิ่มรายการ</button>
    </div>
    <div class="overflow-x-auto">
      <table class="sc-table">
        <thead>
          <tr>
            <th style="width:32px">#</th>
            <th style="min-width:150px">รหัสสินค้า</th>
            <th style="min-width:120px">รหัสสี</th>
            <th style="min-width:200px">คำอธิบาย</th>
            <th style="width:110px">จำนวน</th>
            <th style="width:100px">ราคา/หน่วย</th>
            <th style="width:130px">ราคา</th>
            <th style="width:90px">หน้ากว้าง</th>
            <th style="width:90px">ความยาว</th>
            <th style="min-width:120px">หมายเหตุ</th>
            <th style="width:40px"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, idx) in items" :key="idx">
            <td class="text-center text-[var(--muted)]">{{ idx + 1 }}</td>
            <td><input type="text" v-model="row.sku" list="sc-fabrics" @change="onSkuChange(row)" placeholder="เลือก/พิมพ์" /></td>
            <td><input type="text" v-model="row.color_code" placeholder="รหัสสี" /></td>
            <td><input type="text" v-model="row.description" placeholder="คำอธิบาย" /></td>
            <td><input type="number" min="0" v-model.number="row.qty" placeholder="0" /></td>
            <td><input type="number" min="0" step="0.01" v-model.number="row.unit_price" placeholder="0" /></td>
            <td class="text-right font-semibold tabular-nums pr-2">{{ rowAmount(row).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</td>
            <td><input type="text" v-model="row.width" placeholder='44"' /></td>
            <td><input type="text" v-model="row.length" placeholder="0" /></td>
            <td><input type="text" v-model="row.note" placeholder="" /></td>
            <td class="text-center"><button class="sc-row-del" @click="removeRow(idx)">✕</button></td>
          </tr>
        </tbody>
      </table>
      <datalist id="sc-fabrics"><option v-for="f in products" :key="f.sku" :value="f.sku">{{ f.label }}</option></datalist>
    </div>

    <!-- สรุปยอด -->
    <div class="flex justify-end mt-3">
      <div class="w-full max-w-sm space-y-2 text-sm">
        <div class="flex items-center justify-between"><span class="text-[var(--muted)]">รวม</span><span class="font-semibold tabular-nums">{{ subtotal.toLocaleString(undefined,{minimumFractionDigits:2}) }}</span></div>
        <div class="flex items-center justify-between gap-2">
          <span class="text-[var(--muted)]">ส่วนลด</span>
          <div class="flex items-center gap-2">
            <select v-model="form.discount_type" class="sc-mini"><option value="None">None</option><option value="baht">บาท</option><option value="percent">%</option></select>
            <input v-if="form.discount_type!=='None'" type="number" min="0" v-model.number="form.discount_value" class="sc-mini w-20" />
            <span class="tabular-nums w-24 text-right">{{ discountAmount.toLocaleString(undefined,{minimumFractionDigits:2}) }}</span>
          </div>
        </div>
        <div class="flex items-center justify-between gap-2">
          <span class="text-[var(--muted)]">VAT</span>
          <div class="flex items-center gap-2">
            <select v-model="form.vat_type" class="sc-mini"><option value="None">None</option><option value="vat7">7%</option></select>
            <span class="tabular-nums w-24 text-right">{{ vatAmount.toLocaleString(undefined,{minimumFractionDigits:2}) }}</span>
          </div>
        </div>
        <div class="flex items-center justify-between border-t border-[var(--field-border)] pt-2"><span class="font-bold">ยอดสุทธิ</span><span class="font-bold text-base tabular-nums">{{ netTotal.toLocaleString(undefined,{minimumFractionDigits:2}) }}</span></div>
      </div>
    </div>
  </div>

  <p v-if="message" class="text-sm" :class="messageError ? 'text-[var(--danger)]' : 'text-green-600'">{{ message }}</p>
</div>
</template>

<script>
import { useCustomerStore } from '../../stores/customer.js';

export default {
  name: 'SalesContractPage',
  inject: ['dash'],
  setup() {
    return { customer: useCustomerStore() };
  },
  data() {
    return {
      form: {
        sc_no: '', contract_date: new Date().toISOString().slice(0, 10), shipment_date: '',
        customer: '', address: '', payment_term: '120 Days', deposit: 0, currency: 'THB',
        structure: '', unit: 'หลา', note: '', discount_type: 'None', discount_value: 0, vat_type: 'None',
      },
      items: [],
      products: [],
      saving: false, saved: false, message: '', messageError: false, savedContract: null,
    };
  },
  computed: {
    customerOptions() { return (this.customer.cuItems || []).map(c => c.company_name).filter(Boolean).slice(0, 200); },
    subtotal() { return this.items.reduce((s, r) => s + this.rowAmount(r), 0); },
    discountAmount() {
      if (this.form.discount_type === 'baht') return Number(this.form.discount_value) || 0;
      if (this.form.discount_type === 'percent') return Math.round(this.subtotal * (Number(this.form.discount_value) || 0)) / 100;
      return 0;
    },
    vatAmount() {
      if (this.form.vat_type === 'vat7') return Math.round((this.subtotal - this.discountAmount) * 7) / 100;
      return 0;
    },
    netTotal() { return Math.round((this.subtotal - this.discountAmount + this.vatAmount) * 100) / 100; },
  },
  mounted() {
    this.loadProducts();
    this.loadNextNo();
    if (!this.customer.cuItems || this.customer.cuItems.length === 0) this.customer.cuLoadItems();
    this.addRow();
  },
  methods: {
    hdr(json) { const h = { Authorization: 'Bearer ' + this.dash.token }; if (json) h['Content-Type'] = 'application/json'; return h; },
    async loadNextNo() {
      try {
        const res = await fetch('/api/sales-contracts/next-no', { headers: this.hdr() });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) this.form.sc_no = d.sc_no;
      } catch (e) {}
    },
    async loadProducts() {
      try {
        const [r1, r2] = await Promise.all([
          fetch('/api/fabrics', { headers: this.hdr() }),
          fetch('/api/fabric-irregular', { headers: this.hdr() }),
        ]);
        const d1 = await r1.json(); const d2 = await r2.json();
        const map = (a, s) => (a || []).map(f => ({ sku: f.sku, name: f.name || '', width: f.width || '', label: `${f.sku} — ${f.name || f.type || ''} ${s}` }));
        this.products = [...map(d1.fabrics, '(ประจำ)'), ...map(d2.items, '(ไม่ประจำ)')];
      } catch (e) { this.products = []; }
    },
    rowAmount(row) { return (Number(row.qty) || 0) * (Number(row.unit_price) || 0); },
    addRow() { this.items.push({ sku: '', color_code: '', description: '', qty: 0, unit_price: 0, width: '', length: '', note: '' }); },
    removeRow(idx) { this.items.splice(idx, 1); if (this.items.length === 0) this.addRow(); },
    onSkuChange(row) {
      const f = this.products.find(x => x.sku === row.sku);
      if (f) { if (!row.width) row.width = f.width; if (!row.description) row.description = (row.color_code ? row.color_code + ' : ' : '') + (f.name || ''); }
    },
    resetForm() {
      this.form = { sc_no: '', contract_date: new Date().toISOString().slice(0, 10), shipment_date: '', customer: '', address: '', payment_term: '120 Days', deposit: 0, currency: 'THB', structure: '', unit: 'หลา', note: '', discount_type: 'None', discount_value: 0, vat_type: 'None' };
      this.items = []; this.saved = false; this.savedContract = null; this.message = ''; this.addRow();
      this.loadNextNo();
    },
    async save() {
      if (!this.form.customer.trim()) { this.message = '⚠️ กรุณากรอกลูกค้า'; this.messageError = true; return; }
      const items = this.items.filter(r => (r.sku || r.description) && Number(r.qty) > 0);
      if (items.length === 0) { this.message = '⚠️ กรุณากรอกรายการอย่างน้อย 1 รายการ'; this.messageError = true; return; }
      this.saving = true; this.message = '';
      try {
        const payload = {
          ...this.form, shipment_date: this.form.shipment_date || null,
          discount_amount: this.discountAmount, vat_amount: this.vatAmount,
          items: items.map(r => ({ ...r, amount: this.rowAmount(r) })),
        };
        const res = await fetch('/api/sales-contracts', { method: 'POST', headers: this.hdr(true), body: JSON.stringify(payload) });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const data = await res.json();
        if (data.ok) { this.savedContract = data.contract; this.form.sc_no = data.contract.sc_no; this.saved = true; this.message = data.message; this.messageError = false; }
        else { this.message = '⚠️ ' + data.message; this.messageError = true; }
      } catch (e) { this.message = '⚠️ บันทึกไม่สำเร็จ'; this.messageError = true; }
      finally { this.saving = false; }
    },
    printContract() {
      const c = this.savedContract; if (!c) return;
      const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
      const money = (n) => Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2 });
      const rows = (c.items || []).map(it => `
        <tr>
          <td style="text-align:left">${esc(it.description || (it.sku + (it.color_code ? ' - ' + it.color_code : '')))}</td>
          <td>${money(it.qty)}</td>
          <td>${money(it.unit_price)}</td>
          <td>${esc(it.width)}${it.length ? ' x ABT. ' + esc(it.length) : ''}</td>
        </tr>`).join('');
      const win = window.open('', '_blank', 'width=800,height=1000');
      if (!win) { alert('เบราว์เซอร์บล็อกหน้าต่างพิมพ์'); return; }
      win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Sales Contract ${esc(c.sc_no)}</title>
        <style>
          body { font-family: 'Times New Roman', 'Noto Sans Thai', serif; margin: 28px; color: #000; font-size: 13px; }
          .center { text-align: center; } .right { text-align: right; }
          h1 { font-size: 20px; margin: 0; letter-spacing: 1px; }
          .company { text-align: center; border-bottom: 1px solid #000; padding-bottom: 8px; margin-bottom: 6px; }
          .company .sub { font-size: 11px; line-height: 1.5; }
          .title { text-align: center; font-size: 17px; font-weight: bold; margin: 14px 0; }
          .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 20px; margin-bottom: 10px; }
          .meta div { font-size: 12.5px; }
          .lbl { font-weight: bold; display: inline-block; min-width: 120px; }
          table.desc { width: 100%; border-collapse: collapse; margin: 10px 0; }
          table.desc th, table.desc td { border: 1px solid #000; padding: 6px 8px; text-align: center; font-size: 12px; }
          .bank { margin-top: 18px; display: grid; grid-template-columns: 1fr 1fr; }
          .bank .r { text-align: center; line-height: 1.8; }
          .rednote { color: #c00; font-size: 11px; }
          .sign { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 40px; text-align: center; }
          .sign .box { border: 1px solid #000; height: 90px; margin-bottom: 6px; }
          @media print { .no-print { display: none; } }
        </style></head><body>
        <div class="no-print center" style="margin-bottom:12px"><button onclick="window.print()" style="padding:8px 22px;font-size:14px;cursor:pointer">🖨️ พิมพ์</button></div>
        <div class="company">
          <h1>D FINEST FABRIC LIMITED PARTNERSHIP</h1>
          <div class="sub">55/4 Preedee Panomyong 14 Yeak 1, Sukhumvit 71, North Prakanong, Wattana, Bangkok, Thailand 10110<br>
          Tel : (662) 391-5737, (662) 391-5738, (662) 391-5739 &nbsp;&nbsp; Line ID: dfinest &nbsp;&nbsp; CONTACT: +6685-612-6555<br>
          EMAIL : DFINESTFABRIC@GMAIL.COM &nbsp;&nbsp; Website : WWW.SHIRTINGFABRIC.COM</div>
        </div>
        <div class="title">SALES CONTRACT NO. &nbsp; ${esc(c.sc_no)}</div>
        <div class="meta">
          <div><span class="lbl">BUYER</span> ${esc(c.customer)}</div>
          <div class="right"><span class="lbl" style="min-width:60px">DATE</span> ${esc(c.contract_date)}</div>
          <div><span class="lbl">ADDRESS</span> ${esc(c.address)}</div>
          <div></div>
        </div>
        <div class="meta" style="margin-top:8px">
          <div><span class="lbl">PAYMENT TERM</span> ${esc(c.payment_term)}</div>
          <div><span class="lbl">DEPOSIT</span> ${c.deposit ? money(c.deposit) : '-'} &nbsp; ${esc(c.currency)}</div>
          <div><span class="lbl">TOTAL AMOUNT</span> ${money(c.net_total)} &nbsp; ${esc(c.currency)}</div>
          <div><span class="lbl">SHIPMENT DATE</span> ${esc(c.shipment_date || '')}</div>
          <div><span class="lbl">CONSTRUCTION</span> ${esc(c.structure || '')}</div>
        </div>
        <table class="desc">
          <thead><tr><th style="width:45%">FABRIC DESCRIPTION</th><th>QUANTITY</th><th>UNIT PRICE</th><th>WIDTH X LENGTH</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="bank">
          <div>Remark : ${esc(c.note || '')}</div>
          <div class="r">
            Please Transfer To SCB Bank<br>
            Account Name &nbsp; Amit Srichawla<br>
            Account No. &nbsp; 071-301-4487<br>
            <span class="rednote">Please Send Slip After Transferred The Deposit</span>
          </div>
        </div>
        <div class="sign">
          <div><div class="box"></div>(DFINEST FABRIC LIMITED PARTNERSHIP)<br>WE CONFIRM THE ABOVE</div>
          <div><div class="box"></div>(BUYER)<br>ACCEPTED AND CONFIRM BY</div>
        </div>
        </body></html>`);
      win.document.close();
    },
  },
};
</script>

<style scoped>
.sc-wrap { padding: 4px 2px 40px; }
.sc-card { background: var(--surface); border: 1px solid var(--field-border); border-radius: 14px; padding: 16px 18px; }
.sc-field { display: flex; flex-direction: column; gap: 4px; }
.sc-field label { font-size: 12px; color: var(--muted); font-weight: 600; }
.sc-field input, .sc-table input, .sc-mini {
  height: 34px; border: 1px solid var(--field-border); border-radius: 8px; background: var(--field); color: var(--text);
  font-size: 13px; padding: 0 9px; width: 100%; font-family: inherit;
}
.sc-mini { height: 30px; width: auto; }
.sc-field input:focus, .sc-table input:focus, .sc-mini:focus { outline: none; border-color: var(--brand); }
.sc-table { width: 100%; border-collapse: collapse; }
.sc-table thead th { background: #3c4453; color: #fff; font-size: 11.5px; font-weight: 600; padding: 8px 6px; text-align: left; white-space: nowrap; }
.sc-table tbody td { padding: 5px 6px; border-bottom: 1px solid var(--field-border); }
.sc-table input { height: 30px; font-size: 12.5px; }
.sc-row-del { width: 26px; height: 26px; border-radius: 6px; border: 1px solid var(--field-border); background: var(--surface); color: var(--danger); cursor: pointer; }
.sc-row-del:hover { background: var(--danger); color: #fff; }
.sc-btn-primary { background: #1a9c54; color: #fff; border: 1px solid #1a9c54; border-radius: 9px; padding: 9px 18px; font-size: 13px; font-weight: 600; cursor: pointer; }
.sc-btn-primary:disabled { opacity: .6; }
.sc-btn-print { background: #1e3a8a; color: #fff; border: 1px solid #1e3a8a; border-radius: 9px; padding: 9px 16px; font-size: 13px; font-weight: 600; cursor: pointer; }
.sc-btn-add { background: var(--brand-soft); color: var(--brand); border: 1px solid var(--brand); border-radius: 8px; padding: 6px 14px; font-size: 12.5px; font-weight: 600; cursor: pointer; }
.sc-btn-ghost { background: var(--field); color: var(--text); border: 1px solid var(--field-border); border-radius: 9px; padding: 9px 16px; font-size: 13px; cursor: pointer; }
</style>
