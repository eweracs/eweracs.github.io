create table if not exists comments (
  id integer primary key autoincrement,
  doc text not null,                -- 'en' | 'fr'
  parent integer,                   -- null = top-level, else id of the comment replied to
  author text not null,
  body text not null,
  exact text,                       -- anchored quote, normalised (no soft hyphens, collapsed whitespace)
  prefix text,                      -- up to 40 chars of normalised context before the quote
  suffix text,                      -- up to 40 chars after
  section text,                     -- id of the nearest preceding heading at anchor time
  resolved integer not null default 0,
  created_at text default current_timestamp
);

create index if not exists idx_comments_doc on comments (doc);
