/*
# Seed formulas — Logic, Verbal, DSA kingdoms
*/

INSERT INTO formulas (kingdom_id, village_id, topic_name, formula_name, formula_text, description, category, example, tags)
SELECT k.id, v.id, v.name, f.fname, f.ftext, f.fdesc, f.fcat, f.fex, f.ftags
FROM kingdoms k JOIN villages v ON v.kingdom_id = k.id
CROSS JOIN (VALUES
  ('Linear Seating Combinations', 'n! arrangements for n distinct people in a row', 'Permutations of n people in a line', 'Arrangements', '5 people in a row: 120 arrangements', ARRAY['seating','linear','permutation']),
  ('Circular Seating', '(n-1)! arrangements for n people around a circle', 'Circular permutations fix one person', 'Arrangements', '5 around a table: 24 arrangements', ARRAY['seating','circular','permutation']),
  ('Bidirectional Seating', '2 x (n-1)! if facing both directions', 'Doubles when people can face in or out', 'Arrangements', '5 facing in/out: 48', ARRAY['seating','circular','bidirectional']),
  ('Blood Relation Symbol', '+ male, - female, => married, -> siblings', 'Standard symbols for family trees', 'Relationships', 'A+B means A is father of B', ARRAY['blood-relations','symbols']),
  ('Direction Distance', 'Pythagoras on N-S and E-W displacements', 'Shortest distance from displacement components', 'Relationships', 'Go 3N then 4E -> 5 units away', ARRAY['direction','distance','pythagoras']),
  ('Letter Coding Shift', 'Shift each letter by k positions', 'Caesar cipher style coding', 'Coding', 'CAT shifted +2 = ECV', ARRAY['coding','letter','cipher']),
  ('Number Coding Pattern', 'Map letters to position numbers A=1..Z=26', 'Letter to number coding', 'Coding', 'CAT = 3-1-20', ARRAY['coding','number']),
  ('Syllogism Venn', 'Use Venn diagrams to test validity', 'Draw circles for each category and test conclusions', 'Coding', 'All A are B, All B are C -> All A are C', ARRAY['syllogism','venn']),
  ('Statement Assumption Test', 'Assumption must be necessary for statement to hold', 'Implicit assumption is required for the argument', 'Coding', 'Use brand X assumes X exists', ARRAY['assumption','statement']),
  ('Cause and Effect', 'Cause must precede and be sufficient for effect', 'Distinguish cause from correlation', 'Coding', 'Rain (cause) -> Wet ground (effect)', ARRAY['cause','effect']),
  ('Synonym Rule', 'Words with same meaning in a context', 'Choose word that does not change sentence meaning', 'Vocabulary', 'Happy = Joyful', ARRAY['synonym','vocabulary']),
  ('Antonym Rule', 'Word with opposite meaning', 'Choose word that reverses the meaning', 'Vocabulary', 'Hot = Cold', ARRAY['antonym','vocabulary']),
  ('Idiom Meaning', 'Figurative meaning differs from literal', 'Idioms cannot be decoded word by word', 'Vocabulary', 'Bite the bullet = face difficulty', ARRAY['idiom','vocabulary']),
  ('Noun Identification', 'Names person, place, thing, idea', 'Nouns can be proper or common', 'Grammar', 'India, book, freedom', ARRAY['noun','parts-of-speech']),
  ('Verb Tense', 'Past, present, future forms', 'Verbs show action or state and tense', 'Grammar', 'go / went / will go', ARRAY['verb','tense']),
  ('Subject-Verb Agreement', 'Singular subject takes singular verb', 'Number and person must match', 'Grammar', 'He runs (not He run)', ARRAY['agreement','grammar']),
  ('Article Usage', 'a before consonant sound, an before vowel sound', 'Articles depend on sound not spelling', 'Grammar', 'an hour, a university', ARRAY['article','grammar']),
  ('Error Detection Strategy', 'Check subject-verb, tense, articles, parallelism', 'Common error categories', 'Grammar', 'Look for agreement and tense errors', ARRAY['error-detection','grammar']),
  ('RC Main Idea', 'Find central theme in first/last paragraph', 'Main idea usually in opening or closing', 'Reading', 'Identify the thesis statement', ARRAY['reading-comprehension','main-idea']),
  ('Para Jumble Linkers', 'However, therefore, moreover signal transitions', 'Use transition words to sequence sentences', 'Reading', 'However indicates contrast', ARRAY['para-jumble','linkers']),
  ('Critical Reasoning Assumption', 'Find unstated premise that supports conclusion', 'Assumption bridges evidence to conclusion', 'Reading', 'Evidence -> Assumption -> Conclusion', ARRAY['critical-reasoning','assumption']),
  ('Array Access', 'O(1) random access by index', 'Arrays allow constant time index access', 'Linear Structures', 'arr[5] accessed in O(1)', ARRAY['array','access','complexity']),
  ('Array Insertion Middle', 'O(n) due to shifting', 'Inserting in middle requires shifting elements', 'Linear Structures', 'Insert at index 2 shifts n-2 elements', ARRAY['array','insertion','complexity']),
  ('String Length', 'O(n) to compute length without stored size', 'Length requires traversal unless stored', 'Linear Structures', 'strlen is O(n)', ARRAY['string','length','complexity']),
  ('Linked List Insert', 'O(1) at head, O(n) at tail without tail pointer', 'Insertion cost depends on position', 'Linear Structures', 'Insert at head: update pointer, O(1)', ARRAY['linked-list','insertion']),
  ('Stack Push Pop', 'O(1) at top', 'Stack operations are constant time', 'Linear Structures', 'push and pop are O(1)', ARRAY['stack','push','pop']),
  ('Queue Enqueue Dequeue', 'O(1) with proper rear/front pointers', 'Queue operations constant time', 'Linear Structures', 'enqueue at rear, dequeue at front', ARRAY['queue','enqueue','dequeue']),
  ('Binary Tree Traversal', 'Inorder: Left-Root-Right', 'Inorder traversal of binary tree', 'Non-Linear Structures', 'Inorder of BST gives sorted order', ARRAY['binary-tree','inorder','traversal']),
  ('BST Search', 'O(h) where h is height', 'Search time depends on tree height', 'Non-Linear Structures', 'Balanced BST search O(log n)', ARRAY['bst','search','complexity']),
  ('BST Insert', 'O(h) comparison-based insertion', 'Insert maintains BST property', 'Non-Linear Structures', 'Compare and descend left or right', ARRAY['bst','insert']),
  ('Heap Insert', 'O(log n) sift up', 'Insertion in heap bubbles up', 'Non-Linear Structures', 'Min-heap insert maintains heap property', ARRAY['heap','insert','complexity']),
  ('Heap Extract Min', 'O(log n) sift down', 'Extract root and reheapify', 'Non-Linear Structures', 'Min-heap extract root O(log n)', ARRAY['heap','extract','complexity']),
  ('Trie Search', 'O(L) where L is key length', 'Trie search depends on key length not total keys', 'Non-Linear Structures', 'Search cat in O(3)', ARRAY['trie','search','complexity']),
  ('Graph BFS', 'O(V + E) with queue', 'Breadth first traversal uses queue', 'Non-Linear Structures', 'BFS visits level by level', ARRAY['graph','bfs','traversal']),
  ('Graph DFS', 'O(V + E) with stack/recursion', 'Depth first traversal uses stack', 'Non-Linear Structures', 'DFS visits deep before wide', ARRAY['graph','dfs','traversal']),
  ('Binary Search', 'O(log n) on sorted array', 'Halve search space each step', 'Core Algorithms', 'Search 1..1000 in at most 10 steps', ARRAY['binary-search','complexity']),
  ('Bubble Sort', 'O(n^2) comparisons', 'Adjacent swaps bubble max to end', 'Core Algorithms', 'Each pass fixes one element', ARRAY['sorting','bubble-sort']),
  ('Merge Sort', 'O(n log n) divide and conquer', 'Stable sort using merge', 'Core Algorithms', 'Split, sort halves, merge', ARRAY['sorting','merge-sort']),
  ('Quick Sort', 'O(n log n) average, O(n^2) worst', 'Partition based sorting', 'Core Algorithms', 'Pivot partitions array', ARRAY['sorting','quick-sort']),
  ('DP Optimal Substructure', 'Solution = optimal sub-solutions combined', 'Dynamic programming uses overlapping subproblems', 'Core Algorithms', 'Fibonacci via memoization', ARRAY['dp','optimal-substructure']),
  ('DP Memoization', 'Cache results of subproblems', 'Top-down DP with cache', 'Core Algorithms', 'Store fib(n) after computing', ARRAY['dp','memoization']),
  ('Backtracking', 'Try options, undo on failure', 'Recursive exploration with pruning', 'Core Algorithms', 'N-Queens problem', ARRAY['backtracking','recursion'])
) AS f(fname, ftext, fdesc, fcat, fex, ftags)
WHERE (v.slug LIKE 'logic-%' OR v.slug LIKE 'verbal-%' OR v.slug LIKE 'dsa-%')
  AND NOT EXISTS (SELECT 1 FROM formulas fo WHERE fo.village_id = v.id AND fo.formula_name = f.fname);
