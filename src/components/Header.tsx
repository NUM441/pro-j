import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";
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

  const darkSecondaryButton =
    "inline-flex items-center justify-center rounded-full border border-stone-600 px-4 py-2 text-sm font-medium text-stone-200 transition hover:bg-stone-800";

  return (
    <header className="sticky top-0 z-50 border-b border-stone-800 bg-stone-900">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <BackButton />
          <Link href="/" aria-label="กลับหน้าหลัก" className="flex items-center gap-2">
            <Home className="h-5 w-5 text-emerald-400" aria-hidden="true" />
            <span className="text-base font-bold text-white sm:text-lg">
              Nakhon Sawan Food Guide
            </span>
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          {user ? (
            <>
              {isAdmin(user.email) && (
                <Link href="/admin" className="text-sm font-medium text-emerald-400 hover:underline">
                  Admin
                </Link>
              )}
              <Link
                href="/profile"
                className="flex items-center gap-2 text-sm font-medium text-stone-300 hover:text-white"
              >
                {user.user_metadata?.avatar_url ? (
                  <span className="relative h-7 w-7 flex-shrink-0 overflow-hidden rounded-full border border-stone-700">
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </span>
                ) : (
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-emerald-800 bg-emerald-950 text-xs font-semibold text-emerald-300">
                    {(user.user_metadata?.full_name ?? user.email ?? "?").charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="hidden sm:inline">{user.user_metadata?.full_name ?? user.email}</span>
              </Link>
              <form action="/auth/signout" method="post">
                <button type="submit" className={darkSecondaryButton}>
                  ออกจากระบบ
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/welcome" className={darkSecondaryButton}>
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
