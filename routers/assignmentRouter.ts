import express from "express";
const router = express.Router();
const {
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} = require("../controllers/assignmentController");

router.get("/", getAssignment);
router.put("/create", createAssignment);
router.patch("/update", updateAssignment);
router.delete("/delete", deleteAssignment);

module.exports = router;
