import type { createAdminClient } from "@/lib/supabase/admin";

export type ContactMessage = {
  id: string;
  user_id: string;
  sender_id: string;
  sender_name: string;
  sender_email: string;
  is_admin: boolean;
  message: string;
  image_url: string | null;
  is_read: boolean;
  created_at: string;
};

export type Conversation = {
  userId: string;
  userName: string;
  latestMessage: ContactMessage;
};

export async function getConversations(
  adminClient: ReturnType<typeof createAdminClient>,
): Promise<Conversation[]> {
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

  return [...conversations.values()];
}
