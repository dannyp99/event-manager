'user strict';

var mysql = require('promise-mysql');

const db = {};
//local mysql db connection
var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'pi',
    password : 'goodyear123!',
    database : 'event_manager',
    supportBigNumbers: true,
    bigNumberStrings: true
});

connection.then((con) =>{
    console.log("Database Connected");
    db.con = con;
});

module.exports = db;
