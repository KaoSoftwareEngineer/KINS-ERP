import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Login.vue'
import DashboardView from '../views/Dashboard.vue'
import PayBillPage from '../views/PayBillPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/dashboard', name: 'dashboard', component: DashboardView },
    // หน้าลูกค้าชำระเงิน (สาธารณะ ไม่ต้องล็อกอิน) — เปิดจากลิงก์ในแชท
    { path: '/pay/:token', name: 'pay-bill', component: PayBillPage },
  ],
})

export default router
