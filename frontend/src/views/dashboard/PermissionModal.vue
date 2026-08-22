<template>
  <transition name="pm-fade">
    <div v-if="dash.pmShow" class="erp-overlay" @click.self="dash.pmClose()">
      <div class="erp-modal pm-modal">
        <!-- หัวโมดัล (ธีม ERP) -->
        <div class="erp-modal-head">
          <span><span class="erp-head-ic">🔐</span> {{ dash.pmEditing ? 'แก้ไข' : 'เพิ่ม' }}บทบาท / สิทธิ์การเข้าใช้งาน</span>
          <button class="erp-x" @click="dash.pmClose()" aria-label="ปิด">✕</button>
        </div>

        <div class="erp-modal-body">
          <!-- ===== ส่วนที่ 1: ข้อมูลบทบาท ===== -->
          <div class="erp-sec-title"><span class="erp-sec-bar"></span>ข้อมูลบทบาท</div>
          <div class="erp-grid">
            <div class="erp-field erp-col-2">
              <label>ชื่อบทบาท / ตำแหน่ง <span class="erp-req">*</span></label>
              <input v-model="name" placeholder="เช่น CEO, ฝ่ายบัญชี, พนักงานส่งของ" />
            </div>
          </div>
          <div class="pm-presets">
            <span class="pm-presets-label">เลือกจากตำแหน่งแนะนำ:</span>
            <button v-for="p in presets" :key="p.key" type="button" class="pm-preset-btn" :title="p.desc" @click="applyPreset(p)">
              {{ p.label }}
            </button>
          </div>

          <!-- ===== ส่วนที่ 2: สิทธิ์การกระทำ ===== -->
          <div class="erp-sec-title"><span class="erp-sec-bar"></span>สิทธิ์การกระทำ</div>
          <div class="pm-actions-grid">
            <div v-for="grp in actions" :key="grp.title" class="pm-action-col">
              <div class="pm-action-title">{{ grp.title }}</div>
              <label v-for="it in grp.items" :key="it.key" class="pm-item">
                <input type="checkbox" :checked="!!selected[it.key]" @change="toggleLeaf(it.key, $event.target.checked)" />
                <span>{{ it.label }}</span>
              </label>
            </div>
          </div>

          <!-- ===== ส่วนที่ 3: สิทธิ์การเข้าถึงเมนู ===== -->
          <div class="erp-sec-title pm-sec-flex">
            <span class="erp-sec-bar"></span>สิทธิ์การเข้าถึงเมนู
            <span class="pm-quick">
              <button type="button" class="pm-quick-btn" @click="selectAllMenus">☑ เลือกทุกเมนู</button>
              <button type="button" class="pm-quick-btn" @click="clearAllMenus">☐ ล้างทั้งหมด</button>
            </span>
          </div>
          <div class="pm-groups">
            <div v-for="node in access" :key="node.key" class="pm-group-card">
              <label class="pm-group-head">
                <input type="checkbox" :checked="nodeChecked(node)" :indeterminate.prop="nodeIndeterminate(node)" @change="toggleNode(node, $event.target.checked)" />
                <span class="pm-group-name">{{ node.label }}</span>
                <span v-if="node.children" class="pm-group-count">{{ groupCount(node).on }}/{{ groupCount(node).total }}</span>
              </label>
              <div v-if="node.children" class="pm-group-body">
                <label v-for="c in node.children" :key="c.key" class="pm-item">
                  <input type="checkbox" :checked="!!selected[c.key]" @change="toggleLeaf(c.key, $event.target.checked)" />
                  <span>{{ c.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- ปุ่มบันทึก (ธีม ERP) -->
        <div class="erp-modal-foot">
          <span class="pm-count">เลือกแล้ว <strong>{{ selectedCount }}</strong> สิทธิ์</span>
          <span class="pm-foot-spacer"></span>
          <button class="erp-btn erp-btn-cancel" @click="dash.pmClose()">ยกเลิก</button>
          <button class="erp-btn erp-btn-save" @click="save">💾 บันทึก</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { PERM_ACTIONS, PERM_ACCESS, ROLE_PRESETS, leafKeysOf, allPageKeys } from './permissionSchema.js';

export default {
  name: 'PermissionModal',
  inject: ['dash'],
  data() {
    return {
      name: '',
      selected: {}, // key -> true
      actions: PERM_ACTIONS,
      access: PERM_ACCESS,
      presets: ROLE_PRESETS,
    };
  },
  computed: {
    selectedCount() { return Object.values(this.selected).filter(Boolean).length; },
  },
  watch: {
    'dash.pmShow'(v) {
      if (v) {
        this.name = this.dash.pmInitialName || '';
        this.selected = {};
        (this.dash.pmInitialKeys || []).forEach(k => { this.selected[k] = true; });
      }
    },
  },
  methods: {
    applyPreset(p) {
      if (!this.name.trim()) this.name = p.label;
      const keys = p.presetKeys === null ? [...allPageKeys(),
        'act.add', 'act.edit', 'act.delete', 'act.approve', 'act.cancel', 'act.export',
        'act.viewBuyPrice', 'act.viewSellPrice', 'act.viewTotal'] : p.presetKeys;
      const next = {};
      keys.forEach(k => { next[k] = true; });
      this.selected = next;
    },
    toggleLeaf(key, val) {
      if (val) this.selected[key] = true;
      else delete this.selected[key];
    },
    setKeys(keys, val) {
      keys.forEach(k => { if (val) this.selected[k] = true; else delete this.selected[k]; });
    },
    toggleNode(node, val) { this.setKeys(leafKeysOf(node), val); },
    nodeChecked(node) {
      const leaves = leafKeysOf(node);
      return leaves.length > 0 && leaves.every(k => this.selected[k]);
    },
    nodeIndeterminate(node) {
      const leaves = leafKeysOf(node);
      const on = leaves.filter(k => this.selected[k]).length;
      return on > 0 && on < leaves.length;
    },
    groupCount(node) {
      const leaves = leafKeysOf(node);
      return { on: leaves.filter(k => this.selected[k]).length, total: leaves.length };
    },
    selectAllMenus() { allPageKeys().forEach(k => { this.selected[k] = true; }); },
    clearAllMenus() { allPageKeys().forEach(k => { delete this.selected[k]; }); },
    save() {
      const keys = Object.keys(this.selected).filter(k => this.selected[k]);
      this.dash.pmSave(this.name.trim(), keys);
    },
  },
};
</script>

<style scoped>
.pm-modal { width: 900px; }

/* ---- ตำแหน่งแนะนำ (chips) ---- */
.pm-presets { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin: 4px 0 4px; }
.pm-presets-label { font-size: 12px; color: var(--muted); }
.pm-preset-btn {
  padding: 5px 13px; border: 1px solid var(--field-border); background: var(--field);
  color: var(--text); border-radius: 999px; font-size: 12.5px; cursor: pointer;
  font-family: inherit; transition: background .15s, border-color .15s;
}
.pm-preset-btn:hover { background: rgba(47,101,246,.1); border-color: #2F65F6; color: #2F65F6; }

/* ---- สิทธิ์การกระทำ (3 การ์ด) ---- */
.pm-actions-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.pm-action-col {
  border: 1px solid var(--field-border); border-radius: 10px; padding: 11px 13px; background: var(--surface);
}
.pm-action-title { font-size: 12px; font-weight: 700; color: var(--text); margin-bottom: 7px; }

/* ---- สิทธิ์เข้าถึงเมนู (การ์ดกลุ่มแบบ masonry) ---- */
.pm-sec-flex { display: flex; align-items: center; }
.pm-quick { margin-left: auto; display: inline-flex; gap: 6px; }
.pm-quick-btn {
  padding: 4px 11px; border: 1px solid var(--field-border); background: var(--surface);
  color: var(--muted); border-radius: 7px; font-size: 12px; cursor: pointer; font-family: inherit; font-weight: 600;
}
.pm-quick-btn:hover { border-color: #2F65F6; color: #2F65F6; }

.pm-groups { column-count: 2; column-gap: 12px; }
.pm-group-card {
  break-inside: avoid; width: 100%; margin-bottom: 12px;
  border: 1px solid var(--field-border); border-radius: 10px; overflow: hidden; background: var(--surface);
}
.pm-group-head {
  display: flex; align-items: center; gap: 8px; padding: 9px 12px; cursor: pointer;
  background: var(--field); border-bottom: 1px solid var(--field-border);
  font-size: 12px; font-weight: 700; color: var(--text); user-select: none;
}
.pm-group-name { flex: 1; }
.pm-group-count {
  font-size: 11px; font-weight: 700; color: var(--muted);
  background: var(--surface); padding: 1px 8px; border-radius: 10px; border: 1px solid var(--field-border);
}
.pm-group-body { padding: 8px 12px; display: grid; grid-template-columns: 1fr; gap: 1px; }

/* ---- รายการติ๊ก ---- */
.pm-item {
  display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text);
  padding: 3px 0; cursor: pointer; user-select: none;
}
.pm-item input, .pm-group-head input {
  width: 15px; height: 15px; accent-color: #2F65F6; cursor: pointer; flex-shrink: 0;
}

/* ---- footer ---- */
.pm-count { font-size: 12px; color: var(--muted); }
.pm-count strong { color: #2F65F6; }
.pm-foot-spacer { flex: 1; }

.pm-fade-enter-active, .pm-fade-leave-active { transition: opacity 0.2s; }
.pm-fade-enter-from, .pm-fade-leave-to { opacity: 0; }

@media (max-width: 720px) {
  .pm-actions-grid { grid-template-columns: 1fr; }
  .pm-groups { column-count: 1; }
}
</style>
