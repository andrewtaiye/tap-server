import express from "express";
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getAssessment,
  createAssessment,
  updateAssessment,
  deleteAssessment,
} = require("../controllers/assessmentController");

router.get("/get/:user_position_id", auth, getAssessment);
router.put("/create/:user_position_id", auth, createAssessment);
router.patch("/update/:assessment_id", auth, updateAssessment);
router.delete("/delete/:assessment_id", auth, deleteAssessment);

module.exports = router;
