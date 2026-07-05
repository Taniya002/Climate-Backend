import express from "express";
import { runOrchestrator } from "../agents/orchestratorAgent.js";
import { validateFarmQueryInput } from "../security/validator.js";
import { supabase } from "../config/supabase.js";

const router = express.Router();

/**
 * POST /api/farm-query
 *
 * Main entry point. Validates input, runs the orchestrator across all
 * specialist agents, logs the result to Supabase, and returns the full
 * result set including the evaluation engine output.
 *
 * Body:
 * {
 *   location: string,
 *   crop: string,
 *   season: string (optional),
 *   scenario_deltas: { rainfall_pct: number, temp_delta: number } (optional),
 *   farm_size_acres: number (optional),
 *   current_irrigation_method: string (optional),
 *   user_question: string (optional)
 * }
 */
router.post("/farm-query", async (req, res) => {
  const validation = validateFarmQueryInput(req.body);

  if (!validation.valid) {
    return res.status(400).json({
      error: "Invalid request",
      details: validation.errors,
    });
  }

  try {
    const {
      location,
      crop,
      scenario_deltas: scenarioDeltas,
      farm_size_acres: farmSizeAcres,
      current_irrigation_method: currentIrrigationMethod,
      user_question: userQuestion,
    } = req.body;

    const result = await runOrchestrator({
      location,
      crop,
      scenarioDeltas,
      farmSizeAcres,
      currentIrrigationMethod,
      userQuestion,
    });

    // Log to Supabase. Failure to log should not block the response.
    try {
      await supabase.from("farm_queries").insert({
        location,
        crop,
        season: req.body.season || null,
        scenario_deltas: scenarioDeltas || null,
        orchestrator_output: result,
        evaluation: result.evaluation,
      });
    } catch (logErr) {
      console.error("Supabase logging failed:", logErr.message);
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("Orchestrator error:", err.message);
    return res.status(500).json({
      error: "Internal error while processing farm query.",
    });
  }
});

/**
 * GET /api/farm-query/history
 *
 * Returns recent query history from Supabase, used for the progress
 * tracking / dashboard view on the frontend.
 */
router.get("/farm-query/history", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("farm_queries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;
    return res.status(200).json({ history: data });
  } catch (err) {
    console.error("History fetch error:", err.message);
    return res.status(500).json({ error: "Could not retrieve history." });
  }
});

export default router;
