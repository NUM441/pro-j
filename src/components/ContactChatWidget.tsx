"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ContactMessage } from "@/lib/supabase/messages";

export default function ContactChatWidget() {
  const [open, setOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUserId(user?.id ?? null);

      if (user) {
        const { data } = await supabase
          .from("contact_messages")
          .select("*")
          .eq("sender_id", user.id)
          .order("created_at", { ascending: true })
          .returns<ContactMessage[]>();
        setMessages(data ?? []);
      }

      setCheckingAuth(false);
    }

    load();
  }, [open]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const body = await res.json();

      if (!res.ok) {
        setError("ส่งข้อความไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        return;
      }

      setMessages((prev) => [...prev, body.data]);
      setText("");
    } catch {
      setError("ส่งข้อความไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-96 w-80 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between border-b border-neutral-200 bg-green-700 px-4 py-3 dark:border-neutral-800">
            <span className="text-sm font-semibold text-white">ติดต่อแอดมิน</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-white/80 hover:text-white"
              aria-label="ปิด"
            >
              ×
            </button>
          </div>

          {checkingAuth ? (
            <div className="flex flex-1 items-center justify-center text-sm text-neutral-400">
              กำลังโหลด...
            </div>
          ) : !userId ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 p-4 text-center">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                เข้าสู่ระบบเพื่อติดต่อแอดมิน
              </p>
              <Link
                href="/login"
                className="rounded-full bg-green-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-600"
              >
                เข้าสู่ระบบ
              </Link>
            </div>
          ) : (
            <>
              <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
                {messages.length === 0 ? (
                  <p className="mt-4 text-center text-sm text-neutral-400">
                    ส่งข้อความหาแอดมินได้เลย
                  </p>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-green-100 px-3 py-2 text-sm text-green-900 dark:bg-green-950 dark:text-green-200"
                    >
                      {m.message}
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-neutral-200 p-3 dark:border-neutral-800">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="พิมพ์ข้อความ..."
                  className="flex-1 rounded-full border border-neutral-300 px-3 py-1.5 text-sm outline-none focus:border-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="rounded-full bg-green-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-60"
                >
                  ส่ง
                </button>
              </form>
              {error && <p className="px-3 pb-2 text-xs text-red-500">{error}</p>}
            </>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-green-700 text-2xl text-white shadow-lg transition hover:bg-green-600"
        aria-label="ติดต่อแอดมิน"
      >
        💬
      </button>
    </div>
  );
}
