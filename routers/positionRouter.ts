import express from "express";
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getPositions,
  createPosition,
  updatePosition,
  deletePosition,
} = require("../controllers/positionController");

router.get("/get/:user_id", auth, getPositions);
router.put("/create", auth, createPosition);
router.patch("/update/:user_position_id", auth, updatePosition);
router.delete("/delete/:user_position_id", auth, deletePosition);

module.exports = router;
