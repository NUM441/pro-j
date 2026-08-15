# Nakhon Sawan Food Guide

คู่มือร้านอาหารนครสวรรค์ สำหรับนักท่องเที่ยว คนในพื้นที่ และนักเดินทางที่แวะผ่าน

สร้างด้วย [Next.js](https://nextjs.org) (App Router) + [Supabase](https://supabase.com) (Auth ด้วยอีเมล/รหัสผ่าน)

## เริ่มต้นใช้งาน

```bash
npm install
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

> ก่อนที่ระบบสมัครสมาชิก/เข้าสู่ระบบจะใช้งานได้ครบ ต้องตั้งค่า Supabase project ก่อน (ดูด้านล่าง)

## ตั้งค่า Supabase

### 1. สร้าง Supabase project

1. ไปที่ [supabase.com](https://supabase.com) แล้วสร้างโปรเจกต์ใหม่
2. ไปที่ **Project Settings → API** แล้วคัดลอกค่า `Project URL` และ `anon public` key

### 2. ตั้งค่า environment variables

คัดลอก `.env.local.example` เป็น `.env.local` แล้วใส่ค่าจาก Supabase:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. ตั้งค่า Site URL / Redirect URLs

ใน Supabase Dashboard ไปที่ **Authentication → URL Configuration**:

- **Site URL**: `http://localhost:3000` (ตอน dev) — เปลี่ยนเป็นโดเมนจริงตอน deploy
- **Redirect URLs**: เพิ่ม `http://localhost:3000/**` และโดเมนจริงตอน deploy (เช่น `https://your-domain.com/**`)

### 4. แก้ Email Templates (สำคัญ — ต้องทำ ไม่งั้นลิงก์ยืนยันอีเมล/ลืมรหัสผ่านจะใช้ไม่ได้)

โปรเจกต์นี้ใช้ route `/auth/confirm` ของเราเองในการยืนยันอีเมลและรีเซ็ตรหัสผ่าน (ไม่ใช้ลิงก์เริ่มต้นของ Supabase) ต้องเข้าไปแก้ template ใน **Authentication → Email Templates**:

**Confirm signup** — แก้ลิงก์ในอีเมลเป็น:
```
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/
```

**Reset Password** — แก้ลิงก์ในอีเมลเป็น:
```
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password
```

(ค่าเริ่มต้นของ Supabase ใช้ `{{ .ConfirmationURL }}` ซึ่งจะไม่ผ่าน route ของเรา ต้องเปลี่ยนเป็นแบบข้างบนนี้)

รัน `npm run dev` ใหม่หลังจากตั้งค่าเสร็จ แล้วลองสมัครสมาชิกที่หน้า `/signup`

## โครงสร้างโปรเจกต์ที่เกี่ยวกับ Auth

- `src/lib/supabase/client.ts` — Supabase client ฝั่ง browser
- `src/lib/supabase/server.ts` — Supabase client ฝั่ง server (Server Components)
- `src/lib/supabase/middleware.ts` + `src/proxy.ts` — รีเฟรช session cookie ทุก request
- `src/app/login/page.tsx` — หน้าเข้าสู่ระบบ (อีเมล/รหัสผ่าน)
- `src/app/signup/page.tsx` — หน้าสมัครสมาชิก (ชื่อที่แสดง/อีเมล/รหัสผ่าน)
- `src/app/forgot-password/page.tsx` — หน้าขอลิงก์ตั้งรหัสผ่านใหม่
- `src/app/reset-password/page.tsx` — หน้าตั้งรหัสผ่านใหม่
- `src/app/auth/confirm/route.ts` — ยืนยันลิงก์จากอีเมล (ทั้งยืนยันสมัครสมาชิกและลืมรหัสผ่าน)
- `src/app/auth/signout/route.ts` — ออกจากระบบ
- `src/components/Header.tsx` — แสดงสถานะ login และปุ่มเข้าสู่ระบบ/สมัครสมาชิก/ออกจากระบบ

## Deploy

Deploy ได้ง่ายที่สุดผ่าน [Vercel](https://vercel.com/new) — อย่าลืมตั้งค่า environment variables ตัวเดียวกับ `.env.local` บน Vercel ด้วย และอัปเดต Site URL / Redirect URLs ใน Supabase ให้เป็นโดเมนจริงด้วย
