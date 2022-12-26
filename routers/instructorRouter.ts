import express from "express";
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getTrainees,
  getPersonnel,
} = require("../controllers/instructorController");

router.get("/get/trainees", auth, getTrainees);
router.get("/get/personnel", auth, getPersonnel);

module.exports = router;
