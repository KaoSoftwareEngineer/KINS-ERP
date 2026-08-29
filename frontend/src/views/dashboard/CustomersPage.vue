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
        <label>{{ dash.t[dash.lang].searchInput }}</label>
        <input type="text" v-model="customer.cuFilters.search" :placeholder="dash.t[dash.lang].searchCustomerPlaceholder" />
      </div>
      <div class="fr-field-group">
        <label>{{ dash.t[dash.lang].customerGroupLabel }}</label>
        <select v-model="customer.cuFilters.group">
          <option value="">{{ dash.t[dash.lang].allWord }}</option>
          <option v-for="opt in customer.cuGroupOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="fr-field-group">
        <label>{{ dash.t[dash.lang].provinceLabel }}</label>
        <select v-model="customer.cuFilters.province">
          <option value="">{{ dash.t[dash.lang].allWord }}</option>
          <option v-for="opt in customer.cuProvinceOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="fr-field-group">
        <label>{{ dash.t[dash.lang].zoneLabel }}</label>
        <select v-model="customer.cuFilters.zone">
          <option value="">{{ dash.t[dash.lang].allWord }}</option>
          <option v-for="opt in customer.cuZoneOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="fr-field-group">
        <label>{{ dash.t[dash.lang].accountTermsLabel }}</label>
        <select v-model="customer.cuFilters.accountTerms">
          <option value="">{{ dash.t[dash.lang].allWord }}</option>
          <option v-for="opt in customer.cuAccountTermsOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="fr-field-group">
        <label>{{ dash.t[dash.lang].cashTermsLabel }}</label>
        <select v-model="customer.cuFilters.cashTerms">
          <option value="">{{ dash.t[dash.lang].allWord }}</option>
          <option v-for="opt in customer.cuCashTermsOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="fr-field-group">
        <label>{{ dash.t[dash.lang].salespersonLabel }}</label>
        <select v-model="customer.cuFilters.salesperson">
          <option value="">{{ dash.t[dash.lang].allWord }}</option>
          <option v-for="opt in customer.cuSalespersonOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
    </div>

    <div class="fr-filter-actions">
      <button class="fr-btn-util fr-btn-search" @click="customer.cuSearch">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        {{ dash.t[dash.lang].searchWord }}
      </button>
      <button class="fr-btn-util fr-btn-reset" @click="customer.cuResetFilters">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 1 3 6.7"/><path d="M3 16v-4h4"/></svg>
        {{ dash.t[dash.lang].resetWord }}
      </button>
    </div>
  </div>

  <div class="fr-summary fr-summary-row">
    <span>{{ dash.t[dash.lang].foundItems }} {{ customer.cuFilteredItems.length }} {{ dash.t[dash.lang].itemsUnit }}</span>
    <div class="fr-summary-actions">
      <button class="btn-small" @click="customer.cuExportExcel(false)"><svg class="xls-ico" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#217346"/><path d="M14 2v6h6" fill="#185c37"/><path d="M9.5 12.5l5 5M14.5 12.5l-5 5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>{{ dash.t[dash.lang].exportExcel }}</button>
      <button class="btn-small fr-btn-add" @click="customer.cuOpenAdd">+ {{ dash.t[dash.lang].add }} {{ dash.t[dash.lang].customerWord }}</button>
    </div>
  </div>

  <transition name="fr-bulk-fade">
    <div class="fr-bulk-bar" v-if="customer.cuSelected.length > 0">
      <span class="fr-bulk-count">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        {{ dash.t[dash.lang].selectedCountWord }} <strong>{{ customer.cuSelected.length }}</strong> {{ dash.t[dash.lang].itemsUnit }}
      </span>
      <div class="fr-bulk-actions">
        <button class="fr-bulk-btn danger" @click="customer.cuBulkDelete">🗑️ {{ dash.t[dash.lang].deleteSelected }} ({{ customer.cuSelected.length }})</button>
        <button class="fr-bulk-btn" @click="customer.cuExportExcel(true)"><svg class="xls-ico" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#217346"/><path d="M14 2v6h6" fill="#185c37"/><path d="M9.5 12.5l5 5M14.5 12.5l-5 5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>{{ dash.t[dash.lang].exportExcel }}</button>
        <button class="fr-bulk-btn ghost" @click="customer.cuClearSelection">{{ dash.t[dash.lang].clearSelection }}</button>
      </div>
    </div>
  </transition>

  <div class="section fr-table-section" style="margin-top: 8px; padding: 0; overflow: hidden;">
    <div class="fr-table-scroll">
      <table class="fr-table">
        <thead>
          <tr>
            <th class="fr-th-check"><input type="checkbox" :checked="customer.cuAllSelectedOnPage" @change="customer.cuToggleSelectAll" /></th>
            <th>{{ dash.lang === 'th' ? 'ที่' : 'No.' }}</th>
            <th class="fr-th-sort" @click="customer.cuSort('company_name')" :title="dash.t[dash.lang].clickToSort">{{ dash.t[dash.lang].companyNameLabel }} <span class="fr-sort-icon" :class="{ active: customer.cuSortBy === 'company_name' }">{{ customer.cuSortIcon('company_name') }}</span></th>
            <th class="fr-th-sort" @click="customer.cuSort('contact')" :title="dash.t[dash.lang].clickToSort">{{ dash.t[dash.lang].contactLabel }} <span class="fr-sort-icon" :class="{ active: customer.cuSortBy === 'contact' }">{{ customer.cuSortIcon('contact') }}</span></th>
            <th class="fr-th-sort" @click="customer.cuSort('phone')" :title="dash.t[dash.lang].clickToSort">{{ dash.t[dash.lang].phoneLabel }} <span class="fr-sort-icon" :class="{ active: customer.cuSortBy === 'phone' }">{{ customer.cuSortIcon('phone') }}</span></th>
            <th>{{ dash.t[dash.lang].addressLabel }}</th>
            <th class="fr-th-sort" @click="customer.cuSort('customer_group')" :title="dash.t[dash.lang].clickToSort">{{ dash.t[dash.lang].customerGroupLabel }} <span class="fr-sort-icon" :class="{ active: customer.cuSortBy === 'customer_group' }">{{ customer.cuSortIcon('customer_group') }}</span></th>
            <th class="fr-th-sort" @click="customer.cuSort('zone')" :title="dash.t[dash.lang].clickToSort">{{ dash.t[dash.lang].zoneLabel }} <span class="fr-sort-icon" :class="{ active: customer.cuSortBy === 'zone' }">{{ customer.cuSortIcon('zone') }}</span></th>
            <th class="fr-th-sort" @click="customer.cuSort('account_terms')" :title="dash.t[dash.lang].clickToSort">{{ dash.t[dash.lang].accountTermsLabel }} <span class="fr-sort-icon" :class="{ active: customer.cuSortBy === 'account_terms' }">{{ customer.cuSortIcon('account_terms') }}</span></th>
            <th class="fr-th-sort" @click="customer.cuSort('cash_terms')" :title="dash.t[dash.lang].clickToSort">{{ dash.t[dash.lang].cashTermsLabel }} <span class="fr-sort-icon" :class="{ active: customer.cuSortBy === 'cash_terms' }">{{ customer.cuSortIcon('cash_terms') }}</span></th>
            <th>{{ dash.t[dash.lang].currencyLabel }}</th>
            <th>{{ dash.t[dash.lang].creditLimitLabel }}</th>
            <th class="fr-th-sort" @click="customer.cuSort('salesperson')" :title="dash.t[dash.lang].clickToSort">{{ dash.t[dash.lang].salespersonLabel }} <span class="fr-sort-icon" :class="{ active: customer.cuSortBy === 'salesperson' }">{{ customer.cuSortIcon('salesperson') }}</span></th>
            <th>{{ dash.t[dash.lang].manageWord }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in customer.cuPagedItems" :key="item.id">
            <td><input type="checkbox" :checked="customer.cuSelected.includes(item.id)" @change="customer.cuToggleSelect(item.id)" /></td>
            <td>{{ (customer.cuPage - 1) * customer.cuPageSize + idx + 1 }}</td>
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
                <button class="fr-action-btn edit" :title="dash.t[dash.lang].edit" @click="customer.cuEditItem(item)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                </button>
                <button class="fr-action-btn delete" :title="dash.t[dash.lang].delete" @click="customer.cuDeleteItem(item)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>
                </button>
                <button class="fr-action-btn view" :title="dash.t[dash.lang].viewDetails" @click="customer.cuViewItem(item)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="customer.cuLoading" class="fr-empty-row">
            <td colspan="14">{{ dash.t[dash.lang].loadingWord }}</td>
          </tr>
          <tr v-else-if="customer.cuFilteredItems.length === 0" class="fr-empty-row">
            <td colspan="14">{{ dash.t[dash.lang].noResultsFound }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="xl-pagination" v-if="customer.cuFilteredItems.length > 0">
      <select v-model.number="customer.cuPageSize" class="fr-page-size-select">
        <option :value="10">10 {{ dash.t[dash.lang].perPageWord }}</option>
        <option :value="20">20 {{ dash.t[dash.lang].perPageWord }}</option>
        <option :value="50">50 {{ dash.t[dash.lang].perPageWord }}</option>
        <option :value="100">100 {{ dash.t[dash.lang].perPageWord }}</option>
      </select>
      <button class="fr-btn-util" :disabled="customer.cuPage === 1" @click="customer.cuPrevPage">{{ dash.t[dash.lang].prevPage }}</button>
      <span><strong>{{ dash.t[dash.lang].pageWord }} {{ customer.cuPage }} / {{ customer.cuTotalPages }}</strong> — {{ dash.t[dash.lang].showingWord }} {{ (customer.cuPage - 1) * customer.cuPageSize + 1 }}-{{ Math.min(customer.cuPage * customer.cuPageSize, customer.cuFilteredItems.length) }} {{ dash.t[dash.lang].ofTotalWord }} {{ customer.cuFilteredItems.length }} {{ dash.t[dash.lang].itemsUnit }}</span>
      <button class="fr-btn-util" :disabled="customer.cuPage === customer.cuTotalPages" @click="customer.cuNextPage">{{ dash.t[dash.lang].nextPage }}</button>
    </div>
  </div>

  <!-- ============ Modal: เพิ่ม/แก้ไข ลูกค้า (ERP มาตรฐานกลาง) ============ -->
  <div class="erp-overlay" v-if="customer.cuShowAddModal" @click.self="customer.cuCloseAddModal">
    <div class="erp-modal">
      <div class="erp-modal-head">
        <span><span class="erp-head-ic">🧑‍💼</span> {{ customer.cuModalMode === 'edit' ? dash.t[dash.lang].edit : customer.cuModalMode === 'view' ? dash.t[dash.lang].detailsWord : dash.t[dash.lang].add }} {{ dash.t[dash.lang].customerWord }}</span>
        <button class="erp-x" @click="customer.cuCloseAddModal" :title="dash.t[dash.lang].close">✕</button>
      </div>
      <div class="erp-modal-body">
      <fieldset :disabled="customer.cuModalMode === 'view'" style="border:0;margin:0;padding:0;min-width:0;">
        <div class="erp-sec-title"><span class="erp-sec-bar"></span>{{ dash.t[dash.lang].customerInfoSection }}</div>
        <div class="erp-grid">
          <div class="erp-field"><label>{{ dash.t[dash.lang].customerCodeLabel }}</label><input type="text" v-model="customer.cuNewItem.code" :placeholder="dash.t[dash.lang].codeOptionalPlaceholder" /></div>
          <div class="erp-field"><label>{{ dash.t[dash.lang].companyNameLabel }} <span class="erp-req">*</span></label><input type="text" v-model="customer.cuNewItem.company_name" :placeholder="dash.t[dash.lang].companyNamePlaceholder" /></div>
          <div class="erp-field"><label>{{ dash.t[dash.lang].contactLabel }}</label><input type="text" v-model="customer.cuNewItem.contact" :placeholder="dash.t[dash.lang].contactNamePlaceholder" /></div>
          <div class="erp-field"><label>{{ dash.t[dash.lang].phoneLabel }}</label><input type="text" v-model="customer.cuNewItem.phone" :placeholder="dash.t[dash.lang].phoneNumberPlaceholder" /></div>
          <div class="erp-field erp-col-2"><label>{{ dash.t[dash.lang].addressLabel }}</label><input type="text" v-model="customer.cuNewItem.address" :placeholder="dash.t[dash.lang].addressLabel" /></div>
          <div class="erp-field"><label>{{ dash.t[dash.lang].provinceLabel }}</label><input type="text" v-model="customer.cuNewItem.province" :placeholder="dash.t[dash.lang].provinceLabel" /></div>
          <div class="erp-field"><label>{{ dash.t[dash.lang].customerGroupLabel }}</label><input type="text" v-model="customer.cuNewItem.customer_group" :placeholder="dash.t[dash.lang].customerGroupLabel" /></div>
          <div class="erp-field"><label>{{ dash.t[dash.lang].zoneLabel }}</label><input type="text" v-model="customer.cuNewItem.zone" :placeholder="dash.t[dash.lang].zoneLabel" /></div>
        </div>
        <div class="erp-sec-title"><span class="erp-sec-bar"></span>{{ dash.t[dash.lang].tradeFinanceSection }}</div>
        <div class="erp-grid">
          <div class="erp-field"><label>{{ dash.t[dash.lang].accountTermsLabel }}</label><input type="text" v-model="customer.cuNewItem.account_terms" placeholder="e.g. 30 Days" /></div>
          <div class="erp-field"><label>{{ dash.t[dash.lang].cashTermsLabel }}</label><input type="text" v-model="customer.cuNewItem.cash_terms" :placeholder="dash.lang === 'th' ? 'เช่น ปกติ' : 'e.g. Normal'" /></div>
          <div class="erp-field"><label>{{ dash.t[dash.lang].currencyLabel }}</label><input type="text" v-model="customer.cuNewItem.currency" placeholder="THB" /></div>
          <div class="erp-field"><label>{{ dash.t[dash.lang].creditLimitLabel }}</label><input type="text" v-model="customer.cuNewItem.credit_limit" :placeholder="dash.t[dash.lang].creditLimitLabel" /></div>
          <div class="erp-field"><label>{{ dash.t[dash.lang].salespersonLabel }}</label><input type="text" v-model="customer.cuNewItem.salesperson" :placeholder="dash.t[dash.lang].salespersonLabel" /></div>
          <div class="erp-field"><label>{{ dash.t[dash.lang].taxIdLabel }}</label><input type="text" v-model="customer.cuNewItem.tax_id" :placeholder="dash.t[dash.lang].taxIdPlaceholder" /></div>
        </div>
      </fieldset>
      </div>
      <div class="erp-modal-foot">
        <button class="erp-btn erp-btn-cancel" @click="customer.cuCloseAddModal">{{ customer.cuModalMode === 'view' ? dash.t[dash.lang].close : dash.t[dash.lang].cancelWord }}</button>
        <button v-if="customer.cuModalMode !== 'view'" class="erp-btn erp-btn-save" @click="customer.cuSaveAdd">💾 {{ dash.t[dash.lang].save }}</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { useCustomerStore } from '../../stores/customer.js';

export default {
  name: 'CustomersPage',
  inject: ['dash'],
  setup() {
    return { customer: useCustomerStore() };
  },
};
</script>
