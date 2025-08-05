import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/public/Homepage";
import ExComm from "./pages/public/ExComm";
import Members from "./pages/public/Members";
import Achievements from "./pages/public/Achievements";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import MemberDashboard from "./pages/member/MemberDashboard";
import MemberMeetings from "./pages/member/MemberMeetings";
import MemberLearning from "./pages/member/MemberLearning";
import MemberProgress from "./pages/member/MemberProgress";
import MemberReflections from "./pages/member/MemberReflections";
import ContentPage from "./pages/public/ContentPage";
import MemberReflection from "./pages/member/MemberReflection";
import AdminMeetings from "./pages/admin/AdminMeetings";
import AdminContent from "./pages/admin/AdminContent";
import ExcoDashboard from "./pages/admin/ExcoDashboard";
import ExcoTasks from "./pages/admin/ExcoTasks";
import ExcoUsers from "./pages/admin/ExcoUsers";
import NotFound from "./pages/public/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ExcoAnnouncements from "./pages/admin/ExcoAnnouncements";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/ex-comm" element={<ExComm />} />
          <Route path="/members" element={<Members />} />
          <Route path="/achievements" element={<Achievements />} />
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
          <Route path="/exco/announcements" element={<ProtectedRoute><ExcoAnnouncements /></ProtectedRoute>} />
          <Route path="/content/:slug" element={<ContentPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
