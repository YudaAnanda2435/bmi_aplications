import Skeleton from "@mui/material/Skeleton";

export default function FormSkeleton({ fields = 12 }) {
  return (
    <section className="space-y-5">
      <div>
        <Skeleton variant="text" width="30%" height={34} sx={{ bgcolor: "#d4e8d5" }} />
        <Skeleton variant="text" width="55%" height={22} sx={{ bgcolor: "#e7e8e9" }} />
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          {Array.from({ length: fields }).map((_, index) => (
            <div key={index}>
              <Skeleton variant="text" width="36%" height={20} sx={{ bgcolor: "#e1e3e4" }} />
              <Skeleton variant="rounded" height={44} sx={{ bgcolor: "#f1f5f9" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
