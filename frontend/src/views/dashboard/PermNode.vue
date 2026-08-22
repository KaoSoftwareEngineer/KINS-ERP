<template>
  <div class="pm-node" :class="'pm-lv-' + level">
    <label class="pm-check" :class="{ 'pm-parent': hasChildren }">
      <input
        type="checkbox"
        :checked="perm.isChecked(node)"
        :indeterminate.prop="perm.isIndeterminate(node)"
        @change="perm.toggle(node, $event.target.checked)"
      />
      <span class="pm-label">{{ node.label }}</span>
    </label>
    <div v-if="hasChildren" class="pm-children" :class="{ 'pm-grid': isLeafRow }">
      <PermNode v-for="child in node.children" :key="child.key" :node="child" :level="level + 1" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PermNode',
  inject: ['perm'],
  props: {
    node: { type: Object, required: true },
    level: { type: Number, default: 0 },
  },
  computed: {
    hasChildren() { return Array.isArray(this.node.children) && this.node.children.length > 0; },
    // ลูกทั้งหมดเป็นใบ (ไม่มีหลานต่อ) → จัดเป็นกริด 2 คอลัมน์ให้เหมือนแบบฟอร์ม
    isLeafRow() {
      return this.hasChildren && this.node.children.every(c => !c.children || c.children.length === 0);
    },
  },
};
</script>

<style scoped>
.pm-node { margin: 2px 0; }
.pm-check {
  display: inline-flex; align-items: center; gap: 7px;
  cursor: pointer; font-size: 12px; color: #334155; padding: 2px 0;
  user-select: none;
}
.pm-check input { width: 15px; height: 15px; accent-color: #1e3a8a; cursor: pointer; }
.pm-check.pm-parent .pm-label { font-weight: 600; color: #1e293b; }
.pm-children { margin-left: 22px; }
/* แถวของใบ → 2 คอลัมน์ */
.pm-children.pm-grid {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 18px; margin-top: 2px;
}
/* กลุ่มระดับบนสุด (level 0) เว้นระยะให้อ่านง่าย */
.pm-lv-0 { padding: 8px 0; border-bottom: 1px solid #eef2f7; }
.pm-lv-0 > .pm-check .pm-label { font-size: 12.5px; font-weight: 700; }

:global([data-theme="dark"]) .pm-check { color: #cbd5e1; }
:global([data-theme="dark"]) .pm-check.pm-parent .pm-label,
:global([data-theme="dark"]) .pm-lv-0 > .pm-check .pm-label { color: #ececee; }
:global([data-theme="dark"]) .pm-lv-0 { border-bottom-color: #2c2c31; }
</style>
