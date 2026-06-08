import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, User } from "lucide-react";
import Button from "../../elements/buttons/Button";
import ActionLoadingModal from "../../elements/feedback/ActionLoadingModal";
import FormError from "../../elements/forms/FormError";
import Input from "../../elements/forms/Input";
import { ROUTES } from "../../../constants/routes";
import useAuth from "../../../hooks/useAuth";
import { showError, showSuccess } from "../../../utils/toast";

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function validateForm() {
    if (!formData.name.trim()) {
      return "Nama wajib diisi.";
    }

    if (!formData.email.trim()) {
      return "Email wajib diisi.";
    }

    if (!formData.password.trim()) {
      return "Password wajib diisi.";
    }

    if (formData.password.length < 6) {
      return "Password minimal 6 karakter.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Konfirmasi password tidak cocok.";
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      showError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirm_password: formData.confirmPassword,
      });

      showSuccess("Registrasi berhasil. Silakan login.");
      navigate(ROUTES.login, { replace: true });
    } catch (error) {
      setErrorMessage(error.message);
      showError(error.message);
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
            <User
              aria-hidden="true"
              className="absolute left-4 top-[43px] h-5 w-5 text-[#64748b]"
            />
            <Input
              id="name"
              name="name"
              label="Nama Pengguna"
              type="text"
              placeholder="Masukkan nama pengguna"
              autoComplete="off"
              value={formData.name}
              onChange={handleChange}
              className="h-12 rounded-xl border-[#d9dadb] pl-12 focus:border-[#3a6936] focus:ring-[#d4e8d5]"
              required
            />
          </div>
          <div className="relative">
            <Mail
              aria-hidden="true"
              className="absolute left-4 top-[43px] h-5 w-5 text-[#64748b]"
            />
            <Input
              id="email"
              name="email"
              label="Email Pengguna"
              type="email"
              placeholder="Masukkan email pengguna"
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
              placeholder="Masukkan kata sandi"
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
          <div className="relative">
            <LockKeyhole
              aria-hidden="true"
              className="absolute left-4 top-[43px] h-5 w-5 text-[#64748b]"
            />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              label="Konfirmasi Kata Sandi"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Ulangi kata sandi"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="h-12 rounded-xl border-[#d9dadb] pl-12 pr-12 focus:border-[#3a6936] focus:ring-[#d4e8d5]"
              required
            />
            <button
              type="button"
              aria-label={
                showConfirmPassword
                  ? "Sembunyikan konfirmasi kata sandi"
                  : "Lihat konfirmasi kata sandi"
              }
              aria-pressed={showConfirmPassword}
              onClick={() => setShowConfirmPassword((current) => !current)}
              className="absolute right-4 top-[43px] inline-flex h-5 w-5 items-center justify-center text-[#64748b] transition hover:text-[#3a6936]"
            >
              {showConfirmPassword ? (
                <EyeOff aria-hidden="true" className="h-5 w-5" />
              ) : (
                <Eye aria-hidden="true" className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-[#e7e8e9] bg-[#f8f9fa] px-4 py-3">
          <p className="text-xs leading-5 text-[#64748b]">
            Akun digunakan untuk mengelola data, klasifikasi, laporan, dan riwayat.
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
              Daftar
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </>
          )}
        </Button>

        <div className="text-center text-sm text-[#64748b]">
          Sudah punya akun?{" "}
          <Link
            to={ROUTES.login}
            className="font-semibold text-[#3a6936] transition hover:text-[#2f572d]"
          >
            Masuk
          </Link>
        </div>
      </form>

      <ActionLoadingModal
        open={isSubmitting}
        title="Mohon tunggu..."
        message="Akun sedang dibuat..."
      />
    </>
  );
}
