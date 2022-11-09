"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { getPositions, createPosition, updatePosition, deletePosition, } = require("../controllers/positionController");
router.get("/get/:userId", getPositions);
router.put("/create", createPosition);
router.patch("/update", updatePosition);
router.delete("/delete", deletePosition);
module.exports = router;
