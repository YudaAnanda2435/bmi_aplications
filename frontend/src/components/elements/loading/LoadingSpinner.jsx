export default function LoadingSpinner({
  label = "Memuat data",
  className = "",
}) {
  return (
    <div
      role="status"
      className={["inline-flex items-center gap-3 text-sm font-medium text-slate-600", className].join(
        " "
      )}
    >
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-primary-600" />
      <span>{label}</span>
    </div>
  );
}
