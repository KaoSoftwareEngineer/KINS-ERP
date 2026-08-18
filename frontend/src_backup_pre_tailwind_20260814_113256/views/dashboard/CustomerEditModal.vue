<template>
<div class="fr-modal-overlay" @click.self="dash.cmCloseEdit">
  <div class="fr-modal">
    <div class="fr-modal-header">
      <h3>แก้ไขข้อมูลลูกค้า</h3>
      <button class="fr-modal-close" @click="dash.cmCloseEdit" title="ปิด">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="fr-modal-body">
      <div class="fr-form-row">
        <label>รหัสลูกค้า <span class="fr-required">*</span></label>
        <input type="text" v-model="dash.cmEditItem.customer_code" placeholder="เช่น 2114" />
      </div>
      <div class="fr-form-row">
        <label>ชื่อลูกค้า</label>
        <input type="text" v-model="dash.cmEditItem.customer_name" placeholder="ชื่อลูกค้า" />
      </div>
      <div class="fr-form-row">
        <label>ที่อยู่จัดส่ง</label>
        <input type="text" v-model="dash.cmEditItem.address" placeholder="ที่อยู่จัดส่ง" />
      </div>
    </div>
    <div class="fr-modal-footer">
      <button class="fr-btn-save" @click="dash.cmSaveEdit">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        {{ dash.t[dash.lang].save }}
      </button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'CustomerEditModal',
  inject: ['dash'],
};
</script>
