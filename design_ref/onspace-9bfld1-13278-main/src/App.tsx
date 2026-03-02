import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import DashboardLayout from '@/components/layout/DashboardLayout';

const Landing = lazy(() => import('@/pages/Landing'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const StudentDashboard = lazy(() => import('@/pages/StudentDashboard'));
const RecruiterDashboard = lazy(() => import('@/pages/RecruiterDashboard'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));

function LoadingFallback() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 animate-spin rounded-full border-[3px] border-muted border-t-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole: string }) {
  const { isAuthenticated, currentRole } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (currentRole !== allowedRole) return <Navigate to={`/${currentRole}`} replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Dashboard */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRole="student">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
          </Route>

          {/* Recruiter Dashboard */}
          <Route
            path="/recruiter"
            element={
              <ProtectedRoute allowedRole="recruiter">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<RecruiterDashboard />} />
          </Route>

          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
