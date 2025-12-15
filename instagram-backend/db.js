const mysql = require("mysql2");

const db = mysql.createPool({

    host : "localhost",
    user: "root",
    password: "Chhavi@123",
    database: "instagram_clone"

});
module.exports = db;