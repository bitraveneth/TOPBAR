-- CMS document revision history (staff-only; used to restore previous saves)

create table if not exists public.cms_document_revisions (
  id uuid primary key default gen_random_uuid(),
  content_key text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists cms_document_revisions_key_created_idx
  on public.cms_document_revisions (content_key, created_at desc);

alter table public.cms_document_revisions enable row level security;

drop policy if exists "cms_revisions_select_staff" on public.cms_document_revisions;
create policy "cms_revisions_select_staff"
  on public.cms_document_revisions for select
  using (public.is_admin());

drop policy if exists "cms_revisions_insert_staff" on public.cms_document_revisions;
create policy "cms_revisions_insert_staff"
  on public.cms_document_revisions for insert
  with check (public.is_admin());

drop policy if exists "cms_revisions_delete_staff" on public.cms_document_revisions;
create policy "cms_revisions_delete_staff"
  on public.cms_document_revisions for delete
  using (public.is_admin());
