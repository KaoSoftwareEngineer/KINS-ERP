<template>
<div class="dash-fit">
  <div class="header">
    <div>
      <h1>📊 {{ dash.t[dash.lang].dashboard }}</h1>
      <p style="font-size: 14px; color: var(--muted); margin-top: 4px;">{{ dash.t[dash.lang].welcome }}</p>
    </div>
    <div class="header-actions">
      <button class="btn-small" @click="dash.dashExportExcel('day')">{{ dash.t[dash.lang].dailyDaily }}</button>
      <button class="btn-small" @click="dash.dashExportExcel('week')">{{ dash.t[dash.lang].weekly }}</button>
      <button class="btn-small btn-primary" @click="dash.dashExportExcel('month')">{{ dash.t[dash.lang].export }}</button>
    </div>
  </div>

  <!-- Top Stats Grid -->
  <div class="stats-grid">
    <div class="stat-card">
      <div class="label">{{ dash.t[dash.lang].revenue }}</div>
      <div class="value">฿{{ dash.totalRevenue }}</div>
      <div class="detail">{{ dash.t[dash.lang].increasedBy }}</div>
    </div>
    <div class="stat-card">
      <div class="label">{{ dash.t[dash.lang].sales }}</div>
      <div class="value">{{ dash.monthlySales }}</div>
      <div class="detail">{{ dash.t[dash.lang].rank }}</div>
    </div>
    <div class="stat-card">
      <div class="label">{{ dash.t[dash.lang].orders }}</div>
      <div class="value">{{ dash.totalOrders }}</div>
      <div class="detail">📦 {{ dash.t[dash.lang].processing }}</div>
    </div>
    <div class="stat-card">
      <div class="label">{{ dash.t[dash.lang].totalSales }}</div>
      <div class="value">฿{{ dash.totalSalesAmount }}</div>
      <div class="detail">💰 {{ dash.t[dash.lang].bestSelling }}</div>
    </div>
  </div>

  <!-- Charts Row -->
  <div class="dash-charts-row dash-flex-row">
    <!-- Line Chart -->
    <div class="section dash-chart-section">
      <div class="section-header">
        <h2>{{ dash.t[dash.lang].trendTitle }}</h2>
        <div style="display: flex; gap: 8px; align-items: center;">
          <select v-if="dash.dashTrendViewMode === 'month'" v-model.number="dash.dashTrendYear" class="dash-year-select">
            <option v-for="y in dash.dashAvailableYears" :key="y" :value="y">{{ y }}</option>
          </select>
          <button class="btn-small" :class="{ 'btn-primary': dash.dashTrendViewMode === 'month' }" @click="dash.dashTrendViewMode = 'month'">{{ dash.t[dash.lang].month }}</button>
          <button class="btn-small" :class="{ 'btn-primary': dash.dashTrendViewMode === 'year' }" @click="dash.dashTrendViewMode = 'year'">{{ dash.t[dash.lang].year }}</button>
        </div>
      </div>
      <div class="dash-chart-box dash-linechart-box">
        <div class="dash-linechart">
          <div class="dash-linechart-plot">
            <svg viewBox="0 0 560 200" preserveAspectRatio="none" class="dash-line-svg">
              <line v-for="(gl, gi) in dash.dashTrendGridLines" :key="gi" x1="52" x2="544" :y1="gl.y" :y2="gl.y" class="dash-grid-line" />
              <path :d="dash.dashTrendAreaPath" class="dash-area-fill" />
              <path :d="dash.dashTrendLinePath" class="dash-line-stroke" />
              <circle v-for="(p, i) in dash.dashTrendPoints" :key="i" :cx="p.x" :cy="p.y" r="4"
                      class="dash-line-dot" :class="{ 'is-active': dash.dashTrendHoverIdx === i }"
                      @mouseenter="dash.dashTrendHoverIdx = i" @mouseleave="dash.dashTrendHoverIdx = null" />
            </svg>
            <div class="dash-axis-y">
              <span v-for="(gl, gi) in dash.dashTrendGridLines" :key="gi" :style="{ top: gl.yPct + '%' }">{{ gl.label }}</span>
            </div>
            <div class="dash-chart-xaxis">
              <span v-for="(p, i) in dash.dashTrendPoints" :key="i" :style="{ left: p.xPct + '%' }"
                    :class="{ 'is-active': dash.dashTrendHoverIdx === i }">{{ p.label }}</span>
            </div>
            <div v-if="dash.dashTrendHoverIdx !== null" class="dash-chart-tooltip"
                 :style="{ left: dash.dashTrendPoints[dash.dashTrendHoverIdx].xPct + '%' }">
              <strong>{{ dash.dashTrendPoints[dash.dashTrendHoverIdx].label }}{{ dash.dashTrendViewMode === 'month' ? ' ' + dash.dashTrendYear : '' }}</strong>
              ฿{{ dash.dashTrendPoints[dash.dashTrendHoverIdx].value.toLocaleString() }}
            </div>
          </div>
          <div class="dash-chart-note">
            {{ dash.dashTrendViewMode === 'year' ? 'ยอดขายรวมรายปี' : 'ยอดขายรายเดือน ปี ' + dash.dashTrendYear }} — ข้อมูลตัวอย่าง ยังไม่ได้เชื่อมข้อมูลจริง
          </div>
        </div>
      </div>
    </div>

    <!-- Donut Chart -->
    <div class="section dash-chart-section">
      <div class="section-header">
        <h2>{{ dash.t[dash.lang].volumeTitle }}</h2>
      </div>
      <div class="dash-chart-box dash-donut-box">
        <div class="dash-donut-row">
          <svg viewBox="0 0 160 160" class="dash-donut-svg">
            <circle cx="80" cy="80" r="60" class="dash-donut-track" />
            <circle v-for="(seg, i) in dash.dashVolumeSegments" :key="i" cx="80" cy="80" r="60" fill="none"
                    :stroke="seg.color" stroke-width="18" :stroke-dasharray="seg.dasharray"
                    :stroke-dashoffset="seg.dashoffset" transform="rotate(-90 80 80)"
                    class="dash-donut-seg" :class="{ 'is-active': dash.dashVolumeHoverIdx === i }"
                    @mouseenter="dash.dashVolumeHoverIdx = i" @mouseleave="dash.dashVolumeHoverIdx = null" />
            <text x="80" y="76" text-anchor="middle" class="dash-donut-center-value">
              {{ dash.dashVolumeHoverIdx !== null ? dash.dashVolumeSegments[dash.dashVolumeHoverIdx].pct + '%' : '100%' }}
            </text>
            <text x="80" y="94" text-anchor="middle" class="dash-donut-center-label">
              {{ dash.dashVolumeHoverIdx !== null ? dash.dashVolumeSegments[dash.dashVolumeHoverIdx].label : dash.t[dash.lang].volumeTitle }}
            </text>
          </svg>
          <div class="dash-donut-legend">
            <div v-for="(seg, i) in dash.dashVolumeSegments" :key="i" class="dash-donut-legend-item"
                 :class="{ 'is-active': dash.dashVolumeHoverIdx === i }"
                 @mouseenter="dash.dashVolumeHoverIdx = i" @mouseleave="dash.dashVolumeHoverIdx = null">
              <span class="dash-donut-swatch" :style="{ background: seg.color }"></span>
              <span class="dash-donut-legend-label">{{ seg.label }}</span>
              <span class="dash-donut-legend-pct">{{ seg.pct }}%</span>
            </div>
          </div>
        </div>
        <div class="dash-chart-note">สัดส่วนยอดขายแยกตามประเภทผ้า — ข้อมูลตัวอย่าง ปี {{ dash.dashTrendYear }}</div>
      </div>
    </div>
  </div>

  <!-- Cards Grid -->
  <div class="dash-cards-grid dash-cards-grid-compact">
    <div style="background: linear-gradient(135deg, #e85d75 0%, #c2226a 100%); border-radius: 12px; padding: 6px 14px; color: #fff;">
      <div style="font-size: 10px; opacity: 0.9; margin-bottom: 2px;">📊 สถานะรายได้</div>
      <div style="font-size: 16px; font-weight: 700;">฿432</div>
      <div style="font-size: 10px; opacity: 0.85; margin-top: 2px;">Jan 01 - Jan 10</div>
    </div>
    <div style="background: linear-gradient(135deg, #7c5cdb 0%, #5a3fb8 100%); border-radius: 12px; padding: 6px 14px; color: #fff;">
      <div style="font-size: 10px; opacity: 0.9; margin-bottom: 2px;">👁️ ยอดวิว</div>
      <div style="font-size: 16px; font-weight: 700;">฿432</div>
      <div style="font-size: 10px; opacity: 0.85; margin-top: 2px;">ผู้เยี่ยมชมวันนี้</div>
    </div>
    <div style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); border-radius: 12px; padding: 6px 14px; color: #fff;">
      <div style="font-size: 10px; opacity: 0.9; margin-bottom: 2px;">📉 อัตราหลุด</div>
      <div style="font-size: 16px; font-weight: 700;">฿432</div>
      <div style="font-size: 10px; opacity: 0.85; margin-top: 2px;">นาทีต่อวัน</div>
    </div>
    <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 12px; padding: 6px 14px; color: #fff;">
      <div style="font-size: 10px; opacity: 0.9; margin-bottom: 2px;">📊 สถานะรายได้</div>
      <div style="font-size: 16px; font-weight: 700;">฿432</div>
      <div style="font-size: 10px; opacity: 0.85; margin-top: 2px;">Jan 01 - Jan 10</div>
    </div>
  </div>

  <!-- Recent Activities & Order Status -->
  <div class="dash-activity-row dash-flex-row">
    <!-- Recent Activities -->
    <div class="section dash-list-section">
      <div class="section-header">
        <h2>{{ dash.t[dash.lang].recentActivities }}</h2>
      </div>
      <div class="dash-scroll-body">
        <div class="activity-item" v-for="(activity, idx) in dash.recentActivities" :key="idx">
          <div class="activity-icon">{{ activity.icon }}</div>
          <div class="activity-content">
            <div class="activity-title">{{ dash.lang === 'th' ? activity.thTitle : activity.enTitle }}</div>
            <div class="activity-time">{{ activity.time }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Status -->
    <div class="section dash-list-section">
      <div class="section-header">
        <h2>{{ dash.t[dash.lang].orderStatus }}</h2>
        <button class="btn-small">{{ dash.t[dash.lang].allOrders }}</button>
      </div>
      <div class="dash-scroll-body">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>{{ dash.t[dash.lang].completeName }}</th>
            <th>{{ dash.t[dash.lang].email }}</th>
            <th>{{ dash.t[dash.lang].status }}</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>#12386</td><td>ชาลี เลขา</td><td>chalai@example.com</td><td><span class="badge success">✓ {{ dash.t[dash.lang].success }}</span></td></tr>
          <tr><td>#12388</td><td>ม่อ</td><td>morn@example.com</td><td><span class="badge warning">⏳ {{ dash.t[dash.lang].pending }}</span></td></tr>
          <tr><td>#12389</td><td>ดนัยชัย อุตสาห์</td><td>dunai@example.com</td><td><span class="badge warning">📦 Processing</span></td></tr>
          <tr><td>#12390</td><td>ชริ อุษณะ</td><td>chri@example.com</td><td><span class="badge success">✓ {{ dash.t[dash.lang].success }}</span></td></tr>
        </tbody>
      </table>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'DashboardHome',
  inject: ['dash'],
};
</script>
