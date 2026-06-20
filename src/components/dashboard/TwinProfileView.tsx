import React from "react";
import { motion, Variants } from "motion/react";
import { Leaf, Award } from "lucide-react";
import { UserInputs, CarbonTwinOutput } from "../../types";

interface TwinProfileViewProps {
  userInputs: UserInputs;
  twinAnalysis: CarbonTwinOutput;
  cardVariants?: Variants;
}

export function TwinProfileView({ userInputs, twinAnalysis, cardVariants }: TwinProfileViewProps) {
  return (
    <motion.div 
      variants={cardVariants}
      className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group shadow-md"
    >
      <div className="absolute right-3 top-3 opacity-[0.04] text-emerald-500 pointer-events-none">
        <Leaf className="w-36 h-36" aria-hidden="true" />
      </div>
      
      <div className="space-y-3 z-10 relative">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-emerald-500 uppercase tracking-widest font-black">Carbon Personality</span>
          <span className="px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-slate-950 text-emerald-400 border border-slate-800">
            Twin Active
          </span>
        </div>
        <h3 className="font-display font-bold text-3xl text-white tracking-tight" id="profile-personality-title">
          {twinAnalysis.carbonPersonality}
        </h3>
        <p className="sr-only">
          Your active carbon personality is {twinAnalysis.carbonPersonality}. Stated diet is {userInputs.foodDiet} and primary transit mode is {userInputs.transportation}.
        </p>
        <p className="text-xs text-slate-400 leading-relaxed">
          Identified based on travel frequencies and energy coefficients.
        </p>

        <div className="flex gap-2 flex-wrap pt-2" aria-label="Selected parameters">
          <span className="px-2.5 py-1 bg-slate-950 rounded text-[10px] font-mono text-slate-300 border border-slate-800">
            Diet: {userInputs.foodDiet}
          </span>
          <span className="px-2.5 py-1 bg-slate-950 rounded text-[10px] font-mono text-slate-300 border border-slate-800">
            Transit: {userInputs.transportation}
          </span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-500 uppercase block font-medium">Lifestyle Risk</span>
          <span className={`text-xs font-bold ${
            twinAnalysis.riskLevel === "Critical" ? "text-rose-500" :
            twinAnalysis.riskLevel === "High" ? "text-amber-500" :
            "text-emerald-400"
          }`}>
            ● {twinAnalysis.riskLevel} Emission
          </span>
          <span className="sr-only">Enforced current emission level status: {twinAnalysis.riskLevel} Risk.</span>
        </div>
        <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-slate-400">
          <Award className="w-4 h-4 text-emerald-400" aria-hidden="true" />
        </div>
      </div>
    </motion.div>
  );
}
