const asyncHandler = require("express-async-handler");
const Application = require("../models/Application");
const Job = require("../models/Job");

const applyJob = asyncHandler(async (req, res) => {
  const { jobId, coverLetter, resumeUrl } = req.body;

  if (!jobId) {
    res.status(400);
    throw new Error("Job ID is required to apply");
  }

  const job = await Job.findById(jobId);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  const existingApplication = await Application.findOne({
    candidate: req.user._id,
    job: jobId,
  });

  if (existingApplication) {
    res.status(400);
    throw new Error("You have already applied to this job");
  }

  const application = await Application.create({
    candidate: req.user._id,
    job: jobId,
    coverLetter: coverLetter || "",
    resumeUrl: resumeUrl || "",
  });

  res.status(201).json(application);
});

const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ candidate: req.user._id })
    .populate("job")
    .sort({ appliedAt: -1 });
  res.json(applications);
});

const getJobApplications = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.recruiter.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to view applications for this job");
  }

  const applications = await Application.find({ job: job._id })
    .populate("candidate", "name email candidateProfile")
    .sort({ appliedAt: -1 });

  res.json(applications);
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const application = await Application.findById(req.params.id).populate("job");

  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  if (application.job.recruiter.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this application");
  }

  application.status = status || application.status;
  const updatedApplication = await application.save();
  res.json(updatedApplication);
});

const getCandidateDashboard = asyncHandler(async (req, res) => {
  const applications = await Application.find({ candidate: req.user._id });
  const totalApplications = applications.length;
  const statusCounts = applications.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  res.json({ totalApplications, statusCounts });
});

module.exports = {
  applyJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  getCandidateDashboard,
};
