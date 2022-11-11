import express from "express";
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getPositions,
  createPosition,
  updatePosition,
  deletePosition,
} = require("../controllers/positionController");

router.get("/get/:userId", auth, getPositions);
router.put("/create", auth, createPosition);
router.patch("/update/:positionId", auth, updatePosition);
router.delete("/delete/:positionId", auth, deletePosition);

module.exports = router;
