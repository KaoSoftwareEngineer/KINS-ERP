<template>
<div class="erp-overlay" @click.self="customer.cmCloseEdit">
  <div class="erp-modal" style="width: 560px;">
    <div class="erp-modal-head">
      <span><span class="erp-head-ic">🧑‍💼</span> แก้ไขข้อมูลลูกค้า</span>
      <button class="erp-x" @click="customer.cmCloseEdit" title="ปิด">✕</button>
    </div>
    <div class="erp-modal-body">
      <div class="erp-sec-title"><span class="erp-sec-bar"></span>ข้อมูลลูกค้า</div>
      <div class="erp-grid">
        <div class="erp-field"><label>รหัสลูกค้า <span class="erp-req">*</span></label><input type="text" v-model="customer.cmEditItem.customer_code" placeholder="เช่น 2114" /></div>
        <div class="erp-field"><label>ชื่อลูกค้า</label><input type="text" v-model="customer.cmEditItem.customer_name" placeholder="ชื่อลูกค้า" /></div>
        <div class="erp-field erp-col-2"><label>ที่อยู่จัดส่ง</label><input type="text" v-model="customer.cmEditItem.address" placeholder="ที่อยู่จัดส่ง" /></div>
      </div>
    </div>
    <div class="erp-modal-foot">
      <button class="erp-btn erp-btn-cancel" @click="customer.cmCloseEdit">ยกเลิก</button>
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
