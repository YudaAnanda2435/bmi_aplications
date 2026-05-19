const classLabels = ["Underweight", "Normal", "Overweight", "Obesity"];

const classBarStyles = {
  Underweight: "bg-sky-500",
  Normal: "bg-emerald-600",
  Overweight: "bg-orange-500",
  Obesity: "bg-red-600",
};

function normalizeProbability(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return numericValue > 1 ? numericValue / 100 : numericValue;
}

function formatProbability(value) {
  if (value === null || value === undefined) {
    return "-";
  }

  return `${(normalizeProbability(value) * 100).toLocaleString("id-ID", {
    maximumFractionDigits: 2,
  })}%`;
}

export default function ProbabilityList({ probabilities }) {
  if (!probabilities || !Object.keys(probabilities).length) {
    return null;
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-950">Probabilitas</h3>
      <div className="mt-4 space-y-3">
        {classLabels.map((label) => {
          const probability = probabilities[label];
          const width = Math.min(100, normalizeProbability(probability) * 100);

          return (
            <div key={label}>
              <div className="mb-1 flex items-center justify-between gap-3">
                <span className="text-sm text-slate-700">{label}</span>
                <span className="text-sm font-medium text-slate-900">
                  {formatProbability(probability)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={[
                    "h-full rounded-full",
                    classBarStyles[label] || "bg-primary-600",
                  ].join(" ")}
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
