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
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const enumTables = ["ranks", "flights", "cats", "positions"];
        let data = {};
        for (const table of enumTables) {
            let query = `SELECT * FROM ${table};`;
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
module.exports = router;
