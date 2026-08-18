<template>
<div class="oe-slip-overlay" @click.self="dash.oeShowSlip = false">
  <div class="oe-slip-wrap">
    <div class="oe-slip-toolbar">
      <button class="btn-small" @click="dash.oeShowSlip = false">ปิด</button>
      <button class="btn-small btn-primary" @click="dash.oePrintSlipNow">🖨️ พิมพ์</button>
    </div>
    <div class="oe-slip" id="oeSlipPrintArea">
      <div class="oe-slip-customer">{{ dash.oeForm.customer || '—' }}</div>
      <div class="oe-slip-meta">
        <span>Order No. {{ dash.oeForm.orderNo }}</span>
        <span>{{ dash.oeFormattedDate }}</span>
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
          <tr v-for="row in dash.oeSlipItems" :key="row._key">
            <td>{{ row.sku }}</td>
            <td>{{ row.colorCode }}</td>
            <td class="oe-slip-pack">
              <svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2"><rect x="3" y="7" width="18" height="14" rx="1"/><path d="M3 7l9-4 9 4"/><path d="M12 3v18"/></svg>
            </td>
            <td>{{ row.orderedQty }}</td>
          </tr>
        </tbody>
      </table>
      <div class="oe-slip-total">Total WholeSale - {{ dash.oeSlipItems.length }} Pieces</div>
      <div class="oe-slip-remark">
        <span>Remark</span>
        <span>{{ dash.oeForm.note }}</span>
      </div>
      <div class="oe-slip-qr">
        <img :src="dash.oeQrUrl" alt="QR Code" />
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'OrderSlipModal',
  inject: ['dash'],
};
</script>
