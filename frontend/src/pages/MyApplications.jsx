import { useEffect, useState } from "react";
import { getMyApplications } from "../services/applicationService";
import Loading from "../components/ui/Loading";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadApplications = async () => {
      setLoading(true);
      try {
        const data = await getMyApplications();
        setApplications(data);
      } catch (error) {
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    loadApplications();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">My Applications</h1>
      {applications.length === 0 ? (
        <div className="rounded-xl bg-white p-6 shadow-sm text-slate-700">You have not applied to any jobs yet.</div>
      ) : (
        applications.map((application) => (
          <div key={application._id} className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">{application.job.title}</h2>
            <p className="text-sm text-slate-600">{application.job.company} • {application.job.location}</p>
            <p className="mt-3 text-slate-700">Status: <span className="font-semibold">{application.status}</span></p>
            <p className="mt-2 text-slate-600">Applied on: {new Date(application.appliedAt).toLocaleDateString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default MyApplications;
