<template>
<div class="po-page">
  <div class="po-titlebar">💵 {{ mode === 'pay' ? 'จ่ายเงินคู่ค้า' : 'รับเงินลูกค้า' }}</div>

  <div class="po-items">
    <table class="po-item-table">
      <thead>
        <tr>
          <th style="width:40px;">ที่</th>
          <th style="min-width:170px;text-align:left;">{{ partyLabel }}</th>
          <th style="width:110px;">ประเภท</th>
          <th style="width:140px;">วันที่ชำระเงิน</th>
          <th style="width:140px;">วันที่เช็ค</th>
          <th style="width:150px;">เลขที่เช็ค</th>
          <th style="width:150px;">{{ mode === 'pay' ? 'จากบัญชี' : 'เข้าบัญชี' }}</th>
          <th style="width:130px;">จำนวนเงิน</th>
          <th v-if="mode === 'receive'" style="width:160px;">อ้างอิงใบวางบิล</th>
          <th style="min-width:150px;">หมายเหตุ</th>
          <th style="width:90px;">สลิป</th>
          <th style="width:70px;"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in items" :key="row._key">
          <td class="po-no">{{ idx + 1 }}</td>
          <td><input list="pm-parties" v-model="row.party" placeholder="เลือก/พิมพ์" @change="onPartyChange(row)" /></td>
          <td><select v-model="row.type"><option value="">—</option><option>เงินสด</option><option>เช็ค</option><option>โอน</option></select></td>
          <td><input type="date" v-model="row.pay_date" /></td>
          <td><input type="date" v-model="row.cheque_date" :disabled="row.type !== 'เช็ค'" /></td>
          <td><input v-model="row.cheque_no" :disabled="row.type !== 'เช็ค'" placeholder="เลขที่เช็ค" /></td>
          <td><select v-model="row.account"><option value="">—</option><option v-for="a in accountOptions" :key="a" :value="a">{{ a }}</option></select></td>
          <td><input type="number" v-model.number="row.amount" class="po-num" placeholder="0.00" /></td>
          <td v-if="mode === 'receive'">
            <input :list="'pm-bills-' + row._key" v-model="row.invoiceRef" placeholder="เลขที่บิล" @change="onInvoiceRefChange(row)" />
            <datalist :id="'pm-bills-' + row._key"><option v-for="b in (row._billOptions || [])" :key="b.br_no" :value="b.br_no" /></datalist>
            <div v-if="row._balance" class="pm-balance-hint" :class="{ 'pm-full': (Number(row.amount) || 0) >= row._balance.remaining }">
              บิล ฿{{ fmt(row._balance.total) }} · รับแล้ว ฿{{ fmt(row._balance.received) }} · คงเหลือ ฿{{ fmt(row._balance.remaining) }}
            </div>
          </td>
          <td><input v-model="row.note" placeholder="หมายเหตุ" /></td>
          <td class="pm-img">
            <label class="pm-upload">
              <input type="file" accept="image/*" @change="onImg($event, row)" hidden />
              <span v-if="row.uploading">⏳</span>
              <a v-else-if="row.slipUrl" :href="row.slipUrl" target="_blank" class="pm-img-name" :title="row.imgName" @click.stop>📎</a>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5M12 3v12"/></svg>
            </label>
          </td>
          <td class="po-row-actions">
            <button class="po-ic po-add" @click="addRow(idx)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button>
            <button class="po-ic po-del" @click="removeRow(idx)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 12h14"/></svg></button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="po-foot-row"><td colspan="7" class="po-foot-label">รวม</td><td class="po-num">{{ totalAmount.toFixed(2) }}</td><td :colspan="mode === 'receive' ? 4 : 3"></td></tr>
      </tfoot>
    </table>
    <datalist id="pm-parties"><option v-for="p in partyOptions" :key="p" :value="p" /></datalist>
  </div>

  <!-- ประวัติล่าสุด — รวมดูที่เดียว ไม่ต้องไล่เช็คแยกที่ -->
  <div class="pm-history">
    <div class="pm-history-title">ประวัติ{{ mode === 'pay' ? 'จ่ายเงิน' : 'รับเงิน' }}ล่าสุด</div>
    <table class="pm-history-table">
      <thead>
        <tr>
          <th>เลขที่</th><th>วันที่</th><th>{{ partyLabel }}</th>
          <th v-if="mode === 'receive'">อ้างอิงบิล</th>
          <th class="bl-r">จำนวนเงิน</th><th>สถานะ</th><th>สลิป</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="h in historyRows" :key="h.key">
          <td>{{ h.doc_no }}</td><td>{{ h.pay_date }}</td><td>{{ h.party }}</td>
          <td v-if="mode === 'receive'">{{ h.invoiceRef || '-' }}</td>
          <td class="bl-r">{{ fmt(h.amount) }}</td>
          <td><span class="pm-history-status" :class="{ 'pm-partial': h.partial }">{{ h.partial ? 'ชำระบางส่วน' : 'ครบถ้วน' }}</span></td>
          <td><a v-if="h.slipUrl" :href="h.slipUrl" target="_blank">📎 ดูสลิป</a><span v-else class="pm-no-slip">— ไม่มีสลิป —</span></td>
        </tr>
        <tr v-if="historyRows.length === 0"><td :colspan="mode === 'receive' ? 7 : 6" class="pm-history-empty">ยังไม่มีประวัติ</td></tr>
      </tbody>
    </table>
  </div>

  <div class="po-footer">
    <span v-if="savedMsg" class="po-saved-msg">{{ savedMsg }}</span>
    <div class="po-footer-btns">
      <button class="po-btn po-btn-report" @click="dash.fbFail('ตัวอย่างรายงาน (ยังไม่เชื่อมระบบพิมพ์รายงานจริง)')">👁 รายงาน</button>
      <button v-if="!saved" class="po-btn po-btn-save" @click="save">💾 บันทึก</button>
      <button v-else class="po-btn po-btn-new" @click="resetForm">🔄 บันทึกใหม่</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'PaymentPage',
  inject: ['dash'],
  props: { mode: { type: String, default: 'receive' } },
  data() {
    return {
      items: [this.newRow()], partyOptions: [],
      accountOptions: ['ธนาคารกสิกรไทย', 'ธนาคารไทยพาณิชย์', 'ธนาคารกรุงเทพ', 'เงินสด'],
      saved: false, savedMsg: '', _seq: 1,
      history: [],
    };
  },
  computed: {
    partyLabel() { return this.mode === 'pay' ? 'คู่ค้า' : 'ลูกค้า'; },
    totalAmount() { return this.items.reduce((s, r) => s + (Number(r.amount) || 0), 0); },
    // แตกรายการจากทุกเอกสารในประวัติ ให้เห็นทีละแถว พร้อมสถานะครบ/บางส่วนต่อบิล — ไม่ต้องนั่งเช็คเอง
    historyRows() {
      const rows = [];
      this.history.forEach((doc) => {
        let items = [];
        try { items = JSON.parse(doc.items_json || '[]'); } catch (e) {}
        items.forEach((it, i) => {
          const bal = it.invoiceRef ? this._balanceCache[it.invoiceRef] : null;
          rows.push({
            key: doc.id + '-' + i, doc_no: doc.doc_no, pay_date: doc.doc_date, party: it.party,
            amount: it.amount, invoiceRef: it.invoiceRef || '', slipUrl: it.slipUrl || '',
            partial: bal ? bal.remaining > 0.01 : false,
          });
        });
      });
      return rows;
    },
  },
  watch: { mode() { this.resetForm(); this.loadParties(); this.loadHistory(); } },
  mounted() { this.loadParties(); this.loadHistory(); },
  methods: {
    newRow() { return { _key: (this._seq = (this._seq || 0) + 1), party: '', type: '', pay_date: new Date().toISOString().slice(0, 10), cheque_date: '', cheque_no: '', account: '', amount: null, note: '', imgName: '', slipUrl: '', invoiceRef: '', uploading: false, _billOptions: [], _balance: null }; },
    addRow(idx) { this.items.splice(idx + 1, 0, this.newRow()); },
    removeRow(idx) { if (this.items.length > 1) this.items.splice(idx, 1); },
    fmt(v) { return (Number(v) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
    // อัปโหลดสลิปจริง (ไม่ใช่แค่จำชื่อไฟล์) — เก็บ URL ไว้เปิดดูย้อนหลังได้เสมอ
    async onImg(e, row) {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      row.imgName = f.name;
      row.uploading = true;
      try {
        const fd = new FormData();
        fd.append('file', f);
        const res = await fetch('/api/uploads', { method: 'POST', headers: { Authorization: 'Bearer ' + this.dash.token }, body: fd });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) row.slipUrl = d.url;
        else this.dash.fbFail(d.message || 'อัปโหลดสลิปไม่สำเร็จ');
      } catch (e2) { this.dash.fbFail('อัปโหลดสลิปไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
      finally { row.uploading = false; }
    },
    // เลือกลูกค้าแล้ว ดึงบิลที่วางไว้ของลูกค้ารายนั้นมาให้เลือกอ้างอิง
    async onPartyChange(row) {
      row._billOptions = []; row.invoiceRef = ''; row._balance = null;
      if (this.mode !== 'receive' || !row.party) return;
      try {
        const res = await fetch('/api/customer-billings?customer=' + encodeURIComponent(row.party), { headers: { Authorization: 'Bearer ' + this.dash.token } });
        const d = await res.json();
        row._billOptions = (d.billings || []).map((b) => ({ br_no: b.br_no, total: b.total_amount }));
      } catch (e) {}
    },
    // เลือก/พิมพ์เลขบิลแล้ว ดึงยอดคงเหลือมาโชว์ + เสนอยอดที่ควรรับ (แก้ไขได้กรณีโอนไม่ครบ)
    async onInvoiceRefChange(row) {
      row._balance = null;
      if (!row.invoiceRef) return;
      try {
        const res = await fetch('/api/customer-billings/balance?br_no=' + encodeURIComponent(row.invoiceRef), { headers: { Authorization: 'Bearer ' + this.dash.token } });
        const d = await res.json();
        if (d.ok) {
          row._balance = d;
          this._balanceCache[row.invoiceRef] = d;
          if (!row.amount) row.amount = Math.max(0, d.remaining);
        } else { this.dash.fbFail(d.message || 'ไม่พบใบวางบิลนี้'); }
      } catch (e) {}
    },
    async loadParties() {
      const url = this.mode === 'pay' ? '/api/partners' : '/api/customers';
      try { const res = await fetch(url, { headers: { Authorization: 'Bearer ' + this.dash.token } }); const d = await res.json(); this.partyOptions = (d.items || d.customers || []).map(x => x.company_name || x.name).filter(Boolean).slice(0, 300); } catch (e) {}
    },
    // โหลดประวัติล่าสุด + ยอดคงเหลือของทุกบิลที่ถูกอ้างอิง (สำหรับตัดสินสถานะ ครบ/บางส่วน ในตาราง)
    async loadHistory() {
      this._balanceCache = this._balanceCache || {};
      try {
        const res = await fetch('/api/payments?type=' + this.mode, { headers: { Authorization: 'Bearer ' + this.dash.token } });
        const d = await res.json();
        this.history = (d.payments || []).slice(0, 30);
        const refs = new Set();
        this.history.forEach((doc) => {
          try { (JSON.parse(doc.items_json || '[]')).forEach((it) => { if (it.invoiceRef) refs.add(it.invoiceRef); }); } catch (e) {}
        });
        await Promise.all([...refs].map(async (br) => {
          if (this._balanceCache[br]) return;
          try {
            const r = await fetch('/api/customer-billings/balance?br_no=' + encodeURIComponent(br), { headers: { Authorization: 'Bearer ' + this.dash.token } });
            const dd = await r.json();
            if (dd.ok) this._balanceCache[br] = dd;
          } catch (e) {}
        }));
        this.history = [...this.history]; // trigger re-eval ของ historyRows หลังโหลด balance ครบ
      } catch (e) {}
    },
    resetForm() { this.items = [this.newRow()]; this.saved = false; this.savedMsg = ''; },
    async save() {
      if (!this.items.some(r => (Number(r.amount) || 0) > 0)) { this.dash.fbFail('กรุณากรอกจำนวนเงินอย่างน้อย 1 รายการ'); return; }
      this.dash.fbLoading('กำลังบันทึก...');
      const payload = { doc_type: this.mode, doc_date: new Date().toISOString().slice(0, 10), total_amount: this.totalAmount, items: this.items.map(r => ({ party: r.party, type: r.type, pay_date: r.pay_date, cheque_date: r.cheque_date, cheque_no: r.cheque_no, account: r.account, amount: r.amount, note: r.note, imgName: r.imgName, slipUrl: r.slipUrl, invoiceRef: r.invoiceRef })) };
      try {
        const res = await fetch('/api/payments', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.dash.token }, body: JSON.stringify(payload) });
        if (res.status === 401) { this.dash.fbHide(); this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) { this.saved = true; this.savedMsg = 'บันทึกเรียบร้อยแล้ว (' + d.doc_no + ')'; this.dash.fbDone('บันทึกแล้ว'); this.loadHistory(); }
        else { this.dash.fbFail(d.message || 'บันทึกไม่สำเร็จ'); }
      } catch (e) { this.dash.fbFail('บันทึกไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
    },
  },
};
</script>

<style scoped>
.po-page { font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif; color: var(--text); font-size: 12px; margin-top: 12px; background: var(--surface); border: 1px solid var(--field-border); border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
.po-titlebar { font-weight: 700; padding: 18px 20px 2px; font-size: 18px; }
.po-items { padding: 8px 12px; overflow-x: auto; }
.po-item-table { width: 100%; border-collapse: collapse; min-width: 1200px; }
.po-item-table th { text-align: center; font-size: 12px; color: #fff; background: #3c4453; padding: 10px 8px; font-weight: 600; border-right: 1px solid rgba(255,255,255,.18); white-space: nowrap; }
.po-item-table th:last-child { border-right: none; }
.po-item-table td { padding: 5px 6px; border-bottom: 1px solid var(--field-border); }
.po-item-table input, .po-item-table select { width: 100%; height: 32px; padding: 0 9px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12.5px; font-family: inherit; background: var(--surface); color: var(--text); }
.po-item-table input:focus, .po-item-table select:focus { outline: none; border-color: #2F65F6; box-shadow: 0 0 0 3px rgba(47,101,246,.12); }
.po-num { text-align: right; }
.po-no { text-align: center; color: var(--muted); }
.pm-img { text-align: center; }
.pm-upload { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border: 1px dashed var(--field-border); border-radius: 8px; cursor: pointer; color: var(--muted); background: var(--field); }
.pm-upload:hover { border-color: #2F65F6; color: #2F65F6; }
.pm-upload svg { width: 20px; height: 20px; }
.pm-img-name { font-size: 13px; }
.po-foot-row td { padding: 9px 8px; border-top: 2px solid var(--field-border); font-weight: 700; font-size: 12.5px; }
.po-foot-label { text-align: right; color: var(--muted); }
.po-row-actions { display: flex; gap: 5px; justify-content: center; }
.po-ic { width: 28px; height: 28px; border-radius: 7px; border: 1px solid var(--field-border); background: var(--field); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; padding: 0; transition: background .15s, border-color .15s; }
.po-ic svg { width: 15px; height: 15px; }
.po-add { color: #1a9c54; } .po-add:hover { background: #e7f6ee; border-color: #1a9c54; }
.po-del { color: #e03131; } .po-del:hover { background: #fdeaea; border-color: #e03131; }
.po-footer { display: flex; align-items: center; justify-content: space-between; padding: 9px 14px; border-top: 1px solid var(--field-border); background: var(--field); border-radius: 0 0 14px 14px; }
.po-saved-msg { color: #1a9c54; font-size: 12px; font-weight: 600; }
.po-footer-btns { display: flex; gap: 10px; margin-left: auto; }
.po-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; border: 1px solid var(--field-border); border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 12px; background: #e7eaf1; color: var(--text); }
.po-btn-save, .po-btn-new { background: #1a9c54; color: #fff; border-color: #1a9c54; }
.po-btn-save:hover, .po-btn-new:hover { background: #158045; }
.po-page input:not([type="checkbox"]):not([type="file"]), .po-page select { background: var(--field); }
.po-page input:focus, .po-page select:focus { background: var(--surface); }
.pm-balance-hint { font-size: 10.5px; color: #a15c00; margin-top: 3px; white-space: nowrap; }
.pm-balance-hint.pm-full { color: #1a9c54; }
.pm-history { padding: 4px 20px 18px; }
.pm-history-title { font-weight: 700; font-size: 13px; margin: 6px 0 8px; }
.pm-history-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.pm-history-table thead th { background: var(--field); color: var(--text); padding: 7px 10px; text-align: left; font-weight: 700; border-bottom: 2px solid var(--field-border); }
.pm-history-table th.bl-r, .pm-history-table td.bl-r { text-align: right; }
.pm-history-table tbody td { padding: 7px 10px; border-bottom: 1px solid var(--field-border); }
.pm-history-status { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 700; background: #e7f6ee; color: #1a9c54; }
.pm-history-status.pm-partial { background: #fff0d6; color: #a15c00; }
.pm-no-slip { color: var(--muted); font-size: 11px; }
.pm-history-empty { text-align: center; color: var(--muted); padding: 16px; }
</style>
