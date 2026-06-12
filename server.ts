import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { rateLimit } from "express-rate-limit";
import { z } from "zod";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const PORT = 3000;

// Lazy-loaded Gemini client to avoid crashes if GEMINI_API_KEY is not initially set
let aiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please add it via the Secrets panel in AI Studio UI.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Rigorous open-form input string sanitizer to clean out scripts and tags
function sanitizeInputString(value: string): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .replace(/`/g, "&#x60;")
    .trim();
}

// Strictly structured validation schema mapping directly to UserInputs interface
const carbonTwinInputSchema = z.object({
  transportation: z.enum(["car", "bike", "bus", "metro", "walking"]),
  carMileage: z.number().nonnegative().max(100000).optional().nullable(),
  carType: z.enum(["gas", "diesel", "hybrid", "electric"]).optional().nullable(),
  domesticFlights: z.number().nonnegative().int().max(150),
  internationalFlights: z.number().nonnegative().int().max(150),
  flightClass: z.enum(["economy", "business", "first"]),
  foodDiet: z.enum(["vegetarian", "vegan", "mixed", "non-vegetarian"]),
  electricityUsage: z.number().nonnegative().max(10000),
  acUsage: z.enum(["low", "medium", "high"]),
  applianceUsage: z.enum(["efficient", "standard", "high-demand"]),
  shoppingLevel: z.enum(["low", "medium", "high"]),
  lifestyleGoals: z.array(z.string().max(100)).min(1).max(10),
});

async function startServer() {
  const app = express();
  
  // Enforce rigid payload size limits to mitigate large-JSON buffer exploitation DoS
  app.use(express.json({ limit: "15kb" }));

  // Request Rate Limiting / API Throttling specifically targeting the full stack API routes
  const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 60,                // Maximum 60 API requests per IP every 15 minutes
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
      error: "Too many requests from this IP. Rate limit exceeded. Please wait 15 minutes before retrying.",
    },
  });

  // Apply rate limiter to all api routes
  app.use("/api/", apiRateLimiter);

  // API Route: Analyze carbon twin inputs
  app.post("/api/carbon-twin/analyze", async (req, res) => {
    try {
      // Validate incoming payload with strict Zod parsing
      const validationResult = carbonTwinInputSchema.safeParse(req.body);
      if (!validationResult.success) {
        // Return structured, clean, non-leaking error descriptions
        return res.status(400).json({
          error: "Strict validation check failed. Invalid payload formatting.",
          details: validationResult.error.format(),
        });
      }

      const inputs = validationResult.data;

      // Unpack, apply defaults, and run deep sanitization on open-form strings
      const {
        transportation,
        carMileage = 10000,
        carType = "gas",
        domesticFlights,
        internationalFlights,
        flightClass,
        foodDiet,
        electricityUsage,
        acUsage,
        applianceUsage,
        shoppingLevel,
        lifestyleGoals,
      } = inputs;

      // Sanitize the potential open-ended goals list to prevent prompt / output injection vectors
      const sanitizedGoals = lifestyleGoals.map(sanitizeInputString);

      const ai = getGeminiClient();

      const systemInstruction = `You are CarbonTwin AI, a Senior Sustainability Analyst and Carbon Digital Twin Engine.
Your job is to analyze the user's lifestyle profile, calculate their current carbon intensity (where 0 is best/zero-emissions and 100 is highest carbon footprint), classify their sustainability personality, forecast future emissions, and generate prioritized context-aware recommendations.

DECISION-MAKING LOGIC:
You must strictly prioritize recommendations using this logic:
Impact Score = (Carbon ReductionPotential * Feasibility * User Preference Alignment).
- Focus on heavy-hitting emission categories first. For example, if a user has many flights, reducing one flight yields high CO2 reduction, which is far superior than turning off lightbulbs.
- Map recommendations to user's lifestyle goals. If they want to "save money," highlight cost savings. If they want "sustainable food," prioritize dietary adjustments.
- High carbon output triggers "Critical" or "High" risk levels.

Provide an accurate numerical carbonScore from 0 (ultra-green/zero emissions) to 100 (extreme emissions).
Generate standard estimated annual emission ranges in kg CO2e/year:
- Transportation: average gas car is ~0.2-0.4 kg/km. Electric car is 0.05-0.1. Metro/Bus is 0.05. Bike/Walking is 0.
- Flights: domestic flight is ~150-250 kg CO2e. International is ~1000-2000 kg CO2e depending on class (economy=1x, business=3x, first=4x).
- Food: Vegan ~800, Vegetarian ~1200, Mixed ~1800, Non-Vegetarian ~2500 kg CO2e/year.
- Home Energy: Electricity usage (e.g. usage in kWh = bill * 5) emits ~0.4 kg/kWh. Plus AC/Appliances modifiers.
- Shopping: Low ~500, Medium ~1500, High ~4000 kg CO2e/year.

Return standard values in the JSON schema. Everything must be structurally valid and numerically matching. Ensure fields like "carbonReductionPotential" and "estimatedMoneySaved" are detailed strings with values and units.`;

      const prompt = `Analyze this user's lifestyle inputs and generate their Carbon Digital Twin analysis.
      
USER LIFESTYLE HIGHLIGHTS:
- Primary Transportation: ${transportation} ${transportation === 'car' ? `(Mileage: ${carMileage} miles/year, Type: ${carType})` : ''}
- Flights: ${domesticFlights} domestic/year, ${internationalFlights} international/year (Class: ${flightClass})
- Food Diet: ${foodDiet}
- Home Energy: Electricity consumption equivalent to ~${electricityUsage} kWh/month with AC usage estimated as "${acUsage}" and appliances as "${applianceUsage}"
- Shopping Level: ${shoppingLevel}
- Stated Lifestyle Goals: ${JSON.stringify(sanitizedGoals)}

Based on this, return the Carbon Twin analysis structure. Evaluate the highest impact actions according to the decision-making logic.`;

      // Define standard modern @google/genai schema
      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          carbonPersonality: {
            type: Type.STRING,
            description: "A fitting persona name from standard list (e.g., Road Warrior, Conscious Consumer, Urban Commuter, High-Flyer, Eco Enthusiast, Home Energy Giant)"
          },
          carbonScore: {
            type: Type.INTEGER,
            description: "An overall carbon footprint score on a scale from 0 (best, zero footprint) to 100 (worst, extreme footprint)."
          },
          riskLevel: {
            type: Type.STRING,
            description: "Risk Level: Low, Medium, High, or Critical based on emission intensity."
          },
          topEmissionSources: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of the top 2-3 emission categories contributing to their total."
          },
          forecast30Days: {
            type: Type.STRING,
            description: "Explanation of 30-day forecasted emissions (e.g. '380 kg CO2e')"
          },
          forecast90Days: {
            type: Type.STRING,
            description: "Explanation of 90-day forecasted emissions (e.g. '1,140 kg CO2e')"
          },
          annualProjection: {
            type: Type.STRING,
            description: "Exhaustive annual projected total footprint (e.g., '4,560 kg CO2e / year')"
          },
          topRecommendation: {
            type: Type.STRING,
            description: "Short highlight phrase of the #1 single highest-impact recommendation."
          },
          carbonReductionPotential: {
            type: Type.STRING,
            description: "Total annual potential carbon reduction across recommendations (e.g., '1,200 kg CO2e/year')"
          },
          estimatedMoneySaved: {
            type: Type.STRING,
            description: "Total potential financial savings from implementing recommendations (e.g., '$450/year')"
          },
          explanation: {
            type: Type.STRING,
            description: "High-level diagnostic summary explaining why they have this personality and score."
          },
          emissionBreakdown: {
            type: Type.OBJECT,
            properties: {
              transportation: { type: Type.INTEGER, description: "Calculated subtotal for transport in kg CO2e/year" },
              flights: { type: Type.INTEGER, description: "Calculated subtotal for flights in kg CO2e/year" },
              food: { type: Type.INTEGER, description: "Calculated subtotal for food in kg CO2e/year" },
              energy: { type: Type.INTEGER, description: "Calculated subtotal for home energy in kg CO2e/year" },
              shopping: { type: Type.INTEGER, description: "Calculated subtotal for goods/shopping in kg CO2e/year" }
            },
            required: ["transportation", "flights", "food", "energy", "shopping"]
          },
          recommendations: {
            type: Type.ARRAY,
            description: "List of the TOP 3 personalized concrete recommendations sorted by Impact Score.",
            items: {
              type: Type.OBJECT,
              properties: {
                actionName: { type: Type.STRING, description: "Brief title of the recommended action" },
                co2Reduction: { type: Type.STRING, description: "Estimated year reduction (e.g. '450 kg CO2e')" },
                monetarySavings: { type: Type.STRING, description: "Estimated year savings (e.g. '$120')" },
                easeOfImplementation: { type: Type.STRING, description: "easy, medium, or hard" },
                whySelected: { type: Type.STRING, description: "Why we recommended this given their specific flights, dietary context or preferences" },
                expectedImpactDescription: { type: Type.STRING, description: "Brief description of the ecological impact" },
                implementationStep: { type: Type.STRING, description: "The single first actionable step they can take today" }
              },
              required: ["actionName", "co2Reduction", "monetarySavings", "easeOfImplementation", "whySelected", "expectedImpactDescription", "implementationStep"]
            }
          }
        },
        required: [
          "carbonPersonality",
          "carbonScore",
          "riskLevel",
          "topEmissionSources",
          "forecast30Days",
          "forecast90Days",
          "annualProjection",
          "topRecommendation",
          "carbonReductionPotential",
          "estimatedMoneySaved",
          "explanation",
          "emissionBreakdown",
          "recommendations"
        ]
      };

      const result = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema,
          temperature: 0.2, // Low temperature for consistent analysis results
        }
      });

      const responseText = result.text;
      if (!responseText) {
        throw new Error("No response received from the Gemini AI model.");
      }

      const analyzedOutput = JSON.parse(responseText.trim());
      res.json(analyzedOutput);

    } catch (error: any) {
      console.error("Gemini carbon-twin analysis error:", error);
      res.status(500).json({
        error: error.message || "Failed to analyze carbon digital twin.",
        help: "If you are running this app for the first time, please ensure your GEMINI_API_KEY is configured in the Settings > Secrets menu."
      });
    }
  });

  // Handle Vite Asset Serving & SPA Routing
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CarbonTwin AI full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
