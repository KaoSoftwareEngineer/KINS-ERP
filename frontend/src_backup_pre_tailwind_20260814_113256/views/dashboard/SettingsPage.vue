<template>
<div>
  <div class="header">
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
      <input :ref="el => { if (el) dash.$refs.xlFileInput = el }" type="file" accept=".xlsx,.xls,.csv" @change="dash.xlHandleFile" />
      <button class="btn-small btn-primary" :disabled="dash.xlImporting" @click="dash.xlImportFile">
        {{ dash.xlImporting ? 'กำลังนำเข้า...' : '⬆️ นำเข้าข้อมูล' }}
      </button>
    </div>
    <p v-if="dash.xlImportMessage" class="xl-import-message" :class="{ 'is-error': dash.xlImportMessage.indexOf('⚠️') === 0 }">{{ dash.xlImportMessage }}</p>
    <p style="font-size: 12px; color: var(--muted); margin-top: 8px;">
      รูปแบบไฟล์: แถวแรกเป็นหัวคอลัมน์ A-J ตามลำดับ — item_code, ประเภทผ้า, ชื่อผ้า, รายละเอียด, Contract No., Weaving, โครงสร้าง, YC/Shade, ราคา, +Vat
      (หากไฟล์ไม่มีคอลัมน์ +Vat ระบบจะคำนวณให้อัตโนมัติ = ราคา × 1.07)
    </p>

    <div class="fr-table-scroll" style="margin-top: 18px;">
      <table class="fr-table">
        <thead>
          <tr>
            <th>item_code</th>
            <th>ประเภทผ้า</th>
            <th>ชื่อผ้า</th>
            <th>รายละเอียด</th>
            <th>Contract No.</th>
            <th>Weaving</th>
            <th>โครงสร้าง</th>
            <th>YC/Shade</th>
            <th>ราคา</th>
            <th>+Vat</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in dash.xlPagedRows" :key="row.id">
            <td><strong>{{ row.item_code }}</strong></td>
            <td>{{ row.fabric_type }}</td>
            <td>{{ row.fabric_name }}</td>
            <td>{{ row.description }}</td>
            <td>{{ row.contract_no }}</td>
            <td>{{ row.weaving }}</td>
            <td>{{ row.structure }}</td>
            <td>{{ row.yc_shade }}</td>
            <td>{{ dash.xlFormatMoney(row.price) }}</td>
            <td>{{ dash.xlFormatMoney(row.price_vat) }}</td>
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
      <input :ref="el => { if (el) dash.$refs.cmFileInput = el }" type="file" accept=".xlsx,.xls,.csv" @change="dash.cmHandleFile" />
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
    </div>
    <p style="margin-bottom: 16px; color: var(--muted);">{{ dash.t[dash.lang].nameLabel }}: <strong>{{ dash.currentUser.name }}</strong></p>
    <p style="margin-bottom: 16px; color: var(--muted);">{{ dash.t[dash.lang].emailLabel }}: <strong>{{ dash.currentUser.email }}</strong></p>
    <button class="btn-small btn-primary">{{ dash.t[dash.lang].editProfile }}</button>
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
