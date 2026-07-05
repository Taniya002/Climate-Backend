import { getCropProfile } from "../mcp/agricultureMCP.js";

/**
 * Financial Impact Agent
 *
 * Estimates yield loss and revenue impact from climate risk, and the
 * potential revenue benefit of switching crop strategy. Uses simple,
 * transparent multipliers rather than a full market model -- appropriate
 * for capstone scope, and the Evaluation Engine tracks this as a directional
 * estimate, not a guarantee.
 */

const ASSUMED_REVENUE_PER_ACRE_USD = {
  wheat: 600,
  rice: 700,
  millet: 450,
  maize: 550,
  sorghum: 480,
  sugarcane: 1200,
  barley: 520,
cotton: 850,
soybean: 600,
mustard: 500,
};

// Used to scale how much an alternative crop's resilience reduces yield
// loss under the same climate conditions. Higher tolerance crops lose much
// less of their (smaller) base revenue, which is what actually makes the
// switch worthwhile under high risk.
const DROUGHT_TOLERANCE_LOSS_FACTOR = {
  very_low: 1.1,
  low: 1.0,
  medium: 0.6,
  high: 0.25,
};

function estimateYieldLossPct(climateRiskScore, droughtTolerance = "low") {
  let baseLoss;
  if (climateRiskScore <= 30) baseLoss = 5;
  else if (climateRiskScore <= 60) baseLoss = 12;
  else if (climateRiskScore <= 85) baseLoss = 20;
  else baseLoss = 35;

  const factor = DROUGHT_TOLERANCE_LOSS_FACTOR[droughtTolerance] ?? 1.0;
  return Math.round(baseLoss * factor);
}

export function runFinancialImpactAgent({ currentCrop, climateRiskOutput, cropStrategyOutput, farmSizeAcres = 1 }) {
  if (climateRiskOutput.data_unavailable) {
    return {
      agent: "financial_impact",
      skill_used: "financial-impact-skill",
      confidence: 0,
      message: "Climate risk data unavailable, financial estimate skipped.",
    };
  }

  const cropKey = currentCrop.toLowerCase();
  const currentProfile = getCropProfile(currentCrop);
  const baseRevenuePerAcre = ASSUMED_REVENUE_PER_ACRE_USD[cropKey] || 500;
  const currentTolerance = currentProfile.found ? currentProfile.drought_tolerance : "low";
  const yieldLossPct = estimateYieldLossPct(climateRiskOutput.climate_risk_score, currentTolerance);
  const revenueLossUsd = Math.round(baseRevenuePerAcre * farmSizeAcres * (yieldLossPct / 100));

  const result = {
    agent: "financial_impact",
    skill_used: "financial-impact-skill",
    current_crop: currentCrop,
    expected_yield_loss_pct: yieldLossPct,
    estimated_revenue_loss_usd: revenueLossUsd,
    confidence: 0.68,
  };

  if (cropStrategyOutput && cropStrategyOutput.recommended_alternative) {
    const altCropName = cropStrategyOutput.recommended_alternative;
    const altKey = altCropName.toLowerCase();
    const altProfile = getCropProfile(altCropName);
    const altTolerance = altProfile.found ? altProfile.drought_tolerance : "medium";
    const altRevenuePerAcre = ASSUMED_REVENUE_PER_ACRE_USD[altKey] || baseRevenuePerAcre;
    const altYieldLossPct = estimateYieldLossPct(climateRiskOutput.climate_risk_score, altTolerance);

    const altRevenue = altRevenuePerAcre * farmSizeAcres * (1 - altYieldLossPct / 100);
    const currentRevenue = baseRevenuePerAcre * farmSizeAcres * (1 - yieldLossPct / 100);
    const revenueChangePct = Math.round(((altRevenue - currentRevenue) / currentRevenue) * 100);

    result.alternative_crop = altCropName;
    result.alternative_yield_loss_pct = altYieldLossPct;
    result.expected_revenue_change_pct = revenueChangePct;
    result.note =
      revenueChangePct < 0
        ? `${altCropName} has lower revenue potential per acre than ${currentCrop}, but loses far less yield under this climate risk, reducing downside risk in a severe season.`
        : `${altCropName} is expected to outperform ${currentCrop} both in resilience and revenue under this climate risk.`;
  }

  return result;
}
