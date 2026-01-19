# Project Tasks: BMI Web Application

สถานะงาน: [ ] ยังไม่ทำ, [-] กำลังทำ, [x] เสร็จแล้ว

## Phase 1: Project Initialization & Infrastructure
การเตรียมความพร้อมของโปรเจกต์และเครื่องมือต่างๆ
- [ ] **Setup Project**
    - [ ] Initialize Next.js project (Latest version)
    - [ ] Setup Tailwind CSS
    - [ ] Clean up default boilerplate code
- [ ] **Database Setup**
    - [ ] Install Prisma & SQLite
    - [ ] Initialize Prisma (`npx prisma init`)
    - [ ] Define `User` schema in `schema.prisma`
    - [ ] Define `BMIRecord` schema in `schema.prisma`
    - [ ] Run migration (`npx prisma migrate dev`)

## Phase 2: User Authentication (Auth)
ระบบจัดการผู้ใช้งาน เพื่อรองรับ Multi-user
- [x] **Backend (API/Actions)**
    - [x] Create Server Actions for User Registration (Hash password)
    - [x] Create Server Actions for Login (Verify password & Create Session/Cookie)
    - [x] Create Logout functionality
- [x] **Frontend (UI)**
    - [x] Create Login Page (`/login`)
    - [x] Create Register Page (`/register`)
    - [x] Implement Route Protection (Middleware to protect dashboard)

## Phase 3: Core BMI Features
ฟังก์ชันหลักสำหรับการบันทึกและคำนวณ BMI
- [x] **Backend (API/Actions)**
    - [x] Create Action: Add BMI Record (Calculate BMI automatically)
    - [x] Create Action: Get BMI History (List records for current user)
    - [x] Create Action: Delete BMI Record
    - [x] Create Action: Edit BMI Record (Optional but recommended)
- [x] **Frontend (UI)**
    - [x] Create Dashboard Layout (Sidebar/Navbar)
    - [x] Create "Add BMI" Form (Input Weight, Height, Date)
    - [x] Display BMI History List (Table format)
    - [x] Implement Delete button in list

## Phase 4: MIS Reports (Visualization)
ระบบรายงานสรุปผลตามช่วงเวลา
- [x] **Backend (Data Aggregation)**
    - [x] Create Action: Get Daily Stats
    - [x] Create Action: Get Weekly Stats (Average BMI/Weight per week)
    - [x] Create Action: Get Monthly Stats
    - [x] Create Action: Get Yearly Stats
- [x] **Frontend (Charts & Summary)**
    - [x] Install Chart library (e.g., Recharts or Chart.js)
    - [x] Create Dashboard Widget: Current BMI & Status (e.g., Normal, Overweight)
    - [x] Create Chart: Weight Trend (Line Chart)
    - [x] Create Report Page: Daily/Weekly/Monthly/Yearly Views

## Phase 5: Refinement & Polish
การตกแต่งและตรวจสอบความเรียบร้อย
- [x] **UI/UX**
    - [x] Improve Responsive Design (Mobile friendly)
    - [x] Add Loading states & Error handling (Toasts/Alerts)
- [x] **Testing**
    - [x] Manual test: Register -> Login -> Add -> View Reports -> Logout