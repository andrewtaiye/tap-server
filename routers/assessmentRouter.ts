import express from "express";
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getAssessment,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  getScenarios,
  getAssessmentScenarios,
} = require("../controllers/assessmentController");

router.get("/get/:user_position_id", auth, getAssessment);
router.put("/create/:user_position_id", auth, createAssessment);
router.patch("/update/:assessment_id", auth, updateAssessment);
router.delete(
  "/delete/:user_position_id/:assessment_id",
  auth,
  deleteAssessment
);
router.get("/get/scenarios/:position", auth, getScenarios);
router.get(
  "/get/assessment_scenarios/:position/:assessment_id",
  auth,
  getAssessmentScenarios
);

module.exports = router;
