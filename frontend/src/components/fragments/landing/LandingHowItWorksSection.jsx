import { steps } from "./landingData";
import { SectionLabel, serifStyle } from "./LandingShared";

export default function LandingHowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-[#fcfbfa] py-24">
      <div className="mx-auto max-w-480 px-4 sm:px-8 lg:px-12">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <SectionLabel>Proses Sederhana</SectionLabel>
          <h2
            className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl"
            style={serifStyle}
          >
            Cara Kerja Sistem
          </h2>
          <p className="text-lg font-medium text-gray-600">
            Alur sederhana untuk memproses data hingga mendapatkan hasil
            klasifikasi.
          </p>
        </div>
        <div className="relative mx-auto max-w-5xl">
          <div className="absolute left-10 top-[40%] z-0 hidden h-1 w-[calc(100%-5rem)] border-t-2 border-dashed border-gray-300 md:block" />
          <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="text-center" data-aos="fade-up">
                <div
                  className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#fcfbfa] bg-white text-2xl font-bold text-[#003d2b] shadow-lg"
                  style={serifStyle}
                >
                  {index + 1}
                </div>
                <h4
                  className="mb-3 text-lg font-bold text-gray-900"
                  style={serifStyle}
                >
                  {step.title}
                </h4>
                <p className="text-sm font-medium text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
