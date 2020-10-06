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
    )
    )

    describe('GET /api/decks/', () => {
        context('given there are decks in the database', () => {
            it('responds 200 with a list of decks', () => {
                return supertest(app).get(`/api/decks/`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200)
                    .expect('content-type', /json/)
            })
        })
    })

    describe('POST /api/decks/', () => {
        context('given there is a deck to be posted', () => {
            it('responds with 201 "Created"', () => {
                const testUser = testUsers[3]
                const newDeck = {
                    user_id: testUser.id,
                    name: 'blahblibbity',
                    text: 'blahblah',
                    cards: testDeckCards,
                }
                return supertest(app)
                    .post('/api/decks/')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .send(newDeck)
                    .expect(201)
            })
        })
    })

    describe('DELETE /api/decks/:id', () => {
        context('given the specified deck exists', () => {
            it('responds with a 204 and deletes the deck', () => {
                const testUser = testUsers[0]
                const deck = 1

                return supertest(app).delete(`/api/decks/${deck}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(204)
            })
        })
    })

})