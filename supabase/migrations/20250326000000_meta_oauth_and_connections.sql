-- OAuth state for secure Meta connect (POST /meta-auth start → GET callback)
create table if not exists public.meta_oauth_states (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  consumed_at timestamptz
);

create index if not exists meta_oauth_states_created_at_idx on public.meta_oauth_states (created_at desc);

alter table public.meta_oauth_states enable row level security;

-- Stored Meta Marketing API token (Edge Functions use service role)
create table if not exists public.ad_connections (
  user_id uuid not null references auth.users (id) on delete cascade,
  platform text not null default 'meta',
  meta_user_id text,
  access_token text not null,
  token_expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, platform)
);

create index if not exists ad_connections_platform_idx on public.ad_connections (platform);

alter table public.ad_connections enable row level security;
