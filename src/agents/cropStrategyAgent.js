import { getSubstitutionOptions, getCropProfile } from "../mcp/agricultureMCP.js";

/**
 * Crop Strategy Agent
 *
 * Loads crop-planning-skill logic. Decides whether to recommend staying
 * with the current crop or switching to a more resilient alternative,
 * based on the Climate Risk Agent's output.
 */

function getDominantThreat(climateRiskOutput) {
  const { drought_risk, heatwave_risk } = climateRiskOutput;
  if (drought_risk > 60 && heatwave_risk > 60) return "both";
  if (drought_risk >= heatwave_risk) return "drought";
  return "heat";
}

function isSowingWindowOpen(cropProfile, currentDate = new Date()) {
  const { start, end } = cropProfile.sowing_window;
  const [startMonth, startDay] = start.split("-").map(Number);
  const [endMonth, endDay] = end.split("-").map(Number);
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();

  const afterStart = month > startMonth || (month === startMonth && day >= startDay);
  const beforeEnd = month < endMonth || (month === endMonth && day <= endDay);
  return afterStart && beforeEnd;
}

export function runCropStrategyAgent({ currentCrop, climateRiskOutput }) {
  if (climateRiskOutput.data_unavailable) {
    return {
      agent: "crop_strategy",
      skill_used: "crop-planning-skill",
      current_crop: currentCrop,
      recommended_alternative: null,
      reason: "Climate risk data unavailable, cannot generate a reliable crop recommendation.",
      confidence: 0,
    };
  }

  const score = climateRiskOutput.climate_risk_score;

  if (score <= 60) {
    return {
      agent: "crop_strategy",
      skill_used: "crop-planning-skill",
      current_crop: currentCrop,
      risk_level: "Low to Moderate",
      recommended_alternative: null,
      reason: "Conditions are manageable for the current crop this season. Consider minor sowing date adjustments.",
      confidence: 0.75,
    };
  }

  const dominantThreat = getDominantThreat(climateRiskOutput);
  const alternatives = getSubstitutionOptions(currentCrop, dominantThreat);

  if (alternatives.length === 0) {
    return {
      agent: "crop_strategy",
      skill_used: "crop-planning-skill",
      current_crop: currentCrop,
      risk_level: score > 85 ? "Severe" : "High",
      recommended_alternative: null,
     reason: "This crop is not in our knowledge base. Based on general climate risk, consider consulting a local agricultural expert for crop-specific advice.",
      confidence: 0.4,
    };
  }

 const bestAlternative = alternatives[0];
const altProfile = getCropProfile(bestAlternative);
const windowOpen = altProfile.found ? isSowingWindowOpen(altProfile) : true;

  const reasonMap = {
    drought: `${bestAlternative} needs much less water than ${currentCrop} and still gives a reliable yield in dry conditions.`,
    heat: `${bestAlternative} tolerates higher temperatures than ${currentCrop} without losing yield.`,
    both: `${bestAlternative} handles both low rainfall and high heat better than ${currentCrop}, making it safer this season.`,
  };

  if (!windowOpen) {
    return {
      agent: "crop_strategy",
      skill_used: "crop-planning-skill",
      current_crop: currentCrop,
      risk_level: score > 85 ? "Severe" : "High",
      recommended_alternative: null,
      reason: `${bestAlternative} would be safer, but its sowing window for this season has closed. Follow the Water Management Agent's irrigation plan for the current crop, and plan a switch to ${bestAlternative} next season.`,
      alternatives_considered: alternatives,
      confidence: 0.65,
    };
  }

  return {
    agent: "crop_strategy",
    skill_used: "crop-planning-skill",
    current_crop: currentCrop,
    risk_level: score > 85 ? "Severe" : "High",
    recommended_alternative: bestAlternative,
    reason: reasonMap[dominantThreat],
    alternatives_considered: alternatives,
    confidence: 0.79,
  };
}
