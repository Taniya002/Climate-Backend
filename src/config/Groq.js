import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  console.error("GROQ_API_KEY is missing. Set it in .env before starting the server.");
}

const groq = new Groq({ apiKey });

export async function callGemini(prompt, { temperature = 0.4 } = {}) {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature,
      max_tokens: 1024,
    });
    return completion.choices[0].message.content;
  } catch (err) {
    console.error("Groq API error:", err.message);
    throw new Error(`Groq call failed: ${err.message}`);
  }
}

export async function callGeminiJSON(prompt, options = {}) {
  try {
    const raw = await callGemini(prompt, options);
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Groq did not return valid JSON. Error: ${err.message}`);
  }
}