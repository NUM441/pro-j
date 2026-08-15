import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isAdmin } from "@/lib/supabase/admin";
import type { ContactMessage } from "@/lib/supabase/messages";
import AdminReplyForm from "../AdminReplyForm";

export default async function AdminConversationPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }
  if (!isAdmin(user.email)) {
    redirect("/");
  }

  const adminClient = createAdminClient();
  const { data: messages } = await adminClient
    .from("contact_messages")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .returns<ContactMessage[]>();

  const userMessage = (messages ?? []).find((m) => !m.is_admin);

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-12">
      <div>
        <Link href="/admin" className="text-sm text-green-700 hover:underline dark:text-green-400">
          ← กลับไปกล่องข้อความ
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
          {userMessage?.sender_name ?? "ผู้ใช้"}
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{userMessage?.sender_email}</p>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
        {(messages ?? []).map((m) => (
          <div
            key={m.id}
            className={
              m.is_admin
                ? "max-w-[80%] rounded-2xl rounded-tl-sm bg-neutral-100 px-3 py-2 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                : "ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-green-100 px-3 py-2 text-sm text-green-900 dark:bg-green-950 dark:text-green-200"
            }
          >
            {m.message}
          </div>
        ))}
      </div>

      <AdminReplyForm userId={userId} />
    </main>
  );
}
