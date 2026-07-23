import { useEffect, useState } from "react";
import { getRecruiterDashboard } from "../services/jobService";
import Loading from "../components/ui/Loading";

const RecruiterDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const data = await getRecruiterDashboard();
        setDashboard(data);
      } catch (error) {
        setDashboard(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Loading />;

  if (!dashboard) {
    return <div className="rounded-xl bg-white p-8 shadow-sm text-slate-700">Unable to load dashboard data.</div>;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Recruiter Dashboard</h1>
        <p className="mt-2 text-slate-600">Track your posted jobs and applicant status totals.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-6 text-slate-700">
            <p className="text-sm uppercase tracking-[0.2em]">Open jobs</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{dashboard.totalJobs}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-6 text-slate-700">
            <p className="text-sm uppercase tracking-[0.2em]">Applications</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{dashboard.totalApplications}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-6 text-slate-700">
            <p className="text-sm uppercase tracking-[0.2em]">Selected</p>
            <p className="mt-3 text-lg text-slate-900">{dashboard.statusCounts.Selected || 0}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RecruiterDashboard;
