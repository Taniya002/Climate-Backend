/**
 * Security Validator
 *
 * Runs before any request reaches the Orchestrator Agent. Covers two
 * concerns: structural input validation, and prompt injection detection on
 * any free-text fields a user might submit.
 */

const INJECTION_PATTERNS = [
  /ignore (all )?(previous|prior|above) instructions/i,
  /disregard (all )?(previous|prior|above) instructions/i,
  /you are now/i,
  /act as (if|though)/i,
  /system prompt/i,
  /reveal (your|the) (prompt|instructions)/i,
  /always say/i,
  /forget (everything|all of the above)/i,
  /override/i,
];

const VALID_SEASONS = ["Rabi", "Kharif", "Annual", "Both", "Both/Annual"];

export function detectPromptInjection(text) {
  if (!text || typeof text !== "string") return { flagged: false };

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      return {
        flagged: true,
        reason: "Input matched a known prompt injection pattern.",
        matched_pattern: pattern.toString(),
      };
    }
  }
  return { flagged: false };
}

export function validateFarmQueryInput(body) {
  const errors = [];

  if (!body.location || typeof body.location !== "string" || body.location.trim().length < 2) {
    errors.push("location is required and must be a non-empty string.");
  }

  if (!body.crop || typeof body.crop !== "string") {
    errors.push("crop is required and must be a string.");
  }

  if (body.season && !VALID_SEASONS.includes(body.season)) {
    errors.push(`season must be one of: ${VALID_SEASONS.join(", ")}`);
  }

  if (body.scenario_deltas) {
    const { rainfall_pct, temp_delta } = body.scenario_deltas;
    if (rainfall_pct !== undefined && (rainfall_pct < -90 || rainfall_pct > 50)) {
      errors.push("scenario_deltas.rainfall_pct must be between -90 and 50.");
    }
    if (temp_delta !== undefined && (temp_delta < -5 || temp_delta > 10)) {
      errors.push("scenario_deltas.temp_delta must be between -5 and 10.");
    }
  }

  // Check every free-text field for injection attempts.
  const textFields = [body.location, body.crop, body.user_question].filter(Boolean);
  for (const field of textFields) {
    const injectionCheck = detectPromptInjection(field);
    if (injectionCheck.flagged) {
      errors.push(`Unsafe input detected: ${injectionCheck.reason}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates an agent's recommendation before it is shown to the farmer.
 * This is the "Recommendation Validator" mentioned in the course concept —
 * it checks for advice that would be unsafe or nonsensical regardless of
 * what the model produced.
 */
export function validateRecommendation(recommendation) {
  const issues = [];

  if (recommendation.recommended_irrigation === undefined && recommendation.expected_water_savings_pct > 0) {
    issues.push("Water savings claimed without specifying an irrigation method.");
  }

  if (recommendation.expected_water_savings_pct && recommendation.expected_water_savings_pct > 80) {
    issues.push("Water savings estimate exceeds realistic bounds (>80%) and was suppressed.");
    recommendation.expected_water_savings_pct = null;
  }

  if (recommendation.confidence !== undefined && (recommendation.confidence < 0 || recommendation.confidence > 1)) {
    issues.push("Confidence score out of bounds, reset to 0.");
    recommendation.confidence = 0;
  }

  return { safe: issues.length === 0, issues, sanitized: recommendation };
}
