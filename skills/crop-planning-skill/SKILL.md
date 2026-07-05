# Crop Planning Skill

## Purpose
Recommend climate-resilient crop strategies — either reinforcing the current
crop with adjusted practices, or suggesting an alternative crop when risk is
too high. Used by the Crop Strategy Agent.

## When to load this skill
Load when:
- Climate Risk Agent escalates with climate_risk_score > 70
- User directly asks "which crop should I switch to" / "is my crop safe"
- Climate Scenario Simulator output requires an alternative-crop comparison

## Inputs
| Field | Type | Example |
|---|---|---|
| current_crop | string | "wheat" |
| climate_risk_output | object (from climate-risk-skill) | { climate_risk_score: 82, ... } |
| location | string | "Jaipur, Rajasthan" |
| soil_type | string (optional) | "loamy" |

## Processing logic
1. If climate_risk_score ≤ 60: recommend "stay with current crop" + minor
   adjustments (sowing date shift, denser/sparser spacing).
2. If climate_risk_score 61-85: look up alternative crops from references.md
   that tolerate the dominant threat (drought vs heat) better than current_crop.
3. If climate_risk_score > 85: recommend alternative crop AND flag for
   Recovery Agent involvement.
4. Rank alternatives by: (a) tolerance match to dominant threat, (b) regional
   suitability, (c) market viability (basic — not a full market model).

## Output contract
```json
{
  "current_crop": "wheat",
  "risk_level": "High",
  "recommended_alternative": "millet",
  "reason": "Requires less water and tolerates heat better.",
  "alternatives_considered": ["millet", "sorghum"],
  "confidence": 0.79
}
```

## Notes
- Always explain the *reason* in one plain sentence — this gets handed
  directly to the Farmer Education Agent for elaboration.
- Don't recommend a crop switch the farmer can't realistically execute this
  season (e.g. suggesting a crop with a 6-month longer growing cycle when
  season has already started) — check sowing window in references.md.
