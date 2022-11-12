import express from "express";
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getUsers,
  getUserPositions,
  getRanks,
  getPositions,
  getCats,
  getFlights,
} = require("../controllers/adminController");

router.get("/get/users", getUsers);
router.get("/get/user-positions", getUserPositions);
router.get("/get/ranks", getRanks);
router.get("/get/positions", getPositions);
router.get("/get/cats", getCats);
router.get("/get/flights", getFlights);

module.exports = router;
