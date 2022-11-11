"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth = require("../middleware/auth");
const { createUser, login, updatePassword, deleteUser, logout, } = require("../controllers/userController");
router.put("/create", createUser);
router.post("/login", login);
router.patch("/update/:userId", auth, updatePassword);
router.delete("/delete/:userId", auth, deleteUser);
router.post("/logout", logout);
module.exports = router;
