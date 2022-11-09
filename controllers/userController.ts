require("dotenv").config;
import { Request, Response } from "express";
const client = require("../db/db");
const { fetchCall } = require("../utility/utility");

const createUser = async (req: Request, res: Response) => {
  try {
    const { username, password, confirmPassword } = req.body;

    // Check if username already exists
    let query = `SELECT username FROM users WHERE username = '${username}'`;
    let result = await client.query(query);

    if (result.rowCount > 0) {
      res.status(400).json({ status: "error", message: "Username taken" });
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      res.json({ status: "error", message: "Passwords do not match" });
      return;
    }

    // Insert into database
    query = `
      INSERT INTO users (username, password)
      VALUES ('${username}', '${password}')
      `;
    result = await client.query(query);

    // Retrieve generated User ID
    query = `SELECT id FROM users WHERE username = '${username}'`;
    result = await client.query(query);

    res.json({
      status: "ok",
      message: "user created",
      userId: result.rows[0].id,
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(400).json({ status: "error", message: "Failed to create user" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Check if username exists
    let query = `SELECT * FROM users WHERE username = '${username}'`;
    let result = await client.query(query);

    if (result.rowCount === 0) {
      res
        .status(400)
        .json({ status: "error", message: "Invalid Username or Password" });
      return;
    }

    // Check if password matches
    if (password !== result.rows[0].password) {
      res
        .status(400)
        .json({ status: "error", message: "Invalid Username or Password" });
      return;
    }

    // Check if profile exists
    let url = `http://127.0.0.1:5001/profile/get/${result.rows[0].id}`;
    let response = await fetchCall(url);

    if (response.status === "ok") {
      res.json({
        status: "ok",
        message: "Login successful",
        userId: result.rows[0].id,
        hasProfile: true,
      });
    } else {
      res.json({
        status: "ok",
        message: "Login successful, no profile",
        userId: result.rows[0].id,
        hasProfile: false,
      });
    }
  } catch (err: any) {
    console.error(err.message);
    res.status(400).json({ status: "error", message: "Failed to login" });
  }
};

const updatePassword = async (req: Request, res: Response) => {
  try {
    res.json({ status: "ok", message: "Password updated" });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "Failed to update password" });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    res.json({ status: "ok", message: "User deleted" });
  } catch (err: any) {
    console.error(err.message);
    res.status(400).json({ status: "error", message: "Failed to delete user" });
  }
};

module.exports = {
  createUser,
  login,
  updatePassword,
  deleteUser,
};
