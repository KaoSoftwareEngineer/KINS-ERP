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
        <label>{{ dash.t[dash.lang].searchInput }}</label>
        <input type="text" v-model="fabricStore.frFilters.search" :placeholder="dash.t[dash.lang].searchFabricPlaceholder" />
      </div>
      <div class="fr-field-group">
        <label>{{ dash.t[dash.lang].typeLabel }}</label>
        <select v-model="fabricStore.frFilters.type">
          <option value="">{{ dash.t[dash.lang].allWord }}</option>
          <option v-for="opt in dash.frTypeOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="fr-field-group">
        <label>{{ dash.t[dash.lang].weightLabel }}</label>
        <select v-model="fabricStore.frFilters.weight">
          <option value="">{{ dash.t[dash.lang].allWord }}</option>
          <option value="light">{{ dash.lang === 'th' ? 'ต่ำกว่า 150 GSM' : 'Below 150 GSM' }}</option>
          <option value="mid">150 - 250 GSM</option>
          <option value="heavy">{{ dash.lang === 'th' ? 'มากกว่า 250 GSM' : 'Above 250 GSM' }}</option>
        </select>
      </div>
      <div class="fr-field-group">
        <label>Active</label>
        <select v-model="fabricStore.frFilters.active">
          <option value="">{{ dash.t[dash.lang].allWord }}</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div class="fr-field-group">
        <label>{{ dash.t[dash.lang].skuLabel }}</label>
        <div class="fr-sku-range">
          <input type="text" v-model="fabricStore.frFilters.skuFrom" :placeholder="dash.t[dash.lang].fromWord" />
          <span>—</span>
          <input type="text" v-model="fabricStore.frFilters.skuTo" :placeholder="dash.t[dash.lang].toWord" />
        </div>
      </div>
      <div class="fr-field-group">
        <label>{{ dash.t[dash.lang].compositionLabel }}</label>
        <select v-model="fabricStore.frFilters.composition">
          <option value="">{{ dash.t[dash.lang].allWord }}</option>
          <option v-for="opt in dash.frCompositionOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="fr-field-group">
        <label>{{ dash.t[dash.lang].widthLabel }}</label>
        <select v-model="fabricStore.frFilters.width">
          <option value="">{{ dash.t[dash.lang].allWord }}</option>
          <option v-for="opt in dash.frWidthOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="fr-field-group fr-checkbox-group">
        <input type="checkbox" id="frSubstitute" v-model="fabricStore.frFilters.substitute" />
        <label for="frSubstitute">{{ dash.t[dash.lang].substituteLabel }}</label>
      </div>
    </div>

    <div class="fr-filter-actions">
      <button class="fr-btn-util fr-btn-search" @click="fabricStore.frSearch">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        {{ dash.t[dash.lang].searchWord }}
      </button>
      <button class="fr-btn-util fr-btn-reset" @click="fabricStore.frResetFilters">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 1 3 6.7"/><path d="M3 16v-4h4"/></svg>
        {{ dash.t[dash.lang].resetWord }}
      </button>
    </div>
  </div>

  <div class="fr-summary fr-summary-row">
    <span>{{ dash.t[dash.lang].foundItems }} {{ fabricStore.frFilteredItems.length }} {{ dash.t[dash.lang].itemsUnit }}</span>
    <div class="fr-summary-actions">
      <button class="btn-small" @click="fabricStore.frExportExcel(false)"><svg class="xls-ico" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#217346"/><path d="M14 2v6h6" fill="#185c37"/><path d="M9.5 12.5l5 5M14.5 12.5l-5 5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>{{ dash.t[dash.lang].exportExcel }}</button>
      <button class="btn-small fr-btn-add" @click="fabricStore.frOpenAdd">+ {{ dash.t[dash.lang].add }} {{ dash.pageTitle('fabric-regular') }}</button>
    </div>
  </div>

  <!-- ============ แถบ Action ด่วน (แสดงเมื่อเลือกรายการ) ============ -->
  <transition name="fr-bulk-fade">
    <div class="fr-bulk-bar" v-if="fabricStore.frSelected.length > 0">
      <span class="fr-bulk-count">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        {{ dash.t[dash.lang].selectedCountWord }} <strong>{{ fabricStore.frSelected.length }}</strong> {{ dash.t[dash.lang].itemsUnit }}
      </span>
      <div class="fr-bulk-actions">
        <button class="fr-bulk-btn danger" @click="fabricStore.frBulkDelete">🗑️ {{ dash.t[dash.lang].deleteSelected }} ({{ fabricStore.frSelected.length }})</button>
        <button class="fr-bulk-btn" @click="fabricStore.frPrintBarcode">{{ dash.t[dash.lang].printBarcode }}</button>
        <button class="fr-bulk-btn" @click="fabricStore.frExportExcel(true)"><svg class="xls-ico" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#217346"/><path d="M14 2v6h6" fill="#185c37"/><path d="M9.5 12.5l5 5M14.5 12.5l-5 5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>{{ dash.t[dash.lang].exportExcel }}</button>
        <button class="fr-bulk-btn ghost" @click="fabricStore.frClearSelection">{{ dash.t[dash.lang].clearSelection }}</button>
      </div>
    </div>
  </transition>

  <div class="section fr-table-section" style="margin-top: 8px; padding: 0; overflow: hidden;">
    <div class="fr-table-scroll">
      <table class="fr-table">
        <thead>
          <tr>
            <th class="fr-th-check"><input type="checkbox" :checked="fabricStore.frAllSelectedOnPage" @change="fabricStore.frToggleSelectAll" /></th>
            <th>{{ dash.lang === 'th' ? 'ที่' : 'No.' }}</th>
            <th class="fr-th-sort" @click="fabricStore.frSort('type')" :title="dash.t[dash.lang].clickToSort">{{ dash.t[dash.lang].typeLabel }} <span class="fr-sort-icon" :class="{ active: fabricStore.frSortBy === 'type' }">{{ fabricStore.frSortIcon('type') }}</span></th>
            <th class="fr-th-sort" @click="fabricStore.frSort('sku')" :title="dash.t[dash.lang].clickToSort">{{ dash.t[dash.lang].skuLabel }} <span class="fr-sort-icon" :class="{ active: fabricStore.frSortBy === 'sku' }">{{ fabricStore.frSortIcon('sku') }}</span></th>
            <th class="fr-th-sort" @click="fabricStore.frSort('colors')" :title="dash.t[dash.lang].clickToSort">{{ dash.lang === 'th' ? 'จำนวนสี' : 'Colors' }} <span class="fr-sort-icon" :class="{ active: fabricStore.frSortBy === 'colors' }">{{ fabricStore.frSortIcon('colors') }}</span></th>
            <th class="fr-th-sort" @click="fabricStore.frSort('name')" :title="dash.t[dash.lang].clickToSort">{{ dash.t[dash.lang].nameLabel }} <span class="fr-sort-icon" :class="{ active: fabricStore.frSortBy === 'name' }">{{ fabricStore.frSortIcon('name') }}</span></th>
            <th class="fr-th-sort" @click="fabricStore.frSort('structure')" :title="dash.t[dash.lang].clickToSort">{{ dash.t[dash.lang].structureLabel }} <span class="fr-sort-icon" :class="{ active: fabricStore.frSortBy === 'structure' }">{{ fabricStore.frSortIcon('structure') }}</span></th>
            <th class="fr-th-sort" @click="fabricStore.frSort('composition')" :title="dash.t[dash.lang].clickToSort">{{ dash.t[dash.lang].compositionLabel }} <span class="fr-sort-icon" :class="{ active: fabricStore.frSortBy === 'composition' }">{{ fabricStore.frSortIcon('composition') }}</span></th>
            <th class="fr-th-sort" @click="fabricStore.frSort('width')" :title="dash.t[dash.lang].clickToSort">{{ dash.t[dash.lang].widthLabel }} <span class="fr-sort-icon" :class="{ active: fabricStore.frSortBy === 'width' }">{{ fabricStore.frSortIcon('width') }}</span></th>
            <th class="fr-th-sort" @click="fabricStore.frSort('finishing')" :title="dash.t[dash.lang].clickToSort">Finishing <span class="fr-sort-icon" :class="{ active: fabricStore.frSortBy === 'finishing' }">{{ fabricStore.frSortIcon('finishing') }}</span></th>
            <th class="fr-th-sort" @click="fabricStore.frSort('weight')" :title="dash.t[dash.lang].clickToSort">{{ dash.t[dash.lang].weightLabel }} <span class="fr-sort-icon" :class="{ active: fabricStore.frSortBy === 'weight' }">{{ fabricStore.frSortIcon('weight') }}</span></th>
            <th class="fr-th-sort" @click="fabricStore.frSort('unit')" :title="dash.t[dash.lang].clickToSort">{{ dash.t[dash.lang].unitLabel }} <span class="fr-sort-icon" :class="{ active: fabricStore.frSortBy === 'unit' }">{{ fabricStore.frSortIcon('unit') }}</span></th>
            <th>{{ dash.t[dash.lang].imageLabel }}</th>
            <th>{{ dash.t[dash.lang].manageWord }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in fabricStore.frPagedItems" :key="item.sku">
            <td><input type="checkbox" :checked="fabricStore.frSelected.includes(item.sku)" @change="fabricStore.frToggleSelect(item.sku)" /></td>
            <td>{{ (fabricStore.frPage - 1) * fabricStore.frPageSize + idx + 1 }}</td>
            <td>{{ item.type }}</td>
            <td><strong>{{ item.sku }}</strong></td>
            <td>
              <button class="fr-color-badge" @click="dash.frOpenShades(item)" :title="dash.t[dash.lang].manageShades">
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
              <button class="fr-img-btn" :title="dash.t[dash.lang].viewImage">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
              </button>
            </td>
            <td>
              <div class="fr-action-group">
                <button class="fr-action-btn edit" :title="dash.t[dash.lang].edit" @click="fabricStore.frEditItem(item)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                </button>
                <button class="fr-action-btn delete" :title="dash.t[dash.lang].delete" @click="fabricStore.frDeleteItem(item)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>
                </button>
                <button class="fr-action-btn view" :title="dash.t[dash.lang].viewDetails" @click="fabricStore.frViewItem(item)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="fabricStore.frLoading" class="fr-empty-row">
            <td colspan="14">{{ dash.t[dash.lang].loadingWord }}</td>
          </tr>
          <tr v-else-if="fabricStore.frFilteredItems.length === 0" class="fr-empty-row">
            <td colspan="14">{{ dash.t[dash.lang].noResultsFound }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="xl-pagination" v-if="fabricStore.frFilteredItems.length > 0">
      <select v-model.number="fabricStore.frPageSize" class="fr-page-size-select">
        <option :value="10">10 {{ dash.t[dash.lang].perPageWord }}</option>
        <option :value="20">20 {{ dash.t[dash.lang].perPageWord }}</option>
        <option :value="50">50 {{ dash.t[dash.lang].perPageWord }}</option>
        <option :value="100">100 {{ dash.t[dash.lang].perPageWord }}</option>
      </select>
      <button class="fr-btn-util" :disabled="fabricStore.frPage === 1" @click="fabricStore.frPrevPage">{{ dash.t[dash.lang].prevPage }}</button>
      <span><strong>{{ dash.t[dash.lang].pageWord }} {{ fabricStore.frPage }} / {{ fabricStore.frTotalPages }}</strong> — {{ dash.t[dash.lang].showingWord }} {{ (fabricStore.frPage - 1) * fabricStore.frPageSize + 1 }}-{{ Math.min(fabricStore.frPage * fabricStore.frPageSize, fabricStore.frFilteredItems.length) }} {{ dash.t[dash.lang].ofTotalWord }} {{ fabricStore.frFilteredItems.length }} {{ dash.t[dash.lang].itemsUnit }}</span>
      <button class="fr-btn-util" :disabled="fabricStore.frPage === fabricStore.frTotalPages" @click="fabricStore.frNextPage">{{ dash.t[dash.lang].nextPage }}</button>
    </div>
  </div>

  <!-- ============ Modal: เพิ่ม ผ้าประจำ (ERP มาตรฐานกลาง) ============ -->
  <div class="erp-overlay" v-if="fabricStore.frShowAddModal" @click.self="fabricStore.frCloseAddModal">
    <div class="erp-modal">
      <div class="erp-modal-head">
        <span><span class="erp-head-ic">🧵</span> {{ fabricStore.frModalMode === 'edit' ? dash.t[dash.lang].edit : fabricStore.frModalMode === 'view' ? dash.t[dash.lang].viewDetails : dash.t[dash.lang].add }} {{ dash.pageTitle('fabric-regular') }}</span>
        <button class="erp-x" @click="fabricStore.frCloseAddModal" :title="dash.t[dash.lang].close">✕</button>
      </div>
      <div class="erp-modal-body">
      <fieldset :disabled="fabricStore.frModalMode === 'view'" style="border:0;margin:0;padding:0;min-width:0;">
        <div class="erp-sec-title"><span class="erp-sec-bar"></span>{{ dash.t[dash.lang].fabricDataSection }}</div>
        <div class="erp-grid">
          <div class="erp-field"><label>{{ dash.t[dash.lang].typeLabel }} <span class="erp-req">*</span></label>
            <select v-model="fabricStore.frNewItem.type"><option value="">{{ dash.t[dash.lang].selectTypeOpt }}</option><option v-for="opt in dash.frTypeOptions" :key="opt" :value="opt">{{ opt }}</option></select>
          </div>
          <div class="erp-field"><label>{{ dash.t[dash.lang].skuLabel }} <span class="erp-req">*</span></label><input type="text" v-model="fabricStore.frNewItem.sku" placeholder="e.g. 100S03" /></div>
          <div class="erp-field erp-col-2"><label>{{ dash.t[dash.lang].nameLabel }}</label><input type="text" v-model="fabricStore.frNewItem.name" :placeholder="dash.t[dash.lang].fabricNamePlaceholder" /></div>
          <div class="erp-field"><label>{{ dash.t[dash.lang].structureLabel }}</label>
            <select v-model="fabricStore.frNewItem.structure"><option value="">{{ dash.t[dash.lang].selectStructureOpt }}</option><option v-for="opt in dash.frStructureOptions" :key="opt" :value="opt">{{ opt }}</option></select>
          </div>
          <div class="erp-field"><label>{{ dash.t[dash.lang].compositionLabel }}</label>
            <select v-model="fabricStore.frNewItem.composition"><option value="">{{ dash.t[dash.lang].selectCompositionOpt }}</option><option v-for="opt in dash.frCompositionOptions" :key="opt" :value="opt">{{ opt }}</option></select>
          </div>
          <div class="erp-field"><label>{{ dash.t[dash.lang].widthLabel }} <span class="erp-req">*</span></label>
            <select v-model="fabricStore.frNewItem.width"><option value="">{{ dash.t[dash.lang].selectWidthOpt }}</option><option v-for="opt in dash.frWidthOptions" :key="opt" :value="opt">{{ opt }}</option></select>
          </div>
          <div class="erp-field"><label>Finishing</label>
            <select v-model="fabricStore.frNewItem.finishing"><option value="">{{ dash.lang === 'th' ? 'เลือก Finishing' : 'Select Finishing' }}</option><option v-for="opt in dash.frFinishingOptions" :key="opt" :value="opt">{{ opt }}</option></select>
          </div>
          <div class="erp-field"><label>{{ dash.t[dash.lang].weightLabel }}</label>
            <select v-model="fabricStore.frNewItem.weight"><option value="">{{ dash.t[dash.lang].selectWeightOpt }}</option><option v-for="opt in dash.frWeightOptions" :key="opt" :value="opt">{{ opt }} GSM</option></select>
          </div>
          <div class="erp-field"><label>{{ dash.t[dash.lang].unitLabel }}</label>
            <select v-model="fabricStore.frNewItem.unit"><option v-for="opt in dash.frUnitOptions" :key="opt" :value="opt">{{ opt }}</option></select>
          </div>
          <div class="erp-field"><label>{{ dash.t[dash.lang].fabricGroupLabel }}</label>
            <select v-model="fabricStore.frNewItem.groupId">
              <option value="">{{ dash.t[dash.lang].noGroupOpt }}</option>
              <option v-for="g in fabricStore.frGroupOptions" :key="g.id" :value="g.id">{{ g.name }}</option>
            </select>
          </div>
        </div>
        <div class="erp-sec-title"><span class="erp-sec-bar"></span>{{ dash.t[dash.lang].moreDetailsSection }}</div>
        <div class="erp-grid">
          <div class="erp-field erp-col-2"><label>{{ dash.t[dash.lang].descriptionLabel }}</label><input type="text" v-model="fabricStore.frNewItem.description" :placeholder="dash.t[dash.lang].moreDescPlaceholder" /></div>
          <div class="erp-field"><label>{{ dash.t[dash.lang].productionDaysLabel }}</label><input type="number" min="0" v-model="fabricStore.frNewItem.productionDays" placeholder="0" /></div>
          <div class="erp-field"><label>{{ dash.t[dash.lang].status }}</label>
            <select v-model="fabricStore.frNewItem.active"><option :value="true">Active</option><option :value="false">Inactive</option></select>
          </div>
          <div class="erp-field"><label>{{ dash.t[dash.lang].substituteLabel }}</label>
            <select v-model="fabricStore.frNewItem.substitute"><option value="no">{{ dash.t[dash.lang].noWord }}</option><option value="yes">{{ dash.t[dash.lang].yesWord }}</option></select>
          </div>
          <div class="erp-field"></div>
          <div class="erp-field erp-col-2"><label>{{ dash.t[dash.lang].imageLabel }}</label>
            <div class="fr-file-input">
              <span class="fr-file-name">{{ fabricStore.frNewItem.imageName || dash.t[dash.lang].noFileSelected }}</span>
              <button type="button" class="fr-file-btn" @click="$refs.frFileInput.click()" :title="dash.t[dash.lang].attachImageTitle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              </button>
              <input ref="frFileInput" type="file" accept="image/*" class="fr-file-hidden" @change="fabricStore.frHandleFileChange" />
            </div>
          </div>
        </div>
      </fieldset>
      </div>
      <div class="erp-modal-foot">
        <button class="erp-btn erp-btn-cancel" @click="fabricStore.frCloseAddModal">{{ fabricStore.frModalMode === 'view' ? dash.t[dash.lang].close : dash.t[dash.lang].cancelWord }}</button>
        <button v-if="fabricStore.frModalMode !== 'view'" class="erp-btn erp-btn-save" @click="fabricStore.frSaveAdd">💾 {{ dash.t[dash.lang].save }}</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { useFabricStore } from '../../stores/fabric.js';
export default {
  name: 'FabricRegularPage',
  inject: ['dash'],
  setup() {
    return { fabricStore: useFabricStore() };
  },
};
</script>
