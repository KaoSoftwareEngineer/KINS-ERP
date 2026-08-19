<template>
<div class="fr-page-compact">
  <div class="header flex-wrap">
    <div>
      <h1>🔐 {{ dash.pageTitle('user-permissions') }}</h1>
    </div>
    <div class="header-actions">
      <button class="btn-small fr-btn-search">{{ dash.t[dash.lang].search }}</button>
      <button class="btn-small fr-btn-add" @click="dash.pmOpen()">{{ dash.t[dash.lang].addRole }}</button>
    </div>
  </div>

  <!-- ===== ส่วนที่ 1: บทบาทและสิทธิ์ (ตั้งค่าได้) ===== -->
  <div class="section" style="margin-top: 24px;">
    <div class="section-header">
      <h2>{{ dash.t[dash.lang].totalItems }} {{ dash.genCurrentTable.rows.length }} {{ dash.t[dash.lang].rolesUnit }}</h2>
      <div class="fr-summary-actions">
        <button v-if="dash.genSelected.length > 0" class="btn-small" style="color: var(--danger); border-color: var(--danger);" @click="dash.genBulkDeleteRows">🗑️ ลบที่เลือก ({{ dash.genSelected.length }})</button>
        <button v-if="dash.genSelected.length > 0" class="btn-small" @click="dash.genExportExcel(true)">⬇️ ส่งออกที่เลือก</button>
        <button class="btn-small" @click="dash.genExportExcel(false)">{{ dash.t[dash.lang].export }}</button>
      </div>
    </div>
    <div class="overflow-x-auto table-scroll-y">
    <table>
      <thead>
        <tr>
          <th class="fr-th-check"><input type="checkbox" :checked="dash.genAllSelectedOnPage" @change="dash.genToggleSelectAll" /></th>
          <th v-for="(col, cidx) in dash.genCurrentTable.columns" :key="col" class="fr-th-sort" @click="dash.genSort(cidx)">
            {{ col }} <span class="fr-sort-icon">{{ dash.genSortCol === cidx ? (dash.genSortDir === 'asc' ? '▲' : '▼') : '' }}</span>
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, ridx) in dash.genPagedRows" :key="ridx">
          <td><input type="checkbox" :checked="dash.genSelected.includes(row)" @change="dash.genToggleSelectRow(row)" /></td>
          <td v-for="(cell, cidx) in row" :key="cidx">{{ cell }}</td>
          <td><button class="btn-small" @click="dash.pmEditRole(row)">{{ dash.t[dash.lang].edit }}</button></td>
        </tr>
      </tbody>
    </table>
    </div>
    <div class="xl-pagination" v-if="dash.genCurrentTable.rows.length > 0">
      <select v-model.number="dash.genPageSize" class="fr-page-size-select">
        <option :value="10">10 / หน้า</option>
        <option :value="20">20 / หน้า</option>
        <option :value="50">50 / หน้า</option>
      </select>
      <button class="fr-btn-util" :disabled="dash.genPage === 1" @click="dash.genPrevPage">‹ ก่อนหน้า</button>
      <span>หน้า {{ dash.genPage }} / {{ dash.genTotalPages }}</span>
      <button class="fr-btn-util" :disabled="dash.genPage === dash.genTotalPages" @click="dash.genNextPage">ถัดไป ›</button>
    </div>
  </div>

  <!-- ===== ส่วนที่ 2: สิทธิ์การเข้าถึงต่อบัญชี (ทุกบัญชีผู้ใช้) ===== -->
  <div class="section" style="margin-top: 24px;">
    <div class="section-header">
      <h2>👥 สิทธิ์การเข้าถึงต่อบัญชี — {{ accounts.length }} บัญชี</h2>
      <input class="acct-search" v-model="acctSearch" placeholder="ค้นหาชื่อ / อีเมล / ตำแหน่ง" />
    </div>
    <p class="acct-note">สิทธิ์ของแต่ละบัญชีมาจาก "บทบาท/ตำแหน่ง" ที่กำหนดไว้ — ปรับสิทธิ์ได้ที่ตารางบทบาทด้านบน หรือเปลี่ยนตำแหน่งบัญชีที่หน้า "บัญชีผู้ใช้งาน"</p>
    <div class="overflow-x-auto table-scroll-y">
    <table>
      <thead>
        <tr>
          <th style="width:52px;">#</th>
          <th style="min-width:200px;">บัญชี</th>
          <th style="min-width:160px;">ตำแหน่ง / บทบาท</th>
          <th>สิทธิ์การเข้าถึงเมนู</th>
          <th style="width:110px;">จำนวนเมนู</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(a, i) in accounts" :key="a.id">
          <td>{{ i + 1 }}</td>
          <td>
            <div class="acct-name">{{ a.name || '-' }}</div>
            <div class="acct-email">{{ a.email }}</div>
          </td>
          <td>
            <span class="role-badge" :class="a.full ? 'is-admin' : (a.restricted ? 'is-restricted' : 'is-role')">{{ a.role || '— ยังไม่กำหนด —' }}</span>
          </td>
          <td>
            <span v-if="a.full" class="perm-chip full">✓ ทุกเมนู (เต็มสิทธิ์)</span>
            <span v-else-if="a.restricted" class="perm-chip restricted">จำกัด — แดชบอร์ด, ตั้งค่า เท่านั้น</span>
            <template v-else>
              <span v-for="m in a.menusShown" :key="m" class="perm-chip">{{ m }}</span>
              <span v-if="a.menusExtra > 0" class="perm-chip more" :title="a.menus.join(', ')">+{{ a.menusExtra }} เมนู</span>
            </template>
          </td>
          <td>
            <strong>{{ a.full ? 'ทั้งหมด' : (a.restricted ? '2*' : a.menus.length) }}</strong>
          </td>
        </tr>
        <tr v-if="accounts.length === 0" class="fr-empty-row">
          <td colspan="5" style="text-align:center; padding:24px; color:#94a3b8;">ไม่พบบัญชีผู้ใช้</td>
        </tr>
      </tbody>
    </table>
    </div>
    <p class="acct-footnote">* บัญชีที่ถูกจำกัดยังเข้าถึง "แดชบอร์ด" และ "ตั้งค่า" ได้เสมอ (เมนูพื้นฐาน)</p>
  </div>
</div>
</template>

<script>
import { PERM_ACCESS } from './permissionSchema.js';

// สร้าง map: key เมนู -> ชื่อไทย (จาก leaf ทั้งหมดของ schema)
const LABEL_MAP = (() => {
  const map = {};
  const walk = (nodes) => nodes.forEach(n => {
    if (n.children && n.children.length) walk(n.children);
    else map[n.key] = n.label;
  });
  walk(PERM_ACCESS);
  return map;
})();

const MAX_CHIPS = 10;

export default {
  name: 'UserPermissionsPage',
  inject: ['dash'],
  data() {
    return { acctSearch: '' };
  },
  computed: {
    accounts() {
      const members = this.dash.members || [];
      const rolePerms = this.dash.rolePerms || {};
      const q = this.acctSearch.trim().toLowerCase();
      return members
        .map(u => {
          const role = u.role || '';
          const r = role.toLowerCase();
          const isAdmin = r.includes('admin') || r.includes('ผู้ดูแล');
          let full = false, restricted = false, menus = [];
          if (isAdmin) {
            full = true;
          } else {
            const keys = rolePerms[role] || [];
            menus = keys.filter(k => LABEL_MAP[k]).map(k => LABEL_MAP[k]);
            if (!role || menus.length === 0) restricted = true;
          }
          return {
            id: u.id, name: u.name, email: u.email, role, full, restricted, menus,
            menusShown: menus.slice(0, MAX_CHIPS),
            menusExtra: Math.max(0, menus.length - MAX_CHIPS),
          };
        })
        .filter(a => {
          if (!q) return true;
          return (a.name || '').toLowerCase().includes(q)
            || (a.email || '').toLowerCase().includes(q)
            || (a.role || '').toLowerCase().includes(q);
        });
    },
  },
};
</script>

<style scoped>
.acct-search {
  padding: 7px 12px; border: 1px solid var(--field-border); border-radius: 8px;
  font-size: 13px; font-family: inherit; background: var(--surface); color: var(--text);
  min-width: 240px; outline: none;
}
.acct-search:focus { border-color: #2F65F6; box-shadow: 0 0 0 3px rgba(47,101,246,.12); }
.acct-note { font-size: 12.5px; color: var(--muted); margin: 2px 2px 14px; line-height: 1.5; }
.acct-footnote { font-size: 11.5px; color: var(--muted); margin: 10px 2px 0; }

.acct-name { font-weight: 600; color: var(--text); }
.acct-email { font-size: 12px; color: var(--muted); margin-top: 2px; }

.role-badge {
  display: inline-block; padding: 3px 10px; border-radius: 20px;
  font-size: 12.5px; font-weight: 600; white-space: nowrap;
}
.role-badge.is-admin { background: rgba(124,58,237,.12); color: #7c3aed; }
.role-badge.is-role { background: rgba(47,101,246,.1); color: #2F65F6; }
.role-badge.is-restricted { background: rgba(148,163,184,.18); color: #64748b; }

.perm-chip {
  display: inline-block; margin: 2px 4px 2px 0; padding: 3px 9px;
  border-radius: 6px; font-size: 12px; font-weight: 500;
  background: var(--field); color: var(--text); border: 1px solid var(--field-border);
}
.perm-chip.full { background: rgba(23,160,106,.12); color: #17a06a; border-color: rgba(23,160,106,.3); font-weight: 600; }
.perm-chip.restricted { background: rgba(245,158,11,.12); color: #b45309; border-color: rgba(245,158,11,.3); font-weight: 600; }
.perm-chip.more { background: rgba(47,101,246,.1); color: #2F65F6; border-color: rgba(47,101,246,.3); cursor: help; font-weight: 600; }
</style>
