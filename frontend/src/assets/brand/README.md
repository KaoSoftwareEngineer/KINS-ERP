# Plum Flow Solution — Brand Assets

โลโก้ต้นฉบับ (วาดใหม่ 100% ไม่ติดลิขสิทธิ์) สำหรับระบบ KINS ERP
คอนเซปต์: ปุ่ม Power = "เปิด/ขับเคลื่อนระบบ" + ใบไม้ = เติบโต

## ไฟล์ในโฟลเดอร์นี้
| ไฟล์ | รายละเอียด |
|------|-----------|
| `plum-mark-orange.svg`  | สัญลักษณ์อย่างเดียว โทนส้ม (หลัก) |
| `plum-mark-purple.svg`  | สัญลักษณ์อย่างเดียว โทนม่วงพลัม + ใบเขียว |
| `plum-mark-mono.svg`    | สัญลักษณ์สีเดียว (currentColor) — สำหรับสแตมป์/ขาวดำ |
| `plum-logo-horizontal-orange.svg` | โลโก้เต็ม แนวนอน: มาร์ก + PLUM + FLOW SOLUTION (ตัวหลัก) |

## สีแบรนด์
- ส้มหลัก `#FF7A29` → `#E8580F`
- ใบ (ส้ม-เหลือง) `#F5A623` → `#FFD24D`
- โทนม่วงทางเลือก `#7C2560` / `#5C1B49` + ใบเขียว `#6FB33C`

## วิธีเรียกใช้
คอมโพเนนต์หลัก (ปรับขนาด/ข้อความได้):
```vue
import BrandLogo from '@/components/BrandLogo.vue';
<BrandLogo :size="34" :text-size="21" />          <!-- มาร์ก + PLUM -->
<BrandLogo :size="46" light-text />               <!-- อักษรขาว บนพื้นมืด -->
<BrandLogo :size="30" :show-text="false" />        <!-- มาร์กอย่างเดียว -->
```
เรียกไฟล์ SVG ตรง ๆ:
```vue
import markOrange from '@/assets/brand/plum-mark-orange.svg';
<img :src="markOrange" alt="Plum" />
```

ใช้อยู่แล้วที่: Sidebar/หัวเว็บ (`views/Dashboard.vue`), หน้า Login (`views/Login.vue`),
favicon (`public/favicon.svg`)
