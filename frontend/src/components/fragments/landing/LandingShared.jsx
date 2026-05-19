import { Link } from "react-router-dom";

export const serifStyle = { fontFamily: '"Playfair Display", serif' };

export function LandingButton({
  children,
  to,
  variant = "primary",
  className = "",
}) {
  const styles = {
    primary:
      "bg-[#003d2b] text-white shadow-md hover:bg-[#062f23] border-2 border-[#003d2b]",
    secondary:
      "border-2 border-gray-900 bg-transparent text-gray-900 hover:bg-gray-100",
    light:
      "bg-white text-[#003d2b] shadow-lg hover:bg-gray-100 border-2 border-white",
  };

  const classes = [
    "inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-bold transition-all",
    styles[variant],
    className,
  ].join(" ");

  if (typeof to === "string" && to.startsWith("#")) {
    return (
      <a href={to} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link to={to} className={classes}>
      {children}
    </Link>
  );
}

export function SectionLabel({ children }) {
  return (
    <div className="mb-6 inline-block rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1.5 text-sm font-bold text-[#003d2b]">
      {children}
    </div>
  );
}
