import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import Button from "../../elements/buttons/Button";
import ActionLoadingModal from "../../elements/feedback/ActionLoadingModal";
import FormError from "../../elements/forms/FormError";
import Input from "../../elements/forms/Input";
import { ROUTES } from "../../../constants/routes";
import useAuth from "../../../hooks/useAuth";
import { showError, showSuccess } from "../../../utils/toast";

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const redirectTo = location.state?.from?.pathname || ROUTES.dashboard;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setFormData({
      email: "",
      password: "",
    });
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await login(formData);
      showSuccess("Berhasil masuk ke sistem.");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrorMessage(error.message);
      showError("Email atau password salah.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
        <FormError message={errorMessage} />
        <div className="space-y-4">
          <div className="relative">
            <Mail
              aria-hidden="true"
              className="absolute left-4 top-[43px] h-5 w-5 text-[#64748b]"
            />
            <Input
              id="email"
              name="email"
              label="Email Admin"
              type="email"
              placeholder="admin@sinagar.local"
              autoComplete="off"
              value={formData.email}
              onChange={handleChange}
              className="h-12 rounded-xl border-[#d9dadb] pl-12 focus:border-[#3a6936] focus:ring-[#d4e8d5]"
              required
            />
          </div>
          <div className="relative">
            <LockKeyhole
              aria-hidden="true"
              className="absolute left-4 top-[43px] h-5 w-5 text-[#64748b]"
            />
            <Input
              id="password"
              name="password"
              label="Kata Sandi"
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan kata sandi admin"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              className="h-12 rounded-xl border-[#d9dadb] pl-12 pr-12 focus:border-[#3a6936] focus:ring-[#d4e8d5]"
              required
            />
            <button
              type="button"
              aria-label={
                showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"
              }
              aria-pressed={showPassword}
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-4 top-[43px] inline-flex h-5 w-5 items-center justify-center text-[#64748b] transition hover:text-[#3a6936]"
            >
              {showPassword ? (
                <EyeOff aria-hidden="true" className="h-5 w-5" />
              ) : (
                <Eye aria-hidden="true" className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-[#e7e8e9] bg-[#f8f9fa] px-4 py-3">
          <p className="text-xs leading-5 text-[#64748b]">
            Akses hanya untuk admin internal pengelola data penduduk Kampung
            Sinagar.
          </p>
        </div>

        <Button
          type="submit"
          className="h-12 w-full rounded-xl bg-[#3a6936] text-sm font-bold shadow-[0_12px_24px_rgba(58,105,54,0.18)] hover:bg-[#2f572d]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            "Memproses..."
          ) : (
            <>
              Masuk
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>
      <ActionLoadingModal
        open={isSubmitting}
        title="Mohon tunggu..."
        message="Sedang masuk ke sistem..."
      />
    </>
  );
}
