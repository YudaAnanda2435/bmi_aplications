import Skeleton from "@mui/material/Skeleton";

export default function CardSkeleton({
  rows = 4,
  className = "",
}) {
  return (
    <section
      className={[
        "rounded-xl border border-[#edeeef] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]",
        className,
      ].join(" ")}
    >
      <Skeleton variant="text" width="38%" height={32} sx={{ bgcolor: "#d4e8d5" }} />
      <Skeleton variant="text" width="62%" height={22} sx={{ bgcolor: "#e7e8e9" }} />
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg border border-[#e7e8e9] bg-[#f8f9fa] p-4"
          >
            <Skeleton variant="text" width="36%" height={18} sx={{ bgcolor: "#e1e3e4" }} />
            <Skeleton variant="text" width="70%" height={24} sx={{ bgcolor: "#d9dadb" }} />
          </div>
        ))}
      </div>
    </section>
  );
}
