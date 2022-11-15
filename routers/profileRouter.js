"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth = require("../middleware/auth");
const { getProfile, createProfile, updateProfile, } = require("../controllers/profileController");
router.get("/get/:user_id", getProfile);
router.put("/create", auth, createProfile);
router.patch("/update/:user_id", auth, updateProfile);
module.exports = router;
