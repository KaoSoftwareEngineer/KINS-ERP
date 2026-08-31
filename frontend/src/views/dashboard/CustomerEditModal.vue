<template>
<div class="erp-overlay" @click.self="customer.cmCloseEdit">
  <div class="erp-modal" style="width: 560px;">
    <div class="erp-modal-head">
      <span><span class="erp-head-ic">🧑‍💼</span> {{ dash.t[dash.lang].editCustomerInfoTitle }}</span>
      <button class="erp-x" @click="customer.cmCloseEdit" :title="dash.t[dash.lang].close">✕</button>
    </div>
    <div class="erp-modal-body">
      <div class="erp-sec-title"><span class="erp-sec-bar"></span>{{ dash.t[dash.lang].customerInfoSectionTitle }}</div>
      <div class="erp-grid">
        <div class="erp-field"><label>{{ dash.t[dash.lang].customerCodeLabel }} <span class="erp-req">*</span></label><input type="text" v-model="customer.cmEditItem.customer_code" :placeholder="dash.t[dash.lang].egCode2114Placeholder" /></div>
        <div class="erp-field"><label>{{ dash.t[dash.lang].customerNameLabel }}</label><input type="text" v-model="customer.cmEditItem.customer_name" :placeholder="dash.t[dash.lang].customerNameLabel" /></div>
        <div class="erp-field erp-col-2"><label>{{ dash.t[dash.lang].shippingAddressLabel }}</label><input type="text" v-model="customer.cmEditItem.address" :placeholder="dash.t[dash.lang].shippingAddressLabel" /></div>
      </div>
    </div>
    <div class="erp-modal-foot">
      <button class="erp-btn erp-btn-cancel" @click="customer.cmCloseEdit">{{ dash.t[dash.lang].cancelWord }}</button>
      <button class="erp-btn erp-btn-save" @click="customer.cmSaveEdit">💾 {{ dash.t[dash.lang].save }}</button>
    </div>
  </div>
</div>
</template>

<script>
import { useCustomerStore } from '../../stores/customer.js';

export default {
  name: 'CustomerEditModal',
  inject: ['dash'],
  setup() {
    return { customer: useCustomerStore() };
  },
};
</script>
