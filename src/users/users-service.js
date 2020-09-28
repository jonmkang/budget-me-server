const xss = require('xss')
const bcrypt = require('bcryptjs')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]/

const UsersService = {
    validatePassword(password) {
        if (password.length < 8) {
            return 'Password must be longer than 8 characters'
        }
        if (password.length > 72) {
            return 'Password must be less than 72 characters'
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start or end with empty spaces'
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return 'Password must contain 1 upper case, lower case, number and special character'
        }
        return null
    },
    validateEmail(email){
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
            return null
        }
        return "Email must be valid"
    },
    hasUserWithUserName(db, user_email) {
        return db('budget_user')
            .where({ user_email })
            .first()
            .then( user => !! user)
    },
    insertUser(db, newUser) {
        return db
            .insert(newUser)
            .into('budget_user')
            .returning('*')
            .then(([user]) => user)
    },
    serializeUser(user){
        return {
            user_id: user.id,
            user_email: xss(user.user_email),
        }
    },
    hashPassword(password){
        return bcrypt.hash(password, 12)
    }
  }
  
  module.exports = UsersService