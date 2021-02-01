const db_config = require("../config/db_config")

const dbConfig = require("../config/db_config")

//including dependency
const Sequelize = require("sequelize")

//setting up the config
const sequelize = new Sequelize(
    dbConfig.DB, dbConfig.USER,dbConfig.PASSWORD,{
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    port:"3306",

    pool:{
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
    }
)
//setting up the db
const db={}
db.Sequelize= Sequelize
db.sequelize= sequelize

db.images= require("./image_model")(sequelize,Sequelize)

module.exports=db

//Checking connection status
try {
     sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }