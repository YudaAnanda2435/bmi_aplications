export default function Input({
  id,
  label,
  helperText,
  error,
  className = "",
  ...props
}) {
  return (
    <div>
      {label ? (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      ) : null}
      <input
        id={id}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={helperText ? `${id}-helper` : undefined}
        className={[
          "mt-2 w-full rounded-md border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
            : "border-slate-300 focus:border-primary-600 focus:ring-primary-100",
          className,
        ].join(" ")}
        {...props}
      />
      {helperText ? (
        <p id={`${id}-helper`} className="mt-1 text-xs text-slate-500">
          {helperText}
        </p>
      ) : null}
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
