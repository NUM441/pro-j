"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageCircle, Paperclip, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { buttonClass } from "@/lib/buttonStyles";
import { RESTAURANT_PHOTOS_BUCKET } from "@/lib/supabase/restaurants";
import type { ContactMessage } from "@/lib/supabase/messages";

export default function ContactChatWidget() {
  const [open, setOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function initUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!cancelled) {
        setUserId(user?.id ?? null);
        setCheckingAuth(false);
      }
    }

    initUser();
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !userId) return;

    let cancelled = false;
    const supabase = createClient();

    async function loadMessages() {
      const { data } = await supabase
        .from("contact_messages")
        .select("*")
        .eq("user_id", userId as string)
        .order("created_at", { ascending: true })
        .returns<ContactMessage[]>();
      if (!cancelled) setMessages(data ?? []);
    }

    loadMessages();
    const interval = setInterval(loadMessages, 5000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [open, userId]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleRemoveImage() {
    setImageFile(null);
    setImagePreview(null);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() && !imageFile) return;

    setSending(true);
    setError(null);

    try {
      let imageUrl: string | null = null;
      if (imageFile && userId) {
        const supabase = createClient();
        const ext = imageFile.name.split(".").pop() ?? "jpg";
        const path = `${userId}/chat-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from(RESTAURANT_PHOTOS_BUCKET)
          .upload(path, imageFile, { upsert: true });
        if (uploadError) throw uploadError;
        imageUrl = supabase.storage.from(RESTAURANT_PHOTOS_BUCKET).getPublicUrl(path).data.publicUrl;
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, imageUrl }),
      });
      const body = await res.json();

      if (!res.ok) {
        setError("ส่งข้อความไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        return;
      }

      setMessages((prev) => [...prev, body.data]);
      setText("");
      handleRemoveImage();
    } catch {
      setError("ส่งข้อความไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-96 max-h-[calc(100vh-6rem)] w-80 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl dark:border-stone-800 dark:bg-stone-900">
          <div className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 dark:border-stone-800 dark:bg-stone-900">
            <span className="text-sm font-semibold text-stone-900 dark:text-stone-50">ติดต่อแอดมิน</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-300 text-stone-500 hover:text-stone-900 dark:border-stone-700 dark:text-stone-400 dark:hover:text-stone-50"
              aria-label="ปิด"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {checkingAuth ? (
            <div className="flex flex-1 items-center justify-center text-sm text-stone-400">
              กำลังโหลด...
            </div>
          ) : !userId ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 p-4 text-center">
              <p className="text-sm text-stone-500 dark:text-stone-400">
                เข้าสู่ระบบเพื่อติดต่อแอดมิน
              </p>
              <Link href="/welcome" className={buttonClass("primary", "sm")}>
                เข้าสู่ระบบ
              </Link>
            </div>
          ) : (
            <>
              <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
                {messages.length === 0 ? (
                  <p className="mt-4 text-center text-sm text-stone-400">
                    ส่งข้อความหาแอดมินได้เลย
                  </p>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={
                        m.is_admin
                          ? "flex max-w-[85%] flex-col gap-1 rounded-2xl rounded-tl-sm bg-stone-100 px-3 py-2 text-sm text-stone-800 dark:bg-stone-800 dark:text-stone-100"
                          : "ml-auto flex max-w-[85%] flex-col gap-1 rounded-2xl rounded-tr-sm bg-emerald-100 px-3 py-2 text-sm text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
                      }
                    >
                      {m.image_url && (
                        <div className="relative h-32 w-40 overflow-hidden rounded-lg">
                          <Image src={m.image_url} alt="" fill className="object-cover" unoptimized />
                        </div>
                      )}
                      {m.message && <span>{m.message}</span>}
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleSend} className="flex flex-col gap-2 border-t border-stone-200 p-3 dark:border-stone-800">
                {imagePreview && (
                  <div className="relative h-20 w-20">
                    <div className="relative h-full w-full overflow-hidden rounded-lg border border-stone-200 dark:border-stone-800">
                      <Image src={imagePreview} alt="" fill className="object-cover" unoptimized />
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 text-white"
                      aria-label="ลบรูป"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <label className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-stone-300 dark:border-stone-700">
                    <Paperclip className="h-4 w-4" />
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="พิมพ์ข้อความ..."
                    className="flex-1 rounded-full border border-stone-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:focus:ring-emerald-500/20"
                  />
                  <button type="submit" disabled={sending} className={buttonClass("primary", "sm")}>
                    ส่ง
                  </button>
                </div>
              </form>
              {error && <p className="px-3 pb-2 text-xs text-red-500">{error}</p>}
            </>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-800 bg-emerald-700 text-white shadow-lg transition hover:bg-emerald-600"
        aria-label="ติดต่อแอดมิน"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}
