<template>
<div class="fr-page-compact">
  <div class="header flex-wrap">
    <h1>{{ dash.t[dash.lang].membersList }}</h1>
    <div class="header-actions">
      <button class="btn-small fr-btn-search">{{ dash.t[dash.lang].search }}</button>
      <button class="btn-small fr-btn-add">{{ dash.t[dash.lang].addMember }}</button>
    </div>
  </div>

  <div class="section">
    <div class="section-header">
      <h2>{{ dash.t[dash.lang].totalMembers }} {{ dash.members.length }} {{ dash.lang === 'th' ? 'คน' : 'People' }}</h2>
      <button class="btn-small">{{ dash.t[dash.lang].filter }}</button>
    </div>
    <div class="overflow-x-auto table-scroll-y">
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>{{ dash.t[dash.lang].completeName }}</th>
          <th>{{ dash.t[dash.lang].email }}</th>
          <th>เบอร์มือถือ</th>
          <th>ตำแหน่ง / บทบาท</th>
          <th>{{ dash.t[dash.lang].status }}</th>
          <th>{{ dash.t[dash.lang].registeredDate }}</th>
          <th>จัดการ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, idx) in dash.members" :key="idx">
          <td>{{ idx + 1 }}</td>
          <td><strong>{{ user.name || '-' }}</strong></td>
          <td>{{ user.email }}</td>
          <td>{{ user.phone || '-' }}</td>
          <td>
            <select class="pm-role-select" :value="user.role || ''" @change="dash.setUserRole(user, $event.target.value)">
              <option value="">— ยังไม่กำหนด —</option>
              <option v-for="r in dash.roleOptions()" :key="r" :value="r">{{ r }}</option>
            </select>
          </td>
          <td><span class="badge success">✓ {{ dash.t[dash.lang].normal }}</span></td>
          <td>{{ user.created_at }}</td>
          <td class="us-actions">
            <button class="us-btn us-edit" @click="dash.usOpenEdit(user)">✏️ แก้ไข</button>
            <button class="us-btn us-del" @click="dash.usDeleteUser(user)">🗑️ ลบ</button>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
  </div>

  <!-- โมดัลแก้ไขบัญชีผู้ใช้ -->
  <transition name="us-fade">
    <div v-if="dash.usModalShow" class="us-overlay" @click.self="dash.usCloseModal()">
      <div class="us-modal">
        <div class="us-modal-head">
          <span>แก้ไขบัญชีผู้ใช้</span>
          <button class="us-x" @click="dash.usCloseModal()">✕</button>
        </div>
        <div class="us-modal-body">
          <label class="us-lbl">ชื่อ - นามสกุล</label>
          <input class="us-input" v-model="dash.usEditItem.name" placeholder="ชื่อ - นามสกุล" />
          <label class="us-lbl">อีเมล</label>
          <input class="us-input" type="email" v-model="dash.usEditItem.email" placeholder="email@example.com" />
          <label class="us-lbl">เบอร์มือถือ</label>
          <input class="us-input" v-model="dash.usEditItem.phone" placeholder="0812345678" />
          <label class="us-lbl">ตำแหน่ง / บทบาท</label>
          <select class="us-input" v-model="dash.usEditItem.role">
            <option value="">— ยังไม่กำหนด —</option>
            <option v-for="r in dash.roleOptions()" :key="r" :value="r">{{ r }}</option>
          </select>
          <label class="us-lbl">รหัสผ่านใหม่ <span class="us-hint">(เว้นว่างถ้าไม่เปลี่ยน)</span></label>
          <input class="us-input" type="password" v-model="dash.usEditItem.password" placeholder="••••••••" />
        </div>
        <div class="us-modal-foot">
          <button class="us-btn-cancel" @click="dash.usCloseModal()">ยกเลิก</button>
          <button class="us-btn-save" @click="dash.usSaveUser()">💾 บันทึก</button>
        </div>
      </div>
    </div>
  </transition>
</div>
</template>

<script>
export default {
  name: 'UsersPage',
  inject: ['dash'],
};
</script>

<style scoped>
.pm-role-select {
  padding: 5px 10px; border: 1px solid #cbd5e1; border-radius: 7px;
  font-size: 13.5px; font-family: inherit; background: #fff; color: #334155;
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

/* โมดัลแก้ไข */
.us-overlay {
  position: fixed; inset: 0; z-index: 3400; display: flex; align-items: center; justify-content: center;
  background: rgba(15,23,42,0.5); padding: 20px;
  font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif;
}
.us-modal { background: #fff; border-radius: 12px; width: 420px; max-width: 100%; overflow: hidden; box-shadow: 0 24px 60px rgba(0,0,0,0.3); }
.us-modal-head { background: #1e40ff; color: #fff; padding: 13px 18px; font-weight: 700; display: flex; justify-content: space-between; align-items: center; }
.us-x { background: none; border: none; color: #fff; font-size: 17px; cursor: pointer; }
.us-modal-body { padding: 18px 20px; }
.us-lbl { display: block; font-size: 13px; font-weight: 600; color: #334155; margin: 10px 0 4px; }
.us-lbl:first-child { margin-top: 0; }
.us-hint { font-weight: 400; color: #94a3b8; font-size: 12px; }
.us-input {
  width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 7px;
  font-size: 14px; font-family: inherit; outline: none;
}
.us-input:focus { border-color: #1e40ff; box-shadow: 0 0 0 3px rgba(30,64,255,0.12); }
.us-modal-foot { display: flex; justify-content: flex-end; gap: 10px; padding: 12px 20px; border-top: 1px solid #e2e8f0; background: #f8fafc; }
.us-btn-cancel { padding: 8px 18px; border: none; border-radius: 8px; background: #e2e8f0; color: #334155; font-weight: 700; cursor: pointer; font-family: inherit; }
.us-btn-save { padding: 8px 18px; border: none; border-radius: 8px; background: #1a9c54; color: #fff; font-weight: 700; cursor: pointer; font-family: inherit; }
.us-btn-save:hover { background: #158045; }
.us-fade-enter-active, .us-fade-leave-active { transition: opacity 0.2s; }
.us-fade-enter-from, .us-fade-leave-to { opacity: 0; }

:global([data-theme="dark"]) .us-modal { background: #1e293b; }
:global([data-theme="dark"]) .us-lbl { color: #e2e8f0; }
:global([data-theme="dark"]) .us-input { background: #0f172a; border-color: #334155; color: #f1f5f9; }
:global([data-theme="dark"]) .us-modal-foot { background: #172033; border-top-color: #334155; }
:global([data-theme="dark"]) .us-btn-cancel { background: #334155; color: #e2e8f0; }
</style>
