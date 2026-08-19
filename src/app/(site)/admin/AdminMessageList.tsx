"use client";

import { useState } from "react";
import type { ContactMessage } from "@/lib/supabase/messages";
import AdminMessageBubble from "./AdminMessageBubble";

export default function AdminMessageList({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [prevInitialMessages, setPrevInitialMessages] = useState(initialMessages);
  const [messages, setMessages] = useState(initialMessages);

  if (initialMessages !== prevInitialMessages) {
    setPrevInitialMessages(initialMessages);
    setMessages(initialMessages);
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900">
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
