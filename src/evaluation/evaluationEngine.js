/**
 * Evaluation Engine
 *
 * Scores the overall reliability of an orchestrator run by aggregating the
 * confidence values each agent reported, and flags low-confidence runs so
 * the frontend can show an appropriate disclaimer instead of presenting
 * uncertain output as fact.
 */

function average(numbers) {
  const valid = numbers.filter((n) => typeof n === "number");
  if (valid.length === 0) return 0;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

export function runEvaluation(agentOutputs) {
  const confidences = agentOutputs
    .filter((o) => o && typeof o.confidence === "number")
    .map((o) => o.confidence);

  const overallConfidence = Math.round(average(confidences) * 100) / 100;

  const dataAvailabilityIssues = agentOutputs
    .filter((o) => o && o.data_unavailable)
    .map((o) => o.agent);

  let reliabilityBand;
  if (overallConfidence >= 0.75) reliabilityBand = "High";
  else if (overallConfidence >= 0.5) reliabilityBand = "Moderate";
  else reliabilityBand = "Low";

  return {
    overall_confidence: overallConfidence,
    reliability_band: reliabilityBand,
    agents_evaluated: agentOutputs.filter(Boolean).map((o) => o.agent),
    data_availability_issues: dataAvailabilityIssues,
    per_agent_confidence: agentOutputs
      .filter(Boolean)
      .map((o) => ({ agent: o.agent, confidence: o.confidence ?? null })),
  };
}
