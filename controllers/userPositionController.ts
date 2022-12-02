require("dotenv").config;
import { Request, Response } from "express";
const client = require("../db/db");

interface UserPositionRequest extends Request {
  newToken?: string;
}

const getUserPositions = async (req: UserPositionRequest, res: Response) => {
  try {
    const { user_id } = req.params;

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

    // Retrieve user positions
    query = `
      SELECT * FROM user_positions WHERE user_id = '${user_id}' ORDER BY start_date;
    `;
    result = await client.query(query);

    if (result.rowCount === 0) {
      res.json({ status: "ok", message: "User has no positions" });
      return;
    }

    const positions = result.rows;
    const data: any = { positions };

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("User positions retrieved");
    res.json({ status: "ok", message: "User positions retrieved", data });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "Failed to retrieve user positions" });
  }
};

const createUserPosition = async (req: UserPositionRequest, res: Response) => {
  try {
    const { user_id } = req.params;
    const {
      position,
      start_date,
      end_date,
      approval_date,
      is_revalidation,
      cat_upgrade,
    } = req.body;

    let query = `SELECT id FROM users WHERE id = '${user_id}';`;
    let result = await client.query(query);

    // Check if user exists
    if (result.rowCount === 0) {
      console.log("Error: User does not exist");
      res
        .status(400)
        .json({ status: "error", message: "Failed to retrieve user" });
      return;
    }

    // Insert new position
    query = `
      INSERT INTO user_positions (user_id, position, start_date, end_date, approval_date, is_revalidation, cat_upgrade)
      VALUES ('${user_id}', '${position}', ${start_date},
      ${end_date ? end_date : "null"},
      ${
        approval_date ? approval_date : "null"
      }, ${is_revalidation}, '${cat_upgrade}')
      RETURNING id;
    `;
    result = await client.query(query);

    const id = result.rows[0].id;
    const data: any = { id };

    if (req.newToken) {
      data.access = req.newToken;
    }

    res.json({ status: "ok", message: "User position created", data });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "Failed to create user position" });
  }
};

const updateUserPosition = async (req: UserPositionRequest, res: Response) => {
  try {
    const {
      position,
      start_date,
      end_date,
      approval_date,
      is_revalidation,
      cat_upgrade,
    } = req.body;
    const { user_position_id } = req.params;

    // Check if user-position exists
    let query = `SELECT id FROM user_positions WHERE id = '${user_position_id}';`;
    let result = await client.query(query);

    if (result.rowCount === 0) {
      console.log("Error: User position does not exist");
      res
        .status(400)
        .json({ status: "error", message: "Failed to update user position" });
      return;
    }

    // Update position
    query = `
    UPDATE user_positions
    SET position = '${position}', start_date = ${start_date}, end_date = ${end_date}, approval_date = ${approval_date}, is_revalidation = ${is_revalidation}, cat_upgrade = '${cat_upgrade}'
    WHERE id = '${user_position_id}';
    `;
    await client.query(query);

    const data: any = {};

    if (req.newToken) {
      data.access = req.newToken;
    }

    res.json({ status: "ok", message: "User position updated", data });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "Failed to update user position" });
  }
};

const deleteUserPosition = async (req: UserPositionRequest, res: Response) => {
  try {
    const { user_position_id } = req.params;

    let query = `DELETE FROM user_positions WHERE id = '${user_position_id}';`;
    await client.query(query);

    const data: any = {};

    if (req.newToken) {
      data.access = req.newToken;
    }

    res.json({ status: "ok", message: "User position deleted", data });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "Failed to delete user position" });
  }
};

module.exports = {
  getUserPositions,
  createUserPosition,
  updateUserPosition,
  deleteUserPosition,
};
