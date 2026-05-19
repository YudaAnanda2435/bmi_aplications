import StatusBadge from "../../elements/badges/StatusBadge";
import WarningBadge from "../../elements/badges/WarningBadge";
import InfoCard from "../../elements/cards/InfoCard";
import DietPatternCard from "./DietPatternCard";
import MealScheduleCard from "./MealScheduleCard";
import ProbabilityList from "./ProbabilityList";
import RecommendationList from "./RecommendationList";
import RecommendationMethodCard from "./RecommendationMethodCard";
import RecommendationSummaryCard from "./RecommendationSummaryCard";
import SystemNoteCard from "./SystemNoteCard";
import {
  normalizePredictionResult,
} from "../../../utils/predictionNormalizer";

function formatNumber(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "-";
  }

  return numericValue.toLocaleString("id-ID", {
    maximumFractionDigits: 2,
  });
}

export default function PredictionResult({ result }) {
  if (!result) {
    return null;
  }

  const normalizedResult = normalizePredictionResult(result);
  const predictedClass = normalizedResult.predicted_class;
  const earlyWarning = normalizedResult.early_warning;
  const bmi = normalizedResult.bmi;
  const dietPattern = normalizedResult.diet_pattern;
  const goal = normalizedResult.goal;
  const recommendationMethod = normalizedResult.method;
  const recommendationSummary = normalizedResult.recommendation_summary;
  const recommendations = normalizedResult.main_recommendations;
  const mealSchedule = normalizedResult.meal_schedule;
  const additionalNotes = normalizedResult.additional_notes;
  const probabilities = normalizedResult.probabilities;
  const sourceBasis = normalizedResult.source_basis;
  const sourceReferences = normalizedResult.source_references;

  return (
    <InfoCard
      title="Hasil Klasifikasi"
      description="Hasil berikut merupakan informasi awal dan alat bantu, bukan pengganti saran tenaga kesehatan."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Hasil Klasifikasi
          </p>
          <div className="mt-2">
            <StatusBadge status={predictedClass} />
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            BMI
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-950">
            {formatNumber(bmi)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Peringatan Dini
          </p>
          <div className="mt-2">
            <WarningBadge warning={earlyWarning} />
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <DietPatternCard pattern={dietPattern} goal={goal} />
        <RecommendationSummaryCard summary={recommendationSummary} />
        <RecommendationList items={recommendations} />
        <MealScheduleCard mealSchedule={mealSchedule} />
        <ProbabilityList probabilities={probabilities} />
        <SystemNoteCard note={additionalNotes} />
        <RecommendationMethodCard
          method={recommendationMethod}
          sourceBasis={sourceBasis}
          sourceReferences={sourceReferences}
        />
      </div>
    </InfoCard>
  );
}
