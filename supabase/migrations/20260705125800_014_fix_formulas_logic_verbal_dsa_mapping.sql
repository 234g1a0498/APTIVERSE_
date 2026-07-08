/*
# Re-seed formulas for Logic, Verbal, DSA with proper village mapping
*/

INSERT INTO formulas (kingdom_id, village_id, topic_name, formula_name, formula_text, description, category, example, tags)
SELECT k.id, v.id, v.name, f.fname, f.ftext, f.fdesc, f.fcat, f.fex, f.ftags
FROM kingdoms k JOIN villages v ON v.kingdom_id = k.id
JOIN (VALUES
  ('logic-linear-seating', 'Linear Seating', 'n! arrangements for n people in a row', 'Permutations of n people in a line', 'Arrangements', '5 people: 120 arrangements', ARRAY['seating','linear','permutation']),
  ('logic-circular-seating', 'Circular Seating', '(n-1)! for n people around a circle', 'Circular permutations fix one person', 'Arrangements', '5 around table: 24', ARRAY['seating','circular','permutation']),
  ('logic-circular-seating', 'Bidirectional Seating', '2 x (n-1)! if facing both directions', 'Doubles when facing in or out', 'Arrangements', '5 in/out: 48', ARRAY['seating','circular','bidirectional']),
  ('logic-square-puzzles', 'Square Seating', '4 sides with people, adjacency rules', 'Square table seating constraints', 'Arrangements', '8 people on 4 sides', ARRAY['seating','square']),
  ('logic-floor-puzzles', 'Floor Assignment', 'Assign people to floors with constraints', 'Floor puzzle logic', 'Arrangements', '7 people on 7 floors', ARRAY['seating','floor']),
  ('logic-blood-relations', 'Blood Relation Symbols', '+ male, - female, => married', 'Standard symbols for family trees', 'Relationships', 'A+B means A father of B', ARRAY['blood-relations','symbols']),
  ('logic-family-tree', 'Generation Tracking', 'Track generations with levels', 'Multi-generation family tree', 'Relationships', 'Gen1 grandparents, Gen3 grandchildren', ARRAY['family-tree','generation']),
  ('logic-direction-sense', 'Direction Distance', 'Pythagoras on N-S and E-W displacements', 'Shortest distance from components', 'Relationships', '3N then 4E -> 5 units', ARRAY['direction','distance','pythagoras']),
  ('logic-shortest-path', 'Grid Path Count', '(m+n)! / (m! x n!) paths on m x n grid', 'Count paths in grid', 'Relationships', '3x3 grid: 6 paths', ARRAY['path','grid','combinatorics']),
  ('logic-letter-coding', 'Letter Shift Coding', 'Shift each letter by k positions', 'Caesar cipher style coding', 'Coding', 'CAT +2 = ECV', ARRAY['coding','letter','cipher']),
  ('logic-number-coding', 'Letter to Number', 'Map letters to position numbers A=1..Z=26', 'Letter to number coding', 'Coding', 'CAT = 3-1-20', ARRAY['coding','number']),
  ('logic-syllogisms', 'Syllogism Venn', 'Use Venn diagrams to test validity', 'Draw circles and test conclusions', 'Coding', 'All A are B, All B are C -> All A are C', ARRAY['syllogism','venn']),
  ('logic-statement-assumption', 'Assumption Test', 'Assumption must be necessary for statement', 'Implicit assumption required', 'Coding', 'Use brand X assumes X exists', ARRAY['assumption','statement']),
  ('logic-cause-effect', 'Cause vs Effect', 'Cause must precede and be sufficient', 'Distinguish cause from correlation', 'Coding', 'Rain -> wet ground', ARRAY['cause','effect']),
  ('verbal-synonyms', 'Synonym Rule', 'Words with same meaning in context', 'Choose word preserving meaning', 'Vocabulary', 'Happy = Joyful', ARRAY['synonym','vocabulary']),
  ('verbal-antonyms', 'Antonym Rule', 'Word with opposite meaning', 'Choose word reversing meaning', 'Vocabulary', 'Hot = Cold', ARRAY['antonym','vocabulary']),
  ('verbal-idioms', 'Idiom Meaning', 'Figurative meaning differs from literal', 'Idioms decoded by convention', 'Vocabulary', 'Bite the bullet = face difficulty', ARRAY['idiom','vocabulary']),
  ('verbal-phrases', 'Phrase Meaning', 'Common phrases have set meanings', 'Phrase meaning by usage', 'Vocabulary', 'Break the ice = start conversation', ARRAY['phrase','vocabulary']),
  ('verbal-parts-of-speech', 'Noun Identification', 'Names person, place, thing, idea', 'Nouns proper or common', 'Grammar', 'India, book, freedom', ARRAY['noun','parts-of-speech']),
  ('verbal-subject-verb-agreement', 'Subject-Verb Agreement', 'Singular subject takes singular verb', 'Number and person must match', 'Grammar', 'He runs (not He run)', ARRAY['agreement','grammar']),
  ('verbal-error-detection', 'Error Detection Strategy', 'Check agreement, tense, articles, parallelism', 'Common error categories', 'Grammar', 'Look for agreement errors', ARRAY['error-detection','grammar']),
  ('verbal-reading-comprehension', 'RC Main Idea', 'Find central theme in first/last paragraph', 'Main idea location', 'Reading', 'Thesis in opening', ARRAY['reading-comprehension','main-idea']),
  ('verbal-para-jumbles', 'Para Jumble Linkers', 'However, therefore, moreover signal transitions', 'Use transition words to sequence', 'Reading', 'However = contrast', ARRAY['para-jumble','linkers']),
  ('verbal-critical-reasoning', 'CR Assumption', 'Find unstated premise supporting conclusion', 'Assumption bridges evidence to conclusion', 'Reading', 'Evidence -> Assumption -> Conclusion', ARRAY['critical-reasoning','assumption']),
  ('dsa-arrays', 'Array Access', 'O(1) random access by index', 'Arrays allow constant time access', 'Linear Structures', 'arr[5] in O(1)', ARRAY['array','access','complexity']),
  ('dsa-arrays', 'Array Insertion', 'O(n) in middle due to shifting', 'Insert requires shifting elements', 'Linear Structures', 'Insert at index 2 shifts n-2', ARRAY['array','insertion','complexity']),
  ('dsa-strings', 'String Length', 'O(n) without stored size', 'Length requires traversal', 'Linear Structures', 'strlen is O(n)', ARRAY['string','length','complexity']),
  ('dsa-linked-lists', 'Linked List Insert Head', 'O(1) at head', 'Head insertion constant time', 'Linear Structures', 'Update head pointer', ARRAY['linked-list','insertion']),
  ('dsa-stacks', 'Stack Push Pop', 'O(1) at top', 'Stack operations constant time', 'Linear Structures', 'push and pop O(1)', ARRAY['stack','push','pop']),
  ('dsa-queues', 'Queue Enqueue Dequeue', 'O(1) with proper pointers', 'Queue operations constant time', 'Linear Structures', 'enqueue rear, dequeue front', ARRAY['queue','enqueue','dequeue']),
  ('dsa-binary-trees', 'Inorder Traversal', 'Left-Root-Right', 'Inorder traversal of binary tree', 'Non-Linear Structures', 'Inorder of BST = sorted', ARRAY['binary-tree','inorder','traversal']),
  ('dsa-bst', 'BST Search', 'O(h) where h is height', 'Search depends on height', 'Non-Linear Structures', 'Balanced BST O(log n)', ARRAY['bst','search','complexity']),
  ('dsa-bst', 'BST Insert', 'O(h) comparison-based', 'Insert maintains BST property', 'Non-Linear Structures', 'Compare and descend', ARRAY['bst','insert']),
  ('dsa-heaps', 'Heap Insert', 'O(log n) sift up', 'Insertion bubbles up', 'Non-Linear Structures', 'Min-heap insert', ARRAY['heap','insert','complexity']),
  ('dsa-heaps', 'Heap Extract Min', 'O(log n) sift down', 'Extract root and reheapify', 'Non-Linear Structures', 'Min-heap extract O(log n)', ARRAY['heap','extract','complexity']),
  ('dsa-tries', 'Trie Search', 'O(L) where L is key length', 'Search depends on key length', 'Non-Linear Structures', 'Search cat in O(3)', ARRAY['trie','search','complexity']),
  ('dsa-graphs', 'Graph BFS', 'O(V + E) with queue', 'Breadth first traversal', 'Non-Linear Structures', 'BFS level by level', ARRAY['graph','bfs','traversal']),
  ('dsa-graphs', 'Graph DFS', 'O(V + E) with stack', 'Depth first traversal', 'Non-Linear Structures', 'DFS deep before wide', ARRAY['graph','dfs','traversal']),
  ('dsa-sorting-searching', 'Binary Search', 'O(log n) on sorted array', 'Halve search space each step', 'Core Algorithms', '1..1000 in 10 steps', ARRAY['binary-search','complexity']),
  ('dsa-sorting-searching', 'Bubble Sort', 'O(n^2) comparisons', 'Adjacent swaps', 'Core Algorithms', 'Each pass fixes one', ARRAY['sorting','bubble-sort']),
  ('dsa-sorting-searching', 'Merge Sort', 'O(n log n) divide and conquer', 'Stable sort', 'Core Algorithms', 'Split, sort, merge', ARRAY['sorting','merge-sort']),
  ('dsa-sorting-searching', 'Quick Sort', 'O(n log n) avg, O(n^2) worst', 'Partition based', 'Core Algorithms', 'Pivot partitions', ARRAY['sorting','quick-sort']),
  ('dsa-dp-backtracking', 'DP Optimal Substructure', 'Optimal solution from optimal sub-solutions', 'Overlapping subproblems', 'Core Algorithms', 'Fibonacci memoization', ARRAY['dp','optimal-substructure']),
  ('dsa-dp-backtracking', 'DP Memoization', 'Cache subproblem results', 'Top-down DP with cache', 'Core Algorithms', 'Store fib(n)', ARRAY['dp','memoization']),
  ('dsa-dp-backtracking', 'Backtracking', 'Try options, undo on failure', 'Recursive with pruning', 'Core Algorithms', 'N-Queens', ARRAY['backtracking','recursion'])
) AS f(vslug, fname, ftext, fdesc, fcat, fex, ftags)
ON v.slug = f.vslug
WHERE NOT EXISTS (SELECT 1 FROM formulas fo WHERE fo.village_id = v.id AND fo.formula_name = f.fname);
