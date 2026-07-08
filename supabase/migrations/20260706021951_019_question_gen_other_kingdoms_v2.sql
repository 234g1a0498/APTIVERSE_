/*
# Question Generation Functions for Logic, Verbal, DSA, Code, Tech, Placement, Future
*/
CREATE OR REPLACE FUNCTION generate_logic_questions(target_count int)
RETURNS int AS $$
DECLARE
  generated int := 0;
  v_id uuid; v_slug text; v_name text;
  q_text text; oa text; ob text; oc text; od text; ans text; expl text; diff int;
  rand1 int; rand2 int; rand3 int;
  temp_a text;
BEGIN
  FOR v_slug, v_name IN SELECT slug, name FROM villages WHERE kingdom_id = (SELECT id FROM kingdoms WHERE slug = 'logic') AND is_active = true LOOP
    SELECT id INTO v_id FROM villages WHERE slug = v_slug;
    FOR i IN 1..LEAST(target_count, 25) LOOP
      diff := 3 + floor(random() * 3)::int;
      CASE v_slug
        WHEN 'logic-linear-seating' THEN
          rand1 := 4 + floor(random() * 6)::int;
          q_text := 'In how many ways can ' || rand1 || ' people sit in a row such that two specific persons always sit together?';
          oa := ((rand1-1) * 2)::text; ob := (rand1 * 2)::text; oc := ((rand1-1) * 6)::text; od := (rand1 * rand1)::text; ans := 'A';
          expl := 'Treat pair as unit: (' || (rand1-1) || '-1)! * 2! = ' || ((rand1-1)*2);
        WHEN 'logic-circular-seating' THEN
          rand1 := 5 + floor(random() * 6)::int;
          q_text := 'In how many ways can ' || rand1 || ' people sit around a circular table?';
          oa := 'Computed as (n-1)!'; ob := 'n!'; oc := '(n-1)*2'; od := 'n*n'; ans := 'A';
          expl := 'Circular: (n-1)! = ' || (rand1-1) || '! arrangements.';
        WHEN 'logic-blood-relations' THEN
          q_text := 'Pointing to a photograph, a man said, "She is the daughter of my grandfather''s only son." How is the girl related to the man?';
          oa := 'Sister'; ob := 'Daughter'; oc := 'Niece'; od := 'Mother'; ans := 'A';
          expl := 'Grandfather''s only son = father. Father''s daughter = sister.';
        WHEN 'logic-direction-sense' THEN
          rand1 := 2 + floor(random() * 8)::int;
          rand2 := 2 + floor(random() * 8)::int;
          rand3 := 2 + floor(random() * 8)::int;
          q_text := 'A person walks ' || rand1 || ' km north, then ' || rand2 || ' km east, then ' || rand3 || ' km south. How far is he from the starting point?';
          oa := round(sqrt(power(rand2::numeric, 2) + power((rand1-rand3)::numeric, 2)), 2)::text || ' km';
          ob := (rand1 + rand2 + rand3)::text || ' km'; oc := (rand1 - rand3 + rand2)::text || ' km'; od := (rand2)::text || ' km'; ans := 'A';
          expl := 'Net displacement: ' || (rand1-rand3) || ' km N, ' || rand2 || ' km E.';
        WHEN 'logic-syllogisms' THEN
          q_text := 'Statements: All cats are dogs. All dogs are animals. Conclusions: I. All cats are animals. II. Some animals are cats.';
          oa := 'Both follow'; ob := 'Only I follows'; oc := 'Only II follows'; od := 'Neither follows'; ans := 'A';
          expl := 'Transitive: all cats -> animals (I). If all cats are animals, some animals are cats (II).';
        WHEN 'logic-number-coding' THEN
          q_text := 'If CAT is coded as 24 (3+1+20) and DOG as 26 (4+15+7), how is FISH coded?';
          oa := (6+9+19+8)::text; ob := (6+9+18+8)::text; oc := (5+9+19+8)::text; od := (6+9+19+9)::text; ans := 'A';
          expl := 'Sum of letter positions: F=6, I=9, S=19, H=8. Total = ' || (6+9+19+8);
        WHEN 'logic-letter-coding' THEN
          q_text := 'If in a certain code, MONKEY is written as XDJMNL, how is TIGER written in that code?';
          oa := 'SHFDQ'; ob := 'QDFHS'; oc := 'QDHFS'; od := 'SDFHQ'; ans := 'A';
          expl := 'Each letter shifted -1: T->S, I->H, G->F, E->D, R->Q.';
        WHEN 'logic-shortest-path' THEN
          rand1 := 2 + floor(random() * 5)::int;
          rand2 := 2 + floor(random() * 5)::int;
          q_text := 'Find the number of shortest paths from (0,0) to (' || rand1 || ',' || rand2 || ') moving only right and up.';
          oa := 'C(' || (rand1+rand2) || ',' || rand1 || ')'; ob := (rand1+rand2)::text; oc := (rand1*rand2)::text; od := (rand1*rand1)::text; ans := 'A';
          expl := 'Paths = (m+n)Cm = ' || (rand1+rand2) || 'C' || rand1;
        ELSE
          q_text := 'A is B''s brother. C is B''s mother. D is C''s father. How is A related to D?';
          oa := 'Grandson'; ob := 'Son'; oc := 'Grandfather'; od := 'Nephew'; ans := 'A';
          expl := 'A is child of C, C is child of D. A is D''s grandson.';
      END CASE;
      CASE floor(random() * 4)::int WHEN 1 THEN temp_a := oa; oa := ob; ob := temp_a; ans := 'B'; WHEN 2 THEN temp_a := oa; oa := oc; oc := temp_a; ans := 'C'; WHEN 3 THEN temp_a := oa; oa := od; od := temp_a; ans := 'D'; ELSE ans := 'A'; END CASE;
      INSERT INTO questions (village_id, question_text, question_type, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty, time_limit_seconds, xp_reward, coin_reward, is_active, tags) VALUES (v_id, q_text, 'mcq', oa, ob, oc, od, ans, expl, diff, 60, diff*10, diff*5, true, ARRAY[v_name, 'medium-hard']);
      generated := generated + 1;
    END LOOP;
  END LOOP;
  RETURN generated;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_verbal_questions(target_count int)
RETURNS int AS $$
DECLARE
  generated int := 0;
  v_id uuid; v_slug text; v_name text;
  q_text text; oa text; ob text; oc text; od text; ans text; expl text; diff int;
  temp_a text;
  syn_pairs text[][] := ARRAY[['Abundant','Plentiful','Scarce','Empty','Rare'],['Benevolent','Malevolent','Generous','Kind','Charitable'],['Diligent','Industrious','Lazy','Careless','Slow'],['Ephemeral','Temporary','Permanent','Eternal','Lasting'],['Eloquent','Articulate','Silent','Clumsy','Vague']];
  idx int;
BEGIN
  FOR v_slug, v_name IN SELECT slug, name FROM villages WHERE kingdom_id = (SELECT id FROM kingdoms WHERE slug = 'verbal') AND is_active = true LOOP
    SELECT id INTO v_id FROM villages WHERE slug = v_slug;
    FOR i IN 1..LEAST(target_count, 25) LOOP
      diff := 3 + floor(random() * 3)::int;
      idx := floor(random() * array_length(syn_pairs, 1))::int + 1;
      CASE v_slug
        WHEN 'verbal-synonyms' THEN
          q_text := 'Choose the word most similar in meaning to: ' || syn_pairs[idx][1];
          oa := syn_pairs[idx][2]; ob := syn_pairs[idx][3]; oc := syn_pairs[idx][4]; od := syn_pairs[idx][5]; ans := 'A';
          expl := syn_pairs[idx][1] || ' is closest in meaning to ' || syn_pairs[idx][2];
        WHEN 'verbal-antonyms' THEN
          q_text := 'Choose the word most opposite in meaning to: ' || syn_pairs[idx][2];
          oa := syn_pairs[idx][3]; ob := syn_pairs[idx][1]; oc := syn_pairs[idx][4]; od := syn_pairs[idx][5]; ans := 'A';
          expl := syn_pairs[idx][3] || ' is opposite to ' || syn_pairs[idx][2];
        WHEN 'verbal-idioms' THEN
          q_text := 'What does the idiom "to bite the bullet" mean?';
          oa := 'To endure a painful situation'; ob := 'To eat quickly'; oc := 'To start a fight'; od := 'To give up'; ans := 'A';
          expl := 'Bite the bullet = to face a difficult situation with courage.';
        WHEN 'verbal-reading-comprehension' THEN
          q_text := 'Read: "The Industrial Revolution transformed agrarian societies into industrial ones." What is the main idea?';
          oa := 'The shift from agriculture to industry'; ob := 'Farming improvements'; oc := 'Population growth'; od := 'Political changes'; ans := 'A';
          expl := 'Main idea: transformation from agrarian to industrial society.';
        WHEN 'verbal-para-jumbles' THEN
          q_text := 'Arrange: P) The sun rose Q) Birds began to sing R) The sky turned orange S) Dew sparkled on grass. Which comes first?';
          oa := 'R'; ob := 'P'; oc := 'S'; od := 'Q'; ans := 'A';
          expl := 'Sky turns orange before sun fully rises.';
        WHEN 'verbal-error-detection' THEN
          q_text := 'Find the error: "Neither the teacher or the students was aware of the change."';
          oa := '"or" should be "nor"'; ob := '"was" should be "were"'; oc := '"aware" should be "aware of"'; od := '"the" should be "a"'; ans := 'A';
          expl := 'Neither is always followed by nor, not or.';
        WHEN 'verbal-subject-verb-agreement' THEN
          q_text := 'Choose the correct sentence:';
          oa := 'Each of the students has a book.'; ob := 'Each of the students have a book.'; oc := 'Each of the students were given a book.'; od := 'Each of the students are present.'; ans := 'A';
          expl := '"Each" is always singular, so "has" is correct.';
        WHEN 'verbal-critical-reasoning' THEN
          q_text := 'Argument: "All birds can fly. Penguins are birds. Therefore penguins can fly." What is the flaw?';
          oa := 'The first premise is false'; ob := 'The conclusion is valid'; oc := 'Penguins are not birds'; od := 'The syllogism is invalid'; ans := 'A';
          expl := 'The premise "all birds can fly" is false.';
        ELSE
          q_text := 'Choose the correct spelling:';
          oa := 'Accommodate'; ob := 'Acommodate'; oc := 'Accomodate'; od := 'Acomodate'; ans := 'A';
          expl := 'Accommodate has double c and double m.';
      END CASE;
      CASE floor(random() * 4)::int WHEN 1 THEN temp_a := oa; oa := ob; ob := temp_a; ans := 'B'; WHEN 2 THEN temp_a := oa; oa := oc; oc := temp_a; ans := 'C'; WHEN 3 THEN temp_a := oa; oa := od; od := temp_a; ans := 'D'; ELSE ans := 'A'; END CASE;
      INSERT INTO questions (village_id, question_text, question_type, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty, time_limit_seconds, xp_reward, coin_reward, is_active, tags) VALUES (v_id, q_text, 'mcq', oa, ob, oc, od, ans, expl, diff, 60, diff*10, diff*5, true, ARRAY[v_name, 'medium-hard']);
      generated := generated + 1;
    END LOOP;
  END LOOP;
  RETURN generated;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_dsa_questions(target_count int)
RETURNS int AS $$
DECLARE
  generated int := 0;
  v_id uuid; v_slug text; v_name text;
  q_text text; oa text; ob text; oc text; od text; ans text; expl text; diff int;
  temp_a text;
BEGIN
  FOR v_slug, v_name IN SELECT slug, name FROM villages WHERE kingdom_id = (SELECT id FROM kingdoms WHERE slug = 'data-structures') AND is_active = true LOOP
    SELECT id INTO v_id FROM villages WHERE slug = v_slug;
    FOR i IN 1..LEAST(target_count, 25) LOOP
      diff := 3 + floor(random() * 3)::int;
      CASE v_slug
        WHEN 'dsa-arrays' THEN
          q_text := 'What is the time complexity of Kadane''s algorithm for maximum subarray sum?';
          oa := 'O(n)'; ob := 'O(n log n)'; oc := 'O(n^2)'; od := 'O(1)'; ans := 'A'; expl := 'Kadane''s: single pass, O(n).';
        WHEN 'dsa-linked-lists' THEN
          q_text := 'In a singly linked list, what is the time complexity of inserting a node at the beginning?';
          oa := 'O(1)'; ob := 'O(n)'; oc := 'O(log n)'; od := 'O(n^2)'; ans := 'A'; expl := 'Insert at head: update head pointer, O(1).';
        WHEN 'dsa-stacks' THEN
          q_text := 'Which data structure is best for implementing function call management?';
          oa := 'Stack'; ob := 'Queue'; oc := 'Tree'; od := 'Graph'; ans := 'A'; expl := 'LIFO nature matches function call/return.';
        WHEN 'dsa-queues' THEN
          q_text := 'In a circular queue of size n, what is the condition for queue full?';
          oa := '(rear+1) mod n == front'; ob := 'rear == front'; oc := 'rear == n-1'; od := 'front == 0'; ans := 'A'; expl := 'Full when next rear position equals front.';
        WHEN 'dsa-binary-trees' THEN
          q_text := 'What is the maximum number of nodes in a binary tree of height h (root at height 0)?';
          oa := '2^(h+1) - 1'; ob := '2^h'; oc := '2^h - 1'; od := 'h^2'; ans := 'A'; expl := 'Full binary tree: 2^(h+1) - 1 nodes.';
        WHEN 'dsa-bst' THEN
          q_text := 'What is the time complexity of searching in a balanced BST?';
          oa := 'O(log n)'; ob := 'O(n)'; oc := 'O(n log n)'; od := 'O(1)'; ans := 'A'; expl := 'Balanced BST height = log n.';
        WHEN 'dsa-heaps' THEN
          q_text := 'In a min-heap, which element is always at the root?';
          oa := 'Minimum element'; ob := 'Maximum element'; oc := 'Median'; od := 'Any element'; ans := 'A'; expl := 'Min-heap: root is always minimum.';
        WHEN 'dsa-graphs' THEN
          q_text := 'What is the time complexity of BFS using adjacency list with V vertices and E edges?';
          oa := 'O(V + E)'; ob := 'O(V^2)'; oc := 'O(E log V)'; od := 'O(V * E)'; ans := 'A'; expl := 'BFS: each vertex and edge visited once.';
        WHEN 'dsa-sorting-searching' THEN
          q_text := 'Which sorting algorithm has the best worst-case time complexity?';
          oa := 'Merge Sort - O(n log n)'; ob := 'Quick Sort - O(n^2)'; oc := 'Bubble Sort - O(n^2)'; od := 'Selection Sort - O(n^2)'; ans := 'A'; expl := 'Merge sort: O(n log n) worst case.';
        WHEN 'dsa-dp-backtracking' THEN
          q_text := 'What is the time complexity of naive recursive Fibonacci?';
          oa := 'O(2^n)'; ob := 'O(n)'; oc := 'O(n^2)'; od := 'O(n log n)'; ans := 'A'; expl := 'Each call branches into 2: O(2^n).';
        WHEN 'dsa-strings' THEN
          q_text := 'What is the time complexity of KMP string matching?';
          oa := 'O(n + m)'; ob := 'O(n * m)'; oc := 'O(n^2)'; od := 'O(m^2)'; ans := 'A'; expl := 'KMP: O(n+m), n=text, m=pattern.';
        WHEN 'dsa-tries' THEN
          q_text := 'Time complexity of searching a word of length m in a Trie?';
          oa := 'O(m)'; ob := 'O(n)'; oc := 'O(m * n)'; od := 'O(log m)'; ans := 'A'; expl := 'Trie search: O(m), independent of word count.';
        ELSE
          q_text := 'Which data structure uses LIFO principle?';
          oa := 'Stack'; ob := 'Queue'; oc := 'Tree'; od := 'Graph'; ans := 'A'; expl := 'Stack: Last In First Out.';
      END CASE;
      CASE floor(random() * 4)::int WHEN 1 THEN temp_a := oa; oa := ob; ob := temp_a; ans := 'B'; WHEN 2 THEN temp_a := oa; oa := oc; oc := temp_a; ans := 'C'; WHEN 3 THEN temp_a := oa; oa := od; od := temp_a; ans := 'D'; ELSE ans := 'A'; END CASE;
      INSERT INTO questions (village_id, question_text, question_type, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty, time_limit_seconds, xp_reward, coin_reward, is_active, tags) VALUES (v_id, q_text, 'mcq', oa, ob, oc, od, ans, expl, diff, 60, diff*10, diff*5, true, ARRAY[v_name, 'medium-hard']);
      generated := generated + 1;
    END LOOP;
  END LOOP;
  RETURN generated;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_generic_questions(kingdom_slug text, target_count int)
RETURNS int AS $$
DECLARE
  generated int := 0;
  v_id uuid; v_slug text; v_name text;
  q_text text; oa text; ob text; oc text; od text; ans text; expl text; diff int;
  temp_a text;
BEGIN
  FOR v_slug, v_name IN SELECT slug, name FROM villages WHERE kingdom_id = (SELECT id FROM kingdoms WHERE slug = kingdom_slug) AND is_active = true LOOP
    SELECT id INTO v_id FROM villages WHERE slug = v_slug;
    FOR i IN 1..LEAST(target_count, 25) LOOP
      diff := 3 + floor(random() * 3)::int;
      CASE v_slug
        WHEN 'code-pointers-memory' THEN
          q_text := 'What is the size of a pointer on a 64-bit system?';
          oa := '8 bytes'; ob := '4 bytes'; oc := '2 bytes'; od := '16 bytes'; ans := 'A'; expl := '64-bit pointers = 8 bytes.';
        WHEN 'code-oop-templates' THEN
          q_text := 'Which OOP principle allows multiple methods with the same name but different parameters?';
          oa := 'Polymorphism'; ob := 'Encapsulation'; oc := 'Inheritance'; od := 'Abstraction'; ans := 'A'; expl := 'Polymorphism: method overloading.';
        WHEN 'code-collections-streams' THEN
          q_text := 'What is the default initial capacity of an ArrayList in Java?';
          oa := '10'; ob := '16'; oc := '5'; od := '20'; ans := 'A'; expl := 'Java ArrayList default capacity = 10.';
        WHEN 'code-decorators-async' THEN
          q_text := 'What does async/await provide in Python?';
          oa := 'Non-blocking concurrent code'; ob := 'Multi-threading'; oc := 'Parallel processing'; od := 'Faster execution'; ans := 'A'; expl := 'async/await: non-blocking coroutines.';
        WHEN 'code-js-event-loop' THEN
          q_text := 'In JS, which queue has higher priority: microtask or macrotask?';
          oa := 'Microtask'; ob := 'Macrotask'; oc := 'Both equal'; od := 'Depends'; ans := 'A'; expl := 'Microtasks (Promise callbacks) run before macrotasks.';
        WHEN 'code-sql-joins-indexes' THEN
          q_text := 'Which JOIN returns all rows from both tables with NULLs for unmatched?';
          oa := 'FULL OUTER JOIN'; ob := 'INNER JOIN'; oc := 'LEFT JOIN'; od := 'CROSS JOIN'; ans := 'A'; expl := 'FULL OUTER JOIN: all rows, NULL for unmatched.';
        WHEN 'cs-operating-systems' THEN
          q_text := 'What is the time complexity of SJF scheduling?';
          oa := 'O(n log n)'; ob := 'O(n)'; oc := 'O(n^2)'; od := 'O(1)'; ans := 'A'; expl := 'SJF requires sorting by burst time.';
        WHEN 'cs-concurrency' THEN
          q_text := 'Which is NOT a necessary condition for deadlock?';
          oa := 'Preemption'; ob := 'Mutual exclusion'; oc := 'Hold and wait'; od := 'Circular wait'; ans := 'A'; expl := '4 conditions: mutual exclusion, hold and wait, no preemption, circular wait.';
        WHEN 'cs-dbms' THEN
          q_text := 'Which normal form removes transitive dependencies?';
          oa := '3NF'; ob := '2NF'; oc := 'BCNF'; od := '1NF'; ans := 'A'; expl := '3NF removes transitive dependencies.';
        WHEN 'cs-networks' THEN
          q_text := 'How many bits in an IPv6 address?';
          oa := '128'; ob := '64'; oc := '32'; od := '256'; ans := 'A'; expl := 'IPv6 = 128 bits.';
        WHEN 'cs-cybersecurity' THEN
          q_text := 'Which encryption algorithm is symmetric?';
          oa := 'AES'; ob := 'RSA'; oc := 'ECC'; od := 'DSA'; ans := 'A'; expl := 'AES uses same key for encrypt/decrypt.';
        WHEN 'cs-system-architecture' THEN
          q_text := 'What does pipelining improve in a CPU?';
          oa := 'Instruction throughput'; ob := 'Clock speed'; oc := 'Memory size'; od := 'Cache hit rate'; ans := 'A'; expl := 'Pipelining overlaps instruction stages.';
        WHEN 'placement-hr-interview' THEN
          q_text := 'In STAR method, what does R stand for?';
          oa := 'Result'; ob := 'Research'; oc := 'Responsibility'; od := 'Review'; ans := 'A'; expl := 'STAR: Situation, Task, Action, Result.';
        WHEN 'placement-puzzles' THEN
          q_text := 'A clock shows 3:15. What is the angle between hour and minute hands?';
          oa := '7.5 degrees'; ob := '0 degrees'; oc := '15 degrees'; od := '22.5 degrees'; ans := 'A'; expl := 'Hour: 97.5, Minute: 90. Diff = 7.5.';
        WHEN 'placement-system-design' THEN
          q_text := 'What is the purpose of a load balancer?';
          oa := 'Distribute traffic across servers'; ob := 'Cache responses'; oc := 'Encrypt traffic'; od := 'Compress data'; ans := 'A'; expl := 'Load balancer distributes incoming traffic.';
        WHEN 'future-ml-basics' THEN
          q_text := 'Which activation function outputs values between 0 and 1?';
          oa := 'Sigmoid'; ob := 'ReLU'; oc := 'tanh'; od := 'Leaky ReLU'; ans := 'A'; expl := 'Sigmoid: 1/(1+e^-x), range (0,1).';
        WHEN 'future-prompt-engineering' THEN
          q_text := 'What does higher temperature produce in LLM generation?';
          oa := 'More creative output'; ob := 'More deterministic output'; oc := 'Faster output'; od := 'Shorter output'; ans := 'A'; expl := 'Higher temp = more randomness.';
        WHEN 'future-docker' THEN
          q_text := 'Difference between Docker image and container?';
          oa := 'Image is template, container is running instance'; ob := 'Image is running, container is template'; oc := 'Same thing'; od := 'Image for prod, container for dev'; ans := 'A'; expl := 'Image = read-only template, container = running instance.';
        WHEN 'future-cloud' THEN
          q_text := 'What does serverless computing eliminate?';
          oa := 'Server management'; ob := 'Code writing'; oc := 'Database design'; od := 'Security'; ans := 'A'; expl := 'Serverless: provider manages servers.';
        WHEN 'future-blockchain' THEN
          q_text := 'What is a nonce in blockchain mining?';
          oa := 'A number adjusted to find valid hash'; ob := 'A transaction type'; oc := 'A network node'; od := 'A cryptographic key'; ans := 'A'; expl := 'Nonce = number used once, adjusted until hash meets target.';
        ELSE
          q_text := 'Which principle is fundamental to OOP?';
          oa := 'Encapsulation'; ob := 'Compilation'; oc := 'Optimization'; od := 'Parallelism'; ans := 'A'; expl := 'Encapsulation: bundling data and methods.';
      END CASE;
      CASE floor(random() * 4)::int WHEN 1 THEN temp_a := oa; oa := ob; ob := temp_a; ans := 'B'; WHEN 2 THEN temp_a := oa; oa := oc; oc := temp_a; ans := 'C'; WHEN 3 THEN temp_a := oa; oa := od; od := temp_a; ans := 'D'; ELSE ans := 'A'; END CASE;
      INSERT INTO questions (village_id, question_text, question_type, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty, time_limit_seconds, xp_reward, coin_reward, is_active, tags) VALUES (v_id, q_text, 'mcq', oa, ob, oc, od, ans, expl, diff, 60, diff*10, diff*5, true, ARRAY[v_name, 'medium-hard']);
      generated := generated + 1;
    END LOOP;
  END LOOP;
  RETURN generated;
END;
$$ LANGUAGE plpgsql;
