import { Branch, Job, StudentProfile } from "@/lib/api";

export const BRANCH_OPTIONS: Branch[] = ["CS", "EE", "ECE", "ME", "CE", "Other"];
export const YEAR_OPTIONS = [2, 3, 4];
export const PROJECT_COUNT_OPTIONS = [1, 2, 3, 4];
export const SYSTEM_DESIGN_OPTIONS = ["none", "basic", "comfortable"] as const;
export const TRACKER_STAGES = [
  "Applied",
  "OA",
  "Tech Round 1",
  "Tech Round 2",
  "HR",
  "Offer",
  "Rejected",
];

export const SKILL_OPTIONS = [
  "React",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "Python",
  "Java",
  "C++",
  "REST API",
  "Docker",
  "AWS",
  "Git",
  "Tailwind",
  "SQL",
  "DBMS",
  "OS",
  "System Design",
  "DSA",
];

export const TOPIC_OPTIONS = [
  "Arrays",
  "Strings",
  "Trees",
  "Graphs",
  "DP",
  "Greedy",
  "Linked List",
  "OS",
  "DBMS",
  "CN",
  "System Design",
  "OOP",
  "SQL",
  "React",
  "Node.js",
];

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export function getScoreTone(score: number) {
  if (score >= 75) {
    return {
      ring: "stroke-emerald-400",
      text: "text-emerald-300",
      badge: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    };
  }
  if (score >= 50) {
    return {
      ring: "stroke-amber-400",
      text: "text-amber-300",
      badge: "bg-amber-500/15 text-amber-300 border-amber-400/30",
    };
  }
  return {
    ring: "stroke-rose-400",
    text: "text-rose-300",
    badge: "bg-rose-500/15 text-rose-300 border-rose-400/30",
  };
}

export function getEligibility(job: Job, profile?: StudentProfile | null) {
  if (!profile) {
    return {
      eligible: false,
      reason: "Set up your profile to see eligibility",
      tone: "neutral",
    };
  }

  const branchEligible =
    job.allowsAllBranches ||
    !job.eligibleBranches?.length ||
    job.eligibleBranches.includes(profile.branch);
  const cgpaEligible = profile.cgpa >= (job.minCGPA || 0);

  if (branchEligible && cgpaEligible) {
    return {
      eligible: true,
      reason: "You are eligible",
      tone: "success",
    };
  }

  if (!branchEligible) {
    return {
      eligible: false,
      reason: "Branch not eligible",
      tone: "danger",
    };
  }

  return {
    eligible: false,
    reason: "CGPA below cutoff",
    tone: "warning",
  };
}

export function formatShortDate(dateString?: string | null) {
  if (!dateString) {
    return "TBD";
  }
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }
  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
}
