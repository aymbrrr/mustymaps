-- ============================================================
-- Musty's Map — Initial Schema
-- Crowd levels, wait times, and free food at Cal Poly.
-- ============================================================

-- ─── Tunables ────────────────────────────────────────────────────────────────
-- Both windows are defined here and nowhere else. Change them in one place.

-- How long a report counts toward a location's live status before it decays.
create or replace function status_window() returns interval
  language sql immutable as $$ select interval '90 minutes' $$;

-- How long a user must wait before reporting the same location again.
create or replace function report_cooldown() returns interval
  language sql immutable as $$ select interval '10 minutes' $$;

-- ─── Locations ───────────────────────────────────────────────────────────────
-- Curated list. Not user-submitted.

create table locations (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  category    text not null check (category in ('dining', 'study', 'recreation', 'other')),
  lat         numeric(10,7) not null,
  lng         numeric(10,7) not null,
  building    text,
  -- Optional opening hours, e.g. [{"days":[1,2,3,4,5],"open":"07:00","close":"20:00"}]
  hours       jsonb default '[]',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index locations_category on locations (category);
create index locations_coords on locations (lat, lng);

-- ─── Reports ─────────────────────────────────────────────────────────────────
-- One self-report of conditions at a location, at a point in time.
-- Rows are never updated. Staleness is handled by status_window(), not deletion.

create table reports (
  id            uuid primary key default gen_random_uuid(),
  location_id   uuid not null references locations(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,
  busyness      smallint not null check (busyness between 1 and 3),  -- 1 quiet, 2 moderate, 3 packed
  wait_minutes  smallint check (wait_minutes between 0 and 120),
  open_seats    text check (open_seats in ('none', 'few', 'many')),
  free_food     boolean not null default false,
  note          text check (char_length(note) <= 280),
  is_flagged    boolean not null default false,
  created_at    timestamptz not null default now()
);

-- Drives every live-status query. Keep this index.
create index reports_location_recent on reports (location_id, created_at desc);
create index reports_user_location on reports (user_id, location_id, created_at desc);

-- ─── Profiles ────────────────────────────────────────────────────────────────

create table profiles (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid unique not null references auth.users(id) on delete cascade,
  display_name  text not null,
  created_at    timestamptz default now()
);

-- ─── Report cooldown ─────────────────────────────────────────────────────────
-- Enforced in the database so it cannot be bypassed by a modified client.

create or replace function enforce_report_cooldown()
returns trigger
language plpgsql
as $$
declare
  last_at timestamptz;
begin
  select max(created_at) into last_at
  from reports
  where location_id = new.location_id
    and user_id = new.user_id;

  if last_at is not null and last_at > now() - report_cooldown() then
    raise exception 'You already reported this spot recently. Try again shortly.'
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

create trigger reports_cooldown
  before insert on reports
  for each row execute function enforce_report_cooldown();

-- ─── Live status view ────────────────────────────────────────────────────────
-- This is what the map reads. Every location appears, even with no fresh
-- reports — in that case report_count is 0 and the client shows "unknown".
--
-- busyness/wait are averaged across the window so one troll can't flip a pin.
-- open_seats takes the most recent value (averaging a category is meaningless).
-- free_food is true if ANY fresh report saw food.

create view location_live_status
with (security_invoker = on)
as
select
  l.id                            as location_id,
  l.slug,
  l.name,
  l.category,
  l.lat,
  l.lng,
  l.building,
  l.hours,
  agg.busyness,
  agg.wait_minutes,
  seats.open_seats,
  coalesce(agg.free_food, false)  as free_food,
  coalesce(agg.report_count, 0)   as report_count,
  agg.last_report_at
from locations l
left join lateral (
  select
    round(avg(busyness))::smallint     as busyness,
    round(avg(wait_minutes))::smallint as wait_minutes,
    bool_or(free_food)                 as free_food,
    count(*)                           as report_count,
    max(created_at)                    as last_report_at
  from reports r
  where r.location_id = l.id
    and r.is_flagged = false
    and r.created_at > now() - status_window()
) agg on true
left join lateral (
  select r.open_seats
  from reports r
  where r.location_id = l.id
    and r.is_flagged = false
    and r.open_seats is not null
    and r.created_at > now() - status_window()
  order by r.created_at desc
  limit 1
) seats on true;

-- ─── Row Level Security ──────────────────────────────────────────────────────

alter table locations enable row level security;
create policy locations_read on locations
  for select using (true);

alter table reports enable row level security;
create policy reports_read on reports
  for select using (is_flagged = false);
create policy reports_insert on reports
  for insert with check (auth.uid() = user_id);

alter table profiles enable row level security;
create policy profiles_owner on profiles
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select on location_live_status to anon, authenticated;
