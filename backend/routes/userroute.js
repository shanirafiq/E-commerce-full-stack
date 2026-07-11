const express = require("express");
const router = express.Router();
const { fetchUser, fetchAdmin } = require("../middleware/fetchUser");
const {
  getAllUsers,
  deleteUser,
  updatedUser,
  getUserById,
  toggleBlockUser,
  getUserStats,
  changeUserRole,
} = require("../controllers/user");
const upload = require("../middleware/upload");

router.get("/get-all-users", fetchUser, fetchAdmin, getAllUsers);
router.get("/get-user/:id", fetchUser, getUserById);
router.get("/stats", fetchUser, getUserStats);
router.put("/updateduser/:id", fetchUser, upload.single("avatar"), updatedUser);
router.delete("/delete-user/:id", fetchUser, fetchAdmin, deleteUser);
router.patch("/toggle-block/:id", fetchUser, fetchAdmin, toggleBlockUser);
router.patch("/change-role/:id", fetchUser, fetchAdmin, changeUserRole);

module.exports = router;
