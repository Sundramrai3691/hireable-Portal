import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Target } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Auth() {
  const { login, signup, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate(user?.profileCompleted ? "/dashboard" : "/profile/setup", { replace: true });
    }
  }, [isAuthenticated, navigate, user?.profileCompleted]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");
    try {
      const response = await login({ email: loginEmail, password: loginPassword });
      toast({ title: "Welcome back", description: "Your placement dashboard is ready." });
      navigate(response.user.profileCompleted ? "/dashboard" : "/profile/setup");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      setLoginError(message);
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSignupError("");
    try {
      const response = await signup({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
      });
      toast({ title: "Account created", description: "Let us set up your placement profile." });
      navigate(response.user.profileCompleted ? "/dashboard" : "/profile/setup");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      setSignupError(message);
      toast({
        title: "Signup failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="hero-grid min-h-screen px-4 py-16">
      <div className="container mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="flex flex-col justify-center">
          <div className="pill w-fit">Student-first placement prep</div>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white md:text-6xl">
            Sign in to
            <br />
            your PlaceMate workspace
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
            Track company drives, score your resume against real JDs, and keep every placement round organized from one dashboard.
          </p>
          <div className="mt-8 flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-300" />
              Personalized readiness
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-violet-300" />
              Real interview insights
            </div>
          </div>
        </div>

        <Card className="card border-white/10 bg-slate-950/70">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/25 bg-blue-500/10 text-blue-300">
              <Target className="h-6 w-6" />
            </div>
            <CardTitle className="mt-4 text-2xl font-bold text-white">Welcome to PlaceMate</CardTitle>
            <CardDescription>Sign in or create your account to start your placement setup.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="mb-8 grid w-full grid-cols-2 bg-slate-900/70">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className={loginError ? "border-rose-400/60" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className={loginError ? "border-rose-400/60" : ""}
                    />
                  </div>
                  {loginError ? <p className="text-sm text-rose-300">{loginError}</p> : null}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Logging you in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      placeholder="Ananya Sharma"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className={signupError ? "border-rose-400/60" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className={signupError ? "border-rose-400/60" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className={signupError ? "border-rose-400/60" : ""}
                    />
                  </div>
                  {signupError ? <p className="text-sm text-rose-300">{signupError}</p> : null}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating your account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
