/**
 * Recovery Agent
 *
 * Loads recovery-skill logic. Generates a step-by-step emergency plan when
 * climate risk crosses the severe threshold (score > 85). Only invoked by
 * the orchestrator when escalation conditions are met.
 */

const RECOVERY_PLAYBOOKS = {
  drought: [
    "Reduce irrigation frequency and prioritize water for critical growth stages only.",
    "Switch to drought-resistant seed varieties for the next sowing cycle.",
    "Apply mulch immediately to reduce soil moisture loss.",
    "Delay non-essential field operations that increase water stress.",
  ],
  heat: [
    "Shift irrigation timing to early morning to reduce heat stress combined with water loss.",
    "Apply shade netting if available for high-value crop sections.",
    "Shift planting schedule earlier next season to avoid peak heat windows.",
    "Monitor crops daily for early signs of heat stress (leaf curling, wilting).",
  ],
  both: [
    "Reduce irrigation frequency, but ensure critical growth stages are still watered.",
    "Use drought-and-heat-resistant seed varieties for next season.",
    "Shift planting schedule to avoid the most severe weather window.",
    "Set up a weekly monitoring routine to track crop stress signs.",
  ],
};

export function runRecoveryAgent({ climateRiskOutput }) {
  if (climateRiskOutput.data_unavailable) {
    return {
      agent: "recovery",
      skill_used: "recovery-skill",
      triggered: false,
      message: "Climate risk data unavailable, recovery plan skipped.",
    };
  }

  const score = climateRiskOutput.climate_risk_score;
  if (score <= 85) {
    return {
      agent: "recovery",
      skill_used: "recovery-skill",
      triggered: false,
      message: "Risk level below severe threshold, no recovery plan needed.",
    };
  }

  const { drought_risk, heatwave_risk } = climateRiskOutput;
  let threatType = "both";
  if (drought_risk > heatwave_risk + 20) threatType = "drought";
  else if (heatwave_risk > drought_risk + 20) threatType = "heat";

  const steps = RECOVERY_PLAYBOOKS[threatType];

  return {
    agent: "recovery",
    skill_used: "recovery-skill",
    triggered: true,
    threat_type: threatType,
    plan_title: "Emergency Recovery Plan",
    steps,
    confidence: 0.71,
  };
}
