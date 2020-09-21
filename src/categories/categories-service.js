const xss = require('xss')


const CategoriesService = {
    getByUserId(db, id){
        return db
            .select('*')
            .from('category')
            .where('category.user_id', id)
    },
    getByName(db, title){
        return db
            .select('*')
            .from('category')
            .where('category.category_title', title)
            
    },
    addCategory(db, newCategory){
        return db
            .insert(newCategory)
            .into('category')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteCategory(db, title){
        return db('category')
            .where('category.category_title', title)
            .delete()
    },
    updateCategory(db, title, newCategoryTitle){
        console.log(title, newCategoryTitle)
        return db('category')
            .where('category.category_title', title)
            .update(newCategoryTitle)
    }
        
}

module.exports = CategoriesService;