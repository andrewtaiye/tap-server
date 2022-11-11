import express from "express";
const router = express.Router();
const {
  getAssessment,
  createAssessment,
  updateAssessment,
  deleteAssessment,
} = require("../controllers/assessmentController");

router.get("/get/:positionId", getAssessment);
router.put("/create", createAssessment);
router.patch("/update/:assessmentId", updateAssessment);
router.delete("/delete/:assessmentId", deleteAssessment);

module.exports = router;
