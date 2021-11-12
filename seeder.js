const  fs         = require('fs'); 
const  mongoose   = require('mongoose');
const  colors             = require('colors') ;
const  databaseConfig    = require( './src/configs/database') ;
const  restaurantSchemas = require('./src/schemas/restaurants');
const  careersSchemas    = require('./src/schemas/careers');
const  userSchemas       = require('./src/schemas/users');




mongoose.connect(`mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@star.4tcrt.mongodb.net/${databaseConfig.database}`)

const Restaurants = JSON.parse(
    fs.readFileSync(`${__dirname}/src/_data/restaurants.json`, 'utf-8')
)
const Careers = JSON.parse(
    fs.readFileSync(`${__dirname}/src/_data/careers.json`,'utf-8')
)
const Users = JSON.parse(
    fs.readFileSync(`${__dirname}/src/_data/user.json`,'utf-8')
)

const importData = async () => {
    try {
        await restaurantSchemas.create(Restaurants)
        await careersSchemas.create(Careers)
        await userSchemas.create(Users)
        console.log('importData...'.bgCyan);
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

const deleteData = async () => {
    try {
        await restaurantSchemas.deleteMany({})
        await careersSchemas.deleteMany({})
        await userSchemas.deleteMany({})
        console.log('deleteData...'.bgCyan);
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

if(process.argv[2] === '-i'){
    importData();
}else if(process.argv[2] === '-d'){
    deleteData();
}