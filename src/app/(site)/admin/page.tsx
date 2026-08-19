import { createAdminClient } from "@/lib/supabase/admin";
import type { ContactMessage } from "@/lib/supabase/messages";
import AdminInboxList, { type Conversation } from "./AdminInboxList";

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
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50">
        กล่องข้อความ (แอดมิน)
      </h1>

      <AdminInboxList initialConversations={[...conversations.values()]} />
    </div>
  );
}
