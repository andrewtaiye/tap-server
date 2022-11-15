require("dotenv").config;
import { Request, Response } from "express";
const client = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { fetchCall } = require("../utility/utility");

interface UserRequest extends Request {
  newToken?: string;
}

const createUser = async (req: UserRequest, res: Response) => {
  try {
    const { username, password, confirm_password } = req.body;

    // Check if username already exists
    let query = `SELECT username FROM users WHERE username = '${username}'`;
    let result = await client.query(query);

    if (result.rowCount > 0) {
      res.status(400).json({ status: "error", message: "Username taken" });
      return;
    }

    // Check if passwords match
    if (password !== confirm_password) {
      res.json({ status: "error", message: "Passwords do not match" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert into database
    query = `
        INSERT INTO users (username, password)
        VALUES ('${username}', '${hashedPassword}')
        RETURNING id
      `;
    result = await client.query(query);

    const payload = {
      userId: result.rows[0].id,
      is_admin: false,
      hasProfile: false,
    };

    const accessId = uuidv4();
    const access = jwt.sign(payload, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: accessId,
    });

    const refreshId = uuidv4();
    const refresh = jwt.sign(payload, process.env.REFRESH_SECRET, {
      expiresIn: "30d",
      jwtid: refreshId,
    });

    query = `
      INSERT INTO tokens VALUES ('${accessId}', 'access', null);
      INSERT INTO tokens VALUES ('${refreshId}', 'refresh', '${accessId}');
    `;
    await client.query(query);

    const data: any = { access, refresh };

    res.json({
      status: "ok",
      message: "user created",
      data,
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(400).json({ status: "error", message: "Failed to create user" });
  }
};

const login = async (req: UserRequest, res: Response) => {
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
    const match = await bcrypt.compare(password, result.rows[0].password);
    if (!match) {
      res
        .status(400)
        .json({ status: "error", message: "Invalid Username or Password" });
      return;
    }

    // Check if profile exists
    let url =
      process.env.REACT_APP_API_ENDPOINT + `profile/get/${result.rows[0].id}`;
    let response = await fetchCall(url);

    const payload = {
      userId: result.rows[0].id,
      is_admin: result.rows[0].is_admin,
      hasProfile: true,
    };

    if (response.status !== "ok") {
      payload.hasProfile = false;
    }

    const accessId = uuidv4();
    const access = jwt.sign(payload, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: accessId,
    });

    const refreshId = uuidv4();
    const refresh = jwt.sign(payload, process.env.REFRESH_SECRET, {
      expiresIn: "30d",
      jwtid: refreshId,
    });

    query = `
      INSERT INTO tokens VALUES ('${accessId}', 'access', null);
      INSERT INTO tokens VALUES ('${refreshId}', 'refresh', '${accessId}');
    `;
    await client.query(query);

    const data = {
      access,
      refresh,
    };

    res.json({
      status: "ok",
      message: "Login successful",
      data,
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(400).json({ status: "error", message: "Failed to login" });
  }
};

const updatePassword = async (req: UserRequest, res: Response) => {
  try {
    const { user_id } = req.params;
    const { password, confirm_password } = req.body;

    // Check if user exists
    let query = `SELECT * FROM users WHERE id = '${user_id}';`;
    let result = await client.query(query);

    if (result.rowCount === 0) {
      console.log("Error: User does not exist");
      res
        .status(400)
        .json({ status: "error", message: "Failed to update password" });
      return;
    }

    // Check if password matches
    if (password !== confirm_password) {
      console.log("Error: Passwords do not match");
      res
        .status(400)
        .json({ status: "error", message: "Passwords do not match" });
      return;
    }

    // Update password
    const hashedPassword = await bcrypt.hash(password, 12);

    query = `UPDATE users SET password = '${hashedPassword}' WHERE id = '${user_id}';`;
    await client.query(query);

    const data: any = {};

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("Password updated");
    res.json({ status: "ok", message: "Password updated", data });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "Failed to update password" });
  }
};

const deleteUser = async (req: UserRequest, res: Response) => {
  try {
    const { user_id } = req.params;

    // Check if user exists
    let query = `SELECT id FROM users WHERE id = '${user_id}';`;
    let result = await client.query(query);

    if (result.rowCount === 0) {
      console.log("Error: User does not exist");
      res
        .status(400)
        .json({ status: "error", message: "Failed to delete user" });
      return;
    }

    // Retrieve user_position ID
    query = `SELECT id FROM user_positions WHERE user_id = '${user_id}';`;
    result = await client.query(query);

    let user_position_delete_query = "";

    for (const position of result.rows) {
      user_position_delete_query += `DELETE FROM assessments WHERE user_position_id = '${position.id}';`;
    }

    // Delete User, Profile, User_Positions, Assessments
    query = `
      BEGIN;
        ${user_position_delete_query}
        DELETE FROM user_positions WHERE user_id = '${user_id}';
        DELETE FROM profiles WHERE user_id = '${user_id}';
        DELETE FROM users WHERE id = '${user_id}';
      COMMIT;
    `;
    await client.query(query);

    const data: any = {};

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("User Deleted");
    res.json({ status: "ok", message: "User deleted", data });
  } catch (err: any) {
    await client.query("ROLLBACK;");
    console.error(err.message);
    res.status(400).json({ status: "error", message: "Failed to delete user" });
  }
};

const logout = async (req: UserRequest, res: Response) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const decoded = jwt.decode(token, process.env.ACCESS_SECRET);

    let query = `DELETE FROM tokens WHERE id = '${decoded.jti}' OR parent_id = '${decoded.jti}';`;
    await client.query(query);

    console.log("Cleared tokens, logging out");
    res.json({ status: "ok", message: "Logged out" });
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
  logout,
};
