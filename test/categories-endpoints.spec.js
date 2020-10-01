require('dotenv').config()
const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { contentSecurityPolicy } = require('helmet')
const supertest = require('supertest')
const helpers = require('./test-helpers')


describe('Categories Endpoints', function() {
    let db;

    const testCategories = helpers.makeCategoriesArray();
    const testCategory = testCategories[0];
    const testUsers = helpers.makeUsersArray();
    const testUser = testUsers[0];

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

    describe(`GET /category`, () => {

        context('Given there are no categories in the database for the user', () => {
            it('responds with 200', () => {
                return supertest(app)
                    .get('/api/categories/1')
                    .expect(200)
            })
        })

        context('Given there are categories in the database', () => {
            beforeEach('insert categories', () => {
                helpers.seedTables(
                        db,
                        helpers.makeItemsArray(),
                        testCategories,
                        helpers.makeUsersArray(),
                        helpers.makeBudgetsArray()
                    )
            })

            it('GET /category responds with 200 and all of the categories', () => {
                return supertest(app)
                    .get(`/api/categories/1`)
                    .expect(200, [{...testCategory, category_id: 1, date_created: new Date().toISOString().split('T')[0]+'T04:00:00.000Z'}]) 
            })
        })
    })
})