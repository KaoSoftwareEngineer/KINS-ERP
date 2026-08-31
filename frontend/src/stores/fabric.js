// ============================================================================
//  stores/fabric.js — โดเมนผ้าประจำ (fr*) + กลุ่มผ้าประจำ (frg*) + ผ้าไม่ประจำ (fi*)
//  แยกออกจาก Dashboard.vue เพื่อให้ดูแลง่ายและ reuse ได้ทุก component
//
//  หมายเหตุ: ระบบ "เฉดสี" (frShade* / frOpenShadeModal / frSaveShades ฯลฯ)
//  เป็นโครงสร้างที่ใช้ร่วมกันระหว่างผ้าประจำ/ผ้าไม่ประจำ/กลุ่มผ้า จึงยังคงอยู่
//  ใน Dashboard.vue (ไม่ย้ายเข้า store นี้) เช่นเดียวกับตัวเลือก dropdown
//  (frTypeOptions/fiTypeOptions ฯลฯ) ที่อิงข้อมูล master data (md/mdMerge) ของ Dashboard
// ============================================================================
import { defineStore } from 'pinia';
import { useAuthStore } from './auth.js';
import { useUiStore } from './ui.js';

const API = '';

export const useFabricStore = defineStore('fabric', {
  state: () => ({
    // ---- ผ้าประจำ (fabric-regular / fr*) ----
    frFilters: {
      search: '', type: '', weight: '', active: '',
      skuFrom: '', skuTo: '', composition: '', width: '', substitute: false,
    },
    frShowAddModal: false,
    frModalMode: 'add', // 'add' | 'edit' | 'view'
    frEditingId: null,
    frLoading: false,
    frNewItem: {
      type: '', sku: '', name: '', structure: '', composition: '', width: '',
      finishing: '', weight: '', unit: 'หลา', description: '', productionDays: '',
      imageName: '', substitute: 'no', active: true, groupId: '',
    },
    frGroupOptions: [],   // รายชื่อกลุ่มผ้า (fabric_regular_group) สำหรับ dropdown เลือกกลุ่ม
    frItems: [],
    frPage: 1,
    frPageSize: 50,
    frSelected: [],
    frSortBy: '',
    frSortDir: 'asc',

    // ---- กลุ่มผ้าประจำ (fabric-regular-group / frg*) ----
    // frgKind กำหนดว่ากำลังดูกลุ่ม "ผ้าประจำ" (regular) หรือ "ผ้าไม่ประจำ" (irregular)
    // Dashboard.vue เป็นผู้ตั้งค่าตอนเปลี่ยนหน้า (จาก currentPage) → ใช้เลือก API/หัวข้อ
    frgKind: 'regular', // 'regular' | 'irregular'
    frgItems: [],
    frgLoading: false,
    frgFilters: { search: '' },
    frgSortCol: -1, frgSortDir: 'asc',
    frgPage: 1, frgPageSize: 15, frgSelected: [],
    frgShowAddModal: false, frgModalMode: 'add', frgEditingId: null,
    frgNewItem: { name: '', width: '', weight: '', retail_price: '' },
    frgWidthChoices: ['36"', '44"', '58', '60"', '72"'],
    frgWeightChoices: ['บาง', 'ปานกลาง', 'หนา'],

    // ---- ผ้าไม่ประจำ (fabric-irregular / fi*) ----
    fiFilters: {
      search: '', type: '', weight: '', active: '',
      skuFrom: '', skuTo: '', composition: '', width: '', substitute: false,
    },
    fiItems: [],
    fiPage: 1,
    fiPageSize: 50,
    fiSelected: [],
    fiSortBy: '',
    fiSortDir: 'asc',
    fiLoading: false,
    fiShowModal: false,
    fiModalMode: 'add', // 'add' | 'edit' | 'view'
    fiEditingId: null,
    fiNewItem: {
      type: '', sku: '', name: '', structure: '', composition: '', width: '',
      finishing: '', weight: '', unit: 'หลา', description: '', productionDays: '',
      imageName: '', substitute: 'no', active: true,
    },
  }),

  getters: {
    // ---- ผ้าประจำ (fr*) ----
    frFilteredItems(state) {
      const f = state.frFilters;
      const q = f.search.trim().toLowerCase();
      return state.frItems.filter(item => {
        if (q && !(item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q))) return false;
        if (f.type && item.type !== f.type) return false;
        if (f.weight && this.frWeightBucket(item.weight) !== f.weight) return false;
        if (f.active === 'active' && !item.active) return false;
        if (f.active === 'inactive' && item.active) return false;
        if (f.composition && item.composition !== f.composition) return false;
        if (f.width && item.width !== f.width) return false;
        if (f.substitute && !item.substitute) return false;
        if (f.skuFrom && item.sku < f.skuFrom) return false;
        if (f.skuTo && item.sku > f.skuTo) return false;
        return true;
      });
    },
    frSortedFilteredItems() {
      const items = [...this.frFilteredItems];
      if (!this.frSortBy) return items;
      const key = this.frSortBy;
      const dir = this.frSortDir === 'asc' ? 1 : -1;
      return items.sort((a, b) => {
        if (key === 'colors' || key === 'weight') return ((Number(a[key]) || 0) - (Number(b[key]) || 0)) * dir;
        const av = String(a[key] || '').toLowerCase();
        const bv = String(b[key] || '').toLowerCase();
        if (av < bv) return -1 * dir;
        if (av > bv) return 1 * dir;
        return 0;
      });
    },
    frTotalPages() {
      return Math.max(1, Math.ceil(this.frSortedFilteredItems.length / this.frPageSize));
    },
    frPagedItems() {
      const start = (this.frPage - 1) * this.frPageSize;
      return this.frSortedFilteredItems.slice(start, start + this.frPageSize);
    },
    frAllSelectedOnPage() {
      return this.frPagedItems.length > 0 && this.frPagedItems.every(i => this.frSelected.includes(i.sku));
    },

    // ---- กลุ่มผ้าประจำ (frg*) ----
    frgApiBase: (state) => state.frgKind === 'irregular' ? '/api/fabric-irregular-group' : '/api/fabric-regular-group',
    frgFilteredItems() {
      const q = (this.frgFilters.search || '').trim().toLowerCase();
      let list = this.frgItems;
      if (q) list = list.filter(i => (i.name || '').toLowerCase().includes(q));
      return list;
    },
    frgSortedFilteredItems() {
      const list = [...this.frgFilteredItems];
      if (this.frgSortCol >= 0) {
        const keys = ['name', 'width', 'weight', 'retail_price', 'colors'];
        const key = keys[this.frgSortCol];
        list.sort((a, b) => {
          let x = a[key], y = b[key];
          if (key === 'retail_price' || key === 'colors') { x = Number(x) || 0; y = Number(y) || 0; return this.frgSortDir === 'asc' ? x - y : y - x; }
          x = (x || '').toString(); y = (y || '').toString();
          return this.frgSortDir === 'asc' ? x.localeCompare(y, 'th') : y.localeCompare(x, 'th');
        });
      }
      return list;
    },
    frgTotalPages() { return Math.max(1, Math.ceil(this.frgSortedFilteredItems.length / this.frgPageSize)); },
    frgPagedRows() {
      const start = (this.frgPage - 1) * this.frgPageSize;
      return this.frgSortedFilteredItems.slice(start, start + this.frgPageSize);
    },
    frgAllSelectedOnPage() {
      return this.frgPagedRows.length > 0 && this.frgPagedRows.every(r => this.frgSelected.includes(r.id));
    },

    // ---- ผ้าไม่ประจำ (fi*) ----
    fiFilteredItems() {
      const f = this.fiFilters;
      const q = f.search.trim().toLowerCase();
      return this.fiItems.filter(item => {
        if (q && !(item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q))) return false;
        if (f.type && item.type !== f.type) return false;
        if (f.weight && this.frWeightBucket(item.weight) !== f.weight) return false;
        if (f.active === 'active' && !item.active) return false;
        if (f.active === 'inactive' && item.active) return false;
        if (f.composition && item.composition !== f.composition) return false;
        if (f.width && item.width !== f.width) return false;
        if (f.substitute && !item.substitute) return false;
        if (f.skuFrom && item.sku < f.skuFrom) return false;
        if (f.skuTo && item.sku > f.skuTo) return false;
        return true;
      });
    },
    fiSortedFilteredItems() {
      const items = [...this.fiFilteredItems];
      if (!this.fiSortBy) return items;
      const key = this.fiSortBy;
      const dir = this.fiSortDir === 'asc' ? 1 : -1;
      return items.sort((a, b) => {
        if (key === 'colors' || key === 'weight') return ((Number(a[key]) || 0) - (Number(b[key]) || 0)) * dir;
        const av = String(a[key] || '').toLowerCase();
        const bv = String(b[key] || '').toLowerCase();
        if (av < bv) return -1 * dir;
        if (av > bv) return 1 * dir;
        return 0;
      });
    },
    fiTotalPages() {
      return Math.max(1, Math.ceil(this.fiSortedFilteredItems.length / this.fiPageSize));
    },
    fiPagedItems() {
      const start = (this.fiPage - 1) * this.fiPageSize;
      return this.fiSortedFilteredItems.slice(start, start + this.fiPageSize);
    },
    fiAllSelectedOnPage() {
      return this.fiPagedItems.length > 0 && this.fiPagedItems.every(i => this.fiSelected.includes(i.sku));
    },
  },

  actions: {
    // ---- ผ้าประจำ (fr*) ----
    // ตัวช่วยจัดกลุ่มน้ำหนัก (สำเนาของ Dashboard.frWeightBucket — pure function ใช้ในตัวกรอง)
    frWeightBucket(weight) {
      const n = Number(weight);
      if (!weight || isNaN(n)) return 'mid';
      if (n < 150) return 'light';
      if (n <= 250) return 'mid';
      return 'heavy';
    },
    frSearch() {
      this.frPage = 1;
    },
    frResetFilters() {
      this.frFilters = {
        search: '', type: '', weight: '', active: '',
        skuFrom: '', skuTo: '', composition: '', width: '', substitute: false,
      };
      this.frPage = 1;
    },
    frSort(key) {
      if (this.frSortBy === key) {
        this.frSortDir = this.frSortDir === 'asc' ? 'desc' : 'asc';
      } else {
        this.frSortBy = key;
        this.frSortDir = 'asc';
      }
    },
    frSortIcon(key) {
      if (this.frSortBy !== key) return '↕';
      return this.frSortDir === 'asc' ? '▲' : '▼';
    },
    frClearSelection() {
      this.frSelected = [];
    },
    frPrintBarcode() {
      const items = this.frItems.filter(i => this.frSelected.includes(i.sku));
      if (items.length === 0) return;
      const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
      ));
      // สร้างลาย barcode อย่างง่ายจากรหัสสินค้า (แสดงผล/พิมพ์ได้ — ถ้าต้องการบาร์โค้ดสแกนได้จริงใช้ไลบรารีเพิ่ม)
      const bars = (code) => {
        let out = '';
        const s = String(code || '');
        for (let i = 0; i < s.length; i++) {
          const n = s.charCodeAt(i);
          for (let b = 0; b < 4; b++) {
            const w = ((n >> b) & 1) ? 3 : 1;
            const black = (b % 2 === 0);
            out += `<span class="bar" style="width:${w}px;background:${black ? '#000' : 'transparent'}"></span>`;
          }
        }
        return out;
      };
      const labels = items.map(i => `
        <div class="label">
          <div class="lb-name">${esc(i.name || i.type || '-')}</div>
          <div class="lb-bars">${bars(i.sku)}</div>
          <div class="lb-code">${esc(i.sku)}</div>
        </div>`).join('');
      const win = window.open('', '_blank', 'width=820,height=640');
      if (!win) { alert('เบราว์เซอร์บล็อกหน้าต่างพิมพ์ — กรุณาอนุญาต popup'); return; }
      win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>พิมพ์บาร์โค้ด (${items.length})</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, sans-serif; margin: 16px; }
          .sheet { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
          .label { border: 1px solid #ddd; border-radius: 6px; padding: 10px; text-align: center; page-break-inside: avoid; }
          .lb-name { font-size: 12px; color: #333; margin-bottom: 6px; min-height: 30px; word-break: break-word; }
          .lb-bars { display: flex; align-items: flex-end; justify-content: center; height: 44px; gap: 0; }
          .lb-bars .bar { display: inline-block; height: 44px; }
          .lb-code { font-family: 'Courier New', monospace; font-size: 13px; font-weight: 700; letter-spacing: 1px; margin-top: 4px; }
          @media print { .no-print { display: none; } }
        </style></head><body>
        <div class="no-print" style="margin-bottom:12px;text-align:center">
          <button onclick="window.print()" style="padding:8px 18px;font-size:14px;cursor:pointer">🖨️ พิมพ์</button>
        </div>
        <div class="sheet">${labels}</div>
        </body></html>`);
      win.document.close();
    },
    frPrevPage() {
      if (this.frPage > 1) this.frPage -= 1;
    },
    frNextPage() {
      if (this.frPage < this.frTotalPages) this.frPage += 1;
    },
    frToggleSelectAll() {
      if (this.frAllSelectedOnPage) {
        const pageSkus = this.frPagedItems.map(i => i.sku);
        this.frSelected = this.frSelected.filter(sku => !pageSkus.includes(sku));
      } else {
        const newSkus = this.frPagedItems.map(i => i.sku).filter(sku => !this.frSelected.includes(sku));
        this.frSelected = [...this.frSelected, ...newSkus];
      }
    },
    frToggleSelect(sku) {
      const idx = this.frSelected.indexOf(sku);
      if (idx === -1) this.frSelected.push(sku);
      else this.frSelected.splice(idx, 1);
    },
    async frBulkDelete() {
      const auth = useAuthStore();
      const ui = useUiStore();
      if (this.frSelected.length === 0) return;
      if (!(await ui.fbAskDelete(`ต้องการลบ ${this.frSelected.length} รายการที่เลือกใช่หรือไม่?`))) return;
      ui.fbLoading('กำลังลบ...');
      const items = this.frItems.filter(i => this.frSelected.includes(i.sku));
      let failed = false;
      for (const item of items) {
        try {
          await fetch(API + `/api/fabrics/${item.id}`, {
            method: 'DELETE',
            headers: { Authorization: 'Bearer ' + auth.token },
          });
        } catch (e) { failed = true; }
      }
      this.frSelected = [];
      await this.frLoadItems();
      failed ? ui.fbFail('ลบบางรายการไม่สำเร็จ') : ui.fbDone('ลบข้อมูลแล้ว');
    },
    async frExportExcel(selectedOnly) {
      const ui = useUiStore();
      const rows = selectedOnly ? this.frItems.filter(i => this.frSelected.includes(i.sku)) : this.frSortedFilteredItems;
      if (rows.length === 0) {
        ui.fbFail('ไม่มีข้อมูลให้ส่งออก');
        return;
      }
      const XLSX = await import('xlsx');
      const aoa = [
        ['ประเภท', 'รหัสสินค้า', 'จำนวนสี', 'ชื่อ', 'โครงสร้างผ้า', 'ส่วนประกอบ', 'หน้ากว้าง', 'Finishing', 'น้ำหนัก', 'หน่วย'],
        ...rows.map(i => [i.type, i.sku, i.colors, i.name, i.structure, i.composition, i.width, i.finishing, i.weight, i.unit]),
      ];
      const sheet = XLSX.utils.aoa_to_sheet(aoa);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, sheet, 'ผ้าประจำ');
      XLSX.writeFile(wb, `ผ้าประจำ-${new Date().toISOString().slice(0, 10)}.xlsx`);
    },
    async frLoadItems() {
      const auth = useAuthStore();
      this.frLoading = true;
      this.frLoadGroups();
      try {
        const res = await fetch(API + '/api/fabrics', {
          headers: { Authorization: 'Bearer ' + auth.token },
        });
        if (res.status === 401) { auth.sessionExpired(); return; }
        const data = await res.json();
        this.frItems = (data.fabrics || []).map(row => ({
          id: row.id,
          type: row.type || '',
          sku: row.sku,
          colors: row.colors || 1,
          name: row.name || '',
          structure: row.structure || '',
          composition: row.composition || '',
          width: row.width || '',
          finishing: row.finishing || '',
          weight: row.weight || '',
          unit: row.unit || 'หลา',
          description: row.description || '',
          productionDays: row.production_days,
          imageName: row.image_name || '',
          active: !!row.active,
          substitute: !!row.substitute,
          groupId: row.group_id || '',
        }));
      } catch (e) {
        this.frItems = [];
      } finally {
        this.frLoading = false;
      }
    },
    async frLoadGroups() {
      const auth = useAuthStore();
      try {
        const res = await fetch(API + '/api/fabric-regular-group', { headers: { Authorization: 'Bearer ' + auth.token } });
        if (res.status === 401) { auth.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) this.frGroupOptions = d.items || [];
      } catch (e) { /* ปล่อยว่าง */ }
    },
    frOpenAdd() {
      this.frModalMode = 'add';
      this.frEditingId = null;
      this.frNewItem = {
        type: '', sku: '', name: '', structure: '', composition: '', width: '',
        finishing: '', weight: '', unit: 'หลา', description: '', productionDays: '',
        imageName: '', substitute: 'no', active: true, groupId: '',
      };
      this.frShowAddModal = true;
    },
    frEditItem(item) {
      this.frModalMode = 'edit';
      this.frEditingId = item.id;
      this.frNewItem = {
        type: item.type, sku: item.sku, name: item.name, structure: item.structure,
        composition: item.composition, width: item.width, finishing: item.finishing,
        weight: item.weight, unit: item.unit || 'หลา', description: item.description || '',
        productionDays: item.productionDays || '', imageName: item.imageName || '',
        substitute: item.substitute ? 'yes' : 'no', active: item.active,
        groupId: item.groupId || '',
      };
      this.frShowAddModal = true;
    },
    frViewItem(item) {
      this.frEditItem(item);
      this.frModalMode = 'view';
    },
    async frDeleteItem(item) {
      const auth = useAuthStore();
      const ui = useUiStore();
      if (!(await ui.fbAskDelete(`ต้องการลบ "${item.name || item.sku}" ใช่หรือไม่?`))) return;
      ui.fbLoading('กำลังลบ...');
      try {
        const res = await fetch(API + `/api/fabrics/${item.id}`, {
          method: 'DELETE',
          headers: { Authorization: 'Bearer ' + auth.token },
        });
        if (res.status === 401) { ui.fbHide(); auth.sessionExpired(); return; }
        const data = await res.json();
        if (data.ok) {
          this.frItems = this.frItems.filter(i => i.id !== item.id);
          ui.fbDone('ลบข้อมูลแล้ว');
        } else {
          ui.fbFail(data.message || 'ลบไม่สำเร็จ');
        }
      } catch (e) {
        ui.fbFail('ลบข้อมูลไม่สำเร็จ — ตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์');
      }
    },
    frCloseAddModal() {
      this.frShowAddModal = false;
    },
    frHandleFileChange(e) {
      this.frNewItem.imageName = e.target.files[0] ? e.target.files[0].name : '';
    },
    async frSaveAdd() {
      const auth = useAuthStore();
      const ui = useUiStore();
      if (!this.frNewItem.type || !this.frNewItem.sku || !this.frNewItem.width) {
        ui.fbFail('กรุณากรอกข้อมูลที่จำเป็น (ประเภท, รหัสสินค้า, หน้ากว้าง) ให้ครบถ้วน');
        return;
      }
      const payload = {
        type: this.frNewItem.type,
        sku: this.frNewItem.sku,
        name: this.frNewItem.name,
        structure: this.frNewItem.structure,
        composition: this.frNewItem.composition,
        width: this.frNewItem.width,
        finishing: this.frNewItem.finishing,
        weight: this.frNewItem.weight,
        unit: this.frNewItem.unit,
        description: this.frNewItem.description,
        production_days: this.frNewItem.productionDays || null,
        image_name: this.frNewItem.imageName,
        substitute: this.frNewItem.substitute === 'yes',
        active: this.frNewItem.active,
        group_id: this.frNewItem.groupId || null,
      };
      ui.fbLoading('กำลังบันทึก...');
      try {
        const url = this.frEditingId ? API + `/api/fabrics/${this.frEditingId}` : API + '/api/fabrics';
        const method = this.frEditingId ? 'PUT' : 'POST';
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.token },
          body: JSON.stringify(payload),
        });
        if (res.status === 401) { ui.fbHide(); auth.sessionExpired(); return; }
        const data = await res.json();
        if (data.ok) {
          await this.frLoadItems();
          this.frCloseAddModal();
          ui.fbDone('บันทึกแล้ว');
        } else {
          ui.fbFail(data.message || 'บันทึกไม่สำเร็จ');
        }
      } catch (e) {
        ui.fbFail('บันทึกข้อมูลไม่สำเร็จ — ตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์');
      }
    },

    // ---- กลุ่มผ้าประจำ (frg*) ----
    async frgLoadItems() {
      const auth = useAuthStore();
      this.frgLoading = true;
      try {
        const res = await fetch(API + this.frgApiBase, { headers: { Authorization: 'Bearer ' + auth.token } });
        if (res.status === 401) { auth.sessionExpired(); return; }
        const data = await res.json();
        this.frgItems = data.items || [];
      } catch (e) { /* เงียบ */ } finally { this.frgLoading = false; }
    },
    frgResetFilters() { this.frgFilters = { search: '' }; this.frgPage = 1; },
    frgSort(colIdx) {
      if (this.frgSortCol === colIdx) this.frgSortDir = this.frgSortDir === 'asc' ? 'desc' : 'asc';
      else { this.frgSortCol = colIdx; this.frgSortDir = 'asc'; }
    },
    frgSortIcon(colIdx) {
      if (this.frgSortCol !== colIdx) return '↕';
      return this.frgSortDir === 'asc' ? '▲' : '▼';
    },
    frgPrevPage() { if (this.frgPage > 1) this.frgPage -= 1; },
    frgNextPage() { if (this.frgPage < this.frgTotalPages) this.frgPage += 1; },
    frgToggleSelectAll() {
      if (this.frgAllSelectedOnPage) this.frgSelected = this.frgSelected.filter(id => !this.frgPagedRows.some(r => r.id === id));
      else { const add = this.frgPagedRows.map(r => r.id).filter(id => !this.frgSelected.includes(id)); this.frgSelected = [...this.frgSelected, ...add]; }
    },
    frgToggleSelectRow(item) {
      const i = this.frgSelected.indexOf(item.id);
      if (i === -1) this.frgSelected.push(item.id); else this.frgSelected.splice(i, 1);
    },
    frgOpenAdd() {
      this.frgModalMode = 'add'; this.frgEditingId = null;
      this.frgNewItem = { name: '', width: '', weight: '', retail_price: '' };
      this.frgShowAddModal = true;
    },
    frgEditItem(item) {
      this.frgModalMode = 'edit'; this.frgEditingId = item.id;
      this.frgNewItem = { name: item.name, width: item.width, weight: item.weight, retail_price: item.retail_price };
      this.frgShowAddModal = true;
    },
    frgCloseAddModal() { this.frgShowAddModal = false; },
    async frgSaveAdd() {
      const auth = useAuthStore();
      const ui = useUiStore();
      if (!this.frgNewItem.name || !this.frgNewItem.name.trim()) { ui.fbFail('กรุณากรอกชื่อกลุ่มผ้า'); return; }
      ui.fbLoading('กำลังบันทึก...');
      try {
        const url = this.frgEditingId ? API + `${this.frgApiBase}/${this.frgEditingId}` : API + this.frgApiBase;
        const res = await fetch(url, {
          method: this.frgEditingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.token },
          body: JSON.stringify(this.frgNewItem),
        });
        if (res.status === 401) { ui.fbHide(); auth.sessionExpired(); return; }
        const data = await res.json();
        if (data.ok) { this.frgShowAddModal = false; await this.frgLoadItems(); ui.fbDone('บันทึกแล้ว'); }
        else { ui.fbFail(data.message || 'บันทึกไม่สำเร็จ'); }
      } catch (e) { ui.fbFail('บันทึกไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
    },
    async frgDeleteItem(item) {
      const auth = useAuthStore();
      const ui = useUiStore();
      if (!(await ui.fbAskDelete(`ต้องการลบกลุ่มผ้า "${item.name}" ใช่หรือไม่?`))) return;
      ui.fbLoading('กำลังลบ...');
      try {
        const res = await fetch(API + `${this.frgApiBase}/${item.id}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + auth.token } });
        if (res.status === 401) { ui.fbHide(); auth.sessionExpired(); return; }
        const data = await res.json();
        if (data.ok) { this.frgItems = this.frgItems.filter(i => i.id !== item.id); this.frgSelected = this.frgSelected.filter(id => id !== item.id); ui.fbDone('ลบข้อมูลแล้ว'); }
        else { ui.fbFail(data.message || 'ลบไม่สำเร็จ'); }
      } catch (e) { ui.fbFail('ลบไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
    },
    async frgBulkDelete() {
      const auth = useAuthStore();
      const ui = useUiStore();
      if (this.frgSelected.length === 0) return;
      if (!(await ui.fbAskDelete(`ต้องการลบ ${this.frgSelected.length} รายการที่เลือกใช่หรือไม่?`))) return;
      ui.fbLoading('กำลังลบ...');
      let failed = false;
      for (const id of [...this.frgSelected]) {
        try { await fetch(API + `${this.frgApiBase}/${id}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + auth.token } }); } catch (e) { failed = true; }
      }
      this.frgSelected = []; await this.frgLoadItems();
      failed ? ui.fbFail('ลบบางรายการไม่สำเร็จ') : ui.fbDone('ลบข้อมูลแล้ว');
    },

    // ---- ผ้าไม่ประจำ (fi*) ----
    fiSearch() {
      // v-model ผูกกับ fiFilters อยู่แล้ว ปุ่มนี้ไว้สำหรับกรณีเชื่อมต่อ API จริงในอนาคต
    },
    fiResetFilters() {
      this.fiFilters = {
        search: '', type: '', weight: '', active: '',
        skuFrom: '', skuTo: '', composition: '', width: '', substitute: false,
      };
    },
    fiSort(key) {
      if (this.fiSortBy === key) {
        this.fiSortDir = this.fiSortDir === 'asc' ? 'desc' : 'asc';
      } else {
        this.fiSortBy = key;
        this.fiSortDir = 'asc';
      }
    },
    fiPrevPage() {
      if (this.fiPage > 1) this.fiPage -= 1;
    },
    fiNextPage() {
      if (this.fiPage < this.fiTotalPages) this.fiPage += 1;
    },
    fiToggleSelectAll() {
      if (this.fiAllSelectedOnPage) {
        const pageSkus = this.fiPagedItems.map(i => i.sku);
        this.fiSelected = this.fiSelected.filter(sku => !pageSkus.includes(sku));
      } else {
        const newSkus = this.fiPagedItems.map(i => i.sku).filter(sku => !this.fiSelected.includes(sku));
        this.fiSelected = [...this.fiSelected, ...newSkus];
      }
    },
    fiToggleSelect(sku) {
      const idx = this.fiSelected.indexOf(sku);
      if (idx === -1) this.fiSelected.push(sku);
      else this.fiSelected.splice(idx, 1);
    },
    async fiBulkDelete() {
      const auth = useAuthStore();
      const ui = useUiStore();
      if (this.fiSelected.length === 0) return;
      if (!(await ui.fbAskDelete(`ต้องการลบ ${this.fiSelected.length} รายการที่เลือกใช่หรือไม่?`))) return;
      ui.fbLoading('กำลังลบ...');
      const items = this.fiItems.filter(i => this.fiSelected.includes(i.sku));
      let failed = false;
      for (const item of items) {
        try {
          await fetch(API + `/api/fabric-irregular/${item.id}`, {
            method: 'DELETE',
            headers: { Authorization: 'Bearer ' + auth.token },
          });
        } catch (e) { failed = true; }
      }
      this.fiSelected = [];
      await this.fiLoadItems();
      failed ? ui.fbFail('ลบบางรายการไม่สำเร็จ') : ui.fbDone('ลบข้อมูลแล้ว');
    },
    async fiExportExcel(selectedOnly) {
      const ui = useUiStore();
      const rows = selectedOnly ? this.fiItems.filter(i => this.fiSelected.includes(i.sku)) : this.fiSortedFilteredItems;
      if (rows.length === 0) {
        ui.fbFail('ไม่มีข้อมูลให้ส่งออก');
        return;
      }
      const XLSX = await import('xlsx');
      const aoa = [
        ['ประเภท', 'รหัสสินค้า', 'จำนวนสี', 'ชื่อ', 'โครงสร้างผ้า', 'ส่วนประกอบ', 'หน้ากว้าง', 'Finishing', 'น้ำหนัก', 'หน่วย'],
        ...rows.map(i => [i.type, i.sku, i.colors, i.name, i.structure, i.composition, i.width, i.finishing, i.weight, i.unit]),
      ];
      const sheet = XLSX.utils.aoa_to_sheet(aoa);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, sheet, 'ผ้าไม่ประจำ');
      XLSX.writeFile(wb, `ผ้าไม่ประจำ-${new Date().toISOString().slice(0, 10)}.xlsx`);
    },
    async fiLoadItems() {
      const auth = useAuthStore();
      this.fiLoading = true;
      try {
        const res = await fetch(API + '/api/fabric-irregular', {
          headers: { Authorization: 'Bearer ' + auth.token },
        });
        if (res.status === 401) { auth.sessionExpired(); return; }
        const data = await res.json();
        this.fiItems = (data.items || []).map(row => ({
          id: row.id,
          type: row.type || '',
          sku: row.sku,
          colors: row.colors || 1,
          name: row.name || '',
          structure: row.structure || '',
          composition: row.composition || '',
          width: row.width || '',
          finishing: row.finishing || '',
          weight: row.weight || '',
          unit: row.unit || 'หลา',
          description: row.description || '',
          productionDays: row.production_days,
          imageName: row.image_name || '',
          active: !!row.active,
          substitute: !!row.substitute,
        }));
      } catch (e) {
        this.fiItems = [];
      } finally {
        this.fiLoading = false;
      }
    },
    fiHandleFileChange(e) {
      this.fiNewItem.imageName = e.target.files[0] ? e.target.files[0].name : '';
    },
    fiOpenAdd() {
      this.fiModalMode = 'add';
      this.fiEditingId = null;
      this.fiNewItem = {
        type: '', sku: '', name: '', structure: '', composition: '', width: '',
        finishing: '', weight: '', unit: 'หลา', description: '', productionDays: '',
        imageName: '', substitute: 'no', active: true,
      };
      this.fiShowModal = true;
    },
    fiEditItem(item) {
      this.fiModalMode = 'edit';
      this.fiEditingId = item.id;
      this.fiNewItem = {
        type: item.type, sku: item.sku, name: item.name, structure: item.structure,
        composition: item.composition, width: item.width, finishing: item.finishing,
        weight: item.weight, unit: item.unit || 'หลา', description: item.description || '',
        productionDays: item.productionDays || '', imageName: item.imageName || '',
        substitute: item.substitute ? 'yes' : 'no', active: item.active,
      };
      this.fiShowModal = true;
    },
    fiViewItem(item) {
      this.fiEditItem(item);
      this.fiModalMode = 'view';
    },
    fiCloseModal() {
      this.fiShowModal = false;
    },
    async fiDeleteItem(item) {
      const auth = useAuthStore();
      const ui = useUiStore();
      if (!(await ui.fbAskDelete(`ต้องการลบ "${item.name || item.sku}" ใช่หรือไม่?`))) return;
      ui.fbLoading('กำลังลบ...');
      try {
        const res = await fetch(API + `/api/fabric-irregular/${item.id}`, {
          method: 'DELETE',
          headers: { Authorization: 'Bearer ' + auth.token },
        });
        if (res.status === 401) { ui.fbHide(); auth.sessionExpired(); return; }
        const data = await res.json();
        if (data.ok) {
          this.fiItems = this.fiItems.filter(i => i.id !== item.id);
          ui.fbDone('ลบข้อมูลแล้ว');
        } else {
          ui.fbFail(data.message || 'ลบไม่สำเร็จ');
        }
      } catch (e) {
        ui.fbFail('ลบข้อมูลไม่สำเร็จ — ตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์');
      }
    },
    async fiSaveItem() {
      const auth = useAuthStore();
      const ui = useUiStore();
      if (!this.fiNewItem.type || !this.fiNewItem.sku || !this.fiNewItem.width) {
        ui.fbFail('กรุณากรอกข้อมูลที่จำเป็น (ประเภท, รหัสสินค้า, หน้ากว้าง) ให้ครบถ้วน');
        return;
      }
      const payload = {
        type: this.fiNewItem.type,
        sku: this.fiNewItem.sku,
        name: this.fiNewItem.name,
        structure: this.fiNewItem.structure,
        composition: this.fiNewItem.composition,
        width: this.fiNewItem.width,
        finishing: this.fiNewItem.finishing,
        weight: this.fiNewItem.weight,
        unit: this.fiNewItem.unit,
        description: this.fiNewItem.description,
        production_days: this.fiNewItem.productionDays || null,
        image_name: this.fiNewItem.imageName,
        substitute: this.fiNewItem.substitute === 'yes',
        active: this.fiNewItem.active,
      };
      ui.fbLoading('กำลังบันทึก...');
      try {
        const url = this.fiEditingId ? API + `/api/fabric-irregular/${this.fiEditingId}` : API + '/api/fabric-irregular';
        const method = this.fiEditingId ? 'PUT' : 'POST';
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.token },
          body: JSON.stringify(payload),
        });
        if (res.status === 401) { ui.fbHide(); auth.sessionExpired(); return; }
        const data = await res.json();
        if (data.ok) {
          await this.fiLoadItems();
          this.fiCloseModal();
          ui.fbDone('บันทึกแล้ว');
        } else {
          ui.fbFail(data.message || 'บันทึกไม่สำเร็จ');
        }
      } catch (e) {
        ui.fbFail('บันทึกข้อมูลไม่สำเร็จ — ตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์');
      }
    },
  },
});
