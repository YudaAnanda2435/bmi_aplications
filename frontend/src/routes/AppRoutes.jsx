import { Route, Routes } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import ResidentsPage from "../pages/ResidentsPage";
import ResidentCreatePage from "../pages/ResidentCreatePage";
import ResidentDetailPage from "../pages/ResidentDetailPage";
import ResidentEditPage from "../pages/ResidentEditPage";
import ReportsPage from "../pages/ReportsPage";
import ReportDetailPage from "../pages/ReportDetailPage";
import ClassificationHistoryPage from "../pages/ClassificationHistoryPage";
import NotFoundPage from "../pages/NotFoundPage";
import { ROUTES } from "../constants/routes";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.login} element={<LoginPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.dashboard} element={<DashboardPage />} />
          <Route path={ROUTES.residents} element={<ResidentsPage />} />
          <Route path={ROUTES.residentCreate} element={<ResidentCreatePage />} />
          <Route path={ROUTES.residentDetail()} element={<ResidentDetailPage />} />
          <Route path={ROUTES.residentEdit()} element={<ResidentEditPage />} />
          <Route path={ROUTES.reports} element={<ReportsPage />} />
          <Route
            path={ROUTES.classificationHistory}
            element={<ClassificationHistoryPage />}
          />
          <Route path={ROUTES.reportDetail()} element={<ReportDetailPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
