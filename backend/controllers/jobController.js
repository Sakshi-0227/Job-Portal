const asyncHandler = require("express-async-handler");
const Job = require("../models/Job");
const Application = require("../models/Application");

const createJob = asyncHandler(async (req, res) => {
  const { title, company, location, salary, experience, jobType, description, requirements } = req.body;

  if (!title || !company || !location || !salary || !experience || !description) {
    res.status(400);
    throw new Error("Please fill all required job fields");
  }

  const parsedRequirements = Array.isArray(requirements)
    ? requirements
    : typeof requirements === "string"
    ? requirements.split(",").map((item) => item.trim()).filter(Boolean)
    : [];

  const job = await Job.create({
    title,
    company,
    location,
    salary,
    experience,
    jobType,
    description,
    requirements: parsedRequirements,
    recruiter: req.user._id,
  });

  res.status(201).json(job);
});

const getJobs = asyncHandler(async (req, res) => {
  const { search, location, salary, experience, jobType } = req.query;
  const filters = {};

  if (search) {
    filters.$or = [
      { title: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (location) filters.location = { $regex: location, $options: "i" };
  if (experience) filters.experience = experience;
  if (jobType) filters.jobType = jobType;
  if (salary) filters.salary = { $regex: salary, $options: "i" };

  const jobs = await Job.find(filters).sort({ createdAt: -1 });
  res.json(jobs);
});

const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate("recruiter", "name recruiterProfile");
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }
  res.json(job);
});

const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.recruiter.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this job");
  }

  const updates = req.body;
  if (updates.requirements && typeof updates.requirements === "string") {
    updates.requirements = updates.requirements
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  Object.assign(job, updates);
  const updatedJob = await job.save();
  res.json(updatedJob);
});

const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.recruiter.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this job");
  }

  await job.remove();
  res.json({ message: "Job removed" });
});

const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 });
  res.json(jobs);
});

const getJobApplicants = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.recruiter.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to view applicants for this job");
  }

  const applications = await Application.find({ job: job._id })
    .populate("candidate", "name email candidateProfile")
    .sort({ appliedAt: -1 });

  res.json({ job, applications });
});

const getRecruiterDashboard = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ recruiter: req.user._id });
  const totalJobs = jobs.length;
  const jobIds = jobs.map((job) => job._id);
  const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });
  const statusCounts = await Application.aggregate([
    { $match: { job: { $in: jobIds } } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  res.json({ totalJobs, totalApplications, statusCounts });
});

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
  getJobApplicants,
  getRecruiterDashboard,
};
