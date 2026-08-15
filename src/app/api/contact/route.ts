import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { message } = await request.json();
  if (typeof message !== "string" || message.trim() === "") {
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
    })
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: "db_error" }, { status: 500 });
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
      text: `จาก: ${senderName} (${senderEmail})\n\n${message}`,
    });
  } catch {
    return NextResponse.json({ data: saved, emailSent: false });
  }

  return NextResponse.json({ data: saved, emailSent: true });
}
