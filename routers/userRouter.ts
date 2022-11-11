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
router.patch("/update/:userId", updatePassword);
router.delete("/delete/:userId", deleteUser);

module.exports = router;
