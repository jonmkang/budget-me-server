require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const e = require('express');

const itemsRouter = require('./items/items-router');
const categoriesRouter = require('./categories/categories-router');
const usersRouter = require('./users/users-router');
const authRouter = require('./auth/auth-router');
const budgetsRouter = require('./budgets/budgets-router');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://budget-me-one.vercel.app/"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Origin", "http://localhost:3000/"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/', (req, res) => {
    res.send('Hello, world!')
});

app.use('/api/items', itemsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/budgets',  budgetsRouter)

app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production'){
        response = { error: {message: 'server error'}}
    }else {
        response = { message: error.message, error}
    }
    res.status(500).json(response)
})

module.exports = app