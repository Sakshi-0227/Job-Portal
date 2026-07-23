import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobApplicants } from "../services/jobService";
import { updateApplicationStatus } from "../services/applicationService";
import Loading from "../components/ui/Loading";

const statusOptions = ["Applied", "Under Review", "Interview", "Rejected", "Selected"];

const ApplicantList = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadApplicants = async () => {
      setLoading(true);
      try {
        const data = await getJobApplicants(jobId);
        setJobTitle(data.job.title);
        setApplicants(data.applications);
      } catch (error) {
        setError("Unable to load applicants.");
        setApplicants([]);
      } finally {
        setLoading(false);
      }
    };
    loadApplicants();
  }, [jobId]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const updated = await updateApplicationStatus(applicationId, newStatus);
      setApplicants((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
    } catch (err) {
      setError("Unable to update status.");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Applicants for {jobTitle}</h1>
      {error && <div className="rounded-xl bg-red-50 p-4 text-red-700">{error}</div>}
      {applicants.length === 0 ? (
        <div className="rounded-xl bg-white p-6 shadow-sm text-slate-700">No applicants have applied yet.</div>
      ) : (
        applicants.map((application) => (
          <div key={application._id} className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{application.candidate.name}</h2>
                <p className="text-sm text-slate-600">{application.candidate.email}</p>
              </div>
              <select
                value={application.status}
                onChange={(event) => handleStatusChange(application._id, event.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <p className="mt-3 text-slate-700">Applied on: {new Date(application.appliedAt).toLocaleDateString()}</p>
            {application.coverLetter && (
              <div className="mt-4 rounded-xl bg-slate-50 p-4 text-slate-700">
                <h3 className="font-semibold">Cover letter</h3>
                <p>{application.coverLetter}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ApplicantList;
