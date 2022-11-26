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
      SELECT user_positions.id AS user_position_id, user_positions.user_id, user_positions.position, user_positions.start_date, user_positions.cat_upgrade,
        positions.category AS position_category,
        profiles.rank, profiles.full_name
      FROM user_positions
      JOIN positions ON user_positions.position = positions.position
      JOIN profiles ON user_positions.user_id = profiles.user_id
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
