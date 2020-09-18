module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DB_URL || 'postgresql://mtguser@localhost/mtg-deckbuilder',
  TEST_DB_URL: process.env.TEST_DB_URL || 'postgresql://mtguser@localhost/mtg-deckbuilder-test',
  JWT_SECRET: process.env.JWT_SECRET || 'mysecret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '5d'
}