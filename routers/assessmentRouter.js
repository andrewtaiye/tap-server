"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { getAssessment, createAssessment, updateAssessment, deleteAssessment, } = require("../controllers/assessmentController");
router.get("/get/:positionId", getAssessment);
router.put("/create", createAssessment);
router.patch("/update", updateAssessment);
router.delete("/delete", deleteAssessment);
module.exports = router;
