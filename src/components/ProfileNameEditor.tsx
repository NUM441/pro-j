"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { buttonClass } from "@/lib/buttonStyles";

const COOLDOWN_MS = 5 * 60 * 1000;

export default function ProfileNameEditor({
  initialName,
  changedAt,
}: {
  initialName: string;
  changedAt: string | null;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const remainingMs = changedAt
    ? Math.max(0, COOLDOWN_MS - (now - new Date(changedAt).getTime()))
    : 0;

  useEffect(() => {
    if (remainingMs <= 0) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [remainingMs]);

  async function handleSave() {
    const trimmed = name.trim();
    if (!trimmed || trimmed === initialName) {
      setEditing(false);
      setName(initialName);
      return;
    }

    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      data: { full_name: trimmed, full_name_changed_at: new Date().toISOString() },
    });

    if (updateError) {
      setError("เปลี่ยนชื่อไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      setSaving(false);
      return;
    }

    setEditing(false);
    setSaving(false);
    router.refresh();
  }

  if (remainingMs > 0) {
    const totalSeconds = Math.ceil(remainingMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return (
      <p className="text-xs text-slate-400">
        เปลี่ยนชื่อได้อีกครั้งใน {minutes} นาที {seconds} วินาที
      </p>
    );
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="text-xs font-medium text-blue-700 hover:underline dark:text-blue-400"
      >
        แก้ไขชื่อ
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
        <button type="button" onClick={handleSave} disabled={saving} className={buttonClass("primary", "sm")}>
          {saving ? "กำลังบันทึก..." : "บันทึก"}
        </button>
        <button
          type="button"
          onClick={() => {
            setEditing(false);
            setName(initialName);
            setError(null);
          }}
          disabled={saving}
          className={buttonClass("secondary", "sm")}
        >
          ยกเลิก
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
