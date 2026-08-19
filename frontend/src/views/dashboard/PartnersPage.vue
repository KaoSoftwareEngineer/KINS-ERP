<template>
<div class="fr-page-compact">
  <div class="header flex-wrap">
    <div><h1>🤝 คู่ค้า</h1></div>
    <div class="header-actions">
      <button class="btn-small fr-btn-add" @click="openAdd">+ เพิ่ม คู่ค้า</button>
    </div>
  </div>

  <!-- ตัวกรอง -->
  <div class="section" style="margin-top: 12px;">
    <div class="fr-filter-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[18px] gap-y-[14px]">
      <div class="fr-field-group">
        <label>คำค้นหา</label>
        <input type="text" v-model="filters.search" placeholder="ค้นหาชื่อบริษัท / ผู้ประสานงาน" />
      </div>
      <div class="fr-field-group">
        <label>กลุ่มคู่ค้า</label>
        <select v-model="filters.pgroup"><option value="">ทั้งหมด</option><option v-for="o in groupOptions" :key="o" :value="o">{{ o }}</option></select>
      </div>
      <div class="fr-field-group">
        <label>เงื่อนไขบัญชี</label>
        <select v-model="filters.account_term"><option value="">ทั้งหมด</option><option v-for="o in termOptions" :key="o" :value="o">{{ o }}</option></select>
      </div>
      <div class="fr-field-group">
        <label>&nbsp;</label>
        <div class="fr-filter-actions">
          <button class="fr-btn-util fr-btn-search" @click="page = 1">🔍 ค้นหา</button>
          <button class="fr-btn-util fr-btn-reset" @click="resetFilters">↺ รีเซ็ต</button>
        </div>
      </div>
    </div>
  </div>

  <!-- สรุป -->
  <div class="fr-summary fr-summary-row">
    <span>พบ {{ sortedFilteredItems.length }} รายการ</span>
    <div class="fr-summary-actions">
      <button v-if="selected.length > 0" class="btn-small" style="color: var(--danger); border-color: var(--danger);" @click="bulkDelete">🗑️ ลบที่เลือก ({{ selected.length }})</button>
    </div>
  </div>

  <!-- ตาราง -->
  <div class="section fr-table-section" style="margin-top: 8px; padding: 0; overflow: hidden;">
    <div class="fr-table-scroll">
      <table class="fr-table">
        <thead>
          <tr>
            <th class="fr-th-check"><input type="checkbox" :checked="allSelectedOnPage" @change="toggleSelectAll" /></th>
            <th style="width:44px;">ที่</th>
            <th class="fr-th-sort" @click="sortBy('name')">ชื่อบริษัท <span class="fr-sort-icon">{{ sortIcon('name') }}</span></th>
            <th>ชื่อที่ออกเช็ค</th>
            <th>ผู้ประสานงาน</th>
            <th>ที่อยู่</th>
            <th>ประเทศ</th>
            <th>เบอร์โทร</th>
            <th>อีเมล</th>
            <th>กลุ่มคู่ค้า</th>
            <th>เงื่อนไขบัญชี</th>
            <th style="width:96px;">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in pagedRows" :key="item.id">
            <td><input type="checkbox" :checked="selected.includes(item.id)" @change="toggleSelectRow(item)" /></td>
            <td>{{ (page - 1) * pageSize + idx + 1 }}</td>
            <td class="fr-td-wrap">{{ item.name }}</td>
            <td>{{ item.check_name || '' }}</td>
            <td>{{ item.contact || '' }}</td>
            <td class="fr-td-wrap">{{ item.address || '' }}</td>
            <td>{{ item.country || '' }}</td>
            <td>{{ item.phone || '' }}</td>
            <td>{{ item.email || '' }}</td>
            <td>{{ item.pgroup || '' }}</td>
            <td>{{ item.account_term || '' }}</td>
            <td class="ptn-actions">
              <button class="ptn-ic ptn-edit" title="แก้ไข" @click="openEdit(item)">✏️</button>
              <button class="ptn-ic ptn-del" title="ลบ" @click="deleteItem(item)">🗑️</button>
            </td>
          </tr>
          <tr v-if="loading" class="fr-empty-row"><td colspan="12" style="text-align:center;padding:24px;color:#94a3b8;">กำลังโหลดข้อมูล...</td></tr>
          <tr v-else-if="pagedRows.length === 0" class="fr-empty-row"><td colspan="12" style="text-align:center;padding:24px;color:#94a3b8;">ไม่พบข้อมูลคู่ค้า</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- เลขหน้า -->
  <div class="xl-pagination" v-if="sortedFilteredItems.length > 0">
    <select v-model.number="pageSize" class="fr-page-size-select"><option :value="15">15 / หน้า</option><option :value="30">30 / หน้า</option><option :value="50">50 / หน้า</option></select>
    <button class="fr-btn-util" :disabled="page === 1" @click="page -= 1">‹ ก่อนหน้า</button>
    <span>หน้า {{ page }} / {{ totalPages }}</span>
    <button class="fr-btn-util" :disabled="page === totalPages" @click="page += 1">ถัดไป ›</button>
  </div>

  <!-- โมดัลเพิ่ม/แก้ไข -->
  <div class="fr-modal-overlay" v-if="showModal" @click.self="showModal = false">
    <div class="fr-modal">
      <div class="fr-modal-header">
        <h3>{{ editingId ? 'แก้ไข' : 'เพิ่ม' }} คู่ค้า</h3>
        <button class="fr-modal-close" @click="showModal = false">✕</button>
      </div>
      <div class="fr-modal-body">
        <div class="fr-form-row"><label>ชื่อบริษัท <span class="fr-required">*</span></label><input type="text" v-model="form.name" placeholder="ชื่อบริษัท" /></div>
        <div class="fr-form-row"><label>ชื่อที่ออกเช็ค</label><input type="text" v-model="form.check_name" /></div>
        <div class="fr-form-row"><label>ผู้ประสานงาน</label><input type="text" v-model="form.contact" /></div>
        <div class="fr-form-row"><label>ที่อยู่</label><input type="text" v-model="form.address" /></div>
        <div class="fr-form-row"><label>ประเทศ</label>
          <select v-model="form.country"><option value="">— เลือก —</option><option v-for="c in countryChoices" :key="c" :value="c">{{ c }}</option></select>
        </div>
        <div class="fr-form-row"><label>เบอร์โทร</label><input type="text" v-model="form.phone" /></div>
        <div class="fr-form-row"><label>อีเมล</label><input type="email" v-model="form.email" /></div>
        <div class="fr-form-row"><label>กลุ่มคู่ค้า</label>
          <select v-model="form.pgroup"><option value="">— เลือก —</option><option v-for="g in groupChoices" :key="g" :value="g">{{ g }}</option></select>
        </div>
        <div class="fr-form-row"><label>เงื่อนไขบัญชี</label>
          <select v-model="form.account_term"><option value="">— เลือก —</option><option v-for="t in termChoices" :key="t" :value="t">{{ t }}</option></select>
        </div>
      </div>
      <div class="fr-modal-footer">
        <button class="fr-btn-save" @click="save">💾 บันทึก</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'PartnersPage',
  inject: ['dash'],
  data() {
    return {
      items: [], loading: false,
      filters: { search: '', pgroup: '', account_term: '' },
      sortCol: '', sortDir: 'asc',
      page: 1, pageSize: 15, selected: [],
      showModal: false, editingId: null,
      form: this.blankForm(),
      countryChoices: ['Thailand', 'Japan', 'China', 'Korea', 'Vietnam', 'India', 'Taiwan'],
      groupChoices: ['อื่นๆ', 'โรงทอ', 'โรงย้อม', 'ผู้ผลิตเส้นด้าย', 'ตัวแทนจำหน่าย'],
      termChoices: ['เงินสด', '14 Days', '30 Days', '60 Days', '90 Days', '120 Days'],
    };
  },
  computed: {
    groupOptions() { return [...new Set(this.items.map(i => i.pgroup).filter(Boolean))].sort(); },
    termOptions() { return [...new Set(this.items.map(i => i.account_term).filter(Boolean))].sort(); },
    filteredItems() {
      const f = this.filters; const q = (f.search || '').trim().toLowerCase();
      return this.items.filter(i => {
        if (q && !((i.name || '').toLowerCase().includes(q) || (i.contact || '').toLowerCase().includes(q))) return false;
        if (f.pgroup && i.pgroup !== f.pgroup) return false;
        if (f.account_term && i.account_term !== f.account_term) return false;
        return true;
      });
    },
    sortedFilteredItems() {
      const list = [...this.filteredItems];
      if (this.sortCol) list.sort((a, b) => { const x = (a[this.sortCol] || '').toString(), y = (b[this.sortCol] || '').toString(); return this.sortDir === 'asc' ? x.localeCompare(y, 'th') : y.localeCompare(x, 'th'); });
      return list;
    },
    totalPages() { return Math.max(1, Math.ceil(this.sortedFilteredItems.length / this.pageSize)); },
    pagedRows() { const s = (this.page - 1) * this.pageSize; return this.sortedFilteredItems.slice(s, s + this.pageSize); },
    allSelectedOnPage() { return this.pagedRows.length > 0 && this.pagedRows.every(r => this.selected.includes(r.id)); },
  },
  mounted() { this.load(); },
  methods: {
    blankForm() { return { name: '', check_name: '', contact: '', address: '', country: '', phone: '', email: '', pgroup: '', account_term: '' }; },
    async load() {
      this.loading = true;
      try {
        const res = await fetch('/api/partners', { headers: { Authorization: 'Bearer ' + this.dash.token } });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const d = await res.json(); this.items = d.items || [];
      } catch (e) {} finally { this.loading = false; }
    },
    resetFilters() { this.filters = { search: '', pgroup: '', account_term: '' }; this.page = 1; },
    sortBy(col) { if (this.sortCol === col) this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc'; else { this.sortCol = col; this.sortDir = 'asc'; } },
    sortIcon(col) { return this.sortCol !== col ? '↕' : (this.sortDir === 'asc' ? '▲' : '▼'); },
    toggleSelectAll() { if (this.allSelectedOnPage) this.selected = this.selected.filter(id => !this.pagedRows.some(r => r.id === id)); else { const add = this.pagedRows.map(r => r.id).filter(id => !this.selected.includes(id)); this.selected = [...this.selected, ...add]; } },
    toggleSelectRow(item) { const i = this.selected.indexOf(item.id); if (i === -1) this.selected.push(item.id); else this.selected.splice(i, 1); },
    openAdd() { this.editingId = null; this.form = this.blankForm(); this.showModal = true; },
    openEdit(item) { this.editingId = item.id; this.form = { name: item.name, check_name: item.check_name, contact: item.contact, address: item.address, country: item.country, phone: item.phone, email: item.email, pgroup: item.pgroup, account_term: item.account_term }; this.showModal = true; },
    async save() {
      if (!this.form.name || !this.form.name.trim()) { this.dash.fbFail('กรุณากรอกชื่อบริษัท'); return; }
      this.dash.fbLoading('กำลังบันทึก...');
      try {
        const url = this.editingId ? `/api/partners/${this.editingId}` : '/api/partners';
        const res = await fetch(url, { method: this.editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.dash.token }, body: JSON.stringify(this.form) });
        if (res.status === 401) { this.dash.fbHide(); this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) { this.showModal = false; await this.load(); this.dash.fbDone('บันทึกแล้ว'); }
        else { this.dash.fbFail(d.message || 'บันทึกไม่สำเร็จ'); }
      } catch (e) { this.dash.fbFail('บันทึกไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
    },
    async deleteItem(item) {
      if (!(await this.dash.fbAskDelete(`ต้องการลบคู่ค้า "${item.name}" ใช่หรือไม่?`))) return;
      this.dash.fbLoading('กำลังลบ...');
      try {
        const res = await fetch(`/api/partners/${item.id}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + this.dash.token } });
        if (res.status === 401) { this.dash.fbHide(); this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) { this.items = this.items.filter(i => i.id !== item.id); this.dash.fbDone('ลบข้อมูลแล้ว'); }
        else { this.dash.fbFail(d.message || 'ลบไม่สำเร็จ'); }
      } catch (e) { this.dash.fbFail('ลบไม่สำเร็จ'); }
    },
    async bulkDelete() {
      if (this.selected.length === 0) return;
      if (!(await this.dash.fbAskDelete(`ต้องการลบ ${this.selected.length} รายการที่เลือกใช่หรือไม่?`))) return;
      this.dash.fbLoading('กำลังลบ...'); let failed = false;
      for (const id of [...this.selected]) { try { await fetch(`/api/partners/${id}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + this.dash.token } }); } catch (e) { failed = true; } }
      this.selected = []; await this.load();
      failed ? this.dash.fbFail('ลบบางรายการไม่สำเร็จ') : this.dash.fbDone('ลบข้อมูลแล้ว');
    },
  },
};
</script>

<style scoped>
.ptn-actions { display: flex; gap: 5px; }
.ptn-ic { width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--field-border); background: var(--surface); cursor: pointer; font-size: 13px; }
.ptn-edit:hover { background: #eef2ff; border-color: #c7d2fe; }
.ptn-del:hover { background: #fef2f2; border-color: #fecaca; }
</style>
