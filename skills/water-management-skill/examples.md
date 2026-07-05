# Examples — Water Management Skill

## Example 1: High drought risk, currently flood irrigation
**Input**
```json
{
  "crop": "wheat",
  "climateRiskOutput": { "drought_risk": 78 },
  "currentIrrigationMethod": "flood"
}
```

**Output**
```json
{
  "recommended_irrigation": "Drip Irrigation",
  "expected_water_savings_pct": 35,
  "additional_tips": [
    "Irrigate early morning to reduce evaporation.",
    "Apply mulch to retain soil moisture."
  ],
  "confidence": 0.8
}
```

## Example 2: Moderate drought risk, no infrastructure change needed
**Input**
```json
{
  "crop": "maize",
  "climateRiskOutput": { "drought_risk": 45 },
  "currentIrrigationMethod": "sprinkler"
}
```

**Output**
```json
{
  "recommended_irrigation": "sprinkler",
  "expected_water_savings_pct": 10,
  "additional_tips": [
    "Irrigate early morning or evening to reduce evaporation loss.",
    "Apply mulch around root zones to retain soil moisture."
  ],
  "confidence": 0.74
}
```

## Example 3: Already on drip irrigation
**Input**
```json
{
  "crop": "wheat",
  "climateRiskOutput": { "drought_risk": 82 },
  "currentIrrigationMethod": "drip"
}
```

**Output**
```json
{
  "recommended_irrigation": "drip",
  "expected_water_savings_pct": 0,
  "additional_tips": ["Already using drip irrigation, the most efficient available method."],
  "confidence": 0.8
}
```
