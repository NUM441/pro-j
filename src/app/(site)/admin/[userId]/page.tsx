import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ContactMessage } from "@/lib/supabase/messages";
import AdminReplyForm from "../AdminReplyForm";

export default async function AdminConversationPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const adminClient = createAdminClient();
  const { data: messages } = await adminClient
    .from("contact_messages")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .returns<ContactMessage[]>();

  const userMessage = (messages ?? []).find((m) => !m.is_admin);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin" className="text-sm text-amber-700 hover:underline dark:text-amber-400">
          ← กลับไปกล่องข้อความ
        </Link>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50">
          {userMessage?.sender_name ?? "ผู้ใช้"}
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">{userMessage?.sender_email}</p>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-stone-200 p-4 dark:border-stone-800">
        {(messages ?? []).map((m) => (
          <div
            key={m.id}
            className={
              m.is_admin
                ? "max-w-[80%] rounded-2xl rounded-tl-sm bg-stone-100 px-3 py-2 text-sm text-stone-800 dark:bg-stone-800 dark:text-stone-100"
                : "ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-amber-100 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-200"
            }
          >
            {m.message}
          </div>
        ))}
      </div>

      <AdminReplyForm userId={userId} />
    </div>
  );
}
