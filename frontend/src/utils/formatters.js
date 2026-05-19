export function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(new Date(value))
    .replace(" pukul ", ", ")
    .replace(":", ".");
}

export function formatNumber(value, suffix = "") {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return `${Number(value).toLocaleString("id-ID", {
    maximumFractionDigits: 2,
  })}${suffix}`;
}
