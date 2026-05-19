export default function EmptyState({
  title = "Data belum tersedia",
  description = "Data akan tampil setelah tersedia di sistem.",
  action,
  className = "",
}) {
  return (
    <div
      className={[
        "flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center shadow-sm",
        className,
      ].join(" ")}
    >
      <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
        {description}
      </p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
