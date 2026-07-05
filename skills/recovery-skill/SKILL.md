# Recovery Skill

## Purpose
Generate a step-by-step emergency recovery plan when climate risk reaches the
severe threshold. Used by the Recovery Agent, which is only invoked by the
orchestrator when escalation conditions are met (not on every query).

## When to load this skill
Load when:
- Climate Risk Agent reports climate_risk_score > 85
- User directly asks for help during an active drought or heatwave event

## Inputs
| Field | Type | Example |
|---|---|---|
| climate_risk_output | object | { climate_risk_score: 92, drought_risk: 88, heatwave_risk: 60 } |

## Processing logic
1. Check climate_risk_score against the severe threshold (85). If at or
   below, return triggered: false and skip plan generation.
2. Determine dominant threat type by comparing drought_risk and
   heatwave_risk (a 20-point gap decides dominance; otherwise treat as both).
3. Select the matching playbook from references.md.
4. Return the playbook as ordered steps, not a single block of advice -
   farmers need to act on these sequentially, not all at once.

## Output contract
```json
{
  "triggered": true,
  "threat_type": "drought",
  "plan_title": "Emergency Recovery Plan",
  "steps": [
    "Reduce irrigation frequency",
    "Use drought-resistant seeds",
    "Shift planting schedule"
  ],
  "confidence": 0.71
}
```

## Notes
- This skill never recommends abandoning a crop entirely - that decision
  carries financial consequences too significant for an automated system to
  suggest outright. The Financial Impact Agent's output should accompany
  this plan so the farmer can weigh both together.
- Recovery plans are intentionally short (3-4 steps) so they are actionable
  under stress, not a long checklist.
