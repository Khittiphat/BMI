# Software Requirements Specification (SRS)
## Project: BMI Web Application

## 1. Introduction (บทนำ)
### 1.1 Purpose (วัตถุประสงค์)
เอกสารนี้จัดทำขึ้นเพื่อระบุความต้องการของระบบ Web Application สำหรับคำนวณและติดตามค่าดัชนีมวลกาย (BMI) เพื่อใช้เป็นแนวทางในการพัฒนา ทดสอบ และส่งมอบงาน

### 1.2 Scope (ขอบเขต)
ระบบเป็น Web Application ที่รองรับผู้ใช้งานหลายคน (Multi-user) ช่วยให้ผู้ใช้สามารถบันทึกน้ำหนัก ส่วนสูง คำนวณค่า BMI และดูรายงานสถิติย้อนหลังได้

## 2. Technical Stack (เทคโนโลยีที่ใช้)
- **Framework**: Next.js (Latest Version) - ใช้สำหรับทั้ง Frontend และ Backend (API Routes / Server Actions)
- **Database**: SQLite - ฐานข้อมูล Relational แบบไฟล์เดียว เหมาะสำหรับโปรเจกต์ขนาดเล็กถึงกลาง
- **ORM**: Prisma (แนะนำ) - เพื่อการจัดการฐานข้อมูลที่ง่ายและ Type-safe
- **Styling**: Tailwind CSS - เพื่อการตกแต่งหน้าตาที่สวยงามและรวดเร็ว
- **Authentication**: NextAuth.js (หรือ Custom Session Management)

## 3. Functional Requirements (ความต้องการด้านฟังก์ชัน)

### 3.1 User Management (ระบบจัดการผู้ใช้งาน)
- **REQ-AUTH-01**: ระบบต้องรองรับผู้ใช้งานได้หลายคน (Multi-user Support)
- **REQ-AUTH-02**: ผู้ใช้งานสามารถลงทะเบียน (Register) เพื่อสร้างบัญชีใหม่ได้
- **REQ-AUTH-03**: ผู้ใช้งานสามารถเข้าสู่ระบบ (Login) เพื่อเข้าถึงข้อมูลส่วนตัวได้
- **REQ-AUTH-04**: ข้อมูล BMI ของผู้ใช้งานแต่ละคนต้องเป็นส่วนตัว ไม่ปะปนกับผู้ใช้อื่น

### 3.2 BMI Core Features (ระบบหลัก)
- **REQ-BMI-01**: ผู้ใช้งานสามารถบันทึกข้อมูลประจำวัน ได้แก่
  - น้ำหนัก (Weight - kg)
  - ส่วนสูง (Height - cm)
  - วันที่บันทึก (Date)
- **REQ-BMI-02**: ระบบคำนวณค่า BMI อัตโนมัติจากสูตร `BMI = น้ำหนัก(kg) / (ส่วนสูง(m))^2`
- **REQ-BMI-03**: ระบบแปลผลค่า BMI ตามเกณฑ์มาตรฐาน (เช่น ผอม, ปกติ, น้ำหนักเกิน, อ้วน)
- **REQ-BMI-04**: ผู้ใช้งานสามารถแก้ไขหรือลบรายการบันทึกของตนเองได้

### 3.3 MIS Reports (ระบบรายงานเพื่อการบริหารจัดการ)
ระบบต้องสามารถแสดงรายงานย้อนหลังเพื่อวิเคราะห์แนวโน้มสุขภาพได้ ดังนี้:
- **REQ-REP-01**: **รายงานรายวัน (Daily Report)** - แสดงรายละเอียดการบันทึกในแต่ละวัน
- **REQ-REP-02**: **รายงานรายสัปดาห์ (Weekly Report)** - กราฟหรือตารางสรุปค่าเฉลี่ยหรือความเปลี่ยนแปลงในรอบสัปดาห์
- **REQ-REP-03**: **รายงานรายเดือน (Monthly Report)** - ภาพรวมสุขภาพในแต่ละเดือน
- **REQ-REP-04**: **รายงานรายปี (Yearly Report)** - สถิติระยะยาวตลอดทั้งปี

## 4. Database Schema Design (Draft)

### Users Table
- `id`: Integer (PK)
- `username`: String (Unique)
- `password_hash`: String
- `created_at`: DateTime

### BMI_Records Table
- `id`: Integer (PK)
- `user_id`: Integer (FK -> Users.id)
- `weight`: Float
- `height`: Float
- `bmi_value`: Float
- `recorded_at`: DateTime (Default: Now)