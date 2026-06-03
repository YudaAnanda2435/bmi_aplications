import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  CircleHelp,
  FileText,
  Grid3X3,
  History,
  LogOut,
  Menu,
  Plus,
  Sparkles,
  ShieldPlus,
  UsersRound,
  X,
} from "lucide-react";
import Button from "../components/elements/buttons/Button";
import ConfirmDialog from "../components/elements/feedback/ConfirmDialog";
import { ROUTES, SIDEBAR_ROUTES } from "../constants/routes";
import useAuth from "../hooks/useAuth";
import { showSuccess } from "../utils/toast";

const navIcons = {
  [ROUTES.dashboard]: Grid3X3,
  [ROUTES.residents]: UsersRound,
  [ROUTES.reports]: FileText,
  [ROUTES.classificationHistory]: History,
};

function getPageHeader(pathname) {
  if (pathname === ROUTES.dashboard) {
    return {
      title: "Dashboard DietCare",
      description:
        "Pantau data penduduk, hasil klasifikasi, rekomendasi pola diet, dan peringatan dini.",
    };
  }

  if (pathname === ROUTES.residents) {
    return {
      title: "Data Penduduk",
      description:
        "Kelola data penduduk yang digunakan sebagai input klasifikasi status obesitas.",
    };
  }

  if (pathname === ROUTES.residentCreate) {
    return {
      title: "Tambah Penduduk",
      description:
        "Isi data penduduk; BMI dihitung otomatis oleh backend.",
    };
  }

  if (/^\/residents\/[^/]+\/edit$/.test(pathname)) {
    return {
      title: "Edit Penduduk",
      description:
        "Perbarui data penduduk sesuai atribut sistem.",
    };
  }

  if (/^\/residents\/[^/]+$/.test(pathname)) {
    return {
      title: "Detail Penduduk",
      description:
        "Tinjau data penduduk dan jalankan klasifikasi sebagai informasi awal.",
    };
  }

  if (pathname === ROUTES.reports) {
    return {
      title: "Laporan Klasifikasi",
      description:
        "Ringkasan hasil klasifikasi terakhir setiap penduduk.",
    };
  }

  if (pathname === ROUTES.classificationHistory) {
    return {
      title: "Riwayat Klasifikasi",
      description:
        "Daftar seluruh proses klasifikasi yang pernah dilakukan.",
    };
  }

  if (/^\/reports\/[^/]+$/.test(pathname)) {
    return {
      title: "Detail Laporan",
      description:
        "Ringkasan hasil klasifikasi sebagai informasi awal.",
    };
  }

  return {
    title: "DietCare",
    description: "Sistem klasifikasi status obesitas dan rekomendasi pola diet.",
  };
}

function HeaderHelpButton({ className = "", onClick }) {
  return (
    <button
      type="button"
      aria-label="Buka bantuan"
      onClick={onClick}
      className={[
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-[#d4e8d5] bg-white px-3 py-2 text-sm font-bold text-[#3a6936] shadow-sm transition hover:bg-[#edf6ea]",
        className,
      ].join(" ")}
    >
      <CircleHelp aria-hidden="true" className="h-5 w-5" />
      <span className="hidden sm:inline">Bantuan</span>
    </button>
  );
}

function HelpDialog({ open, onClose }) {
  if (!open) {
    return null;
  }

  const guideItems = [
    "Kelola data penduduk melalui menu Data Penduduk.",
    "Isi tinggi badan dan berat badan; BMI dihitung otomatis oleh backend.",
    "Gunakan tombol klasifikasi pada detail penduduk untuk melihat status, rekomendasi pola diet, dan peringatan dini.",
    "Buka menu Laporan untuk melihat hasil klasifikasi terakhir dan riwayat proses klasifikasi.",
  ];

  return (
    <div
      className="fixed inset-0 z-[65] flex items-center justify-center bg-[#0f1f14]/40 px-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-dialog-title"
    >
      <div className="w-full max-w-lg rounded-2xl border border-[#e1e3e4] bg-white p-6 shadow-[0_24px_80px_rgba(15,31,20,0.22)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="help-dialog-title"
              className="text-lg font-bold text-[#191c1d]"
            >
              Bantuan Penggunaan
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#64748b]">
              Panduan singkat untuk admin atau petugas desa saat menggunakan
              DietCare.
            </p>
          </div>
          <button
            type="button"
            aria-label="Tutup bantuan"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#64748b] transition hover:bg-[#edf6ea] hover:text-[#3a6936]"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <ol className="mt-5 space-y-3">
          {guideItems.map((item, index) => (
            <li
              key={item}
              className="flex gap-3 rounded-xl bg-[#f8f9fa] px-4 py-3 text-sm leading-6 text-[#334155]"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3a6936] text-xs font-bold text-white">
                {index + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>

        <p className="mt-5 rounded-xl border border-[#d4e8d5] bg-[#edf6ea] px-4 py-3 text-sm leading-6 text-[#3a6936]">
          Hasil klasifikasi adalah informasi awal dan alat bantu. Rekomendasi
          tidak menggantikan saran tenaga kesehatan.
        </p>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const pageHeader = getPageHeader(location.pathname);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  function handleLogout() {
    setIsLogoutConfirmOpen(false);
    setIsMobileMenuOpen(false);
    logout();
    showSuccess("Berhasil keluar dari sistem.");
    navigate("/", { replace: true });
  }

  function handleMobileCreate() {
    setIsMobileMenuOpen(false);
    navigate(ROUTES.residentCreate);
  }

  function handleMobileLogoutClick() {
    setIsMobileMenuOpen(false);
    setIsLogoutConfirmOpen(true);
  }

  function handleHelpClick() {
    setIsMobileMenuOpen(false);
    setIsHelpOpen(true);
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[240px] flex-col justify-between bg-[#0f1f14] px-4 py-6 text-[#bfc9bd] shadow-sm md:flex">
        <div>
          <div className="mb-10 flex gap-2 flex-row items-center px-4 text-center">
            <Sparkles
              aria-hidden="true"
              className="h-6 w-6"
              fill="currentColor"
            />
            <p className="text-xl font-bold leading-7 text-[#bbf1b0]">
              DietCare
            </p>
            {/* <p className="text-sm leading-5 text-[#bfc9bd]">Village Admin</p> */}
          </div>

          <nav className="space-y-2">
            {SIDEBAR_ROUTES.map((item) => {
              const Icon = navIcons[item.to];

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-r-full border-l-4 px-4 py-3 text-sm font-bold transition",
                      isActive
                        ? "border-[#bbf1b0] bg-[#3f4940]/30 text-[#bbf1b0]"
                        : "border-transparent text-[#bfc9bd] hover:bg-[#3f4940]/35 hover:text-[#bbf1b0]",
                    ].join(" ")
                  }
                >
                  {Icon ? (
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  ) : null}
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div>
          <Button
            onClick={() => navigate(ROUTES.residentCreate)}
            className="mb-6 w-full rounded-full bg-[#bbf1b0] py-3 font-bold text-[#002202] shadow-none hover:bg-[#a0d495]"
          >
            <Plus aria-hidden="true" className="h-5 w-5" />
            Tambah Data
          </Button>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleHelpClick}
              className="flex w-full items-center gap-3 rounded-full px-4 py-3 text-left text-sm font-bold text-[#bfc9bd] transition hover:bg-[#3f4940]/35 hover:text-[#bbf1b0]"
            >
              <CircleHelp aria-hidden="true" className="h-5 w-5" />
              Bantuan
            </button>
            <button
              type="button"
              onClick={() => setIsLogoutConfirmOpen(true)}
              className="flex w-full items-center gap-3 rounded-full px-4 py-3 text-left text-sm font-bold text-[#bfc9bd] transition hover:bg-[#3f4940]/35 hover:text-[#bbf1b0]"
            >
              <LogOut aria-hidden="true" className="h-5 w-5" />
              Keluar
            </button>
          </div>
        </div>
      </aside>

      <div className="md:pl-[240px]">
        <header className="sticky top-0 z-30 bg-[#f8f9fa]/90 px-4 py-3 backdrop-blur md:flex md:min-h-20 md:items-center md:justify-between md:gap-4 md:px-8 md:py-0">
          <div className="flex items-center justify-between gap-3 md:hidden">
            <div className="flex min-w-0 items-center gap-1">
              <button
                type="button"
                aria-label="Buka menu navigasi"
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(true)}
                className="mr-1 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d4e8d5] bg-white text-[#3a6936] shadow-sm transition hover:bg-[#edf6ea]"
              >
                <Menu aria-hidden="true" className="h-5 w-5" />
              </button>
              <ShieldPlus
                aria-hidden="true"
                className="h-7 w-7 text-[#3a6936]"
              />
              <p className="truncate text-lg font-bold text-[#3a6936]">
                DietCare
              </p>
            </div>

            <HeaderHelpButton onClick={handleHelpClick} />
          </div>

          <div className="mt-3 min-w-0 border-t border-[#e0e8dd] pt-3 md:mt-0 md:flex md:flex-1 md:items-center md:border-0 md:pt-0">
            <div className="hidden min-w-0 md:block">
              <h1 className="truncate text-2xl font-bold leading-8 text-[#191c1d]">
                {pageHeader.title}
              </h1>
              <p className="mt-0.5 max-w-3xl truncate text-sm leading-5 text-[#52637f]">
                {pageHeader.description}
              </p>
            </div>

            <div className="min-w-0 md:hidden">
              <h1 className="truncate text-base font-bold leading-6 text-[#191c1d]">
                {pageHeader.title}
              </h1>
              <p className="text-xs leading-4 text-[#52637f]">
                {pageHeader.description}
              </p>
            </div>
          </div>

          <HeaderHelpButton
            className="hidden md:inline-flex"
            onClick={handleHelpClick}
          />
        </header>

        <main className="mx-auto max-w-[1440px] px-4 pb-20 pt-6 md:px-8 md:pt-8">
          <Outlet />
        </main>
      </div>

      <div
        className={[
          "fixed inset-0 z-50 bg-[#0f1f14] text-[#bfc9bd] transition duration-300 ease-out md:hidden",
          isMobileMenuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0",
        ].join(" ")}
        aria-hidden={!isMobileMenuOpen}
      >
        <div
          className={[
            "flex h-full flex-col justify-between px-5 py-6 transition duration-300 ease-out",
            isMobileMenuOpen ? "scale-100 opacity-100" : "scale-[0.98] opacity-0",
          ].join(" ")}
        >
          <div>
            <div className="mb-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#bbf1b0] text-[#0f1f14]">
                  <Sparkles
                    aria-hidden="true"
                    className="h-6 w-6"
                    fill="currentColor"
                  />
                </div>
                <div>
                  <p className="text-xl font-bold leading-7 text-[#bbf1b0]">
                    DietCare
                  </p>
                  <p className="text-sm leading-5 text-[#bfc9bd]">
                    Sistem Admin
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Tutup menu navigasi"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#3f4940] text-[#dbe6d9] transition hover:bg-[#3f4940]/45 hover:text-[#bbf1b0]"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-3">
              {SIDEBAR_ROUTES.map((item) => {
                const Icon = navIcons[item.to];

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      [
                        "flex items-center gap-4 rounded-2xl border-l-4 px-4 py-4 text-base font-bold transition",
                        isActive
                          ? "border-[#bbf1b0] bg-[#3f4940]/40 text-[#bbf1b0]"
                          : "border-transparent text-[#dbe6d9] hover:bg-[#3f4940]/35 hover:text-[#bbf1b0]",
                      ].join(" ")
                    }
                  >
                    {Icon ? (
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    ) : null}
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="space-y-4 border-t border-[#3f4940]/70 pt-5">
            <Button
              onClick={handleMobileCreate}
              className="w-full rounded-full bg-[#bbf1b0] py-3 font-bold text-[#002202] shadow-none hover:bg-[#a0d495]"
            >
              <Plus aria-hidden="true" className="h-5 w-5" />
              Tambah Data
            </Button>

            <div className="grid gap-2">
              <button
                type="button"
                onClick={handleHelpClick}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold text-[#dbe6d9] transition hover:bg-[#3f4940]/35 hover:text-[#bbf1b0]"
              >
                <CircleHelp aria-hidden="true" className="h-5 w-5" />
                Bantuan
              </button>
              <button
                type="button"
                onClick={handleMobileLogoutClick}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold text-[#dbe6d9] transition hover:bg-[#3f4940]/35 hover:text-[#bbf1b0]"
              >
                <LogOut aria-hidden="true" className="h-5 w-5" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={isLogoutConfirmOpen}
        title="Keluar dari Sistem?"
        message="Sesi admin akan diakhiri dan Anda perlu masuk kembali untuk mengakses dashboard."
        confirmText="Ya, Keluar"
        cancelText="Tetap di Sistem"
          variant="danger"
          onConfirm={handleLogout}
          onCancel={() => setIsLogoutConfirmOpen(false)}
        />
      <HelpDialog open={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
