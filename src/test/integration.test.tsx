// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import { DashboardView } from "../components/dashboard/DashboardView";
import { SetupTwinForm } from "../components/SetupTwinForm";
import { SimulatorView } from "../components/dashboard/SimulatorView";
import { ForecastView } from "../components/dashboard/ForecastView";
import App from "../App";
import { UserInputs, CarbonTwinOutput } from "../types";

// Mock Canvas Confetti
vi.mock("canvas-confetti", () => ({
  __esModule: true,
  default: vi.fn(),
}));

// Mock Firebase module to avoid loading native configurations
vi.mock("../lib/firebase", () => ({
  db: {},
  auth: {
    currentUser: { uid: "test-user-id", email: "tester@example.com" },
    onAuthStateChanged: vi.fn((cb) => cb({ uid: "test-user-id", email: "tester@example.com" })),
  },
  isMockFirebase: true,
  handleFirestoreError: vi.fn((err) => { throw err; }),
  OperationType: {
    CREATE: "create",
    UPDATE: "update",
    DELETE: "delete",
    LIST: "list",
    GET: "get",
    WRITE: "write",
  },
}));

beforeEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const mockInputs: UserInputs = {
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

const mockAnalysis: CarbonTwinOutput = {
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
  explanation: "Your commuter transit emissions are low, but annual flights are higher.",
  emissionBreakdown: {
    transportation: 650,
    flights: 1400,
    food: 1100,
    energy: 1200,
    shopping: 400,
  },
  recommendations: [
    {
      actionName: "Test action A",
      co2Reduction: "600 kg CO2e/year",
      monetarySavings: "$180/year",
      easeOfImplementation: "easy",
      whySelected: "test select A",
      expectedImpactDescription: "desc A",
      implementationStep: "step A",
    },
    {
      actionName: "Test action B",
      co2Reduction: "220 kg CO2e/year",
      monetarySavings: "$120/year",
      easeOfImplementation: "medium",
      whySelected: "test select B",
      expectedImpactDescription: "desc B",
      implementationStep: "step B",
    },
  ],
};

const mockSimulatedResults = {
  score: 42,
  annual: 3720,
  reductionKg: 0,
  savingsCash: 0,
};

// Helper to click through Sandbox Login on mount. Since there is an aria-label set, 
// the computed accessibility name matches the label attribute.
const loginUser = () => {
  const sandboxDemoBtn = screen.getByRole("button", { name: /Launch application instantly/i });
  fireEvent.click(sandboxDemoBtn);
};

describe("CarbonTwin AI Integration Testing Package", () => {

  // 1. Dashboard rendering tests
  describe("1. Dashboard Rendering Model Suite", () => {
    it("should render DashboardView component successfully and display the loaded Twin Profile and carbon personality", () => {
      render(
        <DashboardView
          userInputs={mockInputs}
          twinAnalysis={mockAnalysis}
          simulatedResults={mockSimulatedResults}
          simulatedActions={{}}
          onToggleSimulation={vi.fn()}
          cardVariants={{}}
        />
      );

      // Verify that the personality card is loaded with the user personality title
      const personalityTitle = screen.getByText("Urban Commuter");
      expect(personalityTitle).toBeDefined();

      // Verify that category label and breakdown details exist
      expect(screen.getByText("Air Travel / Flights")).toBeDefined();
      expect(screen.getByText("Daily Ground Transit")).toBeDefined();
    });
  });

  // 2. Carbon Twin generation workflow tests
  describe("2. Carbon Twin Generation Workflow Suite", () => {
    it("should allow editing Lifestyle specs on form and trigger submission handler correctly", () => {
      const mockSubmit = vi.fn();
      render(
        <SetupTwinForm
          initialInputs={mockInputs}
          onSubmit={mockSubmit}
          isAnalyzing={false}
        />
      );

      // Verify the setup form heading exists
      expect(screen.getByRole("heading", { name: /Specify Your Lifestyle Twin Parameters/i })).toBeDefined();

      // Find flights input and simulate change
      const flightsInput = screen.getByLabelText(/Domestic Flights \/ Year/i);
      expect(flightsInput).toBeDefined();
      fireEvent.change(flightsInput, { target: { value: "5" } });

      // Click the Submit button to evaluate twin initialization
      const submitBtn = screen.getAllByRole("button", { name: /Submit custom parameters to initialize/i })[0];
      expect(submitBtn).toBeDefined();
      fireEvent.click(submitBtn);

      // Confirm submit callback was fired
      expect(mockSubmit).toHaveBeenCalled();
    });
  });

  // 3. Recommendation card rendering tests
  describe("3. Recommendation Card Rendering Suite", () => {
    it("should display recommendations under mitigation section with savings values", () => {
      render(
        <SimulatorView
          twinAnalysis={mockAnalysis}
          simulatedResults={mockSimulatedResults}
          simulatedActions={{}}
          onToggleSimulation={vi.fn()}
          streakStatus={{ currentStreak: 3, lastCheckedIn: null, history: {} }}
          onCheckIn={vi.fn()}
          onResetStreak={vi.fn()}
          onSimulateNextDay={vi.fn()}
          getSimulatedDate={() => new Date()}
          formatFriendlyDate={(d) => d.toLocaleDateString()}
          getLocalDateString={() => "2026-06-12"}
          cardVariants={{}}
        />
      );

      // Checks that action titles are listed in list regions
      expect(screen.getByText("Test action A")).toBeDefined();
      expect(screen.getByText("Test action B")).toBeDefined();
      expect(screen.getByText("Test action B").closest("[role='group']")).toBeDefined();
    });
  });

  // 4. What-If simulator interaction tests
  describe("4. What-If Simulator Interaction Suite", () => {
    it("should trigger toggle simulation handle on commitment click and report correctly", () => {
      const mockToggle = vi.fn();
      render(
        <SimulatorView
          twinAnalysis={mockAnalysis}
          simulatedResults={mockSimulatedResults}
          simulatedActions={{}}
          onToggleSimulation={mockToggle}
          streakStatus={{ currentStreak: 3, lastCheckedIn: null, history: {} }}
          onCheckIn={vi.fn()}
          onResetStreak={vi.fn()}
          onSimulateNextDay={vi.fn()}
          getSimulatedDate={() => new Date()}
          formatFriendlyDate={(d) => d.toLocaleDateString()}
          getLocalDateString={() => "2026-06-12"}
          cardVariants={{}}
        />
      );

      // Identify commitment button for first action item
      const commitBtn1 = screen.getByLabelText(/Commit to target mitigation: Test action A/i);
      expect(commitBtn1).toBeDefined();
      
      // Simulate commitment trigger toggle
      fireEvent.click(commitBtn1);
      expect(mockToggle).toHaveBeenCalledWith(0);
    });
  });

  // 5. Forecast rendering tests
  describe("5. Forecast Rendering and Fallbacks Suite", () => {
    it("should render outlook grids and support rich accessible visual/text alternatives", () => {
      render(
        <ForecastView
          userInputs={mockInputs}
          twinAnalysis={mockAnalysis}
          simulatedResults={mockSimulatedResults}
          simulatedActions={{}}
          onToggleSimulation={vi.fn()}
          cardVariants={{}}
        />
      );

      // Verify that forecast panels exist
      expect(screen.getByText("Future Forecast Panels")).toBeDefined();
      expect(screen.getByText("310 kg CO2e")).toBeDefined();
      expect(screen.getByText("930 kg CO2e")).toBeDefined();

      // Check existence of screen reader alternative summary for forecast charts
      const fallbackDesc = document.getElementById("forecast-charts-fallback");
      expect(fallbackDesc).toBeDefined();
      expect(fallbackDesc?.textContent).toContain("310 kg CO2e");
      expect(fallbackDesc?.textContent).toContain("930 kg CO2e");
    });
  });

  // 6. State transition tests
  describe("6. Application State Transitions Suite", () => {
    it("should toggle through navigation channels correctly and update active UI views", async () => {
      render(<App />);
      loginUser();

      // Verify we are initially loaded and showing main dashboard tabs
      const dashboardTabBtn = screen.getAllByRole("button", { name: /Twin Dashboard/i })[0];
      expect(dashboardTabBtn).toBeDefined();

      // Locate safe testbed navigation button and click it to trigger transition
      const testbedTabBtn = screen.getAllByRole("button", { name: "Safe Testbed" })[0];
      expect(testbedTabBtn).toBeDefined();
      
      fireEvent.click(testbedTabBtn);

      // Verify page is correctly swapped to Verification Spec-Tests screen log
      const verifyHeading = screen.getByText("Automated Engine Verification Spec-Tests");
      expect(verifyHeading).toBeDefined();
    });
  });

  // 7. Mock API success tests
  describe("7. CarbonTwin AI API Success Handler Suite", () => {
    it("should fetch completed twin output perfectly on successful HTTP responses", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          ...mockAnalysis,
          carbonScore: 35,
          carbonPersonality: "Eco Champion",
        }),
      });
      global.fetch = mockFetch;

      render(<App />);
      loginUser();

      // Let's travel to "Lifestyle Specs" form tab
      const formTabBtn = screen.getAllByRole("button", { name: "Lifestyle Specs" })[0];
      fireEvent.click(formTabBtn);

      // Locate submit button and click to run live fetch
      const submitBtn = screen.getAllByRole("button", { name: /Submit custom parameters to initialize/i })[0];
      
      await act(async () => {
        fireEvent.click(submitBtn);
      });

      // Confirm fetch proxy call was triggered
      expect(mockFetch).toHaveBeenCalledWith("/api/carbon-twin/analyze", expect.any(Object));

      // Confirm transition to Twin Dashboard tab and displaying of new successfully fetched calculations
      const championTitle = await screen.findByText("Eco Champion");
      expect(championTitle).toBeDefined();
    });
  });

  // 8. Mock API failure tests
  describe("8. CarbonTwin AI API Failure Handling Suite", () => {
    it("should report gracefully on API return failures without locking page thread", async () => {
      const mockFetch = vi.fn().mockImplementation(() => {
        return Promise.reject(new Error("API Limit exhaustion. Disconnected."));
      });
      global.fetch = mockFetch;

      render(<App />);
      loginUser();

      // Navigate to Spect tab form
      const formTabBtn = screen.getAllByRole("button", { name: "Lifestyle Specs" })[0];
      fireEvent.click(formTabBtn);

      // Initialize submit action which rejects
      const submitBtn = screen.getAllByRole("button", { name: /Submit custom parameters to initialize/i })[0];
      
      await act(async () => {
        fireEvent.click(submitBtn);
      });

      // Verification that error diagnostic boxes popped up on interface
      const errorMsg = await screen.findByText(/API Limit exhaustion/i);
      expect(errorMsg).toBeDefined();
    });
  });

  // 9. Offline fallback tests
  describe("9. Static Engine Offline Fallbacks Parity Suite", () => {
    it("should automatically resolve back to local calculation parser when server requests are failing", async () => {
      // Simulate network disconnect (fetch fails)
      global.fetch = vi.fn().mockRejectedValue(new Error("Network connection breakdown."));

      render(<App />);
      loginUser();

      // Navigate to specifications tab to rerun
      const formTabBtn = screen.getAllByRole("button", { name: "Lifestyle Specs" })[0];
      fireEvent.click(formTabBtn);

      // Submit changes
      const submitBtn = screen.getAllByRole("button", { name: /Submit custom parameters to initialize/i })[0];
      
      await act(async () => {
        fireEvent.click(submitBtn);
      });

      // Offline fallback calculation guarantees complete rendering in dashboard
      const intensityLabels = await screen.findAllByText(/Category Breakdown Intensity/i);
      expect(intensityLabels.length).toBeGreaterThan(0);
    });
  });

  // 10. Accessibility interaction tests
  describe("10. Accessibility Landscape Audit Suite", () => {
    it("should assert existence of appropriate ARIA landmark roles and keyboard-focused configurations", () => {
      render(
        <DashboardView
          userInputs={mockInputs}
          twinAnalysis={mockAnalysis}
          simulatedResults={mockSimulatedResults}
          simulatedActions={{}}
          onToggleSimulation={vi.fn()}
          cardVariants={{}}
        />
      );

      // Assert region elements exist with specific accessible aria labels
      // (Using getAllByRole to avoid multiple element matching triggers gracefully)
      const intensityRegions = screen.getAllByRole("region", { name: /Category Breakdown Intensity/i });
      expect(intensityRegions.length).toBeGreaterThan(0);

      const forecastRegions = screen.getAllByRole("region", { name: /Future Forecast Panels/i });
      expect(forecastRegions.length).toBeGreaterThan(0);

      // Check for progressbar elements styled with appropriate attributes
      const progressbars = screen.getAllByRole("progressbar");
      expect(progressbars.length).toBeGreaterThan(0);
      expect(progressbars[0].getAttribute("aria-valuenow")).toBeDefined();
      expect(progressbars[0].getAttribute("aria-valuemin")).toBe("0");
      expect(progressbars[0].getAttribute("aria-valuemax")).toBeDefined();
    });
  });

});
