<template>
<div class="po-page">
  <div class="po-titlebar">➖ {{ partyType === 'partner' ? 'หักบัญชีคู่ค้า' : 'หักบัญชีลูกค้า' }}</div>

  <div class="ad-head">
    <div class="ad-left">
      <div class="ad-field"><label>{{ partyLabel }}</label>
        <select v-model="form.party" @change="search">
          <option value="">— เลือก{{ partyLabel }} —</option>
          <option v-for="p in partyOptions" :key="p" :value="p">{{ p }}</option>
        </select>
      </div>
      <template v-if="partyType === 'customer'">
        <div class="ad-field"><label>วันที่ขายส่ง</label>
          <div class="ad-range"><input type="date" v-model="form.ws_from" /><span>–</span><input type="date" v-model="form.ws_to" /></div>
        </div>
        <div class="ad-field"><label>วันที่ขายปลีก</label>
          <div class="ad-range"><input type="date" v-model="form.rt_from" /><span>–</span><input type="date" v-model="form.rt_to" /></div>
        </div>
      </template>
      <template v-else>
        <div class="ad-field"><label>วันที่</label>
          <div class="ad-range"><input type="date" v-model="form.ws_from" /><span>–</span><input type="date" v-model="form.ws_to" /></div>
        </div>
      </template>
      <button class="ad-search" @click="search">🔍 ค้นหา</button>
    </div>
    <div class="ad-right">
      <div class="ad-sum"><label>ยอดเงิน</label><input :value="fmt(balance.total)" readonly /></div>
      <div class="ad-sum"><label>หักไปแล้ว</label><input :value="fmt(balance.deducted)" readonly /></div>
      <div class="ad-sum ad-sum-remain"><label>คงเหลือ</label><input :value="fmt(balance.remaining)" readonly /></div>
    </div>
  </div>

  <div class="ad-body">
    <div class="ad-deduct-box">
      <div class="ad-field"><label>จำนวนที่หัก</label><input type="number" v-model.number="deductAmount" placeholder="0.00" /></div>
      <div class="ad-field"><label>หมายเหตุ</label><input v-model="deductNote" placeholder="เหตุผลการหักบัญชี" /></div>
    </div>
  </div>

  <div class="po-footer">
    <span v-if="savedMsg" class="po-saved-msg">{{ savedMsg }}</span>
    <div class="po-footer-btns">
      <button class="po-btn po-btn-save" @click="save">💾 บันทึก</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'AccountDeductPage',
  inject: ['dash'],
  props: { partyType: { type: String, default: 'customer' } },
  data() {
    return {
      form: { party: '', ws_from: '', ws_to: '', rt_from: '', rt_to: '' },
      balance: { total: 0, deducted: 0, remaining: 0 },
      deductAmount: null, deductNote: '', partyOptions: [], savedMsg: '',
    };
  },
  computed: { partyLabel() { return this.partyType === 'partner' ? 'คู่ค้า' : 'ลูกค้า'; } },
  watch: { partyType() { this.reset(); this.loadParties(); } },
  mounted() { this.loadParties(); },
  methods: {
    fmt(v) { return (Number(v) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
    reset() { this.form = { party: '', ws_from: '', ws_to: '', rt_from: '', rt_to: '' }; this.balance = { total: 0, deducted: 0, remaining: 0 }; this.deductAmount = null; this.deductNote = ''; this.savedMsg = ''; },
    async loadParties() {
      const url = this.partyType === 'partner' ? '/api/partners' : '/api/customers';
      try { const res = await fetch(url, { headers: { Authorization: 'Bearer ' + this.dash.token } }); const d = await res.json(); this.partyOptions = (d.items || d.customers || []).map(x => x.company_name || x.name).filter(Boolean).slice(0, 300); } catch (e) {}
    },
    async search() {
      if (!this.form.party) { this.balance = { total: 0, deducted: 0, remaining: 0 }; return; }
      try {
        const res = await fetch('/api/account-balance?type=' + this.partyType + '&party=' + encodeURIComponent(this.form.party), { headers: { Authorization: 'Bearer ' + this.dash.token } });
        const d = await res.json();
        if (d.ok) this.balance = { total: d.total, deducted: d.deducted, remaining: d.remaining };
      } catch (e) {}
    },
    async save() {
      if (!this.form.party) { this.dash.fbFail('กรุณาเลือก' + this.partyLabel); return; }
      if (!(Number(this.deductAmount) > 0)) { this.dash.fbFail('กรุณากรอกจำนวนที่หัก'); return; }
      this.dash.fbLoading('กำลังบันทึก...');
      const payload = {
        doc_type: 'deduct-' + this.partyType, doc_date: new Date().toISOString().slice(0, 10), total_amount: this.deductAmount,
        items: [{ party: this.form.party, amount: this.deductAmount, note: this.deductNote }],
      };
      try {
        const res = await fetch('/api/payments', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.dash.token }, body: JSON.stringify(payload) });
        if (res.status === 401) { this.dash.fbHide(); this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) { this.savedMsg = 'หักบัญชีเรียบร้อยแล้ว (' + d.doc_no + ')'; this.dash.fbDone('บันทึกแล้ว'); this.deductAmount = null; this.deductNote = ''; this.search(); }
        else { this.dash.fbFail(d.message || 'บันทึกไม่สำเร็จ'); }
      } catch (e) { this.dash.fbFail('บันทึกไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
    },
  },
};
</script>

<style scoped>
.po-page { font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif; color: var(--text); font-size: 12px; margin-top: 12px; background: var(--surface); border: 1px solid var(--field-border); border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
.po-titlebar { font-weight: 700; padding: 18px 20px 2px; font-size: 18px; }
.ad-head { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 24px; padding: 20px; border-bottom: 1px solid var(--field-border); }
.ad-left { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 16px; }
.ad-field { display: flex; flex-direction: column; gap: 5px; }
.ad-field > label { font-size: 12px; color: var(--muted); font-weight: 600; }
.ad-field input, .ad-field select { height: 36px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12px; font-family: inherit; background: var(--field); color: var(--text); min-width: 150px; }
.ad-field input:focus, .ad-field select:focus { outline: none; border-color: #2F65F6; background: var(--surface); }
.ad-range { display: flex; align-items: center; gap: 6px; }
.ad-range input { min-width: 130px; }
.ad-range span { color: var(--muted); }
.ad-search { height: 36px; padding: 0 18px; border: 1px solid #1e3a8a; background: #1e3a8a; color: #fff; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; }
.ad-search:hover { background: #172b6b; }
.ad-right { display: flex; flex-direction: column; gap: 8px; }
.ad-sum { display: flex; align-items: center; gap: 10px; justify-content: flex-end; }
.ad-sum > label { font-size: 12px; color: var(--muted); min-width: 70px; text-align: right; }
.ad-sum input { height: 34px; width: 160px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; text-align: right; font-size: 12px; font-weight: 600; background: var(--field); color: var(--text); }
.ad-sum-remain input { color: #158045; font-weight: 700; border-color: #1a9c54; background: #e7f6ee; }
.ad-body { padding: 20px; }
.ad-deduct-box { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-end; }
.po-footer { display: flex; align-items: center; justify-content: space-between; padding: 9px 14px; border-top: 1px solid var(--field-border); background: var(--field); border-radius: 0 0 14px 14px; }
.po-saved-msg { color: #1a9c54; font-size: 12px; font-weight: 600; }
.po-footer-btns { display: flex; gap: 10px; margin-left: auto; }
.po-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border: 1px solid var(--field-border); border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 12px; background: #e7eaf1; color: var(--text); }
.po-btn-save { background: #1a9c54; color: #fff; border-color: #1a9c54; }
.po-btn-save:hover { background: #158045; }
</style>
