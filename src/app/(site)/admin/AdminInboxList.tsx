"use client";

import Link from "next/link";
import { Inbox } from "lucide-react";
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
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-stone-50 p-10 text-center text-sm text-stone-500 dark:bg-stone-900 dark:text-stone-400">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800">
          <Inbox className="h-5 w-5 text-stone-400 dark:text-stone-500" />
        </span>
        ยังไม่มีข้อความเข้ามา
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white dark:divide-stone-800 dark:border-stone-800 dark:bg-stone-900">
      {conversations.map((c) => (
        <div
          key={c.userId}
          className="flex items-center gap-2 p-2 transition hover:bg-stone-50 dark:hover:bg-stone-800"
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
