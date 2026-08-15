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

  const { userId, message, imageUrl } = await request.json();
  if (
    typeof userId !== "string" ||
    typeof message !== "string" ||
    (message.trim() === "" && !imageUrl)
  ) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const adminClient = createAdminClient();
  const { data: saved, error: dbError } = await adminClient
    .from("contact_messages")
    .insert({
      user_id: userId,
      sender_id: user.id,
      sender_name: "แอดมิน",
      sender_email: user.email,
      is_admin: true,
      message,
      image_url: imageUrl ?? null,
    })
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }

  return NextResponse.json({ data: saved });
}
