const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "",
  password: "",
  database: "inventory_db",
});
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL DB");
});
module.exports = connection;
