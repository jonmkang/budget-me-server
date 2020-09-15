const xss = require('xss')


const CategoriesService = {
    getByUserId(db, id){
        return db
            .select('*')
            .from('category')
            .where('category.user_id', id)
    },
    addCategory(db, newCategory){
        return db
            .insert(newCategory)
            .into('category')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    }
        
}

module.exports = CategoriesService;