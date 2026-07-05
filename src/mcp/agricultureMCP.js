/**
 * Agriculture Knowledge MCP
 *
 * Provides crop information and climate adaptation reference data to agents.
 * For capstone scope this is a curated local dataset rather than a live
 * external API (avoids paid agriculture data providers). It is structured
 * as a tool-call interface so it can be replaced with a real MCP-connected
 * agriculture database later without changing any agent code.
 */

const CROP_DATA = {
  wheat: {
    water_requirement_mm: [450, 650],
    drought_tolerance: "low",
    heat_thresholds_c: { safe: 32, risk_onset: 34, severe: 38 },
    season: "Rabi",
    sowing_window: { start: "10-15", end: "11-30" },
  },
  rice: {
    water_requirement_mm: [900, 1200],
    drought_tolerance: "very_low",
    heat_thresholds_c: { safe: 35, risk_onset: 37, severe: 40 },
    season: "Kharif",
    sowing_window: { start: "06-01", end: "07-15" },
  },
  millet: {
    water_requirement_mm: [250, 400],
    drought_tolerance: "high",
    heat_thresholds_c: { safe: 40, risk_onset: 42, severe: 45 },
    season: "Kharif",
    sowing_window: { start: "06-15", end: "07-15" },
  },
  maize: {
    water_requirement_mm: [500, 800],
    drought_tolerance: "medium",
    heat_thresholds_c: { safe: 33, risk_onset: 35, severe: 38 },
    season: "Both",
    sowing_window: { start: "06-01", end: "07-15" },
  },
  sorghum: {
    water_requirement_mm: [300, 500],
    drought_tolerance: "high",
    heat_thresholds_c: { safe: 38, risk_onset: 40, severe: 43 },
    season: "Both",
    sowing_window: { start: "06-01", end: "07-31" },
  },
  sugarcane: {
    water_requirement_mm: [1500, 2500],
    drought_tolerance: "very_low",
    heat_thresholds_c: { safe: 38, risk_onset: 40, severe: 42 },
    season: "Annual",
    sowing_window: { start: "02-01", end: "03-31" },
  },
  barley: {
  water_requirement_mm: [350, 500],
  drought_tolerance: "medium",
  heat_thresholds_c: { safe: 30, risk_onset: 32, severe: 36 },
  season: "Rabi",
  sowing_window: { start: "10-15", end: "11-15" },
},
cotton: {
  water_requirement_mm: [700, 1300],
  drought_tolerance: "low",
  heat_thresholds_c: { safe: 37, risk_onset: 40, severe: 43 },
  season: "Kharif",
  sowing_window: { start: "04-15", end: "06-15" },
},
soybean: {
  water_requirement_mm: [450, 700],
  drought_tolerance: "medium",
  heat_thresholds_c: { safe: 32, risk_onset: 35, severe: 38 },
  season: "Kharif",
  sowing_window: { start: "06-15", end: "07-15" },
},
mustard: {
  water_requirement_mm: [250, 400],
  drought_tolerance: "high",
  heat_thresholds_c: { safe: 27, risk_onset: 30, severe: 33 },
  season: "Rabi",
  sowing_window: { start: "10-01", end: "11-15" },
},
};

const SUBSTITUTION_MAP = {
  wheat: { drought: ["millet", "sorghum"], heat: ["millet", "sorghum"], both: ["millet"] },
  rice: { drought: ["maize", "millet"], heat: ["millet"], both: ["millet"] },
  maize: { drought: ["millet", "sorghum"], heat: ["sorghum"], both: ["sorghum"] },
  sugarcane: { drought: ["sorghum"], heat: ["sorghum"], both: ["sorghum"] },
  barley: { drought: ["mustard", "sorghum"], heat: ["mustard"], both: ["mustard"] },
cotton: { drought: ["sorghum", "millet"], heat: ["sorghum"], both: ["sorghum"] },
soybean: { drought: ["millet", "sorghum"], heat: ["sorghum"], both: ["sorghum"] },
};

export function getCropProfile(cropName) {
  const key = cropName.toLowerCase().trim();
  if (!CROP_DATA[key]) {
    return { found: false, error: `No agriculture knowledge entry for crop: ${cropName}` };
  }
  return { found: true, crop: key, ...CROP_DATA[key] };
}

export function getSubstitutionOptions(cropName, dominantThreat) {
  const key = cropName.toLowerCase().trim();
  const map = SUBSTITUTION_MAP[key];
  if (!map) return [];
  return map[dominantThreat] || map.both || [];
}

export function getIrrigationEfficiency() {
  return {
    flood: { efficiency_pct: 40, water_savings_vs_flood_pct: 0 },
    sprinkler: { efficiency_pct: 70, water_savings_vs_flood_pct: 20 },
    drip: { efficiency_pct: 90, water_savings_vs_flood_pct: 35 },
  };
}
