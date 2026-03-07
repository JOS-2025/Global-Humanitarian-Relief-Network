import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";

// Pages — Public
import HomePage from "@/pages/Home";
import BlogPage from "@/pages/Blog";
import BlogPostPage from "@/pages/BlogPost";
import PortfolioPage from "@/pages/Portfolio";
import PortfolioProjectPage from "@/pages/PortfolioProject";
import StorePage from "@/pages/Store";
import ContactPage from "@/pages/Contact";

// Pages — Auth
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import ForgotPasswordPage from "@/pages/ForgotPassword";

// Pages — Protected
import DashboardPage from "@/pages/Dashboard";
import DashboardSettingsPage from "@/pages/DashboardSettings";

// Pages — Admin
import AdminPage from "@/pages/Admin";
import AdminPostEditorPage from "@/pages/AdminPostEditor";
import AdminProjectEditorPage from "@/pages/AdminProjectEditor";

import NotFound from "@/pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <Toaster richColors position="top-right" />
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/portfolio/:slug" element={<PortfolioProjectPage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected — User */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/settings" element={<DashboardSettingsPage />} />

        {/* Protected — Admin */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/posts/:id" element={<AdminPostEditorPage />} />
        <Route path="/admin/projects/:id" element={<AdminProjectEditorPage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
