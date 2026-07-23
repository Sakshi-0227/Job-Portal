import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getJobById, updateJob } from "../services/jobService";
import Loading from "../components/ui/Loading";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formState, setFormState] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const loadJob = async () => {
      try {
        const job = await getJobById(id);
        setFormState({
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          experience: job.experience,
          jobType: job.jobType,
          description: job.description,
          requirements: job.requirements.join(", "),
        });
      } catch (error) {
        setFormState(null);
      }
    };
    loadJob();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus("");

    try {
      const jobData = {
        ...formState,
        requirements: formState.requirements.split(",").map((item) => item.trim()).filter(Boolean),
      };
      await updateJob(id, jobData);
      navigate(`/jobs/${id}`);
    } catch (error) {
      setStatus("Unable to update job. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!formState) return <Loading />;

  return (
    <div className="rounded-xl bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Edit job</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {[
          { label: "Job title", name: "title" },
          { label: "Company", name: "company" },
          { label: "Location", name: "location" },
          { label: "Salary", name: "salary" },
          { label: "Experience", name: "experience" },
        ].map((field) => (
          <label key={field.name} className="block">
            <span className="text-sm font-medium text-slate-700">{field.label}</span>
            <input
              name={field.name}
              type="text"
              value={formState[field.name]}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
              required
            />
          </label>
        ))}
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Job type</span>
          <select
            name="jobType"
            value={formState.jobType}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Description</span>
          <textarea
            name="description"
            value={formState.description}
            onChange={handleChange}
            rows="5"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Requirements</span>
          <p className="text-xs text-slate-500">Separate requirements with commas</p>
          <textarea
            name="requirements"
            value={formState.requirements}
            onChange={handleChange}
            rows="3"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
          />
        </label>
        {status && <p className="text-sm text-slate-700">{status}</p>}
        <button type="submit" disabled={saving} className="rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-800 disabled:opacity-70">
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
};

export default EditJob;
