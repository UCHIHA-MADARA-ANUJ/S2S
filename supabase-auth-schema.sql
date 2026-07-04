-- SKILLVERSE — Auth tables. Run this in Supabase SQL Editor.
-- (Run AFTER the original supabase-schema.sql)

-- ===========================================
-- 1. PROFILES (linked to auth.users)
-- ===========================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  grade INT,
  school TEXT,
  city TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: auto-create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===========================================
-- 2. UPDATE survey_responses to link to users
-- ===========================================
ALTER TABLE survey_responses
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_survey_user_id ON survey_responses(user_id);

-- ===========================================
-- 3. UPDATE pledge_signers to link to users
-- ===========================================
ALTER TABLE pledge_signers
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- ===========================================
-- 4. RLS for profiles
-- ===========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_read_own" ON profiles;
CREATE POLICY "profiles_read_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_read_aggregated" ON profiles;
CREATE POLICY "profiles_read_aggregated" ON profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ===========================================
-- 5. UPDATE survey_responses RLS for user-specific
-- ===========================================
DROP POLICY IF EXISTS "p_read_own_surveys" ON survey_responses;
CREATE POLICY "p_read_own_surveys" ON survey_responses
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "p_update_own_survey" ON survey_responses;
CREATE POLICY "p_update_own_survey" ON survey_responses
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "p_delete_own_survey" ON survey_responses;
CREATE POLICY "p_delete_own_survey" ON survey_responses
  FOR DELETE USING (auth.uid() = user_id);
