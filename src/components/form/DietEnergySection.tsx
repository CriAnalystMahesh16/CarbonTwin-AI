import React from "react";
import { UserInputs } from "../../types";
import { Zap, ShoppingBag } from "lucide-react";

interface DietEnergyProps {
  foodDiet: UserInputs["foodDiet"];
  setFoodDiet: (v: UserInputs["foodDiet"]) => void;
  electricityUsage: number;
  setElectricityUsage: (v: number) => void;
  acUsage: UserInputs["acUsage"];
  setAcUsage: (v: UserInputs["acUsage"]) => void;
  applianceUsage: UserInputs["applianceUsage"];
  setApplianceUsage: (v: UserInputs["applianceUsage"]) => void;
  shoppingLevel: UserInputs["shoppingLevel"];
  setShoppingLevel: (v: UserInputs["shoppingLevel"]) => void;
  lifestyleGoals: string[];
  setLifestyleGoals: (v: string[]) => void;
}

const dietOptions = [
  { value: "vegan" as const, label: "Vegan Diet", desc: "No biological animal products or derivatives" },
  { value: "vegetarian" as const, label: "Vegetarian Diet", desc: "Dairy/eggs permitted, strictly no meats" },
  { value: "mixed" as const, label: "Mixed Balanced", desc: "Moderate intake of dairy, grains, poultry" },
  { value: "non-vegetarian" as const, label: "Non-Vegetarian", desc: "High consumption of meats & dairy products" },
];

const goalOptions = [
  { value: "reduce_emissions", label: "Minimize Carbon Intensity (~Zero Emission)", desc: "Commit to reducing total digital twin score" },
  { value: "save_money", label: "Maximize Financial Savings", desc: "Eco tips matched with financial/bill reductions" },
  { value: "sustainable_travel", label: "Ecological Adventure / Transit", desc: "Prioritize low-impact flights or rail alternatives" },
  { value: "sustainable_food", label: "Regenerative Diet Patterns", desc: "Focus on local farming and plant alternatives" },
];

export function DietEnergySection({
  foodDiet,
  setFoodDiet,
  electricityUsage,
  setElectricityUsage,
  acUsage,
  setAcUsage,
  applianceUsage,
  setApplianceUsage,
  shoppingLevel,
  setShoppingLevel,
  lifestyleGoals,
  setLifestyleGoals,
}: DietEnergyProps): React.JSX.Element {
  const handleGoalToggle = (goal: string): void => {
    if (lifestyleGoals.includes(goal)) {
      setLifestyleGoals(lifestyleGoals.filter((g) => g !== goal));
    } else {
      setLifestyleGoals([...lifestyleGoals, goal]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Nutritional Habits */}
      <fieldset className="space-y-6" aria-labelledby="nutritional-legend-panel">
        <legend className="text-sm font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-2" id="nutritional-legend-panel">
          03. Nutritional Habits
        </legend>

        <div>
          <label className="block text-xs text-slate-400 font-medium mb-3" id="diet-radios-label">
            Primary Diet Classification
          </label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3" role="radiogroup" aria-labelledby="diet-radios-label">
            {dietOptions.map((opt) => {
              const isSelected = foodDiet === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFoodDiet(opt.value)}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`${opt.label}: ${opt.desc}`}
                  className={`flex flex-col p-4 rounded-xl border text-left transition-all focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                    isSelected 
                      ? "bg-slate-950 border-emerald-500 text-emerald-400 ring-1 ring-emerald-500" 
                      : "bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                  style={{ minHeight: "84px" }}
                >
                  <span className="text-sm font-bold block">{opt.label}</span>
                  <span className="text-[10px] text-slate-500 mt-1 leading-normal">{opt.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </fieldset>

      {/* Household utilities */}
      <fieldset className="space-y-6 border-t border-slate-800 pt-8" aria-labelledby="utilities-legend-panel">
        <legend className="text-sm font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-2" id="utilities-legend-panel">
          04. Household utilities & Energy
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="eleckWhInput" className="block text-xs text-slate-300 font-medium mb-2">
              Monthly Electricity Consumption (kWh)
            </label>
            <div className="relative">
              <input
                id="eleckWhInput"
                type="number"
                min="0"
                max="5000"
                value={electricityUsage}
                onChange={(e) => setElectricityUsage(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              <Zap className="absolute right-3 top-3.5 w-4 h-4 text-emerald-500/50" aria-hidden="true" />
            </div>
          </div>

          <div>
            <label htmlFor="acUsageSelect" className="block text-xs text-slate-300 font-medium mb-2">
              HVAC / AC Running Frequency
            </label>
            <select
              id="acUsageSelect"
              value={acUsage}
              onChange={(e) => setAcUsage(e.target.value as UserInputs["acUsage"])}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="low">Low (Seasonal/Tuned Thermostat)</option>
              <option value="medium">Medium (Standard usage in summer)</option>
              <option value="high">High (Heavy ventilation & cooling)</option>
            </select>
          </div>

          <div>
            <label htmlFor="appraisalEfficiencySelect" className="block text-xs text-slate-300 font-medium mb-2">
              Appliance Efficiency Grade
            </label>
            <select
              id="appraisalEfficiencySelect"
              value={applianceUsage}
              onChange={(e) => setApplianceUsage(e.target.value as UserInputs["applianceUsage"])}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="efficient">EnergyStar Certified (Ultra-Efficient)</option>
              <option value="standard">Standard Domestic (Mix of grades)</option>
              <option value="high-demand">High Demand (Heavy server, heating pools)</option>
            </select>
          </div>
        </div>
      </fieldset>

      {/* Consumer Shopping */}
      <fieldset className="space-y-6 border-t border-slate-800 pt-8" aria-labelledby="shopping-legend-panel">
        <legend className="text-sm font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-2" id="shopping-legend-panel">
          05. Consumer Goods & Shopping
        </legend>

        <div>
          <label className="block text-xs text-slate-400 font-medium mb-3" id="shopping-level-label">
            Monthly Shopping Volume (Clothing, Tech, Goods)
          </label>
          <div className="grid grid-cols-3 gap-4" role="radiogroup" aria-labelledby="shopping-level-label">
            {(["low", "medium", "high"] as const).map((level) => {
              const isSelected = shoppingLevel === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setShoppingLevel(level)}
                  aria-checked={isSelected}
                  role="radio"
                  aria-label={`Shopping Level ${level}`}
                  className={`flex items-center justify-center p-4 rounded-xl border text-sm font-bold capitalize transition-all focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                    isSelected 
                      ? "bg-slate-950 border-emerald-500 text-emerald-400 ring-1 ring-emerald-500" 
                      : "bg-slate-950/40 border-slate-800 text-slate-350 hover:border-slate-700"
                  }`}
                  style={{ minHeight: "48px" }}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" aria-hidden="true" />
                  {level}
                </button>
              );
            })}
          </div>
        </div>
      </fieldset>

      {/* Lifestyle Motivations */}
      <fieldset className="space-y-6 border-t border-slate-800 pt-8" aria-labelledby="motivations-panel-legend">
        <legend className="text-sm font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-2" id="motivations-panel-legend">
          06. Ecological Ambitions
        </legend>

        <div>
          <label className="block text-xs text-slate-400 font-medium mb-3">
            Select Your Primary Motivations (Minimum 1)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goalOptions.map((opt) => {
              const isSelected = lifestyleGoals.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleGoalToggle(opt.value)}
                  className={`flex flex-col p-4 rounded-xl border text-left transition-all ${
                    isSelected 
                      ? "bg-slate-950 border-emerald-500 text-emerald-400 ring-2 ring-emerald-500/15" 
                      : "bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-750"
                  }`}
                  style={{ minHeight: "72px" }}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="rounded text-emerald-500 border-slate-700 bg-slate-900 w-4 h-4 mr-1 accent-emerald-500 focus:ring-0"
                    />
                    {opt.label}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 leading-normal ml-6">{opt.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </fieldset>
    </div>
  );
}
