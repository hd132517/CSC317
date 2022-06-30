const mysql = require('mysql2/promise');

const db = mysql.createPool({
	host     : 'localhost',
	user     : 'root',
	database : 'sfsudb',
	password : '00000000'
});

module.exports = db;