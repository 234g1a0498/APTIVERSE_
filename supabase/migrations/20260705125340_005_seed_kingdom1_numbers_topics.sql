/*
# Seed Kingdom of Numbers topic nodes (47 nodes across 5 zones)

## Plain English
Populates the "Kingdom of Numbers" (Quantitative Aptitude) with 47 granular
topic nodes grouped into 5 visual zones: Number System, Arithmetic,
Speed & Work, Algebra & Geometry, Modern Math. Each node has progressive
difficulty, required_xp gating, and rewards. The final node is a boss.

## Notes
- Uses a VALUES CTE so difficulty/required_xp/rewards compute from order_index.
- Idempotent: only inserts topics whose slug doesn't already exist.
*/

WITH topics(kingdom_id, name, slug, description, zone, zone_order, order_index, is_boss) AS (VALUES
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Number Properties', 'numbers-number-properties', 'Properties of natural & whole numbers', 'Number System', 1, 1, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Even Numbers', 'numbers-even-numbers', 'Divisibility by 2 and even number properties', 'Number System', 1, 2, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Odd Numbers', 'numbers-odd-numbers', 'Odd number properties and parity rules', 'Number System', 1, 3, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Prime Numbers', 'numbers-prime-numbers', 'Primality and prime number theorems', 'Number System', 1, 4, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Composite Numbers', 'numbers-composite-numbers', 'Composite numbers and factorization', 'Number System', 1, 5, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Divisibility Rules', 'numbers-divisibility-rules', 'Quick divisibility tests for 2-11', 'Number System', 1, 6, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Factors', 'numbers-factors', 'Finding factors of a number', 'Number System', 1, 7, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Multiples', 'numbers-multiples', 'Common multiples and LCM relationships', 'Number System', 1, 8, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'HCF', 'numbers-hcf', 'Highest Common Factor via Euclid', 'Number System', 1, 9, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'LCM', 'numbers-lcm', 'Least Common Multiple and applications', 'Number System', 1, 10, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Remainders', 'numbers-remainders', 'Remainder theorems and modular arithmetic', 'Number System', 1, 11, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Cyclicity', 'numbers-cyclicity', 'Cyclicity of unit digits in powers', 'Number System', 1, 12, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Unit Digit', 'numbers-unit-digit', 'Finding the unit digit of large powers', 'Number System', 1, 13, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Last Digit', 'numbers-last-digit', 'Last digit problems and patterns', 'Number System', 1, 14, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Percentages', 'numbers-percentages', 'Percentage change, successive percentages', 'Arithmetic', 2, 15, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Ratio', 'numbers-ratio', 'Ratio concepts and simplification', 'Arithmetic', 2, 16, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Proportion', 'numbers-proportion', 'Direct and inverse proportion', 'Arithmetic', 2, 17, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Partnership', 'numbers-partnership', 'Business partnership and profit sharing', 'Arithmetic', 2, 18, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Profit & Loss', 'numbers-profit-loss', 'CP, SP, profit% and loss%', 'Arithmetic', 2, 19, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Discount', 'numbers-discount', 'Successive discounts and net discount', 'Arithmetic', 2, 20, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Marked Price', 'numbers-marked-price', 'Marked price vs selling price', 'Arithmetic', 2, 21, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Simple Interest', 'numbers-simple-interest', 'SI = PRT/100', 'Arithmetic', 2, 22, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Compound Interest', 'numbers-compound-interest', 'CI with annual and half-yearly compounding', 'Arithmetic', 2, 23, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Averages', 'numbers-averages', 'Weighted and group averages', 'Arithmetic', 2, 24, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Ages', 'numbers-ages', 'Age-based word problems', 'Arithmetic', 2, 25, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Mixtures', 'numbers-mixtures', 'Mixing quantities and replacement', 'Arithmetic', 2, 26, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Allegations', 'numbers-allegations', 'Rule of allegation for mixtures', 'Arithmetic', 2, 27, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Time & Work', 'numbers-time-work', 'Work rate and combined work', 'Speed & Work', 3, 28, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Pipes & Cisterns', 'numbers-pipes-cisterns', 'Filling and emptying cisterns', 'Speed & Work', 3, 29, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Time Speed Distance', 'numbers-time-speed-distance', 'D = S*T and relative speed', 'Speed & Work', 3, 30, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Boats & Streams', 'numbers-boats-streams', 'Upstream and downstream speeds', 'Speed & Work', 3, 31, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Trains', 'numbers-trains', 'Train crossing poles, platforms, bridges', 'Speed & Work', 3, 32, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Races', 'numbers-races', 'Race problems and head starts', 'Speed & Work', 3, 33, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Clocks', 'numbers-clocks', 'Angle between clock hands', 'Speed & Work', 3, 34, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Calendars', 'numbers-calendars', 'Leap years and day finding', 'Speed & Work', 3, 35, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Linear Equations', 'numbers-linear-equations', 'Single and simultaneous linear equations', 'Algebra & Geometry', 4, 36, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Quadratic Equations', 'numbers-quadratic-equations', 'Roots and discriminant', 'Algebra & Geometry', 4, 37, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Logarithms', 'numbers-logarithms', 'Log rules and base conversion', 'Algebra & Geometry', 4, 38, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Indices', 'numbers-indices', 'Laws of exponents and indices', 'Algebra & Geometry', 4, 39, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Lines & Angles', 'numbers-lines-angles', 'Parallel lines and transversals', 'Algebra & Geometry', 4, 40, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Triangles', 'numbers-triangles', 'Triangle properties and congruence', 'Algebra & Geometry', 4, 41, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Circles', 'numbers-circles', 'Arcs, chords, tangents, sectors', 'Algebra & Geometry', 4, 42, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Mensuration', 'numbers-mensuration', 'Area and volume of 2D/3D shapes', 'Algebra & Geometry', 4, 43, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Permutations', 'numbers-permutations', 'nPr and arrangements', 'Modern Math', 5, 44, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Combinations', 'numbers-combinations', 'nCr and selections', 'Modern Math', 5, 45, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Probability', 'numbers-probability', 'Classical probability and events', 'Modern Math', 5, 46, false),
  ('5fbe9695-0a65-4109-8a7f-dc650683306a'::uuid, 'Data Interpretation', 'numbers-data-interpretation', 'Tables, bar graphs, pie charts', 'Modern Math', 5, 47, true)
)
INSERT INTO villages (kingdom_id, name, slug, description, zone, zone_order, difficulty, required_xp, xp_reward, coin_reward, order_index, is_boss_level, is_active, topic_slug)
SELECT t.kingdom_id, t.name, t.slug, t.description, t.zone, t.zone_order,
  LEAST(5, 1 + floor((t.order_index - 1) / 8))::int AS difficulty,
  ((t.order_index - 1) * 50)::int AS required_xp,
  (100 + LEAST(5, 1 + floor((t.order_index - 1) / 8)) * 50)::int AS xp_reward,
  (50 + LEAST(5, 1 + floor((t.order_index - 1) / 8)) * 25)::int AS coin_reward,
  t.order_index, t.is_boss, true, t.slug
FROM topics t
WHERE NOT EXISTS (SELECT 1 FROM villages v WHERE v.slug = t.slug);
