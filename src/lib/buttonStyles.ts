type Variant = "primary" | "secondary" | "danger";
type Size = "sm" | "md";

const base = "inline-flex items-center justify-center rounded-full font-medium transition disabled:opacity-60";

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-sm",
};

const variants: Record<Variant, string> = {
  primary: "bg-green-700 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500",
  secondary:
    "border border-neutral-300 text-neutral-700 hover:bg-green-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-green-950",
  danger:
    "border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md") {
  return `${base} ${sizes[size]} ${variants[variant]}`;
}

export function chipClass(active: boolean) {
  return active
    ? "rounded-full bg-green-700 px-3 py-2 text-sm font-medium text-white"
    : "rounded-full border border-neutral-300 px-3 py-2 text-sm text-neutral-600 hover:bg-green-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-green-950";
}
