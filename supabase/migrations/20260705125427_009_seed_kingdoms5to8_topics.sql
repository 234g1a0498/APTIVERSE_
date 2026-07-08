/*
# Seed Code Citadel, Tech Fortress, Placement Arena, Future Lab topics

## Plain English
Seeds the remaining 4 kingdoms' topic nodes:
- Code Citadel (Programming): 8 topics across C/C++, Java/Python, Web & SQL
- Tech Fortress (Core CS): 6 topics across Fundamentals
- Placement Arena: 5 topics across Mock Challenges
- Future Lab: 6 topics across AI & Cloud
Total = 25 new topic nodes. Each kingdom's final node is a boss.
*/

WITH topics(kingdom_id, name, slug, description, zone, zone_order, order_index, is_boss) AS (VALUES
  -- Code Citadel
  ('c33d2094-b07e-4da5-9524-4536244704e2'::uuid, 'Pointers & Memory', 'code-pointers-memory', 'C/C++ pointers and memory layout', 'C & C++', 1, 1, false),
  ('c33d2094-b07e-4da5-9524-4536244704e2'::uuid, 'OOP & Templates', 'code-oop-templates', 'Object-oriented programming and templates', 'C & C++', 1, 2, false),
  ('c33d2094-b07e-4da5-9524-4536244704e2'::uuid, 'Collections & Streams', 'code-collections-streams', 'Java collections and stream API', 'Java & Python', 2, 3, false),
  ('c33d2094-b07e-4da5-9524-4536244704e2'::uuid, 'Decorators & Async', 'code-decorators-async', 'Python decorators and async/await', 'Java & Python', 2, 4, false),
  ('c33d2094-b07e-4da5-9524-4536244704e2'::uuid, 'JS Event Loop', 'code-js-event-loop', 'JavaScript event loop and promises', 'Web & SQL', 3, 5, false),
  ('c33d2094-b07e-4da5-9524-4536244704e2'::uuid, 'SQL Joins & Indexes', 'code-sql-joins-indexes', 'SQL joins and indexing', 'Web & SQL', 3, 6, false),
  ('c33d2094-b07e-4da5-9524-4536244704e2'::uuid, 'Memory & Pointers Boss', 'code-memory-boss', 'Advanced memory management', 'C & C++', 1, 7, false),
  ('c33d2094-b07e-4da5-9524-4536244704e2'::uuid, 'Full Stack Mastery', 'code-full-stack-boss', 'Web and SQL capstone', 'Web & SQL', 3, 8, true),
  -- Tech Fortress
  ('5e7025b9-df05-4580-abb8-15dad315e84f'::uuid, 'Operating Systems', 'cs-operating-systems', 'Processes, threads, scheduling', 'Fundamentals', 1, 1, false),
  ('5e7025b9-df05-4580-abb8-15dad315e84f'::uuid, 'DBMS', 'cs-dbms', 'Normalization, ACID, transactions', 'Fundamentals', 1, 2, false),
  ('5e7025b9-df05-4580-abb8-15dad315e84f'::uuid, 'Computer Networks', 'cs-networks', 'OSI/TCP-IP, protocols, routing', 'Fundamentals', 1, 3, false),
  ('5e7025b9-df05-4580-abb8-15dad315e84f'::uuid, 'Cybersecurity', 'cs-cybersecurity', 'Security basics and attack types', 'Fundamentals', 1, 4, false),
  ('5e7025b9-df05-4580-abb8-15dad315e84f'::uuid, 'Concurrency', 'cs-concurrency', 'Deadlocks and synchronization', 'Fundamentals', 1, 5, false),
  ('5e7025b9-df05-4580-abb8-15dad315e84f'::uuid, 'System Architecture', 'cs-system-architecture', 'Cache, memory hierarchy, pipelining', 'Fundamentals', 1, 6, true),
  -- Placement Arena
  ('81a12674-a1dd-422a-a917-bf2ee72c07b6'::uuid, 'HR Interview Prep', 'placement-hr-interview', 'Common HR questions', 'Mock Challenges', 1, 1, false),
  ('81a12674-a1dd-422a-a917-bf2ee72c07b6'::uuid, 'Company Aptitude Mock', 'placement-company-mock', 'Full company mock tests', 'Mock Challenges', 1, 2, false),
  ('81a12674-a1dd-422a-a917-bf2ee72c07b6'::uuid, 'Puzzles', 'placement-puzzles', 'Logical and math puzzles', 'Mock Challenges', 1, 3, false),
  ('81a12674-a1dd-422a-a917-bf2ee72c07b6'::uuid, 'Group Discussion', 'placement-group-discussion', 'GD topics and strategies', 'Mock Challenges', 1, 4, false),
  ('81a12674-a1dd-422a-a917-bf2ee72c07b6'::uuid, 'System Design Basics', 'placement-system-design', 'Scalability and load balancing', 'Mock Challenges', 1, 5, true),
  -- Future Lab
  ('0be018d2-92dc-4b6c-87b1-495310918dc5'::uuid, 'Machine Learning Basics', 'future-ml-basics', 'Supervised and unsupervised learning', 'AI & Cloud', 1, 1, false),
  ('0be018d2-92dc-4b6c-87b1-495310918dc5'::uuid, 'Prompt Engineering', 'future-prompt-engineering', 'LLM prompt design', 'AI & Cloud', 1, 2, false),
  ('0be018d2-92dc-4b6c-87b1-495310918dc5'::uuid, 'Docker', 'future-docker', 'Containers and images', 'AI & Cloud', 1, 3, false),
  ('0be018d2-92dc-4b6c-87b1-495310918dc5'::uuid, 'Cloud', 'future-cloud', 'AWS, Azure, GCP services', 'AI & Cloud', 1, 4, false),
  ('0be018d2-92dc-4b6c-87b1-495310918dc5'::uuid, 'Blockchain', 'future-blockchain', 'Distributed ledger basics', 'AI & Cloud', 1, 5, false),
  ('0be018d2-92dc-4b6c-87b1-495310918dc5'::uuid, 'AI Mastery', 'future-ai-mastery', 'End-to-end AI capstone', 'AI & Cloud', 1, 6, true)
)
INSERT INTO villages (kingdom_id, name, slug, description, zone, zone_order, difficulty, required_xp, xp_reward, coin_reward, order_index, is_boss_level, is_active, topic_slug)
SELECT t.kingdom_id, t.name, t.slug, t.description, t.zone, t.zone_order,
  LEAST(5, 1 + floor((t.order_index - 1) / 2))::int,
  ((t.order_index - 1) * 150)::int,
  (150 + LEAST(5, 1 + floor((t.order_index - 1) / 2)) * 50)::int,
  (75 + LEAST(5, 1 + floor((t.order_index - 1) / 2)) * 25)::int,
  t.order_index, t.is_boss, true, t.slug
FROM topics t
WHERE NOT EXISTS (SELECT 1 FROM villages v WHERE v.slug = t.slug);
