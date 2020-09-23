CREATE TABLE mtg_decks (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT as IDENTITY,
    user_id INTEGER references mtg_users (id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    text TEXT NOT NULL
);

CREATE TABLE mtg_decks_cards (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT as IDENTITY,
    deck_id INTEGER references mtg_decks (id) ON DELETE CASCADE,
    card_id INTEGER references mtg_cards (id)
)