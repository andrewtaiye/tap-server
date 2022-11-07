import express from "express";
const router = express.Router();
const {
  createUser,
  login,
  updatePassword,
  deleteUser,
} = require("../controllers/userController");

router.put("/create", createUser);
router.post("/login", login);
router.patch("/update", updatePassword);
router.delete("/delete", deleteUser);

module.exports = router;
