import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ScoreRing from "@/components/ScoreRing";
import { apiClient, ScorerResponse } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Scorer() {
  const { toast } = useToast();
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<ScorerResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyze = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.analyzeResumeMatch(resumeText, jobDescription);
      setResult(response);
    } catch (error) {
      toast({
        title: "Scoring failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 py-10">
      <div className="container mx-auto">
        <div className="mb-10">
          <p className="pill">Resume vs JD match analysis</p>
          <h1 className="mt-4 text-4xl font-bold text-white">Resume-JD Scorer</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-400">
            Paste your resume and any campus or off-campus JD to see what recruiters are likely scanning for.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="card p-6">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-white">Paste your resume text</label>
                <Textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Copy-paste your resume content here..."
                  className="min-h-[280px] font-mono"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white">Paste the Job Description</label>
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the JD from LinkedIn, company site, or placement notice..."
                  className="min-h-[280px] font-mono"
                />
              </div>
              <Button className="w-full" size="lg" onClick={analyze} disabled={isLoading || !resumeText || !jobDescription}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing match...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Analyze Match
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="card p-6">
            {result ? (
              <div className="space-y-8">
                <ScoreRing score={result.score} size={220} label="Match Score" />
                <div className="grid gap-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white">Matched Keywords</h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {result.matchedKeywords.map((keyword) => (
                        <span key={keyword} className="rounded-full border border-emerald-400/20 bg-emerald-500/12 px-3 py-1 text-sm text-emerald-200">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Missing Keywords</h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {result.missingKeywords.map((keyword) => (
                        <span key={keyword} className="rounded-full border border-rose-400/20 bg-rose-500/12 px-3 py-1 text-sm text-rose-200">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Suggestions</h2>
                    <ul className="mt-3 space-y-3 text-sm text-slate-300">
                      {result.suggestions.map((suggestion) => (
                        <li key={suggestion.keyword} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          {suggestion.tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[600px] flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
                  <Sparkles className="h-7 w-7" />
                </div>
                <h2 className="mt-5 text-2xl font-semibold text-white">Your analysis will show up here</h2>
                <p className="mt-3 max-w-md text-sm leading-7 text-slate-400">
                  Expect a score, matched and missing keywords, plus suggestions you can directly turn into better resume bullet points.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
