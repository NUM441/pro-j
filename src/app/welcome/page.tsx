import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buttonClass } from "@/lib/buttonStyles";
import { WELCOME_IMAGE_KEY, type SiteSetting } from "@/lib/supabase/settings";

export default async function WelcomePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const supabase = await createClient();
  const [{ data: userData }, { data: setting }, { next }] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("site_settings")
      .select("*")
      .eq("key", WELCOME_IMAGE_KEY)
      .maybeSingle<SiteSetting>(),
    searchParams,
  ]);

  const user = userData.user;
  const name = user?.user_metadata?.full_name ?? "";
  const welcomeImageUrl = setting?.value ?? null;
  const continueHref = next === "signup" ? "/signup" : "/login";

  const heading = welcomeImageUrl ? "text-white" : "text-slate-900 dark:text-slate-50";
  const body = welcomeImageUrl ? "text-white/80" : "text-slate-600 dark:text-slate-400";
  const listItem = welcomeImageUrl
    ? "border-white/30 bg-white/10 text-white backdrop-blur-sm"
    : "border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-300";

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16 text-center">
      {welcomeImageUrl && (
        <>
          <Image
            src={welcomeImageUrl}
            alt=""
            fill
            priority
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
        </>
      )}

      {!welcomeImageUrl && <span className="relative z-10 mb-6 text-5xl">🎉</span>}

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-6">
        {user ? (
          <>
            <div className="space-y-2">
              <h1 className={`text-3xl font-bold ${heading}`}>
                ยินดีต้อนรับ{name ? ` ${name}` : ""}!
              </h1>
              <p className={body}>บัญชีของคุณพร้อมใช้งานแล้ว ตอนนี้คุณสามารถ...</p>
            </div>

            <ul className="flex w-full flex-col gap-2 text-left text-sm">
              <li className={`flex items-center gap-2 rounded-xl border p-3 ${listItem}`}>
                🔍 ค้นหาและดูร้านอาหารในนครสวรรค์
              </li>
              <li className={`flex items-center gap-2 rounded-xl border p-3 ${listItem}`}>
                ❤️ บันทึกร้านโปรด และเขียนรีวิวพร้อมแนบรูป
              </li>
              <li className={`flex items-center gap-2 rounded-xl border p-3 ${listItem}`}>
                📅 จองโต๊ะร้านที่สนใจได้โดยตรง
              </li>
              <li className={`flex items-center gap-2 rounded-xl border p-3 ${listItem}`}>
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
              <h1 className={`text-3xl font-bold ${heading}`}>
                ยินดีต้อนรับสู่ Nakhon Sawan Food Guide
              </h1>
              <p className={body}>
                คู่มือร้านอาหารนครสวรรค์ สำหรับนักท่องเที่ยว คนในพื้นที่ และนักเดินทางที่แวะผ่าน
              </p>
            </div>

            <ul className="flex w-full flex-col gap-2 text-left text-sm">
              <li className={`flex items-center gap-2 rounded-xl border p-3 ${listItem}`}>
                🔍 ค้นหาและดูร้านอาหารในนครสวรรค์
              </li>
              <li className={`flex items-center gap-2 rounded-xl border p-3 ${listItem}`}>
                ❤️ บันทึกร้านโปรด และเขียนรีวิวพร้อมแนบรูป
              </li>
              <li className={`flex items-center gap-2 rounded-xl border p-3 ${listItem}`}>
                📅 จองโต๊ะร้านที่สนใจได้โดยตรง
              </li>
            </ul>

            <Link href={continueHref} className={buttonClass("primary")}>
              ต่อไป
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
