import React, { useState } from "react";
import { motion, Variants } from "motion/react";
import { AuthScreen } from "./components/AuthScreen";
import { SetupTwinForm } from "./components/SetupTwinForm";
import { AppHeader } from "./components/AppHeader";
import { AppFooter } from "./components/AppFooter";
import { DashboardView } from "./components/dashboard/DashboardView";
import { SimulatorView } from "./components/dashboard/SimulatorView";
import { VerificationSpecTests } from "./components/VerificationSpecTests";
import { BlueprintsView } from "./components/BlueprintsView";
import { useCarbonTwin } from "./hooks/useCarbonTwin";
import { useStreakTracker } from "./hooks/useStreakTracker";
import { CarbonTwinState } from "./types";
import { AlertCircle, Trash2, Calendar, Lightbulb, Save, RefreshCw, Activity } from "lucide-react";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" }
  }
};

export default function App(): React.JSX.Element {
  const [currentUser, setCurrentUser] = useState<{ uid: string; email: string | null; displayName?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "form" | "testing" | "documentation">("dashboard");

  const uid = currentUser ? currentUser.uid : null;

  const {
    userInputs,
    twinAnalysis,
    isAnalyzing,
    errorText,
    setErrorText,
    simulatedActions,
    historyTwins,
    isSaving,
    isDeleting,
    simulatedResults,
    handleAnalyzeLifestyle,
    handleSaveSnapshot,
    handleDeleteSnapshot,
    handleLoadSavedSnapshot,
    handleToggleSimulation,
  } = useCarbonTwin(uid);

  const {
    streakStatus,
    handleCheckIn: triggerStreakCheckIn,
    handleSimulateNextDay,
    handleResetStreak,
    getSimulatedDate,
    getLocalDateString,
    formatFriendlyDate,
  } = useStreakTracker(uid);

  const handleCheckIn = (): void => {
    const activeCommitmentCount = Object.values(simulatedActions).filter(Boolean).length;
    const error = triggerStreakCheckIn(activeCommitmentCount);
    if (error) {
      setErrorText(error);
    } else {
      setErrorText(null);
    }
  };

  const handleLogout = (): void => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <AuthScreen onAuthSuccess={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-900">
      
      {/* Dynamic App Navigation Shell Header */}
      <AppHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Core View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
        
        {/* Error/Notice Notification banners */}
        {errorText && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs rounded-xl flex gap-3 items-start animate-shake">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Notice from carbon diagnostics:</span>
              <p className="opacity-90 leading-relaxed">{errorText}</p>
            </div>
          </div>
        )}

        {/* TAB 1: ACTIVE DIGITAL TWIN DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Dashboard View (Card A & Charts) */}
            <DashboardView
              userInputs={userInputs}
              twinAnalysis={twinAnalysis}
              simulatedResults={simulatedResults}
              simulatedActions={simulatedActions}
              onToggleSimulation={handleToggleSimulation}
              cardVariants={cardVariants}
            />

            {/* Diagnostic Summary Explanations and Saving Trigger Control */}
            <motion.div 
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-slate-900 border border-slate-800 px-6 py-4 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-305 shadow-md select-none"
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                <p>
                  <span className="text-white font-bold">Diagnosed Explanation:</span> {twinAnalysis.explanation}
                </p>
              </div>

              <button
                onClick={handleSaveSnapshot}
                disabled={isSaving}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" /> Commit Snapshot
                  </>
                )}
              </button>
            </motion.div>

            {/* Simulator View (Bento box including radial intensity indicator and streak history) */}
            <SimulatorView
              twinAnalysis={twinAnalysis}
              simulatedResults={simulatedResults}
              simulatedActions={simulatedActions}
              onToggleSimulation={handleToggleSimulation}
              streakStatus={streakStatus}
              onCheckIn={handleCheckIn}
              onResetStreak={handleResetStreak}
              onSimulateNextDay={handleSimulateNextDay}
              getSimulatedDate={getSimulatedDate}
              formatFriendlyDate={formatFriendlyDate}
              getLocalDateString={getLocalDateString}
              cardVariants={cardVariants}
            />

            {/* Archivings Log View cards for restoring/deleting snapshots */}
            <motion.div 
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative shadow-md"
            >
              <h3 className="font-display font-semibold text-lg text-white mb-1 flex items-center gap-2 select-none">
                <Calendar className="w-5 h-5 text-emerald-400" /> Chronological Twin History Logs
              </h3>
              <p className="text-xs text-slate-400 mb-6 max-w-xl select-none">
                Review and restore past digital twin states. Each snap represents a durable historical timestamp saved using strict security rules.
              </p>

              {historyTwins.length === 0 ? (
                <div className="text-center p-8 bg-slate-950/40 rounded-3xl border border-slate-800">
                  <Activity className="w-8 h-8 text-slate-705 mx-auto mb-2" />
                  <span className="text-xs text-slate-500 font-medium font-mono select-none">No historical snaps found. Click 'Commit Snapshot' to log your current Twin.</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {historyTwins.map((historic: CarbonTwinState) => (
                    <div key={historic.id} className="p-5 bg-slate-955 rounded-3xl border border-slate-850 flex flex-col justify-between hover:border-slate-800 transition-colors">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-mono text-slate-500 select-none">
                            Snap: {new Date(historic.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest px-1.5 py-0.5 bg-slate-950 rounded select-none">
                            Score: {historic.analysis.carbonScore}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-white truncate leading-none">
                          {historic.analysis.carbonPersonality}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 select-none leading-normal">
                          Commute: {historic.inputs.transportation} | Flights: {historic.inputs.domesticFlights} | Diet: {historic.inputs.foodDiet}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-850 flex justify-between items-center">
                        <button
                          onClick={() => handleLoadSavedSnapshot(historic)}
                          className="text-xs text-emerald-400 hover:text-white font-bold inline-flex items-center gap-1 cursor-pointer select-none"
                        >
                          👁️ Restore workspace
                        </button>
                        
                        <button
                          onClick={() => handleDeleteSnapshot(historic.id)}
                          disabled={isDeleting === historic.id}
                          className="text-xs text-slate-500 hover:text-rose-400 cursor-pointer disabled:opacity-50"
                          aria-label="Delete historic state"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* TAB 2: SETUP PARAMETERS FORM */}
        {activeTab === "form" && (
          <div className="space-y-4">
            <SetupTwinForm 
              initialInputs={userInputs}
              onSubmit={handleAnalyzeLifestyle}
              isAnalyzing={isAnalyzing}
            />
          </div>
        )}

        {/* TAB 3: LIVE AUTOMATED VALIDATION PANEL */}
        {activeTab === "testing" && (
          <VerificationSpecTests />
        )}

        {/* TAB 4: ARCHITECTURE BLUEPRINT VIEWER */}
        {activeTab === "documentation" && (
          <BlueprintsView />
        )}

      </main>

      {/* Styled Accessibility and Footer contract */}
      <AppFooter />

    </div>
  );
}
