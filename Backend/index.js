const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const itemRoutes = require("./routes/items");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api", itemRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));

/* ==== MYSQL SCHEMA ==== */
// -- Run this in your MySQL client
// CREATE DATABASE inventory_db;
// USE inventory_db;

// CREATE TABLE item_types (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   type_name VARCHAR(255) NOT NULL
// );

// INSERT INTO item_types (type_name) VALUES ('Electronics'), ('Furniture'), ('Clothing');

// CREATE TABLE items (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   name VARCHAR(255) NOT NULL,
//   purchase_date DATE NOT NULL,
//   stock_available BOOLEAN,
//   item_type_id INT,
//   FOREIGN KEY (item_type_id) REFERENCES item_types(id)
// );
