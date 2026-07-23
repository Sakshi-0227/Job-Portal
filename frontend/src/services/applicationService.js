import api from "./api";

export const applyToJob = async (jobId, coverLetter, resumeUrl) => {
  const response = await api.post("/applications", {
    jobId,
    coverLetter,
    resumeUrl,
  });
  return response.data;
};

export const getMyApplications = async () => {
  const response = await api.get("/applications/me");
  return response.data;
};

export const getCandidateDashboard = async () => {
  const response = await api.get("/applications/me/dashboard");
  return response.data;
};

export const updateApplicationStatus = async (id, status) => {
  const response = await api.put(`/applications/${id}/status`, { status });
  return response.data;
};
