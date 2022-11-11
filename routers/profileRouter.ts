import express from "express";
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getProfile,
  createProfile,
  updateProfile,
} = require("../controllers/profileController");

router.get("/get/:userId", getProfile);
router.put("/create", auth, createProfile);
router.patch("/update/:userId", auth, updateProfile);

module.exports = router;
