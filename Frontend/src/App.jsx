import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Landing from './pages/public/Landing';
import About from './pages/public/AboutPage';
import JobsPage from './pages/public/JobsPage';
import AuthPage from './pages/AuthPage';
import Demo from './pages/Demo';

// Layout
import AppShell from './layout/AppShell';
import MainLayout from './layout/MainLayout';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Companies from './pages/admin/Companies';
import Analytics from './pages/admin/Analytics';
import Settings from './pages/admin/Settings';
import DemoRequests from './pages/admin/DemoRequest';
import Jobs from './pages/admin/Jobs';
import Candidates from './pages/admin/Candidates';
import Users from './pages/admin/Users';
import Interviews from './pages/admin/Interviews';

// Company Pages
import ProtectedRoute from './components/ProtectedRoute';
import CompanyLayout from './layout/CompanyLayout';

import CompanyDashboard from './pages/company/Dashboard';
import AllJobs from './pages/company/AllJobs';
import CreateJob from './pages/company/CreateJob';
import Applications from './pages/company/Applications';
import TeamManagement from './pages/company/TeamManagement';
import CompanySettings from './pages/company/Settings';
import JobApplicationsView from './pages/company/JobApplicationsView';
import AiAnalysisResults from './pages/company/AiAnalysisResults';

// Candidate Pages
import CandidateLayout from './layout/CandidateLayout';
import CandidateDashboard from './pages/candidate/Dashboard';
import AppliedJobs from './pages/candidate/AppliedJobs';
import CandidateProfile from './pages/candidate/Profile';
import CandidateNotifications from './pages/candidate/Notifications';
import JobDetails from './pages/candidate/JobsDetails';

const App = () => {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/request-demo" element={<Demo />} />
      </Route>

      <Route path="/auth" element={<AuthPage />} />

      {/* Company Routes (Protected: company_admin & hr) */}
      <Route element={<ProtectedRoute allowedRoles={['company_admin', 'hr']} />}>
        <Route path="/company" element={<CompanyLayout />}>
          <Route index element={<CompanyDashboard />} />
          <Route path="jobs" element={<AllJobs />} />
          <Route path="jobs/:jobId/applications" element={<JobApplicationsView />} />
          <Route path="jobs/:jobId/ai-results" element={<AiAnalysisResults />} />
          <Route path="create-job" element={<CreateJob />} />
          <Route path="applications" element={<Applications />} />

          {/* Admin Only within Company */}
          <Route element={<ProtectedRoute allowedRoles={['company_admin']} />}>
            <Route path="team" element={<TeamManagement />} />
            <Route path="settings" element={<CompanySettings />} />
          </Route>
        </Route>
      </Route>

      {/* Candidate Routes (Protected: candidate) */}
      <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
        <Route path="/candidate" element={<CandidateLayout />}>
          <Route index element={<CandidateDashboard />} />
          <Route path="applied" element={<AppliedJobs />} />
          <Route path="profile" element={<CandidateProfile />} />
          <Route path="notifications" element={<CandidateNotifications />} />
        </Route>
        {/* Standalone Job Details Page (No Sidebar Layout) */}
        <Route path="/candidate/jobs/:id" element={<JobDetails />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="candidates" element={<Candidates />} />
        <Route path="hr-team" element={<Users />} />
        <Route path="interviews" element={<Interviews />} />
        <Route path="companies" element={<Companies />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
        <Route path="demo" element={<DemoRequests />} />
        <Route path="demo-requests" element={<DemoRequests />} />
        <Route path="users" element={<Users />} />
      </Route>
    </Routes>
  );
};

export default App;