/*
# Seed Realm of Logic topic nodes (13 nodes across 3 zones)

## Plain English
Populates the "Realm of Logic" (Logical Reasoning) with 13 topic nodes grouped
into 3 zones: Arrangements, Relationships, Coding. Final node is a boss.
*/

WITH topics(kingdom_id, name, slug, description, zone, zone_order, order_index, is_boss) AS (VALUES
  ('780b4ef0-f771-4db2-802b-f95b86bb9bd5'::uuid, 'Linear Seating', 'logic-linear-seating', 'People in a row with conditions', 'Arrangements', 1, 1, false),
  ('780b4ef0-f771-4db2-802b-f95b86bb9bd5'::uuid, 'Circular Seating', 'logic-circular-seating', 'Around a table facing in/out', 'Arrangements', 1, 2, false),
  ('780b4ef0-f771-4db2-802b-f95b86bb9bd5'::uuid, 'Square Puzzles', 'logic-square-puzzles', 'Square table seating', 'Arrangements', 1, 3, false),
  ('780b4ef0-f771-4db2-802b-f95b86bb9bd5'::uuid, 'Floor Puzzles', 'logic-floor-puzzles', 'People on multiple floors', 'Arrangements', 1, 4, false),
  ('780b4ef0-f771-4db2-802b-f95b86bb9bd5'::uuid, 'Blood Relations', 'logic-blood-relations', 'Family relationship puzzles', 'Relationships', 2, 5, false),
  ('780b4ef0-f771-4db2-802b-f95b86bb9bd5'::uuid, 'Family Tree', 'logic-family-tree', 'Multi-generation family tree', 'Relationships', 2, 6, false),
  ('780b4ef0-f771-4db2-802b-f95b86bb9bd5'::uuid, 'Direction Sense', 'logic-direction-sense', 'Movements and final direction', 'Relationships', 2, 7, false),
  ('780b4ef0-f771-4db2-802b-f95b86bb9bd5'::uuid, 'Shortest Path', 'logic-shortest-path', 'Grid path finding', 'Relationships', 2, 8, false),
  ('780b4ef0-f771-4db2-802b-f95b86bb9bd5'::uuid, 'Letter Coding', 'logic-letter-coding', 'Letter substitution ciphers', 'Coding', 3, 9, false),
  ('780b4ef0-f771-4db2-802b-f95b86bb9bd5'::uuid, 'Number Coding', 'logic-number-coding', 'Number pattern codes', 'Coding', 3, 10, false),
  ('780b4ef0-f771-4db2-802b-f95b86bb9bd5'::uuid, 'Syllogisms', 'logic-syllogisms', 'Venn diagram deductions', 'Coding', 3, 11, false),
  ('780b4ef0-f771-4db2-802b-f95b86bb9bd5'::uuid, 'Statement & Assumption', 'logic-statement-assumption', 'Implicit assumptions', 'Coding', 3, 12, false),
  ('780b4ef0-f771-4db2-802b-f95b86bb9bd5'::uuid, 'Cause & Effect', 'logic-cause-effect', 'Causal reasoning', 'Coding', 3, 13, true)
)
INSERT INTO villages (kingdom_id, name, slug, description, zone, zone_order, difficulty, required_xp, xp_reward, coin_reward, order_index, is_boss_level, is_active, topic_slug)
SELECT t.kingdom_id, t.name, t.slug, t.description, t.zone, t.zone_order,
  LEAST(5, 1 + floor((t.order_index - 1) / 3))::int,
  ((t.order_index - 1) * 80)::int,
  (120 + LEAST(5, 1 + floor((t.order_index - 1) / 3)) * 50)::int,
  (60 + LEAST(5, 1 + floor((t.order_index - 1) / 3)) * 25)::int,
  t.order_index, t.is_boss, true, t.slug
FROM topics t
WHERE NOT EXISTS (SELECT 1 FROM villages v WHERE v.slug = t.slug);
