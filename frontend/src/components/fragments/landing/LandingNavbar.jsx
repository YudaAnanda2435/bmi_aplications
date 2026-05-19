import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Sparkles, X } from "lucide-react";
import { ROUTES } from "../../../constants/routes";
import { LandingButton, serifStyle } from "./LandingShared";

const navItems = [
  { label: "Beranda", href: "#hero" },
  { label: "Fitur", href: "#features" },
  { label: "Cara Kerja", href: "#how-it-works" },
  { label: "Hasil Sistem", href: "#outputs" },
];

export default function LandingNavbar() {
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

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/50 bg-[#fcfbfa]/90 backdrop-blur-md">
      <div className="mx-auto max-w-480 px-4 sm:px-8 lg:px-12">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff7b5c] text-white">
              <Sparkles aria-hidden="true" className="h-6 w-6" fill="currentColor" />
            </div>
            <span
              className="text-2xl font-bold tracking-tight text-gray-900"
              style={serifStyle}
            >
              Sinagar DietCare
            </span>
          </Link>

          <div className="hidden items-center space-x-8 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                className="text-sm font-semibold text-gray-800 hover:text-[#003d2b]"
                href={item.href}
              >
                {item.label}
              </a>
            ))}
            {/* <div className="mx-2 h-4 w-px bg-gray-300" /> */}
            {/* <span className="flex items-center gap-1 text-sm font-semibold text-gray-800">
              ID <ChevronDown aria-hidden="true" className="h-4 w-4" />
            </span> */}
          </div>

          <div className="hidden items-center lg:flex">
            <LandingButton to={ROUTES.login} className="px-7 py-2.5">
              Masuk ke Sistem
            </LandingButton>
          </div>

          <button
            className="rounded-full p-2 text-gray-800 transition hover:bg-gray-100 lg:hidden"
            type="button"
            aria-label="Buka menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div
        className={[
          "fixed left-0 top-0 z-[999] h-[100dvh] w-screen overflow-hidden bg-[#003d2b] transition duration-300 ease-out lg:hidden",
          isMobileMenuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="absolute -left-24 top-16 h-64 w-64 rounded-full bg-[#ff7b5c]/25 blur-3xl" />
        <div className="absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-[#e5efe9]/20 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-28 bg-[#fcfbfa]/10" />
        <div
          className={[
            "relative z-10 flex h-full min-h-[100dvh] flex-col px-6 py-6 transition duration-300 ease-out",
            isMobileMenuOpen ? "scale-100 opacity-100" : "scale-[0.98] opacity-0",
          ].join(" ")}
        >
          <div className="flex items-center justify-between">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex shrink-0 items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ff7b5c] text-white">
                <Sparkles
                  aria-hidden="true"
                  className="h-6 w-6"
                  fill="currentColor"
                />
              </div>
              <span
                className="text-2xl font-bold tracking-tight text-white"
                style={serifStyle}
              >
                Sinagar DietCare
              </span>
            </Link>

            <button
              className="rounded-full border border-white/20 bg-white/10 p-3 text-white shadow-sm backdrop-blur transition hover:bg-white/20"
              type="button"
              aria-label="Tutup menu"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-center gap-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-[2rem] border border-white/15 bg-white/95 px-6 py-5 text-2xl font-bold text-[#5a4235] shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:border-white hover:bg-[#e5efe9]"
                style={serifStyle}
              >
                {item.label}
              </a>
            ))}
          </div>

          <Link
            to={ROUTES.login}
            className="inline-flex w-full items-center justify-center rounded-full border-2 border-white bg-white px-8 py-3.5 text-base font-bold text-[#003d2b] shadow-lg transition-all hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Masuk ke Sistem
          </Link>
        </div>
      </div>
    </nav>
  );
}
