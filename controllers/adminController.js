"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config;
const client = require("../db/db");
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if user is admin
        const { userId: admin_id } = req.decoded;
        let query = `SELECT is_admin FROM users WHERE id = '${admin_id}';`;
        let result = yield client.query(query);
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
        result = yield client.query(query);
        const users = result.rows;
        const data = { users };
        if (req.newToken) {
            data.access = req.newToken;
        }
        console.log("Retrieved users");
        res.json({ status: "ok", message: "Retrieved users", data });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ status: "error", message: "Failed to get users" });
    }
});
const getUserPositions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if user is admin
        const { userId: admin_id } = req.decoded;
        let query = `SELECT is_admin FROM users WHERE id = '${admin_id}';`;
        let result = yield client.query(query);
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
        result = yield client.query(query);
        const userPositions = result.rows;
        const data = { userPositions };
        if (req.newToken) {
            data.access = req.newToken;
        }
        console.log("Retrieved user positions");
        res.json({ status: "ok", message: "Retrieved user positions", data });
    }
    catch (err) {
        console.log(err);
        res
            .status(400)
            .json({ status: "error", message: "Failed to get user positions" });
    }
});
const getRanks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if user is admin
        const { userId: admin_id } = req.decoded;
        let query = `SELECT is_admin FROM users WHERE id = '${admin_id}';`;
        let result = yield client.query(query);
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
        result = yield client.query(query);
        const ranks = [];
        for (const row of result.rows) {
            ranks.push(row.ranks);
        }
        const data = { ranks };
        if (req.newToken) {
            data.access = req.newToken;
        }
        console.log("Retrieved ranks");
        res.json({ status: "ok", message: "Retrieved ranks", data });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ status: "error", message: "Failed to get ranks" });
    }
});
const getPositions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if user is admin
        const { userId: admin_id } = req.decoded;
        let query = `SELECT is_admin FROM users WHERE id = '${admin_id}';`;
        let result = yield client.query(query);
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
        result = yield client.query(query);
        const positions = [];
        for (const row of result.rows) {
            positions.push(row.positions);
        }
        const data = { positions };
        if (req.newToken) {
            data.access = req.newToken;
        }
        console.log("Retrieved positions");
        res.json({ status: "ok", message: "Retrieved positions", data });
    }
    catch (err) {
        console.log(err);
        res
            .status(400)
            .json({ status: "error", message: "Failed to get positions" });
    }
});
const getCats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if user is admin
        const { userId: admin_id } = req.decoded;
        let query = `SELECT is_admin FROM users WHERE id = '${admin_id}';`;
        let result = yield client.query(query);
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
        result = yield client.query(query);
        const cats = [];
        for (const row of result.rows) {
            cats.push(row.cats);
        }
        const data = { cats };
        if (req.newToken) {
            data.access = req.newToken;
        }
        console.log("Retrieved CATs");
        res.json({ status: "ok", message: "Retrieved CATs", data });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ status: "error", message: "Failed to get CATs" });
    }
});
const getFlights = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if user is admin
        const { userId: admin_id } = req.decoded;
        let query = `SELECT is_admin FROM users WHERE id = '${admin_id}';`;
        let result = yield client.query(query);
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
        result = yield client.query(query);
        const flights = [];
        for (const row of result.rows) {
            flights.push(row.flights);
        }
        const data = { flights };
        if (req.newToken) {
            data.access = req.newToken;
        }
        console.log("Retrieved Flights");
        res.json({ status: "ok", message: "Retrieved Flights", data });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ status: "error", message: "Failed to get Flights" });
    }
});
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Check if user is admin
        const { userId: admin_id } = req.decoded;
        let query = `SELECT is_admin FROM users WHERE id = '${admin_id}';`;
        let result = yield client.query(query);
        if (result.rowCount === 0 || result.rows[0].is_admin !== true) {
            res
                .status(400)
                .json({ status: "error", message: "User not authenticated" });
            return;
        }
        const { userId: user_id } = req.params;
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
        result = yield client.query(query);
        const user = {
            rank: (_a = result[3].rows[0]) === null || _a === void 0 ? void 0 : _a.rank,
            full_name: (_b = result[3].rows[0]) === null || _b === void 0 ? void 0 : _b.full_name,
            id: result[1].rows[0].id,
            username: result[1].rows[0].username,
            is_admin: result[1].rows[0].is_admin,
        };
        const data = { user };
        if (req.newToken) {
            data.access = req.newToken;
        }
        console.log("User Updated");
        res.json({ status: "ok", message: "User updated", data });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ status: "error", message: "Failed to update user" });
    }
});
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if user is admin
        const { userId: admin_id } = req.decoded;
        let query = `SELECT is_admin FROM users WHERE id = '${admin_id}';`;
        let result = yield client.query(query);
        if (result.rowCount === 0 || result.rows[0].is_admin !== true) {
            res
                .status(400)
                .json({ status: "error", message: "User not authenticated" });
            return;
        }
        const { userId: user_id } = req.params;
        // Retrieve user_position ID
        query = `SELECT id FROM user_positions WHERE user_id = '${user_id}';`;
        result = yield client.query(query);
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
        yield client.query(query);
        const data = {};
        if (req.newToken) {
            data.access = req.newToken;
        }
        console.log("User Deleted");
        res.json({ status: "ok", message: "User deleted", data });
    }
    catch (err) {
        console.log(err);
        res
            .status(400)
            .json({ status: "error", message: "Failed to update Users" });
    }
});
module.exports = {
    getUsers,
    getUserPositions,
    getRanks,
    getPositions,
    getCats,
    getFlights,
    updateUser,
    deleteUser,
};
