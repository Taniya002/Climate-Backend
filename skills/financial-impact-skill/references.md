# References — Financial Impact Skill

## Assumed revenue per acre (USD, approximate market rates)
| Crop | Revenue per acre |
|---|---|
| Wheat | 600 |
| Rice | 700 |
| Millet | 450 |
| Maize | 550 |
| Sorghum | 480 |
| Sugarcane | 1200 |

## Base yield loss by climate risk score band
| Climate risk score | Base yield loss |
|---|---|
| 0-30 | 5% |
| 31-60 | 12% |
| 61-85 | 20% |
| 86-100 | 35% |

## Drought tolerance adjustment factor
Applied as a multiplier on the base yield loss above.
| Drought tolerance | Factor |
|---|---|
| Very low | 1.1 |
| Low | 1.0 |
| Medium | 0.6 |
| High | 0.25 |

Example: a crop with "high" drought tolerance at climate risk score 82
(base loss 20%) loses only 20% x 0.25 = 5% yield, not 20%.

## Interpreting a negative revenue change
A switch can show negative expected_revenue_change_pct while still being the
right recommendation. This happens when the alternative crop has a lower
market price per acre but much higher resilience. In that case the switch
reduces downside risk in a severe season even if average-case revenue is
slightly lower. This nuance must always be surfaced in the note field.
