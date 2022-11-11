import express from "express";
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getAssessment,
  createAssessment,
  updateAssessment,
  deleteAssessment,
} = require("../controllers/assessmentController");

router.get("/get/:positionId", auth, getAssessment);
router.put("/create", auth, createAssessment);
router.patch("/update/:assessmentId", auth, updateAssessment);
router.delete("/delete/:assessmentId", auth, deleteAssessment);

module.exports = router;
