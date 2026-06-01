import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../components/elements/buttons/Button";
import Alert from "../components/elements/feedback/Alert";
import CardSkeleton from "../components/elements/loading/CardSkeleton";
import ResidentDetailCard from "../components/fragments/residents/ResidentDetailCard";
import ResidentPredictionPanel from "../components/fragments/residents/ResidentPredictionPanel";
import { ROUTES } from "../constants/routes";
import residentService from "../services/residentService";
import { showError } from "../utils/toast";

export default function ResidentDetailPage() {
  const { id } = useParams();
  const [resident, setResident] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadResident() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const data = await residentService.getResident(id);

        if (isMounted) {
          setResident(data);
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

    loadResident();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <section className="space-y-6">
        <CardSkeleton rows={8} />
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="space-y-4">
        <Alert
          variant="danger"
          title="Detail penduduk gagal dimuat"
          message={errorMessage}
        />
        <Button as={Link} to={ROUTES.residents} variant="secondary">
          Kembali ke Data Penduduk
        </Button>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex justify-end">
        <Button as={Link} to={ROUTES.residents} variant="secondary">
          Kembali
        </Button>
      </div>

      <ResidentDetailCard resident={resident} />
      <ResidentPredictionPanel residentId={resident.id} />
    </section>
  );
}
