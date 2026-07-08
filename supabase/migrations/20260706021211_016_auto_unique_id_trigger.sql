/*
# Auto-generate unique_id on profile creation

Creates a trigger that generates an 8-char alphanumeric unique_id
whenever a new user_profiles row is inserted without one.
*/

CREATE OR REPLACE FUNCTION generate_unique_id()
RETURNS trigger AS $$
BEGIN
  IF NEW.unique_id IS NULL THEN
    NEW.unique_id := upper(substr(encode(gen_random_bytes(4), 'hex'), 1, 8));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_generate_unique_id ON user_profiles;
CREATE TRIGGER trg_generate_unique_id
  BEFORE INSERT ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION generate_unique_id();
