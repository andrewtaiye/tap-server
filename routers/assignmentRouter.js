"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { getAssignment, createAssignment, updateAssignment, deleteAssignment, } = require("../controllers/assignmentController");
router.get("/", getAssignment);
router.put("/create", createAssignment);
router.patch("/update", updateAssignment);
router.delete("/delete", deleteAssignment);
module.exports = router;
