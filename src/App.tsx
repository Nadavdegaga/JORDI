import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import UAEBrief from "./pages/UAEBrief";
import NotFound from "./pages/NotFound";
import FloatingContact from "./components/FloatingContact";
import Feedback from "./pages/Feedback";
import AdminFeedback from "./pages/AdminFeedback";
import Landing from "./pages/Landing";

const queryClient = new QueryClient();

/** Routes that own their own conversion CTA and must not show a competing one. */
const NO_FLOATING_CONTACT = ["/lp"];

const GlobalContact = () => {
  const { pathname } = useLocation();
  if (NO_FLOATING_CONTACT.includes(pathname)) return null;
  return <FloatingContact />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <GlobalContact />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/lp" element={<Landing />} />
          <Route path="/business-brief" element={<UAEBrief />} />
          <Route path="/uae-brief" element={<UAEBrief />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/admin-feedback" element={<AdminFeedback />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;