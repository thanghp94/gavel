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
import ContentPage from "./pages/ContentPage";
import MemberReflection from "./pages/MemberReflection";
import AdminMeetings from "./pages/AdminMeetings";
import AdminContent from "./pages/AdminContent";
import ExcoDashboard from "./pages/ExcoDashboard";
import ExcoTasks from "./pages/ExcoTasks";
import ExcoUsers from "./pages/ExcoUsers";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

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
          <Route path="/member/dashboard" element={<ProtectedRoute><MemberDashboard /></ProtectedRoute>} />
          <Route path="/member/meetings" element={<ProtectedRoute><MemberMeetings /></ProtectedRoute>} />
          <Route path="/member/learning" element={<ProtectedRoute><MemberLearning /></ProtectedRoute>} />
          <Route path="/member/progress" element={<ProtectedRoute><MemberProgress /></ProtectedRoute>} />
          <Route path="/member/reflections" element={<ProtectedRoute><MemberReflections /></ProtectedRoute>} />
          <Route path="/member/reflection/:meetingId" element={<ProtectedRoute><MemberReflection /></ProtectedRoute>} />
          <Route path="/exco/dashboard" element={<ProtectedRoute><ExcoDashboard /></ProtectedRoute>} />
          <Route path="/exco/meetings" element={<ProtectedRoute><AdminMeetings /></ProtectedRoute>} />
          <Route path="/exco/content" element={<ProtectedRoute><AdminContent /></ProtectedRoute>} />
          <Route path="/exco/tasks" element={<ProtectedRoute><ExcoTasks /></ProtectedRoute>} />
          <Route path="/exco/users" element={<ProtectedRoute><ExcoUsers /></ProtectedRoute>} />
          <Route path="/:slug" element={<ContentPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;