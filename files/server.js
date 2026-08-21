// ============================================================
//  server.js  —  API + Database
//  รันด้วย:  npm install  แล้ว  npm start
//  นี่คือ backend อย่างเดียว (API + DB) — หน้าเว็บ (Vue SPA) รันแยก
//  ต้อง cd ../frontend แล้ว npm run dev เปิดที่ http://localhost:5173
//
//  ฐานข้อมูล: เก็บ "ทุกข้อมูล" ไว้ใน MySQL (kins_erp) ตัวเดียว
//             ผู้ใช้งาน/session + ผ้า/เฉดสี/ลูกค้า/ข้อมูลนำเข้า Excel/ออร์เดอร์
//             เปิดดู/แก้ไขได้ผ่าน phpMyAdmin
// ============================================================

const path = require('path');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
const { OAuth2Client } = require('google-auth-library');
const { pool: mysqlPool, initTables } = require('./db-mysql');
const app = express();
const PORT = process.env.PORT || 3000;

// ---- เตรียมตารางทั้งหมดใน MySQL (สร้างอัตโนมัติถ้ายังไม่มี) ----
initTables()
  .then(() => ensureAdminUser())
  .catch((err) => {
    console.error('  ❌ เชื่อมต่อ/เตรียมตาราง MySQL ไม่สำเร็จ:', err.message);
  });

// ---- บัญชีผู้ดูแลระบบ (superadmin) สำหรับแก้ปัญหาหลังบ้าน: login "admin" / รหัส "admin" ----
async function ensureAdminUser() {
  try {
    const [rows] = await mysqlPool.query('SELECT id FROM users WHERE email = ?', ['admin']);
    if (rows.length === 0) {
      await mysqlPool.query(
        'INSERT INTO users (name, email, phone, avatar, password, role) VALUES (?, ?, ?, ?, ?, ?)',
        ['ผู้ดูแลระบบ', 'admin', '', null, hashPassword('admin'), 'ผู้ดูแลระบบ (Admin)']
      );
      console.log('  ➕ สร้างบัญชีผู้ดูแลระบบ: login "admin" / รหัส "admin" (สิทธิ์เต็ม)');
    }
  } catch (err) {
    console.error('  ❌ สร้างบัญชี admin ไม่สำเร็จ:', err.message);
  }
}

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
app.use(express.json({ limit: '3mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ------------------------------------------------------------
//  สมัครสมาชิก
// ------------------------------------------------------------
app.post('/api/register', async (req, res) => {
  const name = (req.body.name || '').trim();
  const email = (req.body.email || '').trim().toLowerCase();
  const phone = (req.body.phone || '').trim();
  const password = req.body.password || '';
  const avatar = (req.body.avatar || '').trim();
  const gender = (req.body.gender || '').trim();
  const age = req.body.age ? Number(req.body.age) : null;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ ok: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, message: 'รูปแบบอีเมลไม่ถูกต้อง' });
  }
  if (!/^0[0-9]{8,9}$/.test(phone)) {
    return res.status(400).json({ ok: false, message: 'รูปแบบเบอร์โทรไม่ถูกต้อง (เช่น 0812345678)' });
  }
  if (password.length < 6) {
    return res.status(400).json({ ok: false, message: 'รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร' });
  }
  if (avatar && (!avatar.startsWith('data:image/') || avatar.length > 2_000_000)) {
    return res.status(400).json({ ok: false, message: 'รูปโปรไฟล์ไม่ถูกต้องหรือมีขนาดใหญ่เกินไป' });
  }

  try {
    const [existsRows] = await mysqlPool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existsRows.length > 0) {
      return res.status(409).json({ ok: false, message: 'อีเมลนี้ถูกใช้สมัครไปแล้ว' });
    }

    const [info] = await mysqlPool.query(
      'INSERT INTO users (name, email, phone, avatar, password, gender, age) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone, avatar || null, hashPassword(password), gender, age]
    );

    return res.json({
      ok: true,
      message: 'สมัครสมาชิกสำเร็จ',
      user: { id: info.insertId, name, email, phone, avatar: avatar || null, gender, age },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: 'เชื่อมต่อฐานข้อมูลไม่สำเร็จ' });
  }
});

// ------------------------------------------------------------
//  เข้าสู่ระบบ
// ------------------------------------------------------------
app.post('/api/login', async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';

  try {
    const [rows] = await mysqlPool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    if (!user || !verifyPassword(password, user.password)) {
      return res.status(401).json({ ok: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    const token = crypto.randomBytes(24).toString('hex');
    await mysqlPool.query('INSERT INTO sessions (token, user_id) VALUES (?, ?)', [token, user.id]);

    return res.json({
      ok: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, avatar: user.avatar, role: user.role || '' },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: 'เชื่อมต่อฐานข้อมูลไม่สำเร็จ' });
  }
});

// ------------------------------------------------------------
//  เข้าสู่ระบบ / สมัคร ด้วย Google (Gmail) — ตรวจ ID token ฝั่งเซิร์ฟเวอร์
// ------------------------------------------------------------
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
app.post('/api/auth/google', async (req, res) => {
  const credential = req.body.credential || '';
  if (!credential) return res.status(400).json({ ok: false, message: 'ไม่พบ credential จาก Google' });
  try {
    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const email = (payload.email || '').toLowerCase();
    if (!email) return res.status(400).json({ ok: false, message: 'บัญชี Google ไม่มีอีเมล' });
    const name = payload.name || email.split('@')[0];
    const avatar = payload.picture || null;   // ดึงรูปจาก Gmail (ถ้าไม่มี → null = ใช้รูป default)
    // หา user เดิม หรือสร้างใหม่ (บัญชี Google ไม่มีรหัสผ่าน — ใส่ marker)
    let [rows] = await mysqlPool.query('SELECT * FROM users WHERE email = ?', [email]);
    let user = rows[0];
    if (!user) {
      const [info] = await mysqlPool.query(
        'INSERT INTO users (name, email, phone, avatar, password) VALUES (?, ?, ?, ?, ?)',
        [name, email, '', avatar, 'google:' + crypto.randomBytes(8).toString('hex')]
      );
      user = { id: info.insertId, name, email, phone: '', avatar, role: '' };
    } else if (avatar && !user.avatar) {
      // ผู้ใช้เดิมยังไม่มีรูป → เติมรูปจาก Gmail ให้
      await mysqlPool.query('UPDATE users SET avatar = ? WHERE id = ?', [avatar, user.id]);
      user.avatar = avatar;
    }

    const token = crypto.randomBytes(24).toString('hex');
    await mysqlPool.query('INSERT INTO sessions (token, user_id) VALUES (?, ?)', [token, user.id]);
    return res.json({
      ok: true,
      message: 'เข้าสู่ระบบด้วย Google สำเร็จ',
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, avatar: user.avatar, role: user.role || '' },
    });
  } catch (err) {
    console.error('Google auth error:', err.message);
    return res.status(401).json({ ok: false, message: 'ยืนยันบัญชี Google ไม่สำเร็จ' });
  }
});

// ---- ตรวจ token จาก header Authorization: Bearer <token> ----
async function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : (req.query.token || '');
  try {
    const [rows] = await mysqlPool.query('SELECT user_id FROM sessions WHERE token = ?', [token]);
    if (rows.length === 0) return res.status(401).json({ ok: false, message: 'กรุณาเข้าสู่ระบบ' });
    req.userId = rows[0].user_id;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: 'เชื่อมต่อฐานข้อมูลไม่สำเร็จ' });
  }
}

// ---- ตัวช่วยจับ error ในทุก route แบบ async ----
const wrap = (fn) => (req, res) => fn(req, res).catch((err) => {
  console.error(err);
  res.status(500).json({ ok: false, message: 'เชื่อมต่อฐานข้อมูลไม่สำเร็จ' });
});

// ---- สิทธิ์จัดการบัญชีผู้อื่น (ตามตำแหน่ง) ----
//  ผู้จัดการ = ตำแหน่งระดับบริหาร (CEO/ผู้บริหาร/ผู้ดูแลระบบ/admin)
function isManagerRole(role) {
  const r = (role || '').toLowerCase();
  return r.includes('ceo') || r.includes('ผู้บริหาร') || r.includes('ผู้ดูแล') || r.includes('admin') || r.includes('manager');
}
// คืน true ถ้าผู้เรียกจัดการบัญชีคนอื่นได้ (เป็นผู้จัดการ หรือระบบยังไม่มีผู้จัดการเลย = bootstrap)
async function requesterCanManage(userId) {
  const [[me]] = await mysqlPool.query('SELECT role FROM users WHERE id = ?', [userId]);
  if (me && isManagerRole(me.role)) return true;
  const [rows] = await mysqlPool.query('SELECT role FROM users');
  const anyManager = rows.some(u => isManagerRole(u.role));
  return !anyManager; // ยังไม่มีผู้จัดการในระบบ → ให้ทุกคนจัดการได้ (กันล็อกเอาต์)
}

// ------------------------------------------------------------
//  ข้อมูลผู้ใช้ปัจจุบัน (สำหรับหน้าแดชบอร์ด)
// ------------------------------------------------------------
app.get('/api/me', auth, async (req, res) => {
  const [rows] = await mysqlPool.query(
    'SELECT id, name, email, phone, avatar, role, gender, age, created_at FROM users WHERE id = ?',
    [req.userId]
  );
  res.json({ ok: true, user: rows[0] });
});

// ------------------------------------------------------------
//  แก้ไขโปรไฟล์ผู้ใช้ปัจจุบัน (ชื่อ, เบอร์โทร, รูปโปรไฟล์)
// ------------------------------------------------------------
app.put('/api/me', auth, async (req, res) => {
  const name = (req.body.name || '').trim();
  const phone = (req.body.phone || '').trim();
  const avatar = (req.body.avatar || '').trim();

  if (!name || !phone) {
    return res.status(400).json({ ok: false, message: 'กรุณากรอกชื่อและเบอร์โทร' });
  }
  if (!/^0[0-9]{8,9}$/.test(phone)) {
    return res.status(400).json({ ok: false, message: 'รูปแบบเบอร์โทรไม่ถูกต้อง (เช่น 0812345678)' });
  }
  if (avatar && (!avatar.startsWith('data:image/') || avatar.length > 2_000_000)) {
    return res.status(400).json({ ok: false, message: 'รูปโปรไฟล์ไม่ถูกต้องหรือมีขนาดใหญ่เกินไป' });
  }

  await mysqlPool.query('UPDATE users SET name = ?, phone = ?, avatar = ? WHERE id = ?', [
    name, phone, avatar || null, req.userId,
  ]);

  const [rows] = await mysqlPool.query(
    'SELECT id, name, email, phone, avatar, created_at FROM users WHERE id = ?',
    [req.userId]
  );
  res.json({ ok: true, message: 'บันทึกโปรไฟล์สำเร็จ', user: rows[0] });
});

// ------------------------------------------------------------
//  รายชื่อสมาชิกทั้งหมด + จำนวน (สำหรับหน้าแดชบอร์ด)
// ------------------------------------------------------------
app.get('/api/users', auth, async (req, res) => {
  const [users] = await mysqlPool.query(
    'SELECT id, name, email, phone, avatar, role, gender, age, created_at FROM users ORDER BY id DESC'
  );
  const canManage = await requesterCanManage(req.userId);
  res.json({ ok: true, total: users.length, users, canManage, meId: req.userId });
});

// ------------------------------------------------------------
//  กำหนดบทบาท/ตำแหน่งให้ผู้ใช้ (ลิงก์กับหน้าสิทธิ์การเข้าใช้งาน)
// ------------------------------------------------------------
app.put('/api/users/:id/role', auth, async (req, res) => {
  const role = (req.body.role || '').trim();
  try {
    if (!(await requesterCanManage(req.userId))) {
      return res.status(403).json({ ok: false, message: 'ไม่มีสิทธิ์กำหนดตำแหน่ง (เฉพาะผู้บริหาร)' });
    }
    // กันล็อกตัวเอง: เปลี่ยนตำแหน่งของ "ตัวเอง" ไม่ได้ — ให้ผู้ดูแล/ผู้บริหารคนอื่นเปลี่ยนให้
    if (String(req.userId) === String(req.params.id)) {
      return res.status(400).json({ ok: false, message: 'เปลี่ยนตำแหน่งของตัวเองไม่ได้ — ให้ผู้ดูแล/ผู้บริหารคนอื่นเปลี่ยนให้ (กันล็อกตัวเองออกจากเมนู)' });
    }
    const [info] = await mysqlPool.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
    if (info.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: 'ไม่พบผู้ใช้งาน' });
    }
    res.json({ ok: true, message: 'บันทึกบทบาทแล้ว', role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: 'บันทึกบทบาทไม่สำเร็จ' });
  }
});

// ------------------------------------------------------------
//  แก้ไขข้อมูลบัญชีผู้ใช้ (ชื่อ/อีเมล/เบอร์/บทบาท) + รีเซ็ตรหัสผ่าน (ถ้าส่งมา)
// ------------------------------------------------------------
app.put('/api/users/:id', auth, async (req, res) => {
  const name = (req.body.name || '').trim();
  const email = (req.body.email || '').trim().toLowerCase();
  const phone = (req.body.phone || '').trim();
  const role = (req.body.role || '').trim();
  const gender = (req.body.gender || '').trim();
  const age = req.body.age ? Number(req.body.age) : null;
  const password = req.body.password || '';

  if (!name || !email) {
    return res.status(400).json({ ok: false, message: 'กรุณากรอกชื่อและอีเมล' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, message: 'รูปแบบอีเมลไม่ถูกต้อง' });
  }
  if (phone && !/^0[0-9]{8,9}$/.test(phone)) {
    return res.status(400).json({ ok: false, message: 'รูปแบบเบอร์โทรไม่ถูกต้อง (เช่น 0812345678)' });
  }
  if (password && password.length < 6) {
    return res.status(400).json({ ok: false, message: 'รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร' });
  }

  try {
    const canManage = await requesterCanManage(req.userId);
    const isSelf = String(req.userId) === String(req.params.id);
    // แก้บัญชีคนอื่นได้เฉพาะผู้บริหาร
    if (!canManage && !isSelf) {
      return res.status(403).json({ ok: false, message: 'แก้ไขได้เฉพาะบัญชีของตัวเอง' });
    }
    // กันอีเมลซ้ำกับบัญชีอื่น
    const [dup] = await mysqlPool.query('SELECT id FROM users WHERE email = ? AND id <> ?', [email, req.params.id]);
    if (dup.length > 0) {
      return res.status(409).json({ ok: false, message: 'อีเมลนี้ถูกใช้กับบัญชีอื่นแล้ว' });
    }

    // เปลี่ยนตำแหน่งของตัวเองไม่ได้ (แม้เป็นผู้บริหาร) — กันล็อกตัวเอง / ผู้ที่ไม่ใช่ผู้บริหารก็เปลี่ยน role ไม่ได้
    // → คงตำแหน่งเดิมไว้ (ยังแก้ชื่อ/เบอร์/เพศ/อายุ/รหัสผ่านของตัวเองได้ตามปกติ)
    let roleToSet = role;
    if (!canManage || isSelf) {
      const [[cur]] = await mysqlPool.query('SELECT role FROM users WHERE id = ?', [req.params.id]);
      roleToSet = cur ? cur.role : role;
    }

    const fields = ['name = ?', 'email = ?', 'phone = ?', 'role = ?', 'gender = ?', 'age = ?'];
    const params = [name, email, phone, roleToSet, gender, age];
    if (password) { fields.push('password = ?'); params.push(hashPassword(password)); }
    params.push(req.params.id);

    const [info] = await mysqlPool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);
    if (info.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: 'ไม่พบผู้ใช้งาน' });
    }
    res.json({ ok: true, message: 'บันทึกข้อมูลผู้ใช้แล้ว', user: { id: Number(req.params.id), name, email, phone, role: roleToSet, gender, age } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: 'บันทึกข้อมูลไม่สำเร็จ' });
  }
});

// ------------------------------------------------------------
//  ลบบัญชีผู้ใช้ (พร้อมเซสชันของบัญชีนั้น) — กันลบตัวเอง
// ------------------------------------------------------------
app.delete('/api/users/:id', auth, async (req, res) => {
  try {
    if (!(await requesterCanManage(req.userId))) {
      return res.status(403).json({ ok: false, message: 'ไม่มีสิทธิ์ลบบัญชีผู้อื่น (เฉพาะผู้บริหาร)' });
    }
    if (String(req.userId) === String(req.params.id)) {
      return res.status(400).json({ ok: false, message: 'ไม่สามารถลบบัญชีที่กำลังใช้งานอยู่ได้' });
    }
    await mysqlPool.query('DELETE FROM sessions WHERE user_id = ?', [req.params.id]);
    const [info] = await mysqlPool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (info.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: 'ไม่พบผู้ใช้งาน' });
    }
    res.json({ ok: true, message: 'ลบบัญชีผู้ใช้แล้ว' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: 'ลบบัญชีไม่สำเร็จ' });
  }
});

// ============================================================
//  บทบาท + สิทธิ์การเข้าถึง (roles)
// ============================================================
app.get('/api/roles', auth, async (req, res) => {
  try {
    const [rows] = await mysqlPool.query('SELECT name, permissions FROM roles ORDER BY name');
    const roles = {};
    rows.forEach(r => {
      try { roles[r.name] = JSON.parse(r.permissions || '[]'); }
      catch { roles[r.name] = []; }
    });
    res.json({ ok: true, roles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: 'โหลดบทบาทไม่สำเร็จ' });
  }
});

app.put('/api/roles/:name', auth, async (req, res) => {
  const name = (req.params.name || '').trim();
  const keys = Array.isArray(req.body.permissions) ? req.body.permissions : [];
  if (!name) return res.status(400).json({ ok: false, message: 'ต้องระบุชื่อบทบาท' });
  try {
    await mysqlPool.query(
      `INSERT INTO roles (name, permissions) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE permissions = VALUES(permissions)`,
      [name, JSON.stringify(keys)]
    );
    res.json({ ok: true, message: 'บันทึกบทบาทแล้ว', name, permissions: keys });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: 'บันทึกบทบาทไม่สำเร็จ' });
  }
});

app.delete('/api/roles/:name', auth, async (req, res) => {
  try {
    await mysqlPool.query('DELETE FROM roles WHERE name = ?', [req.params.name]);
    res.json({ ok: true, message: 'ลบบทบาทแล้ว' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: 'ลบบทบาทไม่สำเร็จ' });
  }
});

// ============================================================
//  คู่ค้า / ผู้ขาย (partners)
// ============================================================
app.get('/api/partners', auth, wrap(async (req, res) => {
  const [items] = await mysqlPool.query('SELECT * FROM partners ORDER BY name ASC');
  res.json({ ok: true, total: items.length, items });
}));
app.post('/api/partners', auth, wrap(async (req, res) => {
  const b = req.body || {};
  if (!(b.name || '').trim()) return res.status(400).json({ ok: false, message: 'กรุณากรอกชื่อบริษัท' });
  const [info] = await mysqlPool.query(
    `INSERT INTO partners (code, name, check_name, contact, address, country, phone, email, pgroup, account_term, tax_id, note, active)
     VALUES (:code, :name, :check_name, :contact, :address, :country, :phone, :email, :pgroup, :account_term, :tax_id, :note, :active)`,
    { code: b.code || '', name: b.name.trim(), check_name: b.check_name || '', contact: b.contact || '', address: b.address || '', country: b.country || '', phone: b.phone || '', email: b.email || '', pgroup: b.pgroup || '', account_term: b.account_term || '', tax_id: b.tax_id || '', note: b.note || '', active: b.active === false ? 0 : 1 }
  );
  res.json({ ok: true, message: 'บันทึกคู่ค้าแล้ว', id: info.insertId });
}));
app.put('/api/partners/:id', auth, wrap(async (req, res) => {
  const b = req.body || {};
  if (!(b.name || '').trim()) return res.status(400).json({ ok: false, message: 'กรุณากรอกชื่อบริษัท' });
  await mysqlPool.query(
    `UPDATE partners SET code=:code, name=:name, check_name=:check_name, contact=:contact, address=:address, country=:country, phone=:phone, email=:email, pgroup=:pgroup, account_term=:account_term, tax_id=:tax_id, note=:note, active=:active WHERE id=:id`,
    { id: req.params.id, code: b.code || '', name: b.name.trim(), check_name: b.check_name || '', contact: b.contact || '', address: b.address || '', country: b.country || '', phone: b.phone || '', email: b.email || '', pgroup: b.pgroup || '', account_term: b.account_term || '', tax_id: b.tax_id || '', note: b.note || '', active: b.active === false ? 0 : 1 }
  );
  res.json({ ok: true, message: 'บันทึกแล้ว' });
}));
app.delete('/api/partners/:id', auth, wrap(async (req, res) => {
  const [info] = await mysqlPool.query('DELETE FROM partners WHERE id = ?', [req.params.id]);
  if (info.affectedRows === 0) return res.status(404).json({ ok: false, message: 'ไม่พบคู่ค้า' });
  res.json({ ok: true, message: 'ลบคู่ค้าแล้ว' });
}));

// ============================================================
//  ผ้าดิบ (fabric_raw / greige)
// ============================================================
app.get('/api/fabric-raw', auth, wrap(async (req, res) => {
  const [items] = await mysqlPool.query('SELECT * FROM fabric_raw ORDER BY id DESC');
  res.json({ ok: true, total: items.length, items });
}));
app.post('/api/fabric-raw', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const sku = (b.sku || '').trim();
  if (!sku) return res.status(400).json({ ok: false, message: 'กรุณากรอกรหัสสินค้า' });
  const [dup] = await mysqlPool.query('SELECT id FROM fabric_raw WHERE sku = ?', [sku]);
  if (dup.length > 0) return res.status(409).json({ ok: false, message: 'รหัสสินค้านี้มีอยู่แล้ว' });
  const [info] = await mysqlPool.query(
    `INSERT INTO fabric_raw (type, sku, name, structure, composition, width, unit, shrinkage, allowance, image_name, active)
     VALUES (:type, :sku, :name, :structure, :composition, :width, :unit, :shrinkage, :allowance, :image_name, :active)`,
    { type: b.type || 'Greige', sku, name: b.name || '', structure: b.structure || '', composition: b.composition || '', width: b.width || '', unit: b.unit || 'หลา', shrinkage: Number(b.shrinkage) || 0, allowance: Number(b.allowance) || 0, image_name: b.image_name || '', active: b.active === false ? 0 : 1 }
  );
  res.json({ ok: true, message: 'บันทึกผ้าดิบแล้ว', id: info.insertId });
}));
app.put('/api/fabric-raw/:id', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const sku = (b.sku || '').trim();
  if (!sku) return res.status(400).json({ ok: false, message: 'กรุณากรอกรหัสสินค้า' });
  await mysqlPool.query(
    `UPDATE fabric_raw SET type=:type, sku=:sku, name=:name, structure=:structure, composition=:composition, width=:width, unit=:unit, shrinkage=:shrinkage, allowance=:allowance, image_name=:image_name, active=:active WHERE id=:id`,
    { id: req.params.id, type: b.type || 'Greige', sku, name: b.name || '', structure: b.structure || '', composition: b.composition || '', width: b.width || '', unit: b.unit || 'หลา', shrinkage: Number(b.shrinkage) || 0, allowance: Number(b.allowance) || 0, image_name: b.image_name || '', active: b.active === false ? 0 : 1 }
  );
  res.json({ ok: true, message: 'บันทึกแล้ว' });
}));
app.delete('/api/fabric-raw/:id', auth, wrap(async (req, res) => {
  const [info] = await mysqlPool.query('DELETE FROM fabric_raw WHERE id = ?', [req.params.id]);
  if (info.affectedRows === 0) return res.status(404).json({ ok: false, message: 'ไม่พบผ้าดิบ' });
  res.json({ ok: true, message: 'ลบผ้าดิบแล้ว' });
}));

// ============================================================
//  ข้อมูลหมายเหตุ (note_info)
// ============================================================
app.get('/api/note-info', auth, wrap(async (req, res) => {
  const [items] = await mysqlPool.query('SELECT * FROM note_info ORDER BY id DESC');
  res.json({ ok: true, total: items.length, items });
}));
app.post('/api/note-info', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const description = (b.description || '').trim();
  if (!description) return res.status(400).json({ ok: false, message: 'กรุณากรอกหมายเหตุ' });
  const [info] = await mysqlPool.query('INSERT INTO note_info (note_type, description, active) VALUES (?, ?, ?)', [b.note_type || '', description, b.active === false ? 0 : 1]);
  res.json({ ok: true, message: 'บันทึกแล้ว', id: info.insertId });
}));
app.put('/api/note-info/:id', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const description = (b.description || '').trim();
  if (!description) return res.status(400).json({ ok: false, message: 'กรุณากรอกหมายเหตุ' });
  await mysqlPool.query('UPDATE note_info SET note_type = ?, description = ?, active = ? WHERE id = ?', [b.note_type || '', description, b.active === false ? 0 : 1, req.params.id]);
  res.json({ ok: true, message: 'บันทึกแล้ว' });
}));
app.delete('/api/note-info/:id', auth, wrap(async (req, res) => {
  const [info] = await mysqlPool.query('DELETE FROM note_info WHERE id = ?', [req.params.id]);
  if (info.affectedRows === 0) return res.status(404).json({ ok: false, message: 'ไม่พบข้อมูล' });
  res.json({ ok: true, message: 'ลบแล้ว' });
}));

// ============================================================
//  ข้อมูลผ้า (master data): structure/composition/width/finishing/weight
// ============================================================
app.get('/api/master-data/:category', auth, wrap(async (req, res) => {
  const [items] = await mysqlPool.query('SELECT * FROM master_data WHERE category = ? ORDER BY name ASC', [req.params.category]);
  res.json({ ok: true, total: items.length, items });
}));
app.post('/api/master-data', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const category = (b.category || '').trim();
  const name = (b.name || '').trim();
  if (!category || !name) return res.status(400).json({ ok: false, message: 'กรุณากรอกชื่อ' });
  const minYards = (b.min_yards === '' || b.min_yards == null) ? null : Number(b.min_yards);
  const [info] = await mysqlPool.query('INSERT INTO master_data (category, name, min_yards, active) VALUES (?, ?, ?, ?)', [category, name, minYards, b.active === false ? 0 : 1]);
  res.json({ ok: true, message: 'บันทึกแล้ว', id: info.insertId });
}));
app.put('/api/master-data/:id', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const name = (b.name || '').trim();
  if (!name) return res.status(400).json({ ok: false, message: 'กรุณากรอกชื่อ' });
  const minYards = (b.min_yards === '' || b.min_yards == null) ? null : Number(b.min_yards);
  await mysqlPool.query('UPDATE master_data SET name = ?, min_yards = ?, active = ? WHERE id = ?', [name, minYards, b.active === false ? 0 : 1, req.params.id]);
  res.json({ ok: true, message: 'บันทึกแล้ว' });
}));
app.delete('/api/master-data/:id', auth, wrap(async (req, res) => {
  const [info] = await mysqlPool.query('DELETE FROM master_data WHERE id = ?', [req.params.id]);
  if (info.affectedRows === 0) return res.status(404).json({ ok: false, message: 'ไม่พบข้อมูล' });
  res.json({ ok: true, message: 'ลบแล้ว' });
}));

// ============================================================
//  โรงงาน / โรงย้อม (factories)
// ============================================================
app.get('/api/factories', auth, wrap(async (req, res) => {
  const [items] = await mysqlPool.query('SELECT * FROM factories ORDER BY name ASC');
  res.json({ ok: true, total: items.length, items });
}));
app.post('/api/factories', auth, wrap(async (req, res) => {
  const b = req.body || {};
  if (!(b.name || '').trim()) return res.status(400).json({ ok: false, message: 'กรุณากรอกชื่อโรงงาน' });
  const [info] = await mysqlPool.query(
    `INSERT INTO factories (code, name, type, phone, address, contact, note, active)
     VALUES (:code, :name, :type, :phone, :address, :contact, :note, :active)`,
    { code: b.code || '', name: b.name.trim(), type: b.type || '', phone: b.phone || '', address: b.address || '', contact: b.contact || '', note: b.note || '', active: b.active === false ? 0 : 1 }
  );
  res.json({ ok: true, message: 'บันทึกโรงงานแล้ว', id: info.insertId });
}));
app.put('/api/factories/:id', auth, wrap(async (req, res) => {
  const b = req.body || {};
  if (!(b.name || '').trim()) return res.status(400).json({ ok: false, message: 'กรุณากรอกชื่อโรงงาน' });
  await mysqlPool.query(
    `UPDATE factories SET code=:code, name=:name, type=:type, phone=:phone, address=:address, contact=:contact, note=:note, active=:active WHERE id=:id`,
    { id: req.params.id, code: b.code || '', name: b.name.trim(), type: b.type || '', phone: b.phone || '', address: b.address || '', contact: b.contact || '', note: b.note || '', active: b.active === false ? 0 : 1 }
  );
  res.json({ ok: true, message: 'บันทึกแล้ว' });
}));
app.delete('/api/factories/:id', auth, wrap(async (req, res) => {
  const [info] = await mysqlPool.query('DELETE FROM factories WHERE id = ?', [req.params.id]);
  if (info.affectedRows === 0) return res.status(404).json({ ok: false, message: 'ไม่พบโรงงาน' });
  res.json({ ok: true, message: 'ลบโรงงานแล้ว' });
}));

// ============================================================
//  ใบสั่งซื้อ (purchase_orders) — ผ้าสำเร็จ/ผ้าดิบ/สั่งย้อม
// ============================================================
async function makePoNo() {
  const d = new Date();
  const prefix = 'PO' + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0');
  const [[{ n }]] = await mysqlPool.query('SELECT COUNT(*) AS n FROM purchase_orders WHERE po_no LIKE ?', [prefix + '-%']);
  return `${prefix}-${String(n + 1).padStart(3, '0')}`;
}
app.get('/api/purchase-orders/next-no', auth, wrap(async (req, res) => {
  res.json({ ok: true, po_no: await makePoNo() });
}));
app.get('/api/purchase-orders', auth, wrap(async (req, res) => {
  const type = req.query.type || null;
  const sql = type ? 'SELECT * FROM purchase_orders WHERE po_type = ? ORDER BY id DESC'
                   : 'SELECT * FROM purchase_orders ORDER BY id DESC';
  const [rows] = await mysqlPool.query(sql, type ? [type] : []);
  res.json({ ok: true, total: rows.length, orders: rows });
}));
app.post('/api/purchase-orders', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const po_no = await makePoNo();
  const [info] = await mysqlPool.query(
    `INSERT INTO purchase_orders (po_no, po_type, po_date, vendor, account_term, ship_to, remark, ref_no, ship_date, approved, subtotal, discount, vat, net_total, items_json)
     VALUES (:po_no, :po_type, :po_date, :vendor, :account_term, :ship_to, :remark, :ref_no, :ship_date, :approved, :subtotal, :discount, :vat, :net_total, :items_json)`,
    {
      po_no,
      po_type: b.po_type || 'finished',
      po_date: b.po_date || '',
      vendor: b.vendor || '',
      account_term: b.account_term || '',
      ship_to: b.ship_to || '',
      remark: b.remark || '',
      ref_no: b.ref_no || '',
      ship_date: b.ship_date || '',
      approved: b.approved ? 1 : 0,
      subtotal: Number(b.subtotal) || 0,
      discount: Number(b.discount) || 0,
      vat: Number(b.vat) || 0,
      net_total: Number(b.net_total) || 0,
      items_json: JSON.stringify(Array.isArray(b.items) ? b.items : []),
    }
  );
  res.json({ ok: true, message: 'บันทึกใบสั่งซื้อแล้ว', id: info.insertId, po_no });
}));

// ============================================================
//  ใบสั่งย้อม (dye_orders)
// ============================================================
async function makeTmNo() {
  const d = new Date();
  const prefix = 'TM' + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0');
  const [[{ n }]] = await mysqlPool.query('SELECT COUNT(*) AS n FROM dye_orders WHERE dye_no LIKE ?', [prefix + '-%']);
  return `${prefix}-${String(n + 1).padStart(3, '0')}`;
}
app.get('/api/dye-orders/next-no', auth, wrap(async (req, res) => {
  res.json({ ok: true, dye_no: await makeTmNo() });
}));
app.get('/api/dye-orders', auth, wrap(async (req, res) => {
  const [rows] = await mysqlPool.query('SELECT * FROM dye_orders ORDER BY id DESC');
  res.json({ ok: true, total: rows.length, orders: rows });
}));
app.post('/api/dye-orders', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const dye_no = await makeTmNo();
  const [info] = await mysqlPool.query(
    `INSERT INTO dye_orders (dye_no, dye_date, factory, ref_no, ship_date, approved, raw_json, product_json, items_json, sample_json, packing_json, stamping_json, remark, subtotal, discount, vat, net_total)
     VALUES (:dye_no, :dye_date, :factory, :ref_no, :ship_date, :approved, :raw_json, :product_json, :items_json, :sample_json, :packing_json, :stamping_json, :remark, :subtotal, :discount, :vat, :net_total)`,
    {
      dye_no,
      dye_date: b.dye_date || '',
      factory: b.factory || '',
      ref_no: b.ref_no || '',
      ship_date: b.ship_date || '',
      approved: b.approved ? 1 : 0,
      raw_json: JSON.stringify(b.raw || {}),
      product_json: JSON.stringify(b.product || {}),
      items_json: JSON.stringify(Array.isArray(b.items) ? b.items : []),
      sample_json: JSON.stringify(b.sample || {}),
      packing_json: JSON.stringify(b.packing || {}),
      stamping_json: JSON.stringify(b.stamping || {}),
      remark: b.remark || '',
      subtotal: Number(b.subtotal) || 0,
      discount: Number(b.discount) || 0,
      vat: Number(b.vat) || 0,
      net_total: Number(b.net_total) || 0,
    }
  );
  res.json({ ok: true, message: 'บันทึกใบสั่งย้อมแล้ว', id: info.insertId, dye_no });
}));

// ============================================================
//  เอกสารรับผ้าสำเร็จ (finished_receipts)
// ============================================================
// เลขที่รับสินค้า IN + YYMM + running — รันต่อเนื่องร่วมกันทั้งผ้าสำเร็จ/ผ้าดิบ/ผ้าย้อม
async function makeInNo() {
  const d = new Date();
  const prefix = 'IN' + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0');
  const like = prefix + '-%';
  const [[{ n }]] = await mysqlPool.query(
    `SELECT (SELECT COUNT(*) FROM finished_receipts WHERE in_no LIKE ?)
          + (SELECT COUNT(*) FROM raw_receipts WHERE in_no LIKE ?)
          + (SELECT COUNT(*) FROM dyed_receipts WHERE in_no LIKE ?) AS n`,
    [like, like, like]
  );
  return `${prefix}-${String(n + 1).padStart(3, '0')}`;
}
// เชื่อม WMS: เขียนม้วนผ้า (rolls) ที่รับเข้า → ตาราง fabric_rolls เพื่อให้สแกน QR ย้ายเข้าแร็คได้
async function insertFabricRolls(items) {
  for (const it of (items || [])) {
    const sku = (it.sku || '').trim();
    if (!sku || !Array.isArray(it.rolls) || it.rolls.length === 0) continue;
    let [[fab]] = await mysqlPool.query('SELECT id FROM fabrics WHERE sku = ? LIMIT 1', [sku]);
    if (!fab) {
      // ยังไม่มีผ้านี้ใน master → สร้างให้อัตโนมัติจากข้อมูลที่รับเข้า (เพื่อให้สแกน QR ม้วนได้)
      try {
        const [ins] = await mysqlPool.query(
          'INSERT INTO fabrics (sku, name, width, unit, active) VALUES (?, ?, ?, ?, 1)',
          [sku, it.name || '', it.width || '', it.unit || 'หลา']
        );
        fab = { id: ins.insertId };
      } catch (e) {
        const [[again]] = await mysqlPool.query('SELECT id FROM fabrics WHERE sku = ? LIMIT 1', [sku]);
        if (!again) continue;
        fab = again;
      }
    }
    let colorId = null;
    if (it.color) {
      let [[sh]] = await mysqlPool.query('SELECT id FROM fabric_shades WHERE fabric_id = ? AND name = ? LIMIT 1', [fab.id, it.color]);
      if (!sh) {
        // สร้างเฉดสีให้ผ้านี้ถ้ายังไม่มี (เพื่อให้ข้อมูลสีตรงกับม้วน)
        try {
          const [insSh] = await mysqlPool.query('INSERT INTO fabric_shades (fabric_id, name) VALUES (?, ?)', [fab.id, it.color]);
          sh = { id: insSh.insertId };
        } catch (e) { sh = null; }
      }
      if (sh) colorId = sh.id;
    }
    for (const roll of it.rolls) {
      if (!roll || !roll.barcode) continue;
      const y = Number(roll.yards) || 0;
      try {
        await mysqlPool.query(
          `INSERT INTO fabric_rolls (roll_qr_code, product_id, color_id, lot_no, initial_yards, current_yards, status, received_at)
           VALUES (?, ?, ?, ?, ?, ?, 'available', NOW())`,
          [roll.barcode, fab.id, colorId, it.lot || null, y, y]
        );
      } catch (e) { /* บาร์โค้ดซ้ำ (uq_roll_qr) → ข้าม */ }
    }
  }
}
app.get('/api/finished-receipts/next-no', auth, wrap(async (req, res) => {
  res.json({ ok: true, in_no: await makeInNo() });
}));
app.get('/api/finished-receipts', auth, wrap(async (req, res) => {
  const [rows] = await mysqlPool.query('SELECT * FROM finished_receipts ORDER BY id DESC');
  res.json({ ok: true, total: rows.length, receipts: rows });
}));
app.post('/api/finished-receipts', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const in_no = await makeInNo();
  const [info] = await mysqlPool.query(
    `INSERT INTO finished_receipts (in_no, receipt_date, receipt_type, warehouse, po_ref, supplier, bill_no, remark, subtotal, discount, vat, net_total, items_json)
     VALUES (:in_no, :receipt_date, :receipt_type, :warehouse, :po_ref, :supplier, :bill_no, :remark, :subtotal, :discount, :vat, :net_total, :items_json)`,
    {
      in_no,
      receipt_date: b.receipt_date || '',
      receipt_type: b.receipt_type || 'Purchase',
      warehouse: b.warehouse || 'Warehouse',
      po_ref: b.po_ref || '',
      supplier: b.supplier || '',
      bill_no: b.bill_no || '',
      remark: b.remark || '',
      subtotal: Number(b.subtotal) || 0,
      discount: Number(b.discount) || 0,
      vat: Number(b.vat) || 0,
      net_total: Number(b.net_total) || 0,
      items_json: JSON.stringify(Array.isArray(b.items) ? b.items : []),
    }
  );
  await insertFabricRolls(b.items);
  res.json({ ok: true, message: 'บันทึกเอกสารรับผ้าสำเร็จแล้ว', id: info.insertId, in_no });
}));

// ============================================================
//  เอกสารรับผ้าดิบ (raw_receipts) — เลข IN รันร่วมกับผ้าสำเร็จ
// ============================================================
app.get('/api/raw-receipts/next-no', auth, wrap(async (req, res) => {
  res.json({ ok: true, in_no: await makeInNo() });
}));
app.get('/api/raw-receipts', auth, wrap(async (req, res) => {
  const [rows] = await mysqlPool.query('SELECT * FROM raw_receipts ORDER BY id DESC');
  res.json({ ok: true, total: rows.length, receipts: rows });
}));
app.post('/api/raw-receipts', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const in_no = await makeInNo();
  const [info] = await mysqlPool.query(
    `INSERT INTO raw_receipts (in_no, receipt_date, receipt_type, factory, po_ref, supplier, bill_no, remark, subtotal, discount, vat, net_total, items_json)
     VALUES (:in_no, :receipt_date, :receipt_type, :factory, :po_ref, :supplier, :bill_no, :remark, :subtotal, :discount, :vat, :net_total, :items_json)`,
    {
      in_no,
      receipt_date: b.receipt_date || '',
      receipt_type: b.receipt_type || 'Purchase',
      factory: b.factory || '',
      po_ref: b.po_ref || '',
      supplier: b.supplier || '',
      bill_no: b.bill_no || '',
      remark: b.remark || '',
      subtotal: Number(b.subtotal) || 0,
      discount: Number(b.discount) || 0,
      vat: Number(b.vat) || 0,
      net_total: Number(b.net_total) || 0,
      items_json: JSON.stringify(Array.isArray(b.items) ? b.items : []),
    }
  );
  res.json({ ok: true, message: 'บันทึกเอกสารรับผ้าดิบแล้ว', id: info.insertId, in_no });
}));

// ============================================================
//  เอกสารรับผ้าย้อม (dyed_receipts) — เลข IN รันร่วมกับผ้าสำเร็จ/ดิบ
// ============================================================
app.get('/api/dyed-receipts/next-no', auth, wrap(async (req, res) => {
  res.json({ ok: true, in_no: await makeInNo() });
}));
app.get('/api/dyed-receipts', auth, wrap(async (req, res) => {
  const [rows] = await mysqlPool.query('SELECT * FROM dyed_receipts ORDER BY id DESC');
  res.json({ ok: true, total: rows.length, receipts: rows });
}));
app.post('/api/dyed-receipts', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const in_no = await makeInNo();
  const [info] = await mysqlPool.query(
    `INSERT INTO dyed_receipts (in_no, receipt_date, order_ref, factory, warehouse, supplier, bill_no, remark, subtotal, discount, vat, net_total, items_json)
     VALUES (:in_no, :receipt_date, :order_ref, :factory, :warehouse, :supplier, :bill_no, :remark, :subtotal, :discount, :vat, :net_total, :items_json)`,
    {
      in_no,
      receipt_date: b.receipt_date || '',
      order_ref: b.order_ref || '',
      factory: b.factory || '',
      warehouse: b.warehouse || 'Warehouse',
      supplier: b.supplier || '',
      bill_no: b.bill_no || '',
      remark: b.remark || '',
      subtotal: Number(b.subtotal) || 0,
      discount: Number(b.discount) || 0,
      vat: Number(b.vat) || 0,
      net_total: Number(b.net_total) || 0,
      items_json: JSON.stringify(Array.isArray(b.items) ? b.items : []),
    }
  );
  await insertFabricRolls(b.items);
  res.json({ ok: true, message: 'บันทึกเอกสารรับผ้าย้อมแล้ว', id: info.insertId, in_no });
}));

// ============================================================
//  เอกสารย้ายสินค้าระหว่างคลัง (stock_transfers) — เลข TR แยกจาก IN
// ============================================================
async function makeTrNo() {
  const d = new Date();
  const prefix = 'TR' + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0');
  const [[{ n }]] = await mysqlPool.query('SELECT COUNT(*) AS n FROM stock_transfers WHERE tr_no LIKE ?', [prefix + '-%']);
  return `${prefix}-${String(n + 1).padStart(3, '0')}`;
}
app.get('/api/stock-transfers/next-no', auth, wrap(async (req, res) => {
  res.json({ ok: true, tr_no: await makeTrNo() });
}));
app.get('/api/stock-transfers', auth, wrap(async (req, res) => {
  const [rows] = await mysqlPool.query('SELECT * FROM stock_transfers ORDER BY id DESC');
  res.json({ ok: true, total: rows.length, transfers: rows });
}));
app.post('/api/stock-transfers', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const tr_no = await makeTrNo();
  const [info] = await mysqlPool.query(
    `INSERT INTO stock_transfers (tr_no, transfer_date, from_wh, to_wh, remark, items_json)
     VALUES (:tr_no, :transfer_date, :from_wh, :to_wh, :remark, :items_json)`,
    {
      tr_no,
      transfer_date: b.transfer_date || '',
      from_wh: b.from_wh || '',
      to_wh: b.to_wh || '',
      remark: b.remark || '',
      items_json: JSON.stringify(Array.isArray(b.items) ? b.items : []),
    }
  );
  res.json({ ok: true, message: 'บันทึกเอกสารย้ายสินค้าแล้ว', id: info.insertId, tr_no });
}));

// ============================================================
//  เอกสารย้ายผ้าดิบ (raw_transfers) — เลข TG แยกจาก TR/IN
// ============================================================
async function makeTgNo() {
  const d = new Date();
  const prefix = 'TG' + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0');
  const [[{ n }]] = await mysqlPool.query('SELECT COUNT(*) AS n FROM raw_transfers WHERE tg_no LIKE ?', [prefix + '-%']);
  return `${prefix}-${String(n + 1).padStart(3, '0')}`;
}
app.get('/api/raw-transfers/next-no', auth, wrap(async (req, res) => {
  res.json({ ok: true, tg_no: await makeTgNo() });
}));
app.get('/api/raw-transfers', auth, wrap(async (req, res) => {
  const [rows] = await mysqlPool.query('SELECT * FROM raw_transfers ORDER BY id DESC');
  res.json({ ok: true, total: rows.length, transfers: rows });
}));
app.post('/api/raw-transfers', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const tg_no = await makeTgNo();
  const [info] = await mysqlPool.query(
    `INSERT INTO raw_transfers (tg_no, transfer_date, to_wh, remark, items_json)
     VALUES (:tg_no, :transfer_date, :to_wh, :remark, :items_json)`,
    {
      tg_no,
      transfer_date: b.transfer_date || '',
      to_wh: b.to_wh || '',
      remark: b.remark || '',
      items_json: JSON.stringify(Array.isArray(b.items) ? b.items : []),
    }
  );
  res.json({ ok: true, message: 'บันทึกเอกสารย้ายผ้าดิบแล้ว', id: info.insertId, tg_no });
}));

// ============================================================
//  เอกสารย้ายชั้นสินค้า (rack_transfers) — สแกน QR ม้วน → เก็บเข้าแร็ค (WMS)
//  เชื่อม fabric_rolls.location_id + log stock_transactions (เลข TK)
// ============================================================
async function makeTkNo() {
  const d = new Date();
  const prefix = 'TK' + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0');
  const [[{ n }]] = await mysqlPool.query('SELECT COUNT(*) AS n FROM rack_transfers WHERE tk_no LIKE ?', [prefix + '-%']);
  return `${prefix}-${String(n + 1).padStart(3, '0')}`;
}
app.get('/api/rack-transfers/next-no', auth, wrap(async (req, res) => {
  res.json({ ok: true, tk_no: await makeTkNo() });
}));
app.get('/api/rack-transfers', auth, wrap(async (req, res) => {
  const [rows] = await mysqlPool.query('SELECT * FROM rack_transfers ORDER BY id DESC');
  res.json({ ok: true, total: rows.length, transfers: rows });
}));
app.post('/api/rack-transfers', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const locCode = (b.location_code || '').toString().trim();
  const scans = Array.isArray(b.items) ? b.items : [];
  if (!locCode) return res.status(400).json({ ok: false, message: 'กรุณาระบุแร็คปลายทาง' });
  if (scans.length === 0) return res.status(400).json({ ok: false, message: 'กรุณาสแกนม้วนผ้าอย่างน้อย 1 ม้วน' });
  const [[loc]] = await mysqlPool.query('SELECT * FROM warehouse_locations WHERE location_qr = ? OR location_code = ?', [locCode, locCode]);
  if (!loc) return res.status(404).json({ ok: false, message: 'ไม่พบแร็ค/ช่องเก็บรหัส ' + locCode });

  let moved = 0;
  const notFound = [];
  for (const it of scans) {
    const rollQr = (it.roll_qr || it.barcode || '').toString().trim();
    if (!rollQr) continue;
    const [[roll]] = await mysqlPool.query('SELECT * FROM fabric_rolls WHERE roll_qr_code = ?', [rollQr]);
    if (!roll) { notFound.push(rollQr); continue; }
    const fromLoc = roll.location_id;
    await mysqlPool.query('UPDATE fabric_rolls SET location_id = ? WHERE roll_id = ?', [loc.location_id, roll.roll_id]);
    await mysqlPool.query(
      `INSERT INTO stock_transactions (roll_id, txn_type, yards_change, yards_before, yards_after, from_location_id, to_location_id, ref_type, ref_no, note, created_by)
       VALUES (:roll_id, 'move', 0, :y, :y, :from_loc, :to_loc, 'rack_transfer', :ref, :note, :by)`,
      { roll_id: roll.roll_id, y: roll.current_yards, from_loc: fromLoc, to_loc: loc.location_id, ref: '', note: 'ย้ายชั้นสินค้าเข้าแร็ค ' + loc.location_code, by: req.userId }
    );
    moved++;
  }
  const tk_no = await makeTkNo();
  const [info] = await mysqlPool.query(
    `INSERT INTO rack_transfers (tk_no, transfer_date, location_code, remark, items_json)
     VALUES (:tk_no, :transfer_date, :location_code, :remark, :items_json)`,
    { tk_no, transfer_date: b.transfer_date || '', location_code: loc.location_code, remark: b.remark || '', items_json: JSON.stringify(scans) }
  );
  res.json({ ok: true, message: `เก็บเข้าแร็ค ${loc.location_code} สำเร็จ ${moved} ม้วน` + (notFound.length ? ` (ไม่พบ ${notFound.length} ม้วน)` : ''), id: info.insertId, tk_no, moved, not_found: notFound });
}));

// ============================================================
//  เอกสารรับสินค้า VAT (vat_receipts) — เลข VN
// ============================================================
async function makeVnNo() {
  const d = new Date();
  const prefix = 'VN' + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0');
  const [[{ n }]] = await mysqlPool.query('SELECT COUNT(*) AS n FROM vat_receipts WHERE vn_no LIKE ?', [prefix + '-%']);
  return `${prefix}-${String(n + 1).padStart(3, '0')}`;
}
app.get('/api/vat-receipts/next-no', auth, wrap(async (req, res) => {
  res.json({ ok: true, vn_no: await makeVnNo() });
}));
app.get('/api/vat-receipts', auth, wrap(async (req, res) => {
  const [rows] = await mysqlPool.query('SELECT * FROM vat_receipts ORDER BY id DESC');
  res.json({ ok: true, total: rows.length, receipts: rows });
}));
app.post('/api/vat-receipts', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const vn_no = await makeVnNo();
  const [info] = await mysqlPool.query(
    `INSERT INTO vat_receipts (vn_no, receipt_date, vendor, ref_no, remark, subtotal, discount, vat, net_total, items_json)
     VALUES (:vn_no, :receipt_date, :vendor, :ref_no, :remark, :subtotal, :discount, :vat, :net_total, :items_json)`,
    {
      vn_no,
      receipt_date: b.receipt_date || '',
      vendor: b.vendor || '',
      ref_no: b.ref_no || '',
      remark: b.remark || '',
      subtotal: Number(b.subtotal) || 0,
      discount: Number(b.discount) || 0,
      vat: Number(b.vat) || 0,
      net_total: Number(b.net_total) || 0,
      items_json: JSON.stringify(Array.isArray(b.items) ? b.items : []),
    }
  );
  res.json({ ok: true, message: 'บันทึกเอกสารรับสินค้า VAT แล้ว', id: info.insertId, vn_no });
}));

// ============================================================
//  เอกสารตัดสต็อก VAT (vat_stock_cuts) — เลข VO
// ============================================================
async function makeVoNo() {
  const d = new Date();
  const prefix = 'VO' + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0');
  const [[{ n }]] = await mysqlPool.query('SELECT COUNT(*) AS n FROM vat_stock_cuts WHERE vo_no LIKE ?', [prefix + '-%']);
  return `${prefix}-${String(n + 1).padStart(3, '0')}`;
}
app.get('/api/vat-stock-cuts/next-no', auth, wrap(async (req, res) => {
  res.json({ ok: true, vo_no: await makeVoNo() });
}));
app.get('/api/vat-stock-cuts', auth, wrap(async (req, res) => {
  const [rows] = await mysqlPool.query('SELECT * FROM vat_stock_cuts ORDER BY id DESC');
  res.json({ ok: true, total: rows.length, cuts: rows });
}));
app.post('/api/vat-stock-cuts', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const vo_no = await makeVoNo();
  const [info] = await mysqlPool.query(
    `INSERT INTO vat_stock_cuts (vo_no, cut_date, source, invoice_ref, customer, sale_type, remark, total_qty, total_amount, items_json)
     VALUES (:vo_no, :cut_date, :source, :invoice_ref, :customer, :sale_type, :remark, :total_qty, :total_amount, :items_json)`,
    {
      vo_no,
      cut_date: b.cut_date || '',
      source: b.source || 'manual',
      invoice_ref: b.invoice_ref || '',
      customer: b.customer || '',
      sale_type: b.sale_type || '',
      remark: b.remark || '',
      total_qty: Number(b.total_qty) || 0,
      total_amount: Number(b.total_amount) || 0,
      items_json: JSON.stringify(Array.isArray(b.items) ? b.items : []),
    }
  );
  res.json({ ok: true, message: 'บันทึกเอกสารตัดสต็อก VAT แล้ว', id: info.insertId, vo_no });
}));

// ============================================================
//  ใบกำกับภาษี (vat_invoices) — เลข VT
// ============================================================
async function makeVtNo() {
  const d = new Date();
  const prefix = 'VT' + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0');
  const [[{ n }]] = await mysqlPool.query('SELECT COUNT(*) AS n FROM vat_invoices WHERE vt_no LIKE ?', [prefix + '%']);
  return `${prefix}${String(n + 1).padStart(4, '0')}`;
}
app.get('/api/vat-invoices/next-no', auth, wrap(async (req, res) => {
  res.json({ ok: true, vt_no: await makeVtNo() });
}));
app.get('/api/vat-invoices', auth, wrap(async (req, res) => {
  const [rows] = await mysqlPool.query('SELECT * FROM vat_invoices ORDER BY id DESC');
  res.json({ ok: true, total: rows.length, invoices: rows });
}));
app.post('/api/vat-invoices', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const vt_no = await makeVtNo();
  const [info] = await mysqlPool.query(
    `INSERT INTO vat_invoices (vt_no, invoice_date, customer, salesperson, account_term, bill_address, remark, subtotal, discount, vat, net_total, items_json)
     VALUES (:vt_no, :invoice_date, :customer, :salesperson, :account_term, :bill_address, :remark, :subtotal, :discount, :vat, :net_total, :items_json)`,
    {
      vt_no,
      invoice_date: b.invoice_date || '',
      customer: b.customer || '',
      salesperson: b.salesperson || '',
      account_term: b.account_term || '',
      bill_address: b.bill_address || '',
      remark: b.remark || '',
      subtotal: Number(b.subtotal) || 0,
      discount: Number(b.discount) || 0,
      vat: Number(b.vat) || 0,
      net_total: Number(b.net_total) || 0,
      items_json: JSON.stringify(Array.isArray(b.items) ? b.items : []),
    }
  );
  res.json({ ok: true, message: 'บันทึกใบกำกับภาษีแล้ว', id: info.insertId, vt_no });
}));

// ============================================================
//  กลุ่มสินค้า VAT ตามช่วงราคาขาย (vat_product_groups)
// ============================================================
app.get('/api/vat-product-groups', auth, wrap(async (req, res) => {
  const [rows] = await mysqlPool.query('SELECT * FROM vat_product_groups ORDER BY sort_order ASC, price_from ASC');
  res.json({ ok: true, total: rows.length, items: rows });
}));
app.post('/api/vat-product-groups', auth, wrap(async (req, res) => {
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  const conn = await mysqlPool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM vat_product_groups');
    let i = 0;
    for (const it of items) {
      await conn.query(
        'INSERT INTO vat_product_groups (price_from, price_to, group_name, sort_order) VALUES (?, ?, ?, ?)',
        [Number(it.price_from) || 0, Number(it.price_to) || 0, (it.group_name || '').toString().trim(), i++]
      );
    }
    await conn.commit();
    res.json({ ok: true, message: 'บันทึกกลุ่มสินค้า VAT แล้ว', total: items.length });
  } catch (e) {
    await conn.rollback();
    res.status(500).json({ ok: false, message: 'บันทึกไม่สำเร็จ: ' + e.message });
  } finally {
    conn.release();
  }
}));

// ============================================================
//  กลุ่มผ้าประจำ (fabric_regular_group) + เฉดสีของกลุ่ม
// ============================================================
app.get('/api/fabric-regular-group', auth, wrap(async (req, res) => {
  const [groups] = await mysqlPool.query('SELECT * FROM fabric_regular_group ORDER BY name ASC');
  const [shades] = await mysqlPool.query('SELECT id, group_id, name, fabric_cost, dye_cost FROM fabric_regular_group_shades ORDER BY id ASC');
  const byGroup = {};
  shades.forEach(s => { (byGroup[s.group_id] = byGroup[s.group_id] || []).push(s); });
  const items = groups.map(g => ({ ...g, shades: byGroup[g.id] || [], colors: (byGroup[g.id] || []).length }));
  res.json({ ok: true, total: items.length, items });
}));

app.post('/api/fabric-regular-group', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const name = (b.name || '').trim();
  if (!name) return res.status(400).json({ ok: false, message: 'กรุณากรอกชื่อกลุ่มผ้า' });
  const [info] = await mysqlPool.query(
    `INSERT INTO fabric_regular_group (name, width, weight, retail_price) VALUES (:name, :width, :weight, :retail_price)`,
    { name, width: b.width || '', weight: b.weight || '', retail_price: Number(b.retail_price) || 0 }
  );
  res.json({ ok: true, message: 'บันทึกกลุ่มผ้าแล้ว', id: info.insertId });
}));

app.put('/api/fabric-regular-group/:id', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const id = req.params.id;
  // อัปเดตข้อมูลกลุ่ม (ถ้าส่ง name มา)
  if (typeof b.name === 'string') {
    if (!b.name.trim()) return res.status(400).json({ ok: false, message: 'กรุณากรอกชื่อกลุ่มผ้า' });
    await mysqlPool.query(
      `UPDATE fabric_regular_group SET name = :name, width = :width, weight = :weight, retail_price = :retail_price WHERE id = :id`,
      { id, name: b.name.trim(), width: b.width || '', weight: b.weight || '', retail_price: Number(b.retail_price) || 0 }
    );
  }
  // แทนที่เฉดสีทั้งชุด (ถ้าส่ง shades มา) — ใช้ร่วมกับ shade modal เดิม
  if (Array.isArray(b.shades)) {
    await mysqlPool.query('DELETE FROM fabric_regular_group_shades WHERE group_id = ?', [id]);
    for (const s of b.shades) {
      const nm = (s.name || '').trim();
      if (!nm) continue;
      await mysqlPool.query(
        'INSERT INTO fabric_regular_group_shades (group_id, name, fabric_cost, dye_cost) VALUES (?, ?, ?, ?)',
        [id, nm, Number(s.fabric_cost) || 0, Number(s.dye_cost) || 0]
      );
    }
  }
  res.json({ ok: true, message: 'บันทึกแล้ว' });
}));

app.delete('/api/fabric-regular-group/:id', auth, wrap(async (req, res) => {
  await mysqlPool.query('DELETE FROM fabric_regular_group_shades WHERE group_id = ?', [req.params.id]);
  const [info] = await mysqlPool.query('DELETE FROM fabric_regular_group WHERE id = ?', [req.params.id]);
  if (info.affectedRows === 0) return res.status(404).json({ ok: false, message: 'ไม่พบกลุ่มผ้า' });
  res.json({ ok: true, message: 'ลบกลุ่มผ้าแล้ว' });
}));

// เฉดสีของกลุ่มผ้าประจำ (ใช้ร่วมกับ shade modal เดิม)
app.get('/api/fabric-regular-group/:id/shades', auth, wrap(async (req, res) => {
  const [shades] = await mysqlPool.query('SELECT * FROM fabric_regular_group_shades WHERE group_id = ? ORDER BY id ASC', [req.params.id]);
  res.json({ ok: true, shades });
}));
app.put('/api/fabric-regular-group/:id/shades', auth, wrap(async (req, res) => {
  const gid = Number(req.params.id);
  const rows = Array.isArray(req.body.shades) ? req.body.shades : [];
  await mysqlPool.query('DELETE FROM fabric_regular_group_shades WHERE group_id = ?', [gid]);
  for (const item of rows) {
    const name = (item.name || '').trim();
    if (!name) continue;
    await mysqlPool.query(
      'INSERT INTO fabric_regular_group_shades (group_id, name, fabric_cost, dye_cost) VALUES (?, ?, ?, ?)',
      [gid, name, Number(item.fabric_cost) || 0, Number(item.dye_cost) || 0]
    );
  }
  const [shades] = await mysqlPool.query('SELECT * FROM fabric_regular_group_shades WHERE group_id = ? ORDER BY id ASC', [gid]);
  res.json({ ok: true, message: 'บันทึกเฉดสีสำเร็จ', shades });
}));

// ============================================================
//  กลุ่มผ้าไม่ประจำ (fabric_irregular_group) + เฉดสีของกลุ่ม
// ============================================================
app.get('/api/fabric-irregular-group', auth, wrap(async (req, res) => {
  const [groups] = await mysqlPool.query('SELECT * FROM fabric_irregular_group ORDER BY name ASC');
  const [shades] = await mysqlPool.query('SELECT id, group_id, name, fabric_cost, dye_cost FROM fabric_irregular_group_shades ORDER BY id ASC');
  const byGroup = {};
  shades.forEach(s => { (byGroup[s.group_id] = byGroup[s.group_id] || []).push(s); });
  const items = groups.map(g => ({ ...g, shades: byGroup[g.id] || [], colors: (byGroup[g.id] || []).length }));
  res.json({ ok: true, total: items.length, items });
}));
app.post('/api/fabric-irregular-group', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const name = (b.name || '').trim();
  if (!name) return res.status(400).json({ ok: false, message: 'กรุณากรอกชื่อกลุ่มผ้า' });
  const [info] = await mysqlPool.query(
    `INSERT INTO fabric_irregular_group (name, width, weight, retail_price) VALUES (:name, :width, :weight, :retail_price)`,
    { name, width: b.width || '', weight: b.weight || '', retail_price: Number(b.retail_price) || 0 }
  );
  res.json({ ok: true, message: 'บันทึกกลุ่มผ้าแล้ว', id: info.insertId });
}));
app.put('/api/fabric-irregular-group/:id', auth, wrap(async (req, res) => {
  const b = req.body || {}; const id = req.params.id;
  if (typeof b.name === 'string') {
    if (!b.name.trim()) return res.status(400).json({ ok: false, message: 'กรุณากรอกชื่อกลุ่มผ้า' });
    await mysqlPool.query(
      `UPDATE fabric_irregular_group SET name = :name, width = :width, weight = :weight, retail_price = :retail_price WHERE id = :id`,
      { id, name: b.name.trim(), width: b.width || '', weight: b.weight || '', retail_price: Number(b.retail_price) || 0 }
    );
  }
  if (Array.isArray(b.shades)) {
    await mysqlPool.query('DELETE FROM fabric_irregular_group_shades WHERE group_id = ?', [id]);
    for (const s of b.shades) {
      const nm = (s.name || '').trim(); if (!nm) continue;
      await mysqlPool.query('INSERT INTO fabric_irregular_group_shades (group_id, name, fabric_cost, dye_cost) VALUES (?, ?, ?, ?)', [id, nm, Number(s.fabric_cost) || 0, Number(s.dye_cost) || 0]);
    }
  }
  res.json({ ok: true, message: 'บันทึกแล้ว' });
}));
app.delete('/api/fabric-irregular-group/:id', auth, wrap(async (req, res) => {
  await mysqlPool.query('DELETE FROM fabric_irregular_group_shades WHERE group_id = ?', [req.params.id]);
  const [info] = await mysqlPool.query('DELETE FROM fabric_irregular_group WHERE id = ?', [req.params.id]);
  if (info.affectedRows === 0) return res.status(404).json({ ok: false, message: 'ไม่พบกลุ่มผ้า' });
  res.json({ ok: true, message: 'ลบกลุ่มผ้าแล้ว' });
}));
app.get('/api/fabric-irregular-group/:id/shades', auth, wrap(async (req, res) => {
  const [shades] = await mysqlPool.query('SELECT * FROM fabric_irregular_group_shades WHERE group_id = ? ORDER BY id ASC', [req.params.id]);
  res.json({ ok: true, shades });
}));
app.put('/api/fabric-irregular-group/:id/shades', auth, wrap(async (req, res) => {
  const gid = Number(req.params.id);
  const rows = Array.isArray(req.body.shades) ? req.body.shades : [];
  await mysqlPool.query('DELETE FROM fabric_irregular_group_shades WHERE group_id = ?', [gid]);
  for (const item of rows) {
    const name = (item.name || '').trim(); if (!name) continue;
    await mysqlPool.query('INSERT INTO fabric_irregular_group_shades (group_id, name, fabric_cost, dye_cost) VALUES (?, ?, ?, ?)', [gid, name, Number(item.fabric_cost) || 0, Number(item.dye_cost) || 0]);
  }
  const [shades] = await mysqlPool.query('SELECT * FROM fabric_irregular_group_shades WHERE group_id = ? ORDER BY id ASC', [gid]);
  res.json({ ok: true, message: 'บันทึกเฉดสีสำเร็จ', shades });
}));

// ============================================================
//  ผ้าประจำ (fabrics)
// ============================================================
app.get('/api/fabrics', auth, wrap(async (req, res) => {
  const [fabrics] = await mysqlPool.query('SELECT * FROM fabrics ORDER BY id DESC');
  res.json({ ok: true, total: fabrics.length, fabrics });
}));

app.post('/api/fabrics', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const sku = (b.sku || '').trim();
  const type = (b.type || '').trim();
  const width = (b.width || '').trim();
  if (!sku || !type || !width) {
    return res.status(400).json({ ok: false, message: 'กรุณากรอกข้อมูลที่จำเป็น (ประเภท, รหัสสินค้า, หน้ากว้าง) ให้ครบถ้วน' });
  }

  const [existsRows] = await mysqlPool.query('SELECT id FROM fabrics WHERE sku = ?', [sku]);
  if (existsRows.length > 0) {
    return res.status(409).json({ ok: false, message: 'รหัสสินค้านี้มีอยู่แล้ว' });
  }

  const [info] = await mysqlPool.query(
    `INSERT INTO fabrics (sku, type, name, structure, composition, width, finishing, weight, unit, description, production_days, image_name, colors, substitute, active)
     VALUES (:sku, :type, :name, :structure, :composition, :width, :finishing, :weight, :unit, :description, :production_days, :image_name, :colors, :substitute, :active)`,
    {
      sku, type, width,
      name: b.name || '',
      structure: b.structure || '',
      composition: b.composition || '',
      finishing: b.finishing || '',
      weight: b.weight || '',
      unit: b.unit || 'หลา',
      description: b.description || '',
      production_days: b.production_days ? Number(b.production_days) : null,
      image_name: b.image_name || '',
      colors: b.colors ? Number(b.colors) : 1,
      substitute: b.substitute ? 1 : 0,
      active: b.active === false ? 0 : 1,
    }
  );

  const [rows] = await mysqlPool.query('SELECT * FROM fabrics WHERE id = ?', [info.insertId]);
  res.json({ ok: true, message: 'เพิ่มผ้าประจำสำเร็จ', fabric: rows[0] });
}));

// ผ้าประจำ — นำเข้าจาก Excel (upsert ตาม sku)
app.post('/api/fabrics/import', auth, wrap(async (req, res) => {
  const rows = Array.isArray(req.body.items) ? req.body.items : [];
  if (rows.length === 0) {
    return res.status(400).json({ ok: false, message: 'ไม่พบข้อมูลที่จะนำเข้า' });
  }

  const conn = await mysqlPool.getConnection();
  let imported = 0;
  try {
    await conn.beginTransaction();
    for (const item of rows) {
      const sku = String(item.sku || '').trim();
      if (!sku || sku === '-') continue;
      await conn.query(
        `INSERT INTO fabrics (sku, type, name, structure, composition, width, finishing, weight, unit, colors, image_name, active)
         VALUES (:sku, :type, :name, :structure, :composition, :width, :finishing, :weight, :unit, :colors, :image_name, 1)
         ON DUPLICATE KEY UPDATE
           type=VALUES(type), name=VALUES(name), structure=VALUES(structure), composition=VALUES(composition),
           width=VALUES(width), finishing=VALUES(finishing), weight=VALUES(weight), unit=VALUES(unit),
           colors=VALUES(colors), image_name=VALUES(image_name)`,
        {
          sku,
          type: item.type || '',
          name: item.name || '',
          structure: item.structure || '',
          composition: item.composition || '',
          width: item.width || '',
          finishing: item.finishing || '',
          weight: item.weight || '',
          unit: item.unit || 'หลา',
          colors: Number(item.colors) || 1,
          image_name: item.image_name || '',
        }
      );
      imported += 1;
    }
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }

  res.json({ ok: true, message: 'นำเข้าข้อมูลผ้าประจำสำเร็จ', imported });
}));

// ผ้าประจำ — แก้ไข
app.put('/api/fabrics/:id', auth, wrap(async (req, res) => {
  const id = Number(req.params.id);
  const [existRows] = await mysqlPool.query('SELECT id FROM fabrics WHERE id = ?', [id]);
  if (existRows.length === 0) {
    return res.status(404).json({ ok: false, message: 'ไม่พบรายการนี้' });
  }

  const b = req.body || {};
  const sku = (b.sku || '').trim();
  const type = (b.type || '').trim();
  const width = (b.width || '').trim();
  if (!sku || !type || !width) {
    return res.status(400).json({ ok: false, message: 'กรุณากรอกข้อมูลที่จำเป็น (ประเภท, รหัสสินค้า, หน้ากว้าง) ให้ครบถ้วน' });
  }

  const [dup] = await mysqlPool.query('SELECT id FROM fabrics WHERE sku = ? AND id != ?', [sku, id]);
  if (dup.length > 0) {
    return res.status(409).json({ ok: false, message: 'รหัสสินค้านี้มีอยู่แล้ว' });
  }

  await mysqlPool.query(
    `UPDATE fabrics SET
       sku=:sku, type=:type, name=:name, structure=:structure, composition=:composition,
       width=:width, finishing=:finishing, weight=:weight, unit=:unit, description=:description,
       production_days=:production_days, image_name=:image_name, colors=:colors,
       substitute=:substitute, active=:active
     WHERE id=:id`,
    {
      id, sku, type, width,
      name: b.name || '',
      structure: b.structure || '',
      composition: b.composition || '',
      finishing: b.finishing || '',
      weight: b.weight || '',
      unit: b.unit || 'หลา',
      description: b.description || '',
      production_days: b.production_days ? Number(b.production_days) : null,
      image_name: b.image_name || '',
      colors: b.colors ? Number(b.colors) : 1,
      substitute: b.substitute ? 1 : 0,
      active: b.active === false ? 0 : 1,
    }
  );

  const [rows] = await mysqlPool.query('SELECT * FROM fabrics WHERE id = ?', [id]);
  res.json({ ok: true, message: 'แก้ไขผ้าประจำสำเร็จ', fabric: rows[0] });
}));

// ผ้าประจำ — ลบ
app.delete('/api/fabrics/:id', auth, wrap(async (req, res) => {
  const id = Number(req.params.id);
  const [info] = await mysqlPool.query('DELETE FROM fabrics WHERE id = ?', [id]);
  if (info.affectedRows === 0) {
    return res.status(404).json({ ok: false, message: 'ไม่พบรายการนี้' });
  }
  res.json({ ok: true, message: 'ลบผ้าประจำสำเร็จ' });
}));

// เฉดสีของผ้าประจำ — รายการ
app.get('/api/fabrics/:fabricId/shades', auth, wrap(async (req, res) => {
  const fabricId = Number(req.params.fabricId);
  const [shades] = await mysqlPool.query('SELECT * FROM fabric_shades WHERE fabric_id = ? ORDER BY id ASC', [fabricId]);
  res.json({ ok: true, shades });
}));

// เฉดสีของผ้าประจำ — บันทึกทั้งหมด (แทนที่ของเดิม)
app.put('/api/fabrics/:fabricId/shades', auth, wrap(async (req, res) => {
  const fabricId = Number(req.params.fabricId);
  const [fab] = await mysqlPool.query('SELECT id FROM fabrics WHERE id = ?', [fabricId]);
  if (fab.length === 0) {
    return res.status(404).json({ ok: false, message: 'ไม่พบผ้าประจำนี้' });
  }

  const rows = Array.isArray(req.body.shades) ? req.body.shades : [];
  const conn = await mysqlPool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM fabric_shades WHERE fabric_id = ?', [fabricId]);
    for (const item of rows) {
      const name = (item.name || '').trim();
      if (!name) continue;
      await conn.query(
        'INSERT INTO fabric_shades (fabric_id, name, fabric_cost, dye_cost) VALUES (?, ?, ?, ?)',
        [fabricId, name, Number(item.fabric_cost) || 0, Number(item.dye_cost) || 0]
      );
    }
    const [[{ n }]] = await conn.query('SELECT COUNT(*) AS n FROM fabric_shades WHERE fabric_id = ?', [fabricId]);
    await conn.query('UPDATE fabrics SET colors = ? WHERE id = ?', [n, fabricId]);
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }

  const [shades] = await mysqlPool.query('SELECT * FROM fabric_shades WHERE fabric_id = ? ORDER BY id ASC', [fabricId]);
  res.json({ ok: true, message: 'บันทึกเฉดสีสำเร็จ', shades });
}));

// ============================================================
//  ผ้าไม่ประจำ (fabric_irregular)
// ============================================================
app.get('/api/fabric-irregular', auth, wrap(async (req, res) => {
  const [items] = await mysqlPool.query('SELECT * FROM fabric_irregular ORDER BY id DESC');
  res.json({ ok: true, total: items.length, items });
}));

app.post('/api/fabric-irregular', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const sku = (b.sku || '').trim();
  const type = (b.type || '').trim();
  const width = (b.width || '').trim();
  if (!sku || !type || !width) {
    return res.status(400).json({ ok: false, message: 'กรุณากรอกข้อมูลที่จำเป็น (ประเภท, รหัสสินค้า, หน้ากว้าง) ให้ครบถ้วน' });
  }

  const [existsRows] = await mysqlPool.query('SELECT id FROM fabric_irregular WHERE sku = ?', [sku]);
  if (existsRows.length > 0) {
    return res.status(409).json({ ok: false, message: 'รหัสสินค้านี้มีอยู่แล้ว' });
  }

  const [info] = await mysqlPool.query(
    `INSERT INTO fabric_irregular (sku, type, name, structure, composition, width, finishing, weight, unit, description, production_days, image_name, colors, substitute, active)
     VALUES (:sku, :type, :name, :structure, :composition, :width, :finishing, :weight, :unit, :description, :production_days, :image_name, :colors, :substitute, :active)`,
    {
      sku, type, width,
      name: b.name || '',
      structure: b.structure || '',
      composition: b.composition || '',
      finishing: b.finishing || '',
      weight: b.weight || '',
      unit: b.unit || 'หลา',
      description: b.description || '',
      production_days: b.production_days ? Number(b.production_days) : null,
      image_name: b.image_name || '',
      colors: b.colors ? Number(b.colors) : 1,
      substitute: b.substitute ? 1 : 0,
      active: b.active === false ? 0 : 1,
    }
  );

  const [rows] = await mysqlPool.query('SELECT * FROM fabric_irregular WHERE id = ?', [info.insertId]);
  res.json({ ok: true, message: 'เพิ่มผ้าไม่ประจำสำเร็จ', item: rows[0] });
}));

app.put('/api/fabric-irregular/:id', auth, wrap(async (req, res) => {
  const id = Number(req.params.id);
  const [existRows] = await mysqlPool.query('SELECT id FROM fabric_irregular WHERE id = ?', [id]);
  if (existRows.length === 0) {
    return res.status(404).json({ ok: false, message: 'ไม่พบรายการนี้' });
  }

  const b = req.body || {};
  const sku = (b.sku || '').trim();
  const type = (b.type || '').trim();
  const width = (b.width || '').trim();
  if (!sku || !type || !width) {
    return res.status(400).json({ ok: false, message: 'กรุณากรอกข้อมูลที่จำเป็น (ประเภท, รหัสสินค้า, หน้ากว้าง) ให้ครบถ้วน' });
  }

  const [dup] = await mysqlPool.query('SELECT id FROM fabric_irregular WHERE sku = ? AND id != ?', [sku, id]);
  if (dup.length > 0) {
    return res.status(409).json({ ok: false, message: 'รหัสสินค้านี้มีอยู่แล้ว' });
  }

  await mysqlPool.query(
    `UPDATE fabric_irregular SET
       sku=:sku, type=:type, name=:name, structure=:structure, composition=:composition,
       width=:width, finishing=:finishing, weight=:weight, unit=:unit, description=:description,
       production_days=:production_days, image_name=:image_name, colors=:colors,
       substitute=:substitute, active=:active
     WHERE id=:id`,
    {
      id, sku, type, width,
      name: b.name || '',
      structure: b.structure || '',
      composition: b.composition || '',
      finishing: b.finishing || '',
      weight: b.weight || '',
      unit: b.unit || 'หลา',
      description: b.description || '',
      production_days: b.production_days ? Number(b.production_days) : null,
      image_name: b.image_name || '',
      colors: b.colors ? Number(b.colors) : 1,
      substitute: b.substitute ? 1 : 0,
      active: b.active === false ? 0 : 1,
    }
  );

  const [rows] = await mysqlPool.query('SELECT * FROM fabric_irregular WHERE id = ?', [id]);
  res.json({ ok: true, message: 'แก้ไขผ้าไม่ประจำสำเร็จ', item: rows[0] });
}));

app.delete('/api/fabric-irregular/:id', auth, wrap(async (req, res) => {
  const id = Number(req.params.id);
  const [info] = await mysqlPool.query('DELETE FROM fabric_irregular WHERE id = ?', [id]);
  if (info.affectedRows === 0) {
    return res.status(404).json({ ok: false, message: 'ไม่พบรายการนี้' });
  }
  res.json({ ok: true, message: 'ลบผ้าไม่ประจำสำเร็จ' });
}));

// เฉดสีของผ้าไม่ประจำ — รายการ
app.get('/api/fabric-irregular/:itemId/shades', auth, wrap(async (req, res) => {
  const itemId = Number(req.params.itemId);
  const [shades] = await mysqlPool.query('SELECT * FROM fabric_irregular_shades WHERE item_id = ? ORDER BY id ASC', [itemId]);
  res.json({ ok: true, shades });
}));

// เฉดสีของผ้าไม่ประจำ — บันทึกทั้งหมด (แทนที่ของเดิม)
app.put('/api/fabric-irregular/:itemId/shades', auth, wrap(async (req, res) => {
  const itemId = Number(req.params.itemId);
  const [item] = await mysqlPool.query('SELECT id FROM fabric_irregular WHERE id = ?', [itemId]);
  if (item.length === 0) {
    return res.status(404).json({ ok: false, message: 'ไม่พบผ้าไม่ประจำนี้' });
  }

  const rows = Array.isArray(req.body.shades) ? req.body.shades : [];
  const conn = await mysqlPool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM fabric_irregular_shades WHERE item_id = ?', [itemId]);
    for (const row of rows) {
      const name = (row.name || '').trim();
      if (!name) continue;
      await conn.query(
        'INSERT INTO fabric_irregular_shades (item_id, name, fabric_cost, dye_cost) VALUES (?, ?, ?, ?)',
        [itemId, name, Number(row.fabric_cost) || 0, Number(row.dye_cost) || 0]
      );
    }
    const [[{ n }]] = await conn.query('SELECT COUNT(*) AS n FROM fabric_irregular_shades WHERE item_id = ?', [itemId]);
    await conn.query('UPDATE fabric_irregular SET colors = ? WHERE id = ?', [n, itemId]);
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }

  const [shades] = await mysqlPool.query('SELECT * FROM fabric_irregular_shades WHERE item_id = ? ORDER BY id ASC', [itemId]);
  res.json({ ok: true, message: 'บันทึกเฉดสีสำเร็จ', shades });
}));

// ============================================================
//  ข้อมูลผ้า (Excel) — fabric_master
// ============================================================
app.get('/api/fabric-master', auth, wrap(async (req, res) => {
  const [items] = await mysqlPool.query('SELECT * FROM fabric_master ORDER BY id DESC');
  res.json({ ok: true, total: items.length, items });
}));

app.post('/api/fabric-master/import', auth, wrap(async (req, res) => {
  const rows = Array.isArray(req.body.items) ? req.body.items : [];
  if (rows.length === 0) {
    return res.status(400).json({ ok: false, message: 'ไม่พบข้อมูลที่จะนำเข้า' });
  }

  const conn = await mysqlPool.getConnection();
  let imported = 0;
  try {
    await conn.beginTransaction();
    for (const item of rows) {
      const item_code = String(item.item_code || '').trim();
      if (!item_code) continue;
      const price = Number(item.price) || 0;
      const price_vat = item.price_vat !== null && item.price_vat !== undefined && item.price_vat !== ''
        ? Number(item.price_vat)
        : Math.round(price * 1.07 * 100) / 100;
      await conn.query(
        `INSERT INTO fabric_master (item_code, fabric_type, fabric_name, description, contract_no, weaving, structure, yc_shade, price, price_vat)
         VALUES (:item_code, :fabric_type, :fabric_name, :description, :contract_no, :weaving, :structure, :yc_shade, :price, :price_vat)
         ON DUPLICATE KEY UPDATE
           fabric_type=VALUES(fabric_type), fabric_name=VALUES(fabric_name), description=VALUES(description),
           contract_no=VALUES(contract_no), weaving=VALUES(weaving), structure=VALUES(structure),
           yc_shade=VALUES(yc_shade), price=VALUES(price), price_vat=VALUES(price_vat)`,
        {
          item_code,
          fabric_type: item.fabric_type || '',
          fabric_name: item.fabric_name || '',
          description: item.description || '',
          contract_no: item.contract_no || '',
          weaving: item.weaving || '',
          structure: item.structure || '',
          yc_shade: item.yc_shade || '',
          price,
          price_vat,
        }
      );
      imported += 1;
    }
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }

  res.json({ ok: true, message: 'นำเข้าข้อมูลสำเร็จ', imported });
}));

// ============================================================
//  ข้อมูลลูกค้า (Excel) — customer_master
// ============================================================
app.get('/api/customer-master', auth, wrap(async (req, res) => {
  const [items] = await mysqlPool.query('SELECT * FROM customer_master ORDER BY id DESC');
  res.json({ ok: true, total: items.length, items });
}));

app.post('/api/customer-master/import', auth, wrap(async (req, res) => {
  const rows = Array.isArray(req.body.items) ? req.body.items : [];
  if (rows.length === 0) {
    return res.status(400).json({ ok: false, message: 'ไม่พบข้อมูลที่จะนำเข้า' });
  }

  const conn = await mysqlPool.getConnection();
  let imported = 0;
  const duplicates = [];
  try {
    await conn.beginTransaction();
    for (const item of rows) {
      const customer_code = String(item.customer_code || '').trim();
      if (!customer_code) continue;
      const [existRows] = await conn.query('SELECT id FROM customer_master WHERE customer_code = ?', [customer_code]);
      if (existRows.length > 0) {
        duplicates.push(customer_code);
        continue;
      }
      await conn.query(
        'INSERT INTO customer_master (customer_code, customer_name, address) VALUES (?, ?, ?)',
        [customer_code, item.customer_name || '', item.address || '']
      );
      imported += 1;
    }
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }

  res.json({ ok: true, message: 'นำเข้าข้อมูลสำเร็จ', imported, duplicates });
}));

app.put('/api/customer-master/:id', auth, wrap(async (req, res) => {
  const id = Number(req.params.id);
  const [existRows] = await mysqlPool.query('SELECT id FROM customer_master WHERE id = ?', [id]);
  if (existRows.length === 0) {
    return res.status(404).json({ ok: false, message: 'ไม่พบรายการนี้' });
  }

  const b = req.body || {};
  const customer_code = (b.customer_code || '').trim();
  if (!customer_code) {
    return res.status(400).json({ ok: false, message: 'กรุณากรอกรหัสลูกค้า' });
  }

  const [dup] = await mysqlPool.query('SELECT id FROM customer_master WHERE customer_code = ? AND id != ?', [customer_code, id]);
  if (dup.length > 0) {
    return res.status(409).json({ ok: false, message: 'รหัสลูกค้านี้มีอยู่แล้ว' });
  }

  await mysqlPool.query(
    'UPDATE customer_master SET customer_code=:customer_code, customer_name=:customer_name, address=:address WHERE id=:id',
    { id, customer_code, customer_name: b.customer_name || '', address: b.address || '' }
  );

  const [rows] = await mysqlPool.query('SELECT * FROM customer_master WHERE id = ?', [id]);
  res.json({ ok: true, message: 'แก้ไขข้อมูลลูกค้าสำเร็จ', item: rows[0] });
}));

app.delete('/api/customer-master/:id', auth, wrap(async (req, res) => {
  const id = Number(req.params.id);
  const [info] = await mysqlPool.query('DELETE FROM customer_master WHERE id = ?', [id]);
  if (info.affectedRows === 0) {
    return res.status(404).json({ ok: false, message: 'ไม่พบรายการนี้' });
  }
  res.json({ ok: true, message: 'ลบข้อมูลลูกค้าสำเร็จ' });
}));

// ============================================================
//  ลูกค้า (customers) — ข้อมูลร้านค้า
// ============================================================
const CUSTOMER_FIELDS = ['code', 'company_name', 'contact', 'phone', 'address', 'province', 'customer_group', 'zone', 'account_terms', 'cash_terms', 'currency', 'credit_limit', 'salesperson', 'tax_id'];

function pickCustomer(b) {
  return {
    code: (b.code || '').toString().trim(),
    company_name: (b.company_name || '').toString().trim(),
    contact: (b.contact || '').toString().trim(),
    phone: (b.phone || '').toString().trim(),
    address: (b.address || '').toString().trim(),
    province: (b.province || '').toString().trim(),
    customer_group: (b.customer_group || '').toString().trim(),
    zone: (b.zone || '').toString().trim(),
    account_terms: (b.account_terms || '').toString().trim(),
    cash_terms: (b.cash_terms || '').toString().trim(),
    currency: (b.currency || 'THB').toString().trim() || 'THB',
    credit_limit: (b.credit_limit || '').toString().trim(),
    salesperson: (b.salesperson || '').toString().trim(),
    tax_id: (b.tax_id || '').toString().trim(),
  };
}

app.get('/api/customers', auth, wrap(async (req, res) => {
  const [customers] = await mysqlPool.query('SELECT * FROM customers ORDER BY id DESC');
  res.json({ ok: true, total: customers.length, customers });
}));

app.post('/api/customers', auth, wrap(async (req, res) => {
  const c = pickCustomer(req.body || {});
  if (!c.company_name) {
    return res.status(400).json({ ok: false, message: 'กรุณากรอกชื่อบริษัท' });
  }
  if (c.code) {
    const [dup] = await mysqlPool.query('SELECT id FROM customers WHERE code = ?', [c.code]);
    if (dup.length > 0) return res.status(409).json({ ok: false, message: 'รหัสลูกค้านี้มีอยู่แล้ว' });
  }
  const [info] = await mysqlPool.query(
    `INSERT INTO customers (code, company_name, contact, phone, address, province, customer_group, zone, account_terms, cash_terms, currency, credit_limit, salesperson, tax_id)
     VALUES (:code, :company_name, :contact, :phone, :address, :province, :customer_group, :zone, :account_terms, :cash_terms, :currency, :credit_limit, :salesperson, :tax_id)`,
    c
  );
  const [rows] = await mysqlPool.query('SELECT * FROM customers WHERE id = ?', [info.insertId]);
  res.json({ ok: true, message: 'เพิ่มลูกค้าสำเร็จ', customer: rows[0] });
}));

app.put('/api/customers/:id', auth, wrap(async (req, res) => {
  const id = Number(req.params.id);
  const [existRows] = await mysqlPool.query('SELECT id FROM customers WHERE id = ?', [id]);
  if (existRows.length === 0) return res.status(404).json({ ok: false, message: 'ไม่พบรายการนี้' });

  const c = pickCustomer(req.body || {});
  if (!c.company_name) return res.status(400).json({ ok: false, message: 'กรุณากรอกชื่อบริษัท' });
  if (c.code) {
    const [dup] = await mysqlPool.query('SELECT id FROM customers WHERE code = ? AND id != ?', [c.code, id]);
    if (dup.length > 0) return res.status(409).json({ ok: false, message: 'รหัสลูกค้านี้มีอยู่แล้ว' });
  }
  await mysqlPool.query(
    `UPDATE customers SET code=:code, company_name=:company_name, contact=:contact, phone=:phone, address=:address,
       province=:province, customer_group=:customer_group, zone=:zone, account_terms=:account_terms, cash_terms=:cash_terms,
       currency=:currency, credit_limit=:credit_limit, salesperson=:salesperson, tax_id=:tax_id WHERE id=:id`,
    { ...c, id }
  );
  const [rows] = await mysqlPool.query('SELECT * FROM customers WHERE id = ?', [id]);
  res.json({ ok: true, message: 'แก้ไขลูกค้าสำเร็จ', customer: rows[0] });
}));

app.delete('/api/customers/:id', auth, wrap(async (req, res) => {
  const id = Number(req.params.id);
  const [info] = await mysqlPool.query('DELETE FROM customers WHERE id = ?', [id]);
  if (info.affectedRows === 0) return res.status(404).json({ ok: false, message: 'ไม่พบรายการนี้' });
  res.json({ ok: true, message: 'ลบลูกค้าสำเร็จ' });
}));

// ลูกค้า — นำเข้าจำนวนมาก (upsert ตาม code ถ้ามี, ไม่มี code ก็ insert ใหม่)
app.post('/api/customers/import', auth, wrap(async (req, res) => {
  const rows = Array.isArray(req.body.items) ? req.body.items : [];
  if (rows.length === 0) return res.status(400).json({ ok: false, message: 'ไม่พบข้อมูลที่จะนำเข้า' });

  const conn = await mysqlPool.getConnection();
  let imported = 0;
  try {
    await conn.beginTransaction();
    for (const item of rows) {
      const c = pickCustomer(item);
      if (!c.company_name && !c.code) continue;
      if (c.code) {
        await conn.query(
          `INSERT INTO customers (code, company_name, contact, phone, address, province, customer_group, zone, account_terms, cash_terms, currency, credit_limit, salesperson, tax_id)
           VALUES (:code, :company_name, :contact, :phone, :address, :province, :customer_group, :zone, :account_terms, :cash_terms, :currency, :credit_limit, :salesperson, :tax_id)
           ON DUPLICATE KEY UPDATE
             company_name=VALUES(company_name), contact=VALUES(contact), phone=VALUES(phone), address=VALUES(address),
             province=VALUES(province), customer_group=VALUES(customer_group), zone=VALUES(zone), account_terms=VALUES(account_terms),
             cash_terms=VALUES(cash_terms), currency=VALUES(currency), credit_limit=VALUES(credit_limit),
             salesperson=VALUES(salesperson), tax_id=VALUES(tax_id)`,
          c
        );
      } else {
        await conn.query(
          `INSERT INTO customers (company_name, contact, phone, address, province, customer_group, zone, account_terms, cash_terms, currency, credit_limit, salesperson, tax_id)
           VALUES (:company_name, :contact, :phone, :address, :province, :customer_group, :zone, :account_terms, :cash_terms, :currency, :credit_limit, :salesperson, :tax_id)`,
          c
        );
      }
      imported += 1;
    }
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
  res.json({ ok: true, message: 'นำเข้าข้อมูลลูกค้าสำเร็จ', imported });
}));

// ============================================================
//  คลังผ้า (WMS) — ตำแหน่งจัดเก็บ
// ============================================================
app.get('/api/warehouse-locations', auth, wrap(async (req, res) => {
  const [locations] = await mysqlPool.query(
    'SELECT * FROM warehouse_locations WHERE is_active = 1 ORDER BY location_code ASC'
  );
  res.json({ ok: true, total: locations.length, locations });
}));

// สร้างช่องสินค้าใหม่ (+ QR)
app.post('/api/warehouse-locations', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const code = (b.location_code || '').trim();
  if (!code) return res.status(400).json({ ok: false, message: 'กรุณากรอกรหัสช่อง' });
  const [dup] = await mysqlPool.query('SELECT location_id FROM warehouse_locations WHERE location_code = ?', [code]);
  if (dup.length > 0) return res.status(409).json({ ok: false, message: 'รหัสช่องนี้มีอยู่แล้ว' });
  const [info] = await mysqlPool.query(
    `INSERT INTO warehouse_locations (location_code, zone, rack, bin, location_qr, capacity_rolls)
     VALUES (:location_code, :zone, :rack, :bin, :location_qr, :capacity_rolls)`,
    {
      location_code: code,
      zone: (b.zone || '').trim(),
      rack: (b.rack || '').trim(),
      bin: (b.bin || '').trim(),
      location_qr: (b.location_qr || ('LOC-' + code)).trim(),
      capacity_rolls: b.capacity_rolls ? Number(b.capacity_rolls) : null,
    }
  );
  const [[loc]] = await mysqlPool.query('SELECT * FROM warehouse_locations WHERE location_id = ?', [info.insertId]);
  res.json({ ok: true, message: 'สร้างช่องสินค้าสำเร็จ', location: loc });
}));

// แก้ไขช่องสินค้า
app.put('/api/warehouse-locations/:id', auth, wrap(async (req, res) => {
  const id = Number(req.params.id);
  const [exist] = await mysqlPool.query('SELECT location_id FROM warehouse_locations WHERE location_id = ?', [id]);
  if (exist.length === 0) return res.status(404).json({ ok: false, message: 'ไม่พบช่องนี้' });
  const b = req.body || {};
  const code = (b.location_code || '').trim();
  if (!code) return res.status(400).json({ ok: false, message: 'กรุณากรอกรหัสช่อง' });
  const [dup] = await mysqlPool.query('SELECT location_id FROM warehouse_locations WHERE location_code = ? AND location_id != ?', [code, id]);
  if (dup.length > 0) return res.status(409).json({ ok: false, message: 'รหัสช่องนี้มีอยู่แล้ว' });
  await mysqlPool.query(
    `UPDATE warehouse_locations SET location_code=:code, zone=:zone, rack=:rack, bin=:bin, location_qr=:qr WHERE location_id=:id`,
    {
      id, code,
      zone: (b.zone || '').trim(), rack: (b.rack || '').trim(), bin: (b.bin || '').trim(),
      location_qr: (b.location_qr || ('LOC-' + code)).trim(),
    }
  );
  const [[loc]] = await mysqlPool.query('SELECT * FROM warehouse_locations WHERE location_id = ?', [id]);
  res.json({ ok: true, message: 'แก้ไขช่องสินค้าสำเร็จ', location: loc });
}));

// ลบช่องสินค้า (ลบได้เฉพาะช่องที่ไม่มีผ้าค้างอยู่)
app.delete('/api/warehouse-locations/:id', auth, wrap(async (req, res) => {
  const id = Number(req.params.id);
  const [[{ n }]] = await mysqlPool.query(
    "SELECT COUNT(*) AS n FROM fabric_rolls WHERE location_id = ? AND status <> 'depleted'", [id]
  );
  if (n > 0) {
    return res.status(409).json({ ok: false, message: `ช่องนี้มีผ้าอยู่ ${n} ม้วน — ต้องย้ายผ้าออกก่อนจึงจะลบได้` });
  }
  const [info] = await mysqlPool.query('DELETE FROM warehouse_locations WHERE location_id = ?', [id]);
  if (info.affectedRows === 0) return res.status(404).json({ ok: false, message: 'ไม่พบช่องนี้' });
  res.json({ ok: true, message: 'ลบช่องสินค้าสำเร็จ' });
}));

// ผังคลัง — ช่องทั้งหมดพร้อมม้วนผ้าที่อยู่ในแต่ละช่อง (+ ม้วนที่ยังไม่จัดเก็บ)
app.get('/api/warehouse-map', auth, wrap(async (req, res) => {
  const [locations] = await mysqlPool.query('SELECT * FROM warehouse_locations WHERE is_active = 1 ORDER BY location_code ASC');
  const [rolls] = await mysqlPool.query(`
    SELECT r.roll_id, r.roll_qr_code, r.location_id, r.lot_no, r.current_yards, r.initial_yards, r.status,
           f.sku AS product_sku, f.name AS product_name, s.name AS color_name
    FROM fabric_rolls r
    LEFT JOIN fabrics f ON f.id = r.product_id
    LEFT JOIN fabric_shades s ON s.id = r.color_id
    WHERE r.status <> 'depleted'
    ORDER BY r.roll_id ASC
  `);
  const byLoc = new Map();
  const unassigned = [];
  rolls.forEach((r) => {
    if (r.location_id == null) { unassigned.push(r); return; }
    if (!byLoc.has(r.location_id)) byLoc.set(r.location_id, []);
    byLoc.get(r.location_id).push(r);
  });
  const result = locations.map((l) => {
    const rs = byLoc.get(l.location_id) || [];
    return {
      ...l,
      rolls: rs,
      total_rolls: rs.length,
      total_yards: rs.reduce((s, x) => s + Number(x.current_yards || 0), 0),
    };
  });
  res.json({ ok: true, locations: result, unassigned });
}));

// ค้นหาม้วนผ้าจาก QR (สำหรับ scanner)
app.get('/api/fabric-rolls/lookup', auth, wrap(async (req, res) => {
  const qr = (req.query.qr || '').toString().trim();
  if (!qr) return res.status(400).json({ ok: false, message: 'ไม่มีรหัส QR' });
  const [[roll]] = await mysqlPool.query(`
    SELECT r.*, f.sku AS product_sku, f.name AS product_name, f.type AS product_type,
           f.width AS product_width, f.weight AS product_weight, f.unit AS product_unit, f.image_name AS product_image,
           s.name AS color_name, l.location_code, l.zone AS location_zone, l.rack AS location_rack
    FROM fabric_rolls r
    LEFT JOIN fabrics f ON f.id = r.product_id
    LEFT JOIN fabric_shades s ON s.id = r.color_id
    LEFT JOIN warehouse_locations l ON l.location_id = r.location_id
    WHERE r.roll_qr_code = ?
  `, [qr]);
  if (!roll) return res.status(404).json({ ok: false, message: 'ไม่พบม้วนผ้ารหัสนี้' });
  res.json({ ok: true, roll });
}));

// สแกนจัดเก็บ (Putaway) — สแกน QR ช่อง + QR ไม้ผ้า -> อัปเดต location_id
app.post('/api/fabric-rolls/putaway', auth, wrap(async (req, res) => {
  const rollQr = (req.body.roll_qr || '').toString().trim();
  const locQr = (req.body.location_qr || '').toString().trim();
  if (!rollQr || !locQr) return res.status(400).json({ ok: false, message: 'ต้องสแกนทั้ง QR ช่อง และ QR ไม้ผ้า' });

  const [[roll]] = await mysqlPool.query('SELECT * FROM fabric_rolls WHERE roll_qr_code = ?', [rollQr]);
  if (!roll) return res.status(404).json({ ok: false, message: 'ไม่พบม้วนผ้ารหัส ' + rollQr });
  const [[loc]] = await mysqlPool.query('SELECT * FROM warehouse_locations WHERE location_qr = ? OR location_code = ?', [locQr, locQr]);
  if (!loc) return res.status(404).json({ ok: false, message: 'ไม่พบช่องสินค้ารหัส ' + locQr });

  const fromLoc = roll.location_id;
  await mysqlPool.query('UPDATE fabric_rolls SET location_id = ? WHERE roll_id = ?', [loc.location_id, roll.roll_id]);
  await mysqlPool.query(
    `INSERT INTO stock_transactions (roll_id, txn_type, yards_change, yards_before, yards_after, from_location_id, to_location_id, ref_type, note, created_by)
     VALUES (:roll_id, 'move', 0, :y, :y, :from_loc, :to_loc, 'putaway', :note, :by)`,
    { roll_id: roll.roll_id, y: roll.current_yards, from_loc: fromLoc, to_loc: loc.location_id, note: 'สแกนจัดเก็บ', by: req.userId }
  );
  res.json({ ok: true, message: `จัดเก็บ ${rollQr} เข้าช่อง ${loc.location_code} สำเร็จ`, roll_id: roll.roll_id, location_code: loc.location_code });
}));

// สแกนตัดหลา (Deduction) — สแกน QR ไม้ผ้า + จำนวนหลาที่ตัด -> อัปเดต current_yards
app.post('/api/fabric-rolls/cut', auth, wrap(async (req, res) => {
  const rollQr = (req.body.roll_qr || '').toString().trim();
  const yards = Number(req.body.yards);
  if (!rollQr || !(yards > 0)) return res.status(400).json({ ok: false, message: 'ต้องระบุ QR ไม้ผ้า และจำนวนหลาที่ตัด (> 0)' });

  const [[roll]] = await mysqlPool.query('SELECT * FROM fabric_rolls WHERE roll_qr_code = ?', [rollQr]);
  if (!roll) return res.status(404).json({ ok: false, message: 'ไม่พบม้วนผ้ารหัส ' + rollQr });

  const before = Number(roll.current_yards);
  if (yards > before) return res.status(400).json({ ok: false, message: `ตัดเกินหลาคงเหลือ (เหลือ ${before} หลา)` });
  const after = Math.round((before - yards) * 100) / 100;
  const newStatus = after <= 0 ? 'depleted' : (roll.status === 'available' ? 'in_use' : roll.status);

  await mysqlPool.query('UPDATE fabric_rolls SET current_yards = ?, status = ? WHERE roll_id = ?', [after, newStatus, roll.roll_id]);
  await mysqlPool.query(
    `INSERT INTO stock_transactions (roll_id, txn_type, yards_change, yards_before, yards_after, from_location_id, ref_type, ref_no, note, created_by)
     VALUES (:roll_id, 'cut', :change, :before, :after, :loc, 'cut', :ref, :note, :by)`,
    { roll_id: roll.roll_id, change: -yards, before, after, loc: roll.location_id, ref: (req.body.ref_no || '').toString().trim(), note: (req.body.note || 'สแกนตัดหลา').toString().trim(), by: req.userId }
  );
  res.json({ ok: true, message: `ตัด ${yards} หลาจาก ${rollQr} — คงเหลือ ${after} หลา`, roll_id: roll.roll_id, current_yards: after, status: newStatus });
}));

// ประวัติเคลื่อนไหวสต็อก (audit trail) — พร้อมข้อมูลผ้า/ช่อง/ผู้ทำรายการ
app.get('/api/stock-transactions', auth, wrap(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 1000, 5000);
  const [txns] = await mysqlPool.query(`
    SELECT t.txn_id, t.txn_type, t.yards_change, t.yards_before, t.yards_after,
           t.ref_type, t.ref_no, t.note, t.created_at,
           r.roll_qr_code, f.sku AS product_sku, f.name AS product_name, s.name AS color_name,
           lf.location_code AS from_code, lt.location_code AS to_code, u.name AS user_name
    FROM stock_transactions t
    LEFT JOIN fabric_rolls r ON r.roll_id = t.roll_id
    LEFT JOIN fabrics f ON f.id = r.product_id
    LEFT JOIN fabric_shades s ON s.id = r.color_id
    LEFT JOIN warehouse_locations lf ON lf.location_id = t.from_location_id
    LEFT JOIN warehouse_locations lt ON lt.location_id = t.to_location_id
    LEFT JOIN users u ON u.id = t.created_by
    ORDER BY t.txn_id DESC
    LIMIT ?
  `, [limit]);
  res.json({ ok: true, total: txns.length, transactions: txns });
}));

// ผ้าใกล้หมด (current_yards < threshold) — สำหรับแจ้งเตือนหน้าแดชบอร์ด
app.get('/api/low-stock', auth, wrap(async (req, res) => {
  const threshold = Number(req.query.threshold) || 50;
  const [rolls] = await mysqlPool.query(`
    SELECT r.roll_id, r.roll_qr_code, r.current_yards, r.initial_yards, r.lot_no,
           f.sku AS product_sku, f.name AS product_name, s.name AS color_name, l.location_code
    FROM fabric_rolls r
    LEFT JOIN fabrics f ON f.id = r.product_id
    LEFT JOIN fabric_shades s ON s.id = r.color_id
    LEFT JOIN warehouse_locations l ON l.location_id = r.location_id
    WHERE r.status <> 'depleted' AND r.current_yards < ?
    ORDER BY r.current_yards ASC
  `, [threshold]);
  res.json({ ok: true, threshold, total: rolls.length, rolls });
}));

// ------------------------------------------------------------
//  WMS — บาร์โค้ดผ้า (รหัส+สี) : รูปแบบ = product(5) + color(5)
// ------------------------------------------------------------
function fabricBarcode(productId, colorId) {
  return String(productId || 0).padStart(5, '0') + String(colorId || 0).padStart(5, '0');
}

// หาสินค้าจาก sku (ผ้าประจำก่อน แล้วผ้าไม่ประจำ)
async function resolveProductBySku(conn, sku) {
  const [[reg]] = await conn.query('SELECT id, sku, name FROM fabrics WHERE sku = ?', [sku]);
  if (reg) return { ...reg, source: 'reg' };
  const [[irr]] = await conn.query('SELECT id, sku, name FROM fabric_irregular WHERE sku = ?', [sku]);
  if (irr) return { ...irr, source: 'irr' };
  return null;
}

// ยอดคงเหลือรวมของผ้า (product+color) จาก fabric_rolls — สำหรับ "จำนวนที่ใช้ได้" แบบเรียลไทม์
app.get('/api/fabric-stock', auth, wrap(async (req, res) => {
  const sku = (req.query.sku || '').toString().trim();
  const colorId = req.query.color_id ? Number(req.query.color_id) : null;
  if (!sku) return res.status(400).json({ ok: false, message: 'ต้องระบุ sku' });
  const prod = await resolveProductBySku(mysqlPool, sku);
  if (!prod) return res.json({ ok: true, sku, available: 0, rolls: 0, barcode: '' });
  const params = [prod.id];
  let where = "product_id = ? AND status <> 'depleted' AND current_yards > 0";
  if (colorId) { where += ' AND color_id = ?'; params.push(colorId); }
  const [[agg]] = await mysqlPool.query(
    `SELECT COALESCE(SUM(current_yards),0) AS available, COUNT(*) AS rolls FROM fabric_rolls WHERE ${where}`, params
  );
  res.json({ ok: true, sku, product_id: prod.id, available: Number(agg.available), rolls: agg.rolls, barcode: fabricBarcode(prod.id, colorId) });
}));

// ------------------------------------------------------------
//  WMS — ตัดจ่ายออเดอร์ (Goods Issue) : ยิงบาร์โค้ดผ้า -> ตัด FIFO จากสต็อกรวม
//  body: { order_id, order_no, issue_date, issue_type, customer, payment_term, salesperson, note,
//          finish_order, lines:[{ sku, color_code, color_id, product_id, width, yards, barcode, clear_stock }] }
// ------------------------------------------------------------
app.post('/api/order-issue', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const rawLines = Array.isArray(b.lines) ? b.lines : [];
  const lines = rawLines.filter((l) => (l.sku || '').trim() && Number(l.yards) > 0);
  if (lines.length === 0) {
    return res.status(400).json({ ok: false, message: 'ต้องมีรายการตัดอย่างน้อย 1 รายการ (ผ้า + จำนวนที่ตัด)' });
  }

  const conn = await mysqlPool.getConnection();
  try {
    await conn.beginTransaction();

    // เลขที่ใบเบิก OUT{yymm}-{seq}
    const ym = new Date().toISOString().slice(2, 7).replace('-', '');
    const prefix = `OUT${ym}-`;
    const [[mx]] = await conn.query('SELECT gi_no FROM goods_issues WHERE gi_no LIKE ? ORDER BY LENGTH(gi_no) DESC, gi_no DESC LIMIT 1', [prefix + '%']);
    let giSeq = 1;
    if (mx && mx.gi_no) { const m = String(mx.gi_no).match(/-(\d+)$/); if (m) giSeq = Number(m[1]) + 1; }
    const giNo = (b.gi_no || '').trim() || `${prefix}${String(giSeq).padStart(4, '0')}`;
    const issueDate = b.issue_date || new Date().toISOString().slice(0, 10);

    const [giInfo] = await conn.query(
      `INSERT INTO goods_issues (gi_no, issue_date, issue_type, order_id, order_no, customer, payment_term, salesperson, note, created_by)
       VALUES (:gi_no,:issue_date,:issue_type,:order_id,:order_no,:customer,:payment_term,:salesperson,:note,:by)`,
      {
        gi_no: giNo, issue_date: issueDate, issue_type: b.issue_type || 'ขาย',
        order_id: b.order_id || null, order_no: b.order_no || '', customer: b.customer || '',
        payment_term: b.payment_term || '', salesperson: b.salesperson || '', note: b.note || '', by: req.userId,
      }
    );
    const giId = giInfo.insertId;

    const labels = [];
    for (const line of lines) {
      const sku = String(line.sku).trim();
      const yards = Number(line.yards);
      const prod = await resolveProductBySku(conn, sku);
      if (!prod) throw { httpCode: 400, message: `ไม่พบผ้ารหัส ${sku}` };
      const productId = prod.id;
      const colorId = line.color_id ? Number(line.color_id) : null;

      // ตรวจบาร์โค้ดผ้า (ถ้ายิงมา) ว่าตรงกับผ้า+สีของบรรทัดนี้ไหม
      if (line.barcode) {
        const expect = fabricBarcode(productId, colorId);
        if (String(line.barcode).trim() !== expect) {
          throw { httpCode: 400, message: `รหัสไม่ถูกต้อง — บาร์โค้ดที่ยิงไม่ตรงกับผ้า ${sku}` };
        }
      }

      // ดึงม้วนแบบ FIFO (เก่าก่อน)
      const rparams = [productId];
      let rwhere = "product_id = ? AND status <> 'depleted' AND current_yards > 0";
      if (colorId) { rwhere += ' AND color_id = ?'; rparams.push(colorId); }
      const [rolls] = await conn.query(
        `SELECT roll_id, current_yards, location_id, status FROM fabric_rolls WHERE ${rwhere} ORDER BY roll_id ASC`, rparams
      );
      const totalAvail = rolls.reduce((s, r) => s + Number(r.current_yards), 0);
      if (totalAvail < yards) {
        throw { httpCode: 400, message: `สต็อกไม่พอ: ${sku}${line.color_name ? ' (' + line.color_name + ')' : ''} เหลือ ${totalAvail} หลา ต้องใช้ ${yards} หลา` };
      }

      // ตัด FIFO ข้ามม้วน
      let remaining = yards;
      for (const roll of rolls) {
        if (remaining <= 0) break;
        const before = Number(roll.current_yards);
        const take = Math.min(before, remaining);
        let after = Math.round((before - take) * 100) / 100;
        remaining = Math.round((remaining - take) * 100) / 100;
        let newStatus = after <= 0 ? 'depleted' : 'in_use';
        // เคลียร์สต็อก: ตัดม้วนสุดท้ายที่แตะแล้วเศษที่เหลือถือว่าหมด
        let adjusted = 0;
        if (line.clear_stock && remaining <= 0 && after > 0) {
          adjusted = after; after = 0; newStatus = 'depleted';
        }
        await conn.query('UPDATE fabric_rolls SET current_yards = ?, status = ? WHERE roll_id = ?', [after, newStatus, roll.roll_id]);
        await conn.query(
          `INSERT INTO stock_transactions (roll_id, txn_type, yards_change, yards_before, yards_after, from_location_id, ref_type, ref_no, note, created_by)
           VALUES (:roll_id,'issue',:change,:before,:after,:loc,'issue',:ref,:note,:by)`,
          { roll_id: roll.roll_id, change: -take, before, after, loc: roll.location_id, ref: giNo, note: b.order_no ? ('ตัดจ่ายออเดอร์ ' + b.order_no) : 'ตัดจ่าย', by: req.userId }
        );
        if (adjusted > 0) {
          await conn.query(
            `INSERT INTO stock_transactions (roll_id, txn_type, yards_change, yards_before, yards_after, from_location_id, ref_type, ref_no, note, created_by)
             VALUES (:roll_id,'adjust',:change,:before,0,:loc,'clear',:ref,'เคลียร์สต็อกเศษผ้า',:by)`,
            { roll_id: roll.roll_id, change: -adjusted, before: adjusted, loc: roll.location_id, ref: giNo, by: req.userId }
          );
        }
      }

      const meters = Math.round(yards * 0.9144 * 100) / 100;
      await conn.query(
        `INSERT INTO goods_issue_items (gi_id, product_id, color_id, sku, color_name, width, yards_cut, meters_cut, unit, note)
         VALUES (:gi_id,:product_id,:color_id,:sku,:color_name,:width,:yards,:meters,:unit,:note)`,
        { gi_id: giId, product_id: productId, color_id: colorId, sku, color_name: line.color_name || '', width: line.width || '', yards, meters, unit: line.unit || 'หลา', note: line.note || '' }
      );

      // อัปเดตยอดเบิกใน order_items (จับคู่ด้วย order_id + sku)
      if (b.order_id) {
        await conn.query(
          'UPDATE order_items SET withdrawn_qty = withdrawn_qty + ? WHERE order_id = ? AND sku = ? LIMIT 1',
          [yards, b.order_id, sku]
        );
      }

      labels.push({
        cust_name: b.customer || '', date: issueDate, bill_no: giNo, item: `${labels.length + 1}/${lines.length}`,
        cust_code: line.cust_code || '', fabric: `${sku}${line.color_name ? ' - ' + line.color_name : ''}${line.width ? ' - ' + line.width : ''}`,
        yards, meters, barcode: fabricBarcode(productId, colorId),
      });
    }

    // อัปเดตหัวออเดอร์: ยอดเบิกรวม + สถานะ
    if (b.order_id) {
      const [[sum]] = await conn.query('SELECT COALESCE(SUM(withdrawn_qty),0) AS w, COALESCE(SUM(ordered_qty),0) AS o FROM order_items WHERE order_id = ?', [b.order_id]);
      const finished = b.finish_order || Number(sum.w) >= Number(sum.o);
      await conn.query('UPDATE orders SET withdrawn_qty = ?, status = ? WHERE id = ?', [Number(sum.w), finished ? 'Prepared' : 'Preparing', b.order_id]);
    }

    await conn.commit();
    res.json({ ok: true, message: `ตัดจ่ายสำเร็จ (ใบเบิก ${giNo})`, gi_no: giNo, gi_id: giId, labels });
  } catch (err) {
    await conn.rollback();
    if (err && err.httpCode) return res.status(err.httpCode).json({ ok: false, message: err.message });
    throw err;
  } finally {
    conn.release();
  }
}));

// ============================================================
//  สัญญาขาย (Sales Contract)
// ============================================================
app.get('/api/sales-contracts', auth, wrap(async (req, res) => {
  const [contracts] = await mysqlPool.query('SELECT * FROM sales_contracts ORDER BY sc_id DESC LIMIT 500');
  res.json({ ok: true, total: contracts.length, contracts });
}));

// เลขที่สัญญาถัดไป (สำหรับโชว์ในฟอร์มก่อนบันทึก)
async function nextSalesContractNo(db) {
  const ym = new Date().toISOString().slice(2, 7).replace('-', '');
  const prefix = `SC${ym}-`;
  const [[mx]] = await db.query('SELECT sc_no FROM sales_contracts WHERE sc_no LIKE ? ORDER BY LENGTH(sc_no) DESC, sc_no DESC LIMIT 1', [prefix + '%']);
  let seq = 1;
  if (mx && mx.sc_no) { const m = String(mx.sc_no).match(/-(\d+)$/); if (m) seq = Number(m[1]) + 1; }
  return `${prefix}${String(seq).padStart(3, '0')}`;
}

app.get('/api/sales-contracts/next-no', auth, wrap(async (req, res) => {
  res.json({ ok: true, sc_no: await nextSalesContractNo(mysqlPool) });
}));

app.get('/api/sales-contracts/:id', auth, wrap(async (req, res) => {
  const id = Number(req.params.id);
  const [[contract]] = await mysqlPool.query('SELECT * FROM sales_contracts WHERE sc_id = ?', [id]);
  if (!contract) return res.status(404).json({ ok: false, message: 'ไม่พบสัญญานี้' });
  const [items] = await mysqlPool.query('SELECT * FROM sales_contract_items WHERE sc_id = ? ORDER BY sci_id ASC', [id]);
  res.json({ ok: true, contract: { ...contract, items } });
}));

app.post('/api/sales-contracts', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const rawItems = Array.isArray(b.items) ? b.items : [];
  const items = rawItems.filter((it) => (it.sku || it.description || '').toString().trim() && Number(it.qty) > 0);
  if (!(b.customer || '').trim()) return res.status(400).json({ ok: false, message: 'กรุณากรอกลูกค้า' });
  if (items.length === 0) return res.status(400).json({ ok: false, message: 'กรุณากรอกรายการอย่างน้อย 1 รายการ' });

  const conn = await mysqlPool.getConnection();
  try {
    await conn.beginTransaction();
    let scNo = (b.sc_no || '').trim();
    if (!scNo) {
      scNo = await nextSalesContractNo(conn);
    } else {
      const [[e]] = await conn.query('SELECT sc_id FROM sales_contracts WHERE sc_no = ?', [scNo]);
      if (e) scNo = await nextSalesContractNo(conn); // เลขซ้ำ -> gen ใหม่กันชน
    }

    const subtotal = items.reduce((s, it) => s + (Number(it.amount) || (Number(it.qty) || 0) * (Number(it.unit_price) || 0)), 0);
    const discountAmount = Number(b.discount_amount) || 0;
    const vatAmount = Number(b.vat_amount) || 0;
    const netTotal = Math.round((subtotal - discountAmount + vatAmount) * 100) / 100;

    const [info] = await conn.query(
      `INSERT INTO sales_contracts (sc_no, contract_date, shipment_date, customer, address, payment_term, deposit, currency, structure, unit, note, subtotal, discount_type, discount_value, discount_amount, vat_type, vat_amount, net_total, created_by)
       VALUES (:sc_no,:contract_date,:shipment_date,:customer,:address,:payment_term,:deposit,:currency,:structure,:unit,:note,:subtotal,:discount_type,:discount_value,:discount_amount,:vat_type,:vat_amount,:net_total,:by)`,
      {
        sc_no: scNo, contract_date: b.contract_date || new Date().toISOString().slice(0, 10), shipment_date: b.shipment_date || null,
        customer: b.customer || '', address: b.address || '', payment_term: b.payment_term || '', deposit: Number(b.deposit) || 0,
        currency: b.currency || 'THB', structure: b.structure || '', unit: b.unit || 'หลา', note: b.note || '',
        subtotal, discount_type: b.discount_type || 'None', discount_value: Number(b.discount_value) || 0, discount_amount: discountAmount,
        vat_type: b.vat_type || 'None', vat_amount: vatAmount, net_total: netTotal, by: req.userId,
      }
    );
    const scId = info.insertId;
    for (const it of items) {
      const amount = Number(it.amount) || (Number(it.qty) || 0) * (Number(it.unit_price) || 0);
      await conn.query(
        `INSERT INTO sales_contract_items (sc_id, sku, color_code, description, qty, unit_price, amount, width, length, note)
         VALUES (:sc_id,:sku,:color_code,:description,:qty,:unit_price,:amount,:width,:length,:note)`,
        { sc_id: scId, sku: it.sku || '', color_code: it.color_code || '', description: it.description || '', qty: Number(it.qty) || 0, unit_price: Number(it.unit_price) || 0, amount, width: it.width || '', length: it.length || '', note: it.note || '' }
      );
    }
    await conn.commit();
    const [[contract]] = await mysqlPool.query('SELECT * FROM sales_contracts WHERE sc_id = ?', [scId]);
    const [savedItems] = await mysqlPool.query('SELECT * FROM sales_contract_items WHERE sc_id = ? ORDER BY sci_id ASC', [scId]);
    res.json({ ok: true, message: 'บันทึกสัญญาขายสำเร็จ', contract: { ...contract, items: savedItems } });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}));

// ============================================================
//  คลังผ้า (WMS) — รับผ้าสำเร็จเข้าคลัง (Inbound Receiving)
//  body: { receipt_date, receipt_type, po_no, bill_no, warehouse, supplier_name, note,
//          items: [{ product_id, color_id, lot_no, roll_count, yards_per_roll, location_id }] }
//  -> สร้าง goods_receipts + goods_receipt_items + fabric_rolls (แยกรายม้วน) + stock_transactions
// ============================================================
app.get('/api/goods-receipts', auth, wrap(async (req, res) => {
  const [receipts] = await mysqlPool.query('SELECT * FROM goods_receipts ORDER BY gr_id DESC LIMIT 200');
  res.json({ ok: true, total: receipts.length, receipts });
}));

app.post('/api/goods-receipts', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const items = Array.isArray(b.items) ? b.items : [];
  const validItems = items.filter((it) => Number(it.product_id) && Number(it.roll_count) > 0 && Number(it.yards_per_roll) > 0);
  if (validItems.length === 0) {
    return res.status(400).json({ ok: false, message: 'กรุณากรอกรายการรับอย่างน้อย 1 รายการ (ผ้า, จำนวนม้วน, หลาต่อม้วน)' });
  }

  let grNo = (b.gr_no || '').trim();
  if (!grNo) {
    const ym = new Date().toISOString().slice(2, 7).replace('-', '');
    const prefix = `GRN${ym}-`;
    const [[mx]] = await mysqlPool.query('SELECT gr_no FROM goods_receipts WHERE gr_no LIKE ? ORDER BY LENGTH(gr_no) DESC, gr_no DESC LIMIT 1', [prefix + '%']);
    let seq = 1;
    if (mx && mx.gr_no) { const m = String(mx.gr_no).match(/-(\d+)$/); if (m) seq = Number(m[1]) + 1; }
    grNo = `${prefix}${String(seq).padStart(4, '0')}`;
  }
  const receiptDate = b.receipt_date || new Date().toISOString().slice(0, 10);

  const conn = await mysqlPool.getConnection();
  const createdRollIds = [];
  let grId;
  try {
    await conn.beginTransaction();
    const [grInfo] = await conn.query(
      `INSERT INTO goods_receipts (gr_no, receipt_date, receipt_type, supplier_name, po_no, bill_no, warehouse, note, status, received_by)
       VALUES (:gr_no, :receipt_date, :receipt_type, :supplier_name, :po_no, :bill_no, :warehouse, :note, 'posted', :received_by)`,
      {
        gr_no: grNo,
        receipt_date: receiptDate,
        receipt_type: b.receipt_type || '',
        supplier_name: b.supplier_name || '',
        po_no: b.po_no || '',
        bill_no: b.bill_no || '',
        warehouse: b.warehouse || '',
        note: b.note || '',
        received_by: req.userId,
      }
    );
    grId = grInfo.insertId;

    let rollSeq = 0;
    for (const it of validItems) {
      const productId = Number(it.product_id);
      const colorId = it.color_id ? Number(it.color_id) : null;
      const rollCount = Number(it.roll_count);
      const yardsPerRoll = Number(it.yards_per_roll);
      const locationId = it.location_id ? Number(it.location_id) : null;
      const lotNo = (it.lot_no || '').trim();

      const [griInfo] = await conn.query(
        `INSERT INTO goods_receipt_items (gr_id, product_id, color_id, roll_count, total_yards, note)
         VALUES (:gr_id, :product_id, :color_id, :roll_count, :total_yards, :note)`,
        { gr_id: grId, product_id: productId, color_id: colorId, roll_count: rollCount, total_yards: rollCount * yardsPerRoll, note: it.note || '' }
      );
      const griId = griInfo.insertId;

      for (let i = 0; i < rollCount; i++) {
        rollSeq += 1;
        const qr = `KR${grId}-${String(rollSeq).padStart(4, '0')}`;
        const [rollInfo] = await conn.query(
          `INSERT INTO fabric_rolls (roll_qr_code, gri_id, product_id, color_id, lot_no, initial_yards, current_yards, location_id, status, received_at)
           VALUES (:qr, :gri_id, :product_id, :color_id, :lot_no, :yards, :yards, :location_id, 'available', :received_at)`,
          { qr, gri_id: griId, product_id: productId, color_id: colorId, lot_no: lotNo, yards: yardsPerRoll, location_id: locationId, received_at: receiptDate + ' 00:00:00' }
        );
        const rollId = rollInfo.insertId;
        createdRollIds.push(rollId);
        await conn.query(
          `INSERT INTO stock_transactions (roll_id, txn_type, yards_change, yards_before, yards_after, to_location_id, ref_type, ref_no, created_by)
           VALUES (:roll_id, 'receive', :yards, 0, :yards, :to_location_id, 'grn', :ref_no, :created_by)`,
          { roll_id: rollId, yards: yardsPerRoll, to_location_id: locationId, ref_no: grNo, created_by: req.userId }
        );
      }
    }
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }

  // ดึงม้วนที่เพิ่งสร้าง พร้อมข้อมูลสำหรับพิมพ์สติ๊กเกอร์ QR
  let rolls = [];
  if (createdRollIds.length > 0) {
    const [rows] = await mysqlPool.query(
      `SELECT r.roll_id, r.roll_qr_code, r.lot_no, r.initial_yards, r.current_yards,
              f.sku AS product_sku, f.name AS product_name,
              s.name AS color_name, l.location_code
       FROM fabric_rolls r
       LEFT JOIN fabrics f ON f.id = r.product_id
       LEFT JOIN fabric_shades s ON s.id = r.color_id
       LEFT JOIN warehouse_locations l ON l.location_id = r.location_id
       WHERE r.roll_id IN (${createdRollIds.map(() => '?').join(',')})
       ORDER BY r.roll_id ASC`,
      createdRollIds
    );
    rolls = rows;
  }

  const [[receipt]] = await mysqlPool.query('SELECT * FROM goods_receipts WHERE gr_id = ?', [grId]);
  res.json({ ok: true, message: `รับผ้าเข้าคลังสำเร็จ (${rolls.length} ม้วน)`, receipt, rolls });
}));

// ============================================================
//  ออร์เดอร์ (orders + order_items)
// ============================================================
app.get('/api/orders', auth, wrap(async (req, res) => {
  const [orders] = await mysqlPool.query('SELECT * FROM orders ORDER BY id DESC');
  const [allItems] = await mysqlPool.query('SELECT * FROM order_items ORDER BY id ASC');
  const byOrder = new Map();
  allItems.forEach((it) => {
    if (!byOrder.has(it.order_id)) byOrder.set(it.order_id, []);
    byOrder.get(it.order_id).push(it);
  });
  const result = orders.map((o) => ({ ...o, items: byOrder.get(o.id) || [] }));
  res.json({ ok: true, total: result.length, orders: result });
}));

app.post('/api/orders', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const customer = (b.customer || '').trim();
  const items = Array.isArray(b.items) ? b.items : [];
  const validItems = items.filter((it) => (it.sku || '').trim() && Number(it.orderedQty) > 0);

  if (!customer) {
    return res.status(400).json({ ok: false, message: 'กรุณากรอกชื่อลูกค้า' });
  }
  if (validItems.length === 0) {
    return res.status(400).json({ ok: false, message: 'กรุณากรอกรายการสินค้าอย่างน้อย 1 รายการ (รหัสสินค้าและจำนวนที่สั่ง)' });
  }

  let orderNo = (b.orderNo || '').trim();
  if (!orderNo) {
    const ym = new Date().toISOString().slice(2, 7).replace('-', '');
    const prefix = `OR${ym}-`;
    // หาเลขล่าสุดของเดือนนี้ แล้ว +1 (กันชนกับเลขที่มีอยู่)
    const [[mx]] = await mysqlPool.query(
      'SELECT order_no FROM orders WHERE order_no LIKE ? ORDER BY LENGTH(order_no) DESC, order_no DESC LIMIT 1', [prefix + '%']
    );
    let seq = 1;
    if (mx && mx.order_no) { const m = String(mx.order_no).match(/-(\d+)$/); if (m) seq = Number(m[1]) + 1; }
    orderNo = `${prefix}${String(seq).padStart(3, '0')}`;
  }

  const orderedQtyTotal = validItems.reduce((s, it) => s + Number(it.orderedQty || 0), 0);

  const conn = await mysqlPool.getConnection();
  let orderId;
  try {
    await conn.beginTransaction();
    const [info] = await conn.query(
      "INSERT INTO orders (order_no, `date`, customer, salesperson, payment_term, note, urgent, ordered_qty, withdrawn_qty, status) VALUES (?,?,?,?,?,?,?,?,0,'Waiting to prepare')",
      [orderNo, b.date || '', customer, b.salesperson || '', b.paymentTerm || 'Cash', b.note || '', b.urgent ? 1 : 0, orderedQtyTotal]
    );
    orderId = info.insertId;
    for (const it of validItems) {
      await conn.query(
        'INSERT INTO order_items (order_id, sku, color_code, width, available_qty, ordered_qty, unit, pack, cust_code, substitute, substitute_text) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
        [orderId, it.sku || '', it.colorCode || '', it.width || '', it.availableQty || '', Number(it.orderedQty) || 0, it.unit || 'หลา', it.pack || '', it.custCode || '', it.substitute ? 1 : 0, it.substituteText || '']
      );
    }
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }

  const [[order]] = await mysqlPool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
  const [orderItems] = await mysqlPool.query('SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC', [orderId]);
  res.json({ ok: true, message: 'บันทึกออร์เดอร์สำเร็จ', order: { ...order, items: orderItems } });
}));

app.put('/api/orders/:id', auth, wrap(async (req, res) => {
  const id = Number(req.params.id);
  const [existRows] = await mysqlPool.query('SELECT * FROM orders WHERE id = ?', [id]);
  const existing = existRows[0];
  if (!existing) {
    return res.status(404).json({ ok: false, message: 'ไม่พบออร์เดอร์นี้' });
  }

  const b = req.body || {};
  await mysqlPool.query(
    'UPDATE orders SET withdrawn_qty=:withdrawn_qty, status=:status, invoiced=:invoiced, vat_done=:vat_done WHERE id=:id',
    {
      id,
      withdrawn_qty: b.withdrawnQty !== undefined ? Number(b.withdrawnQty) : existing.withdrawn_qty,
      status: b.status || existing.status,
      invoiced: b.invoiced !== undefined ? (b.invoiced ? 1 : 0) : existing.invoiced,
      vat_done: b.vatDone !== undefined ? (b.vatDone ? 1 : 0) : existing.vat_done,
    }
  );

  const [[order]] = await mysqlPool.query('SELECT * FROM orders WHERE id = ?', [id]);
  res.json({ ok: true, message: 'อัปเดตออร์เดอร์สำเร็จ', order });
}));

// ------------------------------------------------------------
//  ออกจากระบบ
// ------------------------------------------------------------
app.post('/api/logout', auth, async (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.slice(7);
  await mysqlPool.query('DELETE FROM sessions WHERE token = ?', [token]);
  res.json({ ok: true });
});

// ============================================================
//  อินวอยส์การขาย (sale_invoices) / รับคืนอินวอยส์ (invoice_returns) / วางบิล (customer_billings)
// ============================================================
async function makeInvNo() {
  const d = new Date();
  const prefix = String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0');
  const [[{ n }]] = await mysqlPool.query('SELECT COUNT(*) AS n FROM sale_invoices WHERE inv_no LIKE ?', [prefix + '%']);
  return `${prefix}${String(n + 1).padStart(4, '0')}`;
}
app.get('/api/sale-invoices/next-no', auth, wrap(async (req, res) => { res.json({ ok: true, inv_no: await makeInvNo() }); }));
app.get('/api/sale-invoices', auth, wrap(async (req, res) => {
  const [rows] = await mysqlPool.query('SELECT * FROM sale_invoices ORDER BY id DESC');
  res.json({ ok: true, total: rows.length, invoices: rows });
}));
app.post('/api/sale-invoices', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const inv_no = await makeInvNo();
  const [info] = await mysqlPool.query(
    `INSERT INTO sale_invoices (inv_no, inv_date, customer, order_ref, account_term, salesperson, bill_address, ship_address, shipper, remark, items_json)
     VALUES (:inv_no, :inv_date, :customer, :order_ref, :account_term, :salesperson, :bill_address, :ship_address, :shipper, :remark, :items_json)`,
    { inv_no, inv_date: b.inv_date || '', customer: b.customer || '', order_ref: b.order_ref || '', account_term: b.account_term || '', salesperson: b.salesperson || '', bill_address: b.bill_address || '', ship_address: b.ship_address || '', shipper: b.shipper || '', remark: b.remark || '', items_json: JSON.stringify(Array.isArray(b.items) ? b.items : []) }
  );
  res.json({ ok: true, message: 'บันทึกอินวอยส์แล้ว', id: info.insertId, inv_no });
}));

async function makeIvrNo() {
  const d = new Date();
  const prefix = 'IVR' + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0');
  const [[{ n }]] = await mysqlPool.query('SELECT COUNT(*) AS n FROM invoice_returns WHERE ivr_no LIKE ?', [prefix + '-%']);
  return `${prefix}-${String(n + 1).padStart(3, '0')}`;
}
app.get('/api/invoice-returns/next-no', auth, wrap(async (req, res) => { res.json({ ok: true, ivr_no: await makeIvrNo() }); }));
app.get('/api/invoice-returns', auth, wrap(async (req, res) => {
  const [rows] = await mysqlPool.query('SELECT * FROM invoice_returns ORDER BY id DESC');
  res.json({ ok: true, total: rows.length, returns: rows });
}));
app.post('/api/invoice-returns', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const ivr_no = await makeIvrNo();
  const [info] = await mysqlPool.query(
    `INSERT INTO invoice_returns (ivr_no, ret_date, shipper, payment_type, remark, items_json)
     VALUES (:ivr_no, :ret_date, :shipper, :payment_type, :remark, :items_json)`,
    { ivr_no, ret_date: b.ret_date || '', shipper: b.shipper || '', payment_type: b.payment_type || '', remark: b.remark || '', items_json: JSON.stringify(Array.isArray(b.items) ? b.items : []) }
  );
  res.json({ ok: true, message: 'บันทึกรับคืนอินวอยส์แล้ว', id: info.insertId, ivr_no });
}));

async function makeBrNo() {
  const d = new Date();
  const prefix = 'BR' + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0');
  const [[{ n }]] = await mysqlPool.query('SELECT COUNT(*) AS n FROM customer_billings WHERE br_no LIKE ?', [prefix + '-%']);
  return `${prefix}-${String(n + 1).padStart(3, '0')}`;
}
app.get('/api/customer-billings/next-no', auth, wrap(async (req, res) => { res.json({ ok: true, br_no: await makeBrNo() }); }));
app.get('/api/customer-billings', auth, wrap(async (req, res) => {
  const [rows] = await mysqlPool.query('SELECT * FROM customer_billings ORDER BY id DESC');
  res.json({ ok: true, total: rows.length, billings: rows });
}));
app.post('/api/customer-billings', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const br_no = await makeBrNo();
  const [info] = await mysqlPool.query(
    `INSERT INTO customer_billings (br_no, bill_date, due_date, customer, remark, total_amount, items_json)
     VALUES (:br_no, :bill_date, :due_date, :customer, :remark, :total_amount, :items_json)`,
    { br_no, bill_date: b.bill_date || '', due_date: b.due_date || '', customer: b.customer || '', remark: b.remark || '', total_amount: Number(b.total_amount) || 0, items_json: JSON.stringify(Array.isArray(b.items) ? b.items : []) }
  );
  res.json({ ok: true, message: 'บันทึกวางบิลแล้ว', id: info.insertId, br_no });
}));

// ============================================================
//  ใบลดหนี้ ลูกค้า(CR)/คู่ค้า(CP) (credit_notes)
// ============================================================
async function makeCreditNo(type) {
  const d = new Date();
  const prefix = (type === 'partner' ? 'CP' : 'CR') + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0');
  const [[{ n }]] = await mysqlPool.query('SELECT COUNT(*) AS n FROM credit_notes WHERE doc_no LIKE ?', [prefix + '-%']);
  return `${prefix}-${String(n + 1).padStart(3, '0')}`;
}
app.get('/api/credit-notes/next-no', auth, wrap(async (req, res) => {
  res.json({ ok: true, doc_no: await makeCreditNo(req.query.type) });
}));
app.get('/api/credit-notes', auth, wrap(async (req, res) => {
  const type = req.query.type;
  const [rows] = type
    ? await mysqlPool.query('SELECT * FROM credit_notes WHERE doc_type = ? ORDER BY id DESC', [type])
    : await mysqlPool.query('SELECT * FROM credit_notes ORDER BY id DESC');
  res.json({ ok: true, total: rows.length, notes: rows });
}));
app.post('/api/credit-notes', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const doc_no = await makeCreditNo(b.doc_type);
  const [info] = await mysqlPool.query(
    `INSERT INTO credit_notes (doc_no, doc_type, doc_date, party, return_type, invoice_ref, remark, subtotal, vat, net_total, items_json)
     VALUES (:doc_no, :doc_type, :doc_date, :party, :return_type, :invoice_ref, :remark, :subtotal, :vat, :net_total, :items_json)`,
    {
      doc_no, doc_type: b.doc_type === 'partner' ? 'partner' : 'customer',
      doc_date: b.doc_date || '', party: b.party || '', return_type: b.return_type || 'No Return', invoice_ref: b.invoice_ref || '', remark: b.remark || '',
      subtotal: Number(b.subtotal) || 0, vat: Number(b.vat) || 0, net_total: Number(b.net_total) || 0,
      items_json: JSON.stringify(Array.isArray(b.items) ? b.items : []),
    }
  );
  res.json({ ok: true, message: 'บันทึกใบลดหนี้แล้ว', id: info.insertId, doc_no });
}));

// ============================================================
//  รับเงินลูกค้า(RC)/จ่ายเงินคู่ค้า(PP) (payments)
// ============================================================
async function makePaymentNo(type) {
  const d = new Date();
  const map = { pay: 'PP', receive: 'RC', 'deduct-customer': 'DC', 'deduct-partner': 'DP' };
  const prefix = (map[type] || 'RC') + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0');
  const [[{ n }]] = await mysqlPool.query('SELECT COUNT(*) AS n FROM payments WHERE doc_no LIKE ?', [prefix + '-%']);
  return `${prefix}-${String(n + 1).padStart(3, '0')}`;
}
// ยอดบัญชีลูกค้า/คู่ค้า (สำหรับหน้าหักบัญชี) — ยอดรวม / หักไปแล้ว / คงเหลือ
app.get('/api/account-balance', auth, wrap(async (req, res) => {
  const type = (req.query.type || 'customer').toString();
  const party = (req.query.party || '').toString().trim();
  let total = 0;
  if (party && type === 'customer') {
    const [[r]] = await mysqlPool.query('SELECT COALESCE(SUM(net_total),0) AS t FROM vat_invoices WHERE customer = ?', [party]);
    total = Number(r.t) || 0;
  }
  const deductType = type === 'partner' ? 'deduct-partner' : 'deduct-customer';
  const [rows] = await mysqlPool.query('SELECT items_json FROM payments WHERE doc_type = ?', [deductType]);
  let deducted = 0;
  for (const row of rows) {
    try { (JSON.parse(row.items_json || '[]')).forEach(it => { if ((it.party || '') === party) deducted += Number(it.amount) || 0; }); } catch (e) {}
  }
  res.json({ ok: true, total, deducted, remaining: total - deducted });
}));
app.get('/api/payments/next-no', auth, wrap(async (req, res) => {
  res.json({ ok: true, doc_no: await makePaymentNo(req.query.type) });
}));
app.get('/api/payments', auth, wrap(async (req, res) => {
  const type = req.query.type;
  const [rows] = type
    ? await mysqlPool.query('SELECT * FROM payments WHERE doc_type = ? ORDER BY id DESC', [type])
    : await mysqlPool.query('SELECT * FROM payments ORDER BY id DESC');
  res.json({ ok: true, total: rows.length, payments: rows });
}));
app.post('/api/payments', auth, wrap(async (req, res) => {
  const b = req.body || {};
  const doc_no = await makePaymentNo(b.doc_type);
  const [info] = await mysqlPool.query(
    `INSERT INTO payments (doc_no, doc_type, doc_date, remark, total_amount, items_json)
     VALUES (:doc_no, :doc_type, :doc_date, :remark, :total_amount, :items_json)`,
    {
      doc_no, doc_type: b.doc_type === 'pay' ? 'pay' : 'receive',
      doc_date: b.doc_date || '', remark: b.remark || '', total_amount: Number(b.total_amount) || 0,
      items_json: JSON.stringify(Array.isArray(b.items) ? b.items : []),
    }
  );
  res.json({ ok: true, message: 'บันทึกรายการเงินแล้ว', id: info.insertId, doc_no });
}));

// ============================================================
//  รายงานสินค้าคงคลัง (stock inventory) — group ต่อ ผ้า+สี จาก fabric_rolls
// ============================================================
app.get('/api/reports/stock-inventory', auth, wrap(async (req, res) => {
  const q = (req.query.q || '').toString().trim();
  const sku = (req.query.sku || '').toString().trim();
  const color = (req.query.color || '').toString().trim();
  const group = (req.query.group || '').toString().trim();
  const width = (req.query.width || '').toString().trim();
  const warehouse = (req.query.warehouse || '').toString().trim();
  const where = ["r.status <> 'depleted'"];
  const params = [];
  if (q) { where.push('(f.sku LIKE ? OR f.name LIKE ? OR s.name LIKE ?)'); params.push('%' + q + '%', '%' + q + '%', '%' + q + '%'); }
  if (sku) { where.push('f.sku LIKE ?'); params.push('%' + sku + '%'); }
  if (color) { where.push('s.name LIKE ?'); params.push('%' + color + '%'); }
  if (group) { where.push('f.type LIKE ?'); params.push('%' + group + '%'); }
  if (width) { where.push('f.width LIKE ?'); params.push('%' + width + '%'); }
  if (warehouse) { where.push('l.location_code LIKE ?'); params.push('%' + warehouse + '%'); }
  const [rows] = await mysqlPool.query(`
    SELECT r.product_id, r.color_id, f.sku, f.name, f.type, f.width, s.name AS shade,
           COUNT(*) AS folds, COALESCE(SUM(r.current_yards),0) AS total_yards
    FROM fabric_rolls r
    LEFT JOIN fabrics f ON f.id = r.product_id
    LEFT JOIN fabric_shades s ON s.id = r.color_id
    LEFT JOIN warehouse_locations l ON l.location_id = r.location_id
    WHERE ${where.join(' AND ')}
    GROUP BY r.product_id, r.color_id, f.sku, f.name, f.type, f.width, s.name
    ORDER BY f.sku ASC, s.name ASC
  `, params);
  const totalFolds = rows.reduce((a, x) => a + Number(x.folds || 0), 0);
  const totalYards = rows.reduce((a, x) => a + Number(x.total_yards || 0), 0);
  res.json({ ok: true, total: rows.length, items: rows, summary: { folds: totalFolds, yards: totalYards } });
}));
// รายละเอียดม้วนของผ้า+สีที่เลือก
app.get('/api/reports/stock-inventory/rolls', auth, wrap(async (req, res) => {
  const productId = Number(req.query.product_id) || 0;
  const colorId = req.query.color_id ? Number(req.query.color_id) : null;
  const cond = colorId != null ? 'r.color_id = ?' : 'r.color_id IS NULL';
  const params = colorId != null ? [productId, colorId] : [productId];
  const [rows] = await mysqlPool.query(`
    SELECT r.roll_id, r.roll_qr_code, r.lot_no, r.initial_yards, r.current_yards, r.received_at, r.status,
           l.location_code, l.rack
    FROM fabric_rolls r
    LEFT JOIN warehouse_locations l ON l.location_id = r.location_id
    WHERE r.product_id = ? AND ${cond}
    ORDER BY r.roll_id ASC
  `, params);
  res.json({ ok: true, total: rows.length, rolls: rows });
}));
// ปรับปรุงจำนวนสต็อกของม้วน (จากหน้ารายงาน)
app.post('/api/fabric-rolls/adjust', auth, wrap(async (req, res) => {
  const rollQr = (req.body.roll_qr || '').toString().trim();
  const newYards = Number(req.body.new_yards);
  if (!rollQr || !(newYards >= 0)) return res.status(400).json({ ok: false, message: 'ต้องระบุบาร์โค้ดและจำนวนใหม่ (>= 0)' });
  const [[roll]] = await mysqlPool.query('SELECT * FROM fabric_rolls WHERE roll_qr_code = ?', [rollQr]);
  if (!roll) return res.status(404).json({ ok: false, message: 'ไม่พบม้วนผ้ารหัส ' + rollQr });
  const before = Number(roll.current_yards);
  const status = newYards <= 0 ? 'depleted' : roll.status;
  await mysqlPool.query('UPDATE fabric_rolls SET current_yards = ?, lot_no = ?, status = ? WHERE roll_id = ?',
    [newYards, (req.body.lot_no || roll.lot_no || ''), status, roll.roll_id]);
  await mysqlPool.query(
    `INSERT INTO stock_transactions (roll_id, txn_type, yards_change, yards_before, yards_after, from_location_id, ref_type, note, created_by)
     VALUES (:roll_id, 'adjust', :change, :before, :after, :loc, 'adjust', :note, :by)`,
    { roll_id: roll.roll_id, change: newYards - before, before, after: newYards, loc: roll.location_id, note: (req.body.note || 'ปรับปรุงสต็อก').toString().trim(), by: req.userId }
  );
  res.json({ ok: true, message: `ปรับปรุง ${rollQr} จาก ${before} เป็น ${newYards} หลา`, current_yards: newYards });
}));

app.get('/', (req, res) => res.redirect('http://localhost:5173/login'));

app.listen(PORT, () => {
  console.log(`\n  ✅ API + ฐานข้อมูล (MySQL: kins_erp) ทำงานที่  http://localhost:${PORT}`);
  console.log(`     • หน้าเว็บ (Vue SPA) -> http://localhost:5173  (cd ../frontend && npm run dev)\n`);
});

const anthropic = new Anthropic({
  apiKey: 'ใส่_API_KEY_ของ_Claude_ที่นี่',
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{ role: 'user', content: message }],
    });
    res.json({ reply: response.content[0].text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Claude API Error' });
  }
});
