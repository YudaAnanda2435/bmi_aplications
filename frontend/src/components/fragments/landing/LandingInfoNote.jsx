import { Info } from "lucide-react";
import { serifStyle } from "./LandingShared";

export default function LandingInfoNote() {
  return (
    <section className="bg-[#fcfbfa] py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-8 lg:px-12">
          <div
            className="flex flex-col items-center gap-6 rounded-[2rem] border-2 border-[#003d2b]/10 bg-white p-8 text-center shadow-sm sm:flex-row sm:text-left"
            data-aos="fade-up"
          >
          <div className="-rotate-3 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-500">
            <Info aria-hidden="true" className="h-8 w-8" />
          </div>
          <div>
            <h4
              className="mb-2 text-xl font-bold text-gray-900"
              style={serifStyle}
            >
              Informasi Awal dan Alat Bantu
            </h4>
            <p className="font-medium leading-relaxed text-gray-600">
              Sinagar DietCare dirancang sebagai alat bantu berbasis data.
              Hasil sistem bersifat informasi awal dan tidak menggantikan saran
              tenaga kesehatan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
