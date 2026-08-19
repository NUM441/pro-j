"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Conversation } from "@/lib/supabase/messages";
import DeleteConversationButton from "./DeleteConversationButton";

export default function AdminInboxList({ initialConversations }: { initialConversations: Conversation[] }) {
  const [prevInitialConversations, setPrevInitialConversations] = useState(initialConversations);
  const [conversations, setConversations] = useState(initialConversations);

  if (initialConversations !== prevInitialConversations) {
    setPrevInitialConversations(initialConversations);
    setConversations(initialConversations);
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("/api/admin/conversations");
      if (!res.ok) return;
      const data = await res.json();
      setConversations(data.conversations);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (conversations.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-stone-300 p-8 text-center text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400">
        ยังไม่มีข้อความเข้ามา
      </p>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white shadow-sm dark:divide-stone-800 dark:border-stone-800 dark:bg-stone-900">
      {conversations.map((c) => (
        <div
          key={c.userId}
          className="flex items-center gap-2 p-2 transition hover:bg-emerald-50 dark:hover:bg-emerald-950"
        >
          <Link href={`/admin/${c.userId}`} className="flex min-w-0 flex-1 flex-col gap-1 p-2">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate font-medium text-stone-900 dark:text-stone-50">{c.userName}</span>
              <span className="shrink-0 text-xs text-stone-400">
                {new Date(c.latestMessage.created_at).toLocaleString("th-TH", {
                  timeZone: "Asia/Bangkok",
                })}
              </span>
            </div>
            <p className="line-clamp-1 text-sm text-stone-500 dark:text-stone-400">
              {c.latestMessage.is_admin ? "คุณ: " : ""}
              {c.latestMessage.message}
            </p>
          </Link>
          <DeleteConversationButton
            userId={c.userId}
            userName={c.userName}
            compact
            onDeleted={() => setConversations((prev) => prev.filter((conv) => conv.userId !== c.userId))}
          />
        </div>
      ))}
    </div>
  );
}
