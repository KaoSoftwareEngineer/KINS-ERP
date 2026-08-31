<template>
<div class="fr-page-compact">
  <div class="header flex-wrap">
    <div><h1>👥 {{ dash.t[dash.lang].employeeDataTitle }}</h1></div>
    <div class="header-actions">
      <span class="emp-note">{{ dash.t[dash.lang].employeeNoteText }}</span>
    </div>
  </div>

  <!-- สรุปจำนวนตามตำแหน่ง -->
  <div class="emp-role-chips">
    <button class="emp-chip" :class="{ active: filters.role === '' }" @click="filters.role = ''">
      {{ dash.t[dash.lang].allWord }} <b>{{ dash.members.length }}</b>
    </button>
    <button v-for="r in roleCounts" :key="r.name" class="emp-chip" :class="{ active: filters.role === r.name }" @click="filters.role = r.name">
      {{ r.name || dash.t[dash.lang].notAssignedWord }} <b>{{ r.count }}</b>
    </button>
  </div>

  <!-- ตัวกรอง -->
  <div class="section" style="margin-top: 12px;">
    <div class="fr-filter-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[18px] gap-y-[14px]">
      <div class="fr-field-group">
        <label>{{ dash.t[dash.lang].searchInput }}</label>
        <input type="text" v-model="filters.search" :placeholder="dash.t[dash.lang].searchNameEmailPhonePlaceholder" />
      </div>
      <div class="fr-field-group">
        <label>{{ dash.t[dash.lang].roleLabel }}</label>
        <select v-model="filters.role"><option value="">{{ dash.t[dash.lang].allWord }}</option><option v-for="r in roleOptions" :key="r" :value="r">{{ r || dash.t[dash.lang].notAssignedWord }}</option></select>
      </div>
      <div class="fr-field-group">
        <label>{{ dash.t[dash.lang].genderLabel }}</label>
        <select v-model="filters.gender"><option value="">{{ dash.t[dash.lang].allWord }}</option><option value="male">{{ dash.t[dash.lang].maleWord }}</option><option value="female">{{ dash.t[dash.lang].femaleWord }}</option></select>
      </div>
      <div class="fr-field-group">
        <label>&nbsp;</label>
        <div class="fr-filter-actions">
          <button class="fr-btn-util fr-btn-search" @click="page = 1">🔍 {{ dash.t[dash.lang].searchWord }}</button>
          <button class="fr-btn-util fr-btn-reset" @click="resetFilters">↺ {{ dash.t[dash.lang].resetWord }}</button>
        </div>
      </div>
    </div>
  </div>

  <div class="fr-summary fr-summary-row"><span>{{ dash.t[dash.lang].foundItems }} {{ filteredItems.length }} {{ dash.t[dash.lang].peopleUnit }}</span></div>

  <!-- ตาราง -->
  <div class="section fr-table-section" style="margin-top: 8px; padding: 0; overflow: hidden;">
    <div class="fr-table-scroll">
      <table class="fr-table">
        <thead>
          <tr>
            <th style="width:44px;">{{ dash.lang === 'th' ? 'ที่' : 'No.' }}</th>
            <th>{{ dash.t[dash.lang].fullNameLabel }}</th>
            <th>{{ dash.t[dash.lang].email }}</th>
            <th>{{ dash.t[dash.lang].mobilePhoneLabel }}</th>
            <th>{{ dash.t[dash.lang].roleLabel }}</th>
            <th>{{ dash.t[dash.lang].genderLabel }}</th>
            <th>{{ dash.t[dash.lang].ageLabel }}</th>
            <th>{{ dash.t[dash.lang].registeredDate }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(u, idx) in pagedRows" :key="u.id">
            <td>{{ (page - 1) * pageSize + idx + 1 }}</td>
            <td class="fr-td-wrap"><strong>{{ u.name || '-' }}</strong></td>
            <td>{{ u.email }}</td>
            <td>{{ u.phone || '-' }}</td>
            <td><span class="emp-role-badge" :class="{ none: !u.role }">{{ u.role || dash.t[dash.lang].notAssignedWord }}</span></td>
            <td>{{ u.gender === 'male' ? dash.t[dash.lang].maleWord : u.gender === 'female' ? dash.t[dash.lang].femaleWord : '-' }}</td>
            <td>{{ u.age || '-' }}</td>
            <td>{{ u.created_at }}</td>
          </tr>
          <tr v-if="pagedRows.length === 0"><td colspan="8" style="text-align:center;padding:24px;color:#94a3b8;">{{ dash.t[dash.lang].noEmployeesFound }}</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="xl-pagination" v-if="filteredItems.length > 0">
    <select v-model.number="pageSize" class="fr-page-size-select"><option :value="15">15 {{ dash.t[dash.lang].perPageWord }}</option><option :value="30">30 {{ dash.t[dash.lang].perPageWord }}</option><option :value="50">50 {{ dash.t[dash.lang].perPageWord }}</option></select>
    <button class="fr-btn-util" :disabled="page === 1" @click="page -= 1">{{ dash.t[dash.lang].prevPage }}</button>
    <span>{{ dash.t[dash.lang].pageWord }} {{ page }} / {{ totalPages }}</span>
    <button class="fr-btn-util" :disabled="page === totalPages" @click="page += 1">{{ dash.t[dash.lang].nextPage }}</button>
  </div>
</div>
</template>

<script>
export default {
  name: 'EmployeePage',
  inject: ['dash'],
  data() {
    return { filters: { search: '', role: '', gender: '' }, page: 1, pageSize: 15 };
  },
  computed: {
    roleOptions() { return [...new Set(this.dash.members.map(u => u.role || ''))].sort(); },
    roleCounts() {
      const map = {};
      this.dash.members.forEach(u => { const r = u.role || ''; map[r] = (map[r] || 0) + 1; });
      return Object.keys(map).sort().map(name => ({ name, count: map[name] }));
    },
    filteredItems() {
      const f = this.filters; const q = (f.search || '').trim().toLowerCase();
      return this.dash.members.filter(u => {
        if (q && !((u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q) || (u.phone || '').includes(q))) return false;
        if (f.role !== '' && (u.role || '') !== f.role) return false;
        if (f.gender && u.gender !== f.gender) return false;
        return true;
      });
    },
    totalPages() { return Math.max(1, Math.ceil(this.filteredItems.length / this.pageSize)); },
    pagedRows() { const s = (this.page - 1) * this.pageSize; return this.filteredItems.slice(s, s + this.pageSize); },
  },
  mounted() { if (!this.dash.members.length) this.dash.loadMembers(); },
  methods: {
    resetFilters() { this.filters = { search: '', role: '', gender: '' }; this.page = 1; },
  },
};
</script>

<style scoped>
.emp-note { font-size: 12px; color: var(--muted); }
.emp-role-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.emp-chip {
  padding: 6px 14px; border-radius: 999px; border: 1px solid var(--field-border);
  background: var(--surface); color: var(--text); font-size: 12.5px; cursor: pointer; font-family: inherit;
  display: inline-flex; align-items: center; gap: 6px; transition: all .15s;
}
.emp-chip b { color: var(--brand-2); }
.emp-chip:hover { border-color: var(--brand); }
.emp-chip.active { background: #1e3a8a; color: #fff; border-color: #1e3a8a; }
.emp-chip.active b { color: #fff; }
.emp-role-badge { display: inline-block; padding: 3px 10px; border-radius: 6px; background: var(--brand-soft); color: var(--brand-2); font-size: 12px; font-weight: 600; }
.emp-role-badge.none { background: #f1f5f9; color: #94a3b8; }
</style>
