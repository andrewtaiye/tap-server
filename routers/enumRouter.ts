import express from "express";
const router = express.Router();
const client = require("../db/db");

router.get("/", async (req, res) => {
  try {
    const enumTables = ["ranks", "flights", "cats", "positions"];

    let data: any = {};

    for (const table of enumTables) {
      let query = `SELECT * FROM ${table};`;
      let result = await client.query(query);
      const rowArray = result.rows;

      for (let i = 0; i < rowArray.length; i++) {
        rowArray[i] = rowArray[i][table];
      }

      data[table] = rowArray;
    }

    res.json({ status: "ok", message: "Retrieved default values", data });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "Failed to get default values" });
  }
});

module.exports = router;
