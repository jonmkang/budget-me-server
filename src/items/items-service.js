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
    },
    checkItemByUserId(db, item_id,  user_id){
        return db
            .select('*')
            .from('item')
            .where('item_id', item_id)
            .andWhere('user_id', user_id)
    },
    serializeItem(item){
        return {
            item_id: item.item_id,
            item_name: item.item_name,
            amount: item.amount,
            category_id: item.category_id,
            user_id: item.user_id
        }
    },
    updateItem(db, id, item){
        return db('item')
            .where('item_id', id)
            .update(item)
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    }
}

module.exports = ItemsService;