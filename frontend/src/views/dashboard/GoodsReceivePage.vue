<template>
<div class="grp-wrap text-[var(--text)]">
  <!-- หัวเรื่อง -->
  <div class="flex items-center justify-between flex-wrap gap-3 mb-4">
    <div>
      <h1 class="text-xl font-bold flex items-center gap-2">📥 {{ dash.t[dash.lang].receiveFinishedToWarehouseTitle }}</h1>
      <p class="text-xs text-[var(--muted)] mt-0.5">{{ dash.t[dash.lang].receiveHintText }}</p>
    </div>
    <div class="flex items-center gap-2">
      <button class="grp-btn-ghost" @click="resetForm">{{ dash.t[dash.lang].clearFormBtn }}</button>
      <button class="grp-btn-primary" :disabled="saving" @click="save">
        {{ saving ? dash.t[dash.lang].savingWord : '💾 ' + dash.t[dash.lang].saveReceiveBtn }}
      </button>
    </div>
  </div>

  <!-- ===== ส่วนหัวเอกสาร ===== -->
  <div class="grp-card mb-4">
    <div class="grp-card-title">{{ dash.t[dash.lang].documentInfoSection }}</div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-3">
      <div class="grp-field">
        <label>{{ dash.t[dash.lang].receiveDateLabel }} <span class="text-[var(--danger)]">*</span></label>
        <input type="date" v-model="form.receipt_date" />
      </div>
      <div class="grp-field">
        <label>{{ dash.t[dash.lang].receiptTypeLabel }}</label>
        <select v-model="form.receipt_type">
          <option v-for="t in receiptTypes" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
      <div class="grp-field">
        <label>{{ dash.t[dash.lang].poNoShortLabel }}</label>
        <input type="text" v-model="form.po_no" :placeholder="dash.t[dash.lang].poNoPlaceholder" />
      </div>
      <div class="grp-field">
        <label>{{ dash.t[dash.lang].selectWarehouseLabel }}</label>
        <input type="text" v-model="form.warehouse" :placeholder="dash.t[dash.lang].warehouseExamplePlaceholder" list="grp-warehouses" />
        <datalist id="grp-warehouses">
          <option v-for="w in warehouseNames" :key="w" :value="w" />
        </datalist>
      </div>
      <div class="grp-field">
        <label>{{ dash.t[dash.lang].partnerSenderLabel }}</label>
        <input type="text" v-model="form.supplier_name" :placeholder="dash.t[dash.lang].partnerNamePlaceholder" list="grp-suppliers" />
        <datalist id="grp-suppliers">
          <option v-for="s in supplierOptions" :key="s" :value="s" />
        </datalist>
      </div>
      <div class="grp-field">
        <label>{{ dash.t[dash.lang].billNoLabel }}</label>
        <input type="text" v-model="form.bill_no" :placeholder="dash.t[dash.lang].billLotPlaceholder" />
      </div>
      <div class="grp-field sm:col-span-2 lg:col-span-3">
        <label>{{ dash.t[dash.lang].remarkLabel }}</label>
        <input type="text" v-model="form.note" :placeholder="dash.t[dash.lang].additionalRemarkPlaceholder" />
      </div>
    </div>
  </div>

  <!-- ===== ตารางรายการรับ ===== -->
  <div class="grp-card mb-4">
    <div class="flex items-center justify-between mb-3">
      <div class="grp-card-title mb-0">{{ dash.t[dash.lang].receivedItemsSection }}</div>
      <button class="grp-btn-add" @click="addRow">+ {{ dash.t[dash.lang].addItemBtn }}</button>
    </div>
    <div class="overflow-x-auto">
      <table class="grp-table">
        <thead>
          <tr>
            <th style="width:34px">#</th>
            <th style="min-width:220px">{{ dash.t[dash.lang].masterFabricLabel }} <span class="text-[var(--danger)]">*</span></th>
            <th style="min-width:150px">{{ dash.t[dash.lang].colorCodeLabel }}</th>
            <th style="min-width:110px">LOT</th>
            <th style="width:120px">{{ dash.t[dash.lang].rollCountLabel }} <span class="text-[var(--danger)]">*</span></th>
            <th style="width:130px">{{ dash.t[dash.lang].yardsPerRollLabel }} <span class="text-[var(--danger)]">*</span></th>
            <th style="width:110px">{{ dash.t[dash.lang].totalYardsShortLabel }}</th>
            <th style="min-width:150px">{{ dash.t[dash.lang].storageLocLabel }}</th>
            <th style="width:44px"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, idx) in items" :key="idx">
            <td class="text-center text-[var(--muted)]">{{ idx + 1 }}</td>
            <td>
              <select v-model.number="row.product_id" @change="onProductChange(row)">
                <option :value="0">{{ dash.t[dash.lang].selectFabricOpt }}</option>
                <option v-for="p in products" :key="p.id" :value="p.id">{{ p.sku }} — {{ p.name || p.type }}</option>
              </select>
            </td>
            <td>
              <select v-model.number="row.color_id" :disabled="!row._shades || row._shades.length === 0">
                <option :value="null">{{ dash.t[dash.lang].notSpecifiedOpt }}</option>
                <option v-for="s in row._shades" :key="s.id" :value="s.id">{{ s.name }}</option>
              </select>
            </td>
            <td><input type="text" v-model="row.lot_no" placeholder="LOT" /></td>
            <td><input type="number" min="1" v-model.number="row.roll_count" placeholder="0" /></td>
            <td><input type="number" min="0" step="0.01" v-model.number="row.yards_per_roll" placeholder="0" /></td>
            <td class="text-right font-semibold tabular-nums">{{ (Number(row.roll_count) * Number(row.yards_per_roll) || 0).toLocaleString() }}</td>
            <td>
              <select v-model.number="row.location_id">
                <option :value="null">{{ dash.t[dash.lang].notSpecifiedOpt }}</option>
                <option v-for="l in locations" :key="l.location_id" :value="l.location_id">{{ l.location_code }}</option>
              </select>
            </td>
            <td class="text-center">
              <button class="grp-row-del" :title="dash.t[dash.lang].removeRowTitle" @click="removeRow(idx)">✕</button>
            </td>
          </tr>
          <tr v-if="items.length === 0">
            <td colspan="9" class="text-center text-[var(--muted)] py-6">{{ dash.t[dash.lang].noItemsAddPrompt }}</td>
          </tr>
        </tbody>
        <tfoot v-if="items.length > 0">
          <tr>
            <td colspan="4" class="text-right font-semibold">{{ dash.t[dash.lang].totalWord }}</td>
            <td class="text-center font-bold tabular-nums">{{ totalRolls }} {{ dash.t[dash.lang].rollUnit }}</td>
            <td></td>
            <td class="text-right font-bold tabular-nums">{{ totalYards.toLocaleString() }}</td>
            <td colspan="2"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>

  <p v-if="message" class="text-sm mb-3" :class="messageError ? 'text-[var(--danger)]' : 'text-green-600'">{{ message }}</p>

  <!-- ===== ผลลัพธ์ + พิมพ์ QR ===== -->
  <div v-if="savedRolls.length > 0" class="grp-card">
    <div class="flex items-center justify-between flex-wrap gap-3 mb-3">
      <div>
        <div class="grp-card-title mb-0">✅ {{ dash.t[dash.lang].rollsIssuedPrefix }} {{ savedRolls.length }} {{ dash.t[dash.lang].rollsIssuedUnit }} ({{ dash.t[dash.lang].documentWord }} {{ savedGrNo }})</div>
        <p class="text-xs text-[var(--muted)] mt-0.5">{{ dash.t[dash.lang].printStickerHint }}</p>
      </div>
      <button class="grp-btn-primary" @click="printStickers">🏷️ {{ dash.t[dash.lang].printQrStickerBtn }} ({{ savedRolls.length }})</button>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <div v-for="roll in savedRolls" :key="roll.roll_id" class="grp-sticker">
        <img v-if="qrMap[roll.roll_qr_code]" :src="qrMap[roll.roll_qr_code]" alt="QR" class="w-full aspect-square object-contain" />
        <div class="text-[11px] font-bold mt-1 truncate">{{ roll.product_sku }}</div>
        <div class="text-[10px] text-[var(--muted)] truncate">{{ roll.color_name || '-' }} · {{ roll.initial_yards }} {{ dash.t[dash.lang].yardsUnit }}</div>
        <div class="text-[10px] font-mono">{{ roll.roll_qr_code }}</div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import QRCode from 'qrcode';
import { useCustomerStore } from '../../stores/customer.js';

export default {
  name: 'GoodsReceivePage',
  inject: ['dash'],
  setup() {
    return { customer: useCustomerStore() };
  },
  data() {
    return {
      receiptTypes: ['ซื้อ', 'ผลิตเสร็จ', 'รับคืน', 'โอนย้ายระหว่างคลัง'],
      form: {
        receipt_date: new Date().toISOString().slice(0, 10),
        receipt_type: 'ซื้อ',
        po_no: '', warehouse: 'คลังหลัก', supplier_name: '', bill_no: '', note: '',
      },
      items: [],
      products: [],
      locations: [],
      saving: false,
      message: '',
      messageError: false,
      savedRolls: [],
      savedGrNo: '',
      qrMap: {},
    };
  },
  computed: {
    totalRolls() {
      return this.items.reduce((s, r) => s + (Number(r.roll_count) || 0), 0);
    },
    totalYards() {
      return this.items.reduce((s, r) => s + (Number(r.roll_count) || 0) * (Number(r.yards_per_roll) || 0), 0);
    },
    warehouseNames() {
      return [...new Set(this.locations.map(l => l.zone).filter(Boolean))].map(z => 'คลัง ' + z);
    },
    supplierOptions() {
      return (this.customer.cuItems || []).map(c => c.company_name).filter(Boolean).slice(0, 200);
    },
  },
  mounted() {
    this.loadProducts();
    this.loadLocations();
    if (!this.customer.cuItems || this.customer.cuItems.length === 0) {
      this.customer.cuLoadItems();
    }
    this.addRow();
  },
  methods: {
    authHeaders(json) {
      const h = { Authorization: 'Bearer ' + this.dash.token };
      if (json) h['Content-Type'] = 'application/json';
      return h;
    },
    async loadProducts() {
      try {
        const res = await fetch('/api/fabrics', { headers: this.authHeaders() });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const data = await res.json();
        this.products = (data.fabrics || []).map(f => ({ id: f.id, sku: f.sku, name: f.name, type: f.type }));
      } catch (e) { this.products = []; }
    },
    async loadLocations() {
      try {
        const res = await fetch('/api/warehouse-locations', { headers: this.authHeaders() });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const data = await res.json();
        this.locations = data.locations || [];
      } catch (e) { this.locations = []; }
    },
    async onProductChange(row) {
      row.color_id = null;
      row._shades = [];
      if (!row.product_id) return;
      try {
        const res = await fetch(`/api/fabrics/${row.product_id}/shades`, { headers: this.authHeaders() });
        const data = await res.json();
        row._shades = data.shades || [];
      } catch (e) { row._shades = []; }
    },
    addRow() {
      this.items.push({ product_id: 0, color_id: null, lot_no: '', roll_count: 1, yards_per_roll: null, location_id: null, _shades: [] });
    },
    removeRow(idx) {
      this.items.splice(idx, 1);
    },
    resetForm() {
      this.form = { receipt_date: new Date().toISOString().slice(0, 10), receipt_type: 'ซื้อ', po_no: '', warehouse: 'คลังหลัก', supplier_name: '', bill_no: '', note: '' };
      this.items = [];
      this.savedRolls = [];
      this.savedGrNo = '';
      this.qrMap = {};
      this.message = '';
      this.addRow();
    },
    async save() {
      const validItems = this.items.filter(r => Number(r.product_id) && Number(r.roll_count) > 0 && Number(r.yards_per_roll) > 0);
      if (validItems.length === 0) {
        this.message = this.dash.t[this.dash.lang].validationOneItemMsg;
        this.messageError = true;
        return;
      }
      this.saving = true;
      this.message = '';
      try {
        const payload = {
          ...this.form,
          items: validItems.map(r => ({
            product_id: r.product_id, color_id: r.color_id, lot_no: r.lot_no,
            roll_count: r.roll_count, yards_per_roll: r.yards_per_roll, location_id: r.location_id,
          })),
        };
        const res = await fetch('/api/goods-receipts', {
          method: 'POST', headers: this.authHeaders(true), body: JSON.stringify(payload),
        });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const data = await res.json();
        if (data.ok) {
          this.savedRolls = data.rolls || [];
          this.savedGrNo = data.receipt ? data.receipt.gr_no : '';
          this.message = data.message;
          this.messageError = false;
          await this.generateQRs();
          // เคลียร์รายการเพื่อรับชุดถัดไป (เก็บ header ไว้)
          this.items = [];
          this.addRow();
        } else {
          this.message = '⚠️ ' + (data.message || 'บันทึกไม่สำเร็จ');
          this.messageError = true;
        }
      } catch (e) {
        this.message = '⚠️ บันทึกไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้';
        this.messageError = true;
      } finally {
        this.saving = false;
      }
    },
    async generateQRs() {
      const map = {};
      for (const roll of this.savedRolls) {
        try {
          map[roll.roll_qr_code] = await QRCode.toDataURL(roll.roll_qr_code, { width: 160, margin: 1 });
        } catch (e) {}
      }
      this.qrMap = map;
    },
    async printStickers() {
      if (this.savedRolls.length === 0) return;
      if (Object.keys(this.qrMap).length === 0) await this.generateQRs();
      const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
      const stickers = this.savedRolls.map(r => `
        <div class="st">
          <div class="st-head">
            <div class="st-sku">${esc(r.product_sku)}</div>
            <div class="st-name">${esc(r.product_name || '')}</div>
          </div>
          <img class="st-qr" src="${this.qrMap[r.roll_qr_code] || ''}" />
          <div class="st-info">
            <div><b>สี:</b> ${esc(r.color_name || '-')}</div>
            <div><b>LOT:</b> ${esc(r.lot_no || '-')}</div>
            <div><b>หลา:</b> ${esc(r.initial_yards)}</div>
            ${r.location_code ? `<div><b>ช่อง:</b> ${esc(r.location_code)}</div>` : ''}
          </div>
          <div class="st-code">${esc(r.roll_qr_code)}</div>
        </div>`).join('');
      const win = window.open('', '_blank', 'width=900,height=680');
      if (!win) { alert('เบราว์เซอร์บล็อกหน้าต่างพิมพ์ — กรุณาอนุญาต popup'); return; }
      win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>สติ๊กเกอร์ QR ไม้ผ้า (${this.savedRolls.length})</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: 'Noto Sans Thai','Segoe UI',sans-serif; margin: 12px; }
          .sheet { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
          .st { border: 1px solid #333; border-radius: 6px; padding: 8px; text-align: center; page-break-inside: avoid; }
          .st-head { min-height: 34px; }
          .st-sku { font-size: 12px; font-weight: 800; }
          .st-name { font-size: 10px; color: #444; line-height: 1.1; }
          .st-qr { width: 100%; max-width: 130px; aspect-ratio: 1/1; object-fit: contain; margin: 4px auto; display: block; }
          .st-info { text-align: left; font-size: 10.5px; line-height: 1.35; }
          .st-code { font-family: 'Courier New', monospace; font-size: 11px; font-weight: 700; margin-top: 4px; letter-spacing: .5px; }
          @media print { .no-print { display: none; } }
        </style></head><body>
        <div class="no-print" style="margin-bottom:10px;text-align:center">
          <button onclick="window.print()" style="padding:8px 20px;font-size: 12px;cursor:pointer">🖨️ พิมพ์</button>
        </div>
        <div class="sheet">${stickers}</div>
        </body></html>`);
      win.document.close();
    },
  },
};
</script>

<style scoped>
.grp-wrap { padding: 4px 2px 40px; }
.grp-card { background: var(--surface); border: 1px solid var(--field-border); border-radius: 14px; padding: 18px 20px; box-shadow: 0 1px 3px rgba(0,0,0,.04); }
.grp-card-title { font-size: 12px; font-weight: 700; margin-bottom: 12px; }
.grp-field { display: flex; flex-direction: column; gap: 4px; }
.grp-field label { font-size: 12px; color: var(--muted); font-weight: 600; }
.grp-field input, .grp-field select,
.grp-table input, .grp-table select {
  height: 36px; border: 1px solid var(--field-border); border-radius: 8px;
  background: var(--field); color: var(--text); font-size: 12px; padding: 0 10px; width: 100%;
  font-family: inherit;
}
.grp-field input:focus, .grp-field select:focus,
.grp-table input:focus, .grp-table select:focus { outline: none; border-color: var(--brand); }
.grp-table { width: 100%; border-collapse: collapse; }
.grp-table thead th { background: #3c4453; color: #fff; font-size: 11.5px; font-weight: 600; padding: 9px 8px; text-align: left; white-space: nowrap; }
.grp-table thead th:first-child { border-top-left-radius: 8px; }
.grp-table thead th:last-child { border-top-right-radius: 8px; }
.grp-table tbody td { padding: 6px 8px; border-bottom: 1px solid var(--field-border); vertical-align: middle; }
.grp-table tfoot td { padding: 10px 8px; border-top: 2px solid var(--field-border); font-size: 12px; }
.grp-table input, .grp-table select { height: 32px; font-size: 12.5px; }
.grp-row-del { width: 26px; height: 26px; border-radius: 6px; border: 1px solid var(--field-border); background: var(--surface); color: var(--danger); cursor: pointer; }
.grp-row-del:hover { background: var(--danger); color: #fff; border-color: var(--danger); }
.grp-btn-primary { background: #1a9c54; color: #fff; border: 1px solid #1a9c54; border-radius: 9px; padding: 6px 13px; font-size: 12px; font-weight: 600; cursor: pointer; }
.grp-btn-primary:hover { background: #158045; }
.grp-btn-primary:disabled { opacity: .6; cursor: not-allowed; }
.grp-btn-add { background: var(--brand-soft); color: var(--brand); border: 1px solid var(--brand); border-radius: 8px; padding: 6px 14px; font-size: 12.5px; font-weight: 600; cursor: pointer; }
.grp-btn-ghost { background: var(--field); color: var(--text); border: 1px solid var(--field-border); border-radius: 9px; padding: 6px 12px; font-size: 12px; cursor: pointer; }
.grp-sticker { border: 1px solid var(--field-border); border-radius: 10px; padding: 8px; text-align: center; background: var(--field); }
</style>
