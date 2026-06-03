const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
});

// 🔥 Log pool status
pool.on('connection', (connection) => {
  console.log(`📊 Pool: Connection established (Pool size: ${pool._allConnections?.length || 'N/A'})`);
});

pool.on('release', (connection) => {
  console.log(`📊 Pool: Connection released`);
});

pool.on('error', (err) => {
  console.error('❌ Pool error:', err.message);
});

module.exports = pool;
