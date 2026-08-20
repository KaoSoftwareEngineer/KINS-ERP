<template>
<div class="po-page">
  <div class="po-titlebar">📦 ย้ายชั้นสินค้า — เก็บเข้าแร็ค</div>

  <!-- ส่วนสแกน -->
  <div class="rt-scan">
    <div class="rt-scan-grid">
      <div class="rt-field"><label>วันที่</label><input type="date" v-model="form.transfer_date" /></div>
      <div class="rt-field"><label>เลขที่ย้ายสินค้า</label><input :value="form.tk_no" readonly class="rt-ro" /></div>
      <div class="rt-field rt-field-rack">
        <label>แร็คปลายทาง</label>
        <input ref="rackInput" v-model="form.location_code" placeholder="สแกน / พิมพ์รหัสแร็ค (เช่น ZONE-A-RACK-01)"
               @keyup.enter="focusBarcode" @blur="checkRack" />
        <span v-if="rackStatus" class="rt-rack-status" :class="rackOk ? 'ok' : 'bad'">{{ rackStatus }}</span>
      </div>
      <div class="rt-field rt-field-barcode">
        <label>บาร์โค้ด (สแกนม้วนผ้า)</label>
        <input ref="barcodeInput" v-model="barcode" placeholder="สแกน QR ม้วนผ้า แล้วกด Enter"
               :disabled="!rackOk" @keyup.enter="scanRoll" />
      </div>
    </div>
    <div class="rt-field rt-field-remark">
      <label>หมายเหตุ</label><input v-model="form.remark" placeholder="หมายเหตุ (ถ้ามี)" />
    </div>
  </div>

  <!-- ตารางม้วนที่สแกน -->
  <div class="po-items">
    <table class="po-item-table">
      <thead>
        <tr>
          <th style="width:44px;">ที่</th>
          <th style="text-align:left;">รหัสสินค้า</th>
          <th style="width:150px;">บาร์โค้ด</th>
          <th style="width:130px;text-align:right;">จำนวน</th>
          <th style="width:54px;"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in items" :key="row.roll_qr">
          <td class="po-no">{{ idx + 1 }}</td>
          <td class="rt-prod">{{ row.display }}</td>
          <td class="rt-code">{{ row.roll_qr }}</td>
          <td class="po-num">{{ Number(row.yards).toFixed(2) }} หลา</td>
          <td class="po-row-actions">
            <button class="po-ic po-del" title="เอาออก" @click="removeRow(idx)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>
            </button>
          </td>
        </tr>
        <tr v-if="items.length === 0"><td colspan="5" class="po-empty">ยังไม่มีม้วนผ้า — เลือกแร็คปลายทาง แล้วสแกน QR ม้วนผ้า</td></tr>
      </tbody>
      <tfoot v-if="items.length">
        <tr class="po-foot-row">
          <td colspan="3" class="po-foot-label">รวม {{ items.length }} ม้วน</td>
          <td class="po-num">{{ totalYards.toFixed(2) }} หลา</td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  </div>

  <!-- แถบล่าง -->
  <div class="po-footer">
    <span v-if="savedMsg" class="po-saved-msg">{{ savedMsg }}</span>
    <div class="po-footer-btns">
      <button class="po-btn po-btn-save" :disabled="!rackOk || items.length === 0" @click="save">💾 บันทึกเก็บเข้าแร็ค</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'RackTransferPage',
  inject: ['dash'],
  data() {
    return {
      form: { tk_no: '', transfer_date: new Date().toISOString().slice(0, 10), location_code: '', remark: '' },
      barcode: '',
      items: [],
      rackStatus: '', rackOk: false,
      savedMsg: '',
    };
  },
  computed: {
    totalYards() { return this.items.reduce((s, r) => s + (Number(r.yards) || 0), 0); },
  },
  mounted() {
    this.loadNextNo();
    this.$nextTick(() => { if (this.$refs.rackInput) this.$refs.rackInput.focus(); });
  },
  methods: {
    authHeaders() { return { Authorization: 'Bearer ' + this.dash.token }; },
    async loadNextNo() {
      try {
        const res = await fetch('/api/rack-transfers/next-no', { headers: this.authHeaders() });
        const d = await res.json();
        if (d.ok) this.form.tk_no = d.tk_no;
      } catch (e) {}
    },
    // ตรวจแร็คปลายทางว่ามีจริงในหน้าโซน&แร็ค
    async checkRack() {
      const code = (this.form.location_code || '').trim();
      if (!code) { this.rackStatus = ''; this.rackOk = false; return; }
      try {
        const res = await fetch('/api/warehouse-locations', { headers: this.authHeaders() });
        const d = await res.json();
        const found = (d.locations || []).find(l => l.location_code === code || l.location_qr === code);
        if (found) { this.rackOk = true; this.rackStatus = `✓ แร็ค ${found.location_code} (โซน ${found.zone || '-'} แร็ค ${found.rack || '-'})`; this.form.location_code = found.location_code; }
        else { this.rackOk = false; this.rackStatus = '✕ ไม่พบแร็คนี้ในระบบ — สร้างที่หน้าโซน & แร็คก่อน'; }
      } catch (e) { this.rackOk = false; this.rackStatus = '✕ ตรวจสอบแร็คไม่สำเร็จ'; }
    },
    focusBarcode() {
      this.checkRack().then(() => {
        if (this.rackOk) this.$nextTick(() => { if (this.$refs.barcodeInput) this.$refs.barcodeInput.focus(); });
      });
    },
    // สแกน QR ม้วน → lookup → เพิ่มแถว
    async scanRoll() {
      const qr = (this.barcode || '').trim();
      if (!qr) return;
      if (this.items.some(r => r.roll_qr === qr)) { this.dash.fbFail('ม้วนนี้สแกนไปแล้ว'); this.barcode = ''; return; }
      try {
        const res = await fetch('/api/fabric-rolls/lookup?qr=' + encodeURIComponent(qr), { headers: this.authHeaders() });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (!d.ok) { this.dash.fbFail(d.message || 'ไม่พบม้วนผ้ารหัสนี้'); this.barcode = ''; return; }
        const r = d.roll;
        const display = [r.product_sku, r.product_name].filter(Boolean).join(' - ') + (r.color_name ? ' : ' + r.color_name : '');
        this.items.push({ roll_qr: qr, sku: r.product_sku || '', display: display || qr, yards: Number(r.current_yards) || 0 });
        this.barcode = '';
        this.$nextTick(() => { if (this.$refs.barcodeInput) this.$refs.barcodeInput.focus(); });
      } catch (e) { this.dash.fbFail('สแกนไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); this.barcode = ''; }
    },
    removeRow(idx) { this.items.splice(idx, 1); },
    async save() {
      if (!this.rackOk) { this.dash.fbFail('กรุณาเลือกแร็คปลายทางที่ถูกต้อง'); return; }
      if (this.items.length === 0) { this.dash.fbFail('กรุณาสแกนม้วนผ้าอย่างน้อย 1 ม้วน'); return; }
      this.dash.fbLoading('กำลังเก็บเข้าแร็ค...');
      const payload = {
        transfer_date: this.form.transfer_date, location_code: this.form.location_code, remark: this.form.remark,
        items: this.items.map(r => ({ roll_qr: r.roll_qr })),
      };
      try {
        const res = await fetch('/api/rack-transfers', {
          method: 'POST', headers: { 'Content-Type': 'application/json', ...this.authHeaders() }, body: JSON.stringify(payload),
        });
        if (res.status === 401) { this.dash.fbHide(); this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) {
          this.form.tk_no = d.tk_no;
          this.savedMsg = d.message;
          this.dash.fbDone('เก็บเข้าแร็คแล้ว');
          // เคลียร์เพื่อสแกนแร็คถัดไป
          this.items = [];
          this.form.location_code = ''; this.rackOk = false; this.rackStatus = '';
          this.loadNextNo();
          this.$nextTick(() => { if (this.$refs.rackInput) this.$refs.rackInput.focus(); });
        } else { this.dash.fbFail(d.message || 'บันทึกไม่สำเร็จ'); }
      } catch (e) { this.dash.fbFail('บันทึกไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
    },
  },
};
</script>

<style scoped>
.po-page { font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif; color: var(--text); font-size: 13px; position: relative; margin-top: 12px; background: var(--surface); border: 1px solid var(--field-border); border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
.po-titlebar { background: transparent; color: var(--text); font-weight: 700; padding: 18px 20px 2px; font-size: 18px; }

.rt-scan { padding: 16px 20px; border-bottom: 1px solid var(--field-border); }
.rt-scan-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 20px; }
.rt-field { display: flex; flex-direction: column; gap: 5px; }
.rt-field > label { font-size: 12px; color: var(--muted); font-weight: 600; }
.rt-field input { height: 40px; padding: 0 12px; border: 1px solid var(--field-border); border-radius: 9px; font-size: 14px; font-family: inherit; background: var(--field); color: var(--text); transition: border-color .2s, box-shadow .2s; }
.rt-field input:focus { outline: none; border-color: #2F65F6; box-shadow: 0 0 0 3px rgba(47,101,246,.12); background: var(--surface); }
.rt-field input:disabled { opacity: .55; cursor: not-allowed; }
.rt-ro { background: var(--field) !important; font-weight: 700; }
.rt-field-barcode input { border-color: #2F65F6; font-weight: 600; }
.rt-field-remark { margin-top: 12px; }
.rt-rack-status { font-size: 12px; font-weight: 600; margin-top: 2px; }
.rt-rack-status.ok { color: #1a9c54; }
.rt-rack-status.bad { color: #e03131; }

.po-items { padding: 12px 16px; min-height: 140px; }
.po-item-table { width: 100%; border-collapse: collapse; }
.po-item-table th { text-align: center; font-size: 12px; color: #fff; background: #3c4453; padding: 10px 8px; font-weight: 600; letter-spacing: .3px; border-right: 1px solid rgba(255,255,255,.18); }
.po-item-table th:last-child { border-right: none; }
.po-item-table td { padding: 8px 8px; border-bottom: 1px solid var(--field-border); }
.rt-prod { font-weight: 600; }
.rt-code { font-family: 'Courier New', monospace; font-size: 12px; color: var(--muted); text-align: center; }
.po-num { text-align: right; }
.po-no { text-align: center; color: var(--muted); }
.po-empty { text-align: center; color: var(--muted); padding: 30px; }
.po-foot-row td { padding: 10px 8px; border-top: 2px solid var(--field-border); font-weight: 700; font-size: 13px; }
.po-foot-label { text-align: right; color: var(--muted); }
.po-row-actions { display: flex; justify-content: center; }
.po-ic { width: 28px; height: 28px; border-radius: 7px; border: 1px solid var(--field-border); background: var(--field); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; padding: 0; transition: background .15s, border-color .15s; }
.po-ic svg { width: 15px; height: 15px; }
.po-del { color: #e03131; } .po-del:hover { background: #fdeaea; border-color: #e03131; }

.po-footer { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-top: 1px solid var(--field-border); background: var(--field); border-radius: 0 0 14px 14px; }
.po-saved-msg { color: #1a9c54; font-size: 13px; font-weight: 600; }
.po-footer-btns { display: flex; gap: 10px; margin-left: auto; }
.po-btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 20px; border: 1px solid var(--field-border); border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 13px; background: #e7eaf1; color: var(--text); transition: background .2s, border-color .2s; }
.po-btn-save { background: #1a9c54; color: #fff; border-color: #1a9c54; }
.po-btn-save:hover { background: #158045; border-color: #158045; }
.po-btn-save:disabled { opacity: .5; cursor: not-allowed; }
</style>
