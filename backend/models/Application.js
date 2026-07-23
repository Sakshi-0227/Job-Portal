const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Job",
    },
    status: {
      type: String,
      enum: ["Applied", "Under Review", "Interview", "Rejected", "Selected"],
      default: "Applied",
    },
    coverLetter: {
      type: String,
      default: "",
    },
    resumeUrl: {
      type: String,
      default: "",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);
