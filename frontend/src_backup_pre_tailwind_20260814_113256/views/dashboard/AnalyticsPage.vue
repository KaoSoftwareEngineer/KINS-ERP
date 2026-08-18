<template>
<div>
  <div class="header">
    <h1>{{ dash.t[dash.lang].analytics }}</h1>
  </div>

  <div class="stats-grid">
    <div class="stat-card">
      <div class="label">{{ dash.lang === 'th' ? 'ยอดวิวรวม' : 'Total Views' }}</div>
      <div class="value">{{ dash.totalViews }}</div>
      <div class="detail">✈️ {{ dash.lang === 'th' ? 'เพิ่มขึ้น 12%' : 'Increased 12%' }}</div>
    </div>
    <div class="stat-card">
      <div class="label">{{ dash.lang === 'th' ? 'การแปลง' : 'Conversions' }}</div>
      <div class="value">{{ dash.conversions }}</div>
      <div class="detail">📈 {{ dash.lang === 'th' ? 'อัตรา' : 'Rate' }} {{ dash.conversionRate }}%</div>
    </div>
    <div class="stat-card">
      <div class="label">{{ dash.lang === 'th' ? 'อัตราหลุด' : 'Bounce Rate' }}</div>
      <div class="value">{{ dash.bounceRate }}%</div>
      <div class="detail">⬇️ {{ dash.lang === 'th' ? 'ลดลง 3%' : 'Decreased 3%' }}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-header">
      <h2>📊 {{ dash.lang === 'th' ? 'เปรียบเทียบประสิทธิภาพ' : 'Performance Comparison' }}</h2>
    </div>
    <table>
      <thead>
        <tr>
          <th>{{ dash.lang === 'th' ? 'ช่วงเวลา' : 'Period' }}</th>
          <th>{{ dash.lang === 'th' ? 'ยอดวิว' : 'Views' }}</th>
          <th>{{ dash.lang === 'th' ? 'ผู้เยี่ยมชม' : 'Visitors' }}</th>
          <th>{{ dash.lang === 'th' ? 'การแปลง' : 'Conversions' }}</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>{{ dash.lang === 'th' ? 'สัปดาห์นี้' : 'This Week' }}</td><td>1,245</td><td>892</td><td>156</td></tr>
        <tr><td>{{ dash.lang === 'th' ? 'สัปดาห์ที่แล้ว' : 'Last Week' }}</td><td>1,123</td><td>756</td><td>142</td></tr>
        <tr><td>{{ dash.lang === 'th' ? 'เดือนที่แล้ว' : 'Last Month' }}</td><td>4,856</td><td>3,421</td><td>687</td></tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script>
export default {
  name: 'AnalyticsPage',
  inject: ['dash'],
};
</script>
