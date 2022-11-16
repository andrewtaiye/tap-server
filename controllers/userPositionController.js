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
const getUserPositions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        let query = `SELECT id FROM users WHERE id = '${user_id}';`;
        let result = yield client.query(query);
        // Check if user exists
        if (result.rowCount === 0) {
            console.log("Error: User does not exist");
            res
                .status(400)
                .json({ status: "error", message: "Failed to retrieve profile" });
            return;
        }
        // Retrieve user positions
        query = `
      SELECT * FROM user_positions WHERE user_id = '${user_id}' ORDER BY start_date;
    `;
        result = yield client.query(query);
        if (result.rowCount === 0) {
            res.json({ status: "ok", message: "User has no positions" });
            return;
        }
        const positions = result.rows;
        const data = { positions };
        if (req.newToken) {
            data.access = req.newToken;
        }
        console.log("User positions retrieved");
        res.json({ status: "ok", message: "User positions retrieved", data });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "Failed to retrieve user positions" });
    }
});
const createUserPosition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, position, start_date, end_date, approval_date, is_revalidation, } = req.body;
        let query = `SELECT id FROM users WHERE id = '${user_id}';`;
        let result = yield client.query(query);
        // Check if user exists
        if (result.rowCount === 0) {
            console.log("Error: User does not exist");
            res
                .status(400)
                .json({ status: "error", message: "Failed to retrieve user" });
            return;
        }
        // Insert new position
        query = `
      INSERT INTO user_positions (user_id, position, start_date, end_date, approval_date, is_revalidation)
      VALUES ('${user_id}', '${position}', ${start_date},
      ${end_date ? end_date : "null"},
      ${approval_date ? approval_date : "null"}, ${is_revalidation})
      RETURNING id;
    `;
        result = yield client.query(query);
        const id = result.rows[0].id;
        const data = { id };
        if (req.newToken) {
            data.access = req.newToken;
        }
        res.json({ status: "ok", message: "User position created", data });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "Failed to create user position" });
    }
});
const updateUserPosition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { position, start_date, end_date, approval_date, is_revalidation } = req.body;
        const { user_position_id } = req.params;
        // Check if user-position exists
        let query = `SELECT id FROM user_positions WHERE id = '${user_position_id}';`;
        let result = yield client.query(query);
        if (result.rowCount === 0) {
            console.log("Error: User position does not exist");
            res
                .status(400)
                .json({ status: "error", message: "Failed to update user position" });
            return;
        }
        // Update position
        query = `
    UPDATE user_positions
    SET position = '${position}', start_date = ${start_date}, end_date = ${end_date}, approval_date = ${approval_date}, is_revalidation = '${is_revalidation}'
    WHERE id = '${user_position_id}';
    `;
        yield client.query(query);
        const data = {};
        if (req.newToken) {
            data.access = req.newToken;
        }
        res.json({ status: "ok", message: "User position updated", data });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "Failed to update user position" });
    }
});
const deleteUserPosition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_position_id } = req.params;
        let query = `DELETE FROM user_positions WHERE id = '${user_position_id}';`;
        yield client.query(query);
        const data = {};
        if (req.newToken) {
            data.access = req.newToken;
        }
        res.json({ status: "ok", message: "User position deleted", data });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "Failed to delete user position" });
    }
});
module.exports = {
    getUserPositions,
    createUserPosition,
    updateUserPosition,
    deleteUserPosition,
};
