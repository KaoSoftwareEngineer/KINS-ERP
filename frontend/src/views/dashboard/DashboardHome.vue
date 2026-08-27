<template>
<div class="dash-fit">
  <div class="header flex-wrap">
    <div>
      <h1>{{ dash.t[dash.lang].dashboard }}</h1>
      <p style="font-size: 14px; color: var(--muted); margin-top: 4px;">{{ dash.t[dash.lang].welcome }}</p>
    </div>
    <div class="header-actions">
      <button class="btn-small" @click="dash.dashExportExcel('day')">{{ dash.t[dash.lang].dailyDaily }}</button>
      <button class="btn-small" @click="dash.dashExportExcel('week')">{{ dash.t[dash.lang].weekly }}</button>
      <button class="btn-small btn-green" @click="dash.dashExportExcel('month')"><svg class="xls-ico" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#fff"/><path d="M14 2v6h6" fill="#cfe8dc"/><path d="M9.5 12.5l5 5M14.5 12.5l-5 5" stroke="#1a9c54" stroke-width="1.8" stroke-linecap="round"/></svg>ส่งออก Excel</button>
      <div class="dash-customize-wrap">
        <button class="btn-small dash-customize-btn" :class="{ 'is-open': customizeOpen }" @click="customizeOpen = !customizeOpen" title="ปรับแต่งหน้า">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          ปรับแต่งหน้า
        </button>
        <transition name="dash-fade">
          <div v-if="customizeOpen" class="dash-customize-panel">
            <div class="dash-customize-head">แสดง/ซ่อนการ์ด</div>
            <label v-for="c in cardList" :key="c.key" class="dash-customize-item">
              <input type="checkbox" :checked="cards[c.key]" @change="toggleCard(c.key)" />
              <span>{{ c.label }}</span>
            </label>
            <button class="dash-customize-reset" @click="resetCards">คืนค่าเริ่มต้น</button>
          </div>
        </transition>
      </div>
    </div>
  </div>

  <!-- แจ้งเตือน: บัญชียังไม่ได้รับสิทธิ์ (role ว่าง) -->
  <div v-if="!hasRole" class="dash-norole">
    <span class="dash-norole-icon">⚠️</span>
    <div>
      <div class="dash-norole-title">บัญชีของคุณยังไม่ได้รับสิทธิ์การใช้งาน</div>
      <div class="dash-norole-sub">กรุณาติดต่อผู้ดูแลระบบ (Admin) เพื่อกำหนดตำแหน่งและสิทธิ์การเข้าถึงเมนู — ตอนนี้เข้าได้เฉพาะหน้าแดชบอร์ดและตั้งค่า</div>
    </div>
  </div>

  <!-- My Tasks / Action Required -->
  <div v-if="cards.tasks" class="section dash-tasks">
    <div class="section-header">
      <h2>✅ งานที่ต้องทำวันนี้ <span class="dash-tasks-count" v-if="totalTasks">{{ totalTasks }}</span></h2>
      <span class="dash-tasks-sub">งานที่รอคุณจัดการ/อนุมัติ</span>
    </div>
    <div v-if="myTasks.length" class="dash-tasks-grid">
      <button v-for="t in myTasks" :key="t.key" class="dash-task-card" :class="'dash-task-' + t.tone" @click="goTask(t.page)">
        <div class="dash-task-icon">{{ t.icon }}</div>
        <div class="dash-task-body">
          <div class="dash-task-title">{{ t.title }}</div>
          <div class="dash-task-hint">{{ t.hint }}</div>
        </div>
        <div class="dash-task-count">{{ t.count }}<span>{{ t.unit }}</span></div>
        <div class="dash-task-go">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </div>
      </button>
    </div>
    <div v-else class="dash-tasks-empty">🎉 ไม่มีงานค้าง — วันนี้เคลียร์หมดแล้ว</div>
  </div>

  <!-- Top Stats Grid -->
  <div v-if="cards.stats" class="stats-grid">
    <div class="stat-card stat-card-revenue">
      <div class="stat-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      </div>
      <div class="label">{{ dash.t[dash.lang].revenue }}</div>
      <div class="value">฿{{ dash.totalRevenue }}</div>
      <div class="detail" :class="revenueTrend.cls">{{ revenueTrend.text }}</div>
    </div>
    <div class="stat-card stat-card-sales">
      <div class="stat-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
      </div>
      <div class="label">ยอดตัดจ่ายเดือนนี้</div>
      <div class="value">{{ Number(dash.monthlySales || 0).toLocaleString() }}</div>
      <div class="detail">📏 หลา (จากใบเบิกจริง)</div>
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
      <div class="label">สินค้าคงคลัง</div>
      <div class="value">{{ dash.totalSalesAmount }}</div>
      <div class="detail">📦 หลา · {{ (dash.dashStats && dash.dashStats.kpi.stockRolls) || 0 }} ม้วน</div>
    </div>
  </div>

  <!-- Charts Row -->
  <div v-if="cards.charts" class="dash-charts-row dash-flex-row">
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
            <span class="dash-trend-col-title">{{ dash.dashTrendViewMode === 'year' ? 'ยอดขายรวมรายปี' : 'ยอดขายรายวัน (7 วันล่าสุด)' }}</span>
            <div class="dash-trend-col-controls">
              <select v-if="dash.dashTrendViewMode === 'month' && !dash.dashTrendDemo" v-model.number="dash.dashTrendYear" class="dash-year-select">
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
                  <defs>
                    <!-- คลื่นหน้า (เขียวเทอร์คอยส์) — ลงสีเต็มโทนแบบภาพตัวอย่าง -->
                    <linearGradient id="dashTrendGradA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#2dd4bf" stop-opacity="0.6" />
                      <stop offset="100%" stop-color="#2dd4bf" stop-opacity="0.04" />
                    </linearGradient>
                    <!-- คลื่นหลัง (ฟ้า) -->
                    <linearGradient id="dashTrendGradB" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#4f7cf7" stop-opacity="0.62" />
                      <stop offset="100%" stop-color="#4f7cf7" stop-opacity="0.05" />
                    </linearGradient>
                  </defs>
                  <line v-for="(gl, gi) in dash.dashTrendGridLines" :key="gi" x1="52" x2="544" :y1="gl.y" :y2="gl.y" class="dash-grid-line" />
                  <!-- คลื่นหลัง (ฟ้า) วาดก่อน แล้วคลื่นหน้า (เขียว) ทับแบบโปร่งให้เห็นซ้อนกัน -->
                  <path :d="dash.dashTrendAreaPath2" class="dash-area-fill-2" />
                  <path :d="dash.dashTrendLinePath2" class="dash-line-stroke-2" vector-effect="non-scaling-stroke" />
                  <path :d="dash.dashTrendAreaPath" class="dash-area-fill" />
                  <path :d="dash.dashTrendLinePath" class="dash-line-stroke" vector-effect="non-scaling-stroke" />
                </svg>
                <!-- จุดกลม (overlay HTML → กลมเสมอ ไม่บิดตาม preserveAspectRatio ของ SVG) -->
                <div class="dash-line-dots">
                  <span v-for="(p, i) in dash.dashTrendPoints" :key="i" class="dash-dot"
                        :class="{ 'is-active': dash.dashTrendHoverIdx2 === i }"
                        :style="{ left: p.xPct + '%', top: p.yPct + '%' }"
                        @mouseenter="dash.dashTrendHoverIdx2 = i" @mouseleave="dash.dashTrendHoverIdx2 = null"></span>
                </div>
                <div class="dash-axis-y">
                  <span v-for="(gl, gi) in dash.dashTrendGridLines" :key="gi" :style="{ top: gl.yPct + '%' }">{{ gl.label }}</span>
                </div>
                <div class="dash-chart-xaxis">
                  <span v-for="(p, i) in dash.dashTrendPoints" :key="i" :style="{ left: p.xPct + '%' }"
                        :class="{ 'is-active': dash.dashTrendHoverIdx2 === i }">{{ p.label }}</span>
                </div>
                <div v-if="dash.dashTrendHoverIdx2 !== null" class="dash-chart-tooltip"
                     :style="{ left: dash.dashTrendPoints[dash.dashTrendHoverIdx2].xPct + '%' }">
                  <strong>{{ dash.dashTrendPoints[dash.dashTrendHoverIdx2].label }}{{ dash.dashTrendViewMode === 'month' && !dash.dashTrendDemo ? ' ' + dash.dashTrendYear : '' }}</strong>
                  ฿{{ dash.dashTrendPoints[dash.dashTrendHoverIdx2].value.toLocaleString() }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dash-chart-note">แนวโน้มยอดขาย (หลาที่ตัดจ่ายจริง) — {{ dash.dashTrendDemo ? 'ข้อมูลตัวอย่าง (Demo) — จะเปลี่ยนเป็นข้อมูลจริงอัตโนมัติเมื่อมียอดขายตั้งแต่ 3 เดือนขึ้นไป' : 'ข้อมูลจริงจากระบบ' }}</div>
    </div>

    <!-- Donut Chart -->
    <div class="section dash-chart-section">
      <div class="section-header">
        <h2>{{ dash.t[dash.lang].volumeTitle }}</h2>
      </div>
      <div class="dash-chart-box dash-donut-box">
        <div class="dash-gauge-row">
          <!-- เกจสัดส่วนประเภทผ้า (270°) — แต่ละช่วงลงสีตามชนิด -->
          <div class="dash-gauge">
            <svg viewBox="0 0 160 160" class="dash-gauge-svg">
              <circle cx="80" cy="80" r="62" class="dash-gauge-track" :stroke-dasharray="dash.dashGaugeArc.track" transform="rotate(135 80 80)" />
              <circle v-for="(seg, i) in dash.dashGaugeSegs" :key="i" cx="80" cy="80" r="62" fill="none"
                      :stroke="seg.color" stroke-width="14" stroke-linecap="round"
                      :stroke-dasharray="seg.dasharray" :stroke-dashoffset="seg.dashoffset"
                      transform="rotate(135 80 80)" class="dash-gauge-seg"
                      :class="{ 'is-active': dash.dashVolumeHoverIdx === i }"
                      @mouseenter="dash.dashVolumeHoverIdx = i" @mouseleave="dash.dashVolumeHoverIdx = null" />
              <text x="80" y="76" text-anchor="middle" class="dash-gauge-num">{{ dash.dashVolumeHoverIdx !== null ? dash.dashVolumeSegments[dash.dashVolumeHoverIdx].pct : dash.dashRegularPct }}%</text>
              <text x="80" y="95" text-anchor="middle" class="dash-gauge-cap">{{ dash.dashVolumeHoverIdx !== null ? dash.dashVolumeSegments[dash.dashVolumeHoverIdx].label : 'ผ้าประจำ' }}</text>
            </svg>
            <div class="dash-gauge-ends"><span>0%</span><span>100%</span></div>
          </div>
          <!-- ขวา: สัดส่วน 3 ประเภท (ลงสีตามชนิด) -->
          <div class="dash-gauge-side">
            <div class="dash-gauge-legend">
              <div v-for="(seg, i) in dash.dashVolumeSegments" :key="i" class="dash-gauge-legend-item"
                   :class="{ 'is-active': dash.dashVolumeHoverIdx === i }"
                   @mouseenter="dash.dashVolumeHoverIdx = i" @mouseleave="dash.dashVolumeHoverIdx = null">
                <span class="dash-donut-swatch" :style="{ background: seg.color }"></span>
                <span class="dash-gauge-legend-label">{{ seg.label }}</span>
                <span class="dash-gauge-legend-pct" :style="{ color: seg.color }">{{ seg.pct }}%</span>
              </div>
            </div>
          </div>
        </div>
        <div class="dash-chart-note">สัดส่วนประเภทผ้าในคลัง (ผ้าประจำ / ผ้าไม่ประจำ / ผ้าดิบ) — ข้อมูลจริงจากคลัง</div>
      </div>
    </div>
  </div>

  <!-- Cards Grid -->
  <div v-if="cards.mini" class="dash-cards-grid dash-cards-grid-compact">
    <div class="mini-stat-card mini-stat-pink">
      <div class="mini-stat-label">📋 ออร์เดอร์รอดำเนินการ</div>
      <div class="mini-stat-value">{{ orderStore.ofOrders.filter(o => o.status !== 'Prepared').length }}</div>
      <div class="mini-stat-detail">รายการ</div>
    </div>
    <div class="mini-stat-card mini-stat-purple">
      <div class="mini-stat-label">⚡ ออร์เดอร์ด่วน</div>
      <div class="mini-stat-value">{{ orderStore.ofOrders.filter(o => o.urgent).length }}</div>
      <div class="mini-stat-detail">ต้องเร่งจัดส่ง</div>
    </div>
    <div class="mini-stat-card mini-stat-blue">
      <div class="mini-stat-label">👥 สมาชิกในระบบ</div>
      <div class="mini-stat-value">{{ dash.members.length }}</div>
      <div class="mini-stat-detail">บัญชีผู้ใช้งาน</div>
    </div>
    <div class="mini-stat-card mini-stat-orange">
      <div class="mini-stat-label">🛍️ ออร์เดอร์ทั้งหมด</div>
      <div class="mini-stat-value">{{ orderStore.ofOrders.length }}</div>
      <div class="mini-stat-detail">เดือนนี้</div>
    </div>
  </div>

  <!-- Recent Activities & Order Status -->
  <div v-if="cards.activities || cards.orders" class="dash-activity-row dash-flex-row">
    <!-- Recent Activities -->
    <div v-if="cards.activities" class="section dash-list-section">
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
    <div v-if="cards.orders" class="section dash-list-section">
      <div class="section-header">
        <h2>{{ dash.t[dash.lang].orderStatus }}</h2>
        <button class="btn-small" @click="dash.currentPage = 'order-fulfill'">{{ dash.t[dash.lang].allOrders }}</button>
      </div>
      <div class="dash-scroll-body">
      <div class="overflow-x-auto">
      <table>
        <thead>
          <tr>
            <th>เลขที่ออร์เดอร์</th>
            <th>ลูกค้า</th>
            <th>พนักงานขาย</th>
            <th>จำนวน (หลา)</th>
            <th>{{ dash.t[dash.lang].status }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(o, i) in orderRows" :key="i">
            <td><strong>{{ o.order_no }}</strong></td>
            <td>{{ o.customer || '-' }}</td>
            <td>{{ o.salesperson || '-' }}</td>
            <td>{{ Number(o.withdrawn_qty || 0).toFixed(2) }} / {{ Number(o.ordered_qty || 0).toFixed(2) }}</td>
            <td><span class="badge" :class="o.status === 'Prepared' ? 'success' : 'warning'">{{ o.status === 'Prepared' ? '✓ ' : '⏳ ' }}{{ o.status }}</span></td>
          </tr>
          <tr v-if="orderRows.length === 0"><td colspan="5" style="text-align:center;color:var(--muted);padding:18px;">ยังไม่มีออร์เดอร์</td></tr>
        </tbody>
      </table>
      </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { useOrderStore } from '../../stores/order.js';

export default {
  name: 'DashboardHome',
  inject: ['dash'],
  setup() {
    return { orderStore: useOrderStore() };
  },
  data() {
    return {
      customizeOpen: false,
      cardList: [
        { key: 'tasks', label: 'งานที่ต้องทำวันนี้' },
        { key: 'stats', label: 'สถิติภาพรวม (การ์ดบน)' },
        { key: 'charts', label: 'กราฟแนวโน้ม + สัดส่วน' },
        { key: 'mini', label: 'การ์ดสรุปย่อ' },
        { key: 'activities', label: 'กิจกรรมล่าสุด' },
        { key: 'orders', label: 'สถานะออร์เดอร์' },
      ],
      cards: this.loadCardPrefs(),
    };
  },
  computed: {
    // เทียบรายได้เดือนนี้กับเดือนก่อน (คำนวณจริง ไม่ใช่ค่าตายตัว)
    revenueTrend() {
      const k = (this.dash.dashStats && this.dash.dashStats.kpi) || null;
      if (!k) return { text: '—', cls: '' };
      const now = Number(k.invoiceAmount) || 0;
      const prev = Number(k.invoiceAmountPrev) || 0;
      if (prev === 0 && now === 0) return { text: 'ยังไม่มีรายได้เดือนนี้', cls: '' };
      if (prev === 0) return { text: 'เดือนก่อนไม่มียอด — เทียบไม่ได้', cls: '' };
      const pct = ((now - prev) / prev) * 100;
      const up = pct >= 0;
      return {
        text: `${up ? '▲ เพิ่มขึ้น' : '▼ ลดลง'} ${Math.abs(pct).toFixed(1)}% จากเดือนก่อน`,
        cls: up ? 'trend-up' : 'trend-down',
      };
    },
    // มียอดตัดจ่ายจริงในกราฟหรือยัง
    hasRealSales() {
      const t = this.dash.dashStats && this.dash.dashStats.trend;
      if (!t) return false;
      return (t.current || []).some(v => Number(v) > 0) || (t.previous || []).some(v => Number(v) > 0);
    },
    // ออร์เดอร์ล่าสุดจริงจาก DB (fallback: จากรายการออร์เดอร์ที่โหลดไว้)
    orderRows() {
      const s = this.dash.dashStats;
      if (s && s.recentOrders && s.recentOrders.length) return s.recentOrders;
      return (this.orderStore.ofOrders || []).slice(0, 6).map(o => ({
        order_no: o.orderNo, customer: o.customer, salesperson: o.salesperson,
        ordered_qty: o.orderedQty, withdrawn_qty: o.withdrawnQty, status: o.status,
      }));
    },
    // งานที่รอจัดการ — ประกอบจากสถานะออร์เดอร์จริง
    myTasks() {
      const o = this.orderStore.ofOrders || [];
      const tasks = [];
      const waiting = o.filter(x => x.status !== 'Prepared');
      if (waiting.length) tasks.push({ key: 'prep', icon: '📋', title: 'ออร์เดอร์รอจัดเตรียม', hint: 'กดเพื่อไปจัดเตรียมสินค้า', count: waiting.length, unit: ' รายการ', page: 'order-fulfill', tone: 'blue' });
      const urgent = o.filter(x => x.urgent && x.status !== 'Prepared');
      if (urgent.length) tasks.push({ key: 'urgent', icon: '⚡', title: 'ออร์เดอร์ด่วน', hint: 'ต้องเร่งจัดส่ง', count: urgent.length, unit: ' รายการ', page: 'order-fulfill', tone: 'red' });
      const toInvoice = o.filter(x => x.status === 'Prepared' && !x.invoiced);
      if (toInvoice.length) tasks.push({ key: 'invoice', icon: '🧾', title: 'รอออกใบกำกับภาษี', hint: 'จัดเตรียมเสร็จ รอวางบิล', count: toInvoice.length, unit: ' รายการ', page: 'vat-invoice', tone: 'purple' });
      const toVat = o.filter(x => x.invoiced && !x.vatDone);
      if (toVat.length) tasks.push({ key: 'vat', icon: '📊', title: 'รอตัดสต็อก VAT', hint: 'วางบิลแล้ว รอตัดสต็อก', count: toVat.length, unit: ' รายการ', page: 'vat-stock-cut', tone: 'orange' });
      return tasks;
    },
    totalTasks() { return this.myTasks.reduce((s, t) => s + t.count, 0); },
    hasRole() { const u = this.dash.currentUser; return !!(u && (u.role || '').trim()); },
  },
  methods: {
    loadCardPrefs() {
      // ค่าเริ่มต้น: My Tasks ซ่อน (หน้าเดิม) — คนที่อยากได้ค่อยเปิดผ่าน "ปรับแต่งหน้า"
      const def = { tasks: false, stats: true, charts: true, mini: true, activities: true, orders: true };
      try { const s = JSON.parse(localStorage.getItem('dashCardPrefs')); return s ? { ...def, ...s } : def; } catch (e) { return def; }
    },
    saveCardPrefs() { try { localStorage.setItem('dashCardPrefs', JSON.stringify(this.cards)); } catch (e) {} },
    toggleCard(k) { this.cards[k] = !this.cards[k]; this.saveCardPrefs(); },
    resetCards() { this.cards = { tasks: false, stats: true, charts: true, mini: true, activities: true, orders: true }; this.saveCardPrefs(); this.customizeOpen = false; },
    goTask(page) { if (page && this.dash.canAccess(page)) this.dash.currentPage = page; else if (page) this.dash.fbFail && this.dash.fbFail('คุณไม่มีสิทธิ์เข้าหน้านี้'); },
  },
};
</script>

<style scoped>
/* ปุ่มปรับแต่งหน้า + panel แสดง/ซ่อนการ์ด */
.dash-customize-wrap { position: relative; }
.dash-customize-btn { display: inline-flex; align-items: center; gap: 6px; }
.dash-customize-btn svg { width: 15px; height: 15px; }
.dash-customize-btn.is-open { border-color: var(--brand); color: var(--brand); }
.dash-customize-panel { position: absolute; top: calc(100% + 6px); right: 0; z-index: 50; min-width: 220px; background: var(--surface); border: 1px solid var(--field-border); border-radius: 12px; box-shadow: 0 8px 28px rgba(0,0,0,.12); padding: 10px; }
.dash-customize-head { font-size: 12px; font-weight: 700; color: var(--muted); padding: 4px 8px 8px; }
.dash-customize-item { display: flex; align-items: center; gap: 9px; padding: 7px 8px; border-radius: 8px; font-size: 12px; cursor: pointer; color: var(--text); }
.dash-customize-item:hover { background: var(--field); }
.dash-customize-item input { width: 15px; height: 15px; accent-color: var(--brand); cursor: pointer; }
.dash-customize-reset { width: 100%; margin-top: 6px; padding: 7px; border: 1px solid var(--field-border); border-radius: 8px; background: var(--field); color: var(--muted); font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; }
.dash-customize-reset:hover { color: var(--text); border-color: var(--muted); }
.dash-fade-enter-active, .dash-fade-leave-active { transition: opacity .15s, transform .15s; }
.dash-fade-enter-from, .dash-fade-leave-to { opacity: 0; transform: translateY(-4px); }

/* แจ้งเตือนบัญชีไม่มีสิทธิ์ */
.dash-norole { display: flex; align-items: flex-start; gap: 12px; background: #fff8e6; border: 1px solid #f0c000; border-left: 4px solid #f0a000; border-radius: 12px; padding: 9px 13px; margin-bottom: 18px; }
.dash-norole-icon { font-size: 14px; line-height: 1.2; }
.dash-norole-title { font-weight: 700; font-size: 12px; color: #8a6d00; }
.dash-norole-sub { font-size: 12.5px; color: #9a7b1a; margin-top: 3px; line-height: 1.55; }

/* My Tasks / Action Required */
.dash-tasks { margin-bottom: 18px; }
.dash-tasks .section-header { align-items: baseline; }
.dash-tasks-count { display: inline-flex; align-items: center; justify-content: center; min-width: 18px; height: 18px; padding: 0 6px; margin-left: 6px; background: #e03131; color: #fff; border-radius: 9px; font-size: 10.5px; font-weight: 700; vertical-align: middle; }
.dash-tasks-sub { font-size: 11px; color: var(--muted); }
.dash-tasks .section-header h2 { font-size: 12px; }
.dash-tasks-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 10px; }
.dash-task-card { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border: 1px solid var(--field-border); border-left-width: 3px; border-radius: 10px; background: var(--surface); cursor: pointer; text-align: left; font-family: inherit; transition: box-shadow .15s, transform .15s, border-color .15s; }
.dash-task-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.09); transform: translateY(-2px); }
.dash-task-icon { font-size: 12.5px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 8px; flex-shrink: 0; }
.dash-task-body { flex: 1; min-width: 0; }
.dash-task-title { font-size: 12px; font-weight: 700; color: var(--text); }
.dash-task-hint { font-size: 10.5px; color: var(--muted); margin-top: 1px; }
.dash-task-count { font-size: 12.5px; font-weight: 800; color: var(--text); white-space: nowrap; }
.dash-task-count span { font-size: 10px; font-weight: 600; color: var(--muted); margin-left: 2px; }
.dash-task-go { color: var(--muted); flex-shrink: 0; }
.dash-task-go svg { width: 14px; height: 14px; }
.dash-task-card:hover .dash-task-go { color: var(--brand); }
.dash-task-blue { border-left-color: #2f65f6; } .dash-task-blue .dash-task-icon { background: #e9f0fe; }
.dash-task-red { border-left-color: #e03131; } .dash-task-red .dash-task-icon { background: #fdeaea; }
.dash-task-purple { border-left-color: #7c4dff; } .dash-task-purple .dash-task-icon { background: #f0eafe; }
.dash-task-orange { border-left-color: #f08c00; } .dash-task-orange .dash-task-icon { background: #fff2e0; }
.dash-tasks-empty { padding: 22px; text-align: center; color: var(--muted); font-size: 12px; background: var(--field); border-radius: 12px; }

/* ปุ่มในหัวการ์ด (เช่น "คำสั่งซื้อทั้งหมด", "ตัวกรอง") — ย่อให้เล็กเข้าชุดกับตาราง */
.dash-list-section .section-header .btn-small,
.dash-activity-row .section-header .btn-small,
.dash-chart-section .section-header .btn-small {
  padding: 4px 12px;
  font-size: 11.5px;
  border-radius: 7px;
  line-height: 1.6;
}

/* ตาราง "สถานะคำสั่งซื้อ" — ย่อขนาดตัวหนังสือ/ช่อง ให้เท่าตารางผ้าประจำ (หัว 11px / เนื้อ 12px) */
.dash-list-section table { width: 100%; border-collapse: collapse; }
.dash-list-section thead th {
  font-size: 11px; font-weight: 600; color: var(--muted);
  padding: 7px 12px; text-align: left; white-space: nowrap;
  text-transform: uppercase; letter-spacing: .3px;
  border-bottom: 1px solid var(--field-border);
}
.dash-list-section tbody td {
  font-size: 12px; color: var(--text);
  padding: 5px 12px; border-bottom: 1px solid var(--field-border); white-space: nowrap;
}
.dash-list-section tbody tr:last-child td { border-bottom: none; }
.trend-up { color: var(--ok); font-weight: 600; }
.trend-down { color: var(--danger); font-weight: 600; }
</style>
