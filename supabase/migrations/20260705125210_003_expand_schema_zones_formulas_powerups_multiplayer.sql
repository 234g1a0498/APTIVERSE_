/*
# Expand schema: zones, formulas, power-ups, multiplayer, ranks

## Plain English
AptiVerse is being expanded into a full RPG aptitude platform with 8 kingdoms,
130+ topic nodes grouped into zones, a Grand Library of 1000+ formulas, a
power-up economy with a store, and a 1v1 multiplayer arena (AI-bot simulated).

## 1. Modified tables
- `villages` (used as "topic nodes"): ADD `zone` (text) to group nodes into
  visual zone banners inside each kingdom, ADD `zone_order` (int) to order
  zones, ADD `topic_slug` (text) for dynamic routing (?topic=...).

## 2. New tables
- `formulas` — the Grand Library knowledge engine. One row per formula/rule.
  Columns: id, kingdom_id, village_id (nullable), topic_name, formula_name,
  formula_text, description, category, example, tags (text[]), created_at.
- `power_ups` — catalog of 10 buyable/usable power-ups. Columns: id, name,
  slug, description, icon, effect_type, effect_value, cost_coins, cost_diamonds,
  category, is_active, created_at.
- `user_power_ups` — per-user inventory of owned power-ups. Columns: id,
  user_id (DEFAULT auth.uid()), power_up_id, quantity, acquired_at.
- `multiplayer_matches` — record of 1v1 arena matches. Columns: id, user_id
  (DEFAULT auth.uid()), opponent_name, opponent_avatar, opponent_is_bot,
  user_score, opponent_score, result (win/loss/draw), xp_earned, coins_earned,
  duration_seconds, created_at.
- `ranks` — reference table mapping XP thresholds to RPG rank titles
  (Novice → Grandmaster). Columns: id, name, slug, min_xp, max_xp, color, icon,
  order_index.

## 3. Security
- RLS enabled on all new tables.
- `formulas`, `power_ups`, `ranks` are shared reference data: SELECT open to
  authenticated; no client inserts/updates/deletes (catalog managed via
  service role). Policies are SELECT-only TO authenticated USING (true) because
  the data is intentionally shared across all signed-in users.
- `user_power_ups` and `multiplayer_matches` are owner-scoped with auth.uid()
  ownership checks and DEFAULT auth.uid() on the owner column so inserts that
  omit user_id succeed.
*/

-- 1. Extend villages (topic nodes) with zone grouping
ALTER TABLE villages ADD COLUMN IF NOT EXISTS zone text;
ALTER TABLE villages ADD COLUMN IF NOT EXISTS zone_order int DEFAULT 0;
ALTER TABLE villages ADD COLUMN IF NOT EXISTS topic_slug text;

-- 2. formulas table (Grand Library knowledge engine)
CREATE TABLE IF NOT EXISTS formulas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kingdom_id uuid REFERENCES kingdoms(id) ON DELETE CASCADE,
  village_id uuid REFERENCES villages(id) ON DELETE CASCADE,
  topic_name text NOT NULL,
  formula_name text NOT NULL,
  formula_text text NOT NULL,
  description text,
  category text,
  example text,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE formulas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_formulas_authenticated" ON formulas;
CREATE POLICY "select_formulas_authenticated" ON formulas FOR SELECT
  TO authenticated USING (true);
CREATE INDEX IF NOT EXISTS idx_formulas_kingdom ON formulas(kingdom_id);
CREATE INDEX IF NOT EXISTS idx_formulas_village ON formulas(village_id);
CREATE INDEX IF NOT EXISTS idx_formulas_topic ON formulas(topic_name);

-- 3. power_ups catalog
CREATE TABLE IF NOT EXISTS power_ups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text NOT NULL,
  effect_type text NOT NULL,
  effect_value int DEFAULT 0,
  cost_coins int DEFAULT 0,
  cost_diamonds int DEFAULT 0,
  category text DEFAULT 'battle',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE power_ups ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_power_ups_authenticated" ON power_ups;
CREATE POLICY "select_power_ups_authenticated" ON power_ups FOR SELECT
  TO authenticated USING (true);

-- 4. user_power_ups inventory (owner-scoped)
CREATE TABLE IF NOT EXISTS user_power_ups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  power_up_id uuid NOT NULL REFERENCES power_ups(id) ON DELETE CASCADE,
  quantity int NOT NULL DEFAULT 0,
  acquired_at timestamptz DEFAULT now(),
  UNIQUE(user_id, power_up_id)
);
ALTER TABLE user_power_ups ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_power_ups" ON user_power_ups;
CREATE POLICY "select_own_power_ups" ON user_power_ups FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_power_ups" ON user_power_ups;
CREATE POLICY "insert_own_power_ups" ON user_power_ups FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_power_ups" ON user_power_ups;
CREATE POLICY "update_own_power_ups" ON user_power_ups FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_power_ups" ON user_power_ups;
CREATE POLICY "delete_own_power_ups" ON user_power_ups FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- 5. multiplayer_matches history (owner-scoped)
CREATE TABLE IF NOT EXISTS multiplayer_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  opponent_name text NOT NULL,
  opponent_avatar text,
  opponent_is_bot boolean DEFAULT true,
  user_score int DEFAULT 0,
  opponent_score int DEFAULT 0,
  result text NOT NULL,
  xp_earned int DEFAULT 0,
  coins_earned int DEFAULT 0,
  duration_seconds int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE multiplayer_matches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_matches" ON multiplayer_matches;
CREATE POLICY "select_own_matches" ON multiplayer_matches FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_matches" ON multiplayer_matches;
CREATE POLICY "insert_own_matches" ON multiplayer_matches FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_matches" ON multiplayer_matches;
CREATE POLICY "delete_own_matches" ON multiplayer_matches FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_matches_user ON multiplayer_matches(user_id);

-- 6. ranks reference table (Novice -> Grandmaster)
CREATE TABLE IF NOT EXISTS ranks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  min_xp int NOT NULL DEFAULT 0,
  max_xp int,
  color text NOT NULL,
  icon text NOT NULL,
  order_index int NOT NULL DEFAULT 0
);
ALTER TABLE ranks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_ranks_authenticated" ON ranks;
CREATE POLICY "select_ranks_authenticated" ON ranks FOR SELECT
  TO authenticated USING (true);
