import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../services/jobService";

const CreateJob = () => {
  const [formState, setFormState] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    experience: "",
    jobType: "Full-time",
    description: "",
    requirements: "",
  });
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

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
      const job = await createJob(jobData);
      navigate(`/jobs/${job._id}`);
    } catch (error) {
      setStatus("Unable to create job. Please check your input.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Post a new job</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {[
          { label: "Job title", name: "title", type: "text" },
          { label: "Company", name: "company", type: "text" },
          { label: "Location", name: "location", type: "text" },
          { label: "Salary", name: "salary", type: "text" },
          { label: "Experience", name: "experience", type: "text" },
        ].map((field) => (
          <label key={field.name} className="block">
            <span className="text-sm font-medium text-slate-700">{field.label}</span>
            <input
              name={field.name}
              type={field.type}
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
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-800 disabled:opacity-70"
        >
          {saving ? "Saving job..." : "Post job"}
        </button>
      </form>
    </div>
  );
};

export default CreateJob;
