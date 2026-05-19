export default function RecommendationPanel({ recommendation, note }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-950">
          Rekomendasi Pola Diet
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          {recommendation || "-"}
        </p>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-950">Catatan Sistem</h3>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          {note ||
            "Informasi awal dan alat bantu, tidak menggantikan saran tenaga kesehatan."}
        </p>
      </section>
    </div>
  );
}
