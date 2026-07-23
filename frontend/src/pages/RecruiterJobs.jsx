import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyJobs, deleteJob } from "../services/jobService";
import Loading from "../components/ui/Loading";

const RecruiterJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        const data = await getMyJobs();
        setJobs(data);
      } catch (err) {
        setError("Unable to load jobs. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job posting?")) return;
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((job) => job._id !== id));
    } catch (err) {
      setError("Unable to delete job.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">My Posted Jobs</h1>
          <p className="mt-2 text-slate-600">Manage your listings, edit content, and review applicants.</p>
        </div>
        <button onClick={() => navigate("/recruiter/post-job")} className="rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-800">
          Post a new job
        </button>
      </div>
      {loading ? (
        <Loading />
      ) : error ? (
        <div className="rounded-xl bg-red-50 p-6 text-red-700 shadow-sm">{error}</div>
      ) : jobs.length === 0 ? (
        <div className="rounded-xl bg-white p-6 shadow-sm text-slate-700">You have not posted any jobs yet.</div>
      ) : (
        jobs.map((job) => (
          <div key={job._id} className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{job.title}</h2>
                <p className="text-sm text-slate-600">{job.company} • {job.location}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{job.jobType}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
              <span>{job.experience} experience</span>
              <span>Salary: {job.salary}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to={`/jobs/${job._id}`} className="rounded-xl bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800">
                View
              </Link>
              <Link to={`/recruiter/jobs/${job._id}/edit`} className="rounded-xl border border-slate-200 px-4 py-2 text-slate-900 transition hover:bg-slate-50">
                Edit
              </Link>
              <Link to={`/recruiter/jobs/${job._id}/applicants`} className="rounded-xl border border-slate-200 px-4 py-2 text-slate-900 transition hover:bg-slate-50">
                Applicants
              </Link>
              <button onClick={() => handleDelete(job._id)} className="rounded-xl bg-red-600 px-4 py-2 text-white transition hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RecruiterJobs;
