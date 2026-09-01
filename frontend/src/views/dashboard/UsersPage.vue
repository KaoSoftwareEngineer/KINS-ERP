<template>
<div class="fr-page-compact">
  <div class="header flex-wrap">
    <h1>{{ dash.t[dash.lang].membersList }}</h1>
    <div class="header-actions">
      <span v-if="!dash.usCanManage" class="us-perm-note">{{ dash.t[dash.lang].onlyEditOwnAccountMsg }}</span>
      <button v-if="dash.usCanManage" class="btn-small fr-btn-add" @click="dash.usOpenCreate()">➕ {{ dash.t[dash.lang].addUserLabel }}</button>
    </div>
  </div>

  <div class="section" style="margin-top: 12px;">
    <div class="section-header" style="margin-bottom: 0; padding-bottom: 0; border-bottom: none;">
      <h2>👥 {{ dash.t[dash.lang].totalMembers }} {{ dash.members.length }} {{ dash.t[dash.lang].peopleUnit }}</h2>
      <button class="btn-small">{{ dash.t[dash.lang].filter }}</button>
    </div>
  </div>

  <div class="section fr-table-section" style="margin-top: 8px; padding: 0; overflow: hidden;">
    <div class="fr-table-scroll">
    <table class="fr-table">
      <thead>
        <tr>
          <th style="width:52px;">#</th>
          <th>{{ dash.t[dash.lang].completeName }}</th>
          <th>{{ dash.t[dash.lang].email }}</th>
          <th>{{ dash.t[dash.lang].phoneLabel }}</th>
          <th>{{ dash.t[dash.lang].genderLabel }}</th>
          <th>{{ dash.t[dash.lang].ageLabel }}</th>
          <th style="min-width:170px;">{{ dash.t[dash.lang].positionRoleLabel }}</th>
          <th>{{ dash.t[dash.lang].status }}</th>
          <th>{{ dash.t[dash.lang].registeredDate }}</th>
          <th style="width:90px;">{{ dash.t[dash.lang].manageWord }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, idx) in dash.members" :key="idx">
          <td>{{ idx + 1 }}</td>
          <td><strong>{{ user.name || '-' }}</strong></td>
          <td>{{ user.email }}</td>
          <td>{{ user.phone || '-' }}</td>
          <td>{{ user.gender === 'male' ? dash.t[dash.lang].maleWord : user.gender === 'female' ? dash.t[dash.lang].femaleWord : '-' }}</td>
          <td>{{ user.age || '-' }}</td>
          <td>
            <select v-if="dash.usCanManage && !isSelf(user)" class="pm-role-select" :value="user.role || ''" @change="dash.setUserRole(user, $event.target.value)">
              <option value="">{{ dash.t[dash.lang].notSetYetPlaceholder }}</option>
              <option v-for="r in dash.roleOptions()" :key="r" :value="r">{{ r }}</option>
            </select>
            <span v-else class="us-role-text">
              {{ user.role || dash.t[dash.lang].notSetYetPlaceholder }}
              <span v-if="isSelf(user)" class="us-self-tag" :title="dash.t[dash.lang].cannotChangeOwnRoleTitle">{{ dash.t[dash.lang].youTag }}</span>
            </span>
          </td>
          <td><span class="badge success">✓ {{ dash.t[dash.lang].normal }}</span></td>
          <td>{{ user.created_at }}</td>
          <td>
            <div class="fr-action-group">
              <button v-if="dash.usCanManage || isSelf(user)" class="fr-action-btn edit" :title="dash.t[dash.lang].edit" @click="dash.usOpenEdit(user)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>
              <button v-if="dash.usCanManage && !isSelf(user)" class="fr-action-btn delete" :title="dash.t[dash.lang].delete" @click="dash.usDeleteUser(user)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg></button>
              <span v-if="!dash.usCanManage && !isSelf(user)" class="us-locked" :title="dash.t[dash.lang].onlyEditOwnAccountShortTitle">🔒</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
  </div>

  <!-- โมดัลแก้ไขบัญชีผู้ใช้ (ERP มาตรฐานกลาง) -->
  <div v-if="dash.usModalShow" class="erp-overlay" @click.self="dash.usCloseModal()">
    <div class="erp-modal" style="width: 680px;">
      <div class="erp-modal-head">
        <span><span class="erp-head-ic">👤</span> {{ creatingUser ? dash.t[dash.lang].addUserLabel : dash.t[dash.lang].editUserAccountTitle }}</span>
        <button class="erp-x" @click="dash.usCloseModal()">✕</button>
      </div>
      <div class="erp-modal-body">
        <div class="erp-sec-title"><span class="erp-sec-bar"></span>{{ dash.t[dash.lang].personalInfoSectionTitle }}</div>
        <div class="erp-grid">
          <div class="erp-field erp-col-2"><label>{{ dash.t[dash.lang].fullNameLabel }}</label><input v-model="dash.usEditItem.name" :placeholder="dash.t[dash.lang].fullNameLabel" /></div>
          <div class="erp-field"><label>{{ dash.t[dash.lang].email }}</label><input type="email" v-model="dash.usEditItem.email" placeholder="email@example.com" /></div>
          <div class="erp-field"><label>{{ dash.t[dash.lang].phoneLabel }}</label><input v-model="dash.usEditItem.phone" placeholder="0812345678" /></div>
          <div class="erp-field"><label>{{ dash.t[dash.lang].genderLabel }}</label>
            <select v-model="dash.usEditItem.gender"><option value="">{{ dash.t[dash.lang].selectGenericOpt }}</option><option value="male">{{ dash.t[dash.lang].maleWord }}</option><option value="female">{{ dash.t[dash.lang].femaleWord }}</option></select>
          </div>
          <div class="erp-field"><label>{{ dash.t[dash.lang].ageLabel }}</label><input type="number" min="1" max="120" v-model="dash.usEditItem.age" :placeholder="dash.t[dash.lang].ageLabel" /></div>
        </div>
        <div class="erp-sec-title"><span class="erp-sec-bar"></span>{{ dash.t[dash.lang].permissionSecuritySectionTitle }}</div>
        <div class="erp-grid">
          <div class="erp-field"><label>{{ dash.t[dash.lang].positionRoleLabel }}
              <span v-if="editingSelf" class="us-hint">({{ dash.t[dash.lang].cannotChangeOwnRoleTitle }})</span>
              <span v-else-if="!dash.usCanManage" class="us-hint">{{ dash.t[dash.lang].execOnlyChangeHint }}</span>
            </label>
            <select v-model="dash.usEditItem.role" :disabled="!dash.usCanManage || editingSelf"><option value="">{{ dash.t[dash.lang].notSetYetPlaceholder }}</option><option v-for="r in dash.roleOptions()" :key="r" :value="r">{{ r }}</option></select>
          </div>
          <div class="erp-field">
            <label>
              {{ creatingUser ? dash.t[dash.lang].initialPasswordLabel : dash.t[dash.lang].newPasswordLabel }}
              <span class="us-hint">{{ creatingUser ? dash.t[dash.lang].passwordMinHint : dash.t[dash.lang].leaveBlankIfNoChangeHint }}</span>
            </label>
            <input type="password" v-model="dash.usEditItem.password" placeholder="••••••••" />
          </div>
        </div>
      </div>
      <div class="erp-modal-foot">
        <button class="erp-btn erp-btn-cancel" @click="dash.usCloseModal()">{{ dash.t[dash.lang].cancelWord }}</button>
        <button class="erp-btn erp-btn-save" @click="dash.usSaveUser()">{{ creatingUser ? '➕ ' + dash.t[dash.lang].addUserLabel : '💾 ' + dash.t[dash.lang].save }}</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'UsersPage',
  inject: ['dash'],
  computed: {
    editingSelf() {
      const u = this.dash.usEditItem;
      return u && this.dash.currentUser && String(u.id) === String(this.dash.currentUser.id);
    },
    // โมดัลตัวเดียวใช้ทั้งสร้างและแก้ไข — ไม่มี id = กำลังสร้างบัญชีใหม่
    creatingUser() {
      return !this.dash.usEditItem || !this.dash.usEditItem.id;
    },
  },
  methods: {
    isSelf(user) { return this.dash.currentUser && String(user.id) === String(this.dash.currentUser.id); },
  },
};
</script>

<style scoped>
/* เว้นระยะหัวหน้าจากขอบบน + ย่อปุ่มค้นหาให้พอดี */
.header { margin-top: 14px; align-items: center; }

/* ตารางเต็มความกว้างมาตรฐาน (ใช้ section.fr-table-section + fr-table-scroll เหมือนทุกหน้า) */
.header-actions .fr-btn-search {
  padding: 6px 16px; font-size: 12px; line-height: 1.2;
}
.pm-role-select {
  padding: 5px 10px; border: 1px solid var(--field-border); border-radius: 7px;
  font-size: 12px; font-family: inherit; background: var(--surface); color: var(--text);
  cursor: pointer; max-width: 200px;
}
.pm-role-select:focus { outline: none; border-color: #1e40ff; }

/* ปุ่มจัดการในแถว */
.us-actions { display: flex; gap: 6px; white-space: nowrap; }
.us-btn {
  padding: 4px 10px; border-radius: 6px; border: 1px solid transparent;
  font-size: 12.5px; cursor: pointer; font-family: inherit; font-weight: 600;
}
.us-edit { background: #eef2ff; color: #3730a3; border-color: #c7d2fe; }
.us-edit:hover { background: #e0e7ff; }
.us-del { background: #fef2f2; color: #a82a3a; border-color: #fecaca; }
.us-del:hover { background: #fee2e2; }
.us-role-text { font-size: 12px; color: var(--text); }
.us-self-tag { font-size: 11.5px; color: #2F65F6; font-weight: 600; margin-left: 4px; cursor: help; }
.us-locked { font-size: 12px; opacity: .5; }
.us-perm-note { font-size: 12px; color: #a82a3a; margin-right: 8px; }

/* โมดัลแก้ไข */
.us-overlay {
  position: fixed; inset: 0; z-index: 3400; display: flex; align-items: center; justify-content: center;
  background: rgba(15,23,42,0.5); padding: 20px;
  font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif;
}
.us-modal { background: var(--surface); border-radius: 12px; width: 420px; max-width: 100%; overflow: hidden; box-shadow: 0 24px 60px rgba(0,0,0,0.3); }
.us-modal-head { background: #1e40ff; color: #fff; padding: 8px 13px; font-weight: 700; display: flex; justify-content: space-between; align-items: center; }
.us-x { background: none; border: none; color: #fff; font-size: 14px; cursor: pointer; }
.us-modal-body { padding: 18px 20px; }
.us-lbl { display: block; font-size: 12px; font-weight: 600; color: #334155; margin: 10px 0 4px; }
.us-lbl:first-child { margin-top: 0; }
.us-hint { font-weight: 400; color: #94a3b8; font-size: 12px; }
.us-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.us-input {
  width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 7px;
  font-size: 12px; font-family: inherit; outline: none;
}
.us-input:focus { border-color: #1e40ff; box-shadow: 0 0 0 3px rgba(30,64,255,0.12); }
.us-modal-foot { display: flex; justify-content: flex-end; gap: 10px; padding: 8px 14px; border-top: 1px solid #e2e8f0; background: #f8fafc; }
.us-btn-cancel { padding: 8px 18px; border: none; border-radius: 8px; background: #e2e8f0; color: #334155; font-weight: 700; cursor: pointer; font-family: inherit; }
.us-btn-save { padding: 8px 18px; border: none; border-radius: 8px; background: #1a9c54; color: #fff; font-weight: 700; cursor: pointer; font-family: inherit; }
.us-btn-save:hover { background: #158045; }
.us-fade-enter-active, .us-fade-leave-active { transition: opacity 0.2s; }
.us-fade-enter-from, .us-fade-leave-to { opacity: 0; }

:global([data-theme="dark"]) .us-modal { background: #1a1a1d; }
:global([data-theme="dark"]) .us-lbl { color: #d8d8dc; }
:global([data-theme="dark"]) .us-input { background: #0f0f11; border-color: #2c2c31; color: #ececee; }
:global([data-theme="dark"]) .us-modal-foot { background: #151517; border-top-color: #2c2c31; }
:global([data-theme="dark"]) .us-btn-cancel { background: #2c2c31; color: #d8d8dc; }
</style>
