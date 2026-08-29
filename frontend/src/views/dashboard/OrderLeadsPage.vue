<template>
<div class="ol-page">
  <div class="ol-titlebar">
    <span>📥 รับออเดอร์เข้า (รวมทุกช่องทาง)</span>
    <span class="ol-hint">บันทึกทันทีที่ลูกค้าทักมา — กันออเดอร์ตกหล่น/หาย</span>
  </div>

  <!-- ฟอร์มบันทึกออเดอร์เข้าอย่างเร็ว -->
  <div class="ol-form">
    <div class="ol-frow">
      <ChannelSelect v-model="form.channel" :channels="channels" class="ol-channel" />
      <input v-model="form.customerName" placeholder="ชื่อลูกค้า *" class="ol-cust" />
      <input v-model="form.contact" placeholder="เบอร์/ไอดีติดต่อ" class="ol-contact" />
      <label class="ol-urgent"><input type="checkbox" v-model="form.urgent" /> ด่วน</label>
    </div>
    <div class="ol-frow">
      <textarea v-model="form.message" placeholder="รายละเอียดที่ลูกค้าสั่ง / ข้อความที่ทักมา" class="ol-msg"></textarea>
      <button class="ol-btn ol-btn-add" @click="addLead" :disabled="saving">➕ บันทึกออเดอร์เข้า</button>
    </div>
  </div>

  <!-- แท็บสถานะ -->
  <div class="ol-tabs">
    <button v-for="tb in tabs" :key="tb.key" class="ol-tab" :class="{ active: filterStatus === tb.key }" @click="filterStatus = tb.key">
      {{ tb.label }} <span class="ol-tab-count">{{ countOf(tb.key) }}</span>
    </button>
  </div>

  <!-- รายการออเดอร์เข้า -->
  <div class="ol-list">
    <table class="ol-table">
      <thead>
        <tr>
          <th style="width:120px;">เวลา</th>
          <th style="width:110px;">ช่องทาง</th>
          <th style="min-width:150px;text-align:left;">ลูกค้า / ติดต่อ</th>
          <th style="min-width:200px;text-align:left;">ข้อความ</th>
          <th style="width:130px;">ผู้รับผิดชอบ</th>
          <th style="width:110px;">สถานะ</th>
          <th style="width:220px;"></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="lead in filteredLeads" :key="lead.id">
          <!-- โหมดปกติ -->
          <tr v-if="editId !== lead.id" :class="{ 'ol-stale': isStale(lead) }">
            <td class="ol-c">{{ timeAgo(lead.created_at) }}</td>
            <td class="ol-c"><span class="ol-badge"><ChannelIcon :channel="lead.channel" /> {{ channelLabel(lead.channel) }}</span></td>
            <td>
              <div class="ol-cust-name">{{ lead.customer_name }} <span v-if="lead.urgent" class="ol-urgent-tag">ด่วน</span></div>
              <div class="ol-cust-contact">{{ lead.contact }}</div>
            </td>
            <td class="ol-msg-cell">{{ lead.message }}</td>
            <td>
              <input class="ol-assign" :value="lead.assigned_to" @change="updateLead(lead, { assignedTo: $event.target.value })" placeholder="มอบหมาย..." />
            </td>
            <td class="ol-c"><span class="ol-status" :class="'ol-st-' + lead.status">{{ statusLabel(lead.status) }}</span></td>
            <td class="ol-actions">
              <button v-if="lead.status === 'new'" class="ol-ic ol-ok" title="รับทราบแล้ว" @click="updateLead(lead, { status: 'confirmed' })">✔ ยืนยัน</button>
              <button v-if="lead.status !== 'converted' && lead.status !== 'lost'" class="ol-ic ol-edit" title="แก้ไข (ลูกค้าจดผิด/สั่งผิด)" @click="startEdit(lead)">✏️ แก้ไข</button>
              <button v-if="lead.status !== 'converted' && lead.status !== 'lost'" class="ol-ic ol-go" title="แปลงเป็นออร์เดอร์จริง" @click="convertToOrder(lead)">📝 สร้างออร์เดอร์</button>
              <button v-if="lead.status !== 'lost'" class="ol-ic ol-chat" title="ตอบกลับลูกค้า" @click="toggleChat(lead)">💬 ตอบกลับ<span v-if="replyCount(lead)" class="ol-chat-n">{{ replyCount(lead) }}</span></button>
              <button v-if="lead.status !== 'lost'" class="ol-ic ol-bill" title="สร้างบิล/ลิงก์ชำระเงิน" @click="openBill(lead)">💳 บิล</button>
              <button v-if="lead.status !== 'converted' && lead.status !== 'lost'" class="ol-ic ol-no" title="ตกลูกค้าเลิกสั่ง/ยกเลิก" @click="updateLead(lead, { status: 'lost' })">✕ ยกเลิก</button>
              <span v-if="lead.status === 'converted'" class="ol-order-ref">→ {{ lead.order_no }}</span>
              <span v-if="lead.pay_status && lead.pay_status !== 'none'" class="ol-pay" :class="'ol-pay-' + lead.pay_status">{{ payLabel(lead.pay_status) }}</span>
              <span v-if="payCheckMsg(lead)" class="ol-pay-note" :class="{ 'ol-pay-note-bad': payCheckBad(lead) }" :title="payCheckMsg(lead)">🔎 {{ payCheckMsg(lead) }}</span>
              <button v-if="lead.slip_url" class="ol-ic ol-slipview" title="ดูสลิป" @click="viewSlip(lead)">🧾 สลิป</button>
              <button v-if="lead.pay_status === 'slip_uploaded'" class="ol-ic ol-ok" title="ยืนยันว่าได้รับเงินแล้ว" @click="confirmPayment(lead)">✅ ยืนยันชำระ</button>
            </td>
          </tr>
          <!-- แผงตอบกลับ/ประวัติแชท (จบในหน้านี้) -->
          <tr v-if="chatId === lead.id" class="ol-chat-row">
            <td colspan="7">
              <div class="ol-chat-panel">
                <div class="ol-chat-log">
                  <div v-for="(m, i) in parseLog(lead)" :key="i" class="ol-chat-msg" :class="m.dir === 'out' ? 'ol-out' : 'ol-in'">
                    <span class="ol-chat-who">{{ m.dir === 'out' ? 'เรา' : 'ลูกค้า' }}</span>
                    <span class="ol-chat-text">{{ m.text }}</span>
                    <span v-if="m.dir === 'out' && m.sent === false" class="ol-chat-unsent">(บันทึกภายใน ยังไม่ส่ง)</span>
                  </div>
                  <div v-if="parseLog(lead).length === 0" class="ol-chat-empty">ยังไม่มีประวัติแชท</div>
                </div>
                <div v-if="lead.channel === 'line' && !lineConfigured" class="ol-chat-warn">⚠ ยังไม่ได้ตั้งค่า LINE ใน .env — ข้อความจะถูกบันทึกไว้ก่อน จะส่งจริงเมื่อเชื่อม LINE แล้ว</div>
                <div v-else-if="lead.channel !== 'line'" class="ol-chat-warn">ℹ ช่องทาง {{ channelLabel(lead.channel) }} ยังส่งอัตโนมัติไม่ได้ — บันทึกเป็นบันทึกภายใน (ไปตอบในแอปเดิม)</div>
                <div class="ol-chat-input">
                  <textarea v-model="chatText" placeholder="พิมพ์ข้อความตอบกลับลูกค้า..." @keydown.enter.exact.prevent="sendReply(lead)"></textarea>
                  <button class="ol-ic ol-ok ol-chat-send" @click="sendReply(lead)" :disabled="chatSending">➤ ส่ง</button>
                </div>
              </div>
            </td>
          </tr>
          <!-- โหมดแก้ไข (จบในหน้านี้ ไม่ต้องยกเลิกแล้วพิมพ์ใหม่) -->
          <tr v-else class="ol-editing">
            <td class="ol-c">{{ timeAgo(lead.created_at) }}</td>
            <td><ChannelSelect v-model="editForm.channel" :channels="channels" /></td>
            <td>
              <input v-model="editForm.customerName" class="ol-edit-input" placeholder="ชื่อลูกค้า" />
              <input v-model="editForm.contact" class="ol-edit-input" placeholder="เบอร์/ไอดีติดต่อ" style="margin-top:4px;" />
              <label class="ol-edit-urgent"><input type="checkbox" v-model="editForm.urgent" /> ด่วน</label>
            </td>
            <td><textarea v-model="editForm.message" class="ol-edit-input ol-edit-msg" placeholder="รายละเอียดที่ลูกค้าสั่ง"></textarea></td>
            <td colspan="2" class="ol-c ol-edit-hint">กำลังแก้ไข…</td>
            <td class="ol-actions">
              <button class="ol-ic ol-ok" @click="saveEdit(lead)">💾 บันทึก</button>
              <button class="ol-ic ol-no" @click="cancelEdit">✕ ยกเลิก</button>
            </td>
          </tr>
        </template>
        <tr v-if="filteredLeads.length === 0"><td colspan="7" class="ol-empty">ไม่มีรายการ</td></tr>
      </tbody>
    </table>
  </div>

  <!-- ===== ป๊อปอัพสร้างออร์เดอร์จริง (จบในหน้านี้) ===== -->
  <div v-if="showConvert" class="ol-modal-overlay" @click.self="closeConvert">
    <div class="ol-modal">
      <div class="ol-modal-head">
        <span>📝 สร้างออร์เดอร์จริงจากออเดอร์เข้า</span>
        <button class="ol-modal-x" @click="closeConvert">✕</button>
      </div>
      <div class="ol-modal-body">
        <div class="ol-cv-grid">
          <label class="ol-cv-field"><span>ลูกค้า *</span>
            <input list="ol-cv-customers" v-model="convertForm.customer" placeholder="เลือก/พิมพ์ชื่อลูกค้า" />
            <datalist id="ol-cv-customers"><option v-for="c in customerOptions" :key="c" :value="c" /></datalist>
          </label>
          <label class="ol-cv-field"><span>พนักงานขาย</span>
            <input v-model="convertForm.salesperson" placeholder="พนักงานขาย" />
          </label>
          <label class="ol-cv-field"><span>เงื่อนไขชำระ</span>
            <select v-model="convertForm.paymentTerm">
              <option>Cash</option><option>เครดิต 15 วัน</option><option>เครดิต 30 วัน</option><option>เครดิต 60 วัน</option>
            </select>
          </label>
          <label class="ol-cv-field ol-cv-urgent2"><input type="checkbox" v-model="convertForm.urgent" /> ออร์เดอร์ด่วน</label>
        </div>

        <div class="ol-cv-ref">ข้อความจากลูกค้า: <em>{{ convertLead && convertLead.message ? convertLead.message : '—' }}</em></div>

        <table class="ol-cv-table">
          <thead>
            <tr>
              <th style="width:36px;">#</th>
              <th style="min-width:200px;">รหัสผ้า (SKU) *</th>
              <th style="width:120px;">รหัสสี</th>
              <th style="width:90px;">หน้ากว้าง</th>
              <th style="width:100px;">จำนวน *</th>
              <th style="width:80px;">หน่วย</th>
              <th style="width:44px;"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(it, idx) in convertForm.items" :key="idx">
              <td class="ol-c">{{ idx + 1 }}</td>
              <td>
                <input list="ol-cv-fabrics" v-model="it.sku" @change="onSkuPick(it)" placeholder="พิมพ์รหัส/ชื่อผ้า" />
                <div v-if="it._invalid" class="ol-cv-warn">⚠ ไม่พบรหัสนี้ในระบบ</div>
              </td>
              <td><input list="ol-cv-colors" v-model="it.colorCode" placeholder="รหัสสี" /></td>
              <td><input v-model="it.width" placeholder="นิ้ว" /></td>
              <td><input type="number" v-model.number="it.orderedQty" class="ol-cv-num" placeholder="0" /></td>
              <td><select v-model="it.unit"><option>หลา</option><option>เมตร</option></select></td>
              <td class="ol-c">
                <button class="ol-cv-delrow" @click="removeItem(idx)" :disabled="convertForm.items.length === 1">✕</button>
              </td>
            </tr>
          </tbody>
        </table>
        <datalist id="ol-cv-fabrics"><option v-for="f in fabricOptions" :key="f.sku" :value="f.display" /></datalist>
        <datalist id="ol-cv-colors"><option v-for="c in colorCodeOptions" :key="c" :value="c" /></datalist>
        <button class="ol-cv-additem" @click="addItem">+ เพิ่มรายการ</button>
      </div>
      <div class="ol-modal-foot">
        <span class="ol-cv-hint">บันทึกแล้วออเดอร์เข้าจะถูกปิดอัตโนมัติ (เชื่อมเลขออร์เดอร์)</span>
        <div class="ol-cv-btns">
          <button class="ol-ic ol-no" @click="closeConvert">ยกเลิก</button>
          <button class="ol-ic ol-go ol-cv-save" @click="saveConvert" :disabled="convertSaving">💾 บันทึกออร์เดอร์</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ===== ป๊อปอัพบิล/ลิงก์ชำระเงิน (ปิดวงจรเก็บเงิน) ===== -->
  <div v-if="showBill" class="ol-modal-overlay" @click.self="closeBill">
    <div class="ol-modal">
      <div class="ol-modal-head">
        <span>💳 บิล/ลิงก์ชำระเงิน — {{ billLead && billLead.customer_name }}</span>
        <button class="ol-modal-x" @click="closeBill">✕</button>
      </div>
      <div class="ol-modal-body">
        <!-- ตั้งค่า PromptPay (ครั้งเดียว ใช้ได้ทุกบิล) -->
        <div class="ol-pp-box">
          <span class="ol-pp-label">พร้อมเพย์ร้าน (สำหรับสร้าง QR):</span>
          <input v-model="promptpayId" placeholder="เบอร์/เลขบัตร ปชช." class="ol-pp-input" />
          <input v-model="promptpayName" placeholder="ชื่อบัญชี (ไม่บังคับ)" class="ol-pp-input" />
          <button class="ol-ic ol-ok" @click="savePromptpay">บันทึกเลข</button>
          <span v-if="!promptpayId" class="ol-pp-warn">⚠ ยังไม่ตั้งเลข — ลูกค้าจะยังไม่เห็น QR</span>
        </div>
        <!-- ตั้งค่า SlipOK (ตรวจสลิปอัตโนมัติ) — ไม่ใส่ก็ได้ จะใช้ยืนยันเอง -->
        <div class="ol-pp-box">
          <span class="ol-pp-label">ตรวจสลิปอัตโนมัติ (SlipOK):</span>
          <input v-model="slipok.branchId" placeholder="Branch ID" class="ol-pp-input" style="min-width:110px;" />
          <input v-model="slipok.apiKey" :placeholder="slipok.hasKey ? 'มีคีย์แล้ว (' + slipok.keyMasked + ') — ใส่ใหม่เพื่อเปลี่ยน' : 'API Key'" class="ol-pp-input" />
          <button class="ol-ic ol-ok" @click="saveSlipok">บันทึก</button>
          <span class="ol-pp-hint">ปล่อยว่าง = ปิด (ยืนยันเอง)</span>
        </div>

        <table class="ol-cv-table">
          <thead>
            <tr>
              <th style="width:36px;">#</th>
              <th style="min-width:200px;">รายการ *</th>
              <th style="width:90px;">จำนวน *</th>
              <th style="width:110px;">ราคา/หน่วย *</th>
              <th style="width:110px;">รวม</th>
              <th style="width:44px;"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(it, idx) in billForm.items" :key="idx">
              <td class="ol-c">{{ idx + 1 }}</td>
              <td><input v-model="it.name" placeholder="เช่น ผ้าฝ้ายสีขาว" /></td>
              <td><input type="number" v-model.number="it.qty" class="ol-cv-num" placeholder="0" /></td>
              <td><input type="number" v-model.number="it.price" class="ol-cv-num" placeholder="0.00" /></td>
              <td class="ol-c ol-bill-line">{{ money(it.qty * it.price) }}</td>
              <td class="ol-c"><button class="ol-cv-delrow" @click="removeBillItem(idx)" :disabled="billForm.items.length === 1">✕</button></td>
            </tr>
          </tbody>
          <tfoot>
            <tr><td colspan="4" class="ol-bill-total-l">ยอดรวม</td><td class="ol-c ol-bill-total">฿ {{ money(billTotal) }}</td><td></td></tr>
          </tfoot>
        </table>
        <button class="ol-cv-additem" @click="addBillItem">+ เพิ่มรายการ</button>

        <!-- ลิงก์ที่สร้างแล้ว -->
        <div v-if="billLink" class="ol-link-box">
          <div class="ol-link-title">✅ ลิงก์ชำระเงิน (ส่งให้ลูกค้า)</div>
          <div class="ol-link-row">
            <input :value="billLink" readonly class="ol-link-input" @focus="$event.target.select()" />
            <button class="ol-ic ol-go" @click="copyLink">📋 คัดลอก</button>
            <button class="ol-ic ol-chat" @click="sendLinkInChat" :disabled="chatSending">💬 ส่งในแชท</button>
          </div>
        </div>
      </div>
      <div class="ol-modal-foot">
        <span class="ol-cv-hint">สร้างบิลแล้วลูกค้าเปิดลิงก์ดูยอด + QR + อัปสลิปได้ทันที (ร้านยืนยันเองหลังตรวจสลิป)</span>
        <div class="ol-cv-btns">
          <button class="ol-ic ol-no" @click="closeBill">ปิด</button>
          <button class="ol-ic ol-go ol-cv-save" @click="createBill" :disabled="savingBill">{{ billLink ? '💾 อัปเดตบิล' : '💾 สร้างบิล + ลิงก์' }}</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import ChannelIcon from './ChannelIcon.vue';
import ChannelSelect from './ChannelSelect.vue';
export default {
  name: 'OrderLeadsPage',
  components: { ChannelIcon, ChannelSelect },
  inject: ['dash'],
  data() {
    return {
      channels: [
        { key: 'line', label: 'LINE', icon: '🟢' },
        { key: 'whatsapp', label: 'WhatsApp', icon: '🟩' },
        { key: 'facebook', label: 'Facebook', icon: '🔵' },
        { key: 'phone', label: 'โทรศัพท์', icon: '☎️' },
        { key: 'walkin', label: 'หน้าร้าน', icon: '🏬' },
        { key: 'other', label: 'อื่นๆ', icon: '✉️' },
      ],
      tabs: [
        { key: '', label: 'ทั้งหมด' },
        { key: 'new', label: 'ใหม่' },
        { key: 'confirmed', label: 'ยืนยันแล้ว' },
        { key: 'converted', label: 'แปลงเป็นออร์เดอร์แล้ว' },
        { key: 'lost', label: 'ยกเลิก' },
      ],
      filterStatus: '',
      leads: [],
      saving: false,
      form: this.emptyForm(),
      editId: null,   // id ของ lead ที่กำลังแก้ไขในหน้านี้ (null = ไม่มี)
      editForm: { channel: 'line', customerName: '', contact: '', message: '', urgent: false },
      // แผงตอบกลับลูกค้า
      chatId: null,
      chatText: '',
      chatSending: false,
      lineConfigured: false,   // backend ตั้งค่า LINE ใน .env แล้วหรือยัง
      // ป๊อปอัพสร้างออร์เดอร์จริง (จบในหน้านี้)
      showConvert: false,
      convertLead: null,
      convertSaving: false,
      convertForm: { customer: '', salesperson: '', paymentTerm: 'Cash', urgent: false, items: [] },
      colorCodeOptions: ['C-01', 'C-02', 'C-03', 'C-04', 'C-05'],
      // ป๊อปอัพบิล/ลิงก์ชำระเงิน
      showBill: false,
      billLead: null,
      billForm: { items: [] },
      billLink: '',
      savingBill: false,
      promptpayId: '',
      promptpayName: '',
      slipok: { branchId: '', apiKey: '', hasKey: false, keyMasked: '' },
      _clock: null,
      now: Date.now(),
    };
  },
  computed: {
    filteredLeads() {
      return this.filterStatus ? this.leads.filter((l) => l.status === this.filterStatus) : this.leads;
    },
    // ตัวเลือกผ้า/ลูกค้าจากฐานข้อมูลจริง (ใช้ store เดียวกับหน้ารับออร์เดอร์ กันกรอกรหัสผิด)
    fabricOptions() { return this.dash.order.oeFabricOptions || []; },
    customerOptions() { return (this.dash.order.oeCustomerOptions || []).map((c) => c.name || c); },
    billTotal() { return (this.billForm.items || []).reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.price) || 0), 0); },
  },
  mounted() {
    this.loadLeads();
    // โหลดรายชื่อผ้า/ลูกค้าจริงไว้ให้ป๊อปอัพสร้างออร์เดอร์ (autocomplete กันกรอกผิด)
    if (!this.fabricOptions.length && this.dash.order.oeLoadFabrics) this.dash.order.oeLoadFabrics();
    this._clock = setInterval(() => { this.now = Date.now(); }, 60000);
  },
  beforeUnmount() { if (this._clock) clearInterval(this._clock); },
  methods: {
    emptyForm() { return { channel: 'line', customerName: '', contact: '', message: '', urgent: false }; },
    channelIcon(key) { return (this.channels.find((c) => c.key === key) || {}).icon || '✉️'; },
    channelLabel(key) { return (this.channels.find((c) => c.key === key) || {}).label || key || '-'; },
    statusLabel(s) { return { new: 'ใหม่', confirmed: 'ยืนยันแล้ว', converted: 'แปลงแล้ว', lost: 'ยกเลิก' }[s] || s; },
    countOf(key) { return key ? this.leads.filter((l) => l.status === key).length : this.leads.length; },
    timeAgo(dateStr) {
      if (!dateStr) return '-';
      const t = new Date(dateStr.replace(' ', 'T')).getTime();
      if (!t) return dateStr;
      const diffMin = Math.max(0, Math.round((this.now - t) / 60000));
      if (diffMin < 1) return 'เมื่อครู่';
      if (diffMin < 60) return `${diffMin} นาทีที่แล้ว`;
      const h = Math.round(diffMin / 60);
      if (h < 24) return `${h} ชม.ที่แล้ว`;
      return `${Math.round(h / 24)} วันที่แล้ว`;
    },
    isStale(lead) {
      if (lead.status !== 'new') return false;
      const t = new Date((lead.created_at || '').replace(' ', 'T')).getTime();
      if (!t) return false;
      return (this.now - t) > (2 * 60 * 60 * 1000); // ค้างเกิน 2 ชม. ยังไม่ยืนยัน → เสี่ยงตกหล่น
    },
    async loadLeads() {
      try {
        const res = await fetch('/api/order-leads', { headers: { Authorization: 'Bearer ' + this.dash.token } });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) { this.leads = d.leads || []; this.lineConfigured = !!d.lineConfigured; }
      } catch (e) { /* เชื่อมต่อไม่ได้ */ }
      if (this.dash.refreshOrderLeadsCount) this.dash.refreshOrderLeadsCount();
    },
    async addLead() {
      if (!this.form.customerName.trim()) { this.dash.fbFail('กรุณากรอกชื่อลูกค้า'); return; }
      this.saving = true;
      this.dash.fbLoading('กำลังบันทึก...');
      try {
        const res = await fetch('/api/order-leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.dash.token },
          body: JSON.stringify(this.form),
        });
        if (res.status === 401) { this.dash.fbHide(); this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) {
          this.dash.fbDone('บันทึกออเดอร์เข้าแล้ว');
          this.form = this.emptyForm();
          await this.loadLeads();
        } else { this.dash.fbFail(d.message || 'บันทึกไม่สำเร็จ'); }
      } catch (e) { this.dash.fbFail('บันทึกไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
      finally { this.saving = false; }
    },
    async updateLead(lead, patch) {
      try {
        const res = await fetch(`/api/order-leads/${lead.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.dash.token },
          body: JSON.stringify(patch),
        });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) { Object.assign(lead, d.lead); if (this.dash.refreshOrderLeadsCount) this.dash.refreshOrderLeadsCount(); }
        else { this.dash.fbFail(d.message || 'อัปเดตไม่สำเร็จ'); }
      } catch (e) { this.dash.fbFail('อัปเดตไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
    },
    // ---- ตอบกลับลูกค้า / ประวัติแชท ----
    parseLog(lead) { try { return JSON.parse(lead.reply_log || '[]'); } catch (e) { return []; } },
    replyCount(lead) { return this.parseLog(lead).length; },
    toggleChat(lead) { this.chatId = this.chatId === lead.id ? null : lead.id; this.chatText = ''; },
    async sendReply(lead) {
      const text = (this.chatText || '').trim();
      if (!text) return;
      this.chatSending = true;
      try {
        const res = await fetch(`/api/order-leads/${lead.id}/reply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.dash.token },
          body: JSON.stringify({ text }),
        });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) {
          Object.assign(lead, d.lead);
          this.chatText = '';
          if (d.sent) this.dash.fbDone('ส่งถึงลูกค้าทาง LINE แล้ว');
          else this.dash.fbDone('บันทึกข้อความแล้ว' + (d.sendError ? ' — ' + d.sendError : ''));
        } else { this.dash.fbFail(d.message || 'ส่งไม่สำเร็จ'); }
      } catch (e) { this.dash.fbFail('ส่งไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
      finally { this.chatSending = false; }
    },
    // เปิดโหมดแก้ไขในแถวนั้นเลย (ลูกค้าจดผิด/สั่งผิด แก้ได้ทันที ไม่ต้องยกเลิกแล้วพิมพ์ใหม่)
    startEdit(lead) {
      this.editId = lead.id;
      this.editForm = {
        channel: lead.channel || 'other',
        customerName: lead.customer_name || '',
        contact: lead.contact || '',
        message: lead.message || '',
        urgent: !!lead.urgent,
      };
    },
    cancelEdit() { this.editId = null; },
    async saveEdit(lead) {
      if (!this.editForm.customerName.trim()) { this.dash.fbFail('กรุณากรอกชื่อลูกค้า'); return; }
      await this.updateLead(lead, { ...this.editForm });
      this.editId = null;
      this.dash.fbDone('แก้ไขแล้ว');
    },
    // เปิดป๊อปอัพสร้างออร์เดอร์ในหน้านี้ (ไม่เด้งไปหน้าอื่น)
    convertToOrder(lead) {
      this.convertLead = lead;
      this.convertForm = {
        customer: lead.customer_name || '',
        salesperson: lead.assigned_to || '',
        paymentTerm: 'Cash',
        urgent: !!lead.urgent,
        items: [this.newItem()],
      };
      this.showConvert = true;
    },
    closeConvert() { this.showConvert = false; this.convertLead = null; },
    newItem() { return { sku: '', colorCode: '', width: '', orderedQty: null, unit: 'หลา', _invalid: false }; },
    addItem() { this.convertForm.items.push(this.newItem()); },
    removeItem(idx) { if (this.convertForm.items.length > 1) this.convertForm.items.splice(idx, 1); },
    // datalist ส่งค่าเต็ม "sku — name" กลับมา — แยกเอาเฉพาะรหัส + เติมหน้ากว้างให้ + เตือนถ้าไม่พบ
    onSkuPick(it) {
      const sku = (it.sku || '').split(' — ')[0].trim();
      it.sku = sku;
      const f = this.fabricOptions.find((x) => x.sku === sku);
      it._invalid = !!sku && !f;
      if (f && !it.width) it.width = f.width || '';
    },
    async saveConvert() {
      const customer = (this.convertForm.customer || '').trim();
      if (!customer) { this.dash.fbFail('กรุณาระบุลูกค้า'); return; }
      const validItems = this.convertForm.items.filter((it) => (it.sku || '').trim() && Number(it.orderedQty) > 0);
      if (!validItems.length) { this.dash.fbFail('กรุณากรอกรายการอย่างน้อย 1 รายการ (รหัสผ้า + จำนวน)'); return; }
      if (this.convertForm.items.some((it) => it._invalid)) { this.dash.fbFail('มีรหัสผ้าที่ไม่พบในระบบ — แก้ให้ถูกก่อนบันทึก'); return; }
      this.convertSaving = true;
      this.dash.fbLoading('กำลังสร้างออร์เดอร์...');
      try {
        const payload = {
          customer,
          date: new Date().toISOString().slice(0, 10),
          salesperson: this.convertForm.salesperson || '',
          paymentTerm: this.convertForm.paymentTerm || 'Cash',
          urgent: this.convertForm.urgent,
          channel: this.convertLead ? this.convertLead.channel : '',
          leadId: this.convertLead ? this.convertLead.id : null,
          items: validItems.map((it) => ({ sku: it.sku, colorCode: it.colorCode, width: it.width, orderedQty: it.orderedQty, unit: it.unit })),
        };
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.dash.token },
          body: JSON.stringify(payload),
        });
        if (res.status === 401) { this.dash.fbHide(); this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) {
          this.dash.fbDone('สร้างออร์เดอร์แล้ว: ' + d.order.order_no);
          this.showConvert = false;
          this.convertLead = null;
          await this.loadLeads();               // lead ถูกปิด (converted) แล้ว รีเฟรชรายการ
          if (this.dash.order.loadOrders) this.dash.order.loadOrders();
        } else { this.dash.fbFail(d.message || 'สร้างออร์เดอร์ไม่สำเร็จ'); }
      } catch (e) { this.dash.fbFail('สร้างออร์เดอร์ไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
      finally { this.convertSaving = false; }
    },
    // ---- บิล/ลิงก์ชำระเงิน ----
    money(v) { return (Number(v) || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
    payLabel(s) { return { unpaid: 'รอชำระ', slip_uploaded: 'มีสลิป-รอตรวจ', paid: 'ชำระแล้ว' }[s] || s; },
    payUrl(token) { return `${window.location.origin}/pay/${token}`; },
    async openBill(lead) {
      this.billLead = lead;
      this.billLink = lead.pay_token ? this.payUrl(lead.pay_token) : '';
      let items = [];
      try { items = JSON.parse(lead.bill_items || '[]'); } catch (e) {}
      this.billForm = { items: items.length ? items.map(it => ({ ...it })) : [{ name: '', qty: 1, price: null }] };
      await this.loadPromptpay();
      await this.loadSlipok();
      this.showBill = true;
    },
    closeBill() { this.showBill = false; this.billLead = null; this.billLink = ''; },
    addBillItem() { this.billForm.items.push({ name: '', qty: 1, price: null }); },
    removeBillItem(idx) { if (this.billForm.items.length > 1) this.billForm.items.splice(idx, 1); },
    async loadPromptpay() {
      try {
        const res = await fetch('/api/settings/promptpay', { headers: { Authorization: 'Bearer ' + this.dash.token } });
        const d = await res.json();
        if (d.ok) { this.promptpayId = d.promptpayId || ''; this.promptpayName = d.promptpayName || ''; }
      } catch (e) {}
    },
    async savePromptpay() {
      try {
        const res = await fetch('/api/settings/promptpay', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.dash.token },
          body: JSON.stringify({ promptpayId: this.promptpayId, promptpayName: this.promptpayName }),
        });
        const d = await res.json();
        if (d.ok) this.dash.fbDone('บันทึกเลข PromptPay แล้ว'); else this.dash.fbFail(d.message || 'บันทึกไม่สำเร็จ');
      } catch (e) { this.dash.fbFail('บันทึกไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
    },
    async createBill() {
      const items = this.billForm.items.filter(it => (it.name || '').trim() && Number(it.qty) > 0);
      if (!items.length) { this.dash.fbFail('กรุณากรอกรายการอย่างน้อย 1 รายการ (ชื่อ + จำนวน)'); return; }
      this.savingBill = true;
      try {
        const res = await fetch(`/api/order-leads/${this.billLead.id}/bill`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.dash.token },
          body: JSON.stringify({ items }),
        });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) {
          Object.assign(this.billLead, d.lead);
          this.billLink = this.payUrl(d.token);
          this.dash.fbDone('สร้างบิลแล้ว — คัดลอกลิงก์ส่งให้ลูกค้าได้เลย');
        } else { this.dash.fbFail(d.message || 'สร้างบิลไม่สำเร็จ'); }
      } catch (e) { this.dash.fbFail('สร้างบิลไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
      finally { this.savingBill = false; }
    },
    async copyLink() {
      try { await navigator.clipboard.writeText(this.billLink); this.dash.fbDone('คัดลอกลิงก์แล้ว'); }
      catch (e) { this.dash.fbFail('คัดลอกไม่ได้ — เลือกลิงก์แล้วกด Ctrl+C'); }
    },
    async sendLinkInChat() {
      if (!this.billLink || !this.billLead) return;
      const text = `รบกวนกดลิงก์เพื่อดูยอดและชำระเงินนะครับ/ค่ะ 😊\n${this.billLink}`;
      this.chatSending = true;
      try {
        const res = await fetch(`/api/order-leads/${this.billLead.id}/reply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.dash.token },
          body: JSON.stringify({ text }),
        });
        const d = await res.json();
        if (d.ok) { Object.assign(this.billLead, d.lead); this.dash.fbDone(d.sent ? 'ส่งลิงก์ให้ลูกค้าทาง LINE แล้ว' : 'บันทึกลิงก์ในแชทแล้ว (ช่องทางนี้ยังส่งอัตโนมัติไม่ได้)'); }
        else { this.dash.fbFail(d.message || 'ส่งไม่สำเร็จ'); }
      } catch (e) { this.dash.fbFail('ส่งไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
      finally { this.chatSending = false; }
    },
    async confirmPayment(lead) {
      try {
        const res = await fetch(`/api/order-leads/${lead.id}/confirm-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.dash.token },
          body: JSON.stringify({ paid: true }),
        });
        if (res.status === 401) { this.dash.sessionExpired(); return; }
        const d = await res.json();
        if (d.ok) { Object.assign(lead, d.lead); this.dash.fbDone('ยืนยันชำระเงินแล้ว'); }
        else { this.dash.fbFail(d.message || 'ยืนยันไม่สำเร็จ'); }
      } catch (e) { this.dash.fbFail('ยืนยันไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
    },
    viewSlip(lead) { if (lead.slip_url) window.open(lead.slip_url, '_blank'); },
    async loadSlipok() {
      try {
        const res = await fetch('/api/settings/slipok', { headers: { Authorization: 'Bearer ' + this.dash.token } });
        const d = await res.json();
        if (d.ok) { this.slipok = { branchId: d.branchId || '', apiKey: '', hasKey: !!d.hasKey, keyMasked: d.keyMasked || '' }; }
      } catch (e) {}
    },
    async saveSlipok() {
      try {
        const body = { branchId: this.slipok.branchId };
        if (this.slipok.apiKey) body.apiKey = this.slipok.apiKey;   // ส่งคีย์เฉพาะตอนกรอกใหม่ (ไม่ทับด้วยค่าว่าง)
        const res = await fetch('/api/settings/slipok', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.dash.token },
          body: JSON.stringify(body),
        });
        const d = await res.json();
        if (d.ok) { this.dash.fbDone('บันทึกการตั้งค่า SlipOK แล้ว'); await this.loadSlipok(); }
        else { this.dash.fbFail(d.message || 'บันทึกไม่สำเร็จ'); }
      } catch (e) { this.dash.fbFail('บันทึกไม่สำเร็จ — เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
    },
    parsePayCheck(lead) { try { return lead.pay_check ? JSON.parse(lead.pay_check) : null; } catch (e) { return null; } },
    payCheckMsg(lead) { const c = this.parsePayCheck(lead); return c && c.configured && c.verified ? (c.message || '') : ''; },
    payCheckBad(lead) { const c = this.parsePayCheck(lead); return !!(c && c.verified && !c.paid); },
  },
};
</script>

<style scoped>
.ol-page { font-family: 'Noto Sans Thai', -apple-system, 'Segoe UI', Tahoma, sans-serif; color: var(--text); font-size: 12px; margin-top: 12px; background: var(--surface); border: 1px solid var(--field-border); border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
.ol-titlebar { display: flex; align-items: baseline; gap: 12px; font-weight: 700; padding: 18px 20px 2px; font-size: 18px; }
.ol-hint { font-size: 11.5px; font-weight: 400; color: var(--muted); }
.ol-form { padding: 12px 20px; border-bottom: 1px solid var(--field-border); display: flex; flex-direction: column; gap: 8px; }
.ol-frow { display: flex; gap: 10px; align-items: flex-start; }
.ol-cust, .ol-contact { height: 34px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12.5px; font-family: inherit; background: var(--field); color: var(--text); }
.ol-channel { width: 150px; flex-shrink: 0; } .ol-cust { flex: 1; min-width: 160px; } .ol-contact { width: 200px; }
.ol-msg { flex: 1; min-height: 56px; padding: 8px 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12.5px; font-family: inherit; background: var(--field); color: var(--text); resize: vertical; }
.ol-channel:focus, .ol-cust:focus, .ol-contact:focus, .ol-msg:focus { outline: none; border-color: #2F65F6; background: var(--surface); box-shadow: 0 0 0 3px rgba(47,101,246,.12); }
.ol-urgent { display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px; color: #e03131; font-weight: 600; white-space: nowrap; padding-top: 8px; }
.ol-btn { padding: 8px 18px; border: 1px solid var(--field-border); border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 12px; align-self: flex-start; }
.ol-btn-add { background: #1a9c54; color: #fff; border-color: #1a9c54; }
.ol-btn-add:hover { background: #158045; } .ol-btn-add:disabled { opacity: .6; cursor: default; }
.ol-tabs { display: flex; gap: 6px; padding: 10px 20px 0; flex-wrap: wrap; }
.ol-tab { padding: 7px 14px; border: 1px solid var(--field-border); border-radius: 999px; background: var(--field); color: var(--text); font-family: inherit; font-size: 12px; font-weight: 600; cursor: pointer; }
.ol-tab.active { background: #2F65F6; border-color: #2F65F6; color: #fff; }
.ol-tab-count { opacity: .8; margin-left: 3px; }
.ol-list { padding: 12px; overflow-x: auto; }
.ol-table { width: 100%; border-collapse: collapse; min-width: 1000px; }
.ol-table th { text-align: center; font-size: 12px; color: #fff; background: #3c4453; padding: 10px 8px; font-weight: 600; border-right: 1px solid rgba(255,255,255,.18); white-space: nowrap; }
.ol-table th:last-child { border-right: none; }
.ol-table td { padding: 8px; border-bottom: 1px solid var(--field-border); vertical-align: top; }
.ol-c { text-align: center; color: var(--muted); }
.ol-stale { background: #fff3f3; }
.ol-badge { display: inline-flex; align-items: center; gap: 6px; padding: 3px 9px 3px 5px; border-radius: 999px; background: var(--field); font-size: 11.5px; white-space: nowrap; }
.ol-cust-name { font-weight: 700; } .ol-cust-contact { color: var(--muted); font-size: 11.5px; }
.ol-urgent-tag { color: #e03131; font-size: 10.5px; border: 1px solid #e03131; border-radius: 4px; padding: 1px 5px; margin-left: 4px; }
.ol-msg-cell { white-space: pre-wrap; max-width: 320px; }
.ol-assign { width: 100%; height: 30px; padding: 0 8px; border: 1px solid var(--field-border); border-radius: 6px; font-size: 12px; font-family: inherit; background: var(--field); color: var(--text); }
.ol-status { display: inline-block; padding: 3px 9px; border-radius: 999px; font-size: 11.5px; font-weight: 700; }
.ol-st-new { background: #fff0d6; color: #a15c00; }
.ol-st-confirmed { background: #dbe8ff; color: #1e4fd6; }
.ol-st-converted { background: #e7f6ee; color: #1a9c54; }
.ol-st-lost { background: #fdeaea; color: #e03131; }
.ol-actions { display: flex; gap: 5px; flex-wrap: wrap; align-items: center; }
.ol-ic { padding: 5px 9px; border-radius: 7px; border: 1px solid var(--field-border); background: var(--field); cursor: pointer; font-family: inherit; font-size: 11.5px; white-space: nowrap; }
.ol-ok:hover { background: #e7f6ee; border-color: #1a9c54; color: #1a9c54; }
.ol-go:hover { background: #dbe8ff; border-color: #2F65F6; color: #2F65F6; }
.ol-no:hover { background: #fdeaea; border-color: #e03131; color: #e03131; }
.ol-edit:hover { background: #fff4e0; border-color: #d98a00; color: #a15c00; }
.ol-order-ref { font-size: 11.5px; color: var(--muted); font-weight: 700; }
.ol-empty { text-align: center; color: var(--muted); padding: 18px; }
/* โหมดแก้ไขในแถว */
.ol-editing { background: #fffbf0; }
.ol-editing > td { border-top: 2px solid #f0c860; }
.ol-edit-input { width: 100%; padding: 6px 8px; border: 1px solid var(--field-border); border-radius: 6px; font-size: 12px; font-family: inherit; background: var(--surface); color: var(--text); }
.ol-edit-input:focus { outline: none; border-color: #2F65F6; box-shadow: 0 0 0 3px rgba(47,101,246,.12); }
.ol-edit-msg { min-height: 52px; resize: vertical; }
.ol-edit-urgent { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; color: #e03131; font-weight: 600; margin-top: 5px; }
.ol-edit-hint { color: #a15c00; font-weight: 600; }
/* ปุ่ม + แผงตอบกลับ */
.ol-chat:hover { background: #e6f7f0; border-color: #1a9c54; color: #1a9c54; }
.ol-chat-n { margin-left: 4px; background: #1a9c54; color: #fff; border-radius: 999px; font-size: 9.5px; padding: 1px 5px; }
.ol-chat-row > td { background: #f6fbff; padding: 0; }
.ol-chat-panel { padding: 12px 16px; }
.ol-chat-log { display: flex; flex-direction: column; gap: 6px; max-height: 220px; overflow-y: auto; margin-bottom: 10px; }
.ol-chat-msg { display: flex; align-items: baseline; gap: 8px; max-width: 80%; padding: 7px 11px; border-radius: 10px; font-size: 12.5px; }
.ol-chat-msg.ol-in { align-self: flex-start; background: var(--field); }
.ol-chat-msg.ol-out { align-self: flex-end; background: #dcf5e6; }
.ol-chat-who { font-size: 10.5px; font-weight: 700; color: var(--muted); white-space: nowrap; }
.ol-chat-text { white-space: pre-wrap; }
.ol-chat-unsent { font-size: 10px; color: #a15c00; white-space: nowrap; }
.ol-chat-empty { color: var(--muted); text-align: center; padding: 10px; font-size: 12px; }
.ol-chat-warn { font-size: 11.5px; color: #a15c00; background: #fff7e6; border-radius: 8px; padding: 6px 10px; margin-bottom: 8px; }
.ol-chat-input { display: flex; gap: 8px; align-items: stretch; }
.ol-chat-input textarea { flex: 1; min-height: 40px; max-height: 120px; padding: 8px 10px; border: 1px solid var(--field-border); border-radius: 8px; font-family: inherit; font-size: 12.5px; background: var(--surface); color: var(--text); resize: vertical; }
.ol-chat-input textarea:focus { outline: none; border-color: #2F65F6; box-shadow: 0 0 0 3px rgba(47,101,246,.12); }
.ol-chat-send { align-self: stretch; padding: 0 16px; background: #1a9c54; color: #fff; border-color: #1a9c54; }
.ol-chat-send:hover { background: #158045; } .ol-chat-send:disabled { opacity: .6; cursor: default; }
/* ป๊อปอัพสร้างออร์เดอร์ */
.ol-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.ol-modal { background: var(--surface); border-radius: 14px; width: 100%; max-width: 860px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 12px 40px rgba(0,0,0,.25); }
.ol-modal-head { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--field-border); font-weight: 700; font-size: 15px; }
.ol-modal-x { border: none; background: none; font-size: 18px; cursor: pointer; color: var(--muted); }
.ol-modal-x:hover { color: #e03131; }
.ol-modal-body { padding: 16px 20px; overflow-y: auto; }
.ol-cv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
.ol-cv-field { display: flex; flex-direction: column; gap: 4px; font-size: 12px; }
.ol-cv-field > span { color: var(--muted); font-weight: 600; }
.ol-cv-field input, .ol-cv-field select { height: 34px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12.5px; font-family: inherit; background: var(--field); color: var(--text); }
.ol-cv-field input:focus, .ol-cv-field select:focus { outline: none; border-color: #2F65F6; background: var(--surface); }
.ol-cv-urgent2 { flex-direction: row; align-items: center; gap: 6px; color: #e03131; font-weight: 600; align-self: end; }
.ol-cv-ref { font-size: 12px; color: var(--muted); background: var(--field); border-radius: 8px; padding: 8px 12px; margin-bottom: 12px; }
.ol-cv-table { width: 100%; border-collapse: collapse; }
.ol-cv-table th { background: #3c4453; color: #fff; padding: 8px 6px; font-size: 11.5px; font-weight: 600; }
.ol-cv-table td { padding: 5px 4px; border-bottom: 1px solid var(--field-border); }
.ol-cv-table input, .ol-cv-table select { width: 100%; height: 32px; padding: 0 8px; border: 1px solid var(--field-border); border-radius: 7px; font-size: 12px; font-family: inherit; background: var(--field); color: var(--text); }
.ol-cv-table input:focus, .ol-cv-table select:focus { outline: none; border-color: #2F65F6; background: var(--surface); }
.ol-cv-num { text-align: right; }
.ol-cv-warn { color: #e03131; font-size: 10.5px; margin-top: 2px; }
.ol-cv-delrow { width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--field-border); background: var(--field); color: #e03131; cursor: pointer; }
.ol-cv-delrow:disabled { opacity: .4; cursor: default; }
.ol-cv-additem { margin-top: 10px; padding: 7px 14px; border: 1px dashed var(--field-border); border-radius: 8px; background: var(--field); color: #2F65F6; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 12px; }
.ol-cv-additem:hover { border-color: #2F65F6; }
.ol-modal-foot { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; border-top: 1px solid var(--field-border); gap: 12px; }
.ol-cv-hint { font-size: 11px; color: var(--muted); }
.ol-cv-btns { display: flex; gap: 8px; margin-left: auto; }
.ol-cv-save { background: #1a9c54; color: #fff; border-color: #1a9c54; }
.ol-cv-save:hover { background: #158045; } .ol-cv-save:disabled { opacity: .6; cursor: default; }
/* บิล/ชำระเงิน */
.ol-bill:hover { background: #eef2ff; border-color: #4263eb; color: #4263eb; }
.ol-slipview:hover { background: #eef2ff; border-color: #4263eb; color: #4263eb; }
.ol-pay { display: inline-block; padding: 3px 9px; border-radius: 999px; font-size: 10.5px; font-weight: 700; }
.ol-pay-unpaid { background: #fff0d6; color: #a15c00; }
.ol-pay-slip_uploaded { background: #dbe8ff; color: #1e4fd6; }
.ol-pay-paid { background: #e7f6ee; color: #1a9c54; }
.ol-pp-box { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; background: var(--field); border: 1px solid var(--field-border); border-radius: 10px; padding: 10px 12px; margin-bottom: 14px; }
.ol-pp-label { font-size: 12px; font-weight: 600; color: var(--muted); }
.ol-pp-input { height: 32px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 7px; font-size: 12.5px; font-family: inherit; background: var(--surface); color: var(--text); min-width: 150px; }
.ol-pp-input:focus { outline: none; border-color: #2F65F6; }
.ol-pp-warn { font-size: 11px; color: #a15c00; }
.ol-pp-hint { font-size: 10.5px; color: var(--muted); }
.ol-pay-note { font-size: 10.5px; color: #1a9c54; max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ol-pay-note-bad { color: #e03131; }
.ol-bill-line { color: var(--muted); }
.ol-bill-total-l { text-align: right; font-weight: 700; padding: 8px 6px; }
.ol-bill-total { font-weight: 700; color: #d6336c; padding: 8px 6px; }
.ol-link-box { margin-top: 14px; background: #f0fbf4; border: 1px solid #a6e2c0; border-radius: 10px; padding: 12px 14px; }
.ol-link-title { font-size: 12.5px; font-weight: 700; color: #1a9c54; margin-bottom: 8px; }
.ol-link-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.ol-link-input { flex: 1; min-width: 180px; height: 34px; padding: 0 10px; border: 1px solid var(--field-border); border-radius: 8px; font-size: 12px; font-family: 'Courier New', monospace; background: var(--surface); color: var(--text); }
</style>
