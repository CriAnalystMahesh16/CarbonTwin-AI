import React, { useState } from "react";
import { UserInputs } from "../types";
import { TransportFlightSection } from "./form/TransportFlightSection";
import { DietEnergySection } from "./form/DietEnergySection";
import { Leaf, ArrowRight, ShieldCheck, Sliders } from "lucide-react";

interface SetupTwinFormProps {
  initialInputs?: UserInputs | null;
  onSubmit: (inputs: UserInputs) => void;
  isAnalyzing: boolean;
}

export function SetupTwinForm({ initialInputs, onSubmit, isAnalyzing }: SetupTwinFormProps): React.JSX.Element {
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

  const handleFormSubmit = (e: React.FormEvent): void => {
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

      {/* Transit & Commuter specs */}
      <TransportFlightSection
        transport={transport}
        setTransport={setTransport}
        carMileage={carMileage}
        setCarMileage={setCarMileage}
        carType={carType}
        setCarType={setCarType}
        domesticFlights={domesticFlights}
        setDomesticFlights={setDomesticFlights}
        internationalFlights={internationalFlights}
        setInternationalFlights={setInternationalFlights}
        flightClass={flightClass}
        setFlightClass={setFlightClass}
      />

      {/* Diet, utilities, consumer styles, and motivations specs */}
      <DietEnergySection
        foodDiet={foodDiet}
        setFoodDiet={setFoodDiet}
        electricityUsage={electricityUsage}
        setElectricityUsage={setElectricityUsage}
        acUsage={acUsage}
        setAcUsage={setAcUsage}
        applianceUsage={applianceUsage}
        setApplianceUsage={setApplianceUsage}
        shoppingLevel={shoppingLevel}
        setShoppingLevel={setShoppingLevel}
        lifestyleGoals={lifestyleGoals}
        setLifestyleGoals={setLifestyleGoals}
      />

      {/* Submit Controls footer */}
      <div className="border-t border-slate-800 pt-8 flex items-center justify-between gap-4">
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-medium">
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
