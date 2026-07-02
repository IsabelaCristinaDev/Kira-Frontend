import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Splash from "./pages/auth/Splash.tsx";
import Login from "./pages/auth/Login.tsx";
import Signup from "./pages/auth/Signup.tsx";
import ClientSignup from "./pages/auth/ClientSignup.tsx";
import ProfessionalSignup from "./pages/professional/ProfessionalSignup.tsx";
import Home from "./pages/Home";
import SearchProfessionals from "./pages/Client/SearchProfessionals.tsx";
import ProfessionalProfile from "./pages/auth/ProfessionalProfile.tsx";
import Booking from "./pages/Client/Booking.tsx";
import ProDashboard from "./pages/professional/ProDashboard.tsx";
import ProAgenda from "./pages/professional/ProAgenda.tsx";
import ProEarnings from "./pages/professional/ProEarnings.tsx";
import ProRanking from "./pages/professional/ProRanking.tsx";
import Profile from "./pages/Client/Profile.tsx";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/client" element={<ClientSignup />} />
          <Route path="/signup/professional" element={<ProfessionalSignup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<SearchProfessionals />} />
          <Route path="/professional/:id" element={<ProfessionalProfile />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/pro/dashboard" element={<ProDashboard />} />
          <Route path="/pro/agenda" element={<ProAgenda />} />
          <Route path="/pro/earnings" element={<ProEarnings />} />
          <Route path="/pro/ranking" element={<ProRanking />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
