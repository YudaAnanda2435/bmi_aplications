import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../elements/buttons/Button";
import ActionLoadingModal from "../../elements/feedback/ActionLoadingModal";
import Alert from "../../elements/feedback/Alert";
import Input from "../../elements/forms/Input";
import Select from "../../elements/forms/Select";
import FormSkeleton from "../../elements/loading/FormSkeleton";
import { residentFieldLabels } from "../../../constants/labels";
import { residentFormOptions } from "../../../constants/options";
import { ROUTES } from "../../../constants/routes";
import residentService from "../../../services/residentService";
import { showError, showSuccess } from "../../../utils/toast";

const initialValues = {
  name: "",
  gender: "",
  age: "",
  height: "",
  weight: "",
  family_history_with_overweight: "",
  favc: "",
  fcvc: "",
  ncp: "",
  caec: "",
  smoke: "",
  ch2o: "",
  scc: "",
  faf: "",
  tue: "",
  calc: "",
  mtrans: "",
};

const numericFields = [
  "age",
  "height",
  "weight",
  "fcvc",
  "ncp",
  "ch2o",
  "faf",
  "tue",
];

const selectFields = [
  "gender",
  "family_history_with_overweight",
  "favc",
  "fcvc",
  "ncp",
  "caec",
  "smoke",
  "ch2o",
  "scc",
  "faf",
  "tue",
  "calc",
  "mtrans",
];

const helperTexts = {
  height: "Isi dalam cm, contoh 160.",
  fcvc: "Pilih tingkat kebiasaan konsumsi sayur dalam makanan.",
  ncp: "Pilih jumlah makan utama yang biasa dilakukan.",
  ch2o: "Pilih tingkat konsumsi air harian.",
  faf: "Pilih tingkat kebiasaan aktivitas fisik.",
  tue: "Pilih tingkat durasi penggunaan perangkat seperti HP, laptop, komputer, atau TV.",
};

function toFormValues(resident) {
  return Object.keys(initialValues).reduce((values, key) => {
    const value = resident?.[key];
    if (key === "height" && Number(value) > 0 && Number(value) <= 3) {
      values[key] = String(Number(value) * 100);
      return values;
    }

    values[key] = value === null || value === undefined ? "" : String(value);
    return values;
  }, {});
}

function buildPayload(formValues) {
  return Object.entries(formValues).reduce((payload, [key, value]) => {
    payload[key] = numericFields.includes(key) ? Number(value) : value;
    return payload;
  }, {});
}

function validateForm(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Nama penduduk wajib diisi.";
  }

  if (Number(values.age) <= 0) {
    errors.age = "Usia harus lebih dari 0.";
  }

  if (Number(values.height) <= 0) {
    errors.height = "Tinggi badan harus lebih dari 0.";
  }

  if (Number(values.weight) <= 0) {
    errors.weight = "Berat badan harus lebih dari 0.";
  }

  return errors;
}

export default function ResidentForm({ mode = "create" }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === "edit";
  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadResident() {
      if (!isEdit) {
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const resident = await residentService.getResident(id);

        if (isMounted) {
          setFormValues(toFormValues(resident));
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
  }, [id, isEdit]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm(formValues);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const payload = buildPayload(formValues);

      if (isEdit) {
        await residentService.updateResident(id, payload);
        showSuccess("Data penduduk berhasil diperbarui.");
        navigate(ROUTES.residentDetail(id), { replace: true });
      } else {
        await residentService.createResident(payload);
        showSuccess("Data penduduk berhasil ditambahkan.");
        navigate(ROUTES.residents, { replace: true });
      }
    } catch (error) {
      setErrorMessage(error.message);
      showError(
        isEdit
          ? "Data penduduk gagal diperbarui."
          : "Data penduduk gagal ditambahkan."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderField(field) {
    const commonProps = {
      id: field,
      name: field,
      label: residentFieldLabels[field],
      value: formValues[field],
      onChange: handleChange,
      error: errors[field],
      helperText: helperTexts[field],
      required: true,
    };

    if (selectFields.includes(field)) {
      return (
        <Select
          key={field}
          {...commonProps}
          options={residentFormOptions[field] || []}
        />
      );
    }

    return (
      <Input
        key={field}
        {...commonProps}
        type={numericFields.includes(field) ? "number" : "text"}
        min={numericFields.includes(field) ? "0" : undefined}
        step={field === "age" ? "1" : numericFields.includes(field) ? "0.01" : undefined}
      />
    );
  }

  if (isLoading) {
    return <FormSkeleton fields={Object.keys(initialValues).length} />;
  }

  return (
    <section className="space-y-5">
      {errorMessage ? (
        <Alert
          variant="danger"
          title="Data penduduk gagal disimpan"
          message={errorMessage}
        />
      ) : null}

      <form
        className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-5 md:grid-cols-2">
          {Object.keys(initialValues).map(renderField)}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              navigate(isEdit ? ROUTES.residentDetail(id) : ROUTES.residents)
            }
          >
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
      <ActionLoadingModal
        open={isSubmitting}
        title="Mohon tunggu..."
        message={
          isEdit
            ? "Perubahan data sedang disimpan..."
            : "Data penduduk sedang disimpan..."
        }
      />
    </section>
  );
}
