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
    .get((req, res, next) => {
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
                res.status(200).json(res.category)
                
            })
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const { category_title } = req.body;
        const { user_id } = req.params;
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

categoriesRouter
    .route('/:user_id/:category_name')
    .all((req, res, next) => {
        CategoriesService.getByName(
            req.app.get('db'),
            req.params.category_name
        )
            .then(category_by_name => {
                if(!category_by_name){
                    return res.status(404).json({
                        error: { message: `Category doesn't exist`}
                    })
                }
                res.category_by_name = category_by_name
                next()
            })
            .catch()
    })
    .get((req, res, next) => {
        res.status(200).json(res.category_by_name)
    })
    .delete(bodyParser, (req, res, next) => {
        CategoriesService.deleteCategory(
            req.app.get('db'),
            req.params.category_name
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(bodyParser, (req, res, next) => {
        const { category_title } = req.body;
        const user_id = req.params.user_id;
        const updateCategory = { category_title, user_id }

        if(!updateCategory.category_title){
            return res.status(400).json({
                error: {
                    message: `Request body must contain category title`
                }
            })
        }
        CategoriesService.updateCategory(
            req.app.get('db'),
            req.params.category_name,
            updateCategory
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
    })
module.exports = categoriesRouter;