<template>
<div>
  <div class="header">
    <div>
      <h1>{{ dash.orderPages[dash.currentPage].icon }} {{ dash.pageTitle(dash.currentPage) }}</h1>
    </div>
    <div class="header-actions">
      <button class="btn-small">{{ dash.t[dash.lang].search }}</button>
      <button class="btn-small btn-primary">{{ dash.t[dash.lang].addItem }}</button>
    </div>
  </div>

  <div class="section" style="margin-top: 24px;">
    <div class="section-header">
      <h2>{{ dash.t[dash.lang].totalItems }} {{ dash.orderPages[dash.currentPage].rows.length }} {{ dash.t[dash.lang].itemsUnit }}</h2>
      <button class="btn-small">{{ dash.t[dash.lang].export }}</button>
    </div>
    <table>
      <thead>
        <tr>
          <th v-for="col in dash.orderPages[dash.currentPage].columns" :key="col">{{ col }}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, ridx) in dash.orderPages[dash.currentPage].rows" :key="ridx">
          <td v-for="(cell, cidx) in row" :key="cidx">{{ cell }}</td>
          <td><button class="btn-small">{{ dash.t[dash.lang].edit }}</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script>
export default {
  name: 'OrderGenericPage',
  inject: ['dash'],
};
</script>
