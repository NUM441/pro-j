type Variant = "primary" | "secondary" | "danger";
type Size = "sm" | "md";

const base = "inline-flex items-center justify-center rounded-full font-medium transition disabled:opacity-60";

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-sm",
};

const variants: Record<Variant, string> = {
  primary:
    "border border-amber-700 bg-amber-700 text-white hover:bg-amber-600 dark:border-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500",
  secondary:
    "border border-stone-300 text-stone-700 hover:bg-amber-50 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-amber-950",
  danger:
    "border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md") {
  return `${base} ${sizes[size]} ${variants[variant]}`;
}

export function chipClass(active: boolean) {
  return active
    ? "rounded-full border border-amber-700 bg-amber-700 px-3 py-2 text-sm font-medium text-white dark:border-amber-600 dark:bg-amber-600"
    : "rounded-full border border-stone-300 px-3 py-2 text-sm text-stone-600 hover:bg-amber-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-amber-950";
}

export function badgeClass() {
  return "rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300";
}
