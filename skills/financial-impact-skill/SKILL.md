# Financial Impact Skill

## Purpose
Estimate yield loss and revenue impact under current climate risk, and
compare that against switching to the crop recommended by the Crop Strategy
Agent. Used by the Financial Impact Agent.

## When to load this skill
Load when:
- Climate Risk Agent and Crop Strategy Agent have both returned results
- User asks about cost, profit, loss, or "is it worth switching crops"

## Inputs
| Field | Type | Example |
|---|---|---|
| current_crop | string | "wheat" |
| climate_risk_output | object | { climate_risk_score: 82 } |
| crop_strategy_output | object (optional) | { recommended_alternative: "millet" } |
| farm_size_acres | number | 5 |

## Processing logic
1. Look up base revenue per acre for current_crop (assumed market rates,
   see references.md).
2. Estimate yield loss percentage from climate_risk_score, adjusted by the
   crop's own drought tolerance (a high-tolerance crop loses less yield at
   the same risk score than a low-tolerance crop).
3. Compute estimated revenue loss in USD for the current crop.
4. If an alternative crop was recommended, repeat steps 1-3 for it using its
   own drought tolerance, then compare total revenue (not just yield loss
   percentage) between current and alternative.
5. Always attach a plain-language note when the alternative has lower
   revenue-per-acre but higher resilience -- a negative revenue_change_pct
   does not mean the recommendation is wrong, it means the trade-off needs
   to be stated explicitly.

## Output contract
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

## Notes
- These are directional estimates from published market/agronomy ranges, not
  site-measured financial data. The Evaluation Engine treats this agent's
  confidence as moderate (around 0.68) for that reason.
- Never state a financial figure as certain - always frame as "expected" or
  "estimated."
