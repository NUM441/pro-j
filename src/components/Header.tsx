import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b-2 border-green-600">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:py-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="text-base font-bold text-neutral-900 sm:text-lg dark:text-neutral-50">
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
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/profile"
              className="hidden text-sm font-medium text-neutral-600 hover:underline sm:inline dark:text-neutral-300"
            >
              {user.user_metadata?.full_name ?? user.email}
            </Link>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-green-50 sm:px-4 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-green-950"
              >
                ออกจากระบบ
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-green-50 sm:px-4 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-green-950"
            >
              เข้าสู่ระบบ
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-green-700 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-green-600 sm:px-4 dark:bg-green-600 dark:hover:bg-green-500"
            >
              สมัครสมาชิก
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
