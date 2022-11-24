require("dotenv").config;
import { Request, Response } from "express";
const client = require("../db/db");

interface AdminRequest extends Request {
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
    const { userId: admin_id } = req.decoded;

    let query = `SELECT is_admin FROM users WHERE id = '${admin_id}';`;
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
            LEFT JOIN profiles
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
    const { userId: admin_id } = req.decoded;

    let query = `SELECT is_admin FROM users WHERE id = '${admin_id}';`;
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
    const { userId: admin_id } = req.decoded;

    let query = `SELECT is_admin FROM users WHERE id = '${admin_id}';`;
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
    const { userId: admin_id } = req.decoded;

    let query = `SELECT is_admin FROM users WHERE id = '${admin_id}';`;
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
    const { userId: admin_id } = req.decoded;

    let query = `SELECT is_admin FROM users WHERE id = '${admin_id}';`;
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
    const { userId: admin_id } = req.decoded;

    let query = `SELECT is_admin FROM users WHERE id = '${admin_id}';`;
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
    res.status(400).json({ status: "error", message: "Failed to get flights" });
  }
};

const createRank = async (req: AdminRequest, res: Response) => {
  try {
    // Check if user is admin
    const { userId: admin_id } = req.decoded;

    let query = `SELECT is_admin FROM users WHERE id = '${admin_id}';`;
    let result = await client.query(query);

    if (result.rowCount === 0 || result.rows[0].is_admin !== true) {
      res
        .status(400)
        .json({ status: "error", message: "User not authenticated" });
      return;
    }

    // Insert New Rank
    const { rank } = req.body;

    query = `INSERT INTO ranks VALUES ('${rank}');`;
    await client.query(query);

    const data: any = {};

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("Rank created");
    res.json({ status: "ok", message: "Rank created", data });
  } catch (err: any) {
    console.log("Error: Failed to create rank");
    res.status(400).json({ status: "error", message: "Failed to create rank" });
  }
};

const createPosition = async (req: AdminRequest, res: Response) => {
  try {
    // Check if user is admin
    const { userId: admin_id } = req.decoded;

    let query = `SELECT is_admin FROM users WHERE id = '${admin_id}';`;
    let result = await client.query(query);

    if (result.rowCount === 0 || result.rows[0].is_admin !== true) {
      res
        .status(400)
        .json({ status: "error", message: "User not authenticated" });
      return;
    }

    // Insert New Position
    const { position } = req.body;

    query = `INSERT INTO positions VALUES ('${position}');`;
    await client.query(query);

    const data: any = {};

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("Position created");
    res.json({ status: "ok", message: "Position created", data });
  } catch (err: any) {
    console.log("Error: Failed to create position");
    res
      .status(400)
      .json({ status: "error", message: "Failed to create position" });
  }
};

const createCat = async (req: AdminRequest, res: Response) => {
  try {
    // Check if user is admin
    const { userId: admin_id } = req.decoded;

    let query = `SELECT is_admin FROM users WHERE id = '${admin_id}';`;
    let result = await client.query(query);

    if (result.rowCount === 0 || result.rows[0].is_admin !== true) {
      res
        .status(400)
        .json({ status: "error", message: "User not authenticated" });
      return;
    }

    // Insert New CAT
    const { cat } = req.body;

    query = `INSERT INTO cats VALUES ('${cat}');`;
    await client.query(query);

    const data: any = {};

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("CAT created");
    res.json({ status: "ok", message: "CAT created", data });
  } catch (err: any) {
    console.log("Error: Failed to create CAT");
    res.status(400).json({ status: "error", message: "Failed to create CAT" });
  }
};

const createFlight = async (req: AdminRequest, res: Response) => {
  try {
    // Check if user is admin
    const { userId: admin_id } = req.decoded;

    let query = `SELECT is_admin FROM users WHERE id = '${admin_id}';`;
    let result = await client.query(query);

    if (result.rowCount === 0 || result.rows[0].is_admin !== true) {
      res
        .status(400)
        .json({ status: "error", message: "User not authenticated" });
      return;
    }

    // Insert New Flight
    const { flight } = req.body;

    query = `INSERT INTO flights VALUES ('${flight}');`;
    await client.query(query);

    const data: any = {};

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("Flight created");
    res.json({ status: "ok", message: "Flight created", data });
  } catch (err: any) {
    console.log("Error: Failed to create flight");
    res
      .status(400)
      .json({ status: "error", message: "Failed to create flight" });
  }
};

const updateUser = async (req: AdminRequest, res: Response) => {
  try {
    // Check if user is admin
    const { userId: admin_id } = req.decoded;

    let query = `SELECT is_admin FROM users WHERE id = '${admin_id}';`;
    let result = await client.query(query);

    if (result.rowCount === 0 || result.rows[0].is_admin !== true) {
      res
        .status(400)
        .json({ status: "error", message: "User not authenticated" });
      return;
    }

    const { user_id } = req.params;
    const { rank, full_name, username, password, is_admin } = req.body;

    // Update User Profile in table Users and Profiles
    query = `
      BEGIN;
        UPDATE users
        SET
          username = '${username}',
          is_admin = ${is_admin}
          ${password !== "" ? `, password = '${password}'` : ""}
        WHERE id = '${user_id}'
        RETURNING id, username, is_admin;

        SAVEPOINT updated_user;
      
        UPDATE profiles
        SET rank = '${rank}', full_name = '${full_name}'
        WHERE user_id = '${user_id}'
        RETURNING rank, full_name;
      COMMIT;
    `;
    result = await client.query(query);
    const user = {
      rank: result[3].rows[0]?.rank,
      full_name: result[3].rows[0]?.full_name,
      id: result[1].rows[0].id,
      username: result[1].rows[0].username,
      is_admin: result[1].rows[0].is_admin,
    };

    const data: { user: any; access?: string } = { user };

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("User Updated");
    res.json({ status: "ok", message: "User updated", data });
  } catch (err: any) {
    await client.query("ROLLBACK;");
    console.log(err);
    res.status(400).json({ status: "error", message: "Failed to update user" });
  }
};

const updateUserPosition = async (req: AdminRequest, res: Response) => {
  try {
    // Check if user is admin
    const { userId: admin_id } = req.decoded;

    let query = `SELECT is_admin FROM users WHERE id = '${admin_id}';`;
    let result = await client.query(query);

    if (result.rowCount === 0 || result.rows[0].is_admin !== true) {
      res
        .status(400)
        .json({ status: "error", message: "User not authenticated" });
      return;
    }

    const { user_position_id } = req.params;
    const { position, approval_date, is_instructor } = req.body;

    // Update User Position
    query = `
      UPDATE user_positions
      SET
        position = '${position}',
        is_instructor = ${is_instructor}
        ${approval_date !== null ? `, approval_date = '${approval_date}'` : ""}
      WHERE id = '${user_position_id}'
      RETURNING id, position, approval_date, is_instructor;
    `;
    result = await client.query(query);
    const userPosition = {
      id: result.rows[0].id,
      position: result.rows[0].position,
      approval_date: result.rows[0].approval_date,
      is_instructor: result.rows[0].is_instructor,
    };

    const data: { userPosition: any; access?: string } = { userPosition };

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("User position Updated");
    res.json({ status: "ok", message: "User position updated", data });
  } catch (err: any) {
    console.log(err);
    res
      .status(400)
      .json({ status: "error", message: "Failed to update user position" });
  }
};

const updateRank = async (req: AdminRequest, res: Response) => {
  try {
    // Check if user is admin
    const { userId: admin_id } = req.decoded;

    let query = `SELECT is_admin FROM users WHERE id = '${admin_id}';`;
    let result = await client.query(query);

    if (result.rowCount === 0 || result.rows[0].is_admin !== true) {
      res
        .status(400)
        .json({ status: "error", message: "User not authenticated" });
      return;
    }

    const { rank } = req.params;
    const { newRank } = req.body;

    // Update rank
    query = `
      UPDATE ranks
      SET ranks = '${newRank}'
      WHERE ranks = '${rank}';
    `;
    await client.query(query);

    const data: any = {};

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("Rank Updated");
    res.json({ status: "ok", message: "Rank updated", data });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({ status: "error", message: "Failed to update rank" });
  }
};

const updatePosition = async (req: AdminRequest, res: Response) => {
  try {
    // Check if user is admin
    const { userId: admin_id } = req.decoded;

    let query = `SELECT is_admin FROM users WHERE id = '${admin_id}';`;
    let result = await client.query(query);

    if (result.rowCount === 0 || result.rows[0].is_admin !== true) {
      res
        .status(400)
        .json({ status: "error", message: "User not authenticated" });
      return;
    }

    const { position } = req.params;
    const { newPosition } = req.body;

    // Update position
    query = `
      UPDATE positions
      SET positions = '${newPosition}'
      WHERE positions = '${position}';
    `;
    await client.query(query);

    const data: any = {};

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("Position Updated");
    res.json({ status: "ok", message: "Position updated", data });
  } catch (err: any) {
    console.log(err);
    res
      .status(400)
      .json({ status: "error", message: "Failed to update position" });
  }
};

const updateCat = async (req: AdminRequest, res: Response) => {
  try {
    // Check if user is admin
    const { userId: admin_id } = req.decoded;

    let query = `SELECT is_admin FROM users WHERE id = '${admin_id}';`;
    let result = await client.query(query);

    if (result.rowCount === 0 || result.rows[0].is_admin !== true) {
      res
        .status(400)
        .json({ status: "error", message: "User not authenticated" });
      return;
    }

    const { cat } = req.params;
    const { newCat } = req.body;

    // Update cat
    query = `
      UPDATE cats
      SET cats = '${newCat}'
      WHERE cats = '${cat}';
    `;
    await client.query(query);

    const data: any = {};

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("CAT Updated");
    res.json({ status: "ok", message: "CAT updated", data });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({ status: "error", message: "Failed to update cat" });
  }
};

const updateFlight = async (req: AdminRequest, res: Response) => {
  try {
    // Check if user is admin
    const { userId: admin_id } = req.decoded;

    let query = `SELECT is_admin FROM users WHERE id = '${admin_id}';`;
    let result = await client.query(query);

    if (result.rowCount === 0 || result.rows[0].is_admin !== true) {
      res
        .status(400)
        .json({ status: "error", message: "User not authenticated" });
      return;
    }

    const { flight } = req.params;
    const { newFlight } = req.body;

    // Update flight
    query = `
      UPDATE flights
      SET flights = '${newFlight}'
      WHERE flights = '${flight}';
    `;
    await client.query(query);

    const data: any = {};

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("Flight Updated");
    res.json({ status: "ok", message: "Flight updated", data });
  } catch (err: any) {
    console.log(err);
    res
      .status(400)
      .json({ status: "error", message: "Failed to update flight" });
  }
};

const deleteUser = async (req: AdminRequest, res: Response) => {
  try {
    // Check if user is admin
    const { userId: admin_id } = req.decoded;

    let query = `SELECT is_admin FROM users WHERE id = '${admin_id}';`;
    let result = await client.query(query);

    if (result.rowCount === 0 || result.rows[0].is_admin !== true) {
      res
        .status(400)
        .json({ status: "error", message: "User not authenticated" });
      return;
    }

    const { user_id } = req.params;

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

    const data: { access?: string } = {};

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("User Deleted");
    res.json({ status: "ok", message: "User deleted", data });
  } catch (err: any) {
    await client.query("ROLLBACK;");
    console.log(err);
    res.status(400).json({ status: "error", message: "Failed to delete user" });
  }
};

const deleteUserPosition = async (req: AdminRequest, res: Response) => {
  try {
    // Check if user is admin
    const { userId: admin_id } = req.decoded;

    let query = `SELECT is_admin FROM users WHERE id = '${admin_id}';`;
    let result = await client.query(query);

    if (result.rowCount === 0 || result.rows[0].is_admin !== true) {
      res
        .status(400)
        .json({ status: "error", message: "User not authenticated" });
      return;
    }

    const { user_position_id } = req.params;

    // Delete User_Positions, Assessments
    query = `
      DELETE FROM assessments WHERE user_position_id = '${user_position_id}';
      DELETE FROM user_positions WHERE id = '${user_position_id}';
    `;
    await client.query(query);

    const data: { access?: string } = {};

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("User position deleted");
    res.json({ status: "ok", message: "User position deleted", data });
  } catch (err: any) {
    console.log(err);
    res
      .status(400)
      .json({ status: "error", message: "Failed to delete user position" });
  }
};

const deleteRank = async (req: AdminRequest, res: Response) => {
  try {
    // Check if user is admin
    const { userId: admin_id } = req.decoded;

    let query = `SELECT is_admin FROM users WHERE id = '${admin_id}';`;
    let result = await client.query(query);

    if (result.rowCount === 0 || result.rows[0].is_admin !== true) {
      res
        .status(400)
        .json({ status: "error", message: "User not authenticated" });
      return;
    }

    const { rank } = req.params;

    // Delete rank
    query = `
      UPDATE profiles
      SET rank = null
      WHERE rank = '${rank}';

      DELETE FROM ranks WHERE rank = '${rank}';
    `;
    await client.query(query);

    const data: any = {};

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("Rank deleted");
    res.json({ status: "ok", message: "Rank deleted", data });
  } catch (err: any) {
    console.log("Error: Failed to delete rank");
    res.status(400).json({ status: "error", message: "Failed to delete rank" });
  }
};

const deletePosition = async (req: AdminRequest, res: Response) => {
  try {
    // Check if user is admin
    const { userId: admin_id } = req.decoded;

    let query = `SELECT is_admin FROM users WHERE id = '${admin_id}';`;
    let result = await client.query(query);

    if (result.rowCount === 0 || result.rows[0].is_admin !== true) {
      res
        .status(400)
        .json({ status: "error", message: "User not authenticated" });
      return;
    }

    const { position } = req.params;

    // Delete position
    query = `
      UPDATE user_positions
      SET position = null
      WHERE position = '${position}';

      DELETE FROM positions WHERE position = '${position}';
    `;
    await client.query(query);

    const data: any = {};

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("Position deleted");
    res.json({ status: "ok", message: "Position deleted", data });
  } catch (err: any) {
    console.log("Error: Failed to delete position");
    res
      .status(400)
      .json({ status: "error", message: "Failed to delete position" });
  }
};

const deleteCat = async (req: AdminRequest, res: Response) => {
  try {
    // Check if user is admin
    const { userId: admin_id } = req.decoded;

    let query = `SELECT is_admin FROM users WHERE id = '${admin_id}';`;
    let result = await client.query(query);

    if (result.rowCount === 0 || result.rows[0].is_admin !== true) {
      res
        .status(400)
        .json({ status: "error", message: "User not authenticated" });
      return;
    }

    const { cat } = req.params;

    // Delete cat
    query = `
      UPDATE profiles
      SET cat = null
      WHERE cat = '${cat}';

      DELETE FROM cats WHERE cat = '${cat}';
    `;
    await client.query(query);

    const data: any = {};

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("CAT deleted");
    res.json({ status: "ok", message: "CAT deleted", data });
  } catch (err: any) {
    console.log("Error: Failed to delete CAT");
    res.status(400).json({ status: "error", message: "Failed to delete CAT" });
  }
};

const deleteFlight = async (req: AdminRequest, res: Response) => {
  try {
    // Check if user is admin
    const { userId: admin_id } = req.decoded;

    let query = `SELECT is_admin FROM users WHERE id = '${admin_id}';`;
    let result = await client.query(query);

    if (result.rowCount === 0 || result.rows[0].is_admin !== true) {
      res
        .status(400)
        .json({ status: "error", message: "User not authenticated" });
      return;
    }

    const { flight } = req.params;

    // Delete flight
    query = `
      UPDATE profiles
      SET flight = null
      WHERE flight = '${flight}';

      DELETE FROM flights WHERE flight = '${flight}';
    `;
    await client.query(query);

    const data: any = {};

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("Flight deleted");
    res.json({ status: "ok", message: "Flight deleted", data });
  } catch (err: any) {
    console.log("Error: Failed to delete flight");
    res
      .status(400)
      .json({ status: "error", message: "Failed to delete flight" });
  }
};

module.exports = {
  getUsers,
  getUserPositions,
  getRanks,
  getPositions,
  getCats,
  getFlights,
  createRank,
  createPosition,
  createCat,
  createFlight,
  updateUser,
  updateUserPosition,
  updateRank,
  updatePosition,
  updateCat,
  updateFlight,
  deleteUser,
  deleteUserPosition,
  deleteRank,
  deletePosition,
  deleteCat,
  deleteFlight,
};
