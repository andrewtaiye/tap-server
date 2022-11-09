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
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({ status: "ok", message: "profile retrieved" });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "failed to retrieve profile" });
    }
});
const createProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, rank, fullName, dateOfBirth, idNumber, enlistmentDate, postInDate, flight, cat, } = req.body;
        if (enlistmentDate < dateOfBirth) {
            res
                .status(400)
                .json({
                status: "error",
                message: "Enlistment Date cannot be before Date of Birth",
            });
            return;
        }
        if (postInDate < enlistmentDate) {
            res
                .status(400)
                .json({
                status: "error",
                message: "Post-In Date cannot be before Enlistment Date",
            });
            return;
        }
        // let query = `
        // INSERT INTO profiles (user_id, rank, full_name, date_of_birth, id_number, date_accepted, reporting_date, flight, cat)
        // VALUES ('${userId}', '${rank}', '${fullName}', '${dateOfBirth}', '${idNumber}', '${enlistmentDate}', '${postInDate}', '${flight}', '${cat}');`;
        // await client.query(query);
        res.json({ status: "ok", message: "profile created" });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "failed to create profile" });
    }
});
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({ status: "ok", message: "profile updated" });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "failed to update profile" });
    }
});
const deleteProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({ status: "ok", message: "profile deleted" });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "failed to delete profile" });
    }
});
module.exports = {
    getProfile,
    createProfile,
    updateProfile,
    deleteProfile,
};
