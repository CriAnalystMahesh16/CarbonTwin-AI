import React from "react";
import { motion, Variants } from "motion/react";
import { TrendingDown } from "lucide-react";
import { CarbonTwinOutput } from "../../types";

interface ScoreCircularDialProps {
  twinAnalysis: CarbonTwinOutput;
  simulatedResults: {
    score: number;
    annual: number;
    reductionKg: number;
    savingsCash: number;
  };
  cardVariants?: Variants;
}

export function ScoreCircularDial({
  twinAnalysis,
  simulatedResults,
  cardVariants,
}: ScoreCircularDialProps): React.JSX.Element {
  return (
    <motion.div
      variants={cardVariants}
      className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden shadow-md"
      role="region"
      aria-labelledby="simulator-card-title-node"
    >
      <div className="absolute top-3 left-3 flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-lg text-[9px] font-bold text-slate-400 uppercase tracking-widest select-none">
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" aria-hidden="true" /> Realtime Simulator Loop
      </div>

      <div className="mt-8 relative flex items-center justify-center shrink-0 w-44 h-44">
        <svg 
          className="w-44 h-44 transform -rotate-90"
          role="img"
          aria-label="Circular progress visualization representing active carbon footprint rating"
          aria-describedby="score-graphic-desc-node"
        >
          <desc id="score-graphic-desc-node">
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
          <span className="text-5xl font-display font-black text-white block tracking-tight leading-none" id="simulator-card-title-node">
            {simulatedResults.score}
          </span>
          <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider block mt-1.5 selection:bg-emerald-500">
            Intensity Score
          </span>
          <span className="sr-only">Your customized Carbon Score and Sustainability Score is currently calculated as {simulatedResults.score} out of 100 points.</span>
        </div>
      </div>

      <div className="w-full mt-6 space-y-4">
        <div className="text-center select-none">
          <h4 className="text-xs font-semibold uppercase text-slate-300 tracking-wider mb-1">
            Twin Carbon Health Index
          </h4>
          <p className="text-[11px] text-slate-400 leading-normal">
            Target 0 (net zero) and reduce from 100. Commit recommended mitigations in the simulation center below to see this score lower!
          </p>
        </div>

        <div className="pt-2 border-t border-slate-850">
          <div className="flex justify-between text-[11px] font-bold mb-1.5 select-none">
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
            className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1 animate-fadeIn text-center select-none"
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
  );
}
