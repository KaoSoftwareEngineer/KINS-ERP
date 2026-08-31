<template>
<div class="fr-modal-overlay" @click.self="dash.frCloseShadeModal">
  <div class="fr-modal fr-shade-modal">
    <div class="fr-modal-header">
      <h3 v-if="dash.frShadeContext === 'irregular'">{{ dash.t[dash.lang].shadesTitle }} - {{ dash.frShadeFabric ? dash.frShadeFabric.name : '-' }}</h3>
      <h3 v-else>{{ dash.t[dash.lang].shadesTitle }} - {{ dash.frShadeFabric ? dash.frShadeFabric.sku : '-' }} - {{ dash.frShadeFabric ? dash.frShadeFabric.name : '-' }}</h3>
      <button class="fr-modal-close" @click="dash.frCloseShadeModal" :title="dash.t[dash.lang].close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>

    <div class="fr-modal-body">
      <div class="fr-shade-search">
        <input type="text" v-model="dash.frShadeSearch" :placeholder="dash.t[dash.lang].searchInput" />
        <button class="fr-btn-util" @click="dash.frShadeSearchAction">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          {{ dash.t[dash.lang].searchWord }}
        </button>
        <button class="fr-btn-util" @click="dash.frShadeResetSearch">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 1 3 6.7"/><path d="M3 16v-4h4"/></svg>
          {{ dash.t[dash.lang].resetWord }}
        </button>
      </div>

      <!-- ดึงเฉดสีจากกลุ่มผ้า (เฉพาะตอนเปิดจากผ้า ไม่ใช่จากกลุ่มเอง) -->
      <div class="fr-shade-pull" v-if="dash.frShadeContext !== 'regular-group'">
        <span class="fr-shade-pull-label">{{ dash.t[dash.lang].pullShadesFromGroupLabel }}</span>
        <select v-model="dash.frShadeGroupSel" class="fr-shade-pull-select">
          <option value="">{{ dash.t[dash.lang].selectFabricGroupPlaceholder }}</option>
          <option v-for="g in dash.frShadeGroups" :key="g.id" :value="g.id">{{ g.name }} ({{ g.colors || (g.shades ? g.shades.length : 0) }} {{ dash.t[dash.lang].colorsUnit }})</option>
        </select>
        <button class="fr-btn-util fr-btn-search" @click="dash.frPullShadesFromGroup" :disabled="!dash.frShadeGroupSel">{{ dash.t[dash.lang].pullInLabel }}</button>
      </div>

      <div class="fr-shade-table">
        <div class="fr-shade-row fr-shade-row-head">
          <span>{{ dash.t[dash.lang].colorCodeLabel }}</span>
          <span>{{ dash.t[dash.lang].shadeLabel }}</span>
          <span>{{ dash.t[dash.lang].rackWord }}</span>
          <span>{{ dash.t[dash.lang].imageLabel }}</span>
          <span>{{ dash.t[dash.lang].fabricCostLabel }}</span>
          <span>{{ dash.t[dash.lang].dyeCostLabel }}</span>
          <span></span>
        </div>
        <div v-if="dash.frShadeLoading" class="fr-shade-empty">{{ dash.t[dash.lang].loadingWord }}</div>
        <div v-else-if="dash.frVisibleShadeRows.length === 0" class="fr-shade-empty">{{ dash.t[dash.lang].noShadesAddHintMsg }}</div>
        <div class="fr-shade-row" v-for="row in dash.frVisibleShadeRows" :key="row._key">
          <input type="text" v-model="row.color_code" :placeholder="dash.t[dash.lang].egColorCodePlaceholder" />
          <input type="text" v-model="row.name" :placeholder="dash.t[dash.lang].shadeNamePlaceholder" />
          <input type="text" v-model="row.rack" :placeholder="dash.t[dash.lang].rackWord" />
          <label class="fr-shade-img" :title="row.image_name || dash.t[dash.lang].uploadShadeImageTitle">
            <input type="file" accept="image/*" @change="onPickImage(row, $event)" hidden />
            <span v-if="row.image_name" class="fr-shade-img-name">🖼 {{ row.image_name }}</span>
            <span v-else class="fr-shade-img-empty">{{ dash.t[dash.lang].selectImageLabel }}</span>
          </label>
          <input type="number" step="0.01" v-model="row.fabric_cost" placeholder="0.00" />
          <input type="number" step="0.01" v-model="row.dye_cost" placeholder="0.00" />
          <span class="fr-shade-row-actions">
            <button class="fr-circle-btn add" :title="dash.t[dash.lang].addNextRowTitle" @click="dash.frShadeAddRowAfter(row)">➕</button>
            <button class="fr-circle-btn remove" :title="dash.t[dash.lang].removeThisShadeTitle" @click="dash.frShadeRemoveRow(row)">➖</button>
          </span>
        </div>
      </div>
    </div>

    <div class="fr-modal-footer">
      <button class="fr-btn-save" @click="dash.frShadeAppendRow">
        ➕ {{ dash.t[dash.lang].add }}
      </button>
      <button class="fr-btn-save" @click="dash.frSaveShades">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        {{ dash.t[dash.lang].save }}
      </button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'ShadeModal',
  inject: ['dash'],
  methods: {
    // เลือกรูปเฉดสี — เก็บชื่อไฟล์ไว้กับแถว (บันทึกพร้อมเฉดสี)
    onPickImage(row, e) {
      const f = e.target.files && e.target.files[0];
      row.image_name = f ? f.name : '';
      e.target.value = '';
    },
  },
};
</script>

<style scoped>
.fr-shade-pull {
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  padding: 10px 12px; margin-bottom: 10px;
  background: var(--brand-soft); border: 1px solid var(--field-border); border-radius: 8px;
}
.fr-shade-pull-label { font-size: 12px; font-weight: 600; color: var(--brand-2); }
.fr-shade-pull-select {
  flex: 1; min-width: 180px; height: 34px; padding: 0 10px;
  border: 1px solid var(--field-border); border-radius: 7px; font-size: 12px;
  background: var(--surface); color: var(--text); font-family: inherit;
}
.fr-shade-pull .fr-btn-util { padding: 6px 16px; }
/* ช่องเลือกรูปเฉดสี */
.fr-shade-img {
  display: flex; align-items: center; justify-content: center;
  height: 32px; padding: 0 8px; cursor: pointer;
  border: 1px dashed var(--field-border); border-radius: 7px;
  background: var(--field); font-size: 11.5px; color: var(--muted);
  overflow: hidden; white-space: nowrap;
}
.fr-shade-img:hover { border-color: var(--brand); color: var(--brand); }
.fr-shade-img-name { overflow: hidden; text-overflow: ellipsis; color: var(--text); }
</style>
