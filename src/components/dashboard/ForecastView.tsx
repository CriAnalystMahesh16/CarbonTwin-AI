import React from "react";
import { motion } from "motion/react";
import { Activity, Calendar, Layers, Zap } from "lucide-react";
import { UserInputs, CarbonTwinOutput } from "../../types";

interface ForecastViewProps {
  userInputs: UserInputs;
  twinAnalysis: CarbonTwinOutput;
  simulatedResults: {
    score: number;
    annual: number;
    reductionKg: number;
    savingsCash: number;
  };
  simulatedActions: Record<number, boolean>;
  onToggleSimulation: (index: number) => void;
  cardVariants: any;
}

export function ForecastView({
  userInputs,
  twinAnalysis,
  simulatedResults,
  simulatedActions,
  onToggleSimulation,
  cardVariants,
}: ForecastViewProps) {
  const maxVal = Math.max(
    twinAnalysis.emissionBreakdown.flights,
    twinAnalysis.emissionBreakdown.transportation,
    twinAnalysis.emissionBreakdown.food,
    twinAnalysis.emissionBreakdown.energy,
    twinAnalysis.emissionBreakdown.shopping,
    1000
  );

  const fallbackBreakdownSummary = `Annual carbon emissions category distribution visualization: Air Travel/Flights accounts for ${twinAnalysis.emissionBreakdown.flights} kg CO2e; Daily Ground Transit accounts for ${twinAnalysis.emissionBreakdown.transportation} kg CO2e; Nutritional Diet Footprint accounts for ${twinAnalysis.emissionBreakdown.food} kg CO2e; Domestic Utility Energy accounts for ${twinAnalysis.emissionBreakdown.energy} kg CO2e; Discretionary Shopping accounts for ${twinAnalysis.emissionBreakdown.shopping} kg CO2e.`;

  const fallbackForecastSummary = `Carbon twin forecast timeline: 30-day projected accumulation is ${twinAnalysis.forecast30Days}; 90-day projected accumulation is ${twinAnalysis.forecast90Days}; adjusted overall annual forecast is ${simulatedResults.annual.toLocaleString()} kg CO2e.`;

  return (
    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* 1. EMISSION SOURCE CATEGORIC BREAKDOWN BAR CHARTS */}
      <motion.div
        variants={cardVariants}
        className="md:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col justify-between shadow-md"
        role="region"
        aria-labelledby="intensity-breakdown-title"
      >
        <div>
          <h3 className="font-display font-bold text-xl text-white mb-1 flex items-center gap-2" id="intensity-breakdown-title">
            <Activity className="w-5 h-5 text-emerald-400" aria-hidden="true" /> Category Breakdown Intensity
          </h3>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed" id="intensity-breakdown-desc">
            Annual weight measurements in standard kg CO2e calculations.
          </p>

          {/* Screen Reader Fallback for Charts */}
          <div className="sr-only" id="intensity-charts-fallback">
            {fallbackBreakdownSummary}
          </div>

          <div className="space-y-4" role="list" aria-describedby="intensity-charts-fallback" aria-label="Visual breakdown values">
            {[
              { key: "flights", label: "Air Travel / Flights", val: twinAnalysis.emissionBreakdown.flights, color: "bg-rose-500" },
              { key: "transportation", label: "Daily Ground Transit", val: twinAnalysis.emissionBreakdown.transportation, color: "bg-teal-500" },
              { key: "food", label: "Nutritional Footprint", val: twinAnalysis.emissionBreakdown.food, color: "bg-amber-500" },
              { key: "energy", label: "Domestic Utility Energy", val: twinAnalysis.emissionBreakdown.energy, color: "bg-indigo-500" },
              { key: "shopping", label: "Discretionary Shopping", val: twinAnalysis.emissionBreakdown.shopping, color: "bg-purple-500" },
            ].map((row) => {
              const widthPercent = `${Math.round((row.val / maxVal) * 100)}%`;
              return (
                <div key={row.key} className="space-y-1.5" role="listitem">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${row.color}`} aria-hidden="true" />
                      {row.label}
                    </span>
                    <span className="text-slate-400 font-mono font-bold">{row.val.toLocaleString()} kg CO2e</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${row.color} rounded-full transition-all duration-1000`}
                      style={{ width: widthPercent }}
                      role="progressbar"
                      aria-valuenow={row.val}
                      aria-valuemin={0}
                      aria-valuemax={maxVal}
                      aria-label={`${row.label} intensity chart`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 border-t border-slate-850 pt-4 text-[10px] text-slate-500 select-none flex justify-between gap-4">
          <span>Flight: International ~1.5 kg/mile, Domestic ~0.25 kg/mile</span>
          <span>Gas commute auto ~0.36 kg/mile</span>
        </div>
      </motion.div>

      {/* 2. EMISSION FORECAST CARD */}
      <motion.div
        variants={cardVariants}
        className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col justify-between shadow-md"
        role="region"
        aria-labelledby="forecast-panels-title"
      >
        <div className="space-y-4">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block" id="forecast-panels-title">Future Forecast Panels</span>

          {/* Screen Reader Fallback for Projections */}
          <div className="sr-only" id="forecast-charts-fallback">
            {fallbackForecastSummary}
          </div>

          <div className="space-y-3" aria-describedby="forecast-charts-fallback">
            <div className="flex justify-between items-center bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" /> 30-Day Outlook
              </span>
              <span className="text-xs text-slate-200 font-mono font-bold">
                {twinAnalysis.forecast30Days}
              </span>
            </div>

            <div className="flex justify-between items-center bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-teal-400" aria-hidden="true" /> 90-Day Outlook
              </span>
              <span className="text-xs text-slate-200 font-mono font-bold">
                {twinAnalysis.forecast90Days}
              </span>
            </div>

            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" /> Projected Annual
              </span>
              <span className="text-xs text-emerald-400 font-mono font-black" aria-live="polite" aria-label="Projected Annual Total Emissions">
                {simulatedResults.annual.toLocaleString()} kg CO2e
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-[10px] text-slate-500 leading-normal bg-slate-950/20 px-2 py-1 rounded">
          Based on {userInputs.transportation} commuting & {userInputs.domesticFlights + userInputs.internationalFlights} yearly flights.
        </div>
      </motion.div>

      {/* 3. FEATURED HIGH IMPACT RECOMMENDATION PANEL */}
      <motion.div
        variants={cardVariants}
        className="bg-emerald-500 border border-emerald-400 rounded-3xl p-6 flex flex-col justify-between text-slate-950 shadow-lg relative overflow-hidden"
        role="region"
        aria-labelledby="high-impact-action-title"
      >
        <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none text-slate-950">
          <Zap className="w-48 h-48" aria-hidden="true" />
        </div>

        <div className="space-y-4">
          <span className="inline-flex items-center gap-1.5 p-1 px-2.5 bg-slate-950 border border-slate-800 rounded-full text-[9px] font-black text-emerald-400 uppercase tracking-widest leading-none">
            <Zap className="w-3 h-3 fill-emerald-400" aria-hidden="true" /> High Impact Action
          </span>

          <div className="space-y-1">
            <h4 className="text-xl font-black tracking-tight leading-tight" id="high-impact-action-title">
              {twinAnalysis.recommendations[0]?.actionName || "Optimize Commute Patterns"}
            </h4>
            <p className="text-xs font-medium leading-relaxed text-slate-900 opacity-90">
              {twinAnalysis.recommendations[0]?.whySelected || "Identified as your absolute prime carbon mitigation vector today."}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-950/15 flex justify-between items-end">
          <div>
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-800 block">EST. SAVINGS</span>
            <span className="text-lg font-black leading-none">{twinAnalysis.recommendations[0]?.monetarySavings || "$850/yr"}</span>
          </div>

          <button
            onClick={() => onToggleSimulation(0)}
            aria-pressed={!!simulatedActions[0]}
            aria-label={simulatedActions[0] ? `Remove commitment for: ${twinAnalysis.recommendations[0]?.actionName || "Optimize Commute"}` : `Commit to action: ${twinAnalysis.recommendations[0]?.actionName || "Optimize Commute"}`}
            className={`px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer border ${
              simulatedActions[0]
                ? "bg-slate-950 text-emerald-400 border-slate-800"
                : "bg-slate-900 text-white hover:bg-slate-950 border-slate-800 shadow"
            }`}
          >
            {simulatedActions[0] ? "✓ Committed" : "Commit to Twin"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
