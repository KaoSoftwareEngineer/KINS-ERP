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
        v-model="dash.ofBarcodeInput"
        placeholder="ยิงบาร์โค้ด หรือพิมพ์เลขที่ออร์เดอร์..."
        @keyup.enter="dash.ofHandleBarcodeEnter"
      />
    </div>
  </div>

  <!-- ---- Filter Section ---- -->
  <div class="of-filter-panel">
    <div class="of-filter-row1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[180px_1.5fr_1fr]">
      <div class="fr-field-group">
        <label>วันที่</label>
        <input type="date" v-model="dash.ofFilters.date" />
      </div>
      <div class="fr-field-group">
        <label>ลูกค้า</label>
        <input type="text" v-model="dash.ofFilters.customer" placeholder="ชื่อลูกค้า" />
      </div>
      <div class="fr-field-group">
        <label>พนักงานขาย</label>
        <select v-model="dash.ofFilters.salesperson">
          <option value="">ทั้งหมด</option>
          <option v-for="opt in dash.ofSalespersonOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
    </div>
    <div class="of-filter-row2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.3fr_1fr_.9fr_1.2fr_80px_auto]">
      <div class="fr-field-group">
        <label>คำค้นหา</label>
        <input type="text" v-model="dash.ofFilters.search" placeholder="เลขที่ออร์เดอร์ / หมายเหตุ" />
      </div>
      <div class="fr-field-group">
        <label>รหัสสินค้า</label>
        <input type="text" v-model="dash.ofFilters.sku" placeholder="รหัสสินค้า" />
      </div>
      <div class="fr-field-group">
        <label>รหัสสี</label>
        <select v-model="dash.ofFilters.colorCode">
          <option value="">ทั้งหมด</option>
          <option v-for="opt in dash.ofColorCodeOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="fr-field-group">
        <label>สถานะ</label>
        <select v-model="dash.ofFilters.status">
          <option value="">ทั้งหมด</option>
          <option v-for="opt in dash.ofStatusOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="fr-field-group fr-checkbox-group">
        <input type="checkbox" id="ofUrgent" v-model="dash.ofFilters.urgent" />
        <label for="ofUrgent">ด่วน</label>
      </div>
      <div class="of-filter-actions">
        <button class="fr-btn-util" @click="dash.ofSearch">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          ค้นหา
        </button>
        <button class="fr-btn-util" @click="dash.ofResetFilters">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 1 3 6.7"/><path d="M3 16v-4h4"/></svg>
          รีเซต
        </button>
      </div>
    </div>
  </div>

  <!-- ---- Order List Table ---- -->
  <div class="of-summary">พบ {{ dash.ofFilteredOrders.length }} รายการ</div>
  <div class="section fr-table-section" style="margin-top: 8px; padding: 0; overflow: hidden;">
    <div class="fr-table-scroll">
      <table class="of-table">
        <thead>
          <tr>
            <th>ที่</th>
            <th>เลขที่ออร์เดอร์</th>
            <th>วันที่</th>
            <th>ลูกค้า</th>
            <th>เงื่อนไขบัญชี</th>
            <th>พนักงานขาย</th>
            <th>จำนวนที่สั่ง</th>
            <th>จำนวนที่เบิก</th>
            <th>หมายเหตุ</th>
            <th>สถานะ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, idx) in dash.ofFilteredOrders" :key="order.id">
            <td>{{ idx + 1 }}</td>
            <td><strong>{{ order.orderNo }}</strong> <span v-if="order.urgent" class="of-urgent-tag">ด่วน</span></td>
            <td>{{ order.date }}</td>
            <td>{{ order.customer }}</td>
            <td>{{ order.paymentTerm }}</td>
            <td>{{ order.salesperson }}</td>
            <td>{{ order.orderedQty.toFixed(2) }}</td>
            <td>{{ order.withdrawnQty.toFixed(2) }}</td>
            <td>{{ order.note }}</td>
            <td>
              <div class="of-status-cell">
                <span class="of-status-badge" :class="dash.ofStatusClass(order.status)">{{ order.status }}</span>
                <div class="oe-act-group">
                  <button class="oe-act-btn oe-act-dark" title="รายละเอียด" @click="dash.ofViewInfo(order)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  </button>
                  <button class="oe-act-btn oe-act-dark" title="พิมพ์" @click="dash.ofPrintOrder(order)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                  </button>
                  <button class="oe-act-btn oe-act-cut" title="ตัดสินค้า" @click="dash.ofFulfillOrder(order)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="18" r="2.5"/><circle cx="17" cy="18" r="2.5"/><line x1="8.6" y1="16.1" x2="17.5" y2="3.5"/><line x1="15.4" y1="16.1" x2="6.5" y2="3.5"/></svg>
                  </button>
                </div>
              </div>
            </td>
          </tr>
          <tr v-if="dash.ofFilteredOrders.length === 0" class="fr-empty-row">
            <td colspan="10">ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'OrderFulfillPage',
  inject: ['dash'],
  mounted() {
    this.$refs.barcodeInput.focus();
  },
};
</script>
