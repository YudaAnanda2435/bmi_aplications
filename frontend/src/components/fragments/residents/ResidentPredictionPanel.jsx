import { useState } from "react";
import Button from "../../elements/buttons/Button";
import ActionLoadingModal from "../../elements/feedback/ActionLoadingModal";
import Alert from "../../elements/feedback/Alert";
import EmptyState from "../../elements/tables/EmptyState";
import predictionService from "../../../services/predictionService";
import PredictionResult from "../predictions/PredictionResult";
import { showError, showSuccess } from "../../../utils/toast";

export default function ResidentPredictionPanel({ residentId }) {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handlePredict() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await predictionService.predictResident(residentId);
      setResult(data);
      showSuccess("Klasifikasi berhasil diproses.");
      showSuccess("Rekomendasi pola diet berhasil dibuat.");
    } catch (error) {
      setErrorMessage(error.message);
      showError("Klasifikasi gagal diproses.");
      showError("Rekomendasi pola diet gagal dibuat.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h2 className="text-base font-semibold text-slate-950">
              Klasifikasi Penduduk
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Jalankan klasifikasi untuk mendapatkan status obesitas,
              rekomendasi awal, dan peringatan dini sebagai alat bantu.
            </p>
          </div>
          <Button onClick={handlePredict} disabled={isLoading}>
            {isLoading ? "Memproses..." : "Proses Klasifikasi"}
          </Button>
        </div>
      </div>

      {errorMessage ? (
        <Alert
          variant="danger"
          title="Klasifikasi gagal diproses"
          message={errorMessage}
        />
      ) : null}

      {result ? (
        <PredictionResult result={result} />
      ) : (
        <EmptyState
          title="Belum ada hasil klasifikasi"
          description="Klik tombol Proses Klasifikasi untuk menampilkan hasil sebagai informasi awal."
          className="min-h-36"
        />
      )}
      <ActionLoadingModal
        open={isLoading}
        title="Mohon tunggu..."
        message="Sistem sedang menjalankan klasifikasi..."
      />
    </section>
  );
}
