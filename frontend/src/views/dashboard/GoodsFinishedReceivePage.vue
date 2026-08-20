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
          <th>รหัสสินค้า</th><th>รหัสสี</th><th>ชื่อ</th><th>หน้ากว้าง</th><th style="width:70px;">พับ</th>
          <th style="width:90px;">จำนวน</th><th style="width:100px;">ราคา/หน่วย</th><th style="width:110px;">ราคา</th>
          <th style="width:150px;"></th>
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
          <td><input :value="row.fold" readonly class="po-ro-cell po-num" /></td>
          <td><input :value="row.qty" readonly class="po-ro-cell po-num" /></td>
          <td><input type="number" v-model.number="row.unit_price" class="po-num" /></td>
          <td><input :value="lineTotal(row).toFixed(2)" readonly class="po-num po-ro-cell" /></td>
          <td class="po-row-actions">
            <button class="po-ic po-fold" title="รายละเอียดพับ" @click="openFoldDrawer(idx)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>
            </button>
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
          <td colspan="5" class="po-foot-label">รวม</td>
          <td class="po-num">{{ totalFold }}</td>
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
        <button class="po-btn po-btn-barcode" @click="printBarcodes">🏷️ บาร์โค้ด</button>
        <button class="po-btn po-btn-new" @click="resetForm">🔄 รับใหม่</button>
      </template>
    </div>
  </div>

  <!-- Drawer รายละเอียดพับ -->
  <transition name="fd-slide">
    <div v-if="foldDrawerOpen" class="fd-wrap">
      <div class="fd-backdrop" @click="closeFoldDrawer"></div>
      <div class="fd-drawer">
        <div class="fd-head">
          <div class="fd-head-txt">
            <span class="fd-head-title">รายละเอียดพับ</span>
            <span v-if="foldTitle" class="fd-head-sub">{{ foldTitle }}</span>
          </div>
          <button class="fd-x" title="ปิด" @click="closeFoldDrawer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="fd-body" v-if="foldRow">
          <p class="fd-hint">ระบุจำนวนหลาต่อพับ และจำนวนพับ — ระบบจะรวมเป็นจำนวนหลาทั้งหมดให้อัตโนมัติ</p>
          <div class="fd-list">
            <div class="fd-row fd-row-head">
              <div class="fd-c-per">จำนวน/พับ (หลา)</div>
              <div class="fd-c-cnt">จำนวนพับ</div>
              <div class="fd-c-sum">รวม (หลา)</div>
              <div class="fd-c-act"></div>
            </div>
            <div class="fd-row" v-for="(f, i) in foldRow.folds" :key="i">
              <div class="fd-c-per"><input type="number" v-model.number="f.perFold" class="fd-num" placeholder="0" /></div>
              <div class="fd-c-cnt"><input type="number" v-model.number="f.count" class="fd-num" placeholder="0" /></div>
              <div class="fd-c-sum"><input :value="foldLine(f).toFixed(2)" readonly class="fd-num fd-ro" /></div>
              <div class="fd-c-act">
                <button class="fd-mini fd-mini-del" title="ลบพับนี้" @click="removeFold(i)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 12h14"/></svg>
                </button>
              </div>
            </div>
          </div>
          <button class="fd-add-btn" @click="addFold(foldRow.folds.length - 1)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
            เพิ่มพับ
          </button>

          <div class="fd-summary">
            <div class="fd-sum-item"><span class="fd-sum-lbl">จำนวนพับรวม</span><span class="fd-sum-val">{{ foldTotalCount }}</span></div>
            <div class="fd-sum-item fd-sum-main"><span class="fd-sum-lbl">จำนวนหลารวม</span><span class="fd-sum-val">{{ foldTotalYards.toFixed(2) }}</span></div>
          </div>
        </div>
        <div class="fd-foot-bar">
          <button class="po-btn" @click="closeFoldDrawer">ยกเลิก</button>
          <button class="po-btn po-btn-save" @click="applyFolds">บันทึก</button>
        </div>
      </div>
    </div>
  </transition>
</div>
</template>

<script>
import QRCode from 'qrcode';

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
      saved: false, savedMsg: '', savedData: null, _seq: 1,
      foldDrawerOpen: false, foldIdx: null,
    };
  },
  computed: {
    subtotal() { return this.items.reduce((s, r) => s + this.lineTotal(r), 0); },
    totalFold() { return this.items.reduce((s, r) => s + (Number(r.fold) || 0), 0); },
    totalQty() { return this.items.reduce((s, r) => s + (Number(r.qty) || 0), 0); },
    discountAmount() {
      if (this.discountMode === 'percent') return this.subtotal * (Number(this.discountValue) || 0) / 100;
      if (this.discountMode === 'amount') return Number(this.discountValue) || 0;
      return 0;
    },
    afterDiscount() { return Math.max(0, this.subtotal - this.discountAmount); },
    vatAmount() { return this.vatMode === '7' ? this.afterDiscount * 0.07 : 0; },
    netTotal() { return this.afterDiscount + this.vatAmount; },
    foldRow() { return this.foldIdx != null ? this.items[this.foldIdx] : null; },
    foldTitle() {
      const r = this.foldRow;
      if (!r) return '';
      return [r.sku, r.color].filter(Boolean).join(' – ');
    },
    foldTotalCount() { return this.foldRow ? this.foldRow.folds.reduce((s, f) => s + (Number(f.count) || 0), 0) : 0; },
    foldTotalYards() { return this.foldRow ? this.foldRow.folds.reduce((s, f) => s + this.foldLine(f), 0) : 0; },
  },
  async mounted() {
    await this.loadNextNo();
    this.loadRefs();
  },
  methods: {
    newRow() { return { _key: (this._seq = (this._seq || 0) + 1), sku: '', color: '', name: '', width: '', lot: '', fold: 0, qty: 0, unit_price: null, folds: [{ perFold: null, count: null }], barcode: '', shadeOptions: [] }; },
    lineTotal(r) { return (Number(r.qty) || 0) * (Number(r.unit_price) || 0); },
    addRow(idx) { this.items.splice(idx + 1, 0, this.newRow()); },
    removeRow(idx) { if (this.items.length > 1) this.items.splice(idx, 1); },
    copyRow(idx) {
      const src = this.items[idx];
      const clone = JSON.parse(JSON.stringify(src));
      clone._key = (this._seq = (this._seq || 0) + 1);
      clone.barcode = '';
      this.items.splice(idx + 1, 0, clone);
    },
    // ---- Drawer รายละเอียดพับ ----
    openFoldDrawer(idx) {
      this.foldIdx = idx;
      const r = this.items[idx];
      if (!r.folds || r.folds.length === 0) r.folds = [{ perFold: null, count: null }];
      this.foldDrawerOpen = true;
    },
    closeFoldDrawer() { this.foldDrawerOpen = false; this.foldIdx = null; },
    foldLine(f) { return (Number(f.perFold) || 0) * (Number(f.count) || 0); },
    addFold(i) { this.foldRow.folds.splice(i + 1, 0, { perFold: null, count: null }); },
    removeFold(i) { if (this.foldRow.folds.length > 1) this.foldRow.folds.splice(i, 1); },
    applyFolds() {
      const r = this.foldRow;
      if (r) { r.fold = this.foldTotalCount; r.qty = this.foldTotalYards; }
      this.closeFoldDrawer();
    },
    // ---- โหลดข้อมูล ----
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
    // ---- บันทึก ----
    genBarcode(idx) {
      const d = new Date();
      const yymm = String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0');
      const rand = String((Date.now() + idx * 7919) % 1000000).padStart(6, '0');
      return yymm + rand;
    },
    resetForm() {
      this.form = { in_no: '', receipt_date: new Date().toISOString().slice(0, 10), receipt_type: 'Purchase', warehouse: 'Warehouse', po_ref: '', supplier: '', bill_no: '', remark: '' };
      this.items = [this.newRow()];
      this.discountMode = 'none'; this.discountValue = 0; this.vatMode = 'none';
      this.saved = false; this.savedMsg = ''; this.savedData = null;
      this.loadNextNo();
    },
    async save() {
      const hasItem = this.items.some(r => (r.sku || '').trim());
      if (!hasItem) { this.dash.fbFail('กรุณากรอกรายการสินค้าอย่างน้อย 1 รายการ'); return; }
      this.dash.fbLoading('กำลังบันทึก...');
      // gen บาร์โค้ดให้ทุกแถวที่มีรหัสสินค้า
      this.items.forEach((r, i) => { if ((r.sku || '').trim() && !r.barcode) r.barcode = this.genBarcode(i); });
      const payload = {
        ...this.form,
        subtotal: this.subtotal, discount: this.discountAmount, vat: this.vatAmount, net_total: this.netTotal,
        items: this.items.filter(r => (r.sku || '').trim()).map(r => ({
          sku: r.sku, color: r.color, name: r.name, width: r.width, lot: r.lot,
          fold: r.fold, qty: r.qty, unit_price: r.unit_price, total: this.lineTotal(r),
          folds: r.folds, barcode: r.barcode,
        })),
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
          this.saved = true;
          this.savedData = JSON.parse(JSON.stringify(payload));
          this.savedMsg = 'ระบบได้ทำการเพิ่มข้อมูลเรียบร้อยแล้ว';
          this.dash.fbDone('บันทึกแล้ว');
        } else { this.dash.fbFail(d.message || 'บันทึกไม่สำเร็จ'); }
      } catch (e) { this.dash.fbFail('บันทึกไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
    },
    // ---- พิมพ์บาร์โค้ด (QR sticker) ----
    async printBarcodes() {
      const rows = this.items.filter(r => (r.sku || '').trim());
      if (rows.length === 0) { this.dash.fbFail('ไม่มีรายการสำหรับพิมพ์บาร์โค้ด'); return; }
      const esc = (s) => (s == null ? '' : String(s)).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
      // แต่ละแถวออกกี่ป้าย = จำนวนพับ (fold) ป้าย; ถ้าไม่มีพับให้ 1 ป้าย
      const stickers = [];
      for (const r of rows) {
        if (!r.barcode) r.barcode = this.genBarcode(stickers.length);
        const perFoldYards = (Number(r.qty) || 0);
        const qr = await QRCode.toDataURL(r.barcode, { width: 150, margin: 1 });
        stickers.push(`
          <div class="st">
            <div class="st-top">
              <div><span class="lbl">Code</span> <b>${esc(r.sku)}</b></div>
              <div><span class="lbl">color</span> ${esc(r.color || '-')}</div>
            </div>
            <div class="st-mid">
              <div class="st-info">
                <div>LOT ${esc(r.lot || '')}</div>
                <div>QTY ${perFoldYards} หลา.</div>
              </div>
              <div class="st-qr">
                <img src="${qr}" />
                <div class="st-code">${esc(r.barcode)}</div>
              </div>
            </div>
          </div>`);
      }
      const win = window.open('', '_blank', 'width=900,height=680');
      if (!win) { this.dash.fbFail('เบราว์เซอร์บล็อกหน้าต่างพิมพ์ — กรุณาอนุญาต popup'); return; }
      win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>บาร์โค้ดผ้า (${stickers.length})</title>
        <style>
          *{box-sizing:border-box}
          body{font-family:'Noto Sans Thai','Segoe UI',sans-serif;margin:12px}
          .sheet{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
          .st{border:1px solid #222;border-radius:8px;padding:10px 12px;page-break-inside:avoid}
          .st-top{border-bottom:1px solid #ddd;padding-bottom:6px;margin-bottom:8px;font-size:13px;line-height:1.5}
          .lbl{color:#555;font-size:11px}
          .st-mid{display:flex;justify-content:space-between;align-items:flex-end}
          .st-info{font-size:13px;line-height:1.7}
          .st-qr{text-align:center}
          .st-qr img{width:96px;height:96px;display:block}
          .st-code{font-family:'Courier New',monospace;font-size:11px;font-weight:700;margin-top:2px}
          @media print{.no-print{display:none}}
        </style></head><body>
        <div class="no-print" style="text-align:center;margin-bottom:10px"><button onclick="window.print()" style="padding:8px 22px;font-size:14px;cursor:pointer">🖨️ พิมพ์</button></div>
        <div class="sheet">${stickers.join('')}</div>
        </body></html>`);
      win.document.close();
    },
    // ---- พิมพ์ใบรับสินค้า ----
    openReceiptPdf() {
      const f = this.form;
      const rows = this.items.filter(r => (r.sku || '').trim());
      const esc = (s) => (s == null ? '' : String(s)).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
      const body = rows.map((r, i) => `<tr><td>${i + 1}</td><td style="text-align:left">${esc(r.sku)}</td><td>${esc(r.color)}</td><td>${esc(r.width)}</td><td>${r.fold || ''}</td><td>${r.qty || ''}</td><td>${(Number(r.unit_price) || 0).toFixed(2)}</td><td>${this.lineTotal(r).toFixed(2)}</td></tr>`).join('');
      const win = window.open('', '_blank', 'width=800,height=1000');
      if (!win) { this.dash.fbFail('เบราว์เซอร์บล็อกหน้าต่างพิมพ์ — กรุณาอนุญาต popup'); return; }
      win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${esc(f.in_no)}</title>
        <style>
          body{font-family:'Noto Sans Thai','Times New Roman',serif;margin:26px;color:#000}
          .center{text-align:center}.h1{font-size:20px;font-weight:bold}.h2{font-size:14px;font-weight:bold}
          .addr{font-size:12px;margin-top:4px}
          .meta{display:flex;justify-content:space-between;font-size:12px;margin:14px 0}
          table{width:100%;border-collapse:collapse;margin-top:6px}
          th,td{border:1px solid #000;padding:5px 6px;font-size:12px;text-align:center;height:22px}
          th{font-weight:bold;background:#f0f0f0}
          .foot{display:flex;justify-content:space-between;align-items:flex-end;margin-top:44px;font-size:12px}
          @media print{.no-print{display:none}}
        </style></head><body>
        <div class="no-print" style="text-align:center;margin-bottom:12px"><button onclick="window.print()" style="padding:8px 22px;font-size:14px;cursor:pointer">🖨️ พิมพ์ / บันทึก PDF</button></div>
        <div class="center h1">D'finest Fabric Co., Ltd.</div>
        <div class="center h2">ใบรับสินค้า (Goods Receipt)</div>
        <div class="center addr">55/4 Meesuwan 3 Yeak 1, Sukhumvit 71 Rd. Wattana District, Bangkok, Thailand 10110</div>
        <div class="meta">
          <div><b>คู่ค้า :</b> ${esc(f.supplier) || '-'}<br><b>ประเภทการรับ :</b> ${esc(f.receipt_type)}<br><b>คลัง :</b> ${esc(f.warehouse)}</div>
          <div><b>เลขที่รับสินค้า :</b> ${esc(f.in_no)}<br><b>วันที่ :</b> ${esc(f.receipt_date)}<br><b>เลขที่บิล :</b> ${esc(f.bill_no) || '-'}</div>
        </div>
        <table>
          <thead><tr><th style="width:32px">ที่</th><th>รหัสสินค้า</th><th>รหัสสี</th><th>หน้ากว้าง</th><th>พับ</th><th>จำนวน</th><th>ราคา/หน่วย</th><th>ราคา</th></tr></thead>
          <tbody>${body}
            <tr><td colspan="4"><b>รวม</b></td><td><b>${this.totalFold}</b></td><td><b>${this.totalQty.toFixed(2)}</b></td><td></td><td><b>${this.subtotal.toFixed(2)}</b></td></tr>
          </tbody>
        </table>
        <div style="text-align:right;font-size:13px;margin-top:10px"><b>ยอดสุทธิ :</b> ${this.netTotal.toFixed(2)} บาท</div>
        <div class="foot"><div><b>ผู้รับสินค้า :</b> ____________________</div><div><b>D'finest Fabric</b></div></div>
        </body></html>`);
      win.document.close();
    },
  },
};
</script>

<style scoped>
.po-page { font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif; color: var(--text); font-size: 13px; position: relative; margin-top: 12px; background: var(--surface); border: 1px solid var(--field-border); border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
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
.po-row-actions { display: flex; gap: 5px; justify-content: center; }
.po-ic { width: 28px; height: 28px; border-radius: 7px; border: 1px solid var(--field-border); background: var(--field); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; padding: 0; flex-shrink: 0; transition: background .15s, border-color .15s, color .15s; }
.po-ic svg { width: 15px; height: 15px; }
.po-fold { color: #475569; } .po-fold:hover { background: #eef1f6; border-color: #cbd5e1; color: #334155; }
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

.po-footer { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-top: 1px solid var(--field-border); background: var(--field); border-radius: 0 0 14px 14px; }
.po-saved-msg { color: #1a9c54; font-size: 13px; font-weight: 600; }
.po-footer-btns { display: flex; gap: 10px; margin-left: auto; }
.po-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; border: 1px solid var(--field-border); border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 13px; background: #e7eaf1; color: var(--text); transition: background .2s, border-color .2s; }
.po-btn:hover { background: #dde1ea; border-color: #c7cede; }
.po-btn-save { background: #1a9c54; color: #fff; border-color: #1a9c54; }
.po-btn-save:hover { background: #158045; border-color: #158045; }
.po-btn-receipt { background: #3c4453; color: #fff; border-color: #3c4453; }
.po-btn-receipt:hover { background: #2d333f; }
.po-btn-barcode { background: #1e3a8a; color: #fff; border-color: #1e3a8a; }
.po-btn-barcode:hover { background: #172b6b; }
.po-btn-new { background: #1a9c54; color: #fff; border-color: #1a9c54; }
.po-btn-new:hover { background: #158045; }

/* ช่องกรอกที่ยังว่าง — ใส่พื้นเทาอ่อนให้มองเห็นชัด */
.po-page input:not([type="checkbox"]), .po-page select, .po-page textarea { background: var(--field); }
.po-page input:focus, .po-page select:focus, .po-page textarea:focus { background: var(--surface); }

/* Drawer รายละเอียดพับ */
.fd-wrap { position: fixed; inset: 0; z-index: 3300; }
.fd-backdrop { position: absolute; inset: 0; background: rgba(15,23,42,0.4); }
.fd-drawer { position: absolute; top: 0; right: 0; height: 100%; width: 440px; max-width: 94vw; background: var(--surface); box-shadow: -8px 0 30px rgba(0,0,0,0.2); display: flex; flex-direction: column; }
.fd-head { background: #3c4453; color: #fff; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; }
.fd-head-txt { display: flex; flex-direction: column; gap: 2px; }
.fd-head-title { font-weight: 700; font-size: 15px; }
.fd-head-sub { font-size: 12px; color: rgba(255,255,255,.7); }
.fd-x { background: rgba(255,255,255,.12); border: none; color: #fff; width: 30px; height: 30px; border-radius: 7px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; transition: background .15s; }
.fd-x:hover { background: rgba(255,255,255,.24); }
.fd-x svg { width: 16px; height: 16px; }
.fd-body { flex: 1; overflow-y: auto; padding: 18px 20px; }
.fd-hint { font-size: 12px; color: var(--muted); line-height: 1.5; margin: 0 0 14px; }
.fd-list { display: flex; flex-direction: column; gap: 8px; }
.fd-row { display: grid; grid-template-columns: 1fr 1fr 1fr 34px; gap: 8px; align-items: center; }
.fd-row-head { margin-bottom: 2px; }
.fd-row-head > div { font-size: 11px; color: var(--muted); font-weight: 600; text-align: center; }
.fd-c-per, .fd-c-cnt, .fd-c-sum { min-width: 0; }
.fd-num { width: 100%; height: 34px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 13px; text-align: right; font-family: inherit; background: var(--field); color: var(--text); transition: border-color .15s, background .15s; }
.fd-num:focus { outline: none; border-color: #2F65F6; background: var(--surface); box-shadow: 0 0 0 3px rgba(47,101,246,.12); }
.fd-ro { background: var(--field); font-weight: 700; color: var(--text); }
.fd-c-act { display: flex; justify-content: center; }
.fd-mini { width: 28px; height: 28px; border-radius: 7px; border: 1px solid var(--field-border); background: var(--field); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; transition: background .15s, border-color .15s; }
.fd-mini svg { width: 15px; height: 15px; }
.fd-mini-del { color: #e03131; } .fd-mini-del:hover { background: #fdeaea; border-color: #e03131; }
.fd-add-btn { margin-top: 12px; width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 9px; border: 1px dashed var(--field-border); border-radius: 9px; background: transparent; color: #2F65F6; font-weight: 600; font-size: 13px; font-family: inherit; cursor: pointer; transition: background .15s, border-color .15s; }
.fd-add-btn:hover { background: #e9f0fe; border-color: #2F65F6; }
.fd-add-btn svg { width: 15px; height: 15px; }
.fd-summary { margin-top: 18px; display: flex; gap: 10px; }
.fd-sum-item { flex: 1; background: var(--field); border: 1px solid var(--field-border); border-radius: 10px; padding: 12px 14px; display: flex; flex-direction: column; gap: 4px; }
.fd-sum-lbl { font-size: 11.5px; color: var(--muted); font-weight: 600; }
.fd-sum-val { font-size: 20px; font-weight: 700; color: var(--text); }
.fd-sum-main { background: #e7f6ee; border-color: #1a9c54; }
.fd-sum-main .fd-sum-val { color: #158045; }
.fd-foot-bar { padding: 14px 20px; border-top: 1px solid var(--field-border); display: flex; justify-content: flex-end; gap: 10px; background: var(--field); }
.fd-slide-enter-active, .fd-slide-leave-active { transition: opacity 0.2s; }
.fd-slide-enter-from, .fd-slide-leave-to { opacity: 0; }
</style>
