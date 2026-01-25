create table if not exists short_links (
  short_id text primary key,
  drive_id text not null,
  name text,
  created_at text default current_timestamp
);
