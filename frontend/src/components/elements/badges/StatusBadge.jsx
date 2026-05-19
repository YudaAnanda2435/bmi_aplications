const statusStyles = {
  Normal: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Underweight: "bg-sky-50 text-sky-700 ring-sky-200",
  Overweight: "bg-orange-50 text-orange-700 ring-orange-200",
  Obesity: "bg-red-50 text-red-700 ring-red-200",
};

export default function StatusBadge({ status, className = "" }) {
  const label = status || "Belum diklasifikasi";
  const style = statusStyles[status] || "bg-slate-50 text-slate-700 ring-slate-200";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        style,
        className,
      ].join(" ")}
    >
      {label}
    </span>
  );
}
