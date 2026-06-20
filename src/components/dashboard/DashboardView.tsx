import React from "react";
import { motion, Variants } from "motion/react";
import { TwinProfileView } from "./TwinProfileView";
import { ForecastView } from "./ForecastView";
import { UserInputs, CarbonTwinOutput } from "../../types";

interface DashboardViewProps {
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
  cardVariants?: Variants;
}

export function DashboardView({
  userInputs,
  twinAnalysis,
  simulatedResults,
  simulatedActions,
  onToggleSimulation,
  cardVariants,
}: DashboardViewProps) {
  return (
    <motion.div
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
    >
      {/* TOP DIAGNOSIS GRID: 12 COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: PERSONALITY CARD (spans 4 columns) */}
        <div className="lg:col-span-4">
          <TwinProfileView
            userInputs={userInputs}
            twinAnalysis={twinAnalysis}
            cardVariants={cardVariants}
          />
        </div>

        {/* RIGHT COLUMN: DISTRIBUTION, PROJECTIONS, HIGH-IMPACT (spans 8 columns) */}
        <ForecastView
          userInputs={userInputs}
          twinAnalysis={twinAnalysis}
          simulatedResults={simulatedResults}
          simulatedActions={simulatedActions}
          onToggleSimulation={onToggleSimulation}
          cardVariants={cardVariants}
        />
      </div>
    </motion.div>
  );
}
