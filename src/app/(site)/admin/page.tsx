import { createAdminClient } from "@/lib/supabase/admin";
import { getConversations } from "@/lib/supabase/messages";
import AdminInboxList from "./AdminInboxList";

export default async function AdminInboxPage() {
  const adminClient = createAdminClient();
  const conversations = await getConversations(adminClient);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
        กล่องข้อความ (แอดมิน)
      </h1>

      <AdminInboxList initialConversations={conversations} />
    </div>
  );
}
