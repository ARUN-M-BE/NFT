-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES: Extended user data
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  full_name text,
  avatar_url text,
  bio text,
  website text,
  twitter_handle text,
  total_profit numeric default 0,
  win_rate numeric default 0,
  total_trades integer default 0,
  followers_count integer default 0,
  following_count integer default 0,
  is_public boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies for Profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( is_public = true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- TRIGGER: Create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, username)
  values (new.id, new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- SOCIAL: Follows/Copy Trading
create table public.follows (
  follower_id uuid references public.profiles(id) not null,
  following_id uuid references public.profiles(id) not null,
  is_copying boolean default false,
  copy_amount numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (follower_id, following_id)
);

alter table public.follows enable row level security;

create policy "Any logged in user can view follows"
  on public.follows for select
  using ( auth.role() = 'authenticated' );

create policy "Users can follow others"
  on public.follows for insert
  with check ( auth.uid() = follower_id );

create policy "Users can unfollow"
  on public.follows for delete
  using ( auth.uid() = follower_id );

-- AI INSIGHTS: Store predictions
create table public.ai_predictions (
  id uuid default uuid_generate_v4() primary key,
  symbol text not null,
  prediction_type text check (prediction_type in ('price_24h', 'sentiment', 'technical')),
  direction text check (direction in ('bullish', 'bearish', 'neutral')),
  confidence_score numeric,
  target_price numeric,
  reasoning text,
  model_version text default 'gemini-pro',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  valid_until timestamp with time zone
);

alter table public.ai_predictions enable row level security;

create policy "Anyone can read predictions"
  on public.ai_predictions for select
  using ( true );

-- LEADERBOARD VIEW
create or replace view public.leaderboard as
select 
  p.id,
  p.username,
  p.full_name,
  p.avatar_url,
  p.total_profit,
  p.win_rate,
  p.total_trades,
  p.followers_count
from public.profiles p
where p.total_trades > 0 and p.is_public = true
order by p.total_profit desc;
