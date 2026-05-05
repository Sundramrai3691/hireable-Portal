const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");
const Job = require("./models/Job");
const Application = require("./models/Application");

async function testDatabase() {
  console.log("Testing database connection...\n");

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    console.log("\n1. Creating test user...");
    const testUser = new User({
      email: `test_${Date.now()}@example.com`,
      passwordHash: "dummyhash123",
      name: "Test User",
      role: "candidate",
    });
    await testUser.save();
    console.log("   User created:", testUser.id);

    console.log("\n2. Creating test job...");
    const testJob = new Job({
      title: "Test Software Engineer",
      company: "Test Corp",
      location: "Remote",
      postedBy: testUser.id,
      description: "A test job description",
      tags: ["test", "nodejs"],
      eligibleBranches: ["CS"],
      minCGPA: 7,
      typicalRounds: ["OA", "HR"],
      ctcRange: { min: 8, max: 10 },
      driveType: "on-campus",
      expectedDriveMonth: "July 2025",
      topicsAsked: ["Arrays", "OS"],
      difficulty: "Medium",
    });
    await testJob.save();
    console.log("   Job created:", testJob.id);

    console.log("\n3. Creating test application...");
    const testApp = new Application({
      user: testUser.id,
      job: testJob.id,
      applicantName: "Test User",
      phone: "9999999999",
      college: "Test Institute",
      graduationYear: 2026,
      resumeUrl: "https://example.com/resume.pdf",
    });
    await testApp.save();
    console.log("   Application created:", testApp.id);

    console.log("\nCleaning up test data...");
    await Application.findByIdAndDelete(testApp.id);
    await Job.findByIdAndDelete(testJob.id);
    await User.findByIdAndDelete(testUser.id);
    console.log("Cleanup complete");
  } catch (error) {
    console.error("\nTest failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("\nDatabase connection closed");
  }
}

testDatabase().catch(console.error);
