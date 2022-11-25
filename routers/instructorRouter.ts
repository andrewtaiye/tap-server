import express from "express";
const router = express.Router();
const auth = require("../middleware/auth");
const { getTrainees } = require("../controllers/instructorController");

router.get("/get/trainees", auth, getTrainees);

module.exports = router;
