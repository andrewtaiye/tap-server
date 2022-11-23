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
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { fetchCall } = require("../utility/utility");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, confirm_password } = req.body;
        // Check if username already exists
        let query = `SELECT username FROM users WHERE username = '${username}'`;
        let result = yield client.query(query);
        if (result.rowCount > 0) {
            res.status(400).json({ status: "error", message: "Username taken" });
            return;
        }
        // Check if passwords match
        if (password !== confirm_password) {
            res.json({ status: "error", message: "Passwords do not match" });
            return;
        }
        const hashedPassword = yield bcrypt.hash(password, 12);
        // Insert into database
        query = `
        INSERT INTO users (username, password)
        VALUES ('${username}', '${hashedPassword}')
        RETURNING id
      `;
        result = yield client.query(query);
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
        yield client.query(query);
        const data = { access, refresh };
        res.json({
            status: "ok",
            message: "user created",
            data,
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
        const user = result.rows[0];
        // Check if password matches
        const match = yield bcrypt.compare(password, user.password);
        if (!match) {
            res
                .status(400)
                .json({ status: "error", message: "Invalid Username or Password" });
            return;
        }
        // Check if profile exists
        let url = process.env.REACT_APP_API_ENDPOINT + `profile/get/${user.id}`;
        let response = yield fetchCall(url);
        const payload = {
            userId: user.id,
            is_admin: user.is_admin,
            is_instructor: true,
            hasProfile: true,
        };
        if (response.status !== "ok") {
            payload.hasProfile = false;
        }
        // Check if user has a position where user is an instructor
        query = `SELECT id FROM user_positions WHERE user_id = '${user.id}' AND is_instructor = true;`;
        result = yield client.query(query);
        if (result.rowCount === 0) {
            payload.is_instructor = false;
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
        yield client.query(query);
        const data = {
            access,
            refresh,
        };
        res.json({
            status: "ok",
            message: "Login successful",
            data,
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(400).json({ status: "error", message: "Failed to login" });
    }
});
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        const { password, confirm_password } = req.body;
        // Check if user exists
        let query = `SELECT * FROM users WHERE id = '${user_id}';`;
        let result = yield client.query(query);
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
        const hashedPassword = yield bcrypt.hash(password, 12);
        query = `UPDATE users SET password = '${hashedPassword}' WHERE id = '${user_id}';`;
        yield client.query(query);
        const data = {};
        if (req.newToken) {
            data.access = req.newToken;
        }
        console.log("Password updated");
        res.json({ status: "ok", message: "Password updated", data });
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
        const { user_id } = req.params;
        // Check if user exists
        let query = `SELECT id FROM users WHERE id = '${user_id}';`;
        let result = yield client.query(query);
        if (result.rowCount === 0) {
            console.log("Error: User does not exist");
            res
                .status(400)
                .json({ status: "error", message: "Failed to delete user" });
            return;
        }
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
        console.error(err.message);
        res.status(400).json({ status: "error", message: "Failed to delete user" });
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        const decoded = jwt.decode(token, process.env.ACCESS_SECRET);
        let query = `DELETE FROM tokens WHERE id = '${decoded.jti}' OR parent_id = '${decoded.jti}';`;
        yield client.query(query);
        console.log("Cleared tokens, logging out");
        res.json({ status: "ok", message: "Logged out" });
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
    logout,
};
