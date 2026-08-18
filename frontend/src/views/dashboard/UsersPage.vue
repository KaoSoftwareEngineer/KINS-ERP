<template>
<div>
  <div class="header flex-wrap">
    <h1>{{ dash.t[dash.lang].membersList }}</h1>
    <div class="header-actions">
      <button class="btn-small fr-btn-search">{{ dash.t[dash.lang].search }}</button>
      <button class="btn-small fr-btn-add">{{ dash.t[dash.lang].addMember }}</button>
    </div>
  </div>

  <div class="section">
    <div class="section-header">
      <h2>{{ dash.t[dash.lang].totalMembers }} {{ dash.members.length }} {{ dash.lang === 'th' ? 'คน' : 'People' }}</h2>
      <button class="btn-small">{{ dash.t[dash.lang].filter }}</button>
    </div>
    <div class="overflow-x-auto table-scroll-y">
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>{{ dash.t[dash.lang].completeName }}</th>
          <th>{{ dash.t[dash.lang].email }}</th>
          <th>{{ dash.t[dash.lang].status }}</th>
          <th>{{ dash.t[dash.lang].registeredDate }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, idx) in dash.members" :key="idx">
          <td>{{ idx + 1 }}</td>
          <td><strong>{{ user.name || '-' }}</strong></td>
          <td>{{ user.email }}</td>
          <td><span class="badge success">✓ {{ dash.t[dash.lang].normal }}</span></td>
          <td>{{ user.created_at }}</td>
        </tr>
      </tbody>
    </table>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'UsersPage',
  inject: ['dash'],
};
</script>
