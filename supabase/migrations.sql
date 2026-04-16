-- ═══════════════════════════════════════════
-- MINDTRADE — Migrations
-- À exécuter dans l'éditeur SQL de Supabase
-- ═══════════════════════════════════════════

-- 1. Ajouter sommeil dans checkins + recalculer score
ALTER TABLE public.checkins ADD COLUMN IF NOT EXISTS sommeil INT CHECK (sommeil BETWEEN 1 AND 5);
ALTER TABLE public.checkins DROP COLUMN IF EXISTS score;
ALTER TABLE public.checkins ADD COLUMN score INT GENERATED ALWAYS AS (
  round(((COALESCE(sommeil, 3) + energie + focus + (6 - stress) + confiance)::numeric / 25) * 100)
) STORED;

-- 2. Ajouter tags dans journal_entries
ALTER TABLE public.journal_entries ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- 4. Ajouter quiz_answers dans journal_entries
ALTER TABLE public.journal_entries ADD COLUMN IF NOT EXISTS quiz_answers JSONB;

-- 5. Taille du compte + devise dans profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS account_size NUMERIC(12,2);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';

-- 3. Table confluences
CREATE TABLE IF NOT EXISTS public.confluences (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  titre       text not null,
  description text,
  type        text not null check (type in ('required', 'bonus')),
  created_at  timestamptz default now()
);
ALTER TABLE public.confluences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own confluences" ON public.confluences;
CREATE POLICY "Users manage own confluences" ON public.confluences
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
