const  mongoose       = require('mongoose');
const  databaseConfig = require('../configs/database');
const  systemConfig   = require('../configs/system');
const  notify 		  = require('../configs/notify');
const  bcrypt 		  = require('bcryptjs');
const  jwt 			  = require('jsonwebtoken');
const  crypto 		  = require('crypto');


const schema = new mongoose.Schema({ 
    username 		    : String,
	email		    	: String,
	role		    	: String,
	password		    : String,
	resetPassToken	    : String,
	resetPassTokenExp   : String,
});

schema.pre('save', function(next){
	if(!this.isModified('password')){
		next();
	};
	var salt = bcrypt.genSaltSync(10);
	this.password = bcrypt.hashSync(this.password, salt);
	next();
})

schema.methods.updateNew = async function (userNew) {
	const isMatch = await bcrypt.compare(userNew.password,this.password);
	if(!isMatch){
		var salt = bcrypt.genSaltSync(10);
		userNew.password = bcrypt.hashSync(userNew.password, salt);
		return userNew;
	}
	userNew.password = this.password;
	return userNew;
}

schema.methods.getSignedJwtToken = function () {
	return jwt.sign({ id : this._id},systemConfig.JWT_SECRET,{
		expiresIn : systemConfig.JWT_EXP
	})
}

schema.methods.resetPassword = function () {
	const resetToken = crypto.randomBytes(20).toString('hex');
	this.resetPassToken = crypto.createHash('sha256').update(resetToken).digest('hex');
	this.resetPassTokenExp = Date.now() + 10 * 60 * 1000;
	return resetToken;
}

schema.statics.findByCredentials = async function (email,password) {
	let err = '';
	// check empty
	if(!email || !password) return { err : notify.ERROR_EMAIL_EMPTY}
	// check email
	const user = await this.findOne({email : email});
	if(!user) return { err : notify.ERROR_LOGIN}
	//check password
	const isMatch = await bcrypt.compare(password,user.password);
	if(!isMatch) return { err : notify.ERROR_LOGIN}
	return {user}
}


module.exports = mongoose.model(databaseConfig.col_users, schema );