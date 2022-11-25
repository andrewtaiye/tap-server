require("dotenv").config;
import { Request, Response } from "express";
const { fetchCall } = require("../utility/utility");
const client = require("../db/db");

interface InstructorRequest extends Request {
  decoded: {
    userId: string;
    is_instructor: boolean;
    hasProfile: boolean;
    iat: number;
    exp: number;
    jti: string;
  };
  newToken?: string;
}

const getTrainees = async (req: InstructorRequest, res: Response) => {
  try {
    // Check if user is instructor
    if (!req.decoded.is_instructor) {
      console.log(`User ID: ${req.decoded.userId} is not an instructor`);
      res.status(400).json({ status: "error", message: "Unauthorised access" });
      return;
    }

    // Retrieve all trainees
    let query = `
      WITH position_count AS (
        SELECT user_id, COUNT(user_id) AS position_count
        FROM user_positions
        GROUP BY user_id
      )
      SELECT user_positions.id AS user_position_id, user_positions.user_id, user_positions.position, user_positions.start_date,
        positions.category AS position_category,
        position_count.position_count
      FROM user_positions
      JOIN positions ON user_positions.position = positions.position
      JOIN position_count ON user_positions.user_id = position_count.user_id
      WHERE end_date IS NULL AND approval_date IS NULL;
    `;
    let result = await client.query(query);

    if (result.rowCount === 0) {
      console.log("No trainees found");
      res.json({ status: "ok", message: "No trainees found" });
      return;
    }

    const trainees = result.rows;
    const data: { trainees: any; access?: string } = { trainees };

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("Retrieved all trainees");
    res.json({ status: "ok", message: "Retrieved all trainees", data });
  } catch (err: any) {
    console.log(err);
    res
      .status(400)
      .json({ status: "error", message: "Failed to get user positions" });
  }
};

module.exports = {
  getTrainees,
};
