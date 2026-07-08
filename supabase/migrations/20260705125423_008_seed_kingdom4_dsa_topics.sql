/*
# Seed Forest of Algorithms topic nodes (12 nodes across 3 zones)

## Plain English
Populates "Forest of Algorithms" (Data Structures & Algorithms) with 12 topic
nodes in 3 zones: Linear Structures, Non-Linear Structures, Core Algorithms.
Final node is a boss.
*/

WITH topics(kingdom_id, name, slug, description, zone, zone_order, order_index, is_boss) AS (VALUES
  ('4044e7ff-1eca-4a24-9bd4-a8a0cc5d922c'::uuid, 'Arrays', 'dsa-arrays', 'Array traversal and manipulation', 'Linear Structures', 1, 1, false),
  ('4044e7ff-1eca-4a24-9bd4-a8a0cc5d922c'::uuid, 'Strings', 'dsa-strings', 'String algorithms and pattern matching', 'Linear Structures', 1, 2, false),
  ('4044e7ff-1eca-4a24-9bd4-a8a0cc5d922c'::uuid, 'Linked Lists', 'dsa-linked-lists', 'Singly, doubly, circular linked lists', 'Linear Structures', 1, 3, false),
  ('4044e7ff-1eca-4a24-9bd4-a8a0cc5d922c'::uuid, 'Stacks', 'dsa-stacks', 'LIFO stack operations', 'Linear Structures', 1, 4, false),
  ('4044e7ff-1eca-4a24-9bd4-a8a0cc5d922c'::uuid, 'Queues', 'dsa-queues', 'FIFO queue variants', 'Linear Structures', 1, 5, false),
  ('4044e7ff-1eca-4a24-9bd4-a8a0cc5d922c'::uuid, 'Binary Trees', 'dsa-binary-trees', 'Binary tree traversals', 'Non-Linear Structures', 2, 6, false),
  ('4044e7ff-1eca-4a24-9bd4-a8a0cc5d922c'::uuid, 'BST', 'dsa-bst', 'Binary search tree operations', 'Non-Linear Structures', 2, 7, false),
  ('4044e7ff-1eca-4a24-9bd4-a8a0cc5d922c'::uuid, 'Heaps', 'dsa-heaps', 'Min and max heaps', 'Non-Linear Structures', 2, 8, false),
  ('4044e7ff-1eca-4a24-9bd4-a8a0cc5d922c'::uuid, 'Tries', 'dsa-tries', 'Prefix tree structures', 'Non-Linear Structures', 2, 9, false),
  ('4044e7ff-1eca-4a24-9bd4-a8a0cc5d922c'::uuid, 'Graphs', 'dsa-graphs', 'Graph representations and traversal', 'Non-Linear Structures', 2, 10, false),
  ('4044e7ff-1eca-4a24-9bd4-a8a0cc5d922c'::uuid, 'Sorting & Searching', 'dsa-sorting-searching', 'Sorting algorithms and binary search', 'Core Algorithms', 3, 11, false),
  ('4044e7ff-1eca-4a24-9bd4-a8a0cc5d922c'::uuid, 'DP & Backtracking', 'dsa-dp-backtracking', 'Dynamic programming and recursion', 'Core Algorithms', 3, 12, true)
)
INSERT INTO villages (kingdom_id, name, slug, description, zone, zone_order, difficulty, required_xp, xp_reward, coin_reward, order_index, is_boss_level, is_active, topic_slug)
SELECT t.kingdom_id, t.name, t.slug, t.description, t.zone, t.zone_order,
  LEAST(5, 1 + floor((t.order_index - 1) / 3))::int,
  ((t.order_index - 1) * 120)::int,
  (150 + LEAST(5, 1 + floor((t.order_index - 1) / 3)) * 50)::int,
  (75 + LEAST(5, 1 + floor((t.order_index - 1) / 3)) * 25)::int,
  t.order_index, t.is_boss, true, t.slug
FROM topics t
WHERE NOT EXISTS (SELECT 1 FROM villages v WHERE v.slug = t.slug);
