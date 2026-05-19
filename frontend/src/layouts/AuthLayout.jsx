import { Link, Outlet } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  ClipboardList,
  ShieldPlus,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

const loginSlides = [
  {
    eyebrow: "Dashboard Admin",
    title: "Data penduduk dan hasil klasifikasi dalam satu ruang kerja.",
    description:
      "Pantau input data, status klasifikasi, dan peringatan dini masyarakat Kampung Sinagar.",
    icon: ClipboardList,
    cards: [
      { icon: UsersRound, label: "Penduduk", value: "Data" },
      { icon: BarChart3, label: "Klasifikasi", value: "Status" },
      { icon: ShieldPlus, label: "Peringatan", value: "Dini" },
    ],
  },
  {
    eyebrow: "Informasi Awal",
    title: "Bantu admin membaca kondisi warga dengan lebih terarah.",
    description:
      "Hasil sistem ditampilkan sebagai alat bantu, lengkap dengan rekomendasi pola diet awal.",
    icon: Activity,
    cards: [
      { icon: ShieldPlus, label: "Aman", value: "Normal" },
      { icon: Activity, label: "Perhatian", value: "Pantau" },
      { icon: ClipboardList, label: "Laporan", value: "Rapi" },
    ],
  },
  {
    eyebrow: "Klasifikasi Massal",
    title: "Kelola data manual atau import Excel tanpa mengubah alur kerja.",
    description:
      "Data valid dapat disimpan dan diklasifikasikan untuk mempercepat pekerjaan admin.",
    icon: UsersRound,
    cards: [
      { icon: ClipboardList, label: "Template", value: "Excel" },
      { icon: UsersRound, label: "Import", value: "Data" },
      { icon: BarChart3, label: "Riwayat", value: "Tersimpan" },
    ],
  },
];

export default function AuthLayout() {
  return (
    <main className="grid min-h-screen bg-white text-[#191c1d] lg:grid-cols-[48%_52%]">
      <Link
        to="/"
        className="fixed left-6 top-6 z-20 inline-flex items-center gap-2 text-sm font-semibold text-[#3a6936] transition hover:text-[#2f572d]"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Kembali
      </Link>
      <section className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-9 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#d4e8d5] text-[#3a6936] shadow-[0_12px_30px_rgba(58,105,54,0.16)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff7b5c] text-white">
                <Sparkles
                  aria-hidden="true"
                  className="h-6 w-6"
                  fill="currentColor"
                />
              </div>
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#3a6936]">
              Sinagar DietCare
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-10 text-[#111827]">
              Selamat Datang Kembali
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#64748b]">
              Masuk untuk mengelola data penduduk, laporan klasifikasi, dan
              peringatan dini sebagai informasi awal.
            </p>
          </div>
          <Outlet />
        </div>
      </section>

      <section className="relative hidden min-h-screen overflow-hidden bg-[#0f1f14] p-10 lg:flex lg:items-center lg:justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(187,241,176,0.22),rgba(58,105,54,0.08)_42%,rgba(15,31,20,0)_70%)]" />
        <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(#bbf1b0_1px,transparent_1px),linear-gradient(90deg,#bbf1b0_1px,transparent_1px)] [background-size:72px_72px]" />

        <div className="relative w-full max-w-xl rounded-[2rem] border border-[#bbf1b0]/30 bg-white/10 p-8 text-white shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur">
          <Swiper
            modules={[Autoplay, Pagination]}
            loop
            speed={800}
            slidesPerView={1}
            autoplay={{ delay: 5200, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="pt-20 [&_.swiper-pagination-bullet]:!bg-white [&_.swiper-pagination-bullet]:!opacity-100 [&_.swiper-pagination-bullet-active]:!w-8 [&_.swiper-pagination-bullet-active]:!rounded-full [&_.swiper-pagination-bullet-active]:!bg-[#000]"
          >
            {loginSlides.map((slide) => {
              const MainIcon = slide.icon;

              return (
                <SwiperSlide key={slide.title}>
                  <div className="mb-8 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#bbf1b0]">
                        {slide.eyebrow}
                      </p>
                      <h2 className="mt-2 text-2xl font-bold leading-10">
                        {slide.title}
                      </h2>
                    </div>
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#bbf1b0] text-[#002202]">
                      <MainIcon aria-hidden="true" className="h-7 w-7" />
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="rounded-2xl border border-white/14 bg-white/12 p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#dbe6d9]">
                            Sinagar DietCare
                          </p>
                          <p className="mt-1 text-2xl font-bold">
                            Dashboard Admin
                          </p>
                        </div>
                        <Activity
                          aria-hidden="true"
                          className="h-6 w-6 text-[#bbf1b0]"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {slide.cards.map((card) => {
                          const CardIcon = card.icon;

                          return (
                            <div
                              key={`${slide.title}-${card.label}`}
                              className="rounded-xl bg-white/12 p-3"
                            >
                              <CardIcon
                                aria-hidden="true"
                                className="mb-3 h-5 w-5 text-[#bbf1b0]"
                              />
                              <p className="text-xs text-[#dbe6d9]">
                                {card.label}
                              </p>
                              <p className="text-lg font-bold">{card.value}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-[#bbf1b0] p-5 text-[#002202]">
                      <p className="text-sm font-semibold">
                        Informasi awal dan alat bantu
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#225020]">
                        {slide.description}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </section>
    </main>
  );
}
