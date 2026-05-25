import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoutes";
import { legalPagesByPath } from "./data/legalPages";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import GoogleCallback from "./pages/auth/GoogleCallback";
import AboutPage from "./pages/about/AboutPage";
import BlogPage from "./pages/blog/BlogPage";
import BoardPage from "./pages/board/BoardPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import HomePage from "./pages/home/HomePage";
import ContactPage from "./pages/contact/ContactPage";
import CartPage from "./pages/cart/CartPage";
import LandingPage from "./pages/landing/LandingPage";
import OrderPaymentStatusPage from "./pages/orders/OrderPaymentStatusPage";
import OrdersPage from "./pages/orders/OrdersPage";
import ProfilePage from "./pages/profile/ProfilePage";
import StaticInfoPage from "./pages/StaticInfoPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/accueil" element={<Navigate to="/" replace />} />
        <Route path="/acceuil" element={<Navigate to="/" replace />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/la-planche" element={<BoardPage />} />
        <Route path="/planche" element={<BoardPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route
          path="/mentions-legales"
          element={
            <StaticInfoPage {...legalPagesByPath["/mentions-legales"]} />
          }
        />
        <Route
          path="/cgv"
          element={
            <StaticInfoPage
              {...legalPagesByPath["/cgv"]}
              backLinkPath="/register"
              backLinkLabel="Retour \u00e0 l'inscription"
            />
          }
        />
        <Route
          path="/rgpd"
          element={<StaticInfoPage {...legalPagesByPath["/rgpd"]} />}
        />
        <Route
          path="/accessibilite"
          element={<StaticInfoPage {...legalPagesByPath["/accessibilite"]} />}
        />

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/contact"
          element={
            <ProtectedRoute adminOnly>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/newsletter"
          element={
            <ProtectedRoute adminOnly>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/produits"
          element={
            <ProtectedRoute adminOnly>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/commandes"
          element={
            <ProtectedRoute adminOnly>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/users"
          element={
            <ProtectedRoute adminOnly>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/blogs"
          element={
            <ProtectedRoute adminOnly>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/reviews"
          element={
            <ProtectedRoute adminOnly>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/newsletter"
          element={
            <ProtectedRoute adminOnly>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/panier"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profil"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/commandes"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:orderId/success"
          element={
            <ProtectedRoute>
              <OrderPaymentStatusPage paymentStatus="success" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:orderId/cancel"
          element={
            <ProtectedRoute>
              <OrderPaymentStatusPage paymentStatus="cancel" />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
