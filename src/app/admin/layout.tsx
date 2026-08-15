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
    redirect("/login");
  }
  if (!isAdmin(user.email)) {
    redirect("/");
  }

  const adminClient = createAdminClient();
  const { count: pendingApplications } = await adminClient
    .from("owner_applications")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:flex-row sm:py-12">
      <AdminSidebar pendingApplications={pendingApplications ?? 0} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
