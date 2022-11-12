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
        const { userId: user_id } = req.decoded;
        let query = `SELECT is_admin FROM users WHERE id = '${user_id}';`;
        let result = yield client.query(query);
        if (result.rowCount === 0 || result.rows[0].is_admin !== true) {
            res
                .status(400)
                .json({ status: "error", message: "User not authenticated" });
            return;
        }
        query = `
            SELECT id, username, is_admin, profiles.rank, profiles.full_name
            FROM users
            JOIN profiles
            ON users.id = profiles.user_id
            ORDER BY profiles.full_name
        `;
        result = yield client.query(query);
        const users = result.rows;
        const data = { users };
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
        let query = `
            SELECT id, position, approval_date, is_instructor, profiles.rank, profiles.full_name
            FROM user_positions
            JOIN profiles
            ON user_positions.user_id = profiles.user_id
            ORDER BY profiles.full_name
        `;
        let result = yield client.query(query);
        const userPositions = result.rows;
        const data = { userPositions };
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
        let query = `
            SELECT *
            FROM ranks
            ORDER BY ranks
        `;
        let result = yield client.query(query);
        const ranks = [];
        for (const row of result.rows) {
            ranks.push(row.ranks);
        }
        const data = { ranks };
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
        let query = `
              SELECT *
              FROM positions
              ORDER BY positions
          `;
        let result = yield client.query(query);
        const positions = [];
        for (const row of result.rows) {
            positions.push(row.positions);
        }
        const data = { positions };
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
        let query = `
            SELECT *
            FROM cats
            ORDER BY cats
        `;
        let result = yield client.query(query);
        const cats = [];
        for (const row of result.rows) {
            cats.push(row.cats);
        }
        const data = { cats };
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
        let query = `
            SELECT *
            FROM flights
            ORDER BY flights
        `;
        let result = yield client.query(query);
        const flights = [];
        for (const row of result.rows) {
            flights.push(row.flights);
        }
        const data = { flights };
        console.log("Retrieved Flights");
        res.json({ status: "ok", message: "Retrieved Flights", data });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ status: "error", message: "Failed to get Flights" });
    }
});
module.exports = {
    getUsers,
    getUserPositions,
    getRanks,
    getPositions,
    getCats,
    getFlights,
};
