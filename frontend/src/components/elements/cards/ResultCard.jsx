export default function ResultCard({
  title,
  value,
  description,
  tone = "neutral",
  children,
  className = "",
}) {
  const tones = {
    neutral: "border-slate-200 bg-white",
    success: "border-emerald-200 bg-emerald-50",
    warning: "border-amber-200 bg-amber-50",
    danger: "border-red-200 bg-red-50",
  };

  return (
    <article
      className={[
        "rounded-lg border p-5 shadow-sm sm:p-6",
        tones[tone] || tones.neutral,
        className,
      ].join(" ")}
    >
      {title ? <p className="text-sm font-medium text-slate-600">{title}</p> : null}
      {value ? (
        <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
      ) : null}
      {description ? (
        <p className="mt-2 text-sm leading-6 text-slate-700">{description}</p>
      ) : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </article>
  );
}
