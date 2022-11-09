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
const getPositions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        let query = `SELECT id FROM users WHERE id = '${userId}';`;
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
      SELECT * FROM user_positions WHERE user_id = '${userId}';
    `;
        result = yield client.query(query);
        if (result.rowCount === 0) {
            res.json({ status: "ok", message: "User has no positions" });
            return;
        }
        const data = result.rows;
        res.json({ status: "ok", message: "Positions retrieved", data });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "Failed to retrieve position" });
    }
});
const createPosition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, position, start_date, end_date, approval_date, is_revalidation, } = req.body;
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
        // Insert new position
        query = `
      INSERT INTO user_positions (user_id, position, start_date, end_date, approval_date, is_revalidation)
      VALUES ('${user_id}', '${position}', '${start_date}', '${end_date}', '${approval_date}', ${is_revalidation});
    `;
        yield client.query(query);
        query = `SELECT id FROM user_positions WHERE user_id = '${user_id}' AND position = '${position}';`;
        result = yield client.query(query);
        const data = { id: result.rows[0].id };
        res.json({ status: "ok", message: "Position created", data });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "Failed to create position" });
    }
});
const updatePosition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({ status: "ok", message: "Position updated" });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "Failed to update position" });
    }
});
const deletePosition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({ status: "ok", message: "Position deleted" });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "Failed to delete position" });
    }
});
module.exports = {
    getPositions,
    createPosition,
    updatePosition,
    deletePosition,
};
