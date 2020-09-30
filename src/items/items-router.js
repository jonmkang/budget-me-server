const express = require('express');
const app = require('../app');
const bodyParser = express.json();
const xss = require('xss');
const itemsService = require('./items-service');
const itemsRouter = express.Router();
const { requireAuth } = require('../middleware/jwt-auth')

const serializeItem = item => ({
    item_name: xss(item.item_name),
    category_id: xss(item.category_id),
    user_id: xss(item.user_id),
    amount: xss(item.amount)
});

itemsRouter.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://budget-me-one.vercel.app/"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Origin", "http://localhost:3000/"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

itemsRouter
    .route('/:user_id')
    .get((req, res, next) => {
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
                    });
                }   
                res.items = items;
                res.status(200).json(res.items)
            })
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const { item_name, category_id, amount } = req.body;
        const { user_id } = req.params;
        const newItem = {
            item_name,
            user_id,
            category_id,
            amount
        };
        if(!item_name){
            return res.status(404).json({
                error: { message: 'Missing item name in request body'}
            });
        };

        if(!user_id){
            return res.status(404).json({
                error: { message: 'Missing user id in request body'}
            });
        };

        if(!category_id){
            return res.status(404).json({
                error: { message: 'Missing category name in request body'}
            });
        };

        if(!amount){
            return res.status(404).json({
                error: { message: 'Missing amount in request body'}
            });
        };

        itemsService.addItemByUserId(
            req.app.get('db'),
            serializeItem(newItem)
        )
            .then(item => {
                res.status(201)
                    .json(item)
            })
            .catch(next)
    })
itemsRouter
    .route('/:user_id/:item_id')
    .all((req, res, next) => {
        //Sends item_id and user_id so only the user can change the item contents
        itemsService.checkItemByUserId(
            req.app.get('db'),
            req.params.item_id,
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
    .patch(bodyParser, (req, res, next) => {
        const { item_id, amount, user_id, category_id } = req.body;
        const item = {
            item_id, amount, user_id, category_id
        };

        itemsService.updateItem(
            req.app.get('db'),
            req.params.item_id,
            serializeItem(item)
        )
            .then(item => {
                res
                    .status(204)
                    .end()
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        ItemsService.deleteItem(
            req.app.get('db'),
            req.params.item_id
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = itemsRouter;