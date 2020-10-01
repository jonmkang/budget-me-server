const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
        return [
            {
                user_email: 'user1@gmail.com',
                user_password: 'Abcd1234!'
            },
            {
                user_email: 'user2@gmail.com',
                user_password: 'aBcd1234!'
            }
        ]
}

function makeBudgetsArray() {
    return [
        {
            budget_id: 1,
            amount: 100,
            title: "Test 1",
            user_id: 1,
            date_create: new Date().toISOString()
        },
        {
            budget_id: 2,
            amount: 200,
            title: "Test 2",
            user_id: 2,
            date_create: new Date().toISOString()
        }
    ]
}

function makeCategoriesArray() {
    return [
        {   
            category_title: 'Example Category 1',
            date_created: new Date().toISOString(),
            user_id: 1
        },
        {   
            category_title: 'Example Category 2',
            date_created: new Date().toISOString(),
            user_id: 2
        }
    ]
}

function makeItemsArray(){
    return [
        {
            item_id: 1,
            item_name: "Item 1",
            amount: 50,
            category_id: 1,
            user_id: 1,
            date_create: new Date().toISOString()
        },
        {
            item_id:2,
            item_name: "Item 2",
            amount: 25,
            category_id: 1,
            user_id: 1,
            date_create: new Date().toISOString()
        },
        {
            item_id:3,
            item_name: "Item 3",
            amount: 25,
            category_id: 2,
            user_id: 2,
            date_create: new Date().toISOString()
        }
    ]
}

function seedTables(db, items, categories, budget_users, budgets){
    return db.transaction( async trx => {
        await trx.into('budget_user').insert(budget_users)
        await trx.into('budgets').insert(budgets)
        await trx.into('category').insert(categories)
        await trx.into('item').insert(items)
    })
        .catch()
}


function cleanTables(db){
    return db.raw(
        `TRUNCATE
            budget_user,
            budgets,
            category,
            item
            RESTART IDENTITY CASCADE;`
    )
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        user_email: user.user_email,
        user_password: bcrypt.hashSync(user.user_password, 12)
    }))

    return db.into('budget_user').insert(preppedUsers)
        .catch()
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
          subject: user.user_name,
           algorithm: 'HS256',
         })
    return `Bearer ${token}`
  }

module.exports = {
    makeUsersArray,
    makeBudgetsArray,
    makeCategoriesArray,
    makeItemsArray,
    makeAuthHeader,
    cleanTables,
    seedTables,
    seedUsers
}