<template>
<div class="rp-page">
  <div class="rp-titlebar">
    <span>📆 {{ dash.t[dash.lang].annualSummaryTitle }}</span>
    <button class="rp-export-excel" @click="exportExcel">
      <span class="rp-xls-badge"><svg class="xls-ico" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#217346"/><path d="M14 2v6h6" fill="#185c37"/><path d="M9.5 12.5l5 5M14.5 12.5l-5 5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg></span>{{ dash.t[dash.lang].exportExcelPlain }}
    </button>
  </div>
  <div class="rp-filter">
    <div class="rp-f" style="max-width:160px"><label>{{ dash.t[dash.lang].yearLabel }}</label>
      <select v-model="year" @change="build"><option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option></select>
    </div>
    <div class="rp-f-actions"><button class="rp-btn-search" @click="build">🔍 {{ dash.t[dash.lang].searchWord }}</button></div>
  </div>

  <div class="rp-table-wrap">
    <table class="rp-table py-table">
      <thead>
        <tr><th style="min-width:130px;text-align:left">{{ dash.t[dash.lang].itemColLabel }}</th><th v-for="(m, mi) in months" :key="mi" class="rp-r">{{ m }}</th><th class="rp-r">{{ dash.t[dash.lang].totalWord }}</th></tr>
      </thead>
      <tbody>
        <tr v-for="row in matrix" :key="row.key" :class="{ 'py-sum': row.bold }">
          <td class="py-label" :class="{ 'py-gap': row.gap }">{{ row.label }}</td>
          <td v-for="(v, i) in row.vals" :key="i" class="rp-r" :class="cellClass(row.tone, v)">{{ cell(v) }}</td>
          <td class="rp-r rp-bold" :class="cellClass(row.tone, row.total)">{{ cell(row.total) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script>
export default {
  name: 'AnnualSummaryPage',
  inject: ['dash'],
  data() {
    return {
      year: new Date().getFullYear(),
      d: {},
    };
  },
  computed: {
    months() { return this.dash.t[this.dash.lang].monthNamesFull; },
    yearOptions() { const y = new Date().getFullYear(); return [y + 1, y, y - 1, y - 2]; },
    matrix() {
      const t = this.dash.t[this.dash.lang];
      const g = (k) => this.d[k] || Array(12).fill(0);
      const add = (...ks) => { const r = Array(12).fill(0); ks.forEach(k => g(k).forEach((v, i) => r[i] += v)); return r; };
      const sub = (a, b) => a.map((v, i) => v - b[i]);
      const buyTotal = add('buyFinished', 'buyRaw', 'buyDye');
      const saleTotal = add('saleWs', 'saleRt');
      const profit = sub(saleTotal, g('cost'));
      const crDiff = sub(g('crPartner'), g('crCust'));
      const payDiff = sub(g('payReceive'), g('payOut'));
      const S = (a) => a.reduce((s, v) => s + v, 0);
      const R = (key, label, vals, tone, opt = {}) => ({ key: key + Math.random(), label, vals, total: S(vals), tone, ...opt });
      return [
        R('buyFinished', t.buyFinishedLabel, g('buyFinished'), 'red'),
        R('buyRaw', t.buyRawLabel, g('buyRaw'), 'red'),
        R('buyDye', t.buyDyeLabel, g('buyDye'), 'red'),
        R('buyTotal', t.totalBuyLabel, buyTotal, 'red', { bold: true }),
        R('saleWs', t.wholesaleWord, g('saleWs'), 'blue', { gap: true }),
        R('saleRt', t.retailSaleWord, g('saleRt'), 'blue'),
        R('saleTotal', t.totalSaleLabel, saleTotal, 'blue', { bold: true }),
        R('cost', t.goodsCostLabel, g('cost'), 'red'),
        R('profit', t.profitLossLabel, profit, 'profit', { bold: true }),
        R('crPartner', t.crPartnerLabel, g('crPartner'), 'blue', { gap: true }),
        R('crCust', t.crCustLabel, g('crCust'), 'red'),
        R('crDiff', t.crDiffLabel, crDiff, 'profit', { bold: true }),
        R('payReceive', t.payReceiveLabel, g('payReceive'), 'blue', { gap: true }),
        R('payOut', t.payOutLabel, g('payOut'), 'red'),
        R('payDiff', t.crDiffLabel, payDiff, 'profit', { bold: true }),
      ];
    },
  },
  mounted() { this.build(); },
  methods: {
    monthOf(dateStr) {
      if (!dateStr) return -1; const s = String(dateStr);
      let m = s.match(/^(\d{4})-(\d{2})/); if (m) return Number(m[1]) === Number(this.year) ? Number(m[2]) - 1 : -1;
      m = s.match(/(\d{2})\/(\d{2})\/(\d{4})/); if (m) return Number(m[3]) === Number(this.year) ? Number(m[2]) - 1 : -1;
      return -1;
    },
    items(r) { try { return JSON.parse(r.items_json || '[]'); } catch (e) { return []; } },
    async build() {
      const H = { headers: { Authorization: 'Bearer ' + this.dash.token } };
      const z = () => Array(12).fill(0);
      const d = { buyFinished: z(), buyRaw: z(), buyDye: z(), saleWs: z(), saleRt: z(), cost: z(), crCust: z(), crPartner: z(), payReceive: z(), payOut: z() };
      try {
        const [rp, rd, ri, rc, rpay] = await Promise.all([
          fetch('/api/purchase-orders', H), fetch('/api/dye-orders', H), fetch('/api/sale-invoices', H), fetch('/api/credit-notes', H), fetch('/api/payments', H),
        ]);
        if (rp.status === 401) { this.dash.sessionExpired && this.dash.sessionExpired(); return; }
        const dp = await rp.json(), dd = await rd.json(), di = await ri.json(), dc = await rc.json(), dpay = await rpay.json();
        const poAmt = (o) => Number(o.net_total) || this.items(o).reduce((s, it) => s + (Number(it.amount) || (Number(it.qty) * Number(it.unit_price)) || 0), 0);
        (dp.orders || []).forEach(o => { const m = this.monthOf(o.po_date); if (m < 0) return; (o.po_type === 'raw' ? d.buyRaw : d.buyFinished)[m] += poAmt(o); });
        (dd.dye_orders || dd.orders || []).forEach(o => { const m = this.monthOf(o.dye_date); if (m < 0) return; d.buyDye[m] += Number(o.net_total) || this.items(o).reduce((s, it) => s + (Number(it.total) || 0), 0); });
        (di.invoices || []).forEach(v => { const m = this.monthOf(v.inv_date); if (m < 0) return; const price = this.items(v).reduce((s, it) => s + (Number(it.amount) || 0), 0) || Number(v.total_amount) || 0; (/^p/i.test(v.inv_no) ? d.saleRt : d.saleWs)[m] += price; d.cost[m] += Number(v.total_cost) || 0; });
        (dc.notes || []).forEach(n => { const m = this.monthOf(n.doc_date); if (m < 0) return; (n.doc_type === 'partner' ? d.crPartner : d.crCust)[m] += Number(n.net_total) || 0; });
        (dpay.payments || []).forEach(p => { const m = this.monthOf(p.doc_date); if (m < 0) return; const amt = Number(p.total_amount) || this.items(p).reduce((s, it) => s + (Number(it.amount) || 0), 0); (p.doc_type === 'pay' ? d.payOut : d.payReceive)[m] += amt; });
      } catch (e) {}
      this.d = d;
    },
    cell(v) { return v ? (Number(v)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'; },
    cellClass(tone, v) { if (!v) return 'rp-muted'; if (tone === 'blue') return 'py-blue'; if (tone === 'red') return 'py-red'; if (tone === 'profit') return v < 0 ? 'py-red' : 'py-green'; return ''; },
    exportExcel() {
      const lines = [['รายการ', ...this.months, 'รวม'].join('\t')];
      this.matrix.forEach(r => lines.push([r.label, ...r.vals.map(v => v || 0), r.total].join('\t')));
      const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'รายงานสรุปประจำปี-' + this.year + '.csv'; a.click();
    },
  },
};
</script>

<style scoped>
.rp-page { font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif; color: var(--text); font-size: 12px; }
.rp-titlebar { display: flex; align-items: center; justify-content: space-between; font-weight: 700; font-size: 14px; margin-bottom: 12px; }
.rp-export-excel { display: inline-flex; align-items: center; gap: 7px; padding: 7px 15px; border: 1px solid #1a9c54; background: #1a9c54; color: #fff; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 12px; }
.rp-export-excel:hover { background: #158045; }
.rp-xls-badge { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; background: #fff; border-radius: 5px; }
.rp-export-excel .xls-ico { width: 14px; height: 14px; }
.rp-filter { display: flex; flex-wrap: wrap; gap: 10px 16px; align-items: flex-end; background: var(--surface); border: 1px solid var(--field-border); border-radius: 12px; padding: 9px 12px; margin-bottom: 12px; }
.rp-f { display: flex; flex-direction: column; gap: 4px; min-width: 120px; }
.rp-f > label { font-size: 11.5px; color: var(--muted); font-weight: 600; }
.rp-f select { height: 34px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12px; font-family: inherit; background: var(--field); color: var(--text); }
.rp-f-actions { display: flex; gap: 8px; align-items: flex-end; }
.rp-btn-search { padding: 8px 16px; border: 1px solid #1e3a8a; background: #1e3a8a; color: #fff; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; }
.rp-btn-search:hover { background: #172b6b; }
.rp-table-wrap { overflow-x: auto; border: 1px solid var(--table-line); border-radius: 10px; margin-bottom: 16px; background: var(--surface); }
.rp-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.py-table { min-width: 1250px; }
.rp-table thead th { background: #3c4453; color: #fff; font-size: 11px; font-weight: 600; padding: 7px 10px; text-align: right; white-space: nowrap; border-right: 1px solid rgba(255,255,255,.18); }
.rp-table thead th:first-child { text-align: left; }
.rp-table tbody td { padding: 6px 10px; border-bottom: 1px solid var(--table-line); border-right: 1px solid var(--table-line); white-space: nowrap; }
.rp-table tbody tr:nth-child(even) { background: var(--field); }
.rp-table tbody tr.py-sum { background: #eef1f6; font-weight: 700; }
.py-label { font-weight: 600; text-align: left; } .py-gap { border-top: 2px solid var(--table-line); }
.rp-r { text-align: right; } .rp-bold { font-weight: 700; } .rp-muted { color: var(--muted); }
.py-blue { color: #1e4fd6; } .py-red { color: #c0392b; } .py-green { color: #158045; font-weight: 600; }
</style>
