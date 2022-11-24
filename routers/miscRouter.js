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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const client = require("../db/db");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
router.get("/enum", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const enumTables = ["rank", "flight", "cat", "position"];
        let data = {};
        for (const table of enumTables) {
            let query = `SELECT ${table} FROM ${table}s ORDER BY ${table};`;
            let result = yield client.query(query);
            const rowArray = result.rows;
            for (let i = 0; i < rowArray.length; i++) {
                rowArray[i] = rowArray[i][table];
            }
            data[table] = rowArray;
        }
        res.json({ status: "ok", message: "Retrieved default values", data });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "Failed to get default values" });
    }
}));
router.post("/refresh", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refresh } = req.body;
        const decoded = jwt.verify(refresh, process.env.REFRESH_SECRET);
        const payload = {
            userId: decoded.userId,
            is_admin: decoded.is_admin,
            is_instructor: decoded.is_instructor,
            hasProfile: decoded.hasProfile,
        };
        const accessId = uuidv4();
        const access = jwt.sign(payload, process.env.ACCESS_SECRET, {
            expiresIn: "20m",
            jwtid: accessId,
        });
        const data = { access };
        let query = `
      DELETE FROM tokens WHERE id = (SELECT parent_id FROM tokens WHERE id = '${decoded.jti}');
      INSERT INTO tokens VALUES ('${accessId}', 'access', null);
      UPDATE tokens SET parent_id = '${accessId}' WHERE id = '${decoded.jti}';
    `;
        yield client.query(query);
        console.log("Token refreshed");
        res.json({ status: "ok", message: "Token refreshed", data });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "Failed to refresh token" });
    }
}));
module.exports = router;
