<script>
import BrandLogo from '../components/BrandLogo.vue';
const API = '';
const GOOGLE_CLIENT_ID = '379852252827-4df7g973b2mrpm4kcpliinmk9kqh3vi7.apps.googleusercontent.com';

export default {
  name: 'LoginView',
  components: { BrandLogo },
data() {
      return {
        theme: localStorage.getItem('theme') || 'light',
        lang: localStorage.getItem('lang') || 'th',
        langDropdownOpen: false,
        view: 'login',                       // 'login' | 'register'
        token: null,
        currentUser: {},
        loginData: { email: '', password: '', remember: false },
        regData: { name: '', email: '', phone: '', gender: '', age: '', password: '', confirmPassword: '' },
        fpData: { email: '', code: '', newPassword: '', confirmPassword: '' },
        fpStep: 'request',        // 'request' (ขอรหัส) | 'reset' (ยืนยัน+ตั้งรหัสใหม่)
        fpSending: false,
        loginMsg: { type: '', text: '' },
        regMsg: { type: '', text: '' },
        fpMsg: { type: '', text: '' },
        showLoginPwd: false,
        showRegPwd: false,
        showRegConfirm: false,
        showFpPwd: false,
        agreeTerms: false,
        googleReady: false,
        // Translations
        t: {
          th: {
            welcome: 'ยินดีต้อนรับ',
            joinPlatform: 'เข้าร่วมแพลตฟอร์มของเรา สัมผัสประสบการณ์ใหม่',
            register: 'สมัครสมาชิก',
            login: 'เข้าสู่ระบบ',
            signIn: 'เข้าสู่ระบบ',
            createAccount: 'สร้างบัญชี',
            name: 'ชื่อ - นามสกุล',
            email: 'Email',
            phone: 'เบอร์โทรศัพท์',
            gender: 'เพศ',
            male: 'ชาย',
            female: 'หญิง',
            age: 'อายุ',
            confirmPassword: 'ยืนยันรหัสผ่าน',
            password: 'รหัสผ่าน',
            passwordRequirement: '(อย่างน้อย 8 ตัว)',
            agreeTerms: 'ยอมรับ',
            termsLink: 'ข้อตกลงและเงื่อนไขการใช้งาน',
            orRegisterWith: 'หรือสมัครด้วย',
            orLoginWith: 'หรือเข้าสู่ระบบด้วย',
            errNameRequired: 'กรุณากรอกชื่อ - นามสกุล',
            errEmailInvalid: 'รูปแบบอีเมลไม่ถูกต้อง',
            errPhoneInvalid: 'เบอร์โทรไม่ถูกต้อง (เช่น 0812345678)',
            errPwdShort: 'รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร',
            errPwdMismatch: 'รหัสผ่านไม่ตรงกัน',
            errTerms: 'กรุณายอมรับข้อตกลงและเงื่อนไขการใช้งาน',
            socialSoon: 'ระบบสมัครผ่าน {p} กำลังพัฒนา',
            rememberMe: 'จำไว้',
            forgotPassword: 'ลืมรหัสผ่าน?',
            fpTitle: 'ลืมรหัสผ่าน',
            fpDesc: 'กรอกอีเมลของคุณ ระบบจะส่งรหัสยืนยัน 6 หลักไปให้ทางอีเมล',
            fpDescReset: 'เราส่งรหัสยืนยัน 6 หลักไปที่อีเมลของคุณแล้ว กรอกรหัสและตั้งรหัสผ่านใหม่',
            fpSendOtp: 'ส่งรหัสยืนยัน',
            fpSending: 'กำลังส่งรหัส...',
            fpResend: 'ส่งรหัสอีกครั้ง',
            fpCode: 'รหัสยืนยัน 6 หลัก',
            fpNewPassword: 'รหัสผ่านใหม่',
            fpConfirm: 'ยืนยันรหัสผ่านใหม่',
            fpSubmit: 'ตั้งรหัสผ่านใหม่',
            fpBack: '← กลับไปเข้าสู่ระบบ',
            fpChangeEmail: 'เปลี่ยนอีเมล',
            fpErrEmail: 'กรุณากรอกอีเมลให้ถูกต้อง',
            fpErrRequired: 'กรุณากรอกข้อมูลให้ครบ',
            fpErrPwdShort: 'รหัสผ่านใหม่ต้องยาวอย่างน้อย 6 ตัวอักษร',
            fpErrMismatch: 'รหัสผ่านใหม่ไม่ตรงกัน',
            fpSaving: 'กำลังตั้งรหัสผ่านใหม่...',
            haveAccount: 'มีบัญชีอยู่แล้ว?',
            noAccount: 'ยังไม่มีบัญชี?',
            registerLink: 'สมัครสมาชิก',
            loginLink: 'เข้าสู่ระบบ',
            hello: 'สวัสดี!',
            joinMessage: 'สมัครสมาชิกเพื่อเริ่มต้นใช้งานแพลตฟอร์มของเรา',
            loginSuccess: 'เข้าสู่ระบบสำเร็จ',
            registerSuccess: 'สมัครเรียบร้อย เข้าสู่ระบบได้เลย',
            registering: 'กำลังสมัคร...',
            loggingIn: 'กำลังเข้าสู่ระบบ...',
            error: 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ — รัน npm start ก่อนนะ',
          },
          en: {
            welcome: 'Welcome',
            joinPlatform: 'Join Our Unique Platform, Explore a New Experience',
            register: 'REGISTER',
            login: 'LOGIN',
            signIn: 'Sign In',
            createAccount: 'Create Account',
            name: 'Full Name',
            email: 'Email',
            phone: 'Mobile Phone',
            gender: 'Gender',
            male: 'Male',
            female: 'Female',
            age: 'Age',
            confirmPassword: 'Confirm Password',
            password: 'Password',
            passwordRequirement: '(At least 8 characters)',
            agreeTerms: 'I accept the',
            termsLink: 'Terms & Conditions',
            orRegisterWith: 'Or register with',
            orLoginWith: 'Or login with',
            errNameRequired: 'Please enter your full name',
            errEmailInvalid: 'Invalid email format',
            errPhoneInvalid: 'Invalid phone number (e.g. 0812345678)',
            errPwdShort: 'Password must be at least 8 characters',
            errPwdMismatch: 'Passwords do not match',
            errTerms: 'Please accept the Terms & Conditions',
            socialSoon: '{p} sign-up is coming soon',
            rememberMe: 'Remember me',
            forgotPassword: 'Forgot password?',
            fpTitle: 'Forgot Password',
            fpDesc: 'Enter your email and we will send a 6-digit verification code',
            fpDescReset: 'We sent a 6-digit code to your email. Enter it and set a new password',
            fpSendOtp: 'Send code',
            fpSending: 'Sending code...',
            fpResend: 'Resend code',
            fpCode: '6-digit code',
            fpNewPassword: 'New password',
            fpConfirm: 'Confirm new password',
            fpSubmit: 'Reset password',
            fpBack: '← Back to login',
            fpChangeEmail: 'Change email',
            fpErrEmail: 'Please enter a valid email',
            fpErrRequired: 'Please fill in all fields',
            fpErrPwdShort: 'New password must be at least 6 characters',
            fpErrMismatch: 'New passwords do not match',
            fpSaving: 'Resetting password...',
            haveAccount: 'Have an account?',
            noAccount: "Don't have an account?",
            registerLink: 'Register',
            loginLink: 'Sign In',
            hello: 'Hello!',
            joinMessage: 'Sign up to start using our platform',
            loginSuccess: 'Login successful',
            registerSuccess: 'Registration successful, you can now login',
            registering: 'Registering...',
            loggingIn: 'Logging in...',
            error: 'Cannot connect to server — Run npm start first',
          }
        }
      };
    },
    mounted() {
      // ล้าง token เก่าที่อาจหมดอายุ (เช่นหลัง backend รีสตาร์ต) — กันเด้งวนตอนเข้า dashboard
      localStorage.removeItem('token');
      // ถ้าถูกเด้งกลับมาเพราะเซสชันหมดอายุ ให้แจ้งเตือน
      try {
        if (sessionStorage.getItem('sessionExpiredMsg')) {
          sessionStorage.removeItem('sessionExpiredMsg');
          this.loginMsg = { type: 'error', text: '⚠️ เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่' };
        }
      } catch (e) {}
      document.documentElement.setAttribute('data-theme', this.theme);
      this.loadGoogleScript();
    },
    watch: {
      view() {
        // เมื่อสลับมาหน้าสมัคร ให้เรนเดอร์ปุ่ม Google (container เพิ่งอยู่ใน DOM)
        if (this.view === 'register') this.$nextTick(() => this.renderGoogleButton());
      },
    },
    methods: {
      loadGoogleScript() {
        if (window.google && window.google.accounts) { this.initGoogle(); return; }
        if (document.getElementById('gsi-script')) return;
        const s = document.createElement('script');
        s.src = 'https://accounts.google.com/gsi/client';
        s.async = true; s.defer = true; s.id = 'gsi-script';
        s.onload = () => this.initGoogle();
        document.head.appendChild(s);
      },
      initGoogle() {
        if (!window.google || !window.google.accounts) return;
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (resp) => this.handleGoogleCredential(resp),
        });
        this.googleReady = true;
        if (this.view === 'register') this.$nextTick(() => this.renderGoogleButton());
      },
      renderGoogleButton() {
        if (!this.googleReady || !window.google) return;
        const el = this.$refs.googleBtn;
        if (!el) return;
        el.innerHTML = '';
        window.google.accounts.id.renderButton(el, {
          theme: 'outline', size: 'large', width: 300, text: 'signup_with', shape: 'pill', logo_alignment: 'center',
        });
      },
      async handleGoogleCredential(resp) {
        this.regMsg = { type: '', text: 'กำลังเข้าสู่ระบบด้วย Google...' };
        try {
          const res = await fetch(API + '/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential: resp.credential }),
          });
          const data = await res.json();
          if (data.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            sessionStorage.setItem('welcomeToast', (data.user && data.user.name) || 'ผู้ใช้งาน');
            this.regMsg = { type: 'success', text: '✅ เข้าสู่ระบบด้วย Google สำเร็จ' };
            setTimeout(() => this.$router.push('/dashboard'), 400);
          } else {
            this.regMsg = { type: 'error', text: '⚠️ ' + (data.message || 'เข้าสู่ระบบด้วย Google ไม่สำเร็จ') };
          }
        } catch (e) {
          this.regMsg = { type: 'error', text: this.t[this.lang].error };
        }
      },
      toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
      },
      toggleLangDropdown() {
        this.langDropdownOpen = !this.langDropdownOpen;
      },
      setLanguage(newLang) {
        this.lang = newLang;
        this.langDropdownOpen = false;
        localStorage.setItem('lang', newLang);
      },
      // ตรวจสอบข้อมูลฝั่งผู้ใช้ก่อนส่ง — คืน error text หรือ '' ถ้าผ่าน
      validateRegister() {
        const tt = this.t[this.lang];
        const d = this.regData;
        if (!d.name || !d.name.trim()) return tt.errNameRequired;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return tt.errEmailInvalid;
        if (!/^0[0-9]{8,9}$/.test((d.phone || '').trim())) return tt.errPhoneInvalid;
        if ((d.password || '').length < 8) return tt.errPwdShort;
        if (d.password !== d.confirmPassword) return tt.errPwdMismatch;
        if (!this.agreeTerms) return tt.errTerms;
        return '';
      },
      async register() {
        const err = this.validateRegister();
        if (err) { this.regMsg = { type: 'error', text: '⚠️ ' + err }; return; }
        this.regMsg = { type: '', text: this.t[this.lang].registering };
        try {
          const res = await fetch(API + '/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: this.regData.name.trim(),
              email: this.regData.email.trim(),
              phone: this.regData.phone.trim(),
              gender: this.regData.gender,
              age: this.regData.age || null,
              password: this.regData.password,
            }),
          });
          const data = await res.json();
          if (data.ok) {
            this.regMsg = { type: 'success', text: '✅ ' + data.message };
            this.loginData.email = this.regData.email;
            setTimeout(() => {
              this.regData = { name: '', email: '', phone: '', gender: '', age: '', password: '', confirmPassword: '' };
              this.agreeTerms = false;
              this.view = 'login';
              this.loginMsg = { type: 'success', text: '✅ ' + this.t[this.lang].registerSuccess };
            }, 1200);
          } else {
            this.regMsg = { type: 'error', text: '⚠️ ' + data.message };
          }
        } catch (e) {
          this.regMsg = { type: 'error', text: this.t[this.lang].error };
        }
      },
      // ปุ่มสมัคร/ล็อกอินผ่านโซเชียล (UI ก่อน — ยังไม่ต่อ OAuth จริง)
      socialAuth(provider) {
        const msg = this.t[this.lang].socialSoon.replace('{p}', provider);
        const target = this.view === 'register' ? 'regMsg' : 'loginMsg';
        this[target] = { type: 'error', text: 'ℹ️ ' + msg };
      },
      async login() {
        this.loginMsg = { type: '', text: this.t[this.lang].loggingIn };
        try {
          const res = await fetch(API + '/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: this.loginData.email, password: this.loginData.password }),
          });
          const data = await res.json();
          if (data.ok) {
            this.token = data.token;
            this.currentUser = data.user;
            // บันทึก token และ user ลง localStorage
            localStorage.setItem('token', this.token);
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            // แจ้ง Dashboard ให้เด้ง toast ต้อนรับหลังเข้าสู่ระบบ
            sessionStorage.setItem('welcomeToast', (this.currentUser && this.currentUser.name) || 'ผู้ใช้งาน');
            // redirect ไปที่ dashboard
            setTimeout(() => {
              this.$router.push('/dashboard');
            }, 500);
          } else {
            this.loginMsg = { type: 'error', text: '⚠️ ' + data.message };
          }
        } catch (e) {
          this.loginMsg = { type: 'error', text: this.t[this.lang].error };
        }
      },
      // (1) ขอรหัส OTP ทางอีเมล
      async requestOtp() {
        const tt = this.t[this.lang];
        const email = this.fpData.email.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          this.fpMsg = { type: 'error', text: '⚠️ ' + tt.fpErrEmail }; return;
        }
        this.fpSending = true;
        this.fpMsg = { type: '', text: tt.fpSending };
        try {
          const res = await fetch(API + '/api/forgot-password/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });
          const data = await res.json();
          if (data.ok) {
            this.fpStep = 'reset';
            this.fpMsg = { type: 'success', text: '✅ ' + data.message };
          } else {
            this.fpMsg = { type: 'error', text: '⚠️ ' + data.message };
          }
        } catch (e) {
          this.fpMsg = { type: 'error', text: tt.error };
        } finally {
          this.fpSending = false;
        }
      },
      // (2) ยืนยัน OTP + ตั้งรหัสผ่านใหม่
      async verifyOtp() {
        const tt = this.t[this.lang];
        const d = this.fpData;
        if (!d.code.trim() || !d.newPassword || !d.confirmPassword) {
          this.fpMsg = { type: 'error', text: '⚠️ ' + tt.fpErrRequired }; return;
        }
        if (d.newPassword.length < 6) { this.fpMsg = { type: 'error', text: '⚠️ ' + tt.fpErrPwdShort }; return; }
        if (d.newPassword !== d.confirmPassword) { this.fpMsg = { type: 'error', text: '⚠️ ' + tt.fpErrMismatch }; return; }
        this.fpMsg = { type: '', text: tt.fpSaving };
        try {
          const res = await fetch(API + '/api/forgot-password/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: d.email.trim(), code: d.code.trim(), newPassword: d.newPassword }),
          });
          const data = await res.json();
          if (data.ok) {
            this.fpMsg = { type: 'success', text: '✅ ' + data.message };
            this.loginData.email = d.email.trim();
            setTimeout(() => {
              this.fpData = { email: '', code: '', newPassword: '', confirmPassword: '' };
              this.fpStep = 'request';
              this.view = 'login';
              this.loginMsg = { type: 'success', text: '✅ ' + data.message };
            }, 1200);
          } else {
            this.fpMsg = { type: 'error', text: '⚠️ ' + data.message };
          }
        } catch (e) {
          this.fpMsg = { type: 'error', text: tt.error };
        }
      },
    },
}
</script>

<template>
  <div class="login-page">
<!-- Language Dropdown -->
  <div class="lang-dropdown-container">
    <button class="lang-dropdown-btn" @click="toggleLangDropdown" title="เลือกภาษา / Choose Language">
      {{ lang.toUpperCase() }}
    </button>
    <div class="lang-dropdown-menu" :class="{ active: langDropdownOpen }">
      <div class="lang-dropdown-item" :class="{ selected: lang === 'th' }" @click="setLanguage('th')">
        <span>ไทย (Thai)</span>
      </div>
      <div class="lang-dropdown-item" :class="{ selected: lang === 'en' }" @click="setLanguage('en')">
        <span>English (ENG)</span>
      </div>
    </div>
  </div>

  <!-- Theme Toggle -->
  <button class="theme-toggle" @click="toggleTheme" :title="theme === 'dark' ? 'โหมดกลางวัน' : 'โหมดกลางคืน'" aria-label="สลับโหมดกลางวัน/กลางคืน">
    <svg v-if="theme !== 'dark'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
  </button>

  <!-- ============ LOGIN / REGISTER ============ -->
  <div class="card-stage">
    <!-- โลโก้โผล่มุมซ้ายบน card (จาง ๆ) -->
    <svg class="stage-logo" viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <linearGradient id="bgO" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF7A29"/><stop offset="1" stop-color="#E8580F"/></linearGradient>
        <linearGradient id="bgL" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#F5A623"/><stop offset="1" stop-color="#FFD24D"/></linearGradient>
      </defs>
      <path d="M74.98 28.91 A40 40 0 1 1 45.02 28.91" fill="none" stroke="url(#bgO)" stroke-width="13" stroke-linecap="round"/>
      <path d="M60 34 L60 67" fill="none" stroke="url(#bgO)" stroke-width="12" stroke-linecap="round"/>
      <path d="M60 35 C66 18 79 12 89 15 C84 28 70 34 60 35 Z" fill="url(#bgL)"/>
      <path d="M60 38 C55 28 46 24 38 27 C44 35 53 39 60 38 Z" fill="url(#bgL)" opacity=".92"/>
    </svg>

  <div class="card">
    <aside class="welcome">
      <BrandLogo class="welcome-logo" :size="46" :text-size="30" light-text />
      <h1>{{ view === 'register' ? t[lang].hello : t[lang].welcome }}</h1>
      <p>{{ view === 'register' ? t[lang].joinMessage : t[lang].joinPlatform }}</p>
      <button class="ghost-btn" @click="view = view === 'login' ? 'register' : 'login'">
        {{ view === 'login' ? t[lang].register : t[lang].login }}
      </button>
    </aside>

    <section class="form-side">
      <!-- Sign In -->
      <form v-if="view === 'login'" @submit.prevent="login">
        <h2>{{ t[lang].signIn }}</h2>
        <div class="msg" :class="loginMsg.type">{{ loginMsg.text }}</div>
        <input class="field" type="text" v-model="loginData.email" :placeholder="t[lang].email + ' / ชื่อผู้ใช้'" required />
        <input class="field" type="password" v-model="loginData.password" :placeholder="t[lang].password" required />
        <div class="row">
          <label><input type="checkbox" v-model="loginData.remember" /> {{ t[lang].rememberMe }}</label>
          <a href="#" @click.prevent="view = 'forgot'; fpStep = 'request'; fpData.email = loginData.email; fpMsg = { type: '', text: '' }">{{ t[lang].forgotPassword }}</a>
        </div>
        <button class="primary-btn" type="submit">{{ t[lang].login }}</button>

        <div class="switch-hint">{{ t[lang].noAccount }} <a @click="view = 'register'">{{ t[lang].registerLink }}</a></div>
      </form>

      <!-- Register -->
      <form v-else-if="view === 'register'" @submit.prevent="register">
        <h2>{{ t[lang].createAccount }}</h2>
        <div class="msg" :class="regMsg.type">{{ regMsg.text }}</div>
        <input class="field" type="text" v-model="regData.name" :placeholder="t[lang].name" />
        <input class="field" type="email" v-model="regData.email" :placeholder="t[lang].email" required />
        <input class="field" type="tel" v-model="regData.phone" :placeholder="t[lang].phone + ' (เช่น 0812345678)'" required />
        <div class="reg-two-col">
          <select class="field" v-model="regData.gender">
            <option value="">{{ t[lang].gender }}</option>
            <option value="male">{{ t[lang].male }}</option>
            <option value="female">{{ t[lang].female }}</option>
          </select>
          <input class="field" type="number" min="1" max="120" v-model="regData.age" :placeholder="t[lang].age" />
        </div>
        <div class="pwd-wrap">
          <input class="field" :type="showRegPwd ? 'text' : 'password'" v-model="regData.password" :placeholder="t[lang].password + ' ' + t[lang].passwordRequirement" required />
          <button type="button" class="eye-btn" @click="showRegPwd = !showRegPwd" :aria-label="showRegPwd ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'">
            <svg v-if="showRegPwd" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
        <div class="pwd-wrap">
          <input class="field" :type="showRegConfirm ? 'text' : 'password'" v-model="regData.confirmPassword" :placeholder="t[lang].confirmPassword" required />
          <button type="button" class="eye-btn" @click="showRegConfirm = !showRegConfirm" :aria-label="showRegConfirm ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'">
            <svg v-if="showRegConfirm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
        <label class="terms-row">
          <input type="checkbox" v-model="agreeTerms" />
          <span>{{ t[lang].agreeTerms }} <a href="#" @click.prevent>{{ t[lang].termsLink }}</a></span>
        </label>
        <button class="primary-btn" type="submit" style="margin-top:6px">{{ t[lang].register }}</button>

        <div class="social-divider"><span>{{ t[lang].orRegisterWith }}</span></div>
        <div class="social-row">
          <div ref="googleBtn" class="google-gsi"></div>
        </div>

        <div class="switch-hint">{{ t[lang].haveAccount }} <a @click="view = 'login'">{{ t[lang].loginLink }}</a></div>
      </form>

      <!-- Forgot Password : ขั้น 1 ขอรหัส OTP -->
      <form v-else-if="view === 'forgot' && fpStep === 'request'" @submit.prevent="requestOtp">
        <h2>{{ t[lang].fpTitle }}</h2>
        <p class="fp-desc">{{ t[lang].fpDesc }}</p>
        <div class="msg" :class="fpMsg.type">{{ fpMsg.text }}</div>
        <input class="field" type="email" v-model="fpData.email" :placeholder="t[lang].email" required />
        <button class="primary-btn" type="submit" :disabled="fpSending" style="margin-top:6px">
          {{ fpSending ? t[lang].fpSending : t[lang].fpSendOtp }}
        </button>
        <div class="switch-hint"><a @click="view = 'login'; fpMsg = { type: '', text: '' }">{{ t[lang].fpBack }}</a></div>
      </form>

      <!-- Forgot Password : ขั้น 2 ยืนยัน OTP + ตั้งรหัสใหม่ -->
      <form v-else-if="view === 'forgot' && fpStep === 'reset'" @submit.prevent="verifyOtp">
        <h2>{{ t[lang].fpTitle }}</h2>
        <p class="fp-desc">{{ t[lang].fpDescReset }} <b>{{ fpData.email }}</b></p>
        <div class="msg" :class="fpMsg.type">{{ fpMsg.text }}</div>
        <input class="field otp-field" type="text" inputmode="numeric" maxlength="6" v-model="fpData.code" :placeholder="t[lang].fpCode" required />
        <div class="pwd-wrap">
          <input class="field" :type="showFpPwd ? 'text' : 'password'" v-model="fpData.newPassword" :placeholder="t[lang].fpNewPassword" required />
          <button type="button" class="eye-btn" @click="showFpPwd = !showFpPwd" :aria-label="showFpPwd ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'">
            <svg v-if="showFpPwd" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
        <input class="field" :type="showFpPwd ? 'text' : 'password'" v-model="fpData.confirmPassword" :placeholder="t[lang].fpConfirm" required />
        <button class="primary-btn" type="submit" style="margin-top:6px">{{ t[lang].fpSubmit }}</button>
        <div class="switch-hint">
          <a @click="requestOtp">{{ t[lang].fpResend }}</a>
          <span style="opacity:.4"> · </span>
          <a @click="fpStep = 'request'; fpMsg = { type: '', text: '' }">{{ t[lang].fpChangeEmail }}</a>
        </div>
        <div class="switch-hint" style="margin-top:8px"><a @click="view = 'login'; fpStep = 'request'; fpMsg = { type: '', text: '' }">{{ t[lang].fpBack }}</a></div>
      </form>
    </section>
  </div>
    <!-- ชื่อแบรนด์ แนวยาวบรรทัดเดียว โผล่ล่างขวา card -->
    <div class="stage-name">PLUM&nbsp;FLOW&nbsp;SOLUTION&nbsp;ERP</div>
  </div>
  </div>
</template>

<style scoped>
  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;              /* การ์ดกลางจอ */
    padding: 24px;
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(70% 60% at 12% 8%, rgba(59,91,254,.14), transparent 60%),
      radial-gradient(60% 55% at 90% 92%, rgba(239,107,30,.12), transparent 60%),
      radial-gradient(50% 50% at 88% 10%, rgba(124,92,219,.08), transparent 60%),
      linear-gradient(135deg, #eef1f8 0%, #e7edfb 100%);
  }
  html[data-theme="dark"] .login-page {
    background:
      radial-gradient(70% 60% at 12% 8%, rgba(59,91,254,.16), transparent 60%),
      radial-gradient(60% 55% at 90% 92%, rgba(239,107,30,.13), transparent 60%),
      radial-gradient(50% 50% at 88% 10%, rgba(124,92,219,.10), transparent 60%),
      linear-gradient(135deg, #0d0d11 0%, #14141a 100%);
  }

  /* ---- ตกแต่งรอบ card: โลโก้มุมซ้ายบน + ชื่อแนวยาวล่างขวา ---- */
  .card-stage { position: relative; z-index: 1; width: 100%; max-width: 820px; }
  .stage-logo {
    position: absolute; top: 0; left: 0; z-index: -1;
    width: clamp(78px, 8vw, 116px); height: auto;
    transform: translate(-44%, -46%); opacity: .25;
  }
  html[data-theme="dark"] .stage-logo { opacity: .28; }
  .stage-name {
    position: absolute; right: 6px; top: 100%; margin-top: 14px;
    white-space: nowrap;
    font-family: 'Poppins', sans-serif; font-weight: 700;
    font-size: clamp(13px, 1.5vw, 22px); letter-spacing: .18em;
    color: var(--brand); opacity: .3;
  }
  html[data-theme="dark"] .stage-name { opacity: .34; }

  .theme-toggle {
    position: fixed; top: 20px; right: 20px;
    width: 40px; height: 40px; border-radius: 8px;
    border: 1px solid var(--field-border);
    background: var(--surface); color: var(--muted);
    cursor: pointer;
    display: grid; place-items: center;
    transition: background .2s ease, color .2s ease, border-color .2s ease; 
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  .theme-toggle:hover { background: var(--field); color: var(--text); border-color: var(--muted); }
  .theme-toggle svg { width: 19px; height: 19px; display: block; }

  .lang-dropdown-container {
    position: fixed;
    top: 20px;
    right: 70px;
    z-index: 1001;
  }

  .lang-dropdown-btn {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    border: 1px solid var(--field-border);
    background: var(--surface);
    color: var(--text);
    cursor: pointer;
    display: grid;
    place-items: center;
    font-size: 12px;
    font-weight: 600;
    transition: all .2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .lang-dropdown-btn:hover {
    background: var(--field);
    border-color: var(--brand);
  }

  .lang-dropdown-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background: var(--surface);
    border: 1px solid var(--field-border);
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    min-width: 140px;
    overflow: hidden;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all .2s ease;
  }

  .lang-dropdown-menu.active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .lang-dropdown-item {
    padding: 12px 16px;
    cursor: pointer;
    font-size: 14px;
    color: var(--text);
    border-bottom: 1px solid var(--field-border);
    transition: background .2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .lang-dropdown-item:last-child {
    border-bottom: none;
  }

  .lang-dropdown-item:hover {
    background: var(--field);
  }

  .lang-dropdown-item.selected {
    background: var(--brand-soft);
    color: var(--brand-2);
    font-weight: 600;
  }

  .lang-dropdown-item.selected::before {
    content: '✓';
    font-weight: 700;
  }

  .card {
    position: relative; z-index: 1;
    width: 100%; max-width: 820px; min-height: 460px;
    background: var(--surface); border-radius: 24px;
    box-shadow: 0 30px 80px -20px rgba(37, 55, 201, .28), 0 8px 24px rgba(0,0,0,.06);
    overflow: hidden;
    display: grid; grid-template-columns: 1fr 1.15fr;
    transition: background .35s ease;
  }
  html[data-theme="dark"] .card {
    box-shadow: 0 30px 80px -20px rgba(0,0,0,.6), 0 8px 24px rgba(0,0,0,.4);
  }
  .welcome {
    background: linear-gradient(150deg, #4c6bff 0%, #2233b5 100%);
    color: #fff; padding: 48px 38px;
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; text-align: center; gap: 16px;
  }
  html[data-theme="dark"] .welcome {
    background: linear-gradient(150deg, #23262e 0%, #16181d 100%);
  }
  .welcome-logo { margin-bottom: 8px; }
  .welcome h1 { font-size: 27px; font-weight: 700; letter-spacing: .3px; }
  .welcome p { font-size: 13px; line-height: 1.6; opacity: .92; max-width: 240px; }
  .ghost-btn {
    margin-top: 10px; padding: 11px 34px;
    border: 1.5px solid rgba(255,255,255,.85); background: transparent;
    color: #fff; border-radius: 24px; font-size: 13px; font-weight: 600;
    letter-spacing: 1.5px; cursor: pointer; transition: background .2s, color .2s;
  }
  .ghost-btn:hover { background: #fff; color: var(--brand-2); }

  .form-side { padding: 46px; display: flex; flex-direction: column; justify-content: center; }
  .form-side h2 { font-size: 23px; font-weight: 700; color: var(--brand-2); margin-bottom: 22px; }
  .fp-desc { font-size: 13px; color: var(--muted); margin: -14px 0 16px; line-height: 1.5; }
  .otp-field { letter-spacing: .5em; text-align: center; font-size: 18px; font-weight: 600; }
  .primary-btn:disabled { opacity: .6; cursor: not-allowed; }
  html[data-theme="dark"] .form-side h2 { color: var(--brand); }

  .field {
    width: 100%; padding: 10px 13px; margin-bottom: 10px;
    background: var(--field); border: 1px solid var(--field-border);
    border-radius: 9px; font-size: 13px; color: var(--text);
    transition: border .2s, box-shadow .2s;
  }
  .field::placeholder { color: var(--muted); }
  .field:focus { outline: none; border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-soft); }

  .row {
    display: flex; align-items: center; justify-content: space-between;
    font-size: 12.5px; color: var(--muted); margin: 4px 2px 22px;
  }
  .row label { display: flex; align-items: center; gap: 6px; cursor: pointer; }
  .row a { color: var(--brand); text-decoration: none; }
  .row a:hover { text-decoration: underline; }

  .primary-btn {
    align-self: flex-start; padding: 10px 32px; background: var(--brand);
    color: #fff; border: none; border-radius: 22px; font-size: 13px;
    font-weight: 600; letter-spacing: .8px; cursor: pointer;
    transition: background .2s, transform .1s;
  }
  .primary-btn:hover { background: var(--brand-2); }
  .primary-btn:active { transform: translateY(1px); }

  .msg { font-size: 13px; margin-bottom: 14px; min-height: 18px; }
  .msg.error { color: var(--danger); }
  .msg.success { color: var(--ok); }

  .switch-hint { margin-top: 18px; font-size: 13px; color: var(--muted); }
  .switch-hint a { color: var(--brand); font-weight: 600; text-decoration: none; cursor: pointer; }

  /* ---- ช่องรหัสผ่าน + ปุ่มตา ---- */
  .reg-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .pwd-wrap { position: relative; }
  .pwd-wrap .field { padding-right: 44px; }
  .eye-btn {
    position: absolute; top: 10px; right: 12px;
    width: 24px; height: 24px; padding: 0; border: none; background: none;
    color: var(--muted); cursor: pointer; display: grid; place-items: center;
  }
  .eye-btn:hover { color: var(--brand); }
  .eye-btn svg { width: 18px; height: 18px; display: block; }

  /* ---- ยอมรับเงื่อนไข ---- */
  .terms-row {
    display: flex; align-items: flex-start; gap: 8px;
    font-size: 12.5px; color: var(--muted); margin: 2px 2px 16px; cursor: pointer; line-height: 1.4;
  }
  .terms-row input { margin-top: 2px; cursor: pointer; }
  .terms-row a { color: var(--brand); font-weight: 600; text-decoration: none; }
  .terms-row a:hover { text-decoration: underline; }

  /* ---- ตัวคั่น "หรือสมัครด้วย" ---- */
  .social-divider {
    display: flex; align-items: center; gap: 12px;
    margin: 20px 0 14px; color: var(--muted); font-size: 12px;
  }
  .social-divider::before, .social-divider::after {
    content: ''; flex: 1; height: 1px; background: var(--field-border);
  }

  /* ---- ปุ่มโซเชียล ---- */
  .social-row { display: flex; gap: 10px; justify-content: center; }
  .google-gsi { display: flex; justify-content: center; min-height: 44px; }
  .social-btn {
    flex: 1; height: 42px; border-radius: 10px; border: 1px solid var(--field-border);
    background: var(--field); cursor: pointer; display: grid; place-items: center;
    font-size: 18px; font-weight: 700; transition: transform .1s, box-shadow .2s, border-color .2s;
  }
  .social-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.1); }
  .social-btn.google {
    display: flex; flex-direction: row; align-items: center; justify-content: center;
    gap: 10px; font-size: 14px; font-weight: 600; color: var(--text);
    background: var(--surface); flex: initial; width: 100%; padding: 0 16px;
  }
  .social-g-icon { flex-shrink: 0; }
  .social-g-text { line-height: 1; }

  .dash {
    width: 100%; max-width: 960px; background: var(--surface);
    border-radius: 22px; box-shadow: var(--shadow); overflow: hidden;
  }
  .dash-top {
    background: var(--panel-grad); color: #fff; padding: 26px 32px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .dash-top h2 { font-size: 22px; }
  .dash-top .who { font-size: 13px; opacity: .9; margin-top: 4px; }
  .logout-btn {
    padding: 9px 22px; border: 1.5px solid rgba(255,255,255,.8);
    background: transparent; color: #fff; border-radius: 20px;
    font-size: 13px; font-weight: 600; cursor: pointer; transition: background .2s, color .2s;
  }
  .logout-btn:hover { background: #fff; color: var(--brand-2); }
  .dash-body { padding: 28px 32px; }
  .stat {
    display: inline-flex; flex-direction: column;
    background: var(--brand-soft); color: var(--brand-2);
    border-radius: 14px; padding: 16px 26px; margin-bottom: 22px;
  }
  html[data-theme="dark"] .stat { color: var(--text); }
  .stat b { font-size: 30px; }
  .stat span { font-size: 12.5px; opacity: .85; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th, td { text-align: left; padding: 12px 14px; border-bottom: 1px solid var(--field-border); }
  th { color: var(--muted); font-weight: 600; font-size: 12.5px; text-transform: uppercase; letter-spacing: .5px; }

  @media (max-width: 720px) {
    .card { grid-template-columns: 1fr; max-width: 420px; }
    .welcome { padding: 36px 28px; }
    .form-side { padding: 34px 28px; }
  }
</style>
