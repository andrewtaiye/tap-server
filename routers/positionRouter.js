"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth = require("../middleware/auth");
const { getPositions, createPosition, updatePosition, deletePosition, } = require("../controllers/positionController");
router.get("/get/:userId", auth, getPositions);
router.put("/create", auth, createPosition);
router.patch("/update/:positionId", auth, updatePosition);
router.delete("/delete/:positionId", auth, deletePosition);
module.exports = router;
