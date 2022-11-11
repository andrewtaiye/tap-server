require("dotenv").config;
import { Request, Response } from "express";
const { fetchCall } = require("../utility/utility");
const client = require("../db/db");

const getProfile = async (req: Request, res: Response) => {
  try {
    const { userId: user_id } = req.params;

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

    query = `
      SELECT *, users.username FROM profiles
      JOIN users
      ON profiles.user_id = users.id
      WHERE user_id = '${user_id}';
    `;
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
    VALUES ('${userId}', '${rank}', '${full_name}', ${date_of_birth}, '${id_number}', ${enlistmentDate}, ${postInDate}, '${flight}', '${cat}');`;
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
    const {
      date_of_birth,
      id_number,
      date_accepted,
      reporting_date,
      flight,
      cat,
      password,
      confirm_password,
    } = req.body;
    const { userId: user_id } = req.params;

    // Check if user exists
    let query = `SELECT id FROM users WHERE id = '${user_id}';`;
    let result = await client.query(query);

    if (result.rowCount === 0) {
      console.log("Error: User does not exist");
      res
        .status(400)
        .json({ status: "error", message: "Failed to update profile" });
      return;
    }

    // Check if passwords match
    if (password !== confirm_password) {
      console.log("Error: Passwords do not match");
      res
        .status(400)
        .json({ status: "error", message: "Passwords do not match" });
      return;
    }

    // Update user profile
    query = `
    UPDATE profiles
    SET date_of_birth = ${date_of_birth}, id_number = '${id_number}', date_accepted = ${date_accepted}, reporting_date = ${reporting_date}, flight = '${flight}', cat = '${cat}'
    WHERE user_id = '${user_id}';
    `;
    await client.query(query);

    // Update user password
    let url = `http://127.0.0.1:5001/user/update/${user_id}`;
    let response = await fetchCall(url, "PATCH", {
      password,
      confirm_password,
    });

    if (response.status !== "ok") {
      console.log("Error: ", response.message);
      res
        .status(400)
        .json({ status: "error", message: "Failed to update profile" });
      return;
    }

    console.log("Profile updated");
    res.json({ status: "ok", message: "Profile updated" });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "Failed to update profile" });
  }
};

module.exports = {
  getProfile,
  createProfile,
  updateProfile,
};
