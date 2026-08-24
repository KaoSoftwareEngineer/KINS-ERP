<template>
<div>
  <div class="header flex-wrap">
    <div>
      <h1>{{ dash.reportPages[dash.currentPage] ? dash.reportPages[dash.currentPage].icon : '📄' }} {{ dash.pageTitle(dash.currentPage) }}</h1>
    </div>
    <div class="header-actions">
      <button class="btn-small" @click="reload">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px;vertical-align:-2px;margin-right:4px;"><path d="M3 12a9 9 0 1 1 3 6.7"/><path d="M3 16v-4h4"/></svg>
        รีเฟรช
      </button>
      <button class="btn-small btn-primary" @click="exportExcel" :disabled="rows.length === 0">
        <svg class="xls-ico" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#fff"/><path d="M14 2v6h6" fill="#cfe8dc"/><path d="M9.5 12.5l5 5M14.5 12.5l-5 5" stroke="#217346" stroke-width="1.8" stroke-linecap="round"/></svg>
        ส่งออก Excel
      </button>
    </div>
  </div>

  <div class="section" style="margin-top: 24px;">
    <div class="section-header">
      <h2>{{ dash.t[dash.lang].totalItems }} {{ rows.length }} {{ dash.t[dash.lang].itemsUnit }}</h2>
    </div>
    <div class="overflow-x-auto table-scroll-y">
    <table>
      <thead>
        <tr>
          <th v-for="col in columns" :key="col">{{ col }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, ridx) in pagedRows" :key="ridx">
          <td v-for="(cell, cidx) in row" :key="cidx">{{ cell }}</td>
        </tr>
        <tr v-if="loading">
          <td :colspan="Math.max(columns.length, 1)" style="text-align:center; padding:24px; color:#94a3b8;">กำลังโหลดข้อมูล...</td>
        </tr>
        <tr v-else-if="rows.length === 0">
          <td :colspan="Math.max(columns.length, 1)" style="text-align:center; padding:24px; color:#94a3b8;">ยังไม่มีข้อมูลสำหรับรายงานนี้ (ข้อมูลจะแสดงเมื่อมีเอกสารในระบบ)</td>
        </tr>
      </tbody>
    </table>
    </div>
    <div class="xl-pagination" v-if="rows.length > 0">
      <select v-model.number="pageSize" class="fr-page-size-select">
        <option :value="10">10 / หน้า</option>
        <option :value="20">20 / หน้า</option>
        <option :value="50">50 / หน้า</option>
        <option :value="100">100 / หน้า</option>
      </select>
      <button class="fr-btn-util" :disabled="page === 1" @click="page -= 1">‹ ก่อนหน้า</button>
      <span>หน้า {{ page }} / {{ totalPages }}</span>
      <button class="fr-btn-util" :disabled="page === totalPages" @click="page += 1">ถัดไป ›</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'ReportViewPage',
  inject: ['dash'],
  data() {
    return { columns: [], rows: [], loading: false, page: 1, pageSize: 20 };
  },
  computed: {
    totalPages() { return Math.max(1, Math.ceil(this.rows.length / this.pageSize)); },
    pagedRows() {
      const start = (this.page - 1) * this.pageSize;
      return this.rows.slice(start, start + this.pageSize);
    },
  },
  watch: {
    'dash.currentPage'() { this.reload(); },
    pageSize() { this.page = 1; },
  },
  mounted() { this.reload(); },
  methods: {
    async reload() {
      const type = this.dash.currentPage;
      if (!type || !type.startsWith('report-')) return;
      this.loading = true;
      this.page = 1;
      try {
        const res = await fetch(`/api/reports/summary/${type}`, { headers: { Authorization: 'Bearer ' + this.dash.token } });
        if (res.status === 401) { this.loading = false; return; }
        const data = await res.json();
        if (data.ok) {
          this.columns = data.columns || [];
          this.rows = data.rows || [];
        } else {
          this.columns = [];
          this.rows = [];
        }
      } catch (e) {
        this.columns = [];
        this.rows = [];
      } finally {
        this.loading = false;
      }
    },
    async exportExcel() {
      if (this.rows.length === 0) return;
      const XLSX = await import('xlsx');
      const aoa = [this.columns, ...this.rows];
      const sheet = XLSX.utils.aoa_to_sheet(aoa);
      const wb = XLSX.utils.book_new();
      const title = (this.dash.pageTitle(this.dash.currentPage) || 'รายงาน').slice(0, 28);
      XLSX.utils.book_append_sheet(wb, sheet, title);
      XLSX.writeFile(wb, `${title}-${new Date().toISOString().slice(0, 10)}.xlsx`);
    },
  },
};
</script>
