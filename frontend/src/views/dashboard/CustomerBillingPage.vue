<template>
<div class="po-page">
  <div class="po-titlebar">📃 วางบิลลูกค้า</div>
  <div class="po-head">
    <div class="po-head-col">
      <div class="po-field"><label>วันที่</label><input type="date" v-model="form.bill_date" /></div>
      <div class="po-field"><label>เลขที่วางบิล</label><input :value="form.br_no" readonly class="po-ro" /></div>
    </div>
    <div class="po-head-col">
      <div class="po-field"><label>วันครบกำหนด</label><input type="date" v-model="form.due_date" /></div>
      <div class="po-field"><label>ลูกค้า</label><input :value="form.customer" readonly class="po-ro" placeholder="เลือกจากรายชื่อ" /></div>
    </div>
  </div>

  <div class="bl-body">
    <div class="bl-left">
      <div class="bl-panel-title">รายชื่อลูกค้า</div>
      <div class="bl-cust-list">
        <div v-for="(c, i) in customers" :key="i" class="bl-cust" :class="{ 'is-sel': form.customer === c }" @click="form.customer = c">
          <span class="bl-cust-no">{{ i + 1 }}</span>{{ c }}
        </div>
        <div v-if="customers.length === 0" class="bl-empty">ไม่มีรายชื่อลูกค้า</div>
      </div>
    </div>
    <div class="bl-right">
      <div class="bl-note">
        เลือกลูกค้าจากรายชื่อด้านซ้ายเพื่อวางบิล — เวอร์ชันนี้บันทึกใบวางบิลตามลูกค้า/วันครบกำหนด<br>
        <small>(ตารางแยกขายส่ง/ขายปลีก/ใบลดหนี้ และโหมด Bulk จะเสริมในเวอร์ชันถัดไป)</small>
      </div>
    </div>
  </div>

  <div class="po-footer">
    <span v-if="savedMsg" class="po-saved-msg">{{ savedMsg }}</span>
    <div class="po-footer-btns">
      <button class="po-btn po-btn-report" @click="dash.fbFail('ตัวอย่างรายงาน (ยังไม่เชื่อมระบบพิมพ์รายงานจริง)')">👁 รายงาน</button>
      <button v-if="!saved" class="po-btn po-btn-save" @click="save">💾 บันทึก</button>
      <button v-else class="po-btn po-btn-new" @click="resetForm">🔄 วางบิลใหม่</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'CustomerBillingPage',
  inject: ['dash'],
  data() { return { form: { br_no: '', bill_date: new Date().toISOString().slice(0, 10), due_date: '', customer: '' }, customers: [], saved: false, savedMsg: '' }; },
  async mounted() { await this.loadNextNo(); this.loadCustomers(); },
  methods: {
    async loadNextNo() { try { const r = await fetch('/api/customer-billings/next-no', { headers: { Authorization: 'Bearer ' + this.dash.token } }); const d = await r.json(); if (d.ok) this.form.br_no = d.br_no; } catch (e) {} },
    async loadCustomers() { try { const r = await fetch('/api/customers', { headers: { Authorization: 'Bearer ' + this.dash.token } }); const d = await r.json(); this.customers = (d.items || d.customers || []).map(c => c.company_name || c.name).filter(Boolean).slice(0, 300); } catch (e) {} },
    resetForm() { this.form = { br_no: '', bill_date: new Date().toISOString().slice(0, 10), due_date: '', customer: '' }; this.saved = false; this.savedMsg = ''; this.loadNextNo(); },
    async save() {
      if (!this.form.customer) { this.dash.fbFail('กรุณาเลือกลูกค้าจากรายชื่อ'); return; }
      this.dash.fbLoading('กำลังบันทึก...');
      try {
        const res = await fetch('/api/customer-billings', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.dash.token }, body: JSON.stringify({ ...this.form, total_amount: 0, items: [] }) });
        if (res.status === 401) { this.dash.fbHide(); this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) { this.form.br_no = d.br_no; this.saved = true; this.savedMsg = 'วางบิลเรียบร้อยแล้ว'; this.dash.fbDone('บันทึกแล้ว'); }
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
.po-field { display: flex; align-items: flex-start; gap: 8px; }
.po-field > label { min-width: 100px; text-align: right; padding-top: 6px; color: var(--muted); font-size: 12px; font-weight: 600; }
.po-field input { height: 36px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 13px; font-family: inherit; background: var(--field); color: var(--text); min-width: 160px; }
.po-field input:focus { outline: none; border-color: #2F65F6; background: var(--surface); }
.po-ro { background: var(--field) !important; font-weight: 700; }
.bl-body { display: flex; gap: 18px; padding: 18px 20px; min-height: 260px; }
.bl-left { width: 320px; flex-shrink: 0; }
.bl-panel-title { font-weight: 700; font-size: 13px; margin-bottom: 8px; }
.bl-cust-list { border: 1px solid var(--field-border); border-radius: 10px; overflow: hidden; max-height: 400px; overflow-y: auto; }
.bl-cust { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-bottom: 1px solid var(--field-border); cursor: pointer; background: #eafaf1; font-size: 13px; }
.bl-cust:hover { background: #d7f2e3; }
.bl-cust.is-sel { background: #1a9c54; color: #fff; }
.bl-cust-no { width: 22px; color: var(--muted); font-size: 12px; }
.bl-cust.is-sel .bl-cust-no { color: rgba(255,255,255,.8); }
.bl-empty { padding: 20px; text-align: center; color: var(--muted); }
.bl-right { flex: 1; }
.bl-note { background: var(--field); border: 1px solid var(--field-border); border-radius: 10px; padding: 18px; color: var(--muted); font-size: 13px; line-height: 1.7; }
.po-footer { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-top: 1px solid var(--field-border); background: var(--field); border-radius: 0 0 14px 14px; }
.po-saved-msg { color: #1a9c54; font-size: 13px; font-weight: 600; }
.po-footer-btns { display: flex; gap: 10px; margin-left: auto; }
.po-btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 20px; border: 1px solid var(--field-border); border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 13px; background: #e7eaf1; color: var(--text); }
.po-btn-save, .po-btn-new { background: #1a9c54; color: #fff; border-color: #1a9c54; }
.po-btn-save:hover, .po-btn-new:hover { background: #158045; }
</style>
