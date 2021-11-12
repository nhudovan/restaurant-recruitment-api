const  mongoose      = require('mongoose');
const {Schema} 	     = require('mongoose');
const databaseConfig = require('../configs/database');

var schema = new mongoose.Schema({ 
    name 		    : String,
	description 	: String,
	careers	        : [{
						type: Schema.Types.ObjectId,
						ref: 'careers',
						required: true
					}],
	type		    : [String],
	local		    : [String],
	web		        : String,
	address 	    : String,
	phone		    : Number,
	email		    : String
});

module.exports = mongoose.model(databaseConfig.col_restaurants, schema);