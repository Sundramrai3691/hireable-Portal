const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim();
const BASE_URL =
  configuredBaseUrl ||
  (import.meta.env.DEV ? "" : window.location.origin);
const API_BASE_URL = `${BASE_URL}/api`;

export type Branch = "CS" | "EE" | "ECE" | "ME" | "CE" | "Other";
export type SystemDesignLevel = "none" | "basic" | "comfortable";

export interface StudentProfile {
  college: string;
  branch: Branch;
  year: number;
  cgpa: number;
  leetcodeRating?: number | null;
  problemsSolved?: number;
  skills: string[];
  projectCount: number;
  deployedProjectCount?: number;
  hasInternship: boolean;
  openSourceContributions?: boolean;
  systemDesign?: SystemDesignLevel;
  comfortableTopics?: string[];
  weakTopics?: string[];
  targetCompanies: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  profileCompleted: boolean;
  readinessScore?: number | null;
  readinessLevel?: string | null;
  studentProfile?: StudentProfile | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string | null;
  location: string;
  type: string;
  salary: string;
  description: string;
  tags: string[];
  skills: string[];
  eligibleBranches: Branch[];
  minCGPA: number;
  typicalRounds: string[];
  ctcRange: { min: number; max: number };
  driveType: "on-campus" | "off-campus" | "pool";
  expectedDriveMonth: string;
  allowsAllBranches: boolean;
  hasBond: boolean;
  bondDetails: string;
  historicallyVisited: boolean;
  topicsAsked: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  is_active: boolean;
  created_at: string;
}

export interface Application {
  id: string;
  appliedAt: string;
  applicantName?: string | null;
  phone?: string | null;
  college?: string | null;
  graduationYear?: number | null;
  resumeUrl?: string | null;
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    tags: string[];
    companyLogo?: string | null;
  } | null;
}

export interface TrackerEntry {
  id: string;
  companyId?: string | null;
  companyName: string;
  role: string;
  appliedDate: string;
  currentStage: string;
  stageHistory: Array<{ stage: string; movedAt: string; notes: string }>;
  nextAction?: string;
  nextActionDate?: string | null;
  notes?: string;
  offerCTC?: number | null;
}

export interface Experience {
  id: string;
  userId?: string | null;
  companyName: string;
  role: string;
  year: number;
  month: string;
  branch: string;
  college: string;
  outcome: "offer" | "reject" | "pending";
  rounds: Array<{ roundType: string; description: string; duration?: string }>;
  topicsAsked: string[];
  tips: string;
  isAnonymous: boolean;
  upvotes: number;
  createdAt: string;
}

export interface ScorerResponse {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: Array<{ keyword: string; frequency: number; tip: string }>;
  totalJDKeywords: number;
  matchedCount: number;
}

export interface ReadinessResponse {
  totalScore: number;
  breakdown: Record<string, { score: number; max: number }>;
  actions: Array<{ priority: string; items: string[] }>;
  level: { label: string; color: string };
  companyFits: Array<{
    company: string;
    role: string;
    matchScore: number;
    eligible: boolean;
    status: string;
    reasons: string[];
  }>;
}

class ApiClient {
  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem("auth_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeader(),
          ...(init.headers || {}),
        },
      });

      const contentType = response.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");
      const payload = isJson ? await response.json() : null;

      if (!response.ok) {
        throw new Error(payload?.error || "Request failed");
      }

      return payload as T;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(
          "Unable to reach the backend. Start the backend server and verify the API URL or dev proxy configuration.",
        );
      }
      throw error;
    }
  }

  private storeAuth(result: AuthResponse) {
    localStorage.setItem("auth_token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));
  }

  signup(data: SignupData): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }).then((result) => {
      this.storeAuth(result);
      return result;
    });
  }

  login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }).then((result) => {
      this.storeAuth(result);
      return result;
    });
  }

  logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user");
    return userStr ? (JSON.parse(userStr) as User) : null;
  }

  setCurrentUser(user: User) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token");
  }

  async getMe(): Promise<User> {
    const user = await this.request<User>("/users/me", { method: "GET" });
    this.setCurrentUser(user);
    return user;
  }

  async updateProfile(profile: StudentProfile): Promise<User> {
    const user = await this.request<User>("/users/me/profile", {
      method: "PUT",
      body: JSON.stringify(profile),
    });
    this.setCurrentUser(user);
    return user;
  }

  async getJobs(filters?: Record<string, string | number | boolean | undefined>): Promise<Job[]> {
    const params = new URLSearchParams();
    Object.entries(filters || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== false) {
        params.append(key, String(value));
      }
    });

    const queryString = params.toString();
    return this.request<Job[]>(`/jobs${queryString ? `?${queryString}` : ""}`, {
      method: "GET",
      headers: {},
    });
  }

  createJob(jobData: Record<string, unknown>): Promise<Job> {
    return this.request<Job>("/jobs", {
      method: "POST",
      body: JSON.stringify(jobData),
    });
  }

  applyToJob(
    jobId: string,
    payload?: {
      applicantName?: string;
      phone?: string;
      college?: string | null;
      graduationYear?: number | null;
      resumeUrl?: string;
    },
  ): Promise<void> {
    return this.request<void>(`/jobs/${jobId}/apply`, {
      method: "POST",
      body: payload ? JSON.stringify(payload) : undefined,
    });
  }

  getUserApplications(userId: string): Promise<Application[]> {
    return this.request<Application[]>(`/users/${userId}/applications`, {
      method: "GET",
      headers: {},
    });
  }

  analyzeResumeMatch(resumeText: string, jobDescription: string): Promise<ScorerResponse> {
    return this.request<ScorerResponse>("/scorer/analyze", {
      method: "POST",
      body: JSON.stringify({ resumeText, jobDescription }),
    });
  }

  getTracker(): Promise<TrackerEntry[]> {
    return this.request<TrackerEntry[]>("/tracker", {
      method: "GET",
      headers: {},
    });
  }

  createTrackerEntry(payload: Record<string, unknown>): Promise<TrackerEntry> {
    return this.request<TrackerEntry>("/tracker", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  updateTrackerEntry(id: string, payload: Record<string, unknown>): Promise<TrackerEntry> {
    return this.request<TrackerEntry>(`/tracker/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  deleteTrackerEntry(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/tracker/${id}`, {
      method: "DELETE",
    });
  }

  getExperiences(filters?: Record<string, string | number | undefined>): Promise<Experience[]> {
    const params = new URLSearchParams();
    Object.entries(filters || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.append(key, String(value));
      }
    });
    const queryString = params.toString();
    return this.request<Experience[]>(`/experiences${queryString ? `?${queryString}` : ""}`, {
      method: "GET",
      headers: {},
    });
  }

  createExperience(payload: Record<string, unknown>): Promise<Experience> {
    return this.request<Experience>("/experiences", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  upvoteExperience(id: string): Promise<Experience> {
    return this.request<Experience>(`/experiences/${id}/upvote`, {
      method: "POST",
    });
  }

  calculateReadiness(payload: Record<string, unknown>): Promise<ReadinessResponse> {
    return this.request<ReadinessResponse>("/readiness/score", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
}

export const apiClient = new ApiClient();
