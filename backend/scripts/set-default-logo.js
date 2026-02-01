const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const Job = require("../models/Job");

async function run() {
  const DEFAULT_LOGO = "https://example.com/default-logo.png";

  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not set in environment");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    const result = await Job.updateMany(
      { companyLogo: { $exists: false } },
      { $set: { companyLogo: DEFAULT_LOGO } },
    );

    console.log(`✓ Updated documents: ${result.modifiedCount}`);
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
