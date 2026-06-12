import React from "react";
import { motion } from "motion/react";
import { Award, TrendingDown, Sparkles, Zap, Sliders } from "lucide-react";
import { CarbonTwinOutput } from "../../types";

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
  cardVariants: any;
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
}: SimulatorViewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* SCORE CARD (LIVE SIMULATOR) & CONSISTENCY STREAK TRACKER */}
      <div className="lg:col-span-4 space-y-8">
        
        {/* CARD B: SCORE CARD (LIVE SIMULATOR) */}
        <motion.div
          variants={cardVariants}
          className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden shadow-md"
          role="region"
          aria-labelledby="simulator-card-title"
        >
          <div className="absolute top-3 left-3 flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-lg text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" aria-hidden="true" /> Realtime Simulator Loop
          </div>

          <div className="mt-8 relative flex items-center justify-center shrink-0 w-44 h-44">
            <svg 
              className="w-44 h-44 transform -rotate-90"
              role="img"
              aria-label="Circular progress visualization representing active carbon footprint rating"
              aria-describedby="score-graphic-desc"
            >
              <desc id="score-graphic-desc">
                Circular progress dial visualizes your current carbon intensity index score as {simulatedResults.score} out of 100, where zero is net sustainable.
              </desc>
              <circle
                cx="88"
                cy="88"
                r="80"
                className="stroke-slate-800 fill-none"
                strokeWidth="12"
              />
              <circle
                cx="88"
                cy="88"
                r="80"
                className="stroke-emerald-500 fill-none transition-all duration-1000 ease-out"
                strokeWidth="12"
                strokeDasharray="502"
                strokeDashoffset={502 - (502 * simulatedResults.score) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center" aria-live="polite">
              <span className="text-5xl font-display font-black text-white block tracking-tight leading-none" id="simulator-card-title">
                {simulatedResults.score}
              </span>
              <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider block mt-1.5">
                Intensity Score
              </span>
              <span className="sr-only">Your customized Carbon Score and Sustainability Score is currently calculated as {simulatedResults.score} out of 100 points.</span>
            </div>
          </div>

          <div className="w-full mt-6 space-y-4">
            <div className="text-center">
              <h4 className="text-xs font-semibold uppercase text-slate-300 tracking-wider mb-1">
                Twin Carbon Health Index
              </h4>
              <p className="text-[11px] text-slate-400 leading-normal">
                Target 0 (net zero) and reduce from 100. Commit recommended mitigations in the simulation center below to see this score lower!
              </p>
            </div>

            <div className="pt-2 border-t border-slate-850">
              <div className="flex justify-between text-[11px] font-bold mb-1.5">
                <span className="text-slate-500 uppercase tracking-tighter">Emission Status</span>
                <span className={
                  twinAnalysis.riskLevel === "Critical" ? "text-rose-500" :
                  twinAnalysis.riskLevel === "High" ? "text-amber-500" :
                  "text-emerald-400"
                }>
                  <span className="sr-only">Status rating is </span>● {twinAnalysis.riskLevel} Risk
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    twinAnalysis.riskLevel === "Critical" ? "bg-rose-500" :
                    twinAnalysis.riskLevel === "High" ? "bg-amber-500" :
                    "bg-emerald-500"
                  }`}
                  style={{
                    width: twinAnalysis.riskLevel === "Critical" ? "95%" :
                           twinAnalysis.riskLevel === "High" ? "75%" :
                           twinAnalysis.riskLevel === "Medium" ? "50%" : "25%"
                  }}
                  role="progressbar"
                  aria-valuenow={
                    twinAnalysis.riskLevel === "Critical" ? 95 :
                    twinAnalysis.riskLevel === "High" ? 75 :
                    twinAnalysis.riskLevel === "Medium" ? 50 : 25
                  }
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Dynamic carbon risk value level bar indicator"
                />
              </div>
            </div>

            {simulatedResults.reductionKg > 0 && (
              <div 
                className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1 animate-fadeIn text-center"
                aria-live="polite"
              >
                <span className="text-[10px] text-emerald-400 uppercase font-black block tracking-widest">Active Reduction Commits</span>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white font-medium flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                    -{simulatedResults.reductionKg} kg CO2e
                  </span>
                  <span className="text-emerald-400 font-bold">
                    +{simulatedResults.savingsCash ? `$${simulatedResults.savingsCash}/yr` : "No cost"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* CARD C: CONSISTENCY STREAK TRACKER */}
        <motion.div
          variants={cardVariants}
          className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group shadow-md space-y-4"
          role="region"
          aria-labelledby="streak-tracker-title"
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-emerald-500 uppercase tracking-widest font-black flex items-center gap-1.5 select-none" id="streak-tracker-title">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> Habits & Consistency
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-slate-950 text-slate-450 border border-slate-800 select-none">
              Streak Engine
            </span>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60 relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 translate-x-4 -translate-y-4 text-emerald-400 select-none pointer-events-none">
              <Zap className="w-20 h-20 fill-emerald-500" aria-hidden="true" />
            </div>

            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <span className="text-2xl animate-bounce" role="img" aria-label="Flame icon indicating checkin streak">🔥</span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-baseline gap-1.5" aria-live="polite">
                  <span className="text-3xl font-display font-black text-white tracking-tight leading-none">
                    {streakStatus.currentStreak}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    {streakStatus.currentStreak === 1 ? "Day Streak" : "Days Streak"}
                  </span>
                </div>
                {streakStatus.currentStreak >= 7 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-400 text-slate-950 rounded-full text-[9px] font-black uppercase tracking-wider select-none animate-pulse" role="alert">
                    🏆 7-Day Milestone achieved!
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none mt-1.5 select-none" aria-label={`Last check-in recorded on ${streakStatus.lastCheckedIn || 'no date'}`}>
                Last check-in: {streakStatus.lastCheckedIn ? formatFriendlyDate(new Date(streakStatus.lastCheckedIn.replace(/-/g, "/"))) : "Never checked in"}
              </p>
            </div>
                    {/* Weekly Grid */}
          <div className="bg-slate-955 p-3 rounded-2xl border border-slate-850/50" role="group" aria-label="Weekly commitment tracking grid">
            <p className="text-[9px] text-slate-500 uppercase tracking-wider font-extrabold text-center mb-1.5 select-none" id="weekly-cal-label">Weekly Commitment Calendar</p>
            {(() => {
              const today = getSimulatedDate();
              const days = [];
              for (let i = 5; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                const dateStr = getLocalDateString(d);
                const dayName = d.toLocaleDateString("en-US", { weekday: "narrow" });
                const isCompleted = !!streakStatus.history[dateStr];
                const isToday = i === 0;
                days.push({ dayName, isCompleted, isToday, dateStr });
              }
              return (
                <div className="flex justify-around items-center gap-1 py-0.5" aria-describedby="weekly-cal-label">
                  {days.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1.5">
                      <span className={`text-[10px] font-mono leading-none ${item.isToday ? "text-emerald-400 font-bold" : "text-slate-500"}`}>
                        {item.dayName}
                      </span>
                      <div
                        title={item.isCompleted ? `Verified completed check-in: ${item.dateStr}` : `Pending verification: ${item.dateStr}`}
                        aria-label={`${item.dayName} (${item.dateStr}): ${item.isCompleted ? "Completed" : "Pending"}`}
                        className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all text-xs font-semibold select-none ${
                          item.isCompleted
                            ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold shadow-sm"
                            : item.isToday
                              ? "bg-slate-950 border-emerald-500/25 text-slate-600 border-dashed animate-pulse"
                              : "bg-slate-950 border-slate-850 text-slate-850"
                        }`}
                      >
                        {item.isCompleted ? "✓" : "•"}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Habit Checkins */}
          <div className="space-y-2 text-xs text-slate-400" role="region" aria-labelledby="habits-checkoff-label">
            <span className="text-[9px] text-slate-500 uppercase font-bold block tracking-wider select-none" id="habits-checkoff-label">Today's Habits Check-off</span>
            
            {(() => {
              const activeRecs = twinAnalysis.recommendations.filter((rec, idx) => simulatedActions[idx]);
              if (activeRecs.length === 0) {
                return (
                  <div className="p-3.5 bg-slate-950/45 rounded-2xl border border-slate-850 text-center">
                    <p className="text-[11px] text-amber-500/90 font-semibold mb-1">No sustainable commitments selected.</p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Commit to actions in the <strong className="text-slate-400">Simulator</strong> below to start your streak!
                    </p>
                  </div>
                );
              }
              
              const simDate = getSimulatedDate();
              const todayStr = getLocalDateString(simDate);
              const isCheckedInToday = streakStatus.lastCheckedIn === todayStr;

              return (
                <div className="space-y-3">
                  <div className="max-h-[140px] overflow-y-auto space-y-1.5 pr-1 select-none" role="group" aria-label="Commitment habit items checklist">
                    {activeRecs.map((rec, idx) => (
                      <div key={idx} className="flex justify-between items-center gap-2.5 p-2 px-3 bg-slate-950/35 rounded-xl border border-slate-800/40 text-[11px]">
                        <span className="font-semibold text-slate-350 truncate max-w-[150px]">{rec.actionName}</span>
                        <span className={`shrink-0 flex items-center gap-1 ${isCheckedInToday ? "text-emerald-400" : "text-amber-500/90"} font-bold text-[10px] uppercase`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isCheckedInToday ? "bg-emerald-500" : "bg-amber-500"}`} aria-hidden="true" />
                          {isCheckedInToday ? "Maintained" : "Pending"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={onCheckIn}
                    disabled={isCheckedInToday}
                    aria-label={isCheckedInToday ? "Already checked in and logged maintained habits today" : "Submit habit check-in for active commitments"}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer text-center select-none ${
                      isCheckedInToday
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-not-allowed font-semibold"
                        : "bg-emerald-500 text-slate-950 hover:bg-emerald-450 border border-emerald-400 font-black shadow-sm"
                    }`}
                  >
                    {isCheckedInToday ? "✓ Checked In for Today" : "Submit Habit Check-In"}
                  </button>
                </div>
              );
            })()}
          </div>

          {/* Time Machine Sandbox controls */}
          <div className="bg-slate-955 p-3.5 rounded-2xl border border-slate-800/80 space-y-2.5" role="region" aria-labelledby="time-machine-title">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 leading-none select-none">
              <span id="time-machine-title">VIRTUAL TIME MACHINE</span>
              <button 
                onClick={onResetStreak} 
                aria-label="Reset simulation history state and streak calendar"
                className="text-slate-550 hover:text-rose-455 transition-colors uppercase select-none font-bold cursor-pointer"
              >
                Reset
              </button>
            </div>

            <div className="flex justify-between items-center bg-slate-90/50 p-2.5 rounded-xl border border-slate-800/60 leading-none">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-medium mb-1 select-none">Virtual Target Date:</span>
                <span className="text-xs text-slate-355 font-mono font-bold leading-normal">{formatFriendlyDate(getSimulatedDate())}</span>
              </div>
              <button
                onClick={onSimulateNextDay}
                title="Simulate passing of 24 hours"
                aria-label="Advance virtual clock by one day forward"
                className="bg-slate-950 hover:bg-slate-900 border border-slate-805 text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all select-none cursor-pointer"
              >
                +1 Day ⏩
              </button>
            </div>
          </div>          </div>
        </motion.div>

      </div>

      {/* THREE ACTIVE SIMULATION TILES IN THE REMAINING AREA OF THE BENTO GRID */}
      <div className="lg:col-span-8 flex flex-col justify-between h-full space-y-8">
        <motion.div
          variants={cardVariants}
          className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-md"
          role="region"
          aria-labelledby="mitigation-simulator-title"
        >
          <div>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h3 className="font-display font-semibold text-lg text-white flex items-center gap-2" id="mitigation-simulator-title">
                <Sliders className="w-5 h-5 text-emerald-400" aria-hidden="true" /> Interactive Mitigation Simulator
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-950 px-2 py-1 rounded border border-slate-800">
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
                      <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
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

                    <h4 className="font-bold text-sm text-white">
                      {rec.actionName}
                    </h4>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 text-xs space-y-2">
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase block font-bold">Why Proposed</span>
                      <p className="text-slate-400 leading-relaxed mt-0.5">{rec.whySelected}</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-emerald-500 uppercase block font-bold">Action Vector Plan</span>
                      <p className="text-emerald-400/90 leading-relaxed font-semibold mt-0.5">{rec.implementationStep}</p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-850 flex justify-between items-center">
                    <span className="text-xs font-semibold text-emerald-400">{rec.monetarySavings} Saved</span>
                    <button
                      onClick={() => onToggleSimulation(index)}
                      aria-pressed={isCommitted}
                      aria-label={isCommitted ? `Cancel mitigation commitment for: ${rec.actionName}` : `Commit to target mitigation: ${rec.actionName}`}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1 border select-none ${
                        isCommitted
                          ? "bg-emerald-500 text-slate-950 border-emerald-400 font-black"
                          : "bg-slate-905 border-slate-800 text-slate-300 hover:border-slate-700 font-medium"
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
