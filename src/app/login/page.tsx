"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { buttonClass } from "@/lib/buttonStyles";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "confirm"
      ? "ลิงก์ยืนยันไม่ถูกต้องหรือหมดอายุ กรุณาลองใหม่อีกครั้ง"
      : null,
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(
        error.message === "Email not confirmed"
          ? "กรุณายืนยันอีเมลของคุณก่อนเข้าสู่ระบบ"
          : "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      );
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col items-center justify-center gap-6 px-4">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
          เข้าสู่ระบบ
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          เข้าสู่ระบบเพื่อบันทึกร้านโปรดและรีวิวร้านอาหารในนครสวรรค์
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
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
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              รหัสผ่าน
            </label>
            <Link href="/forgot-password" className="text-xs text-neutral-500 hover:underline dark:text-neutral-400">
              ลืมรหัสผ่าน?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={buttonClass("primary")}
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>

      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        ยังไม่มีบัญชี?{" "}
        <Link href="/signup" className="font-medium text-neutral-900 hover:underline dark:text-neutral-100">
          สมัครสมาชิก
        </Link>
      </p>
    </main>
  );
}
