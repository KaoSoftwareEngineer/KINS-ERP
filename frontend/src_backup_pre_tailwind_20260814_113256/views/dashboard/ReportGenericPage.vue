<template>
<div>
  <div class="header">
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
      <h2>{{ dash.t[dash.lang].totalItems }} {{ dash.reportPages[dash.currentPage].rows.length }} {{ dash.t[dash.lang].itemsUnit }}</h2>
      <button class="btn-small">{{ dash.t[dash.lang].filter }}</button>
    </div>
    <table>
      <thead>
        <tr>
          <th v-for="col in dash.reportPages[dash.currentPage].columns" :key="col">{{ col }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, ridx) in dash.reportPages[dash.currentPage].rows" :key="ridx">
          <td v-for="(cell, cidx) in row" :key="cidx">{{ cell }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script>
export default {
  name: 'ReportGenericPage',
  inject: ['dash'],
};
</script>
