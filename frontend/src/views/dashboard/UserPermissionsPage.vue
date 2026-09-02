<template>
<div class="fr-page-compact">
  <div class="header flex-wrap">
    <div>
      <h1>🔐 {{ dash.pageTitle('user-permissions') }}</h1>
    </div>
    <div class="header-actions">
      <button class="btn-small" @click="dash.genExportExcel(false)">⬇️ {{ dash.t[dash.lang].exportExcelPlain }}</button>
      <button class="btn-small fr-btn-add" @click="dash.pmOpen()">+ {{ dash.t[dash.lang].addRole }}</button>
    </div>
  </div>

  <!-- ===== ส่วนที่ 1: บทบาทและสิทธิ์ (การ์ดเดียวครอบหัวข้อ+ตาราง+แบ่งหน้า) ===== -->
  <div class="section perm-card" style="margin-top: 14px;">
    <div class="section-header">
      <h2>📋 {{ dash.t[dash.lang].totalItems }} {{ dash.genCurrentTable.rows.length }} {{ dash.t[dash.lang].rolesUnit }}</h2>
      <div class="fr-summary-actions">
        <button v-if="dash.genSelected.length > 0" class="btn-small" style="color: var(--danger); border-color: var(--danger);" @click="dash.genBulkDeleteRows">🗑️ {{ dash.t[dash.lang].deleteSelected }} ({{ dash.genSelected.length }})</button>
      </div>
    </div>

    <div class="perm-table-wrap">
      <table class="fr-table">
        <thead>
          <tr>
            <th class="fr-th-check" style="width:44px;"><input type="checkbox" :checked="dash.genAllSelectedOnPage" @change="dash.genToggleSelectAll" /></th>
            <th v-for="(col, cidx) in dash.genCurrentTable.columns" :key="col" class="fr-th-sort" @click="dash.genSort(cidx)">
              {{ col }} <span class="fr-sort-icon">{{ dash.genSortCol === cidx ? (dash.genSortDir === 'asc' ? '▲' : '▼') : '⇅' }}</span>
            </th>
            <th style="width:90px;">{{ dash.t[dash.lang].manageWord }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, ridx) in dash.genPagedRows" :key="ridx">
            <td><input type="checkbox" :checked="dash.genSelected.includes(row)" @change="dash.genToggleSelectRow(row)" /></td>
            <td v-for="(cell, cidx) in row" :key="cidx">{{ cell }}</td>
            <td>
              <div class="fr-action-group">
                <button class="fr-action-btn edit" :title="dash.t[dash.lang].editRolePermissionTitle" @click="dash.pmEditRole(row)"><svg viewBox="0 0 24 24"></svg></button>
              </div>
            </td>
          </tr>
          <tr v-if="dash.genCurrentTable.rows.length === 0" class="fr-empty-row">
            <td :colspan="dash.genCurrentTable.columns.length + 2" style="text-align:center; padding:24px; color:#94a3b8;">{{ dash.t[dash.lang].noRolesYetMsg }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="xl-pagination" v-if="dash.genCurrentTable.rows.length > 0" style="margin-top: 14px;">
      <select v-model.number="dash.genPageSize" class="fr-page-size-select">
        <option :value="10">10 {{ dash.t[dash.lang].perPageWord }}</option>
        <option :value="20">20 {{ dash.t[dash.lang].perPageWord }}</option>
        <option :value="50">50 {{ dash.t[dash.lang].perPageWord }}</option>
      </select>
      <button class="fr-btn-util" :disabled="dash.genPage === 1" @click="dash.genPrevPage">{{ dash.t[dash.lang].prevPage }}</button>
      <span>{{ dash.t[dash.lang].pageWord }} {{ dash.genPage }} / {{ dash.genTotalPages }}</span>
      <button class="fr-btn-util" :disabled="dash.genPage === dash.genTotalPages" @click="dash.genNextPage">{{ dash.t[dash.lang].nextPage }}</button>
    </div>
  </div>

  <div class="section perm-card" style="margin-top: 20px;">
    <div class="section-header">
      <h2>👥 {{ dash.t[dash.lang].accessPermissionPerAccountTitle }} — {{ accounts.length }} {{ dash.t[dash.lang].accountsUnit }}</h2>
      <input class="acct-search" v-model="acctSearch" :placeholder="dash.t[dash.lang].searchNameEmailPositionPlaceholder" />
    </div>
    <p class="acct-note">{{ dash.t[dash.lang].acctNoteMsg }}</p>

    <div class="perm-table-wrap">
      <table class="fr-table">
        <thead>
          <tr>
            <th style="width:52px;">{{ dash.lang === 'th' ? 'ที่' : 'No.' }}</th>
            <th style="min-width:200px;">{{ dash.t[dash.lang].accountLabel }}</th>
            <th style="min-width:160px;">{{ dash.t[dash.lang].positionRoleLabel }}</th>
            <th>{{ dash.t[dash.lang].menuAccessPermissionsSectionTitle }}</th>
            <th style="width:110px;">{{ dash.t[dash.lang].menuCountLabel }}</th>
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
              <span class="role-badge" :class="a.full ? 'is-admin' : (a.restricted ? 'is-restricted' : 'is-role')">{{ a.role || dash.t[dash.lang].notSetYetPlaceholder }}</span>
            </td>
            <td>
              <span v-if="a.full" class="perm-chip full">{{ dash.t[dash.lang].allMenusFullAccessLabel }}</span>
              <span v-else-if="a.restricted" class="perm-chip restricted">{{ dash.t[dash.lang].restrictedDashboardSettingsOnlyLabel }}</span>
              <template v-else>
                <span v-for="m in a.menusShown" :key="m" class="perm-chip">{{ m }}</span>
                <span v-if="a.menusExtra > 0" class="perm-chip more" :title="a.menus.join(', ')">+{{ a.menusExtra }} {{ dash.t[dash.lang].menuUnit }}</span>
              </template>
            </td>
            <td style="text-align:center;">
              <strong>{{ a.full ? dash.t[dash.lang].allWord : (a.restricted ? '2*' : a.menus.length) }}</strong>
            </td>
          </tr>
          <tr v-if="accounts.length === 0" class="fr-empty-row">
            <td colspan="5" style="text-align:center; padding:24px; color:#94a3b8;">{{ dash.t[dash.lang].noUserAccountsFoundMsg }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="acct-footnote">{{ dash.t[dash.lang].restrictedAccountFootnote }}</p>
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
          // เทียบตรงเป๊ะเหมือน stores/auth.js — ห้าม substring กันบทบาทชื่อคล้าย admin หลอกว่าเป็นเต็มสิทธิ์
          const isAdmin = role.trim() === 'ผู้ดูแลระบบ (Admin)';
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
/* การ์ดครอบทั้งส่วน (หัวข้อ + ตาราง + แบ่งหน้า) */
.perm-card { padding: 18px 20px 16px; }
.perm-card .section-header { margin-bottom: 14px; }

/* กรอบตารางในการ์ด — หัวตารางเข้มธีมผ้าประจำ + มุมโค้ง */
.perm-table-wrap {
  border: 1px solid var(--field-border);
  border-radius: 10px;
  overflow: hidden;
  overflow-x: auto;
}
.perm-table-wrap .fr-table { border: none; }
.perm-table-wrap .fr-table tbody tr:last-child td { border-bottom: none; }

.acct-search {
  padding: 7px 12px; border: 1px solid var(--field-border); border-radius: 8px;
  font-size: 12px; font-family: inherit; background: var(--surface); color: var(--text);
  min-width: 240px; outline: none;
}
.acct-search:focus { border-color: #2F65F6; box-shadow: 0 0 0 3px rgba(47,101,246,.12); }
.acct-note { font-size: 12.5px; color: var(--muted); margin: -6px 2px 14px; line-height: 1.5; }
.acct-footnote { font-size: 11.5px; color: var(--muted); margin: 12px 2px 0; }

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
