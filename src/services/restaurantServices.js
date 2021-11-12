import db from "../schemas/restaurants";


module.exports = {
    listItems : (params,option) => {
        // coppy params
        const queryFind = { ...params };

        let find,select,sort;

        // Create fields remove
        let removeFields = ['select','sort','page','limit'];

        // Remove fields 
        removeFields.forEach(param => delete queryFind[param]);

        // Create query string
        let queryStr = JSON.stringify(queryFind);

        // replace 
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, find => `$${find}`); 

        //parse
        find = JSON.parse(queryStr);

        // select fields
        if(params.select){
            select = params.select.split(',').join(' ');
        }

        // sort fields
        if(params.sort){
            sort = params.sort.split(',').join(' ');
        }

        //pagination
        const page  = parseInt(params.page) || 1;
        const limit = parseInt(params.limit) || 3;
        const skip  = ( page-1 )*limit;

        if(option.task == 'all'){
            return db
                    .find(find)
                    .select(select)
                    .sort(sort)
                    .skip(skip).limit(limit)
        }
        if(option.task == 'one'){
            return db
                    .findById(params.id)
                    .select({})
        }
    },
    create : (item) => {
        return new db(item).save();
    },
    deleteItem : (params,option) => { 
        if(option.task == 'one'){
            return db.deleteOne({_id : params.id})
        }
    },
    editItem : (params,option) => { 
        if(option.task == 'edit'){
            return db.updateOne({_id : params.id},params.body)
        }
    }, 
   
}