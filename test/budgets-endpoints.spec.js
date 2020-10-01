const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')


describe('Budgets Endpoints', function() {
    let db;

    const testBudgets = helpers.makeBudgetsArray();
    const testBudgetOne = testBudgets[0];

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

    describe(`GET /Budgets`, () => {
        context('Given there are no Budgets in the database', () => {
            it('responds with 200', () => {
                return supertest(app)
                    .get('/api/Budgets/1')
                    .expect(200)
            })
        })

        context('Given there are Budgets in the database', () => {
            beforeEach('insert Budgets', () => {
                helpers.seedTables(
                    db,
                    helpers.makeItemsArray(),
                    helpers.makeCategoriesArray(),
                    helpers.makeUsersArray(),
                    helpers.makeBudgetsArray()
                )
            })

            it('GET /budgets/:user_id/:item_id responds with 200 and the budgets for the user', () => {
                return supertest(app)
                    .get('/api/budgets/1/1')
                    .expect(200, [{
                        ...testBudgetOne,
                        date_create: new Date().toISOString().split('T')[0]+'T04:00:00.000Z'
                    }]) 
            })
        })
    })
})