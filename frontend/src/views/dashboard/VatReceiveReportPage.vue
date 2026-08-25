<template>
<div class="rp-page">
  <div class="rp-titlebar">
    <span>🧾 รายงานรับสินค้า VAT</span>
    <button class="rp-export-excel" @click="exportExcel">
      <span class="rp-xls-badge"><svg class="xls-ico" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#217346"/><path d="M14 2v6h6" fill="#185c37"/><path d="M9.5 12.5l5 5M14.5 12.5l-5 5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg></span>ส่งออก Excel
    </button>
  </div>

  <!-- ตัวกรอง -->
  <div class="rp-filter">
    <div class="rp-f"><label>คำค้นหา</label><input v-model="filter.q" placeholder="เลขที่รับ/คู่ค้า/อ้างอิง" @keyup.enter="load" /></div>
    <div class="rp-f"><label>คู่ค้า</label><input v-model="filter.party" @keyup.enter="load" /></div>
    <div class="rp-f rp-f-range">
      <label>ราคารับ</label>
      <div class="rp-range">
        <input type="number" v-model="filter.priceFrom" placeholder="จาก" @keyup.enter="load" />
        <span>–</span>
        <input type="number" v-model="filter.priceTo" placeholder="ถึง" @keyup.enter="load" />
      </div>
    </div>
    <div class="rp-f-actions">
      <button class="rp-btn-search" @click="load">🔍 ค้นหา</button>
      <button class="rp-btn-reset" @click="reset">↺ รีเซ็ต</button>
    </div>
  </div>

  <div class="rp-found">พบ {{ items.length.toLocaleString() }} รายการ</div>

  <!-- ตารางใบรับ VAT -->
  <div class="rp-table-wrap rp-groups">
    <table class="rp-table">
      <thead>
        <tr>
          <th style="width:40px;">ที่</th>
          <th class="rp-sortable" @click="toggleSort('vn_no')">เลขที่รับสินค้า <span class="rp-sort" :class="{ on: sort.key === 'vn_no' }">{{ sortIcon('vn_no') }}</span></th>
          <th class="rp-sortable" @click="toggleSort('receipt_date')">วันที่ <span class="rp-sort" :class="{ on: sort.key === 'receipt_date' }">{{ sortIcon('receipt_date') }}</span></th>
          <th class="rp-sortable" @click="toggleSort('vendor')">คู่ค้า <span class="rp-sort" :class="{ on: sort.key === 'vendor' }">{{ sortIcon('vendor') }}</span></th>
          <th>เลขที่อ้างอิง</th>
          <th class="rp-r rp-sortable" @click="toggleSort('qty')">จำนวนรวม <span class="rp-sort" :class="{ on: sort.key === 'qty' }">{{ sortIcon('qty') }}</span></th>
          <th class="rp-r rp-sortable" @click="toggleSort('amount')">ยอดรวม <span class="rp-sort" :class="{ on: sort.key === 'amount' }">{{ sortIcon('amount') }}</span></th>
          <th style="width:44px;"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in sortedItems" :key="row.id" :class="{ 'is-sel': selRow === row }" @click="selectRow(row)">
          <td class="rp-c">{{ idx + 1 }}</td>
          <td class="rp-mono">{{ row.vn_no }}</td>
          <td class="rp-c">{{ fmtDate(row.receipt_date) }}</td>
          <td>{{ row.vendor || '-' }}</td>
          <td>{{ row.ref_no || '-' }}</td>
          <td class="rp-r rp-bold">{{ fmt(row.qty) }}</td>
          <td class="rp-r" :class="{ 'rp-muted': !Number(row.amount) }">{{ Number(row.amount) ? fmt(row.amount) : '-' }}</td>
          <td class="rp-c">
            <button class="rp-ic rp-print" title="ดูรายการ" @click.stop="selectRow(row)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
          </td>
        </tr>
        <tr v-if="items.length === 0"><td colspan="8" class="rp-empty">ยังไม่มีข้อมูล (จะแสดงเมื่อมีใบรับสินค้า VAT ในระบบ)</td></tr>
      </tbody>
      <tfoot v-if="items.length">
        <tr>
          <td colspan="5" class="rp-r rp-bold">รวม</td>
          <td class="rp-r rp-bold">{{ fmt(summary.qty) }}</td>
          <td class="rp-r rp-bold">{{ Number(summary.amount) ? fmt(summary.amount) : '-' }}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  </div>

  <!-- ตารางรายการราคา (เลือกแถว) -->
  <div class="rp-table-wrap rp-rolls">
    <table class="rp-table">
      <thead>
        <tr>
          <th style="width:40px;">ที่</th>
          <th class="rp-r">ราคารับ</th><th class="rp-r">จำนวน</th><th>หน่วย</th><th class="rp-r">รวม</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(it, i) in selItems" :key="i">
          <td class="rp-c">{{ i + 1 }}</td>
          <td class="rp-r">{{ it.price != null ? fmt(it.price) : '-' }}</td>
          <td class="rp-r rp-bold">{{ fmt(it.qty) }}</td>
          <td>{{ it.unit || 'หลา' }}</td>
          <td class="rp-r">{{ it.total != null ? fmt(it.total) : '-' }}</td>
        </tr>
        <tr v-if="selItems.length === 0"><td colspan="5" class="rp-empty">{{ selRow === null ? 'คลิกแถวด้านบนเพื่อดูรายการราคา' : 'ไม่มีรายการในใบรับนี้' }}</td></tr>
      </tbody>
      <tfoot v-if="selItems.length">
        <tr><td colspan="2" class="rp-r rp-bold">รวม</td><td class="rp-r rp-bold">{{ fmt(selQty) }}</td><td></td><td class="rp-r rp-bold">{{ Number(selTotal) ? fmt(selTotal) : '-' }}</td></tr>
      </tfoot>
    </table>
  </div>
</div>
</template>

<script>
export default {
  name: 'VatReceiveReportPage',
  inject: ['dash'],
  data() {
    return {
      filter: { q: '', party: '', priceFrom: '', priceTo: '' },
      items: [], summary: { qty: 0, amount: 0 },
      selRow: null, selItems: [],
      sort: { key: '', dir: 'asc' },
    };
  },
  computed: {
    selQty() { return this.selItems.reduce((s, r) => s + (Number(r.qty) || 0), 0); },
    selTotal() { return this.selItems.reduce((s, r) => s + (Number(r.total) || 0), 0); },
    sortedItems() {
      if (!this.sort.key) return this.items;
      const k = this.sort.key, dir = this.sort.dir === 'asc' ? 1 : -1;
      const num = ['qty', 'amount'].includes(k);
      const val = (r) => num ? (Number(r[k]) || 0) : (r[k] || '').toString().toLowerCase();
      return [...this.items].sort((a, b) => { const av = val(a), bv = val(b); if (av < bv) return -1 * dir; if (av > bv) return 1 * dir; return 0; });
    },
  },
  mounted() { this.load(); },
  methods: {
    authHeaders() { return { Authorization: 'Bearer ' + this.dash.token }; },
    fmt(v) { return (Number(v) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
    fmtDate(d) { if (!d) return '-'; try { const dt = new Date(d); if (isNaN(dt)) return String(d); return `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`; } catch (e) { return '-'; } },
    async load() {
      const qs = new URLSearchParams(Object.entries(this.filter).filter(([, v]) => v !== '' && v != null)).toString();
      try {
        const res = await fetch('/api/reports/vat-receipts' + (qs ? '?' + qs : ''), { headers: this.authHeaders() });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) { this.items = d.items || []; this.summary = { qty: 0, amount: 0, ...(d.summary || {}) }; this.selRow = null; this.selItems = []; }
      } catch (e) { this.dash.fbFail('โหลดรายงานไม่สำเร็จ'); }
    },
    reset() { this.filter = { q: '', party: '', priceFrom: '', priceTo: '' }; this.load(); },
    toggleSort(key) {
      if (this.sort.key === key) this.sort.dir = this.sort.dir === 'asc' ? 'desc' : 'asc';
      else { this.sort.key = key; this.sort.dir = 'asc'; }
    },
    sortIcon(key) { if (this.sort.key !== key) return '↕'; return this.sort.dir === 'asc' ? '▲' : '▼'; },
    selectRow(row) { this.selRow = row; this.selItems = row.items || []; },
    async exportExcel() {
      const head = ['เลขที่รับสินค้า', 'วันที่', 'คู่ค้า', 'เลขที่อ้างอิง', 'จำนวนรวม', 'ยอดรวม'];
      const body = this.sortedItems.map(r => [r.vn_no, this.fmtDate(r.receipt_date), r.vendor, r.ref_no, Number(r.qty) || 0, Number(r.amount) || 0]);
      const XLSX = await import('xlsx');
      const sheet = XLSX.utils.aoa_to_sheet([head, ...body]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, sheet, 'รับสินค้า VAT');
      XLSX.writeFile(wb, `รายงานรับสินค้า-VAT-${new Date().toISOString().slice(0, 10)}.xlsx`);
    },
  },
};
</script>

<style scoped>
.rp-page { font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif; color: var(--text); font-size: 12px; }
.rp-titlebar { display: flex; align-items: center; justify-content: space-between; font-weight: 700; font-size: 14px; margin-bottom: 12px; }
.rp-export-excel { display: inline-flex; align-items: center; gap: 7px; padding: 7px 15px; border: 1px solid #1a9c54; background: #1a9c54; color: #fff; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 12px; }
.rp-export-excel:hover { background: #158045; }
.rp-xls-badge { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; background: #fff; border-radius: 5px; }
.rp-export-excel .xls-ico { width: 14px; height: 14px; }
.rp-filter { display: flex; flex-wrap: wrap; gap: 10px 18px; align-items: flex-end; background: var(--surface); border: 1px solid var(--field-border); border-radius: 12px; padding: 9px 12px; margin-bottom: 12px; }
.rp-f { display: flex; flex-direction: column; gap: 4px; min-width: 150px; flex: 1 1 150px; max-width: 220px; }
.rp-f-range { max-width: 240px; }
.rp-f > label { font-size: 11.5px; color: var(--muted); font-weight: 600; }
.rp-range { display: flex; align-items: center; gap: 6px; }
.rp-range input { flex: 1; min-width: 0; }
.rp-f input, .rp-f select { height: 34px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12px; font-family: inherit; background: var(--field); color: var(--text); }
.rp-f input:focus, .rp-f select:focus { outline: none; border-color: #2F65F6; background: var(--surface); }
.rp-f-actions { display: flex; gap: 8px; }
.rp-btn-search { padding: 8px 16px; border: 1px solid #1e3a8a; background: #1e3a8a; color: #fff; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; }
.rp-btn-search:hover { background: #172b6b; }
.rp-btn-reset { padding: 8px 16px; border: 1px solid #a82a3a; background: #a82a3a; color: #fff; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; }
.rp-btn-reset:hover { background: #8a1c2b; }
.rp-found { font-size: 12px; color: #2F65F6; font-weight: 600; margin-bottom: 6px; }
.rp-table-wrap { overflow-x: auto; border: 1px solid var(--table-line); border-radius: 10px; margin-bottom: 16px; background: var(--surface); }
.rp-groups { max-height: 420px; overflow-y: auto; }
.rp-rolls { max-height: 300px; overflow-y: auto; }
.rp-table { width: 100%; border-collapse: collapse; font-size: 12px; min-width: 800px; }
.rp-table thead th { position: sticky; top: 0; z-index: 3; background: #3c4453; color: #fff; font-size: 11px; font-weight: 600; letter-spacing: .3px; padding: 7px 12px; text-align: left; white-space: nowrap; border-right: 1px solid rgba(255,255,255,.18); }
.rp-table thead th:last-child { border-right: none; }
.rp-table th.rp-r { text-align: right; }
.rp-table tbody td { padding: 3px 12px; font-size: 12px; line-height: 1.6; border-bottom: 1px solid var(--table-line); border-right: 1px solid var(--table-line); white-space: nowrap; }
.rp-table tbody td:last-child { border-right: none; }
.rp-table tbody tr { cursor: pointer; }
.rp-table tbody tr:hover { background: var(--field); }
.rp-table tbody tr.is-sel { background: #fff8d6; }
.rp-r { text-align: right; } .rp-c { text-align: center; color: var(--muted); }
.rp-bold { font-weight: 700; } .rp-muted { color: var(--muted); } .rp-mono { font-family: 'Courier New', monospace; }
.rp-empty { text-align: center; color: var(--muted); padding: 26px; }
.rp-table tfoot td { position: sticky; bottom: 0; z-index: 2; padding: 9px 10px; border-top: 2px solid var(--table-line); background: var(--field); font-weight: 700; }
.rp-sortable { cursor: pointer; user-select: none; }
.rp-sortable:hover { background: #4a5262; }
.rp-sort { opacity: .45; font-size: 10px; margin-left: 3px; }
.rp-sort.on { opacity: 1; }
.rp-ic { width: 26px; height: 26px; border-radius: 6px; border: 1px solid var(--field-border); background: var(--field); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; padding: 0; vertical-align: middle; transition: background .15s, border-color .15s; }
.rp-ic svg { width: 14px; height: 14px; }
.rp-print { color: var(--muted); }
.rp-print:hover { background: var(--field); border-color: var(--muted); color: var(--text); }
</style>
