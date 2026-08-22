"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "หน้าแรก" },
  { href: "/restaurants", label: "ร้านอาหารทั้งหมด" },
];

export default function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 rounded-full bg-stone-100 p-1 md:flex">
      {ITEMS.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              active
                ? "rounded-full bg-white px-4 py-1.5 text-sm font-medium text-stone-900 shadow-sm"
                : "rounded-full px-4 py-1.5 text-sm font-medium text-stone-500 transition hover:text-stone-900"
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
