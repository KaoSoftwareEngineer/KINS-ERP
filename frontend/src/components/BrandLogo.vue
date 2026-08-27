<script>
// โลโก้แบรนด์ Plum Flow Solution — วาดเป็น SVG ต้นฉบับ (ปุ่ม power ส้ม + ใบ)
// ใช้ซ้ำได้หลายที่ (sidebar, login, favicon) ปรับขนาด/ข้อความ/โทนอักษรได้ผ่าน props
//   compact = แบบกระชับบรรทัดเดียว "PLUM ERP" (เหมาะกับหัวเว็บ/พื้นที่แคบ)
//   ปกติ    = แบบเต็ม PLUM + FLOW SOLUTION ERP (เหมาะกับหน้า login/พื้นที่กว้าง)
let _brandUid = 0;
export default {
  name: 'BrandLogo',
  props: {
    size:        { type: [Number, String], default: 34 }, // ขนาดสัญลักษณ์ (px)
    showText:    { type: Boolean, default: true },         // แสดงตัวอักษร
    showTagline: { type: Boolean, default: true },         // แสดง FLOW SOLUTION ERP (เฉพาะแบบเต็ม)
    compact:     { type: Boolean, default: false },        // แบบกระชับ "PLUM ERP" บรรทัดเดียว
    lightText:   { type: Boolean, default: false },        // อักษรสีขาว (สำหรับพื้นมืด)
    whiteMark:   { type: Boolean, default: false },        // สัญลักษณ์สีขาว (เมื่อพื้นเป็นสีส้ม)
    textSize:    { type: [Number, String], default: 22 },  // ขนาดคำว่า PLUM (px)
  },
  data() { return { uid: 'bl' + (++_brandUid) }; },
  computed: {
    // ปกติสัญลักษณ์เป็นส้ม (เด่นบนพื้นเข้ม/ขาว); ใช้ whiteMark เฉพาะเมื่อพื้นเป็นสีส้มเอง
    markStroke() { return this.whiteMark ? '#ffffff' : 'url(#' + this.uid + '-o)'; },
    markLeaf()   { return this.whiteMark ? 'rgba(255,255,255,.92)' : 'url(#' + this.uid + '-l)'; },
  },
};
</script>

<template>
  <span class="brand-logo" :class="{ 'is-compact': compact }">
    <svg :viewBox="'0 0 120 120'" :width="size" :height="size" role="img" aria-label="Plum Flow Solution ERP">
      <defs>
        <linearGradient :id="uid + '-o'" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#FF7A29" /><stop offset="1" stop-color="#E8580F" />
        </linearGradient>
        <linearGradient :id="uid + '-l'" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stop-color="#F5A623" /><stop offset="1" stop-color="#FFD24D" />
        </linearGradient>
      </defs>
      <path d="M74.98 28.91 A40 40 0 1 1 45.02 28.91" fill="none"
            :stroke="markStroke" stroke-width="13" stroke-linecap="round" />
      <path d="M60 34 L60 67" fill="none"
            :stroke="markStroke" stroke-width="12" stroke-linecap="round" />
      <path d="M60 35 C66 18 79 12 89 15 C84 28 70 34 60 35 Z" :fill="markLeaf" />
      <path d="M60 38 C55 28 46 24 38 27 C44 35 53 39 60 38 Z" :fill="markLeaf" opacity=".92" />
    </svg>

    <!-- แบบกระชับ: PLUM ERP + Flow Solution ใต้บรรทัด -->
    <span v-if="showText && compact" class="brand-logo-wm" :class="{ 'is-light': lightText }">
      <span class="wm-line">
        <span class="wm-main" :style="{ fontSize: textSize + 'px' }">PLUM</span>
        <span class="wm-erp" :style="{ fontSize: (textSize * 0.62) + 'px' }">ERP</span>
      </span>
      <span v-if="showTagline" class="wm-sub2">Flow&nbsp;Solution</span>
    </span>

    <!-- แบบเต็ม: PLUM + FLOW SOLUTION ERP -->
    <span v-else-if="showText" class="brand-logo-wm" :class="{ 'is-light': lightText }">
      <span class="wm-main" :style="{ fontSize: textSize + 'px' }">PLUM</span>
      <span v-if="showTagline" class="wm-sub">FLOW&nbsp;SOLUTION&nbsp;ERP</span>
    </span>
  </span>
</template>

<style scoped>
.brand-logo { display: inline-flex; align-items: center; gap: 11px; }
.brand-logo.is-compact { gap: 9px; }
.brand-logo svg { display: block; flex: none; }
.brand-logo-wm { display: flex; flex-direction: column; line-height: 1; }

.wm-main {
  font-family: 'Poppins', 'Segoe UI', system-ui, sans-serif;
  font-weight: 700; color: #E8580F; letter-spacing: .01em;
}
.brand-logo-wm.is-light .wm-main { color: #fff; }

/* แบบกระชับ: PLUM + ERP บรรทัดเดียว + Flow Solution ใต้ */
.wm-line { display: inline-flex; align-items: baseline; gap: 6px; white-space: nowrap; }
.wm-erp {
  font-family: 'Poppins', 'Segoe UI', system-ui, sans-serif;
  font-weight: 600; letter-spacing: .04em; color: var(--text, #241C22);
}
.brand-logo-wm.is-light .wm-erp { color: rgba(255,255,255,.9); }
.wm-sub2 {
  font-family: 'Poppins', 'Segoe UI', system-ui, sans-serif;
  font-weight: 600; letter-spacing: .12em; font-size: 8.5px;
  color: var(--text, #241C22); opacity: .78; margin-top: 3px; white-space: nowrap;
}
.brand-logo-wm.is-light .wm-sub2 { color: rgba(255,255,255,.82); opacity: 1; }

/* แบบเต็ม: บรรทัดรอง FLOW SOLUTION ERP */
.wm-sub {
  font-family: 'Poppins', 'Segoe UI', system-ui, sans-serif;
  font-weight: 600; letter-spacing: .22em; font-size: 9.5px;
  color: var(--text, #241C22); margin-top: 5px; padding-left: 2px; white-space: nowrap;
}
.brand-logo-wm.is-light .wm-sub { color: rgba(255,255,255,.82); }
</style>
