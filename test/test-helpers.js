const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      full_name: 'Test user 1',
      nickname: 'TU1',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      user_name: 'test-user-2',
      full_name: 'Test user 2',
      nickname: 'TU2',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 3,
      user_name: 'test-user-3',
      full_name: 'Test user 3',
      nickname: 'TU3',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 4,
      user_name: 'test-user-4',
      full_name: 'Test user 4',
      nickname: 'TU4',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
  ]
}

function makeDecksArray(users) {
  return [
    {
      user_id: users[0].id,
      name: 'First test deck!',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
    {
      user_id: users[1].id,
      name: 'Second test thing!',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
    {
      user_id: users[2].id,
      name: 'Third test thing!',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
    {
      user_id: users[3].id,
      name: 'Fourth test thing!',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
  ]
}

function makeCardsArray() {
  return [
    {
      id: 1,
      name: 'First test card',
      image: ''
    },
    {
      id: 2,
      name: 'Second test card',
      image: ''
    },
    {
      id: 3,
      name: 'Third test card',
      image: ''
    },
    {
      id: 4,
      name: 'Fourth test card',
      image: ''
    },
  ]
}

function makeDecksCardsArray(decks, cards) {
  return [
    {
      id: 1,
      deck_id: decks[0].id || 1,
      card_id: cards[0].id,
    },
    {
      id: 2,
      deck_id: decks[0].id || 1,
      card_id: cards[1].id,
    },
    {
      id: 3,
      deck_id: decks[0].id || 1,
      card_id: cards[2].id,
    },
    {
      id: 4,
      deck_id: decks[0].id || 1,
      card_id: cards[3].id,
    }
  ];
}

function makeExpectedDeck(users, deck, cards=[]) {
  const user = users
    .find(user => user.id === deck.user_id)
  
  const number_of_cards = cards
      .filter(card => card.deck_id === deck.id)
      .length

  return {
    id: article.id,
    name: article.title,
    text: article.content,
    number_of_cards,
    user: {
      id: user.id,
      user_name: user.user_name,
      full_name: user.full_name,
      nickname: user.nickname,
    },
  }
}

function makeMaliciousDeck(user) {
  const maliciousDeck = {
    id: 911,
    name: 'Bad name <script>alert("xss");</script>',
    user_id: user.id,
    text: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  }
  const expectedDeck = {
    ...makeExpectedDeck([user], maliciousDeck),
    name: 'Bad name &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    text: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  }
  return {
    maliciousDeck,
    expectedDeck,
  }
}

function makeDecksFixtures() {
  const testUsers = makeUsersArray()
  const testCards = makeCardsArray()
  const testDecks = makeDecksArray(testUsers)
  const testDeckCards = makeDecksCardsArray(testDecks, testCards)
  return { testUsers, testCards, testDecks, testDeckCards }
}


function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        mtg_users,
        mtg_decks,
        mtg_cards,
        mtg_decks_cards
        RESTART IDENTITY CASCADE
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE mtg_users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE mtg_decks_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE mtg_cards_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE mtg_decks_cards_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('mtg_users_id_seq', 0)`),
        trx.raw(`SELECT setval('mtg_decks_id_seq', 0)`),
        trx.raw(`SELECT setval('mtg_cards_id_seq', 0)`),
        trx.raw(`SELECT setval('mtg_decks_cards_id_seq', 0)`)
      ])
    )
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('mtg_users').insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('mtg_users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}

function seedCards(db, cards) {
  const preppedCards = cards.map(card => ({
    ...card
  }))
  return db.into('mtg_cards').insert(preppedCards)
    .then(() => 
      db.raw(
        `SELECT setval('mtg_cards_id_seq', ?)`,
        [cards[cards.length - 1].id],
      )
    )
}

function seedDecksCardsTables(db, users, decks, cards=[], decksCards=[]) {
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await seedCards(trx, cards)
    await trx.into('mtg_decks').insert(decks)
    await trx.into('mtg_decks_cards').insert(decksCards)
  })
}

function seedDecksTables(db, users, decks) {
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('mtg_decks').insert(decks)
    await trx.raw(
      `SELECT setval('mtg_decks_id_seq', ?)`,
      [decks[decks.length - 1].id],
    )
  })
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

function makeExpectedDeck(users, deck) {
  const user = users
    .find(user => user.id === deck.user_id)

  return {
    id: article.id,
    name: article.title,
    text: article.content,
    user: {
      id: user.id,
      user_name: user.user_name,
      full_name: user.full_name,
      nickname: user.nickname,
    },
  }
}

function seedMaliciousDeck(db, user, deck) {
  return seedUsers(db, [user])
    .then(() =>
      db
        .into('mtg_decks')
        .insert([deck])
    )
}


module.exports = {
  makeUsersArray,
  makeDecksArray,
  makeCardsArray,
  makeDecksCardsArray,
  makeDecksFixtures,
  seedDecksCardsTables,
  cleanTables,
  seedUsers,
  seedDecksTables,
  seedMaliciousDeck,
  makeAuthHeader,
  makeExpectedDeck,
  makeMaliciousDeck,
}
