<template>
<div class="zr-wrap text-[var(--text)]">
  <!-- หัวเรื่อง + แอ็กชัน -->
  <div class="flex items-center justify-between flex-wrap gap-3 mb-4">
    <div>
      <h1 class="text-xl font-bold flex items-center gap-2">🗄️ โซน &amp; แร็ค (ผังคลังผ้า)</h1>
      <p class="text-xs text-[var(--muted)] mt-0.5">ผังช่องจัดเก็บ — 1 ช่องเก็บได้หลายม้วน/หลายสี · สแกนจัดเก็บและตัดหลาได้</p>
    </div>
    <div class="flex items-center gap-2 flex-wrap">
      <button class="zr-btn-scan" @click="openScanner('putaway')">📦 สแกนจัดเก็บ</button>
      <button class="zr-btn-cut" @click="openScanner('cut')">✂️ สแกนตัดหลา</button>
      <button class="zr-btn-add" @click="openAdd">+ เพิ่ม QR Code ช่องสินค้า</button>
    </div>
  </div>

  <!-- ค้นหา + สรุป -->
  <div class="zr-card mb-4 flex items-center gap-3 flex-wrap">
    <div class="flex-1 min-w-[240px]">
      <div class="relative">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]">🔍</span>
        <input type="text" v-model="search" placeholder="ค้นหารหัสผ้า / สี — ไฮไลต์ช่องที่มีผ้านั้น" class="zr-search" />
      </div>
    </div>
    <div class="text-xs text-[var(--muted)] flex gap-4">
      <span>ช่องทั้งหมด <b class="text-[var(--text)]">{{ locations.length }}</b></span>
      <span>ม้วนในคลัง <b class="text-[var(--text)]">{{ totalRolls }}</b></span>
      <span>รวม <b class="text-[var(--text)]">{{ totalYards.toLocaleString() }}</b> หลา</span>
      <span v-if="unassigned.length" class="text-orange-600">ยังไม่จัดเก็บ <b>{{ unassigned.length }}</b> ม้วน</span>
    </div>
  </div>

  <div class="zr-scroll">
  <div v-if="loading" class="text-center text-[var(--muted)] py-10">กำลังโหลดผังคลัง...</div>

  <!-- ===== Grid ผังช่อง ===== -->
  <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-2">
    <div v-for="loc in locations" :key="loc.location_id"
         class="zr-bin" :class="{ 'zr-dim': search && !locationMatches(loc), 'zr-hit': search && locationMatches(loc) }">
      <div class="flex items-center justify-between mb-2 gap-1">
        <div class="font-bold text-sm flex items-center gap-1.5 min-w-0 truncate">📍 {{ loc.location_code }}</div>
        <div class="flex items-center gap-1 shrink-0">
          <button class="zr-bin-btn" title="พิมพ์ QR ช่อง" @click="printLocationQR(loc)">🏷️</button>
          <button class="zr-bin-btn" title="แก้ไขช่อง" @click="openEdit(loc)">✏️</button>
          <button class="zr-bin-btn zr-bin-del" title="ลบช่อง" @click="deleteLoc(loc)">🗑️</button>
        </div>
      </div>
      <div class="flex gap-3 text-[11px] text-[var(--muted)] mb-2">
        <span>โซน {{ loc.zone || '-' }}</span>
        <span>แร็ค {{ loc.rack || '-' }}</span>
        <span class="ml-auto">{{ loc.total_rolls }} ม้วน · {{ loc.total_yards.toLocaleString() }} หลา</span>
      </div>
      <div v-if="loc.rolls.length === 0" class="text-[11px] text-[var(--muted)] italic py-2 text-center">ว่าง</div>
      <div v-else class="zr-roll-list">
        <div v-for="r in loc.rolls" :key="r.roll_id" class="zr-roll"
             :class="{ 'zr-low': r.current_yards < LOW_YARDS, 'zr-match': search && rollMatches(r) }">
          <span class="font-semibold">{{ r.product_sku }}</span>
          <span class="text-[var(--muted)]">{{ r.color_name || '-' }}</span>
          <span class="ml-auto tabular-nums font-semibold">{{ r.current_yards }} หลา</span>
          <span v-if="r.current_yards < LOW_YARDS" class="zr-low-badge">ใกล้หมด</span>
        </div>
      </div>
    </div>
  </div>

  </div><!-- /zr-scroll -->

  <!-- ===== Modal: เพิ่มช่อง ===== -->
  <div v-if="showAddModal" class="zr-overlay" @click.self="showAddModal = false">
    <div class="zr-modal">
      <div class="zr-modal-head">
        <h3 class="font-bold">{{ editingId ? 'แก้ไขช่องสินค้า' : 'เพิ่มช่องสินค้า (QR Location)' }}</h3>
        <button @click="showAddModal = false">✕</button>
      </div>
      <div class="p-4 space-y-3">
        <div class="grid grid-cols-3 gap-2">
          <div class="zr-field"><label>โซน</label><input v-model="newLoc.zone" placeholder="A" @input="autoCode" /></div>
          <div class="zr-field"><label>แร็ค</label><input v-model="newLoc.rack" placeholder="01" @input="autoCode" /></div>
          <div class="zr-field"><label>บิน</label><input v-model="newLoc.bin" placeholder="01" @input="autoCode" /></div>
        </div>
        <div class="zr-field">
          <label>รหัสช่อง <span class="text-[var(--danger)]">*</span></label>
          <input v-model="newLoc.location_code" placeholder="เช่น ZONE-A-RACK-01" />
        </div>
        <p v-if="addMsg" class="text-sm" :class="addErr ? 'text-[var(--danger)]' : 'text-green-600'">{{ addMsg }}</p>

        <div v-if="createdLoc" class="border border-[var(--field-border)] rounded-lg p-3 text-center">
          <div class="text-xs text-[var(--muted)] mb-1">สร้างช่อง {{ createdLoc.location_code }} แล้ว</div>
          <img v-if="createdQr" :src="createdQr" class="w-32 h-32 mx-auto" />
          <div class="text-xs font-mono mt-1">{{ createdLoc.location_qr }}</div>
          <button class="zr-btn-add mt-2" @click="printLocationQR(createdLoc)">🖨️ พิมพ์ QR ช่องนี้</button>
        </div>
      </div>
      <div class="zr-modal-foot">
        <button class="zr-btn-ghost" @click="showAddModal = false">ปิด</button>
        <button class="zr-btn-add" @click="saveLoc">บันทึกช่อง</button>
      </div>
    </div>
  </div>

  <!-- ===== Modal: Scanner ===== -->
  <div v-if="showScanner" class="zr-overlay" @click.self="showScanner = false">
    <div class="zr-modal">
      <div class="zr-modal-head">
        <h3 class="font-bold">{{ scanMode === 'putaway' ? '📦 สแกนจัดเก็บ (Putaway)' : '✂️ สแกนตัดหลา (Deduction)' }}</h3>
        <button @click="showScanner = false">✕</button>
      </div>

      <!-- Putaway -->
      <div v-if="scanMode === 'putaway'" class="p-4 space-y-3">
        <div class="zr-field">
          <label>1) สแกน QR ช่องสินค้า</label>
          <input ref="paLoc" v-model="pa.locQr" placeholder="สแกน/พิมพ์ QR ช่อง แล้ว Enter" @keyup.enter="focusPaRoll" />
          <span v-if="pa.locQr" class="text-[11px] text-green-600">ช่อง: {{ pa.locQr }}</span>
        </div>
        <div class="zr-field">
          <label>2) สแกน QR ไม้ผ้า</label>
          <input ref="paRoll" v-model="pa.rollQr" placeholder="สแกน/พิมพ์ QR ไม้ผ้า แล้ว Enter" @keyup.enter="doPutaway" />
        </div>
        <p v-if="pa.msg" class="text-sm" :class="pa.err ? 'text-[var(--danger)]' : 'text-green-600'">{{ pa.msg }}</p>
        <div v-if="pa.log.length" class="text-[11px] text-[var(--muted)] max-h-32 overflow-y-auto border-t border-[var(--field-border)] pt-2 space-y-0.5">
          <div v-for="(l, i) in pa.log" :key="i">✓ {{ l }}</div>
        </div>
      </div>

      <!-- Cut -->
      <div v-else class="p-4 space-y-3">
        <div class="zr-field">
          <label>1) สแกน QR ไม้ผ้า</label>
          <input ref="cutRollInput" v-model="cut.rollQr" placeholder="สแกน/พิมพ์ QR ไม้ผ้า แล้ว Enter" @keyup.enter="lookupCutRoll" />
        </div>
        <div v-if="cut.roll" class="border border-[var(--field-border)] rounded-lg p-3 text-sm bg-[var(--field)]">
          <div><b>{{ cut.roll.product_sku }}</b> — {{ cut.roll.product_name }}</div>
          <div class="text-[var(--muted)] text-xs">สี {{ cut.roll.color_name || '-' }} · LOT {{ cut.roll.lot_no || '-' }} · ช่อง {{ cut.roll.location_code || '-' }}</div>
          <div class="mt-1">คงเหลือปัจจุบัน: <b class="tabular-nums" :class="cut.roll.current_yards < LOW_YARDS ? 'text-orange-600' : ''">{{ cut.roll.current_yards }}</b> หลา</div>
        </div>
        <div class="zr-field" v-if="cut.roll">
          <label>2) จำนวนหลาที่ตัดออก</label>
          <input ref="cutYardsInput" type="number" min="0" step="0.01" v-model.number="cut.yards" placeholder="0" @keyup.enter="doCut" />
        </div>
        <p v-if="cut.msg" class="text-sm" :class="cut.err ? 'text-[var(--danger)]' : 'text-green-600'">{{ cut.msg }}</p>
      </div>

      <div class="zr-modal-foot">
        <button class="zr-btn-ghost" @click="showScanner = false">ปิด</button>
        <button v-if="scanMode === 'putaway'" class="zr-btn-scan" @click="doPutaway">จัดเก็บ</button>
        <button v-else class="zr-btn-cut" :disabled="!cut.roll" @click="doCut">ตัดหลา</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import QRCode from 'qrcode';

export default {
  name: 'ZoneRackPage',
  inject: ['dash'],
  data() {
    return {
      LOW_YARDS: 50,
      locations: [],
      unassigned: [],
      loading: false,
      search: '',
      showAddModal: false,
      editingId: null,
      newLoc: { zone: '', rack: '', bin: '', location_code: '' },
      addMsg: '', addErr: false,
      createdLoc: null, createdQr: '',
      showScanner: false,
      scanMode: 'putaway',
      pa: { locQr: '', rollQr: '', msg: '', err: false, log: [] },
      cut: { rollQr: '', roll: null, yards: null, msg: '', err: false },
    };
  },
  computed: {
    totalRolls() { return this.locations.reduce((s, l) => s + l.total_rolls, 0); },
    totalYards() { return this.locations.reduce((s, l) => s + l.total_yards, 0); },
  },
  mounted() { this.loadMap(); },
  methods: {
    authHeaders(json) {
      const h = { Authorization: 'Bearer ' + this.dash.token };
      if (json) h['Content-Type'] = 'application/json';
      return h;
    },
    async loadMap() {
      this.loading = true;
      try {
        const res = await fetch('/api/warehouse-map', { headers: this.authHeaders() });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const data = await res.json();
        this.locations = data.locations || [];
        this.unassigned = data.unassigned || [];
      } catch (e) { this.locations = []; }
      finally { this.loading = false; }
    },
    rollMatches(r) {
      const q = this.search.trim().toLowerCase();
      if (!q) return false;
      return String(r.product_sku || '').toLowerCase().includes(q) || String(r.color_name || '').toLowerCase().includes(q);
    },
    locationMatches(loc) {
      return loc.rolls.some(r => this.rollMatches(r));
    },
    autoCode() {
      const { zone, rack, bin } = this.newLoc;
      if (zone || rack || bin) {
        this.newLoc.location_code = ['ZONE-' + (zone || '?'), 'RACK-' + (rack || '?'), bin ? 'BIN-' + bin : ''].filter(Boolean).join('-');
      }
    },
    openAdd() {
      this.editingId = null;
      this.newLoc = { zone: '', rack: '', bin: '', location_code: '' };
      this.addMsg = ''; this.addErr = false; this.createdLoc = null; this.createdQr = '';
      this.showAddModal = true;
    },
    openEdit(loc) {
      this.editingId = loc.location_id;
      this.newLoc = { zone: loc.zone || '', rack: loc.rack || '', bin: loc.bin || '', location_code: loc.location_code };
      this.addMsg = ''; this.addErr = false; this.createdLoc = null; this.createdQr = '';
      this.showAddModal = true;
    },
    async saveLoc() {
      const code = (this.newLoc.location_code || '').trim();
      if (!code) { this.addMsg = '⚠️ กรุณากรอกรหัสช่อง'; this.addErr = true; return; }
      try {
        const url = this.editingId ? '/api/warehouse-locations/' + this.editingId : '/api/warehouse-locations';
        const res = await fetch(url, {
          method: this.editingId ? 'PUT' : 'POST', headers: this.authHeaders(true),
          body: JSON.stringify({ ...this.newLoc, location_code: code }),
        });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const data = await res.json();
        if (data.ok) {
          this.addMsg = data.message; this.addErr = false;
          await this.loadMap();
          if (this.editingId) {
            this.showAddModal = false;
          } else {
            this.createdLoc = data.location;
            this.createdQr = await QRCode.toDataURL(data.location.location_qr, { width: 160, margin: 1 });
          }
        } else { this.addMsg = '⚠️ ' + data.message; this.addErr = true; }
      } catch (e) { this.addMsg = '⚠️ บันทึกไม่สำเร็จ'; this.addErr = true; }
    },
    async deleteLoc(loc) {
      if (loc.total_rolls > 0) { this.dash.fbFail(`ช่อง ${loc.location_code} มีผ้าอยู่ ${loc.total_rolls} ม้วน — ต้องย้ายผ้าออกก่อนจึงจะลบได้`); return; }
      if (!(await this.dash.fbAskDelete(`ต้องการลบช่อง "${loc.location_code}" ใช่หรือไม่?`))) return;
      this.dash.fbLoading('กำลังลบ...');
      try {
        const res = await fetch('/api/warehouse-locations/' + loc.location_id, { method: 'DELETE', headers: this.authHeaders() });
        if (res.status === 401) { this.dash.fbHide(); this.dash.sessionExpired(); return; }
        const data = await res.json();
        if (data.ok) { await this.loadMap(); this.dash.fbDone('ลบข้อมูลแล้ว'); }
        else { this.dash.fbFail(data.message || 'ลบไม่สำเร็จ'); }
      } catch (e) { this.dash.fbFail('ลบไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
    },
    async printLocationQR(loc) {
      const qr = await QRCode.toDataURL(loc.location_qr, { width: 240, margin: 1 });
      const win = window.open('', '_blank', 'width=400,height=460');
      if (!win) { alert('เบราว์เซอร์บล็อกหน้าต่างพิมพ์'); return; }
      win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>QR ช่อง ${loc.location_code}</title>
        <style>body{font-family:'Noto Sans Thai',sans-serif;text-align:center;margin:20px}
        .code{font-size:22px;font-weight:800;margin-bottom:6px}.sub{font-size:12px;color:#555;margin-bottom:10px}
        img{width:240px;height:240px}.qtext{font-family:monospace;font-size:13px;margin-top:8px}
        @media print{.no-print{display:none}}</style></head><body>
        <div class="no-print" style="margin-bottom:10px"><button onclick="window.print()" style="padding:8px 20px;font-size:14px;cursor:pointer">🖨️ พิมพ์</button></div>
        <div class="code">📍 ${loc.location_code}</div>
        <div class="sub">โซน ${loc.zone || '-'} · แร็ค ${loc.rack || '-'} · บิน ${loc.bin || '-'}</div>
        <img src="${qr}"/><div class="qtext">${loc.location_qr}</div>
        </body></html>`);
      win.document.close();
    },
    openScanner(mode) {
      this.scanMode = mode;
      this.pa = { locQr: '', rollQr: '', msg: '', err: false, log: [] };
      this.cut = { rollQr: '', roll: null, yards: null, msg: '', err: false };
      this.showScanner = true;
      this.$nextTick(() => {
        if (mode === 'putaway' && this.$refs.paLoc) this.$refs.paLoc.focus();
        if (mode === 'cut' && this.$refs.cutRollInput) this.$refs.cutRollInput.focus();
      });
    },
    focusPaRoll() {
      this.$nextTick(() => this.$refs.paRoll && this.$refs.paRoll.focus());
    },
    async doPutaway() {
      const locQr = this.pa.locQr.trim(), rollQr = this.pa.rollQr.trim();
      if (!locQr || !rollQr) { this.pa.msg = '⚠️ ต้องสแกนทั้ง QR ช่อง และ QR ไม้ผ้า'; this.pa.err = true; return; }
      try {
        const res = await fetch('/api/fabric-rolls/putaway', {
          method: 'POST', headers: this.authHeaders(true),
          body: JSON.stringify({ location_qr: locQr, roll_qr: rollQr }),
        });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const data = await res.json();
        if (data.ok) {
          this.pa.msg = data.message; this.pa.err = false;
          this.pa.log.unshift(data.message);
          this.pa.rollQr = '';                 // เคลียร์เฉพาะไม้ผ้า เก็บช่องไว้สแกนม้วนถัดไป
          this.focusPaRoll();
          await this.loadMap();
        } else { this.pa.msg = '⚠️ ' + data.message; this.pa.err = true; }
      } catch (e) { this.pa.msg = '⚠️ เชื่อมต่อไม่ได้'; this.pa.err = true; }
    },
    async lookupCutRoll() {
      const qr = this.cut.rollQr.trim();
      if (!qr) return;
      try {
        const res = await fetch('/api/fabric-rolls/lookup?qr=' + encodeURIComponent(qr), { headers: this.authHeaders() });
        const data = await res.json();
        if (data.ok) {
          this.cut.roll = data.roll; this.cut.msg = ''; this.cut.err = false; this.cut.yards = null;
          this.$nextTick(() => this.$refs.cutYardsInput && this.$refs.cutYardsInput.focus());
        } else { this.cut.roll = null; this.cut.msg = '⚠️ ' + data.message; this.cut.err = true; }
      } catch (e) { this.cut.msg = '⚠️ เชื่อมต่อไม่ได้'; this.cut.err = true; }
    },
    async doCut() {
      if (!this.cut.roll) { this.lookupCutRoll(); return; }
      const yards = Number(this.cut.yards);
      if (!(yards > 0)) { this.cut.msg = '⚠️ กรอกจำนวนหลาที่ตัด (> 0)'; this.cut.err = true; return; }
      try {
        const res = await fetch('/api/fabric-rolls/cut', {
          method: 'POST', headers: this.authHeaders(true),
          body: JSON.stringify({ roll_qr: this.cut.rollQr.trim(), yards }),
        });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const data = await res.json();
        if (data.ok) {
          this.cut.msg = data.message; this.cut.err = false;
          this.cut.roll.current_yards = data.current_yards;
          this.cut.rollQr = ''; this.cut.roll = null; this.cut.yards = null;
          this.$nextTick(() => this.$refs.cutRollInput && this.$refs.cutRollInput.focus());
          await this.loadMap();
        } else { this.cut.msg = '⚠️ ' + data.message; this.cut.err = true; }
      } catch (e) { this.cut.msg = '⚠️ เชื่อมต่อไม่ได้'; this.cut.err = true; }
    },
  },
};
</script>

<style scoped>
.zr-wrap { padding: 4px 2px 0; display: flex; flex-direction: column; flex: 1; min-height: 0; }
.zr-scroll { flex: 1; min-height: 0; overflow-y: auto; padding-bottom: 16px; }
.zr-scroll::-webkit-scrollbar { width: 7px; }
.zr-scroll::-webkit-scrollbar-thumb { background: var(--field-border); border-radius: 10px; }
.zr-card { background: var(--surface); border: 1px solid var(--field-border); border-radius: 12px; padding: 12px 16px; }
.zr-search { width: 100%; height: 38px; border: 1px solid var(--field-border); border-radius: 9px; background: var(--field); color: var(--text); font-size: 13px; padding: 0 12px 0 34px; font-family: inherit; }
.zr-search:focus { outline: none; border-color: var(--brand); }
.zr-bin { background: var(--surface); border: 1px solid var(--field-border); border-radius: 12px; padding: 12px 14px; transition: opacity .2s, box-shadow .2s, border-color .2s; }
.zr-dim { opacity: .35; }
.zr-hit { border-color: var(--brand); box-shadow: 0 0 0 2px var(--brand-soft); }
.zr-bin-btn { font-size: 12px; width: 26px; height: 24px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid var(--field-border); border-radius: 6px; background: var(--field); color: var(--text); cursor: pointer; }
.zr-bin-btn:hover { background: var(--brand-soft); border-color: var(--brand); }
.zr-bin-del:hover { background: #fdeaea; border-color: var(--danger); }
.zr-roll-list { display: flex; flex-direction: column; gap: 4px; max-height: 200px; overflow-y: auto; }
.zr-roll { display: flex; align-items: center; gap: 8px; font-size: 12px; padding: 5px 8px; border-radius: 7px; background: var(--field); }
.zr-roll.zr-low { background: #fff2e8; border: 1px solid #ff9f5a; }
.zr-roll.zr-match { outline: 2px solid var(--brand); }
:root[data-theme="dark"] .zr-roll.zr-low, :root:not([data-theme="light"]) .zr-roll.zr-low { background: #3a2410; border-color: #a6591f; }
.zr-low-badge { font-size: 9.5px; font-weight: 700; color: #fff; background: #f5731f; padding: 1px 6px; border-radius: 20px; }
.zr-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 16px; }
.zr-modal { background: var(--surface); border: 1px solid var(--field-border); border-radius: 14px; width: 100%; max-width: 440px; overflow: hidden; }
.zr-modal-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid var(--field-border); }
.zr-modal-head button { font-size: 16px; color: var(--muted); background: none; border: none; cursor: pointer; }
.zr-modal-foot { display: flex; justify-content: flex-end; gap: 8px; padding: 12px 18px; border-top: 1px solid var(--field-border); }
.zr-field { display: flex; flex-direction: column; gap: 4px; }
.zr-field label { font-size: 12px; color: var(--muted); font-weight: 600; }
.zr-field input { height: 38px; border: 1px solid var(--field-border); border-radius: 8px; background: var(--field); color: var(--text); font-size: 13px; padding: 0 10px; font-family: inherit; }
.zr-field input:focus { outline: none; border-color: var(--brand); }
.zr-btn-add { background: #1a9c54; color: #fff; border: 1px solid #1a9c54; border-radius: 8px; padding: 8px 14px; font-size: 12.5px; font-weight: 600; cursor: pointer; }
.zr-btn-add:hover { background: #158045; }
.zr-btn-scan { background: #1e3a8a; color: #fff; border: 1px solid #1e3a8a; border-radius: 8px; padding: 8px 14px; font-size: 12.5px; font-weight: 600; cursor: pointer; }
.zr-btn-scan:hover { background: #172b6b; }
.zr-btn-cut { background: #a82a3a; color: #fff; border: 1px solid #a82a3a; border-radius: 8px; padding: 8px 14px; font-size: 12.5px; font-weight: 600; cursor: pointer; }
.zr-btn-cut:hover { background: #8a1c2b; }
.zr-btn-cut:disabled { opacity: .5; cursor: not-allowed; }
.zr-btn-ghost { background: var(--field); color: var(--text); border: 1px solid var(--field-border); border-radius: 8px; padding: 8px 14px; font-size: 12.5px; cursor: pointer; }
</style>
