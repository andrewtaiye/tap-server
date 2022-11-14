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
  createPosition,
  createCat,
  createFlight,
  updateUser,
  updateUserPosition,
  updateRank,
  updatePosition,
  updateCat,
  updateFlight,
  deleteUser,
  deleteUserPosition,
  deleteRank,
  deletePosition,
  deleteCat,
  deleteFlight,
} = require("../controllers/adminController");

router.get("/get/users", auth, getUsers);
router.get("/get/user-positions", auth, getUserPositions);
router.get("/get/ranks", auth, getRanks);
router.get("/get/positions", auth, getPositions);
router.get("/get/cats", auth, getCats);
router.get("/get/flights", auth, getFlights);
router.put("/put/rank", auth, createRank);
router.put("/put/position", auth, createPosition);
router.put("/put/cat", auth, createCat);
router.put("/put/flight", auth, createFlight);
router.patch("/patch/users/:userId", auth, updateUser);
router.patch("/patch/user-positions/:positionId", auth, updateUserPosition);
router.patch("/patch/ranks/:rank", auth, updateRank);
router.patch("/patch/positions/:position", auth, updatePosition);
router.patch("/patch/cats/:cat", auth, updateCat);
router.patch("/patch/flights/:flight", auth, updateFlight);
router.delete("/delete/users/:userId", auth, deleteUser);
router.delete("/delete/user-positions/:positionId", auth, deleteUserPosition);
router.delete("/delete/ranks/:rank", auth, deleteRank);
router.delete("/delete/positions/:position", auth, deletePosition);
router.delete("/delete/cats/:cat", auth, deleteCat);
router.delete("/delete/flights/:flight", auth, deleteFlight);

module.exports = router;
