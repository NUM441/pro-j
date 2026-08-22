"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="flex items-center gap-1 text-sm font-medium text-stone-300 hover:text-white"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" /> ย้อนกลับ
    </button>
  );
}
