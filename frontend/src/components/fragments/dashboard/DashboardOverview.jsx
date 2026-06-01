import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, TriangleAlert } from "lucide-react";
import Alert from "../../elements/feedback/Alert";
import CardSkeleton from "../../elements/loading/CardSkeleton";
import TableSkeleton from "../../elements/loading/TableSkeleton";
import dashboardService from "../../../services/dashboardService";
import reportService from "../../../services/reportService";
import { ROUTES } from "../../../constants/routes";
import ClassDistribution from "./ClassDistribution";
import DashboardStats from "./DashboardStats";
import RecentReports from "./RecentReports";
import { showError } from "../../../utils/toast";

const initialSummary = {
  total_residents: 0,
  total_classifications: 0,
  class_distribution: {},
  recent_reports: [],
};

function getAttentionCount(summary, latestReports) {
  if (latestReports.length) {
    return latestReports.filter(
      (report) => report.early_warning && report.early_warning !== "Aman"
    ).length;
  }

  const warningDistribution = summary.early_warning_distribution || {};

  return Number(
    summary.attention_count ||
      summary.warning_attention_count ||
      (warningDistribution["Perlu Perhatian"] || 0) +
        (warningDistribution["Risiko Tinggi"] || 0) ||
      0
  );
}

export default function DashboardOverview() {
  const [summary, setSummary] = useState(initialSummary);
  const [latestReports, setLatestReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadSummary() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [data, reports] = await Promise.all([
          dashboardService.getSummary(),
          reportService.getLatestReports({ limit: 500 }).catch(() => []),
        ]);

        if (isMounted) {
          setSummary({
            ...initialSummary,
            ...data,
            class_distribution: data?.class_distribution || {},
            recent_reports: data?.recent_reports || [],
          });
          setLatestReports(Array.isArray(reports) ? reports : []);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message);
          showError("Data gagal dimuat.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <section className="space-y-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <CardSkeleton rows={1} />
              <CardSkeleton rows={1} />
            </div>
            <CardSkeleton rows={2} />
          </div>
          <div className="space-y-6 lg:col-span-4">
            <CardSkeleton rows={2} />
            <CardSkeleton rows={1} />
          </div>
        </div>
        <TableSkeleton columns={4} rows={4} />
      </section>
    );
  }

  if (errorMessage) {
    return (
      <Alert
        variant="danger"
        title="Dashboard gagal dimuat"
        message={errorMessage}
      />
    );
  }

  const attentionCount = getAttentionCount(summary, latestReports);

  return (
    <section>
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-8 lg:col-span-8">
          <DashboardStats summary={summary} />
          <ClassDistribution distribution={summary.class_distribution} />
        </div>

        <aside className="flex flex-col gap-8 lg:col-span-4">
          <section className="flex flex-col items-center rounded-xl bg-[#86b97d] p-6 text-center text-[#1b491a] shadow-[0_4px_20px_rgba(134,185,125,0.2)]">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#3a6936]">
              <UserPlus aria-hidden="true" className="h-8 w-8" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-white leading-7">Data Baru</h2>
            <p className="mb-6 text-sm leading-5 text-white">
              Input data antropometri warga untuk klasifikasi.
            </p>
            <Link
              to={ROUTES.residentCreate}
              className="inline-flex w-full items-center justify-center rounded-full bg-[#3a6936] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#2f572d]"
            >
              Tambah Data Penduduk
            </Link>
          </section>

          <section className="rounded-xl border-l-4 border-[#ba1a1a] bg-[#ffdad6] p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <TriangleAlert
                aria-hidden="true"
                className="mt-1 h-5 w-5 shrink-0 text-[#fff]"
                fill="#ba1a1a"
              />
              <div>
                <h3 className="mb-1 text-sm font-semibold leading-5 text-[#93000a]">
                  Peringatan Dini
                </h3>
                <p className="text-sm leading-5 text-[#93000a]/85">
                  {attentionCount > 0
                    ? `${attentionCount} warga membutuhkan perhatian berdasarkan hasil klasifikasi terakhir.`
                    : "Pantau warga dengan status peringatan dini berdasarkan hasil klasifikasi terakhir."}
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>

      <RecentReports reports={summary.recent_reports || []} />
    </section>
  );
}
