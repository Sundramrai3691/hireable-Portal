const mongoose = require("mongoose");
require("dotenv").config();

const Experience = require("../models/Experience");
const Job = require("../models/Job");
const TrackerApplication = require("../models/TrackerApplication");
const Application = require("../models/Application");

function collectStages(plan, stages = []) {
  if (!plan || typeof plan !== "object") {
    return stages;
  }
  if (plan.stage) {
    stages.push(plan.stage);
  }
  Object.values(plan).forEach((value) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => collectStages(entry, stages));
    } else if (value && typeof value === "object") {
      collectStages(value, stages);
    }
  });
  return stages;
}

async function explainQuery(label, collection, query, sort) {
  const explain = await collection.find(query).sort(sort).limit(20).explain("executionStats");
  const stages = collectStages(explain.queryPlanner.winningPlan);
  console.log(`\n${label}`);
  console.log(`winning stages: ${stages.join(" -> ")}`);
  console.log(`uses IXSCAN: ${stages.includes("IXSCAN")}`);
  console.log(`docs examined: ${explain.executionStats.totalDocsExamined}`);
  console.log(`keys examined: ${explain.executionStats.totalKeysExamined}`);
}

async function runExplains() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required to run explains.");
  }

  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });

  await explainQuery(
    "Interview experiences feed",
    Experience.collection,
    {},
    { createdAt: -1, _id: -1 },
  );

  await explainQuery(
    "Company listings feed",
    Job.collection,
    { isActive: true },
    { createdAt: -1, _id: -1 },
  );

  const trackerSample = await TrackerApplication.findOne({}).select({ userId: 1 }).lean();
  if (trackerSample) {
    await explainQuery(
      "Application tracker feed",
      TrackerApplication.collection,
      { userId: trackerSample.userId },
      { updatedAt: -1, _id: -1 },
    );
  } else {
    console.log("\nApplication tracker feed skipped: no tracker documents found.");
  }

  const applicationSample = await Application.findOne({}).select({ user: 1 }).lean();
  if (applicationSample) {
    await explainQuery(
      "User applications feed",
      Application.collection,
      { user: applicationSample.user },
      { appliedAt: -1, _id: -1 },
    );
  } else {
    console.log("\nUser applications feed skipped: no application documents found.");
  }
}

runExplains()
  .catch((error) => {
    console.error("Failed to explain paginated queries:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
