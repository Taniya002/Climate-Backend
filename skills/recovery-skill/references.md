# References — Recovery Skill

## Playbooks by dominant threat

### Drought-dominant
1. Reduce irrigation frequency and prioritize water for critical growth stages only.
2. Switch to drought-resistant seed varieties for the next sowing cycle.
3. Apply mulch immediately to reduce soil moisture loss.
4. Delay non-essential field operations that increase water stress.

### Heat-dominant
1. Shift irrigation timing to early morning to reduce heat stress combined with water loss.
2. Apply shade netting if available for high-value crop sections.
3. Shift planting schedule earlier next season to avoid peak heat windows.
4. Monitor crops daily for early signs of heat stress (leaf curling, wilting).

### Combined (drought and heat both severe)
1. Reduce irrigation frequency, but ensure critical growth stages are still watered.
2. Use drought-and-heat-resistant seed varieties for next season.
3. Shift planting schedule to avoid the most severe weather window.
4. Set up a weekly monitoring routine to track crop stress signs.

## Threshold rule
Recovery plan triggers only when climate_risk_score > 85. Below this, the
Crop Strategy and Water Management agents' recommendations are considered
sufficient on their own.

## Dominance rule
If drought_risk and heatwave_risk differ by more than 20 points, the higher
one determines the playbook. Otherwise use the combined playbook.
