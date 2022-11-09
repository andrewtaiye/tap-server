require("dotenv").config;
import { Request, Response } from "express";
const client = require("../db/db");

const getProfile = async (req: Request, res: Response) => {
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

    query = `
      SELECT *, users.username FROM profiles
      JOIN users
      ON profiles.user_id = users.id
      WHERE user_id = '${userId}'
    ;`;
    result = await client.query(query);

    // Check if profile exists
    if (result.rowCount === 0) {
      console.log("Error: Profile does not exist");
      res
        .status(400)
        .json({ status: "error", message: "Failed to retrieve profile" });
      return;
    }

    const data = result.rows[0];

    res.json({ status: "ok", message: "Profile retrieved", data });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "Failed to retrieve profile" });
  }
};

const createProfile = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      rank,
      full_name,
      date_of_birth,
      id_number,
      enlistmentDate,
      postInDate,
      flight,
      cat,
    } = req.body;

    if (enlistmentDate < date_of_birth) {
      res.status(400).json({
        status: "error",
        message: "Enlistment Date cannot be before Date of Birth",
      });
      return;
    }

    if (postInDate < enlistmentDate) {
      res.status(400).json({
        status: "error",
        message: "Post-In Date cannot be before Enlistment Date",
      });
      return;
    }

    let query = `
    INSERT INTO profiles (user_id, rank, full_name, date_of_birth, id_number, date_accepted, reporting_date, flight, cat)
    VALUES ('${userId}', '${rank}', '${full_name}', '${date_of_birth}', '${id_number}', '${enlistmentDate}', '${postInDate}', '${flight}', '${cat}');`;
    await client.query(query);

    res.json({ status: "ok", message: "Profile created" });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "Failed to create profile" });
  }
};

const updateProfile = async (req: Request, res: Response) => {
  try {
    res.json({ status: "ok", message: "Profile updated" });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "Failed to update profile" });
  }
};

const deleteProfile = async (req: Request, res: Response) => {
  try {
    res.json({ status: "ok", message: "Profile deleted" });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "Failed to delete profile" });
  }
};

module.exports = {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
};
