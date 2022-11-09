import express from "express";
const router = express.Router();
const {
  getPositions,
  createPosition,
  updatePosition,
  deletePosition,
} = require("../controllers/positionController");

router.get("/get/:userId", getPositions);
router.put("/create", createPosition);
router.patch("/update", updatePosition);
router.delete("/delete", deletePosition);

module.exports = router;
