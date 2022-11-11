"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        if (!token) {
            console.log("Error: Missing token");
            res.status(400).json({ status: "error", message: "Missing Token" });
            return;
        }
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
        req.decoded = decoded;
        console.log("Authenticated");
        next();
    }
    catch (err) {
        console.error(err.message);
        res.status(400).json({ status: "error", message: "Authorization failed" });
    }
};
module.exports = auth;
