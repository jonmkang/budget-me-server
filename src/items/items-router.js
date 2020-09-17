const express = require('express')
const app = require('../app')
const bodyParser = express.json();
const xss = require('xss')
const itemsService = require('./items-service');
const ItemsService = require('./items-service');
const itemsRouter = express.Router();

const serializeItem = item => ({
    item_name: item.item_name,
    category_id: item.category_id,
    user_id: item.user_id,
    amount: item.amount
})

itemsRouter
    .route('/:user_id')
    .all((req, res, next) => {
        itemsService.getItemsByUserId(
            req.app.get('db'),
            req.params.user_id
        )   
            .then(items => {
                if(!items){
                    return res.status(404).json({
                        error:{
                            message: `No items found for user`
                        }
                    })
                }   
                res.items = items;
                next()
            })
            .catch()
    })
    .get((req, res, next) => {
        res.status(200).json(res.items)
    })
    .post(bodyParser, (req, res, next) => {
        const { item_name, user_id, category_id, amount } = req.body;
        const newItem = {
            item_name,
            user_id,
            category_id,
            amount
        }

        if(!item_name){
            return res.status(404).json({
                error: { message: 'Missing item name in request body'}
            })
        }

        if(!user_id){
            return res.status(404).json({
                error: { message: 'Missing user id in request body'}
            })
        }

        if(!category_id){
            return res.status(404).json({
                error: { message: 'Missing category id in request body'}
            })
        }

        if(!amount){
            return res.status(404).json({
                error: { message: 'Missing amount in request body'}
            })
        }

        ItemsService.addItemByUserId(
            req.app.get('db'),
            newItem
        )
            .then(item => {
                res.status(201)
                    .json(serializeItem(item))
            })
            .catch(next)
    })

module.exports = itemsRouter;