-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)

create table if not exists posts (
  id          uuid        primary key default gen_random_uuid(),
  text        text        not null check (char_length(text) > 0 and char_length(text) <= 5000),
  feelings    jsonb       not null default '[]'::jsonb,
  created_at  timestamptz not null default now()
);

-- Row Level Security: public reads, no direct writes (all writes go through our server with the service key)
alter table posts enable row level security;

create policy "Public read access"
  on posts for select
  to anon
  using (true);
