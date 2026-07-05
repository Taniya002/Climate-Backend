import { getIrrigationEfficiency } from "../mcp/agricultureMCP.js";

/**
 * Water Management Agent
 *
 * Loads water-management-skill logic. Recommends irrigation method and
 * water-saving practices based on drought risk level.
 */

export function runWaterManagementAgent({ crop, climateRiskOutput, currentIrrigationMethod }) {
  if (climateRiskOutput.data_unavailable) {
    return {
      agent: "water_management",
      skill_used: "water-management-skill",
      recommended_irrigation: null,
      confidence: 0,
      message: "Climate risk data unavailable, water recommendation skipped.",
    };
  }

  const droughtRisk = climateRiskOutput.drought_risk;
  const efficiency = getIrrigationEfficiency();
  const method = (currentIrrigationMethod || "flood").toLowerCase();

  if (droughtRisk < 30) {
    return {
      agent: "water_management",
      skill_used: "water-management-skill",
      recommended_irrigation: method,
      expected_water_savings_pct: 0,
      additional_tips: ["Current irrigation approach is adequate given low drought risk."],
      confidence: 0.7,
    };
  }

  if (droughtRisk >= 30 && droughtRisk <= 60) {
    return {
      agent: "water_management",
      skill_used: "water-management-skill",
      recommended_irrigation: method,
      expected_water_savings_pct: 10,
      additional_tips: [
        "Irrigate early morning or evening to reduce evaporation loss.",
        "Apply mulch around root zones to retain soil moisture.",
      ],
      confidence: 0.74,
    };
  }

  // droughtRisk > 60 - recommend infrastructure upgrade if not already on drip
  if (method === "drip") {
    return {
      agent: "water_management",
      skill_used: "water-management-skill",
      recommended_irrigation: "drip",
      expected_water_savings_pct: 0,
      additional_tips: ["Already using drip irrigation, the most efficient available method."],
      confidence: 0.8,
    };
  }

  return {
    agent: "water_management",
    skill_used: "water-management-skill",
    recommended_irrigation: "Drip Irrigation",
    expected_water_savings_pct: efficiency.drip.water_savings_vs_flood_pct,
    additional_tips: [
      "Irrigate early morning to reduce evaporation.",
      "Apply mulch to retain soil moisture.",
    ],
    confidence: 0.8,
  };
}
