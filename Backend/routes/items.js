const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/item-types", (req, res) => {
  db.query("SELECT * FROM item_types", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.post("/items", (req, res) => {
  const items = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  const values = items.map(
    ({ name, purchase_date, stock_available, item_type_id }) => {
      if (!name || !purchase_date || !item_type_id) {
        return null;
      }
      return [name, purchase_date, stock_available ? 1 : 0, item_type_id];
    }
  );

  if (values.includes(null)) {
    return res
      .status(400)
      .json({ error: "Required fields missing in some items" });
  }

  const sql =
    "INSERT INTO items (name, purchase_date, stock_available, item_type_id) VALUES ?";
  db.query(sql, [values], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({
      message: "Items inserted successfully",
      inserted: result.affectedRows,
    });
  });
});

router.get("/items", (req, res) => {
  db.query(
    `SELECT items.id, items.name, items.purchase_date, items.stock_available, item_types.type_name, item_types.id AS type_id
     FROM items
     JOIN item_types ON items.item_type_id = item_types.id`,
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      console.log(results);
      res.json(results);
    }
  );
});

router.put("/items/:id", (req, res) => {
  const { id } = req.params;
  const { name, purchase_date, stock_available, item_type_id } = req.body;
  if (!name || !purchase_date || !item_type_id) {
    return res.status(400).json({ error: "Required fields are missing" });
  }
  db.query(
    `UPDATE items SET name=?, purchase_date=?, stock_available=?, item_type_id=? WHERE id=?`,
    [name, purchase_date, stock_available ? 1 : 0, item_type_id, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Item updated successfully" });
    }
  );
});

router.delete("/items/:id", (req, res) => {
  const { id } = req.params;
  db.query(`DELETE FROM items WHERE id=?`, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Item deleted successfully" });
  });
});

module.exports = router;
