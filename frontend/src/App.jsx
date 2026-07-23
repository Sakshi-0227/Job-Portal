import { Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import CandidateDashboard from "./pages/CandidateDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import RecruiterJobs from "./pages/RecruiterJobs";
import Profile from "./pages/Profile";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";
import MyApplications from "./pages/MyApplications";
import ApplicantList from "./pages/ApplicantList";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />

          <Route path="/candidate/dashboard" element={<ProtectedRoute allowedRoles={["candidate"]}><CandidateDashboard /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute allowedRoles={["candidate"]}><MyApplications /></ProtectedRoute>} />

          <Route path="/recruiter/dashboard" element={<ProtectedRoute allowedRoles={["recruiter"]}><RecruiterDashboard /></ProtectedRoute>} />
          <Route path="/recruiter/jobs" element={<ProtectedRoute allowedRoles={["recruiter"]}><RecruiterJobs /></ProtectedRoute>} />
          <Route path="/recruiter/post-job" element={<ProtectedRoute allowedRoles={["recruiter"]}><CreateJob /></ProtectedRoute>} />
          <Route path="/recruiter/jobs/:id/edit" element={<ProtectedRoute allowedRoles={["recruiter"]}><EditJob /></ProtectedRoute>} />
          <Route path="/recruiter/jobs/:jobId/applicants" element={<ProtectedRoute allowedRoles={["recruiter"]}><ApplicantList /></ProtectedRoute>} />

          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
