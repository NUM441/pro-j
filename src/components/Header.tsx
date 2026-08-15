import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
              Nakhon Sawan Food Guide
            </span>
            <span className="hidden text-sm text-neutral-400 sm:inline">
              คู่มือร้านอาหารนครสวรรค์
            </span>
          </Link>
          <Link
            href="/restaurants"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-50"
          >
            ร้านอาหาร
          </Link>
        </div>

        {user ? (
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="hidden text-sm font-medium text-neutral-600 hover:underline sm:inline dark:text-neutral-300"
            >
              {user.user_metadata?.full_name ?? user.email}
            </Link>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                ออกจากระบบ
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              เข้าสู่ระบบ
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              สมัครสมาชิก
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
