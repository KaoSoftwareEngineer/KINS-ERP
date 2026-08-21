<template>
<div>
  <div class="header flex-wrap">
    <div>
      <h1>{{ dash.reportPages[dash.currentPage].icon }} {{ dash.pageTitle(dash.currentPage) }}</h1>
    </div>
    <div class="header-actions">
      <button class="btn-small">{{ dash.t[dash.lang].selectPeriod }}</button>
      <button class="btn-small btn-primary">{{ dash.t[dash.lang].exportExcel }}</button>
    </div>
  </div>

  <div class="section" style="margin-top: 24px;">
    <div class="section-header">
      <h2>{{ dash.t[dash.lang].totalItems }} {{ dash.genCurrentTable.rows.length }} {{ dash.t[dash.lang].itemsUnit }}</h2>
      <div class="fr-summary-actions">
        <button class="btn-small">{{ dash.t[dash.lang].filter }}</button>
        <button v-if="dash.genSelected.length > 0" class="btn-small" @click="dash.genExportExcel(true)">⬇️ ส่งออกที่เลือก</button>
        <button class="btn-small" @click="dash.genExportExcel(false)">⬇️ ส่งออก Excel</button>
      </div>
    </div>
    <div class="overflow-x-auto table-scroll-y">
    <table>
      <thead>
        <tr>
          <th class="fr-th-check"><input type="checkbox" :checked="dash.genAllSelectedOnPage" @change="dash.genToggleSelectAll" /></th>
          <th v-for="(col, cidx) in dash.genCurrentTable.columns" :key="col" class="fr-th-sort" @click="dash.genSort(cidx)">
            {{ col }} <span class="fr-sort-icon">{{ dash.genSortCol === cidx ? (dash.genSortDir === 'asc' ? '▲' : '▼') : '' }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, ridx) in dash.genPagedRows" :key="ridx">
          <td><input type="checkbox" :checked="dash.genSelected.includes(row)" @change="dash.genToggleSelectRow(row)" /></td>
          <td v-for="(cell, cidx) in row" :key="cidx">{{ cell }}</td>
        </tr>
      </tbody>
    </table>
    </div>
    <div class="xl-pagination" v-if="dash.genCurrentTable.rows.length > 0">
      <select v-model.number="dash.genPageSize" class="fr-page-size-select">
        <option :value="10">10 / หน้า</option>
        <option :value="20">20 / หน้า</option>
        <option :value="50">50 / หน้า</option>
      </select>
      <button class="fr-btn-util" :disabled="dash.genPage === 1" @click="dash.genPrevPage">‹ ก่อนหน้า</button>
      <span>หน้า {{ dash.genPage }} / {{ dash.genTotalPages }}</span>
      <button class="fr-btn-util" :disabled="dash.genPage === dash.genTotalPages" @click="dash.genNextPage">ถัดไป ›</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'ReportGenericPage',
  inject: ['dash'],
};
</script>
