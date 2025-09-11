import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Cadastros from "./pages/Cadastros";
import PlatformRegistration from "./pages/PlatformRegistration";
import UnitRegistration from "./pages/UnitRegistration";
import CompanyRegistration from "./pages/CompanyRegistration";
import CompanyView from "./pages/CompanyView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cadastros" element={<Cadastros />} />
          <Route path="/cadastro-plataforma" element={<PlatformRegistration />} />
          <Route path="/cadastro-unidade" element={<UnitRegistration />} />
          <Route path="/cadastro-loja" element={<CompanyRegistration />} />
          <Route path="/visualizar-loja" element={<CompanyView />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
