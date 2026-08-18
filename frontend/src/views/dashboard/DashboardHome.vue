<template>
<div class="dash-fit">
  <div class="header flex-wrap">
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
    <div class="stat-card stat-card-revenue">
      <div class="stat-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      </div>
      <div class="label">{{ dash.t[dash.lang].revenue }}</div>
      <div class="value">฿{{ dash.totalRevenue }}</div>
      <div class="detail">{{ dash.t[dash.lang].increasedBy }}</div>
    </div>
    <div class="stat-card stat-card-sales">
      <div class="stat-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
      </div>
      <div class="label">{{ dash.t[dash.lang].sales }}</div>
      <div class="value">{{ dash.monthlySales }}</div>
      <div class="detail">{{ dash.t[dash.lang].rank }}</div>
    </div>
    <div class="stat-card stat-card-orders">
      <div class="stat-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8v8a2 2 0 0 1-1 1.73l-6 3.46a2 2 0 0 1-2 0l-6-3.46A2 2 0 0 1 5 16V8"/><path d="m3.27 6.96 8.73 5.05 8.73-5.05"/><line x1="12" y1="22" x2="12" y2="12"/><path d="M8.5 4.27 16 8.5" /></svg>
      </div>
      <div class="label">{{ dash.t[dash.lang].orders }}</div>
      <div class="value">{{ dash.totalOrders }}</div>
      <div class="detail">📦 {{ dash.t[dash.lang].processing }}</div>
    </div>
    <div class="stat-card stat-card-total">
      <div class="stat-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
      </div>
      <div class="label">{{ dash.t[dash.lang].totalSales }}</div>
      <div class="value">฿{{ dash.totalSalesAmount }}</div>
      <div class="detail">💰 {{ dash.t[dash.lang].bestSelling }}</div>
    </div>
  </div>

  <!-- Charts Row -->
  <div class="dash-charts-row dash-flex-row">
    <!-- แนวโน้มยอดขาย: แท่ง (ซ้าย) + เส้น (ขวา) แบ่งเลเยอร์เทียบกัน -->
    <div class="section dash-chart-section">
      <div class="section-header">
        <h2>{{ dash.t[dash.lang].trendTitle }}</h2>
      </div>
      <div class="dash-trend-split">
        <!-- ฝั่งซ้าย: กราฟแท่ง เทียบปีต่อปี -->
        <div class="dash-trend-col">
          <div class="dash-trend-col-header">
            <span class="dash-trend-col-title">เทียบปีต่อปี</span>
            <div class="dash-trend-col-controls">
              <button class="btn-small" :class="{ 'btn-primary': dash.dashTrendRange === 'currentYear' }" @click="dash.dashTrendRange = 'currentYear'">ปีปัจจุบัน</button>
              <button class="btn-small" :class="{ 'btn-primary': dash.dashTrendRange === '1y' }" @click="dash.dashTrendRange = '1y'">1 ปี</button>
              <button class="btn-small" :class="{ 'btn-primary': dash.dashTrendRange === '6m' }" @click="dash.dashTrendRange = '6m'">6 เดือน</button>
              <button class="btn-small" :class="{ 'btn-primary': dash.dashTrendRange === '3m' }" @click="dash.dashTrendRange = '3m'">3 เดือน</button>
            </div>
          </div>
          <div class="dash-chart-box dash-barchart-box">
            <div class="dash-barchart">
              <div class="dash-bar-axis-y">
                <span v-for="t in [...dash.dashTrendBarScale.ticks].reverse()" :key="t">{{ t >= 1000 ? Math.round(t / 1000) + 'k' : t }}</span>
              </div>
              <div class="dash-barchart-plot">
                <div class="dash-bar-group" v-for="(b, i) in dash.dashTrendBars" :key="i"
                     @mouseenter="dash.dashTrendHoverIdx = i" @mouseleave="dash.dashTrendHoverIdx = null">
                  <div class="dash-bar-pair">
                    <div v-if="dash.dashTrendHoverIdx === i" class="dash-chart-tooltip dash-bar-tooltip">
                      <strong>{{ b.label }} {{ b.year }}</strong> ฿{{ b.current.toLocaleString() }}
                      <template v-if="b.previous != null"><br>{{ b.label }} {{ b.prevYear }}: ฿{{ b.previous.toLocaleString() }}</template>
                    </div>
                    <div class="dash-bar dash-bar-prev" v-if="b.previous != null" :style="{ height: (b.previous / dash.dashTrendBarScale.max * 100) + '%' }"></div>
                    <div class="dash-bar dash-bar-curr" :style="{ height: (b.current / dash.dashTrendBarScale.max * 100) + '%' }"></div>
                  </div>
                  <span class="dash-bar-label" :class="{ 'is-active': dash.dashTrendHoverIdx === i }">{{ b.label }}</span>
                </div>
              </div>
            </div>
            <div class="dash-bar-legend">
              <span class="dash-legend-item"><i class="dash-legend-dot dash-legend-curr"></i> ปัจจุบัน</span>
              <span class="dash-legend-item"><i class="dash-legend-dot dash-legend-prev"></i> ปีก่อนหน้า</span>
            </div>
          </div>
        </div>

        <!-- ฝั่งขวา: กราฟเส้น รายเดือน/รายปี (แบบเดิม) -->
        <div class="dash-trend-col dash-trend-col-right">
          <div class="dash-trend-col-header">
            <span class="dash-trend-col-title">{{ dash.dashTrendViewMode === 'year' ? 'ยอดขายรวมรายปี' : 'รายเดือน ปี ' + dash.dashTrendYear }}</span>
            <div class="dash-trend-col-controls">
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
                          class="dash-line-dot" :class="{ 'is-active': dash.dashTrendHoverIdx2 === i }"
                          @mouseenter="dash.dashTrendHoverIdx2 = i" @mouseleave="dash.dashTrendHoverIdx2 = null" />
                </svg>
                <div class="dash-axis-y">
                  <span v-for="(gl, gi) in dash.dashTrendGridLines" :key="gi" :style="{ top: gl.yPct + '%' }">{{ gl.label }}</span>
                </div>
                <div class="dash-chart-xaxis">
                  <span v-for="(p, i) in dash.dashTrendPoints" :key="i" :style="{ left: p.xPct + '%' }"
                        :class="{ 'is-active': dash.dashTrendHoverIdx2 === i }">{{ p.label }}</span>
                </div>
                <div v-if="dash.dashTrendHoverIdx2 !== null" class="dash-chart-tooltip"
                     :style="{ left: dash.dashTrendPoints[dash.dashTrendHoverIdx2].xPct + '%' }">
                  <strong>{{ dash.dashTrendPoints[dash.dashTrendHoverIdx2].label }}{{ dash.dashTrendViewMode === 'month' ? ' ' + dash.dashTrendYear : '' }}</strong>
                  ฿{{ dash.dashTrendPoints[dash.dashTrendHoverIdx2].value.toLocaleString() }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dash-chart-note">แนวโน้มยอดขาย — ข้อมูลตัวอย่าง ยังไม่ได้เชื่อมข้อมูลจริง</div>
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
    <div class="mini-stat-card mini-stat-pink">
      <div class="mini-stat-label">📋 ออร์เดอร์รอดำเนินการ</div>
      <div class="mini-stat-value">{{ dash.ofOrders.filter(o => o.status !== 'Prepared').length }}</div>
      <div class="mini-stat-detail">รายการ</div>
    </div>
    <div class="mini-stat-card mini-stat-purple">
      <div class="mini-stat-label">⚡ ออร์เดอร์ด่วน</div>
      <div class="mini-stat-value">{{ dash.ofOrders.filter(o => o.urgent).length }}</div>
      <div class="mini-stat-detail">ต้องเร่งจัดส่ง</div>
    </div>
    <div class="mini-stat-card mini-stat-blue">
      <div class="mini-stat-label">👥 สมาชิกในระบบ</div>
      <div class="mini-stat-value">{{ dash.members.length }}</div>
      <div class="mini-stat-detail">บัญชีผู้ใช้งาน</div>
    </div>
    <div class="mini-stat-card mini-stat-orange">
      <div class="mini-stat-label">🛍️ ออร์เดอร์ทั้งหมด</div>
      <div class="mini-stat-value">{{ dash.ofOrders.length }}</div>
      <div class="mini-stat-detail">เดือนนี้</div>
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
      <div class="overflow-x-auto">
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
</div>
</template>

<script>
export default {
  name: 'DashboardHome',
  inject: ['dash'],
};
</script>
