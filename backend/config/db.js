const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'vipin', 
  database: 'ecofinds'
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;