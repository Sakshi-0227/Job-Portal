import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getJobs } from "../services/jobService";
import Loading from "../components/ui/Loading";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setLocation(searchParams.get("location") || "");
    setJobType(searchParams.get("jobType") || "");
    setExperience(searchParams.get("experience") || "");
  }, [searchParams]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const filters = {
          search,
          location,
          jobType,
          experience,
        };
        const response = await getJobs(filters);
        setJobs(response);
      } catch (error) {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [search, location, jobType, experience]);

  const applyFilters = () => {
    const params = {};
    if (search) params.search = search;
    if (location) params.location = location;
    if (jobType) params.jobType = jobType;
    if (experience) params.experience = experience;
    setSearchParams(params);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Search jobs</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Job title, company or keyword"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
          />
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Location"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
          />
          <select
            value={experience}
            onChange={(event) => setExperience(event.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
          >
            <option value="">Any experience</option>
            <option value="0-1">0-1 years</option>
            <option value="1-3">1-3 years</option>
            <option value="3-5">3-5 years</option>
            <option value=">5">5+ years</option>
          </select>
          <select
            value={jobType}
            onChange={(event) => setJobType(event.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
          >
            <option value="">Any job type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
        <button
          onClick={applyFilters}
          className="mt-4 rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-800"
        >
          Apply filters
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <div className="rounded-xl bg-white p-6 text-slate-600 shadow-sm">No jobs found yet.</div>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className="rounded-xl bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{job.title}</h3>
                    <p className="text-sm text-slate-600">{job.company} • {job.location}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{job.jobType}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
                  <span>{job.experience} experience</span>
                  <span>Salary: {job.salary}</span>
                </div>
                <p className="mt-4 text-slate-700">{job.description}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link to={`/jobs/${job._id}`} className="rounded-xl bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800">
                    View details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Jobs;
