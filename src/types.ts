/**
 * Types and interfaces for CarbonTwin AI Engine.
 */

export interface UserInputs {
  transportation: 'car' | 'bike' | 'bus' | 'metro' | 'walking';
  carMileage?: number; // annual mileage if car is selected
  carType?: 'gas' | 'diesel' | 'hybrid' | 'electric';
  domesticFlights: number; // flights per year
  internationalFlights: number; // flights per year
  flightClass: 'economy' | 'business' | 'first';
  foodDiet: 'vegetarian' | 'vegan' | 'mixed' | 'non-vegetarian';
  electricityUsage: number; // monthly electricity bill or estimated kWh (e.g. 50 to 1000)
  acUsage: 'low' | 'medium' | 'high';
  applianceUsage: 'efficient' | 'standard' | 'high-demand';
  shoppingLevel: 'low' | 'medium' | 'high';
  lifestyleGoals: string[]; // e.g., ["reduce_emissions", "save_money", "sustainable_travel", "sustainable_food"]
}

export interface Recommendation {
  actionName: string;
  co2Reduction: string; // e.g. "450 kg CO2e/year"
  monetarySavings: string; // e.g. "$120/year"
  easeOfImplementation: 'easy' | 'medium' | 'hard';
  whySelected: string;
  expectedImpactDescription: string;
  implementationStep: string;
}

export interface CarbonTwinOutput {
  carbonPersonality: string; // e.g. "Frequent Traveler", "Road Warrior", "Conscious Consumer"
  carbonScore: number; // 0 (best/zero-emissions) to 100 (highest footprint)
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  topEmissionSources: string[]; // list of top contributors (e.g. ["Flights", "Car Commuting"])
  forecast30Days: string; // forecast explanation/value (e.g. "210 kg CO2e")
  forecast90Days: string; // forecast explanation/value
  annualProjection: string; // annual total projection (e.g. "4,200 kg CO2e")
  topRecommendation: string;
  carbonReductionPotential: string; // potential reduction in kg CO2e/year
  estimatedMoneySaved: string; // potential monetary saving in $/year
  explanation: string; // short summary explanation of twin status
  emissionBreakdown: {
    transportation: number; // kg CO2e/year
    flights: number; // kg CO2e/year
    food: number; // kg CO2e/year
    energy: number; // kg CO2e/year
    shopping: number; // kg CO2e/year
  };
  recommendations: Recommendation[]; // All action lists (Top 3)
}

export interface CarbonTwinState {
  id: string;
  userId: string;
  createdAt: string; // ISO timestamp
  inputs: UserInputs;
  analysis: CarbonTwinOutput;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: string;
}
