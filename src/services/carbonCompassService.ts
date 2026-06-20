import { UserInputs, CarbonTwinOutput } from "../types";
import { generateLocalTwinAnalysis } from "../lib/carbonCompute";

/**
 * Perform analysis on lifestyle specs by requesting the backend Gemini analyzer service.
 * Automatically falls back to high-fidelity deterministic local engine if network fails or key is missing.
 */
export async function analyzeLifestyle(inputsToAnalyze: UserInputs): Promise<CarbonTwinOutput> {
  try {
    const response = await fetch("/api/carbon-twin/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputsToAnalyze),
    });

    if (!response.ok) {
      throw new Error(`Server returned error code: ${response.status}. Fallback triggered.`);
    }

    const parsedOutput: CarbonTwinOutput = await response.json();
    return parsedOutput;
  } catch (err) {
    console.warn("CarbonTwin API connection failed or exhausted, proceeding with offline deterministic twin generator:", err);
    // Explicit local calculations guarantee smooth, beautiful UX under all key limits/offline conditions
    return generateLocalTwinAnalysis(inputsToAnalyze);
  }
}
