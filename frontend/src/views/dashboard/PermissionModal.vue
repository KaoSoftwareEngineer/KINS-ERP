<template>
  <transition name="pm-fade">
    <div v-if="dash.pmShow" class="pm-overlay" @click.self="dash.pmClose()">
      <div class="pm-modal">
        <!-- หัวโมดัล -->
        <div class="pm-header">
          <span>{{ dash.pmEditing ? 'แก้ไข' : 'เพิ่ม' }} สิทธิ์การเข้าใช้งาน</span>
          <button class="pm-x" @click="dash.pmClose()" aria-label="ปิด">✕</button>
        </div>

        <div class="pm-body">
          <!-- ชื่อบทบาท/ตำแหน่ง -->
          <div class="pm-field">
            <label class="pm-field-label">ชื่อ</label>
            <input v-model="name" class="pm-input" placeholder="เช่น CEO, ฝ่ายบัญชี, พนักงานส่งของ" />
            <span class="pm-req">*</span>
          </div>

          <!-- เลือกตำแหน่งเริ่มต้น (พรีเซ็ต) -->
          <div class="pm-presets">
            <span class="pm-presets-label">ตำแหน่งแนะนำ:</span>
            <button v-for="p in presets" :key="p.key" class="pm-preset-btn" :title="p.desc" @click="applyPreset(p)">
              {{ p.label }}
            </button>
          </div>

          <!-- สิทธิ์การกระทำ (3 คอลัมน์) -->
          <div class="pm-actions-grid">
            <div v-for="grp in actions" :key="grp.title" class="pm-action-col">
              <div class="pm-action-title">{{ grp.title }}</div>
              <label v-for="it in grp.items" :key="it.key" class="pm-check">
                <input type="checkbox" :checked="!!selected[it.key]" @change="toggleLeaf(it.key, $event.target.checked)" />
                <span class="pm-label">{{ it.label }}</span>
              </label>
            </div>
          </div>

          <div class="pm-divider"></div>

          <!-- สิทธิ์เข้าถึง (ต้นไม้) -->
          <div class="pm-access-title">สิทธิ์เข้าถึง</div>
          <div class="pm-tree">
            <PermNode v-for="node in access" :key="node.key" :node="node" :level="0" />
          </div>
        </div>

        <!-- ปุ่มบันทึก -->
        <div class="pm-footer">
          <span class="pm-count">เลือกแล้ว {{ selectedCount }} สิทธิ์</span>
          <div class="pm-footer-btns">
            <button class="pm-btn pm-btn-cancel" @click="dash.pmClose()">ยกเลิก</button>
            <button class="pm-btn pm-btn-save" @click="save">💾 บันทึก</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import PermNode from './PermNode.vue';
import { PERM_ACTIONS, PERM_ACCESS, ROLE_PRESETS, leafKeysOf, allPageKeys } from './permissionSchema.js';

export default {
  name: 'PermissionModal',
  components: { PermNode },
  inject: ['dash'],
  provide() {
    // ตัวควบคุมให้ PermNode ใช้ (เช็ค/สลับสถานะ)
    return {
      perm: {
        isChecked: (node) => this.nodeChecked(node),
        isIndeterminate: (node) => this.nodeIndeterminate(node),
        toggle: (node, val) => this.toggleNode(node, val),
      },
    };
  },
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
    // เปิดโมดัลเมื่อไหร่ → โหลดค่าเริ่มต้นจาก dash
    'dash.pmShow'(v) {
      if (v) {
        this.name = dashInitialName(this.dash);
        this.selected = {};
        (this.dash.pmInitialKeys || []).forEach(k => { this.selected[k] = true; });
      }
    },
  },
  methods: {
    // เลือกสิทธิ์ตามตำแหน่งพรีเซ็ต (ตั้งชื่อ + ติ๊กสิทธิ์เมนูให้อัตโนมัติ)
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
      keys.forEach(k => {
        if (val) this.selected[k] = true;
        else delete this.selected[k];
      });
    },
    toggleNode(node, val) {
      this.setKeys(leafKeysOf(node), val);
    },
    nodeChecked(node) {
      const leaves = leafKeysOf(node);
      return leaves.length > 0 && leaves.every(k => this.selected[k]);
    },
    nodeIndeterminate(node) {
      const leaves = leafKeysOf(node);
      const on = leaves.filter(k => this.selected[k]).length;
      return on > 0 && on < leaves.length;
    },
    save() {
      const keys = Object.keys(this.selected).filter(k => this.selected[k]);
      this.dash.pmSave(this.name.trim(), keys);
    },
  },
};

// ดึงชื่อเริ่มต้นจาก dash (ตอนแก้ไข)
function dashInitialName(dash) {
  return dash.pmInitialName || '';
}
</script>

<style scoped>
.pm-overlay {
  position: fixed; inset: 0; z-index: 3500;
  display: flex; align-items: center; justify-content: center;
  background: rgba(15, 23, 42, 0.5); padding: 20px;
  font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif;
}
.pm-modal {
  background: #fff; border-radius: 12px; width: 640px; max-width: 100%;
  max-height: 92vh; display: flex; flex-direction: column;
  box-shadow: 0 24px 60px rgba(0,0,0,0.3); overflow: hidden;
}
.pm-header {
  background: #1e40ff; color: #fff; padding: 13px 20px;
  font-size: 16px; font-weight: 700;
  display: flex; align-items: center; justify-content: space-between;
}
.pm-x { background: none; border: none; color: #fff; font-size: 18px; cursor: pointer; line-height: 1; }
.pm-x:hover { opacity: 0.8; }

.pm-body { padding: 18px 22px; overflow-y: auto; }

.pm-field { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.pm-field-label { font-size: 15px; font-weight: 600; color: #1e293b; min-width: 34px; }
.pm-input {
  flex: 1; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 7px;
  font-size: 14px; font-family: inherit; outline: none;
}
.pm-input:focus { border-color: #1e40ff; box-shadow: 0 0 0 3px rgba(30,64,255,0.12); }
.pm-req { color: #a82a3a; font-weight: 700; }

.pm-presets { display: flex; flex-wrap: wrap; align-items: center; gap: 7px; margin-bottom: 16px; }
.pm-presets-label { font-size: 13px; color: #64748b; }
.pm-preset-btn {
  padding: 4px 11px; border: 1px solid #c7d2fe; background: #eef2ff; color: #3730a3;
  border-radius: 999px; font-size: 12.5px; cursor: pointer; font-family: inherit;
}
.pm-preset-btn:hover { background: #e0e7ff; }

.pm-actions-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.pm-action-title { font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 6px; }
.pm-action-col .pm-check { display: flex; }

.pm-check {
  display: inline-flex; align-items: center; gap: 7px; cursor: pointer;
  font-size: 14px; color: #334155; padding: 3px 0; user-select: none;
}
.pm-check input { width: 15px; height: 15px; accent-color: #1e3a8a; cursor: pointer; }

.pm-divider { height: 1px; background: #e2e8f0; margin: 16px 0; }
.pm-access-title { font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 6px; }
.pm-tree { }

.pm-footer {
  border-top: 1px solid #e2e8f0; padding: 12px 20px;
  display: flex; align-items: center; justify-content: space-between;
  background: #f8fafc;
}
.pm-count { font-size: 13px; color: #64748b; }
.pm-footer-btns { display: flex; gap: 10px; }
.pm-btn { padding: 9px 22px; border: none; border-radius: 8px; font-size: 14.5px; font-weight: 700; cursor: pointer; font-family: inherit; }
.pm-btn-cancel { background: #e2e8f0; color: #334155; }
.pm-btn-cancel:hover { background: #cbd5e1; }
.pm-btn-save { background: #1a9c54; color: #fff; }
.pm-btn-save:hover { background: #158045; }

.pm-fade-enter-active, .pm-fade-leave-active { transition: opacity 0.2s; }
.pm-fade-enter-from, .pm-fade-leave-to { opacity: 0; }

/* โหมดมืด */
:global([data-theme="dark"]) .pm-modal { background: #1e293b; }
:global([data-theme="dark"]) .pm-body { color: #e2e8f0; }
:global([data-theme="dark"]) .pm-field-label,
:global([data-theme="dark"]) .pm-action-title,
:global([data-theme="dark"]) .pm-access-title { color: #f1f5f9; }
:global([data-theme="dark"]) .pm-input { background: #0f172a; border-color: #334155; color: #f1f5f9; }
:global([data-theme="dark"]) .pm-footer { background: #172033; border-top-color: #334155; }
:global([data-theme="dark"]) .pm-divider { background: #334155; }
:global([data-theme="dark"]) .pm-btn-cancel { background: #334155; color: #e2e8f0; }

@media (max-width: 640px) {
  .pm-actions-grid { grid-template-columns: 1fr; }
}
</style>
