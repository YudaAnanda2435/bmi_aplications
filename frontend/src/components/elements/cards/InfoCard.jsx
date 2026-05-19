export default function InfoCard({
  title,
  description,
  children,
  action,
  className = "",
}) {
  return (
    <section
      className={[
        "rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6",
        className,
      ].join(" ")}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {title ? (
            <h2 className="text-base font-semibold text-slate-950">{title}</h2>
          ) : null}
          {description ? (
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </section>
  );
}
