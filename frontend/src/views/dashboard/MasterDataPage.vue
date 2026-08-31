<template>
<div class="fr-page-compact">
  <div class="header flex-wrap">
    <div><h1>{{ meta.icon }} {{ meta.title }}</h1></div>
    <div class="header-actions">
      <button class="btn-small fr-btn-add" @click="openAdd">+ {{ dash.t[dash.lang].add }} {{ meta.title }}</button>
    </div>
  </div>

  <!-- ตัวกรอง -->
  <div class="section" style="margin-top: 12px;">
    <div class="fr-filter-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[18px] gap-y-[14px]">
      <div class="fr-field-group">
        <label>{{ dash.t[dash.lang].searchInput }}</label>
        <input type="text" v-model="search" :placeholder="dash.t[dash.lang].searchNamePlaceholder" @keyup.enter="page = 1" />
      </div>
      <div class="fr-field-group">
        <label>&nbsp;</label>
        <div class="fr-filter-actions">
          <button class="fr-btn-util fr-btn-search" @click="page = 1">🔍 {{ dash.t[dash.lang].searchWord }}</button>
          <button class="fr-btn-util fr-btn-reset" @click="search = ''; page = 1">↺ {{ dash.t[dash.lang].resetWord }}</button>
        </div>
      </div>
    </div>
  </div>

  <div class="fr-summary fr-summary-row"><span>{{ dash.t[dash.lang].foundItems }} {{ filteredItems.length }} {{ dash.t[dash.lang].itemsUnit }}</span></div>

  <!-- ตาราง -->
  <div class="section fr-table-section" style="margin-top: 8px; padding: 0; overflow: hidden;">
    <div class="fr-table-scroll">
      <table class="fr-table">
        <thead>
          <tr>
            <th style="width:60px;">{{ dash.lang === 'th' ? 'ที่' : 'No.' }}</th>
            <th>{{ meta.title }}</th>
            <th v-if="meta.extra" style="width:200px;">{{ meta.extra.label }}</th>
            <th style="width:100px;">{{ dash.t[dash.lang].manageWord }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in pagedRows" :key="item.id">
            <td>{{ (page - 1) * pageSize + idx + 1 }}</td>
            <td class="fr-td-wrap">{{ item.name }}</td>
            <td v-if="meta.extra" style="text-align:right;">{{ item[meta.extra.field] != null ? Number(item[meta.extra.field]).toFixed(2) : '' }}</td>
            <td>
              <div class="fr-action-group">
                <button class="fr-action-btn edit" :title="dash.t[dash.lang].edit" @click="openEdit(item)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>
                <button class="fr-action-btn delete" :title="dash.t[dash.lang].delete" @click="deleteItem(item)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg></button>
              </div>
            </td>
          </tr>
          <tr v-if="loading"><td :colspan="meta.extra ? 4 : 3" style="text-align:center;padding:24px;color:#94a3b8;">{{ dash.t[dash.lang].loadingWord }}</td></tr>
          <tr v-else-if="pagedRows.length === 0"><td :colspan="meta.extra ? 4 : 3" style="text-align:center;padding:24px;color:#94a3b8;">{{ dash.lang === 'th' ? 'ไม่พบข้อมูล' + meta.title : 'No ' + meta.title + ' data found' }}</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="xl-pagination" v-if="filteredItems.length > 0">
    <select v-model.number="pageSize" class="fr-page-size-select"><option :value="20">20 {{ dash.t[dash.lang].perPageWord }}</option><option :value="50">50 {{ dash.t[dash.lang].perPageWord }}</option><option :value="100">100 {{ dash.t[dash.lang].perPageWord }}</option></select>
    <button class="fr-btn-util" :disabled="page === 1" @click="page -= 1">{{ dash.t[dash.lang].prevPage }}</button>
    <span>{{ dash.t[dash.lang].pageWord }} {{ page }} / {{ totalPages }}</span>
    <button class="fr-btn-util" :disabled="page === totalPages" @click="page += 1">{{ dash.t[dash.lang].nextPage }}</button>
  </div>

  <!-- โมดัลเพิ่ม/แก้ไข (ERP มาตรฐานกลาง — ช่องเดียว) -->
  <div class="erp-overlay" v-if="showModal" @click.self="showModal = false">
    <div class="erp-modal" style="width: 480px;">
      <div class="erp-modal-head">
        <span><span class="erp-head-ic">{{ meta.icon }}</span> {{ editingId ? dash.t[dash.lang].edit : dash.t[dash.lang].add }} {{ meta.title }}</span>
        <button class="erp-x" @click="showModal = false">✕</button>
      </div>
      <div class="erp-modal-body">
        <div class="erp-grid" style="grid-template-columns: 1fr;">
          <div class="erp-field"><label>{{ meta.title }} <span class="erp-req">*</span></label><input type="text" v-model="form.name" :placeholder="meta.title" @keyup.enter="save" /></div>
          <div class="erp-field" v-if="meta.extra"><label>{{ meta.extra.label }}</label><input type="number" step="0.01" v-model="form.min_yards" placeholder="0.00" @keyup.enter="save" /></div>
        </div>
      </div>
      <div class="erp-modal-foot">
        <button class="erp-btn erp-btn-cancel" @click="showModal = false">{{ dash.t[dash.lang].cancelWord }}</button>
        <button class="erp-btn erp-btn-save" @click="save">💾 {{ dash.t[dash.lang].save }}</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
const META = {
  'fabric-info-structure':   { category: 'structure',   titleKey: 'structureLabel',   icon: '🧵' },
  'fabric-info-composition': { category: 'composition', titleKey: 'compositionLabel', icon: '🧬' },
  'fabric-info-width':       { category: 'width',       titleKey: 'widthLabel',       icon: '📏', extra: { field: 'min_yards', labelKey: 'minYardsLabel' } },
  'fabric-info-finishing':   { category: 'finishing',   titleFixed: 'Finishing',      icon: '✨' },
  'fabric-info-weight':      { category: 'weight',      titleKey: 'weightLabel',      icon: '⚖️' },
};

export default {
  name: 'MasterDataPage',
  inject: ['dash'],
  data() {
    return { items: [], loading: false, search: '', page: 1, pageSize: 20, showModal: false, editingId: null, form: { name: '' } };
  },
  computed: {
    meta() {
      const t = this.dash.t[this.dash.lang];
      const m = META[this.dash.currentPage] || { category: '', titleKey: null, icon: '📄' };
      return {
        ...m,
        title: m.titleFixed || (m.titleKey ? t[m.titleKey] : t.genericDataWord),
        extra: m.extra ? { ...m.extra, label: t[m.extra.labelKey] } : undefined,
      };
    },
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
    openAdd() { this.editingId = null; this.form = { name: '', min_yards: '' }; this.showModal = true; },
    openEdit(item) { this.editingId = item.id; this.form = { name: item.name, min_yards: item.min_yards != null ? item.min_yards : '' }; this.showModal = true; },
    async save() {
      if (!this.form.name || !this.form.name.trim()) { this.dash.fbFail('กรุณากรอกชื่อ'); return; }
      this.dash.fbLoading('กำลังบันทึก...');
      try {
        const url = this.editingId ? `/api/master-data/${this.editingId}` : '/api/master-data';
        const body = this.editingId
          ? { name: this.form.name.trim(), min_yards: this.form.min_yards }
          : { category: this.meta.category, name: this.form.name.trim(), min_yards: this.form.min_yards };
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
.md-actions { display: flex; gap: 5px; }
.md-ic { width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--field-border); background: var(--surface); cursor: pointer; font-size: 12px; }
.md-edit:hover { background: #eef2ff; border-color: #c7d2fe; }
.md-del:hover { background: #fef2f2; border-color: #fecaca; }
</style>
