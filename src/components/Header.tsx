import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/admin";
import { buttonClass } from "@/lib/buttonStyles";
import ThemeToggle from "./ThemeToggle";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b-2 border-green-600">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:py-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link href="/" aria-label="กลับหน้าหลัก" className="flex items-baseline gap-2">
            <span className="text-lg" aria-hidden="true">🏠</span>
            <span className="text-base font-bold text-neutral-900 sm:text-lg dark:text-neutral-50">
              Nakhon Sawan Food Guide
            </span>
            <span className="hidden text-sm text-neutral-400 sm:inline">
              คู่มือร้านอาหารนครสวรรค์
            </span>
          </Link>
          <Link
            href="/restaurants"
            className="flex items-center gap-1 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-50"
          >
            <span aria-hidden="true">🔍</span> ร้านอาหาร
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {isAdmin(user.email) && (
                <Link
                  href="/admin"
                  className="text-sm font-medium text-green-700 hover:underline dark:text-green-400"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/profile"
                className="hidden items-center gap-2 text-sm font-medium text-neutral-600 hover:underline sm:flex dark:text-neutral-300"
              >
                {user.user_metadata?.avatar_url ? (
                  <span className="relative h-6 w-6 flex-shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </span>
                ) : (
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-semibold text-green-700 dark:bg-green-950 dark:text-green-300">
                    {(user.user_metadata?.full_name ?? user.email ?? "?").charAt(0).toUpperCase()}
                  </span>
                )}
                {user.user_metadata?.full_name ?? user.email}
              </Link>
              <form action="/auth/signout" method="post">
                <button type="submit" className={buttonClass("secondary", "sm")}>
                  ออกจากระบบ
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className={buttonClass("secondary", "sm")}>
                เข้าสู่ระบบ
              </Link>
              <Link href="/signup" className={buttonClass("primary", "sm")}>
                สมัครสมาชิก
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
