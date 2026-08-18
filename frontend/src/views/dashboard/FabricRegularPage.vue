<template>
<div class="fr-page-compact">
  <div class="header flex-wrap">
    <div>
      <h1>🧵 {{ dash.pageTitle('fabric-regular') }}</h1>
    </div>
  </div>

  <div class="section" style="margin-top: 12px;">
    <div class="section-header" style="margin-bottom: 12px; padding-bottom: 10px;">
      <h2>{{ dash.t[dash.lang].searchFilter }}</h2>
    </div>
    <div class="fr-filter-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[18px] gap-y-[14px]">
      <div class="fr-field-group">
        <label>คำค้นหา</label>
        <input type="text" v-model="dash.frFilters.search" placeholder="ค้นหาชื่อผ้า / รหัสสินค้า" />
      </div>
      <div class="fr-field-group">
        <label>ประเภท</label>
        <select v-model="dash.frFilters.type">
          <option value="">ทั้งหมด</option>
          <option v-for="opt in dash.frTypeOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="fr-field-group">
        <label>น้ำหนัก</label>
        <select v-model="dash.frFilters.weight">
          <option value="">ทั้งหมด</option>
          <option value="light">ต่ำกว่า 150 GSM</option>
          <option value="mid">150 - 250 GSM</option>
          <option value="heavy">มากกว่า 250 GSM</option>
        </select>
      </div>
      <div class="fr-field-group">
        <label>Active</label>
        <select v-model="dash.frFilters.active">
          <option value="">ทั้งหมด</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div class="fr-field-group">
        <label>รหัสสินค้า</label>
        <div class="fr-sku-range">
          <input type="text" v-model="dash.frFilters.skuFrom" placeholder="เริ่มต้น" />
          <span>—</span>
          <input type="text" v-model="dash.frFilters.skuTo" placeholder="สิ้นสุด" />
        </div>
      </div>
      <div class="fr-field-group">
        <label>ส่วนประกอบ</label>
        <select v-model="dash.frFilters.composition">
          <option value="">ทั้งหมด</option>
          <option v-for="opt in dash.frCompositionOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="fr-field-group">
        <label>หน้ากว้าง</label>
        <select v-model="dash.frFilters.width">
          <option value="">ทั้งหมด</option>
          <option v-for="opt in dash.frWidthOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="fr-field-group fr-checkbox-group">
        <input type="checkbox" id="frSubstitute" v-model="dash.frFilters.substitute" />
        <label for="frSubstitute">สินค้าทดแทน</label>
      </div>
    </div>

    <div class="fr-filter-actions">
      <button class="fr-btn-util fr-btn-search" @click="dash.frSearch">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        {{ dash.t[dash.lang].searchWord }}
      </button>
      <button class="fr-btn-util fr-btn-reset" @click="dash.frResetFilters">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 1 3 6.7"/><path d="M3 16v-4h4"/></svg>
        {{ dash.t[dash.lang].resetWord }}
      </button>
    </div>
  </div>

  <div class="fr-summary fr-summary-row">
    <span>{{ dash.t[dash.lang].foundItems }} {{ dash.frFilteredItems.length }} {{ dash.t[dash.lang].itemsUnit }}</span>
    <div class="fr-summary-actions">
      <button class="btn-small" @click="dash.frExportExcel(false)">⬇️ ส่งออก Excel</button>
      <button class="btn-small fr-btn-add" @click="dash.frOpenAdd">+ {{ dash.t[dash.lang].add }} {{ dash.pageTitle('fabric-regular') }}</button>
    </div>
  </div>

  <!-- ============ แถบ Action ด่วน (แสดงเมื่อเลือกรายการ) ============ -->
  <transition name="fr-bulk-fade">
    <div class="fr-bulk-bar" v-if="dash.frSelected.length > 0">
      <span class="fr-bulk-count">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        เลือกไว้ <strong>{{ dash.frSelected.length }}</strong> รายการ
      </span>
      <div class="fr-bulk-actions">
        <button class="fr-bulk-btn danger" @click="dash.frBulkDelete">🗑️ ลบรายการที่เลือก ({{ dash.frSelected.length }})</button>
        <button class="fr-bulk-btn" @click="dash.frPrintBarcode">🏷️ พิมพ์บาร์โค้ด</button>
        <button class="fr-bulk-btn" @click="dash.frExportExcel(true)">⬇️ ส่งออกที่เลือก</button>
        <button class="fr-bulk-btn ghost" @click="dash.frClearSelection">✕ ยกเลิกการเลือก</button>
      </div>
    </div>
  </transition>

  <div class="section fr-table-section" style="margin-top: 8px; padding: 0; overflow: hidden;">
    <div class="fr-table-scroll">
      <table class="fr-table">
        <thead>
          <tr>
            <th class="fr-th-check"><input type="checkbox" :checked="dash.frAllSelectedOnPage" @change="dash.frToggleSelectAll" /></th>
            <th>ที่</th>
            <th class="fr-th-sort" @click="dash.frSort('type')" title="คลิกเพื่อเรียงลำดับ">ประเภท <span class="fr-sort-icon" :class="{ active: dash.frSortBy === 'type' }">{{ dash.frSortIcon('type') }}</span></th>
            <th class="fr-th-sort" @click="dash.frSort('sku')" title="คลิกเพื่อเรียงลำดับ">รหัสสินค้า <span class="fr-sort-icon" :class="{ active: dash.frSortBy === 'sku' }">{{ dash.frSortIcon('sku') }}</span></th>
            <th class="fr-th-sort" @click="dash.frSort('colors')" title="คลิกเพื่อเรียงลำดับ">จำนวนสี <span class="fr-sort-icon" :class="{ active: dash.frSortBy === 'colors' }">{{ dash.frSortIcon('colors') }}</span></th>
            <th class="fr-th-sort" @click="dash.frSort('name')" title="คลิกเพื่อเรียงลำดับ">ชื่อ <span class="fr-sort-icon" :class="{ active: dash.frSortBy === 'name' }">{{ dash.frSortIcon('name') }}</span></th>
            <th class="fr-th-sort" @click="dash.frSort('structure')" title="คลิกเพื่อเรียงลำดับ">โครงสร้างผ้า <span class="fr-sort-icon" :class="{ active: dash.frSortBy === 'structure' }">{{ dash.frSortIcon('structure') }}</span></th>
            <th class="fr-th-sort" @click="dash.frSort('composition')" title="คลิกเพื่อเรียงลำดับ">ส่วนประกอบ <span class="fr-sort-icon" :class="{ active: dash.frSortBy === 'composition' }">{{ dash.frSortIcon('composition') }}</span></th>
            <th class="fr-th-sort" @click="dash.frSort('width')" title="คลิกเพื่อเรียงลำดับ">หน้ากว้าง <span class="fr-sort-icon" :class="{ active: dash.frSortBy === 'width' }">{{ dash.frSortIcon('width') }}</span></th>
            <th class="fr-th-sort" @click="dash.frSort('finishing')" title="คลิกเพื่อเรียงลำดับ">Finishing <span class="fr-sort-icon" :class="{ active: dash.frSortBy === 'finishing' }">{{ dash.frSortIcon('finishing') }}</span></th>
            <th class="fr-th-sort" @click="dash.frSort('weight')" title="คลิกเพื่อเรียงลำดับ">น้ำหนัก <span class="fr-sort-icon" :class="{ active: dash.frSortBy === 'weight' }">{{ dash.frSortIcon('weight') }}</span></th>
            <th class="fr-th-sort" @click="dash.frSort('unit')" title="คลิกเพื่อเรียงลำดับ">หน่วย <span class="fr-sort-icon" :class="{ active: dash.frSortBy === 'unit' }">{{ dash.frSortIcon('unit') }}</span></th>
            <th>รูป</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in dash.frPagedItems" :key="item.sku">
            <td><input type="checkbox" :checked="dash.frSelected.includes(item.sku)" @change="dash.frToggleSelect(item.sku)" /></td>
            <td>{{ (dash.frPage - 1) * dash.frPageSize + idx + 1 }}</td>
            <td>{{ item.type }}</td>
            <td><strong>{{ item.sku }}</strong></td>
            <td>
              <button class="fr-color-badge" @click="dash.frOpenShades(item)" title="จัดการเฉดสี">
                {{ item.colors }} 🎨
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
                <button class="fr-action-btn edit" title="แก้ไข" @click="dash.frEditItem(item)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                </button>
                <button class="fr-action-btn delete" title="ลบ" @click="dash.frDeleteItem(item)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>
                </button>
                <button class="fr-action-btn view" title="ดูรายละเอียด" @click="dash.frViewItem(item)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="dash.frLoading" class="fr-empty-row">
            <td colspan="14">กำลังโหลดข้อมูล...</td>
          </tr>
          <tr v-else-if="dash.frFilteredItems.length === 0" class="fr-empty-row">
            <td colspan="14">ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="xl-pagination" v-if="dash.frFilteredItems.length > 0">
      <select v-model.number="dash.frPageSize" class="fr-page-size-select">
        <option :value="10">10 / หน้า</option>
        <option :value="20">20 / หน้า</option>
        <option :value="50">50 / หน้า</option>
        <option :value="100">100 / หน้า</option>
      </select>
      <button class="fr-btn-util" :disabled="dash.frPage === 1" @click="dash.frPrevPage">‹ ก่อนหน้า</button>
      <span><strong>หน้า {{ dash.frPage }} / {{ dash.frTotalPages }}</strong> — แสดง {{ (dash.frPage - 1) * dash.frPageSize + 1 }}-{{ Math.min(dash.frPage * dash.frPageSize, dash.frFilteredItems.length) }} จากทั้งหมด {{ dash.frFilteredItems.length }} รายการ</span>
      <button class="fr-btn-util" :disabled="dash.frPage === dash.frTotalPages" @click="dash.frNextPage">ถัดไป ›</button>
    </div>
  </div>

  <!-- ============ Modal: เพิ่ม ผ้าประจำ ============ -->
  <div class="fr-modal-overlay" v-if="dash.frShowAddModal" @click.self="dash.frCloseAddModal">
    <div class="fr-modal">
      <div class="fr-modal-header">
        <h3>{{ dash.frModalMode === 'edit' ? dash.t[dash.lang].edit : dash.frModalMode === 'view' ? dash.t[dash.lang].viewDetails : dash.t[dash.lang].add }} {{ dash.pageTitle('fabric-regular') }}</h3>
        <button class="fr-modal-close" @click="dash.frCloseAddModal" title="ปิด">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <fieldset :disabled="dash.frModalMode === 'view'" class="fr-modal-body">
        <div class="fr-form-row">
          <label>ประเภท <span class="fr-required">*</span></label>
          <select v-model="dash.frNewItem.type">
            <option value="">เลือกประเภท</option>
            <option v-for="opt in dash.frTypeOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </div>
        <div class="fr-form-row">
          <label>รหัสสินค้า <span class="fr-required">*</span></label>
          <input type="text" v-model="dash.frNewItem.sku" placeholder="เช่น 100S03" />
        </div>
        <div class="fr-form-row">
          <label>ชื่อ</label>
          <input type="text" v-model="dash.frNewItem.name" placeholder="ชื่อผ้า" />
        </div>
        <div class="fr-form-row">
          <label>โครงสร้างผ้า</label>
          <select v-model="dash.frNewItem.structure">
            <option value="">เลือกโครงสร้างผ้า</option>
            <option v-for="opt in dash.frStructureOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </div>
        <div class="fr-form-row">
          <label>ส่วนประกอบ</label>
          <select v-model="dash.frNewItem.composition">
            <option value="">เลือกส่วนประกอบ</option>
            <option v-for="opt in dash.frCompositionOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </div>
        <div class="fr-form-row">
          <label>หน้ากว้าง <span class="fr-required">*</span></label>
          <select v-model="dash.frNewItem.width">
            <option value="">เลือกหน้ากว้าง</option>
            <option v-for="opt in dash.frWidthOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </div>
        <div class="fr-form-row">
          <label>Finishing</label>
          <select v-model="dash.frNewItem.finishing">
            <option value="">เลือก Finishing</option>
            <option v-for="opt in dash.frFinishingOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </div>
        <div class="fr-form-row">
          <label>น้ำหนัก</label>
          <select v-model="dash.frNewItem.weight">
            <option value="">เลือกน้ำหนัก</option>
            <option v-for="opt in dash.frWeightOptions" :key="opt" :value="opt">{{ opt }} GSM</option>
          </select>
        </div>
        <div class="fr-form-row">
          <label>หน่วย</label>
          <select v-model="dash.frNewItem.unit">
            <option v-for="opt in dash.frUnitOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </div>
        <div class="fr-form-row">
          <label>คำอธิบาย</label>
          <input type="text" v-model="dash.frNewItem.description" placeholder="คำอธิบายเพิ่มเติม" />
        </div>
        <div class="fr-form-row">
          <label>จำนวนวันที่ใช้ผลิต</label>
          <input type="number" min="0" v-model="dash.frNewItem.productionDays" placeholder="0" />
        </div>
        <div class="fr-form-row">
          <label>รูป</label>
          <div class="fr-file-input">
            <span class="fr-file-name">{{ dash.frNewItem.imageName || 'ยังไม่ได้เลือกไฟล์' }}</span>
            <button type="button" class="fr-file-btn" @click="$refs.frFileInput.click()" title="แนบไฟล์รูปภาพ">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            </button>
            <input ref="frFileInput" type="file" accept="image/*" class="fr-file-hidden" @change="dash.frHandleFileChange" />
          </div>
        </div>
        <div class="fr-form-row">
          <label>สินค้าทดแทน</label>
          <select v-model="dash.frNewItem.substitute">
            <option value="no">ไม่มี</option>
            <option value="yes">มี</option>
          </select>
        </div>
        <div class="fr-form-row">
          <label>Active</label>
          <input type="checkbox" class="fr-active-checkbox" v-model="dash.frNewItem.active" />
        </div>
      </fieldset>

      <div class="fr-modal-footer">
        <button v-if="dash.frModalMode === 'view'" class="fr-btn-save" @click="dash.frCloseAddModal">
          {{ dash.t[dash.lang].close }}
        </button>
        <button v-else class="fr-btn-save" @click="dash.frSaveAdd">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          {{ dash.t[dash.lang].save }}
        </button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'FabricRegularPage',
  inject: ['dash'],
};
</script>
