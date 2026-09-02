// ============================================================================
//  stores/customer.js — โดเมนลูกค้า: ตาราง `customers` (คู่มือลูกค้าเต็มรูปแบบ)
//  และ `customer_master` (นำเข้า Excel รหัส+ชื่อ+ที่อยู่ อย่างง่าย)
//  แยกออกจาก Dashboard.vue เพื่อให้ดูแลง่ายและ reuse ได้ทุก component
// ============================================================================
import { defineStore } from 'pinia';
import { useAuthStore } from './auth.js';
import { useUiStore } from './ui.js';

const API = '';

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    // ---- ลูกค้า (customers) ----
    cuItems: [],
    cuLoading: false,
    // ตัวเลือกชื่อลูกค้าแบบย่อ (ไม่มีข้อมูลอ่อนไหว) — ใช้เป็น dropdown ในหน้านอกโดเมนลูกค้า
    // ที่ไม่มีสิทธิ์ 'customers' เช่น สัญญาขาย/รับผ้าสำเร็จ (แยกจาก cuItems ซึ่งต้องมีสิทธิ์ 'customers')
    cuNameOptions: [],
    cuFilters: { search: '', group: '', province: '', zone: '', accountTerms: '', cashTerms: '', salesperson: '' },
    cuPage: 1,
    cuPageSize: 50,
    cuSelected: [],
    cuSortBy: '',
    cuSortDir: 'asc',
    cuShowAddModal: false,
    cuModalMode: 'add',
    cuEditingId: null,
    cuNewItem: {
      code: '', company_name: '', contact: '', phone: '', address: '', province: '',
      customer_group: '', zone: '', account_terms: '', cash_terms: '', currency: 'THB',
      credit_limit: '', salesperson: '', tax_id: '',
    },

    // ---- ลูกค้าหลัก นำเข้า Excel (customer_master) ----
    cmShowPanel: false,
    cmFile: null,
    cmFileInputKey: 0,
    cmImporting: false,
    cmImportMessage: '',
    cmRows: [],
    cmLoading: false,
    cmPage: 1,
    cmPageSize: 10,
    cmShowEditModal: false,
    cmEditingId: null,
    cmEditItem: { customer_code: '', customer_name: '', address: '' },
  }),

  getters: {
    // ---- ลูกค้า (customers) ----
    cuGroupOptions: (state) => [...new Set(state.cuItems.map(i => i.customer_group).filter(v => v))].sort(),
    cuProvinceOptions: (state) => [...new Set(state.cuItems.map(i => i.province).filter(v => v))].sort(),
    cuZoneOptions: (state) => [...new Set(state.cuItems.map(i => i.zone).filter(v => v))].sort(),
    cuAccountTermsOptions: (state) => [...new Set(state.cuItems.map(i => i.account_terms).filter(v => v))].sort(),
    cuCashTermsOptions: (state) => [...new Set(state.cuItems.map(i => i.cash_terms).filter(v => v))].sort(),
    cuSalespersonOptions: (state) => [...new Set(state.cuItems.map(i => i.salesperson).filter(v => v))].sort(),
    cuFilteredItems(state) {
      const f = state.cuFilters;
      const q = (f.search || '').trim().toLowerCase();
      return state.cuItems.filter(item => {
        if (f.group && item.customer_group !== f.group) return false;
        if (f.province && item.province !== f.province) return false;
        if (f.zone && item.zone !== f.zone) return false;
        if (f.accountTerms && item.account_terms !== f.accountTerms) return false;
        if (f.cashTerms && item.cash_terms !== f.cashTerms) return false;
        if (f.salesperson && item.salesperson !== f.salesperson) return false;
        if (q) {
          const hay = [item.company_name, item.contact, item.phone, item.address, item.code, item.tax_id]
            .map(v => String(v || '').toLowerCase()).join(' ');
          if (!hay.includes(q)) return false;
        }
        return true;
      });
    },
    cuSortedFilteredItems() {
      const items = [...this.cuFilteredItems];
      if (!this.cuSortBy) return items;
      const key = this.cuSortBy;
      const dir = this.cuSortDir === 'asc' ? 1 : -1;
      return items.sort((a, b) => {
        const av = String(a[key] || '').toLowerCase();
        const bv = String(b[key] || '').toLowerCase();
        if (av < bv) return -1 * dir;
        if (av > bv) return 1 * dir;
        return 0;
      });
    },
    cuTotalPages() { return Math.max(1, Math.ceil(this.cuSortedFilteredItems.length / this.cuPageSize)); },
    cuPagedItems() {
      const start = (this.cuPage - 1) * this.cuPageSize;
      return this.cuSortedFilteredItems.slice(start, start + this.cuPageSize);
    },
    cuAllSelectedOnPage() {
      return this.cuPagedItems.length > 0 && this.cuPagedItems.every(i => this.cuSelected.includes(i.id));
    },

    // ---- customer_master ----
    cmTotalPages: (state) => Math.max(1, Math.ceil(state.cmRows.length / state.cmPageSize)),
    cmPagedRows(state) {
      const start = (state.cmPage - 1) * state.cmPageSize;
      return state.cmRows.slice(start, start + state.cmPageSize);
    },
  },

  actions: {
    // ---- ลูกค้า (customers) ----
    async cuLoadItems() {
      const auth = useAuthStore();
      this.cuLoading = true;
      try {
        const res = await fetch(API + '/api/customers', { headers: { Authorization: 'Bearer ' + auth.token } });
        if (res.status === 401) { auth.sessionExpired(); return; }
        const data = await res.json();
        this.cuItems = (data.customers || []).map(row => ({
          id: row.id,
          code: row.code || '',
          company_name: row.company_name || '',
          contact: row.contact || '',
          phone: row.phone || '',
          address: row.address || '',
          province: row.province || '',
          customer_group: row.customer_group || '',
          zone: row.zone || '',
          account_terms: row.account_terms || '',
          cash_terms: row.cash_terms || '',
          currency: row.currency || 'THB',
          credit_limit: row.credit_limit || '',
          salesperson: row.salesperson || '',
          tax_id: row.tax_id || '',
        }));
      } catch (e) {
        this.cuItems = [];
      } finally {
        this.cuLoading = false;
      }
    },
    // เวอร์ชันย่อ (id/code/ชื่อบริษัทเท่านั้น) — ไม่ต้องมีสิทธิ์ 'customers' ให้หน้านอกโดเมนลูกค้าเรียกใช้ได้
    async cuLoadNames() {
      const auth = useAuthStore();
      try {
        const res = await fetch(API + '/api/customers/lookup', { headers: { Authorization: 'Bearer ' + auth.token } });
        if (res.status === 401) { auth.sessionExpired(); return; }
        const data = await res.json();
        this.cuNameOptions = (data.customers || []).map(row => ({
          id: row.id, code: row.code || '', company_name: row.company_name || '',
        }));
      } catch (e) {
        this.cuNameOptions = [];
      }
    },
    cuSearch() { this.cuPage = 1; },
    cuResetFilters() {
      this.cuFilters = { search: '', group: '', province: '', zone: '', accountTerms: '', cashTerms: '', salesperson: '' };
      this.cuPage = 1;
    },
    cuSort(key) {
      if (this.cuSortBy === key) {
        this.cuSortDir = this.cuSortDir === 'asc' ? 'desc' : 'asc';
      } else {
        this.cuSortBy = key;
        this.cuSortDir = 'asc';
      }
    },
    cuSortIcon(key) {
      if (this.cuSortBy !== key) return '↕';
      return this.cuSortDir === 'asc' ? '▲' : '▼';
    },
    cuPrevPage() { if (this.cuPage > 1) this.cuPage -= 1; },
    cuNextPage() { if (this.cuPage < this.cuTotalPages) this.cuPage += 1; },
    cuToggleSelectAll() {
      if (this.cuAllSelectedOnPage) {
        const ids = this.cuPagedItems.map(i => i.id);
        this.cuSelected = this.cuSelected.filter(id => !ids.includes(id));
      } else {
        const newIds = this.cuPagedItems.map(i => i.id).filter(id => !this.cuSelected.includes(id));
        this.cuSelected = [...this.cuSelected, ...newIds];
      }
    },
    cuToggleSelect(id) {
      const idx = this.cuSelected.indexOf(id);
      if (idx === -1) this.cuSelected.push(id);
      else this.cuSelected.splice(idx, 1);
    },
    cuClearSelection() { this.cuSelected = []; },
    async cuBulkDelete() {
      const auth = useAuthStore();
      const ui = useUiStore();
      if (this.cuSelected.length === 0) return;
      if (!(await ui.fbAskDelete(`ต้องการลบ ${this.cuSelected.length} รายการที่เลือกใช่หรือไม่?`))) return;
      ui.fbLoading('กำลังลบ...');
      let failed = false;
      for (const id of [...this.cuSelected]) {
        try {
          await fetch(API + `/api/customers/${id}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + auth.token } });
        } catch (e) { failed = true; }
      }
      this.cuSelected = [];
      await this.cuLoadItems();
      failed ? ui.fbFail('ลบบางรายการไม่สำเร็จ') : ui.fbDone('ลบข้อมูลแล้ว');
    },
    async cuExportExcel(selectedOnly) {
      const ui = useUiStore();
      const rows = selectedOnly ? this.cuItems.filter(i => this.cuSelected.includes(i.id)) : this.cuSortedFilteredItems;
      if (rows.length === 0) { ui.fbFail('ไม่มีข้อมูลให้ส่งออก'); return; }
      const XLSX = await import('xlsx');
      const aoa = [
        ['รหัส', 'ชื่อบริษัท', 'ผู้ติดต่อ', 'เบอร์โทร', 'ที่อยู่', 'จังหวัด', 'กลุ่มลูกค้า', 'โซน', 'เงื่อนไขบัญชี', 'เงื่อนไขเงินสด', 'สกุลเงิน', 'วงเงิน', 'พนักงานขาย', 'เลขผู้เสียภาษี'],
        ...rows.map(i => [i.code, i.company_name, i.contact, i.phone, i.address, i.province, i.customer_group, i.zone, i.account_terms, i.cash_terms, i.currency, i.credit_limit, i.salesperson, i.tax_id]),
      ];
      const sheet = XLSX.utils.aoa_to_sheet(aoa);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, sheet, 'ลูกค้า');
      XLSX.writeFile(wb, `ลูกค้า-${new Date().toISOString().slice(0, 10)}.xlsx`);
    },
    cuOpenAdd() {
      this.cuModalMode = 'add';
      this.cuEditingId = null;
      this.cuNewItem = {
        code: '', company_name: '', contact: '', phone: '', address: '', province: '',
        customer_group: '', zone: '', account_terms: '', cash_terms: '', currency: 'THB',
        credit_limit: '', salesperson: '', tax_id: '',
      };
      this.cuShowAddModal = true;
    },
    cuEditItem(item) {
      this.cuModalMode = 'edit';
      this.cuEditingId = item.id;
      this.cuNewItem = { ...item };
      this.cuShowAddModal = true;
    },
    cuViewItem(item) {
      this.cuEditItem(item);
      this.cuModalMode = 'view';
    },
    cuCloseAddModal() { this.cuShowAddModal = false; },
    async cuSaveAdd() {
      const auth = useAuthStore();
      const ui = useUiStore();
      if (!this.cuNewItem.company_name || !this.cuNewItem.company_name.trim()) {
        ui.fbFail('กรุณากรอกชื่อบริษัท');
        return;
      }
      const payload = { ...this.cuNewItem };
      ui.fbLoading('กำลังบันทึก...');
      try {
        const url = this.cuEditingId ? API + `/api/customers/${this.cuEditingId}` : API + '/api/customers';
        const res = await fetch(url, {
          method: this.cuEditingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.token },
          body: JSON.stringify(payload),
        });
        if (res.status === 401) { ui.fbHide(); auth.sessionExpired(); return; }
        const data = await res.json();
        if (data.ok) {
          this.cuShowAddModal = false;
          await this.cuLoadItems();
          ui.fbDone('บันทึกแล้ว');
        } else {
          ui.fbFail(data.message || 'บันทึกไม่สำเร็จ');
        }
      } catch (e) {
        ui.fbFail('บันทึกไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้');
      }
    },
    async cuDeleteItem(item) {
      const auth = useAuthStore();
      const ui = useUiStore();
      if (!(await ui.fbAskDelete(`ต้องการลบลูกค้า "${item.company_name}" ใช่หรือไม่?`))) return;
      ui.fbLoading('กำลังลบ...');
      try {
        const res = await fetch(API + `/api/customers/${item.id}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + auth.token } });
        if (res.status === 401) { ui.fbHide(); auth.sessionExpired(); return; }
        const data = await res.json();
        if (data.ok) {
          this.cuItems = this.cuItems.filter(i => i.id !== item.id);
          this.cuSelected = this.cuSelected.filter(id => id !== item.id);
          ui.fbDone('ลบข้อมูลแล้ว');
        } else {
          ui.fbFail(data.message || 'ลบไม่สำเร็จ');
        }
      } catch (e) {
        ui.fbFail('ลบไม่สำเร็จ');
      }
    },

    // ---- customer_master (นำเข้า Excel) ----
    cmTogglePanel() {
      this.cmShowPanel = !this.cmShowPanel;
      if (this.cmShowPanel && this.cmRows.length === 0) this.cmLoadRows();
    },
    cmHandleFile(e) {
      this.cmFile = e.target.files[0] || null;
      this.cmImportMessage = '';
    },
    async cmLoadRows() {
      const auth = useAuthStore();
      this.cmLoading = true;
      try {
        const res = await fetch(API + '/api/customer-master', { headers: { Authorization: 'Bearer ' + auth.token } });
        if (res.status === 401) { auth.sessionExpired(); return; }
        const data = await res.json();
        this.cmRows = data.items || [];
      } catch (e) {
        this.cmRows = [];
      } finally {
        this.cmLoading = false;
      }
    },
    cmParseColumnA(raw) {
      const text = String(raw || '').trim();
      const m = text.match(/^(\d{4})[\s\-.:]*(.*)$/);
      if (m) return { customer_code: m[1], customer_name: m[2].trim() };
      return { customer_code: '', customer_name: text };
    },
    async cmImportFile() {
      const auth = useAuthStore();
      const ui = useUiStore();
      if (!this.cmFile) {
        ui.fbFail('กรุณาเลือกไฟล์ Excel (.xlsx) หรือ CSV');
        return;
      }
      this.cmImporting = true;
      this.cmImportMessage = '';
      try {
        const XLSX = await import('xlsx');
        const buffer = await this.cmFile.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: '' });
        const dataRows = rows.slice(1).filter(r => r.some(cell => String(cell).trim() !== ''));

        const seen = new Set();
        const fileDuplicates = [];
        const items = [];
        dataRows.forEach(r => {
          const parsed = this.cmParseColumnA(r[0]);
          if (!parsed.customer_code) return;
          if (seen.has(parsed.customer_code)) { fileDuplicates.push(parsed.customer_code); return; }
          seen.add(parsed.customer_code);
          items.push({ customer_code: parsed.customer_code, customer_name: parsed.customer_name, address: String(r[1] || '').trim() });
        });

        if (items.length === 0) {
          this.cmImportMessage = '⚠️ ไม่พบข้อมูลที่นำเข้าได้ในไฟล์นี้ (ตรวจสอบว่าคอลัมน์ A ขึ้นต้นด้วยรหัสลูกค้า 4 หลัก)';
          return;
        }

        const res = await fetch(API + '/api/customer-master/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.token },
          body: JSON.stringify({ items }),
        });
        if (res.status === 401) { auth.sessionExpired(); return; }
        const data = await res.json();
        if (data.ok) {
          const dupCodes = [...fileDuplicates, ...(data.duplicates || [])];
          let msg = `✅ นำเข้าข้อมูลสำเร็จ ${data.imported} รายการ`;
          if (dupCodes.length > 0) {
            msg += ` — ⚠️ พบรหัสลูกค้าซ้ำ ${dupCodes.length} รายการ (ข้ามการนำเข้า): ${dupCodes.slice(0, 10).join(', ')}${dupCodes.length > 10 ? ' ...' : ''}`;
          }
          this.cmImportMessage = msg;
          this.cmFile = null;
          this.cmFileInputKey += 1;
          await this.cmLoadRows();
        } else {
          this.cmImportMessage = '⚠️ ' + data.message;
        }
      } catch (e) {
        this.cmImportMessage = '⚠️ อ่านไฟล์ไม่สำเร็จ — ตรวจสอบว่าเป็นไฟล์ .xlsx หรือ .csv ที่ถูกต้อง';
      } finally {
        this.cmImporting = false;
      }
    },
    cmOpenEdit(row) {
      this.cmEditingId = row.id;
      this.cmEditItem = { customer_code: row.customer_code, customer_name: row.customer_name, address: row.address };
      this.cmShowEditModal = true;
    },
    cmCloseEdit() { this.cmShowEditModal = false; },
    async cmSaveEdit() {
      const auth = useAuthStore();
      const ui = useUiStore();
      if (!this.cmEditItem.customer_code.trim()) {
        ui.fbFail('กรุณากรอกรหัสลูกค้า');
        return;
      }
      ui.fbLoading('กำลังบันทึก...');
      try {
        const res = await fetch(API + `/api/customer-master/${this.cmEditingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.token },
          body: JSON.stringify(this.cmEditItem),
        });
        if (res.status === 401) { ui.fbHide(); auth.sessionExpired(); return; }
        const data = await res.json();
        if (data.ok) {
          await this.cmLoadRows();
          this.cmCloseEdit();
          ui.fbDone('บันทึกแล้ว');
        } else {
          ui.fbFail(data.message || 'บันทึกไม่สำเร็จ');
        }
      } catch (e) {
        ui.fbFail('บันทึกข้อมูลไม่สำเร็จ — ตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์');
      }
    },
    async cmDeleteRow(row) {
      const auth = useAuthStore();
      const ui = useUiStore();
      if (!(await ui.fbAskDelete(`ต้องการลบ "${row.customer_name || row.customer_code}" ใช่หรือไม่?`))) return;
      ui.fbLoading('กำลังลบ...');
      try {
        const res = await fetch(API + `/api/customer-master/${row.id}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + auth.token } });
        if (res.status === 401) { ui.fbHide(); auth.sessionExpired(); return; }
        const data = await res.json();
        if (data.ok) {
          this.cmRows = this.cmRows.filter(r => r.id !== row.id);
          ui.fbDone('ลบข้อมูลแล้ว');
        } else {
          ui.fbFail(data.message || 'ลบไม่สำเร็จ');
        }
      } catch (e) {
        ui.fbFail('ลบข้อมูลไม่สำเร็จ — ตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์');
      }
    },
    cmPrevPage() { if (this.cmPage > 1) this.cmPage -= 1; },
    cmNextPage() { if (this.cmPage < this.cmTotalPages) this.cmPage += 1; },
  },
});
