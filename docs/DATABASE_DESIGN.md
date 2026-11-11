# CHESSMIND ACADEMY — DATABASE DESIGN

**Database Engine:** PostgreSQL 15+ (Supabase)  
**Security Model:** Row Level Security (RLS) on all user-owned records

---

## 1. Normalized Relational Schema

```sql
-- 1. Profiles & Student Identities
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  chess_experience TEXT CHECK (chess_experience IN ('zero', 'casual', 'intermediate', 'advanced', 'master')),
  estimated_rating INTEGER DEFAULT 800,
  preferred_pace TEXT DEFAULT 'balanced',
  daily_goal_minutes INTEGER DEFAULT 20,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 1,
  longest_streak INTEGER DEFAULT 1,
  last_active_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Curriculum Hierarchy
CREATE TABLE public.stages (
  id TEXT PRIMARY KEY, -- e.g. 'stage-1-beginner'
  order_index INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_elo_min INTEGER,
  target_elo_max INTEGER
);

CREATE TABLE public.courses (
  id TEXT PRIMARY KEY,
  stage_id TEXT REFERENCES public.stages(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  total_lessons INTEGER DEFAULT 0
);

CREATE TABLE public.lessons (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  learning_objective TEXT NOT NULL,
  initial_fen TEXT NOT NULL,
  content JSONB NOT NULL, -- Steps, explanation, exercises
  quiz JSONB,            -- Knowledge check multiple-choice questions
  xp_reward INTEGER DEFAULT 50
);

-- 3. Student Progress & Attempts
CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  score_percentage INTEGER DEFAULT 0,
  mistakes_count INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- 4. Weakness Tracking & Skill Radar
CREATE TABLE public.student_skill_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  tactics_forks INTEGER DEFAULT 50,
  tactics_pins INTEGER DEFAULT 50,
  tactics_skewers INTEGER DEFAULT 50,
  tactics_discovered INTEGER DEFAULT 50,
  opening_principles INTEGER DEFAULT 50,
  endgame_technique INTEGER DEFAULT 50,
  king_safety INTEGER DEFAULT 50,
  calculation_depth INTEGER DEFAULT 50,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Saved Games & Analysis
CREATE TABLE public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  opponent_type TEXT NOT NULL, -- 'ai_coach', 'engine_level_1'..'level_5'
  player_color TEXT NOT NULL CHECK (player_color IN ('white', 'black')),
  result TEXT NOT NULL, -- '1-0', '0-1', '1/2-1/2', '*'
  termination TEXT,     -- 'checkmate', 'resignation', 'draw_agreement', 'time_out'
  pgn TEXT NOT NULL,
  fen_final TEXT NOT NULL,
  move_count INTEGER DEFAULT 0,
  accuracy_score NUMERIC(5, 2),
  analysis_summary JSONB,
  played_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Puzzles & Attempts
CREATE TABLE public.puzzle_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  puzzle_id TEXT NOT NULL,
  theme TEXT NOT NULL,
  solved BOOLEAN NOT NULL,
  hints_used INTEGER DEFAULT 0,
  time_seconds INTEGER DEFAULT 0,
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Achievements
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);
```

---

## 2. Row Level Security Policies

```sql
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skill_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.puzzle_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Read/Write own data
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users manage own progress" ON public.lesson_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own skill profile" ON public.student_skill_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own games" ON public.games FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users record puzzle attempts" ON public.puzzle_attempts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users view own achievements" ON public.user_achievements FOR ALL USING (auth.uid() = user_id);
```
