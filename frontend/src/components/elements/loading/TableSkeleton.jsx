import Skeleton from "@mui/material/Skeleton";

export default function TableSkeleton({
  rows = 8,
  columns = 6,
  className = "",
}) {
  return (
    <div
      className={[
        "overflow-hidden rounded-xl border border-[#e1e3e4]/60 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]",
        className,
      ].join(" ")}
    >
      <div className="border-b border-[#e7e8e9] bg-[#f3f4f5] px-4 py-3">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton
              key={`heading-${index}`}
              variant="text"
              height={22}
              sx={{ bgcolor: "#e1e3e4" }}
            />
          ))}
        </div>
      </div>
      <div className="divide-y divide-[#e7e8e9] px-4">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="grid gap-4 py-4"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columns }).map((_, columnIndex) => (
              <Skeleton
                key={`cell-${rowIndex}-${columnIndex}`}
                variant={columnIndex === 0 ? "rounded" : "text"}
                height={columnIndex === 0 ? 28 : 22}
                sx={{ bgcolor: columnIndex === 0 ? "#d4e8d5" : "#e7e8e9" }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
