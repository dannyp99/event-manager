'user strict';

var mysql = require('promise-mysql');

const db = {};
//local mysql db connection
var connection = mysql.createConnection({
    host     : '34.73.226.81',
    user     : 'dannypires99',
    password : 'goodyear',
    database : 'event_manager',
    supportBigNumbers: true,
    bigNumberStrings: true
});

connection.then((con) =>{
    console.log("Database Connected");
    db.con = con;
});

module.exports = db;