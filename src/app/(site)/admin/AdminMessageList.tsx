"use client";

import { useEffect, useState } from "react";
import type { ContactMessage } from "@/lib/supabase/messages";
import AdminMessageBubble from "./AdminMessageBubble";

export default function AdminMessageList({
  userId,
  initialMessages,
}: {
  userId: string;
  initialMessages: ContactMessage[];
}) {
  const [prevInitialMessages, setPrevInitialMessages] = useState(initialMessages);
  const [messages, setMessages] = useState(initialMessages);

  if (initialMessages !== prevInitialMessages) {
    setPrevInitialMessages(initialMessages);
    setMessages(initialMessages);
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/admin/messages?userId=${userId}`);
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data.messages);
    }, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
      {messages.map((m) => (
        <AdminMessageBubble
          key={m.id}
          message={m}
          onDeleted={() => setMessages((prev) => prev.filter((msg) => msg.id !== m.id))}
        />
      ))}
    </div>
  );
}
