const mongoose = require("mongoose");
require("dotenv").config();

const Experience = require("../models/Experience");
const Job = require("../models/Job");
const TrackerApplication = require("../models/TrackerApplication");
const Application = require("../models/Application");

async function createIndexes() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required to create indexes.");
  }

  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });

  // Index field order matters. MongoDB's ESR rule means equality filters should
  // come first, followed by sort fields, then range fields when a query mixes
  // these patterns. The pagination indexes below put the filter prefix before
  // createdAt/updatedAt + _id so cursor scans can use IXSCAN instead of COLLSCAN.
  await Promise.all([
    Experience.collection.createIndex(
      { createdAt: -1, _id: -1 },
      { name: "experiences_createdAt_id_cursor" },
    ),
    Experience.collection.createIndex(
      { companyName: 1, createdAt: -1, _id: -1 },
      { name: "experiences_company_createdAt_id" },
    ),
    Experience.collection.createIndex(
      { outcome: 1, year: 1, createdAt: -1, _id: -1 },
      { name: "experiences_outcome_year_createdAt_id" },
    ),
    Experience.collection.createIndex(
      { topicsAsked: 1, createdAt: -1, _id: -1 },
      { name: "experiences_topic_createdAt_id" },
    ),

    Job.collection.createIndex(
      { isActive: 1, createdAt: -1, _id: -1 },
      { name: "jobs_active_createdAt_id_cursor" },
    ),
    Job.collection.createIndex(
      { isActive: 1, driveType: 1, difficulty: 1, expectedDriveMonth: 1, createdAt: -1, _id: -1 },
      { name: "jobs_active_drive_difficulty_month_createdAt_id" },
    ),
    Job.collection.createIndex(
      { isActive: 1, topicsAsked: 1, createdAt: -1, _id: -1 },
      { name: "jobs_active_topic_createdAt_id" },
    ),
    Job.collection.createIndex(
      { isActive: 1, eligibleBranches: 1, createdAt: -1, _id: -1 },
      { name: "jobs_active_branch_createdAt_id" },
    ),
    Job.collection.createIndex(
      { isActive: 1, createdAt: -1, _id: -1, minCGPA: 1 },
      { name: "jobs_active_createdAt_id_cgpa" },
    ),

    TrackerApplication.collection.createIndex(
      { userId: 1, updatedAt: -1, _id: -1 },
      { name: "tracker_user_updatedAt_id_cursor" },
    ),
    TrackerApplication.collection.createIndex(
      { userId: 1, currentStage: 1, updatedAt: -1, _id: -1 },
      { name: "tracker_user_stage_updatedAt_id" },
    ),

    Application.collection.createIndex(
      { user: 1, appliedAt: -1, _id: -1 },
      { name: "applications_user_appliedAt_id" },
    ),
  ]);

  console.log("MongoDB pagination/filter indexes are ready.");
}

createIndexes()
  .catch((error) => {
    console.error("Failed to create indexes:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
