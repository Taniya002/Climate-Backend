import { runClimateRiskAgent } from "../agents/climateRiskAgent.js";
import { runCropStrategyAgent } from "../agents/cropStrategyAgent.js";
import { runWaterManagementAgent } from "../agents/waterManagementAgent.js";
import { runFinancialImpactAgent } from "../agents/financialImpactAgent.js";
import { runRecoveryAgent } from "../agents/recoveryAgent.js";
import { runFarmerEducationAgent } from "../agents/farmerEducationAgent.js";
import { validateRecommendation } from "../security/validator.js";
import { runEvaluation } from "../evaluation/evaluationEngine.js";

/**
 * Orchestrator Agent
 *
 * Routes a farm query through the specialist agents in the order required
 * by their dependencies, applies the recommendation validator to outputs
 * before they reach the farmer, and runs the evaluation engine over the
 * full set of results.
 *
 * Flow:
 *   Climate Risk -> (Crop Strategy, Water Management) in parallel
 *               -> Financial Impact (needs Crop Strategy result)
 *               -> Recovery (only if risk is severe)
 *               -> Farmer Education (explains everything)
 *               -> Evaluation Engine
 */
export async function runOrchestrator(input) {
  const { location, crop, scenarioDeltas, farmSizeAcres, currentIrrigationMethod, userQuestion } = input;

  const climateRiskOutput = await runClimateRiskAgent({ location, crop, scenarioDeltas });

  const [cropStrategyOutputRaw, waterManagementOutputRaw] = await Promise.all([
    Promise.resolve(runCropStrategyAgent({ currentCrop: crop, climateRiskOutput })),
    Promise.resolve(
      runWaterManagementAgent({ crop, climateRiskOutput, currentIrrigationMethod })
    ),
  ]);

  const financialImpactOutputRaw = runFinancialImpactAgent({
    currentCrop: crop,
    climateRiskOutput,
    cropStrategyOutput: cropStrategyOutputRaw,
    farmSizeAcres,
  });

  const recoveryOutputRaw = runRecoveryAgent({ climateRiskOutput });

  // Validate every agent's recommendation before anything reaches the farmer.
  const cropStrategyCheck = validateRecommendation(cropStrategyOutputRaw);
  const waterManagementCheck = validateRecommendation(waterManagementOutputRaw);
  const financialImpactCheck = validateRecommendation(financialImpactOutputRaw);

  const cropStrategyOutput = cropStrategyCheck.sanitized;
  const waterManagementOutput = waterManagementCheck.sanitized;
  const financialImpactOutput = financialImpactCheck.sanitized;
  const recoveryOutput = recoveryOutputRaw;

  const farmerEducationOutput = await runFarmerEducationAgent({
    userQuestion,
    climateRiskOutput,
    cropStrategyOutput,
  });

  const allOutputs = [
    climateRiskOutput,
    cropStrategyOutput,
    waterManagementOutput,
    financialImpactOutput,
    recoveryOutput,
    farmerEducationOutput,
  ];

  const evaluation = runEvaluation(allOutputs);

  const securityIssues = [
    ...cropStrategyCheck.issues,
    ...waterManagementCheck.issues,
    ...financialImpactCheck.issues,
  ];

  return {
    climate_risk: climateRiskOutput,
    crop_strategy: cropStrategyOutput,
    water_management: waterManagementOutput,
    financial_impact: financialImpactOutput,
    recovery: recoveryOutput,
    farmer_education: farmerEducationOutput,
    evaluation,
    security_issues: securityIssues,
  };
}
