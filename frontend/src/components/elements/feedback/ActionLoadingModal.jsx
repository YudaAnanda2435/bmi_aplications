import LinearProgress from "@mui/material/LinearProgress";

export default function ActionLoadingModal({
  open,
  title = "Mohon tunggu...",
  message = "Sistem sedang memproses permintaan Anda.",
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#0f1f14]/35 px-4 backdrop-blur-[2px]"
      role="status"
      aria-live="polite"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-2xl border border-[#d4e8d5] bg-white p-6 shadow-[0_24px_80px_rgba(15,31,20,0.22)]">
        <h2 className="text-lg font-bold text-[#191c1d]">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-[#64748b]">{message}</p>
        <div className="mt-5 overflow-hidden rounded-full">
          <LinearProgress
            aria-label="Loading..."
            variant="query"
            sx={{
              height: 6,
              borderRadius: 999,
              backgroundColor: "#d4e8d5",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#3a6936",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
