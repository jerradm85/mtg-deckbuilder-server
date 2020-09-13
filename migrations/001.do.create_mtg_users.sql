CREATE TABLE mtg_users (
    user_name TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    password TEXT NOT NULL,
    nickname TEXT,
    date_created TIMESTAMPTZ NOT NULL DEFAULT now()
)