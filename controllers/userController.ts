require("dotenv").config;
import { Request, Response } from "express";
const client = require("../db/db");

const createUser = async (req: Request, res: Response) => {
  try {
    const { username, password, confirmPassword } = req.body;

    // Check if username already exists
    let query = `SELECT username FROM users WHERE username = '${username}'`;
    let result = await client.query(query);

    if (result.rowCount > 0) {
      res.status(400).json({ status: "error", message: "username taken" });
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      res.json({ status: "error", message: "passwords do not match" });
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
    res.status(400).json({ status: "error", message: "failed to create user" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const query = `SELECT * FROM users;`;
    const result = await client.query(query);
    console.log({ result });
    res.json({ status: "ok", message: "login successful" });
  } catch (err: any) {
    console.error(err.message);
    res.status(400).json({ status: "error", message: "failed to login" });
  }
};

const updatePassword = async (req: Request, res: Response) => {
  try {
    res.json({ status: "ok", message: "password updated" });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "failed to update password" });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    res.json({ status: "ok", message: "user deleted" });
  } catch (err: any) {
    console.error(err.message);
    res.status(400).json({ status: "error", message: "failed to delete user" });
  }
};

module.exports = {
  createUser,
  login,
  updatePassword,
  deleteUser,
};
