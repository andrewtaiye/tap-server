import express from "express";
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createUser,
  login,
  updatePassword,
  deleteUser,
  logout,
} = require("../controllers/userController");

router.put("/create", createUser);
router.post("/login", login);
router.patch("/update/:userId", auth, updatePassword);
router.delete("/delete/:userId", auth, deleteUser);
router.post("/logout", logout);

module.exports = router;
