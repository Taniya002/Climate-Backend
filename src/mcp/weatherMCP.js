// import fetch from "node-fetch";

/**
 * Weather MCP
 *
 * This module acts as an MCP-style tool that gives agents access to real
 * weather data instead of relying on model memory. Open-Meteo is used
 * because it is free, requires no API key, and has a generous rate limit.
 *
 * In a full MCP setup this would run as a separate server exposing a
 * tool-call interface. For the capstone scope, it is implemented as a
 * direct module with the same input/output contract an MCP tool would have,
 * so it can be swapped for a real MCP server later without changing the
 * agents that call it.
 */

const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

async function geocodeLocation(locationName) {
  const cityName = locationName.split(",")[0].trim();
  const url = `${GEOCODE_URL}?name=${encodeURIComponent(cityName)}&count=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding failed for ${cityName}`);
  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    throw new Error(`Location not found: ${locationName}`);
  }
  const { latitude, longitude, name, country } = data.results[0];
  return { latitude, longitude, resolvedName: `${name}, ${country}` };
}

/**
 * Returns current and forecast weather data for a location.
 * This is the tool function agents call through the weather MCP.
 */
export async function getWeatherData(locationName) {
  try {
    const { latitude, longitude, resolvedName } = await geocodeLocation(locationName);

    const params = new URLSearchParams({
      latitude,
      longitude,
      current: "temperature_2m,precipitation",
      daily: "temperature_2m_max,temperature_2m_min,precipitation_sum",
      forecast_days: "7",
      timezone: "auto",
    });

    const res = await fetch(`${FORECAST_URL}?${params}`);
    if (!res.ok) throw new Error("Open-Meteo forecast request failed");
    const data = await res.json();

    const rainfallForecastMm = data.daily.precipitation_sum.reduce((a, b) => a + b, 0);
    const tempMaxForecast = Math.max(...data.daily.temperature_2m_max);

    return {
      data_unavailable: false,
      resolved_location: resolvedName,
      current_temp_c: data.current.temperature_2m,
      forecast_temp_max_c: tempMaxForecast,
      forecast_rainfall_mm_7day: Math.round(rainfallForecastMm * 10) / 10,
      raw_daily: data.daily,
    };
  } catch (err) {
    console.error("Weather MCP error:", err.message);
    return {
      data_unavailable: true,
      error: err.message,
    };
  }
}
