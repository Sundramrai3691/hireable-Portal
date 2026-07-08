import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, Plus, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import EmptyState from "@/components/EmptyState";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiClient, Experience } from "@/lib/api";
import { TOPIC_OPTIONS } from "@/lib/placemate";

export default function Experiences() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [open, setOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get("company") || "",
    role: "",
    year: "",
    outcome: "",
    topic: "",
  });
  const [form, setForm] = useState({
    companyName: searchParams.get("company") || "",
    role: "",
    year: new Date().getFullYear(),
    month: "July",
    branch: user?.studentProfile?.branch || "CS",
    college: user?.studentProfile?.college || "",
    outcome: "offer",
    rounds: [{ roundType: "OA", description: "", duration: "" }],
    topicsAsked: [] as string[],
    tips: "",
    isAnonymous: true,
  });

  const loadExperiences = useCallback(
    async (cursor?: string | null) => {
      if (cursor) {
        setIsLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await apiClient.getExperiences({
          limit: 20,
          cursor,
          search: filters.search,
          role: filters.role,
          year: filters.year,
          outcome: filters.outcome,
          topic: filters.topic,
        });

        setExperiences((prev) => {
          if (!cursor) {
            return response.data;
          }
          const existingIds = new Set(prev.map((item) => item.id));
          return [...prev, ...response.data.filter((item) => !existingIds.has(item.id))];
        });
        setNextCursor(response.nextCursor);
        setHasMore(response.hasMore);
      } catch (error) {
        toast({
          title: "Could not load experiences",
          description: error instanceof Error ? error.message : "Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    },
    [filters, toast],
  );

  useEffect(() => {
    loadExperiences(null);
  }, [loadExperiences]);

  const submitExperience = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Sign in before submitting an interview experience.",
        variant: "destructive",
      });
      return;
    }

    setFormLoading(true);
    try {
      const created = await apiClient.createExperience(form);
      setExperiences((prev) => [created, ...prev]);
      setOpen(false);
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const upvote = async (id: string) => {
    try {
      const updated = await apiClient.upvoteExperience(id);
      setExperiences((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (error) {
      toast({
        title: "Could not upvote",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="px-4 py-10">
      <div className="container mx-auto">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="pill">Senior knowledge, organized</p>
            <h1 className="mt-4 text-4xl font-bold text-white">Interview experiences</h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-400">
              Read what seniors actually faced in OAs, technical rounds, and HR before you walk into the same process.
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                Submit Experience
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-slate-950">
              <DialogHeader>
                <DialogTitle className="text-white">Submit interview experience</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Month</Label>
                    <Input value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Branch</Label>
                    <Input value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>College</Label>
                    <Input value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Outcome</Label>
                  <div className="flex gap-3">
                    {["offer", "reject", "pending"].map((outcome) => (
                      <Button key={outcome} type="button" variant={form.outcome === outcome ? "default" : "outline"} onClick={() => setForm({ ...form, outcome })}>
                        {outcome}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Rounds</Label>
                  {form.rounds.map((round, index) => (
                    <div key={`${round.roundType}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="grid gap-3 md:grid-cols-2">
                        <Input value={round.roundType} onChange={(e) => setForm({ ...form, rounds: form.rounds.map((item, itemIndex) => itemIndex === index ? { ...item, roundType: e.target.value } : item) })} placeholder="Round type" />
                        <Input value={round.duration} onChange={(e) => setForm({ ...form, rounds: form.rounds.map((item, itemIndex) => itemIndex === index ? { ...item, duration: e.target.value } : item) })} placeholder="Duration" />
                      </div>
                      <Textarea className="mt-3" value={round.description} onChange={(e) => setForm({ ...form, rounds: form.rounds.map((item, itemIndex) => itemIndex === index ? { ...item, description: e.target.value } : item) })} placeholder="Describe what happened in this round" />
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => setForm({ ...form, rounds: [...form.rounds, { roundType: "Technical", description: "", duration: "" }] })}>
                    Add Round
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Topics Asked</Label>
                  <div className="flex flex-wrap gap-2">
                    {TOPIC_OPTIONS.map((topic) => (
                      <Button
                        key={topic}
                        type="button"
                        variant={form.topicsAsked.includes(topic) ? "default" : "outline"}
                        className="rounded-full"
                        onClick={() =>
                          setForm({
                            ...form,
                            topicsAsked: form.topicsAsked.includes(topic)
                              ? form.topicsAsked.filter((item) => item !== topic)
                              : [...form.topicsAsked, topic],
                          })
                        }
                      >
                        {topic}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tips for future candidates</Label>
                  <Textarea value={form.tips} onChange={(e) => setForm({ ...form, tips: e.target.value })} />
                </div>

                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                  <input type="checkbox" checked={form.isAnonymous} onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })} />
                  Submit anonymously
                </label>

                <Button className="w-full" onClick={submitExperience} disabled={formLoading}>
                  {formLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Publish experience"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="card mb-6 grid gap-4 p-6 md:grid-cols-5">
          <Input value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} placeholder="Company name search" />
          <Input value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })} placeholder="Role filter" />
          <Input value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })} placeholder="Year" />
          <select value={filters.outcome} onChange={(e) => setFilters({ ...filters, outcome: e.target.value })} className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white">
            <option value="">All outcomes</option>
            <option value="offer">Offer</option>
            <option value="reject">Reject</option>
            <option value="pending">Pending</option>
          </select>
          <select value={filters.topic} onChange={(e) => setFilters({ ...filters, topic: e.target.value })} className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white">
            <option value="">All topics</option>
            {TOPIC_OPTIONS.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="text-center text-slate-300">Loading experiences...</div>
        ) : experiences.length ? (
          <>
            <div className="columns-1 gap-6 md:columns-2 xl:columns-3">
              {experiences.map((experience) => (
                <div key={experience.id} className="card mb-6 break-inside-avoid p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-white">{experience.companyName}</h2>
                      <p className="text-sm text-slate-400">{experience.role}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      experience.outcome === "offer"
                        ? "border border-emerald-400/20 bg-emerald-500/12 text-emerald-200"
                        : experience.outcome === "reject"
                        ? "border border-rose-400/20 bg-rose-500/12 text-rose-200"
                        : "border border-amber-400/20 bg-amber-500/12 text-amber-200"
                    }`}>
                      {experience.outcome}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{experience.branch}, {experience.college} | {experience.month} {experience.year}</p>
                  <p className="mt-4 text-sm text-slate-300">Rounds: {experience.rounds.map((round) => round.roundType).join(" -> ")}</p>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{experience.rounds[0]?.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {experience.topicsAsked.map((topic) => (
                      <span key={topic} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">{topic}</span>
                    ))}
                  </div>
                  <p className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">{experience.tips}</p>
                  <Button variant="outline" className="mt-4 w-full" onClick={() => upvote(experience.id)}>
                    <ThumbsUp className="h-4 w-4" />
                    Upvote ({experience.upvotes})
                  </Button>
                </div>
              ))}
            </div>
            {hasMore ? (
              <div className="mt-2 flex justify-center">
                <Button variant="outline" onClick={() => loadExperiences(nextCursor)} disabled={isLoadingMore || !nextCursor}>
                  {isLoadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Load more
                </Button>
              </div>
            ) : null}
          </>
        ) : (
          <EmptyState
            icon={Plus}
            title="No experiences match these filters"
            description="Widen the company, year, or topic filters to surface more senior insights."
          />
        )}
      </div>
    </div>
  );
}
