const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");
const userRoutes = require("./routes/users");
const scorerRoutes = require("./routes/scorer");
const trackerRoutes = require("./routes/tracker");
const experienceRoutes = require("./routes/experiences");
const readinessRoutes = require("./routes/readiness");
const { seedJobsIfEmpty } = require("./scripts/seed");

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:8080",
  "https://hireable-webapp.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);
app.use("/api/scorer", scorerRoutes);
app.use("/api/tracker", trackerRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/readiness", readinessRoutes);

async function startServer() {
  await connectDB();
  await seedJobsIfEmpty();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
