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
const { fetchCall } = require("../utility/utility");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, confirmPassword } = req.body;
        // Check if username already exists
        let query = `SELECT username FROM users WHERE username = '${username}'`;
        let result = yield client.query(query);
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
        result = yield client.query(query);
        // Retrieve generated User ID
        query = `SELECT id FROM users WHERE username = '${username}'`;
        result = yield client.query(query);
        res.json({
            status: "ok",
            message: "user created",
            userId: result.rows[0].id,
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(400).json({ status: "error", message: "Failed to create user" });
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        // Check if username exists
        let query = `SELECT * FROM users WHERE username = '${username}'`;
        let result = yield client.query(query);
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
        let response = yield fetchCall(url);
        if (response.status === "ok") {
            res.json({
                status: "ok",
                message: "Login successful",
                userId: result.rows[0].id,
                hasProfile: true,
            });
        }
        else {
            res.json({
                status: "ok",
                message: "Login successful, no profile",
                userId: result.rows[0].id,
                hasProfile: false,
            });
        }
    }
    catch (err) {
        console.error(err.message);
        res.status(400).json({ status: "error", message: "Failed to login" });
    }
});
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({ status: "ok", message: "Password updated" });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "Failed to update password" });
    }
});
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({ status: "ok", message: "User deleted" });
    }
    catch (err) {
        console.error(err.message);
        res.status(400).json({ status: "error", message: "Failed to delete user" });
    }
});
module.exports = {
    createUser,
    login,
    updatePassword,
    deleteUser,
};
