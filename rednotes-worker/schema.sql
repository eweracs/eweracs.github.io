-- One row per proof folder and browser: the latest encrypted notes that browser sent.
create table if not exists notes (
  proof text not null,              -- proof folder id (the log's proofId)
  sender text not null,             -- random id of the client's browser
  label text,                       -- "Family Proof N", for the Telegram message
  count integer not null default 0, -- number of notes in the message
  iv text not null,                 -- AES-CBC IV, base64
  ct text not null,                 -- ciphertext, base64
  tag text not null,                -- HMAC-SHA256 tag, base64
  created integer not null,         -- unix seconds
  updated integer not null,
  primary key (proof, sender)
);

-- When Telegram last heard about a proof (at most one message a minute).
create table if not exists proofs (
  proof text primary key,
  notified integer not null default 0
);
