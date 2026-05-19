export default function MealScheduleCard({ mealSchedule, schedule = [] }) {
  const visibleSchedule = Array.isArray(mealSchedule)
    ? mealSchedule
    : Array.isArray(schedule)
      ? schedule
      : [];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-950">Jadwal Makan</h3>
      <p className="mt-1 text-sm leading-6 text-slate-600">
        Rekomendasi jadwal makan harian berdasarkan hasil klasifikasi dan
        aturan rekomendasi.
      </p>
      {visibleSchedule.length ? (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {visibleSchedule.map((item, index) => (
            <div
              key={`${item.time}-${index}`}
              className="rounded-lg border border-[#e7e8e9] bg-[#f8f9fa] p-4"
            >
              <p className="text-sm font-semibold text-[#3a6936]">
                {item.time}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#52637f]">
                {item.recommendation}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm leading-6 text-slate-700">
          Jadwal makan belum tersedia untuk hasil ini.
        </p>
      )}
    </section>
  );
}
