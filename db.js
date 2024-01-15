var mysql = require('mysql');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'yoonseo',
    password: 'week3',
    database: 'madcamp3'
});
db.connect();

module.exports = db;