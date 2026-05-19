export default function IconButton({
  icon: Icon,
  label,
  className = "",
  size = "md",
  variant = "secondary",
  type = "button",
  ...props
}) {
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700",
    secondary:
      "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  };

  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-11 w-11",
  };

  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={[
        "inline-flex shrink-0 items-center justify-center rounded-md transition focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant] || variants.secondary,
        sizes[size] || sizes.md,
        className,
      ].join(" ")}
      {...props}
    >
      {Icon ? <Icon aria-hidden="true" className="h-4 w-4" /> : null}
    </button>
  );
}
