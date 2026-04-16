-- ═══════════════════════════════════════════
-- MINDTRADE — Schéma Supabase
-- À exécuter dans l'éditeur SQL de Supabase
-- ═══════════════════════════════════════════

-- Extensions
create extension if not exists "uuid-ossp";

-- ─── PROFILES ───────────────────────────────
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  market       text default 'Forex',
  avatar_url   text,
  created_at   timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can read own profile"   on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, split_part(new.email, '@', 1));
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── CHECKINS ───────────────────────────────
create table if not exists public.checkins (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  date        date not null default current_date,
  energie     int not null check (energie between 1 and 5),
  focus       int not null check (focus between 1 and 5),
  stress      int not null check (stress between 1 and 5),
  confiance   int not null check (confiance between 1 and 5),
  score       int generated always as (
    round(((energie + focus + (6 - stress) + confiance)::numeric / 20) * 100)
  ) stored,
  created_at  timestamptz default now(),
  unique (user_id, date)
);
alter table public.checkins enable row level security;
create policy "Users manage own checkins" on public.checkins
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─── TRADES ─────────────────────────────────
create table if not exists public.trades (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  date             date not null default current_date,
  pair             text not null,
  direction        text not null check (direction in ('LONG', 'SHORT')),
  pnl              numeric(10,2) not null,
  mental_score     int check (mental_score between 0 and 100),
  emotion          text default 'Calme',
  respected_rules  boolean default true,
  notes            text,
  created_at       timestamptz default now()
);
alter table public.trades enable row level security;
create policy "Users manage own trades" on public.trades
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─── JOURNAL ENTRIES ────────────────────────
create table if not exists public.journal_entries (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  date           date not null default current_date,
  mood           text,
  session_rating int check (session_rating between 1 and 5),
  good           text,
  bad            text,
  next_actions   text,
  created_at     timestamptz default now(),
  unique (user_id, date)
);
alter table public.journal_entries enable row level security;
create policy "Users manage own journal" on public.journal_entries
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─── SUBSCRIPTIONS ──────────────────────────
create table if not exists public.subscriptions (
  id                 uuid primary key default uuid_generate_v4(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  plan               text not null,
  status             text not null default 'active',
  stripe_session_id  text,
  stripe_customer_id text,
  activated_at       timestamptz default now(),
  cancelled_at       timestamptz,
  unique (user_id)
);
alter table public.subscriptions enable row level security;
create policy "Users read own subscription" on public.subscriptions
  for select using (auth.uid() = user_id);

-- ─── LEADS ──────────────────────────────────
create table if not exists public.leads (
  id         uuid primary key default uuid_generate_v4(),
  email      text unique not null,
  source     text,
  created_at timestamptz default now()
);
-- leads: accessible uniquement en service role (pas de RLS public)
