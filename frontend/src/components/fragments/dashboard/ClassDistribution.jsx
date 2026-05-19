import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { BarChart } from "@mui/x-charts/BarChart";
import EmptyState from "../../elements/tables/EmptyState";
import { ROUTES } from "../../../constants/routes";

const chartRows = [
  { key: "Normal", label: "Normal" },
  { key: "Underweight", label: "Under" },
  { key: "Overweight", label: "Over" },
  { key: "Obesity", label: "Obesity" },
];

export default function ClassDistribution({ distribution = {} }) {
  const values = chartRows.map((item) => Number(distribution[item.key] || 0));
  const total = values.reduce((sum, value) => sum + value, 0);

  return (
    <section className="rounded-xl border border-[#edeeef] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h3 className="text-xl font-semibold leading-7 text-[#1a1a1a]">
          Distribusi Status Obesitas
        </h3>
        <Link
          to={ROUTES.reports}
          className="inline-flex items-center text-xs font-medium tracking-wide text-[#3a6936] hover:underline"
        >
          Lihat Detail
          <ChevronRight aria-hidden="true" className="ml-1 h-4 w-4" />
        </Link>
      </div>

      {total === 0 ? (
        <EmptyState
          title="Belum ada klasifikasi"
          description="Distribusi status obesitas akan muncul setelah data penduduk diklasifikasikan."
          className="min-h-[236px] border-[#e1e3e4] shadow-none"
        />
      ) : (
        <div className="h-[236px] border-b border-[#e1e3e4]">
          <BarChart
            height={226}
            colors={["#86b97d"]}
            borderRadius={8}
            margin={{ top: 18, right: 18, bottom: 34, left: 18 }}
            xAxis={[
              {
                scaleType: "band",
                data: chartRows.map((item) => item.label),
                tickLabelStyle: {
                  fill: "#52637f",
                  fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui",
                  fontSize: 12,
                },
              },
            ]}
            yAxis={[
              {
                width: 0,
                tickLabelStyle: { display: "none" },
              },
            ]}
            series={[
              {
                data: values,
                valueFormatter: (value) => `${value || 0} data`,
              },
            ]}
            slotProps={{
              legend: { hidden: true },
            }}
            sx={{
              "& .MuiChartsAxis-line": { stroke: "transparent" },
              "& .MuiChartsAxis-tick": { stroke: "transparent" },
              "& .MuiBarElement-root": { opacity: 0.72 },
            }}
          />
        </div>
      )}
    </section>
  );
}
