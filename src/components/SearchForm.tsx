import { Search } from "lucide-react";
import { chipClass } from "@/lib/buttonStyles";

export default function SearchForm({
  defaultValue,
  category,
  className,
  onDark,
}: {
  defaultValue?: string;
  category?: string;
  className?: string;
  onDark?: boolean;
}) {
  const inputClass = onDark
    ? "w-full min-w-0 rounded-full border border-transparent bg-white py-2 pr-4 pl-10 text-sm text-stone-900 shadow-md outline-none transition placeholder:text-stone-400 focus:ring-4 focus:ring-white/40"
    : "w-full min-w-0 rounded-full border border-stone-300 py-2 pr-4 pl-10 text-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:focus:ring-emerald-500/20";
  const iconClass = "pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-stone-400";
  const submitClass = onDark
    ? "rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:bg-stone-800"
    : chipClass(false);

  return (
    <form
      action="/restaurants"
      method="get"
      className={`flex flex-col gap-2 sm:flex-row sm:items-center ${className ?? ""}`}
    >
      {category && <input type="hidden" name="category" value={category} />}
      <div className="relative w-full sm:max-w-sm">
        <Search className={iconClass} />
        <input
          type="search"
          name="q"
          defaultValue={defaultValue ?? ""}
          placeholder="ค้นหาชื่อร้าน..."
          className={inputClass}
        />
      </div>
      <button type="submit" className={submitClass}>
        ค้นหา
      </button>
    </form>
  );
}
