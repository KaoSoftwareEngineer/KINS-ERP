<template>
<div class="fr-page-compact">
  <div class="header flex-wrap">
    <div><h1>📝 ข้อมูลหมายเหตุ</h1></div>
    <div class="header-actions">
      <button class="btn-small fr-btn-add" @click="openAdd">+ เพิ่ม ข้อมูลหมายเหตุ</button>
    </div>
  </div>

  <!-- ตัวกรอง -->
  <div class="section" style="margin-top: 12px;">
    <div class="fr-filter-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[18px] gap-y-[14px]">
      <div class="fr-field-group">
        <label>คำค้นหา</label>
        <input type="text" v-model="search" placeholder="ค้นหาหมายเหตุ" @keyup.enter="page = 1" />
      </div>
      <div class="fr-field-group">
        <label>ประเภท</label>
        <select v-model="filterType"><option value="">ทั้งหมด</option><option v-for="t in typeOptions" :key="t" :value="t">{{ t }}</option></select>
      </div>
      <div class="fr-field-group">
        <label>&nbsp;</label>
        <div class="fr-filter-actions">
          <button class="fr-btn-util fr-btn-search" @click="page = 1">🔍 ค้นหา</button>
          <button class="fr-btn-util fr-btn-reset" @click="search = ''; filterType = ''; page = 1">↺ รีเซ็ต</button>
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
            <th style="width:200px;">ประเภท</th>
            <th>หมายเหตุ</th>
            <th style="width:100px;">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in pagedRows" :key="item.id">
            <td>{{ (page - 1) * pageSize + idx + 1 }}</td>
            <td>{{ item.note_type || '-' }}</td>
            <td class="fr-td-wrap">{{ item.description }}</td>
            <td class="ni-actions">
              <button class="ni-ic ni-edit" title="แก้ไข" @click="openEdit(item)">✏️</button>
              <button class="ni-ic ni-del" title="ลบ" @click="deleteItem(item)">🗑️</button>
            </td>
          </tr>
          <tr v-if="loading"><td colspan="4" style="text-align:center;padding:24px;color:#94a3b8;">กำลังโหลดข้อมูล...</td></tr>
          <tr v-else-if="pagedRows.length === 0"><td colspan="4" style="text-align:center;padding:24px;color:#94a3b8;">ไม่พบข้อมูลหมายเหตุ</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="xl-pagination" v-if="filteredItems.length > 0">
    <select v-model.number="pageSize" class="fr-page-size-select"><option :value="20">20 / หน้า</option><option :value="50">50 / หน้า</option></select>
    <button class="fr-btn-util" :disabled="page === 1" @click="page -= 1">‹ ก่อนหน้า</button>
    <span>หน้า {{ page }} / {{ totalPages }}</span>
    <button class="fr-btn-util" :disabled="page === totalPages" @click="page += 1">ถัดไป ›</button>
  </div>

  <!-- โมดัลเพิ่ม/แก้ไข (ERP มาตรฐานกลาง) -->
  <div class="erp-overlay" v-if="showModal" @click.self="showModal = false">
    <div class="erp-modal" style="width: 520px;">
      <div class="erp-modal-head">
        <span><span class="erp-head-ic">📝</span> {{ editingId ? 'แก้ไข' : 'เพิ่ม' }} ข้อมูลหมายเหตุ</span>
        <button class="erp-x" @click="showModal = false">✕</button>
      </div>
      <div class="erp-modal-body">
        <div class="erp-grid" style="grid-template-columns: 1fr;">
          <div class="erp-field"><label>ประเภท <span class="erp-req">*</span></label>
            <select v-model="form.note_type"><option value="">— เลือกประเภท —</option><option v-for="t in typeChoices" :key="t" :value="t">{{ t }}</option></select>
          </div>
          <div class="erp-field"><label>หมายเหตุ <span class="erp-req">*</span></label><input type="text" v-model="form.description" placeholder="ข้อความหมายเหตุ" @keyup.enter="save" /></div>
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
  name: 'NoteInfoPage',
  inject: ['dash'],
  data() {
    return {
      items: [], loading: false, search: '', filterType: '', page: 1, pageSize: 20,
      showModal: false, editingId: null, form: { note_type: '', description: '' },
      typeChoices: ['สั่งผ้าสำเร็จ', 'สั่งผ้าดิบ', 'สั่งย้อม', 'รับออร์เดอร์', 'จัดออร์เดอร์', 'ใบกำกับภาษี', 'สัญญาขาย', 'ทั่วไป'],
    };
  },
  computed: {
    typeOptions() { return [...new Set(this.items.map(i => i.note_type).filter(Boolean))].sort(); },
    filteredItems() {
      const q = (this.search || '').trim().toLowerCase();
      return this.items.filter(i => {
        if (q && !((i.description || '').toLowerCase().includes(q) || (i.note_type || '').toLowerCase().includes(q))) return false;
        if (this.filterType && i.note_type !== this.filterType) return false;
        return true;
      });
    },
    totalPages() { return Math.max(1, Math.ceil(this.filteredItems.length / this.pageSize)); },
    pagedRows() { const s = (this.page - 1) * this.pageSize; return this.filteredItems.slice(s, s + this.pageSize); },
  },
  mounted() { this.load(); },
  methods: {
    async load() {
      this.loading = true;
      try {
        const res = await fetch('/api/note-info', { headers: { Authorization: 'Bearer ' + this.dash.token } });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const d = await res.json(); this.items = d.items || [];
      } catch (e) {} finally { this.loading = false; }
    },
    openAdd() { this.editingId = null; this.form = { note_type: '', description: '' }; this.showModal = true; },
    openEdit(item) { this.editingId = item.id; this.form = { note_type: item.note_type, description: item.description }; this.showModal = true; },
    async save() {
      if (!this.form.note_type) { this.dash.fbFail('กรุณาเลือกประเภท'); return; }
      if (!this.form.description || !this.form.description.trim()) { this.dash.fbFail('กรุณากรอกหมายเหตุ'); return; }
      this.dash.fbLoading('กำลังบันทึก...');
      try {
        const url = this.editingId ? `/api/note-info/${this.editingId}` : '/api/note-info';
        const res = await fetch(url, { method: this.editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.dash.token }, body: JSON.stringify({ note_type: this.form.note_type, description: this.form.description.trim() }) });
        if (res.status === 401) { this.dash.fbHide(); this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) { this.showModal = false; await this.load(); this.dash.fbDone('บันทึกแล้ว'); }
        else { this.dash.fbFail(d.message || 'บันทึกไม่สำเร็จ'); }
      } catch (e) { this.dash.fbFail('บันทึกไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
    },
    async deleteItem(item) {
      if (!(await this.dash.fbAskDelete(`ต้องการลบหมายเหตุนี้ใช่หรือไม่?`))) return;
      this.dash.fbLoading('กำลังลบ...');
      try {
        const res = await fetch(`/api/note-info/${item.id}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + this.dash.token } });
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
.ni-actions { display: flex; gap: 5px; }
.ni-ic { width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--field-border); background: var(--surface); cursor: pointer; font-size: 13px; }
.ni-edit:hover { background: #eef2ff; border-color: #c7d2fe; }
.ni-del:hover { background: #fef2f2; border-color: #fecaca; }
</style>
