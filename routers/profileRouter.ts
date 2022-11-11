import express from "express";
const router = express.Router();
const {
  getProfile,
  createProfile,
  updateProfile,
} = require("../controllers/profileController");

router.get("/get/:userId", getProfile);
router.put("/create", createProfile);
router.patch("/update/:userId", updateProfile);

module.exports = router;
