import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ContactMessage } from "@/lib/supabase/messages";
import DeleteConversationButton from "./DeleteConversationButton";

type Conversation = {
  userId: string;
  userName: string;
  latestMessage: ContactMessage;
};

export default async function AdminInboxPage() {
  const adminClient = createAdminClient();
  const { data: messages } = await adminClient
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<ContactMessage[]>();

  const conversations = new Map<string, Conversation>();
  const userNames = new Map<string, string>();

  for (const m of messages ?? []) {
    if (!m.is_admin) userNames.set(m.user_id, m.sender_name);
  }

  for (const m of messages ?? []) {
    if (!conversations.has(m.user_id)) {
      conversations.set(m.user_id, {
        userId: m.user_id,
        userName: userNames.get(m.user_id) ?? m.sender_name,
        latestMessage: m,
      });
    }
  }

  await Promise.all(
    [...conversations.values()].map(async (c) => {
      const { data } = await adminClient.auth.admin.getUserById(c.userId);
      const currentName = data.user?.user_metadata?.full_name;
      if (currentName) c.userName = currentName;
    }),
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
        กล่องข้อความ (แอดมิน)
      </h1>

      {conversations.size === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          ยังไม่มีข้อความเข้ามา
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
          {[...conversations.values()].map((c) => (
            <div key={c.userId} className="flex items-center gap-2 p-2 transition hover:bg-blue-50 dark:hover:bg-blue-950">
              <Link href={`/admin/${c.userId}`} className="flex min-w-0 flex-1 flex-col gap-1 p-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium text-slate-900 dark:text-slate-50">
                    {c.userName}
                  </span>
                  <span className="shrink-0 text-xs text-slate-400">
                    {new Date(c.latestMessage.created_at).toLocaleString("th-TH", {
                      timeZone: "Asia/Bangkok",
                    })}
                  </span>
                </div>
                <p className="line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
                  {c.latestMessage.is_admin ? "คุณ: " : ""}
                  {c.latestMessage.message}
                </p>
              </Link>
              <DeleteConversationButton userId={c.userId} userName={c.userName} compact />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
