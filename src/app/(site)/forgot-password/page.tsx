"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { buttonClass } from "@/lib/buttonStyles";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/confirm?next=/reset-password`,
    });

    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50">
          เช็คอีเมลของคุณ
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          ถ้าอีเมลนี้มีอยู่ในระบบ เราได้ส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปให้แล้ว
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col items-center justify-center gap-6 px-4">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50">
          ลืมรหัสผ่าน
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          กรอกอีเมลที่ใช้สมัครสมาชิก เราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ให้
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-stone-700 dark:text-stone-300">
            อีเมล
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 outline-none focus:border-stone-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={buttonClass("primary")}
        >
          {loading ? "กำลังส่ง..." : "ส่งลิงก์ตั้งรหัสผ่านใหม่"}
        </button>
      </form>

      <p className="text-sm text-stone-500 dark:text-stone-400">
        <Link href="/welcome" className="font-medium text-stone-900 hover:underline dark:text-stone-100">
          กลับไปหน้าเข้าสู่ระบบ
        </Link>
      </p>
    </main>
  );
}
