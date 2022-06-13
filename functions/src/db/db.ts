import dotenv from "dotenv"
dotenv.config();
const mysql = require('mysql');

const connection = { //database 접속 정보 입력
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DB,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    connectionLimit : 30 // 커넥션수 30개로 설정
};

module.exports = mysql.createPool(connection);