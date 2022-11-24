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
        res.status(400).json({ status: "error", message: "Failed to get flights" });
    }
});
const createRank = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        // Insert New Rank
        const { rank } = req.body;
        query = `INSERT INTO ranks VALUES ('${rank}');`;
        yield client.query(query);
        const data = {};
        if (req.newToken) {
            data.access = req.newToken;
        }
        console.log("Rank created");
        res.json({ status: "ok", message: "Rank created", data });
    }
    catch (err) {
        console.log("Error: Failed to create rank");
        res.status(400).json({ status: "error", message: "Failed to create rank" });
    }
});
const createPosition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        // Insert New Position
        const { position } = req.body;
        query = `INSERT INTO positions VALUES ('${position}');`;
        yield client.query(query);
        const data = {};
        if (req.newToken) {
            data.access = req.newToken;
        }
        console.log("Position created");
        res.json({ status: "ok", message: "Position created", data });
    }
    catch (err) {
        console.log("Error: Failed to create position");
        res
            .status(400)
            .json({ status: "error", message: "Failed to create position" });
    }
});
const createCat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        // Insert New CAT
        const { cat } = req.body;
        query = `INSERT INTO cats VALUES ('${cat}');`;
        yield client.query(query);
        const data = {};
        if (req.newToken) {
            data.access = req.newToken;
        }
        console.log("CAT created");
        res.json({ status: "ok", message: "CAT created", data });
    }
    catch (err) {
        console.log("Error: Failed to create CAT");
        res.status(400).json({ status: "error", message: "Failed to create CAT" });
    }
});
const createFlight = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        // Insert New Flight
        const { flight } = req.body;
        query = `INSERT INTO flights VALUES ('${flight}');`;
        yield client.query(query);
        const data = {};
        if (req.newToken) {
            data.access = req.newToken;
        }
        console.log("Flight created");
        res.json({ status: "ok", message: "Flight created", data });
    }
    catch (err) {
        console.log("Error: Failed to create flight");
        res
            .status(400)
            .json({ status: "error", message: "Failed to create flight" });
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
        yield client.query("ROLLBACK;");
        console.log(err);
        res.status(400).json({ status: "error", message: "Failed to update user" });
    }
});
const updateUserPosition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        result = yield client.query(query);
        const userPosition = {
            id: result.rows[0].id,
            position: result.rows[0].position,
            approval_date: result.rows[0].approval_date,
            is_instructor: result.rows[0].is_instructor,
        };
        const data = { userPosition };
        if (req.newToken) {
            data.access = req.newToken;
        }
        console.log("User position Updated");
        res.json({ status: "ok", message: "User position updated", data });
    }
    catch (err) {
        console.log(err);
        res
            .status(400)
            .json({ status: "error", message: "Failed to update user position" });
    }
});
const updateRank = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { rank } = req.params;
        const { newRank } = req.body;
        // Update rank
        query = `
      UPDATE ranks
      SET ranks = '${newRank}'
      WHERE ranks = '${rank}';
    `;
        yield client.query(query);
        const data = {};
        if (req.newToken) {
            data.access = req.newToken;
        }
        console.log("Rank Updated");
        res.json({ status: "ok", message: "Rank updated", data });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ status: "error", message: "Failed to update rank" });
    }
});
const updatePosition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { position } = req.params;
        const { newPosition } = req.body;
        // Update position
        query = `
      UPDATE positions
      SET positions = '${newPosition}'
      WHERE positions = '${position}';
    `;
        yield client.query(query);
        const data = {};
        if (req.newToken) {
            data.access = req.newToken;
        }
        console.log("Position Updated");
        res.json({ status: "ok", message: "Position updated", data });
    }
    catch (err) {
        console.log(err);
        res
            .status(400)
            .json({ status: "error", message: "Failed to update position" });
    }
});
const updateCat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { cat } = req.params;
        const { newCat } = req.body;
        // Update cat
        query = `
      UPDATE cats
      SET cats = '${newCat}'
      WHERE cats = '${cat}';
    `;
        yield client.query(query);
        const data = {};
        if (req.newToken) {
            data.access = req.newToken;
        }
        console.log("CAT Updated");
        res.json({ status: "ok", message: "CAT updated", data });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ status: "error", message: "Failed to update cat" });
    }
});
const updateFlight = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { flight } = req.params;
        const { newFlight } = req.body;
        // Update flight
        query = `
      UPDATE flights
      SET flights = '${newFlight}'
      WHERE flights = '${flight}';
    `;
        yield client.query(query);
        const data = {};
        if (req.newToken) {
            data.access = req.newToken;
        }
        console.log("Flight Updated");
        res.json({ status: "ok", message: "Flight updated", data });
    }
    catch (err) {
        console.log(err);
        res
            .status(400)
            .json({ status: "error", message: "Failed to update flight" });
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
        const { user_id } = req.params;
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
        yield client.query("ROLLBACK;");
        console.log(err);
        res.status(400).json({ status: "error", message: "Failed to delete user" });
    }
});
const deleteUserPosition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { user_position_id } = req.params;
        // Delete User_Positions, Assessments
        query = `
      DELETE FROM assessments WHERE user_position_id = '${user_position_id}';
      DELETE FROM user_positions WHERE id = '${user_position_id}';
    `;
        yield client.query(query);
        const data = {};
        if (req.newToken) {
            data.access = req.newToken;
        }
        console.log("User position deleted");
        res.json({ status: "ok", message: "User position deleted", data });
    }
    catch (err) {
        console.log(err);
        res
            .status(400)
            .json({ status: "error", message: "Failed to delete user position" });
    }
});
const deleteRank = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { rank } = req.params;
        // Delete rank
        query = `
      UPDATE profiles
      SET rank = null
      WHERE rank = '${rank}';

      DELETE FROM ranks WHERE rank = '${rank}';
    `;
        yield client.query(query);
        const data = {};
        if (req.newToken) {
            data.access = req.newToken;
        }
        console.log("Rank deleted");
        res.json({ status: "ok", message: "Rank deleted", data });
    }
    catch (err) {
        console.log("Error: Failed to delete rank");
        res.status(400).json({ status: "error", message: "Failed to delete rank" });
    }
});
const deletePosition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { position } = req.params;
        // Delete position
        query = `
      UPDATE user_positions
      SET position = null
      WHERE position = '${position}';

      DELETE FROM positions WHERE position = '${position}';
    `;
        yield client.query(query);
        const data = {};
        if (req.newToken) {
            data.access = req.newToken;
        }
        console.log("Position deleted");
        res.json({ status: "ok", message: "Position deleted", data });
    }
    catch (err) {
        console.log("Error: Failed to delete position");
        res
            .status(400)
            .json({ status: "error", message: "Failed to delete position" });
    }
});
const deleteCat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { cat } = req.params;
        // Delete cat
        query = `
      UPDATE profiles
      SET cat = null
      WHERE cat = '${cat}';

      DELETE FROM cats WHERE cat = '${cat}';
    `;
        yield client.query(query);
        const data = {};
        if (req.newToken) {
            data.access = req.newToken;
        }
        console.log("CAT deleted");
        res.json({ status: "ok", message: "CAT deleted", data });
    }
    catch (err) {
        console.log("Error: Failed to delete CAT");
        res.status(400).json({ status: "error", message: "Failed to delete CAT" });
    }
});
const deleteFlight = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { flight } = req.params;
        // Delete flight
        query = `
      UPDATE profiles
      SET flight = null
      WHERE flight = '${flight}';

      DELETE FROM flights WHERE flight = '${flight}';
    `;
        yield client.query(query);
        const data = {};
        if (req.newToken) {
            data.access = req.newToken;
        }
        console.log("Flight deleted");
        res.json({ status: "ok", message: "Flight deleted", data });
    }
    catch (err) {
        console.log("Error: Failed to delete flight");
        res
            .status(400)
            .json({ status: "error", message: "Failed to delete flight" });
    }
});
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
