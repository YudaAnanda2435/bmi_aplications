import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

import { ROUTES } from "../../../constants/routes";
import { serifStyle } from "./LandingShared";

export default function LandingFooter() {
  return (
    <footer className="border-t border-emerald-800 bg-[#003d2b] pb-10 pt-20">
      <div className="mx-auto max-w-480 px-4 sm:px-8 lg:px-12">
        <div className="mb-16 grid grid-cols-1 gap-12 text-white md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#003d2b]">
                <Sparkles
                  aria-hidden="true"
                  className="h-6 w-6"
                  fill="currentColor"
                />
              </div>
              <span className="text-2xl font-bold" style={serifStyle}>
                Sinagar DietCare
              </span>
            </div>
            <p className="mb-6 max-w-sm font-medium leading-relaxed text-emerald-100">
              Sistem internal untuk klasifikasi status obesitas, rekomendasi
              pola diet, dan peringatan dini berbasis Naive Bayes.
            </p>
            <p className="text-sm italic text-emerald-200/80">
              Hasil sistem hanya sebagai informasi awal dan alat bantu.
            </p>
          </div>
          <div>
            <h4 className="mb-6 text-xl font-bold" style={serifStyle}>
              Tautan
            </h4>
            <ul className="space-y-4 font-medium">
              <li>
                <a className="text-emerald-100 hover:text-white" href="#hero">
                  Beranda
                </a>
              </li>
              <li>
                <a className="text-emerald-100 hover:text-white" href="#features">
                  Fitur
                </a>
              </li>
              <li>
                <a
                  className="text-emerald-100 hover:text-white"
                  href="#how-it-works"
                >
                  Cara Kerja
                </a>
              </li>
              <li>
                <Link className="text-emerald-100 hover:text-white" to={ROUTES.login}>
                  Masuk
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-6 text-xl font-bold" style={serifStyle}>
              Catatan
            </h4>
            <p className="font-medium leading-7 text-emerald-100">
              Digunakan untuk kebutuhan admin internal dan pengelolaan data
              penduduk Kampung Sinagar.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-emerald-800/50 pt-8 md:flex-row">
          <p className="text-sm font-medium text-emerald-200">
            Â© 2026 Sinagar DietCare. Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
