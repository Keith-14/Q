import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { CartProvider } from "./contexts/CartContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LocationProvider } from "./contexts/LocationContext";
import { LanguageProvider } from "./contexts/LanguageContext";

/* ---------- PRIVATE APP PAGES ---------- */
import { Home } from "./pages/Home";
import { LoadingScreen } from "./pages/LoadingScreen";
import { Register } from "./pages/Register";
import { Onboarding } from "./pages/Onboarding";
import { Quran } from "./pages/Quran";
import { Qibla } from "./pages/Qibla";
import { Shop } from "./pages/Shop";
import { Places } from "./pages/Places";
import { Account } from "./pages/Account";
import { PrayerTimes } from "./pages/PrayerTimes";
import { Progress } from "./pages/Progress";
import { FAQ } from "./pages/FAQ";
import { Zakat } from "./pages/Zakat";
import { Hajj } from "./pages/Hajj";
import { BusinessAccount } from "./pages/BusinessAccount";
import { Cart } from "./pages/Cart";
import { SellerDashboard } from "./pages/SellerDashboard";
import { MakkahLive } from "./pages/MakkahLive";
import { Forum } from "./pages/Forum";
import { News } from "./pages/News";
import { Mood } from "./pages/Mood";
import NotFound from "./pages/NotFound";

/* ---------- LANDING SITE ---------- */
import LandingLayout from "./landing/LandingLayout";
import LandingHome from "./landing/Home";
import Features from "./landing/Features";
import About from "./landing/About";
import Contact from "./landing/Contact";

const queryClient = new QueryClient();
const SITE_MODE = import.meta.env.VITE_SITE_MODE;

/* ---------------- Protected Route ---------------- */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

/* ---------------- App ---------------- */
const App = () => {
  const allowPreview =
    new URLSearchParams(window.location.search)
      .get("preview")
      ?.toLowerCase() === "true";

  /* ================= PRE-LAUNCH LANDING SITE ================= */
  if (SITE_MODE === "prelaunch" && !allowPreview) {
    return (
      <BrowserRouter>
        <Routes>
          <Route element={<LandingLayout />}>
            <Route path="/" element={<LandingHome />} />
            <Route path="/features" element={<Features />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<LandingHome />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }

  /* ================= PRIVATE APP ================= */
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <BrowserRouter>
            <AuthProvider>
              <LocationProvider>
                <CartProvider>
                  <Toaster />
                  <Sonner />

                  <Routes>
                    <Route path="/loading" element={<LoadingScreen />} />
                    <Route path="/login" element={<Register />} />

                    <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="/quran" element={<ProtectedRoute><Quran /></ProtectedRoute>} />
                    <Route path="/qibla" element={<ProtectedRoute><Qibla /></ProtectedRoute>} />
                    <Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
                    <Route path="/forum" element={<ProtectedRoute><Forum /></ProtectedRoute>} />
                    <Route path="/places" element={<ProtectedRoute><Places /></ProtectedRoute>} />
                    <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                    <Route path="/seller-dashboard" element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>} />
                    <Route path="/prayer-times" element={<ProtectedRoute><PrayerTimes /></ProtectedRoute>} />
                    <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
                    <Route path="/faq" element={<ProtectedRoute><FAQ /></ProtectedRoute>} />
                    <Route path="/zakat" element={<ProtectedRoute><Zakat /></ProtectedRoute>} />
                    <Route path="/hajj" element={<ProtectedRoute><Hajj /></ProtectedRoute>} />
                    <Route path="/business-account" element={<ProtectedRoute><BusinessAccount /></ProtectedRoute>} />
                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/makkah-live" element={<ProtectedRoute><MakkahLive /></ProtectedRoute>} />
                    <Route path="/news" element={<ProtectedRoute><News /></ProtectedRoute>} />
                    <Route path="/mood" element={<ProtectedRoute><Mood /></ProtectedRoute>} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </CartProvider>
              </LocationProvider>
            </AuthProvider>
          </BrowserRouter>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;