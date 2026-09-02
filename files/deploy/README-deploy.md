# คู่มือขึ้นเว็บจริง — KINS ERP (plumflowsolution.com)

โครงสร้างตอนขึ้นจริง:

```
เบราว์เซอร์ ──► Apache (พอร์ต 80)
                 ├─ /            → frontend/dist (ไฟล์ที่ build แล้ว)
                 ├─ /api/...     → proxy ไป Node พอร์ต 3000
                 └─ /uploads/... → proxy ไป Node พอร์ต 3000
                                      │
                                   Node (server.js) ──► MySQL/MariaDB (plum_erp)
```

> **ทำไมต้องมี proxy:** ตอน dev ตัว Vite dev server เป็นคนส่ง `/api` ไป Node ให้ (ดู `frontend/vite.config.js`)
> พอ build เป็น production แล้ว Vite ไม่อยู่แล้ว ถ้าไม่ตั้ง proxy ที่ Apache หน้าเว็บจะเรียก API ไม่เจอทั้งระบบ

---

## ✅ ส่วนที่ตั้งค่าให้แล้ว (ทำไปแล้ว ไม่ต้องทำซ้ำ)

| รายการ | สถานะ |
|---|---|
| เปิด `proxy_http_module` ใน `httpd.conf` | ✅ (สำรองไฟล์เดิมไว้เป็น `httpd.conf.bak-<วันเวลา>`) |
| vhost + SPA fallback + proxy (`httpd-vhost-plumflow.conf`) | ✅ include ไว้ใน `httpd-vhosts.conf` แล้ว |
| `CORS_ORIGIN`, `FRONTEND_URL` ใน `files/.env` | ✅ |
| backend รันด้วย pm2 (`pm2 start` + `pm2 save`) | ✅ |
| สคริปต์สำรองฐานข้อมูล | ✅ ทดสอบแล้ว (ดัมป์ได้ 47 ตาราง) |

ทดสอบผ่านแล้ว: หน้าเว็บ 200, กด F5 ที่ `/dashboard` ไม่ 404, `/api/...` ทะลุถึง Node (401 = ต้องล็อกอิน = ถูกต้อง),
ไฟล์ `.env`/ซอร์สโค้ดเปิดจากเว็บไม่ได้

---

## 🔴 ส่วนที่ต้องทำเอง (ต้องสิทธิ์ Administrator — ผมทำให้ไม่ได้)

### 1. ให้ Apache + MySQL ขึ้นเองตอนเปิดเครื่อง  ← **สำคัญที่สุด**

ตอนนี้ทั้ง Apache และ MySQL รันเป็นโปรแกรมธรรมดาที่เปิดจาก XAMPP Control Panel
**เครื่องรีบูตเมื่อไหร่ = ระบบล่มทันที จนกว่าจะมีคนมาเปิดให้เอง**

1. ปิด XAMPP Control Panel แล้วเปิดใหม่ด้วยการ **คลิกขวา → Run as administrator**
2. ติ๊กช่อง **Service** หน้า Apache และ MySQL (กากบาทแดงจะเปลี่ยนเป็นเครื่องหมายถูก)
3. กด Start ทั้งคู่

ตรวจว่าสำเร็จ: `Get-Service Apache2.4, mysql` ต้องขึ้น `Running` + `Automatic`

### 2. ให้ backend (Node) ขึ้นเองตอนเปิดเครื่อง

pm2 จำรายการโปรเซสไว้แล้ว (`pm2 save`) เหลือแค่สั่งให้ปลุกตอนล็อกอิน — เปิด PowerShell แล้ววาง:

```powershell
schtasks /Create /TN "KINS-ERP-Backend" /TR "cmd /c C:\Users\Win10\AppData\Roaming\npm\pm2.cmd resurrect" /SC ONLOGON /RL LIMITED /F
```

### 3. ตั้งสำรองฐานข้อมูลอัตโนมัติทุกวัน ตี 2

```powershell
schtasks /Create /TN "KINS-ERP-DB-Backup" /TR "powershell -ExecutionPolicy Bypass -WindowStyle Hidden -File C:\xampp\htdocs\KINS\files\deploy\backup-db.ps1" /SC DAILY /ST 02:00 /RL LIMITED /F
```

ไฟล์สำรองเก็บที่ `C:\backup\kins\` เก็บย้อนหลัง 14 วัน (แก้ค่าได้ในหัวไฟล์ `backup-db.ps1`)
**แนะนำ:** ก๊อปโฟลเดอร์นี้ขึ้น cloud/ฮาร์ดดิสก์นอกด้วย — ถ้าเครื่องนี้พังทั้งเครื่อง ไฟล์สำรองในเครื่องก็หายไปพร้อมกัน

กู้คืน: `C:\xampp\mysql\bin\mysql.exe -u root plum_erp < C:\backup\kins\ไฟล์.sql`

### 4. ติดตั้ง SSL (https) แล้วเปิด COOKIE_SECURE

ตอนนี้ยังเป็น http ธรรมดา = **รหัสผ่านตอนล็อกอินกับ cookie เซสชันวิ่งเป็นข้อความเปล่า** ใครดักกลางทางอ่านได้หมด
พอติดตั้ง SSL เสร็จ (Let's Encrypt ฟรี หรือใบรับรองจากผู้ให้บริการ) ให้:

1. แก้ `files/.env` → `COOKIE_SECURE=1`
2. แก้ `FRONTEND_URL` เป็น `https://plumflowsolution.com`
3. `pm2 restart kins-erp-api`

> ⚠️ ห้ามตั้ง `COOKIE_SECURE=1` ก่อนมี https — cookie จะไม่ถูกตั้งเลย = ล็อกอินไม่ได้ทั้งระบบ

### 5. ตั้งรหัสผ่านให้ MySQL

ตอนนี้ `DB_USER=root` และ `DB_PASSWORD=` (ว่าง) — ถ้าเครื่องออกเน็ต ใครก็เข้าฐานข้อมูลได้โดยไม่ต้องผ่านเว็บเลย
ตั้งรหัส root ผ่าน phpMyAdmin หรือ `mysqladmin` แล้วใส่ค่าลงใน `files/.env` (`DB_PASSWORD=...`) → `pm2 restart kins-erp-api`

ดีกว่านั้น: สร้าง user เฉพาะแอปที่มีสิทธิ์แค่ฐาน `plum_erp` แทนการใช้ root

### 6. ตั้งอีเมลส่ง OTP (ลืมรหัสผ่าน)

`SMTP_USER`/`SMTP_PASS` ใน `.env` ยังว่าง → ระบบลืมรหัสผ่านยังส่งอีเมลจริงไม่ได้ (log OTP ลง console แทน)
Gmail: เปิด 2-Step Verification แล้วสร้าง App Password 16 หลักที่ https://myaccount.google.com/apppasswords

---

## คำสั่งที่ใช้บ่อย

```powershell
pm2 status                    # ดูว่า backend ยังรันอยู่ไหม
pm2 logs kins-erp-api         # ดู log สด
pm2 restart kins-erp-api      # รีสตาร์ท (ต้องทำทุกครั้งหลังแก้ .env หรือ server.js)
```

**อัปเดตโค้ดใหม่ขึ้นเครื่องจริง:**

```powershell
cd C:\xampp\htdocs\KINS
git pull
cd frontend; npm install; npm run build      # build หน้าเว็บใหม่
cd ..\files; npm install
pm2 restart kins-erp-api
```

> หลัง `npm run build` ไม่ต้องรีสตาร์ท Apache — มันอ่านไฟล์จาก `frontend/dist` สดอยู่แล้ว

---

## ⚠️ กลับมาพัฒนาบนเครื่อง (dev) อีกครั้ง

`CORS_ORIGIN` ใน `.env` ตอนนี้เป็นโดเมนจริงแล้ว ไม่มี localhost — ถ้าจะรัน `npm run dev` ต้องเพิ่มเข้าไปก่อน:

```
CORS_ORIGIN=http://localhost:5173,http://plumflowsolution.com,https://plumflowsolution.com
```
