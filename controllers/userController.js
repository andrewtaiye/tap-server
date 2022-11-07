"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config;
const createUser = (req, res) => {
    try {
        res.json({ status: "ok", message: "user created" });
    }
    catch (err) {
        console.error(err.message);
        res.status(400).json({ status: "error", message: "failed to create user" });
    }
};
const login = (req, res) => {
    try {
        res.json({ status: "ok", message: "login successful" });
    }
    catch (err) {
        console.error(err.message);
        res.status(400).json({ status: "error", message: "failed to login" });
    }
};
const updatePassword = (req, res) => {
    try {
        res.json({ status: "ok", message: "password updated" });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "failed to update password" });
    }
};
const deleteUser = (req, res) => {
    try {
        res.json({ status: "ok", message: "user deleted" });
    }
    catch (err) {
        console.error(err.message);
        res.status(400).json({ status: "error", message: "failed to delete user" });
    }
};
module.exports = {
    createUser,
    login,
    updatePassword,
    deleteUser,
};
