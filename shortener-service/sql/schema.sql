create table if not exists short_links (
  id serial primary key,
  short_id varchar(6) unique not null,
  drive_id text not null,
  name text,
  created_at timestamp with time zone default now()
);
