import express from "express";
const router = express.Router();
const {
  getAssessment,
  createAssessment,
  updateAssessment,
  deleteAssessment,
} = require("../controllers/assessmentController");

router.get("/get/:userId/:positionId", getAssessment);
router.put("/create", createAssessment);
router.patch("/update", updateAssessment);
router.delete("/delete", deleteAssessment);

module.exports = router;
