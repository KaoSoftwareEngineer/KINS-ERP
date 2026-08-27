<template>
  <div class="toast-host">
    <transition-group name="toast">
      <div v-for="t in ui.toasts" :key="t.id" class="toast" :class="'toast-' + t.type" @click="ui.dismissToast(t.id)">
        <span class="toast-ic">
          <svg v-if="t.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          <svg v-else-if="t.type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          <svg v-else-if="t.type === 'warn'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
        </span>
        <div class="toast-body">
          <div v-if="t.title" class="toast-title">{{ t.title }}</div>
          <div class="toast-text">{{ t.text }}</div>
        </div>
        <span class="toast-bar"></span>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'ToastHost',
  inject: ['dash'],
  computed: {
    ui() { return this.dash.ui; },
  },
};
</script>

<style scoped>
.toast-host {
  position: fixed; top: 20px; right: 20px; z-index: 4000;
  display: flex; flex-direction: column; gap: 12px;
  pointer-events: none;
  font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif;
}
.toast {
  pointer-events: auto; cursor: pointer;
  position: relative; overflow: hidden;
  display: flex; align-items: flex-start; gap: 12px;
  min-width: 300px; max-width: 380px;
  padding: 9px 13px 14px 14px;
  background: var(--surface); color: var(--text);
  border: 1px solid var(--field-border);
  border-left: 4px solid var(--tc);
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.18);
}
.toast-success { --tc: #17a06a; }
.toast-error   { --tc: #e5484d; }
.toast-warn    { --tc: #f59e0b; }
.toast-info    { --tc: #2f65f6; }

/* ---- Success: เขียวทั้งใบ + ตัวหนังสือขาว + เส้นขาววิ่งรอบขอบ ---- */
@property --toast-ang { syntax: '<angle>'; inherits: false; initial-value: 0deg; }

.toast-success {
  background: linear-gradient(180deg, #1a9c54 0%, #158045 100%);   /* เขียวเดียวกับปุ่มส่งออก Excel */
  color: #fff;
  border-color: transparent; border-left-width: 1px;
}
.toast-success .toast-ic { background: rgba(255, 255, 255, .22); color: #fff; }
.toast-success .toast-title { color: #fff; }
.toast-success .toast-text,
.toast-success .toast-title + .toast-text,
.toast-success .toast-body:not(:has(.toast-title)) .toast-text { color: rgba(255, 255, 255, .92); }
.toast-success .toast-bar { display: none; }   /* ซ่อนแถบล่างเดิม ใช้เส้นวิ่งรอบขอบแทน */

.toast-success::after {
  content: ''; position: absolute; inset: 0; border-radius: inherit;
  padding: 2px; pointer-events: none;
  background: conic-gradient(from var(--toast-ang),
              transparent 0 60%, rgba(255,255,255,.35) 74%, #fff 86%, rgba(255,255,255,.35) 92%, transparent 100%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  animation: toast-run 1.9s linear infinite;
}
@keyframes toast-run { to { --toast-ang: 360deg; } }
@media (prefers-reduced-motion: reduce) { .toast-success::after { animation: none; } }

.toast-ic {
  flex-shrink: 0; width: 30px; height: 30px; border-radius: 50%;
  display: grid; place-items: center;
  background: color-mix(in srgb, var(--tc) 16%, transparent);
  color: var(--tc);
}
.toast-ic svg { width: 17px; height: 17px; }

.toast-body { flex: 1; min-width: 0; padding-top: 2px; }
.toast-title { font-size: 12px; font-weight: 700; margin-bottom: 2px; }
.toast-text { font-size: 12px; line-height: 1.45; color: var(--muted); }
.toast-title + .toast-text { color: var(--muted); }
.toast-body:not(:has(.toast-title)) .toast-text { color: var(--text); font-weight: 600; }

/* แถบเวลานับถอยหลัง (เดินจากซ้ายไปขวา) */
.toast-bar {
  position: absolute; left: 0; bottom: 0; height: 3px; width: 100%;
  background: var(--tc); opacity: .8;
  transform-origin: left center;
  animation: toast-countdown 3.4s linear forwards;
}
@keyframes toast-countdown { from { transform: scaleX(1); } to { transform: scaleX(0); } }

/* แอนิเมชันเข้า/ออก (เลื่อนจากขวา) */
.toast-enter-active { transition: transform .35s cubic-bezier(.21,1.02,.55,1), opacity .35s; }
.toast-leave-active { transition: transform .3s ease, opacity .3s ease; position: absolute; right: 0; }
.toast-enter-from { transform: translateX(120%); opacity: 0; }
.toast-leave-to { transform: translateX(120%); opacity: 0; }
.toast-move { transition: transform .3s ease; }

@media (max-width: 560px) {
  .toast-host { top: 12px; right: 12px; left: 12px; }
  .toast { min-width: 0; max-width: none; width: 100%; }
}
</style>
