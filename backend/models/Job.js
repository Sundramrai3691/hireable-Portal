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

// Transform to match frontend expectations (snake_case)
jobSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;

    // Map camelCase to snake_case for frontend compatibility
    ret.is_active = ret.isActive;
    delete ret.isActive;

    ret.posted_by = ret.postedBy;
    delete ret.postedBy;

    ret.created_at = ret.createdAt;
    delete ret.createdAt;

    // Add frontend compatibility fields
    ret.skills = ret.tags;
    ret.posted = ret.created_at;
  },
});

module.exports = mongoose.model("Job", jobSchema);
