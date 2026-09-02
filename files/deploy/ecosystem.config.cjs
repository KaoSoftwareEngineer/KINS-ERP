// ============================================================================
//  pm2 config — ให้ backend (Node) รันตลอดเวลา ไม่ต้องเปิด terminal ค้างไว้
//
//  ปัญหาเดิม: รันด้วย `node server.js` ด้วยมือ → ปิดหน้าต่าง/เครื่องรีบูต = ระบบล่ม
//  pm2 แก้ให้: รันเป็น background, ครบแล้วรีสตาร์ทเองถ้า process ตาย, ขึ้นเองตอนบูตเครื่อง
//
//  ใช้งาน (ดู README-deploy.md ประกอบ):
//     npm install -g pm2
//     pm2 start C:/xampp/htdocs/KINS/files/deploy/ecosystem.config.cjs
//     pm2 save
//  ดูสถานะ: pm2 status   ดู log: pm2 logs kins-erp-api   รีสตาร์ท: pm2 restart kins-erp-api
// ============================================================================
module.exports = {
  apps: [
    {
      name: 'kins-erp-api',
      script: 'server.js',
      cwd: 'C:/xampp/htdocs/KINS/files',   // ต้องเป็นโฟลเดอร์นี้ เพราะ server.js อ่าน .env จากที่นี่
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,          // process ตาย = ปลุกขึ้นใหม่อัตโนมัติ
      max_restarts: 20,
      min_uptime: '10s',          // ถ้าตายเร็วกว่านี้ซ้ำๆ ถือว่าพังจริง ไม่วนรีสตาร์ทไม่จบ
      watch: false,               // อย่าเปิด: production ไม่ควรรีสตาร์ทเองตอนไฟล์เปลี่ยน
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
      },
      out_file:   'C:/xampp/htdocs/KINS/files/logs/pm2-out.log',
      error_file: 'C:/xampp/htdocs/KINS/files/logs/pm2-error.log',
      time: true,                 // ใส่เวลาหน้าทุกบรรทัด log
    },
  ],
};
