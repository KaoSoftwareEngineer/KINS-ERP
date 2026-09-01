// ============================================================================
//  stores/auth.js — แหล่งความจริงเดียว (single source of truth) ของ
//  ผู้ใช้ที่ล็อกอิน + token + บทบาท/สิทธิ์การเข้าถึง
//  แยกออกจาก Dashboard.vue เพื่อให้ดูแลง่ายและ reuse ได้ทุก component
// ============================================================================
import { defineStore } from 'pinia';
import router from '../router/index.js';

const API = '';

export const useAuthStore = defineStore('auth', {
  // ⚠️ token ไม่เก็บลง localStorage อีกต่อไป (2026-09-01) — เซสชันจริงอยู่ใน httpOnly cookie
  //    ที่ JavaScript อ่านไม่ได้ (กัน XSS ขโมย token ไปสวมรอย) ตัวแปร token ด้านล่างเก็บไว้ใน
  //    หน่วยความจำเฉยๆ เพื่อความเข้ากันได้กับโค้ดเดิมที่ยังแนบ header Authorization
  //    → รีเฟรชหน้าแล้ว token หายเป็นเรื่องปกติ เซสชันยังอยู่เพราะ cookie (ดู restoreSession)
  state: () => ({
    token: null,
    currentUser: JSON.parse(localStorage.getItem('currentUser') || '{}'),
    rolePerms: JSON.parse(localStorage.getItem('rolePerms') || '{}'), // ชื่อบทบาท -> [keys]
  }),

  getters: {
    // สิทธิ์เมนูของผู้ใช้ปัจจุบัน (null = ไม่จำกัด/เห็นทุกเมนู)
    myAllowedKeys(state) {
      const role = (state.currentUser && state.currentUser.role) || '';
      // ไม่มีบทบาท = จำกัด (เห็นแค่แดชบอร์ด/ตั้งค่า) — ไม่ให้สิทธิ์เต็มโดยปริยาย
      if (!role) return new Set();
      // เฉพาะ "ผู้ดูแลระบบ (Admin)" เท่านั้นที่เต็มสิทธิ์แบบตายตัว
      // บทบาทอื่น (รวม CEO/ผู้บริหาร) ต้องตั้งสิทธิ์เองในหน้า "สิทธิ์การเข้าใช้งาน"
      const r = role.toLowerCase();
      if (r.includes('admin') || r.includes('ผู้ดูแล')) return null;
      const keys = state.rolePerms[role];
      // ยังไม่ได้ตั้งสิทธิ์บทบาทนี้ = จำกัด (ไม่ใช่เต็มสิทธิ์) / ตั้งเป็น [] = ไม่มีสิทธิ์เมนูใดเลย
      if (!keys) return new Set();
      return new Set(keys);
    },
  },

  actions: {
    // โหลดค่าที่ยัง cache ไว้ (ผู้ใช้/สิทธิ์) — token ไม่ได้อยู่ใน localStorage แล้ว
    hydrate() {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      this.rolePerms = JSON.parse(localStorage.getItem('rolePerms') || '{}');
    },
    setToken(t) {
      this.token = t || null;   // อยู่ในหน่วยความจำเท่านั้น (เซสชันจริง = httpOnly cookie)
    },
    // ตรวจว่ายังมีเซสชันอยู่ไหม (ใช้ cookie) — เรียกตอนเปิด/รีเฟรชหน้า Dashboard
    // คืน true ถ้าเซสชันยังใช้ได้ (พร้อมอัปเดตข้อมูลผู้ใช้ล่าสุด)
    async restoreSession() {
      try {
        const res = await fetch(API + '/api/me', { credentials: 'same-origin' });
        if (!res.ok) return false;
        const data = await res.json();
        if (data.ok && data.user) { this.setCurrentUser(data.user); return true; }
        return false;
      } catch (e) {
        return false;
      }
    },
    setCurrentUser(u) {
      this.currentUser = u;
      localStorage.setItem('currentUser', JSON.stringify(u));
    },
    // เซสชันหมดอายุ (401 จากเซิร์ฟเวอร์) — เคลียร์ token + เด้งไปหน้าล็อกอิน
    sessionExpired() {
      this.setToken(null);
      this.setCurrentUser({});
      // ฝากข้อความไว้ให้หน้า Login แสดง (แทน alert ที่บล็อกจอ)
      try { sessionStorage.setItem('sessionExpiredMsg', '1'); } catch (e) {}
      if (router.currentRoute.value.name !== 'login') router.push('/login');
    },

    // ---- ตรวจสิทธิ์เข้าถึงหน้า/เมนู ----
    canAccess(key) {
      const allowed = this.myAllowedKeys;
      if (allowed === null) return true;
      if (['dashboard', 'analytics', 'settings'].includes(key)) return true;
      if (typeof key === 'string' && key.startsWith('grp.')) return true;
      // หน้าย่อยใช้สิทธิ์ของหน้าแม่ (เช่น จัดออร์เดอร์ → หน้าตัดผ้า)
      const subPageParent = { 'order-fulfill-detail': 'order-fulfill' };
      if (subPageParent[key]) return allowed.has(subPageParent[key]);
      return allowed.has(key);
    },
    canAccessAny(keys) {
      return keys.some(k => this.canAccess(k));
    },
    menuGroupVisible(menuArray) {
      const keys = menuArray.flatMap(c => (c.children ? c.children.map(x => x.key) : [c.key]));
      return this.myAllowedKeys === null || this.canAccessAny(keys);
    },

    // ---- บทบาท + สิทธิ์ (MySQL) ----
    async loadRoles() {
      try {
        const res = await fetch(API + '/api/roles', { headers: { Authorization: 'Bearer ' + this.token } });
        if (res.status === 401) return;
        const data = await res.json();
        if (data.ok) {
          this.rolePerms = data.roles || {};
          localStorage.setItem('rolePerms', JSON.stringify(this.rolePerms));
        }
      } catch (e) { /* ใช้ค่า localStorage ต่อไป */ }
    },
    // บันทึกบทบาท (upsert) — คืน { status, data }
    async saveRole(name, keys, oldName = null) {
      if (oldName && oldName !== name) {
        await fetch(API + `/api/roles/${encodeURIComponent(oldName)}`, {
          method: 'DELETE', headers: { Authorization: 'Bearer ' + this.token },
        });
        delete this.rolePerms[oldName];
      }
      const res = await fetch(API + `/api/roles/${encodeURIComponent(name)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.token },
        body: JSON.stringify({ permissions: keys }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.ok) {
        this.rolePerms[name] = keys;
        localStorage.setItem('rolePerms', JSON.stringify(this.rolePerms));
      }
      return { status: res.status, data };
    },
  },
});
