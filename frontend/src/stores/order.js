// ============================================================================
//  stores/order.js — โดเมนออร์เดอร์: รับออร์เดอร์ (oe*) + จัดออร์เดอร์/ตัดผ้า (of*)
//  แยกออกจาก Dashboard.vue เพื่อให้ดูแลง่ายและ reuse ได้ทุก component
// ============================================================================
import { defineStore } from 'pinia';
import QRCode from 'qrcode';
import { buildFittedPdf } from '../utils/pdfLabels.js';
import { useAuthStore } from './auth.js';
import { useUiStore } from './ui.js';

const API = '';

export const useOrderStore = defineStore('order', {
  state: () => ({
    // ---- รับออร์เดอร์ (order-receive) ----
    oeForm: {
      date: new Date().toISOString().slice(0, 10),
      customer: '',
      salesperson: '',
      note: '',
      urgent: false,
      orderNo: 'OR2608-005',
      paymentTerm: 'Cash',
    },
    oeSalespersonOptions: ['นายกิตติ มั่นคง', 'นางสาวปิยะดา สุขใจ'],
    oePaymentTermOptions: ['Cash', 'เครดิต 15 วัน', 'เครดิต 30 วัน', 'เครดิต 60 วัน'],
    oeColorCodeOptions: ['C-01', 'C-02', 'C-03', 'C-04', 'C-05'],
    oePackOptions: ['ตัดเป็นไม้กลม', 'ตัดเป็นไม้แบน'],
    oeUnitOptions: ['หลา', 'เมตร'],
    oeRowKeySeq: 1,
    oeSaved: false,
    oeShowSlip: false,
    oeItems: [
      { _key: 1, no: 1, sku: '', colorCode: '', width: '', availableQty: '', orderedQty: '', unit: 'หลา', pack: '', custCode: '', substitute: false, substituteText: '' },
    ],
    oeFabricOptions: [],
    oeCustomerOptions: [],

    // ---- จัดออร์เดอร์ (order-fulfill) ----
    ofBarcodeInput: '',
    ofFilters: {
      date: '', customer: '', salesperson: '', search: '', sku: '', colorCode: '', status: '', urgent: false,
    },
    // ===== หน้าจัดออร์เดอร์/ตัดผ้า (order-fulfill-detail) — เปิดจากปุ่มกรรไกร =====
    ofDetail: {
      order: null,                       // ออร์เดอร์ที่กำลังจัด (อ้างอิงตัวจริงใน ofOrders)
      issueNo: '',                       // เลขที่ใบเบิก OUT{yymm}-xxxx (ดึงจาก backend)
      issueDate: '',                     // วันที่เบิก
      issueType: 'ขาย',                  // ประเภทการเบิก
      remark: '',
      scanInput: '',                     // ช่องยิง QR ม้วน (ด้านบน)
      scanY: '', scanM: '',              // หลา/เมตร ของม้วนล่าสุดที่สแกน
      rows: [],                          // แถวรายการตัด
      saving: false, savedMsg: '',
    },
    ofIssueTypeOptions: ['ขาย', 'ตัวอย่าง', 'เคลม', 'ภายใน'],
    ofSalespersonOptions: ['ปั๊ม', 'นายกิตติ มั่นคง', 'นางสาวปิยะดา สุขใจ'],
    ofColorCodeOptions: ['C-01', 'C-02', 'C-03', 'C-04', 'C-05'],
    ofStatusOptions: ['Waiting to prepare', 'Preparing', 'Prepared', 'Cancelled'],
    ofOrders: [
      { id: 1, orderNo: 'OR2608-005', date: '14/08/2026', customer: 'Alex fashion', paymentTerm: 'Cash', salesperson: 'ปั๊ม', orderedQty: 50.00, withdrawnQty: 0, note: '', urgent: true, status: 'Waiting to prepare', invoiced: false, vatDone: false },
      { id: 2, orderNo: 'OR2608-001', date: '14/08/2026', customer: 'บจก. สยามเทรดดิ้ง', paymentTerm: 'Cash', salesperson: 'นายกิตติ มั่นคง', orderedQty: 150.00, withdrawnQty: 80.00, note: 'เร่งด่วนพิเศษ', urgent: false, status: 'Preparing', invoiced: false, vatDone: false },
      { id: 3, orderNo: 'OR2608-003', date: '12/08/2026', customer: 'ร้านแฟชั่นเฮ้าส์', paymentTerm: 'Cash', salesperson: 'ปั๊ม', orderedQty: 90.00, withdrawnQty: 90.00, note: '', urgent: false, status: 'Prepared', invoiced: true, vatDone: false },
      { id: 4, orderNo: 'OR2608-004', date: '13/08/2026', customer: 'บจก. ไทยเท็กซ์ไทล์', paymentTerm: 'Cash', salesperson: 'นายกิตติ มั่นคง', orderedQty: 60.00, withdrawnQty: 60.00, note: '', urgent: false, status: 'Prepared', invoiced: false, vatDone: false },
    ],
  }),

  getters: {
    oeSlipItems: (state) => state.oeItems.filter(row => row.sku.trim()),
    oeFormattedDate: (state) => {
      if (!state.oeForm.date) return '';
      const [y, m, d] = state.oeForm.date.split('-');
      return `${d}/${m}/${y}`;
    },
    oeQrUrl: (state) => {
      const data = encodeURIComponent(`Order:${state.oeForm.orderNo} Customer:${state.oeForm.customer}`);
      return `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${data}`;
    },
    ofFilteredOrders() {
      const f = this.ofFilters;
      const q = f.search.trim().toLowerCase();
      return this.ofOrders.filter(o => {
        if (f.date && o.date !== this.ofToDisplayDate(f.date)) return false;
        if (f.customer && !o.customer.toLowerCase().includes(f.customer.trim().toLowerCase())) return false;
        if (f.salesperson && o.salesperson !== f.salesperson) return false;
        if (q && !(
          o.orderNo.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.note.toLowerCase().includes(q)
        )) return false;
        if (f.status && o.status !== f.status) return false;
        if (f.urgent && !o.urgent) return false;
        return true;
      });
    },
  },

  actions: {
    // ---- รับออร์เดอร์: ดึงผ้าประจำ + ผ้าไม่ประจำ + ลูกค้า ----
    async oeLoadFabrics() {
      const auth = useAuthStore();
      try {
        const [rReg, rIrr, rCus] = await Promise.all([
          fetch(API + '/api/fabrics', { headers: { Authorization: 'Bearer ' + auth.token } }),
          fetch(API + '/api/fabric-irregular', { headers: { Authorization: 'Bearer ' + auth.token } }),
          fetch(API + '/api/customers', { headers: { Authorization: 'Bearer ' + auth.token } }),
        ]);
        if (rReg.status === 401 || rIrr.status === 401 || rCus.status === 401) { auth.sessionExpired(); return; }
        const dReg = await rReg.json();
        const dIrr = await rIrr.json();
        const dCus = await rCus.json();
        const map = (arr, src) => (arr || []).map(f => ({
          sku: f.sku, name: f.name || '', width: f.width || '', type: f.type || '', source: src,
          // ตัวเลือกแบบบรรทัดเดียวสำหรับ datalist (แสดงครั้งเดียว ไม่ซ้ำ) — คั่นด้วย em-dash / โคลอน
          // (ไม่ชนกับ hyphen ในชื่อสี เช่น "Cotton Twill - White") เพื่อ parse รหัสกลับได้
          display: `${f.sku} — ${f.name || f.type || ''}`.trim().replace(/ —\s*$/, ''),
          colorText: `${f.sku} : ${f.name || f.type || ''}`.trim().replace(/ :\s*$/, ''),
        }));
        this.oeFabricOptions = [...map(dReg.fabrics, 'reg'), ...map(dIrr.items, 'irr')];
        this.oeCustomerOptions = (dCus.customers || [])
          .filter(c => (c.company_name || '').trim())
          .map(c => ({
            name: c.company_name,
            label: c.code ? `${c.company_name} (${c.code})` : c.company_name,
          }));
      } catch (e) { this.oeFabricOptions = []; this.oeCustomerOptions = []; }
    },
    oeOnSkuChange(row) {
      // datalist ส่งค่าเต็ม "sku — name" กลับมา — แยกเอาเฉพาะรหัสไปเก็บ
      const sku = (row.sku || '').split(' — ')[0].trim();
      row.sku = sku;
      const f = this.oeFabricOptions.find(x => x.sku === sku);
      if (f && !row.width) row.width = f.width;
    },
    oeOnColorChange(row) {
      // datalist ส่งค่าเต็ม "sku : name" กลับมา — แยกเอาเฉพาะรหัสสีไปเก็บ
      row.colorCode = (row.colorCode || '').split(' : ')[0].trim();
    },
    oeNewRow() {
      this.oeRowKeySeq += 1;
      return {
        _key: this.oeRowKeySeq, no: 0, sku: '', colorCode: '', width: '',
        availableQty: '', orderedQty: '', unit: 'หลา', pack: '', custCode: '',
        substitute: false, substituteText: '',
      };
    },
    oeRenumberRows() {
      this.oeItems.forEach((row, i) => { row.no = i + 1; });
    },
    oeAddRow(afterIdx) {
      this.oeItems.splice(afterIdx + 1, 0, this.oeNewRow());
      this.oeRenumberRows();
    },
    oeRemoveRow(idx) {
      if (this.oeItems.length === 1) return;
      this.oeItems.splice(idx, 1);
      this.oeRenumberRows();
    },
    oeReport() {
      const ui = useUiStore();
      ui.fbFail('ตัวอย่างรายงานออร์เดอร์ (ยังไม่เชื่อมต่อระบบพิมพ์รายงานจริง)');
    },
    async oeSave() {
      const auth = useAuthStore();
      const ui = useUiStore();
      if (!this.oeForm.customer.trim()) {
        ui.fbFail('กรุณากรอกชื่อลูกค้า');
        return;
      }
      const hasItem = this.oeItems.some(row => row.sku.trim() && Number(row.orderedQty) > 0);
      if (!hasItem) {
        ui.fbFail('กรุณากรอกรายการสินค้าอย่างน้อย 1 รายการ (รหัสสินค้าและจำนวนที่สั่ง)');
        return;
      }
      ui.fbLoading('กำลังบันทึกออร์เดอร์...');
      try {
        const res = await fetch(API + '/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.token },
          body: JSON.stringify({ ...this.oeForm, orderNo: '', items: this.oeItems }),
        });
        if (res.status === 401) { ui.fbHide(); auth.sessionExpired(); return; }
        const data = await res.json();
        if (data.ok) {
          this.oeForm.orderNo = data.order.order_no;
          this.oeSaved = true;
          await this.loadOrders();
          ui.fbDone('บันทึกออร์เดอร์แล้ว — เพิ่มงานค้างดำเนินการ 1 รายการ');
        } else {
          ui.fbFail(data.message || 'บันทึกไม่สำเร็จ');
        }
      } catch (e) {
        ui.fbFail('บันทึกออร์เดอร์ไม่สำเร็จ — ตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์');
      }
    },
    oePrintSlipNow() {
      window.print();
    },
    // ใบออร์เดอร์ → PDF จริง กดปุ่มเดียวจบ (ข้าม modal, ขนาด A5 พอดี)
    async oeSlipPdf() {
      const ui = useUiStore();
      const items = this.oeSlipItems || [];
      if (!items.length) { ui.fbFail('ไม่มีรายการสำหรับออกใบออร์เดอร์'); return; }
      const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
      // วันที่ dd/mm/yyyy เสมอ (กันกรณี oeForm.date เป็น ISO)
      const rawD = String(this.oeForm.date || '');
      const dm = rawD.match(/^(\d{4})-(\d{2})-(\d{2})/);
      const dateStr = dm ? `${dm[3]}/${dm[2]}/${dm[1]}` : (this.oeFormattedDate || rawD);
      const packSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#000" stroke-width="2"><rect x="3" y="7" width="18" height="14" rx="1"/><path d="M3 7l9-4 9 4"/><path d="M12 3v18"/></svg>';
      const rows = items.map((r) => `<tr><td>${esc(r.sku)}</td><td>${esc(r.colorCode)}</td><td class="pk">${packSvg}</td><td>${esc(r.orderedQty)}</td></tr>`).join('');
      let qr = this.oeQrUrl || '';
      if (!qr || !String(qr).startsWith('data:')) { try { qr = await QRCode.toDataURL(this.oeForm.orderNo || '', { width: 200, margin: 1 }); } catch (e) { qr = ''; } }
      const html = `
        <style>
          .slip { color:#111; }
          .cust { font-size:12px; font-weight:700; line-height:1.6; padding-bottom:6px; border-bottom:1px solid #111; margin-bottom:5px; }
          .meta { display:flex; justify-content:space-between; font-size:10.5px; line-height:1.5; margin-bottom:6px; }
          table { width:100%; border-collapse:separate; border-spacing:0; table-layout:fixed; border-top:1px solid #111; border-left:1px solid #111; }
          th, td { border-right:1px solid #111; border-bottom:1px solid #111; padding:5px 5px; font-size:10px; text-align:center; word-break:break-word; line-height:1.35; }
          th { font-weight:600; background:#f0f0f0; }
          .c-name { width:22%; } .c-pack { width:20%; } .c-yard { width:16%; }
          .pk svg { vertical-align:middle; width:13px; height:13px; }
          .total-row td { font-weight:700; padding:6px 5px; }
          .remark-row td { text-align:left; height:30px; }
          .remark-label { font-weight:700; }
          .qr { text-align:center; margin-top:26px; }
          .qr img { width:104px; height:104px; }
        </style>
        <div class="slip">
          <div class="cust">${esc(this.oeForm.customer || '—')}</div>
          <div class="meta"><span>Order No. ${esc(this.oeForm.orderNo)}</span><span>${esc(dateStr)}</span></div>
          <table>
            <thead><tr><th class="c-name">Name</th><th>Detail</th><th class="c-pack">Pack</th><th class="c-yard">Yard</th></tr></thead>
            <tbody>
              ${rows}
              <tr class="total-row"><td colspan="4">Total WholeSale - ${items.length} Pieces</td></tr>
              <tr class="remark-row"><td class="remark-label">Remark</td><td colspan="3"></td></tr>
            </tbody>
          </table>
          <div class="qr">${qr ? `<img src="${qr}" alt="QR"/>` : ''}</div>
        </div>`;
      try { await buildFittedPdf(html, { filename: 'ใบออร์เดอร์-' + (this.oeForm.orderNo || '') + '.pdf', widthMm: 72.1, padMm: 3 }); }
      catch (e) { ui.fbFail('สร้าง PDF ไม่สำเร็จ'); }
    },

    // ---- จัดออร์เดอร์ ----
    ofToDisplayDate(iso) {
      if (!iso) return '';
      const [y, m, d] = iso.split('-');
      return `${d}/${m}/${y}`;
    },
    ofSearch() {
      // v-model ผูกกับ ofFilters อยู่แล้ว ปุ่มนี้ไว้สำหรับกรณีเชื่อมต่อ API จริงในอนาคต
    },
    ofResetFilters() {
      this.ofFilters = {
        date: '', customer: '', salesperson: '', search: '', sku: '', colorCode: '', status: '', urgent: false,
      };
    },
    ofStatusClass(status) {
      if (status === 'Prepared') return 'of-status-prepared';
      if (status === 'Preparing') return 'of-status-preparing';
      if (status === 'Cancelled') return 'of-status-cancelled';
      return 'of-status-waiting';
    },
    ofViewInfo(order) {
      alert(
        `ออร์เดอร์ ${order.orderNo}\n` +
        `ลูกค้า: ${order.customer}\n` +
        `พนักงานขาย: ${order.salesperson}\n` +
        `จำนวนที่สั่ง: ${order.orderedQty.toFixed(2)}\n` +
        `จำนวนที่เบิก: ${order.withdrawnQty.toFixed(2)}\n` +
        `สถานะ: ${order.status}` +
        (order.note ? `\nหมายเหตุ: ${order.note}` : '')
      );
    },
    // ปุ่มพิมพ์ → ออกใบสั่งตัดผ้า (cutting slip) ให้พนักงานตัดถือไปตัด แล้วกลับมาสแกนที่หน้าจัดออร์เดอร์
    async ofPrintOrder(order) {
      const ui = useUiStore();
      const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
      const items = order.items || [];
      // ไอคอน Pack: ไม้แบน = สี่เหลี่ยม, ไม้กลม = วงกลม
      const packIcon = (pack) => {
        const p = String(pack || '');
        if (p.includes('แบน')) return '<span style="display:inline-block;width:34px;height:16px;background:#c9ccd3;border:1px solid #8b90a0;border-radius:2px"></span>';
        if (p.includes('กลม')) return '<span style="display:inline-block;width:20px;height:20px;background:#c9ccd3;border:1px solid #8b90a0;border-radius:50%"></span>';
        return esc(p);
      };
      const rows = items.map((it) => {
        const yard = (Number(it.pendingQty) || 0);
        return `<tr>
          <td class="c-name">${esc(it.sku)}</td>
          <td class="c-detail">${esc(it.colorCode)}</td>
          <td class="c-pack">${packIcon(it.pack)}</td>
          <td class="c-yard">${yard % 1 === 0 ? yard : yard.toFixed(2)}</td>
        </tr>`;
      }).join('');

      let qrImg = '';
      try { qrImg = await QRCode.toDataURL(order.orderNo || '', { width: 200, margin: 1 }); } catch (e) {}

      const html = `
        <style>
          .slip { color:#111; }
          .cust { font-size: 12px; font-weight:700; line-height:1.6; padding-bottom:6px; border-bottom:1px solid #111; margin-bottom: 5px; }
          .ohead { display: flex; justify-content: space-between; font-size: 10.5px; line-height:1.5; margin-bottom: 6px; }
          table { width: 100%; border-collapse: separate; border-spacing: 0; table-layout: fixed; border-top: 1px solid #111; border-left: 1px solid #111; }
          th, td { border-right: 1px solid #111; border-bottom: 1px solid #111; padding: 5px 5px; font-size: 10px; text-align: center; word-break: break-word; line-height: 1.35; }
          th { font-weight: 600; background:#f0f0f0; }
          .c-name { width: 24%; } .c-pack { width: 18%; } .c-yard { width: 16%; }
          .c-pack span { transform: scale(.8); display:inline-block; }
          .total-row td { font-weight: 700; padding: 6px 5px; }
          .remark-row td { text-align: left; height: 32px; }
          .remark-label { font-weight: 700; }
          .qr { text-align: center; margin-top: 26px; }
          .qr img { width: 104px; height: 104px; }
        </style>
        <div class="slip">
          <div class="cust">${esc(order.customer)}</div>
          <div class="ohead"><span>Order No. ${esc(order.orderNo)}</span><span>${esc(order.date)}</span></div>
          <table>
            <thead><tr><th class="c-name">Name</th><th>Detail</th><th class="c-pack">Pack</th><th class="c-yard">Yard</th></tr></thead>
            <tbody>
              ${rows}
              <tr class="total-row"><td colspan="4">Total WholeSale - ${items.length} Pieces</td></tr>
              <tr class="remark-row"><td class="remark-label">Remark</td><td colspan="3"></td></tr>
            </tbody>
          </table>
          <div class="qr">${qrImg ? `<img src="${qrImg}" alt="QR ${esc(order.orderNo)}"/>` : ''}</div>
        </div>`;
      try { await buildFittedPdf(html, { filename: 'ใบสั่งตัด-' + order.orderNo + '.pdf', widthMm: 72.1, padMm: 3 }); }
      catch (e) { ui.fbFail('สร้าง PDF ไม่สำเร็จ'); }
    },
    // ยิง QR ม้วนที่ช่องด้านบน → หาม้วน แล้วจับคู่กับแถวรายการ (เติมบาร์โค้ด + โชว์หลา/เมตร)
    async ofDetailScan() {
      const auth = useAuthStore();
      const ui = useUiStore();
      const qr = (this.ofDetail.scanInput || '').trim();
      if (!qr) return;
      try {
        const res = await fetch(API + '/api/fabric-rolls/lookup?qr=' + encodeURIComponent(qr), {
          headers: { Authorization: 'Bearer ' + auth.token },
        });
        if (res.status === 401) { auth.sessionExpired(); return; }
        const d = await res.json();
        // ไม่พบม้วน → toast แดง (แบบตอนล็อกอิน)
        if (!d.ok || !d.roll) {
          ui.toast('ไม่พบข้อมูล หรือ QR ไม่ถูกต้อง', 'error', { title: 'การแจ้งเตือน' });
          this.ofDetail.scanInput = '';
          return;
        }
        const roll = d.roll;
        const yards = Number(roll.current_yards) || 0;
        this.ofDetail.scanY = yards.toFixed(2);
        this.ofDetail.scanM = (yards * 0.9144).toFixed(2);
        // จับคู่แถว: ตรงรหัสสินค้า (+สีถ้ามี) และยังไม่ถูกจับคู่
        const sku = roll.product_sku || '';
        let row = this.ofDetail.rows.find((r) => r.sku === sku && !r.rollQr && (!roll.color_name || !r.colorCode || r.colorCode.includes(roll.color_name)));
        if (!row) row = this.ofDetail.rows.find((r) => r.sku === sku && !r.rollQr);
        // ม้วนนี้ไม่ตรงกับผ้าในออร์เดอร์ที่เปิดอยู่ → toast แดง
        if (!row) {
          ui.toast('QR ไม่ตรงกับผ้าในออร์เดอร์นี้', 'error', { title: 'การแจ้งเตือน' });
          this.ofDetail.scanY = ''; this.ofDetail.scanM = '';
          this.ofDetail.scanInput = '';
          return;
        }
        // สแกนถูก → แถวขึ้นเขียว + toast เขียว
        row.rollQr = qr;
        row.colorId = roll.color_id || row.colorId;
        if (!(Number(row.cutQty) > 0)) {
          // เสนอจำนวนที่ตัด = น้อยกว่าระหว่างค้างเบิกกับหลาในม้วน
          row.cutQty = Math.min(row.pendingQty || yards, yards);
        }
        ui.toast(`พบม้วน ${sku} — คงเหลือ ${yards.toFixed(2)} หลา`, 'success', { title: 'สแกนสำเร็จ' });
      } catch (e) {
        ui.toast('ค้นหาม้วนไม่สำเร็จ — ตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์', 'error', { title: 'การแจ้งเตือน' });
      } finally {
        this.ofDetail.scanInput = '';
      }
    },
    // โหลดรายการออร์เดอร์ทั้งหมดจาก DB (เรียกตอน mounted + หลังบันทึก/ตัดจ่าย)
    async loadOrders() {
      const auth = useAuthStore();
      try {
        const res = await fetch(API + '/api/orders', {
          headers: { Authorization: 'Bearer ' + auth.token },
        });
        if (res.status === 401) { auth.sessionExpired(); return; }
        const data = await res.json();
        this.ofOrders = (data.orders || []).map((o) => ({
          id: o.id,
          orderNo: o.order_no,
          date: o.date,
          customer: o.customer,
          paymentTerm: o.payment_term,
          salesperson: o.salesperson,
          orderedQty: Number(o.ordered_qty) || 0,
          withdrawnQty: Number(o.withdrawn_qty) || 0,
          note: o.note || '',
          urgent: !!o.urgent,
          status: o.status,
          invoiced: !!o.invoiced,
          vatDone: !!o.vat_done,
          items: (o.items || []).map((it) => ({
            sku: it.sku, colorCode: it.color_code, width: it.width, availableQty: it.available_qty,
            pendingQty: Number(it.ordered_qty) || 0, withdrawQty: Number(it.withdrawn_qty) || 0,
            unit: it.unit, pack: it.pack, custCode: it.cust_code,
            substitute: !!it.substitute, substituteText: it.substitute_text || '',
            finalOrder: false, barcode: '', cutQty: 0, clearStock: false,
          })),
        }));
      } catch (e) {
        console.log('ไม่สามารถโหลดข้อมูลออร์เดอร์');
      }
    },
  },
});
