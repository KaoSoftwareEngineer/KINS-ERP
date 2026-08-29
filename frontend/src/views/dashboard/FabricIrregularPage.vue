<template>
<div class="fr-page-compact">
  <div class="header flex-wrap">
    <div>
      <h1>🧶 {{ dash.pageTitle('fabric-irregular') }}</h1>
    </div>
  </div>

  <div class="section" style="margin-top: 12px;">
    <div class="section-header" style="margin-bottom: 12px; padding-bottom: 10px;">
      <h2>{{ dash.t[dash.lang].searchFilter }}</h2>
    </div>
    <div class="fr-filter-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[18px] gap-y-[14px]">
      <div class="fr-field-group">
        <label>คำค้นหา</label>
        <input type="text" v-model="fabricStore.fiFilters.search" placeholder="ค้นหาชื่อผ้า / รหัสสินค้า" />
      </div>
      <div class="fr-field-group">
        <label>ประเภท</label>
        <select v-model="fabricStore.fiFilters.type">
          <option value="">ทั้งหมด</option>
          <option v-for="opt in dash.fiTypeOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="fr-field-group">
        <label>น้ำหนัก</label>
        <select v-model="fabricStore.fiFilters.weight">
          <option value="">ทั้งหมด</option>
          <option value="light">ต่ำกว่า 150 GSM</option>
          <option value="mid">150 - 250 GSM</option>
          <option value="heavy">มากกว่า 250 GSM</option>
        </select>
      </div>
      <div class="fr-field-group">
        <label>Active</label>
        <select v-model="fabricStore.fiFilters.active">
          <option value="">ทั้งหมด</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div class="fr-field-group">
        <label>รหัสสินค้า</label>
        <div class="fr-sku-range">
          <input type="text" v-model="fabricStore.fiFilters.skuFrom" placeholder="เริ่มต้น" />
          <span>—</span>
          <input type="text" v-model="fabricStore.fiFilters.skuTo" placeholder="สิ้นสุด" />
        </div>
      </div>
      <div class="fr-field-group">
        <label>ส่วนประกอบ</label>
        <select v-model="fabricStore.fiFilters.composition">
          <option value="">ทั้งหมด</option>
          <option v-for="opt in dash.fiCompositionOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="fr-field-group">
        <label>หน้ากว้าง</label>
        <select v-model="fabricStore.fiFilters.width">
          <option value="">ทั้งหมด</option>
          <option v-for="opt in dash.fiWidthOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="fr-field-group fr-checkbox-group">
        <input type="checkbox" id="fiSubstitute" v-model="fabricStore.fiFilters.substitute" />
        <label for="fiSubstitute">สินค้าทดแทน</label>
      </div>
    </div>

    <div class="fr-filter-actions">
      <button class="fr-btn-util fr-btn-search" @click="fabricStore.fiSearch">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        {{ dash.t[dash.lang].searchWord }}
      </button>
      <button class="fr-btn-util fr-btn-reset" @click="fabricStore.fiResetFilters">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 1 3 6.7"/><path d="M3 16v-4h4"/></svg>
        {{ dash.t[dash.lang].resetWord }}
      </button>
    </div>
  </div>

  <div class="fr-summary fr-summary-row">
    <span>{{ dash.t[dash.lang].foundItems }} {{ fabricStore.fiFilteredItems.length }} {{ dash.t[dash.lang].itemsUnit }}</span>
    <div class="fr-summary-actions">
      <button v-if="fabricStore.fiSelected.length > 0" class="btn-small" style="color: var(--danger); border-color: var(--danger);" @click="fabricStore.fiBulkDelete">
        🗑️ ลบที่เลือก ({{ fabricStore.fiSelected.length }})
      </button>
      <button v-if="fabricStore.fiSelected.length > 0" class="btn-small" @click="fabricStore.fiExportExcel(true)"><svg class="xls-ico" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#217346"/><path d="M14 2v6h6" fill="#185c37"/><path d="M9.5 12.5l5 5M14.5 12.5l-5 5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>ส่งออกที่เลือก</button>
      <button class="btn-small" @click="fabricStore.fiExportExcel(false)"><svg class="xls-ico" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#217346"/><path d="M14 2v6h6" fill="#185c37"/><path d="M9.5 12.5l5 5M14.5 12.5l-5 5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>ส่งออก Excel</button>
      <button class="btn-small fr-btn-add" @click="fabricStore.fiOpenAdd">+ {{ dash.t[dash.lang].add }} {{ dash.pageTitle('fabric-irregular') }}</button>
    </div>
  </div>

  <div class="section fr-table-section" style="margin-top: 8px; padding: 0; overflow: hidden;">
    <div class="fr-table-scroll">
      <table class="fr-table">
        <thead>
          <tr>
            <th class="fr-th-check"><input type="checkbox" :checked="fabricStore.fiAllSelectedOnPage" @change="fabricStore.fiToggleSelectAll" /></th>
            <th>ที่</th>
            <th class="fr-th-sort" @click="fabricStore.fiSort('type')">ประเภท <span class="fr-sort-icon">{{ fabricStore.fiSortBy === 'type' ? (fabricStore.fiSortDir === 'asc' ? '▲' : '▼') : '' }}</span></th>
            <th class="fr-th-sort" @click="fabricStore.fiSort('sku')">รหัสสินค้า <span class="fr-sort-icon">{{ fabricStore.fiSortBy === 'sku' ? (fabricStore.fiSortDir === 'asc' ? '▲' : '▼') : '' }}</span></th>
            <th class="fr-th-sort" @click="fabricStore.fiSort('colors')">จำนวนสี <span class="fr-sort-icon">{{ fabricStore.fiSortBy === 'colors' ? (fabricStore.fiSortDir === 'asc' ? '▲' : '▼') : '' }}</span></th>
            <th class="fr-th-sort" @click="fabricStore.fiSort('name')">ชื่อ <span class="fr-sort-icon">{{ fabricStore.fiSortBy === 'name' ? (fabricStore.fiSortDir === 'asc' ? '▲' : '▼') : '' }}</span></th>
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
          <tr v-for="(item, idx) in fabricStore.fiPagedItems" :key="item.sku">
            <td><input type="checkbox" :checked="fabricStore.fiSelected.includes(item.sku)" @change="fabricStore.fiToggleSelect(item.sku)" /></td>
            <td>{{ (fabricStore.fiPage - 1) * fabricStore.fiPageSize + idx + 1 }}</td>
            <td>{{ item.type }}</td>
            <td><strong>{{ item.sku }}</strong></td>
            <td>
              <button class="fr-color-badge" @click="dash.fiOpenShades(item)" title="จัดการเฉดสี">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:.85"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a1 1 0 0 1 1-1h9"/></svg>
                {{ item.colors }}
              </button>
            </td>
            <td class="fr-td-wrap"><span class="fr-clamp">{{ item.name }}</span></td>
            <td class="fr-td-wrap"><span class="fr-clamp">{{ item.structure }}</span></td>
            <td class="fr-td-wrap"><span class="fr-clamp">{{ item.composition }}</span></td>
            <td>{{ item.width }}</td>
            <td>{{ item.finishing }}</td>
            <td>{{ item.weight }}</td>
            <td>{{ item.unit }}</td>
            <td>
              <button class="fr-img-btn" title="ดูรูปสินค้า">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
              </button>
            </td>
            <td>
              <div class="fr-action-group">
                <button class="fr-action-btn edit" title="แก้ไข" @click="fabricStore.fiEditItem(item)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                </button>
                <button class="fr-action-btn delete" title="ลบ" @click="fabricStore.fiDeleteItem(item)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>
                </button>
                <button class="fr-action-btn view" title="ดูรายละเอียด" @click="fabricStore.fiViewItem(item)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="fabricStore.fiLoading" class="fr-empty-row">
            <td colspan="14">กำลังโหลดข้อมูล...</td>
          </tr>
          <tr v-else-if="fabricStore.fiFilteredItems.length === 0" class="fr-empty-row">
            <td colspan="14">ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="xl-pagination" v-if="fabricStore.fiFilteredItems.length > 0">
      <select v-model.number="fabricStore.fiPageSize" class="fr-page-size-select">
        <option :value="10">10 / หน้า</option>
        <option :value="20">20 / หน้า</option>
        <option :value="50">50 / หน้า</option>
        <option :value="100">100 / หน้า</option>
      </select>
      <button class="fr-btn-util" :disabled="fabricStore.fiPage === 1" @click="fabricStore.fiPrevPage">‹ ก่อนหน้า</button>
      <span><strong>หน้า {{ fabricStore.fiPage }} / {{ fabricStore.fiTotalPages }}</strong> — แสดง {{ (fabricStore.fiPage - 1) * fabricStore.fiPageSize + 1 }}-{{ Math.min(fabricStore.fiPage * fabricStore.fiPageSize, fabricStore.fiFilteredItems.length) }} จากทั้งหมด {{ fabricStore.fiFilteredItems.length }} รายการ</span>
      <button class="fr-btn-util" :disabled="fabricStore.fiPage === fabricStore.fiTotalPages" @click="fabricStore.fiNextPage">ถัดไป ›</button>
    </div>
  </div>

  <!-- ============ Modal: เพิ่ม/แก้ไข ผ้าไม่ประจำ (ERP มาตรฐานกลาง) ============ -->
  <div class="erp-overlay" v-if="fabricStore.fiShowModal" @click.self="fabricStore.fiCloseModal">
    <div class="erp-modal">
      <div class="erp-modal-head">
        <span><span class="erp-head-ic">🧶</span> {{ fabricStore.fiModalMode === 'edit' ? dash.t[dash.lang].edit : fabricStore.fiModalMode === 'view' ? dash.t[dash.lang].viewDetails : dash.t[dash.lang].add }} {{ dash.pageTitle('fabric-irregular') }}</span>
        <button class="erp-x" @click="fabricStore.fiCloseModal" title="ปิด">✕</button>
      </div>
      <div class="erp-modal-body">
      <fieldset :disabled="fabricStore.fiModalMode === 'view'" style="border:0;margin:0;padding:0;min-width:0;">
        <div class="erp-sec-title"><span class="erp-sec-bar"></span>ข้อมูลผ้า</div>
        <div class="erp-grid">
          <div class="erp-field"><label>ประเภท <span class="erp-req">*</span></label>
            <select v-model="fabricStore.fiNewItem.type"><option value="">เลือกประเภท</option><option v-for="opt in dash.fiTypeOptions" :key="opt" :value="opt">{{ opt }}</option></select>
          </div>
          <div class="erp-field"><label>รหัสสินค้า <span class="erp-req">*</span></label><input type="text" v-model="fabricStore.fiNewItem.sku" placeholder="เช่น FI-SAT01" /></div>
          <div class="erp-field erp-col-2"><label>ชื่อ</label><input type="text" v-model="fabricStore.fiNewItem.name" placeholder="ชื่อผ้า" /></div>
          <div class="erp-field"><label>โครงสร้างผ้า</label>
            <select v-model="fabricStore.fiNewItem.structure"><option value="">เลือกโครงสร้างผ้า</option><option v-for="opt in dash.fiStructureOptions" :key="opt" :value="opt">{{ opt }}</option></select>
          </div>
          <div class="erp-field"><label>ส่วนประกอบ</label>
            <select v-model="fabricStore.fiNewItem.composition"><option value="">เลือกส่วนประกอบ</option><option v-for="opt in dash.fiCompositionOptions" :key="opt" :value="opt">{{ opt }}</option></select>
          </div>
          <div class="erp-field"><label>หน้ากว้าง <span class="erp-req">*</span></label>
            <select v-model="fabricStore.fiNewItem.width"><option value="">เลือกหน้ากว้าง</option><option v-for="opt in dash.fiWidthOptions" :key="opt" :value="opt">{{ opt }}</option></select>
          </div>
          <div class="erp-field"><label>Finishing</label>
            <select v-model="fabricStore.fiNewItem.finishing"><option value="">เลือก Finishing</option><option v-for="opt in dash.fiFinishingOptions" :key="opt" :value="opt">{{ opt }}</option></select>
          </div>
          <div class="erp-field"><label>น้ำหนัก</label>
            <select v-model="fabricStore.fiNewItem.weight"><option value="">เลือกน้ำหนัก</option><option v-for="opt in dash.fiWeightOptions" :key="opt" :value="opt">{{ opt }} GSM</option></select>
          </div>
          <div class="erp-field"><label>หน่วย</label>
            <select v-model="fabricStore.fiNewItem.unit"><option v-for="opt in dash.frUnitOptions" :key="opt" :value="opt">{{ opt }}</option></select>
          </div>
        </div>
        <div class="erp-sec-title"><span class="erp-sec-bar"></span>รายละเอียดเพิ่มเติม</div>
        <div class="erp-grid">
          <div class="erp-field erp-col-2"><label>คำอธิบาย</label><input type="text" v-model="fabricStore.fiNewItem.description" placeholder="คำอธิบายเพิ่มเติม" /></div>
          <div class="erp-field"><label>จำนวนวันที่ใช้ผลิต</label><input type="number" min="0" v-model="fabricStore.fiNewItem.productionDays" placeholder="0" /></div>
          <div class="erp-field"><label>สถานะ</label>
            <select v-model="fabricStore.fiNewItem.active"><option :value="true">Active</option><option :value="false">Inactive</option></select>
          </div>
          <div class="erp-field"><label>สินค้าทดแทน</label>
            <select v-model="fabricStore.fiNewItem.substitute"><option value="no">ไม่มี</option><option value="yes">มี</option></select>
          </div>
          <div class="erp-field"></div>
          <div class="erp-field erp-col-2"><label>รูป</label>
            <div class="fr-file-input">
              <span class="fr-file-name">{{ fabricStore.fiNewItem.imageName || 'ยังไม่ได้เลือกไฟล์' }}</span>
              <button type="button" class="fr-file-btn" @click="$refs.fiFileInput.click()" title="แนบไฟล์รูปภาพ">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              </button>
              <input ref="fiFileInput" type="file" accept="image/*" class="fr-file-hidden" @change="fabricStore.fiHandleFileChange" />
            </div>
          </div>
        </div>
      </fieldset>
      </div>
      <div class="erp-modal-foot">
        <button class="erp-btn erp-btn-cancel" @click="fabricStore.fiCloseModal">{{ fabricStore.fiModalMode === 'view' ? dash.t[dash.lang].close : 'ยกเลิก' }}</button>
        <button v-if="fabricStore.fiModalMode !== 'view'" class="erp-btn erp-btn-save" @click="fabricStore.fiSaveItem">💾 {{ dash.t[dash.lang].save }}</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { useFabricStore } from '../../stores/fabric.js';
export default {
  name: 'FabricIrregularPage',
  inject: ['dash'],
  setup() {
    return { fabricStore: useFabricStore() };
  },
};
</script>
