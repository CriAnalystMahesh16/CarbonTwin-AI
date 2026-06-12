# CarbonTwin AI: Advanced Architecture & Technical Documentation
*System: Carbon Digital Twin Engine (Feature 1 Specifications)*

---

## 1. System Architecture Overview

CarbonTwin AI is designed as a secure, real-time, stateful full-stack application. Rather than offering static, backward-looking carbon calculators, the platform constructs an active **Carbon Digital Twin** of the user's lifestyle.

```
+-----------------------------------------------------------------+
|                       Vite React Client                         |
|   - SetupTwinForm             - Carbon Score & Personality Card |
|   - Recharts Analytics Panel  - Interactive Simulation Engine   |
|   - In-App Test Automation    - Architectural Spec Viewer       |
+-------------------------------+---------------------------------+
                                | HTTPS
                                v
+-----------------------------------------------------------------+
|                         Express Server                          |
|   - /api/carbon-twin/analyze Proxy                              |
|   - Gemini-3.5-Flash Integration with @google/genai             |
|   - Production Bundle Serving (esbuild CommonJS output)        |
+-------------------------------+---------------------------------+
                                |
                                +-----------------------------+
                                |                             |
                                v Secure Firebase SDK         v AI SDK API Calls
                +---------------+---------------+     +-------+-------+
                |     Cloud Firestore (ABAC)     |     |   Gemini AI   |
                |   - /users/{userId}           |     |   - Flash LMM |
                |   - /users/{userId}/twins/*   |     +---------------+
                +-------------------------------+
```

### Components:
1. **Frontend (Vite + React 19 + Tailwind CSS + Motion)**:
   A high-contrast, fully responsive client containing an interactive configuration form, twin diagnostic dials, simulated adjustments, and a live validation runner.
2. **Backend (Express + esbuild ESM/CJS Compilation)**:
   A Node.js backend acting as a secure proxy to the Gemini API, keeping credentials concealed on the server-side.
3. **Database (Cloud Firestore + ABAC Rules)**:
   Stores historical twin snapshots under user-isolated subcollections, authenticated via Firebase.

---

## 2. Firestore Database Schema definition

The platform secures user profiles and twins historical states with strict schema properties:

### Entity: `UserProfile`
- **/users/{userId}**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "UserProfile",
  "type": "object",
  "properties": {
    "uid": { "type": "string", "description": "Unique user account ID" },
    "email": { "type": "string", "format": "email", "description": "Registered email address" },
    "displayName": { "type": "string", "description": "Display name of the user" },
    "createdAt": { "type": "string", "format": "date-time" }
  },
  "required": ["uid", "email", "createdAt"]
}
```

### Entity: `CarbonTwinState`
- **/users/{userId}/twins/{twinId}**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "CarbonTwinState",
  "type": "object",
  "properties": {
    "id": { "type": "string", "description": "Unique historical state entry ID" },
    "userId": { "type": "string", "description": "Reference to the owner user profile ID" },
    "createdAt": { "type": "string", "format": "date-time", "description": "Timestamp of this snapshot" },
    "inputs": {
      "type": "object",
      "properties": {
        "transportation": { "type": "string", "enum": ["car", "bike", "bus", "metro", "walking"] },
        "carMileage": { "type": "integer" },
        "carType": { "type": "string", "enum": ["gas", "diesel", "hybrid", "electric"] },
        "domesticFlights": { "type": "integer" },
        "internationalFlights": { "type": "integer" },
        "flightClass": { "type": "string", "enum": ["economy", "business", "first"] },
        "foodDiet": { "type": "string", "enum": ["vegetarian", "vegan", "mixed", "non-vegetarian"] },
        "electricityUsage": { "type": "integer" },
        "acUsage": { "type": "string", "enum": ["low", "medium", "high"] },
        "applianceUsage": { "type": "string", "enum": ["efficient", "standard", "high-demand"] },
        "shoppingLevel": { "type": "string", "enum": ["low", "medium", "high"] },
        "lifestyleGoals": { "type": "array", "items": { "type": "string" } }
      },
      "required": ["transportation", "domesticFlights", "internationalFlights", "flightClass", "foodDiet", "electricityUsage", "acUsage", "applianceUsage", "shoppingLevel", "lifestyleGoals"]
    },
    "analysis": {
      "type": "object",
      "properties": {
        "carbonPersonality": { "type": "string" },
        "carbonScore": { "type": "integer", "minimum": 0, "maximum": 100 },
        "riskLevel": { "type": "string", "enum": ["Low", "Medium", "High", "Critical"] },
        "topEmissionSources": { "type": "array", "items": { "type": "string" } },
        "forecast30Days": { "type": "string" },
        "forecast90Days": { "type": "string" },
        "annualProjection": { "type": "string" },
        "topRecommendation": { "type": "string" },
        "carbonReductionPotential": { "type": "string" },
        "estimatedMoneySaved": { "type": "string" },
        "explanation": { "type": "string" },
        "emissionBreakdown": {
          "type": "object",
          "properties": {
            "transportation": { "type": "integer" },
            "flights": { "type": "integer" },
            "food": { "type": "integer" },
            "energy": { "type": "integer" },
            "shopping": { "type": "integer" }
          },
          "required": ["transportation", "flights", "food", "energy", "shopping"]
        },
        "recommendations": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "actionName": { "type": "string" },
              "co2Reduction": { "type": "string" },
              "monetarySavings": { "type": "string" },
              "easeOfImplementation": { "type": "string", "enum": ["easy", "medium", "hard"] },
              "whySelected": { "type": "string" },
              "expectedImpactDescription": { "type": "string" },
              "implementationStep": { "type": "string" }
            },
            "required": ["actionName", "co2Reduction", "monetarySavings", "easeOfImplementation", "whySelected", "expectedImpactDescription", "implementationStep"]
          }
        }
      }
    }
  },
  "required": ["id", "userId", "createdAt", "inputs", "analysis"]
}
```

---

## 3. Gemini Prompt System Template

The core intelligence layer implements structured JSON output schema calls using `@google/genai` on the server:

- **System Instruction**:
```text
You are CarbonTwin AI, a Senior Sustainability Analyst and Carbon Digital Twin Engine.
Your job is to analyze the user's lifestyle profile, calculate their current carbon intensity (where 0 is best/zero-emissions and 100 is highest carbon footprint), classify their sustainability personality, forecast future emissions, and generate prioritized context-aware recommendations.

DECISION-MAKING LOGIC:
You must strictly prioritize recommendations using this logic:
Impact Score = (Carbon ReductionPotential * Feasibility * User Preference Alignment).
- Focus on heavy-hitting emission categories first. For example, if a user has many flights, reducing one flight yields high CO2 reduction, which is far superior than turning off lightbulbs.
- Map recommendations to user's lifestyle goals. If they want to "save money," highlight cost savings. If they want "sustainable food," prioritize dietary adjustments.
- High carbon output triggers "Critical" or "High" risk levels.

Provide an accurate numerical carbonScore from 0 (ultra-green) to 100 (extreme emissions).
Generate standard estimated annual emission ranges in kg CO2e/year:
- Transportation: average gas car is ~0.2-0.4 kg/km. Electric car is 0.05-0.1. Metro/Bus is 0.05. Bike/Walking is 0.
- Flights: domestic flight is ~150-250 kg CO2e. International is ~1000-2000 kg CO2e depending on class (economy=1x, business=3x, first=4x).
- Food: Vegan ~800, Vegetarian ~1200, Mixed ~1800, Non-Vegetarian ~2500 kg CO2e/year.
- Home Energy: Electricity usage (e.g. usage in kWh = bill * 5) emits ~0.4 kg/kWh. Plus AC/Appliances modifiers.
- Shopping: Low ~500, Medium ~1500, High ~4000 kg CO2e/year.

Return standard values in the JSON schema. Everything must be structurally valid and numerically matching. Ensure fields like "carbonReductionPotential" and "estimatedMoneySaved" are detailed strings with values and units.
```

- **User Inputs context template**:
```text
Analyze this user's lifestyle inputs and generate their Carbon Digital Twin analysis.
      
USER LIFESTYLE HIGHLIGHTS:
- Primary Transportation: {{transportation}} {{transportation === 'car' ? '(Mileage: {{carMileage}} miles/year, Type: {{carType}})' : ''}}
- Flights: {{domesticFlights}} domestic/year, {{internationalFlights}} international/year (Class: {{flightClass}})
- Food Diet: {{foodDiet}}
- Home Energy: Electricity consumption equivalent to ~{{electricityUsage}} kWh/month with AC usage estimated as "{{acUsage}}" and appliances as "{{applianceUsage}}"
- Shopping Level: {{shoppingLevel}}
- Stated Lifestyle Goals: {{lifestyleGoals}}

Based on this, return the Carbon Twin analysis structure. Evaluate the highest impact actions according to the decision-making logic.
```

---

## 4. Decision Engine Logic Implementation

The core algorithm of the Engine uses a relative weighting score to select recommendations:

$$\text{Impact Score} = \text{CO}_2 \text{ Reduction Potential} \times \text{Feasibility Coefficient} \times \text{Goal Alignment Factor}$$

### Parameter Mapping:
- **Feasibility Coefficient**: Easy = 1.0, Medium = 0.8, Hard = 0.5.
- **Goal Alignment Factor**:
  - $1.2$ if recommendation is directly named in `userGoals` (e.g., "Reduce flight" matches `sustainable_travel` goal).
  - $1.0$ standard reference.
- **Heuristic Selection Grid**:
  1. If flight emissions represent $>35\%$ of total, and flights $>0$: recommend flight offsets or trip reductions first.
  2. If transportation represents $>30\%$ and type is "gas" or "diesel": recommend switching commute mode or EV shift.
  3. If home energy represents $>30\%$: recommend high-demand appliance replacement or solar/smart thermostats.

---

## 5. API Contracts (`POST /api/carbon-twin/analyze`)

- **Payload Spec**:
```json
{
  "transportation": "car",
  "carMileage": 12000,
  "carType": "electric",
  "domesticFlights": 2,
  "internationalFlights": 1,
  "flightClass": "economy",
  "foodDiet": "vegetarian",
  "electricityUsage": 350,
  "acUsage": "medium",
  "applianceUsage": "standard",
  "shoppingLevel": "medium",
  "lifestyleGoals": ["reduce_emissions", "save_money"]
}
```

- **Response JSON**:
```json
{
  "carbonPersonality": "Conscious Consumer",
  "carbonScore": 38,
  "riskLevel": "Medium",
  "topEmissionSources": ["Home Energy", "Flights"],
  "forecast30Days": "240 kg CO2e",
  "forecast90Days": "720 kg CO2e",
  "annualProjection": "2,880 kg CO2e",
  "topRecommendation": "Switch standard appliances to EnergyStar certified items",
  "carbonReductionPotential": "600 kg CO2e/year",
  "estimatedMoneySaved": "$150/year",
  "explanation": "Your low active transit and diet choice results in lower emissions, but international flight and standard home ventilation remain active contributors.",
  "emissionBreakdown": {
    "transportation": 300,
    "flights": 1100,
    "food": 500,
    "energy": 680,
    "shopping": 300
  },
  "recommendations": [
    {
      "actionName": "Upgrade home appliances to EnergyStar grade",
      "co2Reduction": "300 kg CO2e/year",
      "monetarySavings": "$80/year",
      "easeOfImplementation": "medium",
      "whySelected": "Matches your stated save_money goal and addresses standard electricity loads.",
      "expectedImpactDescription": "Reduces primary grid draft of domestic appliances by 15%.",
      "implementationStep": "Review and replace old refrigerator or water pump with rated units."
    }
  ]
}
```

---

## 6. Comprehensive Testing Strategy

Our testing framework encompasses four secure vectors executed in our live in-app test runner:

### A. Unit Tests:
- Verify mathematical integrity: total calculated footprint equals the sum of categoric subtotals.
- Confirm standard input validations block negative flight numbers or mileages.

### B. Integration Tests:
- Ensure the server-side `/api/carbon-twin/analyze` maps payload options correctly and preserves structural integrity.
- Verify fallback parameters are initialized if non-required fields are omitted.

### C. Accessibility (a11y) Tests:
- Automated contrast checker simulations.
- Ensure all screen reader labels (`aria-label`, headings hierarchy, touch target sizes $\ge 44\text{px}$) are fully present and compliant.

### D. Security Verification (ABAC Rules & Input checks):
- Simulate illegal "Dirty Dozen" payload writes targeting Firestore with spoofed authors or admin parameters to prove **PERMISSION_DENIED** triggers.

---

## 7. Firestore Security Rules Specifications

The system implements strict Zero-Trust Firestore Rules. This ensures that no user can read or write other users' profiles or twins.
Historical state inputs once saved are marked as **Immutable** (updates disabled) to prevent tampering with historical twin carbon projections.

---

## 8. WCAG 2.2 Accessibility Checklist
- **Color Contrast**: Main carbon gauges and indicators maintain high-contrast colors ($\ge 4.5:1$).
- **No Keyboard Traps**: Clean tabIndex sequencing across form inputs, buttons, and simulation toggles.
- **Screen Reader Prompts**: Charts include detailed text table summaries for screen-readers.
- **Target Size**: Active inputs and buttons have touch target sizes exceeding $44\text{px}$.

---

## 9. GitHub-Ready Implementation Plan

### Sprint 1: Setup & Grounding Rules (Day 1)
- Map `firebase-blueprint.json` schemas.
- Implement Express backend template in `server.ts`.

### Sprint 2: Core Twin Engine (Day 2)
- Compose and test prompt template with Gemini-3.5-flash.
- Code advanced simulation panel and stacked analytical charts.

### Sprint 3: Security & Verification (Day 3)
- Audit Firestore rules against shadow writes.
- Launch automated client-side testing console.
- Conduct final WCAG 2.2 compliance audits.
