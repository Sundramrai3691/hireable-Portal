const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    college: {
      type: String,
      default: "",
    },
    branch: {
      type: String,
      enum: ["CS", "EE", "ECE", "ME", "CE", "Other"],
      default: "Other",
    },
    year: {
      type: Number,
      enum: [2, 3, 4],
      default: 3,
    },
    cgpa: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    leetcodeRating: {
      type: Number,
      default: null,
    },
    problemsSolved: {
      type: Number,
      default: 0,
    },
    skills: {
      type: [String],
      default: [],
    },
    projectCount: {
      type: Number,
      default: 0,
    },
    deployedProjectCount: {
      type: Number,
      default: 0,
    },
    hasInternship: {
      type: Boolean,
      default: false,
    },
    openSourceContributions: {
      type: Boolean,
      default: false,
    },
    systemDesign: {
      type: String,
      enum: ["none", "basic", "comfortable"],
      default: "none",
    },
    comfortableTopics: {
      type: [String],
      default: [],
    },
    weakTopics: {
      type: [String],
      default: [],
    },
    targetCompanies: {
      type: [String],
      default: [],
    },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "candidate",
  },
  profileCompleted: {
    type: Boolean,
    default: false,
  },
  studentProfile: {
    type: studentProfileSchema,
    default: null,
  },
  latestReadinessScore: {
    type: Number,
    default: null,
  },
  latestReadinessLevel: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.passwordHash;
  },
});

module.exports = mongoose.model("User", userSchema);
