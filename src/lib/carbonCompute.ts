import { UserInputs, CarbonTwinOutput, Recommendation } from "../types";
import {
  FLIGHT_FACTORS,
  TRANSPORT_FACTORS,
  DIET_FACTORS,
  ENERGY_FACTORS,
  SHOPPING_FACTORS,
  SIMULATION_FACTORS,
} from "../config/carbonFactors";

/**
 * Calculates emissions from aviation travel based on flights count and class.
 */
export function calculateFlightsEmissions(
  domesticFlights: number,
  internationalFlights: number,
  flightClass: "economy" | "business" | "first"
): number {
  let flightsEm = (domesticFlights * FLIGHT_FACTORS.DOMESTIC_KG) + 
                  (internationalFlights * FLIGHT_FACTORS.INTERNATIONAL_KG);

  if (flightClass === "business") {
    flightsEm *= FLIGHT_FACTORS.BUSINESS_MULTIPLIER;
  } else if (flightClass === "first") {
    flightsEm *= FLIGHT_FACTORS.FIRST_MULTIPLIER;
  }
  return flightsEm;
}

/**
 * Calculates emissions from ground transportation commuting.
 */
export function calculateTransportationEmissions(
  transportation: "car" | "bike" | "bus" | "metro" | "walking",
  carMileage?: number,
  carType?: "gas" | "diesel" | "hybrid" | "electric"
): number {
  if (transportation === "car") {
    const mileage = carMileage ?? TRANSPORT_FACTORS.DEFAULT_CAR_MILEAGE;
    const type = carType ?? "gas";
    const factor = TRANSPORT_FACTORS.CAR_EMISSIONS_BY_TYPE[type] ?? TRANSPORT_FACTORS.CAR_EMISSIONS_BY_TYPE.gas;
    return mileage * factor;
  } else if (transportation === "bike" || transportation === "walking") {
    return TRANSPORT_FACTORS.BIKE_WALKING_EMISSIONS;
  } else {
    return TRANSPORT_FACTORS.PUBLIC_TRANSIT_EMISSIONS;
  }
}

/**
 * Calculates emissions from food dietary options.
 */
export function calculateFoodEmissions(foodDiet: "vegetarian" | "vegan" | "mixed" | "non-vegetarian"): number {
  return DIET_FACTORS[foodDiet] ?? DIET_FACTORS.mixed;
}

/**
 * Calculates home energy grid draw emissions.
 */
export function calculateEnergyEmissions(electricityUsage: number): number {
  return electricityUsage * ENERGY_FACTORS.ELECTRICITY_MULTIPLIER;
}

/**
 * Calculates goods/shopping retail emissions.
 */
export function calculateShoppingEmissions(shoppingLevel: "low" | "medium" | "high"): number {
  return SHOPPING_FACTORS[shoppingLevel] ?? SHOPPING_FACTORS.medium;
}

/**
 * Evaluates the appropriate carbon personality archetype.
 */
export function classifyPersonality(inputs: UserInputs, energyEm: number): string {
  if (inputs.domesticFlights + inputs.internationalFlights > 5) {
    return "High-Flyer Traveler";
  } else if (inputs.transportation === "car" && (inputs.carMileage || 0) > 15000) {
    return "Road Warrior";
  } else if (inputs.transportation === "bike" || inputs.transportation === "walking") {
    return "Green Commuter";
  } else if (energyEm > 4000) {
    return "Power Grid Giant";
  }
  return "Conscious Consumer";
}

/**
 * Determines carbon score (0-100 scale) and associated environmental risk level.
 */
export function calculateCarbonScoreAndRisk(totalCO2: number, baseModifier: number) {
  const finalScore = Math.min(Math.max(Math.round(baseModifier + (totalCO2 / 180)), 8), 98);
  const risk = finalScore > 75 ? "Critical" : finalScore > 50 ? "High" : finalScore > 30 ? "Medium" : "Low";
  
  return {
    score: finalScore,
    riskLevel: risk as "Low" | "Medium" | "High" | "Critical",
  };
}

/**
 * Complete evaluation workflow output for fallback state, ensuring parity with the production system.
 */
export function generateLocalTwinAnalysis(inputs: UserInputs): CarbonTwinOutput {
  let scoreModifier = 30;

  // Base aviation impact modifiers
  if (inputs.flightClass === "business") scoreModifier += 5;
  if (inputs.flightClass === "first") scoreModifier += 10;

  // Transportation modifiers
  if (inputs.transportation === "car") {
    if (inputs.carType === "gas") scoreModifier += 30;
    else if (inputs.carType === "diesel") scoreModifier += 25;
    else if (inputs.carType === "hybrid") scoreModifier += 15;
    else if (inputs.carType === "electric") scoreModifier += 6;
  } else if (inputs.transportation === "bike" || inputs.transportation === "walking") {
    scoreModifier -= 10;
  } else {
    scoreModifier += 5;
  }

  // Dietary modifier
  if (inputs.foodDiet === "vegan") scoreModifier -= 8;
  else if (inputs.foodDiet === "vegetarian") scoreModifier -= 4;
  else if (inputs.foodDiet === "non-vegetarian") scoreModifier += 20;

  const flightsEm = calculateFlightsEmissions(inputs.domesticFlights, inputs.internationalFlights, inputs.flightClass);
  const transportEm = calculateTransportationEmissions(inputs.transportation, inputs.carMileage, inputs.carType);
  const foodEm = calculateFoodEmissions(inputs.foodDiet);
  const energyEm = calculateEnergyEmissions(inputs.electricityUsage);
  const shoppingEm = calculateShoppingEmissions(inputs.shoppingLevel);

  // Add electricity modifier
  if (energyEm > 3000) scoreModifier += 15;
  else if (energyEm < 1000) scoreModifier -= 5;

  // Add shopping modifier
  if (inputs.shoppingLevel === "high") scoreModifier += 15;
  else if (inputs.shoppingLevel === "low") scoreModifier -= 5;

  const totalCO2 = Math.round(transportEm + flightsEm + foodEm + energyEm + shoppingEm);
  const { score, riskLevel } = calculateCarbonScoreAndRisk(totalCO2, scoreModifier);

  const breakdown = {
    transportation: Math.round(transportEm),
    flights: Math.round(flightsEm),
    food: Math.round(foodEm),
    energy: Math.round(energyEm),
    shopping: Math.round(shoppingEm),
  };

  const personality = classifyPersonality(inputs, energyEm);

  const recommendations: Recommendation[] = [
    {
      actionName: `Adopt ${inputs.foodDiet === "vegan" ? "Local Seasonals" : "Plant-based alternatives"}`,
      co2Reduction: "480 kg CO2e/year",
      monetarySavings: "$120/year",
      easeOfImplementation: "easy",
      whySelected: "Reduces bovine agricultural methane footprint.",
      expectedImpactDescription: "Primary diet footprints decrease exponentially.",
      implementationStep: "Focus on bean spreads, organic lentils, and soy substitutes.",
    },
    {
      actionName: "Offset flight footprint using Gold-Standard offsets",
      co2Reduction: "600 kg CO2e/year",
      monetarySavings: "$0/year",
      easeOfImplementation: "easy",
      whySelected: "Air transit accounts for a heavy subtotal of emissions.",
      expectedImpactDescription: "Direct project offset funding.",
      implementationStep: "Verify airline offset packages next time you reserve tickets.",
    },
  ];

  return {
    carbonPersonality: personality,
    carbonScore: score,
    riskLevel,
    topEmissionSources: Object.entries(breakdown)
      .sort((a, b) => b[1] - a[1])
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
      .slice(0, 2),
    forecast30Days: `${Math.round(totalCO2 / 12)} kg CO2e`,
    forecast90Days: `${Math.round(totalCO2 / 4)} kg CO2e`,
    annualProjection: `${totalCO2.toLocaleString()} kg CO2e`,
    topRecommendation: "Adopt vegetable alternates and cut auxiliary power",
    carbonReductionPotential: "1,080 kg CO2e/year",
    estimatedMoneySaved: "$120/year",
    explanation: "Fallback Sandbox Model calculated locally because server connection limits are active. Still fully interactive and persistent!",
    emissionBreakdown: breakdown,
    recommendations,
  };
}

/**
 * Executes dynamic, real-time recalculations for simulated commitments.
 */
export function calculateSimulatedResults(
  twinAnalysis: CarbonTwinOutput,
  simulatedActions: Record<number, boolean>
) {
  const baseScore = twinAnalysis.carbonScore;
  
  // Parse base annual projection number
  const baseAnnualStr = twinAnalysis.annualProjection.replace(/,/g, "");
  const baseAnnualMatch = baseAnnualStr.match(/\d+/);
  const baseAnnual = baseAnnualMatch ? Number(baseAnnualMatch[0]) : 3000;

  let cumulativeReduction = 0;
  let cumulativeSavings = 0;

  // Sum reductions from active commitments
  twinAnalysis.recommendations.forEach((rec, idx) => {
    if (simulatedActions[idx]) {
      // Reductions
      const co2Match = rec.co2Reduction.replace(/,/g, "").match(/\d+/);
      if (co2Match) {
         cumulativeReduction += Number(co2Match[0]);
      }

      // Savings
      const cashMatch = rec.monetarySavings.replace(/[^0-9]/g, "");
      if (cashMatch) {
         cumulativeSavings += Number(cashMatch);
      }
    }
  });

  const scoreDeduction = Math.round(cumulativeReduction / SIMULATION_FACTORS.KG_REDUCTION_PER_SCORE_POINT);
  const simulatedScore = Math.max(baseScore - scoreDeduction, 5);
  const simulatedAnnual = Math.max(baseAnnual - cumulativeReduction, 0);

  return {
    score: simulatedScore,
    annual: simulatedAnnual,
    reductionKg: cumulativeReduction,
    savingsCash: cumulativeSavings,
  };
}
