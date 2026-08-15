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

  const { restaurantName, phone, message } = await request.json();
  if (
    typeof restaurantName !== "string" ||
    restaurantName.trim() === "" ||
    typeof phone !== "string" ||
    phone.trim() === "" ||
    typeof message !== "string" ||
    message.trim() === ""
  ) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const applicantName = user.user_metadata?.full_name ?? user.email ?? "";
  const applicantEmail = user.email ?? "";

  const { data: saved, error: dbError } = await supabase
    .from("owner_applications")
    .insert({
      applicant_id: user.id,
      applicant_name: applicantName,
      applicant_email: applicantEmail,
      restaurant_name: restaurantName,
      phone,
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
      replyTo: applicantEmail,
      subject: `[Nakhon Sawan Food Guide] คำขอเป็นเจ้าของร้านใหม่จาก ${applicantName}`,
      text: `ผู้สมัคร: ${applicantName} (${applicantEmail})\nร้าน: ${restaurantName}\nเบอร์โทร: ${phone}\n\n${message}`,
    });
  } catch {
    return NextResponse.json({ data: saved, emailSent: false });
  }

  return NextResponse.json({ data: saved, emailSent: true });
}
