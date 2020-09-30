const express = require('express');
const app = require('../app');
const bodyParser = express.json();
const xss = require('xss');
const BudgetsService = require('./budgets-service');
const budgetsRouter = express.Router();

budgetsRouter
    .route('/:user_id')
    .get((req, res, next) => {
        BudgetsService.getBudgetsByUserId(
            req.app.get('db'),
            req.params.user_id
        )
            .then(budgets => {
                if(!budgets){
                    return res.status(404).json({
                        error: {
                            message: `No budgets found for user`
                        }
                    })
                }
                res.budgets = budgets;
                res.status(200).json(res.budgets)
            })
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const { budget_amount, title, month_date } = req.body;
        const { user_id  } = req.params;
        const newBudget = {
            amount: budget_amount,
            user_id,
            title,
            date_create: month_date
        }

        if(!budget_amount){
            return res.status(404).json({
                error: { message: `Missing budget amount in request body`}
            })
        }

        BudgetsService.addBudgetByUserId(
            req.app.get('db'),
            newBudget
        )
            .then(budget => {
                res.status(201)
                    .json(budget)
            })
            .catch(next)
    })

budgetsRouter
    .route('/:user_id/:budget_id')
    .all((req, res, next) => {
        BudgetsService.getBudgetByBudgetId(
            req.app.get('db'),
            req.params.budget_id
        )
            .then(budget => {
                if(!budget){
                    return res.status(404).json({
                        error: { message: `Budget doesn't exist`}
                    });
                };
                res.budget = budget;
                next()
            })
            .catch()
    })
    .get((req, res, next) => {
        res.status(200).json(res.budget)
    })
    .delete(bodyParser, (req, res, next) => {
        BudgetsService.deleteBudget(
            req.app.get('db'),
            req.params.budget_id
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(bodyParser, (req, res, next) => {
        const { amount, date_create, title } = req.body;
        const { user_id, budget_id } = req.params;
        const updateBudget = {
            amount,
            date_create,
            title,
            user_id,
            budget_id
        }

        if(!updateBudget.amount){
            return res.status(400).json({
                error: {
                    message: `Request body must contain amount`
                }
            })
        }

        if(!updateBudget.title){
            return res.status(400).json({
                error : {
                    message: `Request body must contain title`
                }
            })
        }

        if(!updateBudget.date_create){
            return res.status(400).json({
                error:{
                    message: `Request body must contain date`
                }
            })
        }

        BudgetsService.updateBudget(
        req.app.get('db'),
        req.params.budget_id,
        updateBudget
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
    })

module.exports = budgetsRouter;