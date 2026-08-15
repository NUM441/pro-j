"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    if (error) {
      setError(
        error.message === "User already registered"
          ? "อีเมลนี้ถูกใช้สมัครสมาชิกไปแล้ว"
          : "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
      );
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
          เช็คอีเมลของคุณ
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          เราได้ส่งลิงก์ยืนยันไปที่ {email} แล้ว กรุณากดยืนยันก่อนเข้าสู่ระบบ
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col items-center justify-center gap-6 px-4">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
          สมัครสมาชิก
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          สมัครสมาชิกเพื่อบันทึกร้านโปรดและรีวิวร้านอาหารในนครสวรรค์
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="fullName" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            ชื่อที่แสดง
          </label>
          <input
            id="fullName"
            type="text"
            required
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            อีเมล
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            รหัสผ่าน
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-green-700 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-green-600 disabled:opacity-60 dark:bg-green-600 dark:hover:bg-green-500"
        >
          {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
        </button>
      </form>

      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        มีบัญชีอยู่แล้ว?{" "}
        <Link href="/login" className="font-medium text-neutral-900 hover:underline dark:text-neutral-100">
          เข้าสู่ระบบ
        </Link>
      </p>
    </main>
  );
}
