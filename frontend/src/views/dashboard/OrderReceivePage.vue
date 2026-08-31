<template>
<div class="fr-page-compact">
  <div class="header flex-wrap">
    <div>
      <h1>📥 {{ dash.pageTitle('order-receive') }}</h1>
    </div>
  </div>

  <!-- ---- Header Form ---- -->
  <div class="oe-header-form" style="margin-top: 16px;">
    <div class="oe-row1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[150px_1.3fr_1.1fr_1.6fr_90px]">
      <div class="fr-field-group">
        <label>{{ dash.t[dash.lang].dateLabel }}</label>
        <input type="date" v-model="order.oeForm.date" />
      </div>
      <div class="fr-field-group">
        <label>{{ dash.t[dash.lang].customerWord }}</label>
        <input type="text" v-model="order.oeForm.customer" list="oe-customer-list" :placeholder="dash.t[dash.lang].typeToSearchCustomerPlaceholder" autocomplete="off" />
        <datalist id="oe-customer-list">
          <option v-for="c in order.oeCustomerOptions" :key="c.name" :value="c.name" />
        </datalist>
      </div>
      <div class="fr-field-group">
        <label>{{ dash.t[dash.lang].salespersonLabel }}</label>
        <select v-model="order.oeForm.salesperson">
          <option value="">{{ dash.t[dash.lang].selectSalespersonPlaceholder }}</option>
          <option v-for="opt in order.oeSalespersonOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="fr-field-group">
        <label>{{ dash.t[dash.lang].noteLabel }}</label>
        <textarea v-model="order.oeForm.note" rows="2" :placeholder="dash.t[dash.lang].additionalNotePlaceholder"></textarea>
      </div>
      <div class="fr-field-group fr-checkbox-group">
        <input type="checkbox" id="oeUrgent" v-model="order.oeForm.urgent" />
        <label for="oeUrgent">{{ dash.t[dash.lang].urgentWord }}</label>
      </div>
    </div>
    <div class="oe-row2 grid grid-cols-1 sm:grid-cols-2">
      <div class="fr-field-group">
        <label>{{ dash.t[dash.lang].orderNoLabel }}</label>
        <input type="text" :value="order.oeForm.orderNo" readonly class="oe-readonly" />
      </div>
      <div class="fr-field-group">
        <label>{{ dash.t[dash.lang].accountTermsLabel }}</label>
        <select v-model="order.oeForm.paymentTerm">
          <option v-for="opt in order.oePaymentTermOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
    </div>
  </div>

  <!-- ---- Order Items Table ---- -->
  <div class="section fr-table-section" style="margin-top: 16px; padding: 0; overflow: hidden;">
    <div class="fr-table-scroll">
      <table class="fr-table oe-table">
        <thead>
          <tr>
            <th>{{ dash.lang === 'th' ? 'ที่' : 'No.' }}</th>
            <th>{{ dash.t[dash.lang].skuLabel }}</th>
            <th>{{ dash.t[dash.lang].colorCodeLabel }}</th>
            <th>{{ dash.t[dash.lang].widthLabel }}</th>
            <th>{{ dash.t[dash.lang].availableQtyLabel }}</th>
            <th>{{ dash.t[dash.lang].orderedQtyLabel }}</th>
            <th>{{ dash.t[dash.lang].unitLabel }}</th>
            <th>{{ dash.t[dash.lang].packLabel }}</th>
            <th>Cust Code</th>
            <th>{{ dash.t[dash.lang].substituteProductLabel }}</th>
            <th>{{ dash.t[dash.lang].manageWord }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, idx) in order.oeItems" :key="row._key">
            <td>{{ row.no }}</td>
            <td><input type="text" v-model="row.sku" list="oe-fabric-list" :placeholder="dash.t[dash.lang].typeSkuOrNamePlaceholder" @change="order.oeOnSkuChange(row)" /></td>
            <td><input type="text" v-model="row.colorCode" list="oe-color-list" :placeholder="dash.t[dash.lang].typeColorCodePlaceholder" @change="order.oeOnColorChange(row)" /></td>
            <td><input type="text" v-model="row.width" :placeholder="dash.t[dash.lang].exampleWidthPlaceholder" /></td>
            <td><input type="text" v-model="row.availableQty" placeholder="0" /></td>
            <td><input type="number" min="0" v-model="row.orderedQty" placeholder="0" /></td>
            <td>
              <select v-model="row.unit">
                <option v-for="opt in order.oeUnitOptions" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </td>
            <td>
              <select v-model="row.pack">
                <option value="">{{ dash.t[dash.lang].selectWord }}</option>
                <option v-for="opt in order.oePackOptions" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </td>
            <td><input type="text" v-model="row.custCode" placeholder="Cust Code" /></td>
            <td>
              <div class="oe-substitute-cell">
                <input type="checkbox" v-model="row.substitute" />
                <input type="text" v-model="row.substituteText" :disabled="!row.substitute" :placeholder="dash.t[dash.lang].specifySubstitutePlaceholder" />
              </div>
            </td>
            <td>
              <div class="oe-act-group">
                <button class="oe-act-btn oe-act-img" :title="dash.t[dash.lang].viewProductImageTitle">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                </button>
                <button class="oe-act-btn oe-act-add" :title="dash.t[dash.lang].addRowTitle" @click="order.oeAddRow(idx)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
                </button>
                <button class="oe-act-btn oe-act-remove" :title="dash.t[dash.lang].removeRowTitle" @click="order.oeRemoveRow(idx)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/><path d="M10 11v6M14 11v6"/></svg>
                </button>
                <button class="oe-act-btn oe-act-search" :title="dash.t[dash.lang].searchProductTitle">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <datalist id="oe-fabric-list">
        <option v-for="f in order.oeFabricOptions" :key="'p'+f.sku" :value="f.display" />
      </datalist>
      <datalist id="oe-color-list">
        <option v-for="f in order.oeFabricOptions" :key="'c'+f.sku" :value="f.colorText" />
      </datalist>
    </div>
  </div>

  <!-- ---- Footer ---- -->
  <div class="oe-footer">
    <div class="oe-save-success" v-if="order.oeSaved">{{ dash.t[dash.lang].orderSavedSuccessMsg }}</div>
    <div v-else></div>
    <div class="oe-footer-actions">
      <button class="btn-small" @click="order.oeReport">👁️ {{ dash.t[dash.lang].reportWord }}</button>
      <button v-if="!order.oeSaved" class="btn-small" @click="order.oeSave">💾 {{ dash.t[dash.lang].save }}</button>
      <button v-else class="btn-small" @click="order.oeSlipPdf">🖨️ {{ dash.t[dash.lang].orderSlipLabel }}</button>
    </div>
  </div>
</div>
</template>

<script>
import { useOrderStore } from '../../stores/order.js';

export default {
  name: 'OrderReceivePage',
  inject: ['dash'],
  setup() {
    return { order: useOrderStore() };
  },
};
</script>
