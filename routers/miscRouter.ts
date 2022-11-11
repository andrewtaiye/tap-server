import express from "express";
const router = express.Router();
const client = require("../db/db");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

router.get("/enum", async (req, res) => {
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

router.post("/refresh", async (req, res) => {
  try {
    const { refresh } = req.body;

    const decoded = jwt.verify(refresh, process.env.REFRESH_SECRET);

    const payload = {
      userId: decoded.userId,
      hasProfile: decoded.hasProfile,
    };

    const access = jwt.sign(payload, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });

    const data = { access };

    console.log("Token refreshed");
    res.json({ status: "ok", message: "Token refreshed", data });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "Failed to refresh token" });
  }
});

module.exports = router;
