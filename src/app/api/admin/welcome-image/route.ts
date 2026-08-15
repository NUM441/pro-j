import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isAdmin } from "@/lib/supabase/admin";
import { WELCOME_IMAGE_KEY } from "@/lib/supabase/settings";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { url } = await request.json();
  if (url !== null && typeof url !== "string") {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const adminClient = createAdminClient();
  const { error: dbError } = await adminClient
    .from("site_settings")
    .upsert({ key: WELCOME_IMAGE_KEY, value: url, updated_at: new Date().toISOString() });

  if (dbError) {
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
