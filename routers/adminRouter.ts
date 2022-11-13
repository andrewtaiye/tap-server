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
  updateUsers,
} = require("../controllers/adminController");

router.get("/get/users", auth, getUsers);
router.get("/get/user-positions", auth, getUserPositions);
router.get("/get/ranks", auth, getRanks);
router.get("/get/positions", auth, getPositions);
router.get("/get/cats", auth, getCats);
router.get("/get/flights", auth, getFlights);
router.patch("/patch/users", auth, updateUsers);

module.exports = router;
