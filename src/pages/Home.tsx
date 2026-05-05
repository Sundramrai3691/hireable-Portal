import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  FileSearch,
  Gauge,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import FAQ from "@/components/FAQ";
import { useAuth } from "@/contexts/AuthContext";

const stats = [
  { value: "1,200+", label: "Problems tracked by users" },
  { value: "47", label: "Companies with drives" },
  { value: "320+", label: "Experiences from seniors" },
  { value: "2.1k", label: "Students using PlaceMate" },
];

const features = [
  {
    icon: FileSearch,
    title: "Resume-JD Scorer",
    description:
      "Paste any JD. Get a keyword match score, missing skills, and improvement tips in seconds.",
  },
  {
    icon: CheckCircle2,
    title: "Eligibility Filter",
    description:
      "See only companies you can actually sit for, filtered by your branch and CGPA.",
  },
  {
    icon: ClipboardList,
    title: "Application Tracker",
    description:
      "Track every company from OA to offer in a visual board built for placement season.",
  },
  {
    icon: MessageSquare,
    title: "Interview Experiences",
    description:
      "Read real interview experiences from seniors at your target companies.",
  },
  {
    icon: Gauge,
    title: "Readiness Score",
    description:
      "Get a placement readiness score based on DSA, projects, CGPA, and skills.",
  },
  {
    icon: CalendarClock,
    title: "Placement Timeline",
    description:
      "See upcoming drives, deadlines, and preparation milestones in one place.",
  },
];

const steps = [
  {
    title: "Set Your Profile",
    description: "Tell PlaceMate your branch, CGPA, skills, and target companies.",
  },
  {
    title: "Get Your Score",
    description: "Check readiness gaps and compare your resume to real company requirements.",
  },
  {
    title: "Track and Prepare",
    description: "Follow every company, every round, and every senior tip from one dashboard.",
  },
];

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const readinessHref = isAuthenticated && user?.profileCompleted ? "/readiness" : "/auth";

  return (
    <div className="relative overflow-hidden">
      <section className="hero-grid relative flex min-h-[calc(100vh-72px)] items-center py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_800px_600px_at_50%_38%,rgba(59,130,246,0.08),transparent_70%)]" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/8 px-4 py-2 text-sm font-medium text-blue-200">
              <Sparkles className="h-4 w-4" />
              Placement Season 2025-26 - Be Ready
            </div>

            <h1 className="mt-8 text-5xl font-extrabold leading-[1.05] text-white md:text-7xl">
              Your Placement Season,
              <br />
              <span className="gradient-text">Intelligently Managed</span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
              Resume scoring, company eligibility filtering, interview experience board,
              and application tracking - everything you need for campus placements in one place.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button variant="hero" size="xl" asChild className="min-w-56">
                <Link to={readinessHref}>
                  Check My Readiness
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild className="min-w-56">
                <Link to="/companies">Explore Companies</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card grid overflow-hidden md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={stat.label} className={`p-6 text-center ${index !== stats.length - 1 ? "stat-divider" : ""}`}>
                <p className="font-mono text-3xl font-semibold text-white">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14 max-w-2xl">
            <p className="pill">Built for campus placement stress, not generic job search</p>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">Everything a serious placement prep stack should include</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="card relative overflow-hidden p-6">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-blue-400/0 via-blue-400/70 to-blue-400/0" />
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/12 text-blue-300">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">How it works</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                {index < steps.length - 1 ? (
                  <div className="absolute left-[calc(50%+2.5rem)] right-[-3rem] top-8 hidden border-t border-dashed border-blue-400/25 md:block" />
                ) : null}
                <div className="card h-full p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(59,130,246,0.95),rgba(139,92,246,0.9))] font-mono text-lg font-semibold text-white">
                    {index + 1}
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card mx-auto max-w-5xl border-blue-400/25 p-10 text-center shadow-[0_0_40px_rgba(59,130,246,0.12)]">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Placement season starts in July.
              <br />
              Are you actually ready?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
              Most students realize gaps too late. Check your readiness now - it takes 2 minutes.
            </p>
            <Button variant="hero" size="xl" asChild className="mt-8 animate-pulseRing">
              <Link to={readinessHref}>
                Get My Readiness Score
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <FAQ />
    </div>
  );
}
