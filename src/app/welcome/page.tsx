import Image from "next/image";
import Link from "next/link";
import { Calendar, Heart, PartyPopper, Search, Store } from "lucide-react";
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

  const heading = welcomeImageUrl ? "text-white" : "text-stone-900 dark:text-stone-50";
  const body = welcomeImageUrl ? "text-white/80" : "text-stone-600 dark:text-stone-400";
  const listItem = welcomeImageUrl
    ? "border-white/30 bg-white/10 text-white backdrop-blur-sm"
    : "border-stone-200 text-stone-700 dark:border-stone-800 dark:text-stone-300";

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

      {!welcomeImageUrl && (
        <PartyPopper className="relative z-10 mb-6 h-12 w-12 text-emerald-600 dark:text-emerald-400" />
      )}

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-6">
        {user ? (
          <>
            <div className="space-y-2">
              <h1 className={`text-3xl font-bold ${heading}`}>
                ยินดีต้อนรับ{name ? ` ${name}` : ""}!{" "}
                <span className="align-middle rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                  DEMO
                </span>
              </h1>
              <p className={body}>บัญชีของคุณพร้อมใช้งานแล้ว ตอนนี้คุณสามารถ...</p>
            </div>

            <ul className="flex w-full flex-col gap-2 text-left text-sm">
              <li className={`flex items-center gap-2 rounded-xl border p-3 ${listItem}`}>
                <Search className="h-4 w-4 shrink-0" /> ค้นหาและดูร้านอาหารในนครสวรรค์
              </li>
              <li className={`flex items-center gap-2 rounded-xl border p-3 ${listItem}`}>
                <Heart className="h-4 w-4 shrink-0" /> บันทึกร้านโปรด และเขียนรีวิวพร้อมแนบรูป
              </li>
              <li className={`flex items-center gap-2 rounded-xl border p-3 ${listItem}`}>
                <Calendar className="h-4 w-4 shrink-0" /> จองโต๊ะร้านที่สนใจได้โดยตรง
              </li>
              <li className={`flex items-center gap-2 rounded-xl border p-3 ${listItem}`}>
                <Store className="h-4 w-4 shrink-0" /> สมัครลงร้านของคุณเองได้ที่หน้าโปรไฟล์
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
                ยินดีต้อนรับสู่ Nakhon Sawan Food Guide{" "}
                <span className="align-middle rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                  DEMO
                </span>
              </h1>
              <p className={body}>
                คู่มือร้านอาหารนครสวรรค์ สำหรับนักท่องเที่ยว คนในพื้นที่ และนักเดินทางที่แวะผ่าน
              </p>
            </div>

            <ul className="flex w-full flex-col gap-2 text-left text-sm">
              <li className={`flex items-center gap-2 rounded-xl border p-3 ${listItem}`}>
                <Search className="h-4 w-4 shrink-0" /> ค้นหาและดูร้านอาหารในนครสวรรค์
              </li>
              <li className={`flex items-center gap-2 rounded-xl border p-3 ${listItem}`}>
                <Heart className="h-4 w-4 shrink-0" /> บันทึกร้านโปรด และเขียนรีวิวพร้อมแนบรูป
              </li>
              <li className={`flex items-center gap-2 rounded-xl border p-3 ${listItem}`}>
                <Calendar className="h-4 w-4 shrink-0" /> จองโต๊ะร้านที่สนใจได้โดยตรง
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
