# ClimateGuard AI

**Climate adaptation copilot for farmers — built with a multi-agent AI system**

> Built for the Kaggle + Google 5-Day AI Agents Intensive Capstone · Track: Agents for Good

[![Live Demo](https://img.shields.io/badge/Live%20Demo-climateguardai.lovable.app-green)](https://climateguardai.lovable.app)
[![Backend](https://img.shields.io/badge/Backend-Render-blue)](https://climate-backend-z129.onrender.com/api/health)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## The Problem

Climate change is making farming increasingly unpredictable. Farmers face:

- Rainfall patterns shifting dramatically season to season
- Heatwaves arriving outside historical norms
- No tool that explains *what to do* — only tools that show *what is happening*

A simple chatbot cannot solve this. It takes **multiple specialized agents** working together — one analyzing climate risk, another recommending crops, another planning water use, another estimating financial impact, and another generating a recovery plan — all coordinated by an orchestrator that routes data between them.

---

## Solution

ClimateGuard AI is a multi-agent decision-support system that helps farmers answer questions like:

- What happens to my wheat crop if rainfall drops 20% this season?
- Which crop should I switch to under drought conditions?
- How much revenue could I lose, and is there a recovery plan?

The **Climate Scenario Simulator** lets farmers adjust rainfall and temperature sliders to model future conditions — the entire agent pipeline runs against the simulated scenario and returns a complete adaptive strategy.

---

## Architecture

```
User Input (location, crop, scenario)
        |
        v
Security Validator          ← Day 4: prompt injection detection, input validation
        |
        v
Orchestrator Agent          ← Day 1: routes tasks to specialists, coordinates flow
        |
   _____|_____________________________________________________
   |          |            |              |          |        |
   v          v            v              v          v        v
Climate    Crop        Water          Financial  Recovery  Farmer
Risk       Strategy    Management     Impact     Agent     Education
Agent      Agent       Agent          Agent                Agent
   |          |            |
   v          v            v
Climate-   Crop-       Water-
Risk       Planning    Mgmt
Skill      Skill       Skill          ← Day 3: Agent Skills (loaded on demand)
   |          |
   v          v
Weather    Agriculture
MCP        Knowledge              ← Day 2: MCP integration (external data)
(Open-     MCP
Meteo)     (crop DB)
        |
        v
Evaluation Engine               ← Day 4: confidence scoring, reliability banding
        |
        v
Final Response (all agents + evaluation)
```

---

## Course Concepts Demonstrated

| Concept | Implementation |
|---|---|
| **Multi-Agent System** | 6 specialist agents + orchestrator, each with clear responsibility |
| **MCP Integration** | Weather MCP (Open-Meteo live data) + Agriculture Knowledge MCP (crop database) |
| **Agent Skills** | 5 skill folders — climate-risk, crop-planning, water-management, recovery, financial-impact — each with SKILL.md, references.md, examples.md |
| **Security** | Prompt injection detection, input validation, recommendation sanitizer, rate limiting |
| **Production Deployment** | Backend on Render, frontend on Lovable, Supabase for query logging |
| **Evaluation** | Per-agent confidence scoring, reliability banding (High/Moderate/Low), data availability tracking |

---

## Agent Responsibilities

### Orchestrator Agent
Routes farm queries to the correct specialist agents, runs them in the right order (Climate Risk first, then parallel execution of Crop Strategy and Water Management, then Financial Impact, Recovery if triggered, and finally Farmer Education), and applies the recommendation validator before any output reaches the user.

### Climate Risk Agent
Fetches real-time weather data via the Weather MCP, applies scenario deltas from the Climate Scenario Simulator, and computes drought risk, heatwave risk, and rainfall deficit risk scores using crop-specific thresholds from the Agriculture Knowledge MCP.

### Crop Strategy Agent
Loads the crop-planning-skill and recommends whether to stay with the current crop or switch to a climate-resilient alternative, using the substitution map in references.md and checking sowing window availability before recommending a switch.

### Water Management Agent
Loads the water-management-skill and recommends the appropriate irrigation method and water-saving practices based on drought risk level.

### Financial Impact Agent
Estimates yield loss and revenue impact under current climate risk, adjusted by each crop's drought tolerance, and compares against the alternative crop's risk-adjusted revenue when a switch is recommended.

### Recovery Agent
Triggered only when climate_risk_score > 85. Generates a step-by-step emergency recovery plan from playbooks in references.md, selecting the correct playbook based on whether drought or heat is the dominant threat.

### Farmer Education Agent
The only agent that calls the AI model directly (Groq/LLaMA). Takes all agent outputs and the farmer's question (in any language) and generates a plain-language explanation. Responds in whatever language the farmer used to ask the question.

---

## MCP Integration

### Weather MCP (Open-Meteo)
- Free, no API key required
- Geocodes location name to coordinates
- Fetches 7-day temperature and rainfall forecast
- Applies Climate Scenario Simulator deltas before passing to agents

### Agriculture Knowledge MCP
- Curated crop database (10 crops: Wheat, Rice, Millet, Maize, Sorghum, Sugarcane, Barley, Cotton, Soybean, Mustard)
- Provides water requirements, drought tolerance, heat thresholds, sowing windows
- Provides crop substitution map by dominant threat type
- Provides irrigation efficiency data

---

## Agent Skills

Each skill folder contains three files:

```
skills/
  climate-risk-skill/
    SKILL.md          ← purpose, inputs, outputs, processing logic, escalation rules
    references.md     ← crop thresholds, risk bands, data sources
    examples.md       ← 4 worked examples including failure modes
  crop-planning-skill/
  water-management-skill/
  recovery-skill/
  financial-impact-skill/
```

Skills are loaded on demand by the relevant agent — the orchestrator does not load all skills upfront, avoiding context rot (Day 3 concept).

---

## Security

- **Prompt injection detection** — 9 regex patterns covering common injection attempts (ignore instructions, override, act as, reveal prompt, etc.)
- **Input validation** — required fields, type checks, range validation on scenario deltas
- **Recommendation sanitizer** — catches out-of-bounds agent outputs (e.g. water savings > 80% suppressed, confidence out of range reset)
- **Rate limiting** — 60 requests per 15 minutes per IP via express-rate-limit

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Tailwind CSS (TanStack Start) |
| Backend | Node.js + Express.js |
| AI Model | Groq API (LLaMA 3.3 70B) |
| Weather Data | Open-Meteo API (free, no key) |
| Database | Supabase (PostgreSQL) |
| Deployment | Render (backend) + Lovable (frontend) |

---

## Project Structure

```
climateguard-ai-backend/
  src/
    agents/
      orchestratorAgent.js      ← coordinates all agents
      climateRiskAgent.js
      cropStrategyAgent.js
      waterManagementAgent.js
      financialImpactAgent.js
      recoveryAgent.js
      farmerEducationAgent.js
    mcp/
      weatherMCP.js             ← Open-Meteo integration
      agricultureMCP.js         ← crop knowledge base
    config/
      groq.js                   ← AI model client
      supabase.js               ← database client
    security/
      validator.js              ← injection detection + input validation
      rateLimiter.js
    evaluation/
      evaluationEngine.js       ← confidence scoring
    routes/
      farmQueryRoutes.js        ← POST /api/farm-query
      healthRoutes.js
    server.js
  skills/
    climate-risk-skill/
    crop-planning-skill/
    water-management-skill/
    recovery-skill/
    financial-impact-skill/
```

---

## Local Setup

**Prerequisites:** Node.js 18+, Groq API key (free at console.groq.com), Supabase project

```bash
git clone https://github.com/Taniya002/Climate-Backend.git
cd Climate-Backend
npm install
```

Copy `.env.example` to `.env` and fill in:

```
GROQ_API_KEY=your_groq_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
```

Create Supabase tables (run in Supabase SQL editor):

```sql
create table farm_queries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp default now(),
  location text,
  crop text,
  season text,
  scenario_deltas jsonb,
  orchestrator_output jsonb,
  evaluation jsonb
);

create table agent_skills_log (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp default now(),
  query_id uuid references farm_queries(id),
  skill_name text,
  agent_name text
);
```

```bash
npm run dev
# Server running at http://localhost:5000
```

Test with:

```bash
curl -X POST http://localhost:5000/api/farm-query \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Jaipur, Rajasthan",
    "crop": "wheat",
    "scenario_deltas": { "rainfall_pct": -20, "temp_delta": 3 }
  }'
```

---

## API Reference

### POST /api/farm-query

```json
{
  "location": "Jaipur, Rajasthan",
  "crop": "wheat",
  "season": "Rabi",
  "scenario_deltas": { "rainfall_pct": -20, "temp_delta": 3 },
  "farm_size_acres": 5,
  "current_irrigation_method": "flood",
  "user_question": "Kya meri fasal is season mein safe hai?"
}
```

Returns output from all 6 agents plus evaluation block. `scenario_deltas` is optional — without it, live weather forecast is used as-is.

### GET /api/health
### GET /api/farm-query/history

---

## Future Work

- Voice input support for farmers with low literacy
- Push notifications for sudden climate events
- Satellite imagery integration for real crop health monitoring
- Expansion to 50+ crops with region-specific data
- Offline mode for areas with poor connectivity

---

## License

MIT
