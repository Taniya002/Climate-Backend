# Examples — Crop Planning Skill

## Example 1: High risk, in-season switch available
**Input**
```json
{
  "current_crop": "wheat",
  "climate_risk_output": {
    "climate_risk_score": 82,
    "expected_threats": ["Low Rainfall", "High Temperature"]
  },
  "location": "Jaipur, Rajasthan"
}
```

**Output**
```json
{
  "current_crop": "wheat",
  "risk_level": "High",
  "recommended_alternative": "millet",
  "reason": "Millet handles both low rainfall and high heat better than wheat, making it safer this season.",
  "alternatives_considered": ["millet", "sorghum"],
  "confidence": 0.79
}
```

## Example 2: Moderate risk — stay with current crop
**Input**
```json
{
  "current_crop": "maize",
  "climate_risk_output": { "climate_risk_score": 45, "expected_threats": [] }
}
```

**Output**
```json
{
  "current_crop": "maize",
  "risk_level": "Moderate",
  "recommended_alternative": null,
  "reason": "Conditions are manageable for maize this season. Consider shifting sowing 1-2 weeks earlier to avoid peak heat at flowering stage.",
  "alternatives_considered": [],
  "confidence": 0.71
}
```

## Example 3: Sowing window already closed
**Input**: Risk is high for wheat, but recommendation logic finds the
suggested alternative's sowing window already passed.

**Output**
```json
{
  "current_crop": "wheat",
  "risk_level": "High",
  "recommended_alternative": null,
  "reason": "Millet would be safer, but its sowing window for this season has closed. Current wheat crop should follow the Water Management Agent's irrigation plan, and plan a switch to millet next Kharif season.",
  "alternatives_considered": ["millet"],
  "confidence": 0.65
}
```
