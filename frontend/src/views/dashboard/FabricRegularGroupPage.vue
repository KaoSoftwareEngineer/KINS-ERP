<template>
<div class="fr-page-compact">
  <div class="header flex-wrap">
    <div><h1>🏷️ {{ frgTitle }}</h1></div>
    <div class="header-actions">
      <button class="btn-small fr-btn-add" @click="fabricStore.frgOpenAdd()">{{ dash.lang === 'th' ? '+ เพิ่ม' + frgTitle : '+ Add ' + frgTitle }}</button>
    </div>
  </div>

  <!-- ตัวกรอง -->
  <div class="section" style="margin-top: 12px;">
    <div class="fr-filter-grid">
      <div class="fr-field-group">
        <label>{{ dash.t[dash.lang].searchInput }}</label>
        <input type="text" v-model="fabricStore.frgFilters.search" :placeholder="dash.t[dash.lang].searchGroupPlaceholder" @keyup.enter="fabricStore.frgPage = 1" />
      </div>
      <div class="fr-filter-actions">
        <button class="fr-btn-util fr-btn-search" @click="fabricStore.frgPage = 1">🔍 {{ dash.t[dash.lang].searchWord }}</button>
        <button class="fr-btn-util fr-btn-reset" @click="fabricStore.frgResetFilters()">↺ {{ dash.t[dash.lang].resetWord }}</button>
      </div>
    </div>
  </div>

  <!-- สรุป + แถบเลือกหลายรายการ -->
  <div class="fr-summary-row">
    <span class="fr-summary-count">{{ dash.t[dash.lang].foundItems }} {{ fabricStore.frgSortedFilteredItems.length }} {{ dash.t[dash.lang].itemsUnit }}</span>
    <div v-if="fabricStore.frgSelected.length > 0" class="fr-bulk-bar">
      <span>{{ dash.t[dash.lang].selectedCountWord }} {{ fabricStore.frgSelected.length }} {{ dash.t[dash.lang].itemsUnit }}</span>
      <button class="fr-bulk-btn" @click="fabricStore.frgBulkDelete()">🗑️ {{ dash.t[dash.lang].deleteSelected }}</button>
    </div>
  </div>

  <!-- ตาราง -->
  <div class="section fr-table-section" style="margin-top: 8px; padding: 0; overflow: hidden;">
  <div class="fr-table-scroll">
    <table class="fr-table">
      <thead>
        <tr>
          <th class="fr-th-check"><input type="checkbox" :checked="fabricStore.frgAllSelectedOnPage" @change="fabricStore.frgToggleSelectAll()" /></th>
          <th style="width:48px;">{{ dash.lang === 'th' ? 'ที่' : 'No.' }}</th>
          <th class="fr-th-sort" @click="fabricStore.frgSort(0)">{{ dash.t[dash.lang].nameLabel }} <span class="fr-sort-icon">{{ fabricStore.frgSortIcon(0) }}</span></th>
          <th class="fr-th-sort" style="width:140px;" @click="fabricStore.frgSort(1)">{{ dash.t[dash.lang].widthLabel }} <span class="fr-sort-icon">{{ fabricStore.frgSortIcon(1) }}</span></th>
          <th class="fr-th-sort" style="width:140px;" @click="fabricStore.frgSort(2)">{{ dash.t[dash.lang].weightLabel }} <span class="fr-sort-icon">{{ fabricStore.frgSortIcon(2) }}</span></th>
          <th class="fr-th-sort" style="width:150px;" @click="fabricStore.frgSort(3)">{{ dash.t[dash.lang].retailPriceLabel }} <span class="fr-sort-icon">{{ fabricStore.frgSortIcon(3) }}</span></th>
          <th class="fr-th-sort" style="width:130px;" @click="fabricStore.frgSort(4)">{{ dash.t[dash.lang].shadeCountLabel }} <span class="fr-sort-icon">{{ fabricStore.frgSortIcon(4) }}</span></th>
          <th style="width:130px;">{{ dash.t[dash.lang].manageWord }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in fabricStore.frgPagedRows" :key="item.id">
          <td><input type="checkbox" :checked="fabricStore.frgSelected.includes(item.id)" @change="fabricStore.frgToggleSelectRow(item)" /></td>
          <td>{{ (fabricStore.frgPage - 1) * fabricStore.frgPageSize + idx + 1 }}</td>
          <td class="fr-td-wrap">{{ item.name || '-' }}</td>
          <td>{{ item.width || '' }}</td>
          <td>{{ item.weight || '' }}</td>
          <td>{{ Number(item.retail_price) ? Number(item.retail_price).toFixed(2) : '' }}</td>
          <td>{{ item.colors || '-' }}</td>
          <td>
            <div class="fr-action-group">
              <button class="fr-action-btn edit" :title="dash.t[dash.lang].edit" @click="fabricStore.frgEditItem(item)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>
              <button class="fr-action-btn delete" :title="dash.t[dash.lang].delete" @click="fabricStore.frgDeleteItem(item)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg></button>
              <button class="fr-action-btn view" :title="dash.t[dash.lang].viewShades" @click="dash.frgOpenShades(item)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg></button>
            </div>
          </td>
        </tr>
        <tr v-if="fabricStore.frgPagedRows.length === 0">
          <td colspan="8" style="text-align:center; padding:24px; color:#94a3b8;">{{ dash.lang === 'th' ? `ยังไม่มีข้อมูล${frgTitle} — กด "+ เพิ่ม${frgTitle}" เพื่อเพิ่มรายการ` : `No ${frgTitle} yet — click "+ Add ${frgTitle}" to add one` }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  </div>

  <!-- เลขหน้า -->
  <div class="xl-pagination" v-if="fabricStore.frgSortedFilteredItems.length > 0">
    <select v-model.number="fabricStore.frgPageSize" class="fr-page-size-select">
      <option :value="15">15 {{ dash.t[dash.lang].perPageWord }}</option>
      <option :value="30">30 {{ dash.t[dash.lang].perPageWord }}</option>
      <option :value="50">50 {{ dash.t[dash.lang].perPageWord }}</option>
    </select>
    <button class="fr-btn-util" :disabled="fabricStore.frgPage === 1" @click="fabricStore.frgPrevPage()">{{ dash.t[dash.lang].prevPage }}</button>
    <span>{{ dash.t[dash.lang].pageWord }} {{ fabricStore.frgPage }} / {{ fabricStore.frgTotalPages }}</span>
    <button class="fr-btn-util" :disabled="fabricStore.frgPage === fabricStore.frgTotalPages" @click="fabricStore.frgNextPage()">{{ dash.t[dash.lang].nextPage }}</button>
  </div>

  <!-- โมดัลเพิ่ม/แก้ไข (ERP มาตรฐานกลาง) -->
  <div v-if="fabricStore.frgShowAddModal" class="erp-overlay" @click.self="fabricStore.frgCloseAddModal()">
    <div class="erp-modal" style="width: 560px;">
      <div class="erp-modal-head">
        <span><span class="erp-head-ic">🏷️</span> {{ fabricStore.frgModalMode === 'edit' ? dash.t[dash.lang].edit : dash.t[dash.lang].add }} {{ frgTitle }}</span>
        <button class="erp-x" @click="fabricStore.frgCloseAddModal()">✕</button>
      </div>
      <div class="erp-modal-body">
        <div class="erp-sec-title"><span class="erp-sec-bar"></span>{{ dash.t[dash.lang].fabricGroupInfoSection }}</div>
        <div class="erp-grid">
          <div class="erp-field erp-col-2"><label>{{ dash.t[dash.lang].nameLabel }} <span class="erp-req">*</span></label><input v-model="fabricStore.frgNewItem.name" :placeholder="dash.t[dash.lang].fabricGroupNamePlaceholder" /></div>
          <div class="erp-field"><label>{{ dash.t[dash.lang].widthLabel }}</label>
            <select v-model="fabricStore.frgNewItem.width"><option value="">{{ dash.t[dash.lang].selectGenericOpt }}</option><option v-for="w in fabricStore.frgWidthChoices" :key="w" :value="w">{{ w }}</option></select>
          </div>
          <div class="erp-field"><label>{{ dash.t[dash.lang].weightLabel }}</label>
            <select v-model="fabricStore.frgNewItem.weight"><option value="">{{ dash.t[dash.lang].selectGenericOpt }}</option><option v-for="w in fabricStore.frgWeightChoices" :key="w" :value="w">{{ w }}</option></select>
          </div>
          <div class="erp-field erp-col-2"><label>{{ dash.t[dash.lang].retailPriceLabel }}</label><input type="number" v-model="fabricStore.frgNewItem.retail_price" placeholder="0.00" /></div>
        </div>
      </div>
      <div class="erp-modal-foot">
        <button class="erp-btn erp-btn-cancel" @click="fabricStore.frgCloseAddModal()">{{ dash.t[dash.lang].cancelWord }}</button>
        <button class="erp-btn erp-btn-save" @click="fabricStore.frgSaveAdd()">💾 {{ dash.t[dash.lang].save }}</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { useFabricStore } from '../../stores/fabric.js';
export default {
  name: 'FabricRegularGroupPage',
  inject: ['dash'],
  setup() {
    return { fabricStore: useFabricStore() };
  },
  computed: {
    frgTitle() {
      return this.fabricStore.frgKind === 'irregular'
        ? this.dash.t[this.dash.lang].fabricGroupIrregularTitle
        : this.dash.t[this.dash.lang].fabricGroupRegularTitle;
    },
  },
};
</script>

<style scoped>
.frg-actions { display: flex; gap: 5px; }
.frg-ic {
  width: 28px; height: 28px; border-radius: 6px; border: 1px solid #e2e8f0;
  background: var(--surface); cursor: pointer; font-size: 12px; display: grid; place-items: center;
}
.frg-edit:hover { background: #eef2ff; border-color: #c7d2fe; }
.frg-del:hover { background: #fef2f2; border-color: #fecaca; }
.frg-shade:hover { background: #f0fdf4; border-color: #bbf7d0; }

.frg-overlay {
  position: fixed; inset: 0; z-index: 3400; display: flex; align-items: center; justify-content: center;
  background: rgba(15,23,42,0.5); padding: 20px;
  font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif;
}
.frg-modal { background: var(--surface); border-radius: 12px; width: 440px; max-width: 100%; overflow: hidden; box-shadow: 0 24px 60px rgba(0,0,0,0.3); }
.frg-modal-head { background: #1e3a8a; color: #fff; padding: 8px 13px; font-weight: 700; display: flex; justify-content: space-between; align-items: center; }
.frg-x { background: none; border: none; color: #fff; font-size: 14px; cursor: pointer; }
.frg-modal-body { padding: 18px 20px; }
.frg-lbl { display: block; font-size: 12px; font-weight: 600; color: #334155; margin: 10px 0 4px; }
.frg-lbl:first-child { margin-top: 0; }
.frg-req { color: #a82a3a; }
.frg-input { width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 7px; font-size: 12px; font-family: inherit; outline: none; }
.frg-input:focus { border-color: #1e3a8a; box-shadow: 0 0 0 3px rgba(30,58,138,0.14); }
.frg-modal-foot { display: flex; justify-content: center; gap: 10px; padding: 8px 14px; border-top: 1px solid #e2e8f0; background: #f8fafc; }
.frg-btn-save { padding: 8px 26px; border: none; border-radius: 8px; background: #1a9c54; color: #fff; font-weight: 700; cursor: pointer; font-family: inherit; }
.frg-btn-save:hover { background: #158045; }
.frg-fade-enter-active, .frg-fade-leave-active { transition: opacity 0.2s; }
.frg-fade-enter-from, .frg-fade-leave-to { opacity: 0; }

:global([data-theme="dark"]) .frg-modal { background: #1a1a1d; }
:global([data-theme="dark"]) .frg-lbl { color: #d8d8dc; }
:global([data-theme="dark"]) .frg-input { background: #0f0f11; border-color: #2c2c31; color: #ececee; }
:global([data-theme="dark"]) .frg-modal-foot { background: #151517; border-top-color: #2c2c31; }
:global([data-theme="dark"]) .frg-ic { background: #0f0f11; border-color: #2c2c31; }
</style>
