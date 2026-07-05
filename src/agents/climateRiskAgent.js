import { getWeatherData } from "../mcp/weatherMCP.js";
import { getCropProfile } from "../mcp/agricultureMCP.js";
import { callGeminiJSON } from "../config/groq.js";



function computeRiskScores({ cropProfile, weather, scenarioDeltas }) {
  let rainfallForecast = weather.forecast_rainfall_mm_7day;
  let tempMaxForecast = weather.forecast_temp_max_c;

  if (scenarioDeltas) {
    if (scenarioDeltas.rainfall_pct !== undefined) {
      rainfallForecast = rainfallForecast * (1 + scenarioDeltas.rainfall_pct / 100);
    }
    if (scenarioDeltas.temp_delta !== undefined) {
      tempMaxForecast = tempMaxForecast + scenarioDeltas.temp_delta;
    }
  }

  const [waterMin, waterMax] = cropProfile.water_requirement_mm;
  const seasonalEquivalent = rainfallForecast * 12; // rough 7-day -> seasonal proxy
  const rainfallDeficitRisk = Math.min(
    100,
    Math.max(0, Math.round(((waterMin - seasonalEquivalent) / waterMin) * 100))
  );

  const { safe, risk_onset, severe } = cropProfile.heat_thresholds_c;
  let heatRisk = 0;
  if (tempMaxForecast >= severe) heatRisk = 90;
  else if (tempMaxForecast >= risk_onset) heatRisk = 65;
  else if (tempMaxForecast >= safe) heatRisk = 35;
  else heatRisk = 10;

  const droughtToleranceMultiplier = {
    very_low: 1.2,
    low: 1.0,
    medium: 0.8,
    high: 0.5,
  }[cropProfile.drought_tolerance] || 1.0;

  const droughtRisk = Math.min(100, Math.round(rainfallDeficitRisk * droughtToleranceMultiplier));

  const climateRiskScore = Math.round(droughtRisk * 0.4 + heatRisk * 0.3 + rainfallDeficitRisk * 0.3);

  return {
    climate_risk_score: climateRiskScore,
    drought_risk: droughtRisk,
    heatwave_risk: heatRisk,
    rainfall_deficit_risk: rainfallDeficitRisk,
    adjusted_rainfall_mm: Math.round(rainfallForecast * 10) / 10,
    adjusted_temp_max_c: Math.round(tempMaxForecast * 10) / 10,
  };
}

export async function runClimateRiskAgent({ location, crop, scenarioDeltas }) {
  const weather = await getWeatherData(location);

  if (weather.data_unavailable) {
    return {
      agent: "climate_risk",
      skill_used: "climate-risk-skill",
      climate_risk_score: null,
      confidence: 0,
      data_unavailable: true,
      message: "Unable to retrieve weather data. Risk assessment skipped.",
    };
  }
   const cropProfile = getCropProfile(crop);

if (!cropProfile.found) {
  const heatRisk = weather.forecast_temp_max_c > 42 ? 80 
    : weather.forecast_temp_max_c > 35 ? 55 
    : 25;
  const rainfallRisk = weather.forecast_rainfall_mm_7day < 10 ? 75
    : weather.forecast_rainfall_mm_7day < 25 ? 45
    : 15;
  const generalScore = Math.round(heatRisk * 0.5 + rainfallRisk * 0.5);
  
  return {
    agent: "climate_risk",
    skill_used: "climate-risk-skill",
    climate_risk_score: generalScore,
    drought_risk: rainfallRisk,
    heatwave_risk: heatRisk,
    rainfall_deficit_risk: rainfallRisk,
    expected_threats: [
      ...(heatRisk > 50 ? ["High Temperature"] : []),
      ...(rainfallRisk > 50 ? ["Low Rainfall"] : []),
    ],
    resolved_location: weather.resolved_location,
    adjusted_temp_max_c: weather.forecast_temp_max_c,
    adjusted_rainfall_mm: weather.forecast_rainfall_mm_7day,
    confidence: 0.45,
    data_unavailable: false,
    note: "Crop not in knowledge base. Using general climate assessment.",
  };
}

  const scores = computeRiskScores({ cropProfile, weather, scenarioDeltas });

  let expectedThreats = [];
  if (scores.rainfall_deficit_risk > 50) expectedThreats.push("Low Rainfall");
  if (scores.heatwave_risk > 50) expectedThreats.push("High Temperature");

  return {
    agent: "climate_risk",
    skill_used: "climate-risk-skill",
    ...scores,
    expected_threats: expectedThreats,
    resolved_location: weather.resolved_location,
    confidence: 0.82,
    data_unavailable: false,
  };
}
