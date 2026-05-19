import { DEFAULT_RECOMMENDATION_METHOD } from "./predictionDisplay";

const DEFAULT_SOURCE_BASIS =
  "Dasar rekomendasi mengikuti pedoman gizi seimbang dan aturan rekomendasi sistem.";

export default function RecommendationMethodCard({
  method = DEFAULT_RECOMMENDATION_METHOD,
  sourceBasis = [],
  sourceReferences = [],
}) {
  const visibleSources = Array.isArray(sourceBasis) ? sourceBasis : [];
  const visibleReferences = Array.isArray(sourceReferences)
    ? sourceReferences.filter((source) => source?.name)
    : [];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-950">
        Metode dan Dasar Rekomendasi
      </h3>

      <div className="mt-3 rounded-lg border border-[#e7e8e9] bg-[#f8f9fa] p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-[#64748b]">
          Metode
        </p>
        <p className="mt-1 text-sm font-semibold leading-6 text-[#1a1a1a]">
          {method || DEFAULT_RECOMMENDATION_METHOD}
        </p>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-[#64748b]">
          Dasar Rekomendasi
        </p>
        {visibleReferences.length ? (
          <div className="mt-2 space-y-3">
            {visibleReferences.map((source, index) => {
              const usedFor = Array.isArray(source.used_for)
                ? source.used_for.filter(Boolean)
                : [];
              const previewItems = usedFor.slice(0, 2);
              const detailItems = usedFor.slice(2);

              return (
                <div
                  key={`${source.name}-${index}`}
                  className="rounded-lg border border-[#e7e8e9] bg-[#f8f9fa] p-3"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                    <p className="text-sm font-semibold leading-6 text-[#1a1a1a]">
                      {source.name}
                    </p>
                    {source.url ? (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-[#3a6936] hover:underline"
                      >
                        Sumber acuan
                      </a>
                    ) : null}
                  </div>

                  {previewItems.length ? (
                    <p className="mt-2 text-xs leading-5 text-slate-600">
                      <span className="font-semibold text-slate-700">
                        Digunakan untuk:
                      </span>{" "}
                      {previewItems.join(", ")}
                    </p>
                  ) : null}

                  {detailItems.length ? (
                    <details className="mt-2 text-xs leading-5 text-slate-600">
                      <summary className="cursor-pointer font-semibold text-[#3a6936]">
                        Lihat detail sumber
                      </summary>
                      <ul className="mt-2 space-y-1">
                        {detailItems.map((item, itemIndex) => (
                          <li key={`${item}-${itemIndex}`} className="flex gap-2">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#3a6936]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : visibleSources.length ? (
          <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
            {visibleSources.map((source, index) => (
              <li key={`${source}-${index}`} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3a6936]" />
                <span>{source}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {DEFAULT_SOURCE_BASIS}
          </p>
        )}
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        Dasar rekomendasi digunakan sebagai acuan penyusunan aturan sistem.
        Hasil sistem tetap bersifat informasi awal dan bukan diagnosis medis.
      </p>
    </section>
  );
}
