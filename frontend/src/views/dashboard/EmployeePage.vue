<template>
<div class="fr-page-compact">
  <div class="header flex-wrap">
    <div><h1>👥 ข้อมูลพนักงาน</h1></div>
    <div class="header-actions">
      <span class="emp-note">* พนักงานสมัครผ่านหน้าเว็บไซต์ แล้วกำหนดตำแหน่งที่หน้า "บัญชีผู้ใช้งาน"</span>
    </div>
  </div>

  <!-- สรุปจำนวนตามตำแหน่ง -->
  <div class="emp-role-chips">
    <button class="emp-chip" :class="{ active: filters.role === '' }" @click="filters.role = ''">
      ทั้งหมด <b>{{ dash.members.length }}</b>
    </button>
    <button v-for="r in roleCounts" :key="r.name" class="emp-chip" :class="{ active: filters.role === r.name }" @click="filters.role = r.name">
      {{ r.name || 'ยังไม่กำหนด' }} <b>{{ r.count }}</b>
    </button>
  </div>

  <!-- ตัวกรอง -->
  <div class="section" style="margin-top: 12px;">
    <div class="fr-filter-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[18px] gap-y-[14px]">
      <div class="fr-field-group">
        <label>คำค้นหา</label>
        <input type="text" v-model="filters.search" placeholder="ค้นหาชื่อ / อีเมล / เบอร์" />
      </div>
      <div class="fr-field-group">
        <label>ตำแหน่ง / บทบาท</label>
        <select v-model="filters.role"><option value="">ทั้งหมด</option><option v-for="r in roleOptions" :key="r" :value="r">{{ r || 'ยังไม่กำหนด' }}</option></select>
      </div>
      <div class="fr-field-group">
        <label>เพศ</label>
        <select v-model="filters.gender"><option value="">ทั้งหมด</option><option value="male">ชาย</option><option value="female">หญิง</option></select>
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

  <div class="fr-summary fr-summary-row"><span>พบ {{ filteredItems.length }} คน</span></div>

  <!-- ตาราง -->
  <div class="section fr-table-section" style="margin-top: 8px; padding: 0; overflow: hidden;">
    <div class="fr-table-scroll">
      <table class="fr-table">
        <thead>
          <tr>
            <th style="width:44px;">ที่</th>
            <th>ชื่อ - นามสกุล</th>
            <th>อีเมล</th>
            <th>เบอร์มือถือ</th>
            <th>ตำแหน่ง / บทบาท</th>
            <th>เพศ</th>
            <th>อายุ</th>
            <th>วันที่สมัคร</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(u, idx) in pagedRows" :key="u.id">
            <td>{{ (page - 1) * pageSize + idx + 1 }}</td>
            <td class="fr-td-wrap"><strong>{{ u.name || '-' }}</strong></td>
            <td>{{ u.email }}</td>
            <td>{{ u.phone || '-' }}</td>
            <td><span class="emp-role-badge" :class="{ none: !u.role }">{{ u.role || 'ยังไม่กำหนด' }}</span></td>
            <td>{{ u.gender === 'male' ? 'ชาย' : u.gender === 'female' ? 'หญิง' : '-' }}</td>
            <td>{{ u.age || '-' }}</td>
            <td>{{ u.created_at }}</td>
          </tr>
          <tr v-if="pagedRows.length === 0"><td colspan="8" style="text-align:center;padding:24px;color:#94a3b8;">ไม่พบข้อมูลพนักงาน</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="xl-pagination" v-if="filteredItems.length > 0">
    <select v-model.number="pageSize" class="fr-page-size-select"><option :value="15">15 / หน้า</option><option :value="30">30 / หน้า</option><option :value="50">50 / หน้า</option></select>
    <button class="fr-btn-util" :disabled="page === 1" @click="page -= 1">‹ ก่อนหน้า</button>
    <span>หน้า {{ page }} / {{ totalPages }}</span>
    <button class="fr-btn-util" :disabled="page === totalPages" @click="page += 1">ถัดไป ›</button>
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
