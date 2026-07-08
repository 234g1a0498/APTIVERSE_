/*
# Restructure kingdoms to 8-kingdom syllabus + seed ranks & power-ups

## Plain English
The existing kingdoms are re-themed to the new syllabus, and 2 new kingdoms
are added. Old seed villages/questions (test data) are cleared so the full
topic structure can be seeded fresh. Ranks + power-ups catalog seeded.

## Changes
1. DELETE old seed questions, attempts, user_progress, villages.
2. UPDATE existing kingdoms by id (slug set to a temp value first to avoid
   unique constraint collisions, then to the final value).
3. INSERT 2 new kingdoms.
4. INSERT 8 ranks.
5. INSERT 10 power-ups.
*/

-- 1. Clear old seed data
DELETE FROM question_attempts;
DELETE FROM questions;
DELETE FROM user_progress;
DELETE FROM villages;

-- 2. Update existing kingdoms (set slug to unique temp first to avoid collisions)
UPDATE kingdoms SET slug = slug || '_old_' || order_index::text;
UPDATE kingdoms SET name='Kingdom of Numbers', slug='numbers', icon='calculator', color='#6366f1', difficulty=1, order_index=1, description='Quantitative Aptitude' WHERE order_index=1;
UPDATE kingdoms SET name='Realm of Logic', slug='logic', icon='brain', color='#10b981', difficulty=2, order_index=2, description='Logical Reasoning' WHERE order_index=2;
UPDATE kingdoms SET name='Library of Words', slug='verbal', icon='book-open', color='#f59e0b', difficulty=3, order_index=3, description='Verbal & English' WHERE order_index=3;
UPDATE kingdoms SET name='Forest of Algorithms', slug='data-structures', icon='dice-5', color='#ef4444', difficulty=4, order_index=4, description='Data Structures & Algorithms' WHERE order_index=4;
UPDATE kingdoms SET name='Code Citadel', slug='code-citadel', icon='code', color='#ec4899', difficulty=5, order_index=5, description='Programming Languages' WHERE order_index=5;
UPDATE kingdoms SET name='Tech Fortress', slug='tech-fortress', icon='shield', color='#a855f7', difficulty=6, order_index=6, description='Core CS — OS, DBMS, Networks' WHERE order_index=6;

-- 3. Insert 2 new kingdoms
INSERT INTO kingdoms (name, slug, icon, color, difficulty, order_index, is_active, description)
SELECT 'Placement Arena', 'placement', 'sword', '#f97316', 7, 7, true, 'Interviews & Puzzles'
WHERE NOT EXISTS (SELECT 1 FROM kingdoms WHERE slug='placement');
INSERT INTO kingdoms (name, slug, icon, color, difficulty, order_index, is_active, description)
SELECT 'Future Lab', 'future', 'flask-conical', '#06b6d4', 8, 8, true, 'AI & Cloud'
WHERE NOT EXISTS (SELECT 1 FROM kingdoms WHERE slug='future');

-- 4. Seed ranks
INSERT INTO ranks (name, slug, min_xp, max_xp, color, icon, order_index)
SELECT * FROM (VALUES
  ('Novice', 'novice', 0, 999, '#94a3b8', 'sprout', 1),
  ('Apprentice', 'apprentice', 1000, 2999, '#60a5fa', 'shield', 2),
  ('Warrior', 'warrior', 3000, 6999, '#34d399', 'sword', 3),
  ('Knight', 'knight', 7000, 14999, '#fbbf24', 'crown', 4),
  ('Master', 'master', 15000, 29999, '#f97316', 'flame', 5),
  ('Grandmaster', 'grandmaster', 30000, 59999, '#ef4444', 'zap', 6),
  ('Legend', 'legend', 60000, 99999, '#a855f7', 'star', 7),
  ('Mythic', 'mythic', 100000, NULL, '#06b6d4', 'gem', 8)
) AS v(name, slug, min_xp, max_xp, color, icon, order_index)
WHERE NOT EXISTS (SELECT 1 FROM ranks WHERE ranks.slug = v.slug);

-- 5. Seed 10 power-ups
INSERT INTO power_ups (name, slug, description, icon, effect_type, effect_value, cost_coins, cost_diamonds, category)
SELECT * FROM (VALUES
  ('50/50 Strike', 'fifty-fifty', 'Removes two wrong answers from the current question', 'scissors', 'remove_options', 2, 80, 0, 'battle'),
  ('Time Freeze', 'time-freeze', 'Freezes the battle timer for 15 seconds', 'clock', 'freeze_time', 15, 100, 0, 'battle'),
  ('Healing Potion', 'healing-potion', 'Restores 30 HP to your health bar', 'heart', 'restore_hp', 30, 120, 0, 'battle'),
  ('Hint Oracle', 'hint-oracle', 'Reveals a hint for the current question', 'lightbulb', 'reveal_hint', 1, 60, 0, 'battle'),
  ('Double Strike', 'double-strike', 'Doubles XP earned on the next correct answer', 'zap', 'double_xp', 2, 150, 0, 'battle'),
  ('Skip Ticket', 'skip-ticket', 'Skips the current question without losing HP', 'fast-forward', 'skip_question', 1, 90, 0, 'battle'),
  ('Second Wind', 'second-wind', 'Grants a second attempt on the next wrong answer', 'refresh-cw', 'second_chance', 1, 200, 1, 'battle'),
  ('Shield Wall', 'shield-wall', 'Blocks the next HP loss from a wrong answer', 'shield', 'block_damage', 1, 130, 0, 'battle'),
  ('Coin Magnet', 'coin-magnet', 'Triples coins earned on the next correct answer', 'coins', 'triple_coins', 3, 110, 0, 'battle'),
  ('Revive Crystal', 'revive-crystal', 'Revives you with full HP when you would lose', 'gem', 'revive', 1, 0, 3, 'battle')
) AS v(name, slug, description, icon, effect_type, effect_value, cost_coins, cost_diamonds, category)
WHERE NOT EXISTS (SELECT 1 FROM power_ups WHERE power_ups.slug = v.slug);
