import { BarChart3, UsersRound } from "lucide-react";

function StatPanel({ title, value, icon: Icon }) {
  return (
    <article className="flex items-center justify-between rounded-xl border border-[#edeeef] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
      <div>
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-[#64748b]">
          {title}
        </p>
        <p className="text-2xl font-bold leading-8 text-[#1a1a1a]">{value}</p>
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d4e8d5] text-[#3a6936]">
        <Icon aria-hidden="true" className="h-5 w-5" />
      </div>
    </article>
  );
}

export default function DashboardStats({ summary }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <StatPanel
        title="Total Penduduk"
        value={summary.total_residents ?? 0}
        icon={UsersRound}
      />
      <StatPanel
        title="Total Klasifikasi"
        value={summary.total_classifications ?? 0}
        icon={BarChart3}
      />
    </div>
  );
}
