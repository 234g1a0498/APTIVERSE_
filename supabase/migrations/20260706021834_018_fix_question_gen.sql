/*
# Fix question gen function - use numeric casts for round()
*/
CREATE OR REPLACE FUNCTION generate_numbers_questions(target_count int)
RETURNS int AS $$
DECLARE
  generated int := 0;
  v_id uuid;
  v_slug text;
  v_name text;
  q_text text;
  oa text; ob text; oc text; od text;
  ans text;
  expl text;
  diff int;
  rand1 int; rand2 int; rand3 int;
  result_val numeric;
  wrong1 numeric; wrong2 numeric; wrong3 numeric;
  temp_a text;
BEGIN
  FOR v_slug, v_name IN
    SELECT slug, name FROM villages WHERE kingdom_id = (SELECT id FROM kingdoms WHERE slug = 'numbers') AND is_active = true
  LOOP
    SELECT id INTO v_id FROM villages WHERE slug = v_slug;

    FOR i IN 1..LEAST(target_count, 30) LOOP
      diff := 3 + floor(random() * 3)::int;

      CASE v_slug
        WHEN 'numbers-percentages' THEN
          rand1 := 100 + floor(random() * 900)::int;
          rand2 := 5 + floor(random() * 45)::int;
          q_text := 'A number when increased by ' || rand2 || '% gives ' || rand1 || '. What is the original number?';
          result_val := round((rand1 * 100.0 / (100 + rand2))::numeric, 2);
          wrong1 := round((result_val * 1.1)::numeric, 2); wrong2 := round((result_val * 0.9)::numeric, 2); wrong3 := round((result_val + rand2)::numeric, 2);
          oa := result_val::text; ob := wrong1::text; oc := wrong2::text; od := wrong3::text; ans := 'A';
          expl := 'Original = ' || rand1 || ' / (1 + ' || rand2 || '/100) = ' || result_val;

        WHEN 'numbers-profit-loss' THEN
          rand1 := 100 + floor(random() * 900)::int;
          rand2 := 5 + floor(random() * 40)::int;
          q_text := 'A man buys an article for Rs. ' || rand1 || ' and sells it at a loss of ' || rand2 || '%. Find the selling price.';
          result_val := round((rand1 * (100 - rand2) / 100.0)::numeric, 2);
          wrong1 := round((result_val + 20)::numeric, 2); wrong2 := round((result_val - 20)::numeric, 2); wrong3 := round((rand1 * (100 + rand2) / 100.0)::numeric, 2);
          oa := result_val::text; ob := wrong1::text; oc := wrong2::text; od := wrong3::text; ans := 'A';
          expl := 'SP = CP * (1 - Loss%/100) = ' || rand1 || ' * ' || (100-rand2) || '/100 = ' || result_val;

        WHEN 'numbers-simple-interest' THEN
          rand1 := 1000 + floor(random() * 9000)::int;
          rand2 := 3 + floor(random() * 12)::int;
          rand3 := 2 + floor(random() * 8)::int;
          q_text := 'Find the simple interest on Rs. ' || rand1 || ' at ' || rand2 || '% per annum for ' || rand3 || ' years.';
          result_val := round((rand1 * rand2 * rand3 / 100.0)::numeric, 2);
          wrong1 := round((result_val + 100)::numeric, 2); wrong2 := round((result_val - 50)::numeric, 2); wrong3 := round((rand1 * rand2 / 100.0)::numeric, 2);
          oa := result_val::text; ob := wrong1::text; oc := wrong2::text; od := wrong3::text; ans := 'A';
          expl := 'SI = P*R*T/100 = ' || rand1 || '*' || rand2 || '*' || rand3 || '/100 = ' || result_val;

        WHEN 'numbers-compound-interest' THEN
          rand1 := 1000 + floor(random() * 9000)::int;
          rand2 := 3 + floor(random() * 10)::int;
          rand3 := 2 + floor(random() * 5)::int;
          q_text := 'Find the compound interest on Rs. ' || rand1 || ' at ' || rand2 || '% per annum for ' || rand3 || ' years (compounded annually).';
          result_val := round((rand1 * power((1 + rand2/100.0)::numeric, rand3) - rand1)::numeric, 2);
          wrong1 := round((result_val + 200)::numeric, 2); wrong2 := round((result_val - 100)::numeric, 2); wrong3 := round((rand1 * rand2 * rand3 / 100.0)::numeric, 2);
          oa := result_val::text; ob := wrong1::text; oc := wrong2::text; od := wrong3::text; ans := 'A';
          expl := 'CI = P*(1+R/100)^T - P = ' || result_val;

        WHEN 'numbers-ratio' THEN
          rand1 := 2 + floor(random() * 8)::int;
          rand2 := 2 + floor(random() * 8)::int;
          rand3 := 100 + floor(random() * 900)::int;
          q_text := 'Rs. ' || rand3 || ' is divided between A and B in the ratio ' || rand1 || ':' || rand2 || '. Find A''s share.';
          result_val := round((rand3 * rand1 / (rand1 + rand2)::float)::numeric, 2);
          wrong1 := round((result_val + 50)::numeric, 2); wrong2 := round((result_val - 50)::numeric, 2); wrong3 := round((rand3 * rand2 / (rand1 + rand2)::float)::numeric, 2);
          oa := result_val::text; ob := wrong1::text; oc := wrong2::text; od := wrong3::text; ans := 'A';
          expl := 'A''s share = ' || rand3 || ' * ' || rand1 || '/(' || rand1 || '+' || rand2 || ') = ' || result_val;

        WHEN 'numbers-averages' THEN
          rand1 := 10 + floor(random() * 90)::int;
          rand2 := 5 + floor(random() * 20)::int;
          rand3 := 5 + floor(random() * 10)::int;
          q_text := 'The average of ' || rand3 || ' numbers is ' || rand1 || '. If one number ' || rand2 || ' is removed, what is the new average?';
          result_val := round(((rand1 * rand3 - rand2)::numeric / (rand3 - 1)), 2);
          wrong1 := round((result_val + 5)::numeric, 2); wrong2 := round((result_val - 5)::numeric, 2); wrong3 := round((rand1 + rand2 / rand3::float)::numeric, 2);
          oa := result_val::text; ob := wrong1::text; oc := wrong2::text; od := wrong3::text; ans := 'A';
          expl := 'New average = (' || rand1 || '*' || rand3 || ' - ' || rand2 || ')/(' || rand3 || '-1) = ' || result_val;

        WHEN 'numbers-time-speed-distance' THEN
          rand1 := 20 + floor(random() * 80)::int;
          rand2 := 2 + floor(random() * 8)::int;
          rand3 := floor(random()*60)::int;
          q_text := 'A car travels at ' || rand1 || ' km/hr. How much distance will it cover in ' || rand2 || ' hours ' || rand3 || ' minutes?';
          result_val := round((rand1 * (rand2 + rand3 / 60.0))::numeric, 2);
          wrong1 := round((result_val + 10)::numeric, 2); wrong2 := round((result_val - 10)::numeric, 2); wrong3 := round((rand1 * rand2)::numeric, 2);
          oa := result_val::text; ob := wrong1::text; oc := wrong2::text; od := wrong3::text; ans := 'A';
          expl := 'Distance = Speed * Time = ' || rand1 || ' * ' || (rand2 + rand3/60.0) || ' = ' || result_val;

        WHEN 'numbers-hcf' THEN
          rand1 := 12 + floor(random() * 100)::int;
          rand2 := 12 + floor(random() * 100)::int;
          q_text := 'Find the HCF of ' || rand1 || ' and ' || rand2 || '.';
          result_val := gcd(rand1, rand2);
          wrong1 := abs(rand1 - rand2); wrong2 := result_val + 2; wrong3 := result_val * 2;
          oa := result_val::text; ob := wrong1::text; oc := wrong2::text; od := wrong3::text; ans := 'A';
          expl := 'HCF of ' || rand1 || ' and ' || rand2 || ' = ' || result_val;

        WHEN 'numbers-lcm' THEN
          rand1 := 4 + floor(random() * 20)::int;
          rand2 := 4 + floor(random() * 20)::int;
          q_text := 'Find the LCM of ' || rand1 || ' and ' || rand2 || '.';
          result_val := lcm(rand1, rand2);
          wrong1 := result_val + 5; wrong2 := rand1 * rand2; wrong3 := result_val - 5;
          oa := result_val::text; ob := wrong1::text; oc := wrong2::text; od := wrong3::text; ans := 'A';
          expl := 'LCM of ' || rand1 || ' and ' || rand2 || ' = ' || result_val;

        WHEN 'numbers-permutations' THEN
          rand1 := 5 + floor(random() * 6)::int;
          rand2 := 2 + floor(random() * 4)::int;
          q_text := 'In how many ways can ' || rand2 || ' people be selected from ' || rand1 || ' people and arranged in a row?';
          result_val := 1; FOR j IN 1..rand2 LOOP result_val := result_val * (rand1 - j + 1); END LOOP;
          wrong1 := result_val + 10; wrong2 := result_val - 5; wrong3 := result_val * 2;
          oa := result_val::text; ob := wrong1::text; oc := wrong2::text; od := wrong3::text; ans := 'A';
          expl := 'nP r = ' || rand1 || 'P' || rand2 || ' = ' || result_val;

        WHEN 'numbers-combinations' THEN
          rand1 := 6 + floor(random() * 8)::int;
          rand2 := 2 + floor(random() * 5)::int;
          q_text := 'A committee of ' || rand2 || ' members is to be formed from ' || rand1 || ' people. In how many ways can this be done?';
          result_val := 1; FOR j IN 1..rand2 LOOP result_val := result_val * (rand1 - j + 1) / j; END LOOP;
          wrong1 := result_val + 5; wrong2 := result_val - 3; wrong3 := result_val * 2;
          oa := result_val::text; ob := wrong1::text; oc := wrong2::text; od := wrong3::text; ans := 'A';
          expl := 'nC r = ' || rand1 || 'C' || rand2 || ' = ' || result_val;

        WHEN 'numbers-probability' THEN
          rand1 := 2 + floor(random() * 6)::int;
          rand2 := 1 + floor(random() * 3)::int;
          q_text := 'A die is thrown. What is the probability of getting a number greater than ' || rand2 || '?';
          result_val := round(((6 - rand2)::numeric / 6), 4);
          wrong1 := round((result_val + 0.1)::numeric, 4); wrong2 := round((result_val - 0.1)::numeric, 4); wrong3 := round((1::numeric / 6), 4);
          oa := result_val::text; ob := wrong1::text; oc := wrong2::text; od := wrong3::text; ans := 'A';
          expl := 'P(number > ' || rand2 || ') = ' || (6-rand2) || '/6 = ' || result_val;

        WHEN 'numbers-prime-numbers' THEN
          rand1 := 20 + floor(random() * 80)::int;
          q_text := 'How many prime numbers are there between 1 and ' || rand1 || '?';
          SELECT count(*)::int INTO result_val FROM generate_series(2, rand1) n WHERE NOT EXISTS (SELECT 1 FROM generate_series(2, floor(sqrt(n))::int) d WHERE n % d = 0);
          wrong1 := result_val + 2; wrong2 := result_val - 1; wrong3 := result_val + 1;
          oa := result_val::text; ob := wrong1::text; oc := wrong2::text; od := wrong3::text; ans := 'A';
          expl := 'Count primes between 1 and ' || rand1 || ' = ' || result_val;

        WHEN 'numbers-number-properties' THEN
          rand1 := 10 + floor(random() * 990)::int;
          rand2 := 10 + floor(random() * 990)::int;
          q_text := 'If the sum of two numbers is ' || (rand1+rand2) || ' and their difference is ' || abs(rand1-rand2) || ', find the larger number.';
          result_val := greatest(rand1, rand2);
          wrong1 := result_val + 5; wrong2 := result_val - 5; wrong3 := least(rand1, rand2);
          oa := result_val::text; ob := wrong1::text; oc := wrong2::text; od := wrong3::text; ans := 'A';
          expl := 'Larger = (Sum + Difference)/2 = ' || result_val;

        WHEN 'numbers-discount' THEN
          rand1 := 100 + floor(random() * 900)::int;
          rand2 := 5 + floor(random() * 40)::int;
          q_text := 'Find the selling price after a discount of ' || rand2 || '% on a marked price of Rs. ' || rand1 || '.';
          result_val := round((rand1 * (100 - rand2) / 100.0)::numeric, 2);
          wrong1 := round((result_val + 20)::numeric, 2); wrong2 := round((result_val - 20)::numeric, 2); wrong3 := round((rand1 * (100 + rand2) / 100.0)::numeric, 2);
          oa := result_val::text; ob := wrong1::text; oc := wrong2::text; od := wrong3::text; ans := 'A';
          expl := 'SP = MP * (1 - d/100) = ' || rand1 || ' * ' || (100-rand2) || '/100 = ' || result_val;

        WHEN 'numbers-partnership' THEN
          rand1 := 1000 + floor(random() * 9000)::int;
          rand2 := 1000 + floor(random() * 9000)::int;
          rand3 := 6 + floor(random() * 12)::int;
          q_text := 'A invests Rs. ' || rand1 || ' and B invests Rs. ' || rand2 || '. After ' || rand3 || ' months, A withdraws. If profit is Rs. ' || (rand1+rand2) || ', find A''s share.';
          result_val := round((rand1 * rand3 + rand1 * (12-rand3))::numeric / ((rand1*12 + rand2*12)), 2) * (rand1+rand2);
          wrong1 := round((result_val + 100)::numeric, 2); wrong2 := round((result_val - 100)::numeric, 2); wrong3 := round((rand1+rand2) / 2::numeric, 2);
          oa := result_val::text; ob := wrong1::text; oc := wrong2::text; od := wrong3::text; ans := 'A';
          expl := 'A''s investment ratio calculation gives share = ' || result_val;

        WHEN 'numbers-boats-streams' THEN
          rand1 := 8 + floor(random() * 15)::int;
          rand2 := 2 + floor(random() * 6)::int;
          q_text := 'A boat''s speed in still water is ' || rand1 || ' km/hr and the stream speed is ' || rand2 || ' km/hr. Find the speed downstream.';
          result_val := rand1 + rand2;
          wrong1 := result_val + 3; wrong2 := rand1 - rand2; wrong3 := rand1;
          oa := result_val::text; ob := wrong1::text; oc := wrong2::text; od := wrong3::text; ans := 'A';
          expl := 'Downstream speed = Boat + Stream = ' || rand1 || ' + ' || rand2 || ' = ' || result_val;

        WHEN 'numbers-trains' THEN
          rand1 := 50 + floor(random() * 200)::int;
          rand2 := 20 + floor(random() * 80)::int;
          q_text := 'A train ' || rand1 || 'm long is running at ' || rand2 || ' km/hr. How much time will it take to cross a pole?';
          result_val := round((rand1 / (rand2 * 5.0/18))::numeric, 2);
          wrong1 := round((result_val + 2)::numeric, 2); wrong2 := round((result_val - 2)::numeric, 2); wrong3 := round((rand1 / rand2)::numeric, 2);
          oa := result_val::text; ob := wrong1::text; oc := wrong2::text; od := wrong3::text; ans := 'A';
          expl := 'Time = Length / Speed (m/s) = ' || rand1 || ' / ' || (rand2*5/18) || ' = ' || result_val || ' seconds';

        WHEN 'numbers-clocks' THEN
          rand1 := floor(random() * 12)::int + 1;
          rand2 := floor(random() * 60)::int;
          q_text := 'Find the angle between the hour hand and minute hand at ' || rand1 || ':' || lpad(rand2::text, 2, '0') || '.';
          result_val := abs(30 * rand1 - 5.5 * rand2);
          IF result_val > 180 THEN result_val := 360 - result_val; END IF;
          result_val := round(result_val, 2);
          wrong1 := round((result_val + 15)::numeric, 2); wrong2 := round((result_val - 15)::numeric, 2); wrong3 := round((result_val * 2)::numeric, 2);
          oa := result_val::text; ob := wrong1::text; oc := wrong2::text; od := wrong3::text; ans := 'A';
          expl := 'Angle = |30H - 5.5M| = |30*' || rand1 || ' - 5.5*' || rand2 || '| = ' || result_val || ' degrees';

        WHEN 'numbers-even-numbers' THEN
          rand1 := 2 + floor(random() * 50)::int * 2;
          q_text := 'The sum of first ' || rand1 || ' even natural numbers is?';
          result_val := rand1 * (rand1 + 1);
          wrong1 := result_val + 10; wrong2 := result_val - 10; wrong3 := rand1 * rand1;
          oa := result_val::text; ob := wrong1::text; oc := wrong2::text; od := wrong3::text; ans := 'A';
          expl := 'Sum of first n evens = n(n+1) = ' || rand1 || '*' || (rand1+1) || ' = ' || result_val;

        WHEN 'numbers-odd-numbers' THEN
          rand1 := 2 + floor(random() * 50)::int;
          q_text := 'The sum of first ' || rand1 || ' odd natural numbers is?';
          result_val := rand1 * rand1;
          wrong1 := result_val + 10; wrong2 := result_val - 10; wrong3 := rand1 * (rand1 + 1);
          oa := result_val::text; ob := wrong1::text; oc := wrong2::text; od := wrong3::text; ans := 'A';
          expl := 'Sum of first n odds = n^2 = ' || rand1 || '^2 = ' || result_val;

        WHEN 'numbers-divisibility-rules' THEN
          rand1 := 100 + floor(random() * 9000)::int;
          q_text := 'The number ' || rand1 || ' is divisible by which of the following?';
          IF rand1 % 6 = 0 THEN ans := 'A'; oa := '6'; ob := '7'; oc := '11'; od := '13';
          ELSIF rand1 % 9 = 0 THEN ans := 'A'; oa := '9'; ob := '7'; oc := '11'; od := '13';
          ELSIF rand1 % 11 = 0 THEN ans := 'A'; oa := '11'; ob := '7'; oc := '9'; od := '13';
          ELSE ans := 'A'; oa := '3'; ob := '7'; oc := '11'; od := '13'; IF rand1 % 3 != 0 THEN oa := '7'; IF rand1 % 7 != 0 THEN oa := 'None of these'; ans := 'A'; oa := 'None'; ob := '3'; oc := '7'; od := '11'; END IF; END IF;
          END IF;
          expl := 'Check divisibility rules for ' || rand1;
          q_text := q_text || ' (a) ' || oa || ' (b) ' || ob || ' (c) ' || oc || ' (d) ' || od;
          oa := oa; ob := ob; oc := oc; od := od;

        WHEN 'numbers-factors' THEN
          rand1 := 20 + floor(random() * 100)::int;
          q_text := 'Find the number of factors of ' || rand1 || '.';
          SELECT count(*)::int INTO result_val FROM generate_series(1, rand1) n WHERE rand1 % n = 0;
          wrong1 := result_val + 2; wrong2 := result_val - 1; wrong3 := result_val + 1;
          oa := result_val::text; ob := wrong1::text; oc := wrong2::text; od := wrong3::text; ans := 'A';
          expl := 'Number of factors of ' || rand1 || ' = ' || result_val;

        WHEN 'numbers-remainders' THEN
          rand1 := 100 + floor(random() * 900)::int;
          rand2 := 3 + floor(random() * 10)::int;
          q_text := 'What is the remainder when ' || rand1 || ' is divided by ' || rand2 || '?';
          result_val := rand1 % rand2;
          wrong1 := result_val + 1; wrong2 := result_val - 1; wrong3 := rand2 - 1;
          oa := result_val::text; ob := wrong1::text; oc := wrong2::text; od := wrong3::text; ans := 'A';
          expl := rand1 || ' mod ' || rand2 || ' = ' || result_val;

        WHEN 'numbers-cyclicity' THEN
          rand1 := 2 + floor(random() * 8)::int;
          rand2 := 10 + floor(random() * 90)::int;
          q_text := 'Find the unit digit of ' || rand1 || '^' || rand2 || '.';
          result_val := power(rand1::numeric, rand2) % 10;
          wrong1 := result_val + 1; wrong2 := result_val - 1; wrong3 := result_val + 2;
          oa := result_val::text; ob := wrong1::text; oc := wrong2::text; od := wrong3::text; ans := 'A';
          expl := 'Using cyclicity of ' || rand1 || ', unit digit of ' || rand1 || '^' || rand2 || ' = ' || result_val;

        WHEN 'numbers-quadratic-equations' THEN
          rand1 := 1 + floor(random() * 5)::int;
          rand2 := 1 + floor(random() * 5)::int;
          q_text := 'Find the roots of x^2 - ' || (rand1+rand2) || 'x + ' || (rand1*rand2) || ' = 0.';
          oa := rand1::text || ' and ' || rand2::text; ob := (rand1+1)::text || ' and ' || (rand2-1)::text; oc := (rand1-1)::text || ' and ' || (rand2+1)::text; od := (rand1*2)::text || ' and ' || (rand2/2)::text; ans := 'A';
          expl := 'Sum = ' || (rand1+rand2) || ', Product = ' || (rand1*rand2) || '. Roots are ' || rand1 || ' and ' || rand2;

        WHEN 'numbers-logarithms' THEN
          rand1 := 2 + floor(random() * 8)::int;
          rand2 := 2 + floor(random() * 5)::int;
          q_text := 'Find the value of log_' || rand1 || '(' || power(rand1::numeric, rand2)::text || ').';
          result_val := rand2;
          wrong1 := result_val + 1; wrong2 := result_val - 1; wrong3 := result_val * 2;
          oa := result_val::text; ob := wrong1::text; oc := wrong2::text; od := wrong3::text; ans := 'A';
          expl := 'log_b(b^n) = n. So log_' || rand1 || '(' || power(rand1::numeric, rand2) || ') = ' || rand2;

        WHEN 'numbers-mixtures' THEN
          rand1 := 50 + floor(random() * 50)::int;
          rand2 := 10 + floor(random() * 30)::int;
          q_text := 'In what ratio must a ' || rand1 || '% acid solution be mixed with a ' || rand2 || '% acid solution to get a ' || ((rand1+rand2)/2)::int || '% solution?';
          result_val := abs((rand1 - (rand1+rand2)/2.0));
          wrong1 := result_val + 1; wrong2 := result_val - 1; wrong3 := result_val * 2;
          oa := result_val::text || ':1'; ob := wrong1::text || ':1'; oc := wrong2::text || ':1'; od := wrong3::text || ':1'; ans := 'A';
          expl := 'Using alligation: ratio = ' || result_val || ':1';

        WHEN 'numbers-time-work' THEN
          rand1 := 4 + floor(random() * 20)::int;
          rand2 := 6 + floor(random() * 20)::int;
          q_text := 'A can do a piece of work in ' || rand1 || ' days and B in ' || rand2 || ' days. How many days will they take together?';
          result_val := round((rand1 * rand2)::numeric / (rand1 + rand2), 2);
          wrong1 := round((result_val + 2)::numeric, 2); wrong2 := round((result_val - 2)::numeric, 2); wrong3 := round(((rand1 + rand2) / 2)::numeric, 2);
          oa := result_val::text; ob := wrong1::text; oc := wrong2::text; od := wrong3::text; ans := 'A';
          expl := '1/A + 1/B = 1/' || rand1 || ' + 1/' || rand2 || '. Together = ' || (rand1*rand2) || '/' || (rand1+rand2) || ' = ' || result_val;

        ELSE
          rand1 := 10 + floor(random() * 990)::int;
          rand2 := 10 + floor(random() * 990)::int;
          q_text := 'If the sum of two numbers is ' || (rand1+rand2) || ' and their difference is ' || abs(rand1-rand2) || ', find the larger number.';
          result_val := greatest(rand1, rand2);
          wrong1 := result_val + 5; wrong2 := result_val - 5; wrong3 := least(rand1, rand2);
          oa := result_val::text; ob := wrong1::text; oc := wrong2::text; od := wrong3::text; ans := 'A';
          expl := 'Larger = (Sum + Difference)/2 = ' || result_val;
      END CASE;

      -- Shuffle the correct answer position
      CASE floor(random() * 4)::int
        WHEN 1 THEN temp_a := oa; oa := ob; ob := temp_a; ans := 'B';
        WHEN 2 THEN temp_a := oa; oa := oc; oc := temp_a; ans := 'C';
        WHEN 3 THEN temp_a := oa; oa := od; od := temp_a; ans := 'D';
        ELSE ans := 'A';
      END CASE;

      INSERT INTO questions (village_id, question_text, question_type, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty, time_limit_seconds, xp_reward, coin_reward, is_active, tags)
      VALUES (v_id, q_text, 'mcq', oa, ob, oc, od, ans, expl, diff, 60, diff * 10, diff * 5, true, ARRAY[v_name, 'medium-hard']);

      generated := generated + 1;
    END LOOP;
  END LOOP;
  RETURN generated;
END;
$$ LANGUAGE plpgsql;
