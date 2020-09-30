const BudgetsService = {
    getBudgetsByUserId(db, id){
        return db
            .select('*')
            .from('budgets')
            .where('budgets.user_id', id)
    },
    getBudgetByBudgetId(db, id){
        return db
            .select('*')
            .from('budgets')
            .where('budgets.budget_id', id)
    },
    addBudgetByUserId(db, budget){
        return db   
            .insert(budget)
            .into('budgets')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    updateBudget(db, id, budget){
        return db('budgets')
            .where('budget_id', id)
            .update(budget)
    },
    deleteBudget(db, id){
        return db('budgets')
            .where('budget_id', id)
            .delete()
    }
}

module.exports = BudgetsService;