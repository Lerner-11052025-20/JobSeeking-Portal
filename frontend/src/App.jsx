import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FindJobsPage from './pages/FindJobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import DashboardPage from './pages/DashboardPage';
import PostJobPage from './pages/PostJobPage';
import ProfilePage from './pages/ProfilePage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import ApplicationTrackingPage from './pages/ApplicationTrackingPage';
import CompaniesPage from './pages/CompaniesPage';
import MyJobsPage from './pages/MyJobsPage';
import ApplicationReviewPage from './pages/ApplicationReviewPage';
import NotFoundPage from './pages/NotFoundPage';

import AIChatbot from './components/chat/AIChatbot';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';

function AppRoutes() {
  const { isDark } = useTheme();

  return (
    <Router>
      {/* Toast configuration */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: isDark ? '#111827' : '#FFFFFF',
            color: isDark ? '#F3F4F6' : '#1F2937',
            border: isDark ? '1px solid #1F2937' : '1px solid #E2E8F0',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.4)' : '0 10px 40px rgba(0,0,0,0.08)',
          },
          duration: 3000,
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/jobs" element={<FindJobsPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        
        {/* Protected Routes (Auth Only) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/applications" 
          element={
            <ProtectedRoute role="jobseeker">
              <MyApplicationsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/applications/:id" 
          element={
            <ProtectedRoute role="jobseeker">
              <ApplicationTrackingPage />
            </ProtectedRoute>
          } 
        />

        {/* Employer Only Routes */}
        <Route 
          path="/dashboard/jobs" 
          element={
            <ProtectedRoute role="employer">
              <MyJobsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/applications/review/:id" 
          element={
            <ProtectedRoute role="employer">
              <ApplicationReviewPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/post-job" 
          element={
            <ProtectedRoute role="employer">
              <PostJobPage />
            </ProtectedRoute>
          } 
        />

        {/* 404 Route */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>

      {/* Global AI Chatbot */}
      <AIChatbot />
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
