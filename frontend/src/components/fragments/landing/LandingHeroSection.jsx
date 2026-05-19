import { ArrowDown, Sparkles } from "lucide-react";
import { ROUTES } from "../../../constants/routes";
import DashboardMockup from "./DashboardMockup";
import { LandingButton, serifStyle } from "./LandingShared";

export default function LandingHeroSection() {
  return (
    <header id="hero" className="relative md:h-screen overflow-hidden bg-[#fcfbfa] pb-12 pt-12 lg:pb-40 lg:pt-10">
      <div className="relative mx-auto max-w-480 px-4 sm:px-8 lg:px-12">
        <div className="items-center lg:grid lg:grid-cols-12 lg:gap-12">
          <div className="relative z-10 mb-16 lg:col-span-5 lg:mb-0" data-aos="fade-up">
            <div className="mb-8 inline-flex items-center rounded-full border border-gray-300 px-4 py-1 text-xs font-bold uppercase tracking-wider text-gray-800">
              Sistem Internal Kesehatan Desa
            </div>
            <h1
              className="mb-8 text-5xl font-bold leading-[1.05] text-[#5a4235] md:text-6xl lg:text-7xl"
              style={serifStyle}
            >
              Kelola Data Penduduk dan Klasifikasikan{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Status Obesitas</span>
                <span className="absolute bottom-2 left-0 h-2 w-full -rotate-1 rounded-full bg-[#e5efe9]" />
              </span>
            </h1>
            <div className="mb-10 flex items-start gap-4">
              <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                <ArrowDown aria-hidden="true" className="h-5 w-5 text-gray-800" />
              </div>
              <p className="text-lg font-medium leading-relaxed text-gray-800">
                Sinagar DietCare membantu admin menginput data penduduk,
                menghitung BMI, menjalankan klasifikasi Naive Bayes, dan
                menampilkan rekomendasi pola diet serta peringatan dini.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <LandingButton to={ROUTES.login}>Masuk ke Sistem</LandingButton>
              <LandingButton to="#how-it-works" variant="secondary">
                Lihat Cara Kerja
              </LandingButton>
            </div>
          </div>

          <div className="relative h-[500px] lg:col-span-7 lg:h-[600px]" data-aos="fade-left">
            <Sparkles
              aria-hidden="true"
              className="absolute right-20 top-10 h-8 w-8 text-[#ff7b5c]"
              fill="currentColor"
            />
            <Sparkles
              aria-hidden="true"
              className="absolute bottom-20 left-10 h-6 w-6 text-purple-500"
              fill="currentColor"
            />
            <Sparkles
              aria-hidden="true"
              className="absolute bottom-40 right-10 h-8 w-8 text-green-500"
              fill="currentColor"
            />
            <DashboardMockup />
            <svg
              className="absolute bottom-0 right-20 h-auto w-32 text-gray-800"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              viewBox="0 0 100 40"
            >
              <path d="M5,35 Q40,5 95,20 M85,10 L95,20 L80,30" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}
