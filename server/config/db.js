const mysql = require("mysql");
// connect MySQL
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "cra-website",
    multipleStatements: true // 一次執行多行
});
module.exports = connection;