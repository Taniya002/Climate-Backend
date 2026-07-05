# Climate Risk Skill

## Purpose
Calculate a farm's climate risk score by analyzing rainfall deficit, temperature
anomaly, and drought probability for a given location, crop, and season. Used by
the Climate Risk Agent to decide whether downstream agents (Crop Strategy, Water
Management, Recovery) need to be invoked.

## When to load this skill
Load when the orchestrator receives a request involving:
- Location + season + current crop
- Keywords: "drought", "rainfall", "heatwave", "climate risk", "will my crop survive"
- Any Climate Scenario Simulator input (rainfall %, temperature delta)

## Inputs
| Field | Type | Example |
|---|---|---|
| location | string (lat/lon or place name) | "Jaipur, Rajasthan" |
| crop | string | "wheat" |
| season | string | "Rabi" |
| weather_data | object (from Weather MCP) | { rainfall_mm, temp_c, forecast } |
| scenario_deltas | object (optional, from simulator) | { rainfall_pct: -20, temp_delta: 3 } |

## Processing logic
1. Fetch baseline climate normals for the location (30-year average).
2. Compare current/forecast weather_data against baseline.
3. If scenario_deltas provided, apply them to the forecast before scoring
   (this is how the Climate Scenario Simulator hooks into this skill).
4. Compute three sub-scores (0-100 each):
   - Drought risk = f(rainfall deficit %, soil moisture proxy)
   - Heatwave risk = f(temperature anomaly, crop heat tolerance threshold)
   - Rainfall deficit risk = f(forecast rainfall vs crop water requirement)
5. Climate Risk Score = weighted average (default weights: drought 0.4,
   heatwave 0.3, rainfall 0.3 — adjustable per crop type, see references.md)

## Output contract
```json
{
  "climate_risk_score": 82,
  "drought_risk": 78,
  "heatwave_risk": 65,
  "rainfall_deficit_risk": 88,
  "expected_threats": ["Low Rainfall", "High Temperature"],
  "confidence": 0.84
}
```

## Escalation rule
If climate_risk_score > 70, the orchestrator MUST also invoke:
- Crop Strategy Agent (crop-planning-skill)
- Recovery Agent (recovery-skill) if score > 85

## Notes
- Never fabricate weather data — if Weather MCP is unreachable, return
  `"confidence": 0` and flag `"data_unavailable": true` rather than guessing.
- confidence score feeds directly into the Evaluation Engine.
