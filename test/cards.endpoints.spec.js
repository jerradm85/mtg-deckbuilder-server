const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Cards endpoint', function () {

    let db

    const {
        testUsers,
        testDecks,
        testCards,
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

    describe('GET /api/cards', () => {
        context('given there are cards in the database', () => {
            it('responds 200 with a list of cards', () => {
                return supertest(app)
                    .get('/api/cards')
                    .expect(200)
                    .expect('Content-Type', /json/)
            })
        })
    })


})