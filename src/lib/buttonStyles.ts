type Variant = "primary" | "secondary" | "danger";
type Size = "sm" | "md";

const base = "inline-flex items-center justify-center rounded-full font-medium transition disabled:opacity-60";

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-sm",
};

const variants: Record<Variant, string> = {
  primary:
    "border border-blue-700 bg-blue-700 text-white hover:bg-blue-600 dark:border-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500",
  secondary:
    "border border-slate-300 text-slate-700 hover:bg-blue-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-blue-950",
  danger:
    "border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md") {
  return `${base} ${sizes[size]} ${variants[variant]}`;
}

export function chipClass(active: boolean) {
  return active
    ? "rounded-full border border-blue-700 bg-blue-700 px-3 py-2 text-sm font-medium text-white dark:border-blue-600 dark:bg-blue-600"
    : "rounded-full border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-blue-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-blue-950";
}

export function badgeClass() {
  return "rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-950 dark:text-blue-300";
}
