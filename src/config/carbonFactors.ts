/**
 * Carbon emission factors and constant multipliers for CarbonTwin AI.
 * All factors represent annual values or sub-calculations using pure SI metrics.
 */

export const FLIGHT_FACTORS = {
  DOMESTIC_KG: 200,          // average kg CO2e per flight
  INTERNATIONAL_KG: 1300,    // average kg CO2e per flight
  BUSINESS_MULTIPLIER: 3,
  FIRST_MULTIPLIER: 4,
};

export const TRANSPORT_FACTORS = {
  DEFAULT_CAR_MILEAGE: 12000,
  CAR_EMISSIONS_BY_TYPE: {
    gas: 0.35,      // kg CO2e per mile
    diesel: 0.3060,  // kg CO2e per mile
    hybrid: 0.18,    // kg CO2e per mile
    electric: 0.08,  // kg CO2e per mile
  },
  BIKE_WALKING_EMISSIONS: 0,
  PUBLIC_TRANSIT_EMISSIONS: 400, // standard annual default for bus/metro (kg CO2e)
};

export const DIET_FACTORS = {
  vegan: 750,           // kg CO2e per year
  vegetarian: 1100,     // kg CO2e per year
  mixed: 1800,          // kg CO2e per year
  "non-vegetarian": 2500, // kg CO2e per year
};

export const ENERGY_FACTORS = {
  ELECTRICITY_MULTIPLIER: 5, // estimated annual multiplier per monthly dollar bill/kwh metric
};

export const SHOPPING_FACTORS = {
  low: 600,       // kg CO2e per year
  medium: 1500,   // kg CO2e per year
  high: 3800,     // kg CO2e per year
};

export const SIMULATION_FACTORS = {
  KG_REDUCTION_PER_SCORE_POINT: 80, // roughly 1 point of score reduction per 80kg saved
};
