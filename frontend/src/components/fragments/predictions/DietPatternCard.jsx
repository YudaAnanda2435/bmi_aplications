export default function DietPatternCard({ pattern, goal }) {
  return (
    <section className="rounded-lg border border-[#d4e8d5] bg-[#f8f9fa] p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-[#64748b]">
        Pola Diet
      </p>
      <h3 className="mt-2 text-base font-semibold text-[#1a1a1a]">
        {pattern || "Pola diet belum tersedia"}
      </h3>
      <p className="mt-2 text-sm leading-6 text-[#52637f]">
        {goal ||
          "Tujuan rekomendasi akan ditampilkan setelah data tersedia dari sistem."}
      </p>
    </section>
  );
}
