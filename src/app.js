require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const e = require('express')

const itemsRouter = require('./items/items-router')
const categoriesRouter = require('./categories/categories-router')

const app = express()

console.log("database_url", process.env.DATABASE_URL)

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use('/api/items', itemsRouter);
app.use('/api/categories', categoriesRouter);

app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production'){
        response = { error: {message: 'server error'}}
    }else {
        console.error(error)
        response = { message: error.message, error}
    }
    res.status(500).json(response)
})

module.exports = app