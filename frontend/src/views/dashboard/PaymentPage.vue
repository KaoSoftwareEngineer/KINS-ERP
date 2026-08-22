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
          <th style="min-width:150px;">หมายเหตุ</th>
          <th style="width:90px;">รูป</th>
          <th style="width:70px;"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in items" :key="row._key">
          <td class="po-no">{{ idx + 1 }}</td>
          <td><input list="pm-parties" v-model="row.party" placeholder="เลือก/พิมพ์" /></td>
          <td><select v-model="row.type"><option value="">—</option><option>เงินสด</option><option>เช็ค</option><option>โอน</option></select></td>
          <td><input type="date" v-model="row.pay_date" /></td>
          <td><input type="date" v-model="row.cheque_date" :disabled="row.type !== 'เช็ค'" /></td>
          <td><input v-model="row.cheque_no" :disabled="row.type !== 'เช็ค'" placeholder="เลขที่เช็ค" /></td>
          <td><select v-model="row.account"><option value="">—</option><option v-for="a in accountOptions" :key="a" :value="a">{{ a }}</option></select></td>
          <td><input type="number" v-model.number="row.amount" class="po-num" placeholder="0.00" /></td>
          <td><input v-model="row.note" placeholder="หมายเหตุ" /></td>
          <td class="pm-img"><label class="pm-upload"><input type="file" accept="image/*" @change="onImg($event, row)" hidden /><span v-if="row.imgName" class="pm-img-name">📎</span><svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5M12 3v12"/></svg></label></td>
          <td class="po-row-actions">
            <button class="po-ic po-add" @click="addRow(idx)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button>
            <button class="po-ic po-del" @click="removeRow(idx)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 12h14"/></svg></button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="po-foot-row"><td colspan="7" class="po-foot-label">รวม</td><td class="po-num">{{ totalAmount.toFixed(2) }}</td><td colspan="3"></td></tr>
      </tfoot>
    </table>
    <datalist id="pm-parties"><option v-for="p in partyOptions" :key="p" :value="p" /></datalist>
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
    };
  },
  computed: {
    partyLabel() { return this.mode === 'pay' ? 'คู่ค้า' : 'ลูกค้า'; },
    totalAmount() { return this.items.reduce((s, r) => s + (Number(r.amount) || 0), 0); },
  },
  watch: { mode() { this.resetForm(); this.loadParties(); } },
  mounted() { this.loadParties(); },
  methods: {
    newRow() { return { _key: (this._seq = (this._seq || 0) + 1), party: '', type: '', pay_date: new Date().toISOString().slice(0, 10), cheque_date: '', cheque_no: '', account: '', amount: null, note: '', imgName: '' }; },
    addRow(idx) { this.items.splice(idx + 1, 0, this.newRow()); },
    removeRow(idx) { if (this.items.length > 1) this.items.splice(idx, 1); },
    onImg(e, row) { const f = e.target.files && e.target.files[0]; if (f) row.imgName = f.name; },
    async loadParties() {
      const url = this.mode === 'pay' ? '/api/partners' : '/api/customers';
      try { const res = await fetch(url, { headers: { Authorization: 'Bearer ' + this.dash.token } }); const d = await res.json(); this.partyOptions = (d.items || d.customers || []).map(x => x.company_name || x.name).filter(Boolean).slice(0, 300); } catch (e) {}
    },
    resetForm() { this.items = [this.newRow()]; this.saved = false; this.savedMsg = ''; },
    async save() {
      if (!this.items.some(r => (Number(r.amount) || 0) > 0)) { this.dash.fbFail('กรุณากรอกจำนวนเงินอย่างน้อย 1 รายการ'); return; }
      this.dash.fbLoading('กำลังบันทึก...');
      const payload = { doc_type: this.mode, doc_date: new Date().toISOString().slice(0, 10), total_amount: this.totalAmount, items: this.items.map(r => ({ party: r.party, type: r.type, pay_date: r.pay_date, cheque_date: r.cheque_date, cheque_no: r.cheque_no, account: r.account, amount: r.amount, note: r.note, imgName: r.imgName })) };
      try {
        const res = await fetch('/api/payments', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.dash.token }, body: JSON.stringify(payload) });
        if (res.status === 401) { this.dash.fbHide(); this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) { this.saved = true; this.savedMsg = 'บันทึกเรียบร้อยแล้ว (' + d.doc_no + ')'; this.dash.fbDone('บันทึกแล้ว'); }
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
</style>
