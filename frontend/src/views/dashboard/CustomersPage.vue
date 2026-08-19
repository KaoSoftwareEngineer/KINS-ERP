<template>
<div class="fr-page-compact">
  <div class="header flex-wrap">
    <div>
      <h1>🧑‍🤝‍🧑 {{ dash.pageTitle('customers') }}</h1>
    </div>
  </div>

  <div class="section" style="margin-top: 12px;">
    <div class="section-header" style="margin-bottom: 12px; padding-bottom: 10px;">
      <h2>{{ dash.t[dash.lang].searchFilter }}</h2>
    </div>
    <div class="fr-filter-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[18px] gap-y-[14px]">
      <div class="fr-field-group">
        <label>คำค้นหา</label>
        <input type="text" v-model="dash.cuFilters.search" placeholder="ค้นหาชื่อบริษัท / ผู้ติดต่อ / เบอร์โทร / ที่อยู่" />
      </div>
      <div class="fr-field-group">
        <label>กลุ่มลูกค้า</label>
        <select v-model="dash.cuFilters.group">
          <option value="">ทั้งหมด</option>
          <option v-for="opt in dash.cuGroupOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="fr-field-group">
        <label>จังหวัด</label>
        <select v-model="dash.cuFilters.province">
          <option value="">ทั้งหมด</option>
          <option v-for="opt in dash.cuProvinceOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="fr-field-group">
        <label>โซน</label>
        <select v-model="dash.cuFilters.zone">
          <option value="">ทั้งหมด</option>
          <option v-for="opt in dash.cuZoneOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="fr-field-group">
        <label>เงื่อนไขบัญชี</label>
        <select v-model="dash.cuFilters.accountTerms">
          <option value="">ทั้งหมด</option>
          <option v-for="opt in dash.cuAccountTermsOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="fr-field-group">
        <label>เงื่อนไขเงินสด</label>
        <select v-model="dash.cuFilters.cashTerms">
          <option value="">ทั้งหมด</option>
          <option v-for="opt in dash.cuCashTermsOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="fr-field-group">
        <label>พนักงานขาย</label>
        <select v-model="dash.cuFilters.salesperson">
          <option value="">ทั้งหมด</option>
          <option v-for="opt in dash.cuSalespersonOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
    </div>

    <div class="fr-filter-actions">
      <button class="fr-btn-util fr-btn-search" @click="dash.cuSearch">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        {{ dash.t[dash.lang].searchWord }}
      </button>
      <button class="fr-btn-util fr-btn-reset" @click="dash.cuResetFilters">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 1 3 6.7"/><path d="M3 16v-4h4"/></svg>
        {{ dash.t[dash.lang].resetWord }}
      </button>
    </div>
  </div>

  <div class="fr-summary fr-summary-row">
    <span>{{ dash.t[dash.lang].foundItems }} {{ dash.cuFilteredItems.length }} {{ dash.t[dash.lang].itemsUnit }}</span>
    <div class="fr-summary-actions">
      <button class="btn-small" @click="dash.cuExportExcel(false)">⬇️ ส่งออก Excel</button>
      <button class="btn-small fr-btn-add" @click="dash.cuOpenAdd">+ เพิ่ม ลูกค้า</button>
    </div>
  </div>

  <transition name="fr-bulk-fade">
    <div class="fr-bulk-bar" v-if="dash.cuSelected.length > 0">
      <span class="fr-bulk-count">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        เลือกไว้ <strong>{{ dash.cuSelected.length }}</strong> รายการ
      </span>
      <div class="fr-bulk-actions">
        <button class="fr-bulk-btn danger" @click="dash.cuBulkDelete">🗑️ ลบรายการที่เลือก ({{ dash.cuSelected.length }})</button>
        <button class="fr-bulk-btn" @click="dash.cuExportExcel(true)">⬇️ ส่งออกที่เลือก</button>
        <button class="fr-bulk-btn ghost" @click="dash.cuClearSelection">✕ ยกเลิกการเลือก</button>
      </div>
    </div>
  </transition>

  <div class="section fr-table-section" style="margin-top: 8px; padding: 0; overflow: hidden;">
    <div class="fr-table-scroll">
      <table class="fr-table">
        <thead>
          <tr>
            <th class="fr-th-check"><input type="checkbox" :checked="dash.cuAllSelectedOnPage" @change="dash.cuToggleSelectAll" /></th>
            <th>ที่</th>
            <th class="fr-th-sort" @click="dash.cuSort('company_name')" title="คลิกเพื่อเรียงลำดับ">ชื่อบริษัท <span class="fr-sort-icon" :class="{ active: dash.cuSortBy === 'company_name' }">{{ dash.cuSortIcon('company_name') }}</span></th>
            <th class="fr-th-sort" @click="dash.cuSort('contact')" title="คลิกเพื่อเรียงลำดับ">ผู้ติดต่อ <span class="fr-sort-icon" :class="{ active: dash.cuSortBy === 'contact' }">{{ dash.cuSortIcon('contact') }}</span></th>
            <th class="fr-th-sort" @click="dash.cuSort('phone')" title="คลิกเพื่อเรียงลำดับ">เบอร์โทร <span class="fr-sort-icon" :class="{ active: dash.cuSortBy === 'phone' }">{{ dash.cuSortIcon('phone') }}</span></th>
            <th>ที่อยู่</th>
            <th class="fr-th-sort" @click="dash.cuSort('customer_group')" title="คลิกเพื่อเรียงลำดับ">กลุ่มลูกค้า <span class="fr-sort-icon" :class="{ active: dash.cuSortBy === 'customer_group' }">{{ dash.cuSortIcon('customer_group') }}</span></th>
            <th class="fr-th-sort" @click="dash.cuSort('zone')" title="คลิกเพื่อเรียงลำดับ">โซน <span class="fr-sort-icon" :class="{ active: dash.cuSortBy === 'zone' }">{{ dash.cuSortIcon('zone') }}</span></th>
            <th class="fr-th-sort" @click="dash.cuSort('account_terms')" title="คลิกเพื่อเรียงลำดับ">เงื่อนไขบัญชี <span class="fr-sort-icon" :class="{ active: dash.cuSortBy === 'account_terms' }">{{ dash.cuSortIcon('account_terms') }}</span></th>
            <th class="fr-th-sort" @click="dash.cuSort('cash_terms')" title="คลิกเพื่อเรียงลำดับ">เงื่อนไขเงินสด <span class="fr-sort-icon" :class="{ active: dash.cuSortBy === 'cash_terms' }">{{ dash.cuSortIcon('cash_terms') }}</span></th>
            <th>สกุลเงิน</th>
            <th>วงเงิน</th>
            <th class="fr-th-sort" @click="dash.cuSort('salesperson')" title="คลิกเพื่อเรียงลำดับ">พนักงานขาย <span class="fr-sort-icon" :class="{ active: dash.cuSortBy === 'salesperson' }">{{ dash.cuSortIcon('salesperson') }}</span></th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in dash.cuPagedItems" :key="item.id">
            <td><input type="checkbox" :checked="dash.cuSelected.includes(item.id)" @change="dash.cuToggleSelect(item.id)" /></td>
            <td>{{ (dash.cuPage - 1) * dash.cuPageSize + idx + 1 }}</td>
            <td class="fr-td-wrap"><span class="fr-clamp"><strong>{{ item.company_name }}</strong></span></td>
            <td>{{ item.contact }}</td>
            <td>{{ item.phone }}</td>
            <td class="fr-td-wrap"><span class="fr-clamp">{{ item.address }}</span></td>
            <td>{{ item.customer_group }}</td>
            <td>{{ item.zone }}</td>
            <td>{{ item.account_terms }}</td>
            <td>{{ item.cash_terms }}</td>
            <td>{{ item.currency }}</td>
            <td>{{ item.credit_limit }}</td>
            <td>{{ item.salesperson }}</td>
            <td>
              <div class="fr-action-group">
                <button class="fr-action-btn edit" title="แก้ไข" @click="dash.cuEditItem(item)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                </button>
                <button class="fr-action-btn delete" title="ลบ" @click="dash.cuDeleteItem(item)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>
                </button>
                <button class="fr-action-btn view" title="ดูรายละเอียด" @click="dash.cuViewItem(item)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="dash.cuLoading" class="fr-empty-row">
            <td colspan="14">กำลังโหลดข้อมูล...</td>
          </tr>
          <tr v-else-if="dash.cuFilteredItems.length === 0" class="fr-empty-row">
            <td colspan="14">ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="xl-pagination" v-if="dash.cuFilteredItems.length > 0">
      <select v-model.number="dash.cuPageSize" class="fr-page-size-select">
        <option :value="10">10 / หน้า</option>
        <option :value="20">20 / หน้า</option>
        <option :value="50">50 / หน้า</option>
        <option :value="100">100 / หน้า</option>
      </select>
      <button class="fr-btn-util" :disabled="dash.cuPage === 1" @click="dash.cuPrevPage">‹ ก่อนหน้า</button>
      <span><strong>หน้า {{ dash.cuPage }} / {{ dash.cuTotalPages }}</strong> — แสดง {{ (dash.cuPage - 1) * dash.cuPageSize + 1 }}-{{ Math.min(dash.cuPage * dash.cuPageSize, dash.cuFilteredItems.length) }} จากทั้งหมด {{ dash.cuFilteredItems.length }} รายการ</span>
      <button class="fr-btn-util" :disabled="dash.cuPage === dash.cuTotalPages" @click="dash.cuNextPage">ถัดไป ›</button>
    </div>
  </div>

  <!-- ============ Modal: เพิ่ม/แก้ไข ลูกค้า (ERP มาตรฐานกลาง) ============ -->
  <div class="erp-overlay" v-if="dash.cuShowAddModal" @click.self="dash.cuCloseAddModal">
    <div class="erp-modal">
      <div class="erp-modal-head">
        <span><span class="erp-head-ic">🧑‍💼</span> {{ dash.cuModalMode === 'edit' ? 'แก้ไข' : dash.cuModalMode === 'view' ? 'รายละเอียด' : 'เพิ่ม' }} ลูกค้า</span>
        <button class="erp-x" @click="dash.cuCloseAddModal" title="ปิด">✕</button>
      </div>
      <fieldset :disabled="dash.cuModalMode === 'view'" class="erp-modal-body" style="border:0;margin:0;min-width:0;">
        <div class="erp-sec-title"><span class="erp-sec-bar"></span>ข้อมูลลูกค้า</div>
        <div class="erp-grid">
          <div class="erp-field"><label>รหัสลูกค้า</label><input type="text" v-model="dash.cuNewItem.code" placeholder="รหัส (เว้นว่างได้)" /></div>
          <div class="erp-field"><label>ชื่อบริษัท <span class="erp-req">*</span></label><input type="text" v-model="dash.cuNewItem.company_name" placeholder="ชื่อบริษัท / ร้าน" /></div>
          <div class="erp-field"><label>ผู้ติดต่อ</label><input type="text" v-model="dash.cuNewItem.contact" placeholder="ชื่อผู้ติดต่อ" /></div>
          <div class="erp-field"><label>เบอร์โทร</label><input type="text" v-model="dash.cuNewItem.phone" placeholder="เบอร์โทรศัพท์" /></div>
          <div class="erp-field erp-col-2"><label>ที่อยู่</label><input type="text" v-model="dash.cuNewItem.address" placeholder="ที่อยู่" /></div>
          <div class="erp-field"><label>จังหวัด</label><input type="text" v-model="dash.cuNewItem.province" placeholder="จังหวัด" /></div>
          <div class="erp-field"><label>กลุ่มลูกค้า</label><input type="text" v-model="dash.cuNewItem.customer_group" placeholder="กลุ่มลูกค้า" /></div>
          <div class="erp-field"><label>โซน</label><input type="text" v-model="dash.cuNewItem.zone" placeholder="โซน" /></div>
        </div>
        <div class="erp-sec-title"><span class="erp-sec-bar"></span>เงื่อนไขการค้า / การเงิน</div>
        <div class="erp-grid">
          <div class="erp-field"><label>เงื่อนไขบัญชี</label><input type="text" v-model="dash.cuNewItem.account_terms" placeholder="เช่น 30 Days" /></div>
          <div class="erp-field"><label>เงื่อนไขเงินสด</label><input type="text" v-model="dash.cuNewItem.cash_terms" placeholder="เช่น ปกติ" /></div>
          <div class="erp-field"><label>สกุลเงิน</label><input type="text" v-model="dash.cuNewItem.currency" placeholder="THB" /></div>
          <div class="erp-field"><label>วงเงิน</label><input type="text" v-model="dash.cuNewItem.credit_limit" placeholder="วงเงิน" /></div>
          <div class="erp-field"><label>พนักงานขาย</label><input type="text" v-model="dash.cuNewItem.salesperson" placeholder="พนักงานขาย" /></div>
          <div class="erp-field"><label>เลขผู้เสียภาษี</label><input type="text" v-model="dash.cuNewItem.tax_id" placeholder="เลขประจำตัวผู้เสียภาษี" /></div>
        </div>
      </fieldset>
      <div class="erp-modal-foot">
        <button class="erp-btn erp-btn-cancel" @click="dash.cuCloseAddModal">{{ dash.cuModalMode === 'view' ? 'ปิด' : 'ยกเลิก' }}</button>
        <button v-if="dash.cuModalMode !== 'view'" class="erp-btn erp-btn-save" @click="dash.cuSaveAdd">💾 บันทึก</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'CustomersPage',
  inject: ['dash'],
};
</script>
