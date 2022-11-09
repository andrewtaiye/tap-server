require("dotenv").config;
import { Request, Response } from "express";
const client = require("../db/db");

const getPositions = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    let query = `SELECT id FROM users WHERE id = '${userId}';`;
    let result = await client.query(query);

    // Check if user exists
    if (result.rowCount === 0) {
      console.log("Error: User does not exist");
      res
        .status(400)
        .json({ status: "error", message: "Failed to retrieve profile" });
      return;
    }

    // Retrieve user positions
    query = `
      SELECT * FROM user_positions WHERE user_id = '${userId}';
    `;
    result = await client.query(query);

    if (result.rowCount === 0) {
      res.json({ status: "ok", message: "User has no positions" });
      return;
    }

    const data = result.rows;
    res.json({ status: "ok", message: "Positions retrieved", data });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "Failed to retrieve position" });
  }
};

const createPosition = async (req: Request, res: Response) => {
  try {
    const {
      user_id,
      position,
      start_date,
      end_date,
      approval_date,
      is_revalidation,
    } = req.body;

    let query = `SELECT id FROM users WHERE id = '${user_id}';`;
    let result = await client.query(query);

    // Check if user exists
    if (result.rowCount === 0) {
      console.log("Error: User does not exist");
      res
        .status(400)
        .json({ status: "error", message: "Failed to retrieve profile" });
      return;
    }

    // Insert new position
    query = `
      INSERT INTO user_positions (user_id, position, start_date, end_date, approval_date, is_revalidation)
      VALUES ('${user_id}', '${position}', '${start_date}', ${
      end_date ? `'${end_date}'` : "null"
    }, ${approval_date ? `'${approval_date}'` : "null"}, ${is_revalidation});
    `;
    await client.query(query);

    query = `SELECT id FROM user_positions WHERE user_id = '${user_id}' AND position = '${position}';`;
    result = await client.query(query);

    const data = { id: result.rows[0].id };

    res.json({ status: "ok", message: "Position created", data });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "Failed to create position" });
  }
};

const updatePosition = async (req: Request, res: Response) => {
  try {
    res.json({ status: "ok", message: "Position updated" });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "Failed to update position" });
  }
};

const deletePosition = async (req: Request, res: Response) => {
  try {
    res.json({ status: "ok", message: "Position deleted" });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "Failed to delete position" });
  }
};

module.exports = {
  getPositions,
  createPosition,
  updatePosition,
  deletePosition,
};
