# References — Climate Risk Skill

## Crop heat tolerance thresholds (°C, max sustained temp before yield loss)
| Crop | Safe max temp | Risk onset | Severe damage |
|---|---|---|---|
| Wheat | 32°C | 34°C | 38°C+ |
| Rice | 35°C | 37°C | 40°C+ |
| Millet (Bajra) | 40°C | 42°C | 45°C+ |
| Maize | 33°C | 35°C | 38°C+ |
| Sugarcane | 38°C | 40°C | 42°C+ |

## Crop water requirement (mm per season, approximate)
| Crop | Water need | Drought tolerance |
|---|---|---|
| Wheat | 450-650mm | Low |
| Rice | 900-1200mm | Very low |
| Millet (Bajra) | 250-400mm | High |
| Maize | 500-800mm | Medium |
| Sugarcane | 1500-2500mm | Very low |

## Risk weight adjustments by crop type
Default weights (drought 0.4, heatwave 0.3, rainfall 0.3) shift for crops with
known sensitivities:
- Rice: rainfall weight increases to 0.5 (rainfall-dependent, low drought tolerance)
- Millet: all weights reduced by 15% (inherently resilient — score should reflect
  that millet rarely crosses high-risk thresholds)

## Risk score bands
| Score | Band | Meaning |
|---|---|---|
| 0-30 | Low | No action needed |
| 31-60 | Moderate | Monitor, water management suggested |
| 61-85 | High | Crop strategy review required |
| 86-100 | Severe | Recovery plan mandatory |

## Data source
Weather MCP (Open-Meteo API) provides: temperature, precipitation forecast,
historical climate normals. No paid API required — free tier sufficient for
capstone scope.
