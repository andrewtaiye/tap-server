"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
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
router.get("/get/user_positions", auth, getUserPositions);
router.get("/get/ranks", auth, getRanks);
router.get("/get/positions", auth, getPositions);
router.get("/get/cats", auth, getCats);
router.get("/get/flights", auth, getFlights);
router.put("/put/rank", auth, createRank);
router.put("/put/position", auth, createPosition);
router.put("/put/cat", auth, createCat);
router.put("/put/flight", auth, createFlight);
router.patch("/patch/users/:userId", auth, updateUser);
router.patch("/patch/user_positions/:positionId", auth, updateUserPosition);
router.patch("/patch/ranks/:rank", auth, updateRank);
router.patch("/patch/positions/:position", auth, updatePosition);
router.patch("/patch/cats/:cat", auth, updateCat);
router.patch("/patch/flights/:flight", auth, updateFlight);
router.delete("/delete/users/:userId", auth, deleteUser);
router.delete("/delete/user_positions/:positionId", auth, deleteUserPosition);
router.delete("/delete/ranks/:rank", auth, deleteRank);
router.delete("/delete/positions/:position", auth, deletePosition);
router.delete("/delete/cats/:cat", auth, deleteCat);
router.delete("/delete/flights/:flight", auth, deleteFlight);
module.exports = router;
