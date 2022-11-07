import express from "express";
const router = express.Router();
const {
  getPosition,
  createPosition,
  updatePosition,
  deletePosition,
} = require("../controllers/positionController");

router.get("/", getPosition);
router.put("/create", createPosition);
router.patch("/update", updatePosition);
router.delete("/delete", deletePosition);

module.exports = router;
