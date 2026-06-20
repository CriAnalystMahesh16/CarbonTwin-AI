import { useState, useEffect, useMemo } from "react";
import { UserInputs, CarbonTwinOutput, CarbonTwinState } from "../types";
import { analyzeLifestyle } from "../services/carbonCompassService";
import { loadHistory, saveSnapshot, deleteSnapshot } from "../services/firebaseStorageService";
import { calculateSimulatedResults, generateLocalTwinAnalysis } from "../lib/carbonCompute";

// Central constants moved into static structure to keep components lightweight
export const DEFAULT_ANALYSED_TWIN: CarbonTwinOutput = {
  carbonPersonality: "Urban Commuter",
  carbonScore: 42,
  riskLevel: "Medium",
  topEmissionSources: ["Flights", "Home Energy"],
  forecast30Days: "310 kg CO2e",
  forecast90Days: "930 kg CO2e",
  annualProjection: "3,720 kg CO2e",
  topRecommendation: "Optimize air travel frequency and shift diet to Vegetarian",
  carbonReductionPotential: "920 kg CO2e/year",
  estimatedMoneySaved: "$340/year",
  explanation: "Your commuter transit carbon intensity is low, but annual long-haul domestic flights and mixed balanced nutritional habits remain your major footprint hotspots.",
  emissionBreakdown: {
    transportation: 650,
    flights: 1400,
    food: 1100,
    energy: 1200,
    shopping: 400
  },
  recommendations: [
    {
      actionName: "Substitute bovine meat with local produce (Vegetarian Diet)",
      co2Reduction: "600 kg CO2e/year",
      monetarySavings: "$180/year",
      easeOfImplementation: "easy",
      whySelected: "Replacing non-vegetarian items targets food system footprint directly with low cost.",
      expectedImpactDescription: "Halves nutrition related raw emissions and reduces land-clearing impact.",
      implementationStep: "Adopt 'Meatless Mondays' and buy grains or organic greens locally."
    },
    {
      actionName: "Audit and reduce one short-haul flight per year",
      co2Reduction: "220 kg CO2e/year",
      monetarySavings: "$120/year",
      easeOfImplementation: "medium",
      whySelected: "Air travel represents 37% of your digital twin emissions. Reducing one domestic trip of ~1000 miles is highly-aligned with sustainable travel goals.",
      expectedImpactDescription: "Direct avoidance of kerosene combustion and high-altitude radiative forcing.",
      implementationStep: "Substitute one physical business trip with a high-definition remote meeting."
    },
    {
      actionName: "Set smart thermostat temperatures during summer HVAC cycles",
      co2Reduction: "100 kg CO2e/year",
      monetarySavings: "$40/year",
      easeOfImplementation: "easy",
      whySelected: "Matches save_money preference and mitigates medium HVAC electricity usage.",
      expectedImpactDescription: "Saves cooling grid draw by 6% per degree offset.",
      implementationStep: "Configure your home smart thermostat to set passive back temperature to 78°F."
    }
  ]
};

export const DEFAULT_INPUTS: UserInputs = {
  transportation: "bus",
  domesticFlights: 2,
  internationalFlights: 1,
  flightClass: "economy",
  foodDiet: "mixed",
  electricityUsage: 350,
  acUsage: "medium",
  applianceUsage: "standard",
  shoppingLevel: "medium",
  lifestyleGoals: ["reduce_emissions", "save_money"],
};

export interface UseCarbonTwinReturn {
  userInputs: UserInputs;
  twinAnalysis: CarbonTwinOutput;
  isAnalyzing: boolean;
  errorText: string | null;
  setErrorText: (err: string | null) => void;
  simulatedActions: Record<number, boolean>;
  historyTwins: CarbonTwinState[];
  isSaving: boolean;
  isDeleting: string | null;
  simulatedResults: {
    score: number;
    annual: number;
    reductionKg: number;
    savingsCash: number;
  };
  handleAnalyzeLifestyle: (inputsToAnalyze: UserInputs) => Promise<void>;
  handleSaveSnapshot: () => Promise<void>;
  handleDeleteSnapshot: (snapshotId: string) => Promise<void>;
  handleLoadSavedSnapshot: (historic: CarbonTwinState) => void;
  handleToggleSimulation: (index: number) => void;
  loadSnapshotHistory: () => Promise<void>;
}

export function useCarbonTwin(uid: string | null): UseCarbonTwinReturn {
  const [userInputs, setUserInputs] = useState<UserInputs>(DEFAULT_INPUTS);
  const [twinAnalysis, setTwinAnalysis] = useState<CarbonTwinOutput>(DEFAULT_ANALYSED_TWIN);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [simulatedActions, setSimulatedActions] = useState<Record<number, boolean>>({});

  const [historyTwins, setHistoryTwins] = useState<CarbonTwinState[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const loadSnapshotHistory = async (): Promise<void> => {
    if (!uid) return;
    try {
      const history = await loadHistory(uid);
      setHistoryTwins(history);
    } catch (err) {
      console.error("Failed to load historical snapshots:", err);
    }
  };

  useEffect(() => {
    if (uid) {
      loadSnapshotHistory();
    }
  }, [uid]);

  const handleAnalyzeLifestyle = async (inputsToAnalyze: UserInputs): Promise<void> => {
    setIsAnalyzing(true);
    setErrorText(null);
    try {
      const parsedOutput = await analyzeLifestyle(inputsToAnalyze);
      setUserInputs(inputsToAnalyze);
      setTwinAnalysis(parsedOutput);
      setSimulatedActions({}); // Reset interactive commits
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorText(msg);
      // fallback deterministic local analysis
      setUserInputs(inputsToAnalyze);
      setTwinAnalysis(generateLocalTwinAnalysis(inputsToAnalyze));
      setSimulatedActions({});
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveSnapshot = async (): Promise<void> => {
    if (!uid) return;
    setIsSaving(true);
    setErrorText(null);

    const snapshotId = `twin-${Date.now()}`;
    const newSnapshot: CarbonTwinState = {
      id: snapshotId,
      userId: uid,
      createdAt: new Date().toISOString(),
      inputs: userInputs,
      analysis: twinAnalysis,
    };

    try {
      await saveSnapshot(uid, newSnapshot);
      setHistoryTwins((prev) => [newSnapshot, ...prev]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorText(`Failed to save snapshot: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSnapshot = async (snapshotId: string): Promise<void> => {
    if (!uid) return;
    setIsDeleting(snapshotId);
    setErrorText(null);

    try {
      await deleteSnapshot(uid, snapshotId);
      setHistoryTwins((prev) => prev.filter((item) => item.id !== snapshotId));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorText(`Failed to remove snapshot: ${msg}`);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleLoadSavedSnapshot = (historic: CarbonTwinState): void => {
    setUserInputs(historic.inputs);
    setTwinAnalysis(historic.analysis);
    setSimulatedActions({});
  };

  const handleToggleSimulation = (index: number): void => {
    setSimulatedActions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const simulatedResults = useMemo(() => {
    return calculateSimulatedResults(twinAnalysis, simulatedActions);
  }, [twinAnalysis, simulatedActions]);

  return {
    userInputs,
    twinAnalysis,
    isAnalyzing,
    errorText,
    setErrorText,
    simulatedActions,
    historyTwins,
    isSaving,
    isDeleting,
    simulatedResults,
    handleAnalyzeLifestyle,
    handleSaveSnapshot,
    handleDeleteSnapshot,
    handleLoadSavedSnapshot,
    handleToggleSimulation,
    loadSnapshotHistory,
  };
}
