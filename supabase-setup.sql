-- ==============================
-- 推し活スケジュール帳 DB Setup
-- ==============================

-- 1. プロフィール（推し）
create table if not exists oshis (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  oshi_type text default 'individual',
  image text,
  images jsonb default '[]',
  birthday text,
  show_birthday boolean default true,
  genre text not null,
  "group" text,
  members text,
  sns_links jsonb default '[]',
  memo text default '',
  theme_color text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. イベント
create table if not exists events (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  date text not null,
  start_time text,
  end_time text,
  category text not null,
  oshi_id text,
  location text,
  url text,
  memo text default '',
  is_all_day boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. グッズ
create table if not exists goods (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  image text,
  category text not null,
  price integer,
  purchase_date text,
  oshi_id text,
  memo text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. 出費
create table if not exists expenses (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount integer not null,
  date text not null,
  category text not null,
  oshi_id text,
  goods_id text,
  memo text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. ユーザー設定
create table if not exists user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  theme_color text default '#ec4899',
  design_theme text default 'default',
  monthly_budget integer,
  settings jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ==============================
-- RLS ポリシー（自分のデータのみアクセス可）
-- ==============================

alter table oshis enable row level security;
alter table events enable row level security;
alter table goods enable row level security;
alter table expenses enable row level security;
alter table user_settings enable row level security;

-- oshis
create policy "Users can view own oshis" on oshis for select using (auth.uid() = user_id);
create policy "Users can insert own oshis" on oshis for insert with check (auth.uid() = user_id);
create policy "Users can update own oshis" on oshis for update using (auth.uid() = user_id);
create policy "Users can delete own oshis" on oshis for delete using (auth.uid() = user_id);

-- events
create policy "Users can view own events" on events for select using (auth.uid() = user_id);
create policy "Users can insert own events" on events for insert with check (auth.uid() = user_id);
create policy "Users can update own events" on events for update using (auth.uid() = user_id);
create policy "Users can delete own events" on events for delete using (auth.uid() = user_id);

-- goods
create policy "Users can view own goods" on goods for select using (auth.uid() = user_id);
create policy "Users can insert own goods" on goods for insert with check (auth.uid() = user_id);
create policy "Users can update own goods" on goods for update using (auth.uid() = user_id);
create policy "Users can delete own goods" on goods for delete using (auth.uid() = user_id);

-- expenses
create policy "Users can view own expenses" on expenses for select using (auth.uid() = user_id);
create policy "Users can insert own expenses" on expenses for insert with check (auth.uid() = user_id);
create policy "Users can update own expenses" on expenses for update using (auth.uid() = user_id);
create policy "Users can delete own expenses" on expenses for delete using (auth.uid() = user_id);

-- user_settings
create policy "Users can view own settings" on user_settings for select using (auth.uid() = user_id);
create policy "Users can insert own settings" on user_settings for insert with check (auth.uid() = user_id);
create policy "Users can update own settings" on user_settings for update using (auth.uid() = user_id);
