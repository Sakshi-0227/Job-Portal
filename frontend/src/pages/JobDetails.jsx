import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getJobById } from "../services/jobService";
import { applyToJob } from "../services/applicationService";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/ui/Loading";

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      setLoading(true);
      try {
        const data = await getJobById(id);
        setJob(data);
      } catch (error) {
        setJob(null);
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [id]);

  const handleApply = async (event) => {
    event.preventDefault();
    if (!user || user.role !== "candidate") {
      setStatus("Please login as a candidate to apply.");
      return;
    }

    try {
      await applyToJob(id, coverLetter, resumeUrl);
      setStatus("Application submitted successfully.");
    } catch (error) {
      setStatus(error.response?.data?.message || "Unable to apply. Please try again.");
    }
  };

  if (loading) return <Loading />;
  if (!job) return <div className="rounded-xl bg-white p-8 shadow-sm">Job not found.</div>;

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">{job.title}</h1>
            <p className="mt-2 text-slate-600">{job.company} • {job.location}</p>
          </div>
          <div className="rounded-full bg-slate-100 px-4 py-2 text-slate-700">{job.jobType}</div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">Salary: {job.salary}</div>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">Experience: {job.experience}</div>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">Posted by: {job.recruiter?.name || "Recruiter"}</div>
        </div>
        <div className="mt-6 space-y-4 text-slate-700">
          <div>
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="mt-2 whitespace-pre-line">{job.description}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Requirements</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              {job.requirements.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {user?.role === "recruiter" && user._id === job.recruiter?._id ? (
        <section className="rounded-xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Recruiter actions</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to={`/recruiter/jobs/${job._id}/edit`} className="rounded-xl bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800">
              Edit job
            </Link>
            <Link to={`/recruiter/jobs/${job._id}/applicants`} className="rounded-xl border border-slate-200 px-4 py-2 text-slate-900 transition hover:bg-slate-50">
              View applicants
            </Link>
          </div>
        </section>
      ) : user?.role === "candidate" ? (
        <section className="rounded-xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Apply for this job</h2>
          <form onSubmit={handleApply} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Cover letter</span>
              <textarea
                value={coverLetter}
                onChange={(event) => setCoverLetter(event.target.value)}
                className="mt-2 h-32 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Resume URL</span>
              <input
                type="url"
                value={resumeUrl}
                onChange={(event) => setResumeUrl(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
                placeholder="Link to your resume or profile"
              />
            </label>
            {status && <p className="text-sm text-slate-700">{status}</p>}
            <button className="rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-800">
              Submit application
            </button>
          </form>
        </section>
      ) : (
        <div className="rounded-xl bg-white p-8 text-slate-700 shadow-sm">
          Please login as a candidate to apply for this job.
        </div>
      )}
    </div>
  );
};

export default JobDetails;
