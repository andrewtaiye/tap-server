"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config;
const getPosition = (req, res) => {
    try {
        res.json({ status: "ok", message: "position retrieved" });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "failed to retrieve position" });
    }
};
const createPosition = (req, res) => {
    try {
        res.json({ status: "ok", message: "position created" });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "failed to create position" });
    }
};
const updatePosition = (req, res) => {
    try {
        res.json({ status: "ok", message: "position updated" });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "failed to update position" });
    }
};
const deletePosition = (req, res) => {
    try {
        res.json({ status: "ok", message: "position deleted" });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "failed to delete position" });
    }
};
module.exports = {
    getPosition,
    createPosition,
    updatePosition,
    deletePosition,
};
