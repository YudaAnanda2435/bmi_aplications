import { categories } from "./landingData";
import { SectionLabel, serifStyle } from "./LandingShared";

export default function LandingClassificationSection() {
  return (
    <section id="outputs" className="rounded-[3rem] bg-white py-24">
      <div className="mx-auto max-w-480 px-4 sm:px-8 lg:px-12">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <SectionLabel>Output Sistem</SectionLabel>
          <h2
            className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl"
            style={serifStyle}
          >
            Kategori Status Klasifikasi
          </h2>
          <p className="text-lg font-medium text-gray-600">
            Sistem mengelompokkan hasil ke dalam beberapa kategori untuk
            memudahkan pemantauan.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.title}
              className={[
                "flex flex-col items-center rounded-[2rem] border-2 p-8 text-center transition-colors",
                category.wrapper,
              ].join(" ")}
              data-aos="zoom-in"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                <span
                  className={["h-6 w-6 rounded-full", category.dot].join(" ")}
                />
              </div>
              <h3
                className="mb-3 text-xl font-bold text-gray-900"
                style={serifStyle}
              >
                {category.title}
              </h3>
              <p className="text-sm font-medium text-gray-600">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
