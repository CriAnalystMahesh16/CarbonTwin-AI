import React from "react";
import { UserInputs } from "../../types";
import { Car, Bike, Bus, Train, Footprints, Plane } from "lucide-react";

interface TransportFlightProps {
  transport: UserInputs["transportation"];
  setTransport: (v: UserInputs["transportation"]) => void;
  carMileage: number;
  setCarMileage: (v: number) => void;
  carType: UserInputs["carType"];
  setCarType: (v: UserInputs["carType"]) => void;
  domesticFlights: number;
  setDomesticFlights: (v: number) => void;
  internationalFlights: number;
  setInternationalFlights: (v: number) => void;
  flightClass: UserInputs["flightClass"];
  setFlightClass: (v: UserInputs["flightClass"]) => void;
}

const transportOptions = [
  { value: "car" as const, label: "Car Commute", icon: Car, desc: "Personal gasoline or EV car" },
  { value: "bike" as const, label: "Bicycle / Active", icon: Bike, desc: "Biking, walking, non-motorized" },
  { value: "bus" as const, label: "Bus Commuter", icon: Bus, desc: "Standard public transit network" },
  { value: "metro" as const, label: "Rail / Metro", icon: Train, desc: "High-speed rail, light rail, subway" },
  { value: "walking" as const, label: "Walking Only", icon: Footprints, desc: "Strict footprint active walk" },
];

export function TransportFlightSection({
  transport,
  setTransport,
  carMileage,
  setCarMileage,
  carType,
  setCarType,
  domesticFlights,
  setDomesticFlights,
  internationalFlights,
  setInternationalFlights,
  flightClass,
  setFlightClass,
}: TransportFlightProps): React.JSX.Element {
  return (
    <div className="space-y-8">
      {/* Daily Transit */}
      <fieldset className="space-y-6" aria-labelledby="transit-legend-panel">
        <legend className="text-sm font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-2" id="transit-legend-panel">
          01. Transit & Commuting Parameters
        </legend>
        
        <div>
          <label className="block text-xs text-slate-400 font-medium mb-3" id="transit-radios-label">
            Primary Transportation Choice
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3" role="radiogroup" aria-labelledby="transit-radios-label">
            {transportOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = transport === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTransport(opt.value)}
                  aria-checked={isSelected}
                  aria-label={`${opt.label}: ${opt.desc}`}
                  role="radio"
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                    isSelected 
                      ? "bg-slate-950 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-400" 
                      : "bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                  style={{ minHeight: "80px" }}
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
              <label htmlFor="carMileageSelect" className="block text-xs text-slate-300 font-medium mb-2">
                Annual Auto Mileage (Miles)
              </label>
              <input
                id="carMileageSelect"
                type="number"
                min="0"
                max="100000"
                value={carMileage}
                onChange={(e) => setCarMileage(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label htmlFor="carEngineTypeSelect" className="block text-xs text-slate-300 font-medium mb-2">
                Engine / Propulsion Type
              </label>
              <select
                id="carEngineTypeSelect"
                value={carType}
                onChange={(e) => setCarType(e.target.value as UserInputs["carType"])}
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

      {/* Flight Intensity */}
      <fieldset className="space-y-6 border-t border-slate-800 pt-8" aria-labelledby="aviation-legend-panel">
        <legend className="text-sm font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-2" id="aviation-legend-panel">
          02. Air Travel Density
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="domFlights" className="block text-xs text-slate-300 font-medium mb-2">
              Domestic Flights / Year (Short)
            </label>
            <div className="relative">
              <input
                id="domFlights"
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
            <label htmlFor="intlFlights" className="block text-xs text-slate-300 font-medium mb-2">
              International Flights / Year (Long)
            </label>
            <div className="relative">
              <input
                id="intlFlights"
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
            <label htmlFor="flightCabinClass" className="block text-xs text-slate-300 font-medium mb-2">
              Standard Flight Cabin Class
            </label>
            <select
              id="flightCabinClass"
              value={flightClass}
              onChange={(e) => setFlightClass(e.target.value as UserInputs["flightClass"])}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="economy">Economy Cabin (1x multiplier)</option>
              <option value="business">Business Class (3x multiplier)</option>
              <option value="first">First Class Cabin (4x multiplier)</option>
            </select>
          </div>
        </div>
      </fieldset>
    </div>
  );
}
