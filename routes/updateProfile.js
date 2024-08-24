const express = require("express");
const {
  updateProfile,
  updateAdminPassword,
} = require("../controller/updateProfile");
const {
  updateProfile1,
  updateAdminPassword1,
} = require("../controller/updateProfile1");
const route = express.Router();
route.put("/update1", updateProfile1);
route.put("/update", updateProfile);
route.put("/admin/password/update", updateAdminPassword);

module.exports = route;
