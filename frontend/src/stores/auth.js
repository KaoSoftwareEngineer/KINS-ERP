// ============================================================================
//  stores/auth.js — แหล่งความจริงเดียว (single source of truth) ของ
//  ผู้ใช้ที่ล็อกอิน + token + บทบาท/สิทธิ์การเข้าถึง
//  แยกออกจาก Dashboard.vue เพื่อให้ดูแลง่ายและ reuse ได้ทุก component
// ============================================================================
import { defineStore } from 'pinia';

const API = '';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    currentUser: JSON.parse(localStorage.getItem('currentUser') || '{}'),
    rolePerms: JSON.parse(localStorage.getItem('rolePerms') || '{}'), // ชื่อบทบาท -> [keys]
  }),

  getters: {
    // สิทธิ์เมนูของผู้ใช้ปัจจุบัน (null = ไม่จำกัด/เห็นทุกเมนู)
    myAllowedKeys(state) {
      const role = (state.currentUser && state.currentUser.role) || '';
      if (!role) return null;
      const keys = state.rolePerms[role];
      if (!keys || keys.length === 0) return null;
      return new Set(keys);
    },
  },

  actions: {
    // โหลดค่าจาก localStorage ใหม่ (เรียกหลัง login เพราะ store สร้างก่อน login)
    hydrate() {
      this.token = localStorage.getItem('token') || null;
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      this.rolePerms = JSON.parse(localStorage.getItem('rolePerms') || '{}');
    },
    setToken(t) {
      this.token = t;
      if (t) localStorage.setItem('token', t); else localStorage.removeItem('token');
    },
    setCurrentUser(u) {
      this.currentUser = u;
      localStorage.setItem('currentUser', JSON.stringify(u));
    },

    // ---- ตรวจสิทธิ์เข้าถึงหน้า/เมนู ----
    canAccess(key) {
      const allowed = this.myAllowedKeys;
      if (allowed === null) return true;
      if (['dashboard', 'analytics', 'settings'].includes(key)) return true;
      if (typeof key === 'string' && key.startsWith('grp.')) return true;
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
