import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buttonClass } from "@/lib/buttonStyles";

export default async function WelcomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const name = user?.user_metadata?.full_name ?? "";

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center gap-6 px-4 text-center">
      <span className="text-5xl">🎉</span>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-50">
          ยินดีต้อนรับ{name ? ` ${name}` : ""}!
        </h1>
        <p className="text-stone-600 dark:text-stone-400">
          บัญชีของคุณพร้อมใช้งานแล้ว ตอนนี้คุณสามารถ...
        </p>
      </div>

      <ul className="flex w-full flex-col gap-2 text-left text-sm text-stone-700 dark:text-stone-300">
        <li className="flex items-center gap-2 rounded-xl border border-stone-200 p-3 dark:border-stone-800">
          🔍 ค้นหาและดูร้านอาหารในนครสวรรค์
        </li>
        <li className="flex items-center gap-2 rounded-xl border border-stone-200 p-3 dark:border-stone-800">
          ❤️ บันทึกร้านโปรด และเขียนรีวิวพร้อมแนบรูป
        </li>
        <li className="flex items-center gap-2 rounded-xl border border-stone-200 p-3 dark:border-stone-800">
          📅 จองโต๊ะร้านที่สนใจได้โดยตรง
        </li>
        <li className="flex items-center gap-2 rounded-xl border border-stone-200 p-3 dark:border-stone-800">
          🏪 สมัครลงร้านของคุณเองได้ที่หน้าโปรไฟล์
        </li>
      </ul>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/restaurants" className={buttonClass("primary")}>
          เริ่มสำรวจร้านอาหาร
        </Link>
        <Link href="/profile" className={buttonClass("secondary")}>
          ไปที่โปรไฟล์ของฉัน
        </Link>
      </div>
    </main>
  );
}
