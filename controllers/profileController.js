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
const { fetchCall } = require("../utility/utility");
const client = require("../db/db");
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId: user_id } = req.params;
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
        query = `
      SELECT *, users.username FROM profiles
      JOIN users
      ON profiles.user_id = users.id
      WHERE user_id = '${user_id}';
    `;
        result = yield client.query(query);
        // Check if profile exists
        if (result.rowCount === 0) {
            console.log("Error: Profile does not exist");
            res
                .status(400)
                .json({ status: "error", message: "Failed to retrieve profile" });
            return;
        }
        const data = result.rows[0];
        res.json({ status: "ok", message: "Profile retrieved", data });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "Failed to retrieve profile" });
    }
});
const createProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, rank, full_name, date_of_birth, id_number, enlistmentDate, postInDate, flight, cat, } = req.body;
        if (enlistmentDate < date_of_birth) {
            res.status(400).json({
                status: "error",
                message: "Enlistment Date cannot be before Date of Birth",
            });
            return;
        }
        if (postInDate < enlistmentDate) {
            res.status(400).json({
                status: "error",
                message: "Post-In Date cannot be before Enlistment Date",
            });
            return;
        }
        let query = `
    INSERT INTO profiles (user_id, rank, full_name, date_of_birth, id_number, date_accepted, reporting_date, flight, cat)
    VALUES ('${userId}', '${rank}', '${full_name}', ${date_of_birth}, '${id_number}', ${enlistmentDate}, ${postInDate}, '${flight}', '${cat}');`;
        yield client.query(query);
        res.json({ status: "ok", message: "Profile created" });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "Failed to create profile" });
    }
});
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date_of_birth, id_number, date_accepted, reporting_date, flight, cat, password, confirm_password, } = req.body;
        const { userId: user_id } = req.params;
        // Check if user exists
        let query = `SELECT id FROM users WHERE id = '${user_id}';`;
        let result = yield client.query(query);
        if (result.rowCount === 0) {
            console.log("Error: User does not exist");
            res
                .status(400)
                .json({ status: "error", message: "Failed to update profile" });
            return;
        }
        // Check if passwords match
        if (password !== confirm_password) {
            console.log("Error: Passwords do not match");
            res
                .status(400)
                .json({ status: "error", message: "Passwords do not match" });
            return;
        }
        // Update user profile
        query = `
    UPDATE profiles
    SET date_of_birth = ${date_of_birth}, id_number = '${id_number}', date_accepted = ${date_accepted}, reporting_date = ${reporting_date}, flight = '${flight}', cat = '${cat}'
    WHERE user_id = '${user_id}';
    `;
        yield client.query(query);
        // Update user password
        let url = `http://127.0.0.1:5001/user/update/${user_id}`;
        let response = yield fetchCall(url, "PATCH", {
            password,
            confirm_password,
        });
        if (response.status !== "ok") {
            console.log("Error: ", response.message);
            res
                .status(400)
                .json({ status: "error", message: "Failed to update profile" });
            return;
        }
        console.log("Profile updated");
        res.json({ status: "ok", message: "Profile updated" });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "Failed to update profile" });
    }
});
module.exports = {
    getProfile,
    createProfile,
    updateProfile,
};
