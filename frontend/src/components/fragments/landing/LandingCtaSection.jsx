import { ROUTES } from "../../../constants/routes";
import { LandingButton, serifStyle } from "./LandingShared";

export default function LandingCtaSection() {
  return (
    <section className="relative overflow-hidden bg-[#003d2b] py-24">
      <div
        className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8"
        data-aos="fade-up"
      >
        <h2
          className="mb-6 text-4xl font-bold text-white md:text-5xl"
          style={serifStyle}
        >
          Mulai Kelola Data Penduduk dengan Lebih Terstruktur
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-lg font-medium text-emerald-100">
          Masuk ke dashboard untuk mengelola data penduduk, menjalankan
          klasifikasi, dan melihat laporan hasil sistem secara efisien.
        </p>
        <LandingButton to={ROUTES.login} variant="light" className="text-lg">
          Masuk ke Sistem
        </LandingButton>
      </div>
    </section>
  );
}
