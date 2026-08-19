import { Search } from "lucide-react";
import { chipClass } from "@/lib/buttonStyles";

export default function SearchForm({
  defaultValue,
  category,
  className,
}: {
  defaultValue?: string;
  category?: string;
  className?: string;
}) {
  return (
    <form action="/restaurants" method="get" className={className ?? "flex items-center gap-2"}>
      {category && <input type="hidden" name="category" value={category} />}
      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
          type="search"
          name="q"
          defaultValue={defaultValue ?? ""}
          placeholder="ค้นหาชื่อร้าน..."
          className="w-full rounded-full border border-stone-300 py-2 pr-4 pl-10 text-sm outline-none focus:border-emerald-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
        />
      </div>
      <button type="submit" className={chipClass(false)}>
        ค้นหา
      </button>
    </form>
  );
}
