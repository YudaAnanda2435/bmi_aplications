import { BarChart3, CheckCircle2, Zap } from "lucide-react";

export default function DashboardMockup() {
  const rows = [
    { name: "Ahmad B.", bmi: "22.4", label: "Normal", badge: "bg-green-100 text-green-700" },
    {
      name: "Siti M.",
      bmi: "28.1",
      label: "Overweight",
      badge: "bg-orange-100 text-orange-700",
    },
    { name: "Budi S.", bmi: "31.5", label: "Obesity", badge: "bg-red-100 text-red-700" },
  ];

  return (
    <div className="absolute left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2">
      <div className="relative z-10 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 p-4">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-yellow-400" />
            <span className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <div className="mx-auto rounded border border-gray-200 bg-white px-3 py-1 text-xs text-gray-500">
            Dashboard Pengguna
          </div>
        </div>
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Ringkasan Data
              </h3>
              <p className="text-sm text-gray-500">Total Penduduk: 245</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-[#003d2b]">
              <BarChart3 aria-hidden="true" className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-4">
            {rows.map((row) => (
              <div
                key={row.name}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-200" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {row.name}
                    </div>
                    <div className="text-xs text-gray-500">BMI: {row.bmi}</div>
                  </div>
                </div>
                <span
                  className={[
                    "rounded-full px-2.5 py-1 text-xs font-semibold",
                    row.badge,
                  ].join(" ")}
                >
                  {row.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute -right-2 md:-right-4 -top-6 z-20 flex rotate-3 items-center gap-2 rounded-xl bg-yellow-400 px-4 py-2 text-sm font-bold text-gray-900 shadow-lg">
        Hasil Cepat
        <Zap aria-hidden="true" className="h-4 w-4" fill="currentColor" />
      </div>
      <div className="absolute bottom-10 -left-2 md:-left-8 z-20 -rotate-2 rounded-xl bg-purple-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg">
        Naive Bayes
      </div>
      <div className="absolute -left-2 md:-left-12 top-20 z-20 -rotate-6 rounded-2xl bg-[#ff7b5c] px-4 py-3 text-sm font-bold text-white shadow-lg">
        <div className="flex items-center gap-2">
          <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
          Akurat
        </div>
      </div>
    </div>
  );
}
