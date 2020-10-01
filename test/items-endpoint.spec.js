const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')


describe('Items Endpoints', function() {
    let db;

    const testItems = helpers.makeItemsArray();
    const testItemOne = testItems[0];

    before(`make knex instance`, () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    before('clean the table', () => helpers.cleanTables(db));

    after('disconnect from db', () => db.destroy());

    afterEach('cleanup', () => helpers.cleanTables(db));

    describe(`GET /items`, () => {
        context('Given there are no items in the database', () => {
            it('responds with 200', () => {
                return supertest(app)
                    .get('/api/items/1')
                    .expect(200)
            })
        })

        context('Given there are items in the database', () => {
            beforeEach('insert items', () => {
                helpers.seedTables(
                    db,
                    helpers.makeItemsArray(),
                    helpers.makeCategoriesArray(),
                    helpers.makeUsersArray(),
                    helpers.makeBudgetsArray()
                )
            })

            it('GET /items/:user_id/:item_id responds with 200 and the items for the user', () => {
                return supertest(app)
                    .get('/api/items/1/1')
                    .expect(200, [{
                        ...testItemOne,
                        date_create: new Date().toISOString().split('T')[0]+'T04:00:00.000Z'
                    }]) 
            })
        })
    })
})