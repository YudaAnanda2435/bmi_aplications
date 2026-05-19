import Button from "../buttons/Button";

export default function ConfirmDialog({
  open,
  title = "Konfirmasi Aksi",
  message = "Apakah Anda yakin ingin melanjutkan?",
  confirmText = "Ya, lanjutkan",
  cancelText = "Batal",
  variant = "danger",
  onConfirm,
  onCancel,
}) {
  if (!open) {
    return null;
  }

  const confirmClassName =
    variant === "danger"
      ? "bg-[#ba1a1a] text-white hover:bg-[#93000a]"
      : "bg-[#3a6936] text-white hover:bg-[#2f572d]";

  return (
    <div
      className="fixed inset-0 z-[65] flex items-center justify-center bg-[#0f1f14]/40 px-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-[#e1e3e4] bg-white p-6 shadow-[0_24px_80px_rgba(15,31,20,0.22)]">
        <h2 id="confirm-dialog-title" className="text-lg font-bold text-[#191c1d]">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#64748b]">{message}</p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            className="rounded-xl"
            onClick={onCancel}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            className={["rounded-xl", confirmClassName].join(" ")}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
