export const ROUTES = {
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  residents: "/residents",
  residentCreate: "/residents/create",
  residentDetail: (id = ":id") => `/residents/${id}`,
  residentEdit: (id = ":id") => `/residents/${id}/edit`,
  reports: "/reports",
  classificationHistory: "/classification-history",
  reportDetail: (id = ":id") => `/reports/${id}`,
};

export const SIDEBAR_ROUTES = [
  { label: "Dashboard", to: ROUTES.dashboard },
  { label: "Data Penduduk", to: ROUTES.residents },
  { label: "Laporan", to: ROUTES.reports },
  { label: "Riwayat Klasifikasi", to: ROUTES.classificationHistory },
];
