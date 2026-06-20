import React from "react";
import { motion, Variants } from "motion/react";
import { Sliders } from "lucide-react";
import { CarbonTwinOutput } from "../../types";
import { ScoreCircularDial } from "./ScoreCircularDial";
import { StreakTrackerGrid } from "./StreakTrackerGrid";

interface SimulatorViewProps {
  twinAnalysis: CarbonTwinOutput;
  simulatedResults: {
    score: number;
    annual: number;
    reductionKg: number;
    savingsCash: number;
  };
  simulatedActions: Record<number, boolean>;
  onToggleSimulation: (index: number) => void;
  streakStatus: {
    currentStreak: number;
    lastCheckedIn: string | null;
    history: Record<string, boolean>;
  };
  onCheckIn: () => void;
  onResetStreak: () => void;
  onSimulateNextDay: () => void;
  getSimulatedDate: () => Date;
  formatFriendlyDate: (date: Date) => string;
  getLocalDateString: (date: Date) => string;
  cardVariants?: Variants;
}

export function SimulatorView({
  twinAnalysis,
  simulatedResults,
  simulatedActions,
  onToggleSimulation,
  streakStatus,
  onCheckIn,
  onResetStreak,
  onSimulateNextDay,
  getSimulatedDate,
  formatFriendlyDate,
  getLocalDateString,
  cardVariants,
}: SimulatorViewProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="simulation-panels-stage">
      {/* SCORE CARD & STREAK TRACKER COMPONENT DECOUPLING */}
      <div className="lg:col-span-4 space-y-8">
        <ScoreCircularDial
          twinAnalysis={twinAnalysis}
          simulatedResults={simulatedResults}
          cardVariants={cardVariants}
        />

        <StreakTrackerGrid
          twinAnalysis={twinAnalysis}
          simulatedActions={simulatedActions}
          streakStatus={streakStatus}
          onCheckIn={onCheckIn}
          onResetStreak={onResetStreak}
          onSimulateNextDay={onSimulateNextDay}
          getSimulatedDate={getSimulatedDate}
          formatFriendlyDate={formatFriendlyDate}
          getLocalDateString={getLocalDateString}
          cardVariants={cardVariants}
        />
      </div>

      {/* MITIGATION TILES CONTAINER - GRID SYSTEM */}
      <div className="lg:col-span-8 flex flex-col justify-between h-full space-y-8">
        <motion.div
          variants={cardVariants}
          className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-md"
          role="region"
          aria-labelledby="mitigation-simulator-stage-title"
        >
          <div>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h3 className="font-display font-semibold text-lg text-white flex items-center gap-2" id="mitigation-simulator-stage-title">
                <Sliders className="w-5 h-5 text-emerald-400" aria-hidden="true" /> Interactive Mitigation Simulator
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-950 px-2 py-1 rounded border border-slate-850 select-none">
                Continuous Mitigation Action Pipeline
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Toggle proposed actions below to recalculate your lifestyle twin metrics natively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {twinAnalysis.recommendations.map((rec, index) => {
              const isCommitted = !!simulatedActions[index];
              return (
                <div
                  key={index}
                  className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                    isCommitted
                      ? "bg-emerald-950/15 border-emerald-500/40 relative shadow-inner"
                      : "bg-slate-950/40 border-slate-800/80 hover:border-slate-750"
                  }`}
                  role="group"
                  aria-label={`Action: ${rec.actionName}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded select-none ${
                        rec.easeOfImplementation === "easy" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        rec.easeOfImplementation === "medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                        "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>
                        {rec.easeOfImplementation} Ease
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Avoids <strong className="text-white">{rec.co2Reduction}</strong>
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-white leading-normal">
                      {rec.actionName}
                    </h4>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 text-xs space-y-2 select-none">
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase block font-bold">Why Proposed</span>
                      <p className="text-slate-400 leading-relaxed mt-0.5">{rec.whySelected}</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-emerald-500 uppercase block font-bold">Action Vector Plan</span>
                      <p className="text-emerald-400/90 leading-relaxed font-semibold mt-0.5">{rec.implementationStep}</p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-850 flex justify-between items-center select-none">
                    <span className="text-xs font-semibold text-emerald-400">{rec.monetarySavings} Saved</span>
                    <button
                      onClick={() => onToggleSimulation(index)}
                      aria-pressed={isCommitted}
                      aria-label={isCommitted ? `Cancel mitigation commitment for: ${rec.actionName}` : `Commit to target mitigation: ${rec.actionName}`}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1 border select-none ${
                        isCommitted
                          ? "bg-emerald-500 text-slate-950 border-emerald-400 font-black"
                          : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 font-medium"
                      }`}
                    >
                      {isCommitted ? "Committed" : "Commit to Twin"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
