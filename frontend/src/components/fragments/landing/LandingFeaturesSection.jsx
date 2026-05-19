import { features } from "./landingData";
import { SectionLabel, serifStyle } from "./LandingShared";

export default function LandingFeaturesSection() {
  return (
    <section id="features" className="rounded-t-[3rem] bg-white py-24">
      <div className="mx-auto max-w-480 px-4 sm:px-8 lg:px-12">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <SectionLabel>Kemampuan Sistem</SectionLabel>
          <h2
            className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl"
            style={serifStyle}
          >
            Fitur Utama Sistem
          </h2>
          <p className="text-lg font-medium text-gray-600">
            Alat bantu komprehensif untuk mengelola dan menganalisis status
            gizi penduduk secara efisien.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-[2rem] bg-[#fcfbfa] p-8 text-center transition-transform duration-300 hover:-translate-y-2"
                data-aos="fade-up"
              >
                <div className="relative mx-auto mb-6 h-24 w-24">
                  <div
                    className={[
                      "absolute inset-0 opacity-50",
                      feature.shape,
                    ].join(" ")}
                  />
                  <div
                    className={[
                      "absolute inset-0 flex items-center justify-center",
                      feature.iconClass,
                    ].join(" ")}
                  >
                    <Icon aria-hidden="true" className="h-10 w-10" />
                  </div>
                </div>
                <h3
                  className="mb-3 text-xl font-bold text-gray-900"
                  style={serifStyle}
                >
                  {feature.title}
                </h3>
                <p className="text-sm font-medium leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
