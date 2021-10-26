const mysql = require("mysql");
// connect MySQL
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "cra-website",
});
module.exports = connection;