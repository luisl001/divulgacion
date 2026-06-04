import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Cargar las variables del archivo .env
dotenv.config();

console.log("DB_HOST:", process.env.DB_HOST); // Should NOT be undefined
console.log("DB_PORT:", process.env.DB_PORT);
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,  
  port: process.env.DB_PORT || 27736,
  ssl: {
    // Esto es vital para Aiven
    rejectUnauthorized: false  
  },
  connectionLimit: 10,
  queueLimit: 0
});

export default db;