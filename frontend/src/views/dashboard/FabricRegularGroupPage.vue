<template>
<div class="fr-page-compact">
  <div class="header flex-wrap">
    <div><h1>🏷️ {{ dash.frgPageTitle }}</h1></div>
    <div class="header-actions">
      <button class="btn-small fr-btn-add" @click="dash.frgOpenAdd()">+ เพิ่ม{{ dash.frgPageTitle }}</button>
    </div>
  </div>

  <!-- ตัวกรอง -->
  <div class="section" style="margin-top: 12px;">
    <div class="fr-filter-grid">
      <div class="fr-field-group">
        <label>คำค้นหา</label>
        <input type="text" v-model="dash.frgFilters.search" placeholder="ค้นหาชื่อกลุ่มผ้า" @keyup.enter="dash.frgPage = 1" />
      </div>
      <div class="fr-filter-actions">
        <button class="fr-btn-util fr-btn-search" @click="dash.frgPage = 1">🔍 ค้นหา</button>
        <button class="fr-btn-util fr-btn-reset" @click="dash.frgResetFilters()">↺ รีเซ็ต</button>
      </div>
    </div>
  </div>

  <!-- สรุป + แถบเลือกหลายรายการ -->
  <div class="fr-summary-row">
    <span class="fr-summary-count">พบ {{ dash.frgSortedFilteredItems.length }} รายการ</span>
    <div v-if="dash.frgSelected.length > 0" class="fr-bulk-bar">
      <span>เลือก {{ dash.frgSelected.length }} รายการ</span>
      <button class="fr-bulk-btn" @click="dash.frgBulkDelete()">🗑️ ลบที่เลือก</button>
    </div>
  </div>

  <!-- ตาราง -->
  <div class="section fr-table-section" style="margin-top: 8px; padding: 0; overflow: hidden;">
  <div class="fr-table-scroll">
    <table class="fr-table">
      <thead>
        <tr>
          <th class="fr-th-check"><input type="checkbox" :checked="dash.frgAllSelectedOnPage" @change="dash.frgToggleSelectAll()" /></th>
          <th style="width:48px;">ที่</th>
          <th class="fr-th-sort" @click="dash.frgSort(0)">ชื่อ <span class="fr-sort-icon">{{ dash.frgSortIcon(0) }}</span></th>
          <th class="fr-th-sort" style="width:140px;" @click="dash.frgSort(1)">หน้ากว้าง <span class="fr-sort-icon">{{ dash.frgSortIcon(1) }}</span></th>
          <th class="fr-th-sort" style="width:140px;" @click="dash.frgSort(2)">น้ำหนัก <span class="fr-sort-icon">{{ dash.frgSortIcon(2) }}</span></th>
          <th class="fr-th-sort" style="width:150px;" @click="dash.frgSort(3)">ราคาขายปลีก <span class="fr-sort-icon">{{ dash.frgSortIcon(3) }}</span></th>
          <th class="fr-th-sort" style="width:130px;" @click="dash.frgSort(4)">จำนวนเฉดสี <span class="fr-sort-icon">{{ dash.frgSortIcon(4) }}</span></th>
          <th style="width:130px;">จัดการ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in dash.frgPagedRows" :key="item.id">
          <td><input type="checkbox" :checked="dash.frgSelected.includes(item.id)" @change="dash.frgToggleSelectRow(item)" /></td>
          <td>{{ (dash.frgPage - 1) * dash.frgPageSize + idx + 1 }}</td>
          <td class="fr-td-wrap">{{ item.name || '-' }}</td>
          <td>{{ item.width || '' }}</td>
          <td>{{ item.weight || '' }}</td>
          <td>{{ Number(item.retail_price) ? Number(item.retail_price).toFixed(2) : '' }}</td>
          <td>{{ item.colors || '-' }}</td>
          <td class="frg-actions">
            <button class="frg-ic frg-edit" title="แก้ไข" @click="dash.frgEditItem(item)">✏️</button>
            <button class="frg-ic frg-del" title="ลบ" @click="dash.frgDeleteItem(item)">🗑️</button>
            <button class="frg-ic frg-shade" title="เฉดสี" @click="dash.frgOpenShades(item)">☰</button>
          </td>
        </tr>
        <tr v-if="dash.frgPagedRows.length === 0">
          <td colspan="8" style="text-align:center; padding:24px; color:#94a3b8;">ยังไม่มีข้อมูล{{ dash.frgPageTitle }} — กด "+ เพิ่ม{{ dash.frgPageTitle }}" เพื่อเพิ่มรายการ</td>
        </tr>
      </tbody>
    </table>
  </div>
  </div>

  <!-- เลขหน้า -->
  <div class="xl-pagination" v-if="dash.frgSortedFilteredItems.length > 0">
    <select v-model.number="dash.frgPageSize" class="fr-page-size-select">
      <option :value="15">15 / หน้า</option>
      <option :value="30">30 / หน้า</option>
      <option :value="50">50 / หน้า</option>
    </select>
    <button class="fr-btn-util" :disabled="dash.frgPage === 1" @click="dash.frgPrevPage()">‹ ก่อนหน้า</button>
    <span>หน้า {{ dash.frgPage }} / {{ dash.frgTotalPages }}</span>
    <button class="fr-btn-util" :disabled="dash.frgPage === dash.frgTotalPages" @click="dash.frgNextPage()">ถัดไป ›</button>
  </div>

  <!-- โมดัลเพิ่ม/แก้ไข -->
  <transition name="frg-fade">
    <div v-if="dash.frgShowAddModal" class="frg-overlay" @click.self="dash.frgCloseAddModal()">
      <div class="frg-modal">
        <div class="frg-modal-head">
          <span>{{ dash.frgModalMode === 'edit' ? 'แก้ไข' : 'เพิ่ม' }} {{ dash.frgPageTitle }}</span>
          <button class="frg-x" @click="dash.frgCloseAddModal()">✕</button>
        </div>
        <div class="frg-modal-body">
          <label class="frg-lbl">ชื่อ <span class="frg-req">*</span></label>
          <input class="frg-input" v-model="dash.frgNewItem.name" placeholder="ชื่อกลุ่มผ้า" />
          <label class="frg-lbl">หน้ากว้าง</label>
          <select class="frg-input" v-model="dash.frgNewItem.width">
            <option value="">— เลือก —</option>
            <option v-for="w in dash.frgWidthChoices" :key="w" :value="w">{{ w }}</option>
          </select>
          <label class="frg-lbl">น้ำหนัก</label>
          <select class="frg-input" v-model="dash.frgNewItem.weight">
            <option value="">— เลือก —</option>
            <option v-for="w in dash.frgWeightChoices" :key="w" :value="w">{{ w }}</option>
          </select>
          <label class="frg-lbl">ราคาขายปลีก</label>
          <input class="frg-input" type="number" v-model="dash.frgNewItem.retail_price" placeholder="0.00" />
        </div>
        <div class="frg-modal-foot">
          <button class="frg-btn-save" @click="dash.frgSaveAdd()">💾 บันทึก</button>
        </div>
      </div>
    </div>
  </transition>
</div>
</template>

<script>
export default {
  name: 'FabricRegularGroupPage',
  inject: ['dash'],
};
</script>

<style scoped>
.frg-actions { display: flex; gap: 5px; }
.frg-ic {
  width: 28px; height: 28px; border-radius: 6px; border: 1px solid #e2e8f0;
  background: #fff; cursor: pointer; font-size: 13px; display: grid; place-items: center;
}
.frg-edit:hover { background: #eef2ff; border-color: #c7d2fe; }
.frg-del:hover { background: #fef2f2; border-color: #fecaca; }
.frg-shade:hover { background: #f0fdf4; border-color: #bbf7d0; }

.frg-overlay {
  position: fixed; inset: 0; z-index: 3400; display: flex; align-items: center; justify-content: center;
  background: rgba(15,23,42,0.5); padding: 20px;
  font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif;
}
.frg-modal { background: #fff; border-radius: 12px; width: 440px; max-width: 100%; overflow: hidden; box-shadow: 0 24px 60px rgba(0,0,0,0.3); }
.frg-modal-head { background: #1e3a8a; color: #fff; padding: 13px 18px; font-weight: 700; display: flex; justify-content: space-between; align-items: center; }
.frg-x { background: none; border: none; color: #fff; font-size: 17px; cursor: pointer; }
.frg-modal-body { padding: 18px 20px; }
.frg-lbl { display: block; font-size: 13px; font-weight: 600; color: #334155; margin: 10px 0 4px; }
.frg-lbl:first-child { margin-top: 0; }
.frg-req { color: #a82a3a; }
.frg-input { width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 7px; font-size: 14px; font-family: inherit; outline: none; }
.frg-input:focus { border-color: #1e3a8a; box-shadow: 0 0 0 3px rgba(30,58,138,0.14); }
.frg-modal-foot { display: flex; justify-content: center; gap: 10px; padding: 12px 20px; border-top: 1px solid #e2e8f0; background: #f8fafc; }
.frg-btn-save { padding: 8px 26px; border: none; border-radius: 8px; background: #1a9c54; color: #fff; font-weight: 700; cursor: pointer; font-family: inherit; }
.frg-btn-save:hover { background: #158045; }
.frg-fade-enter-active, .frg-fade-leave-active { transition: opacity 0.2s; }
.frg-fade-enter-from, .frg-fade-leave-to { opacity: 0; }

:global([data-theme="dark"]) .frg-modal { background: #1e293b; }
:global([data-theme="dark"]) .frg-lbl { color: #e2e8f0; }
:global([data-theme="dark"]) .frg-input { background: #0f172a; border-color: #334155; color: #f1f5f9; }
:global([data-theme="dark"]) .frg-modal-foot { background: #172033; border-top-color: #334155; }
:global([data-theme="dark"]) .frg-ic { background: #0f172a; border-color: #334155; }
</style>
