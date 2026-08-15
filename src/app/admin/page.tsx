import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isAdmin } from "@/lib/supabase/admin";
import type { ContactMessage } from "@/lib/supabase/messages";

type Conversation = {
  userId: string;
  userName: string;
  latestMessage: ContactMessage;
};

export default async function AdminInboxPage() {
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
  const [{ data: messages }, { count: pendingApplications }] = await Promise.all([
    adminClient
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .returns<ContactMessage[]>(),
    adminClient
      .from("owner_applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

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

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
          กล่องข้อความ (แอดมิน)
        </h1>
        <Link
          href="/admin/owner-applications"
          className="flex items-center gap-1.5 text-sm font-medium text-green-700 hover:underline dark:text-green-400"
        >
          คำขอเป็นเจ้าของร้าน
          {!!pendingApplications && (
            <span className="rounded-full bg-red-600 px-1.5 py-0.5 text-xs font-bold text-white">
              {pendingApplications}
            </span>
          )}
        </Link>
      </div>

      {conversations.size === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
          ยังไม่มีข้อความเข้ามา
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-neutral-200 rounded-xl border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
          {[...conversations.values()].map((c) => (
            <Link
              key={c.userId}
              href={`/admin/${c.userId}`}
              className="flex flex-col gap-1 p-4 transition hover:bg-green-50 dark:hover:bg-green-950"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-neutral-900 dark:text-neutral-50">
                  {c.userName}
                </span>
                <span className="text-xs text-neutral-400">
                  {new Date(c.latestMessage.created_at).toLocaleString("th-TH")}
                </span>
              </div>
              <p className="line-clamp-1 text-sm text-neutral-500 dark:text-neutral-400">
                {c.latestMessage.is_admin ? "คุณ: " : ""}
                {c.latestMessage.message}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
