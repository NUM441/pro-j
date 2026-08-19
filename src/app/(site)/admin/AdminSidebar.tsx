"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar({
  pendingApplications,
  unreadConversations,
}: {
  pendingApplications: number;
  unreadConversations: number;
}) {
  const pathname = usePathname();

  const items = [
    { href: "/admin", label: "กล่องข้อความ", icon: "💬", badge: unreadConversations },
    { href: "/admin/owner-applications", label: "คำขอเป็นเจ้าของร้าน", icon: "🏪", badge: pendingApplications },
    { href: "/admin/restaurants", label: "ร้านอาหารทั้งหมด", icon: "🍜", badge: 0 },
    { href: "/admin/welcome-image", label: "รูปหน้า Welcome", icon: "🖼️", badge: 0 },
  ];

  return (
    <nav className="flex w-full shrink-0 snap-x scroll-px-4 flex-row gap-2 overflow-x-auto border-b border-stone-200 pb-3 sm:w-56 sm:flex-col sm:gap-1 sm:overflow-visible sm:border-b-0 sm:border-r sm:pr-4 sm:pb-0 sm:snap-none dark:border-stone-800">
      {items.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              active
                ? "flex shrink-0 snap-start items-center gap-2 rounded-xl border border-emerald-700 bg-emerald-700 px-3 py-2.5 text-sm font-medium text-white"
                : "flex shrink-0 snap-start items-center gap-2 rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-600 transition hover:bg-emerald-50 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-emerald-950"
            }
          >
            <span aria-hidden="true">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            {item.badge > 0 && (
              <span className="rounded-full bg-red-600 px-1.5 py-0.5 text-xs font-bold text-white">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
