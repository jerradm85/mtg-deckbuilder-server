const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('decks endpoint', function () {

    let db

    const {
        testUsers,
        testDecks,
        testCards,
        testDeckCards,
    } = helpers.makeDecksFixtures()

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    beforeEach('insert data into tables', () => helpers.seedDecksCardsTables(
        db,
        testUsers,
        testDecks,
        testCards,
        testDeckCards,
    )
    )

    describe.only('GET /api/deckscards/:id', () => {
        context('given there are decks in the database', () => {
            it('responds with the cards of the associated deck', () => {
                return supertest(app).get(`/api/deckcards/${testDeckCards[0].deck_id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200)
                    .expect('content-type', /json/)
            })
        })
    })

})