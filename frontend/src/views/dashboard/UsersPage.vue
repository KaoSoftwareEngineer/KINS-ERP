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
          <th>ตำแหน่ง / บทบาท</th>
          <th>{{ dash.t[dash.lang].status }}</th>
          <th>{{ dash.t[dash.lang].registeredDate }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, idx) in dash.members" :key="idx">
          <td>{{ idx + 1 }}</td>
          <td><strong>{{ user.name || '-' }}</strong></td>
          <td>{{ user.email }}</td>
          <td>
            <select class="pm-role-select" :value="user.role || ''" @change="dash.setUserRole(user, $event.target.value)">
              <option value="">— ยังไม่กำหนด —</option>
              <option v-for="r in dash.roleOptions()" :key="r" :value="r">{{ r }}</option>
            </select>
          </td>
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

<style scoped>
.pm-role-select {
  padding: 5px 10px; border: 1px solid #cbd5e1; border-radius: 7px;
  font-size: 13.5px; font-family: inherit; background: #fff; color: #334155;
  cursor: pointer; max-width: 200px;
}
.pm-role-select:focus { outline: none; border-color: #1e40ff; }
</style>
