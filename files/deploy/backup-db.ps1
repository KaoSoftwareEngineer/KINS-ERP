# ============================================================================
#  สำรองฐานข้อมูล plum_erp อัตโนมัติ
#
#  ทำไมต้องมี: ข้อมูล ERP จริง (ออร์เดอร์/สต็อก/ลูกค้า/บัญชี) หายแล้วกู้ไม่ได้
#  ควรตั้ง Task Scheduler ให้รันวันละครั้ง (ดู README-deploy.md ข้อ 5)
#
#  รันเอง:  powershell -ExecutionPolicy Bypass -File backup-db.ps1
#  กู้คืน:  C:\xampp\mysql\bin\mysql.exe -u root plum_erp < ไฟล์.sql
# ============================================================================

$ErrorActionPreference = 'Stop'

$BackupDir  = 'C:\backup\kins'          # โฟลเดอร์เก็บไฟล์สำรอง
$KeepDays   = 14                        # เก็บย้อนหลังกี่วัน (เก่ากว่านี้ลบทิ้ง)
$MysqlDump  = 'C:\xampp\mysql\bin\mysqldump.exe'
$EnvFile    = 'C:\xampp\htdocs\KINS\files\.env'

# ---- อ่านค่าเชื่อมต่อจาก .env (ไม่ hardcode รหัสผ่านไว้ในสคริปต์) ----
$cfg = @{}
foreach ($line in Get-Content $EnvFile) {
    if ($line -match '^\s*([A-Z_]+)\s*=\s*(.*)$') { $cfg[$Matches[1]] = $Matches[2].Trim() }
}
$dbName = if ($cfg['DB_NAME']) { $cfg['DB_NAME'] } else { 'plum_erp' }
$dbUser = if ($cfg['DB_USER']) { $cfg['DB_USER'] } else { 'root' }
$dbPass = $cfg['DB_PASSWORD']

if (-not (Test-Path $MysqlDump)) { throw "ไม่พบ mysqldump ที่ $MysqlDump" }
if (-not (Test-Path $BackupDir)) { New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null }

$stamp   = Get-Date -Format 'yyyyMMdd_HHmmss'
$outFile = Join-Path $BackupDir "$dbName`_$stamp.sql"

# ---- ดัมป์ฐานข้อมูล ----
# --single-transaction = ไม่ล็อกตารางระหว่างสำรอง (ระบบใช้งานต่อได้ระหว่างนี้)
$dumpArgs = @("-u$dbUser")
if ($dbPass) { $dumpArgs += "-p$dbPass" }
$dumpArgs += @('--single-transaction', '--routines', '--events', '--default-character-set=utf8mb4', $dbName)

& $MysqlDump @dumpArgs | Out-File -FilePath $outFile -Encoding utf8
if ($LASTEXITCODE -ne 0) { throw "mysqldump ล้มเหลว (exit $LASTEXITCODE)" }

$sizeMb = [math]::Round((Get-Item $outFile).Length / 1MB, 2)
if ($sizeMb -eq 0) { throw "ไฟล์สำรองว่างเปล่า — ตรวจสอบชื่อฐาน/สิทธิ์ผู้ใช้" }
Write-Output "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] สำรองสำเร็จ: $outFile ($sizeMb MB)"

# ---- ลบไฟล์เก่าเกินกำหนด ----
$cutoff = (Get-Date).AddDays(-$KeepDays)
$old = Get-ChildItem -Path $BackupDir -Filter "$dbName`_*.sql" | Where-Object { $_.LastWriteTime -lt $cutoff }
foreach ($f in $old) {
    Remove-Item $f.FullName -Force
    Write-Output "  ลบไฟล์เก่า: $($f.Name)"
}
