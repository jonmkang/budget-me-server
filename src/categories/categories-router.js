const express = require('express')
const app = require('../app')
const bodyParser = express.json();
const xss = require('xss')
const categoriesService = require('./categories-service');
const CategoriesService = require('./categories-service');
const categoriesRouter = express.Router();

const serializeCategory = category => ({
    category_id: category.category_id,
    category_title: xss(category.category_title),
})

categoriesRouter
    .route('/:user_id')
    .all((req, res, next) => {
        CategoriesService.getByUserId(
            req.app.get('db'),
            req.params.user_id
        )
            .then(category => {
                if(!category){
                    return res.status(404).json({
                        error:{
                            message: `No categories found for user`
                        }
                    })
                }
                res.category = category;
                next()
            })
            .catch()
    })
    .get((req, res, next) => {
        res.status(200).json(res.category)
    })
    .post(bodyParser, (req, res, next) => {
        const { category_title,  user_id } = req.body;
        const newCategory = {
            category_title,
            user_id
        }

        if(!category_title){
            return res.status(404).json({
                error: { message: 'Missing category title in request body'}
            })
        }

        CategoriesService.addCategory(
            req.app.get('db'),
            newCategory
        )
            .then(category => {
                res.status(201)
                    .json(serializeCategory(category))
            })
            .catch(next)

    })
module.exports = categoriesRouter;