const knex = require('knex')
const app = require('../src/app')
const jwt = require('jsonwebtoken')
const helpers = require('./test-helpers')
const supertest = require('supertest')

describe('Auth Endpoints', function() {
  let db

  const testUsers = helpers.makeUsersArray()
  const testUser = testUsers[0]

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`POST /api/auth/login`, () => {

        beforeEach('Insert users', () =>
        helpers.seedUsers(
            db,
            testUsers,
        )
        )

        const requiredFields = ['user_email', 'user_password']

        requiredFields.forEach(field => {
                const loginAttemptBody = {
                    user_email: testUser.user_email,
                    user_password: testUser.user_password,
                }

            it(`responds with 400 required error when '${field}' is missing`, () => {
                delete loginAttemptBody[field]

                return supertest(app)
                .post('/api/auth/login')
                .send(loginAttemptBody)
                .expect(400, {
                    error: `Missing '${field}'`,
                })
            })
        })

        it(`responds 400 'invalid user_email or password' when bad user_email`, () => {
            const userInvalidUser = { user_email: 'user-not', user_password: 'existy' }
            return supertest(app)
                .post('/api/auth/login')
                .send(userInvalidUser)
                .expect(400, { error: `Incorrect user email or password`})
        })

        it(`responds 400 'invalid user_email or password' when bad password`, () => {
            const userInvalidPass = { user_email: testUser.user_email, user_password: 'incorrect' }
            return supertest(app)
                .post('/api/auth/login')
                .send(userInvalidPass)
                .expect(400, { error: `Incorrect user email or password` })
        })
        
  })
})