// 데이터베이스에 접근하는 객체 생성

const mysql = require("mysql2/promise");
const {databaseSecret} = require("./secret");

exports.pool = mysql.createPool(databaseSecret);