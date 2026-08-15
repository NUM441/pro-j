import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { applicationId, status } = await request.json();
  if (
    typeof applicationId !== "string" ||
    (status !== "approved" && status !== "rejected")
  ) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const adminClient = createAdminClient();
  const { error: dbError } = await adminClient
    .from("owner_applications")
    .update({ status })
    .eq("id", applicationId);

  if (dbError) {
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
