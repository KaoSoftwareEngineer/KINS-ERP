<template>
<div class="of-page fr-page-compact">
  <div class="header flex-wrap">
    <div>
      <h1>📦 {{ dash.pageTitle('order-fulfill') }}</h1>
    </div>
  </div>

  <!-- ---- Barcode Scan Section ---- -->
  <div class="of-barcode-wrap">
    <div class="of-barcode-box">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="of-barcode-icon">
        <line x1="3" y1="4" x2="3" y2="20"/><line x1="7" y1="4" x2="7" y2="20"/><line x1="10" y1="4" x2="10" y2="20"/>
        <line x1="14" y1="4" x2="14" y2="20"/><line x1="16" y1="4" x2="16" y2="20"/><line x1="20" y1="4" x2="20" y2="20"/>
      </svg>
      <input
        ref="barcodeInput"
        type="text"
        class="of-barcode-input"
        v-model="orderStore.ofBarcodeInput"
        :placeholder="dash.t[dash.lang].scanBarcodePlaceholder"
        @keyup.enter="dash.ofHandleBarcodeEnter"
      />
    </div>
  </div>

  <!-- ---- Filter Section ---- -->
  <div class="of-filter-panel">
    <div class="of-filter-row1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[180px_1.5fr_1fr]">
      <div class="fr-field-group">
        <label>{{ dash.t[dash.lang].dateLabel }}</label>
        <input type="date" v-model="orderStore.ofFilters.date" />
      </div>
      <div class="fr-field-group">
        <label>{{ dash.t[dash.lang].customerWord }}</label>
        <input type="text" v-model="orderStore.ofFilters.customer" :placeholder="dash.t[dash.lang].customerNamePlaceholder" />
      </div>
      <div class="fr-field-group">
        <label>{{ dash.t[dash.lang].salespersonLabel }}</label>
        <select v-model="orderStore.ofFilters.salesperson">
          <option value="">{{ dash.t[dash.lang].allWord }}</option>
          <option v-for="opt in orderStore.ofSalespersonOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
    </div>
    <div class="of-filter-row2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.3fr_1fr_.9fr_1.2fr_80px_auto]">
      <div class="fr-field-group">
        <label>{{ dash.t[dash.lang].searchInput }}</label>
        <input type="text" v-model="orderStore.ofFilters.search" :placeholder="dash.t[dash.lang].orderNoteSearchPlaceholder" />
      </div>
      <div class="fr-field-group">
        <label>{{ dash.t[dash.lang].skuLabel }}</label>
        <input type="text" v-model="orderStore.ofFilters.sku" :placeholder="dash.t[dash.lang].skuLabel" />
      </div>
      <div class="fr-field-group">
        <label>{{ dash.t[dash.lang].colorCodeLabel }}</label>
        <select v-model="orderStore.ofFilters.colorCode">
          <option value="">{{ dash.t[dash.lang].allWord }}</option>
          <option v-for="opt in orderStore.ofColorCodeOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="fr-field-group">
        <label>{{ dash.t[dash.lang].status }}</label>
        <select v-model="orderStore.ofFilters.status">
          <option value="">{{ dash.t[dash.lang].allWord }}</option>
          <option v-for="opt in orderStore.ofStatusOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="fr-field-group fr-checkbox-group">
        <input type="checkbox" id="ofUrgent" v-model="orderStore.ofFilters.urgent" />
        <label for="ofUrgent">{{ dash.t[dash.lang].urgentWord }}</label>
      </div>
      <div class="of-filter-actions">
        <button class="fr-btn-util" @click="orderStore.ofSearch">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          {{ dash.t[dash.lang].searchWord }}
        </button>
        <button class="fr-btn-util" @click="orderStore.ofResetFilters">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 1 3 6.7"/><path d="M3 16v-4h4"/></svg>
          {{ dash.t[dash.lang].resetWord }}
        </button>
      </div>
    </div>
  </div>

  <!-- ---- Order List Table ---- -->
  <div class="of-summary">{{ dash.t[dash.lang].foundItems }} {{ orderStore.ofFilteredOrders.length }} {{ dash.t[dash.lang].itemsUnit }}</div>
  <div class="section fr-table-section" style="margin-top: 8px; padding: 0; overflow: hidden;">
    <div class="fr-table-scroll">
      <table class="of-table">
        <thead>
          <tr>
            <th>{{ dash.lang === 'th' ? 'ที่' : 'No.' }}</th>
            <th>{{ dash.t[dash.lang].orderNoLabel }}</th>
            <th>{{ dash.t[dash.lang].dateLabel }}</th>
            <th>{{ dash.t[dash.lang].customerWord }}</th>
            <th>{{ dash.t[dash.lang].accountTermsLabel }}</th>
            <th>{{ dash.t[dash.lang].salespersonLabel }}</th>
            <th>{{ dash.t[dash.lang].orderedQtyLabel }}</th>
            <th>{{ dash.t[dash.lang].withdrawnQtyLabel }}</th>
            <th>{{ dash.t[dash.lang].noteLabel }}</th>
            <th>{{ dash.t[dash.lang].status }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, idx) in orderStore.ofFilteredOrders" :key="order.id">
            <td>{{ idx + 1 }}</td>
            <td><strong>{{ order.orderNo }}</strong> <span v-if="order.urgent" class="of-urgent-tag">{{ dash.t[dash.lang].urgentWord }}</span></td>
            <td>{{ order.date }}</td>
            <td>{{ order.customer }}</td>
            <td>{{ order.paymentTerm }}</td>
            <td>{{ order.salesperson }}</td>
            <td>{{ order.orderedQty.toFixed(2) }}</td>
            <td>{{ order.withdrawnQty.toFixed(2) }}</td>
            <td>{{ order.note }}</td>
            <td>
              <div class="of-status-cell">
                <span class="of-status-badge" :class="orderStore.ofStatusClass(order.status)">{{ order.status }}</span>
                <div class="oe-act-group">
                  <button class="oe-act-btn oe-act-dark" :title="dash.t[dash.lang].detailsWord" @click="orderStore.ofViewInfo(order)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  </button>
                  <button class="oe-act-btn oe-act-dark" :title="dash.t[dash.lang].printWord" @click="orderStore.ofPrintOrder(order)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                  </button>
                  <button class="oe-act-btn oe-act-cut" :title="dash.t[dash.lang].cutProductTitle" @click="dash.ofFulfillOrder(order)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="18" r="2.5"/><circle cx="17" cy="18" r="2.5"/><line x1="8.6" y1="16.1" x2="17.5" y2="3.5"/><line x1="15.4" y1="16.1" x2="6.5" y2="3.5"/></svg>
                  </button>
                </div>
              </div>
            </td>
          </tr>
          <tr v-if="orderStore.ofFilteredOrders.length === 0" class="fr-empty-row">
            <td colspan="10">{{ dash.t[dash.lang].noMatchingResultsMsg }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</template>

<script>
import { useOrderStore } from '../../stores/order.js';

export default {
  name: 'OrderFulfillPage',
  inject: ['dash'],
  setup() {
    return { orderStore: useOrderStore() };
  },
  mounted() {
    this.$refs.barcodeInput.focus();
  },
};
</script>
