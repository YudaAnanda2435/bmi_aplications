export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  className = "",
}) {
  return (
    <article
      className={[
        "rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6",
        className,
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
        </div>
        {Icon ? (
          <div className="rounded-md bg-primary-50 p-2 text-primary-700">
            <Icon aria-hidden="true" className="h-5 w-5" />
          </div>
        ) : null}
      </div>
      {description ? (
        <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      ) : null}
    </article>
  );
}
