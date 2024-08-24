const express = require("express"); // imports the Express module.
const {
  createUser,
  authUser,
  getAllUsers,
  deleteUser,
  adminLogin,
} = require("../controller/user");
const route = express.Router();  //it creates a new instance of an Express router.

route.post("/signup", createUser); 
route.post("/login", authUser);
route.post("/admin/login", adminLogin);
route.get("/all", getAllUsers);
route.delete("/:id", deleteUser);

module.exports = route;
