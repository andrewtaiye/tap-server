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
      WITH scenario_completion AS (
        SELECT ROUND(SUM(scenario_requirements.fulfilled)::NUMERIC / SUM(scenario_requirements.requirement)::NUMERIC * 100) percentage, user_position_id
        FROM scenario_requirements
        GROUP BY user_position_id
      )
      SELECT user_positions.id AS user_position_id, user_positions.user_id, user_positions.position, user_positions.start_date, user_positions.cat_upgrade,
        profiles.rank, profiles.full_name,
        scenario_completion.percentage
      FROM user_positions
      JOIN positions ON positions.position = user_positions.position
      JOIN profiles ON profiles.user_id = user_positions.user_id
      JOIN scenario_completion ON scenario_completion.user_position_id = user_positions.id
      WHERE end_date IS NULL AND approval_date IS NULL;
    `;
    let result = await client.query(query);
    const trainees = result.rows;

    if (result.rowCount === 0) {
      console.log("No trainees found");
      res.json({ status: "ok", message: "No trainees found" });
      return;
    }

    const data: any = { trainees };

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("Retrieved all trainees");
    res.json({ status: "ok", message: "Retrieved all trainees", data });
  } catch (err: any) {
    console.log(err);
    await client.query("ROLLBACK;");
    res
      .status(400)
      .json({ status: "error", message: "Failed to get user positions" });
  }
};

module.exports = {
  getTrainees,
};
