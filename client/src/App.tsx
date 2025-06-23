
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MemberDashboard from "./pages/MemberDashboard";
import MemberMeetings from "./pages/MemberMeetings";
import MemberLearning from "./pages/MemberLearning";
import MemberProgress from "./pages/MemberProgress";
import MemberReflections from "./pages/MemberReflections";
import ExcoDashboard from "./pages/ExcoDashboard";
import MemberReflection from "./pages/MemberReflection";
import AdminMeetings from "./pages/AdminMeetings";
import AdminContent from "./pages/AdminContent";
import ExcoTasks from "./pages/ExcoTasks";
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/member/dashboard" element={<MemberDashboard />} />
          <Route path="/member/meetings" element={<MemberMeetings />} />
          <Route path="/member/learning" element={<MemberLearning />} />
          <Route path="/member/progress" element={<MemberProgress />} />
          <Route path="/member/reflections" element={<MemberReflections />} />
          <Route path="/member/reflection/:meetingId" element={<MemberReflection />} />
          <Route path="/exco/dashboard" element={<ExcoDashboard />} />
          <Route path="/exco/meetings" element={<AdminMeetings />} />
          <Route path="/exco/content" element={<AdminContent />} />
          <Route path="/exco/tasks" element={<ExcoTasks />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
