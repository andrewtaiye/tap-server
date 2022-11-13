require("dotenv").config;
import { Request, Response } from "express";
const client = require("../db/db");

interface AdminRequest {
  decoded: {
    userId: string;
    is_admin: boolean;
    hasProfile: boolean;
    iat: number;
    exp: number;
    jti: string;
  };
  newToken: string;
}

const getUsers = async (req: AdminRequest, res: Response) => {
  try {
    // Check if user is admin
    const { userId: user_id } = req.decoded;

    let query = `SELECT is_admin FROM users WHERE id = '${user_id}';`;
    let result = await client.query(query);

    if (result.rowCount === 0 || result.rows[0].is_admin !== true) {
      res
        .status(400)
        .json({ status: "error", message: "User not authenticated" });
      return;
    }

    // Get Users
    query = `
            SELECT id, username, is_admin, profiles.rank, profiles.full_name
            FROM users
            JOIN profiles
            ON users.id = profiles.user_id
            ORDER BY profiles.full_name
        `;
    result = await client.query(query);

    const users = result.rows;
    const data: { users: any; access?: string } = { users };

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("Retrieved users");
    res.json({ status: "ok", message: "Retrieved users", data });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({ status: "error", message: "Failed to get users" });
  }
};

const getUserPositions = async (req: AdminRequest, res: Response) => {
  try {
    // Check if user is admin
    const { userId: user_id } = req.decoded;

    let query = `SELECT is_admin FROM users WHERE id = '${user_id}';`;
    let result = await client.query(query);

    if (result.rowCount === 0 || result.rows[0].is_admin !== true) {
      res
        .status(400)
        .json({ status: "error", message: "User not authenticated" });
      return;
    }
    // Get User Positions
    query = `
            SELECT id, position, approval_date, is_instructor, profiles.rank, profiles.full_name
            FROM user_positions
            JOIN profiles
            ON user_positions.user_id = profiles.user_id
            ORDER BY profiles.full_name
        `;
    result = await client.query(query);

    const userPositions = result.rows;
    const data: { userPositions: any; access?: string } = { userPositions };

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("Retrieved user positions");
    res.json({ status: "ok", message: "Retrieved user positions", data });
  } catch (err: any) {
    console.log(err);
    res
      .status(400)
      .json({ status: "error", message: "Failed to get user positions" });
  }
};

const getRanks = async (req: AdminRequest, res: Response) => {
  try {
    // Check if user is admin
    const { userId: user_id } = req.decoded;

    let query = `SELECT is_admin FROM users WHERE id = '${user_id}';`;
    let result = await client.query(query);

    if (result.rowCount === 0 || result.rows[0].is_admin !== true) {
      res
        .status(400)
        .json({ status: "error", message: "User not authenticated" });
      return;
    }

    // Get Ranks
    query = `
            SELECT *
            FROM ranks
            ORDER BY ranks
        `;
    result = await client.query(query);

    const ranks: string[] = [];
    for (const row of result.rows) {
      ranks.push(row.ranks);
    }

    const data: { ranks: any; access?: string } = { ranks };

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("Retrieved ranks");
    res.json({ status: "ok", message: "Retrieved ranks", data });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({ status: "error", message: "Failed to get ranks" });
  }
};

const getPositions = async (req: AdminRequest, res: Response) => {
  try {
    // Check if user is admin
    const { userId: user_id } = req.decoded;

    let query = `SELECT is_admin FROM users WHERE id = '${user_id}';`;
    let result = await client.query(query);

    if (result.rowCount === 0 || result.rows[0].is_admin !== true) {
      res
        .status(400)
        .json({ status: "error", message: "User not authenticated" });
      return;
    }

    // Get Positions
    query = `
              SELECT *
              FROM positions
              ORDER BY positions
          `;
    result = await client.query(query);

    const positions: string[] = [];
    for (const row of result.rows) {
      positions.push(row.positions);
    }

    const data: { positions: any; access?: string } = { positions };

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("Retrieved positions");
    res.json({ status: "ok", message: "Retrieved positions", data });
  } catch (err: any) {
    console.log(err);
    res
      .status(400)
      .json({ status: "error", message: "Failed to get positions" });
  }
};

const getCats = async (req: AdminRequest, res: Response) => {
  try {
    // Check if user is admin
    const { userId: user_id } = req.decoded;

    let query = `SELECT is_admin FROM users WHERE id = '${user_id}';`;
    let result = await client.query(query);

    if (result.rowCount === 0 || result.rows[0].is_admin !== true) {
      res
        .status(400)
        .json({ status: "error", message: "User not authenticated" });
      return;
    }

    // Get CATs
    query = `
            SELECT *
            FROM cats
            ORDER BY cats
        `;
    result = await client.query(query);

    const cats: string[] = [];
    for (const row of result.rows) {
      cats.push(row.cats);
    }

    const data: { cats: any; access?: string } = { cats };

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("Retrieved CATs");
    res.json({ status: "ok", message: "Retrieved CATs", data });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({ status: "error", message: "Failed to get CATs" });
  }
};

const getFlights = async (req: AdminRequest, res: Response) => {
  try {
    // Check if user is admin
    const { userId: user_id } = req.decoded;

    let query = `SELECT is_admin FROM users WHERE id = '${user_id}';`;
    let result = await client.query(query);

    if (result.rowCount === 0 || result.rows[0].is_admin !== true) {
      res
        .status(400)
        .json({ status: "error", message: "User not authenticated" });
      return;
    }

    // Get Flights
    query = `
            SELECT *
            FROM flights
            ORDER BY flights
        `;
    result = await client.query(query);

    const flights: string[] = [];
    for (const row of result.rows) {
      flights.push(row.flights);
    }

    const data: { flights: any; access?: string } = { flights };

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("Retrieved Flights");
    res.json({ status: "ok", message: "Retrieved Flights", data });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({ status: "error", message: "Failed to get Flights" });
  }
};

const updateUsers = async (req: AdminRequest, res: Response) => {
  try {
    // TODO: Finish update and delete, copy over to the rest of the tables

    // Check if user is admin
    const { userId: user_id } = req.decoded;

    let query = `SELECT is_admin FROM users WHERE id = '${user_id}';`;
    let result = await client.query(query);

    if (result.rowCount === 0 || result.rows[0].is_admin !== true) {
      res
        .status(400)
        .json({ status: "error", message: "User not authenticated" });
      return;
    }
  } catch (err: any) {
    console.log(err);
    res
      .status(400)
      .json({ status: "error", message: "Failed to update Users" });
  }
};

module.exports = {
  getUsers,
  getUserPositions,
  getRanks,
  getPositions,
  getCats,
  getFlights,
  updateUsers,
};
