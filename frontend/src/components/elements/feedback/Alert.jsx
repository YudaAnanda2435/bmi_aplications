export default function Alert({
  title,
  message,
  variant = "info",
  className = "",
}) {
  const variants = {
    info: "border-slate-200 bg-white text-slate-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    danger: "border-red-200 bg-red-50 text-red-800",
  };

  return (
    <div
      role="alert"
      className={[
        "rounded-lg border px-4 py-3 text-sm",
        variants[variant] || variants.info,
        className,
      ].join(" ")}
    >
      {title ? <p className="font-semibold">{title}</p> : null}
      {message ? <p className={title ? "mt-1 leading-6" : "leading-6"}>{message}</p> : null}
    </div>
  );
}
