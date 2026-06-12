import { describe, it, expect } from "vitest";
import {
  calculateFlightsEmissions,
  calculateTransportationEmissions,
  calculateFoodEmissions,
  calculateEnergyEmissions,
  calculateShoppingEmissions,
  classifyPersonality,
  calculateCarbonScoreAndRisk,
  generateLocalTwinAnalysis,
  calculateSimulatedResults,
} from "../lib/carbonCompute";
import { UserInputs, CarbonTwinOutput } from "../types";

describe("CarbonTwin AI Calculations Suite", () => {
  
  describe("1. Flight Emission Modifiers", () => {
    it("should calculate base economy flights emissions correctly", () => {
      // Domestic = 2 flights, International = 1 flight
      // Base domestic = 200 kg/flight, Base international = 1300 kg/flight
      // Expected = 2 * 200 + 1 * 1300 = 1700 kg
      const emissions = calculateFlightsEmissions(2, 1, "economy");
      expect(emissions).toBe(1700);
    });

    it("should apply business class multiplier (3x)", () => {
      const emissionsEco = calculateFlightsEmissions(1, 1, "economy"); // 200 + 1300 = 1500
      const emissionsBiz = calculateFlightsEmissions(1, 1, "business"); // 1500 * 3 = 4500
      expect(emissionsBiz).toBe(emissionsEco * 3);
    });

    it("should apply first class multiplier (4x)", () => {
      const emissionsEco = calculateFlightsEmissions(2, 2, "economy"); // (2*200) + (2*1300) = 3000
      const emissionsFirst = calculateFlightsEmissions(2, 2, "first"); // 3000 * 4 = 12000
      expect(emissionsFirst).toBe(emissionsEco * 4);
    });

    it("should handle zero flights case", () => {
      const emissions = calculateFlightsEmissions(0, 0, "economy");
      expect(emissions).toBe(0);
    });
  });

  describe("2. Transportation Emission Modifiers", () => {
    it("should calculate standard gas car emissions correctly", () => {
      // gas factor = 0.35, mileage = 10000
      // Expected = 3500 kg
      const emissions = calculateTransportationEmissions("car", 10000, "gas");
      expect(emissions).toBe(3500);
    });

    it("should use default car mileage if none provided", () => {
      // default mileage = 12000, diesel factor = 0.3060
      // Expected = 1200 * 0.3060 = 3672 kg
      const emissions = calculateTransportationEmissions("car", undefined, "diesel");
      expect(emissions).toBe(3672);
    });

    it("should yield low emissions for green transport (bike, walking)", () => {
      const emissionsBike = calculateTransportationEmissions("bike");
      const emissionsWalk = calculateTransportationEmissions("walking");
      expect(emissionsBike).toBe(0);
      expect(emissionsWalk).toBe(0);
    });

    it("should calculate public transportation emissions accurately", () => {
      // Public transit expectation is 400 kg
      const emissionsBus = calculateTransportationEmissions("bus");
      const emissionsMetro = calculateTransportationEmissions("metro");
      expect(emissionsBus).toBe(400);
      expect(emissionsMetro).toBe(400);
    });
  });

  describe("3. Dietary and Energy Options", () => {
    it("should fetch diet emissions from lookup configuration", () => {
      expect(calculateFoodEmissions("vegan")).toBe(750);
      expect(calculateFoodEmissions("vegetarian")).toBe(1100);
      expect(calculateFoodEmissions("mixed")).toBe(1800);
      expect(calculateFoodEmissions("non-vegetarian")).toBe(2500);
    });

    it("should calculate home utility draw emissions", () => {
      // Multiplier = 5
      // Expected = 5000 * 5 = 25000
      expect(calculateEnergyEmissions(5000)).toBe(25000);
    });

    it("should calculate retail shopping level emissions", () => {
      expect(calculateShoppingEmissions("low")).toBe(600);
      expect(calculateShoppingEmissions("medium")).toBe(1500);
      expect(calculateShoppingEmissions("high")).toBe(3800);
    });
  });

  describe("4. Carbon Personality Classification", () => {
    const defaultInputs: UserInputs = {
      flightClass: "economy",
      domesticFlights: 1,
      internationalFlights: 1,
      transportation: "bus",
      carMileage: 0,
      carType: "electric",
      foodDiet: "mixed",
      electricityUsage: 2500,
      shoppingLevel: "medium",
      acUsage: "medium",
      applianceUsage: "standard",
      lifestyleGoals: ["reduce_emissions"],
    };

    it("should classify as High-Flyer Traveler for heavy aviators", () => {
      const inputs = { ...defaultInputs, domesticFlights: 4, internationalFlights: 3 };
      const personality = classifyPersonality(inputs, 1000);
      expect(personality).toBe("High-Flyer Traveler");
    });

    it("should classify as Road Warrior for high gas car mileage", () => {
      const inputs = { ...defaultInputs, transportation: "car" as const, carMileage: 18000, carType: "gas" as const };
      const personality = classifyPersonality(inputs, 1500);
      expect(personality).toBe("Road Warrior");
    });

    it("should classify as Green Commuter for active walking, run, or biking", () => {
      const inputs = { ...defaultInputs, transportation: "bike" as const };
      const personality = classifyPersonality(inputs, 1000);
      expect(personality).toBe("Green Commuter");
    });

    it("should classify as Power Grid Giant for high energy loads", () => {
      const inputs = { ...defaultInputs, electricityUsage: 1200 };
      const energyEm = calculateEnergyEmissions(1200); // 1200 * 5 = 6000 kg CO2
      const personality = classifyPersonality(inputs, energyEm);
      expect(personality).toBe("Power Grid Giant");
    });

    it("should default to Conscious Consumer if guidelines are met", () => {
      const inputs = { ...defaultInputs, transportation: "bus" as const };
      const personality = classifyPersonality(inputs, 950);
      expect(personality).toBe("Conscious Consumer");
    });
  });

  describe("5. Score Classification and Risk Engine", () => {
    it("should correctly bin high carbon totals as Critical risk", () => {
      // 18000 kg total CO2, 50 modifier -> Math.max(Math.round(50 + 100), 98) -> 98 Score
      const result = calculateCarbonScoreAndRisk(18000, 50);
      expect(result.score).toBe(98);
      expect(result.riskLevel).toBe("Critical");
    });

    it("should label moderate CO2 ranges as High or Medium risk", () => {
      const resultMedium = calculateCarbonScoreAndRisk(3000, 20); // 20 + 17 = 37 Score
      expect(resultMedium.score).toBe(37);
      expect(resultMedium.riskLevel).toBe("Medium");
    });
  });

  describe("6. Complete Local Blueprint Twin Analysis Parity", () => {
    it("should generate a consistent complete analysis report output payload", () => {
      const sampleInputs: UserInputs = {
        flightClass: "economy",
        domesticFlights: 2,
        internationalFlights: 0,
        transportation: "bike",
        foodDiet: "vegan",
        electricityUsage: 1200,
        shoppingLevel: "low",
        acUsage: "low",
        applianceUsage: "efficient",
        lifestyleGoals: ["reduce_emissions"],
      };

      const report = generateLocalTwinAnalysis(sampleInputs);
      expect(report.carbonPersonality).toBe("Green Commuter");
      expect(report.carbonScore).toBeGreaterThan(0);
      expect(report.emissionBreakdown.flights).toBe(400);
      expect(report.emissionBreakdown.transportation).toBe(0);
      expect(report.recommendations).toHaveLength(2);
    });
  });

  describe("7. What-If Simulator & Mitigation Commitments", () => {
    const mockAnalysisReport: CarbonTwinOutput = {
      carbonPersonality: "Conscious Consumer",
      carbonScore: 78,
      riskLevel: "High",
      topEmissionSources: ["Flights"],
      forecast30Days: "250 kg CO2e",
      forecast90Days: "750 kg CO2e",
      annualProjection: "3,000 kg CO2e",
      topRecommendation: "Adopt plant food",
      carbonReductionPotential: "1080 kg",
      estimatedMoneySaved: "$120/yr",
      explanation: "Testing",
      emissionBreakdown: { transportation: 0, flights: 500, food: 2100, energy: 0, shopping: 0 },
      recommendations: [
        {
          actionName: "Test action A",
          co2Reduction: "800 kg CO2e/year",
          monetarySavings: "$150/year",
          easeOfImplementation: "easy",
          whySelected: "test select",
          expectedImpactDescription: "none",
          implementationStep: "just test",
        },
        {
          actionName: "Test action B",
          co2Reduction: "400 kg CO2e/year",
          monetarySavings: "$50/year",
          easeOfImplementation: "easy",
          whySelected: "test select B",
          expectedImpactDescription: "none",
          implementationStep: "just test B",
        }
      ]
    };

    it("should result in base stats if no commitments are toggled", () => {
      const simResults = calculateSimulatedResults(mockAnalysisReport, {});
      expect(simResults.reductionKg).toBe(0);
      expect(simResults.savingsCash).toBe(0);
      expect(simResults.score).toBe(78);
      expect(simResults.annual).toBe(3000);
    });

    it("should subtract emissions from annual projection and decrease intensity score on commit", () => {
      // Commit action A (800 kg reduction, $150 saved)
      const simResults = calculateSimulatedResults(mockAnalysisReport, { 0: true });
      expect(simResults.reductionKg).toBe(800);
      expect(simResults.savingsCash).toBe(150);
      // Math: score decrease = Math.round(800 / 80) = 10 points.
      // Expected simulatedScore = 78 - 10 = 68
      expect(simResults.score).toBe(68);
      expect(simResults.annual).toBe(2200);
    });

    it("should sum multiple active simulation commitments successfully", () => {
      // Commit action A + B (800 + 400 = 1200 kg reduction, $200 saved)
      const simResults = calculateSimulatedResults(mockAnalysisReport, { 0: true, 1: true });
      expect(simResults.reductionKg).toBe(1200);
      expect(simResults.savingsCash).toBe(200);
      // Math: score decrease = Math.round(1200 / 80) = 15 points.
      // Expected simulatedScore = 78 - 15 = 63
      expect(simResults.score).toBe(63);
      expect(simResults.annual).toBe(1800);
    });
  });

});
