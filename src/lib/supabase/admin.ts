import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

function getAdminEmails() {
  return (process.env.ADMIN_EMAIL ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

export function isAdmin(email: string | null | undefined) {
  return !!email && getAdminEmails().includes(email);
}

// Used to satisfy the sender_id FK on automated system messages (e.g. the
// auto-reply sent to users), which must reference a real auth.users row.
export async function getPrimaryAdmin() {
  const adminEmails = getAdminEmails();
  if (adminEmails.length === 0) return null;

  const adminClient = createAdminClient();
  const { data } = await adminClient.auth.admin.listUsers();
  const match = data.users.find((u) => u.email && adminEmails.includes(u.email));
  return match ? { id: match.id, email: match.email ?? "" } : null;
}
