import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ContactMessage } from "@/lib/supabase/messages";
import AdminReplyForm from "../AdminReplyForm";
import AdminMessageList from "../AdminMessageList";
import DeleteConversationButton from "../DeleteConversationButton";

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

  await adminClient
    .from("contact_messages")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_admin", false)
    .eq("is_read", false);

  const userMessage = (messages ?? []).find((m) => !m.is_admin);

  const { data: accountData } = await adminClient.auth.admin.getUserById(userId);
  const currentName = accountData.user?.user_metadata?.full_name ?? userMessage?.sender_name ?? "ผู้ใช้";
  const currentEmail = accountData.user?.email ?? userMessage?.sender_email ?? "";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href="/admin"
            className="flex items-center gap-1 text-sm text-emerald-700 hover:underline dark:text-emerald-400"
          >
            <ArrowLeft className="h-4 w-4" /> กลับไปกล่องข้อความ
          </Link>
          <h1 className="truncate text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">{currentName}</h1>
          <p className="truncate text-sm text-stone-500 dark:text-stone-400">{currentEmail}</p>
        </div>
        <DeleteConversationButton userId={userId} userName={currentName} redirectAfter />
      </div>

      <AdminMessageList userId={userId} initialMessages={messages ?? []} />

      <AdminReplyForm userId={userId} />
    </div>
  );
}
