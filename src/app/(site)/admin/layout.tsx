import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isAdmin } from "@/lib/supabase/admin";
import AdminSidebar from "./AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/welcome");
  }
  if (!isAdmin(user.email)) {
    redirect("/home");
  }

  const adminClient = createAdminClient();
  const { count: pendingApplications } = await adminClient
    .from("owner_applications")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  const { data: unreadRows } = await adminClient
    .from("contact_messages")
    .select("user_id")
    .eq("is_admin", false)
    .eq("is_read", false);
  const unreadConversations = new Set((unreadRows ?? []).map((r) => r.user_id)).size;

  return (
    <div className="flex w-full flex-col gap-6 px-4 py-8 sm:flex-row sm:px-6 sm:py-12">
      <AdminSidebar pendingApplications={pendingApplications ?? 0} unreadConversations={unreadConversations} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
