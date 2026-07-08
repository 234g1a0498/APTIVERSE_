/*
# Seed Library of Words topic nodes (10 nodes across 3 zones)

## Plain English
Populates the "Library of Words" (Verbal & English) with 10 topic nodes in
3 zones: Vocabulary, Grammar, Reading. Final node is a boss.
*/

WITH topics(kingdom_id, name, slug, description, zone, zone_order, order_index, is_boss) AS (VALUES
  ('f4cb85e1-8514-4b39-b2ec-1996ff7e4f2e'::uuid, 'Synonyms', 'verbal-synonyms', 'Words with similar meanings', 'Vocabulary', 1, 1, false),
  ('f4cb85e1-8514-4b39-b2ec-1996ff7e4f2e'::uuid, 'Antonyms', 'verbal-antonyms', 'Words with opposite meanings', 'Vocabulary', 1, 2, false),
  ('f4cb85e1-8514-4b39-b2ec-1996ff7e4f2e'::uuid, 'Idioms', 'verbal-idioms', 'Common idiomatic expressions', 'Vocabulary', 1, 3, false),
  ('f4cb85e1-8514-4b39-b2ec-1996ff7e4f2e'::uuid, 'Phrases', 'verbal-phrases', 'Common phrases and their meanings', 'Vocabulary', 1, 4, false),
  ('f4cb85e1-8514-4b39-b2ec-1996ff7e4f2e'::uuid, 'Parts of Speech', 'verbal-parts-of-speech', 'Nouns, verbs, adjectives etc', 'Grammar', 2, 5, false),
  ('f4cb85e1-8514-4b39-b2ec-1996ff7e4f2e'::uuid, 'Subject-Verb Agreement', 'verbal-subject-verb-agreement', 'Number and person agreement', 'Grammar', 2, 6, false),
  ('f4cb85e1-8514-4b39-b2ec-1996ff7e4f2e'::uuid, 'Error Detection', 'verbal-error-detection', 'Spot grammatical errors', 'Grammar', 2, 7, false),
  ('f4cb85e1-8514-4b39-b2ec-1996ff7e4f2e'::uuid, 'Reading Comprehension', 'verbal-reading-comprehension', 'Passage based questions', 'Reading', 3, 8, false),
  ('f4cb85e1-8514-4b39-b2ec-1996ff7e4f2e'::uuid, 'Para Jumbles', 'verbal-para-jumbles', 'Reorder jumbled sentences', 'Reading', 3, 9, false),
  ('f4cb85e1-8514-4b39-b2ec-1996ff7e4f2e'::uuid, 'Critical Reasoning', 'verbal-critical-reasoning', 'Argument analysis', 'Reading', 3, 10, true)
)
INSERT INTO villages (kingdom_id, name, slug, description, zone, zone_order, difficulty, required_xp, xp_reward, coin_reward, order_index, is_boss_level, is_active, topic_slug)
SELECT t.kingdom_id, t.name, t.slug, t.description, t.zone, t.zone_order,
  LEAST(5, 1 + floor((t.order_index - 1) / 2))::int,
  ((t.order_index - 1) * 100)::int,
  (120 + LEAST(5, 1 + floor((t.order_index - 1) / 2)) * 50)::int,
  (60 + LEAST(5, 1 + floor((t.order_index - 1) / 2)) * 25)::int,
  t.order_index, t.is_boss, true, t.slug
FROM topics t
WHERE NOT EXISTS (SELECT 1 FROM villages v WHERE v.slug = t.slug);
