<template>
<div class="po-page">
  <div class="po-titlebar">✂️ จัดออร์เดอร์ — ตัดจ่ายสินค้า</div>

  <!-- ---- ส่วนหัว ---- -->
  <div class="po-head">
    <div class="po-head-col">
      <div class="po-field"><label>วันที่</label><input type="date" v-model="d.issueDate" /></div>
      <div class="po-field"><label>เลขที่เบิกสินค้า</label><input :value="d.issueNo" readonly class="po-ro" placeholder="ออกอัตโนมัติ" /></div>
    </div>
    <div class="po-head-col">
      <div class="po-field"><label>เลขที่ออร์เดอร์</label><input :value="order.orderNo" readonly class="po-ro" /></div>
      <div class="po-field"><label>ประเภทการเบิก</label>
        <select v-model="d.issueType">
          <option v-for="t in orderStore.ofIssueTypeOptions" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
    </div>
    <div class="po-head-col">
      <div class="po-field"><label>ลูกค้า</label><input :value="order.customer" readonly class="po-ro" /></div>
      <div class="po-field"><label>เงื่อนไขบัญชี</label><input :value="order.paymentTerm" readonly class="po-ro" /></div>
    </div>
    <div class="po-head-col po-head-col-wide">
      <div class="po-field"><label>หมายเหตุ</label><textarea v-model="d.remark" rows="3"></textarea></div>
    </div>
  </div>

  <!-- ---- แถบสแกน QR ม้วน ---- -->
  <div class="of-scanbar">
    <div class="of-scan-box">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="of-scan-icon">
        <line x1="3" y1="4" x2="3" y2="20"/><line x1="7" y1="4" x2="7" y2="20"/><line x1="10" y1="4" x2="10" y2="20"/>
        <line x1="14" y1="4" x2="14" y2="20"/><line x1="16" y1="4" x2="16" y2="20"/><line x1="20" y1="4" x2="20" y2="20"/>
      </svg>
      <input
        ref="scanInput"
        type="text"
        v-model="d.scanInput"
        placeholder="ยิง QR ม้วนผ้า เพื่อจับคู่รายการ..."
        @keyup.enter="orderStore.ofDetailScan"
      />
    </div>
    <div class="of-scan-ym"><input :value="d.scanY" readonly class="po-num" /><span>Y</span></div>
    <div class="of-scan-ym"><input :value="d.scanM" readonly class="po-num" /><span>M</span></div>
  </div>

  <!-- ---- ตารางรายการตัด ---- -->
  <div class="po-items">
    <table class="po-item-table">
      <thead>
        <tr>
          <th style="width:36px;">ที่</th>
          <th>รหัสสินค้า</th><th>รหัสสี</th><th style="width:70px;">หน้ากว้าง</th>
          <th style="width:96px;">จำนวนค้างเบิก</th><th style="width:90px;">จำนวนที่เบิก</th><th style="width:60px;">หน่วย</th>
          <th style="width:130px;">แพ็ค</th>
          <th style="width:80px;">จบออร์เดอร์</th><th style="width:150px;">บาร์โค้ด</th>
          <th style="width:100px;">จำนวนที่ตัด</th><th style="width:80px;">เคลียร์สต็อก</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in d.rows" :key="row._key" :class="{ 'of-row-scanned': row.rollQr }">
          <td class="po-no">{{ idx + 1 }}</td>
          <td><input :value="row.sku" readonly class="po-ro-cell" /></td>
          <td><input :value="row.colorCode" readonly class="po-ro-cell" /></td>
          <td><input :value="row.width" readonly class="po-ro-cell" /></td>
          <td><input :value="fmt(row.pendingQty)" readonly class="po-num po-ro-cell" /></td>
          <td><input :value="fmt(row.withdrawnQty)" readonly class="po-num po-ro-cell" /></td>
          <td><input :value="row.unit" readonly class="po-ro-cell" style="text-align:center;" /></td>
          <td><input :value="row.pack" readonly class="po-ro-cell" style="text-align:center;" /></td>
          <td class="po-center"><input type="checkbox" v-model="row.finalOrder" /></td>
          <td><input v-model="row.rollQr" placeholder="ยิง/พิมพ์ QR ม้วน" /></td>
          <td><input type="number" v-model.number="row.cutQty" class="po-num" min="0" step="0.01" placeholder="0" /></td>
          <td class="po-center"><input type="checkbox" v-model="row.clearStock" /></td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="po-foot-row">
          <td colspan="10" class="po-foot-label">รวมจำนวนที่ตัด</td>
          <td class="po-num">{{ fmt(totalCut) }}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  </div>

  <!-- ---- footer ---- -->
  <div class="po-footer">
    <button class="po-btn" @click="dash.ofDetailBack">← กลับ</button>
    <div class="po-footer-right">
      <span v-if="d.savedMsg" class="po-saved-msg">{{ d.savedMsg }}</span>
      <button class="po-btn po-btn-save" :disabled="d.saving" @click="dash.ofDetailSave">💾 บันทึกตัดจ่าย</button>
    </div>
  </div>
</div>
</template>

<script>
import { useOrderStore } from '../../stores/order.js';

export default {
  name: 'OrderFulfillDetailPage',
  inject: ['dash'],
  setup() {
    return { orderStore: useOrderStore() };
  },
  computed: {
    d() { return this.orderStore.ofDetail; },
    order() { return this.orderStore.ofDetail.order || {}; },
    totalCut() { return this.d.rows.reduce((s, r) => s + (Number(r.cutQty) || 0), 0); },
  },
  mounted() {
    this.$nextTick(() => { if (this.$refs.scanInput) this.$refs.scanInput.focus(); });
  },
  methods: {
    fmt(n) { return (Number(n) || 0).toFixed(2); },
  },
};
</script>

<style scoped>
.po-page { font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif; color: var(--text); font-size: 12px; margin-top: 12px; background: var(--surface); border: 1px solid var(--field-border); border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
.po-titlebar { font-weight: 700; padding: 18px 20px 2px; font-size: 18px; }
.po-head { display: flex; flex-wrap: wrap; gap: 22px; padding: 20px; border-bottom: 1px solid var(--field-border); }
.po-head-col { display: flex; flex-direction: column; gap: 8px; }
.po-head-col-wide { flex: 1; min-width: 220px; }
.po-field { display: flex; align-items: flex-start; gap: 8px; }
.po-field > label { min-width: 100px; text-align: right; padding-top: 6px; color: var(--muted); font-size: 12px; font-weight: 600; }
.po-field input, .po-field select { height: 36px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12px; font-family: inherit; background: var(--field); color: var(--text); min-width: 150px; transition: border-color .2s, box-shadow .2s; }
.po-field textarea { width: 100%; resize: vertical; padding: 8px 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12px; font-family: inherit; background: var(--field); color: var(--text); }
.po-field input:focus, .po-field select:focus, .po-field textarea:focus { outline: none; border-color: #2F65F6; box-shadow: 0 0 0 3px rgba(47,101,246,.12); background: var(--surface); }
.po-ro { background: var(--field) !important; font-weight: 700; }

/* แถบสแกน */
.of-scanbar { display: flex; align-items: center; gap: 14px; padding: 9px 14px; border-bottom: 1px solid var(--field-border); }
.of-scan-box { position: relative; flex: 0 1 420px; display: flex; align-items: center; }
.of-scan-icon { position: absolute; left: 12px; width: 20px; height: 20px; color: var(--muted); pointer-events: none; }
.of-scan-box input { width: 100%; height: 40px; padding: 0 12px 0 40px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12px; font-family: inherit; background: var(--surface); color: var(--text); }
.of-scan-box input:focus { outline: none; border-color: #2F65F6; box-shadow: 0 0 0 3px rgba(47,101,246,.12); }
.of-scan-ym { display: flex; align-items: center; gap: 6px; }
.of-scan-ym input { width: 90px; height: 40px; text-align: right; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; background: var(--field); color: var(--text); font-family: inherit; }
.of-scan-ym span { color: var(--muted); font-weight: 700; font-size: 12px; }

/* ตาราง */
.po-items { padding: 8px 12px; overflow-x: auto; }
.po-item-table { width: 100%; border-collapse: collapse; min-width: 1100px; }
.po-item-table th { text-align: center; font-size: 12px; color: #fff; background: #3c4453; padding: 10px 8px; font-weight: 600; letter-spacing: .3px; border-right: 1px solid rgba(255,255,255,.18); }
.po-item-table th:last-child { border-right: none; }
.po-item-table td { padding: 5px 6px; border-bottom: 1px solid var(--field-border); }
.po-item-table input:not([type="checkbox"]) { width: 100%; height: 32px; padding: 0 9px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12.5px; font-family: inherit; background: var(--surface); color: var(--text); transition: border-color .2s, box-shadow .2s; }
.po-item-table input:focus { outline: none; border-color: #2F65F6; box-shadow: 0 0 0 3px rgba(47,101,246,.12); }
.po-num { text-align: right; }
.po-center { text-align: center; }
.po-ro-cell { background: var(--field) !important; }
.po-no { text-align: center; color: var(--muted); }
.of-row-scanned td { background: rgba(26,156,84,.06); }
.po-foot-row td { padding: 9px 8px; border-top: 2px solid var(--field-border); font-weight: 700; font-size: 12.5px; }
.po-foot-label { text-align: right; color: var(--muted); }

/* footer */
.po-footer { display: flex; align-items: center; justify-content: space-between; padding: 9px 14px; border-top: 1px solid var(--field-border); background: var(--field); border-radius: 0 0 14px 14px; }
.po-footer-right { display: flex; align-items: center; gap: 14px; margin-left: auto; }
.po-saved-msg { color: #1a9c54; font-size: 12px; font-weight: 600; }
.po-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; border: 1px solid var(--field-border); border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 12px; background: #e7eaf1; color: var(--text); transition: background .2s, border-color .2s; }
.po-btn:hover { background: #dde1ea; border-color: #c7cede; }
.po-btn-save { background: #1a9c54; color: #fff; border-color: #1a9c54; }
.po-btn-save:hover { background: #158045; border-color: #158045; }
.po-btn-save:disabled { opacity: .6; cursor: not-allowed; }
</style>
