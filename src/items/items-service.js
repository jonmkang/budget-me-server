const xss = require('xss')

const ItemsService = {
    getItemsByUserId(db, id){
        return db   
            .select('*')
            .from('item')
            .join('category', function() {
                this.on('category.category_id', '=', 'item.category_id')
            })
            .where('item.user_id', id)
    },
    addItemByUserId(db, item){
        return db
            .insert(item)
            .into('item')
            .returning('*')
            .then(rows =>{
                return rows[0]
            })
    }
}

module.exports = ItemsService;