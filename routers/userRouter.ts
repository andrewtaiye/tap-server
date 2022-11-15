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
router.patch("/update/:user_id", auth, updatePassword);
router.delete("/delete/:user_id", auth, deleteUser);
router.post("/logout", logout);

module.exports = router;
