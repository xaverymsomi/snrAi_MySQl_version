// config/db.js
import dotenv from 'dotenv';
import mysql from 'mysql2';  // Use mysql2 instead of mysql

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    // console.error('❌ Error connecting to MySQL:', err.message);
    process.exit(1);
  } else {
    // console.log('✅ MySQL connected.');
  }
});

export default db;
