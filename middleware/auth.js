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
require("dotenv").config();
const client = require("../db/db");
const jwt = require("jsonwebtoken");
const { fetchCall } = require("../utility/utility");
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        // Check if a token was sent from front-end
        if (!token) {
            console.log("Error: Missing token");
            res.status(400).json({ status: "authErr", message: "Missing token" });
            return;
        }
        const decoded = jwt.decode(token);
        // Check if token exists in database
        let query = `SELECT id, type FROM tokens WHERE id = '${decoded.jti}';`;
        let result = yield client.query(query);
        if (result.rowCount === 0) {
            console.log("Error: Invalid token");
            res.status(400).json({ status: "authErr", message: "Invalid token" });
            return;
        }
        if (result.rows[0].type === "access") {
            jwt.verify(token, process.env.ACCESS_SECRET);
            req.decoded = decoded;
            console.log("Authenticated");
            next();
            return;
        }
        if (result.rows[0].type === "refresh") {
            jwt.verify(token, process.env.REFRESH_SECRET);
            let url = process.env.REACT_APP_API_ENDPOINT + `misc/refresh`;
            let body = { refresh: token };
            let response = yield fetchCall(url, "", "POST", body);
            req.newToken = response.data.access;
            req.decoded = decoded;
            console.log("Authenticated");
            next();
            return;
        }
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "authErr", message: "Authorization failed" });
    }
});
module.exports = auth;
