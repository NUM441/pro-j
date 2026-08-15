import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buttonClass } from "@/lib/buttonStyles";
import { WELCOME_IMAGE_KEY, type SiteSetting } from "@/lib/supabase/settings";

export default async function WelcomePage() {
  const supabase = await createClient();
  const [{ data: userData }, { data: setting }] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("site_settings")
      .select("*")
      .eq("key", WELCOME_IMAGE_KEY)
      .maybeSingle<SiteSetting>(),
  ]);

  const user = userData.user;
  const name = user?.user_metadata?.full_name ?? "";
  const welcomeImageUrl = setting?.value ?? null;

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center gap-6 px-4 text-center">
      {welcomeImageUrl ? (
        <div className="relative h-40 w-40 overflow-hidden rounded-full border border-stone-200 dark:border-stone-800">
          <Image src={welcomeImageUrl} alt="" fill className="object-cover" unoptimized />
        </div>
      ) : (
        <span className="text-5xl">🎉</span>
      )}

      {user ? (
        <>
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
        </>
      ) : (
        <>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-50">
              ยินดีต้อนรับสู่ Nakhon Sawan Food Guide
            </h1>
            <p className="text-stone-600 dark:text-stone-400">
              คู่มือร้านอาหารนครสวรรค์ สำหรับนักท่องเที่ยว คนในพื้นที่ และนักเดินทางที่แวะผ่าน
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
          </ul>

          <Link href="/login" className={buttonClass("primary")}>
            ต่อไป
          </Link>
        </>
      )}
    </main>
  );
}
