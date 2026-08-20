<template>
<div class="po-page">
  <div class="po-titlebar">🧾 กลุ่มสินค้า VAT — ตามช่วงราคาขาย</div>

  <div class="po-items">
    <p class="vpg-hint">กำหนดกลุ่มสินค้า VAT ตามช่วงราคาขาย (บาท) — ระบบจะจัดสินค้าเข้ากลุ่มอัตโนมัติตามราคา</p>
    <table class="po-item-table">
      <thead>
        <tr>
          <th style="width:50px;">ที่</th>
          <th style="width:180px;text-align:right;">ราคาขาย (ตั้งแต่)</th>
          <th style="width:40px;"></th>
          <th style="width:180px;text-align:right;">ถึง</th>
          <th style="text-align:left;">กลุ่มสินค้า VAT</th>
          <th style="width:96px;"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in items" :key="row._key">
          <td class="po-no">{{ idx + 1 }}</td>
          <td><input type="number" step="0.01" v-model.number="row.price_from" class="po-num" placeholder="0.00" /></td>
          <td class="vpg-dash">–</td>
          <td><input type="number" step="0.01" v-model.number="row.price_to" class="po-num" placeholder="0.00" /></td>
          <td><input v-model="row.group_name" placeholder="ชื่อกลุ่ม เช่น A / B / ผ้า" /></td>
          <td class="po-row-actions">
            <button class="po-ic po-add" title="เพิ่มแถว" @click="addRow(idx)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            </button>
            <button class="po-ic po-del" title="ลบแถว" @click="removeRow(idx)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>
            </button>
          </td>
        </tr>
        <tr v-if="items.length === 0"><td colspan="6" class="po-empty">ยังไม่มีกลุ่ม — กด "เพิ่มกลุ่ม" เพื่อเริ่มกำหนด</td></tr>
      </tbody>
    </table>
    <button class="vpg-add-btn" @click="addRow(items.length - 1)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
      เพิ่มกลุ่ม
    </button>
  </div>

  <div class="po-footer">
    <span v-if="savedMsg" class="po-saved-msg">{{ savedMsg }}</span>
    <div class="po-footer-btns">
      <button class="po-btn po-btn-save" @click="save">💾 บันทึก</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'VatProductGroupPage',
  inject: ['dash'],
  data() {
    return { items: [], savedMsg: '', _seq: 1 };
  },
  mounted() { this.load(); },
  methods: {
    newRow(from = null, to = null, name = '') { return { _key: (this._seq = (this._seq || 0) + 1), price_from: from, price_to: to, group_name: name }; },
    async load() {
      try {
        const res = await fetch('/api/vat-product-groups', { headers: { Authorization: 'Bearer ' + this.dash.token } });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const d = await res.json();
        const rows = d.items || [];
        this.items = rows.length
          ? rows.map(r => this.newRow(Number(r.price_from), Number(r.price_to), r.group_name))
          : [this.newRow(0, null, '')];
      } catch (e) { this.items = [this.newRow(0, null, '')]; }
    },
    addRow(idx) {
      const prev = this.items[idx];
      const start = prev && prev.price_to != null ? Number(prev.price_to) : null;
      this.items.splice(idx + 1, 0, this.newRow(start, null, ''));
    },
    removeRow(idx) { if (this.items.length > 1) this.items.splice(idx, 1); else this.items = [this.newRow(0, null, '')]; },
    async save() {
      const rows = this.items.filter(r => (r.group_name || '').trim() || r.price_from != null || r.price_to != null);
      if (rows.length === 0) { this.dash.fbFail('กรุณากรอกกลุ่มอย่างน้อย 1 รายการ'); return; }
      for (const r of rows) {
        if (!(r.group_name || '').trim()) { this.dash.fbFail('กรุณากรอกชื่อกลุ่มให้ครบทุกแถว'); return; }
        if (Number(r.price_to) < Number(r.price_from)) { this.dash.fbFail(`ช่วงราคากลุ่ม "${r.group_name}" ไม่ถูกต้อง (ถึง < ตั้งแต่)`); return; }
      }
      this.dash.fbLoading('กำลังบันทึก...');
      try {
        const res = await fetch('/api/vat-product-groups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.dash.token },
          body: JSON.stringify({ items: rows.map(r => ({ price_from: r.price_from, price_to: r.price_to, group_name: r.group_name })) }),
        });
        if (res.status === 401) { this.dash.fbHide(); this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) { this.savedMsg = 'บันทึกเรียบร้อยแล้ว'; this.dash.fbDone('บันทึกแล้ว'); }
        else { this.dash.fbFail(d.message || 'บันทึกไม่สำเร็จ'); }
      } catch (e) { this.dash.fbFail('บันทึกไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
    },
  },
};
</script>

<style scoped>
.po-page { font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif; color: var(--text); font-size: 13px; margin-top: 12px; background: var(--surface); border: 1px solid var(--field-border); border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
.po-titlebar { font-weight: 700; padding: 18px 20px 2px; font-size: 18px; }
.po-items { padding: 14px 20px; }
.vpg-hint { font-size: 12.5px; color: var(--muted); margin: 0 0 14px; }
.po-item-table { width: 100%; border-collapse: collapse; }
.po-item-table th { text-align: center; font-size: 12px; color: #fff; background: #3c4453; padding: 10px 8px; font-weight: 600; letter-spacing: .3px; border-right: 1px solid rgba(255,255,255,.18); }
.po-item-table th:last-child { border-right: none; }
.po-item-table td { padding: 5px 6px; border-bottom: 1px solid var(--field-border); }
.po-item-table input { width: 100%; height: 34px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 13px; font-family: inherit; background: var(--field); color: var(--text); transition: border-color .2s, box-shadow .2s; }
.po-item-table input:focus { outline: none; border-color: #2F65F6; box-shadow: 0 0 0 3px rgba(47,101,246,.12); background: var(--surface); }
.po-num { text-align: right; }
.po-no { text-align: center; color: var(--muted); }
.vpg-dash { text-align: center; color: var(--muted); }
.po-empty { text-align: center; color: var(--muted); padding: 24px; }
.po-row-actions { display: flex; gap: 5px; justify-content: center; }
.po-ic { width: 28px; height: 28px; border-radius: 7px; border: 1px solid var(--field-border); background: var(--field); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; padding: 0; transition: background .15s, border-color .15s, color .15s; }
.po-ic svg { width: 15px; height: 15px; }
.po-add { color: #1a9c54; } .po-add:hover { background: #e7f6ee; border-color: #1a9c54; }
.po-del { color: #e03131; } .po-del:hover { background: #fdeaea; border-color: #e03131; }
.vpg-add-btn { margin-top: 14px; display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; border: 1px dashed var(--field-border); border-radius: 9px; background: transparent; color: #2F65F6; font-weight: 600; font-size: 13px; font-family: inherit; cursor: pointer; transition: background .15s, border-color .15s; }
.vpg-add-btn:hover { background: #e9f0fe; border-color: #2F65F6; }
.vpg-add-btn svg { width: 15px; height: 15px; }
.po-footer { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-top: 1px solid var(--field-border); background: var(--field); border-radius: 0 0 14px 14px; }
.po-saved-msg { color: #1a9c54; font-size: 13px; font-weight: 600; }
.po-footer-btns { display: flex; gap: 10px; margin-left: auto; }
.po-btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 20px; border: 1px solid var(--field-border); border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 13px; background: #e7eaf1; color: var(--text); }
.po-btn-save { background: #1a9c54; color: #fff; border-color: #1a9c54; }
.po-btn-save:hover { background: #158045; border-color: #158045; }
</style>
