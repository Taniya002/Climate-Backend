# Examples — Recovery Skill

## Example 1: Severe drought-dominant risk
**Input**
```json
{
  "climate_risk_output": {
    "climate_risk_score": 92,
    "drought_risk": 90,
    "heatwave_risk": 60
  }
}
```

**Output**
```json
{
  "triggered": true,
  "threat_type": "drought",
  "plan_title": "Emergency Recovery Plan",
  "steps": [
    "Reduce irrigation frequency and prioritize water for critical growth stages only.",
    "Switch to drought-resistant seed varieties for the next sowing cycle.",
    "Apply mulch immediately to reduce soil moisture loss.",
    "Delay non-essential field operations that increase water stress."
  ],
  "confidence": 0.71
}
```

## Example 2: Risk below severe threshold, not triggered
**Input**
```json
{
  "climate_risk_output": {
    "climate_risk_score": 78,
    "drought_risk": 75,
    "heatwave_risk": 55
  }
}
```

**Output**
```json
{
  "triggered": false,
  "message": "Risk level below severe threshold, no recovery plan needed."
}
```

## Example 3: Combined severe risk (drought and heat close together)
**Input**
```json
{
  "climate_risk_output": {
    "climate_risk_score": 90,
    "drought_risk": 86,
    "heatwave_risk": 80
  }
}
```

**Output**
```json
{
  "triggered": true,
  "threat_type": "both",
  "plan_title": "Emergency Recovery Plan",
  "steps": [
    "Reduce irrigation frequency, but ensure critical growth stages are still watered.",
    "Use drought-and-heat-resistant seed varieties for next season.",
    "Shift planting schedule to avoid the most severe weather window.",
    "Set up a weekly monitoring routine to track crop stress signs."
  ],
  "confidence": 0.71
}
```
