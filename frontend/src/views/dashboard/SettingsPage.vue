<template>
<div>
  <div class="header flex-wrap" style="margin-bottom: 24px;">
    <h1>⚙️ {{ dash.t[dash.lang].settingsTitle }}</h1>
    <div class="header-actions">
      <button class="btn-small btn-primary" @click="dash.xlTogglePanel">➕ เพิ่มข้อมูลผ้า Database (Excel)</button>
      <button class="btn-small btn-primary" @click="dash.cmTogglePanel">➕ เพิ่มลูกค้า Database (Excel)</button>
    </div>
  </div>

  <!-- ---- นำเข้าข้อมูล Excel + ตารางแสดงผล ---- -->
  <div class="section" v-if="dash.xlShowPanel">
    <div class="section-header">
      <h2>นำเข้าข้อมูลผ้าจากไฟล์ Excel</h2>
    </div>
    <div class="xl-import-row">
      <input :key="dash.xlFileInputKey" type="file" accept=".xlsx,.xls,.csv" @change="dash.xlHandleFile" />
      <button class="btn-small btn-primary" :disabled="dash.xlImporting" @click="dash.xlImportFile">
        {{ dash.xlImporting ? 'กำลังนำเข้า...' : '⬆️ นำเข้าข้อมูล' }}
      </button>
    </div>
    <p v-if="dash.xlImportMessage" class="xl-import-message" :class="{ 'is-error': dash.xlImportMessage.indexOf('⚠️') === 0 }">{{ dash.xlImportMessage }}</p>
    <p style="font-size: 12px; color: var(--muted); margin-top: 8px;">
      รูปแบบไฟล์: แถวแรกเป็นหัวคอลัมน์ตามลำดับ — ที่, ประเภท, รหัสสินค้า, จำนวนสี, ชื่อ, โครงสร้างผ้า, ส่วนประกอบ, หน้ากว้าง, Finishing, น้ำหนัก, หน่วย, รูป
      (ข้อมูลจะถูกบันทึกลงตาราง "ผ้าประจำ" โดยตรง — ถ้ารหัสสินค้าซ้ำจะอัปเดตข้อมูลเดิม)
    </p>

    <div class="fr-table-scroll" style="margin-top: 18px;">
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
            <td colspan="10">ยังไม่มีข้อมูล — นำเข้าไฟล์ Excel เพื่อเริ่มต้น</td>
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

  <!-- ---- นำเข้าข้อมูลลูกค้า Excel + ตารางแสดงผล ---- -->
  <div class="section" v-if="dash.cmShowPanel">
    <div class="section-header">
      <h2>นำเข้าข้อมูลลูกค้าจากไฟล์ Excel</h2>
    </div>
    <div class="xl-import-row">
      <input :key="dash.cmFileInputKey" type="file" accept=".xlsx,.xls,.csv" @change="dash.cmHandleFile" />
      <button class="btn-small btn-primary" :disabled="dash.cmImporting" @click="dash.cmImportFile">
        {{ dash.cmImporting ? 'กำลังนำเข้า...' : '⬆️ นำเข้าข้อมูล' }}
      </button>
    </div>
    <p v-if="dash.cmImportMessage" class="xl-import-message" :class="{ 'is-error': dash.cmImportMessage.indexOf('⚠️') === 0 }">{{ dash.cmImportMessage }}</p>
    <p style="font-size: 12px; color: var(--muted); margin-top: 8px;">
      รูปแบบไฟล์: คอลัมน์ A = รหัสลูกค้า (เลข 4 หลักนำหน้า) + ชื่อลูกค้า เช่น "2114 Mr.Hamad", คอลัมน์ B = ที่อยู่จัดส่ง
      ระบบจะแยกรหัสและชื่อออกจากคอลัมน์ A ให้อัตโนมัติ และแจ้งเตือนหากพบรหัสลูกค้าซ้ำ
    </p>

    <div class="fr-summary" style="padding-left: 0; margin-top: 18px;">{{ dash.t[dash.lang].foundItems }} {{ dash.cmRows.length }} {{ dash.t[dash.lang].itemsUnit }}</div>

    <div class="fr-table-scroll" style="margin-top: 8px;">
      <table class="fr-table">
        <thead>
          <tr>
            <th>รหัสลูกค้า</th>
            <th>ชื่อลูกค้า</th>
            <th>ที่อยู่จัดส่ง</th>
            <th>จัดการ</th>
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
            <td colspan="4">ยังไม่มีข้อมูล — นำเข้าไฟล์ Excel เพื่อเริ่มต้น</td>
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
</div>
</template>

<script>
export default {
  name: 'SettingsPage',
  inject: ['dash'],
};
</script>
