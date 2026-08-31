<template>
<header class="flex items-center justify-between gap-4 px-4 sm:px-8 pt-5 pb-0">
  <!-- ฝั่งซ้าย: breadcrumb -->
  <nav class="breadcrumb-bar min-w-0 self-end pb-1" aria-label="breadcrumb">
    <template v-for="(crumb, idx) in dash.breadcrumb" :key="idx">
      <span class="breadcrumb-crumb" :class="{ 'is-current': idx === dash.breadcrumb.length - 1 }">{{ crumb }}</span>
      <span v-if="idx < dash.breadcrumb.length - 1" class="breadcrumb-sep">/</span>
    </template>
  </nav>

  <!-- ฝั่งขวา -->
  <div class="flex items-center gap-2 sm:gap-3 shrink-0">
    <!-- งานค้างดำเนินการ — เรียงแถวเดียวกับกระดิ่ง (hover ที่ไอคอนเพื่อดูรายละเอียด) -->
    <div class="hidden md:flex items-center">
      <div class="sidebar-notif-row">
        <button class="sidebar-notif-item notif-fulfill" :title="dash.pageTitle('order-fulfill') + ' — ' + dash.t[dash.lang].pendingLabel + ' ' + dash.pipelineBadgeCount('order-fulfill') + ' ' + dash.t[dash.lang].itemsUnit" @click="dash.currentPage = 'order-fulfill'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="m9 14 2 2 4-4"/></svg>
          <span v-if="dash.pipelineBadgeCount('order-fulfill') > 0" class="sidebar-notif-count">{{ dash.pipelineBadgeCount('order-fulfill') }}</span>
        </button>
        <button class="sidebar-notif-item notif-invoice" :title="dash.pageTitle('invoice-open') + ' — ' + dash.t[dash.lang].pendingLabel + ' ' + dash.pipelineBadgeCount('invoice-open') + ' ' + dash.t[dash.lang].itemsUnit" @click="dash.currentPage = 'invoice-open'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2.5v19l2-1.2 2 1.2 2-1.2 2 1.2 2-1.2 2 1.2 2-1.2 2 1.2V2.5l-2 1.2-2-1.2-2 1.2-2-1.2-2 1.2-2-1.2-2 1.2Z"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="13" y2="16"/></svg>
          <span v-if="dash.pipelineBadgeCount('invoice-open') > 0" class="sidebar-notif-count">{{ dash.pipelineBadgeCount('invoice-open') }}</span>
        </button>
        <button class="sidebar-notif-item notif-vat" :title="dash.pageTitle('vat-invoice') + ' — ' + dash.t[dash.lang].pendingLabel + ' ' + dash.pipelineBadgeCount('vat-invoice') + ' ' + dash.t[dash.lang].itemsUnit" @click="dash.currentPage = 'vat-invoice'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2.5H7a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.5z"/><path d="M14 2.5v5h5"/><line x1="14.5" y1="12" x2="9.5" y2="17.5"/><circle cx="9.7" cy="12.3" r="0.9"/><circle cx="14.3" cy="17.2" r="0.9"/></svg>
          <span v-if="dash.pipelineBadgeCount('vat-invoice') > 0" class="sidebar-notif-count">{{ dash.pipelineBadgeCount('vat-invoice') }}</span>
        </button>
      </div>
    </div>
    <div class="hidden md:block h-6 w-px bg-[var(--field-border)]"></div>

    <!-- ปุ่มแจ้งเตือน -->
    <div class="relative" ref="notifRef">
      <button
        type="button"
        class="relative flex h-8 w-8 items-center justify-center rounded-full text-[var(--muted)] transition-colors hover:bg-[var(--field)] hover:text-[var(--text)]"
        :title="dash.t[dash.lang].notificationsWord"
        :aria-label="dash.t[dash.lang].notificationsWord"
        @click.stop="dash.toggleNotif()"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span
          v-if="dash.notifCount > 0"
          class="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[var(--danger)] px-1 text-[10px] font-semibold leading-none text-white"
        >{{ dash.notifCount > 9 ? '9+' : dash.notifCount }}</span>
      </button>

      <!-- Dropdown แจ้งเตือน -->
      <div
        v-if="dash.topnavNotifOpen"
        class="absolute right-0 top-[calc(100%+8px)] z-[3000] w-72 overflow-hidden rounded-xl border bg-[var(--surface)] border-[var(--field-border)] shadow-[0_8px_24px_rgba(0,0,0,.12)]"
      >
        <div class="px-3.5 py-2 border-b border-[var(--field-border)] text-[13px] font-bold text-[var(--text)]">{{ dash.t[dash.lang].notificationsWord }}</div>
        <div class="max-h-80 overflow-y-auto">
          <!-- ผ้าใกล้หมด (กดเพื่อไปดูผังคลัง) -->
          <button
            v-if="dash.lowStockRolls.length"
            type="button"
            class="w-full flex items-center justify-between gap-2 px-3.5 py-2 bg-[#fff4ea] border-b border-[var(--field-border)] text-left hover:bg-[#ffe9d5]"
            @click="dash.currentPage = 'zone-rack'; dash.topnavNotifOpen = false"
          >
            <span class="text-[12px] font-bold text-[#b8480d]">🚨 {{ dash.t[dash.lang].lowStockLabel }} {{ dash.lowStockRolls.length }} {{ dash.t[dash.lang].rollsUnit }}</span>
            <span class="text-[10.5px] text-[#b8480d] whitespace-nowrap">{{ dash.t[dash.lang].viewWarehouseMapLabel }}</span>
          </button>
          <div
            v-for="(activity, idx) in dash.recentActivities.slice(0, 4)"
            :key="idx"
            class="flex items-start gap-2.5 px-3.5 py-2 border-b border-[var(--field-border)] last:border-b-0"
          >
            <span class="text-base leading-none">{{ activity.icon }}</span>
            <div class="min-w-0">
              <div class="text-[12px] text-[var(--text)] truncate">{{ dash.lang === 'th' ? activity.thTitle : activity.enTitle }}</div>
              <div class="text-[10.5px] text-[var(--muted)]">{{ activity.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- เส้นแบ่ง -->
    <div class="hidden sm:block h-6 w-px bg-[var(--field-border)]"></div>

    <!-- โปรไฟล์ผู้ใช้ -->
    <div class="relative" ref="profileRef">
      <button
        type="button"
        class="flex items-center gap-2.5 rounded-xl px-1.5 py-1 transition-colors hover:bg-[var(--field)]"
        @click.stop="dash.topnavProfileOpen = !dash.topnavProfileOpen"
      >
        <img v-if="dash.currentUser.avatar && !avatarBroken" :src="dash.currentUser.avatar" alt="" referrerpolicy="no-referrer" @error="avatarBroken = true" class="h-8 w-8 shrink-0 rounded-full object-cover" />
        <div v-else class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-xs font-semibold text-white">
          {{ topnavInitial }}
        </div>
        <div class="hidden sm:block text-left leading-tight">
          <div class="text-xs font-bold text-[var(--text)]">{{ dash.currentUser.name || dash.t[dash.lang].userWord }}</div>
          <div class="text-[10.5px] text-[var(--muted)]">Role: {{ dash.currentUser.role || dash.t[dash.lang].employeeWord }}</div>
        </div>
        <svg
          viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="h-4 w-4 shrink-0 text-[var(--muted)] transition-transform"
          :class="{ 'rotate-180': dash.topnavProfileOpen }"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <!-- Dropdown -->
      <div
        v-if="dash.topnavProfileOpen"
        class="absolute right-0 top-[calc(100%+8px)] z-[3000] w-56 overflow-hidden rounded-xl border bg-[var(--surface)] border-[var(--field-border)] py-1.5 shadow-[0_8px_24px_rgba(0,0,0,.12)]"
      >
        <div class="px-3.5 py-2 border-b border-[var(--field-border)] sm:hidden">
          <div class="text-sm font-bold text-[var(--text)]">{{ dash.currentUser.name || dash.t[dash.lang].userWord }}</div>
          <div class="text-xs text-[var(--muted)]">Role: {{ dash.currentUser.role || dash.t[dash.lang].employeeWord }}</div>
        </div>
        <button
          type="button"
          class="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm text-[var(--text)] transition-colors hover:bg-[var(--field)]"
          @click="dash.currentPage = 'settings'; dash.settingsOpenEdit(); dash.topnavProfileOpen = false"
        >⚙️ {{ dash.t[dash.lang].accountSettingsEditProfileLabel }}</button>
        <button
          type="button"
          class="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm text-[var(--danger)] transition-colors hover:bg-[var(--field)]"
          @click="dash.topnavProfileOpen = false; dash.logout()"
        >🚪 {{ dash.t[dash.lang].logout }}</button>
      </div>
    </div>
  </div>
</header>
</template>

<script>
export default {
  name: 'TopNavbar',
  inject: ['dash'],
  data() {
    return { avatarBroken: false };
  },
  watch: {
    'dash.currentUser.avatar'() { this.avatarBroken = false; },
  },
  computed: {
    topnavInitial() {
      const name = (this.dash.currentUser.name || '').trim();
      return name ? name[0].toUpperCase() : 'U';
    },
  },
  mounted() {
    document.addEventListener('click', this.handleOutsideClick);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick);
  },
  methods: {
    handleOutsideClick(e) {
      if (this.dash.topnavProfileOpen && this.$refs.profileRef && !this.$refs.profileRef.contains(e.target)) {
        this.dash.topnavProfileOpen = false;
      }
      if (this.dash.topnavNotifOpen && this.$refs.notifRef && !this.$refs.notifRef.contains(e.target)) {
        this.dash.topnavNotifOpen = false;
      }
    },
  },
};
</script>
