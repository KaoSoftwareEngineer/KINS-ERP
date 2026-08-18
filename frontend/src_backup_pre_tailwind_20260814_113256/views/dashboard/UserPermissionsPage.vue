<template>
<div>
  <div class="header">
    <div>
      <h1>🔐 {{ dash.pageTitle('user-permissions') }}</h1>
    </div>
    <div class="header-actions">
      <button class="btn-small">{{ dash.t[dash.lang].search }}</button>
      <button class="btn-small btn-primary">{{ dash.t[dash.lang].addRole }}</button>
    </div>
  </div>

  <div class="section" style="margin-top: 24px;">
    <div class="section-header">
      <h2>{{ dash.t[dash.lang].totalItems }} {{ dash.userRoles.rows.length }} {{ dash.t[dash.lang].rolesUnit }}</h2>
      <button class="btn-small">{{ dash.t[dash.lang].export }}</button>
    </div>
    <table>
      <thead>
        <tr>
          <th v-for="col in dash.userRoles.columns" :key="col">{{ col }}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, ridx) in dash.userRoles.rows" :key="ridx">
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
  name: 'UserPermissionsPage',
  inject: ['dash'],
};
</script>
