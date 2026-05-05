import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { BRANCH_OPTIONS, TOPIC_OPTIONS } from "@/lib/placemate";

export default function PostJob() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    companyLogo: "",
    location: "Remote",
    type: "Internship",
    salary: "",
    description: "",
    eligibleBranches: [] as string[],
    minCGPA: 7,
    driveType: "on-campus",
    expectedDriveMonth: "",
    typicalRounds: "",
    topicsAsked: [] as string[],
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const salaryValue = formData.salary.trim();
      const parts = salaryValue.match(/(\d+)\s*-\s*(\d+)/);
      await apiClient.createJob({
        ...formData,
        ctcRange: {
          min: parts ? Number(parts[1]) : 0,
          max: parts ? Number(parts[2]) : 0,
        },
        typicalRounds: formData.typicalRounds.split(",").map((item) => item.trim()).filter(Boolean),
      });
      toast({
        title: "Company drive added",
        description: `${formData.company} is now available in the companies tracker.`,
      });
      navigate("/companies");
    } catch (error) {
      toast({
        title: "Could not add drive",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4 py-10">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-10">
          <p className="pill">Admin flow</p>
          <h1 className="mt-4 text-4xl font-bold text-white">Add Company Drive</h1>
          <p className="mt-3 text-lg text-slate-400">Use this form to publish a placement drive with eligibility, round, and topic information.</p>
        </div>

        <form onSubmit={submit} className="card grid gap-6 p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Role title</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Company Logo URL</Label>
              <Input value={formData.companyLogo} onChange={(e) => setFormData({ ...formData, companyLogo: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Input value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Salary or CTC range</Label>
              <Input value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} placeholder="8-12 LPA" />
            </div>
            <div className="space-y-2">
              <Label>Minimum CGPA</Label>
              <Input type="number" step="0.1" value={formData.minCGPA} onChange={(e) => setFormData({ ...formData, minCGPA: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Expected drive month</Label>
              <Input value={formData.expectedDriveMonth} onChange={(e) => setFormData({ ...formData, expectedDriveMonth: e.target.value })} placeholder="July 2025" />
            </div>
            <div className="space-y-2">
              <Label>Drive type</Label>
              <select value={formData.driveType} onChange={(e) => setFormData({ ...formData, driveType: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white">
                <option value="on-campus">On-campus</option>
                <option value="off-campus">Off-campus</option>
                <option value="pool">Pool</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Typical rounds</Label>
              <Input value={formData.typicalRounds} onChange={(e) => setFormData({ ...formData, typicalRounds: e.target.value })} placeholder="OA, Technical Round 1, HR" />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Eligible branches</Label>
            <div className="flex flex-wrap gap-3">
              {BRANCH_OPTIONS.map((branch) => (
                <Button
                  key={branch}
                  type="button"
                  variant={formData.eligibleBranches.includes(branch) ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      eligibleBranches: formData.eligibleBranches.includes(branch)
                        ? formData.eligibleBranches.filter((item) => item !== branch)
                        : [...formData.eligibleBranches, branch],
                    })
                  }
                >
                  {branch}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Topics asked</Label>
            <div className="flex flex-wrap gap-3">
              {TOPIC_OPTIONS.map((topic) => (
                <Button
                  key={topic}
                  type="button"
                  variant={formData.topicsAsked.includes(topic) ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      topicsAsked: formData.topicsAsked.includes(topic)
                        ? formData.topicsAsked.filter((item) => item !== topic)
                        : [...formData.topicsAsked, topic],
                    })
                  }
                >
                  {topic}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="min-h-36" />
          </div>

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Saving drive..." : "Publish drive"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
