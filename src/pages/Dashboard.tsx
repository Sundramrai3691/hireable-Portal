import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Building2, FileSearch, Flame, Kanban, MessageSquare, PenSquare, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { apiClient, Experience, Job, TrackerEntry } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { formatShortDate, getEligibility, getInitials } from "@/lib/placemate";
import ScoreRing from "@/components/ScoreRing";
import EmptyState from "@/components/EmptyState";
import CompanyLogo from "@/components/CompanyLogo";

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [tracker, setTracker] = useState<TrackerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      refreshUser(),
      apiClient.getJobs(),
      apiClient.getExperiences(),
      apiClient.getTracker(),
    ])
      .then(([, jobsData, experienceData, trackerData]) => {
        if (!mounted) return;
        setJobs(jobsData);
        setExperiences(experienceData.slice(0, 4));
        setTracker(trackerData.slice(0, 4));
      })
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
  }, [refreshUser]);

  const profile = user?.studentProfile;
  const eligibleJobs = useMemo(
    () => jobs.filter((job) => getEligibility(job, profile).eligible).slice(0, 4),
    [jobs, profile],
  );
  const readinessScore = user?.readinessScore ?? 0;

  if (isLoading) {
    return <div className="px-4 py-16 text-center text-slate-300">Loading your placement command center...</div>;
  }

  return (
    <div className="px-4 py-10">
      <div className="container mx-auto">
        <div className="mb-10">
          <p className="pill">Your placement command center</p>
          <h1 className="mt-4 text-4xl font-bold text-white">Welcome back, {user?.name.split(" ")[0]}</h1>
          <p className="mt-3 text-lg text-slate-400">Keep momentum up. The next few placement decisions are easier when the signal is all in one place.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[320px,1fr,280px]">
          <aside className="card p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-lg font-semibold text-white">
                {getInitials(user?.name || "PM")}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{user?.name}</h2>
                <p className="text-sm text-slate-400">{profile?.college}</p>
                <div className="mt-2 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                  {profile?.branch} | Year {profile?.year} | CGPA {profile?.cgpa}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <ScoreRing score={readinessScore} label="Readiness" subtext="Last updated today" />
              <p className="mt-3 text-center text-sm text-slate-400">Placement Readiness</p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">LC rating</p>
                <p className="mt-2 font-mono text-xl text-white">{profile?.leetcodeRating || "--"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Problems</p>
                <p className="mt-2 font-mono text-xl text-white">{profile?.problemsSolved || 0}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Skills</p>
                <p className="mt-2 font-mono text-xl text-white">{profile?.skills.length || 0}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Projects</p>
                <p className="mt-2 font-mono text-xl text-white">{profile?.projectCount || 0}</p>
              </div>
            </div>

            <Link to="/profile/setup" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-300 transition hover:text-blue-200">
              <PenSquare className="h-4 w-4" />
              Update Profile
            </Link>
          </aside>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">Your Placement Feed</h2>
              <div className="pill">Personalized</div>
            </div>

            {eligibleJobs.length || experiences.length || tracker.length ? (
              <>
                <div className="card p-6">
                  <div className="mb-4 flex items-center gap-2 text-white">
                    <Building2 className="h-4 w-4 text-blue-300" />
                    Upcoming drives for your profile
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {eligibleJobs.map((job, index) => (
                      <div key={job.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 animate-fadeUp" style={{ animationDelay: `${index * 0.08}s` }}>
                        <div className="flex items-center gap-3">
                          <CompanyLogo name={job.company} logoUrl={job.companyLogo} />
                          <div>
                            <h3 className="font-semibold text-white">{job.company}</h3>
                            <p className="text-sm text-slate-400">{job.title}</p>
                          </div>
                        </div>
                        <p className="mt-4 text-sm text-slate-300">
                          {job.expectedDriveMonth || "Drive date soon"} | {job.ctcRange?.min}-{job.ctcRange?.max} LPA
                        </p>
                        <p className="mt-2 text-sm text-slate-400">Topics: {job.topicsAsked.slice(0, 4).join(", ")}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="card p-6">
                    <div className="mb-4 flex items-center gap-2 text-white">
                      <MessageSquare className="h-4 w-4 text-violet-300" />
                      Recent experiences added
                    </div>
                    <div className="space-y-4">
                      {experiences.slice(0, 3).map((experience) => (
                        <div key={experience.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <p className="font-medium text-white">{experience.companyName} - {experience.role}</p>
                          <p className="mt-1 text-sm text-slate-400">{experience.branch}, {experience.college}</p>
                          <p className="mt-3 text-sm text-slate-300">{experience.tips}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card p-6">
                    <div className="mb-4 flex items-center gap-2 text-white">
                      <Kanban className="h-4 w-4 text-amber-300" />
                      Recent application updates
                    </div>
                    <div className="space-y-4">
                      {tracker.length ? tracker.map((entry) => (
                        <div key={entry.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-white">{entry.companyName}</p>
                            <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-200">{entry.currentStage}</span>
                          </div>
                          <p className="mt-2 text-sm text-slate-400">{entry.role}</p>
                          <p className="mt-3 text-sm text-slate-300">Next: {entry.nextAction || "No next action set"}</p>
                        </div>
                      )) : (
                        <p className="text-sm text-slate-400">Start your tracker to see stage changes here.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-center gap-2 text-white">
                    <Sparkles className="h-4 w-4 text-blue-300" />
                    Suggested next action
                  </div>
                  <p className="mt-3 text-lg text-slate-200">
                    {readinessScore < 70
                      ? "Your score has room to grow. Run the readiness diagnostic and identify the biggest gap before the next drive window."
                      : `You have solid momentum. You still have not scored your resume against ${eligibleJobs[0]?.company || "your target company's"} JD yet.`}
                  </p>
                </div>
              </>
            ) : (
              <EmptyState
                icon={Flame}
                title="Set up your profile to unlock personalized insights"
                description="Once your profile is complete, PlaceMate will show eligible drives, experience recommendations, and tracker activity."
                ctaHref="/profile/setup"
                ctaLabel="Finish profile setup"
              />
            )}
          </section>

          <aside className="card h-fit p-6">
            <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
            <div className="mt-4 space-y-3">
              {[
                { href: "/scorer", label: "Score Resume against a JD", icon: FileSearch },
                { href: "/companies", label: "Browse eligible companies", icon: Building2 },
                { href: "/tracker", label: "Update application status", icon: Kanban },
                { href: "/experiences", label: "Read recent experiences", icon: MessageSquare },
                { href: "/readiness", label: "Check readiness score", icon: Sparkles },
              ].map((action) => (
                <Link
                  key={action.href}
                  to={action.href}
                  className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 transition hover:border-blue-400/30 hover:bg-blue-500/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/60 text-blue-300">
                      <action.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm text-slate-200">{action.label}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-500 transition group-hover:text-blue-300" />
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
