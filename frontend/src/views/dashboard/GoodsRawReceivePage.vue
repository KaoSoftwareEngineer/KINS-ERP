<template>
<div class="po-page">
  <div class="po-titlebar">📥 รับผ้าดิบ</div>

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
      <div class="po-field"><label>โรงงาน</label>
        <input list="gr-factories" v-model="form.factory" placeholder="เลือก/พิมพ์โรงงาน" />
        <datalist id="gr-factories"><option v-for="f in factoryOptions" :key="f" :value="f" /></datalist>
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
          <th>รหัสสินค้า</th><th>ชื่อ</th><th>หน้ากว้าง</th><th>เลขที่ล็อต</th>
          <th style="width:90px;">จำนวน</th><th style="width:100px;">ราคา/หน่วย</th><th style="width:110px;">ราคา</th>
          <th style="width:120px;"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in items" :key="row._key">
          <td class="po-no">{{ idx + 1 }}</td>
          <td><input v-model="row.sku" @blur="lookupSku(row)" placeholder="รหัส" /></td>
          <td><input v-model="row.name" class="po-ro-cell" placeholder="ชื่อ" /></td>
          <td><input v-model="row.width" class="po-ro-cell" placeholder="หน้ากว้าง" /></td>
          <td><input v-model="row.lot" placeholder="เลขที่ล็อต" /></td>
          <td><input type="number" v-model.number="row.qty" class="po-num" /></td>
          <td><input type="number" v-model.number="row.unit_price" class="po-num" /></td>
          <td><input :value="lineTotal(row).toFixed(2)" readonly class="po-num po-ro-cell" /></td>
          <td class="po-row-actions">
            <button class="po-ic po-add" title="เพิ่มแถว" @click="addRow(idx)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            </button>
            <button class="po-ic po-del" title="ลบแถว" @click="removeRow(idx)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6"/></svg>
            </button>
            <button class="po-ic po-copy" title="คัดลอกแถว" @click="copyRow(idx)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="po-foot-row">
          <td colspan="4" class="po-foot-label">รวม</td>
          <td></td>
          <td class="po-num">{{ totalQty.toFixed(2) }}</td>
          <td></td>
          <td class="po-num">{{ subtotal.toFixed(2) }}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>

    <!-- สรุปยอด -->
    <div class="po-summary">
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
      <template v-if="!saved">
        <button class="po-btn po-btn-save" @click="save">💾 บันทึก</button>
      </template>
      <template v-else>
        <button class="po-btn po-btn-receipt" @click="openReceiptPdf">🧾 ใบรับสินค้า</button>
        <button class="po-btn po-btn-new" @click="resetForm">🔄 รับใหม่</button>
      </template>
    </div>
  </div>
</div>
</template>

<script>
import { buildDocPdf } from '../../utils/pdfLabels.js';
export default {
  name: 'GoodsRawReceivePage',
  inject: ['dash'],
  data() {
    return {
      form: { in_no: '', receipt_date: new Date().toISOString().slice(0, 10), receipt_type: 'Purchase', factory: '', po_ref: '', supplier: '', bill_no: '', remark: '' },
      items: [this.newRow()],
      receiptTypes: ['Purchase', 'Production', 'Return', 'Transfer'],
      discountMode: 'none', discountValue: 0, vatMode: 'none',
      fabricRaw: [], vendorOptions: ['D Finest'], poOptions: [], factoryOptions: [],
      saved: false, savedMsg: '', savedData: null, _seq: 1,
    };
  },
  computed: {
    subtotal() { return this.items.reduce((s, r) => s + this.lineTotal(r), 0); },
    totalQty() { return this.items.reduce((s, r) => s + (Number(r.qty) || 0), 0); },
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
    newRow() { return { _key: (this._seq = (this._seq || 0) + 1), sku: '', name: '', width: '', lot: '', qty: null, unit_price: null }; },
    lineTotal(r) { return (Number(r.qty) || 0) * (Number(r.unit_price) || 0); },
    addRow(idx) { this.items.splice(idx + 1, 0, this.newRow()); },
    removeRow(idx) { if (this.items.length > 1) this.items.splice(idx, 1); },
    copyRow(idx) {
      const clone = JSON.parse(JSON.stringify(this.items[idx]));
      clone._key = (this._seq = (this._seq || 0) + 1);
      this.items.splice(idx + 1, 0, clone);
    },
    async loadNextNo() {
      try {
        const res = await fetch('/api/raw-receipts/next-no', { headers: { Authorization: 'Bearer ' + this.dash.token } });
        const d = await res.json();
        if (d.ok) this.form.in_no = d.in_no;
      } catch (e) {}
    },
    async loadRefs() {
      try {
        const res = await fetch('/api/fabric-raw', { headers: { Authorization: 'Bearer ' + this.dash.token } });
        const d = await res.json();
        this.fabricRaw = d.items || [];
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
      try {
        const r4 = await fetch('/api/factories', { headers: { Authorization: 'Bearer ' + this.dash.token } });
        const d4 = await r4.json();
        if (d4.ok) this.factoryOptions = (d4.items || []).map(f => f.name).filter(Boolean);
      } catch (e) {}
    },
    async lookupSku(row) {
      if (!row.sku) return;
      const f = this.fabricRaw.find(x => (x.sku || '').toLowerCase() === row.sku.trim().toLowerCase());
      if (!f) return;
      row.name = f.name || ''; row.width = f.width || '';
    },
    resetForm() {
      this.form = { in_no: '', receipt_date: new Date().toISOString().slice(0, 10), receipt_type: 'Purchase', factory: '', po_ref: '', supplier: '', bill_no: '', remark: '' };
      this.items = [this.newRow()];
      this.discountMode = 'none'; this.discountValue = 0; this.vatMode = 'none';
      this.saved = false; this.savedMsg = ''; this.savedData = null;
      this.loadNextNo();
    },
    async save() {
      const hasItem = this.items.some(r => (r.sku || '').trim());
      if (!hasItem) { this.dash.fbFail('กรุณากรอกรายการสินค้าอย่างน้อย 1 รายการ'); return; }
      this.dash.fbLoading('กำลังบันทึก...');
      const payload = {
        ...this.form,
        subtotal: this.subtotal, discount: this.discountAmount, vat: this.vatAmount, net_total: this.netTotal,
        items: this.items.filter(r => (r.sku || '').trim()).map(r => ({
          sku: r.sku, name: r.name, width: r.width, lot: r.lot,
          qty: r.qty, unit_price: r.unit_price, total: this.lineTotal(r),
        })),
      };
      try {
        const res = await fetch('/api/raw-receipts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.dash.token },
          body: JSON.stringify(payload),
        });
        if (res.status === 401) { this.dash.fbHide(); this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) {
          this.form.in_no = d.in_no;
          this.saved = true;
          this.savedData = JSON.parse(JSON.stringify(payload));
          this.savedMsg = 'ระบบได้ทำการเพิ่มข้อมูลเรียบร้อยแล้ว';
          this.dash.fbDone('บันทึกแล้ว');
        } else { this.dash.fbFail(d.message || 'บันทึกไม่สำเร็จ'); }
      } catch (e) { this.dash.fbFail('บันทึกไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
    },
    async openReceiptPdf() {
      const f = this.form;
      const rows = this.items.filter(r => (r.sku || '').trim());
      const esc = (s) => (s == null ? '' : String(s)).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
      const body = rows.map((r, i) => `<tr><td>${i + 1}</td><td style="text-align:left">${esc(r.sku)}</td><td style="text-align:left">${esc(r.name)}</td><td>${esc(r.width)}</td><td>${esc(r.lot)}</td><td>${r.qty || ''}</td><td>${(Number(r.unit_price) || 0).toFixed(2)}</td><td>${this.lineTotal(r).toFixed(2)}</td></tr>`).join('');
      const html = `
        <style>
          .doc{font-family:'Noto Sans Thai','Times New Roman',serif;color:#000}
          .center{text-align:center}.h1{font-size:20px;font-weight:bold}.h2{font-size:14px;font-weight:bold}
          .addr{font-size:12px;margin-top:4px}
          .meta{display:flex;justify-content:space-between;font-size:12px;margin:14px 0}
          .doc table{width:100%;border-collapse:collapse;margin-top:6px}
          .doc th,.doc td{border:1px solid #000;padding:5px 6px;font-size:12px;text-align:center;height:22px}
          .doc th{font-weight:bold;background:#f0f0f0}
          .foot{display:flex;justify-content:space-between;align-items:flex-end;margin-top:44px;font-size:12px}
        </style>
        <div class="doc">
        <div class="center h1">D'finest Fabric Co., Ltd.</div>
        <div class="center h2">ใบรับผ้าดิบ (Raw Fabric Receipt)</div>
        <div class="center addr">55/4 Meesuwan 3 Yeak 1, Sukhumvit 71 Rd. Wattana District, Bangkok, Thailand 10110</div>
        <div class="meta">
          <div><b>คู่ค้า :</b> ${esc(f.supplier) || '-'}<br><b>ประเภทการรับ :</b> ${esc(f.receipt_type)}<br><b>โรงงาน :</b> ${esc(f.factory) || '-'}</div>
          <div><b>เลขที่รับสินค้า :</b> ${esc(f.in_no)}<br><b>วันที่ :</b> ${esc(f.receipt_date)}<br><b>เลขที่บิล :</b> ${esc(f.bill_no) || '-'}</div>
        </div>
        <table>
          <thead><tr><th style="width:32px">ที่</th><th>รหัสสินค้า</th><th>ชื่อ</th><th>หน้ากว้าง</th><th>เลขที่ล็อต</th><th>จำนวน</th><th>ราคา/หน่วย</th><th>ราคา</th></tr></thead>
          <tbody>${body}
            <tr><td colspan="5"><b>รวม</b></td><td><b>${this.totalQty.toFixed(2)}</b></td><td></td><td><b>${this.subtotal.toFixed(2)}</b></td></tr>
          </tbody>
        </table>
        <div style="text-align:right;font-size: 12px;margin-top:10px"><b>ยอดสุทธิ :</b> ${this.netTotal.toFixed(2)} บาท</div>
        <div class="foot"><div><b>ผู้รับสินค้า :</b> ____________________</div><div><b>D'finest Fabric</b></div></div>
        </div>`;
      try { await buildDocPdf(html, { filename: 'ใบรับผ้าดิบ-' + (f.in_no || '') + '.pdf' }); }
      catch (e) { this.dash.fbFail('สร้าง PDF ไม่สำเร็จ'); }
    },
  },
};
</script>

<style scoped>
.po-page { font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif; color: var(--text); font-size: 12px; position: relative; margin-top: 12px; background: var(--surface); border: 1px solid var(--field-border); border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
.po-titlebar { background: transparent; color: var(--text); font-weight: 700; padding: 18px 20px 2px; font-size: 18px; }
.po-head { display: flex; flex-wrap: wrap; gap: 22px; padding: 20px; background: transparent; border: none; border-bottom: 1px solid var(--field-border); }
.po-head-col { display: flex; flex-direction: column; gap: 8px; }
.po-head-col-wide { flex: 1; min-width: 220px; }
.po-field { display: flex; align-items: flex-start; gap: 8px; }
.po-field > label { min-width: 96px; text-align: right; padding-top: 6px; color: var(--muted); font-size: 12px; font-weight: 600; }
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
.po-ro { background: var(--field) !important; font-weight: 700; }

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
.po-row-actions { display: flex; gap: 5px; justify-content: center; }
.po-ic { width: 28px; height: 28px; border-radius: 7px; border: 1px solid var(--field-border); background: var(--field); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; padding: 0; flex-shrink: 0; transition: background .15s, border-color .15s, color .15s; }
.po-ic svg { width: 15px; height: 15px; }
.po-add { color: #1a9c54; } .po-add:hover { background: #e7f6ee; border-color: #1a9c54; }
.po-del { color: #e03131; } .po-del:hover { background: #fdeaea; border-color: #e03131; }
.po-copy { color: #2F65F6; } .po-copy:hover { background: #e9f0fe; border-color: #2F65F6; }
.po-foot-row td { padding: 9px 8px; border-top: 2px solid var(--field-border); font-weight: 700; font-size: 12.5px; }
.po-foot-label { text-align: right; color: var(--muted); }

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
.po-btn-receipt { background: #3c4453; color: #fff; border-color: #3c4453; }
.po-btn-receipt:hover { background: #2d333f; }
.po-btn-new { background: #1a9c54; color: #fff; border-color: #1a9c54; }
.po-btn-new:hover { background: #158045; }

/* ช่องกรอกที่ยังว่าง — ใส่พื้นเทาอ่อนให้มองเห็นชัด */
.po-page input:not([type="checkbox"]), .po-page select, .po-page textarea { background: var(--field); }
.po-page input:focus, .po-page select:focus, .po-page textarea:focus { background: var(--surface); }
</style>
