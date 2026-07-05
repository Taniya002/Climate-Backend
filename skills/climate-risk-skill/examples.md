# Examples — Climate Risk Skill

## Example 1: Standard query
**Input**
```json
{
  "location": "Jaipur, Rajasthan",
  "crop": "wheat",
  "season": "Rabi",
  "weather_data": { "rainfall_mm": 180, "temp_c_avg": 29, "forecast_temp_max": 36 }
}
```

**Output**
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
**Why**: Wheat needs 450-650mm, only 180mm forecast → severe rainfall deficit.
Forecast max 36°C exceeds wheat's 34°C risk-onset threshold → heatwave risk elevated.

## Example 2: Climate Scenario Simulator input
**User action**: Sets simulator sliders to Rainfall -30%, Temperature +3°C on a
baseline wheat scenario.

**Input**
```json
{
  "location": "Jaipur, Rajasthan",
  "crop": "wheat",
  "season": "Rabi",
  "weather_data": { "rainfall_mm": 400, "temp_c_avg": 27, "forecast_temp_max": 33 },
  "scenario_deltas": { "rainfall_pct": -30, "temp_delta": 3 }
}
```

**Processing**: Adjusted rainfall = 400 × 0.7 = 280mm. Adjusted forecast max =
33 + 3 = 36°C.

**Output**
```json
{
  "climate_risk_score": 79,
  "drought_risk": 74,
  "heatwave_risk": 65,
  "rainfall_deficit_risk": 82,
  "expected_threats": ["Low Rainfall", "High Temperature"],
  "confidence": 0.81,
  "scenario_applied": true
}
```

## Example 3: Resilient crop, low risk
**Input**
```json
{
  "location": "Barmer, Rajasthan",
  "crop": "millet",
  "season": "Kharif",
  "weather_data": { "rainfall_mm": 290, "temp_c_avg": 34, "forecast_temp_max": 39 }
}
```

**Output**
```json
{
  "climate_risk_score": 38,
  "drought_risk": 30,
  "heatwave_risk": 35,
  "rainfall_deficit_risk": 45,
  "expected_threats": [],
  "confidence": 0.88
}
```
**Why**: Millet's water requirement (250-400mm) is comfortably met by 290mm,
and 39°C is below millet's 40°C safe threshold. Score lands in "Moderate" band
— no Crop Strategy or Recovery escalation needed.

## Example 4: Data unavailable (failure mode)
**Input**: Weather MCP times out / returns no data.

**Output**
```json
{
  "climate_risk_score": null,
  "confidence": 0,
  "data_unavailable": true,
  "message": "Unable to retrieve weather data. Risk assessment skipped."
}
```
This must propagate to the Evaluation Engine as a low-confidence result, and
the Farmer Education Agent should explain this plainly to the user rather than
showing a fabricated number.
