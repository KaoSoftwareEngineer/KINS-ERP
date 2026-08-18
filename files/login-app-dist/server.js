// ============================================================
//  server.js  —  API + Database (SQLite)
//  รันด้วย:  npm install  แล้ว  npm start
//  เปิดเว็บที่:  http://localhost:3000/login.html      (เวอร์ชัน HTML)
//               http://localhost:3000/login-vue.html  (เวอร์ชัน Vue)
// ============================================================

const path = require('path');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;

// ---- ฐานข้อมูล (จะสร้างไฟล์ data.db อัตโนมัติ) ----
const db = new Database(path.join(__dirname, 'data.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT,
    email      TEXT UNIQUE NOT NULL,
    password   TEXT NOT NULL,          -- เก็บเป็น salt:hash ไม่ได้เก็บรหัสจริง
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );
`);

// ---- เก็บ token ของผู้ที่ล็อกอินอยู่ (แบบง่าย ในหน่วยความจำ) ----
const sessions = new Map(); // token -> userId

// ---- ฟังก์ชันช่วยเข้ารหัสรหัสผ่าน (ใช้ crypto ในตัว ไม่ต้องลงเพิ่ม) ----
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}
function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const check = crypto.scryptSync(password, salt, 64).toString('hex');
  // เทียบแบบปลอดภัยจากการจับเวลา
  const a = Buffer.from(hash, 'hex');
  const b = Buffer.from(check, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ------------------------------------------------------------
//  สมัครสมาชิก
// ------------------------------------------------------------
app.post('/api/register', (req, res) => {
  const name = (req.body.name || '').trim();
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';

  if (!email || !password) {
    return res.status(400).json({ ok: false, message: 'กรุณากรอกอีเมลและรหัสผ่าน' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, message: 'รูปแบบอีเมลไม่ถูกต้อง' });
  }
  if (password.length < 6) {
    return res.status(400).json({ ok: false, message: 'รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร' });
  }

  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (exists) {
    return res.status(409).json({ ok: false, message: 'อีเมลนี้ถูกใช้สมัครไปแล้ว' });
  }

  const info = db
    .prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)')
    .run(name || null, email, hashPassword(password));

  return res.json({
    ok: true,
    message: 'สมัครสมาชิกสำเร็จ',
    user: { id: info.lastInsertRowid, name, email },
  });
});

// ------------------------------------------------------------
//  เข้าสู่ระบบ
// ------------------------------------------------------------
app.post('/api/login', (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !verifyPassword(password, user.password)) {
    return res.status(401).json({ ok: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
  }

  const token = crypto.randomBytes(24).toString('hex');
  sessions.set(token, user.id);

  return res.json({
    ok: true,
    message: 'เข้าสู่ระบบสำเร็จ',
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// ---- ตรวจ token จาก header Authorization: Bearer <token> ----
function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const userId = sessions.get(token);
  if (!userId) return res.status(401).json({ ok: false, message: 'กรุณาเข้าสู่ระบบ' });
  req.userId = userId;
  next();
}

// ------------------------------------------------------------
//  ข้อมูลผู้ใช้ปัจจุบัน (สำหรับหน้าแดชบอร์ด)
// ------------------------------------------------------------
app.get('/api/me', auth, (req, res) => {
  const user = db
    .prepare('SELECT id, name, email, created_at FROM users WHERE id = ?')
    .get(req.userId);
  res.json({ ok: true, user });
});

// ------------------------------------------------------------
//  รายชื่อสมาชิกทั้งหมด + จำนวน (สำหรับหน้าแดชบอร์ด)
// ------------------------------------------------------------
app.get('/api/users', auth, (req, res) => {
  const users = db
    .prepare('SELECT id, name, email, created_at FROM users ORDER BY id DESC')
    .all();
  res.json({ ok: true, total: users.length, users });
});

// ------------------------------------------------------------
//  ออกจากระบบ
// ------------------------------------------------------------
app.post('/api/logout', auth, (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.slice(7);
  sessions.delete(token);
  res.json({ ok: true });
});

app.get('/', (req, res) => res.redirect('/login.html'));

app.listen(PORT, () => {
  console.log(`\n  ✅ เซิร์ฟเวอร์ทำงานที่  http://localhost:${PORT}`);
  console.log(`     • HTML  ->  http://localhost:${PORT}/login.html`);
  console.log(`     • Vue   ->  http://localhost:${PORT}/login-vue.html\n`);
});
