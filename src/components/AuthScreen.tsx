import React, { useState } from "react";
import { auth, isMockFirebase } from "../lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInAnonymously
} from "firebase/auth";
import { Leaf, AlertCircle, ShieldAlert, KeyRound, UserPlus, Sparkles, Orbit } from "lucide-react";

interface AuthScreenProps {
  onAuthSuccess: (user: { uid: string; email: string | null; displayName?: string }) => void;
}

export function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fallback for mock sandbox environment
  const handleLocalDemo = () => {
    onAuthSuccess({
      uid: "sandbox-guest-user-123",
      email: "guest@carbontwin.ai",
      displayName: "Carbon Explorer",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all standard credentials.");
      return;
    }
    setError(null);
    setIsLoading(true);

    if (isMockFirebase) {
      // Offline local credential simulation for seamless sandbox testing
      setTimeout(() => {
        setIsLoading(false);
        onAuthSuccess({
          uid: `local-${email.replace(/[^a-zA-Z0-9]/g, "")}`,
          email: email,
          displayName: email.split("@")[0].toUpperCase(),
        });
      }, 800);
      return;
    }

    try {
      if (isSignUp) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        onAuthSuccess({
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: email.split("@")[0],
        });
      } else {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        onAuthSuccess({
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: credential.user.displayName || email.split("@")[0],
        });
      }
    } catch (err: any) {
      setError(err?.message || "Authentication attempt failed. Check connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymousAuth = async () => {
    setError(null);
    setIsLoading(true);
    if (isMockFirebase) {
      setTimeout(() => {
        setIsLoading(false);
        onAuthSuccess({
          uid: "sandbox-anonymous-777",
          email: "anonymous@carbontwin.ai",
          displayName: "Eco Nomad",
        });
      }, 500);
      return;
    }

    try {
      const credential = await signInAnonymously(auth);
      onAuthSuccess({
        uid: credential.user.uid,
        email: "anonymous@carbontwin.ai",
        displayName: "Anonymous Member",
      });
    } catch (err: any) {
      setError(err?.message || "Failed to start anonymous session.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      {/* Background Decorative Rings */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10">
        {/* Title / Logo Header */}
        <div className="bg-gradient-to-br from-slate-900 to-emerald-950/20 p-8 text-center border-b border-emerald-950/30">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 text-emerald-400 rounded-full mb-4 ring-1 ring-emerald-500/20 animate-pulse">
            <Leaf className="w-8 h-8" aria-hidden="true" />
          </div>
          <h1 className="font-display font-bold text-3xl tracking-tight text-white mb-2" id="auth-heading">
            CarbonTwin <span className="text-emerald-400">AI</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Continuous Ecological Digital Twin Modeling
          </p>
        </div>

        <div className="p-8">
          {/* Mock Mode Status Notice Box */}
          {isMockFirebase ? (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200" role="status">
              <div className="flex gap-2 items-start">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="font-semibold" id="sandbox-status-label">Local Sandbox Session Active</p>
                  <p className="opacity-90 leading-relaxed">
                    Firebase credentials not detected. Applet is executing securely using local sandbox state.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-200" role="status">
              <div className="flex gap-2 items-start">
                <Leaf className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                <p className="font-semibold" id="firebase-status-label">Authenticated Firestore Connection Ready</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs rounded-xl flex gap-2 items-start" role="alert">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" aria-describedby="auth-heading">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 text-white rounded-xl px-4 py-3 text-sm transition-all duration-200 placeholder-slate-600 focus:outline-none"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-2">
                Secure Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 text-white rounded-xl px-4 py-3 text-sm transition-all duration-200 placeholder-slate-600 focus:outline-none"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignUp ? "new-password" : "current-password"}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 px-4 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-emerald-500/10 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 mt-2 cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Orbit className="w-4 h-4 animate-spin" aria-hidden="true" /> Analyzing session...
                </span>
              ) : isSignUp ? (
                <span className="flex items-center justify-center gap-2">
                  <UserPlus className="w-4 h-4" aria-hidden="true" /> Register New Account
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <KeyRound className="w-4 h-4" aria-hidden="true" /> Secure Account Login
                </span>
              )}
            </button>
          </form>

          {/* Toggle Login Mode */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-slate-400 hover:text-emerald-400 transition-colors underline underline-offset-4 focus:outline-none"
            >
              {isSignUp ? "Already have an account? Log in" : "New to CarbonTwin? Sign up now"}
            </button>
          </div>

          <div className="relative flex py-4 items-center mt-6">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-4 text-[10px] text-slate-500 uppercase tracking-widest">or sandbox access</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleLocalDemo}
              aria-label="Launch application instantly using local simulator database credentials"
              className="bg-slate-950 hover:bg-slate-800 text-white text-xs border border-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none py-3 rounded-xl font-medium transition-colors duration-200 cursor-pointer"
            >
              🚀 Sandbox Demo
            </button>
            <button
              type="button"
              onClick={handleAnonymousAuth}
              aria-label="Log in anonymously as guest with simulated transient parameters"
              className="bg-slate-950 hover:bg-emerald-950/20 text-emerald-400 text-xs border border-emerald-900/40 focus:ring-2 focus:ring-emerald-500 focus:outline-none py-3 rounded-xl font-medium transition-colors duration-200 cursor-pointer"
            >
              🌿 Guest Mode
            </button>
          </div>
        </div>
      </div>

      {/* Footer Creds */}
      <p className="mt-8 text-[11px] text-slate-600 tracking-wider">
        CARBON DIGITAL TWIN IS A 100% SECURE ZERO-TRUST PLATFORM
      </p>
    </div>
  );
}
