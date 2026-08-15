import { createClient } from "@/lib/supabase/server";
import { WELCOME_IMAGE_KEY, type SiteSetting } from "@/lib/supabase/settings";
import WelcomeImageForm from "./WelcomeImageForm";

export default async function WelcomeImagePage() {
  const supabase = await createClient();
  const [{ data: setting }, { data: userData }] = await Promise.all([
    supabase
      .from("site_settings")
      .select("*")
      .eq("key", WELCOME_IMAGE_KEY)
      .maybeSingle<SiteSetting>(),
    supabase.auth.getUser(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50">รูปหน้า Welcome</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          รูปนี้จะแสดงบนหน้าต้อนรับที่ผู้ใช้ใหม่เห็นหลังยืนยันอีเมลสำเร็จ
        </p>
      </div>

      <WelcomeImageForm adminUserId={userData.user!.id} currentUrl={setting?.value ?? null} />
    </div>
  );
}
