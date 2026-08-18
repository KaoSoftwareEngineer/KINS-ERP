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
        <input type="text" v-model="dash.fiFilters.search" placeholder="ค้นหาชื่อผ้า / รหัสสินค้า" />
      </div>
      <div class="fr-field-group">
        <label>ประเภท</label>
        <select v-model="dash.fiFilters.type">
          <option value="">ทั้งหมด</option>
          <option v-for="opt in dash.fiTypeOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="fr-field-group">
        <label>น้ำหนัก</label>
        <select v-model="dash.fiFilters.weight">
          <option value="">ทั้งหมด</option>
          <option value="light">ต่ำกว่า 150 GSM</option>
          <option value="mid">150 - 250 GSM</option>
          <option value="heavy">มากกว่า 250 GSM</option>
        </select>
      </div>
      <div class="fr-field-group">
        <label>Active</label>
        <select v-model="dash.fiFilters.active">
          <option value="">ทั้งหมด</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div class="fr-field-group">
        <label>รหัสสินค้า</label>
        <div class="fr-sku-range">
          <input type="text" v-model="dash.fiFilters.skuFrom" placeholder="เริ่มต้น" />
          <span>—</span>
          <input type="text" v-model="dash.fiFilters.skuTo" placeholder="สิ้นสุด" />
        </div>
      </div>
      <div class="fr-field-group">
        <label>ส่วนประกอบ</label>
        <select v-model="dash.fiFilters.composition">
          <option value="">ทั้งหมด</option>
          <option v-for="opt in dash.fiCompositionOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="fr-field-group">
        <label>หน้ากว้าง</label>
        <select v-model="dash.fiFilters.width">
          <option value="">ทั้งหมด</option>
          <option v-for="opt in dash.fiWidthOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="fr-field-group fr-checkbox-group">
        <input type="checkbox" id="fiSubstitute" v-model="dash.fiFilters.substitute" />
        <label for="fiSubstitute">สินค้าทดแทน</label>
      </div>
    </div>

    <div class="fr-filter-actions">
      <button class="fr-btn-util fr-btn-search" @click="dash.fiSearch">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        {{ dash.t[dash.lang].searchWord }}
      </button>
      <button class="fr-btn-util fr-btn-reset" @click="dash.fiResetFilters">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 1 3 6.7"/><path d="M3 16v-4h4"/></svg>
        {{ dash.t[dash.lang].resetWord }}
      </button>
    </div>
  </div>

  <div class="fr-summary fr-summary-row">
    <span>{{ dash.t[dash.lang].foundItems }} {{ dash.fiFilteredItems.length }} {{ dash.t[dash.lang].itemsUnit }}</span>
    <div class="fr-summary-actions">
      <button v-if="dash.fiSelected.length > 0" class="btn-small" style="color: var(--danger); border-color: var(--danger);" @click="dash.fiBulkDelete">
        🗑️ ลบที่เลือก ({{ dash.fiSelected.length }})
      </button>
      <button v-if="dash.fiSelected.length > 0" class="btn-small" @click="dash.fiExportExcel(true)">⬇️ ส่งออกที่เลือก</button>
      <button class="btn-small" @click="dash.fiExportExcel(false)">⬇️ ส่งออก Excel</button>
      <button class="btn-small fr-btn-add" @click="dash.fiOpenAdd">+ {{ dash.t[dash.lang].add }} {{ dash.pageTitle('fabric-irregular') }}</button>
    </div>
  </div>

  <div class="section fr-table-section" style="margin-top: 8px; padding: 0; overflow: hidden;">
    <div class="fr-table-scroll">
      <table class="fr-table">
        <thead>
          <tr>
            <th class="fr-th-check"><input type="checkbox" :checked="dash.fiAllSelectedOnPage" @change="dash.fiToggleSelectAll" /></th>
            <th>ที่</th>
            <th class="fr-th-sort" @click="dash.fiSort('type')">ประเภท <span class="fr-sort-icon">{{ dash.fiSortBy === 'type' ? (dash.fiSortDir === 'asc' ? '▲' : '▼') : '' }}</span></th>
            <th class="fr-th-sort" @click="dash.fiSort('sku')">รหัสสินค้า <span class="fr-sort-icon">{{ dash.fiSortBy === 'sku' ? (dash.fiSortDir === 'asc' ? '▲' : '▼') : '' }}</span></th>
            <th class="fr-th-sort" @click="dash.fiSort('colors')">จำนวนสี <span class="fr-sort-icon">{{ dash.fiSortBy === 'colors' ? (dash.fiSortDir === 'asc' ? '▲' : '▼') : '' }}</span></th>
            <th class="fr-th-sort" @click="dash.fiSort('name')">ชื่อ <span class="fr-sort-icon">{{ dash.fiSortBy === 'name' ? (dash.fiSortDir === 'asc' ? '▲' : '▼') : '' }}</span></th>
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
          <tr v-for="(item, idx) in dash.fiPagedItems" :key="item.sku">
            <td><input type="checkbox" :checked="dash.fiSelected.includes(item.sku)" @change="dash.fiToggleSelect(item.sku)" /></td>
            <td>{{ (dash.fiPage - 1) * dash.fiPageSize + idx + 1 }}</td>
            <td>{{ item.type }}</td>
            <td><strong>{{ item.sku }}</strong></td>
            <td>
              <button class="fr-color-badge" @click="dash.fiOpenShades(item)" title="จัดการเฉดสี">
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
                <button class="fr-action-btn edit" title="แก้ไข" @click="dash.fiEditItem(item)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                </button>
                <button class="fr-action-btn delete" title="ลบ" @click="dash.fiDeleteItem(item)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>
                </button>
                <button class="fr-action-btn view" title="ดูรายละเอียด" @click="dash.fiViewItem(item)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="dash.fiLoading" class="fr-empty-row">
            <td colspan="14">กำลังโหลดข้อมูล...</td>
          </tr>
          <tr v-else-if="dash.fiFilteredItems.length === 0" class="fr-empty-row">
            <td colspan="14">ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="xl-pagination" v-if="dash.fiFilteredItems.length > 0">
      <select v-model.number="dash.fiPageSize" class="fr-page-size-select">
        <option :value="10">10 / หน้า</option>
        <option :value="20">20 / หน้า</option>
        <option :value="50">50 / หน้า</option>
        <option :value="100">100 / หน้า</option>
      </select>
      <button class="fr-btn-util" :disabled="dash.fiPage === 1" @click="dash.fiPrevPage">‹ ก่อนหน้า</button>
      <span><strong>หน้า {{ dash.fiPage }} / {{ dash.fiTotalPages }}</strong> — แสดง {{ (dash.fiPage - 1) * dash.fiPageSize + 1 }}-{{ Math.min(dash.fiPage * dash.fiPageSize, dash.fiFilteredItems.length) }} จากทั้งหมด {{ dash.fiFilteredItems.length }} รายการ</span>
      <button class="fr-btn-util" :disabled="dash.fiPage === dash.fiTotalPages" @click="dash.fiNextPage">ถัดไป ›</button>
    </div>
  </div>

  <!-- ============ Modal: เพิ่ม/แก้ไข ผ้าไม่ประจำ ============ -->
  <div class="fr-modal-overlay" v-if="dash.fiShowModal" @click.self="dash.fiCloseModal">
    <div class="fr-modal">
      <div class="fr-modal-header">
        <h3>{{ dash.fiModalMode === 'edit' ? dash.t[dash.lang].edit : dash.fiModalMode === 'view' ? dash.t[dash.lang].viewDetails : dash.t[dash.lang].add }} {{ dash.pageTitle('fabric-irregular') }}</h3>
        <button class="fr-modal-close" @click="dash.fiCloseModal" title="ปิด">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <fieldset :disabled="dash.fiModalMode === 'view'" class="fr-modal-body">
        <div class="fr-form-row">
          <label>ประเภท <span class="fr-required">*</span></label>
          <select v-model="dash.fiNewItem.type">
            <option value="">เลือกประเภท</option>
            <option v-for="opt in dash.fiTypeOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </div>
        <div class="fr-form-row">
          <label>รหัสสินค้า <span class="fr-required">*</span></label>
          <input type="text" v-model="dash.fiNewItem.sku" placeholder="เช่น FI-SAT01" />
        </div>
        <div class="fr-form-row">
          <label>ชื่อ</label>
          <input type="text" v-model="dash.fiNewItem.name" placeholder="ชื่อผ้า" />
        </div>
        <div class="fr-form-row">
          <label>โครงสร้างผ้า</label>
          <select v-model="dash.fiNewItem.structure">
            <option value="">เลือกโครงสร้างผ้า</option>
            <option v-for="opt in dash.fiStructureOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </div>
        <div class="fr-form-row">
          <label>ส่วนประกอบ</label>
          <select v-model="dash.fiNewItem.composition">
            <option value="">เลือกส่วนประกอบ</option>
            <option v-for="opt in dash.fiCompositionOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </div>
        <div class="fr-form-row">
          <label>หน้ากว้าง <span class="fr-required">*</span></label>
          <select v-model="dash.fiNewItem.width">
            <option value="">เลือกหน้ากว้าง</option>
            <option v-for="opt in dash.fiWidthOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </div>
        <div class="fr-form-row">
          <label>Finishing</label>
          <select v-model="dash.fiNewItem.finishing">
            <option value="">เลือก Finishing</option>
            <option v-for="opt in dash.fiFinishingOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </div>
        <div class="fr-form-row">
          <label>น้ำหนัก</label>
          <select v-model="dash.fiNewItem.weight">
            <option value="">เลือกน้ำหนัก</option>
            <option v-for="opt in dash.fiWeightOptions" :key="opt" :value="opt">{{ opt }} GSM</option>
          </select>
        </div>
        <div class="fr-form-row">
          <label>หน่วย</label>
          <select v-model="dash.fiNewItem.unit">
            <option v-for="opt in dash.frUnitOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </div>
        <div class="fr-form-row">
          <label>คำอธิบาย</label>
          <input type="text" v-model="dash.fiNewItem.description" placeholder="คำอธิบายเพิ่มเติม" />
        </div>
        <div class="fr-form-row">
          <label>จำนวนวันที่ใช้ผลิต</label>
          <input type="number" min="0" v-model="dash.fiNewItem.productionDays" placeholder="0" />
        </div>
        <div class="fr-form-row">
          <label>รูป</label>
          <div class="fr-file-input">
            <span class="fr-file-name">{{ dash.fiNewItem.imageName || 'ยังไม่ได้เลือกไฟล์' }}</span>
            <button type="button" class="fr-file-btn" @click="$refs.fiFileInput.click()" title="แนบไฟล์รูปภาพ">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            </button>
            <input ref="fiFileInput" type="file" accept="image/*" class="fr-file-hidden" @change="dash.fiHandleFileChange" />
          </div>
        </div>
        <div class="fr-form-row">
          <label>สินค้าทดแทน</label>
          <select v-model="dash.fiNewItem.substitute">
            <option value="no">ไม่มี</option>
            <option value="yes">มี</option>
          </select>
        </div>
        <div class="fr-form-row">
          <label>Active</label>
          <input type="checkbox" class="fr-active-checkbox" v-model="dash.fiNewItem.active" />
        </div>
      </fieldset>

      <div class="fr-modal-footer">
        <button v-if="dash.fiModalMode === 'view'" class="fr-btn-save" @click="dash.fiCloseModal">
          {{ dash.t[dash.lang].close }}
        </button>
        <button v-else class="fr-btn-save" @click="dash.fiSaveItem">
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
  name: 'FabricIrregularPage',
  inject: ['dash'],
};
</script>
