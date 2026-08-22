import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200 dark:border-stone-800">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-700 text-white">
            <UtensilsCrossed className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-stone-900 dark:text-stone-50">
              Nakhon Sawan Food Guide
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              คู่มือร้านอาหารนครสวรรค์ รวมร้านเด็ดในเมืองปากน้ำโพ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400">
          <Link href="/restaurants" className="hover:text-stone-900 dark:hover:text-stone-50">
            ร้านอาหารทั้งหมด
          </Link>
          <Link href="/profile/restaurants/new" className="hover:text-stone-900 dark:hover:text-stone-50">
            ลงร้านของคุณ
          </Link>
          <span>© {new Date().getFullYear()} Nakhon Sawan Food Guide</span>
        </div>
      </div>
    </footer>
  );
}
