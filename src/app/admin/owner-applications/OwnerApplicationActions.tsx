"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { OwnerApplicationStatus } from "@/lib/supabase/owner-applications";

export default function OwnerApplicationActions({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function decide(status: OwnerApplicationStatus) {
    setLoading(true);
    await fetch("/api/admin/owner-applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId, status }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => decide("approved")}
        disabled={loading}
        className="rounded-full bg-green-700 px-3 py-1 text-xs font-medium text-white transition hover:bg-green-600 disabled:opacity-60"
      >
        อนุมัติ
      </button>
      <button
        type="button"
        onClick={() => decide("rejected")}
        disabled={loading}
        className="rounded-full border border-red-300 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
      >
        ปฏิเสธ
      </button>
    </div>
  );
}
