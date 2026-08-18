<script setup>
import { reactive, computed, onMounted } from 'vue'

const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')

const items = reactive([
  { type: '100S-44"', sku: '100S01', colors: 12, name: 'ผ้าคอตตอน 100S คอมแพค', structure: 'Plain (ผ้าทอลาย)', composition: 'Cotton 100%', width: '44"', finishing: 'Peach Finish', weight: '120', weightBucket: 'light', unit: 'หลา', active: true, substitute: false },
  { type: '100S-60"', sku: '100S02', colors: 18, name: 'ผ้าคอตตอน 100S ผิวนุ่ม', structure: 'Plain (ผ้าทอลาย)', composition: 'Cotton 100%', width: '60"', finishing: 'Enzyme Wash', weight: '135', weightBucket: 'light', unit: 'หลา', active: true, substitute: true },
  { type: '80S-44"', sku: '80S01', colors: 10, name: 'ผ้าคอตตอน 80S คลาสสิก', structure: 'Twill (ผ้าทอสอง)', composition: 'Cotton 100%', width: '44"', finishing: 'Soft Finish', weight: '160', weightBucket: 'mid', unit: 'หลา', active: true, substitute: false },
  { type: '80S-58"', sku: '80S02', colors: 8, name: 'ผ้าคอตตอน 80S หนานุ่ม', structure: 'Twill (ผ้าทอสอง)', composition: 'Cotton 100%', width: '58', finishing: 'Brushed', weight: '210', weightBucket: 'mid', unit: 'หลา', active: false, substitute: false },
  { type: 'CVC-44"', sku: 'CVC01', colors: 15, name: 'ผ้า CVC ผสมโพลี', structure: 'Plain (ผ้าทอลาย)', composition: 'CVC 60/40', width: '44"', finishing: 'Peach Finish', weight: '145', weightBucket: 'light', unit: 'หลา', active: true, substitute: true },
  { type: 'CVC-58"', sku: 'CVC02', colors: 20, name: 'ผ้า CVC เนื้อเรียบ', structure: 'Satin (ผ้าซาติน)', composition: 'CVC 60/40', width: '58', finishing: 'Silk Touch', weight: '175', weightBucket: 'mid', unit: 'หลา', active: true, substitute: false },
  { type: 'TC-44"', sku: 'TC01', colors: 9, name: 'ผ้า TC โพลีคอตตอน', structure: 'Plain (ผ้าทอลาย)', composition: 'TC 65/35', width: '44"', finishing: 'Standard', weight: '130', weightBucket: 'light', unit: 'หลา', active: true, substitute: false },
  { type: 'TC-60"', sku: 'TC02', colors: 11, name: 'ผ้า TC ทนทานพิเศษ', structure: 'Twill (ผ้าทอสอง)', composition: 'TC 65/35', width: '60"', finishing: 'Water Repellent', weight: '260', weightBucket: 'heavy', unit: 'หลา', active: true, substitute: false },
  { type: '120S-44"', sku: '120S01', colors: 14, name: 'ผ้าคอตตอน 120S พรีเมียม', structure: 'Poplin (ผ้าป็อปลิน)', composition: 'Cotton 100%', width: '44"', finishing: 'Mercerized', weight: '110', weightBucket: 'light', unit: 'หลา', active: true, substitute: true },
  { type: '120S-58"', sku: '120S02', colors: 16, name: 'ผ้าคอตตอน 120S เนื้อละเอียด', structure: 'Poplin (ผ้าป็อปลิน)', composition: 'Cotton 100%', width: '58', finishing: 'Mercerized', weight: '115', weightBucket: 'light', unit: 'หลา', active: false, substitute: false },
  { type: 'Denim-58"', sku: 'DNM01', colors: 5, name: 'ผ้ายีนส์เดนิมหนา', structure: 'Twill (ผ้าทอสอง)', composition: 'Cotton 98% / Spandex 2%', width: '58', finishing: 'Stone Wash', weight: '320', weightBucket: 'heavy', unit: 'หลา', active: true, substitute: false },
  { type: 'Linen-44"', sku: 'LIN01', colors: 7, name: 'ผ้าลินินธรรมชาติ', structure: 'Plain (ผ้าทอลาย)', composition: 'Linen 100%', width: '44"', finishing: 'Natural', weight: '190', weightBucket: 'mid', unit: 'หลา', active: true, substitute: false },
  { type: 'Poly-60"', sku: 'PLY01', colors: 22, name: 'ผ้าโพลีเอสเตอร์เรียบ', structure: 'Plain (ผ้าทอลาย)', composition: 'Polyester 100%', width: '60"', finishing: 'Standard', weight: '150', weightBucket: 'mid', unit: 'หลา', active: true, substitute: true },
  { type: 'Silk-44"', sku: 'SLK01', colors: 6, name: 'ผ้าไหมอิตาลีเงา', structure: 'Satin (ผ้าซาติน)', composition: 'Silk 100%', width: '44"', finishing: 'High Gloss', weight: '90', weightBucket: 'light', unit: 'หลา', active: true, substitute: false },
  { type: 'Oxford-58"', sku: 'OXF01', colors: 8, name: 'ผ้าอ๊อกซ์ฟอร์ดลายตาราง', structure: 'Oxford Weave', composition: 'Cotton 80% / Poly 20%', width: '58', finishing: 'Standard', weight: '200', weightBucket: 'mid', unit: 'หลา', active: false, substitute: false },
])

const filters = reactive({
  search: '',
  type: '',
  weight: '',
  active: '',
  skuFrom: '',
  skuTo: '',
  composition: '',
  width: '',
  substitute: false,
})

const typeOptions = computed(() => [...new Set(items.map(i => i.type))].sort())
const compositionOptions = computed(() => [...new Set(items.map(i => i.composition))].sort())
const widthOptions = computed(() => [...new Set(items.map(i => i.width))].sort())

const filteredItems = computed(() => {
  const q = filters.search.trim().toLowerCase()
  return items.filter(item => {
    if (q && !(item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q))) return false
    if (filters.type && item.type !== filters.type) return false
    if (filters.weight && item.weightBucket !== filters.weight) return false
    if (filters.active === 'active' && !item.active) return false
    if (filters.active === 'inactive' && item.active) return false
    if (filters.composition && item.composition !== filters.composition) return false
    if (filters.width && item.width !== filters.width) return false
    if (filters.substitute && !item.substitute) return false
    if (filters.skuFrom && item.sku < filters.skuFrom) return false
    if (filters.skuTo && item.sku > filters.skuTo) return false
    return true
  })
})

function search() {
  // v-model ผูกกับ filters อยู่แล้ว ปุ่มนี้ไว้สำหรับกรณีเชื่อมต่อ API จริงในอนาคต
}

function resetFilters() {
  Object.assign(filters, {
    search: '', type: '', weight: '', active: '',
    skuFrom: '', skuTo: '', composition: '', width: '', substitute: false,
  })
}

function openAdd() {
  alert('เปิดฟอร์มเพิ่ม "ผ้าประจำ" ใหม่ (ยังไม่ได้เชื่อมต่อระบบ)')
}

onMounted(() => {
  // ระบบล็อกอินอยู่คนละแอป (Express บนพอร์ต 3000) จึงต้อง redirect ข้ามพอร์ตแบบ absolute URL
  if (!localStorage.getItem('token')) {
    setTimeout(() => { window.location.href = 'http://localhost:3000/login-vue.html' }, 500)
  }
})
</script>

<template>
  <div class="topbar">
    <div class="topbar-left">
      <h1>ผ้าประจำ</h1>
      <button class="btn-add" @click="openAdd">+ เพิ่ม ผ้าประจำ</button>
    </div>
    <div class="topbar-right">เข้าสู่ระบบโดย {{ currentUser.name || currentUser.email || 'admin1' }}</div>
  </div>

  <div class="filter-section">
    <div class="filter-grid">
      <div class="field-group">
        <label>คำค้นหา</label>
        <input type="text" v-model="filters.search" placeholder="ค้นหาชื่อผ้า / รหัสสินค้า" />
      </div>
      <div class="field-group">
        <label>ประเภท</label>
        <select v-model="filters.type">
          <option value="">ทั้งหมด</option>
          <option v-for="opt in typeOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="field-group">
        <label>น้ำหนัก</label>
        <select v-model="filters.weight">
          <option value="">ทั้งหมด</option>
          <option value="light">ต่ำกว่า 150 GSM</option>
          <option value="mid">150 - 250 GSM</option>
          <option value="heavy">มากกว่า 250 GSM</option>
        </select>
      </div>
      <div class="field-group">
        <label>Active</label>
        <select v-model="filters.active">
          <option value="">ทั้งหมด</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div class="field-group">
        <label>รหัสสินค้า</label>
        <div class="sku-range">
          <input type="text" v-model="filters.skuFrom" placeholder="เริ่มต้น" />
          <span>—</span>
          <input type="text" v-model="filters.skuTo" placeholder="สิ้นสุด" />
        </div>
      </div>
      <div class="field-group">
        <label>ส่วนประกอบ</label>
        <select v-model="filters.composition">
          <option value="">ทั้งหมด</option>
          <option v-for="opt in compositionOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="field-group">
        <label>หน้ากว้าง</label>
        <select v-model="filters.width">
          <option value="">ทั้งหมด</option>
          <option v-for="opt in widthOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="field-group checkbox-group">
        <input type="checkbox" id="substitute" v-model="filters.substitute" />
        <label for="substitute">สินค้าทดแทน</label>
      </div>
    </div>

    <div class="filter-actions">
      <button class="btn-util" @click="search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        ค้นหา
      </button>
      <button class="btn-util" @click="resetFilters">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 1 3 6.7"/><path d="M3 16v-4h4"/></svg>
        รีเซ็ต
      </button>
    </div>
  </div>

  <div class="summary">พบ {{ filteredItems.length }} รายการ</div>

  <div class="table-wrap">
    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            <th>ที่</th>
            <th>ประเภท</th>
            <th>รหัสสินค้า</th>
            <th>จำนวนสี</th>
            <th>ชื่อ</th>
            <th>โครงสร้างผ้า</th>
            <th>ส่วนประกอบ</th>
            <th>หน้ากว้าง</th>
            <th>Finishing</th>
            <th>น้ำหนัก</th>
            <th>หน่วย</th>
            <th>รูป</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in filteredItems" :key="item.sku">
            <td>{{ idx + 1 }}</td>
            <td>{{ item.type }}</td>
            <td><strong>{{ item.sku }}</strong></td>
            <td>{{ item.colors }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.structure }}</td>
            <td>{{ item.composition }}</td>
            <td>{{ item.width }}</td>
            <td>{{ item.finishing }}</td>
            <td>{{ item.weight }}</td>
            <td>{{ item.unit }}</td>
            <td>
              <button class="img-btn" title="ดูรูปสินค้า">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
              </button>
            </td>
            <td>
              <div class="action-group">
                <button class="action-btn edit" title="แก้ไข">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                </button>
                <button class="action-btn delete" title="ลบ">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>
                </button>
                <button class="action-btn view" title="ดูรายละเอียด">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredItems.length === 0" class="empty-row">
            <td colspan="13">ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.topbar {
  background: var(--brand);
  padding: 18px 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.topbar-left { display: flex; align-items: center; gap: 18px; }
.topbar-left h1 { color: #fff; font-size: 21px; font-weight: 700; letter-spacing: .3px; margin: 0; }
.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--brand-dark);
  color: #fff;
  border: none;
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: background .2s, transform .1s;
}
.btn-add:hover { background: #17399c; }
.btn-add:active { transform: translateY(1px); }
.topbar-right { color: rgba(255,255,255,.92); font-size: 13.5px; font-weight: 500; }

.filter-section {
  background: var(--filter-bg);
  padding: 22px 48px;
  border-bottom: 1px solid var(--field-border);
}
.filter-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px 20px;
}
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-group label { font-size: 12.5px; font-weight: 600; color: var(--muted); }
.field-group input[type="text"],
.field-group select {
  height: 38px;
  border: 1px solid var(--field-border);
  border-radius: 8px;
  padding: 0 12px;
  font-size: 13.5px;
  color: var(--text);
  background: var(--surface);
  transition: border-color .2s, box-shadow .2s;
}
.field-group input[type="text"]:focus,
.field-group select:focus {
  outline: none;
  border-color: var(--brand);
  box-shadow: 0 0 0 3px rgba(47,101,246,.12);
}
.sku-range { display: flex; align-items: center; gap: 8px; }
.sku-range input { flex: 1; min-width: 0; }
.sku-range span { color: var(--muted); font-size: 13px; }

.checkbox-group {
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding-top: 22px;
}
.checkbox-group input[type="checkbox"] {
  width: 17px; height: 17px; accent-color: var(--brand); cursor: pointer;
}
.checkbox-group label { font-size: 13.5px; font-weight: 500; color: var(--text); cursor: pointer; }

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}
.btn-util {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #e7eaf1;
  color: var(--text);
  border: 1px solid var(--field-border);
  padding: 9px 20px;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: background .2s, border-color .2s;
}
.btn-util:hover { background: #dde1ea; border-color: #c7cede; }
.btn-util svg { width: 15px; height: 15px; }

.summary {
  padding: 16px 48px 0;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--brand);
}

.table-wrap {
  margin: 12px 48px 32px;
  background: var(--surface);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 18px rgba(20, 30, 70, .06);
  border: 1px solid var(--field-border);
}
.table-scroll { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; min-width: 1180px; }
thead th {
  background: var(--table-head);
  color: #fff;
  font-size: 12.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .4px;
  padding: 13px 14px;
  text-align: left;
  white-space: nowrap;
}
tbody td {
  padding: 12px 14px;
  font-size: 13.5px;
  color: var(--text);
  border-bottom: 1px solid var(--field-border);
  white-space: nowrap;
}
tbody tr:nth-child(even) { background: var(--row-alt); }
tbody tr:hover { background: #eaf0ff; }
tbody tr:last-child td { border-bottom: none; }

.img-btn {
  width: 32px; height: 32px;
  display: grid; place-items: center;
  background: #eef1f8;
  border: 1px solid var(--field-border);
  border-radius: 8px;
  color: var(--muted);
  cursor: pointer;
}
.img-btn svg { width: 16px; height: 16px; }

.action-group { display: flex; gap: 6px; }
.action-btn {
  width: 30px; height: 30px;
  display: grid; place-items: center;
  border-radius: 7px;
  border: 1px solid var(--field-border);
  background: var(--surface);
  cursor: pointer;
  color: var(--muted);
  transition: background .2s, color .2s, border-color .2s;
}
.action-btn svg { width: 15px; height: 15px; }
.action-btn.edit:hover { background: rgba(47,101,246,.1); color: var(--brand); border-color: var(--brand); }
.action-btn.delete:hover { background: rgba(229,72,77,.1); color: var(--danger); border-color: var(--danger); }
.action-btn.view:hover { background: rgba(23,160,106,.1); color: var(--ok); border-color: var(--ok); }

.empty-row td { text-align: center; padding: 40px; color: var(--muted); }

@media (max-width: 900px) {
  .filter-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px) {
  .filter-grid { grid-template-columns: 1fr; }
  .topbar, .filter-section, .summary { padding-left: 16px; padding-right: 16px; }
  .table-wrap { margin-left: 16px; margin-right: 16px; }
  .filter-actions { justify-content: stretch; }
  .btn-util { flex: 1; justify-content: center; }
}
</style>
