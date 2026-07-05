import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("SUPABASE_URL or SUPABASE_SERVICE_KEY is missing. Set them in .env.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Table schema reference (create these in Supabase SQL editor):
 *
 * create table farm_queries (
 *   id uuid primary key default gen_random_uuid(),
 *   created_at timestamp default now(),
 *   location text,
 *   crop text,
 *   season text,
 *   scenario_deltas jsonb,
 *   orchestrator_output jsonb,
 *   evaluation jsonb
 * );
 *
 * create table agent_skills_log (
 *   id uuid primary key default gen_random_uuid(),
 *   created_at timestamp default now(),
 *   query_id uuid references farm_queries(id),
 *   skill_name text,
 *   agent_name text
 * );
 */
