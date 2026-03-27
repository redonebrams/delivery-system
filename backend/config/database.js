const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  // 🔥 Connection pool configuration
  waitForConnections: true,
  connectionLimit: 10,        // Max 10 connections
  queueLimit: 0,              // Unlimited queue
  enableKeepAlive: true,       // Keep connections alive
  keepAliveInitialDelayMs: 0,  // Initial delay
  // 🔥 Connection timeout settings
  acquireTimeout: 30000,      // 30s to acquire connection
  idleTimeout: 30000,         // 30s idle timeout
  connectionTimeout: 10000,   // 10s connection timeout
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
