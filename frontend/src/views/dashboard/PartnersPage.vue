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
            <td>
              <div class="fr-action-group">
                <button class="fr-action-btn edit" title="แก้ไข" @click="openEdit(item)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>
                <button class="fr-action-btn delete" title="ลบ" @click="deleteItem(item)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg></button>
              </div>
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

  <!-- โมดัลเพิ่ม/แก้ไข (เลย์เอาต์ ERP 2 คอลัมน์) -->
  <div class="ptn-overlay" v-if="showModal" @click.self="showModal = false">
    <div class="ptn-modal">
      <div class="ptn-modal-head">
        <span><span class="ptn-head-ic">🤝</span> {{ editingId ? 'แก้ไขข้อมูลคู่ค้า' : 'เพิ่มคู่ค้าใหม่' }}</span>
        <button class="ptn-x" @click="showModal = false">✕</button>
      </div>
      <div class="ptn-modal-body">
        <!-- ข้อมูลบริษัท -->
        <div class="ptn-sec-title"><span class="ptn-sec-bar"></span>ข้อมูลบริษัท</div>
        <div class="ptn-grid">
          <div class="ptn-field ptn-col-2">
            <label>ชื่อบริษัท <span class="ptn-req">*</span></label>
            <input type="text" v-model="form.name" placeholder="กรอกชื่อบริษัท" :class="{ 'ptn-err': triedSave && !form.name.trim() }" />
          </div>
          <div class="ptn-field"><label>ชื่อที่ออกเช็ค</label><input type="text" v-model="form.check_name" placeholder="ชื่อสำหรับออกเช็ค" /></div>
          <div class="ptn-field"><label>กลุ่มคู่ค้า</label>
            <select v-model="form.pgroup"><option value="">— เลือกกลุ่ม —</option><option v-for="g in groupChoices" :key="g" :value="g">{{ g }}</option></select>
          </div>
          <div class="ptn-field"><label>เงื่อนไขบัญชี</label>
            <select v-model="form.account_term"><option value="">— เลือกเงื่อนไข —</option><option v-for="t in termChoices" :key="t" :value="t">{{ t }}</option></select>
          </div>
          <div class="ptn-field"><label>ประเทศ</label>
            <select v-model="form.country">
              <option value="">— เลือกประเทศ —</option>
              <optgroup label="พบบ่อย">
                <option v-for="c in commonCountries" :key="'c-'+c" :value="c">{{ c }}</option>
              </optgroup>
              <optgroup label="ทั้งหมด (A–Z)">
                <option v-for="c in allCountries" :key="'a-'+c" :value="c">{{ c }}</option>
              </optgroup>
            </select>
          </div>
        </div>

        <!-- ข้อมูลติดต่อ -->
        <div class="ptn-sec-title"><span class="ptn-sec-bar"></span>ข้อมูลติดต่อ</div>
        <div class="ptn-grid">
          <div class="ptn-field"><label>ผู้ประสานงาน</label><input type="text" v-model="form.contact" placeholder="ชื่อผู้ติดต่อ" /></div>
          <div class="ptn-field"><label>เบอร์โทร</label><input type="tel" v-model="form.phone" placeholder="0xxxxxxxxx" /></div>
          <div class="ptn-field"><label>อีเมล</label><input type="email" v-model="form.email" placeholder="email@example.com" /></div>
          <div class="ptn-field"><!-- ช่องว่างสมดุลกริด --></div>
          <div class="ptn-field ptn-col-2"><label>ที่อยู่</label><textarea v-model="form.address" rows="2" placeholder="ที่อยู่บริษัท / คู่ค้า"></textarea></div>
        </div>
      </div>
      <div class="ptn-modal-foot">
        <button class="ptn-btn ptn-btn-cancel" @click="showModal = false">ยกเลิก</button>
        <button class="ptn-btn ptn-btn-save" @click="save">💾 บันทึก</button>
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
      showModal: false, editingId: null, triedSave: false,
      form: this.blankForm(),
      // ประเทศคู่ค้าที่พบบ่อย (ขึ้นก่อน) + รายชื่อประเทศครบ
      commonCountries: ['Thailand', 'China', 'Japan', 'South Korea', 'Taiwan', 'Vietnam', 'India', 'Hong Kong', 'Singapore', 'Indonesia', 'Malaysia', 'Bangladesh', 'Pakistan'],
      allCountries: ['Afghanistan','Albania','Algeria','Argentina','Australia','Austria','Bangladesh','Belgium','Bhutan','Brazil','Brunei','Cambodia','Canada','Chile','China','Colombia','Czechia','Denmark','Egypt','Finland','France','Germany','Greece','Hong Kong','Hungary','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Japan','Jordan','Kazakhstan','Kenya','Kuwait','Laos','Lebanon','Malaysia','Maldives','Mexico','Mongolia','Morocco','Myanmar','Nepal','Netherlands','New Zealand','Nigeria','Norway','Oman','Pakistan','Philippines','Poland','Portugal','Qatar','Romania','Russia','Saudi Arabia','Singapore','Slovakia','South Africa','South Korea','Spain','Sri Lanka','Sweden','Switzerland','Taiwan','Thailand','Turkey','Ukraine','United Arab Emirates','United Kingdom','United States','Vietnam'],
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
    openAdd() { this.editingId = null; this.triedSave = false; this.form = this.blankForm(); this.showModal = true; },
    openEdit(item) { this.editingId = item.id; this.triedSave = false; this.form = { name: item.name, check_name: item.check_name, contact: item.contact, address: item.address, country: item.country, phone: item.phone, email: item.email, pgroup: item.pgroup, account_term: item.account_term }; this.showModal = true; },
    async save() {
      this.triedSave = true;
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

/* ===== โมดัล ERP 2 คอลัมน์ ===== */
.ptn-overlay {
  position: fixed; inset: 0; z-index: 3400; display: flex; align-items: center; justify-content: center;
  background: rgba(15,23,42,0.5); padding: 20px;
  font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif;
}
.ptn-modal { background: var(--surface); border-radius: 14px; width: 860px; max-width: 100%; max-height: 92vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 24px 60px rgba(0,0,0,0.3); }
.ptn-modal-head {
  background: #3c4453; color: #fff;
  padding: 15px 24px; font-size: 16px; font-weight: 700;
  display: flex; align-items: center; justify-content: space-between;
}
.ptn-head-ic { margin-right: 6px; }
.ptn-x { background: rgba(255,255,255,.18); border: none; color: #fff; width: 30px; height: 30px; border-radius: 8px; font-size: 15px; cursor: pointer; }
.ptn-x:hover { background: rgba(255,255,255,.3); }
.ptn-modal-body { padding: 22px 30px; overflow-y: auto; }
.ptn-sec-title { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; color: var(--brand-2); margin: 4px 0 12px; }
.ptn-sec-title:not(:first-child) { margin-top: 22px; }
.ptn-sec-bar { width: 4px; height: 16px; border-radius: 2px; background: #1e3a8a; display: inline-block; }
.ptn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 18px; }
.ptn-col-2 { grid-column: span 2; }
.ptn-field { display: flex; flex-direction: column; gap: 5px; }
.ptn-field > label { font-size: 12.5px; font-weight: 600; color: var(--muted); }
.ptn-req { color: #a82a3a; }
.ptn-field input, .ptn-field select, .ptn-field textarea {
  height: 38px; padding: 0 12px; border: 1px solid var(--field-border); border-radius: 9px;
  font-size: 13.5px; font-family: inherit; background: var(--surface); color: var(--text);
  transition: border-color .2s, box-shadow .2s;
}
.ptn-field textarea { height: auto; padding: 9px 12px; resize: vertical; }
.ptn-field input:focus, .ptn-field select:focus, .ptn-field textarea:focus { outline: none; border-color: #2F65F6; box-shadow: 0 0 0 3px rgba(47,101,246,.12); }
.ptn-field input.ptn-err { border-color: #a82a3a; box-shadow: 0 0 0 3px rgba(168,42,58,.12); }
.ptn-modal-foot { display: flex; justify-content: flex-end; gap: 12px; padding: 14px 24px; border-top: 1px solid var(--field-border); background: var(--field); }
.ptn-btn { padding: 10px 26px; border: none; border-radius: 9px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; }
.ptn-btn-cancel { background: #e2e8f0; color: #334155; }
.ptn-btn-cancel:hover { background: #cbd5e1; }
.ptn-btn-save { background: #1a9c54; color: #fff; }
.ptn-btn-save:hover { background: #158045; }
@media (max-width: 560px) { .ptn-grid { grid-template-columns: 1fr; } .ptn-col-2 { grid-column: span 1; } }
</style>
