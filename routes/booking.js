const express = require("express");
const route = express.Router();

const isAuth = require("../middleware/isAuth");
const {
  shippedInventory,
  getAllActiveInventories,
  getAllLoaderOrder,
  completeOrder,
} = require("../controller/booking");

route.put("/shipped", isAuth, shippedInventory);
route.get("/active", isAuth, getAllActiveInventories);
route.put("/complete", isAuth, completeOrder);

module.exports = route;
