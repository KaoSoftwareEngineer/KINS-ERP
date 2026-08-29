<template>
  <div class="cs" ref="root">
    <button type="button" class="cs-btn" @click="open = !open">
      <ChannelIcon :channel="modelValue" />
      <span class="cs-label">{{ labelOf(modelValue) }}</span>
      <span class="cs-caret" :class="{ up: open }">▾</span>
    </button>
    <div v-if="open" class="cs-menu">
      <button type="button" v-for="c in channels" :key="c.key" class="cs-item" :class="{ sel: c.key === modelValue }" @click="pick(c.key)">
        <ChannelIcon :channel="c.key" />
        <span>{{ c.label }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import ChannelIcon from './ChannelIcon.vue';
export default {
  name: 'ChannelSelect',
  components: { ChannelIcon },
  props: {
    modelValue: { type: String, default: 'other' },
    channels: { type: Array, required: true },
  },
  emits: ['update:modelValue'],
  data() { return { open: false }; },
  mounted() { document.addEventListener('click', this.onOutside, true); },
  beforeUnmount() { document.removeEventListener('click', this.onOutside, true); },
  methods: {
    labelOf(key) { const c = this.channels.find((x) => x.key === key); return c ? c.label : key; },
    pick(key) { this.$emit('update:modelValue', key); this.open = false; },
    onOutside(e) { if (this.open && this.$refs.root && !this.$refs.root.contains(e.target)) this.open = false; },
  },
};
</script>

<style scoped>
.cs { position: relative; }
.cs-btn { display: flex; align-items: center; gap: 8px; width: 100%; height: 34px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; background: var(--field); color: var(--text); font-size: 12.5px; font-family: inherit; cursor: pointer; }
.cs-btn:hover { border-color: #2F65F6; }
.cs-label { flex: 1; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cs-caret { color: var(--muted); font-size: 10px; transition: transform .15s; }
.cs-caret.up { transform: rotate(180deg); }
.cs-menu { position: absolute; top: calc(100% + 4px); left: 0; right: 0; min-width: 160px; background: var(--surface); border: 1px solid var(--field-border); border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,.16); z-index: 50; padding: 4px; max-height: 260px; overflow-y: auto; }
.cs-item { display: flex; align-items: center; gap: 9px; width: 100%; padding: 8px 10px; border: none; background: none; color: var(--text); font-size: 12.5px; font-family: inherit; cursor: pointer; border-radius: 7px; text-align: left; }
.cs-item:hover { background: var(--field); }
.cs-item.sel { background: var(--brand-soft, #eaf1ff); color: var(--brand, #2F65F6); font-weight: 600; }
</style>
