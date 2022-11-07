"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config;
const getAssignment = (req, res) => {
    try {
        res.json({ status: "ok", message: "assignment retrieved" });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "failed to retrieve assignment" });
    }
};
const createAssignment = (req, res) => {
    try {
        res.json({ status: "ok", message: "assignment created" });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "failed to create assignment" });
    }
};
const updateAssignment = (req, res) => {
    try {
        res.json({ status: "ok", message: "assignment updated" });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "failed to update assignment" });
    }
};
const deleteAssignment = (req, res) => {
    try {
        res.json({ status: "ok", message: "assignment deleted" });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "failed to delete assignment" });
    }
};
module.exports = {
    getAssignment,
    createAssignment,
    updateAssignment,
    deleteAssignment,
};
