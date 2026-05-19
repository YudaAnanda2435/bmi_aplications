import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Bell,
  CircleHelp,
  ClipboardList,
  FileText,
  Grid3X3,
  History,
  LogOut,
  Menu,
  Plus,
  Search,
  Sparkles,
  Settings,
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

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[240px] flex-col justify-between bg-[#0f1f14] px-4 py-8 text-[#bfc9bd] shadow-sm md:flex">
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
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between bg-[#f8f9fa]/90 px-4 backdrop-blur md:px-8">
          <div className="flex min-w-0 flex-1 items-center">
            <div className="flex items-center gap-2 md:hidden">
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
                Sinagar DietCare
              </p>
            </div>

            <div className="relative hidden w-full max-w-md md:block">
              <Search
                aria-hidden="true"
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#42493f]"
              />
              <input
                type="search"
                placeholder="Search..."
                className="h-10 w-full rounded-full border-none bg-[#f3f4f5] pl-11 pr-4 text-sm text-[#191c1d] outline-none ring-0 placeholder:text-[#64748b] focus:ring-2 focus:ring-[#3a6936]/15"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 text-[#42493f]">
            <button
              type="button"
              aria-label="Pemberitahuan"
              className="relative rounded-full p-1.5 transition hover:text-[#3a6936]"
            >
              <Bell aria-hidden="true" className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#f44336]" />
            </button>
            <button
              type="button"
              aria-label="Pengaturan"
              className="rounded-full p-1.5 transition hover:text-[#3a6936]"
            >
              <Settings aria-hidden="true" className="h-5 w-5" />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c2c9bc] bg-[#86b97d] text-white">
              <ClipboardList aria-hidden="true" className="h-5 w-5" />
            </div>
          </div>
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
                    Sinagar DietCare
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
    </div>
  );
}
