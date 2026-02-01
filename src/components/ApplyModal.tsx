import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";

interface ApplyModalProps {
  jobId: string | number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ApplyModal = ({ jobId, open, onOpenChange }: ApplyModalProps) => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicantName, setApplicantName] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [graduationYear, setGraduationYear] = useState<string>("");
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    setApplicantName(user?.name || "");
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to apply to this job.",
        variant: "destructive",
      });
      return;
    }
    if (!applicantName || !phone || !resumeUrl) {
      toast({
        title: "Missing fields",
        description: "Please fill your name, phone and resume URL.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await apiClient.applyToJob(String(jobId), {
        applicantName,
        phone,
        college: college || null,
        graduationYear: graduationYear ? Number(graduationYear) : null,
        resumeUrl,
      });
      toast({
        title: "Application Submitted! 🎉",
        description: "Your application has been submitted successfully.",
      });
      onOpenChange(false);
      setPhone("");
      setCollege("");
      setGraduationYear("");
      setResumeUrl("");
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error && "message" in error
          ? String((error as { message?: unknown }).message)
          : "Something went wrong.";
      toast({
        title: "Error Applying",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply to Job</DialogTitle>
          <DialogDescription>
            Provide your details to submit an application
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="applicantName">Full Name</Label>
            <Input
              id="applicantName"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="college">College</Label>
            <Input
              id="college"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="graduationYear">Graduation Year</Label>
            <Input
              id="graduationYear"
              type="number"
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resumeUrl">Resume URL</Label>
            <Input
              id="resumeUrl"
              placeholder="https://..."
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyModal;
