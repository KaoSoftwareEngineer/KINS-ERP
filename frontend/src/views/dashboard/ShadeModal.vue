<template>
<div class="fr-modal-overlay" @click.self="dash.frCloseShadeModal">
  <div class="fr-modal fr-shade-modal">
    <div class="fr-modal-header">
      <h3 v-if="dash.frShadeContext === 'irregular'">{{ dash.t[dash.lang].shadesTitle }} - {{ dash.frShadeFabric ? dash.frShadeFabric.name : '-' }}</h3>
      <h3 v-else>{{ dash.t[dash.lang].shadesTitle }} - {{ dash.frShadeFabric ? dash.frShadeFabric.sku : '-' }} - {{ dash.frShadeFabric ? dash.frShadeFabric.name : '-' }}</h3>
      <button class="fr-modal-close" @click="dash.frCloseShadeModal" title="ปิด">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>

    <div class="fr-modal-body">
      <div class="fr-shade-search">
        <input type="text" v-model="dash.frShadeSearch" placeholder="คำค้นหา" />
        <button class="fr-btn-util" @click="dash.frShadeSearchAction">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          {{ dash.t[dash.lang].searchWord }}
        </button>
        <button class="fr-btn-util" @click="dash.frShadeResetSearch">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 1 3 6.7"/><path d="M3 16v-4h4"/></svg>
          {{ dash.t[dash.lang].resetWord }}
        </button>
      </div>

      <div class="fr-shade-table">
        <div class="fr-shade-row fr-shade-row-head">
          <span>ชื่อ</span>
          <span>ต้นทุนผ้า</span>
          <span>ค่าย้อม</span>
          <span></span>
        </div>
        <div v-if="dash.frShadeLoading" class="fr-shade-empty">กำลังโหลดข้อมูล...</div>
        <div v-else-if="dash.frVisibleShadeRows.length === 0" class="fr-shade-empty">ไม่มีเฉดสี — กด + เพื่อเพิ่มรายการ</div>
        <div class="fr-shade-row" v-for="row in dash.frVisibleShadeRows" :key="row._key">
          <input type="text" v-model="row.name" placeholder="ชื่อเฉดสี" />
          <input type="number" step="0.01" v-model="row.fabric_cost" placeholder="0.00" />
          <input type="number" step="0.01" v-model="row.dye_cost" placeholder="0.00" />
          <span class="fr-shade-row-actions">
            <button class="fr-circle-btn add" title="เพิ่มแถวถัดไป" @click="dash.frShadeAddRowAfter(row)">➕</button>
            <button class="fr-circle-btn remove" title="ลบเฉดสีนี้" @click="dash.frShadeRemoveRow(row)">➖</button>
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
};
</script>
