"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config;
const getProfile = (req, res) => {
    try {
        res.json({ status: "ok", message: "profile retrieved" });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "failed to retrieve profile" });
    }
};
const createProfile = (req, res) => {
    try {
        res.json({ status: "ok", message: "profile created" });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "failed to create profile" });
    }
};
const updateProfile = (req, res) => {
    try {
        res.json({ status: "ok", message: "profile updated" });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "failed to update profile" });
    }
};
const deleteProfile = (req, res) => {
    try {
        res.json({ status: "ok", message: "profile deleted" });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "failed to delete profile" });
    }
};
module.exports = {
    getProfile,
    createProfile,
    updateProfile,
    deleteProfile,
};
