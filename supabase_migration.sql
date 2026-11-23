-- ====================================================================
-- MFC Football Club — Supabase Database Migration & Content Management
-- Multi-role editing workflow, versioning, audit log, and RLS policies.
-- ====================================================================

-- 1. Create Role Enums
do $$ begin
  create type user_role_type as enum (
    'super_admin',  -- Club owner (unrestricted access)
    'admin',        -- Committee (can publish content, approve photos, read messages)
    'coach',        -- Coaches (edit own profile, draft achievements)
    'editor',       -- Media team (draft news, draft gallery photos)
    'volunteer'     -- Volunteers (upload draft photos only)
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  alter type user_role_type add value if not exists 'member';
exception
  when duplicate_object then null;
end $$;

do $$ begin
  alter type user_role_type add value if not exists 'content_editor';
exception
  when duplicate_object then null;
end $$;

-- 2. User Roles Table
create table if not exists user_roles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  role        user_role_type not null default 'volunteer',
  coach_id    text, -- Optional reference if role is 'coach'
  email       text,
  full_name   text,
  phone       text,
  created_at  timestamptz not null default now(),
  unique (user_id, role)
);

-- Ensure columns exist if table was already created
alter table user_roles add column if not exists email text;
alter table user_roles add column if not exists full_name text;
alter table user_roles add column if not exists phone text;

alter table user_roles enable row level security;

drop policy if exists "Users can view their own roles" on user_roles;
drop policy if exists "Super admins can manage all roles" on user_roles;
drop policy if exists "Users read own roles" on user_roles;
drop policy if exists "Super admins manage roles" on user_roles;
drop policy if exists "Admins and super admins manage all roles" on user_roles;

create policy "Users read own roles"
  on user_roles for select
  to authenticated
  using (auth.uid() = user_id or (auth.jwt() ->> 'email') = 'mfcfootballclubtrichy@gmail.com');

create policy "Admins and super admins manage all roles"
  on user_roles for all
  to authenticated
  using (
    (auth.jwt() ->> 'email') = 'mfcfootballclubtrichy@gmail.com'
    or exists (
      select 1 from user_roles ur
      where ur.user_id = auth.uid() and ur.role in ('super_admin', 'admin')
    )
  )
  with check (
    (auth.jwt() ->> 'email') = 'mfcfootballclubtrichy@gmail.com'
    or exists (
      select 1 from user_roles ur
      where ur.user_id = auth.uid() and ur.role in ('super_admin', 'admin')
    )
  );

-- 3. Site Content Table (Draft vs Published Workflow)
create table if not exists site_content (
  id             uuid primary key default gen_random_uuid(),
  section        text unique not null,          -- e.g. 'home', 'about', 'coaches', 'team_achievements'
  draft_data     jsonb not null default '{}',
  published_data jsonb not null default '{}',
  previous_data  jsonb,                         -- Preserves last published version for 1-click rollback
  status         text not null default 'draft'
                 check (status in ('draft', 'in_review', 'published', 'archived')),
  publish_at     timestamptz,                   -- Optional scheduled publish
  updated_by     uuid references auth.users(id),
  updated_at     timestamptz not null default now(),
  created_at     timestamptz not null default now()
);

alter table site_content enable row level security;

-- 4. Content Audit Log (Who changed what, when, before & after values)
create table if not exists content_audit_log (
  id          uuid primary key default gen_random_uuid(),
  section     text not null,
  action      text not null, -- 'draft_update', 'submit_review', 'published', 'rollback'
  old_value   jsonb,
  new_value   jsonb,
  changed_by  uuid references auth.users(id),
  created_at  timestamptz not null default now()
);

alter table content_audit_log enable row level security;

create policy "Admins can view audit logs"
  on content_audit_log for select
  using (exists (
    select 1 from user_roles ur
    where ur.user_id = auth.uid() and ur.role in ('super_admin', 'admin')
  ));

-- 5. Public View for Published Data Only (Never exposes drafts to public visitors)
create or replace view public_site_content as
  select
    id,
    section,
    published_data as data,
    updated_at
  from site_content
  where status = 'published';

-- 6. Row Level Security Policies on site_content

-- Anyone (including public/anonymous visitors) can read published site content
create policy "Public can read published site content"
  on site_content for select
  using (status = 'published');

-- Authenticated editors, coaches, and admins can view draft content
create policy "Staff can read site content drafts"
  on site_content for select
  using (exists (
    select 1 from user_roles ur
    where ur.user_id = auth.uid()
  ));

-- Coaches can update their own coach profile draft
create policy "Coaches update own section draft"
  on site_content for update
  using (
    exists (
      select 1 from user_roles ur
      where ur.user_id = auth.uid() and ur.role = 'coach'
    )
    and section = 'coaches'
  );

-- Editors can update draft sections
create policy "Editors update draft sections"
  on site_content for update
  using (
    exists (
      select 1 from user_roles ur
      where ur.user_id = auth.uid() and ur.role in ('editor', 'admin', 'super_admin')
    )
  );

-- Admins and Super Admins can publish / rollback
create policy "Admins and super admins full write"
  on site_content for all
  using (
    exists (
      select 1 from user_roles ur
      where ur.user_id = auth.uid() and ur.role in ('super_admin', 'admin')
    )
  );

-- 7. Seed Script for Master Content
insert into site_content (section, draft_data, published_data, status)
values
(
  'home',
  '{
    "kicker": "Mutharasanallur, Trichy",
    "headline": "Mutharasanallur Football Club",
    "subheadline": "Founded 2020. Creating young football talent from our village and across Trichy.",
    "ctaPrimary": "Explore Achievements",
    "ctaSecondary": "Meet the Coaches"
  }'::jsonb,
  '{
    "kicker": "Mutharasanallur, Trichy",
    "headline": "Mutharasanallur Football Club",
    "subheadline": "Founded 2020. Creating young football talent from our village and across Trichy.",
    "ctaPrimary": "Explore Achievements",
    "ctaSecondary": "Meet the Coaches"
  }'::jsonb,
  'published'
),
(
  'about',
  '{
    "title": "About MFC",
    "body": "Mutharasanallur Football Club, known as MFC, was founded in 2020 to create young football talent from our village side and across Trichy. We give players a platform to develop their skills while building teamwork, discipline, and sportsmanship."
  }'::jsonb,
  '{
    "title": "About MFC",
    "body": "Mutharasanallur Football Club, known as MFC, was founded in 2020 to create young football talent from our village side and across Trichy. We give players a platform to develop their skills while building teamwork, discipline, and sportsmanship."
  }'::jsonb,
  'published'
),
(
  'vision',
  '{
    "title": "Our Vision",
    "body": "To create young football talent from our village and Trichy, with a platform to thrive and strong values of teamwork, discipline, and sportsmanship."
  }'::jsonb,
  '{
    "title": "Our Vision",
    "body": "To create young football talent from our village and Trichy, with a platform to thrive and strong values of teamwork, discipline, and sportsmanship."
  }'::jsonb,
  'published'
),
(
  'achievements_intro',
  '{
    "title": "Achievements",
    "body": "Over the years, MFC has built a reputation for excellence in local competition. Our greatest pride is the positive impact on our community: inspiring young athletes to chase their dreams and live an active, healthy life."
  }'::jsonb,
  '{
    "title": "Achievements",
    "body": "Over the years, MFC has built a reputation for excellence in local competition. Our greatest pride is the positive impact on our community: inspiring young athletes to chase their dreams and live an active, healthy life."
  }'::jsonb,
  'published'
),
(
  'coaches',
  '[
    { "name": "Dhanapal", "role": "Head Coach", "licence": ["AIFF C Licence", "AIFF D Licence"], "photo": null },
    { "name": "Rajesh", "role": "Coach", "licence": ["AIFF Licenced"], "photo": null },
    { "name": "Pragadeesh", "role": "Player-Coach", "licence": ["AIFF Licenced"], "photo": null }
  ]'::jsonb,
  '[
    { "name": "Dhanapal", "role": "Head Coach", "licence": ["AIFF C Licence", "AIFF D Licence"], "photo": null },
    { "name": "Rajesh", "role": "Coach", "licence": ["AIFF Licenced"], "photo": null },
    { "name": "Pragadeesh", "role": "Player-Coach", "licence": ["AIFF Licenced"], "photo": null }
  ]'::jsonb,
  'published'
),
(
  'team_achievements',
  '[
    { "season": "2021-2023", "place": "Runner-up", "tournament": "Chinthamani U15 5s Football Tournament", "location": "Trichy" },
    { "season": "2021-2023", "place": "Runner-up", "tournament": "Kajamalai FC U16 5s Football Tournament", "location": "Trichy" },
    { "season": "2021-2023", "place": "Runner-up", "tournament": "MFC U13 7s Football Tournament", "location": "Trichy" },
    { "season": "2021-2023", "place": "Runner-up", "tournament": "SAI FC 7s Football Tournament", "location": "Karur" },
    { "season": "2021-2023", "place": "3rd Place", "tournament": "Green Grass Turf U13 5s Football Tournament", "location": "Trichy" },
    { "season": "2021-2023", "place": "3rd Place", "tournament": "Arena 20 U13 5s Football Tournament", "location": "Trichy" },
    { "season": "2021-2023", "place": "3rd Place", "tournament": "Decathlon Cup U13 5s Football Tournament", "location": "Trichy" },
    { "season": "2021-2023", "place": "3rd Place", "tournament": "Shaz FC Cup U13 5s Football Tournament", "location": "Trichy" },
    { "season": "2021-2023", "place": "3rd Place", "tournament": "MFC U17 7s Football Tournament", "location": "Trichy" }
  ]'::jsonb,
  '[
    { "season": "2021-2023", "place": "Runner-up", "tournament": "Chinthamani U15 5s Football Tournament", "location": "Trichy" },
    { "season": "2021-2023", "place": "Runner-up", "tournament": "Kajamalai FC U16 5s Football Tournament", "location": "Trichy" },
    { "season": "2021-2023", "place": "Runner-up", "tournament": "MFC U13 7s Football Tournament", "location": "Trichy" },
    { "season": "2021-2023", "place": "Runner-up", "tournament": "SAI FC 7s Football Tournament", "location": "Karur" },
    { "season": "2021-2023", "place": "3rd Place", "tournament": "Green Grass Turf U13 5s Football Tournament", "location": "Trichy" },
    { "season": "2021-2023", "place": "3rd Place", "tournament": "Arena 20 U13 5s Football Tournament", "location": "Trichy" },
    { "season": "2021-2023", "place": "3rd Place", "tournament": "Decathlon Cup U13 5s Football Tournament", "location": "Trichy" },
    { "season": "2021-2023", "place": "3rd Place", "tournament": "Shaz FC Cup U13 5s Football Tournament", "location": "Trichy" },
    { "season": "2021-2023", "place": "3rd Place", "tournament": "MFC U17 7s Football Tournament", "location": "Trichy" }
  ]'::jsonb,
  'published'
),
(
  'individual_achievements',
  '[
    { "player": "Pragadeesh D", "category": "State Representation", "highlight": "Represented Tamil Nadu state team at the Santosh Trophy (2023)", "image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80", "hasConsent": true, "consent_received": true },
    { "player": "Rajesh S", "category": "Scholarship", "highlight": "Sports-quota selection, Hindustan University (100% scholarship, MBA Sports Management)", "image": "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80", "hasConsent": true, "consent_received": true },
    { "player": "Gnanam A", "category": "Scholarship", "highlight": "Sports-quota selection, Presidency College, Chennai (100% scholarship, MSW)", "image": "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=600&q=80", "hasConsent": true, "consent_received": true },
    { "player": "Ajith K", "category": "Scholarship", "highlight": "Sports-quota selection, Bishop Heber College, Trichy (100% scholarship, MBA)", "image": "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=600&q=80", "hasConsent": true, "consent_received": true },
    { "player": "Bala Subramaiyan and Arun Kumar", "category": "Scholarship", "highlight": "Sports-quota selection, Jeppiaar University (100% scholarship, MBA)", "image": "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=600&q=80", "hasConsent": true, "consent_received": true },
    { "player": "Santhosh", "category": "Scholarship", "highlight": "Sports-quota selection, Vinayaga University, Salem (70% scholarship, B.P.Ed)", "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80", "hasConsent": true, "consent_received": true },
    { "player": "Sukesan and Harish", "category": "Scholarship & State", "highlight": "Sukesan: sports-quota selection, Megna College, Chennai (100% scholarship, BBA). Harish: represented Pondicherry state team at the Junior Nationals", "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80", "hasConsent": true, "consent_received": true }
  ]'::jsonb,
  '[
    { "player": "Pragadeesh D", "category": "State Representation", "highlight": "Represented Tamil Nadu state team at the Santosh Trophy (2023)", "image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80", "hasConsent": true, "consent_received": true },
    { "player": "Rajesh S", "category": "Scholarship", "highlight": "Sports-quota selection, Hindustan University (100% scholarship, MBA Sports Management)", "image": "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80", "hasConsent": true, "consent_received": true },
    { "player": "Gnanam A", "category": "Scholarship", "highlight": "Sports-quota selection, Presidency College, Chennai (100% scholarship, MSW)", "image": "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=600&q=80", "hasConsent": true, "consent_received": true },
    { "player": "Ajith K", "category": "Scholarship", "highlight": "Sports-quota selection, Bishop Heber College, Trichy (100% scholarship, MBA)", "image": "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=600&q=80", "hasConsent": true, "consent_received": true },
    { "player": "Bala Subramaiyan and Arun Kumar", "category": "Scholarship", "highlight": "Sports-quota selection, Jeppiaar University (100% scholarship, MBA)", "image": "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=600&q=80", "hasConsent": true, "consent_received": true },
    { "player": "Santhosh", "category": "Scholarship", "highlight": "Sports-quota selection, Vinayaga University, Salem (70% scholarship, B.P.Ed)", "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80", "hasConsent": true, "consent_received": true },
    { "player": "Sukesan and Harish", "category": "Scholarship & State", "highlight": "Sukesan: sports-quota selection, Megna College, Chennai (100% scholarship, BBA). Harish: represented Pondicherry state team at the Junior Nationals", "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80", "hasConsent": true, "consent_received": true }
  ]'::jsonb,
  'published'
),
(
  'contact',
  '{
    "address": "Tamilan Nagar, Mutharasanallur, Trichy-1",
    "phone": "8072694818",
    "email": "mfcfootballacademy@gmail.com",
    "instagram": "@mfc_trichy"
  }'::jsonb,
  '{
    "address": "Tamilan Nagar, Mutharasanallur, Trichy-1",
    "phone": "8072694818",
    "email": "mfcfootballacademy@gmail.com",
    "instagram": "@mfc_trichy"
  }'::jsonb,
  'published'
)
on conflict (section) do update
set
  draft_data = excluded.draft_data,
  published_data = excluded.published_data,
  status = excluded.status,
  updated_at = now();
