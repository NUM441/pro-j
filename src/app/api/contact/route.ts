import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, getPrimaryAdmin } from "@/lib/supabase/admin";

const AUTO_REPLY_SENDER_NAME = "ระบบ (ตอบรับอัตโนมัติ)";
const AUTO_REPLY_MESSAGE = "รอแอดมินติดต่อกลับสักครู่นะครับ";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { message, imageUrl } = await request.json();
  if (typeof message !== "string" || (message.trim() === "" && !imageUrl)) {
    return NextResponse.json({ error: "invalid_message" }, { status: 400 });
  }

  const senderName = user.user_metadata?.full_name ?? user.email ?? "";
  const senderEmail = user.email ?? "";

  const { data: saved, error: dbError } = await supabase
    .from("contact_messages")
    .insert({
      user_id: user.id,
      sender_id: user.id,
      sender_name: senderName,
      sender_email: senderEmail,
      is_admin: false,
      message,
      image_url: imageUrl ?? null,
    })
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }

  const { data: prevMessage } = await supabase
    .from("contact_messages")
    .select("is_admin, sender_name")
    .eq("user_id", user.id)
    .neq("id", saved.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const alreadyWaitingOnAutoReply =
    prevMessage?.is_admin === true && prevMessage?.sender_name === AUTO_REPLY_SENDER_NAME;

  if (!alreadyWaitingOnAutoReply) {
    const admin = await getPrimaryAdmin();
    if (admin) {
      await createAdminClient()
        .from("contact_messages")
        .insert({
          user_id: user.id,
          sender_id: admin.id,
          sender_name: AUTO_REPLY_SENDER_NAME,
          sender_email: admin.email,
          is_admin: true,
          message: AUTO_REPLY_MESSAGE,
        });
    }
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.CONTACT_SMTP_USER,
        pass: process.env.CONTACT_SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.CONTACT_SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      replyTo: senderEmail,
      subject: `[Nakhon Sawan Food Guide] ข้อความใหม่จาก ${senderName}`,
      text: `จาก: ${senderName} (${senderEmail})\n\n${message}${imageUrl ? "\n[แนบรูปภาพ]" : ""}`,
    });
  } catch {
    return NextResponse.json({ data: saved, emailSent: false });
  }

  return NextResponse.json({ data: saved, emailSent: true });
}
