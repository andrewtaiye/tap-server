import express from "express";
const router = express.Router();
const {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/profileController");

router.get("/get/:userId", getProfile);
router.put("/create", createProfile);
router.patch("/update", updateProfile);
router.delete("/delete", deleteProfile);

module.exports = router;
