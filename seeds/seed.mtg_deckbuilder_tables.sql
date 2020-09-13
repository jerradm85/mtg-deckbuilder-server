BEGIN;

TRUNCATE
  mtg_users,
  RESTART IDENTITY CASCADE;

  INSERT INTO mtg_users (user_name, full_name, nickname, password)
  VALUES
    ('Jerrad', 'Jerrad Moon', null, 'securepass')