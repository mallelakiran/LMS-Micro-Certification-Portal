const mysql = require('mysql2/promise');

const dbConfig = {
  host: (process.env.MYSQLHOST || 'ballast.proxy.rlwy.net').trim(),
  user: (process.env.MYSQLUSER || 'root').trim(),
  password: (process.env.MYSQLPASSWORD || '').trim(),
  database: (process.env.MYSQLDATABASE || 'railway').trim(),
  port: parseInt(process.env.MYSQLPORT) || 25344,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Database config:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port
    });
    throw error;
  }
};

module.exports = { pool, testConnection };
