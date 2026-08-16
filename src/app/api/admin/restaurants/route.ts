import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isAdmin } from "@/lib/supabase/admin";
import { RESTAURANT_PHOTOS_BUCKET } from "@/lib/supabase/restaurants";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { restaurantId, ownerId } = await request.json();
  if (typeof restaurantId !== "string" || typeof ownerId !== "string") {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const adminClient = createAdminClient();

  const folder = `${ownerId}/${restaurantId}`;
  const { data: files } = await adminClient.storage.from(RESTAURANT_PHOTOS_BUCKET).list(folder);
  if (files && files.length > 0) {
    await adminClient.storage
      .from(RESTAURANT_PHOTOS_BUCKET)
      .remove(files.map((f) => `${folder}/${f.name}`));
  }

  const { error: dbError } = await adminClient.from("restaurants").delete().eq("id", restaurantId);
  if (dbError) {
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
