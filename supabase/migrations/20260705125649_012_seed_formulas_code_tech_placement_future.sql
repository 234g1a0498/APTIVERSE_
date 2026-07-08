/*
# Seed formulas — Code Citadel, Tech Fortress, Placement, Future Lab
*/

INSERT INTO formulas (kingdom_id, village_id, topic_name, formula_name, formula_text, description, category, example, tags)
SELECT k.id, v.id, v.name, f.fname, f.ftext, f.fdesc, f.fcat, f.fex, f.ftags
FROM kingdoms k JOIN villages v ON v.kingdom_id = k.id
CROSS JOIN (VALUES
  -- Code Citadel
  ('Pointer Dereference', '*p gives value at address p', 'Dereference operator accesses pointed value', 'C & C++', 'int x=5; int *p=&x; *p is 5', ARRAY['pointer','dereference']),
  ('Pointer Arithmetic', 'p+1 advances by sizeof(type) bytes', 'Pointer arithmetic scales by element size', 'C & C++', 'int* p; p+1 advances 4 bytes', ARRAY['pointer','arithmetic']),
  ('OOP Encapsulation', 'Bundle data + methods, hide internals', 'Encapsulation via private/public access', 'C & C++', 'private fields with public getters', ARRAY['oop','encapsulation']),
  ('OOP Inheritance', 'Subclass extends superclass', 'Inheritance reuses and extends behavior', 'C & C++', 'class Dog : public Animal', ARRAY['oop','inheritance']),
  ('OOP Polymorphism', 'Same interface, different implementations', 'Virtual functions enable runtime polymorphism', 'C & C++', 'virtual void speak() overridden', ARRAY['oop','polymorphism']),
  ('Template Generic', 'template<class T> enables type-generic code', 'C++ templates for generic programming', 'C & C++', 'template<class T> T max(T a, T b)', ARRAY['template','generic']),
  ('Java HashMap', 'O(1) average get/put', 'HashMap constant time operations', 'Java & Python', 'map.put(k, v) then map.get(k)', ARRAY['java','hashmap','complexity']),
  ('Stream Map Filter', 'Stream pipeline transforms and filters', 'Java stream API chain', 'Java & Python', 'list.stream().map().filter().collect()', ARRAY['java','stream']),
  ('Python Decorator', '@decorator wraps a function', 'Decorator modifies function behavior', 'Java & Python', '@property on a method', ARRAY['python','decorator']),
  ('Async Await', 'await pauses until promise resolves', 'Async/await for non-blocking code', 'Java & Python', 'await fetch(url)', ARRAY['async','await']),
  ('JS Event Loop', 'Single thread + callback queue', 'JavaScript concurrency model', 'Web & SQL', 'setTimeout schedules on macrotask queue', ARRAY['javascript','event-loop']),
  ('JS Promise', 'Pending -> Fulfilled or Rejected', 'Promise states and chaining', 'Web & SQL', 'fetch().then().catch()', ARRAY['javascript','promise']),
  ('SQL Inner Join', 'Returns matching rows from both tables', 'Inner join combines on condition', 'Web & SQL', 'SELECT * FROM a JOIN b ON a.id=b.id', ARRAY['sql','join','inner']),
  ('SQL Left Join', 'All left rows plus matching right', 'Left join keeps unmatched left rows', 'Web & SQL', 'Left rows with NULL right columns', ARRAY['sql','join','left']),
  ('SQL Group By', 'Aggregate rows by column', 'Grouping for aggregation', 'Web & SQL', 'SELECT dept, COUNT(*) GROUP BY dept', ARRAY['sql','group-by','aggregate']),
  ('SQL Index', 'B-tree index speeds lookups to O(log n)', 'Index on column improves search', 'Web & SQL', 'CREATE INDEX idx_name ON users(name)', ARRAY['sql','index','performance']),
  -- Tech Fortress
  ('Process vs Thread', 'Process has own memory; threads share', 'Process isolation vs thread sharing', 'Fundamentals', 'Multiple threads in one process', ARRAY['os','process','thread']),
  ('Context Switch', 'Save and restore CPU state', 'Switching between processes', 'Fundamentals', 'Cost includes cache invalidation', ARRAY['os','scheduling','context-switch']),
  ('Page Replacement LRU', 'Evict least recently used page', 'LRU page replacement algorithm', 'Fundamentals', 'Track access time, evict oldest', ARRAY['os','paging','lru']),
  ('ACID Properties', 'Atomicity, Consistency, Isolation, Durability', 'Transaction guarantees', 'Fundamentals', 'Transfer either fully commits or rolls back', ARRAY['dbms','acid','transaction']),
  ('Normalization 1NF', 'Atomic values, no repeating groups', 'First normal form', 'Fundamentals', 'Split comma fields into rows', ARRAY['dbms','normalization','1nf']),
  ('Normalization 3NF', 'No transitive dependency on non-key', 'Third normal form', 'Fundamentals', 'Non-key columns depend only on key', ARRAY['dbms','normalization','3nf']),
  ('OSI Layers', '7 layers: Physical to Application', 'OSI reference model', 'Fundamentals', 'Application, Presentation, Session, Transport, Network, Data Link, Physical', ARRAY['networks','osi','layers']),
  ('TCP vs UDP', 'TCP reliable, UDP fast connectionless', 'Transport protocol comparison', 'Fundamentals', 'TCP for web, UDP for streaming', ARRAY['networks','tcp','udp']),
  ('Subnet Mask', 'Divides IP into network and host', 'Subnetting splits address space', 'Fundamentals', '255.255.255.0 -> /24', ARRAY['networks','subnet']),
  ('CIA Triad', 'Confidentiality, Integrity, Availability', 'Security principles', 'Fundamentals', 'Encryption, hashing, backups', ARRAY['security','cia']),
  ('Deadlock Conditions', 'Mutual exclusion, hold and wait, no preemption, circular wait', 'Coffman conditions for deadlock', 'Fundamentals', 'All four needed for deadlock', ARRAY['os','deadlock','conditions']),
  ('Cache Hit Time', 'Cache hit much faster than memory access', 'Cache reduces average access time', 'Fundamentals', 'L1 hit ~1 cycle, memory ~100 cycles', ARRAY['architecture','cache','performance']),
  -- Placement
  ('STAR Method', 'Situation, Task, Action, Result', 'Behavioral interview answer structure', 'Mock Challenges', 'Describe context, your role, action, outcome', ARRAY['interview','star']),
  ('Elevator Pitch', '30 second concise self introduction', 'Short impactful intro', 'Mock Challenges', 'Who you are, what you do, why valuable', ARRAY['interview','pitch']),
  ('System Design Scale', 'Estimate load: QPS, storage, bandwidth', 'Back-of-envelope sizing', 'Mock Challenges', '1M users x 10 queries = 10M QPS', ARRAY['system-design','scaling','estimation']),
  ('Load Balancer', 'Distribute traffic across servers', 'Horizontal scaling via LB', 'Mock Challenges', 'Round robin or least connections', ARRAY['system-design','load-balancer']),
  ('Caching Strategy', 'Cache hot data to reduce DB load', 'Read-through, write-through, write-back', 'Mock Challenges', 'Redis cache for product catalog', ARRAY['system-design','caching']),
  ('CAP Theorem', 'Consistency, Availability, Partition tolerance - pick 2', 'Distributed systems tradeoff', 'Mock Challenges', 'CP vs AP systems', ARRAY['system-design','cap']),
  -- Future Lab
  ('Supervised Learning', 'Train on labeled data to predict labels', 'Supervised ML paradigm', 'AI & Cloud', 'Classification and regression', ARRAY['ml','supervised']),
  ('Unsupervised Learning', 'Find patterns in unlabeled data', 'Clustering and dimensionality reduction', 'AI & Cloud', 'K-means clustering', ARRAY['ml','unsupervised']),
  ('Accuracy Metric', '(TP+TN)/(TP+TN+FP+FN)', 'Classification accuracy', 'AI & Cloud', '90 correct of 100 -> 90%', ARRAY['ml','metrics','accuracy']),
  ('Precision', 'TP/(TP+FP)', 'Precision of positive predictions', 'AI & Cloud', 'High precision means few false positives', ARRAY['ml','metrics','precision']),
  ('Recall', 'TP/(TP+FN)', 'Recall of actual positives', 'AI & Cloud', 'High recall means few false negatives', ARRAY['ml','metrics','recall']),
  ('F1 Score', '2 x (precision x recall)/(precision + recall)', 'Harmonic mean of precision and recall', 'AI & Cloud', 'Balances precision and recall', ARRAY['ml','metrics','f1']),
  ('Prompt Pattern', 'Role, context, task, format', 'Effective prompt structure', 'AI & Cloud', 'You are X. Given Y. Do Z. Output as W', ARRAY['prompt-engineering','pattern']),
  ('Zero-shot Prompt', 'Ask without examples', 'Direct instruction without demonstrations', 'AI & Cloud', 'Summarize this article', ARRAY['prompt-engineering','zero-shot']),
  ('Few-shot Prompt', 'Provide examples then ask', 'In-context learning with examples', 'AI & Cloud', 'Example1, Example2, now do this', ARRAY['prompt-engineering','few-shot']),
  ('Docker Image', 'Immutable template with app and deps', 'Image is blueprint for containers', 'AI & Cloud', 'docker build creates image', ARRAY['docker','image']),
  ('Docker Container', 'Running instance of an image', 'Container is isolated executable', 'AI & Cloud', 'docker run starts container', ARRAY['docker','container']),
  ('Cloud IaaS', 'Infrastructure as a Service - VMs, storage', 'Cloud service model', 'AI & Cloud', 'AWS EC2, Azure VM', ARRAY['cloud','iaas']),
  ('Cloud PaaS', 'Platform as a Service - managed runtime', 'Cloud service model', 'AI & Cloud', 'Heroku, App Engine', ARRAY['cloud','paas']),
  ('Cloud SaaS', 'Software as a Service - ready app', 'Cloud service model', 'AI & Cloud', 'Gmail, Salesforce', ARRAY['cloud','saas']),
  ('Blockchain Hash', 'SHA-256 of block contents', 'Cryptographic fingerprint', 'AI & Cloud', 'Each block hashes previous + data', ARRAY['blockchain','hash']),
  ('Blockchain Consensus', 'Proof of Work or Proof of Stake', 'Agreement mechanism', 'AI & Cloud', 'PoW mining vs PoS staking', ARRAY['blockchain','consensus'])
) AS f(fname, ftext, fdesc, fcat, fex, ftags)
WHERE (v.slug LIKE 'code-%' OR v.slug LIKE 'cs-%' OR v.slug LIKE 'placement-%' OR v.slug LIKE 'future-%')
  AND NOT EXISTS (SELECT 1 FROM formulas fo WHERE fo.village_id = v.id AND fo.formula_name = f.fname);
