import Image from "next/image";
import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/admin";
import { buttonClass } from "@/lib/buttonStyles";
import ThemeToggle from "./ThemeToggle";
import BackButton from "./BackButton";
import LiveClock from "./LiveClock";
import HeaderNav from "./HeaderNav";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur dark:border-stone-800 dark:bg-stone-900/95">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <BackButton />
          <Link href="/" aria-label="กลับหน้าหลัก" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 text-white shadow-sm">
              <UtensilsCrossed className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-base font-bold text-stone-900 sm:text-lg dark:text-stone-50">
              Nakhon Sawan Food Guide
            </span>
          </Link>
        </div>

        <HeaderNav />

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
                className="flex items-center gap-2 rounded-full bg-stone-100 py-1 pr-3 pl-1 text-sm font-medium text-stone-700 transition hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
              >
                {user.user_metadata?.avatar_url ? (
                  <span className="relative h-7 w-7 flex-shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </span>
                ) : (
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
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
