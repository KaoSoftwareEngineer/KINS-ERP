<template>
<div class="fr-page-compact">
  <div class="header">
    <div>
      <h1>📥 {{ dash.pageTitle('order-receive') }}</h1>
    </div>
  </div>

  <!-- ---- Header Form ---- -->
  <div class="oe-header-form" style="margin-top: 16px;">
    <div class="oe-row1">
      <div class="fr-field-group">
        <label>วันที่</label>
        <input type="date" v-model="dash.oeForm.date" />
      </div>
      <div class="fr-field-group">
        <label>ลูกค้า</label>
        <input type="text" v-model="dash.oeForm.customer" placeholder="ชื่อลูกค้า" />
      </div>
      <div class="fr-field-group">
        <label>พนักงานขาย</label>
        <select v-model="dash.oeForm.salesperson">
          <option value="">เลือกพนักงานขาย</option>
          <option v-for="opt in dash.oeSalespersonOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="fr-field-group">
        <label>หมายเหตุ</label>
        <textarea v-model="dash.oeForm.note" rows="2" placeholder="หมายเหตุเพิ่มเติม"></textarea>
      </div>
      <div class="fr-field-group fr-checkbox-group">
        <input type="checkbox" id="oeUrgent" v-model="dash.oeForm.urgent" />
        <label for="oeUrgent">ด่วน</label>
      </div>
    </div>
    <div class="oe-row2">
      <div class="fr-field-group">
        <label>เลขที่ออร์เดอร์</label>
        <input type="text" :value="dash.oeForm.orderNo" readonly class="oe-readonly" />
      </div>
      <div class="fr-field-group">
        <label>เงื่อนไขบัญชี</label>
        <select v-model="dash.oeForm.paymentTerm">
          <option v-for="opt in dash.oePaymentTermOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
    </div>
  </div>

  <!-- ---- Order Items Table ---- -->
  <div class="section" style="margin-top: 16px; padding: 0; overflow: hidden;">
    <div class="fr-table-scroll">
      <table class="fr-table oe-table">
        <thead>
          <tr>
            <th>ที่</th>
            <th>รหัสสินค้า</th>
            <th>รหัสสี</th>
            <th>หน้ากว้าง</th>
            <th>จำนวนที่ใช้ได้</th>
            <th>จำนวนที่สั่ง</th>
            <th>หน่วย</th>
            <th>แพ็ค</th>
            <th>Cust Code</th>
            <th>สินค้าทดแทน</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, idx) in dash.oeItems" :key="row._key">
            <td>{{ row.no }}</td>
            <td><input type="text" v-model="row.sku" placeholder="รหัสสินค้า" /></td>
            <td>
              <select v-model="row.colorCode">
                <option value="">เลือก</option>
                <option v-for="opt in dash.oeColorCodeOptions" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </td>
            <td><input type="text" v-model="row.width" placeholder='เช่น 44"' /></td>
            <td><input type="text" v-model="row.availableQty" placeholder="0" /></td>
            <td><input type="number" min="0" v-model="row.orderedQty" placeholder="0" /></td>
            <td>
              <select v-model="row.unit">
                <option v-for="opt in dash.frUnitOptions" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </td>
            <td>
              <select v-model="row.pack">
                <option value="">เลือก</option>
                <option v-for="opt in dash.oePackOptions" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </td>
            <td><input type="text" v-model="row.custCode" placeholder="Cust Code" /></td>
            <td>
              <div class="oe-substitute-cell">
                <input type="checkbox" v-model="row.substitute" />
                <input type="text" v-model="row.substituteText" :disabled="!row.substitute" placeholder="ระบุสินค้าทดแทน" />
              </div>
            </td>
            <td>
              <div class="fr-action-group">
                <button class="fr-img-btn" title="ดูรูปสินค้า">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                </button>
                <button class="oe-row-btn oe-row-btn-add" title="เพิ่มแถว" @click="dash.oeAddRow(idx)">+</button>
                <button class="oe-row-btn oe-row-btn-remove" title="ลบแถว" @click="dash.oeRemoveRow(idx)">−</button>
                <button class="oe-row-btn oe-row-btn-blue" title="ค้นหาสินค้า">🔍</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- ---- Footer ---- -->
  <div class="oe-footer">
    <div class="oe-save-success" v-if="dash.oeSaved">ระบบได้ทำการเพิ่มข้อมูลเรียบร้อยแล้ว</div>
    <div v-else></div>
    <div class="oe-footer-actions">
      <button class="btn-small" @click="dash.oeReport">👁️ รายงาน</button>
      <button v-if="!dash.oeSaved" class="btn-small" @click="dash.oeSave">💾 บันทึก</button>
      <button v-else class="btn-small" @click="dash.oeShowSlip = true">🖨️ ใบออร์เดอร์</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'OrderReceivePage',
  inject: ['dash'],
};
</script>
