import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Auth from "./pages/Auth";
import Companies from "./pages/Companies";
import Dashboard from "./pages/Dashboard";
import Experiences from "./pages/Experiences";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import NotFound from "./pages/NotFound";
import PostJob from "./pages/PostJob";
import ProfileSetup from "./pages/ProfileSetup";
import Readiness from "./pages/Readiness";
import Scorer from "./pages/Scorer";
import Tracker from "./pages/Tracker";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/experiences" element={<Experiences />} />
                <Route
                  path="/profile/setup"
                  element={
                    <ProtectedRoute>
                      <ProfileSetup />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute requireProfile>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/scorer"
                  element={
                    <ProtectedRoute requireProfile>
                      <Scorer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tracker"
                  element={
                    <ProtectedRoute requireProfile>
                      <Tracker />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/readiness"
                  element={
                    <ProtectedRoute requireProfile>
                      <Readiness />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/post-job"
                  element={
                    <ProtectedRoute>
                      <PostJob />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
