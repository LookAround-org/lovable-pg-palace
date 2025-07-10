
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import PropertyDetails from "./pages/PropertyDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import Partner from "./pages/Partner";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import HelpCenter from "./pages/HelpCenter";
import ContactUs from "./pages/ContactUs";
import SafetyInformation from "./pages/SafetyInformation";
import FAQ from "./pages/FAQ";
import HostLogin from "./pages/HostLogin";
import HostDashboard from "./pages/HostDashboard";
import HostProperties from "./pages/HostProperties";
import HostAllProperties from "./pages/HostAllProperties";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <WishlistProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/property/:id" element={<PropertyDetails />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/partner" element={<Partner />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/help" element={<HelpCenter />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/safety" element={<SafetyInformation />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/host/login" element={<HostLogin />} />
                  <Route path="/host/dashboard" element={<HostDashboard />} />
                  <Route path="/host/properties" element={<HostAllProperties />} />
                  <Route path="/host/properties/:hostId" element={<HostProperties />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </WishlistProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
