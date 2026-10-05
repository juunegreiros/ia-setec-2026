type StatusBadgeProps = {
  label: string;
  variant?: "success" | "error" | "neutral";
};

const variantClasses: Record<NonNullable<StatusBadgeProps["variant"]>, string> = {
  success: "bg-emerald-100 text-emerald-800 border-emerald-200",
  error: "bg-red-100 text-red-800 border-red-200",
  neutral: "bg-slate-100 text-slate-700 border-slate-200",
};

export function StatusBadge({ label, variant = "neutral" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${variantClasses[variant]}`}
    >
      {label}
    </span>
  );
}
