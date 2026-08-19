import Image from "next/image";
import Link from "next/link";
import { Home, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/admin";
import { buttonClass } from "@/lib/buttonStyles";
import ThemeToggle from "./ThemeToggle";
import BackButton from "./BackButton";
import LiveClock from "./LiveClock";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b-2 border-emerald-600 bg-background">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:py-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <BackButton />
          <Link href="/home" aria-label="กลับหน้าหลัก" className="flex items-center gap-2">
            <Home className="h-5 w-5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
            <span className="text-base font-bold text-stone-900 sm:text-lg dark:text-stone-50">
              Nakhon Sawan Food Guide
            </span>
            <span className="hidden text-sm text-stone-400 sm:inline">
              คู่มือร้านอาหารนครสวรรค์
            </span>
          </Link>
          <Link
            href="/restaurants"
            className="flex items-center gap-1 text-sm font-medium text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-50"
          >
            <Search className="h-4 w-4" aria-hidden="true" /> ร้านอาหาร
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          {user ? (
            <>
              {isAdmin(user.email) && (
                <Link
                  href="/admin"
                  className="text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/profile"
                className="flex items-center gap-2 text-sm font-medium text-stone-600 hover:underline dark:text-stone-300"
              >
                {user.user_metadata?.avatar_url ? (
                  <span className="relative h-7 w-7 flex-shrink-0 overflow-hidden rounded-full border border-stone-300 dark:border-stone-700">
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </span>
                ) : (
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-100 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {(user.user_metadata?.full_name ?? user.email ?? "?").charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="hidden sm:inline">{user.user_metadata?.full_name ?? user.email}</span>
              </Link>
              <form action="/auth/signout" method="post">
                <button type="submit" className={buttonClass("secondary", "sm")}>
                  ออกจากระบบ
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/welcome" className={buttonClass("secondary", "sm")}>
                เข้าสู่ระบบ
              </Link>
              <Link href="/welcome?next=signup" className={buttonClass("primary", "sm")}>
                สมัครสมาชิก
              </Link>
            </>
          )}
          <LiveClock />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
