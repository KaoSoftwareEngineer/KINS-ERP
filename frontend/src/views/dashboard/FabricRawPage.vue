<template>
<div class="fr-page-compact">
  <div class="header flex-wrap">
    <div><h1>🧻 ผ้าดิบ</h1></div>
    <div class="header-actions">
      <button class="btn-small fr-btn-add" @click="openAdd">+ เพิ่ม ผ้าดิบ</button>
    </div>
  </div>

  <!-- ตัวกรอง -->
  <div class="section" style="margin-top: 12px;">
    <div class="fr-filter-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[18px] gap-y-[14px]">
      <div class="fr-field-group">
        <label>คำค้นหา</label>
        <input type="text" v-model="filters.search" placeholder="ค้นหาชื่อ / รหัสสินค้า" />
      </div>
      <div class="fr-field-group">
        <label>ประเภท</label>
        <select v-model="filters.type"><option value="">ทั้งหมด</option><option v-for="o in typeOptions" :key="o" :value="o">{{ o }}</option></select>
      </div>
      <div class="fr-field-group">
        <label>หน้ากว้าง</label>
        <select v-model="filters.width"><option value="">ทั้งหมด</option><option v-for="o in widthOptions" :key="o" :value="o">{{ o }}</option></select>
      </div>
      <div class="fr-field-group">
        <label>Active</label>
        <select v-model="filters.active"><option value="">ทั้งหมด</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
      </div>
      <div class="fr-field-group">
        <label>รหัสสินค้า</label>
        <div class="fr-sku-range"><input type="text" v-model="filters.skuFrom" placeholder="เริ่มต้น" /><span>—</span><input type="text" v-model="filters.skuTo" placeholder="สิ้นสุด" /></div>
      </div>
      <div class="fr-field-group">
        <label>ส่วนประกอบ</label>
        <select v-model="filters.composition"><option value="">ทั้งหมด</option><option v-for="o in compositionOptions" :key="o" :value="o">{{ o }}</option></select>
      </div>
      <div class="fr-field-group" style="grid-column: span 2;">
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
            <th style="width:48px;">ที่</th>
            <th class="fr-th-sort" @click="sortBy('type')">ประเภท <span class="fr-sort-icon">{{ sortIcon('type') }}</span></th>
            <th class="fr-th-sort" @click="sortBy('sku')">รหัสสินค้า <span class="fr-sort-icon">{{ sortIcon('sku') }}</span></th>
            <th class="fr-th-sort" @click="sortBy('name')">ชื่อ <span class="fr-sort-icon">{{ sortIcon('name') }}</span></th>
            <th>โครงสร้างผ้า</th>
            <th>ส่วนประกอบ</th>
            <th>หน้ากว้าง</th>
            <th>หน่วย</th>
            <th>Shrinkage (%)</th>
            <th>Allowance (%)</th>
            <th style="width:60px;">รูป</th>
            <th style="width:100px;">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in pagedRows" :key="item.id">
            <td><input type="checkbox" :checked="selected.includes(item.id)" @change="toggleSelectRow(item)" /></td>
            <td>{{ (page - 1) * pageSize + idx + 1 }}</td>
            <td>{{ item.type || '-' }}</td>
            <td>{{ item.sku }}</td>
            <td class="fr-td-wrap">{{ item.name || '-' }}</td>
            <td>{{ item.structure || '-' }}</td>
            <td>{{ item.composition || '-' }}</td>
            <td>{{ item.width || '-' }}</td>
            <td>{{ item.unit || 'หลา' }}</td>
            <td>{{ item.shrinkage != null ? item.shrinkage : '-' }}</td>
            <td>{{ item.allowance != null ? item.allowance : '-' }}</td>
            <td><span class="fraw-img" :title="item.image_name || 'ไม่มีรูป'">🖼️</span></td>
            <td>
              <div class="fr-action-group">
                <button class="fr-action-btn edit" title="แก้ไข" @click="openEdit(item)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>
                <button class="fr-action-btn delete" title="ลบ" @click="deleteItem(item)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg></button>
              </div>
            </td>
          </tr>
          <tr v-if="loading" class="fr-empty-row"><td colspan="13" style="text-align:center;padding:24px;color:#94a3b8;">กำลังโหลดข้อมูล...</td></tr>
          <tr v-else-if="pagedRows.length === 0" class="fr-empty-row"><td colspan="13" style="text-align:center;padding:24px;color:#94a3b8;">ไม่พบข้อมูลผ้าดิบ</td></tr>
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

  <!-- โมดัลเพิ่ม/แก้ไข (ERP มาตรฐานกลาง) -->
  <div class="erp-overlay" v-if="showModal" @click.self="showModal = false">
    <div class="erp-modal">
      <div class="erp-modal-head">
        <span><span class="erp-head-ic">🧻</span> {{ editingId ? 'แก้ไขผ้าดิบ' : 'เพิ่มผ้าดิบใหม่' }}</span>
        <button class="erp-x" @click="showModal = false">✕</button>
      </div>
      <div class="erp-modal-body">
        <div class="erp-sec-title"><span class="erp-sec-bar"></span>ข้อมูลผ้าดิบ</div>
        <div class="erp-grid">
          <div class="erp-field"><label>ประเภท</label><input type="text" v-model="form.type" placeholder="เช่น Greige" /></div>
          <div class="erp-field"><label>รหัสสินค้า <span class="erp-req">*</span></label><input type="text" v-model="form.sku" placeholder="เช่น G001" /></div>
          <div class="erp-field erp-col-2"><label>ชื่อ</label><input type="text" v-model="form.name" placeholder="ชื่อผ้าดิบ" /></div>
          <div class="erp-field"><label>โครงสร้างผ้า</label><input type="text" v-model="form.structure" placeholder="เช่น Cotton 100%" /></div>
          <div class="erp-field"><label>ส่วนประกอบ</label><input type="text" v-model="form.composition" /></div>
          <div class="erp-field"><label>หน้ากว้าง</label><input type="text" v-model="form.width" /></div>
          <div class="erp-field"><label>หน่วย</label><input type="text" v-model="form.unit" placeholder="หลา" /></div>
        </div>
        <div class="erp-sec-title"><span class="erp-sec-bar"></span>ค่าเผื่อ / สถานะ</div>
        <div class="erp-grid">
          <div class="erp-field"><label>Shrinkage (%)</label><input type="number" v-model.number="form.shrinkage" /></div>
          <div class="erp-field"><label>Allowance (%)</label><input type="number" v-model.number="form.allowance" /></div>
          <div class="erp-field"><label>สถานะ</label>
            <select v-model="form.active"><option :value="true">Active</option><option :value="false">Inactive</option></select>
          </div>
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
export default {
  name: 'FabricRawPage',
  inject: ['dash'],
  data() {
    return {
      items: [], loading: false,
      filters: { search: '', type: '', width: '', active: '', skuFrom: '', skuTo: '', composition: '' },
      sortCol: '', sortDir: 'asc',
      page: 1, pageSize: 15, selected: [],
      showModal: false, editingId: null,
      form: this.blankForm(),
    };
  },
  computed: {
    typeOptions() { return [...new Set(this.items.map(i => i.type).filter(Boolean))].sort(); },
    widthOptions() { return [...new Set(this.items.map(i => i.width).filter(Boolean))].sort(); },
    compositionOptions() { return [...new Set(this.items.map(i => i.composition).filter(Boolean))].sort(); },
    filteredItems() {
      const f = this.filters; const q = (f.search || '').trim().toLowerCase();
      return this.items.filter(i => {
        if (q && !((i.name || '').toLowerCase().includes(q) || (i.sku || '').toLowerCase().includes(q))) return false;
        if (f.type && i.type !== f.type) return false;
        if (f.width && i.width !== f.width) return false;
        if (f.composition && i.composition !== f.composition) return false;
        if (f.active === 'active' && !i.active) return false;
        if (f.active === 'inactive' && i.active) return false;
        if (f.skuFrom && (i.sku || '') < f.skuFrom) return false;
        if (f.skuTo && (i.sku || '') > f.skuTo) return false;
        return true;
      });
    },
    sortedFilteredItems() {
      const list = [...this.filteredItems];
      if (this.sortCol) {
        list.sort((a, b) => {
          const x = (a[this.sortCol] || '').toString(), y = (b[this.sortCol] || '').toString();
          return this.sortDir === 'asc' ? x.localeCompare(y, 'th') : y.localeCompare(x, 'th');
        });
      }
      return list;
    },
    totalPages() { return Math.max(1, Math.ceil(this.sortedFilteredItems.length / this.pageSize)); },
    pagedRows() { const s = (this.page - 1) * this.pageSize; return this.sortedFilteredItems.slice(s, s + this.pageSize); },
    allSelectedOnPage() { return this.pagedRows.length > 0 && this.pagedRows.every(r => this.selected.includes(r.id)); },
  },
  mounted() { this.load(); },
  methods: {
    blankForm() { return { type: 'Greige', sku: '', name: '', structure: '', composition: '', width: '', unit: 'หลา', shrinkage: 0, allowance: 0, image_name: '', active: true }; },
    async load() {
      this.loading = true;
      try {
        const res = await fetch('/api/fabric-raw', { headers: { Authorization: 'Bearer ' + this.dash.token } });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const d = await res.json(); this.items = d.items || [];
      } catch (e) {} finally { this.loading = false; }
    },
    resetFilters() { this.filters = { search: '', type: '', width: '', active: '', skuFrom: '', skuTo: '', composition: '' }; this.page = 1; },
    sortBy(col) { if (this.sortCol === col) this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc'; else { this.sortCol = col; this.sortDir = 'asc'; } },
    sortIcon(col) { return this.sortCol !== col ? '↕' : (this.sortDir === 'asc' ? '▲' : '▼'); },
    toggleSelectAll() { if (this.allSelectedOnPage) this.selected = this.selected.filter(id => !this.pagedRows.some(r => r.id === id)); else { const add = this.pagedRows.map(r => r.id).filter(id => !this.selected.includes(id)); this.selected = [...this.selected, ...add]; } },
    toggleSelectRow(item) { const i = this.selected.indexOf(item.id); if (i === -1) this.selected.push(item.id); else this.selected.splice(i, 1); },
    openAdd() { this.editingId = null; this.form = this.blankForm(); this.showModal = true; },
    openEdit(item) { this.editingId = item.id; this.form = { type: item.type, sku: item.sku, name: item.name, structure: item.structure, composition: item.composition, width: item.width, unit: item.unit, shrinkage: item.shrinkage, allowance: item.allowance, image_name: item.image_name, active: !!item.active }; this.showModal = true; },
    async save() {
      if (!this.form.sku || !this.form.sku.trim()) { this.dash.fbFail('กรุณากรอกรหัสสินค้า'); return; }
      this.dash.fbLoading('กำลังบันทึก...');
      try {
        const url = this.editingId ? `/api/fabric-raw/${this.editingId}` : '/api/fabric-raw';
        const res = await fetch(url, { method: this.editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.dash.token }, body: JSON.stringify(this.form) });
        if (res.status === 401) { this.dash.fbHide(); this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) { this.showModal = false; await this.load(); this.dash.fbDone('บันทึกแล้ว'); }
        else { this.dash.fbFail(d.message || 'บันทึกไม่สำเร็จ'); }
      } catch (e) { this.dash.fbFail('บันทึกไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
    },
    async deleteItem(item) {
      if (!(await this.dash.fbAskDelete(`ต้องการลบผ้าดิบ "${item.sku}" ใช่หรือไม่?`))) return;
      this.dash.fbLoading('กำลังลบ...');
      try {
        const res = await fetch(`/api/fabric-raw/${item.id}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + this.dash.token } });
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
      for (const id of [...this.selected]) { try { await fetch(`/api/fabric-raw/${id}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + this.dash.token } }); } catch (e) { failed = true; } }
      this.selected = []; await this.load();
      failed ? this.dash.fbFail('ลบบางรายการไม่สำเร็จ') : this.dash.fbDone('ลบข้อมูลแล้ว');
    },
  },
};
</script>

<style scoped>
.fraw-actions { display: flex; gap: 5px; }
.fraw-ic { width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--field-border); background: var(--surface); cursor: pointer; font-size: 12px; }
.fraw-edit:hover { background: #eef2ff; border-color: #c7d2fe; }
.fraw-del:hover { background: #fef2f2; border-color: #fecaca; }
.fraw-img { opacity: .5; }
</style>
