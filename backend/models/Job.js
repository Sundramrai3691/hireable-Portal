const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  companyLogo: {
    type: String,
    default: null,
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "Full-time",
  },
  salary: {
    type: String,
    default: "Not specified",
  },
  description: {
    type: String,
    default: "",
  },
  tags: {
    type: [String],
    default: [],
  },
  eligibleBranches: {
    type: [String],
    default: [],
  },
  minCGPA: {
    type: Number,
    default: 0,
  },
  typicalRounds: {
    type: [String],
    default: [],
  },
  ctcRange: {
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 0,
    },
  },
  driveType: {
    type: String,
    enum: ["on-campus", "off-campus", "pool"],
    default: "on-campus",
  },
  expectedDriveMonth: {
    type: String,
    default: "",
  },
  allowsAllBranches: {
    type: Boolean,
    default: false,
  },
  hasBond: {
    type: Boolean,
    default: false,
  },
  bondDetails: {
    type: String,
    default: "",
  },
  historicallyVisited: {
    type: Boolean,
    default: true,
  },
  topicsAsked: {
    type: [String],
    default: [],
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Medium",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

jobSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;

    ret.is_active = ret.isActive;
    delete ret.isActive;

    ret.posted_by = ret.postedBy;
    delete ret.postedBy;

    ret.created_at = ret.createdAt;
    delete ret.createdAt;

    ret.skills = ret.tags;
    ret.posted = ret.created_at;

    if (!ret.ctcRange) {
      ret.ctcRange = { min: 0, max: 0 };
    }
  },
});

module.exports = mongoose.model("Job", jobSchema);
