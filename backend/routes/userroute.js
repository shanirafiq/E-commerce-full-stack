const express= require("express");
const router = express.Router();
const {fetchUser,fetchAdmin }= require("../middleware/fetchUser");
const { getAllUsers ,deleteUser,updatedUser,getUserById} = require("../controllers/user");

router.get("/get-all-users",fetchUser,fetchAdmin, getAllUsers);
router.get("/get-user/:id",fetchUser,fetchAdmin, getUserById);
router.put("/update-user/:id",fetchUser,fetchAdmin, updatedUser);
router.delete("/delete-user/:id",fetchUser,fetchAdmin, deleteUser);


module.exports=router