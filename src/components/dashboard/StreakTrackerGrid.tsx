import React from "react";
import { motion, Variants } from "motion/react";
import { Sparkles, Zap } from "lucide-react";
import { CarbonTwinOutput } from "../../types";

interface StreakTrackerGridProps {
  twinAnalysis: CarbonTwinOutput;
  simulatedActions: Record<number, boolean>;
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

export function StreakTrackerGrid({
  twinAnalysis,
  simulatedActions,
  streakStatus,
  onCheckIn,
  onResetStreak,
  onSimulateNextDay,
  getSimulatedDate,
  formatFriendlyDate,
  getLocalDateString,
  cardVariants,
}: StreakTrackerGridProps): React.JSX.Element {
  return (
    <motion.div
      variants={cardVariants}
      className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group shadow-md space-y-4"
      role="region"
      aria-labelledby="streak-tracker-title-node"
    >
      <div className="flex justify-between items-center select-none">
        <span className="text-[10px] text-emerald-500 uppercase tracking-widest font-black flex items-center gap-1.5" id="streak-tracker-title-node">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> Habits & Consistency
        </span>
        <span className="px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-slate-950 text-slate-400 border border-slate-800">
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
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 select-none">
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
      </div>

      {/* Weekly Grid */}
      <div className="p-3 rounded-2xl border border-slate-850/50" role="group" aria-label="Weekly commitment tracking grid">
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
                          : "bg-slate-950 border-slate-850 text-slate-800"
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
      <div className="space-y-2 text-xs text-slate-400" role="region" aria-labelledby="habits-check-label">
        <span className="text-[9px] text-slate-500 uppercase font-bold block tracking-wider select-none" id="habits-check-label">Today's Habits Check-off</span>
        
        {(() => {
          const activeRecs = twinAnalysis.recommendations.filter((rec, idx) => simulatedActions[idx]);
          if (activeRecs.length === 0) {
            return (
              <div className="p-3.5 bg-slate-950/45 rounded-2xl border border-slate-850 text-center select-none">
                <p className="text-[11px] text-amber-500/90 font-semibold mb-1">No sustainable commitments selected.</p>
                <p className="text-[10px] text-slate-500 font-medium">
                  Commit to actions in the <strong className="text-slate-450">Simulator</strong> below to start your streak!
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
                  <div key={idx} className="flex justify-between items-center gap-2.5 p-2 px-3 bg-slate-950/35 rounded-xl border border-slate-900 text-[11px]">
                    <span className="font-semibold text-slate-300 truncate max-w-[150px]">{rec.actionName}</span>
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
                    : "bg-emerald-500 text-slate-950 hover:bg-emerald-400 border border-emerald-400 font-black shadow-sm"
                }`}
              >
                {isCheckedInToday ? "✓ Checked In for Today" : "Submit Habit Check-In"}
              </button>
            </div>
          );
        })()}
      </div>

      {/* Time Machine Sandbox controls */}
      <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-slate-850 space-y-2.5 animate-fadeIn" role="region" aria-labelledby="time-machine-title-node">
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 leading-none select-none">
          <span id="time-machine-title-node">VIRTUAL TIME MACHINE</span>
          <button 
            onClick={onResetStreak} 
            aria-label="Reset simulation history state and streak calendar"
            className="text-slate-500 hover:text-rose-400 transition-colors uppercase select-none font-bold cursor-pointer"
          >
            Reset
          </button>
        </div>

        <div className="flex justify-between items-center p-2.5 rounded-xl border border-slate-900 leading-none bg-slate-950/20">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-medium mb-1 select-none">Virtual Target Date:</span>
            <span className="text-xs text-slate-350 font-mono font-bold leading-normal">{formatFriendlyDate(getSimulatedDate())}</span>
          </div>
          <button
            onClick={onSimulateNextDay}
            title="Simulate passing of 24 hours"
            aria-label="Advance virtual clock by one day forward"
            className="bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all select-none cursor-pointer"
          >
            +1 Day ⏩
          </button>
        </div>
      </div>
    </motion.div>
  );
}
