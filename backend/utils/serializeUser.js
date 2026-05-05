const {
  calculateReadinessScore,
  deriveReadinessInputFromProfile,
} = require("./readiness");

function serializeUser(user) {
  const studentProfile = user.studentProfile || null;
  const derivedReadiness = studentProfile
    ? calculateReadinessScore(deriveReadinessInputFromProfile(studentProfile))
    : null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    profileCompleted: Boolean(user.profileCompleted),
    studentProfile,
    readinessScore:
      typeof user.latestReadinessScore === "number"
        ? user.latestReadinessScore
        : derivedReadiness
        ? derivedReadiness.totalScore
        : null,
    readinessLevel:
      user.latestReadinessLevel ||
      (derivedReadiness ? derivedReadiness.level.label : null),
  };
}

module.exports = { serializeUser };
