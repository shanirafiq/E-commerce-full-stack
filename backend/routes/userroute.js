const express= require("express");
const router = express.Router();
const {fetchUser,fetchAdmin }= require("../middleware/fetchUser");
const { getAllUsers ,deleteUser,updatedUser,getUserById} = require("../controllers/user");
const upload=require('../middleware/upload');

router.get("/get-all-users",fetchUser,fetchAdmin, getAllUsers);
router.get("/get-user/:id",fetchUser, getUserById);
router.put(
  "/updateduser/:id",
  fetchUser,
  upload.single("avatar"),
  updatedUser
);
router.delete("/delete-user/:id",fetchUser,fetchAdmin, deleteUser);


module.exports=router