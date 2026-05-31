import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import UAEBrief from "./pages/UAEBrief";
import NotFound from "./pages/NotFound";
import FloatingContact from "./components/FloatingContact";
import Feedback from "./pages/Feedback";
import AdminFeedback from "./pages/AdminFeedback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <FloatingContact />
        <Routes>
          <Route path="/" element={<Index />} />
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