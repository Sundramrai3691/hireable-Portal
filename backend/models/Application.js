const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  applicantName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  college: {
    type: String,
    default: null,
  },
  graduationYear: {
    type: Number,
    default: null,
  },
  resumeUrl: {
    type: String,
    required: true,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

applicationSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;

    ret.user_id = ret.user;
    delete ret.user;

    ret.jobs = ret.job;
    delete ret.job;

    ret.applied_at = ret.appliedAt;
    delete ret.appliedAt;
  },
});

module.exports = mongoose.model("Application", applicationSchema);
