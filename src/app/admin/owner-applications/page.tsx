import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isAdmin } from "@/lib/supabase/admin";
import type { OwnerApplication } from "@/lib/supabase/owner-applications";
import OwnerApplicationActions from "./OwnerApplicationActions";

const STATUS_LABEL = {
  pending: "รอตรวจสอบ",
  approved: "อนุมัติแล้ว",
  rejected: "ปฏิเสธแล้ว",
};

const STATUS_STYLE = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  approved: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export default async function OwnerApplicationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }
  if (!isAdmin(user.email)) {
    redirect("/");
  }

  const adminClient = createAdminClient();
  const { data: applications } = await adminClient
    .from("owner_applications")
    .select("*")
    .order("status", { ascending: true })
    .order("created_at", { ascending: false })
    .returns<OwnerApplication[]>();

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-12">
      <div>
        <Link href="/admin" className="text-sm text-green-700 hover:underline dark:text-green-400">
          ← กล่องข้อความ
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">คำขอเป็นเจ้าของร้าน</h1>
      </div>

      {!applications || applications.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
          ยังไม่มีคำขอเข้ามา
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {applications.map((a) => (
            <div key={a.id} className="flex flex-col gap-2 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-neutral-50">{a.restaurant_name}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    {a.applicant_name} · {a.applicant_email} · {a.phone}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[a.status]}`}>
                  {STATUS_LABEL[a.status]}
                </span>
              </div>

              <p className="text-sm text-neutral-700 dark:text-neutral-300">{a.message}</p>

              {a.status === "pending" && <OwnerApplicationActions applicationId={a.id} />}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
