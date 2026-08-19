"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { buttonClass } from "@/lib/buttonStyles";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError("ตั้งรหัสผ่านใหม่ไม่สำเร็จ ลิงก์อาจหมดอายุ กรุณาขอลิงก์ใหม่อีกครั้ง");
      setLoading(false);
      return;
    }

    router.push("/login");
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col items-center justify-center gap-6 px-4">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50">
          ตั้งรหัสผ่านใหม่
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          กรอกรหัสผ่านใหม่สำหรับบัญชีของคุณ
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-stone-700 dark:text-stone-300">
            รหัสผ่านใหม่
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 outline-none focus:border-stone-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={buttonClass("primary")}
        >
          {loading ? "กำลังบันทึก..." : "บันทึกรหัสผ่านใหม่"}
        </button>
      </form>
    </main>
  );
}
