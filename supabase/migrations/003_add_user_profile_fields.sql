-- Adds username + email to public.profiles, restricts signups to
-- @calpoly.edu addresses, and keeps profiles.email in sync with auth.users.

-- Add the columns

alter table public.profiles
  add column if not exists username text,
  add column if not exists email text;

-- Create profiles for users who already exist but have none

insert into public.profiles (user_id, display_name, username, email)
select
  u.id,
  coalesce(
    nullif(u.raw_user_meta_data ->> 'full_name', ''),
    split_part(u.email, '@', 1)
  ),
  lower(split_part(u.email, '@', 1)),
  lower(u.email)
from auth.users u
where u.email is not null
  and not exists (
    select 1 from public.profiles p where p.user_id = u.id
  );

-- Backfill username/email for profiles that already existed

update public.profiles p
set
  username = coalesce(p.username, lower(split_part(u.email, '@', 1))),
  email    = coalesce(p.email, lower(u.email))
from auth.users u
where u.id = p.user_id
  and (p.username is null or p.email is null);

-- Fail early with a readable message if existing rows would break

do $$
declare
  bad_count integer;
begin
  select count(*) into bad_count
  from public.profiles
  where username is null
     or email is null
     or email !~* '^[a-z0-9._%+-]+@calpoly\.edu$';

  if bad_count > 0 then
    raise exception
      '% profile row(s) have a missing username/email or a non-calpoly.edu email; fix or delete them before re-running.', bad_count;
  end if;
end;
$$;

-- Constraints and indexes

alter table public.profiles
  alter column username set not null,
  alter column email set not null;

alter table public.profiles
  drop constraint if exists profiles_email_must_be_calpoly;

alter table public.profiles
  add constraint profiles_email_must_be_calpoly
  check (email ~* '^[a-z0-9._%+-]+@calpoly\.edu$');

-- Case-insensitive uniqueness
create unique index if not exists profiles_username_unique
  on public.profiles (lower(username));

create unique index if not exists profiles_email_unique
  on public.profiles (lower(email));

-- New-user trigger: reject non-Cal Poly emails, then create the profile

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email is null or new.email !~* '^[a-z0-9._%+-]+@calpoly\.edu$' then
    raise exception 'Only @calpoly.edu email addresses can sign up.';
  end if;

  insert into public.profiles (user_id, display_name, username, email)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      split_part(new.email, '@', 1)
    ),
    lower(split_part(new.email, '@', 1)),
    lower(new.email)
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Email-change trigger: same domain rule, keep profiles.email in sync

create or replace function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email is distinct from old.email then
    if new.email is null or new.email !~* '^[a-z0-9._%+-]+@calpoly\.edu$' then
      raise exception 'Only @calpoly.edu email addresses are allowed.';
    end if;

    update public.profiles
    set email = lower(new.email)
    where user_id = new.id;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_email_changed on auth.users;

create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row execute procedure public.handle_user_email_change();