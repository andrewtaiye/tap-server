import express from "express";
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getProfile,
  createProfile,
  updateProfile,
} = require("../controllers/profileController");

router.get("/get/:user_id", getProfile);
router.put("/create", auth, createProfile);
router.patch("/update/:user_id", auth, updateProfile);

module.exports = router;
