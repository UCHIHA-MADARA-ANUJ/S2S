-- SKILLVERSE — Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  source TEXT DEFAULT 'website',
  fingerprint TEXT,
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

ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE pledge_signers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "p_read_s" ON survey_responses FOR SELECT USING (true);
CREATE POLICY "p_ins_s" ON survey_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "p_read_c" ON chat_history FOR SELECT USING (true);
CREATE POLICY "p_ins_c" ON chat_history FOR INSERT WITH CHECK (true);
CREATE POLICY "p_read_p" ON pledge_signers FOR SELECT USING (true);
CREATE POLICY "p_ins_p" ON pledge_signers FOR INSERT WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE survey_responses;
ALTER PUBLICATION supabase_realtime ADD TABLE pledge_signers;

-- Add ip_hash column if not exists
ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS ip_hash TEXT;
