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
  createRank,
  updateUser,
  updateUserPosition,
  updateRank,
  deleteUser,
  deleteUserPosition,
  deleteRank,
} = require("../controllers/adminController");

router.get("/get/users", auth, getUsers);
router.get("/get/user-positions", auth, getUserPositions);
router.get("/get/ranks", auth, getRanks);
router.get("/get/positions", auth, getPositions);
router.get("/get/cats", auth, getCats);
router.get("/get/flights", auth, getFlights);
router.put("/put/rank", auth, createRank);
router.patch("/patch/users/:userId", auth, updateUser);
router.patch("/patch/user-positions/:positionId", auth, updateUserPosition);
router.patch("/patch/ranks/:rank", auth, updateRank);
router.delete("/delete/users/:userId", auth, deleteUser);
router.delete("/delete/user-positions/:positionId", auth, deleteUserPosition);
router.delete("/delete/ranks/:rank", auth, deleteRank);

module.exports = router;
