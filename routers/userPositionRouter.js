"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth = require("../middleware/auth");
const { getUserPositions, createUserPosition, updateUserPosition, deleteUserPosition, } = require("../controllers/userPositionController");
router.get("/get/:user_id", auth, getUserPositions);
router.put("/create", auth, createUserPosition);
router.patch("/update/:user_position_id", auth, updateUserPosition);
router.delete("/delete/:user_position_id", auth, deleteUserPosition);
module.exports = router;
