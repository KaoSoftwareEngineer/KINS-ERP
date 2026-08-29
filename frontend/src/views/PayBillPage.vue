<template>
<div class="pb-wrap">
  <div class="pb-card">
    <div v-if="loading" class="pb-loading">กำลังโหลดบิล…</div>

    <div v-else-if="error" class="pb-error">
      <div class="pb-error-ic">⚠️</div>
      <div>{{ error }}</div>
    </div>

    <template v-else-if="bill">
      <h1 class="pb-shop">{{ bill.shopName || 'ร้านผ้า' }}</h1>
      <div class="pb-order-no" v-if="bill.orderNo">ออเดอร์ #{{ bill.orderNo }}</div>

      <div class="pb-status" :class="'pb-st-' + bill.payStatus">{{ statusLabel }}</div>

      <!-- สรุปบิล -->
      <div class="pb-summary">
        <div class="pb-sum-title">รายการสั่งซื้อ</div>
        <div v-for="(it, i) in bill.items" :key="i" class="pb-sum-row">
          <span class="pb-sum-name">{{ it.name }} <span class="pb-sum-qty">× {{ it.qty }}</span></span>
          <span class="pb-sum-amt">{{ money(it.qty * it.price) }}</span>
        </div>
        <div class="pb-sum-total">
          <span>ยอดที่ต้องชำระ</span>
          <span class="pb-total-num">฿ {{ money(bill.amount) }}</span>
        </div>
      </div>

      <!-- ชำระแล้ว -->
      <div v-if="bill.payStatus === 'paid'" class="pb-paid">
        <div class="pb-paid-ic">✅</div>
        <div>ชำระเงินเรียบร้อยแล้ว<br>ขอบคุณค่ะ 🙏</div>
      </div>

      <!-- ยังไม่ชำระ / อัปสลิปแล้วรอตรวจ -->
      <template v-else>
        <div v-if="uploadMsg" class="pb-review" :class="{ 'pb-review-bad': uploadBad }">{{ uploadMsg }}</div>
        <div v-else-if="bill.payStatus === 'slip_uploaded'" class="pb-review">
          🕐 ได้รับสลิปแล้ว — ร้านกำลังตรวจสอบ ระบบจะยืนยันให้เร็วที่สุด
        </div>

        <template v-if="qrDataUrl">
          <p class="pb-scan">สแกน QR ด้านล่างเพื่อชำระเงิน<br><b>(ล็อกยอด {{ money(bill.amount) }} บาทอัตโนมัติ)</b></p>
          <div class="pb-qr"><img :src="qrDataUrl" alt="PromptPay QR" /></div>
          <div class="pb-qr-name" v-if="bill.promptpayName">พร้อมเพย์: {{ bill.promptpayName }}</div>
        </template>
        <div v-else class="pb-noqr">ร้านยังไม่ได้ตั้งค่าบัญชีรับเงิน (PromptPay) — กรุณาติดต่อร้าน</div>

        <!-- อัปโหลดสลิป -->
        <label class="pb-upload">
          <input type="file" accept="image/*" @change="onSlip" hidden />
          <span v-if="!uploading">📸 {{ bill.slipUrl ? 'อัปโหลดสลิปใหม่' : 'อัปโหลดสลิปโอนเงิน' }}</span>
          <span v-else>กำลังอัปโหลด…</span>
        </label>
        <div v-if="bill.slipUrl" class="pb-slip-preview">
          <img :src="apiBase + bill.slipUrl" alt="สลิป" />
        </div>
        <p class="pb-note">ระบบจะแจ้งร้านให้ตรวจสอบสลิปและตัดยอดให้</p>
      </template>
    </template>
  </div>
</div>
</template>

<script>
import QRCode from 'qrcode';
import { promptpayPayload } from '../utils/promptpay.js';

export default {
  name: 'PayBillPage',
  data() {
    return { token: this.$route.params.token, loading: true, error: '', bill: null, qrDataUrl: '', uploading: false,
      apiBase: '', uploadMsg: '', uploadBad: false };
  },
  computed: {
    statusLabel() {
      return { unpaid: 'สถานะ: รอชำระเงิน', none: 'สถานะ: รอชำระเงิน', slip_uploaded: 'สถานะ: รอตรวจสอบสลิป', paid: 'สถานะ: ชำระเงินแล้ว' }[this.bill.payStatus] || 'รอชำระเงิน';
    },
  },
  mounted() { this.load(); },
  methods: {
    money(v) { return (Number(v) || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
    async load() {
      this.loading = true; this.error = '';
      try {
        const res = await fetch('/api/public/bill/' + this.token);
        const d = await res.json();
        if (!d.ok) { this.error = d.message || 'ไม่พบบิลนี้'; return; }
        this.bill = d.bill;
        await this.buildQr();
      } catch (e) { this.error = 'เชื่อมต่อไม่สำเร็จ กรุณาลองใหม่'; }
      finally { this.loading = false; }
    },
    async buildQr() {
      this.qrDataUrl = '';
      if (!this.bill.promptpayId || this.bill.payStatus === 'paid') return;
      const payload = promptpayPayload(this.bill.promptpayId, this.bill.amount);
      if (!payload) return;
      try { this.qrDataUrl = await QRCode.toDataURL(payload, { width: 240, margin: 1 }); } catch (e) { this.qrDataUrl = ''; }
    },
    async onSlip(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      this.uploading = true;
      try {
        const fd = new FormData(); fd.append('file', file);
        const res = await fetch('/api/public/bill/' + this.token + '/slip', { method: 'POST', body: fd });
        const d = await res.json();
        if (d.ok) {
          this.uploadMsg = d.message || '';
          this.uploadBad = !!(d.check && d.check.verified && !d.check.paid);
          await this.load();
        } else { alert(d.message || 'อัปโหลดไม่สำเร็จ'); }
      } catch (err) { alert('อัปโหลดไม่สำเร็จ กรุณาลองใหม่'); }
      finally { this.uploading = false; e.target.value = ''; }
    },
  },
};
</script>

<style scoped>
.pb-wrap { min-height: 100vh; background: #eef1f5; display: flex; align-items: flex-start; justify-content: center; padding: 24px 14px; font-family: 'Sarabun', 'Noto Sans Thai', -apple-system, 'Segoe UI', sans-serif; }
.pb-card { width: 100%; max-width: 420px; background: #fff; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,.12); padding: 26px 22px; text-align: center; }
.pb-loading, .pb-error { padding: 40px 10px; color: #666; }
.pb-error-ic { font-size: 40px; margin-bottom: 10px; }
.pb-shop { color: #0d5bd1; font-size: 22px; margin: 0 0 4px; font-weight: 700; }
.pb-order-no { color: #555; font-size: 15px; margin-bottom: 12px; }
.pb-status { display: inline-block; padding: 5px 14px; border-radius: 999px; font-size: 13px; font-weight: 700; margin-bottom: 16px; }
.pb-st-unpaid, .pb-st-none { background: #fff3cd; color: #8a6100; }
.pb-st-slip_uploaded { background: #dbe8ff; color: #1e4fd6; }
.pb-st-paid { background: #d7f5e3; color: #178048; }
.pb-summary { text-align: left; background: #f7f8fa; border-radius: 12px; padding: 14px 16px; margin-bottom: 18px; }
.pb-sum-title { font-weight: 700; font-size: 14px; margin-bottom: 8px; color: #333; }
.pb-sum-row { display: flex; justify-content: space-between; gap: 10px; font-size: 14px; padding: 4px 0; color: #444; }
.pb-sum-qty { color: #999; font-size: 12.5px; }
.pb-sum-amt { white-space: nowrap; }
.pb-sum-total { display: flex; justify-content: space-between; align-items: baseline; margin-top: 10px; padding-top: 10px; border-top: 1px dashed #d5d8dd; font-weight: 700; font-size: 15px; }
.pb-total-num { color: #d6336c; font-size: 20px; }
.pb-paid { background: #eafaf1; border-radius: 12px; padding: 22px; color: #178048; font-weight: 600; font-size: 16px; line-height: 1.5; }
.pb-paid-ic { font-size: 44px; margin-bottom: 6px; }
.pb-review { background: #eaf1ff; color: #1e4fd6; border-radius: 10px; padding: 10px 12px; font-size: 13.5px; margin-bottom: 16px; }
.pb-review-bad { background: #fdeaea; color: #b02a37; }
.pb-scan { font-size: 14px; color: #444; margin-bottom: 12px; line-height: 1.5; }
.pb-qr { display: inline-block; padding: 12px; background: #fff; border: 2px solid #eee; border-radius: 14px; }
.pb-qr img { display: block; width: 220px; height: 220px; }
.pb-qr-name { font-size: 13px; color: #666; margin-top: 8px; }
.pb-noqr { background: #fdeaea; color: #b02a37; border-radius: 10px; padding: 14px; font-size: 13.5px; margin: 10px 0; }
.pb-upload { display: block; margin: 18px 0 8px; padding: 14px; background: #28a745; color: #fff; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer; transition: .2s; }
.pb-upload:hover { background: #218838; }
.pb-slip-preview { margin-top: 12px; }
.pb-slip-preview img { max-width: 100%; border-radius: 10px; border: 1px solid #e3e3e3; }
.pb-note { font-size: 12px; color: #888; margin-top: 10px; }
</style>
