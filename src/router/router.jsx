import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";
import { MyWorkProvider } from "../context/MyworkContext";
import { ITProvider } from "../context/ItPageContext";
import { NotificationsProvider } from "../context/NotificationsContext";

// Lazy-loaded components
const LoginScreen = lazy(() => import("../pages/Login/Login"));
const Layout = lazy(() => import("../components/Layout/Layout"));
const BiddingPackage = lazy(() => import("../pages/PartnerBidding/BiddingPackage"));
const BidPackagesGrid = lazy(() => import("../pages/PartnerBidding/BidPackagesGrid"));
const MyWork = lazy(() => import("../pages/MyWork/MyWork"));
const ItPage = lazy(() => import("../pages/IT/ItPage"));
const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
const Dailies = lazy(() => import("../pages/Dailies/Dailies"));
const BillingPage = lazy(() => import("../pages/Billing/Billing"));
const HRPortal = lazy(() => import("../pages/HR/HRPortal"));
const NoPageFound = lazy(() => import("../pages/NoPageFound"));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const userAuth = JSON.parse(sessionStorage.getItem("user"));

  return userAuth ? (
    <NotificationsProvider>{children}</NotificationsProvider>
  ) : (
    <Navigate to="/" replace />
  );
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

// AppRoutes Component
const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Public route for login */}
        <Route path="/" element={<LoginScreen />} />
        {/* Protected routes inside Layout */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/bidding-list" element={<BidPackagesGrid />} />
                  <Route path="/bidding-detail" element={<BiddingPackage />} />
                  <Route path="/my-work" element={<MyWorkProvider><MyWork /></MyWorkProvider>} />
                  <Route path="/it" element={<ITProvider><ItPage /></ITProvider>} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dailies" element={<Dailies />} />
                  <Route path="/billing" element={<BillingPage />} />
                  <Route path="/hr" element={<HRPortal />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/404" element={<NoPageFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
