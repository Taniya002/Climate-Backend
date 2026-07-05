# Examples — Financial Impact Skill

## Example 1: High risk, switch recommended, revenue trade-off
**Input**
```json
{
  "current_crop": "wheat",
  "climate_risk_output": { "climate_risk_score": 82 },
  "crop_strategy_output": { "recommended_alternative": "millet" },
  "farm_size_acres": 5
}
```

**Output**
```json
{
  "current_crop": "wheat",
  "expected_yield_loss_pct": 20,
  "estimated_revenue_loss_usd": 600,
  "alternative_crop": "millet",
  "alternative_yield_loss_pct": 5,
  "expected_revenue_change_pct": -11,
  "note": "millet has lower revenue potential per acre than wheat, but loses far less yield under this climate risk, reducing downside risk in a severe season.",
  "confidence": 0.68
}
```

## Example 2: Low risk, no alternative needed
**Input**
```json
{
  "current_crop": "maize",
  "climate_risk_output": { "climate_risk_score": 25 },
  "crop_strategy_output": { "recommended_alternative": null },
  "farm_size_acres": 3
}
```

**Output**
```json
{
  "current_crop": "maize",
  "expected_yield_loss_pct": 3,
  "estimated_revenue_loss_usd": 50,
  "confidence": 0.68
}
```
(No alternative_crop fields are included since no switch was recommended.)

## Example 3: Severe risk, alternative is both cheaper-loss and similar revenue
**Input**
```json
{
  "current_crop": "sugarcane",
  "climate_risk_output": { "climate_risk_score": 90 },
  "crop_strategy_output": { "recommended_alternative": "sorghum" },
  "farm_size_acres": 2
}
```

**Output**
```json
{
  "current_crop": "sugarcane",
  "expected_yield_loss_pct": 39,
  "estimated_revenue_loss_usd": 936,
  "alternative_crop": "sorghum",
  "alternative_yield_loss_pct": 9,
  "expected_revenue_change_pct": 42,
  "note": "sorghum is expected to outperform sugarcane both in resilience and revenue under this climate risk.",
  "confidence": 0.68
}
```
