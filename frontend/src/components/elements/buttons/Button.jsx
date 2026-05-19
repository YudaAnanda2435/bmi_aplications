export default function Button({
  as: Component = "button",
  children,
  className = "",
  type = "button",
  variant = "primary",
  size = "md",
  ...props
}) {
  const variants = {
    primary: "bg-primary-600 text-white shadow-sm hover:bg-primary-700",
    secondary:
      "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  };

  const sizes = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-sm",
  };

  return (
    <Component
      {...(Component === "button" ? { type } : {})}
      className={[
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </Component>
  );
}
