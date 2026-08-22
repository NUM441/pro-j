import Link from "next/link";
import { Home } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-800 bg-stone-900">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2">
          <Home className="h-4 w-4 text-emerald-400" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-white">
              Nakhon Sawan Food Guide
            </p>
            <p className="text-xs text-stone-400">
              คู่มือร้านอาหารนครสวรรค์ รวมร้านเด็ดในเมืองปากน้ำโพ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-stone-400">
          <Link href="/restaurants" className="hover:text-white">
            ร้านอาหารทั้งหมด
          </Link>
          <Link href="/profile/restaurants/new" className="hover:text-white">
            ลงร้านของคุณ
          </Link>
          <span>© {new Date().getFullYear()} Nakhon Sawan Food Guide</span>
        </div>
      </div>
    </footer>
  );
}
