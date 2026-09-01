// ============================================================================
//  check-duplicate-keys.cjs — ตรวจว่าไฟล์คำแปลมีคีย์ชื่อซ้ำกันภายในภาษาเดียวกันไหม
//
//  ทำไมต้องตรวจ: JavaScript ไม่เตือนเวลาตั้งชื่อคีย์ซ้ำใน object — มันจะเอา "ตัวหลัง
//  ทับตัวหน้า" เงียบๆ ทำให้ข้อความของหน้าหนึ่งไปโผล่อีกหน้าหนึ่งโดยไม่มีใครรู้
//  (เคยทำให้เมนูสัญญาขายมีไอคอนซ้อนกัน และรายงาน PO แสดง "ค้างเบิก" แทน "ค้างรับ")
//
//  วิธีรัน:  cd frontend && node scripts/check-duplicate-keys.cjs
//  คืน exit code 1 ถ้าเจอคีย์ซ้ำ (เอาไปใส่ CI / pre-commit hook ได้)
// ============================================================================
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'src', 'i18n', 'dashboardMessages.js');
const lines = fs.readFileSync(FILE, 'utf8').split('\n');

let lang = null;
const seen = {};        // 'th.key' -> [เลขบรรทัด, ...]
lines.forEach((l, i) => {
  const langMatch = l.match(/^ {2}(\w+): \{/);
  if (langMatch) { lang = langMatch[1]; return; }
  const keyMatch = l.match(/^ {4}([A-Za-z_]\w*):/);
  if (!keyMatch || !lang) return;
  const id = lang + '.' + keyMatch[1];
  (seen[id] = seen[id] || []).push(i + 1);
});

const dups = Object.entries(seen).filter(([, at]) => at.length > 1);
if (dups.length === 0) {
  const total = Object.keys(seen).length;
  console.log(`✅ ไม่พบคีย์ซ้ำ (ตรวจ ${total} คีย์ใน ${path.relative(process.cwd(), FILE)})`);
  process.exit(0);
}

console.error(`❌ พบคีย์ซ้ำ ${dups.length} รายการ — ตัวที่อยู่บรรทัดหลังจะทับตัวหน้าเสมอ:`);
for (const [id, at] of dups) {
  console.error(`   ${id}  ที่บรรทัด ${at.join(', ')}`);
  at.forEach((n) => console.error(`      L${n}: ${lines[n - 1].trim()}`));
}
console.error('\nแก้โดย: ตั้งชื่อคีย์ให้ต่างกันตามบริบทที่ใช้ หรือลบตัวที่ไม่ได้ใช้ทิ้ง');
process.exit(1);
