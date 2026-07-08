/*
# Friends System + Multiplayer Matches + Unique IDs

## Changes Overview
1. Add `unique_id` column to `user_profiles` — a short human-shareable code for adding friends
2. New table `friend_requests` — pending friend requests between users
3. New table `friends` — confirmed friendships (bidirectional)
4. New table `mp_matches` — multiplayer match records with HP, difficulty, scores
5. RLS policies for all new tables (owner-scoped)
6. Add `multiplayer_wins`, `multiplayer_losses`, `multiplayer_xp` columns to user_profiles
*/

-- Add unique_id and multiplayer stats to user_profiles
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='unique_id') THEN
    ALTER TABLE user_profiles ADD COLUMN unique_id text UNIQUE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='multiplayer_wins') THEN
    ALTER TABLE user_profiles ADD COLUMN multiplayer_wins integer DEFAULT 0;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='multiplayer_losses') THEN
    ALTER TABLE user_profiles ADD COLUMN multiplayer_losses integer DEFAULT 0;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='multiplayer_xp') THEN
    ALTER TABLE user_profiles ADD COLUMN multiplayer_xp integer DEFAULT 0;
  END IF;
END $$;

-- Generate unique_id for existing profiles that don't have one
UPDATE user_profiles
SET unique_id = upper(substr(encode(gen_random_bytes(4), 'hex'), 1, 8))
WHERE unique_id IS NULL;

-- Create friend_requests table
CREATE TABLE IF NOT EXISTS friend_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_friend_requests" ON friend_requests;
CREATE POLICY "select_own_friend_requests" ON friend_requests
  FOR SELECT TO authenticated USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "insert_own_friend_requests" ON friend_requests;
CREATE POLICY "insert_own_friend_requests" ON friend_requests
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "update_own_friend_requests" ON friend_requests;
CREATE POLICY "update_own_friend_requests" ON friend_requests
  FOR UPDATE TO authenticated USING (auth.uid() = receiver_id) WITH CHECK (auth.uid() = receiver_id);

DROP POLICY IF EXISTS "delete_own_friend_requests" ON friend_requests;
CREATE POLICY "delete_own_friend_requests" ON friend_requests
  FOR DELETE TO authenticated USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Create friends table
CREATE TABLE IF NOT EXISTS friends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

ALTER TABLE friends ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_friends" ON friends;
CREATE POLICY "select_own_friends" ON friends
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR auth.uid() = friend_id);

DROP POLICY IF EXISTS "insert_own_friends" ON friends;
CREATE POLICY "insert_own_friends" ON friends
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_friends" ON friends;
CREATE POLICY "delete_own_friends" ON friends
  FOR DELETE TO authenticated USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Create mp_matches table
CREATE TABLE IF NOT EXISTS mp_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player1_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  player2_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  mode text NOT NULL CHECK (mode IN ('ai', 'friend')),
  difficulty text NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'advanced')),
  kingdom_slug text,
  village_ids uuid[],
  player1_hp integer DEFAULT 200,
  player2_hp integer DEFAULT 200,
  player1_score integer DEFAULT 0,
  player2_score integer DEFAULT 0,
  winner_id uuid REFERENCES auth.users(id),
  questions_data jsonb DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE mp_matches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_mp_matches" ON mp_matches;
CREATE POLICY "select_own_mp_matches" ON mp_matches
  FOR SELECT TO authenticated USING (auth.uid() = player1_id OR auth.uid() = player2_id);

DROP POLICY IF EXISTS "insert_own_mp_matches" ON mp_matches;
CREATE POLICY "insert_own_mp_matches" ON mp_matches
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = player1_id);

DROP POLICY IF EXISTS "update_own_mp_matches" ON mp_matches;
CREATE POLICY "update_own_mp_matches" ON mp_matches
  FOR UPDATE TO authenticated USING (auth.uid() = player1_id OR auth.uid() = player2_id) WITH CHECK (auth.uid() = player1_id OR auth.uid() = player2_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_friend_requests_receiver ON friend_requests(receiver_id, status);
CREATE INDEX IF NOT EXISTS idx_friend_requests_sender ON friend_requests(sender_id, status);
CREATE INDEX IF NOT EXISTS idx_friends_user ON friends(user_id);
CREATE INDEX IF NOT EXISTS idx_friends_friend ON friends(friend_id);
CREATE INDEX IF NOT EXISTS idx_mp_matches_p1 ON mp_matches(player1_id);
CREATE INDEX IF NOT EXISTS idx_mp_matches_p2 ON mp_matches(player2_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_unique_id ON user_profiles(unique_id);
