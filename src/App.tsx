import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import UAEBrief from "./pages/UAEBrief";
import NotFound from "./pages/NotFound";
import FloatingContact from "./components/FloatingContact";
import Feedback from "./pages/Feedback";
import AdminFeedback from "./pages/AdminFeedback";
import Landing from "./pages/Landing";
import { isCampaignHost } from "./lib/host";

const queryClient = new QueryClient();

/** Routes that own their own conversion CTA and must not show a competing one. */
const NO_FLOATING_CONTACT = ["/lp"];

const GlobalContact = () => {
  const { pathname } = useLocation();
  if (NO_FLOATING_CONTACT.includes(pathname)) return null;
  return <FloatingContact />;
};

/**
 * The campaign host (lp.<domain>) serves nothing but the landing page — any
 * path on it lands there. None of the main site's routes are mounted, so the
 * two are reachable only from their own domain.
 */
const CampaignRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const MainSiteRoutes = () => (
  <>
    <GlobalContact />
    <Routes>
      <Route path="/" element={<Index />} />
      {/* Kept so ad links created before the subdomain existed still work. */}
      <Route path="/lp" element={<Landing />} />
      <Route path="/business-brief" element={<UAEBrief />} />
      <Route path="/uae-brief" element={<UAEBrief />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/admin-feedback" element={<AdminFeedback />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {isCampaignHost() ? <CampaignRoutes /> : <MainSiteRoutes />}
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;