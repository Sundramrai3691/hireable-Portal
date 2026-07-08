import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient, Job, StudentProfile } from "@/lib/api";
import {
  BRANCH_OPTIONS,
  PROJECT_COUNT_OPTIONS,
  SKILL_OPTIONS,
  SYSTEM_DESIGN_OPTIONS,
  TOPIC_OPTIONS,
  YEAR_OPTIONS,
} from "@/lib/placemate";
import { useToast } from "@/hooks/use-toast";

function toggleItem(items: string[], item: string) {
  return items.includes(item) ? items.filter((entry) => entry !== item) : [...items, item];
}

export default function ProfileSetup() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Job[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<StudentProfile>({
    college: user?.studentProfile?.college || "",
    branch: user?.studentProfile?.branch || "CS",
    year: user?.studentProfile?.year || 3,
    cgpa: user?.studentProfile?.cgpa || 7.5,
    leetcodeRating: user?.studentProfile?.leetcodeRating || 0,
    problemsSolved: user?.studentProfile?.problemsSolved || 0,
    skills: user?.studentProfile?.skills || [],
    projectCount: user?.studentProfile?.projectCount || 2,
    deployedProjectCount: user?.studentProfile?.deployedProjectCount || 1,
    hasInternship: user?.studentProfile?.hasInternship || false,
    openSourceContributions: user?.studentProfile?.openSourceContributions || false,
    systemDesign: user?.studentProfile?.systemDesign || "none",
    comfortableTopics: user?.studentProfile?.comfortableTopics || [],
    weakTopics: user?.studentProfile?.weakTopics || [],
    targetCompanies: user?.studentProfile?.targetCompanies || [],
  });

  useEffect(() => {
    if (user?.profileCompleted) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, user?.profileCompleted]);

  useEffect(() => {
    apiClient.getJobs({ limit: 100 }).then((response) => setCompanies(response.data)).catch(() => setCompanies([]));
  }, []);

  const uniqueCompanies = useMemo(
    () => Array.from(new Set(companies.map((company) => company.company))).slice(0, 12),
    [companies],
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await apiClient.updateProfile(form);
      await refreshUser();
      toast({
        title: "Profile saved",
        description: "Your dashboard is now personalized for placement season.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Failed to save profile",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="px-4 py-12">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="pill">One-time profile setup</p>
          <h1 className="mt-4 text-4xl font-bold text-white">Tell PlaceMate how to personalize your prep</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-400">
            We use this to filter companies, estimate readiness, and tailor your dashboard to the drives that actually matter to you.
          </p>
        </div>

        <form onSubmit={handleSave} className="grid gap-6">
          <div className="card grid gap-6 p-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>College</Label>
              <Input value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} placeholder="NIT Trichy" />
            </div>
            <div className="space-y-2">
              <Label>Branch</Label>
              <Select value={form.branch} onValueChange={(value) => setForm({ ...form, branch: value as StudentProfile["branch"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {BRANCH_OPTIONS.map((branch) => <SelectItem key={branch} value={branch}>{branch}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Year</Label>
              <Select value={String(form.year)} onValueChange={(value) => setForm({ ...form, year: Number(value) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {YEAR_OPTIONS.map((year) => <SelectItem key={year} value={String(year)}>{year}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>CGPA</Label>
              <Input type="number" step="0.1" min="0" max="10" value={form.cgpa} onChange={(e) => setForm({ ...form, cgpa: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>LeetCode Rating</Label>
              <Input type="number" value={form.leetcodeRating || 0} onChange={(e) => setForm({ ...form, leetcodeRating: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Problems Solved</Label>
              <Input type="number" value={form.problemsSolved || 0} onChange={(e) => setForm({ ...form, problemsSolved: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Project Count</Label>
              <Select value={String(form.projectCount)} onValueChange={(value) => setForm({ ...form, projectCount: Number(value) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PROJECT_COUNT_OPTIONS.map((count) => <SelectItem key={count} value={String(count)}>{count === 4 ? "4+" : count}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Deployed Projects</Label>
              <Input type="number" value={form.deployedProjectCount || 0} onChange={(e) => setForm({ ...form, deployedProjectCount: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Internship Experience</Label>
              <div className="flex gap-3">
                <Button type="button" variant={form.hasInternship ? "default" : "outline"} onClick={() => setForm({ ...form, hasInternship: true })}>Yes</Button>
                <Button type="button" variant={!form.hasInternship ? "default" : "outline"} onClick={() => setForm({ ...form, hasInternship: false })}>No</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Open Source Contributions</Label>
              <div className="flex gap-3">
                <Button type="button" variant={form.openSourceContributions ? "default" : "outline"} onClick={() => setForm({ ...form, openSourceContributions: true })}>Yes</Button>
                <Button type="button" variant={!form.openSourceContributions ? "default" : "outline"} onClick={() => setForm({ ...form, openSourceContributions: false })}>No</Button>
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>System Design Awareness</Label>
              <div className="flex flex-wrap gap-3">
                {SYSTEM_DESIGN_OPTIONS.map((level) => (
                  <Button
                    key={level}
                    type="button"
                    variant={form.systemDesign === level ? "default" : "outline"}
                    onClick={() => setForm({ ...form, systemDesign: level })}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="card p-6">
            <Label>Core Skills</Label>
            <p className="mt-2 text-sm text-slate-400">Select the skills you would confidently discuss in an interview.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {SKILL_OPTIONS.map((skill) => (
                <Button
                  key={skill}
                  type="button"
                  variant={form.skills.includes(skill) ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => setForm({ ...form, skills: toggleItem(form.skills, skill) })}
                >
                  {skill}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card p-6">
              <Label>Comfortable DSA Topics</Label>
              <div className="mt-4 flex flex-wrap gap-3">
                {TOPIC_OPTIONS.map((topic) => (
                  <Button
                    key={topic}
                    type="button"
                    variant={form.comfortableTopics?.includes(topic) ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() =>
                      setForm({
                        ...form,
                        comfortableTopics: toggleItem(form.comfortableTopics || [], topic),
                      })
                    }
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </div>
            <div className="card p-6">
              <Label>Weak Topics</Label>
              <div className="mt-4 flex flex-wrap gap-3">
                {TOPIC_OPTIONS.map((topic) => (
                  <Button
                    key={topic}
                    type="button"
                    variant={form.weakTopics?.includes(topic) ? "destructive" : "outline"}
                    className="rounded-full"
                    onClick={() =>
                      setForm({
                        ...form,
                        weakTopics: toggleItem(form.weakTopics || [], topic),
                      })
                    }
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="card p-6">
            <Label>Target Companies</Label>
            <p className="mt-2 text-sm text-slate-400">Pick the companies you care about most this season.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {uniqueCompanies.map((company) => (
                <Button
                  key={company}
                  type="button"
                  variant={form.targetCompanies.includes(company) ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() =>
                    setForm({
                      ...form,
                      targetCompanies: toggleItem(form.targetCompanies, company),
                    })
                  }
                >
                  {company}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save and continue
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
