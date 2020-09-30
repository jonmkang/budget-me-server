const express = require('express')
const { comparePasswords } = require('../auth/auth-service')
const UsersService = require('./users-service')
const path = require('path')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

usersRouter
    .post('/', jsonBodyParser, (req, res, next) => {
        const { user_password, user_email } = req.body;

        for(const field of ['user_email', 'user_password'])
            if (!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}'`
                })

        const emailError = UsersService.validateEmail(user_email)
        if(emailError)
            return res.status(400).json({
                error: emailError
            })

        const passwordError = UsersService.validatePassword(user_password)
        if(passwordError)
            return res.status(400).json({
                error: passwordError
            })

        UsersService.hasUserWithUserName(
            req.app.get('db'),
            user_email
        )
            .then(hasUserNameWithUserName => {
                if(hasUserNameWithUserName)
                    return res.status(400).json({ error: `User email has registered already` })
            
                    return UsersService.hashPassword(user_password)
                        .then(hashedPassword => {
                            const newUser = {
                                user_email,
                                user_password: hashedPassword,
                            }
            

                    return UsersService.insertUser(
                        req.app.get('db'),
                        newUser,
                    )
                        .then(user => {
                            res
                                .status(201)
                                .json(UsersService.serializeUser(user))
                        })
            })
            .catch(next)
        })
    })
module.exports = usersRouter