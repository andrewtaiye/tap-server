import express from "express";
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getUserPositions,
  createUserPosition,
  updateUserPosition,
  deleteUserPosition,
} = require("../controllers/userPositionController");

router.get("/get/:user_id", auth, getUserPositions);
router.put("/create/:user_id", auth, createUserPosition);
router.patch("/update/:user_position_id", auth, updateUserPosition);
router.delete("/delete/:user_position_id", auth, deleteUserPosition);

module.exports = router;
