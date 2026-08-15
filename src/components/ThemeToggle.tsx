"use client";

import { useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark"),
  );

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="สลับโหมดมืด/สว่าง"
      suppressHydrationWarning
      className="flex h-8 w-8 items-center justify-center rounded-full text-lg transition hover:bg-green-50 dark:hover:bg-green-950"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
