<template>
<div>
  <!-- ===== หัวหน้า ===== -->
  <div class="set-topbar">
    <div class="set-topbar-title">
      <h1>⚙️ {{ dash.t[dash.lang].settingsTitle }}</h1>
      <p class="set-subtitle">จัดการบัญชี ความปลอดภัย และนำเข้าข้อมูลของระบบ</p>
    </div>
    <div class="set-import-actions">
      <button class="set-import-btn" @click="dash.xlTogglePanel"><span class="set-import-ic">📊</span> นำเข้าข้อมูลผ้า (Excel)</button>
      <button class="set-import-btn" @click="dash.cmTogglePanel"><span class="set-import-ic">👥</span> นำเข้าข้อมูลลูกค้า (Excel)</button>
    </div>
  </div>

  <div class="set-grid">
    <!-- ===== การ์ดบัญชี ===== -->
    <div class="section set-card set-card-wide">
      <div class="set-card-head">
        <h2><span class="set-ic">👤</span> {{ dash.t[dash.lang].accountInfo }}</h2>
        <button v-if="!dash.settingsEditOpen" class="btn-small btn-primary" @click="dash.settingsOpenEdit">✏️ {{ dash.t[dash.lang].editProfile }}</button>
      </div>
      <p v-if="dash.settingsEditMsg.text" class="set-msg" :class="{ 'is-error': dash.settingsEditMsg.type === 'error' }">{{ dash.settingsEditMsg.text }}</p>

      <!-- โหมดดู -->
      <div v-if="!dash.settingsEditOpen" class="set-profile">
        <div class="set-avatar">
          <img v-if="dash.currentUser.avatar" :src="dash.currentUser.avatar" referrerpolicy="no-referrer" alt="" />
          <span v-else>{{ (dash.currentUser.name || 'U').trim().charAt(0).toUpperCase() }}</span>
        </div>
        <div class="set-profile-body">
          <div class="set-profile-name">{{ dash.currentUser.name || '-' }}</div>
          <span class="set-role-badge">{{ dash.currentUser.role || 'ผู้ใช้งาน' }}</span>
          <div class="set-info-grid">
            <div class="set-info"><span class="set-info-lbl">อีเมล</span><span class="set-info-val">{{ dash.currentUser.email || '-' }}</span></div>
            <div class="set-info"><span class="set-info-lbl">เบอร์โทร</span><span class="set-info-val">{{ dash.currentUser.phone || '-' }}</span></div>
          </div>
        </div>
      </div>

      <!-- โหมดแก้ไข -->
      <div v-else class="set-edit">
        <div class="set-avatar-edit">
          <div class="set-avatar">
            <img v-if="dash.settingsEditForm.avatar" :src="dash.settingsEditForm.avatar" alt="" />
            <span v-else>{{ (dash.settingsEditForm.name || 'U').trim().charAt(0).toUpperCase() }}</span>
          </div>
          <label class="set-upload-btn">
            <input type="file" accept="image/*" @change="dash.settingsHandleAvatarFile" hidden />
            📷 เปลี่ยนรูปโปรไฟล์
          </label>
        </div>
        <div class="set-form-grid">
          <div class="fr-field-group">
            <label>ชื่อ-นามสกุล</label>
            <input type="text" v-model="dash.settingsEditForm.name" placeholder="ชื่อ-นามสกุล" />
          </div>
          <div class="fr-field-group">
            <label>เบอร์โทร</label>
            <input type="tel" v-model="dash.settingsEditForm.phone" placeholder="0812345678" />
          </div>
        </div>
        <div class="set-edit-actions">
          <button class="btn-small btn-primary" :disabled="dash.settingsEditSaving" @click="dash.settingsSaveProfile">
            {{ dash.settingsEditSaving ? 'กำลังบันทึก...' : '💾 บันทึก' }}
          </button>
          <button class="btn-small" @click="dash.settingsCloseEdit">ยกเลิก</button>
        </div>
      </div>
    </div>

    <!-- ===== ความปลอดภัย ===== -->
    <div class="section set-card">
      <div class="set-card-head"><h2><span class="set-ic">🔒</span> {{ dash.t[dash.lang].security }}</h2></div>
      <div class="set-row">
        <div class="set-row-info">
          <div class="set-row-title">รหัสผ่าน</div>
          <div class="set-row-desc">{{ dash.t[dash.lang].accountNormal }}</div>
        </div>
        <button class="btn-small">{{ dash.t[dash.lang].changePassword }}</button>
      </div>
    </div>

    <!-- ===== การแจ้งเตือน ===== -->
    <div class="section set-card">
      <div class="set-card-head"><h2><span class="set-ic">🔔</span> {{ dash.t[dash.lang].notifications }}</h2></div>
      <div class="set-row">
        <div class="set-row-info">
          <div class="set-row-title">{{ dash.t[dash.lang].emailNotifications }}</div>
          <div class="set-row-desc">{{ dash.t[dash.lang].emailNotificationsDesc }}</div>
        </div>
        <label class="set-switch">
          <input type="checkbox" v-model="emailNotif" />
          <span class="set-switch-slider"></span>
        </label>
      </div>
    </div>
  </div>

  <!-- ============ โมดัลนำเข้าข้อมูลผ้า (Excel) ============ -->
  <div class="erp-overlay" v-if="dash.xlShowPanel" @click.self="dash.xlTogglePanel">
    <div class="erp-modal erp-modal-wide">
      <div class="erp-modal-head">
        <span><span class="erp-head-ic">📊</span> นำเข้าข้อมูลผ้าจากไฟล์ Excel</span>
        <button class="erp-x" @click="dash.xlTogglePanel">✕</button>
      </div>
      <div class="erp-modal-body">
        <div class="imp-step-title">📎 เลือกไฟล์ Excel ที่จะนำเข้า</div>
        <label class="imp-dropzone" :class="{ dragging: dragXl, 'has-file': dash.xlFile }"
               @dragover.prevent="dragXl = true" @dragleave.prevent="dragXl = false" @drop.prevent="onDropXl">
          <input :key="dash.xlFileInputKey" type="file" accept=".xlsx,.xls,.csv" @change="dash.xlHandleFile" hidden />
          <div class="imp-dz-icon">{{ dash.xlFile ? '📗' : '📁' }}</div>
          <div v-if="!dash.xlFile" class="imp-dz-text">
            <span class="imp-dz-main"><strong>คลิกเพื่อเลือกไฟล์</strong> หรือ ลากไฟล์มาวางที่นี่</span>
            <span class="imp-dz-sub">รองรับไฟล์ .xlsx, .xls, .csv</span>
          </div>
          <div v-else class="imp-dz-text">
            <span class="imp-dz-main imp-dz-file">✓ {{ dash.xlFile.name }}</span>
            <span class="imp-dz-sub">คลิกเพื่อเปลี่ยนไฟล์ — แล้วกดปุ่ม "นำเข้าข้อมูล" ด้านล่าง</span>
          </div>
        </label>
        <p class="imp-hint">
          รูปแบบไฟล์: แถวแรกเป็นหัวคอลัมน์ตามลำดับ — ที่, ประเภท, รหัสสินค้า, จำนวนสี, ชื่อ, โครงสร้างผ้า, ส่วนประกอบ, หน้ากว้าง, Finishing, น้ำหนัก, หน่วย, รูป
          (รหัสสินค้าซ้ำ = อัปเดตข้อมูลเดิม)
        </p>
        <p v-if="dash.xlImportMessage" class="xl-import-message" :class="{ 'is-error': dash.xlImportMessage.indexOf('⚠️') === 0 }">{{ dash.xlImportMessage }}</p>
      </div>
      <div class="erp-modal-foot">
        <button class="erp-btn erp-btn-cancel" @click="dash.xlTogglePanel">ปิด</button>
        <button class="erp-btn erp-btn-save" :disabled="dash.xlImporting" @click="dash.xlImportFile">
          {{ dash.xlImporting ? 'กำลังนำเข้า...' : '⬆️ นำเข้าข้อมูล' }}
        </button>
      </div>
    </div>
  </div>

  <!-- ============ โมดัลนำเข้าข้อมูลลูกค้า (Excel) ============ -->
  <div class="erp-overlay" v-if="dash.cmShowPanel" @click.self="dash.cmTogglePanel">
    <div class="erp-modal erp-modal-wide">
      <div class="erp-modal-head">
        <span><span class="erp-head-ic">👥</span> นำเข้าข้อมูลลูกค้าจากไฟล์ Excel</span>
        <button class="erp-x" @click="dash.cmTogglePanel">✕</button>
      </div>
      <div class="erp-modal-body">
        <div class="imp-step-title">📎 เลือกไฟล์ Excel ที่จะนำเข้า</div>
        <label class="imp-dropzone" :class="{ dragging: dragCm, 'has-file': dash.cmFile }"
               @dragover.prevent="dragCm = true" @dragleave.prevent="dragCm = false" @drop.prevent="onDropCm">
          <input :key="dash.cmFileInputKey" type="file" accept=".xlsx,.xls,.csv" @change="dash.cmHandleFile" hidden />
          <div class="imp-dz-icon">{{ dash.cmFile ? '📗' : '📁' }}</div>
          <div v-if="!dash.cmFile" class="imp-dz-text">
            <span class="imp-dz-main"><strong>คลิกเพื่อเลือกไฟล์</strong> หรือ ลากไฟล์มาวางที่นี่</span>
            <span class="imp-dz-sub">รองรับไฟล์ .xlsx, .xls, .csv</span>
          </div>
          <div v-else class="imp-dz-text">
            <span class="imp-dz-main imp-dz-file">✓ {{ dash.cmFile.name }}</span>
            <span class="imp-dz-sub">คลิกเพื่อเปลี่ยนไฟล์ — แล้วกดปุ่ม "นำเข้าข้อมูล" ด้านล่าง</span>
          </div>
        </label>
        <p class="imp-hint">
          คอลัมน์ A = รหัสลูกค้า (เลข 4 หลักนำหน้า) + ชื่อลูกค้า เช่น "2114 Mr.Hamad", คอลัมน์ B = ที่อยู่จัดส่ง
          — ระบบจะแยกรหัสและชื่อให้อัตโนมัติ และแจ้งเตือนหากพบรหัสลูกค้าซ้ำ
        </p>
        <p v-if="dash.cmImportMessage" class="xl-import-message" :class="{ 'is-error': dash.cmImportMessage.indexOf('⚠️') === 0 }">{{ dash.cmImportMessage }}</p>
      </div>
      <div class="erp-modal-foot">
        <button class="erp-btn erp-btn-cancel" @click="dash.cmTogglePanel">ปิด</button>
        <button class="erp-btn erp-btn-save" :disabled="dash.cmImporting" @click="dash.cmImportFile">
          {{ dash.cmImporting ? 'กำลังนำเข้า...' : '⬆️ นำเข้าข้อมูล' }}
        </button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'SettingsPage',
  inject: ['dash'],
  data() {
    return { dragXl: false, dragCm: false, emailNotif: true };
  },
  methods: {
    onDropXl(e) {
      this.dragXl = false;
      const f = e.dataTransfer && e.dataTransfer.files[0];
      if (f) this.dash.xlFile = f;
    },
    onDropCm(e) {
      this.dragCm = false;
      const f = e.dataTransfer && e.dataTransfer.files[0];
      if (f) this.dash.cmFile = f;
    },
  },
};
</script>

<style scoped>
/* ============ หัวหน้า ============ */
.set-topbar {
  display: flex; align-items: flex-start; justify-content: space-between;
  flex-wrap: wrap; gap: 14px; margin: 14px 0 20px;
}
.set-topbar-title h1 { font-size: 24px; font-weight: 700; color: var(--text); }
.set-subtitle { font-size: 13px; color: var(--muted); margin-top: 4px; }
.set-import-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 14px; }
.set-import-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 18px; border-radius: 9px; border: 1px solid #1a9c54;
  background: #1a9c54; color: #fff; font-size: 13px; font-weight: 600;
  cursor: pointer; font-family: inherit; transition: background .15s, box-shadow .15s;
  box-shadow: 0 2px 6px rgba(26,156,84,.25);
}
.set-import-btn:hover { background: #158045; border-color: #158045; box-shadow: 0 3px 10px rgba(26,156,84,.35); }
.set-import-ic { font-size: 15px; }

/* ============ กริดการ์ด ============ */
.set-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.set-card-wide { grid-column: 1 / -1; }
.set-card { padding: 20px 22px; }

.set-card-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.set-card-head h2 { font-size: 16px; font-weight: 700; color: var(--text); display: flex; align-items: center; gap: 8px; }
.set-ic { font-size: 17px; }

.set-msg { font-size: 13px; color: var(--ok); margin-bottom: 12px; }
.set-msg.is-error { color: var(--danger); }

/* ---- โปรไฟล์ (โหมดดู) ---- */
.set-profile { display: flex; align-items: center; gap: 20px; }
.set-avatar {
  width: 76px; height: 76px; border-radius: 50%; flex-shrink: 0; overflow: hidden;
  background: var(--brand); color: #fff; display: grid; place-items: center;
  font-size: 28px; font-weight: 700; box-shadow: 0 4px 12px rgba(47,101,246,.25);
}
.set-avatar img { width: 100%; height: 100%; object-fit: cover; }
.set-profile-body { flex: 1; min-width: 0; }
.set-profile-name { font-size: 19px; font-weight: 700; color: var(--text); }
.set-role-badge {
  display: inline-block; margin-top: 5px; padding: 3px 12px; border-radius: 20px;
  background: rgba(124,58,237,.12); color: #7c3aed; font-size: 12.5px; font-weight: 600;
}
.set-info-grid {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 24px;
  margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--field-border);
}
.set-info { display: flex; flex-direction: column; gap: 2px; }
.set-info-lbl { font-size: 11.5px; color: var(--muted); text-transform: uppercase; letter-spacing: .3px; }
.set-info-val { font-size: 14px; color: var(--text); font-weight: 600; word-break: break-word; }

/* ---- โปรไฟล์ (โหมดแก้ไข) ---- */
.set-avatar-edit { display: flex; align-items: center; gap: 16px; margin-bottom: 18px; }
.set-upload-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px; border-radius: 8px; border: 1px solid var(--field-border);
  background: var(--field); color: var(--text); font-size: 13px; font-weight: 600;
  cursor: pointer; font-family: inherit; transition: border-color .15s, background .15s;
}
.set-upload-btn:hover { border-color: #2F65F6; color: #2F65F6; background: rgba(47,101,246,.06); }
.set-form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; max-width: 560px; }
.set-edit-actions { display: flex; gap: 10px; margin-top: 18px; }

/* ---- แถวความปลอดภัย / แจ้งเตือน ---- */
.set-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.set-row-info { min-width: 0; }
.set-row-title { font-weight: 600; color: var(--text); font-size: 14px; }
.set-row-desc { font-size: 12.5px; color: var(--muted); margin-top: 3px; }

/* ---- toggle switch ---- */
.set-switch { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; cursor: pointer; }
.set-switch input { opacity: 0; width: 0; height: 0; }
.set-switch-slider {
  position: absolute; inset: 0; border-radius: 24px; background: var(--field-border);
  transition: background .2s;
}
.set-switch-slider::before {
  content: ''; position: absolute; height: 18px; width: 18px; left: 3px; top: 3px;
  background: #fff; border-radius: 50%; transition: transform .2s; box-shadow: 0 1px 3px rgba(0,0,0,.2);
}
.set-switch input:checked + .set-switch-slider { background: #17a06a; }
.set-switch input:checked + .set-switch-slider::before { transform: translateX(20px); }

@media (max-width: 760px) {
  .set-grid { grid-template-columns: 1fr; }
  .set-profile { flex-direction: column; align-items: flex-start; }
  .set-form-grid { grid-template-columns: 1fr; }
}

/* ============ โมดัลนำเข้า (เหลือแค่เลือกไฟล์ ไม่มีตาราง) — ขนาดพอดี ============ */
.erp-modal-wide { width: 600px; max-width: 96vw; }

/* หัวขั้นตอน + เลขลำดับ */
.imp-step-title { font-size: 14px; font-weight: 700; color: var(--text); display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.imp-step-no {
  display: inline-grid; place-items: center; width: 22px; height: 22px; flex-shrink: 0;
  border-radius: 50%; background: #2F65F6; color: #fff; font-size: 12px; font-weight: 700;
}

/* dropzone ลาก-วางไฟล์ */
.imp-dropzone {
  display: flex; align-items: center; gap: 16px;
  padding: 22px 24px; border: 2px dashed var(--field-border); border-radius: 12px;
  background: var(--field); cursor: pointer; transition: border-color .18s, background .18s;
}
.imp-dropzone:hover { border-color: #2F65F6; background: rgba(47,101,246,.05); }
.imp-dropzone.dragging { border-color: #2F65F6; background: rgba(47,101,246,.1); }
.imp-dropzone.has-file { border-style: solid; border-color: #17a06a; background: rgba(23,160,106,.07); }
.imp-dz-icon { font-size: 34px; line-height: 1; flex-shrink: 0; }
.imp-dz-text { display: flex; flex-direction: column; gap: 3px; }
.imp-dz-main { font-size: 14.5px; color: var(--text); }
.imp-dz-main strong { color: #2F65F6; }
.imp-dz-file { color: #17a06a; font-weight: 700; word-break: break-all; }
.imp-dz-sub { font-size: 12px; color: var(--muted); }

.imp-hint { font-size: 12px; color: var(--muted); line-height: 1.6; margin: 10px 2px 0; }

.imp-preview-label {
  font-size: 13.5px; font-weight: 700; color: var(--text);
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  margin: 22px 0 8px;
}
.imp-preview-note { font-size: 12px; font-weight: 400; color: var(--muted); }
/* จำกัดความสูงตาราง preview ให้เลื่อนในกรอบ ไม่ดันโมดัลยาว */
.imp-table-scroll { max-height: 300px; overflow: auto; }
</style>
