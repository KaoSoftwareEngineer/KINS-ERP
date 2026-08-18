# ระบบ ERP — Login / Register / Dashboard (โทนน้ำเงิน + โหมดกลางวัน-กลางคืน)

แยกเป็น 2 ส่วน: **backend** (โฟลเดอร์นี้ — API + ฐานข้อมูล) และ **frontend** (โฟลเดอร์ `../frontend` — Vue 3 + Vue Router SPA)

| ไฟล์/โฟลเดอร์ | คืออะไร |
|------|---------|
| `server.js` | **API + ฐานข้อมูล** (SQLite) |
| `data.db` | ไฟล์ฐานข้อมูล (สร้างอัตโนมัติตอนรันครั้งแรก) |
| `../frontend` | หน้าเว็บทั้งหมด (Login/Register + Dashboard ERP) เขียนด้วย Vue 3 SFC (`.vue`) จริง |

---

## วิธีรัน

ต้องมี **Node.js** (เวอร์ชัน 18 ขึ้นไป) ติดตั้งในเครื่อง — ต้องรันทั้ง 2 ฝั่งพร้อมกัน

```bash
# ฝั่ง backend (API + DB)
cd files
npm install
npm start              # http://localhost:3000

# ฝั่ง frontend (Vue SPA) — เปิดอีกเทอร์มินัลหนึ่ง
cd frontend
npm install
npm run dev             # http://localhost:5173
```

จากนั้นเปิดเบราว์เซอร์ที่ **http://localhost:5173** (ไม่ใช่พอร์ต 3000 — พอร์ต 3000 มีแต่ API เปล่าๆ)

- เข้าสู่ระบบ → http://localhost:5173/login
- แดชบอร์ด → http://localhost:5173/dashboard (ต้องล็อกอินก่อน)

> ฝั่ง frontend ตั้ง proxy ให้ `/api/*` วิ่งไปที่ backend (พอร์ต 3000) อัตโนมัติอยู่แล้ว (ดูใน `frontend/vite.config.js`)

---

## ฟีเจอร์

- ✅ **สมัครสมาชิก** — เก็บลงฐานข้อมูล SQLite จริง (รหัสผ่านถูกเข้ารหัสด้วย scrypt ไม่เก็บรหัสจริง)
- ✅ **เข้าสู่ระบบ** — ตรวจอีเมล/รหัสผ่าน แล้วออก token
- ✅ **หน้าแดชบอร์ด** — แสดงจำนวนสมาชิก + รายชื่อสมาชิกที่สมัครไว้ทั้งหมด
- ✅ **ปุ่มสลับโหมดกลางวัน / กลางคืน** (มุมขวาบน จำค่าไว้ด้วย localStorage)
- ✅ ธีมสีโทน **น้ำเงิน**

---

## API ที่มี

| Method | Path | ใช้ทำอะไร |
|--------|------|-----------|
| POST | `/api/register` | สมัครสมาชิก `{ name, email, password }` |
| POST | `/api/login` | เข้าสู่ระบบ `{ email, password }` → คืน `token` |
| GET | `/api/me` | ข้อมูลผู้ใช้ปัจจุบัน (ต้องแนบ `Authorization: Bearer <token>`) |
| GET | `/api/users` | รายชื่อสมาชิกทั้งหมด (ต้องแนบ token) |
| POST | `/api/logout` | ออกจากระบบ |

---

## โครงสร้างฐานข้อมูล (ตาราง `users`)

| คอลัมน์ | ชนิด | หมายเหตุ |
|---------|------|----------|
| id | INTEGER | Primary key |
| name | TEXT | ชื่อ |
| email | TEXT | อีเมล (ห้ามซ้ำ) |
| password | TEXT | เก็บเป็น `salt:hash` |
| created_at | TEXT | วันเวลาที่สมัคร |
