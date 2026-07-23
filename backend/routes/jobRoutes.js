const express = require("express");
const router = express.Router();
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
  getJobApplicants,
  getRecruiterDashboard,
} = require("../controllers/jobController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/", getJobs);
router.get("/recruiter/my-jobs", protect, authorizeRoles("recruiter"), getMyJobs);
router.get("/recruiter/dashboard", protect, authorizeRoles("recruiter"), getRecruiterDashboard);
router.post("/", protect, authorizeRoles("recruiter"), createJob);
router.get("/:id/applicants", protect, authorizeRoles("recruiter"), getJobApplicants);
router.get("/:id", getJobById);
router.put("/:id", protect, authorizeRoles("recruiter"), updateJob);
router.delete("/:id", protect, authorizeRoles("recruiter"), deleteJob);

module.exports = router;
