import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../components/elements/buttons/Button";
import ActionLoadingModal from "../components/elements/feedback/ActionLoadingModal";
import Alert from "../components/elements/feedback/Alert";
import CardSkeleton from "../components/elements/loading/CardSkeleton";
import ReportDetail from "../components/fragments/reports/ReportDetail";
import { ROUTES } from "../constants/routes";
import reportService from "../services/reportService";
import { showError, showSuccess } from "../utils/toast";

export default function ReportDetailPage() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isDownloadingPdfRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function loadReport() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const data = await reportService.getReport(id);

        if (isMounted) {
          setReport(data);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message);
          showError("Data gagal dimuat.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadReport();

    return () => {
      isMounted = false;
    };
  }, [id]);

  async function handleDownloadPdf() {
    if (isDownloadingPdfRef.current) {
      return;
    }

    isDownloadingPdfRef.current = true;
    setIsGeneratingPdf(true);
    let pdfFile;

    try {
      pdfFile = await reportService.downloadReportPdf(id);
    } catch (error) {
      showError("PDF laporan gagal dibuat.");
      isDownloadingPdfRef.current = false;
      setIsGeneratingPdf(false);
      return;
    }

    const { blob, filename } = pdfFile;

    if (!blob || blob.size === 0) {
      showError("PDF laporan gagal dibuat.");
      isDownloadingPdfRef.current = false;
      setIsGeneratingPdf(false);
      return;
    }

    try {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      window.setTimeout(() => {
        if (document.body.contains(link)) {
          link.remove();
        }
        window.URL.revokeObjectURL(url);
      }, 60000);
    } catch (error) {
      // Request PDF sudah berhasil. Jangan tampilkan toast gagal untuk error
      // kecil dari browser saat memproses blob download.
    }

    showSuccess("PDF laporan berhasil dibuat.");
    isDownloadingPdfRef.current = false;
    setIsGeneratingPdf(false);
  }

  if (isLoading) {
    return (
      <section className="space-y-6">
        <CardSkeleton rows={6} />
        <CardSkeleton rows={4} />
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="space-y-4">
        <Alert
          variant="danger"
          title="Detail laporan gagal dimuat"
          message={errorMessage}
        />
        <Button as={Link} to={ROUTES.reports} variant="secondary">
          Kembali ke Laporan
        </Button>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap justify-end gap-2 print:hidden">
          <Button as={Link} to={ROUTES.reports} variant="secondary">
            Kembali
          </Button>
          <Button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
          >
            Cetak PDF
          </Button>
      </div>

      <ReportDetail report={report} />
      <ActionLoadingModal
        open={isGeneratingPdf}
        title="Mohon tunggu..."
        message="PDF laporan sedang dibuat..."
      />
    </section>
  );
}
