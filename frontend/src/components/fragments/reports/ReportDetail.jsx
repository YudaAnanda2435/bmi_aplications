import InfoCard from "../../elements/cards/InfoCard";
import PredictionResult from "../predictions/PredictionResult";
import { formatDateTime, formatNumber } from "../../../utils/formatters";

export default function ReportDetail({ report }) {
  const resident = report?.resident || {};
  const classification = report?.classification || {};
  const predictionResult = {
    ...report,
    ...classification,
    bmi: classification.bmi ?? report?.bmi ?? resident.bmi,
    predicted_class:
      classification.predicted_class || report?.predicted_class,
    early_warning:
      classification.early_warning || report?.early_warning,
    probabilities:
      classification.probabilities || report?.probabilities,
    diet_pattern:
      classification.diet_pattern || report?.diet_pattern,
    recommendation_summary:
      classification.recommendation_summary || report?.recommendation_summary,
    main_recommendations:
      classification.main_recommendations || report?.main_recommendations,
    meal_schedule:
      classification.meal_schedule || report?.meal_schedule,
    additional_notes:
      classification.additional_notes || report?.additional_notes,
    method: classification.method || report?.method,
    source_basis:
      classification.source_basis || report?.source_basis,
    source_references:
      classification.source_references || report?.source_references,
    recommendation:
      classification.recommendation || report?.recommendation,
    note: classification.note || report?.note,
  };

  return (
    <div className="space-y-5">
      <InfoCard
        title="Identitas Penduduk"
        description="Data penduduk yang digunakan saat klasifikasi dilakukan."
      >
        <dl className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Nama Penduduk
            </dt>
            <dd className="mt-1 text-sm font-semibold text-slate-950">
              {resident.name || "-"}
            </dd>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Usia
            </dt>
            <dd className="mt-1 text-sm font-semibold text-slate-950">
              {formatNumber(resident.age, " tahun")}
            </dd>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Tinggi Badan
            </dt>
            <dd className="mt-1 text-sm font-semibold text-slate-950">
              {formatNumber(resident.height, " m")}
            </dd>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Berat Badan
            </dt>
            <dd className="mt-1 text-sm font-semibold text-slate-950">
              {formatNumber(resident.weight, " kg")}
            </dd>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              BMI
            </dt>
            <dd className="mt-1 text-sm font-semibold text-slate-950">
              {formatNumber(resident.bmi)}
            </dd>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Tanggal Klasifikasi
            </dt>
            <dd className="mt-1 text-sm font-semibold text-slate-950">
              {formatDateTime(classification.created_at)}
            </dd>
          </div>
        </dl>
      </InfoCard>

      <PredictionResult result={predictionResult} />
    </div>
  );
}
