<template>
<div class="fr-page-compact">
  <div class="header flex-wrap">
    <div><h1>{{ meta.icon }} {{ meta.title }}</h1></div>
    <div class="header-actions">
      <button class="btn-small fr-btn-add" @click="openAdd">+ เพิ่ม {{ meta.title }}</button>
    </div>
  </div>

  <!-- ตัวกรอง -->
  <div class="section" style="margin-top: 12px;">
    <div class="fr-filter-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[18px] gap-y-[14px]">
      <div class="fr-field-group">
        <label>คำค้นหา</label>
        <input type="text" v-model="search" placeholder="ค้นหาชื่อ" @keyup.enter="page = 1" />
      </div>
      <div class="fr-field-group">
        <label>&nbsp;</label>
        <div class="fr-filter-actions">
          <button class="fr-btn-util fr-btn-search" @click="page = 1">🔍 ค้นหา</button>
          <button class="fr-btn-util fr-btn-reset" @click="search = ''; page = 1">↺ รีเซ็ต</button>
        </div>
      </div>
    </div>
  </div>

  <div class="fr-summary fr-summary-row"><span>พบ {{ filteredItems.length }} รายการ</span></div>

  <!-- ตาราง -->
  <div class="section fr-table-section" style="margin-top: 8px; padding: 0; overflow: hidden;">
    <div class="fr-table-scroll">
      <table class="fr-table">
        <thead>
          <tr>
            <th style="width:60px;">ที่</th>
            <th>ชื่อ</th>
            <th style="width:100px;">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in pagedRows" :key="item.id">
            <td>{{ (page - 1) * pageSize + idx + 1 }}</td>
            <td class="fr-td-wrap">{{ item.name }}</td>
            <td class="md-actions">
              <button class="md-ic md-edit" title="แก้ไข" @click="openEdit(item)">✏️</button>
              <button class="md-ic md-del" title="ลบ" @click="deleteItem(item)">🗑️</button>
            </td>
          </tr>
          <tr v-if="loading"><td colspan="3" style="text-align:center;padding:24px;color:#94a3b8;">กำลังโหลดข้อมูล...</td></tr>
          <tr v-else-if="pagedRows.length === 0"><td colspan="3" style="text-align:center;padding:24px;color:#94a3b8;">ไม่พบข้อมูล{{ meta.title }}</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="xl-pagination" v-if="filteredItems.length > 0">
    <select v-model.number="pageSize" class="fr-page-size-select"><option :value="20">20 / หน้า</option><option :value="50">50 / หน้า</option><option :value="100">100 / หน้า</option></select>
    <button class="fr-btn-util" :disabled="page === 1" @click="page -= 1">‹ ก่อนหน้า</button>
    <span>หน้า {{ page }} / {{ totalPages }}</span>
    <button class="fr-btn-util" :disabled="page === totalPages" @click="page += 1">ถัดไป ›</button>
  </div>

  <!-- โมดัลเพิ่ม/แก้ไข (ERP มาตรฐานกลาง — ช่องเดียว) -->
  <div class="erp-overlay" v-if="showModal" @click.self="showModal = false">
    <div class="erp-modal" style="width: 480px;">
      <div class="erp-modal-head">
        <span><span class="erp-head-ic">{{ meta.icon }}</span> {{ editingId ? 'แก้ไข' : 'เพิ่ม' }} {{ meta.title }}</span>
        <button class="erp-x" @click="showModal = false">✕</button>
      </div>
      <div class="erp-modal-body">
        <div class="erp-grid" style="grid-template-columns: 1fr;">
          <div class="erp-field"><label>ชื่อ <span class="erp-req">*</span></label><input type="text" v-model="form.name" :placeholder="'ชื่อ' + meta.title" @keyup.enter="save" /></div>
        </div>
      </div>
      <div class="erp-modal-foot">
        <button class="erp-btn erp-btn-cancel" @click="showModal = false">ยกเลิก</button>
        <button class="erp-btn erp-btn-save" @click="save">💾 บันทึก</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
const META = {
  'fabric-info-structure':   { category: 'structure',   title: 'โครงสร้างผ้า', icon: '🧵' },
  'fabric-info-composition': { category: 'composition', title: 'ส่วนประกอบ',    icon: '🧬' },
  'fabric-info-width':       { category: 'width',       title: 'หน้ากว้าง',     icon: '📏' },
  'fabric-info-finishing':   { category: 'finishing',   title: 'Finishing',     icon: '✨' },
  'fabric-info-weight':      { category: 'weight',      title: 'น้ำหนัก',       icon: '⚖️' },
};

export default {
  name: 'MasterDataPage',
  inject: ['dash'],
  data() {
    return { items: [], loading: false, search: '', page: 1, pageSize: 20, showModal: false, editingId: null, form: { name: '' } };
  },
  computed: {
    meta() { return META[this.dash.currentPage] || { category: '', title: 'ข้อมูล', icon: '📄' }; },
    filteredItems() {
      const q = (this.search || '').trim().toLowerCase();
      return q ? this.items.filter(i => (i.name || '').toLowerCase().includes(q)) : this.items;
    },
    totalPages() { return Math.max(1, Math.ceil(this.filteredItems.length / this.pageSize)); },
    pagedRows() { const s = (this.page - 1) * this.pageSize; return this.filteredItems.slice(s, s + this.pageSize); },
  },
  watch: {
    'dash.currentPage'() { this.reload(); },
  },
  mounted() { this.reload(); },
  methods: {
    reload() { if (this.meta.category) { this.search = ''; this.page = 1; this.load(); } },
    async load() {
      this.loading = true;
      try {
        const res = await fetch(`/api/master-data/${this.meta.category}`, { headers: { Authorization: 'Bearer ' + this.dash.token } });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const d = await res.json(); this.items = d.items || [];
      } catch (e) {} finally { this.loading = false; }
    },
    openAdd() { this.editingId = null; this.form = { name: '' }; this.showModal = true; },
    openEdit(item) { this.editingId = item.id; this.form = { name: item.name }; this.showModal = true; },
    async save() {
      if (!this.form.name || !this.form.name.trim()) { this.dash.fbFail('กรุณากรอกชื่อ'); return; }
      this.dash.fbLoading('กำลังบันทึก...');
      try {
        const url = this.editingId ? `/api/master-data/${this.editingId}` : '/api/master-data';
        const body = this.editingId ? { name: this.form.name.trim() } : { category: this.meta.category, name: this.form.name.trim() };
        const res = await fetch(url, { method: this.editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.dash.token }, body: JSON.stringify(body) });
        if (res.status === 401) { this.dash.fbHide(); this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) { this.showModal = false; await this.load(); this.dash.fbDone('บันทึกแล้ว'); }
        else { this.dash.fbFail(d.message || 'บันทึกไม่สำเร็จ'); }
      } catch (e) { this.dash.fbFail('บันทึกไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
    },
    async deleteItem(item) {
      if (!(await this.dash.fbAskDelete(`ต้องการลบ "${item.name}" ใช่หรือไม่?`))) return;
      this.dash.fbLoading('กำลังลบ...');
      try {
        const res = await fetch(`/api/master-data/${item.id}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + this.dash.token } });
        if (res.status === 401) { this.dash.fbHide(); this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) { this.items = this.items.filter(i => i.id !== item.id); this.dash.fbDone('ลบข้อมูลแล้ว'); }
        else { this.dash.fbFail(d.message || 'ลบไม่สำเร็จ'); }
      } catch (e) { this.dash.fbFail('ลบไม่สำเร็จ'); }
    },
  },
};
</script>

<style scoped>
/* จำกัดความกว้างตาราง (มีแค่ช่องชื่อ) ไม่ให้ยืดเต็มจอ + แถวแน่นเหมือนรูป */
.fr-table-section { max-width: 820px; }
.fr-summary-row { max-width: 820px; }
:deep(.fr-table thead th) { padding: 6px 12px; font-size: 11px; }
:deep(.fr-table tbody td) { padding: 5px 12px; font-size: 12px; }
.md-actions { display: flex; gap: 5px; }
.md-ic { width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--field-border); background: var(--surface); cursor: pointer; font-size: 13px; }
.md-edit:hover { background: #eef2ff; border-color: #c7d2fe; }
.md-del:hover { background: #fef2f2; border-color: #fecaca; }
</style>
