import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isAdmin } from "@/lib/supabase/admin";
import { RESTAURANT_PHOTOS_BUCKET } from "@/lib/supabase/restaurants";

async function removeStorageFile(
  adminClient: ReturnType<typeof createAdminClient>,
  imageUrl: string,
) {
  const marker = `/public/${RESTAURANT_PHOTOS_BUCKET}/`;
  const idx = imageUrl.indexOf(marker);
  if (idx === -1) return;
  const path = imageUrl.slice(idx + marker.length);
  await adminClient.storage.from(RESTAURANT_PHOTOS_BUCKET).remove([path]);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { messageId, userId } = await request.json();
  const adminClient = createAdminClient();

  if (typeof messageId === "string") {
    const { data: msg } = await adminClient
      .from("contact_messages")
      .select("image_url")
      .eq("id", messageId)
      .single();

    if (msg?.image_url) {
      await removeStorageFile(adminClient, msg.image_url);
    }

    const { error } = await adminClient.from("contact_messages").delete().eq("id", messageId);
    if (error) {
      return NextResponse.json({ error: "db_error" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  if (typeof userId === "string") {
    const { data: msgs } = await adminClient
      .from("contact_messages")
      .select("image_url")
      .eq("user_id", userId);

    await Promise.all(
      (msgs ?? [])
        .filter((m) => m.image_url)
        .map((m) => removeStorageFile(adminClient, m.image_url as string)),
    );

    const { error } = await adminClient.from("contact_messages").delete().eq("user_id", userId);
    if (error) {
      return NextResponse.json({ error: "db_error" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "invalid_request" }, { status: 400 });
}
