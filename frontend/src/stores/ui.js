// ============================================================================
//  stores/ui.js — กล่องแจ้งผลกลาง (spinner / ติ๊กถูก / กากบาท / กล่องยืนยัน)
//  ใช้แทน alert()/confirm() ทุกหน้า — แยกออกจาก Dashboard.vue
//  Dashboard delegate fbLoading/fbDone/... มาที่นี่ ; FeedbackModal อ่าน fb/fbAskState
// ============================================================================
import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
  state: () => ({
    fb: { show: false, type: 'loading', text: '' },
    fbTimer: null,
    fbAskState: { show: false, title: '', message: '', okText: 'ยืนยัน', cancelText: 'ยกเลิก', danger: false, resolve: null },
  }),
  actions: {
    fbLoading(text = 'กำลังบันทึก...') {
      if (this.fbTimer) { clearTimeout(this.fbTimer); this.fbTimer = null; }
      this.fb = { show: true, type: 'loading', text };
    },
    fbDone(text = 'บันทึกแล้ว') {
      if (this.fbTimer) clearTimeout(this.fbTimer);
      this.fb = { show: true, type: 'success', text };
      this.fbTimer = setTimeout(() => this.fbHide(), 1300);
    },
    fbFail(text = 'เกิดข้อผิดพลาด') {
      if (this.fbTimer) clearTimeout(this.fbTimer);
      this.fb = { show: true, type: 'error', text };
      this.fbTimer = setTimeout(() => this.fbHide(), 2200);
    },
    fbHide() {
      if (this.fbTimer) { clearTimeout(this.fbTimer); this.fbTimer = null; }
      this.fb = { ...this.fb, show: false };
    },
    // กล่องยืนยัน — คืน Promise<boolean>
    fbAsk({ title = 'ยืนยันการทำรายการ?', message = '', okText = 'ยืนยัน', cancelText = 'ยกเลิก', danger = false } = {}) {
      return new Promise((resolve) => {
        this.fbAskState = { show: true, title, message, okText, cancelText, danger, resolve };
      });
    },
    fbAskDelete(message = 'ต้องการลบรายการนี้ใช่หรือไม่?') {
      return this.fbAsk({ title: 'ยืนยันการลบ', message, okText: 'ลบข้อมูล', cancelText: 'ยกเลิก', danger: true });
    },
    fbAnswer(v) {
      const r = this.fbAskState.resolve;
      this.fbAskState = { ...this.fbAskState, show: false, resolve: null };
      if (r) r(v);
    },
  },
});
