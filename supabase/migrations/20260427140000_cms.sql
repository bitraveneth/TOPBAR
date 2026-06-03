-- CMS: editable storefront content (JSON documents + public asset bucket)

create table if not exists public.cms_documents (
  content_key text primary key,
  label text not null,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists cms_documents_updated_idx on public.cms_documents (updated_at desc);

alter table public.cms_documents enable row level security;

drop policy if exists "cms_documents_select_public" on public.cms_documents;
create policy "cms_documents_select_public"
  on public.cms_documents for select
  using (true);

drop policy if exists "cms_documents_write_staff" on public.cms_documents;
create policy "cms_documents_write_staff"
  on public.cms_documents for all
  using (public.is_admin())
  with check (public.is_admin());

-- Storage for CMS images (public read; staff upload)
insert into storage.buckets (id, name, public)
values ('cms', 'cms', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "cms_storage_public_read" on storage.objects;
create policy "cms_storage_public_read"
  on storage.objects for select
  using (bucket_id = 'cms');

drop policy if exists "cms_storage_staff_insert" on storage.objects;
create policy "cms_storage_staff_insert"
  on storage.objects for insert
  with check (bucket_id = 'cms' and public.is_admin());

drop policy if exists "cms_storage_staff_update" on storage.objects;
create policy "cms_storage_staff_update"
  on storage.objects for update
  using (bucket_id = 'cms' and public.is_admin());

drop policy if exists "cms_storage_staff_delete" on storage.objects;
create policy "cms_storage_staff_delete"
  on storage.objects for delete
  using (bucket_id = 'cms' and public.is_admin());
