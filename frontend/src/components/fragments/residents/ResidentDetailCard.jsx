import { Link } from "react-router-dom";
import Button from "../../elements/buttons/Button";
import InfoCard from "../../elements/cards/InfoCard";
import { residentFieldLabels } from "../../../constants/labels";
import {
  calcOptions,
  caecOptions,
  genderOptions,
  mtransOptions,
  yesNoOptions,
} from "../../../constants/options";
import { ROUTES } from "../../../constants/routes";

const optionMaps = {
  gender: genderOptions,
  family_history_with_overweight: yesNoOptions,
  favc: yesNoOptions,
  caec: caecOptions,
  smoke: yesNoOptions,
  scc: yesNoOptions,
  calc: calcOptions,
  mtrans: mtransOptions,
};

const detailFields = [
  "name",
  "gender",
  "age",
  "height",
  "weight",
  "bmi",
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

function formatNumber(value, suffix = "") {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return `${Number(value).toLocaleString("id-ID", {
    maximumFractionDigits: 2,
  })}${suffix}`;
}

function getOptionLabel(field, value) {
  const options = optionMaps[field];

  if (!options) {
    return value;
  }

  return options.find((option) => option.value === value)?.label || value;
}

function formatResidentValue(field, resident) {
  const value = resident?.[field];

  if (field === "height") {
    return formatNumber(value, " m");
  }

  if (field === "weight") {
    return formatNumber(value, " kg");
  }

  if (field === "age") {
    return formatNumber(value, " tahun");
  }

  if (field === "bmi") {
    return formatNumber(value);
  }

  return getOptionLabel(field, value) || "-";
}

export default function ResidentDetailCard({ resident }) {
  return (
    <InfoCard
      title="Detail Penduduk"
      description="Data penduduk yang digunakan sebagai input klasifikasi status obesitas."
      action={
        <Button as={Link} to={ROUTES.residentEdit(resident.id)} variant="secondary">
          Ubah
        </Button>
      }
    >
      <dl className="grid gap-4 md:grid-cols-2">
        {detailFields.map((field) => (
          <div
            key={field}
            className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {field === "bmi" ? "BMI" : residentFieldLabels[field]}
            </dt>
            <dd className="mt-1 text-sm font-medium text-slate-950">
              {formatResidentValue(field, resident)}
            </dd>
          </div>
        ))}
      </dl>
    </InfoCard>
  );
}
