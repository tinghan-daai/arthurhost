-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Posts table
create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  content text,
  excerpt text,
  cover_image text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  author_id uuid references auth.users(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tags table
create table public.tags (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  slug text not null unique,
  created_at timestamptz default now()
);

-- Post-Tag join table
create table public.post_tags (
  post_id uuid references public.posts(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now()
);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger posts_updated_at
  before update on public.posts
  for each row execute procedure public.handle_updated_at();

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security
alter table public.posts enable row level security;
alter table public.tags enable row level security;
alter table public.post_tags enable row level security;
alter table public.profiles enable row level security;

-- Public can read published posts
create policy "Public read published posts" on public.posts
  for select using (status = 'published');

-- Authenticated users can manage posts
create policy "Authenticated users manage posts" on public.posts
  for all using (auth.role() = 'authenticated');

-- Public can read tags
create policy "Public read tags" on public.tags
  for select using (true);

-- Authenticated users can manage tags
create policy "Authenticated users manage tags" on public.tags
  for all using (auth.role() = 'authenticated');

-- Public can read post_tags
create policy "Public read post_tags" on public.post_tags
  for select using (true);

-- Authenticated users can manage post_tags
create policy "Authenticated users manage post_tags" on public.post_tags
  for all using (auth.role() = 'authenticated');

-- Public can read profiles
create policy "Public read profiles" on public.profiles
  for select using (true);

-- Users can update own profile
create policy "Users update own profile" on public.profiles
  for update using (auth.uid() = id);
