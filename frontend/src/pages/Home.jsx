import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <section className="space-y-8 rounded-xl bg-white p-8 shadow-sm">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Welcome to the Job Portal</p>
        <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">Discover jobs and hire talent with ease.</h1>
        <p className="max-w-2xl text-slate-600">
          This platform supports candidates and recruiters with profiles, job search, applications,
          and role-based dashboards.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link to="/jobs" className="rounded-xl bg-slate-900 px-6 py-4 text-center text-white transition hover:bg-slate-700">
          Browse Jobs
        </Link>
        {user ? (
          <Link to={user.role === "candidate" ? "/candidate/dashboard" : "/recruiter/dashboard"} className="rounded-xl border border-slate-200 px-6 py-4 text-center text-slate-900 transition hover:bg-slate-50">
            Open Dashboard
          </Link>
        ) : (
          <Link to="/register" className="rounded-xl border border-slate-200 px-6 py-4 text-center text-slate-900 transition hover:bg-slate-50">
            Create an Account
          </Link>
        )}
      </div>
    </section>
  );
};

export default Home;
