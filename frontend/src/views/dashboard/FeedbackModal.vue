<template>
  <!-- ===== กล่องแจ้งผล: กำลังโหลด / สำเร็จ / ผิดพลาด ===== -->
  <transition name="fb-fade">
    <div v-if="fb.show" class="fb-overlay" @click.self="fb.type==='loading' ? null : hide()">
      <div class="fb-card" :class="'fb-'+fb.type">
        <!-- หมุนโหลด -->
        <div v-if="fb.type==='loading'" class="fb-spinner"></div>
        <!-- ติ๊กถูก (สำเร็จ) -->
        <svg v-else-if="fb.type==='success'" class="fb-icon fb-check" viewBox="0 0 52 52">
          <circle class="fb-check-circle" cx="26" cy="26" r="24" fill="none"/>
          <path class="fb-check-mark" fill="none" d="M14 27 l8 8 l16 -18"/>
        </svg>
        <!-- กากบาท (ผิดพลาด) -->
        <svg v-else-if="fb.type==='error'" class="fb-icon fb-cross" viewBox="0 0 52 52">
          <circle class="fb-cross-circle" cx="26" cy="26" r="24" fill="none"/>
          <path class="fb-cross-mark" fill="none" d="M17 17 l18 18 M35 17 l-18 18"/>
        </svg>
        <div class="fb-text">{{ fb.text }}</div>
      </div>
    </div>
  </transition>

  <!-- ===== กล่องยืนยัน (แทน confirm) ===== -->
  <transition name="fb-fade">
    <div v-if="ask.show" class="fb-overlay" @click.self="answer(false)">
      <div class="fb-card fb-confirm">
        <div class="fb-confirm-icon" :class="ask.danger ? 'fb-danger' : ''">
          <span v-if="ask.danger">🗑️</span><span v-else>❓</span>
        </div>
        <div class="fb-confirm-title">{{ ask.title }}</div>
        <div class="fb-confirm-msg" v-if="ask.message">{{ ask.message }}</div>
        <div class="fb-confirm-actions">
          <button class="fb-btn fb-btn-cancel" @click="answer(false)">{{ ask.cancelText }}</button>
          <button class="fb-btn" :class="ask.danger ? 'fb-btn-danger' : 'fb-btn-ok'" @click="answer(true)">{{ ask.okText }}</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'FeedbackModal',
  inject: ['dash'],
  computed: {
    fb() { return this.dash.fb; },
    ask() { return this.dash.fbAskState; },
  },
  methods: {
    hide() { this.dash.fbHide(); },
    answer(v) { this.dash.fbAnswer(v); },
  },
};
</script>

<style scoped>
.fb-overlay {
  position: fixed; inset: 0; z-index: 4000;
  display: flex; align-items: center; justify-content: center;
  background: rgba(15, 23, 42, 0.45);
  font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif;
}
.fb-card {
  background: var(--surface); border-radius: 16px;
  padding: 30px 34px; min-width: 240px; max-width: 90vw;
  box-shadow: 0 18px 50px rgba(0,0,0,0.25);
  display: flex; flex-direction: column; align-items: center; gap: 16px;
  text-align: center;
}
.fb-text { font-size: 12.5px; font-weight: 600; color: #1e293b; }

/* ---- สปินเนอร์ ---- */
.fb-spinner {
  width: 52px; height: 52px; border-radius: 50%;
  border: 5px solid #e2e8f0; border-top-color: #1e3a8a;
  animation: fb-spin 0.8s linear infinite;
}
@keyframes fb-spin { to { transform: rotate(360deg); } }

/* ---- ไอคอนติ๊ก/กากบาท ---- */
.fb-icon { width: 62px; height: 62px; }
.fb-check-circle {
  stroke: #1a9c54; stroke-width: 3;
  stroke-dasharray: 151; stroke-dashoffset: 151;
  animation: fb-draw 0.45s ease-out forwards;
}
.fb-check-mark {
  stroke: #1a9c54; stroke-width: 4; stroke-linecap: round; stroke-linejoin: round;
  stroke-dasharray: 48; stroke-dashoffset: 48;
  animation: fb-draw 0.35s 0.35s ease-out forwards;
}
.fb-cross-circle {
  stroke: #a82a3a; stroke-width: 3;
  stroke-dasharray: 151; stroke-dashoffset: 151;
  animation: fb-draw 0.45s ease-out forwards;
}
.fb-cross-mark {
  stroke: #a82a3a; stroke-width: 4; stroke-linecap: round;
  stroke-dasharray: 52; stroke-dashoffset: 52;
  animation: fb-draw 0.35s 0.35s ease-out forwards;
}
@keyframes fb-draw { to { stroke-dashoffset: 0; } }

/* ---- กล่องยืนยัน ---- */
.fb-confirm { padding: 26px 30px; gap: 12px; max-width: 360px; }
.fb-confirm-icon { font-size: 40px; line-height: 1; }
.fb-confirm-title { font-size: 14px; font-weight: 700; color: #1e293b; }
.fb-confirm-msg { font-size: 12px; color: #64748b; line-height: 1.5; }
.fb-confirm-actions { display: flex; gap: 12px; margin-top: 8px; width: 100%; }
.fb-btn {
  flex: 1; padding: 7px 12px; border: none; border-radius: 9px;
  font-size: 12.5px; font-weight: 700; cursor: pointer;
  font-family: inherit; transition: background 0.15s;
}
.fb-btn-cancel { background: #e2e8f0; color: #334155; }
.fb-btn-cancel:hover { background: #cbd5e1; }
.fb-btn-ok { background: #1e3a8a; color: #fff; }
.fb-btn-ok:hover { background: #172b6b; }
.fb-btn-danger { background: #a82a3a; color: #fff; }
.fb-btn-danger:hover { background: #8a1c2b; }

/* ---- transition ---- */
.fb-fade-enter-active, .fb-fade-leave-active { transition: opacity 0.2s; }
.fb-fade-enter-from, .fb-fade-leave-to { opacity: 0; }

/* ---- โหมดมืด ---- */
:global([data-theme="dark"]) .fb-card,
:global(.dark) .fb-card { background: #1e293b; }
:global([data-theme="dark"]) .fb-text,
:global([data-theme="dark"]) .fb-confirm-title { color: #ececee; }
:global([data-theme="dark"]) .fb-btn-cancel { background: #2c2c31; color: #d8d8dc; }
</style>
