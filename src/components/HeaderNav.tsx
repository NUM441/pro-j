"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "หน้าแรก" },
  { href: "/restaurants", label: "ร้านอาหารทั้งหมด" },
  { href: "/restaurants/nearby", label: "ร้านใกล้ฉัน" },
];

function matches(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export default function HeaderNav() {
  const pathname = usePathname();
  const activeHref = ITEMS.filter((item) => matches(pathname, item.href)).sort(
    (a, b) => b.href.length - a.href.length,
  )[0]?.href;

  return (
    <nav className="order-3 flex w-full items-center gap-1 overflow-x-auto rounded-full bg-stone-100 p-1 md:order-none md:w-auto">
      {ITEMS.map((item) => {
        const active = item.href === activeHref;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              active
                ? "shrink-0 rounded-full bg-white px-3 py-1 text-xs font-medium text-stone-900 shadow-sm sm:px-4 sm:py-1.5 sm:text-sm"
                : "shrink-0 rounded-full px-3 py-1 text-xs font-medium text-stone-500 transition hover:text-stone-900 sm:px-4 sm:py-1.5 sm:text-sm"
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
