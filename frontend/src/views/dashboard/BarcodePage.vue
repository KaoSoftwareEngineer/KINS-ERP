<template>
<div class="bc-page">
  <div class="bc-titlebar">🏷️ บาร์โค้ด — ตรวจสอบข้อมูลผ้า</div>

  <!-- ส่วนสแกน -->
  <div class="bc-scan">
    <div class="bc-scan-field">
      <label>สแกน / พิมพ์บาร์โค้ด</label>
      <div class="bc-scan-input">
        <span class="bc-scan-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5v14M7 5v14M11 5v14M14 5v14M18 5v14M21 5v14"/></svg>
        </span>
        <input ref="scanInput" v-model="qr" placeholder="ยิง QR ม้วนผ้า แล้วกด Enter" @keyup.enter="lookup" />
        <button class="bc-scan-btn" @click="lookup">ค้นหา</button>
      </div>
    </div>
    <div class="bc-print-field" v-if="roll">
      <label>พิมพ์บาร์โค้ด</label>
      <div class="bc-print-row">
        <select v-model.number="printCount"><option v-for="n in 10" :key="n" :value="n">{{ n }}</option></select>
        <button class="bc-print-btn" @click="printBarcode">🖨️ พิมพ์</button>
      </div>
    </div>
  </div>

  <!-- ผลลัพธ์ -->
  <div class="bc-body">
    <!-- ยังไม่สแกน -->
    <div v-if="!roll && !notFound" class="bc-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8v8M10 8v8M14 8v8M17 8v8"/></svg>
      <p>ยิงบาร์โค้ดม้วนผ้าเพื่อดูข้อมูล</p>
    </div>

    <!-- ไม่พบ -->
    <div v-else-if="notFound" class="bc-notfound">
      <span>✕</span>
      <p>ไม่พบม้วนผ้ารหัส <b>{{ lastQr }}</b></p>
      <small>ตรวจสอบว่าม้วนนี้รับเข้าระบบแล้วหรือยัง</small>
    </div>

    <!-- พบข้อมูล -->
    <div v-else class="bc-result">
      <!-- ซ้าย: รูป + รหัส -->
      <div class="bc-card bc-card-main">
        <div class="bc-image">
          <img v-if="roll.product_image && imgOk" :src="imgSrc" alt="รูปผ้า" @error="imgOk = false" />
          <div v-else class="bc-image-ph">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
            <span>ไม่มีรูป</span>
          </div>
        </div>
        <div class="bc-main-info">
          <div class="bc-sku">{{ roll.product_sku || '-' }}</div>
          <div class="bc-name">{{ roll.product_name || '' }}</div>
          <div class="bc-color" v-if="roll.color_name"><span class="bc-color-dot"></span>{{ roll.color_name }}</div>
          <span class="bc-status" :class="'bc-status-' + roll.status">{{ statusLabel(roll.status) }}</span>
        </div>
      </div>

      <!-- ขวา: ข้อมูลรายละเอียด -->
      <div class="bc-card">
        <div class="bc-card-title">ข้อมูลผ้า</div>
        <div class="bc-grid">
          <div class="bc-item"><span class="bc-lbl">กลุ่มผ้า</span><span class="bc-val">{{ roll.product_type || '-' }}</span></div>
          <div class="bc-item"><span class="bc-lbl">หน้ากว้าง</span><span class="bc-val">{{ roll.product_width || '-' }}</span></div>
          <div class="bc-item"><span class="bc-lbl">น้ำหนัก</span><span class="bc-val">{{ roll.product_weight || '-' }}</span></div>
          <div class="bc-item"><span class="bc-lbl">หน่วย</span><span class="bc-val">{{ roll.product_unit || 'หลา' }}</span></div>
          <div class="bc-item"><span class="bc-lbl">เลขที่ล็อต</span><span class="bc-val">{{ roll.lot_no || '-' }}</span></div>
          <div class="bc-item"><span class="bc-lbl">บาร์โค้ด</span><span class="bc-val bc-mono">{{ roll.roll_qr_code }}</span></div>
        </div>

        <div class="bc-card-title bc-mt">ปริมาณ</div>
        <div class="bc-qty-row">
          <div class="bc-qty"><span class="bc-qty-lbl">จำนวนรับ</span><span class="bc-qty-val">{{ fmt(roll.initial_yards) }}</span><span class="bc-qty-unit">{{ roll.product_unit || 'หลา' }}</span></div>
          <div class="bc-qty bc-qty-stock"><span class="bc-qty-lbl">คงเหลือในสต็อก</span><span class="bc-qty-val">{{ fmt(roll.current_yards) }}</span><span class="bc-qty-unit">{{ roll.product_unit || 'หลา' }}</span></div>
        </div>

        <div class="bc-card-title bc-mt">ตำแหน่งจัดเก็บ</div>
        <div class="bc-loc" :class="{ 'bc-loc-empty': !roll.location_code }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <template v-if="roll.location_code">
            <div class="bc-loc-code">{{ roll.location_code }}</div>
            <div class="bc-loc-sub">โซน {{ roll.location_zone || '-' }} · แร็ค {{ roll.location_rack || '-' }}</div>
          </template>
          <div v-else class="bc-loc-none">ยังไม่ได้เก็บเข้าแร็ค — ไปที่หน้า "ย้ายชั้นสินค้า" เพื่อสแกนเก็บ</div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import QRCode from 'qrcode';

export default {
  name: 'BarcodePage',
  inject: ['dash'],
  data() {
    return { qr: '', lastQr: '', roll: null, notFound: false, printCount: 1, imgOk: true };
  },
  computed: {
    imgSrc() {
      const n = this.roll && this.roll.product_image ? this.roll.product_image : '';
      if (!n) return '';
      return /^https?:\/\//.test(n) || n.startsWith('/') ? n : '/' + n;
    },
  },
  mounted() {
    this.$nextTick(() => { if (this.$refs.scanInput) this.$refs.scanInput.focus(); });
  },
  methods: {
    fmt(v) { return (Number(v) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
    statusLabel(s) {
      return { available: 'พร้อมใช้', reserved: 'จองแล้ว', in_use: 'กำลังใช้', depleted: 'หมดแล้ว', hold: 'พักไว้' }[s] || s || '-';
    },
    async lookup() {
      const q = (this.qr || '').trim();
      if (!q) return;
      this.lastQr = q;
      try {
        const res = await fetch('/api/fabric-rolls/lookup?qr=' + encodeURIComponent(q), { headers: { Authorization: 'Bearer ' + this.dash.token } });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) { this.roll = d.roll; this.notFound = false; this.imgOk = true; }
        else { this.roll = null; this.notFound = true; }
      } catch (e) { this.roll = null; this.notFound = true; }
      this.qr = '';
      this.$nextTick(() => { if (this.$refs.scanInput) this.$refs.scanInput.focus(); });
    },
    async printBarcode() {
      if (!this.roll) return;
      const r = this.roll;
      const esc = (s) => (s == null ? '' : String(s)).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
      let qrImg = '';
      try { qrImg = await QRCode.toDataURL(r.roll_qr_code, { width: 150, margin: 1 }); } catch (e) {}
      const one = `
        <div class="st">
          <div class="st-top">
            <div><span class="lbl">Code</span> <b>${esc(r.product_sku)}</b></div>
            <div><span class="lbl">color</span> ${esc(r.color_name || '-')}</div>
          </div>
          <div class="st-mid">
            <div class="st-info"><div>LOT ${esc(r.lot_no || '')}</div><div>QTY ${this.fmt(r.current_yards)} หลา.</div></div>
            <div class="st-qr"><img src="${qrImg}" /><div class="st-code">${esc(r.roll_qr_code)}</div></div>
          </div>
        </div>`;
      const stickers = Array.from({ length: this.printCount }).map(() => one).join('');
      const win = window.open('', '_blank', 'width=900,height=680');
      if (!win) { this.dash.fbFail('เบราว์เซอร์บล็อกหน้าต่างพิมพ์ — กรุณาอนุญาต popup'); return; }
      win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>บาร์โค้ด ${esc(r.roll_qr_code)}</title>
        <style>*{box-sizing:border-box}body{font-family:'Noto Sans Thai','Segoe UI',sans-serif;margin:12px}.sheet{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.st{border:1px solid #222;border-radius:8px;padding:10px 12px;page-break-inside:avoid}.st-top{border-bottom:1px solid #ddd;padding-bottom:6px;margin-bottom:8px;font-size:13px;line-height:1.5}.lbl{color:#555;font-size:11px}.st-mid{display:flex;justify-content:space-between;align-items:flex-end}.st-info{font-size:13px;line-height:1.7}.st-qr{text-align:center}.st-qr img{width:96px;height:96px;display:block}.st-code{font-family:'Courier New',monospace;font-size:11px;font-weight:700;margin-top:2px}@media print{.no-print{display:none}}</style></head><body>
        <div class="no-print" style="text-align:center;margin-bottom:10px"><button onclick="window.print()" style="padding:8px 22px;font-size:14px;cursor:pointer">🖨️ พิมพ์</button></div>
        <div class="sheet">${stickers}</div></body></html>`);
      win.document.close();
    },
  },
};
</script>

<style scoped>
.bc-page { font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif; color: var(--text); font-size: 13px; margin-top: 12px; background: var(--surface); border: 1px solid var(--field-border); border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
.bc-titlebar { font-weight: 700; padding: 18px 20px 2px; font-size: 18px; }

.bc-scan { display: flex; flex-wrap: wrap; gap: 24px; align-items: flex-end; padding: 16px 20px; border-bottom: 1px solid var(--field-border); }
.bc-scan-field { flex: 1; min-width: 280px; display: flex; flex-direction: column; gap: 6px; }
.bc-scan-field > label { font-size: 12px; color: var(--muted); font-weight: 600; }
.bc-scan-input { display: flex; align-items: center; gap: 0; border: 1px solid var(--field-border); border-radius: 10px; overflow: hidden; background: var(--field); transition: border-color .2s, box-shadow .2s; }
.bc-scan-input:focus-within { border-color: #2F65F6; box-shadow: 0 0 0 3px rgba(47,101,246,.12); background: var(--surface); }
.bc-scan-icon { display: flex; align-items: center; padding: 0 10px 0 14px; color: var(--muted); }
.bc-scan-icon svg { width: 20px; height: 20px; }
.bc-scan-input input { flex: 1; height: 46px; border: none; background: transparent; font-size: 15px; font-family: inherit; color: var(--text); outline: none; padding: 0 6px; }
.bc-scan-btn { height: 46px; padding: 0 22px; border: none; background: #1e3a8a; color: #fff; font-weight: 600; font-size: 14px; font-family: inherit; cursor: pointer; transition: background .15s; }
.bc-scan-btn:hover { background: #172b6b; }
.bc-print-field { display: flex; flex-direction: column; gap: 6px; }
.bc-print-field > label { font-size: 12px; color: var(--muted); font-weight: 600; }
.bc-print-row { display: flex; gap: 8px; }
.bc-print-row select { height: 40px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; background: var(--field); color: var(--text); font-family: inherit; }
.bc-print-btn { height: 40px; padding: 0 16px; border: 1px solid var(--field-border); border-radius: 8px; background: var(--field); color: var(--text); font-weight: 600; cursor: pointer; font-family: inherit; }
.bc-print-btn:hover { background: #e7eaf1; }

.bc-body { padding: 22px 20px; min-height: 300px; }
.bc-empty, .bc-notfound { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 60px 20px; color: var(--muted); text-align: center; }
.bc-empty svg { width: 64px; height: 64px; opacity: .35; }
.bc-empty p { font-size: 14px; }
.bc-notfound span { width: 54px; height: 54px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: #fdeaea; color: #e03131; font-size: 26px; font-weight: 700; }
.bc-notfound p { font-size: 15px; color: var(--text); }
.bc-notfound small { font-size: 12px; }

.bc-result { display: grid; grid-template-columns: 300px 1fr; gap: 18px; align-items: start; }
.bc-card { background: var(--field); border: 1px solid var(--field-border); border-radius: 14px; padding: 18px; }
.bc-card-main { display: flex; flex-direction: column; gap: 14px; align-items: center; text-align: center; }
.bc-image { width: 100%; aspect-ratio: 1/1; border-radius: 12px; overflow: hidden; background: var(--surface); border: 1px solid var(--field-border); display: flex; align-items: center; justify-content: center; }
.bc-image img { width: 100%; height: 100%; object-fit: cover; }
.bc-image-ph { display: flex; flex-direction: column; align-items: center; gap: 8px; color: var(--muted); }
.bc-image-ph svg { width: 48px; height: 48px; opacity: .4; }
.bc-image-ph span { font-size: 12px; }
.bc-main-info { display: flex; flex-direction: column; gap: 6px; align-items: center; }
.bc-sku { font-size: 22px; font-weight: 800; color: var(--text); letter-spacing: .3px; }
.bc-name { font-size: 13px; color: var(--muted); }
.bc-color { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; }
.bc-color-dot { width: 12px; height: 12px; border-radius: 50%; background: linear-gradient(135deg, #a78bfa, #60a5fa); }
.bc-status { margin-top: 4px; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; }
.bc-status-available { background: #e7f6ee; color: #158045; }
.bc-status-in_use { background: #fff2e0; color: #b45309; }
.bc-status-reserved { background: #e9f0fe; color: #1e3a8a; }
.bc-status-depleted { background: #f1f3f5; color: #868e96; }
.bc-status-hold { background: #fdeaea; color: #c92a2a; }

.bc-card-title { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 12px; }
.bc-mt { margin-top: 20px; }
.bc-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px 20px; }
.bc-item { display: flex; flex-direction: column; gap: 3px; }
.bc-lbl { font-size: 11.5px; color: var(--muted); font-weight: 600; }
.bc-val { font-size: 14px; color: var(--text); font-weight: 600; }
.bc-mono { font-family: 'Courier New', monospace; font-size: 13px; }
.bc-qty-row { display: flex; gap: 12px; }
.bc-qty { flex: 1; background: var(--surface); border: 1px solid var(--field-border); border-radius: 10px; padding: 12px 14px; display: flex; flex-direction: column; gap: 2px; }
.bc-qty-lbl { font-size: 11.5px; color: var(--muted); font-weight: 600; }
.bc-qty-val { font-size: 24px; font-weight: 800; color: var(--text); }
.bc-qty-unit { font-size: 11px; color: var(--muted); }
.bc-qty-stock { background: #e7f6ee; border-color: #1a9c54; }
.bc-qty-stock .bc-qty-val { color: #158045; }
.bc-loc { display: grid; grid-template-columns: auto 1fr; grid-template-rows: auto auto; gap: 0 12px; align-items: center; background: var(--surface); border: 1px solid var(--field-border); border-radius: 10px; padding: 14px 16px; }
.bc-loc svg { grid-row: span 2; width: 30px; height: 30px; color: #1e3a8a; }
.bc-loc-code { font-size: 18px; font-weight: 800; color: var(--text); }
.bc-loc-sub { font-size: 12px; color: var(--muted); }
.bc-loc-empty { grid-template-rows: auto; }
.bc-loc-empty svg { grid-row: span 1; color: var(--muted); opacity: .5; }
.bc-loc-none { font-size: 12.5px; color: var(--muted); }

@media (max-width: 720px) { .bc-result { grid-template-columns: 1fr; } }
</style>
