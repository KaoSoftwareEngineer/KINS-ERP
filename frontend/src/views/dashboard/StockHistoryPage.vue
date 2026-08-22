<template>
<div class="sh-wrap text-[var(--text)]">
  <div class="flex items-center justify-between flex-wrap gap-3 mb-4">
    <div>
      <h1 class="text-xl font-bold flex items-center gap-2">📜 ประวัติเคลื่อนไหวสต็อก</h1>
      <p class="text-xs text-[var(--muted)] mt-0.5">บันทึกทุกการรับเข้า / จัดเก็บ / ย้าย / ตัดหลา — ใครทำ เมื่อไร กี่หลา</p>
    </div>
    <div class="flex items-center gap-2 flex-wrap">
      <select v-model="filterType" class="sh-input">
        <option value="">ทุกประเภท</option>
        <option value="receive">รับเข้า</option>
        <option value="move">ย้าย/จัดเก็บ</option>
        <option value="cut">ตัดหลา</option>
        <option value="issue">จ่ายออก</option>
        <option value="adjust">ปรับยอด</option>
        <option value="return">รับคืน</option>
      </select>
      <div class="relative">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]">🔍</span>
        <input v-model="search" placeholder="ค้นหา QR / รหัสผ้า / ผู้ทำรายการ" class="sh-input pl-9 w-[280px]" />
      </div>
      <button class="sh-btn" @click="load">↻ รีเฟรช</button>
    </div>
  </div>

  <div class="sh-summary mb-2 text-xs text-[var(--muted)]">
    แสดง {{ filtered.length }} รายการ (จากทั้งหมด {{ transactions.length }})
  </div>

  <div class="sh-card">
    <div class="fr-table-scroll" style="max-height: calc(100vh - 220px);">
      <table class="fr-table">
        <thead>
          <tr>
            <th>วันที่-เวลา</th>
            <th>ประเภท</th>
            <th>รหัสม้วน (QR)</th>
            <th>ผ้า</th>
            <th>สี</th>
            <th style="text-align:right">ก่อน</th>
            <th style="text-align:right">เปลี่ยน</th>
            <th style="text-align:right">หลัง</th>
            <th>จาก → ถึง</th>
            <th>อ้างอิง</th>
            <th>ผู้ทำรายการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in filtered" :key="t.txn_id">
            <td class="whitespace-nowrap">{{ fmtDate(t.created_at) }}</td>
            <td><span class="sh-badge" :class="'sh-' + t.txn_type">{{ typeLabel(t.txn_type) }}</span></td>
            <td class="font-mono">{{ t.roll_qr_code || '-' }}</td>
            <td class="fr-td-wrap"><span class="fr-clamp"><b>{{ t.product_sku }}</b> {{ t.product_name }}</span></td>
            <td>{{ t.color_name || '-' }}</td>
            <td class="text-right tabular-nums">{{ numOrDash(t.yards_before) }}</td>
            <td class="text-right tabular-nums font-semibold" :class="t.yards_change < 0 ? 'text-[var(--danger)]' : t.yards_change > 0 ? 'text-green-600' : ''">
              {{ t.yards_change > 0 ? '+' : '' }}{{ t.yards_change }}
            </td>
            <td class="text-right tabular-nums">{{ numOrDash(t.yards_after) }}</td>
            <td class="whitespace-nowrap">{{ t.from_code || '—' }} → {{ t.to_code || '—' }}</td>
            <td>{{ t.ref_no || t.ref_type || '-' }}</td>
            <td>{{ t.user_name || '-' }}</td>
          </tr>
          <tr v-if="loading"><td colspan="11" class="text-center text-[var(--muted)] py-6">กำลังโหลด...</td></tr>
          <tr v-else-if="filtered.length === 0"><td colspan="11" class="text-center text-[var(--muted)] py-6">ไม่มีรายการ</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'StockHistoryPage',
  inject: ['dash'],
  data() {
    return { transactions: [], loading: false, search: '', filterType: '' };
  },
  computed: {
    filtered() {
      const q = this.search.trim().toLowerCase();
      return this.transactions.filter(t => {
        if (this.filterType && t.txn_type !== this.filterType) return false;
        if (q) {
          const hay = [t.roll_qr_code, t.product_sku, t.product_name, t.color_name, t.user_name, t.ref_no]
            .map(v => String(v || '').toLowerCase()).join(' ');
          if (!hay.includes(q)) return false;
        }
        return true;
      });
    },
  },
  mounted() { this.load(); },
  methods: {
    async load() {
      this.loading = true;
      try {
        const res = await fetch('/api/stock-transactions', { headers: { Authorization: 'Bearer ' + this.dash.token } });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const data = await res.json();
        this.transactions = data.transactions || [];
      } catch (e) { this.transactions = []; }
      finally { this.loading = false; }
    },
    typeLabel(t) {
      return { receive: 'รับเข้า', move: 'ย้าย/จัดเก็บ', cut: 'ตัดหลา', issue: 'จ่ายออก', adjust: 'ปรับยอด', return: 'รับคืน' }[t] || t;
    },
    numOrDash(v) { return v == null ? '—' : Number(v).toLocaleString(); },
    fmtDate(s) {
      if (!s) return '-';
      const d = new Date(s);
      if (isNaN(d)) return String(s).replace('T', ' ').slice(0, 16);
      return d.toLocaleString('th-TH', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    },
  },
};
</script>

<style scoped>
.sh-wrap { padding: 4px 2px 40px; }
.sh-card { background: var(--surface); border: 1px solid var(--field-border); border-radius: 12px; overflow: hidden; }
.sh-input { height: 36px; border: 1px solid var(--field-border); border-radius: 8px; background: var(--field); color: var(--text); font-size: 12px; padding: 0 10px; font-family: inherit; }
.sh-input:focus { outline: none; border-color: var(--brand); }
.sh-btn { height: 36px; padding: 0 14px; border: 1px solid var(--field-border); border-radius: 8px; background: var(--field); color: var(--text); font-size: 12.5px; cursor: pointer; }
.sh-btn:hover { background: var(--brand-soft); color: var(--brand); border-color: var(--brand); }
.sh-badge { font-size: 11px; font-weight: 700; padding: 2px 9px; border-radius: 20px; white-space: nowrap; }
.sh-receive { background: #e6f6ec; color: #1a9c54; }
.sh-move { background: #e8effe; color: #1e3a8a; }
.sh-cut { background: #fdeaea; color: #a82a3a; }
.sh-issue { background: #fff2e8; color: #c2410c; }
.sh-adjust { background: #f3e8ff; color: #7c3aed; }
.sh-return { background: #e6f6ec; color: #0f766e; }
</style>
