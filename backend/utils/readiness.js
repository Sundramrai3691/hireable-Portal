const READINESS_CONFIG = {
  dsa: {
    max: 35,
    ratingBands: [
      { min: 1800, score: 20 },
      { min: 1500, score: 14 },
      { min: 1200, score: 9 },
      { min: 0, score: 4 },
    ],
    problemsBands: [
      { min: 500, score: 15 },
      { min: 300, score: 10 },
      { min: 150, score: 6 },
      { min: 0, score: 2 },
    ],
  },
  projects: {
    max: 25,
    countBands: [
      { min: 3, score: 12 },
      { min: 2, score: 8 },
      { min: 1, score: 4 },
      { min: 0, score: 0 },
    ],
    deployedBands: [
      { min: 2, score: 8 },
      { min: 1, score: 4 },
      { min: 0, score: 0 },
    ],
    internshipScore: 5,
  },
  academics: {
    max: 20,
    cgpaBands: [
      { min: 8.5, score: 20 },
      { min: 7.5, score: 14 },
      { min: 6.5, score: 9 },
      { min: 0, score: 4 },
    ],
  },
  skills: {
    max: 20,
    skillsBands: [
      { min: 10, score: 12 },
      { min: 6, score: 8 },
      { min: 1, score: 4 },
      { min: 0, score: 0 },
    ],
    systemDesignScores: {
      none: 0,
      basic: 4,
      comfortable: 8,
    },
  },
};

function getBandScore(bands, value) {
  const normalized = Number.isFinite(Number(value)) ? Number(value) : 0;
  const band = bands.find((item) => normalized >= item.min);
  return band ? band.score : 0;
}

function getLevel(score) {
  if (score >= 80) {
    return { label: "Placement Ready", color: "emerald" };
  }
  if (score >= 60) {
    return { label: "Almost There", color: "amber" };
  }
  if (score >= 40) {
    return { label: "Needs Work", color: "amber" };
  }
  return { label: "Start Now", color: "rose" };
}

function generateActionItems(data, breakdown) {
  const high = [];
  const medium = [];

  if (breakdown.dsa.score < 20) {
    high.push("Solve 50 more DSA problems with focus on graphs and DP.");
  }
  if ((data.systemDesign || "none") === "none") {
    high.push("Start basic system design prep for common interview questions.");
  }
  if ((data.deployedCount || 0) < Math.min(2, data.projectCount || 0)) {
    medium.push("Deploy more of your projects so recruiters can verify them quickly.");
  }
  if ((data.skillsCount || 0) < 6) {
    medium.push("Add 2-3 stronger core skills to your profile and resume.");
  }
  if ((data.cgpa || 0) < 7.5) {
    medium.push("Prioritize companies with flexible CGPA criteria and strengthen DSA to offset academics.");
  }
  if (!(data.hasInternship || false)) {
    medium.push("Add one internship-style project or open source contribution to show applied work.");
  }

  return [
    {
      priority: "High Priority",
      items: high.length ? high : ["Keep your DSA and interview prep consistent every week."],
    },
    {
      priority: "Medium Priority",
      items: medium.length ? medium : ["Continue refining projects and resume bullet quality."],
    },
  ];
}

function calculateReadinessScore(data) {
  const dsaScore = Math.min(
    READINESS_CONFIG.dsa.max,
    getBandScore(READINESS_CONFIG.dsa.ratingBands, data.leetcodeRating) +
      getBandScore(READINESS_CONFIG.dsa.problemsBands, data.problemsSolved),
  );

  const projectScore = Math.min(
    READINESS_CONFIG.projects.max,
    getBandScore(READINESS_CONFIG.projects.countBands, data.projectCount) +
      getBandScore(READINESS_CONFIG.projects.deployedBands, data.deployedCount) +
      (data.hasInternship ? READINESS_CONFIG.projects.internshipScore : 0),
  );

  const acadScore = Math.min(
    READINESS_CONFIG.academics.max,
    getBandScore(READINESS_CONFIG.academics.cgpaBands, data.cgpa),
  );

  const skillScore = Math.min(
    READINESS_CONFIG.skills.max,
    getBandScore(READINESS_CONFIG.skills.skillsBands, data.skillsCount) +
      (READINESS_CONFIG.skills.systemDesignScores[data.systemDesign || "none"] || 0),
  );

  const totalScore = dsaScore + projectScore + acadScore + skillScore;
  const breakdown = {
    dsa: { score: dsaScore, max: READINESS_CONFIG.dsa.max },
    projects: { score: projectScore, max: READINESS_CONFIG.projects.max },
    academics: { score: acadScore, max: READINESS_CONFIG.academics.max },
    skills: { score: skillScore, max: READINESS_CONFIG.skills.max },
  };

  return {
    totalScore,
    breakdown,
    actions: generateActionItems(data, breakdown),
    level: getLevel(totalScore),
  };
}

function deriveReadinessInputFromProfile(profile = {}) {
  return {
    leetcodeRating: Number(profile.leetcodeRating || 0),
    problemsSolved: Number(profile.problemsSolved || 0),
    projectCount: Number(profile.projectCount || 0),
    deployedCount: Number(profile.deployedProjectCount || 0),
    hasInternship: Boolean(profile.hasInternship),
    cgpa: Number(profile.cgpa || 0),
    skillsCount: Array.isArray(profile.skills) ? profile.skills.length : 0,
    systemDesign: profile.systemDesign || "none",
    targetCompanies: Array.isArray(profile.targetCompanies) ? profile.targetCompanies : [],
    branch: profile.branch || "Other",
  };
}

function buildCompanyFits(companies = [], data = {}) {
  return companies.slice(0, 5).map((company) => {
    const branchEligible =
      company.allowsAllBranches ||
      !Array.isArray(company.eligibleBranches) ||
      company.eligibleBranches.length === 0 ||
      company.eligibleBranches.includes(data.branch);
    const cgpaEligible = Number(data.cgpa || 0) >= Number(company.minCGPA || 0);
    let matchScore = Math.round(data.totalScore || 0);

    if (!branchEligible) {
      matchScore = Math.max(25, matchScore - 30);
    }
    if (!cgpaEligible) {
      matchScore = Math.max(35, matchScore - 15);
    }
    if (Array.isArray(company.topicsAsked) && company.topicsAsked.includes("System Design") && data.systemDesign === "none") {
      matchScore = Math.max(30, matchScore - 10);
    }

    let status = "Strong fit";
    if (!branchEligible) {
      status = "Branch not eligible";
    } else if (!cgpaEligible || matchScore < 70) {
      status = "Borderline";
    }

    return {
      company: company.company,
      role: company.title,
      matchScore,
      eligible: branchEligible && cgpaEligible,
      status,
      reasons: [
        branchEligible ? "Branch eligible" : "Branch restriction applies",
        cgpaEligible ? "CGPA cutoff met" : `Needs ${company.minCGPA}+ CGPA`,
      ],
    };
  });
}

module.exports = {
  READINESS_CONFIG,
  calculateReadinessScore,
  deriveReadinessInputFromProfile,
  buildCompanyFits,
  getLevel,
};
