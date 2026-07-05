# References — Crop Planning Skill

## Crop substitution map (by dominant threat)
| Current crop | If drought-dominant | If heat-dominant | If both |
|---|---|---|---|
| Wheat | Millet, Barley | Millet, Sorghum | Millet |
| Rice | Maize, Millet | Millet | Millet |
| Maize | Millet, Sorghum | Sorghum | Sorghum |
| Sugarcane | Cotton, Sorghum | Cotton | Sorghum |

## Sowing window compatibility (Rabi / Kharif, India context)
| Crop | Season | Sowing window | Switch-in deadline |
|---|---|---|---|
| Wheat | Rabi | Oct 15 – Nov 30 | Nov 30 |
| Millet (Bajra) | Kharif | Jun 15 – Jul 15 | Jul 15 |
| Sorghum (Jowar) | Both | Jun-Jul / Oct-Nov | Matches season |
| Maize | Both | Jun-Jul / Oct-Nov | Matches season |
| Barley | Rabi | Oct 15 – Nov 15 | Nov 15 |

Rule: never recommend a crop whose sowing window has already closed for the
current season — recommend a "next season" plan instead and say so explicitly.

## Reason templates (plain language, handed to Farmer Education Agent)
- Drought-driven switch: "{alt_crop} needs much less water than {crop} and
  still gives a reliable yield in dry conditions."
- Heat-driven switch: "{alt_crop} tolerates higher temperatures than {crop}
  without losing yield."
- Combined: "{alt_crop} handles both low rainfall and high heat better than
  {crop}, making it safer this season."
