<template>
<div class="oe-slip-overlay" @click.self="order.oeShowSlip = false">
  <div class="oe-slip-wrap">
    <div class="oe-slip-toolbar">
      <button class="btn-small" @click="order.oeShowSlip = false">ปิด</button>
      <button class="btn-small btn-primary" @click="order.oePrintSlipNow">🖨️ พิมพ์</button>
    </div>
    <div class="oe-slip" id="oeSlipPrintArea">
      <div class="oe-slip-customer">{{ order.oeForm.customer || '—' }}</div>
      <div class="oe-slip-meta">
        <span>Order No. {{ order.oeForm.orderNo }}</span>
        <span>{{ order.oeFormattedDate }}</span>
      </div>
      <table class="oe-slip-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Detail</th>
            <th>Pack</th>
            <th>Yard</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in order.oeSlipItems" :key="row._key">
            <td>{{ row.sku }}</td>
            <td>{{ row.colorCode }}</td>
            <td class="oe-slip-pack">
              <svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2"><rect x="3" y="7" width="18" height="14" rx="1"/><path d="M3 7l9-4 9 4"/><path d="M12 3v18"/></svg>
            </td>
            <td>{{ row.orderedQty }}</td>
          </tr>
        </tbody>
      </table>
      <div class="oe-slip-total">Total WholeSale - {{ order.oeSlipItems.length }} Pieces</div>
      <div class="oe-slip-remark">
        <span>Remark</span>
        <span>{{ order.oeForm.note }}</span>
      </div>
      <div class="oe-slip-qr">
        <img :src="order.oeQrUrl" alt="QR Code" />
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { useOrderStore } from '../../stores/order.js';

export default {
  name: 'OrderSlipModal',
  inject: ['dash'],
  setup() {
    return { order: useOrderStore() };
  },
};
</script>
