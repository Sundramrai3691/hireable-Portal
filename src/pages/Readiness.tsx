import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ScoreRing from "@/components/ScoreRing";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiClient, ReadinessResponse } from "@/lib/api";
import { SYSTEM_DESIGN_OPTIONS, TOPIC_OPTIONS } from "@/lib/placemate";

const steps = ["DSA Strength", "Projects and Experience", "Academics and Skills", "Target Companies"];

export default function Readiness() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const profile = user?.studentProfile;
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ReadinessResponse | null>(null);
  const [form, setForm] = useState({
    leetcodeRating: profile?.leetcodeRating || 0,
    problemsSolved: profile?.problemsSolved || 0,
    comfortableTopics: profile?.comfortableTopics || [],
    weakTopics: profile?.weakTopics || [],
    projectCount: profile?.projectCount || 2,
    deployedCount: profile?.deployedProjectCount || 1,
    hasInternship: profile?.hasInternship || false,
    openSourceContributions: profile?.openSourceContributions || false,
    cgpa: profile?.cgpa || 7.5,
    skillsCount: profile?.skills.length || 0,
    systemDesign: profile?.systemDesign || "none",
    targetCompanies: profile?.targetCompanies || [],
    branch: profile?.branch || "CS",
  });

  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

  const submit = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.calculateReadiness(form);
      setResult(response);
      await refreshUser();
    } catch (error) {
      toast({
        title: "Could not calculate readiness",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 py-10">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="pill">2-minute diagnostic</p>
          <h1 className="mt-4 text-4xl font-bold text-white">Placement Readiness Diagnostic</h1>
          <p className="mt-3 text-lg text-slate-400">Answer honestly. This takes around 2 minutes.</p>
        </div>

        <div className="card p-6">
          <div className="mb-8">
            <div className="mb-3 flex items-center justify-between text-sm text-slate-400">
              <span>Step {step + 1} of {steps.length}</span>
              <span>{steps[step]}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {step === 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">LeetCode rating</label>
                <Input type="number" value={form.leetcodeRating} onChange={(e) => setForm({ ...form, leetcodeRating: Number(e.target.value) })} />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Problems solved</label>
                <Input type="number" value={form.problemsSolved} onChange={(e) => setForm({ ...form, problemsSolved: Number(e.target.value) })} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-3 block text-sm text-slate-300">Comfortable topics</label>
                <div className="flex flex-wrap gap-2">
                  {TOPIC_OPTIONS.map((topic) => (
                    <Button
                      key={topic}
                      type="button"
                      variant={form.comfortableTopics.includes(topic) ? "default" : "outline"}
                      className="rounded-full"
                      onClick={() => setForm({ ...form, comfortableTopics: form.comfortableTopics.includes(topic) ? form.comfortableTopics.filter((item) => item !== topic) : [...form.comfortableTopics, topic] })}
                    >
                      {topic}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Number of projects</label>
                <Input type="number" value={form.projectCount} onChange={(e) => setForm({ ...form, projectCount: Number(e.target.value) })} />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Deployed projects</label>
                <Input type="number" value={form.deployedCount} onChange={(e) => setForm({ ...form, deployedCount: Number(e.target.value) })} />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Has internship</label>
                <div className="flex gap-3">
                  <Button type="button" variant={form.hasInternship ? "default" : "outline"} onClick={() => setForm({ ...form, hasInternship: true })}>Yes</Button>
                  <Button type="button" variant={!form.hasInternship ? "default" : "outline"} onClick={() => setForm({ ...form, hasInternship: false })}>No</Button>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Open source contributions</label>
                <div className="flex gap-3">
                  <Button type="button" variant={form.openSourceContributions ? "default" : "outline"} onClick={() => setForm({ ...form, openSourceContributions: true })}>Yes</Button>
                  <Button type="button" variant={!form.openSourceContributions ? "default" : "outline"} onClick={() => setForm({ ...form, openSourceContributions: false })}>No</Button>
                </div>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">CGPA</label>
                <Input type="number" step="0.1" value={form.cgpa} onChange={(e) => setForm({ ...form, cgpa: Number(e.target.value) })} />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Core skills count</label>
                <Input type="number" value={form.skillsCount} onChange={(e) => setForm({ ...form, skillsCount: Number(e.target.value) })} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-3 block text-sm text-slate-300">System design awareness</label>
                <div className="flex flex-wrap gap-3">
                  {SYSTEM_DESIGN_OPTIONS.map((level) => (
                    <Button key={level} type="button" variant={form.systemDesign === level ? "default" : "outline"} onClick={() => setForm({ ...form, systemDesign: level })}>
                      {level}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div>
              <label className="mb-3 block text-sm text-slate-300">Target companies</label>
              <div className="flex flex-wrap gap-3">
                {profile?.targetCompanies?.length ? profile.targetCompanies.map((company) => (
                  <Button key={company} type="button" variant={form.targetCompanies.includes(company) ? "default" : "outline"} className="rounded-full" onClick={() => setForm({ ...form, targetCompanies: form.targetCompanies.includes(company) ? form.targetCompanies.filter((item) => item !== company) : [...form.targetCompanies, company] })}>
                    {company}
                  </Button>
                )) : (
                  <p className="text-sm text-slate-400">Add target companies in profile setup to see company fit here.</p>
                )}
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex items-center justify-between">
            <Button variant="outline" onClick={() => setStep((prev) => Math.max(0, prev - 1))} disabled={step === 0}>
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            {step < steps.length - 1 ? (
              <Button onClick={() => setStep((prev) => Math.min(steps.length - 1, prev + 1))}>
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={submit} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  "Reveal my score"
                )}
              </Button>
            )}
          </div>
        </div>

        {result ? (
          <div className="mt-8 grid gap-6">
            <div className="card p-8 text-center">
              <ScoreRing score={result.totalScore} size={220} label={result.level.label} />
              <div className="mt-6 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                {result.level.label}
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-semibold text-white">Breakdown</h2>
              <div className="mt-6 space-y-4">
                {Object.entries(result.breakdown).map(([label, value]) => (
                  <div key={label}>
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                      <span className="capitalize">{label}</span>
                      <span>{value.score}/{value.max}</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500" style={{ width: `${(value.score / value.max) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-white">Action items</h2>
                <div className="mt-4 space-y-4">
                  {result.actions.map((action) => (
                    <div key={action.priority} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="font-medium text-white">{action.priority}</p>
                      <ul className="mt-3 space-y-2 text-sm text-slate-300">
                        {action.items.map((item) => <li key={item}>- {item}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-xl font-semibold text-white">Company fit</h2>
                <div className="mt-4 space-y-4">
                  {result.companyFits.map((fit) => (
                    <div key={`${fit.company}-${fit.role}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">{fit.company}</p>
                          <p className="text-sm text-slate-400">{fit.role}</p>
                        </div>
                        <span className="font-mono text-blue-200">{fit.matchScore}%</span>
                      </div>
                      <p className="mt-3 text-sm text-slate-300">{fit.status}</p>
                      <p className="mt-2 text-sm text-slate-400">{fit.reasons.join(" | ")}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
