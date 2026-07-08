import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Building2, Filter, Loader2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import CompanyLogo from "@/components/CompanyLogo";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiClient, Job } from "@/lib/api";
import { BRANCH_OPTIONS, TOPIC_OPTIONS, getEligibility } from "@/lib/placemate";

const DRIVE_MONTH_OPTIONS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function Companies() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [maxCutoff, setMaxCutoff] = useState(10);
  const [driveType, setDriveType] = useState("all");
  const [month, setMonth] = useState("all");
  const [topic, setTopic] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [showOnlyEligible, setShowOnlyEligible] = useState(Boolean(user?.studentProfile));
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const loadJobs = useCallback(
    async (cursor?: string | null) => {
      if (cursor) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      try {
        const response = await apiClient.getJobs({
          limit: 20,
          cursor,
          search,
          branch: selectedBranches.join(","),
          maxCgpa: maxCutoff,
          driveType,
          month,
          topic,
          difficulty,
        });

        setJobs((prev) => {
          if (!cursor) {
            return response.data;
          }
          const existingIds = new Set(prev.map((job) => job.id));
          return [...prev, ...response.data.filter((job) => !existingIds.has(job.id))];
        });
        setNextCursor(response.nextCursor);
        setHasMore(response.hasMore);
      } catch (error) {
        toast({
          title: "Could not load company drives",
          description: error instanceof Error ? error.message : "Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [difficulty, driveType, maxCutoff, month, search, selectedBranches, toast, topic],
  );

  useEffect(() => {
    loadJobs(null);
  }, [loadJobs]);

  const months = useMemo(
    () => Array.from(new Set([...DRIVE_MONTH_OPTIONS, ...jobs.map((job) => job.expectedDriveMonth).filter(Boolean)])),
    [jobs],
  );
  const profile = user?.studentProfile;

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        !search ||
        [job.company, job.title, ...(job.topicsAsked || []), ...(job.tags || [])]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesBranches =
        !selectedBranches.length ||
        job.allowsAllBranches ||
        selectedBranches.some((branch) => job.eligibleBranches.includes(branch as Job["eligibleBranches"][number]));
      const matchesCgpa = (job.minCGPA || 0) <= maxCutoff;
      const matchesDriveType = driveType === "all" || job.driveType === driveType;
      const matchesMonth = month === "all" || job.expectedDriveMonth === month;
      const matchesTopic = topic === "all" || job.topicsAsked.includes(topic);
      const matchesDifficulty = difficulty === "all" || job.difficulty === difficulty;
      const eligibleState = getEligibility(job, profile);
      const matchesEligible = !showOnlyEligible || eligibleState.eligible;

      return (
        matchesSearch &&
        matchesBranches &&
        matchesCgpa &&
        matchesDriveType &&
        matchesMonth &&
        matchesTopic &&
        matchesDifficulty &&
        matchesEligible
      );
    });
  }, [difficulty, driveType, jobs, maxCutoff, month, profile, search, selectedBranches, showOnlyEligible, topic]);

  const addToTracker = async (job: Job) => {
    if (!isAuthenticated || !profile) {
      toast({
        title: "Login required",
        description: "Sign in and finish profile setup to add companies to your tracker.",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiClient.createTrackerEntry({
        companyId: job.id,
        companyName: job.company,
        role: job.title,
        currentStage: "Applied",
        nextAction: job.typicalRounds[0] ? `Prepare for ${job.typicalRounds[0]}` : "",
        notes: `Imported from ${job.company} drive card`,
      });
      toast({
        title: "Added to tracker",
        description: `${job.company} is now in your application board.`,
      });
    } catch (error) {
      toast({
        title: "Could not add to tracker",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="px-4 py-10">
      <div className="container mx-auto">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="pill">Drive intelligence</p>
            <h1 className="mt-4 text-4xl font-bold text-white">Company drives you can actually target</h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-400">
              Filter by branch, cutoff, drive type, and topics asked so you spend your prep time where it matters.
            </p>
          </div>
          {!isAuthenticated ? (
            <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-200">
              Sign in to unlock eligibility badges and one-click tracker actions.
            </div>
          ) : null}
        </div>

        <div className="grid gap-6 xl:grid-cols-[290px,1fr]">
          <aside className="card h-fit p-6">
            <div className="mb-5 flex items-center gap-2 text-white">
              <Filter className="h-4 w-4 text-blue-300" />
              Filters
            </div>
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Search</label>
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Oracle, DP, React..." />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Eligible branches</label>
                <div className="grid gap-2">
                  {BRANCH_OPTIONS.map((branch) => (
                    <label key={branch} className="flex items-center gap-2 text-sm text-slate-400">
                      <input
                        type="checkbox"
                        checked={selectedBranches.includes(branch)}
                        onChange={() =>
                          setSelectedBranches((prev) =>
                            prev.includes(branch) ? prev.filter((item) => item !== branch) : [...prev, branch],
                          )
                        }
                      />
                      {branch}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">CGPA cutoff up to {maxCutoff.toFixed(1)}</label>
                <input
                  type="range"
                  min="6"
                  max="10"
                  step="0.1"
                  value={maxCutoff}
                  onChange={(e) => setMaxCutoff(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Drive type</label>
                <select value={driveType} onChange={(e) => setDriveType(e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white">
                  <option value="all">All</option>
                  <option value="on-campus">On-campus</option>
                  <option value="off-campus">Off-campus</option>
                  <option value="pool">Pool</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Expected month</label>
                <select value={month} onChange={(e) => setMonth(e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white">
                  <option value="all">All</option>
                  {months.map((entry) => <option key={entry} value={entry}>{entry}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Topic</label>
                <select value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white">
                  <option value="all">All</option>
                  {TOPIC_OPTIONS.map((entry) => <option key={entry} value={entry}>{entry}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Difficulty</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white">
                  <option value="all">All</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                <input type="checkbox" checked={showOnlyEligible} onChange={(e) => setShowOnlyEligible(e.target.checked)} />
                Show only eligible
              </label>
            </div>
          </aside>

          <section>
            {isLoading ? (
              <div className="text-center text-slate-300">Loading company drives...</div>
            ) : filteredJobs.length ? (
              <>
                <div className="grid gap-6 md:grid-cols-2">
                  {filteredJobs.map((job) => {
                    const eligibility = getEligibility(job, profile);
                    return (
                      <div key={job.id} className="card p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex gap-4">
                            <CompanyLogo name={job.company} logoUrl={job.companyLogo} />
                            <div>
                              <h2 className="text-xl font-semibold text-white">{job.company}</h2>
                              <p className="text-sm text-slate-300">{job.title}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-mono text-sm text-blue-200">
                              {job.ctcRange?.min && job.ctcRange?.max ? `${job.ctcRange.min}-${job.ctcRange.max} LPA` : job.salary}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center gap-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              eligibility.tone === "success"
                                ? "border border-emerald-400/20 bg-emerald-500/12 text-emerald-200"
                                : eligibility.tone === "warning"
                                ? "border border-amber-400/20 bg-amber-500/12 text-amber-200"
                                : "border border-rose-400/20 bg-rose-500/12 text-rose-200"
                            }`}
                          >
                            {eligibility.reason}
                          </span>
                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                            {job.expectedDriveMonth || "Drive month TBD"}
                          </span>
                        </div>

                        <div className="mt-5 grid gap-3 text-sm text-slate-400">
                          <p>Branches: {job.allowsAllBranches ? "All branches" : job.eligibleBranches.join(", ")}</p>
                          <p>CGPA: {job.minCGPA}+</p>
                          <p>Rounds: {job.typicalRounds.join(" -> ")}</p>
                          <p>Topics: {job.topicsAsked.join(", ")}</p>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                          <Button variant="outline" asChild>
                            <Link to={`/experiences?company=${encodeURIComponent(job.company)}`}>View Experiences</Link>
                          </Button>
                          <Button onClick={() => addToTracker(job)}>
                            <Plus className="h-4 w-4" />
                            Add to Tracker
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {hasMore ? (
                  <div className="mt-6 flex justify-center">
                    <Button variant="outline" onClick={() => loadJobs(nextCursor)} disabled={isLoadingMore || !nextCursor}>
                      {isLoadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Load more
                    </Button>
                  </div>
                ) : null}
              </>
            ) : (
              <EmptyState
                icon={AlertCircle}
                title="No company drives match these filters"
                description="Try widening your cutoff, topic, or drive-type filters to see more opportunities."
                ctaHref="/companies"
                ctaLabel="Reset filters"
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
