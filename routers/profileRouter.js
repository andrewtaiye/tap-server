"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { getProfile, createProfile, updateProfile, deleteProfile, } = require("../controllers/profileController");
router.get("/get/:userId", getProfile);
router.put("/create", createProfile);
router.patch("/update", updateProfile);
router.delete("/delete", deleteProfile);
module.exports = router;
