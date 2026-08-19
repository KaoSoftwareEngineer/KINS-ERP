<template>
<div>
  <div class="header flex-wrap" style="margin-bottom: 24px;">
    <h1>⚙️ {{ dash.t[dash.lang].settingsTitle }}</h1>
    <div class="header-actions">
      <button class="btn-small btn-primary" @click="dash.xlTogglePanel">➕ เพิ่มข้อมูลผ้า Database (Excel)</button>
      <button class="btn-small btn-primary" @click="dash.cmTogglePanel">➕ เพิ่มลูกค้า Database (Excel)</button>
    </div>
  </div>

  <div class="section">
    <div class="section-header">
      <h2>{{ dash.t[dash.lang].accountInfo }}</h2>
      <button v-if="!dash.settingsEditOpen" class="btn-small btn-primary" @click="dash.settingsOpenEdit">{{ dash.t[dash.lang].editProfile }}</button>
    </div>
    <p v-if="dash.settingsEditMsg.text" class="xl-import-message" :class="{ 'is-error': dash.settingsEditMsg.type === 'error' }">{{ dash.settingsEditMsg.text }}</p>

    <!-- ---- การ์ดบัญชีเดียว: โหมดดู / โหมดแก้ไข ใช้พื้นที่รูปเดียวกัน ---- -->
    <div style="display: flex; align-items: center; gap: 16px; margin: 12px 4px 20px;">
      <img v-if="(dash.settingsEditOpen ? dash.settingsEditForm.avatar : dash.currentUser.avatar)"
           :src="dash.settingsEditOpen ? dash.settingsEditForm.avatar : dash.currentUser.avatar" alt=""
           style="width: 56px; height: 56px; border-radius: 50%; object-fit: cover; flex-shrink: 0;" />
      <div v-else style="width: 56px; height: 56px; border-radius: 50%; background: var(--brand); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; flex-shrink: 0;">
        {{ ((dash.settingsEditOpen ? dash.settingsEditForm.name : dash.currentUser.name) || 'U').trim().charAt(0).toUpperCase() }}
      </div>

      <div v-if="!dash.settingsEditOpen">
        <p style="margin-bottom: 6px; color: var(--muted);">{{ dash.t[dash.lang].nameLabel }}: <strong style="color: var(--text);">{{ dash.currentUser.name }}</strong></p>
        <p style="margin-bottom: 6px; color: var(--muted);">{{ dash.t[dash.lang].emailLabel }}: <strong style="color: var(--text);">{{ dash.currentUser.email }}</strong></p>
        <p style="color: var(--muted);">เบอร์โทร: <strong style="color: var(--text);">{{ dash.currentUser.phone || '-' }}</strong></p>
      </div>
      <div v-else class="fr-field-group">
        <label>เปลี่ยนรูปโปรไฟล์</label>
        <input type="file" accept="image/*" @change="dash.settingsHandleAvatarFile" />
      </div>
    </div>

    <!-- ---- ฟอร์มแก้ไข (ชื่อ/เบอร์โทร) ---- -->
    <div v-if="dash.settingsEditOpen" style="padding: 0 4px;">
      <div class="grid grid-cols-1 sm:grid-cols-2" style="gap: 14px; max-width: 480px;">
        <div class="fr-field-group">
          <label>ชื่อ-นามสกุล</label>
          <input type="text" v-model="dash.settingsEditForm.name" placeholder="ชื่อ-นามสกุล" />
        </div>
        <div class="fr-field-group">
          <label>เบอร์โทร</label>
          <input type="tel" v-model="dash.settingsEditForm.phone" placeholder="0812345678" />
        </div>
      </div>
      <div style="display: flex; gap: 10px; margin-top: 16px;">
        <button class="btn-small btn-primary" :disabled="dash.settingsEditSaving" @click="dash.settingsSaveProfile">
          {{ dash.settingsEditSaving ? 'กำลังบันทึก...' : '💾 บันทึก' }}
        </button>
        <button class="btn-small" @click="dash.settingsCloseEdit">ยกเลิก</button>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-header">
      <h2>{{ dash.t[dash.lang].security }}</h2>
    </div>
    <p style="margin-bottom: 16px; color: var(--muted);">{{ dash.t[dash.lang].accountNormal }}</p>
    <button class="btn-small">{{ dash.t[dash.lang].changePassword }}</button>
  </div>

  <div class="section">
    <div class="section-header">
      <h2>{{ dash.t[dash.lang].notifications }}</h2>
    </div>
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
      <div>
        <div style="font-weight: 600; color: var(--text);">{{ dash.t[dash.lang].emailNotifications }}</div>
        <div style="font-size: 13px; color: var(--muted);">{{ dash.t[dash.lang].emailNotificationsDesc }}</div>
      </div>
      <input type="checkbox" checked />
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
        <div class="imp-step-title"><span class="imp-step-no">1</span> เลือกไฟล์ Excel ที่จะนำเข้า</div>
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

        <div class="imp-preview-label"><span class="imp-step-no">2</span> ข้อมูลผ้าที่มีในระบบตอนนี้ ({{ dash.xlRows.length }} รายการ) <span class="imp-preview-note">— ไฟล์ที่นำเข้าจะเพิ่ม/อัปเดตลงในนี้</span></div>
        <div class="fr-table-scroll imp-table-scroll">
          <table class="fr-table">
            <thead>
              <tr>
                <th>รหัสสินค้า</th>
                <th>ประเภท</th>
                <th>ชื่อ</th>
                <th>โครงสร้างผ้า</th>
                <th>ส่วนประกอบ</th>
                <th>หน้ากว้าง</th>
                <th>Finishing</th>
                <th>น้ำหนัก</th>
                <th>หน่วย</th>
                <th>จำนวนสี</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in dash.xlPagedRows" :key="row.id">
                <td><strong>{{ row.sku }}</strong></td>
                <td>{{ row.type }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.structure }}</td>
                <td>{{ row.composition }}</td>
                <td>{{ row.width }}</td>
                <td>{{ row.finishing }}</td>
                <td>{{ row.weight }}</td>
                <td>{{ row.unit }}</td>
                <td>{{ row.colors }}</td>
              </tr>
              <tr v-if="dash.xlLoading" class="fr-empty-row">
                <td colspan="10">กำลังโหลดข้อมูล...</td>
              </tr>
              <tr v-else-if="dash.xlRows.length === 0" class="fr-empty-row">
                <td colspan="10">ยังไม่มีข้อมูล — เลือกไฟล์ Excel แล้วกด "นำเข้าข้อมูล"</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="xl-pagination" v-if="dash.xlRows.length > 0">
          <button class="fr-btn-util" :disabled="dash.xlPage === 1" @click="dash.xlPrevPage">‹ ก่อนหน้า</button>
          <span>หน้า {{ dash.xlPage }} / {{ dash.xlTotalPages }}</span>
          <button class="fr-btn-util" :disabled="dash.xlPage === dash.xlTotalPages" @click="dash.xlNextPage">ถัดไป ›</button>
        </div>
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
        <div class="imp-step-title"><span class="imp-step-no">1</span> เลือกไฟล์ Excel ที่จะนำเข้า</div>
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

        <div class="imp-preview-label"><span class="imp-step-no">2</span> ข้อมูลลูกค้าที่มีในระบบตอนนี้ ({{ dash.cmRows.length }} รายการ) <span class="imp-preview-note">— ไฟล์ที่นำเข้าจะเพิ่ม/อัปเดตลงในนี้</span></div>
        <div class="fr-table-scroll imp-table-scroll">
          <table class="fr-table">
            <thead>
              <tr>
                <th>รหัสลูกค้า</th>
                <th>ชื่อลูกค้า</th>
                <th>ที่อยู่จัดส่ง</th>
                <th style="width:100px;">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in dash.cmPagedRows" :key="row.id">
                <td><strong>{{ row.customer_code }}</strong></td>
                <td>{{ row.customer_name }}</td>
                <td>{{ row.address }}</td>
                <td>
                  <div class="fr-action-group">
                    <button class="fr-action-btn edit" title="แก้ไข" @click="dash.cmOpenEdit(row)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                    </button>
                    <button class="fr-action-btn delete" title="ลบ" @click="dash.cmDeleteRow(row)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="dash.cmLoading" class="fr-empty-row">
                <td colspan="4">กำลังโหลดข้อมูล...</td>
              </tr>
              <tr v-else-if="dash.cmRows.length === 0" class="fr-empty-row">
                <td colspan="4">ยังไม่มีข้อมูล — เลือกไฟล์ Excel แล้วกด "นำเข้าข้อมูล"</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="xl-pagination" v-if="dash.cmRows.length > 0">
          <button class="fr-btn-util" :disabled="dash.cmPage === 1" @click="dash.cmPrevPage">‹ ก่อนหน้า</button>
          <span>หน้า {{ dash.cmPage }} / {{ dash.cmTotalPages }}</span>
          <button class="fr-btn-util" :disabled="dash.cmPage === dash.cmTotalPages" @click="dash.cmNextPage">ถัดไป ›</button>
        </div>
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
    return { dragXl: false, dragCm: false };
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
/* โมดัลนำเข้าให้กว้างพอสำหรับตารางหลายคอลัมน์ */
.erp-modal-wide { width: 1040px; max-width: 96vw; }

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
