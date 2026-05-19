import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing/LandingPage";
import HomePage from "./pages/home/HomePage";
import ProfilePage from "./pages/profile/ProfilePage";
import OrdersPage from "./pages/orders/OrdersPage";
import AboutPage from "./pages/about/AboutPage";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import GoogleCallback from "./pages/auth/GoogleCallback";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="/commandes" element={<OrdersPage />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
