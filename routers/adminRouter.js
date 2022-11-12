"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth = require("../middleware/auth");
const { getUsers, getUserPositions, getRanks, getPositions, getCats, getFlights, } = require("../controllers/adminController");
router.get("/get/users", getUsers);
router.get("/get/user-positions", getUserPositions);
router.get("/get/ranks", getRanks);
router.get("/get/positions", getPositions);
router.get("/get/cats", getCats);
router.get("/get/flights", getFlights);
module.exports = router;
