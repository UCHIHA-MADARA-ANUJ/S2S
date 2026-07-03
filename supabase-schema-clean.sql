-- SKILLVERSE — Clean schema (safe to re-run)

CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  source TEXT DEFAULT 'website',
  fingerprint TEXT,
  ip_hash TEXT,
  age INT, gender TEXT, city TEXT, grade INT,
  daily_screen_time FLOAT, primary_device TEXT,
  learning_percentage INT, entertainment_percentage INT, social_percentage INT,
  platforms_used TEXT[], most_helpful_platform TEXT,
  skills_learned TEXT[], creativity_rating INT, collaboration_rating INT,
  positive_impact TEXT, hobby_to_skill BOOLEAN, hobby_to_skill_detail TEXT,
  next_skill_to_learn TEXT, uses_ai_tools BOOLEAN, ai_tools_used TEXT[], ai_learning_rating INT
);

CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW(),
  role TEXT NOT NULL, message TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pledge_signers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, city TEXT, signed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Only enable RLS if not already enabled
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='survey_responses' AND rowsecurity=true) THEN
    ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='chat_history' AND rowsecurity=true) THEN
    ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='pledge_signers' AND rowsecurity=true) THEN
    ALTER TABLE pledge_signers ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Policies (idempotent)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='public_read_survey') THEN
    CREATE POLICY "public_read_survey" ON survey_responses FOR SELECT USING (true);
    CREATE POLICY "public_insert_survey" ON survey_responses FOR INSERT WITH CHECK (true);
    CREATE POLICY "public_read_chat" ON chat_history FOR SELECT USING (true);
    CREATE POLICY "public_insert_chat" ON chat_history FOR INSERT WITH CHECK (true);
    CREATE POLICY "public_read_pledge" ON pledge_signers FOR SELECT USING (true);
    CREATE POLICY "public_insert_pledge" ON pledge_signers FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Realtime (safe - won't error if already added)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname='supabase_realtime' AND tablename='survey_responses'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE survey_responses;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname='supabase_realtime' AND tablename='pledge_signers'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE pledge_signers;
  END IF;
END $$;

-- Indexes (safe to re-run)
CREATE INDEX IF NOT EXISTS idx_survey_created ON survey_responses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_survey_ip ON survey_responses(ip_hash);
CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_history(session_id);
