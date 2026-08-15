"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { OwnerApplicationStatus } from "@/lib/supabase/owner-applications";
import { buttonClass } from "@/lib/buttonStyles";

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
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => decide("approved")}
        disabled={loading}
        className={buttonClass("primary", "sm")}
      >
        อนุมัติ
      </button>
      <button
        type="button"
        onClick={() => decide("rejected")}
        disabled={loading}
        className={buttonClass("danger", "sm")}
      >
        ปฏิเสธ
      </button>
    </div>
  );
}
