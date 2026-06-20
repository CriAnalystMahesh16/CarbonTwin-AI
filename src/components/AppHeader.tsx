import React from "react";
import { Leaf, Github, LogOut } from "lucide-react";

interface AppHeaderProps {
  activeTab: "dashboard" | "form" | "testing" | "documentation";
  setActiveTab: (tab: "dashboard" | "form" | "testing" | "documentation") => void;
  currentUser: { email: string | null; uid: string; displayName?: string };
  onLogout: () => void;
}

export function AppHeader({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
}: AppHeaderProps): React.JSX.Element {
  return (
    <>
      <header className="h-16 px-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 sticky top-0 z-50 backdrop-blur-md font-sans">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-slate-950">
            <Leaf className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white select-none">
            CarbonTwin<span className="text-emerald-500 underline underline-offset-4 decoration-2">AI</span>
          </span>
        </div>

        {/* Global Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400" aria-label="System Dashboard Options">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`py-5 cursor-pointer transition-colors font-medium border-b-2 ${
              activeTab === "dashboard" ? "text-emerald-400 border-emerald-400" : "border-transparent hover:text-slate-200"
            }`}
          >
            Twin Dashboard
          </button>
          <button
            onClick={() => setActiveTab("form")}
            className={`py-5 cursor-pointer transition-colors font-medium border-b-2 ${
              activeTab === "form" ? "text-emerald-400 border-emerald-400" : "border-transparent hover:text-slate-200"
            }`}
          >
            Lifestyle Specs
          </button>
          <button
            onClick={() => setActiveTab("testing")}
            className={`py-5 cursor-pointer transition-colors font-medium border-b-2 ${
              activeTab === "testing" ? "text-emerald-400 border-emerald-400" : "border-transparent hover:text-slate-200"
            }`}
          >
            Safe Testbed
          </button>
          <button
            onClick={() => setActiveTab("documentation")}
            className={`py-5 cursor-pointer transition-colors font-medium border-b-2 ${
              activeTab === "documentation" ? "text-emerald-400 border-emerald-400" : "border-transparent hover:text-slate-200"
            }`}
          >
            Blueprints
          </button>
        </nav>

        {/* User Status / Account Bar */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/CriAnalystMahesh16/CarbonTwin-AI.git"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-emerald-400 hover:border-emerald-500/30 transition-all shadow-sm select-none"
            title="View Code on GitHub"
            id="header-github-link"
          >
            <Github className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">Codebase</span>
          </a>

          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-slate-500 font-mono leading-none uppercase">Last Sync: 10:28 AM</p>
            <p className="text-xs font-semibold text-slate-200">{currentUser.email?.split("@")[0] || "User Account"}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden relative group">
            <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-sky-500/20 flex items-center justify-center text-emerald-400 font-bold transition-all group-hover:opacity-0">
              {currentUser.email ? currentUser.email[0].toUpperCase() : "U"}
            </div>
            <button
              onClick={onLogout}
              title="Log out securely"
              className="absolute inset-0 bg-rose-950/90 text-rose-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
              aria-label="Logout button"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Tabs bar */}
      <div className="md:hidden flex items-center justify-around bg-slate-900/50 border-b border-slate-800 text-xs font-medium text-slate-400">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`py-3 flex-1 text-center border-b-2 ${
            activeTab === "dashboard" ? "text-emerald-400 border-emerald-400" : "border-transparent text-slate-400"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("form")}
          className={`py-3 flex-1 text-center border-b-2 ${
            activeTab === "form" ? "text-emerald-400 border-emerald-400" : "border-transparent text-slate-400"
          }`}
        >
          Form
        </button>
        <button
          onClick={() => setActiveTab("testing")}
          className={`py-3 flex-1 text-center border-b-2 ${
            activeTab === "testing" ? "text-emerald-400 border-emerald-400" : "border-transparent text-slate-400"
          }`}
        >
          Testbed
        </button>
        <button
          onClick={() => setActiveTab("documentation")}
          className={`py-3 flex-1 text-center border-b-2 ${
            activeTab === "documentation" ? "text-emerald-400 border-emerald-400" : "border-transparent text-slate-400"
          }`}
        >
          Blueprints
        </button>
      </div>
    </>
  );
}
