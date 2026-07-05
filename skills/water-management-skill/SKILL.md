# Water Management Skill

## Purpose
Recommend irrigation and water-conservation techniques tailored to the crop,
current risk level, and water availability. Used by the Water Management Agent.

## When to load this skill
Load when:
- Climate Risk Agent reports drought_risk or rainfall_deficit_risk > 50
- User asks about irrigation, water saving, or "how to save water"
- Crop Strategy Agent recommends staying with current crop under moderate risk

## Inputs
| Field | Type | Example |
|---|---|---|
| crop | string | "wheat" |
| drought_risk | number (0-100) | 78 |
| current_irrigation_method | string (optional) | "flood irrigation" |
| farm_size_acres | number (optional) | 5 |

## Processing logic
1. Determine current water efficiency from current_irrigation_method
   (flood < sprinkler < drip, see references.md for efficiency %).
2. If drought_risk > 60 and current method isn't drip: recommend drip
   irrigation upgrade with estimated water savings %.
3. If drought_risk 30-60: recommend scheduling optimization (irrigate early
   morning/evening, mulching) without requiring infrastructure change.
4. If drought_risk < 30: minor tips only, no major recommendation needed.

## Output contract
```json
{
  "recommended_irrigation": "Drip Irrigation",
  "expected_water_savings_pct": 35,
  "additional_tips": ["Irrigate early morning to reduce evaporation", "Apply mulch to retain soil moisture"],
  "confidence": 0.8
}
```

## Notes
- Savings % estimates are directional (based on published agronomy ranges),
  not site-measured — Evaluation Engine should treat these as estimates with
  bounded confidence, never as guarantees.
