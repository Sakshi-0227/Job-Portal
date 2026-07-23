const express = require("express");
const router = express.Router();
const {
  applyJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  getCandidateDashboard,
} = require("../controllers/applicationController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", protect, authorizeRoles("candidate"), applyJob);
router.get("/me", protect, authorizeRoles("candidate"), getMyApplications);
router.get("/me/dashboard", protect, authorizeRoles("candidate"), getCandidateDashboard);
router.get("/job/:jobId", protect, authorizeRoles("recruiter"), getJobApplications);
router.put("/:id/status", protect, authorizeRoles("recruiter"), updateApplicationStatus);

module.exports = router;
