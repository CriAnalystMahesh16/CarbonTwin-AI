import React, { useState } from "react";
import { UserInputs } from "../types";
import { 
  Car, Bike, Bus, Train, Footprints, 
  Plane, Sliders, ShoppingBag, Leaf, HelpCircle, ArrowRight, ShieldCheck, Dumbbell, Zap, HelpCircle as QuestionIcon
} from "lucide-react";

interface SetupTwinFormProps {
  initialInputs?: UserInputs | null;
  onSubmit: (inputs: UserInputs) => void;
  isAnalyzing: boolean;
}

const transportOptions = [
  { value: "car", label: "Car Commute", icon: Car, desc: "Personal gasoline or EV car" },
  { value: "bike", label: "Bicycle / Active", icon: Bike, desc: "Biking, walking, non-motorized" },
  { value: "bus", label: "Bus Commuter", icon: Bus, desc: "Standard public transit network" },
  { value: "metro", label: "Rail / Metro", icon: Train, desc: "High-speed rail, light rail, subway" },
  { value: "walking", label: "Walking Only", icon: Footprints, desc: "Strict footprint active walk" },
];

const dietOptions = [
  { value: "vegan", label: "Vegan Diet", desc: "No biological animal products or derivatives" },
  { value: "vegetarian", label: "Vegetarian Diet", desc: "Dairy/eggs permitted, strictly no meats" },
  { value: "mixed", label: "Mixed Balanced", desc: "Moderate intake of dairy, grains, poultry" },
  { value: "non-vegetarian", label: "Non-Vegetarian", desc: "High consumption of meats & dairy products" },
];

const goalOptions = [
  { value: "reduce_emissions", label: "Minimize Carbon Intensity (~Zero Emision)", desc: "Commit to reducing total digital twin score" },
  { value: "save_money", label: "Maximize Financial Savings", desc: "Eco tips matched with financial/bill reductions" },
  { value: "sustainable_travel", label: "Ecological Adventure / Transit", desc: "Prioritize low-impact flights or rail alternatives" },
  { value: "sustainable_food", label: "Regenerative Diet Patterns", desc: "Focus on local farming and plant alternatives" },
];

export function SetupTwinForm({ initialInputs, onSubmit, isAnalyzing }: SetupTwinFormProps) {
  const [transport, setTransport] = useState<UserInputs["transportation"]>(initialInputs?.transportation || "car");
  const [carMileage, setCarMileage] = useState<number>(initialInputs?.carMileage || 12000);
  const [carType, setCarType] = useState<UserInputs["carType"]>(initialInputs?.carType || "gas");
  const [domesticFlights, setDomesticFlights] = useState<number>(initialInputs?.domesticFlights || 2);
  const [internationalFlights, setInternationalFlights] = useState<number>(initialInputs?.internationalFlights || 1);
  const [flightClass, setFlightClass] = useState<UserInputs["flightClass"]>(initialInputs?.flightClass || "economy");
  const [foodDiet, setFoodDiet] = useState<UserInputs["foodDiet"]>(initialInputs?.foodDiet || "mixed");
  const [electricityUsage, setElectricityUsage] = useState<number>(initialInputs?.electricityUsage || 350);
  const [acUsage, setAcUsage] = useState<UserInputs["acUsage"]>(initialInputs?.acUsage || "medium");
  const [applianceUsage, setApplianceUsage] = useState<UserInputs["applianceUsage"]>(initialInputs?.applianceUsage || "standard");
  const [shoppingLevel, setShoppingLevel] = useState<UserInputs["shoppingLevel"]>(initialInputs?.shoppingLevel || "medium");
  const [lifestyleGoals, setLifestyleGoals] = useState<string[]>(initialInputs?.lifestyleGoals || ["reduce_emissions"]);

  const handleGoalToggle = (goal: string) => {
    if (lifestyleGoals.includes(goal)) {
      setLifestyleGoals(lifestyleGoals.filter(g => g !== goal));
    } else {
      setLifestyleGoals([...lifestyleGoals, goal]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      transportation: transport,
      carMileage: transport === "car" ? Number(carMileage) : undefined,
      carType: transport === "car" ? carType : undefined,
      domesticFlights: Number(domesticFlights),
      internationalFlights: Number(internationalFlights),
      flightClass,
      foodDiet,
      electricityUsage: Number(electricityUsage),
      acUsage,
      applianceUsage,
      shoppingLevel,
      lifestyleGoals,
    });
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-12 bg-slate-900 border border-slate-850 p-6 md:p-10 rounded-2xl shadow-xl max-w-4xl mx-auto font-sans select-none text-slate-100">
      <div className="border-b border-slate-800 pb-6">
        <h2 className="text-2xl font-bold font-display tracking-tight text-white flex items-center gap-2" id="form-heading">
          <Leaf className="w-6 h-6 text-emerald-400" aria-hidden="true" /> Specify Your Lifestyle Twin Parameters
        </h2>
        <p className="text-slate-400 text-xs mt-1">
          These inputs configure your initial digital replica. CarbonTwin AI evaluates this context to predict emissions and recommend changes.
        </p>
      </div>

      {/* BLOCK 1: Daily Transit & Commuting */}
      <fieldset className="space-y-6" aria-labelledby="transit-legend">
        <legend className="text-sm font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-2" id="transit-legend">
          01. Transit & Commuting Parameters
        </legend>
        
        <div>
          <label className="block text-xs text-slate-400 font-medium mb-3" id="transit-options-label">
            Primary Transportation Choice
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3" role="radiogroup" aria-labelledby="transit-options-label">
            {transportOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = transport === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTransport(opt.value as any)}
                  aria-checked={isSelected}
                  aria-label={`${opt.label}: ${opt.desc}`}
                  role="radio"
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                    isSelected 
                      ? "bg-slate-950 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-400" 
                      : "bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                  style={{ minHeight: "80px" }} // WCAG Touch target
                >
                  <Icon className={`w-6 h-6 mb-2 ${isSelected ? "text-emerald-400" : "text-slate-500"}`} aria-hidden="true" />
                  <span className="text-xs font-semibold">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {transport === "car" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-950/40 border border-slate-850 rounded-xl animate-fadeIn">
            <div>
              <label htmlFor="carMileage" className="block text-xs text-slate-300 font-medium mb-2">
                Annual Auto Mileage (Miles)
              </label>
              <input
                id="carMileage"
                type="number"
                min="0"
                max="100000"
                value={carMileage}
                onChange={(e) => setCarMileage(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label htmlFor="carType" className="block text-xs text-slate-300 font-medium mb-2">
                Engine / Propulsion Type
              </label>
              <select
                id="carType"
                value={carType}
                onChange={(e) => setCarType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="gas">Standard Gasoline Engine</option>
                <option value="diesel">Diesel Efficiency Engine</option>
                <option value="hybrid">Hybrid (Gas / Electric)</option>
                <option value="electric">100% Battery Electric (EV)</option>
              </select>
            </div>
          </div>
        )}
      </fieldset>

      {/* BLOCK 2: Flight Intensity */}
      <fieldset className="space-y-6 border-t border-slate-800 pt-8" aria-labelledby="air-travel-legend">
        <legend className="text-sm font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-2" id="air-travel-legend">
          02. Air Travel Density
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="domesticFlights" className="block text-xs text-slate-300 font-medium mb-2">
              Domestic Flights / Year (Short)
            </label>
            <div className="relative">
              <input
                id="domesticFlights"
                type="number"
                min="0"
                max="150"
                value={domesticFlights}
                onChange={(e) => setDomesticFlights(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 pr-10"
              />
              <Plane className="absolute right-3 top-3.5 w-4 h-4 text-slate-600" aria-hidden="true" />
            </div>
          </div>

          <div>
            <label htmlFor="internationalFlights" className="block text-xs text-slate-300 font-medium mb-2">
              International Flights / Year (Long)
            </label>
            <div className="relative">
              <input
                id="internationalFlights"
                type="number"
                min="0"
                max="100"
                value={internationalFlights}
                onChange={(e) => setInternationalFlights(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 pr-10"
              />
              <Plane className="absolute right-3 top-3.5 w-4 h-4 text-slate-600 rotate-45" aria-hidden="true" />
            </div>
          </div>

          <div>
            <label htmlFor="flightClass" className="block text-xs text-slate-300 font-medium mb-2">
              Standard Flight Cabin Class
            </label>
            <select
              id="flightClass"
              value={flightClass}
              onChange={(e) => setFlightClass(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="economy">Economy Cabin (1x multiplier)</option>
              <option value="business">Business Class (3x multiplier)</option>
              <option value="first">First Class Cabin (4x multiplier)</option>
            </select>
          </div>
        </div>
      </fieldset>

      {/* BLOCK 3: Diet Preferences */}
      <fieldset className="space-y-6 border-t border-slate-800 pt-8" aria-labelledby="nutritional-habits-legend">
        <legend className="text-sm font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-2" id="nutritional-habits-legend">
          03. Nutritional Habits
        </legend>

        <div>
          <label className="block text-xs text-slate-400 font-medium mb-3" id="diet-classification-label">
            Primary Diet Classification
          </label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3" role="radiogroup" aria-labelledby="diet-classification-label">
            {dietOptions.map((opt) => {
              const isSelected = foodDiet === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFoodDiet(opt.value as any)}
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

      {/* BLOCK 4: Home Energy & Utilities */}
      <fieldset className="space-y-6 border-t border-slate-800 pt-8" aria-labelledby="household-utilities-legend">
        <legend className="text-sm font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-2" id="household-utilities-legend">
          04. Household utilities & Energy
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="electricity" className="block text-xs text-slate-300 font-medium mb-2">
              Monthly Electricity Consumption (kWh)
            </label>
            <div className="relative">
              <input
                id="electricity"
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
            <label htmlFor="acUsage" className="block text-xs text-slate-300 font-medium mb-2">
              HVAC / AC Running Frequency
            </label>
            <select
              id="acUsage"
              value={acUsage}
              onChange={(e) => setAcUsage(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="low">Low (Seasonal/Tuned Thermostat)</option>
              <option value="medium">Medium (Standard usage in summer)</option>
              <option value="high">High (Heavy ventilation & cooling)</option>
            </select>
          </div>

          <div>
            <label htmlFor="applianceUsage" className="block text-xs text-slate-300 font-medium mb-2">
              Appliance Efficiency Grade
            </label>
            <select
              id="applianceUsage"
              value={applianceUsage}
              onChange={(e) => setApplianceUsage(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="efficient">EnergyStar Certified (Ultra-Efficient)</option>
              <option value="standard">Standard Domestic (Mix of grades)</option>
              <option value="high-demand">High Demand (Heavy server, heating pools)</option>
            </select>
          </div>
        </div>
      </fieldset>

      {/* BLOCK 5: Consumer Shopping */}
      <fieldset className="space-y-6 border-t border-slate-800 pt-8" aria-labelledby="shopping-habits-legend">
        <legend className="text-sm font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-2" id="shopping-habits-legend">
          05. Consumer Goods & Shopping
        </legend>

        <div>
          <label className="block text-xs text-slate-400 font-medium mb-3" id="shopping-volume-label">
            Monthly Shopping Volume (Clothing, Tech, Goods)
          </label>
          <div className="grid grid-cols-3 gap-4" role="radiogroup" aria-labelledby="shopping-volume-label">
            {["low", "medium", "high"].map((level) => {
              const isSelected = shoppingLevel === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setShoppingLevel(level as any)}
                  aria-checked={isSelected}
                  role="radio"
                  aria-label={`Shopping Level ${level}`}
                  className={`flex items-center justify-center p-4 rounded-xl border text-sm font-bold capitalize transition-all focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                    isSelected 
                      ? "bg-slate-950 border-emerald-500 text-emerald-400 ring-1 ring-emerald-500" 
                      : "bg-slate-950/40 border-slate-800 text-slate-350 hover:border-slate-700"
                  }`}
                  style={{ minHeight: "48px" }} // WCAG touch
                >
                  <ShoppingBag className="w-4 h-4 mr-2" aria-hidden="true" />
                  {level}
                </button>
              );
            })}
          </div>
        </div>
      </fieldset>

      {/* BLOCK 6: Lifestyle Goals */}
      <fieldset className="space-y-6 border-t border-slate-800 pt-8" aria-labelledby="lifestyle-goals-legend">
        <legend className="text-sm font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-2" id="lifestyle-goals-legend">
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

      {/* Submit Button */}
      <div className="border-t border-slate-800 pt-8 flex items-center justify-between gap-4">
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" aria-hidden="true" /> Secure evaluation using Google Gemini Flash
        </div>

        <button
          type="submit"
          disabled={isAnalyzing}
          aria-label={isAnalyzing ? "Analyzing inputs and compiling your sustainable twin. Please wait." : "Submit custom parameters to initialize your Carbon Twin model"}
          className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 px-8 rounded-xl text-sm transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <Sliders className="w-4 h-4 animate-spin" aria-hidden="true" /> Compiling Engine State...
            </>
          ) : (
            <>
              Initialize Carbon Twin <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
