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

-- 2. User Roles Table
create table if not exists user_roles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  role        user_role_type not null default 'volunteer',
  coach_id    text, -- Optional reference if role is 'coach'
  created_at  timestamptz not null default now(),
  unique (user_id, role)
);

alter table user_roles enable row level security;

create policy "Users can view their own roles"
  on user_roles for select
  using (auth.uid() = user_id);

create policy "Super admins can manage all roles"
  on user_roles for all
  using (exists (
    select 1 from user_roles ur
    where ur.user_id = auth.uid() and ur.role = 'super_admin'
  ));

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
    { "player": "Pragadeesh D", "highlight": "Represented Tamil Nadu state team at the Santosh Trophy (2023)", "consent_received": true },
    { "player": "Pragadeesh D", "highlight": "Represented SRM University in the South Zone Inter-University tournament (2023)", "consent_received": true },
    { "player": "Pragadeesh D", "highlight": "Champions, Chennai Senior Division League (2022), with Viva Chennai", "consent_received": true },
    { "player": "Rajesh S", "highlight": "Sports-quota selection, Hindustan University (100% scholarship, MBA Sports Management)", "consent_received": true },
    { "player": "Gnanam A", "highlight": "Sports-quota selection, Presidency College, Chennai (100% scholarship, MSW)", "consent_received": true },
    { "player": "Ajith K", "highlight": "Sports-quota selection, Bishop Heber College, Trichy (100% scholarship, MBA)", "consent_received": true },
    { "player": "Bala Subramaiyan and Arun Kumar", "highlight": "Sports-quota selection, Jeppiaar University (100% scholarship, MBA)", "consent_received": true },
    { "player": "Santhosh", "highlight": "Sports-quota selection, Vinayaga University, Salem (70% scholarship, B.P.Ed)", "consent_received": true },
    { "player": "Sukesan and Harish", "highlight": "Sukesan: sports-quota selection, Megna College, Chennai (100% scholarship, BBA). Harish: represented Pondicherry state team at the Junior Nationals", "consent_received": true }
  ]'::jsonb,
  '[
    { "player": "Pragadeesh D", "highlight": "Represented Tamil Nadu state team at the Santosh Trophy (2023)", "consent_received": true },
    { "player": "Pragadeesh D", "highlight": "Represented SRM University in the South Zone Inter-University tournament (2023)", "consent_received": true },
    { "player": "Pragadeesh D", "highlight": "Champions, Chennai Senior Division League (2022), with Viva Chennai", "consent_received": true },
    { "player": "Rajesh S", "highlight": "Sports-quota selection, Hindustan University (100% scholarship, MBA Sports Management)", "consent_received": true },
    { "player": "Gnanam A", "highlight": "Sports-quota selection, Presidency College, Chennai (100% scholarship, MSW)", "consent_received": true },
    { "player": "Ajith K", "highlight": "Sports-quota selection, Bishop Heber College, Trichy (100% scholarship, MBA)", "consent_received": true },
    { "player": "Bala Subramaiyan and Arun Kumar", "highlight": "Sports-quota selection, Jeppiaar University (100% scholarship, MBA)", "consent_received": true },
    { "player": "Santhosh", "highlight": "Sports-quota selection, Vinayaga University, Salem (70% scholarship, B.P.Ed)", "consent_received": true },
    { "player": "Sukesan and Harish", "highlight": "Sukesan: sports-quota selection, Megna College, Chennai (100% scholarship, BBA). Harish: represented Pondicherry state team at the Junior Nationals", "consent_received": true }
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
