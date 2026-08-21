<template>
<div class="po-page">
  <div class="po-titlebar">↩️ รับคืนอินวอยส์</div>
  <div class="po-head">
    <div class="po-head-col">
      <div class="po-field"><label>วันที่</label><input type="date" v-model="form.ret_date" /></div>
      <div class="po-field"><label>เลขที่บิล</label><input :value="form.ivr_no" readonly class="po-ro" /></div>
    </div>
    <div class="po-head-col">
      <div class="po-field"><label>พนักงานส่งของ</label><select v-model="form.shipper"><option value="">— เลือก —</option><option v-for="s in shippers" :key="s" :value="s">{{ s }}</option></select></div>
      <div class="po-field"><label>ประเภทการชำระเงิน</label><select v-model="form.payment_type"><option value="">— เลือก —</option><option>เงินสด</option><option>เช็ค</option><option>โอน</option><option>เครดิต</option></select></div>
    </div>
    <div class="po-head-col po-head-col-wide">
      <div class="po-field"><label>หมายเหตุ</label><textarea v-model="form.remark" rows="3"></textarea></div>
    </div>
  </div>
  <div class="po-body"></div>
  <div class="po-footer">
    <span v-if="savedMsg" class="po-saved-msg">{{ savedMsg }}</span>
    <div class="po-footer-btns">
      <button v-if="!saved" class="po-btn po-btn-save" @click="save">💾 บันทึก</button>
      <button v-else class="po-btn po-btn-new" @click="resetForm">🔄 รับคืนใหม่</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'InvoiceReturnPage',
  inject: ['dash'],
  data() {
    return { form: { ivr_no: '', ret_date: new Date().toISOString().slice(0, 10), shipper: '', payment_type: '', remark: '' }, shippers: ['พนักงาน A', 'พนักงาน B'], saved: false, savedMsg: '' };
  },
  mounted() { this.loadNextNo(); },
  methods: {
    async loadNextNo() { try { const r = await fetch('/api/invoice-returns/next-no', { headers: { Authorization: 'Bearer ' + this.dash.token } }); const d = await r.json(); if (d.ok) this.form.ivr_no = d.ivr_no; } catch (e) {} },
    resetForm() { this.form = { ivr_no: '', ret_date: new Date().toISOString().slice(0, 10), shipper: '', payment_type: '', remark: '' }; this.saved = false; this.savedMsg = ''; this.loadNextNo(); },
    async save() {
      this.dash.fbLoading('กำลังบันทึก...');
      try {
        const res = await fetch('/api/invoice-returns', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.dash.token }, body: JSON.stringify({ ...this.form, items: [] }) });
        if (res.status === 401) { this.dash.fbHide(); this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) { this.form.ivr_no = d.ivr_no; this.saved = true; this.savedMsg = 'รับคืนอินวอยส์เรียบร้อยแล้ว'; this.dash.fbDone('บันทึกแล้ว'); }
        else { this.dash.fbFail(d.message || 'บันทึกไม่สำเร็จ'); }
      } catch (e) { this.dash.fbFail('บันทึกไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
    },
  },
};
</script>

<style scoped>
.po-page { font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif; color: var(--text); font-size: 13px; margin-top: 12px; background: var(--surface); border: 1px solid var(--field-border); border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
.po-titlebar { font-weight: 700; padding: 18px 20px 2px; font-size: 18px; }
.po-head { display: flex; flex-wrap: wrap; gap: 22px; padding: 20px; border-bottom: 1px solid var(--field-border); }
.po-head-col { display: flex; flex-direction: column; gap: 8px; }
.po-head-col-wide { flex: 1; min-width: 220px; }
.po-field { display: flex; align-items: flex-start; gap: 8px; }
.po-field > label { min-width: 130px; text-align: right; padding-top: 6px; color: var(--muted); font-size: 12px; font-weight: 600; }
.po-field input, .po-field select { height: 36px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 13px; font-family: inherit; background: var(--field); color: var(--text); min-width: 150px; }
.po-field textarea { width: 100%; resize: vertical; padding: 8px 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 13px; font-family: inherit; background: var(--field); color: var(--text); }
.po-field input:focus, .po-field select:focus, .po-field textarea:focus { outline: none; border-color: #2F65F6; background: var(--surface); box-shadow: 0 0 0 3px rgba(47,101,246,.12); }
.po-ro { background: var(--field) !important; font-weight: 700; }
.po-body { min-height: 120px; }
.po-footer { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-top: 1px solid var(--field-border); background: var(--field); border-radius: 0 0 14px 14px; }
.po-saved-msg { color: #1a9c54; font-size: 13px; font-weight: 600; }
.po-footer-btns { display: flex; gap: 10px; margin-left: auto; }
.po-btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 20px; border: 1px solid var(--field-border); border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 13px; background: #e7eaf1; color: var(--text); }
.po-btn-save, .po-btn-new { background: #1a9c54; color: #fff; border-color: #1a9c54; }
.po-btn-save:hover, .po-btn-new:hover { background: #158045; }
</style>
