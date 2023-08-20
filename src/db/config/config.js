var dotenv = require('dotenv');
var path = require('path');

dotenv.config( { path : '../config.env'} )

module.exports = {
  "development": {
    "username": "root",
    "password": "root1234",
    "database": "database_development",
    "host": "127.0.0.1",
    "port" : "3306",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "jay": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "dialect": "mysql"
  },
};
