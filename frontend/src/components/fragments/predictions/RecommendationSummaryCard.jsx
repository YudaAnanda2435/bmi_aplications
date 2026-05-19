export default function RecommendationSummaryCard({ summary }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-950">
        Ringkasan Rekomendasi
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-700">
        {summary || "Ringkasan rekomendasi belum tersedia."}
      </p>
    </section>
  );
}
