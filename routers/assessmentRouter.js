"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth = require("../middleware/auth");
const { getAssessment, createAssessment, updateAssessment, deleteAssessment, } = require("../controllers/assessmentController");
router.get("/get/:user_position_id", auth, getAssessment);
router.put("/create/:user_position_id", auth, createAssessment);
router.patch("/update/:assessment_id", auth, updateAssessment);
router.delete("/delete/:assessment_id", auth, deleteAssessment);
module.exports = router;
